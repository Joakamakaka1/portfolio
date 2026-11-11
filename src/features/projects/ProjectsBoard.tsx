"use client";

import { usePathname } from "next/navigation";
import { type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef } from "react";
import { openProject, projectPath } from "./board";

export type BoardProject = {
  slug: string;
  /** Title of the browser tab while the project is open. */
  title: string;
  /** What the column shows: number, name and picture. */
  card: ReactNode;
  /** What fills the board when the project is open. */
  detail: ReactNode;
};

/** A plain click, as opposed to "open in a new tab" and friends. */
const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/**
 * The projects as columns side by side. Picking one opens it over the whole
 * board; the way back closes it.
 *
 * Which project is open is the URL, nothing else: `/proyectos` is the board
 * and `/proyectos/<slug>` is a project. Both are real pages that render this
 * component, so a link, a reload and the no-JavaScript fallback all work. With
 * JavaScript the links only change the URL in place, which keeps the columns
 * mounted and lets them slide instead of the page being replaced.
 *
 * Cards and details arrive already rendered (server components as props).
 */
export function ProjectsBoard({
  projects,
  base,
  title,
}: {
  projects: BoardProject[];
  /** Path of the board: "/proyectos". */
  base: string;
  /** Title of the browser tab while no project is open. */
  title: string;
}) {
  const pathname = usePathname();
  const open = openProject(
    pathname,
    base,
    projects.map((project) => project.slug),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const shown = useRef(open);

  // When the open project changes, the page behaves as a new page would.
  useEffect(() => {
    if (shown.current === open) return;
    const closed = shown.current;
    shown.current = open;
    document.title = projects.find((project) => project.slug === open)?.title ?? title;
    window.scrollTo({ top: 0, behavior: "instant" });
    const target = open ? `[data-back="${open}"]` : `[data-card="${closed}"]`;
    rootRef.current?.querySelector<HTMLElement>(target)?.focus({ preventScroll: true });
  }, [open, projects, title]);

  function go(event: MouseEvent, slug: string | null) {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (slug !== open) window.history.pushState(null, "", projectPath(base, slug));
  }

  return (
    <div
      ref={rootRef}
      className="board"
      data-open={open ?? undefined}
      style={{ "--board-count": projects.length } as CSSProperties}
    >
      {projects.map((project) => {
        const isOpen = project.slug === open;
        const isAway = open !== null && !isOpen;
        return (
          <article
            key={project.slug}
            className="board-col"
            data-open={isOpen}
            data-away={isAway}
            // A column pushed aside is out of sight: keep it out of reach too.
            inert={isAway}
          >
            <a
              href={projectPath(base, project.slug)}
              className="board-card"
              data-card={project.slug}
              aria-current={isOpen ? "page" : undefined}
              onClick={(event) => go(event, project.slug)}
            >
              {project.card}
            </a>
            <div className="board-detail" hidden={!isOpen}>
              <a
                href={base}
                className="board-back"
                data-back={project.slug}
                onClick={(event) => go(event, null)}
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M8 3 2.5 9 8 15M3 9h13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Volver a los proyectos
              </a>
              {project.detail}
            </div>
          </article>
        );
      })}
    </div>
  );
}
