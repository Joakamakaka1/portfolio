import Image from "next/image";
import type { CSSProperties } from "react";
import { getArtwork } from "@/content";
import { cn } from "@/lib/utils";
import { ARTWORK_FILES, type ArtworkId } from "./files";

/**
 * One engraving from src/content/artwork.json.
 *
 * Engravings prepared as "ink" are black lines on a transparent background,
 * so they print over whatever colour block sits behind them.
 *
 * `alt` defaults to the work's title, author and year; pass an empty string
 * when the picture only decorates.
 */
export function Cutout({
  id,
  alt,
  sizes = "320px",
  className,
  style,
}: {
  id: ArtworkId;
  alt?: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const work = getArtwork(id);
  const file = ARTWORK_FILES[id];
  const label = alt ?? `${work.title}. ${work.author}, ${work.year}.`;

  return (
    <Image
      src={file}
      alt={label}
      sizes={sizes}
      className={cn("block h-auto w-full", className)}
      style={style}
    />
  );
}
