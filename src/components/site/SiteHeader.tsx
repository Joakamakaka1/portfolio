import Link from "next/link";
import { profile } from "@/content";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Site header. "Historia" and "Contacto" are places on the home page, so there
 * they are plain fragments and elsewhere they lead back to it; "Proyectos" is
 * a page of its own.
 */
export function SiteHeader({
  home = false,
  wide = false,
}: {
  home?: boolean;
  /** Runs edge to edge instead of keeping to the column of the text pages. */
  wide?: boolean;
}) {
  const brandClass = "font-semibold tracking-[-0.01em]";
  const linkClass = "underline-offset-4 hover:underline max-sm:hidden";

  return (
    <header
      id="top"
      className={cn(
        "relative z-20 flex w-full items-center justify-between gap-4 py-5",
        wide ? "px-[clamp(1rem,2.2vw,2rem)]" : "mx-auto max-w-6xl px-5 sm:px-8",
      )}
    >
      {home ? (
        <a href="#top" className={brandClass}>
          {profile.name}
        </a>
      ) : (
        <Link href="/" className={brandClass}>
          {profile.name}
        </Link>
      )}
      <nav aria-label="Principal" className="flex items-center gap-4 text-[0.95rem] sm:gap-7">
        {home ? (
          <a href="#historia" className={linkClass}>
            Historia
          </a>
        ) : (
          <Link href="/#historia" className={linkClass}>
            Historia
          </Link>
        )}
        <Link href="/proyectos" className="underline-offset-4 hover:underline">
          Proyectos
        </Link>
        <a href="#contacto" className={linkClass}>
          Contacto
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
