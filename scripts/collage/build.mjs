// Builds the layers of every collage.
//
//   pnpm collage                 every collage
//   pnpm collage hero            only that one
//   pnpm collage hero --preview  also flatten it to a PNG, to look at it
//
// A collage is a stack of paper pieces. Each piece is made by a recipe
// (scripts/collage/recipes/<collage>.mjs) out of the public-domain prints
// listed in src/content/artwork.json, and is written to
// public/collage/<collage>/<piece>.webp. Where each piece sits is content, not
// build: src/content/collages.json. Several collages can share the pieces of one
// recipe (`set`), as the pages of the notebook do.
//
// Originals are downloaded from Wikimedia Commons into a cache outside the
// repository (ARTWORK_CACHE, or the system temp folder) and never committed.

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as kit from "./kit.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const cacheDir = process.env.ARTWORK_CACHE ?? join(tmpdir(), "portfolio-artwork");
const previewDir = process.env.COLLAGE_PREVIEW ?? join(tmpdir(), "portfolio-collage");
const outDir = join(root, "public/collage");
const sizesPath = join(root, "src/content/collage-files.json");

const USER_AGENT = "portfolio-artwork/1.0 (static site asset script)";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const sources = new Map(
  (await readJson(join(root, "src/content/artwork.json"))).map((s) => [s.id, s]),
);

/** Path of an original in the cache, downloading it the first time. */
async function original(id) {
  const source = sources.get(id);
  if (!source) throw new Error(`"${id}" is not in src/content/artwork.json`);
  const target = join(cacheDir, `${id}.orig`);
  if (existsSync(target)) return target;
  await mkdir(cacheDir, { recursive: true });
  // Commons serves scaled copies in fixed steps only.
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(source.file)}?width=${source.width ?? 1920}`;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
    if (response.ok) {
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
      await wait(1500);
      return target;
    }
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`${id}: HTTP ${response.status} for ${source.file}`);
    }
    await wait(attempt * 5000);
  }
  throw new Error(`${id}: Commons kept refusing the download`);
}

/** What a recipe works with. */
const context = {
  kit,
  /** Loads a print by its id in artwork.json; options as in kit.load. */
  src: async (id, options) => kit.load(await original(id), options),
};

async function flatten(id, placement, sizes) {
  const set = placement.set ?? id;
  const W = placement.ratio < 1.2 ? 1000 : 1500;
  const H = Math.round(W / placement.ratio);
  const canvas = kit.blank(W, H, placement.ground ?? [244, 242, 236], 255);
  for (const layer of placement.layers) {
    const file = join(outDir, set, `${layer.id}.webp`);
    if (!sizes[`${set}/${layer.id}`]) continue;
    let piece = await kit.loadAlpha(file, Math.max(8, Math.round((layer.w / 100) * W)));
    const before = { w: piece.w, h: piece.h };
    if (layer.r) piece = await kit.rotate(piece, layer.r);
    const x = (layer.x / 100) * W - (piece.w - before.w) / 2;
    const y = (layer.y / 100) * H - (piece.h - before.h) / 2;
    if (layer.shadow !== 0) kit.place(canvas, await kit.shadow(piece, 7), x + 3, y + 9, 0.3);
    kit.place(canvas, piece, x, y);
  }
  await mkdir(previewDir, { recursive: true });
  const target = join(previewDir, `${id}.png`);
  await kit.savePng(canvas, target);
  return target;
}

const args = process.argv.slice(2);
const preview = args.includes("--preview");
const flattenOnly = args.includes("--flatten");
const wanted = args.filter((arg) => !arg.startsWith("--"));

const recipeFiles = (await readdir(join(here, "recipes"))).filter((f) => f.endsWith(".mjs"));
const sizes = existsSync(sizesPath) ? await readJson(sizesPath) : {};
const placements = await readJson(join(root, "src/content/collages.json"));

// The first argument names a recipe, not a collage: say so instead of doing nothing.
const recipeIds = recipeFiles.map((file) => file.replace(/\.mjs$/, ""));
if (wanted.length && !recipeIds.includes(wanted[0])) {
  const set = placements[wanted[0]]?.set;
  throw new Error(
    set
      ? `"${wanted[0]}" takes its pieces from the recipe "${set}": run "pnpm collage ${set}"`
      : `No recipe "${wanted[0]}". Recipes: ${recipeIds.join(", ")}`,
  );
}

for (const file of recipeFiles) {
  const id = file.replace(/\.mjs$/, "");
  // A second argument narrows the build to some pieces: `pnpm collage hero page,scrap`.
  if (wanted.length && wanted[0] !== id) continue;
  const only = wanted[1]?.split(",");
  const recipe = (await import(pathToFileURL(join(here, "recipes", file)).href)).default;
  const unknown = only?.filter((piece) => !(piece in recipe)) ?? [];
  if (unknown.length) throw new Error(`${id} makes no piece ${unknown.join(", ")}`);
  await mkdir(join(outDir, id), { recursive: true });
  if (!flattenOnly) {
    // Pieces the recipe no longer makes leave the folder and the list.
    for (const name of await readdir(join(outDir, id))) {
      const piece = name.replace(/\.webp$/, "");
      if (name.endsWith(".webp") && !(piece in recipe)) {
        await rm(join(outDir, id, name));
        delete sizes[`${id}/${piece}`];
      }
    }
    for (const [piece, make] of Object.entries(recipe)) {
      if (only && !only.includes(piece)) continue;
      const started = Date.now();
      const img = await make(context);
      const bytes = await kit.saveWebp(img, join(outDir, id, `${piece}.webp`));
      sizes[`${id}/${piece}`] = { w: img.w, h: img.h };
      console.log(
        `${id}/${piece}`.padEnd(28),
        `${img.w}×${img.h}`.padEnd(11),
        `${Math.round(bytes / 1024)} KB`.padStart(7),
        `${Date.now() - started} ms`.padStart(9),
      );
    }
    // Pieces whose file is gone leave the list too.
    const sorted = Object.fromEntries(
      Object.entries(sizes)
        .filter(([piece]) => existsSync(join(outDir, `${piece}.webp`)))
        .sort(([a], [b]) => a.localeCompare(b)),
    );
    await writeFile(sizesPath, `${JSON.stringify(sorted, null, 2)}\n`);
  }
  if (preview || flattenOnly) {
    // A collage takes its pieces from the recipe named by `set`, or by its own id.
    for (const [collage, placement] of Object.entries(placements)) {
      if ((placement.set ?? collage) !== id) continue;
      console.log("preview:", await flatten(collage, placement, sizes));
    }
  }
}
