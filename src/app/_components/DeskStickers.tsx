"use client";

import { useSyncExternalStore } from "react";
import StickerPeel from "@/components/vendor/react-bits/StickerPeel";
import { useMediaQuery } from "@/features/prefs/use-prefs";

/** Loose cut-outs lying on the desk. Offsets are from the middle of the desk, in px. */
const STICKERS = [
  { src: "/collage/footer/balloon.webp", width: 150, rotate: -9, x: -590, y: -150, peel: 40 },
  { src: "/collage/footer/sun.webp", width: 128, rotate: 0, x: 610, y: 230, peel: 215 },
  { src: "/collage/hero/label.webp", width: 150, rotate: 6, x: -560, y: 290, peel: 150 },
];

let webgl: boolean | undefined;
/** The stickers are drawn with WebGL 2; without it they would be blank boxes. */
function hasWebgl() {
  webgl ??= Boolean(document.createElement("canvas").getContext("webgl2"));
  return webgl;
}
const never = () => () => {};

/**
 * Stickers the visitor can peel, drag and throw around the notebook. They are
 * toys: nothing is said through them, so they only exist where there is room
 * and a pointer to play with.
 */
export function DeskStickers() {
  const room = useMediaQuery("(min-width: 1360px) and (hover: hover) and (pointer: fine)");
  const drawable = useSyncExternalStore(never, hasWebgl, () => false);
  if (!room || !drawable) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {STICKERS.map((sticker) => (
        <StickerPeel
          key={sticker.src}
          imageSrc={sticker.src}
          width={sticker.width}
          rotate={sticker.rotate}
          peelDirection={sticker.peel}
          finish="matte"
          backColor="#efece2"
          shadowIntensity={0.5}
          initialPosition={{ x: sticker.x, y: sticker.y }}
          intro={false}
        />
      ))}
    </div>
  );
}
