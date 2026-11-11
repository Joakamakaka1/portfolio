import { describe, expect, it } from "vitest";
import { badgeSvg, coverSvg, seededRandom, toDataUri } from "./art";

function parse(svg: string) {
  const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
  expect(doc.querySelector("parsererror")).toBeNull();
  return doc;
}

describe("seededRandom", () => {
  it("repeats the same sequence for the same seed", () => {
    const a = seededRandom("cronista");
    const b = seededRandom("cronista");
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("stays between 0 and 1", () => {
    const random = seededRandom("twochi");
    for (let i = 0; i < 200; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("coverSvg", () => {
  it("is deterministic and well formed", () => {
    expect(coverSvg("cronista", 0)).toBe(coverSvg("cronista", 0));
    expect(coverSvg("cronista", 0)).not.toBe(coverSvg("twochi", 0));
    const doc = parse(coverSvg("cronista", 0));
    expect(doc.querySelectorAll("path").length).toBeGreaterThan(10);
  });

  it("wraps the palette index", () => {
    expect(() => parse(coverSvg("x", 99))).not.toThrow();
  });
});

describe("badgeSvg", () => {
  it("renders either mascot and escapes the text", () => {
    for (const mascot of ["pixel", "soft"] as const) {
      const svg = badgeSvg({ mascot, name: "A & B <c>", role: "Rol" });
      const doc = parse(svg);
      expect(doc.querySelector("text")?.textContent).toBe("A & B <c>");
      expect(svg).not.toContain("var(");
    }
  });
});

describe("toDataUri", () => {
  it("produces an SVG data URI", () => {
    expect(toDataUri("<svg/>")).toBe("data:image/svg+xml;charset=utf-8,%3Csvg%2F%3E");
  });
});
