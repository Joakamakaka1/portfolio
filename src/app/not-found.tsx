import Link from "next/link";
import { Collage } from "@/components/collage/Collage";
import { SiteHeader } from "@/components/site/SiteHeader";
import Ribbons from "@/components/vendor/react-bits/Ribbons";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Ribbons of ink that follow the pointer, behind everything. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <Ribbons
          colors={["#e5432b", "#2b55b5", "#46a063"]}
          thickness={26}
          length={46}
          spread={0.7}
          shape="comet"
          opacity={0.85}
        />
      </div>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-x-14 gap-y-8 px-5 pb-24 sm:px-8 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <h1 className="max-w-[12ch] font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            Esta página se ha caído del cuaderno.
          </h1>
          <p className="max-w-[40ch] font-serif text-[1.25rem] leading-[1.45]">
            Puede que el enlace esté mal escrito o que la página ya no exista.
          </p>
          <Link
            href="/"
            className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            Volver al inicio
          </Link>
        </div>
        <Collage
          id="lost"
          alt="Grabado de Hendrick Goltzius: Ícaro cayendo del cielo, 1588."
          width="min(32rem, 80vw)"
          className="mx-auto max-w-[min(100%,62svh)] max-lg:order-first max-lg:max-w-[18rem]"
        />
      </main>
    </div>
  );
}
