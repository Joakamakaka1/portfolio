/**
 * Model of the notebook, free of React and of the DOM.
 *
 * A notebook is a list of faces in reading order. Face 0 is the cover; every
 * leaf carries two faces, its front (even index) and its back (odd index).
 * `open` counts the leaves that have been turned: 0 is the closed notebook and
 * `open = k` shows the spread made of faces 2k-1 (left) and 2k (right).
 */

export type Face = {
  /** Also the URL fragment that opens the notebook at this face. */
  id: string;
  /** Name read out when the face becomes visible. */
  label: string;
};

/** Number of leaves needed to carry `faceCount` faces. */
export function leafCount(faceCount: number): number {
  return Math.ceil(faceCount / 2);
}

/** Largest valid value of `open`: every leaf that has a back can be turned. */
export function maxOpen(faceCount: number): number {
  return Math.floor(faceCount / 2);
}

export function clampOpen(open: number, faceCount: number): number {
  return Math.min(Math.max(Math.trunc(open), 0), maxOpen(faceCount));
}

/** How many leaves must be turned for a face to be visible. */
export function openFor(faceIndex: number): number {
  return Math.ceil(faceIndex / 2);
}

/** Indices of the faces visible for a given `open`, left to right. */
export function visibleFaces(open: number, faceCount: number): number[] {
  if (open <= 0) return [0];
  return [2 * open - 1, 2 * open].filter((index) => index < faceCount);
}

/** First face of the spread, the one that names it in the URL. */
export function leadFace(open: number): number {
  return open <= 0 ? 0 : 2 * open - 1;
}

/**
 * Face named by a URL fragment, or -1. `aliases` maps extra fragments (a
 * section name such as "proyectos") to face ids.
 */
export function faceFromHash(
  hash: string,
  faces: readonly Face[],
  aliases: Readonly<Record<string, string>> = {},
): number {
  let name = hash.replace(/^#/, "");
  try {
    name = decodeURIComponent(name);
  } catch {
    return -1;
  }
  if (!name) return -1;
  const id = aliases[name] ?? name;
  return faces.findIndex((face) => face.id === id);
}

/** Sentence announced to screen readers when the visible faces change. */
export function describeFaces(indices: readonly number[], faces: readonly Face[]): string {
  const pages = faces.length - 1;
  const visible = indices.filter((index) => index < faces.length);
  if (visible.length === 0) return "";
  if (visible[0] === 0) return `${faces[0].label}. El cuaderno está cerrado.`;
  const names = visible.map((index) => faces[index].label).join(" y ");
  const numbers = visible.join(" y ");
  const noun = visible.length > 1 ? "Páginas" : "Página";
  return `${noun} ${numbers} de ${pages}: ${names}.`;
}
