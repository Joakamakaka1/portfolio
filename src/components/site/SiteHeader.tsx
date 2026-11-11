import Link from "next/link";
import { profile } from "@/content";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { hash: "quien-soy", label: "Historia" },
  { hash: "proyectos", label: "Proyectos" },
  { hash: "contacto", label: "Contacto" },
];

/**
 * Site header. On the home page the links are plain fragments, so the browser
 * fires `hashchange` and the notebook turns to that page; elsewhere they
 * navigate to the home page first.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  const brand = profile.name;
  const brandClass = "font-semibold tracking-[-0.01em]";

  return (
    <header
      id="top"
      className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8"
    >
      {home ? (
        <a href="#top" className={brandClass}>
          {brand}
        </a>
      ) : (
        <Link href="/" className={brandClass}>
          {brand}
        </Link>
      )}
      <nav aria-label="Principal" className="flex items-center gap-4 text-[0.95rem] sm:gap-7">
        {LINKS.map((link) =>
          home ? (
            <a key={link.hash} href={`#${link.hash}`} className="hover:underline max-sm:hidden">
              {link.label}
            </a>
          ) : (
            <Link key={link.hash} href={`/#${link.hash}`} className="hover:underline max-sm:hidden">
              {link.label}
            </Link>
          ),
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
