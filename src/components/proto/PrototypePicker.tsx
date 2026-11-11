import Link from "next/link";
import { Mascot } from "@/components/mascot/Mascot";
import { Star } from "@/components/mascot/Star";
import { profile } from "@/content";

const OPTIONS = [
  {
    href: "/proto/agente",
    name: "A · Workspace de agente",
    description:
      "El portfolio se comporta como la interfaz de un agente: le preguntas, ves los pasos que da y te responde citando los repositorios.",
    state: "thinking",
  },
  {
    href: "/proto/cosmos",
    name: "B · Cosmos ilustrado",
    description:
      "Tipografía grande sobre un fondo vivo, con la estrella de cuatro puntas como motivo y los proyectos como piezas de una colección.",
    state: "idle",
  },
] as const;

/** Entry page while two directions are being compared. */
export function PrototypePicker() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-5 py-16 sm:px-8">
      <header className="flex flex-col gap-3">
        <Star size={28} className="text-brand" />
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Portfolio de {profile.name}
        </h1>
        <p className="max-w-[60ch] text-lg text-muted-foreground">
          Dos prototipos con el mismo contenido y distinta dirección visual. En cada uno puedes
          cambiar el tema y la mascota desde la barra inferior.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              className="group flex h-full flex-col gap-4 rounded-3xl border bg-card p-6 transition-colors hover:border-foreground"
            >
              <Mascot state={option.state} size={72} decorative />
              <span className="font-display text-2xl font-semibold">{option.name}</span>
              <span className="text-muted-foreground">{option.description}</span>
              <span className="mt-auto font-medium underline decoration-brand decoration-2 underline-offset-4">
                Abrir prototipo
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
