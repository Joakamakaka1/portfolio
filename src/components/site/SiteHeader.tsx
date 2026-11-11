import Link from "next/link";
import { profile } from "@/content";
import { Star } from "./Star";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { hash: "proyectos", label: "Proyectos" },
  { hash: "contacto", label: "Contacto" },
];

/**
 * Site header. On the home page the links are plain fragments, so the browser
 * fires `hashchange` and the notebook turns to that page; elsewhere they
 * navigate to the home page first.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  const brand = (
    <>
      <Star size={18} className="text-vermilion" />
      {profile.name}
    </>
  );
  const brandClass = "flex items-center gap-2 font-display text-lg font-bold";

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-[5vw]">
      {home ? (
        <a href="#tapa" className={brandClass}>
          {brand}
        </a>
      ) : (
        <Link href="/" className={brandClass}>
          {brand}
        </Link>
      )}
      <nav
        aria-label="Principal"
        className="flex items-center gap-4 font-display font-medium sm:gap-6"
      >
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
