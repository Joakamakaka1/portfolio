import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getCollage } from "@/content";
import { cn } from "@/lib/utils";
import { CollageStage } from "./CollageStage";

/**
 * A collage: paper pieces stacked in the order of src/content/collages.json.
 *
 * It is one picture to a screen reader (`alt`); the pieces are decoration.
 * `slots` swaps the image of a piece for something else that fills the same
 * place (an interactive piece), and `children` are laid over everything in the
 * collage's own coordinates.
 */
export function Collage({
  id,
  alt,
  width,
  intro = false,
  priority = false,
  slots = {},
  className,
  children,
}: {
  id: string;
  alt: string;
  /** Width of the whole collage on screen, as one CSS length: "min(38rem, 100vw)". */
  width: string;
  /** Lays the pieces down one after another when the page loads. */
  intro?: boolean;
  priority?: boolean;
  slots?: Record<string, ReactNode>;
  className?: string;
  children?: ReactNode;
}) {
  const collage = getCollage(id);
  return (
    <CollageStage
      className={cn("collage", className)}
      style={{ aspectRatio: collage.ratio, "--ratio": collage.ratio } as CSSProperties}
      label={alt}
      intro={intro}
    >
      {collage.layers.map((layer, index) =>
        // A slot set to null leaves the piece out: another slot draws it.
        layer.id in slots && slots[layer.id] == null ? null : (
          <div
            key={layer.id}
            className="collage-piece"
            data-flat={layer.shadow === 0}
            style={
              {
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.w}%`,
                aspectRatio: layer.width / layer.height,
                "--r": `${layer.r}deg`,
                "--d": layer.depth,
                "--i": index,
              } as CSSProperties
            }
          >
            {slots[layer.id] ?? (
              <Image
                src={layer.src}
                alt=""
                width={layer.width}
                height={layer.height}
                sizes={`calc(${width} * ${(layer.w / 100).toFixed(3)})`}
                preload={priority}
                className="block size-full"
              />
            )}
          </div>
        ),
      )}
      {children}
    </CollageStage>
  );
}
