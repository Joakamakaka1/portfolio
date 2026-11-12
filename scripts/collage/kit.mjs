// Paper-collage toolkit: the operations a pair of scissors, a print shop and a
// worn book would do to a picture. Every function takes and returns a plain
// RGBA image ({ w, h, data }), so they chain in any order. Randomness is always
// seeded: the same recipe gives the same file.

import sharp from "sharp";

/** @typedef {{ w: number, h: number, data: Uint8ClampedArray }} Img */
/** @typedef {[number, number, number]} Rgb */

// ---------------------------------------------------------------- randomness

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a, b, t) => a + (b - a) * t;

/** Smooth 1D noise in 0..1. */
export function noise1(seed) {
  const next = rng(seed);
  const table = Float32Array.from({ length: 1024 }, next);
  return (x) => {
    const i = Math.floor(x);
    const f = smooth(x - i);
    return mix(table[i & 1023], table[(i + 1) & 1023], f);
  };
}

/** Smooth 2D noise in 0..1. */
export function noise2(seed) {
  const next = rng(seed);
  const size = 256;
  const table = Float32Array.from({ length: size * size }, next);
  const at = (x, y) => table[(y & 255) * size + (x & 255)];
  return (x, y) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = smooth(x - ix);
    const fy = smooth(y - iy);
    return mix(
      mix(at(ix, iy), at(ix + 1, iy), fx),
      mix(at(ix, iy + 1), at(ix + 1, iy + 1), fx),
      fy,
    );
  };
}

/** Several octaves of a noise function, still in 0..1. */
export function fbm(noise, octaves = 4) {
  return (...p) => {
    let sum = 0;
    let amp = 0.5;
    let norm = 0;
    let scale = 1;
    for (let o = 0; o < octaves; o += 1) {
      sum += amp * noise(...p.map((v) => v * scale + o * 37.1));
      norm += amp;
      amp *= 0.5;
      scale *= 2;
    }
    return sum / norm;
  };
}

// ------------------------------------------------------------------- in / out

export function blank(w, h, color = [0, 0, 0], alpha = 0) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = alpha;
  }
  return { w, h, data };
}

function fromSharp({ data, info }) {
  return {
    w: info.width,
    h: info.height,
    data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.length),
  };
}

const toSharp = (img) =>
  sharp(Buffer.from(img.data.buffer, img.data.byteOffset, img.data.length), {
    raw: { width: img.w, height: img.h, channels: 4 },
  });

/**
 * Reads a picture. `crop` is given in fractions of the original
 * ({ left, top, width, height }); `width` scales the result.
 */
export async function load(path, { crop, width } = {}) {
  let pipeline = sharp(path, { limitInputPixels: false }).rotate();
  if (crop) {
    const meta = await sharp(path, { limitInputPixels: false }).metadata();
    // Rounded separately, the box can end a pixel past the edge; keep it inside.
    const left = Math.round(crop.left * meta.width);
    const top = Math.round(crop.top * meta.height);
    pipeline = pipeline.extract({
      left,
      top,
      width: Math.min(Math.round(crop.width * meta.width), meta.width - left),
      height: Math.min(Math.round(crop.height * meta.height), meta.height - top),
    });
  }
  if (width) pipeline = pipeline.resize({ width });
  return fromSharp(
    await pipeline.removeAlpha().ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  );
}

/** Reads a picture keeping its transparency, scaled to `width`. */
export async function loadAlpha(path, width) {
  let pipeline = sharp(path, { limitInputPixels: false });
  if (width) pipeline = pipeline.resize({ width });
  return fromSharp(await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true }));
}

/** The soft dark shape a piece would cast on the table. */
export async function shadow(img, blur = 8) {
  const out = blank(img.w, img.h, [24, 22, 20], 0);
  for (let i = 3; i < img.data.length; i += 4) out.data[i] = img.data[i];
  return fromSharp(await toSharp(out).blur(blur).raw().toBuffer({ resolveWithObject: true }));
}

/** Draws SVG markup (type, rules, shapes) as an image of the given size. */
export async function svg(markup, w, h) {
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${markup}</svg>`;
  return fromSharp(
    await sharp(Buffer.from(doc))
      .resize(w, h)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true }),
  );
}

export async function resize(img, width) {
  return fromSharp(
    await toSharp(img).resize({ width }).raw().toBuffer({ resolveWithObject: true }),
  );
}

export async function rotate(img, degrees) {
  return fromSharp(
    await toSharp(img)
      .rotate(degrees, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .raw()
      .toBuffer({ resolveWithObject: true }),
  );
}

export async function saveWebp(img, path, { quality = 82 } = {}) {
  const info = await toSharp(img)
    .webp({ quality, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toFile(path);
  return info.size;
}

export async function savePng(img, path) {
  await toSharp(img).png().toFile(path);
}

/** Takes a rectangle out of an image, in pixels. */
export function crop(img, x, y, w, h) {
  if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > img.w || y + h > img.h) {
    throw new RangeError(`crop ${w}×${h} at ${x},${y} falls outside a ${img.w}×${img.h} image`);
  }
  const out = blank(w, h);
  for (let row = 0; row < h; row += 1) {
    const from = ((y + row) * img.w + x) * 4;
    out.data.set(img.data.subarray(from, from + w * 4), row * w * 4);
  }
  return out;
}

/** Lays `src` over `dst` at (x, y), in place. */
export function place(dst, src, x = 0, y = 0, opacity = 1) {
  const ox = Math.round(x);
  const oy = Math.round(y);
  for (let sy = 0; sy < src.h; sy += 1) {
    const dy = oy + sy;
    if (dy < 0 || dy >= dst.h) continue;
    for (let sx = 0; sx < src.w; sx += 1) {
      const dx = ox + sx;
      if (dx < 0 || dx >= dst.w) continue;
      const s = (sy * src.w + sx) * 4;
      const d = (dy * dst.w + dx) * 4;
      const sa = (src.data[s + 3] / 255) * opacity;
      if (sa === 0) continue;
      const da = dst.data[d + 3] / 255;
      const oa = sa + da * (1 - sa);
      for (let c = 0; c < 3; c += 1) {
        dst.data[d + c] = (src.data[s + c] * sa + dst.data[d + c] * da * (1 - sa)) / oa;
      }
      dst.data[d + 3] = oa * 255;
    }
  }
  return dst;
}

// ---------------------------------------------------------------------- masks

function luminance(img) {
  const out = new Float32Array(img.w * img.h);
  for (let i = 0, p = 0; p < out.length; i += 4, p += 1) {
    out[p] = (0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 * img.data[i + 2]) / 255;
  }
  return out;
}

/** Brightness of the paper, taken from the frame of the picture. */
function paperLevel(lum, w, h) {
  const samples = [];
  const step = Math.max(1, Math.floor(w / 300));
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.01));
  for (let x = 0; x < w; x += step) {
    samples.push(lum[band * w + x], lum[(h - 1 - band) * w + x]);
  }
  for (let y = 0; y < h; y += step) {
    samples.push(lum[y * w + band], lum[y * w + w - 1 - band]);
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length * 0.6)];
}

async function blurMask(mask, w, h, sigma) {
  if (sigma < 0.3) return mask;
  const out = await sharp(Buffer.from(mask.buffer, mask.byteOffset, mask.length), {
    raw: { width: w, height: h, channels: 1 },
  })
    .blur(sigma)
    .toColourspace("b-w")
    .raw()
    .toBuffer();
  return new Uint8Array(out.buffer, out.byteOffset, w * h);
}

const threshold = (mask, level) => mask.map((v) => (v > level ? 255 : 0));

/**
 * Cuts the subject of a print out of its page, as scissors would: the paper
 * that touches the frame goes, the paper inside the figure stays.
 *
 * - `ink`     how much darker than the paper a pixel must be to count as drawn
 * - `close`   gaps in the outline narrower than this (px) are treated as closed
 * - `margin`  paper left around the figure (px), like a loose scissor cut
 * - `largest` keep only the biggest piece (drops captions and specks)
 */
export async function cutout(img, { ink = 0.82, close = 5, margin = 0, largest = false } = {}) {
  const { w, h } = img;
  const lum = luminance(img);
  const level = paperLevel(lum, w, h) * ink;
  const drawn = new Uint8Array(w * h);
  for (let p = 0; p < drawn.length; p += 1) drawn[p] = lum[p] < level ? 255 : 0;
  const closed = threshold(await blurMask(drawn, w, h, close), 26);

  // Flood the paper from the frame inwards.
  const outside = new Uint8Array(w * h);
  const stack = [];
  const push = (p) => {
    if (!closed[p] && !outside[p]) {
      outside[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < w; x += 1) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y += 1) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < w * (h - 1)) push(p + w);
  }

  let figure = new Uint8Array(w * h);
  for (let p = 0; p < figure.length; p += 1) figure[p] = outside[p] ? 0 : 255;
  if (largest) figure = keepLargest(figure, w, h);

  // Undo the closing, then leave the margin, then soften the edge by a pixel.
  figure = threshold(await blurMask(figure, w, h, close), 150);
  if (margin > 0) figure = threshold(await blurMask(figure, w, h, margin), 40);
  const alpha = await blurMask(figure, w, h, 0.9);

  const out = { w, h, data: new Uint8ClampedArray(img.data) };
  for (let p = 0; p < alpha.length; p += 1) out.data[p * 4 + 3] = alpha[p];
  return out;
}

function keepLargest(mask, w, h) {
  const label = new Int32Array(w * h);
  let best = 0;
  let bestSize = 0;
  let current = 0;
  const stack = [];
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || label[start]) continue;
    current += 1;
    let size = 0;
    label[start] = current;
    stack.push(start);
    while (stack.length) {
      const p = stack.pop();
      size += 1;
      const x = p % w;
      const visit = (q) => {
        if (mask[q] && !label[q]) {
          label[q] = current;
          stack.push(q);
        }
      };
      if (x > 0) visit(p - 1);
      if (x < w - 1) visit(p + 1);
      if (p >= w) visit(p - w);
      if (p < w * (h - 1)) visit(p + w);
    }
    if (size > bestSize) {
      bestSize = size;
      best = current;
    }
  }
  return mask.map((_, p) => (label[p] === best ? 255 : 0));
}

/** The box that holds everything visible in a cut-out, with some padding. */
export function bounds(img, pad = 2) {
  let x0 = img.w;
  let y0 = img.h;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < img.h; y += 1) {
    for (let x = 0; x < img.w; x += 1) {
      if (img.data[(y * img.w + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < x0) return { x: 0, y: 0, w: img.w, h: img.h };
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(img.w - 1, x1 + pad);
  y1 = Math.min(img.h - 1, y1 + pad);
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

/** Trims the transparent frame around a cut-out. */
export function trim(img, pad = 2) {
  const box = bounds(img, pad);
  return crop(img, box.x, box.y, box.w, box.h);
}

/**
 * Tears the edges of a sheet. Each side takes the depth of the tear in px
 * (0 leaves the side as it is). A torn edge shows the pale core of the paper.
 */
export function tear(
  img,
  { top = 0, right = 0, bottom = 0, left = 0, seed = 1, core = true } = {},
) {
  const { w, h } = img;
  const out = { w, h, data: new Uint8ClampedArray(img.data) };
  const sides = [
    { depth: left, along: (_x, y) => y, across: (x) => x },
    { depth: right, along: (_x, y) => y, across: (x) => w - 1 - x },
    { depth: top, along: (x) => x, across: (_x, y) => y },
    { depth: bottom, along: (x) => x, across: (_x, y) => h - 1 - y },
  ]
    .map((side, i) => ({
      ...side,
      coarse: fbm(noise1(seed * 101 + i * 7), 4),
      fine: noise1(seed * 211 + i * 13),
      fibre: noise1(seed * 307 + i * 17),
    }))
    .filter((side) => side.depth > 0);
  if (!sides.length) return out;

  const speck = noise2(seed * 401);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let alpha = 1;
      let pale = 0;
      for (const side of sides) {
        const t = side.along(x, y);
        const d = side.across(x, y);
        const edge =
          side.depth * (0.25 + 0.75 * side.coarse(t / (side.depth * 3.2))) +
          side.depth * 0.16 * side.fine(t / 5);
        alpha = Math.min(alpha, clamp01(d - edge + 0.5));
        if (core) {
          const band = 2 + side.depth * 0.22 * side.fibre(t / 23);
          const inside = (d - edge) / band;
          if (inside < 1) pale = Math.max(pale, clamp01(1 - inside) ** 0.6);
        }
      }
      const i = (y * w + x) * 4;
      if (pale > 0) {
        const k = pale * (0.72 + 0.28 * speck(x / 2.5, y / 2.5));
        out.data[i] = mix(out.data[i], 247, k);
        out.data[i + 1] = mix(out.data[i + 1], 244, k);
        out.data[i + 2] = mix(out.data[i + 2], 236, k);
      }
      out.data[i + 3] *= alpha;
    }
  }
  return out;
}

/**
 * Tears the top of a strip into a skyline: slow hills of the given height,
 * with the small roughness of torn paper along them.
 */
export function ridge(img, { height = 80, period = 420, rough = 3, seed = 1, core = true } = {}) {
  const { w, h } = img;
  const out = { w, h, data: new Uint8ClampedArray(img.data) };
  const hills = fbm(noise1(seed * 53), 3);
  const fine = fbm(noise1(seed * 59), 2);
  const fibre = noise1(seed * 61);
  const speck = noise2(seed * 67);
  for (let x = 0; x < w; x += 1) {
    const edge = height * (1 - hills(x / period)) + rough * fine(x / 6);
    const band = 3 + 5 * fibre(x / 19);
    for (let y = 0; y < Math.min(h, edge + band + 2); y += 1) {
      const i = (y * w + x) * 4;
      out.data[i + 3] *= clamp01(y - edge + 0.5);
      const inside = (y - edge) / band;
      if (core && inside < 1 && inside > -1) {
        const k = clamp01(1 - inside) ** 0.6 * (0.72 + 0.28 * speck(x / 2.5, y / 2.5));
        out.data[i] = mix(out.data[i], 247, k);
        out.data[i + 1] = mix(out.data[i + 1], 244, k);
        out.data[i + 2] = mix(out.data[i + 2], 236, k);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------- paper

/**
 * A sheet of old paper: grain, cloudy blotches, long fibres, foxing and edges
 * that have darkened with age.
 */
export function paper(
  w,
  h,
  {
    color = [233, 225, 205],
    seed = 1,
    grain = 0.03,
    blotch = 0.05,
    fibre = 0.012,
    edge = 0.07,
    foxing = 0,
  } = {},
) {
  const out = blank(w, h, color, 255);
  const next = rng(seed);
  const cloud = fbm(noise2(seed * 3 + 1), 4);
  const strand = noise2(seed * 5 + 2);
  const spot = fbm(noise2(seed * 7 + 3), 3);
  const reach = Math.min(w, h) * 0.18;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const toEdge = Math.min(x, y, w - 1 - x, h - 1 - y);
      let v = 1;
      v += grain * (next() + next() - 1);
      v += blotch * (cloud(x / 260, y / 260) - 0.5) * 2;
      v += fibre * (strand(x / 70 + cloud(x / 400, y / 90) * 6, y / 2.4) - 0.5) * 2;
      v -= edge * (1 - clamp01(toEdge / reach)) ** 2.2;
      let warm = 0;
      if (foxing > 0) {
        const s = spot(x / 46, y / 46);
        warm = smooth(clamp01((s - 0.56) / 0.26)) * foxing * 0.7;
      }
      const i = (y * w + x) * 4;
      out.data[i] = color[0] * v * (1 - warm * 0.1);
      out.data[i + 1] = color[1] * v * (1 - warm * 0.22);
      out.data[i + 2] = color[2] * v * (1 - warm * 0.42);
    }
  }
  return out;
}

/** Fine grain over whatever is already there, to bind pasted pieces together. */
export function grain(img, { amount = 0.04, seed = 9 } = {}) {
  const next = rng(seed);
  const out = { w: img.w, h: img.h, data: new Uint8ClampedArray(img.data) };
  for (let i = 0; i < out.data.length; i += 4) {
    const v = 1 + amount * (next() + next() - 1);
    out.data[i] *= v;
    out.data[i + 1] *= v;
    out.data[i + 2] *= v;
  }
  return out;
}

// --------------------------------------------------------------------- prints

/** How much ink each pixel of a print carries (0 paper, 1 solid ink). */
function coverage(img, { black = 0.12, white } = {}) {
  const lum = luminance(img);
  const top = white ?? paperLevel(lum, img.w, img.h);
  const out = new Float32Array(lum.length);
  for (let p = 0; p < lum.length; p += 1) out[p] = clamp01((top - lum[p]) / (top - black));
  return out;
}

/** Prints a picture in one ink on a sheet, in place, at (x, y). */
export function print(
  sheet,
  art,
  { ink = [34, 31, 28], x = 0, y = 0, strength = 1, black, white } = {},
) {
  const cover = coverage(art, { black, white });
  const ox = Math.round(x);
  const oy = Math.round(y);
  for (let ay = 0; ay < art.h; ay += 1) {
    const sy = oy + ay;
    if (sy < 0 || sy >= sheet.h) continue;
    for (let ax = 0; ax < art.w; ax += 1) {
      const sx = ox + ax;
      if (sx < 0 || sx >= sheet.w) continue;
      const a = ay * art.w + ax;
      const c = cover[a] * strength * (art.data[a * 4 + 3] / 255);
      if (c <= 0) continue;
      const s = (sy * sheet.w + sx) * 4;
      for (let k = 0; k < 3; k += 1) {
        sheet.data[s + k] = sheet.data[s + k] * (1 - c) + ((sheet.data[s + k] * ink[k]) / 255) * c;
      }
    }
  }
  return sheet;
}

/** Reprints a picture in two colours: an ink for the darks, a tint for the paper. */
export function duotone(
  img,
  { ink = [34, 31, 28], tint = [240, 232, 214], gamma = 1, black, white } = {},
) {
  const cover = coverage(img, { black, white });
  const out = { w: img.w, h: img.h, data: new Uint8ClampedArray(img.data) };
  for (let p = 0; p < cover.length; p += 1) {
    const c = cover[p] ** gamma;
    const i = p * 4;
    out.data[i] = mix(tint[0], ink[0], c);
    out.data[i + 1] = mix(tint[1], ink[1], c);
    out.data[i + 2] = mix(tint[2], ink[2], c);
  }
  return out;
}

/** Reprints a picture through a dot screen, like a newspaper photograph. */
export function halftone(
  img,
  { cell = 7, angle = 22, ink = [34, 31, 28], tint = [240, 232, 214], gain = 1, black, white } = {},
) {
  const { w, h } = img;
  const cover = coverage(img, { black, white });
  const out = { w, h, data: new Uint8ClampedArray(img.data) };
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const u = (x * cos + y * sin) / cell;
      const v = (-x * sin + y * cos) / cell;
      const cu = Math.round(u);
      const cv = Math.round(v);
      const cx = Math.round((cu * cos - cv * sin) * cell);
      const cy = Math.round((cu * sin + cv * cos) * cell);
      const c = cx >= 0 && cx < w && cy >= 0 && cy < h ? cover[cy * w + cx] : 0;
      const radius = Math.sqrt(clamp01(c * gain)) * 0.72;
      const dist = Math.hypot(u - cu, v - cv);
      const dot = clamp01((radius - dist) * cell + 0.5);
      const i = (y * w + x) * 4;
      out.data[i] = mix(tint[0], ink[0], dot);
      out.data[i + 1] = mix(tint[1], ink[1], dot);
      out.data[i + 2] = mix(tint[2], ink[2], dot);
    }
  }
  return out;
}

/**
 * Drags the rows of a picture sideways from a given point on, as a print does
 * when the sheet slips: `from` is where it starts (fraction of the width).
 */
export function slip(img, { from = 0.5, amount = 40, period = 26, seed = 1 } = {}) {
  const { w, h } = img;
  const out = blank(w, h);
  const wave = noise1(seed * 31);
  const start = from * w;
  for (let y = 0; y < h; y += 1) {
    const phase = (y % period) / period;
    const zig = Math.abs(phase * 2 - 1) * 2 - 1;
    const shift = amount * zig * (0.35 + 0.65 * wave(y / (period * 2.3)));
    for (let x = 0; x < w; x += 1) {
      const ramp = clamp01((x - start) / (w * 0.22));
      const sx = Math.round(x - shift * ramp);
      if (sx < 0 || sx >= w) continue;
      const s = (y * w + sx) * 4;
      const d = (y * w + x) * 4;
      out.data[d] = img.data[s];
      out.data[d + 1] = img.data[s + 1];
      out.data[d + 2] = img.data[s + 2];
      out.data[d + 3] = img.data[s + 3];
    }
  }
  return out;
}

/** Keeps the picture only where `mask(x, y)` says so (0..1), for shaped cuts. */
export function shape(img, mask) {
  const out = { w: img.w, h: img.h, data: new Uint8ClampedArray(img.data) };
  for (let y = 0; y < img.h; y += 1) {
    for (let x = 0; x < img.w; x += 1) {
      out.data[(y * img.w + x) * 4 + 3] *= clamp01(mask(x / img.w, y / img.h, x, y));
    }
  }
  return out;
}
