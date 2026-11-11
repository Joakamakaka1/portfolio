import type { Metadata } from "next";
import { Star } from "@/components/mascot/Star";
import { MotionProvider } from "@/components/proto/MotionProvider";
import { PrototypeBar } from "@/components/proto/PrototypeBar";
import { CopyEmail } from "@/components/site/CopyEmail";
import { capabilities, experience, profile, projects, studies } from "@/content";
import { Badge } from "./_components/Badge";
import { Hero } from "./_components/Hero";
import { FocusTitle, ToolsSlider, WordsLoop } from "./_components/Ornaments";
import { ProjectCollection } from "./_components/ProjectCollection";

export const metadata: Metadata = { title: "Prototipo B · Cosmos ilustrado" };

const NAV = [
  { id: "proyectos", label: "Proyectos" },
  { id: "que-hago", label: "Qué hago" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "contacto", label: "Contacto" },
];

const FOCUS_WORDS = ["Agentes", "Evaluación", "Seguridad", "Cloud", "Frontend"];
const LOOP_WORDS = ["LLMs", "Agentes", "RAG", "Evaluación", "AWS", "React"];
const tools = [...new Set(capabilities.flatMap((capability) => capability.tools))];

const titleClass =
  "font-display text-5xl leading-[0.9] font-extrabold tracking-[-0.03em] [font-stretch:75%] sm:text-7xl";
const linkClass = "font-semibold underline decoration-magenta decoration-2 underline-offset-4";

export default function CosmosPrototypePage() {
  return (
    <MotionProvider>
      <div className="cosmos flex flex-1 flex-col bg-background text-foreground">
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-5 sm:px-10 lg:px-16">
          <a href="#inicio" className="flex items-center gap-2 font-display text-lg font-bold">
            <Star size={18} className="text-magenta" />
            {profile.name}
          </a>
          <nav aria-label="Secciones" className="hidden md:block">
            <ul className="flex gap-6">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="font-medium hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="inicio" className="flex flex-col pb-36">
          <Hero name={profile.name} lead={profile.summary} ring="LLMs ✦ agentes ✦ evaluación ✦ " />

          <WordsLoop words={LOOP_WORDS} />

          <section
            id="proyectos"
            className="mx-auto flex w-full max-w-6xl scroll-mt-10 flex-col gap-14 px-5 py-20 sm:px-10"
          >
            <div className="flex flex-col gap-4">
              <h2 className={titleClass}>Proyectos</h2>
              <p className="max-w-[58ch] text-xl text-muted-foreground">
                Cuatro piezas en distinto punto del camino: una terminada, dos en marcha y una idea
                que está tomando forma.
              </p>
            </div>
            <ProjectCollection projects={projects} />
          </section>

          <section
            id="que-hago"
            className="mx-auto flex w-full max-w-6xl scroll-mt-10 flex-col gap-10 px-5 py-20 sm:px-10"
          >
            <h2 className="sr-only">Qué hago</h2>
            <FocusTitle words={FOCUS_WORDS} />
            <ul className="grid gap-x-12 md:grid-cols-2">
              {capabilities.map((capability) => (
                <li key={capability.id} className="flex flex-col gap-1.5 border-t py-6">
                  <h3 className="font-display text-2xl font-bold">{capability.title}</h3>
                  <p className="text-lg text-muted-foreground">{capability.description}</p>
                </li>
              ))}
            </ul>
            <ToolsSlider tools={tools} />
          </section>

          <section
            id="sobre-mi"
            className="mx-auto grid w-full max-w-6xl scroll-mt-10 items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <Badge name={profile.name} role={profile.role} />
            <div className="flex flex-col gap-8">
              <h2 className={titleClass}>Sobre mí</h2>
              <div className="flex max-w-[60ch] flex-col gap-4 text-xl leading-relaxed">
                {profile.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-xl font-bold">Experiencia</h3>
                  <ol className="flex flex-col gap-3">
                    {experience.map((job) => (
                      <li key={job.company} className="flex flex-col">
                        <span className="font-semibold">{job.company}</span>
                        <span>{job.role}</span>
                        <span className="text-muted-foreground">{job.period}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-xl font-bold">Formación</h3>
                  <ol className="flex flex-col gap-3">
                    {studies.map((study) => (
                      <li key={study.title} className="flex flex-col">
                        <span className="font-semibold">{study.title}</span>
                        <span className="text-muted-foreground">
                          {study.center}
                          {study.current ? ", en curso" : study.period ? `, ${study.period}` : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>

          <section
            id="contacto"
            className="mx-auto flex w-full max-w-6xl scroll-mt-10 flex-col gap-8 px-5 py-24 sm:px-10"
          >
            <h2 className="font-display text-[clamp(4rem,16vw,13rem)] leading-[0.82] font-extrabold tracking-[-0.04em] [font-stretch:75%]">
              Hablemos
            </h2>
            <p className="max-w-[50ch] text-xl text-muted-foreground">
              Escríbeme por LinkedIn o por correo. Si prefieres ver código primero, está en GitHub.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xl">
              <a href={profile.links.linkedin.url} className={linkClass}>
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                {profile.email}
              </a>
              <CopyEmail
                email={profile.email}
                className="rounded-full border px-4 py-1.5 text-base"
              />
              <a href={profile.links.github.url} className={linkClass}>
                GitHub
              </a>
            </div>
          </section>
        </main>
      </div>
      <PrototypeBar current="cosmos" />
    </MotionProvider>
  );
}
