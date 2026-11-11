import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { profile, projects } from "@/content";
import { NotebookNoScript } from "@/features/notebook/NoScript";
import { Notebook, type NotebookFace, type NotebookTab } from "@/features/notebook/Notebook";
import { DeskPieces, NightSky } from "./_components/Desk";
import {
  AboutPage,
  CapabilitiesPage,
  ContactPage,
  Cover,
  CreditsPage,
  ExperiencePage,
  ProjectPage,
  ProjectsIndexPage,
  StudiesPage,
} from "./_components/pages";
import { projectArt } from "./_components/project-art";

const faces: NotebookFace[] = [
  { id: "tapa", label: "Tapa", content: <Cover /> },
  { id: "quien-soy", label: "Quién soy", content: <AboutPage /> },
  { id: "formacion", label: "Formación", content: <StudiesPage /> },
  { id: "que-hago", label: "Qué hago", content: <CapabilitiesPage part={1} /> },
  { id: "que-hago-2", label: "Qué hago, continuación", content: <CapabilitiesPage part={2} /> },
  { id: "trayectoria", label: "Trayectoria", content: <ExperiencePage /> },
  { id: "proyectos", label: "Proyectos", content: <ProjectsIndexPage projects={projects} /> },
  ...projects.map((project) => ({
    id: project.slug,
    label: project.name,
    content: <ProjectPage project={project} {...projectArt(project.slug)} />,
  })),
  { id: "contacto", label: "Contacto", content: <ContactPage /> },
  { id: "laminas", label: "Láminas", content: <CreditsPage /> },
];

const tabs: NotebookTab[] = [
  { face: "quien-soy", label: "Quién soy", color: "var(--star)" },
  { face: "que-hago", label: "Qué hago", color: "var(--sky)" },
  { face: "trayectoria", label: "Trayectoria", color: "var(--peach)" },
  { face: "proyectos", label: "Proyectos", color: "var(--mint)" },
  { face: "contacto", label: "Contacto", color: "var(--star)" },
];

const [firstName, ...surnames] = profile.name.split(" ");

export default function HomePage() {
  return (
    <>
      <div className="desk desk-grain relative isolate flex min-h-svh flex-col overflow-x-clip">
        <NightSky />
        <SiteHeader home />
        <main className="relative flex flex-1 flex-col items-center justify-center gap-8 pt-2 pb-10 lg:pb-8">
          <DeskPieces />

          <div className="desk-intro relative z-10 flex w-full flex-col gap-5 px-5 sm:px-8 lg:absolute lg:top-1/2 lg:left-[5vw] lg:w-[36vw] lg:px-0">
            <h1 className="sr-only">
              {profile.name}, {profile.role}
            </h1>
            <p
              aria-hidden="true"
              className="font-display text-[clamp(3.75rem,8.4vw,8.75rem)] leading-[0.84] font-extrabold tracking-[-0.03em] [font-stretch:75%]"
            >
              {firstName}
              <br />
              {surnames.join(" ")}
            </p>
            <p className="max-w-[34ch] text-xl leading-snug">{profile.summary}</p>
            <p className="flex flex-wrap items-center gap-x-6 gap-y-3 font-display font-semibold">
              <a
                href="#quien-soy"
                className="rounded-full bg-primary px-5 py-3 text-primary-foreground hover:-translate-y-px"
              >
                Abrir el cuaderno
              </a>
              <a href="#proyectos" className="underline decoration-2 underline-offset-4">
                Ir a los proyectos
              </a>
            </p>
          </div>

          <Notebook faces={faces} tabs={tabs} label="Cuaderno de observación" />
          <NotebookNoScript />
        </main>
      </div>
      <SiteFooter home />
    </>
  );
}
