import Link from "next/link";
import { profile } from "@/content";

const PAGES = [
  { hash: "quien-soy", label: "Quién soy" },
  { hash: "trayectoria", label: "Trayectoria" },
  { hash: "proyectos", label: "Proyectos" },
  { hash: "laminas", label: "Créditos de las láminas" },
];

/** Footer over a printed landscape: day in the light theme, night in the dark one. */
export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer relative isolate overflow-hidden">
      <Landscape />
      <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-8 px-5 pt-12 pb-[clamp(13rem,30vw,22rem)] sm:grid-cols-[1.5fr_1fr_1fr] sm:px-8">
        <div className="flex max-w-[38ch] flex-col gap-2">
          <p className="font-display text-2xl font-bold">{profile.name}</p>
          <p>{profile.summary}</p>
        </div>
        <nav aria-label="Páginas del cuaderno" className="flex flex-col gap-2">
          <h2 className="font-display font-bold">Cuaderno</h2>
          <ul className="flex flex-col gap-1.5">
            {PAGES.map((page) => (
              <li key={page.hash}>
                {home ? (
                  <a href={`#${page.hash}`} className="hover:underline">
                    {page.label}
                  </a>
                ) : (
                  <Link href={`/#${page.hash}`} className="hover:underline">
                    {page.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2">
          <h2 className="font-display font-bold">Contacto</h2>
          <ul className="flex flex-col gap-1.5">
            <li>
              <a href={profile.links.linkedin.url} className="hover:underline">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.github.url} className="hover:underline">
                GitHub
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="break-all hover:underline">
                {profile.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-0 px-5 py-3 text-sm sm:px-8">
        © {profile.name}. Los grabados son obras de dominio público.
      </p>
    </footer>
  );
}

/** Flat shapes, as in a two-colour print. Decorative. */
function Landscape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 -z-10 h-[clamp(13rem,30vw,22rem)] w-full"
    >
      <g className="footer-stars">
        <circle cx="140" cy="40" r="2" />
        <circle cx="420" cy="78" r="1.5" />
        <circle cx="660" cy="30" r="2.2" />
        <circle cx="905" cy="62" r="1.6" />
        <circle cx="1130" cy="28" r="2" />
        <circle cx="1320" cy="84" r="1.5" />
      </g>
      <path
        fill="var(--f-cloud)"
        d="M0 196c48-34 112-40 168-18 30-52 104-70 168-44 42-18 96-6 122 28 40-10 84 0 106 26l92 6c40-30 98-40 148-22 44-58 132-76 204-40 46-20 104-10 134 22 58-24 126-16 170 16 44-6 88 2 128 24v226H0Z"
      />
      <path
        fill="var(--f-cloud)"
        d="M120 132c24-16 62-18 88-6 28-2 52 8 66 22-52 4-108 2-154-16ZM610 150c18-12 46-14 66-4 20-2 40 6 50 18-38 4-82 2-116-14ZM1150 118c20-14 52-16 74-4 24-2 46 6 58 20-44 4-94 0-132-16Z"
      />
      <path
        fill="var(--f-bush)"
        d="M0 352c26-18 60-20 86-8 22-16 54-18 78-4 26-14 58-12 80 4l46 6c120-4 250-4 372-8 26-18 62-22 90-8 24-18 60-20 86-4 28-16 64-14 88 4 26-16 60-16 84 0 28-18 66-18 92 0 30-16 66-14 90 4 30-14 64-12 88 4 30-10 60-8 80 4v74H0Z"
      />
      <g fill="var(--f-tree)">
        <path d="M222 372h18l-3-76h-12Z" />
        <path d="M231 196c-30 0-50 20-52 44-22 6-36 26-32 48 4 24 28 38 52 34 18 14 46 14 64 0 26 6 52-10 56-36 4-22-10-42-32-48-2-24-24-42-56-42Z" />
      </g>
      <path fill="var(--f-hill)" d="M0 374c236-30 520-24 780-20 240 4 460-4 660-28v94H0Z" />
      <g fill="none" stroke="var(--f-cloud)" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <path d="M520 420c120-34 280-52 470-58" />
        <path d="M700 420c110-28 260-44 430-52" />
        <path d="M900 420c100-22 230-38 380-48" />
        <path d="M1110 420c80-16 180-30 300-40" />
      </g>
    </svg>
  );
}
