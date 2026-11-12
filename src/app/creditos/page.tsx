import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { artwork } from "@/content";

export const metadata: Metadata = {
  title: "Créditos de las láminas",
  description: "Los grabados de dominio público con los que están hechos los collages del sitio.",
};

export default function CreditsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-24 sm:px-8">
        <h1 className="max-w-[18ch] font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
          Créditos de las láminas
        </h1>
        <p className="mt-6 max-w-[56ch] font-serif text-[1.25rem] leading-[1.45]">
          Los collages están hechos con recortes de {artwork.length} obras antiguas, todas de
          dominio público. Las he recortado, entintado y superpuesto; los originales están en
          Wikimedia Commons.
        </p>
        <ul className="mt-12 grid gap-x-12 sm:grid-cols-2">
          {artwork.map((work) => (
            <li key={work.id} className="flex flex-col gap-0.5 border-border border-t py-4">
              <a
                href={work.sourceUrl}
                className="font-serif text-[1.2rem] underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {work.title}
              </a>
              <span className="text-[0.95rem]">
                {work.author}, {work.year}
              </span>
              <span className="text-[0.9rem] text-muted-foreground">
                {work.work}. {work.license === "CC0" ? "CC0" : "Dominio público"}.
              </span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
