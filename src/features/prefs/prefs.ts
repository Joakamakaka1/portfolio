/**
 * The visitor's theme lives on the <html> element so CSS can react to it
 * before React hydrates. `PREFS_INLINE_SCRIPT` runs in <head> and applies the
 * stored value before the first paint.
 */

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

const THEME_KEY = "theme";

export const PREFS_INLINE_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies to this page.
  }
}

/** Subscribes to theme changes on <html>. */
export function subscribeToPrefs(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
