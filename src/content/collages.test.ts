import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { artwork, collages, projects, story } from ".";

describe("story", () => {
  it("has a collage for every step", () => {
    for (const step of story) expect(collages[step.id], step.id).toBeDefined();
  });

  it("only links to places inside the site", () => {
    for (const step of story) {
      if (step.link) expect(step.link.href.startsWith("/")).toBe(true);
    }
  });
});

describe("projects", () => {
  it("has a collage for every project", () => {
    for (const project of projects) expect(collages[project.slug], project.slug).toBeDefined();
  });
});

describe("collages", () => {
  it("only places pieces that have been built", () => {
    for (const collage of Object.values(collages)) {
      for (const layer of collage.layers) {
        expect(existsSync(join(process.cwd(), "public", layer.src)), layer.src).toBe(true);
      }
    }
  });

  it("credits every print once", () => {
    const ids = artwork.map((work) => work.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
