"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/features/prefs/use-prefs";
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

export type NotebookFace = Face & { content: ReactNode };

export type NotebookTab = {
  /** Id of the face the bookmark opens. */
  face: string;
  label: string;
  /** CSS colour of the bookmark. */
  color: string;
};

/** From this width up the notebook is a book; below it is a pager. */
const BOOK_QUERY = "(min-width: 1024px)";

const isBook = () => window.matchMedia(BOOK_QUERY).matches;

/** Brings a face of the pager to the middle. Does nothing in book mode. */
function scrollPager(pager: HTMLElement | null, index: number, behavior: ScrollBehavior) {
  const face = pager?.querySelector<HTMLElement>(`[data-face="${index}"]`);
  if (!pager || !face || isBook()) return;
  pager.scrollTo({ left: face.offsetLeft - (pager.clientWidth - face.clientWidth) / 2, behavior });
}

/**
 * A notebook that opens and turns its pages.
 *
 * The faces arrive already rendered (server components passed as props), so
 * the content is plain HTML and this component only decides which faces are
 * showing. The current face is mirrored in the URL fragment, which makes every
 * page linkable: `/#proyectos` opens the notebook there.
 */
export function Notebook({
  faces,
  tabs,
  aliases = {},
  label,
}: {
  faces: NotebookFace[];
  tabs: NotebookTab[];
  aliases?: Record<string, string>;
  label: string;
}) {
  const [current, setCurrent] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const book = useMediaQuery(BOOK_QUERY);
  const rootRef = useRef<HTMLElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);

  const total = faces.length;
  const open = openFor(current);
  const visible = book ? visibleFaces(open, total) : [current];
  const atEnd = book ? open >= maxOpen(total) : current >= total - 1;

  function show(index: number) {
    const next = Math.min(Math.max(index, 0), total - 1);
    setCurrent(next);
    setAnnouncement(describeFaces(isBook() ? visibleFaces(openFor(next), total) : [next], faces));
    const url =
      next === 0 ? window.location.pathname + window.location.search : `#${faces[next].id}`;
    window.history.replaceState(null, "", url);
  }

  function go(index: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    show(index);
    scrollPager(
      pagerRef.current,
      Math.min(Math.max(index, 0), total - 1),
      reduced ? "instant" : "smooth",
    );
  }

  function turn(step: 1 | -1) {
    go(isBook() ? leadFace(clampOpen(open + step, total)) : current + step);
  }

  // Follow the URL fragment: on load and whenever a link changes it.
  useEffect(() => {
    function followHash() {
      const index = faceFromHash(window.location.hash, faces, aliases);
      if (index < 0) return;
      setCurrent(index);
      scrollPager(pagerRef.current, index, "instant");
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [faces, aliases]);

  // Arrow keys turn pages while focus is inside the notebook.
  const turnRef = useRef(turn);
  const goRef = useRef(go);
  useEffect(() => {
    turnRef.current = turn;
    goRef.current = go;
  });
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowRight") turnRef.current(1);
      else if (event.key === "ArrowLeft") turnRef.current(-1);
      else if (event.key === "Home") goRef.current(0);
      else if (event.key === "End") goRef.current(Number.MAX_SAFE_INTEGER);
      else return;
      event.preventDefault();
    }
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, []);

  // In pager mode the visitor swipes: keep the state in step with the scroll.
  function onPagerScroll() {
    const pager = pagerRef.current;
    if (!pager || isBook()) return;
    const middle = pager.scrollLeft + pager.clientWidth / 2;
    let nearest = current;
    let distance = Number.POSITIVE_INFINITY;
    for (const face of pager.querySelectorAll<HTMLElement>("[data-face]")) {
      const gap = Math.abs(face.offsetLeft + face.clientWidth / 2 - middle);
      if (gap < distance) {
        distance = gap;
        nearest = Number(face.dataset.face);
      }
    }
    if (nearest !== current) show(nearest);
  }

  const leaves = Array.from({ length: leafCount(total) }, (_, leaf) => leaf);
  // A bookmark covers the faces from its own up to the next bookmark's.
  const tabStarts = tabs.map((tab) => faces.findIndex((face) => face.id === tab.face));
  const isActive = (tab: number) =>
    visible.some((face) => face >= tabStarts[tab] && face < (tabStarts[tab + 1] ?? total));

  function renderFace(index: number, side: "front" | "back") {
    const face = faces[index];
    return (
      <div
        id={face.id}
        data-face={index}
        className={`nb-face nb-${side}${index === 0 ? " nb-cover" : ""}`}
        // Hidden faces stay in the document but out of reach of keyboard and screen readers.
        inert={book && !visible.includes(index)}
      >
        {face.content}
        {index === 0 ? (
          // A shortcut for the pointer; the "Abrir el cuaderno" control below is the accessible one.
          <button
            type="button"
            className="nb-open"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => turn(1)}
          />
        ) : (
          <span className="nb-folio" aria-hidden="true">
            {index}
          </span>
        )}
      </div>
    );
  }

  return (
    <section
      ref={rootRef}
      className="nb"
      aria-label={label}
      aria-roledescription="cuaderno"
      data-open={open}
    >
      <div className="nb-stage">
        <div
          ref={pagerRef}
          className="nb-book"
          style={{ "--nb-leaves": leaves.length } as CSSProperties}
          onScroll={onPagerScroll}
        >
          {leaves.map((leaf) => (
            <div
              key={leaf}
              className="nb-leaf"
              data-flipped={leaf < open}
              data-board={leaf === 0 || leaf === leaves.length - 1}
              style={{ "--nb-i": leaf } as CSSProperties}
            >
              {renderFace(2 * leaf, "front")}
              {2 * leaf + 1 < total ? renderFace(2 * leaf + 1, "back") : null}
            </div>
          ))}
        </div>

        <nav className="nb-tabs" aria-label="Marcadores del cuaderno">
          {tabs.map((tab, index) => (
            <a
              key={tab.face}
              href={`#${tab.face}`}
              className="nb-tab"
              style={{ "--nb-tab": tab.color } as CSSProperties}
              aria-current={isActive(index) ? "true" : undefined}
              // The link still works on its own; this only makes the turn smooth.
              onClick={(event) => {
                event.preventDefault();
                go(tabStarts[index]);
              }}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="nb-controls">
        <button
          type="button"
          className="nb-button"
          // Not `disabled`: a disabled button drops the focus, and with it the arrow keys.
          onClick={() => turn(-1)}
          aria-disabled={current === 0}
          aria-label="Página anterior"
        >
          <Arrow direction="left" />
        </button>
        <span className="nb-count" aria-hidden="true">
          {visible[0] === 0 ? "Tapa" : `${visible.join(" – ")} de ${total - 1}`}
        </span>
        <button
          type="button"
          className="nb-button"
          onClick={() => turn(1)}
          aria-disabled={atEnd}
          aria-label={current === 0 ? undefined : "Página siguiente"}
        >
          {current === 0 ? "Abrir el cuaderno" : null}
          <Arrow direction="right" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d={direction === "left" ? "M11 3 5 9l6 6" : "M7 3l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
