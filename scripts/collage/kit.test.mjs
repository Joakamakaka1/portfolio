// @vitest-environment node
import { describe, expect, it } from "vitest";
import * as kit from "./kit.mjs";

const pixel = (img, x, y) =>
  Array.from(img.data.subarray((y * img.w + x) * 4, (y * img.w + x) * 4 + 4));

/** A white page with a black square drawn on it. */
function page(size = 60, from = 20, to = 40) {
  const img = kit.blank(size, size, [255, 255, 255], 255);
  for (let y = from; y < to; y += 1) {
    for (let x = from; x < to; x += 1) img.data.set([0, 0, 0, 255], (y * size + x) * 4);
  }
  return img;
}

describe("rng", () => {
  it("gives the same sequence for the same seed", () => {
    const a = kit.rng(7);
    const b = kit.rng(7);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays between 0 and 1", () => {
    const next = kit.rng(1);
    for (let i = 0; i < 500; i += 1) {
      const value = next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("duotone", () => {
  it("prints the paper in the tint and the darks in the ink", () => {
    const out = kit.duotone(page(), { ink: [10, 20, 30], tint: [200, 210, 220], black: 0 });
    expect(pixel(out, 2, 2).slice(0, 3)).toEqual([200, 210, 220]);
    expect(pixel(out, 30, 30).slice(0, 3)).toEqual([10, 20, 30]);
  });
});

describe("tear", () => {
  it("removes paper only along the torn side", () => {
    const sheet = kit.blank(120, 80, [200, 190, 170], 255);
    const torn = kit.tear(sheet, { right: 20, seed: 3 });
    expect(pixel(torn, 119, 40)[3]).toBe(0);
    expect(pixel(torn, 0, 40)[3]).toBe(255);
    expect(pixel(torn, 60, 0)[3]).toBe(255);
  });

  it("tears the same way for the same seed", () => {
    const sheet = kit.blank(80, 60, [200, 190, 170], 255);
    expect(kit.tear(sheet, { left: 12, seed: 5 }).data).toEqual(
      kit.tear(sheet, { left: 12, seed: 5 }).data,
    );
  });

  it("leaves the sheet alone when no side is torn", () => {
    const sheet = kit.blank(20, 20, [1, 2, 3], 255);
    expect(kit.tear(sheet).data).toEqual(sheet.data);
  });
});

describe("cutout", () => {
  it("drops the paper around the figure and keeps the figure", async () => {
    const cut = await kit.cutout(page(), { close: 1 });
    expect(pixel(cut, 2, 2)[3]).toBe(0);
    expect(pixel(cut, 30, 30)[3]).toBe(255);
  });

  it("keeps the paper enclosed by the figure", async () => {
    // A black ring: the white inside it is part of the cut-out.
    const img = page(60, 15, 45);
    for (let y = 25; y < 35; y += 1) {
      for (let x = 25; x < 35; x += 1) img.data.set([255, 255, 255, 255], (y * 60 + x) * 4);
    }
    const cut = await kit.cutout(img, { close: 1 });
    expect(pixel(cut, 30, 30)[3]).toBe(255);
  });
});

describe("bounds and trim", () => {
  it("finds the box of what is visible", async () => {
    const cut = await kit.cutout(page(), { close: 1 });
    const box = kit.bounds(cut, 0);
    expect(box.x).toBeGreaterThanOrEqual(17);
    expect(box.x + box.w).toBeLessThanOrEqual(43);
    const trimmed = kit.trim(cut, 0);
    expect([trimmed.w, trimmed.h]).toEqual([box.w, box.h]);
  });
});

describe("ridge", () => {
  it("cuts a skyline out of the top and leaves the bottom whole", () => {
    const strip = kit.blank(200, 100, [80, 120, 90], 255);
    const hill = kit.ridge(strip, { height: 40, period: 80, seed: 2 });
    const top = Array.from({ length: 200 }, (_, x) => pixel(hill, x, 0)[3]);
    expect(top.some((alpha) => alpha === 0)).toBe(true);
    expect(pixel(hill, 100, 99)[3]).toBe(255);
  });
});
