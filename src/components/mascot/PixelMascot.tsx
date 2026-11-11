import {
  ALERT_COLOR,
  EYE_COLOR,
  FACES,
  type MascotState,
  PAPER_COLOR,
  SPRITE_SIZE,
  spriteRects,
} from "./sprite";

const BODY = spriteRects();

const EYE_ANIMATION: Record<string, string | undefined> = {
  blink: "mascot-blink 4.2s infinite",
  scan: "mascot-scan 1.4s ease-in-out infinite",
  none: undefined,
};

function Accessory({ state }: { state: MascotState }) {
  if (state === "thinking") {
    return (
      <g fill="currentColor">
        {[
          { x: 11, y: 2 },
          { x: 13, y: 1 },
          { x: 15, y: 0 },
        ].map((dot, index) => (
          <rect
            key={dot.x}
            x={dot.x}
            y={dot.y}
            width={1}
            height={1}
            style={{ animation: `mascot-dot 1.2s ${index * 0.2}s infinite` }}
          />
        ))}
      </g>
    );
  }
  if (state === "reading") {
    return (
      <g>
        <rect x={12} y={10} width={4} height={5} fill="#14161b" />
        <rect x={13} y={11} width={2} height={3} fill={PAPER_COLOR} />
        <rect x={13} y={12} width={2} height={1} fill="#9aa1ad" />
      </g>
    );
  }
  if (state === "debugging") {
    return (
      <g style={{ animation: "mascot-dot 0.9s infinite" }}>
        <rect x={13} y={1} width={2} height={2} fill={ALERT_COLOR} />
        <rect x={12} y={0} width={1} height={1} fill={ALERT_COLOR} />
        <rect x={15} y={0} width={1} height={1} fill={ALERT_COLOR} />
        <rect x={12} y={3} width={1} height={1} fill={ALERT_COLOR} />
        <rect x={15} y={3} width={1} height={1} fill={ALERT_COLOR} />
      </g>
    );
  }
  return null;
}

/** Pixel-art mascot. Decorative: the parent provides the accessible name. */
export function PixelMascot({ state = "idle", size = 96 }: { state?: MascotState; size?: number }) {
  const face = FACES[state];
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={`0 0 ${SPRITE_SIZE} ${SPRITE_SIZE}`}
      shapeRendering="crispEdges"
      style={{ overflow: "visible" }}
    >
      {BODY.map((rect) => (
        <rect key={`${rect.x}-${rect.y}`} {...rect} />
      ))}
      <g
        fill={EYE_COLOR}
        style={{
          animation: EYE_ANIMATION[face.eyeMotion],
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        {face.eyes.map((eye) => (
          <rect key={`${eye.x}-${eye.y}`} {...eye} />
        ))}
      </g>
      {face.mouth ? <rect {...face.mouth} fill={EYE_COLOR} /> : null}
      <Accessory state={state} />
    </svg>
  );
}
