"use client";

import { InfiniteSlider } from "@/components/vendor/motion-primitives/infinite-slider";
import CurvedLoop from "@/components/vendor/react-bits/CurvedLoop";
import TrueFocus from "@/components/vendor/react-bits/TrueFocus";
import { useReducedMotion } from "@/features/prefs/use-prefs";

/** Curved marquee between sections. Decorative: the same words appear as text nearby. */
export function WordsLoop({ words }: { words: string[] }) {
  const reducedMotion = useReducedMotion();
  return (
    // The vendor wrapper is as tall as the screen by default; the override keeps it to its text.
    <div aria-hidden="true" className="overflow-hidden py-10 text-foreground [&>div]:min-h-0!">
      <CurvedLoop
        marqueeText={words.join(" ✦ ")}
        separator=" ✦ "
        speed={reducedMotion ? 0 : 1.4}
        curveAmount={220}
        fontSize={64}
        fontWeight={800}
        color="currentColor"
        separatorColor="#e0218a"
        interactive={!reducedMotion}
      />
    </div>
  );
}

/** Section title whose focus moves from word to word. */
export function FocusTitle({ words }: { words: string[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="font-display text-4xl font-bold tracking-tight [font-stretch:85%] sm:text-6xl">
      <TrueFocus
        sentence={words.join(" ")}
        manualMode={reducedMotion}
        blurAmount={reducedMotion ? 0 : 4}
        borderColor="#e0218a"
        glowColor="rgba(224, 33, 138, 0.5)"
        animationDuration={0.6}
        pauseBetweenAnimations={1.2}
      />
    </div>
  );
}

/** Endless row of tools. */
export function ToolsSlider({ tools }: { tools: string[] }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return (
      <ul className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <li key={tool} className="rounded-full border px-4 py-1.5">
            {tool}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <InfiniteSlider gap={12} speed={45} speedOnHover={15}>
      {tools.map((tool) => (
        <span key={tool} className="rounded-full border bg-card/70 px-4 py-1.5 whitespace-nowrap">
          {tool}
        </span>
      ))}
    </InfiniteSlider>
  );
}
