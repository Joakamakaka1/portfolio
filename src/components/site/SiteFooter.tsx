import Link from "next/link";
import { Collage } from "@/components/collage/Collage";
import Noise from "@/components/vendor/react-bits/Noise";
import { profile } from "@/content";

const PAGES = [
  { hash: "quien-soy", label: "Historia" },
  { hash: "proyectos", label: "Proyectos" },
  { hash: "contacto", label: "Contacto" },
];

const LINK = "underline-offset-4 hover:underline";

/**
 * Footer: a strip of khaki paper with the ways to reach the author over a
 * landscape made of the same scraps as the rest of the site. It is paper, so it
 * keeps its colour in the dark theme.
 */
export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer relative isolate overflow-hidden bg-[#dedbc6] text-ink">
      <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 px-5 pt-14 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr] lg:pt-16">
        <div className="flex max-w-[34ch] flex-col gap-2">
          <p className="font-serif text-[1.9rem] leading-tight tracking-[-0.015em]">
            {profile.name}
          </p>
          <p className="text-[0.95rem] text-ink-soft">
            {profile.role}. {profile.focus}.
          </p>
        </div>
        <nav aria-label="Páginas del cuaderno">
          <ul className="flex flex-col gap-1.5 text-[0.95rem]">
            {PAGES.map((page) => (
              <li key={page.hash}>
                {home ? (
                  <a href={`#${page.hash}`} className={LINK}>
                    {page.label}
                  </a>
                ) : (
                  <Link href={`/#${page.hash}`} className={LINK}>
                    {page.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link href="/creditos" className={LINK}>
                Créditos de las láminas
              </Link>
            </li>
          </ul>
        </nav>
        <ul className="flex flex-col gap-1.5 text-[0.95rem]">
          <li>
            <a href={profile.links.linkedin.url} className={LINK}>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={profile.links.github.url} className={LINK}>
              GitHub
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} className={`${LINK} break-all`}>
              {profile.email}
            </a>
          </li>
        </ul>
      </div>

      {/* Wider than a phone on purpose: the landscape is cropped, not shrunk to a line. */}
      <div className="mt-10 flex justify-center overflow-hidden">
        <Collage
          id="footer"
          alt="Collage: un paisaje de papeles rasgados, con un globo aerostático, un sol rojo y una hoja que hace de árbol."
          width="max(100vw, 60rem)"
          className="min-w-[60rem] shrink-0"
        />
      </div>
      {/* The grain of a cheap print run. */}
      <Noise opacity={0.07} size={1.2} fps={8} blendMode="multiply" />
    </footer>
  );
}
