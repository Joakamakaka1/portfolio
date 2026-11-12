import type { ReactNode } from "react";
import { Collage } from "@/components/collage/Collage";
import { formatMetric } from "@/components/site/format";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  getArtwork,
  getCollage,
  PROJECT_STATUS_LABEL,
  type Project,
  profile,
  projects,
} from "@/content";
import { columnNumber } from "@/features/projects/board";
import { type BoardProject, ProjectsBoard } from "@/features/projects/ProjectsBoard";
import { Plate } from "./Plate";

/** Path of the board; a project lives one segment below it. */
export const PROJECTS_PATH = "/proyectos";

/** Title of the browser tab for the board (`null`) or for one project. */
export function projectsTitle(project: Project | null): string {
  return `${project ? project.name : "Proyectos"} · ${profile.name}`;
}

/** The print each project is shown with: a piece of its collage, its source and its inks. */
const PLATES: Record<string, { piece: string; work: string; ink: string; paper: string }> = {
  cronista: { piece: "cronista-plate", work: "mical", ink: "#7d2012", paper: "#efe3cf" },
  "cancelaciones-hotel": {
    piece: "hotel-plate",
    work: "barometer",
    ink: "#1f5b3a",
    paper: "#e6ecdc",
  },
  twochi: { piece: "twochi-figure", work: "pigeons", ink: "#24449f", paper: "#e4e8f3" },
  "configuracion-evaluada": {
    piece: "config-plate",
    work: "scales",
    ink: "#24449f",
    paper: "#ebe6d6",
  },
};

const LINK = "text-link underline decoration-1 underline-offset-4 hover:decoration-2";

/** What a column shows. It sits inside a link, so it holds no links of its own. */
function Card({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <span className="board-number" aria-hidden="true">
        {columnNumber(index)}
      </span>
      <h2 className="board-name">{project.name}</h2>
      <p className="board-kind">{project.kind}</p>
      <div className="board-art">
        <Collage id={project.slug} alt={project.picture} width="min(20rem, 30vw)" />
      </div>
      <p className="board-status">{PROJECT_STATUS_LABEL[project.status]}</p>
    </>
  );
}

function ProjectPlate({ slug }: { slug: string }) {
  const plate = PLATES[slug];
  const layer = plate && getCollage(slug).layers.find((item) => item.id === plate.piece);
  if (!plate || !layer) return null;
  const work = getArtwork(plate.work);
  return (
    <div className="-rotate-1 shadow-[0_1px_2px_rgb(20_18_14/0.3),0_14px_30px_rgb(20_18_14/0.18)]">
      <Plate
        src={layer.src}
        width={layer.width}
        height={layer.height}
        alt={`${work.title}. ${work.author}, ${work.year}.`}
        ink={plate.ink}
        paper={plate.paper}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 font-serif text-[1.15rem] leading-[1.45]">
      <h3 className="font-sans text-[0.95rem] font-semibold text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Lines({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="border-border border-t pt-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** What fills the board when a project is open. */
function Detail({ project }: { project: Project }) {
  const { repository } = project;
  return (
    <div className="flex flex-col gap-10">
      <p className="max-w-[40ch] font-serif text-[clamp(1.35rem,2.3vw,2rem)] leading-[1.25] tracking-[-0.01em] text-pretty">
        {project.summary}
      </p>

      <div className="grid gap-x-14 gap-y-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
        <div className="flex flex-col gap-10">
          <Section title="El problema">
            <p>{project.problem}</p>
          </Section>
          <Section title="El enfoque">
            <Lines items={project.approach} />
          </Section>
          <Section title="Lo destacable">
            <Lines items={project.highlights} />
          </Section>
        </div>

        <div className="flex flex-col gap-10">
          <ProjectPlate slug={project.slug} />

          {project.metrics.length > 0 ? (
            <Section title="Cifras">
              <dl className="flex flex-col gap-6">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col">
                    <dt className="order-2 font-sans text-[0.95rem] font-semibold">
                      {metric.label}
                    </dt>
                    <dd className="order-1 font-serif text-[2.75rem] leading-none tracking-[-0.02em] tabular-nums">
                      {formatMetric(metric)}
                    </dd>
                    {metric.note ? (
                      <dd className="order-3 font-sans text-[0.9rem] text-muted-foreground">
                        {metric.note}
                      </dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            </Section>
          ) : null}

          <Section title="Con qué está hecho">
            <p className="font-sans text-[0.95rem] leading-relaxed">{project.stack.join(", ")}.</p>
          </Section>

          <p className="font-sans text-[0.95rem]">
            {repository.visibility === "publico" ? (
              <a href={repository.url} className={LINK}>
                Ver el repositorio en GitHub
              </a>
            ) : (
              <span className="text-muted-foreground">
                {repository.visibility === "privado"
                  ? "El repositorio es privado."
                  : "Todavía no tiene repositorio."}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

const board: BoardProject[] = projects.map((project, index) => ({
  slug: project.slug,
  title: projectsTitle(project),
  card: <Card project={project} index={index} />,
  detail: <Detail project={project} />,
}));

/**
 * The projects page, shared by `/proyectos` and `/proyectos/[slug]`: the board
 * reads the URL to know which project, if any, is open.
 */
export function ProjectsScreen() {
  return (
    <>
      <SiteHeader wide />
      <main className="relative flex min-h-[calc(100svh-5.25rem)] flex-1 max-[899px]:flex-col">
        {/* The header already says where we are; the heading is there for screen readers. */}
        <h1 className="sr-only">Proyectos</h1>
        {/* No Suspense here: every route of the board is prerendered with its pathname
            known, and a boundary would send the board as a segment hidden without JavaScript. */}
        <ProjectsBoard projects={board} base={PROJECTS_PATH} title={projectsTitle(null)} />
      </main>
      <SiteFooter />
    </>
  );
}
