"use client";

import dynamic from "next/dynamic";
import { badgeSvg, toDataUri } from "@/features/cosmos/art";
import { useMascot, useReducedMotion } from "@/features/prefs/use-prefs";

// three.js is heavy: it loads only when this section does, and never on the server.
const Lanyard = dynamic(() => import("@/components/vendor/react-bits/Lanyard"), { ssr: false });

/** The mascot's badge hanging from a lanyard; a still image when motion is reduced. */
export function Badge({ name, role }: { name: string; role: string }) {
  const mascot = useMascot();
  const reducedMotion = useReducedMotion();
  const image = toDataUri(badgeSvg({ mascot, name, role }));

  if (reducedMotion) {
    return (
      // biome-ignore lint/performance/noImgElement: generated data URI, nothing for next/image to optimise
      <img
        src={image}
        alt={`Acreditación de ${name}`}
        width={300}
        height={420}
        className="mx-auto rounded-3xl shadow-xl"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Acreditación de ${name}, colgada de una cinta`}
      className="h-[34rem]"
    >
      <Lanyard
        key={mascot}
        frontImage={image}
        imageFit="cover"
        finish="holographic"
        strapColor="#6b4eff"
        metal="silver"
        size={0.62}
      />
    </div>
  );
}
