import { describe, expect, it } from "vitest";
import {
  clampOpen,
  describeFaces,
  type Face,
  faceFromHash,
  leadFace,
  leafCount,
  maxOpen,
  openFor,
  visibleFaces,
} from "./book";

const faces: Face[] = [
  { id: "tapa", label: "Tapa" },
  { id: "quien-soy", label: "Quién soy" },
  { id: "que-hago", label: "Qué hago" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "estudios", label: "Estudios" },
];

describe("notebook model", () => {
  it("needs one leaf per pair of faces", () => {
    expect(leafCount(5)).toBe(3);
    expect(leafCount(6)).toBe(3);
    expect(maxOpen(5)).toBe(2);
    expect(maxOpen(6)).toBe(3);
  });

  it("keeps `open` inside the notebook", () => {
    expect(clampOpen(-1, 5)).toBe(0);
    expect(clampOpen(1.9, 5)).toBe(1);
    expect(clampOpen(9, 5)).toBe(2);
  });

  it("shows the cover alone and then two faces per spread", () => {
    expect(visibleFaces(0, 5)).toEqual([0]);
    expect(visibleFaces(1, 5)).toEqual([1, 2]);
    expect(visibleFaces(2, 5)).toEqual([3, 4]);
    expect(visibleFaces(3, 6)).toEqual([5]);
  });

  it("turns as many leaves as a face needs", () => {
    for (let index = 0; index < faces.length; index += 1) {
      expect(visibleFaces(openFor(index), faces.length)).toContain(index);
    }
    expect(leadFace(0)).toBe(0);
    expect(leadFace(2)).toBe(3);
  });

  it("finds a face from the URL fragment", () => {
    expect(faceFromHash("#que-hago", faces)).toBe(2);
    expect(faceFromHash("trayectoria", faces)).toBe(3);
    expect(faceFromHash("#formacion", faces, { formacion: "estudios" })).toBe(4);
    expect(faceFromHash("#no-existe", faces)).toBe(-1);
    expect(faceFromHash("", faces)).toBe(-1);
    expect(faceFromHash("#%E0%A4%A", faces)).toBe(-1);
  });

  it("describes what is visible", () => {
    expect(describeFaces([0], faces)).toBe("Tapa. El cuaderno está cerrado.");
    expect(describeFaces([1, 2], faces)).toBe("Páginas 1 y 2 de 4: Quién soy y Qué hago.");
    expect(describeFaces([3], faces)).toBe("Página 3 de 4: Trayectoria.");
    expect(describeFaces([9], faces)).toBe("");
  });
});
