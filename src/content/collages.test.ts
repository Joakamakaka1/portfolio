import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { artwork, collages, profile, projects, story } from ".";

describe("story", () => {
  it("fills the notebook with an even number of pages, so the last leaf has a board behind", () => {
    expect(story.length % 2).toBe(0);
  });

  it("gives every project a page, in the order of the projects", () => {
    expect(story.filter((page) => page.project).map((page) => page.project)).toEqual(
      projects.map((project) => project.slug),
    );
  });

  it("has a collage for every page", () => {
    for (const page of story) expect(collages[page.id], page.id).toBeDefined();
  });

  it("underlines a part of the headline that is really in it", () => {
    expect(profile.headline).toContain(profile.headlineMark);
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
