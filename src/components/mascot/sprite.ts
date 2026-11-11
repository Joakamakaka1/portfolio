/**
 * Pixel-art mascot, drawn on a 16×16 grid. This module has no dependencies so
 * both the React component and build scripts can read the same sprite.
 */

export const MASCOT_STATES = ["idle", "thinking", "reading", "debugging"] as const;
export type MascotState = (typeof MASCOT_STATES)[number];

export const MASCOT_STATE_LABEL: Record<MascotState, string> = {
  idle: "en reposo",
  thinking: "pensando",
  reading: "leyendo",
  debugging: "depurando",
};

export const SPRITE_SIZE = 16;

/** One character per pixel; see `SPRITE_PALETTE` for the legend. */
export const SPRITE_ROWS = [
  "........s.......",
  ".......sss......",
  "........s.......",
  "........o.......",
  "...oooooooooo...",
  "..ohhbbbbbbbbo..",
  "..obvvvvvvvvbo..",
  "..obvvvvvvvvbo..",
  ".dobvvvvvvvvbod.",
  "..obvvvvvvvvbo..",
  "..obvvvvvvvvbo..",
  "..obbbbbbbbddo..",
  "...oooooooooo...",
  "....oo....oo....",
  "...ooo....ooo...",
  "................",
] as const;

export const SPRITE_PALETTE: Record<string, string> = {
  o: "#14161b",
  b: "var(--brand, #f44612)",
  h: "#ffb08f",
  d: "#b8320a",
  v: "#1b2430",
  s: "var(--star, #ffd23f)",
};

export const EYE_COLOR = "#9bf6ff";
export const ALERT_COLOR = "#ff4d4d";
export const PAPER_COLOR = "#ffffff";

export type Rect = { x: number; y: number; width: number; height: number; fill: string };

/** Merges each horizontal run of equal pixels into one rectangle. */
export function spriteRects(rows: readonly string[] = SPRITE_ROWS): Rect[] {
  const rects: Rect[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end += 1;
      const fill = SPRITE_PALETTE[char];
      if (fill) rects.push({ x, y, width: end - x, height: 1, fill });
      x = end;
    }
  });
  return rects;
}

type Face = {
  /** Eyes and mouth, in grid units. */
  eyes: Omit<Rect, "fill">[];
  mouth: Omit<Rect, "fill"> | null;
  /** How the eyes move while the mascot is in this state. */
  eyeMotion: "blink" | "scan" | "none";
};

export const FACES: Record<MascotState, Face> = {
  idle: {
    eyes: [
      { x: 5, y: 7, width: 2, height: 2 },
      { x: 9, y: 7, width: 2, height: 2 },
    ],
    mouth: { x: 7, y: 10, width: 2, height: 1 },
    eyeMotion: "blink",
  },
  thinking: {
    eyes: [
      { x: 6, y: 6, width: 2, height: 2 },
      { x: 10, y: 6, width: 2, height: 2 },
    ],
    mouth: { x: 8, y: 10, width: 1, height: 1 },
    eyeMotion: "none",
  },
  reading: {
    eyes: [
      { x: 5, y: 8, width: 2, height: 1 },
      { x: 9, y: 8, width: 2, height: 1 },
    ],
    mouth: null,
    eyeMotion: "scan",
  },
  debugging: {
    eyes: [
      { x: 5, y: 7, width: 2, height: 2 },
      { x: 9, y: 8, width: 2, height: 1 },
    ],
    mouth: { x: 7, y: 10, width: 3, height: 1 },
    eyeMotion: "none",
  },
};
