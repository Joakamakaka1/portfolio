import Link from "next/link";
import { Collage } from "@/components/collage/Collage";
import Noise from "@/components/vendor/react-bits/Noise";
import { profile } from "@/content";

const LINK = "underline-offset-4 hover:underline";

/**
 * Footer: a landscape made of the same scraps as the rest of the site, with
 * the ways to reach the author set in its sky, between the clouds and the
 * balloon. It is paper, so it keeps its colours in the dark theme.
 *
 * On narrow screens the sky is too small to hold the text, so the text comes
 * first and the landscape closes the page under it.
 */
export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer
      id="contacto"
      className="site-footer relative isolate overflow-hidden bg-[#dedbc6] text-ink"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-x-10 gap-y-8 px-5 pt-12 sm:px-8 lg:absolute lg:inset-x-0 lg:top-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,2fr)] lg:pt-[clamp(2.5rem,5.5vw,4.75rem)]">
        <div className="flex max-w-[30ch] flex-col gap-2">
          <p className="font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.015em]">
            {profile.name}
          </p>
          <p className="text-[0.95rem] text-ink-soft">
            {profile.role}. {profile.focus}.
          </p>
        </div>

        {/* On wide screens this column is left empty: the balloon flies through it. */}
        <span className="max-lg:hidden" aria-hidden="true" />

        <nav aria-label="Secciones del sitio">
          <ul className="flex flex-col gap-1.5 text-[0.95rem]">
            <li>
              {home ? (
                <a href="#historia" className={LINK}>
                  Historia
                </a>
              ) : (
                <Link href="/#historia" className={LINK}>
                  Historia
                </Link>
              )}
            </li>
            <li>
              <Link href="/proyectos" className={LINK}>
                Proyectos
              </Link>
            </li>
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
            <a href={`mailto:${profile.email}`} className={LINK}>
              Correo
            </a>
          </li>
        </ul>
      </div>

      {/* Wider than a phone on purpose: the landscape is cropped, not shrunk to a line. */}
      <div className="flex justify-center overflow-hidden max-lg:mt-2">
        <Collage
          id="footer"
          alt="Collage: un paisaje de colinas de papel jaspeado, con un globo aerostático, nubes, un sol rojo y una hoja que hace de árbol."
          width="max(100vw, 60rem)"
          className="min-w-[60rem] shrink-0"
        />
      </div>
      {/* The grain of a cheap print run. */}
      <Noise opacity={0.07} size={1.2} fps={8} blendMode="multiply" />
    </footer>
  );
}
