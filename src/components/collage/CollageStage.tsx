"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";

/** How far, in px, the nearest pieces drift when the pointer reaches an edge. */
const REACH = 9;

const limit = (value: number) => Math.max(-1.4, Math.min(1.4, value));

/**
 * The surface a collage lies on. It follows the pointer and hands its
 * position to the pieces as two CSS variables; each piece moves by its own
 * depth, so the stack reads as paper lying at different heights.
 */
export function CollageStage({
  label,
  intro,
  className,
  style,
  children,
}: {
  label: string;
  intro: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!stage || still || !pointer) return;

    let frame = 0;
    function onMove(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!stage) return;
        const box = stage.getBoundingClientRect();
        const x = ((event.clientX - box.left) / box.width - 0.5) * 2;
        const y = ((event.clientY - box.top) / box.height - 0.5) * 2;
        stage.style.setProperty("--px", (limit(x) * REACH).toFixed(2));
        stage.style.setProperty("--py", (limit(y) * REACH).toFixed(2));
      });
    }
    function onLeave() {
      cancelAnimationFrame(frame);
      stage?.style.setProperty("--px", "0");
      stage?.style.setProperty("--py", "0");
    }
    // The whole window, not the stage: the pieces answer before the pointer arrives.
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={className}
      style={style}
      data-intro={intro}
    >
      {children}
    </div>
  );
}
