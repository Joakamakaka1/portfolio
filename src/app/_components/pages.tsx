import Link from "next/link";
import { Cutout } from "@/components/collage/Cutout";
import type { ArtworkId } from "@/components/collage/files";
import { CopyEmail } from "@/components/site/CopyEmail";
import { formatMetric } from "@/components/site/format";
import { Star } from "@/components/site/Star";
import {
  artwork,
  capabilities,
  experience,
  PROJECT_STATUS_LABEL,
  type Project,
  type ProjectStatus,
  profile,
  studies,
} from "@/content";
import { cn } from "@/lib/utils";

/*
 * The pages of the notebook. Sizes are in `em` on purpose: a page sets its
 * font-size from its width, so everything here scales with the notebook.
 */

export const STATUS_INK: Record<ProjectStatus, string> = {
  terminado: "text-leaf-ink",
  "en-progreso": "text-cobalt",
  "en-diseno": "text-vermilion-ink",
};

export function Cover() {
  return (
    <div className="nb-cover-art">
      {/* The elastic band that keeps the notebook shut. */}
      <span aria-hidden="true" className="absolute inset-y-0 right-[2.4em] w-[0.9em] bg-ink/80" />
      <Star className="absolute top-[2.2em] left-[2.2em] size-[3.4em] text-star" />
      <div className="clipping absolute top-[27%] right-[5.2em] left-[2.2em] -rotate-2 bg-paper p-[1.3em]">
        <p className="nb-print font-semibold">{profile.name}</p>
        <p className="nb-title mt-[0.15em] text-[2em]">Cuaderno de observación</p>
        <p className="nb-note mt-[0.5em] text-ink-soft">{profile.focus}</p>
      </div>
      <div className="clipping absolute bottom-[2.4em] left-[3em] w-[10em] rotate-[5deg] p-[0.4em]">
        <span aria-hidden="true" className="nb-tape -top-[0.6em] left-[30%] -rotate-6" />
        <Cutout id="jupiter" alt="" sizes="200px" />
      </div>
    </div>
  );
}

export function AboutPage() {
  const last = profile.about.length - 1;
  return (
    <div className="nb-sheet">
      <h2 className="nb-title">
        <span className="nb-mark">Quién soy</span>
      </h2>
      <div className="nb-note flex flex-col gap-[0.4em]">
        {profile.about.map((paragraph, index) => (
          <p key={paragraph} className={index === last ? "text-vermilion-ink" : undefined}>
            {index === last ? <span aria-hidden="true">✱ </span> : null}
            {paragraph}
          </p>
        ))}
      </div>
      <figure className="mt-auto flex items-end justify-end gap-[0.8em]">
        <figcaption className="nb-note max-w-[8em] text-right text-[1em] text-ink-soft">
          Asomarse a ver qué hay detrás.
        </figcaption>
        <div className="relative w-[9.6em] rotate-[1.5deg] bg-mint p-[0.4em]">
          <span aria-hidden="true" className="nb-tape -top-[0.6em] left-[30%] -rotate-3" />
          <Cutout id="flammarion" sizes="260px" />
        </div>
      </figure>
    </div>
  );
}

/** The capabilities take two pages; `part` picks the half. */
export function CapabilitiesPage({ part }: { part: 1 | 2 }) {
  const half = Math.ceil(capabilities.length / 2);
  const items = part === 1 ? capabilities.slice(0, half) : capabilities.slice(half);
  return (
    <div className="nb-sheet">
      {part === 1 ? (
        <h2 className="nb-title">
          <span className="nb-mark" style={{ "--nb-mark": "var(--sky)" } as React.CSSProperties}>
            Qué hago
          </span>
        </h2>
      ) : (
        <h2 className="sr-only">Qué hago, continuación</h2>
      )}
      <ul className="flex flex-col gap-[1em]">
        {items.map((capability) => (
          <li key={capability.id}>
            <h3 className="nb-note text-[1.3em] font-bold">{capability.title}</h3>
            <p className="nb-note text-ink-soft">{capability.description}</p>
            <ul className="mt-[0.45em] flex flex-wrap gap-[0.3em]">
              {capability.tools.map((tool) => (
                <li key={tool} className="nb-strip">
                  {tool}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {part === 2 ? (
        <figure className="clipping relative mt-auto w-[13.5em] rotate-2 self-end p-[0.35em]">
          <span aria-hidden="true" className="nb-tape -top-[0.6em] left-[30%] -rotate-2" />
          <Cutout id="turk" sizes="300px" />
        </figure>
      ) : null}
    </div>
  );
}

export function ExperiencePage() {
  return (
    <div className="nb-sheet">
      <h2 className="nb-title">
        <span className="nb-mark" style={{ "--nb-mark": "var(--peach)" } as React.CSSProperties}>
          Trayectoria
        </span>
      </h2>
      <ol className="flex flex-col gap-[0.8em]">
        {experience.map((job) => (
          <li key={job.company}>
            <p className="nb-print font-semibold text-vermilion-ink">{job.period}</p>
            <h3 className="nb-note flex items-center gap-[0.35em] text-[1.3em] font-bold">
              {job.company}
              {job.current ? <Star className="size-[0.7em] text-star" /> : null}
            </h3>
            <p className="nb-note">{job.role}</p>
            <p className="nb-note text-ink-soft">{job.description}</p>
          </li>
        ))}
      </ol>
      <figure className="absolute top-[0.9em] right-[1.4em] w-[6.4em]">
        <span
          aria-hidden="true"
          className="absolute top-[6%] right-[-8%] size-[4.8em] rounded-full bg-sky"
        />
        <Cutout id="microscope" sizes="180px" className="relative" />
      </figure>
    </div>
  );
}

export function StudiesPage() {
  return (
    <div className="nb-sheet">
      <h2 className="nb-title">
        <span className="nb-mark" style={{ "--nb-mark": "var(--mint)" } as React.CSSProperties}>
          Formación
        </span>
      </h2>
      <ol className="flex flex-col gap-[1em]">
        {studies.map((study) => (
          <li key={study.title}>
            <h3 className="nb-note font-bold">{study.title}</h3>
            <p className="nb-note flex flex-wrap items-center gap-x-[0.6em] text-ink-soft">
              {study.center}
              {study.period ? <span>{study.period}</span> : null}
              {study.current ? <span className="nb-stamp text-leaf-ink">En curso</span> : null}
            </p>
          </li>
        ))}
      </ol>
      <figure className="mt-auto w-[14em] rotate-[-4deg] self-end overflow-hidden rounded-full bg-peach">
        <Cutout id="moon" sizes="280px" />
      </figure>
    </div>
  );
}

/** Opens the projects: the four of them with their status, each linking to its page. */
export function ProjectsIndexPage({ projects }: { projects: Project[] }) {
  return (
    <div className="nb-sheet">
      <h2 className="nb-title">
        <span className="nb-mark">Proyectos</span>
      </h2>
      <p className="nb-note">
        Cuatro piezas en distinto punto del camino: una terminada, dos en marcha y una idea que está
        tomando forma.
      </p>
      <ol className="flex flex-col gap-[0.55em]">
        {projects.map((project) => (
          <li key={project.slug} className="flex flex-col items-start gap-[0.15em]">
            <a href={`#${project.slug}`} className="nb-link nb-note text-[1.3em] font-bold">
              {project.name}
            </a>
            <p className="flex flex-wrap items-center gap-x-[0.8em] gap-y-[0.3em]">
              <span className="nb-note text-ink-soft">{project.kind}</span>
              <span className={cn("nb-stamp text-[0.7em]", STATUS_INK[project.status])}>
                {PROJECT_STATUS_LABEL[project.status]}
              </span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProjectPage({
  project,
  art,
  block,
}: {
  project: Project;
  art: ArtworkId;
  /** Tailwind background class of the colour block behind the engraving. */
  block: string;
}) {
  const metric = project.metrics[0];
  return (
    <div className="nb-sheet gap-[0.75em]">
      <div className="relative w-[62%] self-center">
        <span aria-hidden="true" className="nb-tape -top-[0.6em] left-[34%] -rotate-2" />
        <div className={cn("-rotate-1 p-[0.55em]", block)}>
          <Cutout id={art} sizes="300px" className="mx-auto max-h-[9.5em] w-auto" />
        </div>
        <p
          className={cn(
            "nb-stamp absolute right-[-2.2em] bottom-[-0.9em] bg-paper/85",
            STATUS_INK[project.status],
          )}
        >
          {PROJECT_STATUS_LABEL[project.status]}
        </p>
      </div>
      <div>
        <p className="nb-print text-ink-soft">{project.kind}</p>
        <h2 className="nb-title text-[1.65em]">{project.name}</h2>
      </div>
      <p className="nb-note text-[1.16em]">{project.summary}</p>
      {metric ? (
        <p className="nb-note">
          <strong className="mr-[0.3em] text-[1.5em] text-vermilion-ink">
            {formatMetric(metric)}
          </strong>
          <span className="nb-print font-medium">{metric.label}</span>
        </p>
      ) : null}
      <p className="nb-note mt-auto flex flex-wrap gap-x-[1.2em]">
        <Link href={`/proyectos/${project.slug}`} className="nb-link">
          Abrir la ficha<span className="sr-only"> de {project.name}</span>
        </Link>
        <Repository project={project} />
      </p>
    </div>
  );
}

export function Repository({ project }: { project: Project }) {
  if (project.repository.visibility === "publico") {
    return (
      <a href={project.repository.url} className="nb-link">
        Repositorio<span className="sr-only"> de {project.name}</span> en GitHub
      </a>
    );
  }
  return (
    <span className="text-ink-soft">
      {project.repository.visibility === "privado"
        ? "Repositorio privado"
        : "Todavía sin repositorio"}
    </span>
  );
}

export function ContactPage() {
  return (
    <div className="nb-sheet">
      <h2 className="nb-title">
        <span className="nb-mark">Hablemos</span>
      </h2>
      <p className="nb-note">
        Escríbeme por LinkedIn o por correo. Si prefieres ver código primero, está en GitHub.
      </p>
      <ul className="nb-note flex flex-col gap-[0.5em] text-[1.4em]">
        <li>
          <a href={profile.links.linkedin.url} className="nb-link">
            LinkedIn
          </a>
        </li>
        <li className="flex flex-col items-start gap-[0.3em]">
          <a href={`mailto:${profile.email}`} className="nb-link break-all">
            {profile.email}
          </a>
          <CopyEmail email={profile.email} className="nb-strip text-[0.5em]" />
        </li>
        <li>
          <a href={profile.links.github.url} className="nb-link">
            GitHub
          </a>
        </li>
      </ul>
      <figure className="mt-auto w-[15em] rotate-2 self-end bg-peach p-[0.5em]">
        <Cutout id="pigeons" sizes="300px" />
      </figure>
    </div>
  );
}

export function CreditsPage() {
  return (
    <div className="nb-sheet">
      <h2 className="nb-title text-[1.8em]">Láminas</h2>
      <p className="nb-note text-[1.05em]">
        Grabados de dominio público. Cada uno enlaza a su ficha en Wikimedia Commons.
      </p>
      <ul className="nb-print flex flex-col gap-[0.42em] text-[0.8em]">
        {artwork.map((work) => (
          <li key={work.id}>
            <a href={work.sourceUrl} className="nb-link font-semibold">
              {work.title}
            </a>
            . {work.author}, {work.year}.
          </li>
        ))}
      </ul>
    </div>
  );
}
