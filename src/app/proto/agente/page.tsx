import type { Metadata } from "next";
import { Mascot } from "@/components/mascot/Mascot";
import { MotionProvider } from "@/components/proto/MotionProvider";
import { PrototypeBar } from "@/components/proto/PrototypeBar";
import { CopyEmail } from "@/components/site/CopyEmail";
import { capabilities, experience, profile, projects, studies } from "@/content";
import { AgentConsole } from "./_components/AgentConsole";
import { Capabilities } from "./_components/Capabilities";
import { ProjectRuns } from "./_components/ProjectRuns";

export const metadata: Metadata = { title: "Prototipo A · Workspace de agente" };

const SECTIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "proyectos", label: "Proyectos" },
  { id: "que-hago", label: "Qué hago" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "contacto", label: "Contacto" },
];

const finished = projects.filter((project) => project.status === "terminado").length;
const ongoing = projects.filter((project) => project.status === "en-progreso").length;
const planned = projects.filter((project) => project.status === "en-diseno").length;

const linkClass = "font-medium underline decoration-brand decoration-2 underline-offset-4";

function Sidebar() {
  return (
    <header className="border-b bg-background/90 px-5 py-3 backdrop-blur sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:gap-8 lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
      <a href="#inicio" className="flex items-center gap-3">
        <Mascot size={36} decorative />
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-semibold">{profile.name}</span>
          <span className="text-sm text-muted-foreground">{profile.role}</span>
        </span>
      </a>
      <nav aria-label="Secciones" className="mt-3 lg:mt-0">
        <ul className="-mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:flex-col">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block whitespace-nowrap rounded-lg px-3 py-2 text-[15px] transition-colors hover:bg-muted"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="mt-auto hidden flex-col gap-2 text-sm lg:flex">
        <li>
          <a href={profile.links.github.url} className={linkClass}>
            GitHub
          </a>
        </li>
        <li>
          <a href={profile.links.linkedin.url} className={linkClass}>
            LinkedIn
          </a>
        </li>
      </ul>
    </header>
  );
}

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {children ? <p className="max-w-[62ch] text-lg text-muted-foreground">{children}</p> : null}
    </div>
  );
}

export default function AgentPrototypePage() {
  return (
    <MotionProvider>
      <div className="mx-auto grid w-full max-w-[1320px] flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <Sidebar />
        <main className="flex min-w-0 flex-col gap-24 px-5 pt-10 pb-36 sm:px-8 lg:px-14 lg:pt-14">
          <div id="inicio" className="scroll-mt-28 lg:scroll-mt-10">
            <AgentConsole
              title={`Hola, soy ${profile.shortName}. Construyo aplicaciones con LLMs y compruebo que funcionan.`}
              lead={profile.about[0]}
            />
          </div>

          <section id="proyectos" className="flex scroll-mt-28 flex-col gap-6 lg:scroll-mt-10">
            <SectionHeading title="Proyectos">
              {finished} terminado, {ongoing} en marcha y {planned} en diseño. Abre cualquiera para
              ver el problema, cómo lo resolví y qué quedó.
            </SectionHeading>
            <ProjectRuns projects={projects} />
          </section>

          <section id="que-hago" className="flex scroll-mt-28 flex-col gap-6 lg:scroll-mt-10">
            <SectionHeading title="Qué hago">{profile.about[2]}</SectionHeading>
            <Capabilities capabilities={capabilities} />
          </section>

          <section id="trayectoria" className="flex scroll-mt-28 flex-col gap-6 lg:scroll-mt-10">
            <SectionHeading title="Trayectoria">{profile.about[1]}</SectionHeading>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-semibold">Experiencia</h3>
                <ol className="flex flex-col">
                  {experience.map((job) => (
                    <li key={job.company} className="flex flex-col gap-1 border-t py-4">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-semibold">{job.company}</span>
                        <span className="text-sm text-muted-foreground">{job.period}</span>
                      </span>
                      <span>{job.role}</span>
                      <span className="text-muted-foreground">{job.description}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-semibold">Formación</h3>
                <ol className="flex flex-col">
                  {studies.map((study) => (
                    <li key={study.title} className="flex flex-col gap-1 border-t py-4">
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
          </section>

          <section id="contacto" className="flex scroll-mt-28 flex-col gap-6 lg:scroll-mt-10">
            <SectionHeading title="Contacto">
              Escríbeme por LinkedIn o por correo. Si prefieres ver código primero, está en GitHub.
            </SectionHeading>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={profile.links.linkedin.url}
                className="rounded-xl bg-brand px-5 py-3 font-semibold text-brand-foreground"
              >
                Abrir LinkedIn
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-xl border border-foreground px-5 py-3 font-semibold"
              >
                {profile.email}
              </a>
              <CopyEmail
                email={profile.email}
                className="rounded-xl border px-5 py-3 font-medium hover:border-foreground"
              />
              <a
                href={profile.links.github.url}
                className="rounded-xl border px-5 py-3 font-medium hover:border-foreground"
              >
                Ver GitHub
              </a>
            </div>
          </section>
        </main>
      </div>
      <PrototypeBar current="agente" />
    </MotionProvider>
  );
}
