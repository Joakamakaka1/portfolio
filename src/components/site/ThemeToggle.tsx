"use client";

import { applyTheme } from "@/features/prefs/prefs";
import { useTheme } from "@/features/prefs/use-prefs";

/** Switches between the wall by day and the wall by night. */
export function ThemeToggle() {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-pressed={dark}
      onClick={() => applyTheme(dark ? "light" : "dark")}
      className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-current/30 hover:border-current"
    >
      <span className="sr-only">Tema oscuro</span>
      {/* Both icons are rendered and CSS picks one, so the server HTML fits either theme. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 dark:hidden"
        fill="currentColor"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    </button>
  );
}
