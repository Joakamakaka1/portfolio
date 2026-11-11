import { Collage } from "@/components/collage/Collage";
import { getCollage, profile } from "@/content";
import { Reading } from "./Reading";

/** Corners of a hexagon of radius `r` centred on (cx, cy), flat side up. */
function hexagon(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner + Math.PI / 6;
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
  }).join(" ");
}

const HEX = 27;
const STEP_X = HEX * Math.sqrt(3);
const STEP_Y = HEX * 1.5;
/** Cells of the lattice as [column, row]; a third value puts a dot of that ink in the cell. */
const CELLS: [number, number, string?][] = [
  [1, 0, "var(--vermilion)"],
  [2, 0],
  [0, 1],
  [1, 1, "var(--foreground)"],
  [1, 2],
  [2, 2, "var(--leaf)"],
  [3, 2],
  [2, 3],
  [3, 3, "var(--foreground)"],
  [4, 3],
  [3, 4, "var(--leaf)"],
  [4, 4],
  [4, 5],
];

/** What is drawn over the plate: a lattice, a few dots and the rules of a measurement. */
function Marks() {
  return (
    <svg className="collage-marks" viewBox="300 0 960 1000" aria-hidden="true">
      <g transform="translate(455 96)" fill="none" stroke="var(--cobalt)" strokeWidth="2.2">
        {CELLS.map(([column, row, dot]) => {
          const cx = column * STEP_X + (row % 2 ? STEP_X / 2 : 0);
          const cy = row * STEP_Y;
          return (
            <g key={`${column}-${row}`}>
              <polygon points={hexagon(cx, cy, HEX)} />
              {dot ? <circle cx={cx} cy={cy} r="6.5" fill={dot} stroke="none" /> : null}
            </g>
          );
        })}
      </g>

      {/* A reading: three short bars per sample, as on a gel. */}
      <g transform="translate(1196 688)">
        {[0, 34, 62, 108].map((y, index) => (
          <g key={y} transform={`translate(0 ${y})`}>
            <rect width="34" height="7" fill={index % 2 ? "var(--vermilion)" : "var(--cobalt)"} />
            <rect y="11" width="34" height="3" fill="var(--leaf)" />
          </g>
        ))}
      </g>

      {/* The scale of the plate. */}
      <g stroke="var(--vermilion)" strokeWidth="2.2" fill="none">
        <path d="M1118 880v68M1106 880h24M1106 948h24" />
      </g>
      <g stroke="var(--leaf)" strokeWidth="2.2" fill="none">
        <path d="M1150 904v44M1140 904h20M1140 948h20" />
      </g>

      <circle cx="330" cy="560" r="7" fill="var(--cobalt)" />
      <circle cx="362" cy="586" r="7" fill="var(--vermilion)" />
      <circle cx="318" cy="604" r="7" fill="var(--foreground)" />
    </svg>
  );
}

export function Hero() {
  const collage = getCollage("hero");
  const layer = (id: string) => collage.layers.find((item) => item.id === id);
  const plate = layer("octopus");
  const read = layer("octopus-read");

  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-x-14 gap-y-8 px-5 pt-2 pb-16 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pb-20">
      <figure className="flex flex-col items-center lg:order-2">
        <Collage
          id="hero"
          alt={profile.plate}
          width="min(38rem, 100vw)"
          intro
          priority
          className="max-w-[min(100%,calc(78svh*0.96))]"
          slots={{
            "octopus-read": null,
            octopus: plate && read ? <Reading plate={plate.src} read={read.src} /> : null,
          }}
        >
          <Marks />
        </Collage>
        <figcaption className="mt-3 max-w-[44ch] text-center text-[0.8rem] text-muted-foreground">
          {profile.plate}
        </figcaption>
      </figure>

      <div className="flex flex-col gap-9 lg:order-1">
        <h1 className="max-w-[13ch] font-serif text-[clamp(2.4rem,4.7vw,4.1rem)] leading-[1.03] tracking-[-0.02em] text-balance">
          {profile.headline}
        </h1>
        <ul className="flex max-w-[40ch] flex-col gap-4">
          {profile.notes.map((note) => (
            <li key={note.title} className="text-[0.95rem] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{note.title}. </span>
              {note.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
