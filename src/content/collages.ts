import { z } from "zod";
import files from "./collage-files.json";
import data from "./collages.json";

/**
 * Where each piece of a collage sits. The pieces themselves are built by
 * `scripts/collage/build.mjs`, which also writes their sizes to
 * collage-files.json.
 */
const layerSchema = z.object({
  /** File name of the piece, without extension. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Left edge and width, in % of the collage's width. */
  x: z.number(),
  w: z.number().positive(),
  /** Top edge, in % of the collage's height. */
  y: z.number(),
  /** Rotation in degrees. */
  r: z.number().default(0),
  /** How far the piece shifts with the pointer: 0 is glued down, 3 floats. */
  depth: z.number().min(0).max(4).default(1),
  /** 0 for pieces that lie flat and cast no shadow. */
  shadow: z.number().min(0).max(1).default(1),
});

const collageSchema = z.object({
  /** Recipe the pieces come from, when it is not named like the collage. */
  set: z.string().optional(),
  /** Width divided by height. */
  ratio: z.number().positive(),
  layers: z.array(layerSchema).min(1),
});

const sizes = z.record(z.string(), z.object({ w: z.number(), h: z.number() })).parse(files);

export type CollageLayer = z.infer<typeof layerSchema> & {
  src: string;
  width: number;
  height: number;
};
export type Collage = { id: string; ratio: number; layers: CollageLayer[] };

export const collages: Record<string, Collage> = Object.fromEntries(
  Object.entries(z.record(z.string(), collageSchema).parse(data)).map(([id, collage]) => [
    id,
    {
      id,
      ratio: collage.ratio,
      layers: collage.layers.map((layer) => {
        const piece = `${collage.set ?? id}/${layer.id}`;
        const size = sizes[piece];
        if (!size) throw new Error(`Collage piece "${piece}" has not been built`);
        return { ...layer, src: `/collage/${piece}.webp`, width: size.w, height: size.h };
      }),
    },
  ]),
);

export function getCollage(id: string): Collage {
  const collage = collages[id];
  if (!collage) throw new Error(`Unknown collage "${id}"`);
  return collage;
}
