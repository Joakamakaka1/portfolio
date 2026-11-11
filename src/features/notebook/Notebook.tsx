"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

/** From this width up the notebook is a book; below it is a pager. */
const BOOK_QUERY = "(min-width: 1024px)";

/** One object for "no aliases", so effects that depend on it do not run again on every render. */
const NO_ALIASES: Record<string, string> = {};

const isBook = () => window.matchMedia(BOOK_QUERY).matches;
const prefersStill = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Brings a face of the pager to the middle. Does nothing in book mode. */
function scrollPager(pager: HTMLElement | null, index: number, behavior: ScrollBehavior) {
  const face = pager?.querySelector<HTMLElement>(`[data-face="${index}"]`);
  if (!pager || !face || isBook()) return;
  pager.scrollTo({ left: face.offsetLeft - (pager.clientWidth - face.clientWidth) / 2, behavior });
}

/**
 * Applies a state change at once, inside a view transition where the browser
 * has them, so every page travels between the book and the index instead of
 * jumping. Resolves when the change is in the document.
 */
function morph(change: () => void): Promise<void> {
  if (!document.startViewTransition || prefersStill()) {
    flushSync(change);
    return Promise.resolve();
  }
  return document.startViewTransition(() => flushSync(change)).updateCallbackDone;
}

/**
 * A notebook that opens and turns its pages.
 *
 * The faces arrive already rendered (server components passed as props), so
 * the content is plain HTML and this component only decides which faces are
 * showing. The current face is mirrored in the URL fragment, which makes every
 * page linkable: `/#proyectos` opens the notebook there.
 *
 * It has two views: the book, and an index that lays every page on the desk.
 */
export function Notebook({
  faces,
  aliases = NO_ALIASES,
  label,
}: {
  faces: NotebookFace[];
  aliases?: Record<string, string>;
  label: string;
}) {
  const [current, setCurrent] = useState(0);
  const [index, setIndex] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const book = useMediaQuery(BOOK_QUERY);
  const rootRef = useRef<HTMLElement>(null);
  const pagerRef = useRef<HTMLDivElement>(null);

  const total = faces.length;
  const open = openFor(current);
  const visible = index
    ? faces.map((_, face) => face)
    : book
      ? visibleFaces(open, total)
      : [current];
  const atEnd = book ? open >= maxOpen(total) : current >= total - 1;

  function show(target: number) {
    const next = Math.min(Math.max(target, 0), total - 1);
    setCurrent(next);
    setAnnouncement(describeFaces(isBook() ? visibleFaces(openFor(next), total) : [next], faces));
    const url =
      next === 0 ? window.location.pathname + window.location.search : `#${faces[next].id}`;
    window.history.replaceState(null, "", url);
  }

  function go(target: number) {
    show(target);
    scrollPager(
      pagerRef.current,
      Math.min(Math.max(target, 0), total - 1),
      prefersStill() ? "instant" : "smooth",
    );
  }

  function turn(step: 1 | -1) {
    go(isBook() ? leadFace(clampOpen(open + step, total)) : current + step);
  }

  function openIndex() {
    morph(() => setIndex(true));
    setAnnouncement(`Índice: ${total - 1} páginas.`);
  }

  /** Leaves the index for the book, at the page that was picked. */
  function pick(target: number) {
    morph(() => {
      setIndex(false);
      show(target);
    }).then(() => {
      scrollPager(pagerRef.current, target, "instant");
      rootRef.current?.querySelector<HTMLElement>("[data-nb-next]")?.focus();
    });
  }

  // Follow the URL fragment: on load and whenever a link changes it.
  useEffect(() => {
    function followHash() {
      const target = faceFromHash(window.location.hash, faces, aliases);
      if (target < 0) return;
      setIndex(false);
      setCurrent(target);
      requestAnimationFrame(() => scrollPager(pagerRef.current, target, "instant"));
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [faces, aliases]);

  // Arrow keys turn pages while focus is inside the notebook.
  const keysRef = useRef({ turn, go, index });
  useEffect(() => {
    keysRef.current = { turn, go, index };
  });
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    function onKeyDown(event: KeyboardEvent) {
      const keys = keysRef.current;
      if (keys.index || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowRight") keys.turn(1);
      else if (event.key === "ArrowLeft") keys.turn(-1);
      else if (event.key === "Home") keys.go(0);
      else if (event.key === "End") keys.go(Number.MAX_SAFE_INTEGER);
      else return;
      event.preventDefault();
    }
    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, []);

  // In pager mode the visitor swipes: keep the state in step with the scroll.
  function onPagerScroll() {
    const pager = pagerRef.current;
    if (!pager || index || isBook()) return;
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

  function renderFace(face: number, side: "front" | "back") {
    const { id, label: name, content } = faces[face];
    return (
      <div
        id={id}
        data-face={face}
        data-current={index && face === current}
        className={`nb-face nb-${side}${face === 0 ? " nb-cover" : ""}`}
        style={{ viewTransitionName: `nb-face-${face}` }}
        // Hidden faces stay in the document but out of reach of keyboard and screen readers.
        inert={book && !visible.includes(face)}
      >
        {/* In the index a page is a picture of itself: its content is not reachable, the page is. */}
        <div className="contents" inert={index}>
          {content}
        </div>
        {index ? (
          <button type="button" className="nb-hit" onClick={() => pick(face)}>
            <span className="sr-only">
              {face === 0 ? "Ir a la tapa" : `Ir a la página ${face}: ${name}`}
            </span>
          </button>
        ) : face === 0 ? (
          // A shortcut for the pointer; the "Abrir el cuaderno" control below is the accessible one.
          <button
            type="button"
            className="nb-hit"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => turn(1)}
          />
        ) : null}
        {face === 0 ? null : (
          <span className="nb-folio" aria-hidden="true">
            {face}
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
      data-view={index ? "index" : "book"}
      style={{ "--nb-open": open, "--nb-leaves": leaves.length } as CSSProperties}
    >
      <div className="nb-stage">
        <div ref={pagerRef} className="nb-book" onScroll={onPagerScroll}>
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
      </div>

      <div className="nb-controls">
        {index ? null : (
          <>
            <button
              type="button"
              className="nb-button"
              // Not `disabled`: a disabled button drops the focus, and with it the arrow keys.
              onClick={() => turn(-1)}
              aria-disabled={current === 0}
              aria-label="Página anterior"
            >
              <Icon name="left" />
            </button>
            <span className="nb-count" aria-hidden="true">
              {visible[0] === 0 ? "Tapa" : `${visible.join(" – ")} de ${total - 1}`}
            </span>
            <button
              type="button"
              className="nb-button"
              data-nb-next
              onClick={() => turn(1)}
              aria-disabled={atEnd}
              aria-label={current === 0 ? undefined : "Página siguiente"}
            >
              {current === 0 ? "Abrir el cuaderno" : null}
              <Icon name="right" />
            </button>
          </>
        )}
        <button
          type="button"
          className="nb-button"
          aria-pressed={index}
          onClick={() => (index ? pick(current) : openIndex())}
        >
          <Icon name="grid" />
          <span className={index ? undefined : "sr-only"}>
            {index ? "Volver al cuaderno" : "Ver todas las páginas"}
          </span>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

const ICONS = {
  left: "M11 3 5 9l6 6",
  right: "M7 3l6 6-6 6",
  grid: "M3 3h4.5v4.5H3zM10.5 3H15v4.5h-4.5zM3 10.5h4.5V15H3zM10.5 10.5H15V15h-4.5z",
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d={ICONS[name]}
        stroke="currentColor"
        strokeWidth={name === "grid" ? 1.6 : 2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
