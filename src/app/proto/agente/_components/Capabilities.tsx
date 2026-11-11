"use client";

import { useSyncExternalStore } from "react";
import MagicBento from "@/components/vendor/react-bits/MagicBento";
import type { Capability } from "@/content";
import { useTheme } from "@/features/prefs/use-prefs";

const WIDE = "(min-width: 1024px)";
const MEDIUM = "(min-width: 640px)";

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(WIDE), window.matchMedia(MEDIUM)];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

function readColumns(): number {
  if (window.matchMedia(WIDE).matches) return 3;
  return window.matchMedia(MEDIUM).matches ? 2 : 1;
}

/** What I do, as a bento grid. The first area is the widest: it is the core of the job. */
export function Capabilities({ capabilities }: { capabilities: Capability[] }) {
  const theme = useTheme();
  // The grid takes its column count as a prop, so the breakpoints live here.
  const columns = useSyncExternalStore(subscribe, readColumns, () => 3);

  return (
    <MagicBento
      theme={theme}
      columns={columns}
      rowHeight={columns === 1 ? 150 : 190}
      textAutoHide={false}
      clickEffect={false}
      items={capabilities.map((capability, index) => ({
        id: capability.id,
        label: capability.tools.slice(0, 3).join(", "),
        title: capability.title,
        description: capability.description,
        colSpan: index === 0 && columns === 3 ? 2 : 1,
      }))}
    />
  );
}
