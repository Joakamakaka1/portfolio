/**
 * Visitor preferences (theme and mascot) live on the <html> element so CSS can
 * react to them before React hydrates. `PREFS_INLINE_SCRIPT` runs in <head>
 * and applies the stored values before the first paint.
 */

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const MASCOTS = ["pixel", "soft"] as const;
export type MascotKind = (typeof MASCOTS)[number];

export const DEFAULT_THEME: Theme = "light";
export const DEFAULT_MASCOT: MascotKind = "pixel";

const THEME_KEY = "theme";
const MASCOT_KEY = "mascot";

export const PREFS_INLINE_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.classList.toggle("dark",t==="dark");var m=localStorage.getItem("${MASCOT_KEY}");d.setAttribute("data-mascot",m==="soft"?"soft":"pixel")}catch(e){}})()`;

export function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function readMascot(): MascotKind {
  return document.documentElement.getAttribute("data-mascot") === "soft" ? "soft" : "pixel";
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies to this page.
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  persist(THEME_KEY, theme);
}

export function applyMascot(mascot: MascotKind) {
  document.documentElement.setAttribute("data-mascot", mascot);
  persist(MASCOT_KEY, mascot);
}

/** Subscribes to changes of the preference attributes on <html>. */
export function subscribeToPrefs(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-mascot"],
  });
  return () => observer.disconnect();
}
