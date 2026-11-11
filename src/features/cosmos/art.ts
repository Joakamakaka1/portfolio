import { starPath } from "@/components/mascot/Star";
import { EYE_COLOR, FACES, type Rect, SPRITE_SIZE, spriteRects } from "@/components/mascot/sprite";
import type { MascotKind } from "@/features/prefs/prefs";

/**
 * Generated artwork for the cosmos prototype: one cover per project and the
 * mascot's badge. Everything is plain SVG text so it can be used as an image
 * source (holographic card, WebGL texture) without shipping image files.
 * The same seed always produces the same cover.
 */

const WIDTH = 600;
const HEIGHT = 840;

export function toDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Small deterministic generator (mulberry32) seeded from a string. */
export function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (const char of seed) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Palette = { sky: [string, string]; ribbons: [string, string, string]; star: string };

export const COVER_PALETTES: Palette[] = [
  { sky: ["#2a0f6b", "#0a0820"], ribbons: ["#ff3da5", "#7b5cff", "#23c4f0"], star: "#ffd23f" },
  { sky: ["#7a1e05", "#1c0a05"], ribbons: ["#ffd23f", "#f44612", "#ff8fb1"], star: "#ffffff" },
  { sky: ["#063a5c", "#04121f"], ribbons: ["#4fd4f5", "#3ed6a0", "#7b5cff"], star: "#ffd23f" },
  { sky: ["#3b1466", "#120722"], ribbons: ["#c9b8ff", "#ff5cb0", "#ffd23f"], star: "#ffffff" },
];

const round = (value: number) => Math.round(value * 10) / 10;

/** Cover art for a project: a night sky crossed by three ribbons, with stars. */
export function coverSvg(seed: string, paletteIndex: number): string {
  const random = seededRandom(seed);
  const palette = COVER_PALETTES[paletteIndex % COVER_PALETTES.length];
  const between = (min: number, max: number) => round(min + random() * (max - min));

  const ribbons = palette.ribbons
    .map((color, index) => {
      const startY = between(HEIGHT * 0.25, HEIGHT * 0.95);
      const endY = between(-40, HEIGHT * 0.55);
      const c1 = `${between(80, 260)} ${between(0, HEIGHT)}`;
      const c2 = `${between(320, 520)} ${between(0, HEIGHT)}`;
      const width = between(46, 110);
      return `<path d="M-60 ${startY} C${c1} ${c2} ${WIDTH + 60} ${endY}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${index === 0 ? 0.95 : 0.8}"/>`;
    })
    .join("");

  const stars = Array.from({ length: 9 }, () => {
    const size = between(6, 22);
    return `<path d="${starPath(size)}" transform="translate(${between(30, WIDTH - 30)} ${between(30, HEIGHT - 30)})" fill="${palette.star}" opacity="${between(0.55, 1)}"/>`;
  }).join("");

  const hero = `<path d="${starPath(90, 0.12)}" transform="translate(${between(180, 420)} ${between(260, 520)})" fill="#ffffff"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><defs><linearGradient id="sky" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${palette.sky[0]}"/><stop offset="1" stop-color="${palette.sky[1]}"/></linearGradient></defs><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)"/>${ribbons}${stars}${hero}</svg>`;
}

/** `var(--token, #hex)` only resolves inside the page; a standalone image needs the hex. */
function resolveFill(fill: string): string {
  return fill.match(/#[0-9a-f]{3,8}/i)?.[0] ?? fill;
}

function rectMarkup(rect: Omit<Rect, "fill">, fill: string): string {
  return `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${fill}"/>`;
}

function pixelMascotMarkup(): string {
  const face = FACES.idle;
  const body = spriteRects()
    .map((rect) => rectMarkup(rect, resolveFill(rect.fill)))
    .join("");
  const eyes = face.eyes.map((eye) => rectMarkup(eye, EYE_COLOR)).join("");
  const mouth = face.mouth ? rectMarkup(face.mouth, EYE_COLOR) : "";
  const scale = 20;
  const offset = (WIDTH - SPRITE_SIZE * scale) / 2;
  return `<g transform="translate(${offset} 150) scale(${scale})" shape-rendering="crispEdges">${body}${eyes}${mouth}</g>`;
}

/** Mirrors the idle pose of SoftMascot.tsx; keep both in sync when the drawing changes. */
function softMascotMarkup(): string {
  const scale = 2.8;
  const offset = (WIDTH - 120 * scale) / 2;
  return `<g transform="translate(${offset} 140) scale(${scale})"><path d="M60 32 V20" stroke="#14161b" stroke-width="4" stroke-linecap="round"/><path d="${starPath(9)}" transform="translate(60 12)" fill="#ffd23f"/><ellipse cx="18" cy="68" rx="7" ry="11" fill="#b8320a"/><ellipse cx="102" cy="68" rx="7" ry="11" fill="#b8320a"/><rect x="38" y="92" width="16" height="12" rx="6" fill="#b8320a"/><rect x="66" y="92" width="16" height="12" rx="6" fill="#b8320a"/><rect x="20" y="30" width="80" height="68" rx="28" fill="#f44612"/><rect x="31" y="42" width="58" height="40" rx="18" fill="#1b2430"/><ellipse cx="48" cy="60" rx="6" ry="8" fill="${EYE_COLOR}"/><ellipse cx="72" cy="60" rx="6" ry="8" fill="${EYE_COLOR}"/><path d="M54 71 q6 5 12 0" fill="none" stroke="${EYE_COLOR}" stroke-width="3" stroke-linecap="round"/></g>`;
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** The mascot's conference-style badge, used as the lanyard card. */
export function badgeSvg(options: { mascot: MascotKind; name: string; role: string }): string {
  const mascot = options.mascot === "soft" ? softMascotMarkup() : pixelMascotMarkup();
  const font = "system-ui, -apple-system, 'Segoe UI', sans-serif";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><rect width="${WIDTH}" height="${HEIGHT}" fill="#f1effb"/><rect width="${WIDTH}" height="110" fill="#15103a"/><rect x="240" y="38" width="120" height="26" rx="13" fill="#f1effb"/><path d="${starPath(26)}" transform="translate(70 600)" fill="#6b4eff"/><path d="${starPath(14)}" transform="translate(530 190)" fill="#e0218a"/><path d="${starPath(18)}" transform="translate(520 560)" fill="#ffd23f"/>${mascot}<text x="300" y="668" text-anchor="middle" font-family="${font}" font-size="46" font-weight="800" fill="#15103a">${escapeXml(options.name)}</text><text x="300" y="718" text-anchor="middle" font-family="${font}" font-size="28" fill="#544d7a">${escapeXml(options.role)}</text><rect y="770" width="${WIDTH}" height="70" fill="#f44612"/></svg>`;
}
