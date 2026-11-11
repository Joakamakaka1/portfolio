"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_MASCOT,
  DEFAULT_THEME,
  type MascotKind,
  readMascot,
  readTheme,
  subscribeToPrefs,
  type Theme,
} from "./prefs";

/** Current theme, for components that need it in JavaScript (canvas, WebGL). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToPrefs, readTheme, () => DEFAULT_THEME);
}

/** Current mascot, for components that cannot switch through CSS alone. */
export function useMascot(): MascotKind {
  return useSyncExternalStore(subscribeToPrefs, readMascot, () => DEFAULT_MASCOT);
}

function subscribeToReducedMotion(onChange: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor asked the system for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
