import { describe, expect, it } from "vitest";
import { artwork } from "@/content";
import { ARTWORK_FILES } from "./files";

describe("artwork files", () => {
  it("has one processed image for every registered engraving, and no others", () => {
    expect(Object.keys(ARTWORK_FILES).sort()).toEqual(artwork.map((work) => work.id).sort());
  });
});
