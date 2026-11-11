import type { CSSProperties } from "react";

/** Path of a four-pointed star centred on the origin; `pinch` narrows the waist. */
export function starPath(radius: number, pinch = 0.16): string {
  const r = radius;
  const k = Number((radius * pinch).toFixed(2));
  return `M0 ${-r} Q${k} ${-k} ${r} 0 Q${k} ${k} 0 ${r} Q${-k} ${k} ${-r} 0 Q${-k} ${-k} 0 ${-r} Z`;
}

/** The four-pointed star that runs through the site. Decorative. */
export function Star({
  size = 24,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="-12 -12 24 24"
      className={className}
      style={style}
    >
      <path d={starPath(12)} fill="currentColor" />
    </svg>
  );
}
