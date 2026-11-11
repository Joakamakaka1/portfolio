// Fetches the public-domain engravings listed in src/content/artwork.json from
// Wikimedia Commons and turns them into the small files the site ships.
//
//   pnpm artwork            download what is missing and (re)build every file
//   pnpm artwork cygnus     only that entry
//
// Originals stay in a cache folder outside the repository (ARTWORK_CACHE, or
// the system temp folder). Only the processed files under src/assets/artwork
// are committed.
//
// Render modes:
//   ink    the print becomes black ink on a transparent background, so CSS can
//          tint it and lay it over a colour block
//   plate  the print is kept as it is (a pasted clipping), only resized

import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src/content/artwork.json");
const outDir = join(root, "src/assets/artwork");
const cacheDir = process.env.ARTWORK_CACHE ?? join(tmpdir(), "portfolio-artwork");

// Commons serves scaled copies in fixed steps; this one is enough for a
// cut-out shown at up to ~550 CSS px on a 2x screen.
const DOWNLOAD_WIDTH = 1920;
const USER_AGENT = "portfolio-artwork/1.0 (static site asset script)";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sourceUrl(file) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${DOWNLOAD_WIDTH}`;
}

async function download(entry) {
  const target = join(cacheDir, `${entry.id}.orig`);
  if (existsSync(target)) return target;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(sourceUrl(entry.file), {
      headers: { "user-agent": USER_AGENT },
    });
    if (response.ok) {
      await writeFile(target, Buffer.from(await response.arrayBuffer()));
      await wait(1500);
      return target;
    }
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`${entry.id}: HTTP ${response.status} for ${entry.file}`);
    }
    await wait(attempt * 5000);
  }
  throw new Error(`${entry.id}: Commons kept refusing the download`);
}

/** Crop given as fractions of the picture: { left, top, width, height }. */
function cropBox(crop, meta) {
  if (!crop) return null;
  return {
    left: Math.round(crop.left * meta.width),
    top: Math.round(crop.top * meta.height),
    width: Math.round(crop.width * meta.width),
    height: Math.round(crop.height * meta.height),
  };
}

async function render(entry, source) {
  const { mode, width, crop, paper = 0.82, ink = 0.18, gamma = 1 } = entry.render;
  const meta = await sharp(source).metadata();
  let image = sharp(source);
  const box = cropBox(crop, meta);
  if (box) image = image.extract(box);
  image = image.resize({ width, withoutEnlargement: true });

  const out = join(outDir, `${entry.id}.webp`);
  if (mode === "plate") {
    await image.webp({ quality: 78 }).toFile(out);
    return out;
  }

  // Ink: stretch the tones so the paper turns white and the lines black, then
  // use the inverted result as the alpha channel of a solid black picture.
  const span = Math.max(paper - ink, 0.05);
  let tones = image
    .greyscale()
    .normalise()
    .linear(1 / span, (-ink / span) * 255);
  if (gamma !== 1) tones = tones.gamma(gamma);
  const grey = await tones.negate().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = grey.info;
  await sharp({ create: { width: w, height: h, channels: 3, background: "#000000" } })
    .joinChannel(grey.data, { raw: { width: w, height: h, channels: 1 } })
    .webp({ quality: 70, alphaQuality: 82, effort: 6 })
    .toFile(out);
  return out;
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const only = process.argv.slice(2);
const entries = only.length ? manifest.filter((entry) => only.includes(entry.id)) : manifest;

await mkdir(cacheDir, { recursive: true });
await mkdir(outDir, { recursive: true });

for (const entry of entries) {
  const source = await download(entry);
  const out = await render(entry, source);
  const { width, height } = await sharp(out).metadata();
  const { size } = await stat(out);
  console.log(`${entry.id}: ${width}x${height}, ${Math.round(size / 1024)} KB`);
}
