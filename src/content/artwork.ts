import { z } from "zod";
import data from "./artwork.json";

/**
 * Engravings used in the collage. Every entry is a public-domain work hosted
 * on Wikimedia Commons; `scripts/artwork.mjs` reads the same file to download
 * and prepare the images, and is the only reader of `render`.
 */
export const artworkSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** File name on Wikimedia Commons, without the "File:" prefix. */
  file: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.string().min(1),
  work: z.string().min(1),
  license: z.enum(["Public domain", "CC0"]),
  render: z.object({
    mode: z.enum(["ink", "plate"]),
    width: z.number().int().positive(),
  }),
});

export type Artwork = z.infer<typeof artworkSchema> & { sourceUrl: string };

export function commonsUrl(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`;
}

export const artwork: Artwork[] = z
  .array(artworkSchema)
  .parse(data)
  .map((entry) => ({ ...entry, sourceUrl: commonsUrl(entry.file) }));

export function getArtwork(id: string): Artwork {
  const entry = artwork.find((item) => item.id === id);
  if (!entry) throw new Error(`Unknown artwork "${id}"`);
  return entry;
}
