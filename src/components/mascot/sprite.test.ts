import { describe, expect, it } from "vitest";
import {
  FACES,
  MASCOT_STATES,
  SPRITE_PALETTE,
  SPRITE_ROWS,
  SPRITE_SIZE,
  spriteRects,
} from "./sprite";

describe("mascot sprite", () => {
  it("is a square grid", () => {
    expect(SPRITE_ROWS).toHaveLength(SPRITE_SIZE);
    for (const row of SPRITE_ROWS) expect(row).toHaveLength(SPRITE_SIZE);
  });

  it("only uses characters from the palette", () => {
    const known = new Set([".", ...Object.keys(SPRITE_PALETTE)]);
    for (const char of SPRITE_ROWS.join("")) expect(known.has(char)).toBe(true);
  });

  it("merges horizontal runs and skips transparent pixels", () => {
    expect(spriteRects(["..oo.b"])).toEqual([
      { x: 2, y: 0, width: 2, height: 1, fill: SPRITE_PALETTE.o },
      { x: 5, y: 0, width: 1, height: 1, fill: SPRITE_PALETTE.b },
    ]);
  });

  it("keeps every face inside the visor", () => {
    for (const state of MASCOT_STATES) {
      const face = FACES[state];
      for (const part of [...face.eyes, ...(face.mouth ? [face.mouth] : [])]) {
        for (let x = part.x; x < part.x + part.width; x += 1) {
          for (let y = part.y; y < part.y + part.height; y += 1) {
            expect(SPRITE_ROWS[y][x], `${state} at ${x},${y}`).toBe("v");
          }
        }
      }
    }
  });
});
