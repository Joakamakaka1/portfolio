import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { formatMetric } from "@/components/site/format";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getArtwork, getCollage, getProject, PROJECT_STATUS_LABEL, projects } from "@/content";
import { Plate } from "./Plate";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: project.name, description: project.summary } : {};
}

export default function ProjectFilePage({ params }: PageProps<"/proyectos/[slug]">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 pb-24 sm:px-8">
        {/*
          The frame is the same for every project. Only the file reads the URL,
          so it sits behind Suspense and the rest can be shown at once.
        */}
        <Suspense fallback={<div className="min-h-[70svh]" />}>
          <ProjectFile params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

/** The print each project is shown with: piece of its notebook collage, source and inks. */
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

function ProjectPlate({ slug }: { slug: string }) {
  const plate = PLATES[slug];
  const layer = plate && getCollage(slug).layers.find((item) => item.id === plate.piece);
  if (!plate || !layer) return null;
  const work = getArtwork(plate.work);
  return (
    <figure className="flex flex-col gap-2">
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
      <figcaption className="font-sans text-[0.8rem] text-muted-foreground">
        {work.title}. {work.author}, {work.year}.
      </figcaption>
    </figure>
  );
}

const LINK = "text-link underline decoration-1 underline-offset-4 hover:decoration-2";

async function ProjectFile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const { repository } = project;

  return (
    <>
      <article className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <header className="flex flex-col gap-5 lg:col-span-2">
          <Link href={`/#${project.slug}`} className={`${LINK} self-start text-[0.95rem]`}>
            Volver al cuaderno
          </Link>
          <p className="text-[0.95rem] text-muted-foreground">
            {project.kind}, {PROJECT_STATUS_LABEL[project.status].toLowerCase()}
          </p>
          <h1 className="max-w-[18ch] font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-balance">
            {project.name}
          </h1>
          <p className="max-w-[46ch] font-serif text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.35] text-pretty">
            {project.summary}
          </p>
        </header>

        <div className="flex flex-col gap-10">
          <Section title="El problema">
            <p>{project.problem}</p>
          </Section>

          <Section title="El enfoque">
            <ul className="flex flex-col gap-2">
              {project.approach.map((step) => (
                <li key={step} className="border-border border-t pt-2">
                  {step}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Lo destacable">
            <ul className="flex flex-col gap-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="border-border border-t pt-2">
                  {highlight}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <aside className="flex flex-col gap-10">
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
        </aside>
      </article>

      <nav
        aria-label="Otros proyectos"
        className="mt-20 flex flex-wrap justify-between gap-4 border-border border-t pt-6 text-[0.95rem]"
      >
        {previous ? (
          <Link href={`/proyectos/${previous.slug}`} className="hover:underline">
            Anterior: {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/proyectos/${next.slug}`} className="text-right hover:underline">
            Siguiente: {next.name}
          </Link>
        ) : null}
      </nav>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 font-serif text-[1.2rem] leading-[1.45]">
      <h2 className="font-sans text-[0.95rem] font-semibold text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
