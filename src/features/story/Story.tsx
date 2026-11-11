"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { stepAt } from "./steps";

export type StoryStep = {
  /** Also the URL fragment of the step: `/#ahora` scrolls the story to it. */
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * A story that stays in place while the page scrolls: the stage is pinned to
 * the screen and each stretch of scroll puts the next step on it. The page
 * only moves on once the last step has had its turn.
 *
 * The steps arrive already rendered (server components passed as props). All
 * of them stay in the document, so a screen reader, a search engine and the
 * no-JavaScript fallback read the whole story; this component only decides
 * which one is on show.
 */
export function Story({ steps, label }: { steps: StoryStep[]; label: string }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Follow the scroll. A listener rather than an IntersectionObserver: a jump
  // from above the story to below it crosses no threshold and would be missed.
  useEffect(() => {
    const marks = Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []);
    let frame = 0;
    function measure() {
      frame = 0;
      setActive(
        stepAt(
          marks.map((mark) => mark.getBoundingClientRect().top),
          window.innerHeight / 2,
        ),
      );
    }
    function schedule() {
      frame ||= requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  /** Focus that lands in a step that is not on show brings that step on. */
  function bringOn(index: number) {
    if (index === active) return;
    trackRef.current
      ?.querySelector<HTMLElement>(`[data-step="${index}"]`)
      ?.scrollIntoView({ block: "start" });
  }

  return (
    <section
      id="historia"
      className="story"
      aria-label={label}
      style={{ "--story-steps": steps.length } as CSSProperties}
    >
      <div className="story-stage">
        {steps.map((step, index) => (
          <article
            key={step.id}
            className="story-step"
            data-active={index === active}
            data-past={index < active}
            onFocus={() => bringOn(index)}
          >
            {step.content}
          </article>
        ))}

        <nav className="story-rail" aria-label="Capítulos de la historia">
          <ol>
            {steps.map((step, index) => (
              <li key={step.id}>
                <a href={`#${step.id}`} aria-current={index === active ? "step" : undefined}>
                  <span className="story-rail-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="story-rail-label">{step.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* The scroll itself: one stretch per step, each with the step's anchor. */}
      <div ref={trackRef} className="story-track" aria-hidden="true">
        {steps.map((step, index) => (
          <div key={step.id} id={step.id} data-step={index} className="story-mark" />
        ))}
      </div>
    </section>
  );
}
