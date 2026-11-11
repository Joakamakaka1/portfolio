import { starPath } from "./Star";
import { ALERT_COLOR, EYE_COLOR, type MascotState, PAPER_COLOR } from "./sprite";

const VISOR = "#1b2430";
const SHADE = "#b8320a";

function Eyes({ state }: { state: MascotState }) {
  if (state === "reading") {
    return (
      <g
        fill="none"
        stroke={EYE_COLOR}
        strokeWidth={4}
        strokeLinecap="round"
        style={{ animation: "mascot-scan 1.4s ease-in-out infinite" }}
      >
        <path d="M42 62 q6 5 12 0" />
        <path d="M66 62 q6 5 12 0" />
      </g>
    );
  }
  if (state === "debugging") {
    return (
      <g>
        <ellipse cx={48} cy={60} rx={6.5} ry={8.5} fill={EYE_COLOR} />
        <circle cx={50} cy={57} r={2} fill="#ffffff" />
        <path d="M66 61 h12" stroke={EYE_COLOR} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  }
  const offset = state === "thinking" ? { x: 3, y: -4 } : { x: 0, y: 0 };
  return (
    <g
      transform={`translate(${offset.x} ${offset.y})`}
      style={
        state === "idle"
          ? {
              animation: "mascot-blink 4.2s infinite",
              transformBox: "fill-box",
              transformOrigin: "center",
            }
          : undefined
      }
    >
      <ellipse cx={48} cy={60} rx={6} ry={8} fill={EYE_COLOR} />
      <ellipse cx={72} cy={60} rx={6} ry={8} fill={EYE_COLOR} />
      <circle cx={50} cy={57} r={2} fill="#ffffff" />
      <circle cx={74} cy={57} r={2} fill="#ffffff" />
    </g>
  );
}

function Mouth({ state }: { state: MascotState }) {
  if (state === "reading") return null;
  if (state === "thinking") return <circle cx={61} cy={73} r={2.2} fill={EYE_COLOR} />;
  const d = state === "debugging" ? "M53 73 h14" : "M54 71 q6 5 12 0";
  return <path d={d} fill="none" stroke={EYE_COLOR} strokeWidth={3} strokeLinecap="round" />;
}

function Accessory({ state }: { state: MascotState }) {
  if (state === "thinking") {
    return (
      <g fill="currentColor">
        {[
          { cx: 96, cy: 30, r: 3 },
          { cx: 105, cy: 20, r: 4 },
          { cx: 115, cy: 8, r: 5 },
        ].map((dot, index) => (
          <circle
            key={dot.cx}
            {...dot}
            style={{ animation: `mascot-dot 1.2s ${index * 0.2}s infinite` }}
          />
        ))}
      </g>
    );
  }
  if (state === "reading") {
    return (
      <g transform="rotate(8 100 88)">
        <rect
          x={88}
          y={72}
          width={24}
          height={30}
          rx={4}
          fill={PAPER_COLOR}
          stroke="#14161b"
          strokeWidth={2.5}
        />
        <path
          d="M93 81 h14 M93 87 h14 M93 93 h9"
          stroke="#9aa1ad"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (state === "debugging") {
    return (
      <g style={{ animation: "mascot-dot 0.9s infinite" }}>
        <path
          d="M98 12 l-5 -5 M110 12 l5 -5 M96 20 h-6 M112 20 h6 M98 28 l-5 5 M110 28 l5 5"
          stroke={ALERT_COLOR}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <ellipse cx={104} cy={20} rx={8} ry={10} fill={ALERT_COLOR} />
      </g>
    );
  }
  return null;
}

/** Soft vector mascot. Decorative: the parent provides the accessible name. */
export function SoftMascot({ state = "idle", size = 96 }: { state?: MascotState; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ overflow: "visible" }}
    >
      <path d="M60 32 V20" stroke="#14161b" strokeWidth={4} strokeLinecap="round" />
      <path d={starPath(9)} transform="translate(60 12)" fill="var(--star, #ffd23f)" />
      <ellipse cx={18} cy={68} rx={7} ry={11} fill={SHADE} />
      <ellipse cx={102} cy={68} rx={7} ry={11} fill={SHADE} />
      <rect x={38} y={92} width={16} height={12} rx={6} fill={SHADE} />
      <rect x={66} y={92} width={16} height={12} rx={6} fill={SHADE} />
      <rect x={20} y={30} width={80} height={68} rx={28} fill="var(--brand, #f44612)" />
      <path
        d="M36 38 q8 -5 20 -5"
        fill="none"
        stroke="#ffb08f"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <rect x={31} y={42} width={58} height={40} rx={18} fill={VISOR} />
      <Eyes state={state} />
      <Mouth state={state} />
      <Accessory state={state} />
    </svg>
  );
}
