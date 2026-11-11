import type { ArtworkId } from "@/components/collage/files";

type ProjectArt = {
  art: ArtworkId;
  /** Class of what sits behind the engraving: a colour block or aged paper. */
  block: string;
};

/** Engraving pasted on each project's page and file. */
const PROJECT_ART: Record<string, ProjectArt> = {
  cronista: { art: "printer", block: "bg-peach" },
  "cancelaciones-hotel": { art: "barometer", block: "clipping" },
  twochi: { art: "ursa-minor", block: "clipping" },
  "configuracion-evaluada": { art: "scales", block: "bg-sky" },
};

const DEFAULT_ART: ProjectArt = { art: "moon", block: "bg-mint" };

export function projectArt(slug: string): ProjectArt {
  return PROJECT_ART[slug] ?? DEFAULT_ART;
}
