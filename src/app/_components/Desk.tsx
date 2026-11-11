import type { CSSProperties, ReactNode } from "react";
import { Cutout } from "@/components/collage/Cutout";
import { Star, starPath } from "@/components/site/Star";

/*
 * What lies on the desk around the notebook. All of it is decoration: it is
 * hidden from assistive technology and absent on small screens.
 */

function Piece({
  className,
  rotate,
  away,
  children,
}: {
  className: string;
  rotate: number;
  /** Where the piece slides to when the notebook opens and needs the room. */
  away: [x: string, y: string];
  children: ReactNode;
}) {
  return (
    <div
      className={`desk-piece absolute ${className}`}
      style={{ "--r": `${rotate}deg`, "--dx": away[0], "--dy": away[1] } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function DeskPieces() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      <Comet />
      <Piece
        className="clipping top-[4%] left-[33vw] w-[11vw] p-[0.4vw]"
        rotate={7}
        away={["-27vw", "2vh"]}
      >
        <Cutout id="cygnus" alt="" sizes="15vw" />
      </Piece>
      <Piece
        className="clipping bottom-[5%] left-[41vw] w-[8.5vw] p-[0.3vw]"
        rotate={-9}
        away={["-38vw", "-4vh"]}
      >
        <Cutout id="lyra" alt="" sizes="12vw" />
      </Piece>
      <Piece
        className="clipping right-[2.5vw] bottom-[8%] w-[12vw] p-[0.4vw]"
        rotate={-6}
        away={["7vw", "3vh"]}
      >
        <Cutout id="ursa-minor" alt="" sizes="15vw" />
      </Piece>
      <Star className="absolute top-[16%] left-[27vw] size-[2.2vw] text-vermilion" />
      <Star className="absolute right-[7vw] top-[30%] size-[1.5vw] text-cobalt dark:text-star" />
      <Star className="absolute top-[72%] left-[30vw] size-[1.3vw] text-leaf" />
    </div>
  );
}

/**
 * A comet whose tail is a bundle of colour ribbons. Each ribbon is a filled
 * shape that starts wide at the edge of the desk and thins out towards the
 * head; where two overlap in the light theme the inks mix, as in a print.
 */
function Comet() {
  const head = "860 262";
  const ribbons = [
    {
      from: 4,
      to: 58,
      bend: [250, -18, 560, 96],
      back: [600, 150, 260, 44],
      color: "var(--cobalt)",
    },
    {
      from: 44,
      to: 82,
      bend: [230, 66, 600, 78],
      back: [560, 196, 240, 96],
      color: "var(--peach)",
    },
    {
      from: 70,
      to: 118,
      bend: [280, 40, 520, 190],
      back: [610, 190, 250, 150],
      color: "var(--vermilion)",
    },
    {
      from: 108,
      to: 140,
      bend: [240, 150, 640, 150],
      back: [580, 250, 260, 168],
      color: "var(--mint)",
    },
    {
      from: 128,
      to: 186,
      bend: [260, 118, 560, 262],
      back: [620, 250, 250, 232],
      color: "var(--star)",
    },
    {
      from: 176,
      to: 206,
      bend: [250, 226, 620, 226],
      back: [600, 300, 270, 236],
      color: "var(--sky)",
    },
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 900 320"
      className="desk-comet absolute top-[-3%] left-0 w-[50vw]"
    >
      {ribbons.map((ribbon) => (
        <path
          key={ribbon.color}
          fill={ribbon.color}
          className="mix-blend-multiply dark:mix-blend-normal"
          d={`M-20 ${ribbon.from} C${ribbon.bend[0]} ${ribbon.bend[1]} ${ribbon.bend[2]} ${ribbon.bend[3]} ${head} C${ribbon.back[0]} ${ribbon.back[1]} ${ribbon.back[2]} ${ribbon.back[3]} -20 ${ribbon.to}Z`}
        />
      ))}
      <path
        fill="var(--star)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
        transform="translate(858 262) rotate(18)"
        d={starPath(30)}
      />
    </svg>
  );
}

/** The night sky that shows through the desk in the dark theme. */
export function NightSky() {
  const stars = [
    ["8%", "18%", 1.1],
    ["21%", "64%", 0.8],
    ["47%", "9%", 0.9],
    ["63%", "82%", 1.2],
    ["78%", "14%", 0.8],
    ["92%", "52%", 1],
  ] as const;
  return (
    <div
      aria-hidden="true"
      className="desk-night pointer-events-none absolute inset-0 hidden dark:block"
    >
      {stars.map(([left, top, scale], index) => (
        <Star
          key={left}
          className="absolute size-4 text-star motion-safe:animate-[star-twinkle_5s_ease-in-out_infinite]"
          style={{ left, top, scale: String(scale), animationDelay: `${index * 0.8}s` }}
        />
      ))}
    </div>
  );
}
