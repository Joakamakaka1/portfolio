"use client";

import Image from "next/image";
import HalftoneReveal from "@/components/vendor/react-bits/HalftoneReveal";

/**
 * The print of a project, shown as a coarse halftone that the pointer develops
 * into the engraving: looking closely is the point of every project here.
 *
 * The plain image sits underneath, so the picture is there without WebGL.
 */
export function Plate({
  src,
  width,
  height,
  alt,
  ink,
  paper,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** CSS colours of the ink and of the paper it is printed on. */
  ink: string;
  paper: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: width / height, backgroundColor: paper }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes="(min-width: 1024px) 22rem, 90vw"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0">
        <HalftoneReveal
          src={src}
          fit="cover"
          mode="mono"
          shape="dot"
          cellSize={4.6}
          angle={24}
          inkColor={ink}
          paperColor={paper}
          contrast={1.05}
          roughness={0.35}
          revealRadius={0.3}
          softness={0.5}
          linger={1.6}
          wander
        />
      </div>
    </div>
  );
}
