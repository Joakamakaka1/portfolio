/**
 * The rules of the projects board, with no React and no DOM.
 *
 * The board lives at one base path. That path alone shows every project as a
 * column; the path of a project (`<base>/<slug>`) shows that project opened
 * over the whole board.
 */

/** The project a path opens, or `null` when the path shows the whole board. */
export function openProject(pathname: string, base: string, slugs: string[]): string | null {
  const path = pathname.replace(/\/+$/, "");
  if (!path.startsWith(`${base}/`)) return null;
  const slug = path.slice(base.length + 1);
  return slugs.includes(slug) ? slug : null;
}

/** The path that opens a project, or the board itself for `null`. */
export function projectPath(base: string, slug: string | null): string {
  return slug ? `${base}/${slug}` : base;
}

/** "01", "02"… the number a column carries. */
export function columnNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
