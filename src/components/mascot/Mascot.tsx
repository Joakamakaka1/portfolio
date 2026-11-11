import { cn } from "@/lib/utils";
import { PixelMascot } from "./PixelMascot";
import { SoftMascot } from "./SoftMascot";
import { MASCOT_STATE_LABEL, type MascotState } from "./sprite";

/**
 * The site mascot. Renders both drawings and lets CSS show the one the visitor
 * chose (see `.mascot-pixel` / `.mascot-soft` in globals.css), so the markup is
 * identical on the server and in the browser.
 */
export function Mascot({
  state = "idle",
  size = 96,
  decorative = false,
  className,
}: {
  state?: MascotState;
  size?: number;
  /** Hide it from assistive technology when nearby text already says the same. */
  decorative?: boolean;
  className?: string;
}) {
  const drawings = (
    <>
      <span className="mascot-pixel">
        <PixelMascot state={state} size={size} />
      </span>
      <span className="mascot-soft">
        <SoftMascot state={state} size={size} />
      </span>
    </>
  );
  const classes = cn("inline-block shrink-0 leading-none", className);
  const style = { width: size, height: size };

  if (decorative) {
    return (
      <span aria-hidden="true" className={classes} style={style}>
        {drawings}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={`Mascota ${MASCOT_STATE_LABEL[state]}`}
      className={classes}
      style={style}
    >
      {drawings}
    </span>
  );
}
