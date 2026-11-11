"use client";

import Link from "next/link";
import { applyMascot, applyTheme, type MascotKind, type Theme } from "@/features/prefs/prefs";
import { useMascot, useTheme } from "@/features/prefs/use-prefs";
import { cn } from "@/lib/utils";

type Prototype = "agente" | "cosmos";

const PROTOTYPES: { id: Prototype; label: string }[] = [
  { id: "agente", label: "A · Agente" },
  { id: "cosmos", label: "B · Cosmos" },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
];

const MASCOT_OPTIONS: { value: MascotKind; label: string }[] = [
  { value: "pixel", label: "Pixel" },
  { value: "soft", label: "Suave" },
];

const itemClass =
  "rounded-full px-3 py-1.5 text-[13px] font-medium leading-none text-neutral-300 transition-colors hover:text-white aria-[current=page]:bg-white aria-[current=page]:text-neutral-950 aria-pressed:bg-white aria-pressed:text-neutral-950";

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={itemClass}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}

/**
 * Floating controls that exist only while two prototypes are being compared:
 * switch prototype, theme and mascot. Removed once a direction is chosen.
 */
export function PrototypeBar({ current }: { current: Prototype }) {
  const theme = useTheme();
  const mascot = useMascot();

  return (
    <aside
      aria-label="Opciones del prototipo"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-x-3 gap-y-1",
        "rounded-3xl bg-neutral-950/95 p-1.5 shadow-lg ring-1 ring-white/15 backdrop-blur",
      )}
    >
      <nav aria-label="Prototipos" className="flex items-center gap-1">
        {PROTOTYPES.map((prototype) => (
          <Link
            key={prototype.id}
            href={`/proto/${prototype.id}`}
            aria-current={prototype.id === current ? "page" : undefined}
            className={itemClass}
          >
            {prototype.label}
          </Link>
        ))}
      </nav>
      <span aria-hidden="true" className="hidden h-5 w-px bg-white/20 sm:block" />
      <Segmented legend="Tema" options={THEME_OPTIONS} value={theme} onChange={applyTheme} />
      <span aria-hidden="true" className="hidden h-5 w-px bg-white/20 sm:block" />
      <Segmented legend="Mascota" options={MASCOT_OPTIONS} value={mascot} onChange={applyMascot} />
    </aside>
  );
}
