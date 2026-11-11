import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function NotFound() {
  return (
    <div className="desk-grain flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-start justify-center gap-5 px-5 pb-24 sm:px-8 lg:px-[5vw]">
        <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] font-extrabold tracking-[-0.03em] [font-stretch:75%]">
          Esta página no está en el cuaderno
        </h1>
        <p className="max-w-[46ch] text-xl">
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary px-5 py-3 font-display font-semibold text-primary-foreground"
        >
          Volver al cuaderno
        </Link>
      </main>
    </div>
  );
}
