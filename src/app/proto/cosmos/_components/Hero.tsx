"use client";

import dynamic from "next/dynamic";
import { Mascot } from "@/components/mascot/Mascot";
import { Star } from "@/components/mascot/Star";
import CircularText from "@/components/vendor/react-bits/CircularText";
import SplitText from "@/components/vendor/react-bits/SplitText";
import StarBorder from "@/components/vendor/react-bits/StarBorder";
import { useReducedMotion, useTheme } from "@/features/prefs/use-prefs";

// WebGL and canvas effects never render on the server and load after the text.
const Silk = dynamic(() => import("@/components/vendor/react-bits/Silk"), { ssr: false });
const Ribbons = dynamic(() => import("@/components/vendor/react-bits/Ribbons"), { ssr: false });

const RIBBON_COLORS = ["#ff3da5", "#7b5cff", "#23c4f0", "#ffd23f"];

export function Hero({ name, lead, ring }: { name: string; lead: string; ring: string }) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const dark = theme === "dark";

  return (
    <section
      aria-label="Presentación"
      className="relative isolate flex min-h-[min(100dvh,60rem)] flex-col justify-end overflow-hidden px-5 pt-28 pb-14 sm:px-10 lg:px-16"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Silk
          lightMode={!dark}
          color={dark ? "#5b3fd9" : "#b7a6ff"}
          sheenColor={dark ? "#ff5cb0" : "#ffffff"}
          speed={reducedMotion ? 0 : 3}
          paused={reducedMotion}
          scale={1.1}
          noiseIntensity={0.6}
        />
      </div>
      {/* Keeps the text readable over the brightest part of the silk. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/60 to-transparent"
      />
      {reducedMotion ? null : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Ribbons colors={RIBBON_COLORS} thickness={22} length={1.1} fade opacity={0.85} />
        </div>
      )}

      <div className="absolute top-24 right-5 sm:right-10 lg:top-28 lg:right-16">
        <CircularText text={ring} size={190} fontSize={15} spinDuration={26} color="currentColor">
          <span style={{ animation: "mascot-float 5s ease-in-out infinite" }}>
            <Mascot size={92} decorative />
          </span>
        </CircularText>
      </div>

      <div className="flex max-w-[70rem] flex-col gap-7">
        <Star
          size={44}
          className="text-brand"
          style={{ animation: "star-twinkle 3.2s infinite" }}
        />
        <SplitText
          text={name}
          tag="h1"
          trigger="load"
          splitType="chars"
          effect="rise"
          textAlign="left"
          className="font-display text-[clamp(3.6rem,13vw,12rem)] leading-[0.86] font-extrabold tracking-[-0.035em] [font-stretch:75%]"
        />
        <p className="max-w-[46ch] text-xl leading-snug sm:text-2xl">{lead}</p>
        <div className="flex flex-wrap items-center gap-5">
          <StarBorder
            as="a"
            href="#proyectos"
            theme={theme}
            color="#ff3da5"
            trailColor="#7b5cff"
            radius={999}
            className="font-semibold"
          >
            Ver los proyectos
          </StarBorder>
          <a
            href="#contacto"
            className="font-semibold underline decoration-magenta decoration-2 underline-offset-4"
          >
            Hablar conmigo
          </a>
        </div>
      </div>
    </section>
  );
}
