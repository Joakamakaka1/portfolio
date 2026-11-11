import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Cutout } from "@/components/collage/Cutout";
import { formatMetric } from "@/components/site/format";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getProject, PROJECT_STATUS_LABEL, projects } from "@/content";
import { cn } from "@/lib/utils";
import { Repository, STATUS_INK } from "../../_components/pages";
import { projectArt } from "../../_components/project-art";

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
      <div className="desk-grain flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 pt-4 pb-16 sm:px-8">
          {/*
            The desk around the file is the same for every project. Only the file
            reads the URL, so it sits behind Suspense and the rest can be shown at once.
          */}
          <Suspense fallback={<div className={cn(SHEET, "min-h-[70svh]")} />}>
            <ProjectFile params={params} />
          </Suspense>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}

const SHEET =
  "relative mx-auto max-w-3xl -rotate-[0.4deg] bg-paper px-6 pt-8 pb-12 text-ink shadow-[0_1px_2px_rgb(20_22_30/0.25),0_18px_40px_rgb(20_22_30/0.2)] sm:px-12 sm:pt-10";

async function ProjectFile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { art, block } = projectArt(project.slug);
  const index = projects.indexOf(project);
  const previous = projects[index - 1];
  const next = projects[index + 1];

  return (
    <>
      <article className={SHEET}>
        <Link
          href={`/#${project.slug}`}
          className="nb-link font-display text-[0.95rem] font-semibold"
        >
          Volver al cuaderno
        </Link>

        <header className="mt-6 grid gap-6 border-b-2 border-vermilion pb-8 sm:grid-cols-[1fr_14rem] sm:items-end">
          <div className="flex flex-col gap-3">
            <p className="font-display font-medium text-ink-soft">{project.kind}</p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,4.25rem)] leading-[0.92] font-extrabold tracking-[-0.02em] [font-stretch:80%]">
              {project.name}
            </h1>
            <p>
              <span className={cn("nb-stamp", STATUS_INK[project.status])}>
                {PROJECT_STATUS_LABEL[project.status]}
              </span>
            </p>
          </div>
          <figure className={cn("relative w-56 rotate-2 p-2 max-sm:order-first", block)}>
            <span aria-hidden="true" className="nb-tape -top-2 left-[34%] -rotate-3" />
            <Cutout id={art} sizes="224px" className="mx-auto max-h-64 w-auto" />
          </figure>
        </header>

        <p className="mt-8 max-w-[60ch] text-xl leading-relaxed">{project.summary}</p>

        <Section title="El problema">
          <p className="max-w-[62ch] text-lg leading-relaxed">{project.problem}</p>
        </Section>

        <Section title="El enfoque">
          <ul className="flex max-w-[62ch] list-disc flex-col gap-2 pl-5 text-lg leading-relaxed marker:text-vermilion">
            {project.approach.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </Section>

        {project.metrics.length > 0 ? (
          <Section title="Cifras">
            <dl className="grid gap-6 sm:grid-cols-2">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col">
                  <dt className="order-2 font-display font-semibold">{metric.label}</dt>
                  <dd className="order-1 font-hand text-5xl font-bold text-vermilion-ink">
                    {formatMetric(metric)}
                  </dd>
                  {metric.note ? (
                    <dd className="order-3 text-[0.95rem] text-ink-soft">{metric.note}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </Section>
        ) : null}

        <Section title="Lo destacable">
          <ul className="flex max-w-[62ch] list-disc flex-col gap-2 pl-5 text-lg leading-relaxed marker:text-vermilion">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </Section>

        <Section title="Con qué está hecho">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tool) => (
              <li key={tool} className="nb-strip text-[0.9rem]">
                {tool}
              </li>
            ))}
          </ul>
        </Section>

        <p className="mt-10 font-hand text-2xl">
          <Repository project={project} />
        </p>
      </article>

      <nav
        aria-label="Otros proyectos"
        className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-between gap-4 font-display font-semibold"
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 flex flex-col gap-3">
      <h2 className="font-hand text-3xl font-bold">
        <span className="nb-mark">{title}</span>
      </h2>
      {children}
    </section>
  );
}
