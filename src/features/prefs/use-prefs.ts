"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, readTheme, subscribeToPrefs, type Theme } from "./prefs";

/** Current theme, for components that need it in JavaScript. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToPrefs, readTheme, () => DEFAULT_THEME);
}

/** Tracks a media query; `false` on the server and until hydration. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the visitor asked the system for less motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
