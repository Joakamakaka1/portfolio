import type { StaticImageData } from "next/image";
import barometer from "@/assets/artwork/barometer.webp";
import cygnus from "@/assets/artwork/cygnus.webp";
import flammarion from "@/assets/artwork/flammarion.webp";
import jupiter from "@/assets/artwork/jupiter.webp";
import lyra from "@/assets/artwork/lyra.webp";
import microscope from "@/assets/artwork/microscope.webp";
import moon from "@/assets/artwork/moon.webp";
import pigeons from "@/assets/artwork/pigeons.webp";
import printer from "@/assets/artwork/printer.webp";
import scales from "@/assets/artwork/scales.webp";
import turk from "@/assets/artwork/turk.webp";
import ursaMinor from "@/assets/artwork/ursa-minor.webp";

/** Processed image of every entry in src/content/artwork.json, by id. */
export const ARTWORK_FILES = {
  cygnus,
  lyra,
  "ursa-minor": ursaMinor,
  flammarion,
  moon,
  turk,
  microscope,
  jupiter,
  pigeons,
  printer,
  barometer,
  scales,
} satisfies Record<string, StaticImageData>;

export type ArtworkId = keyof typeof ARTWORK_FILES;
