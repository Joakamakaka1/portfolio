"use client";

import { formatMetric } from "@/components/site/format";
import HoloCard from "@/components/vendor/react-bits/HoloCard";
import { PROJECT_STATUS_LABEL, type Project } from "@/content";
import { coverSvg, toDataUri } from "@/features/cosmos/art";
import { cn } from "@/lib/utils";

const PRESETS = ["cosmos", "stars", "swirl", "glitter"] as const;

function Repository({ project }: { project: Project }) {
  if (project.repository.visibility === "publico") {
    return (
      <a
        href={project.repository.url}
        target="_blank"
        rel="noreferrer"
        className="font-semibold underline decoration-magenta decoration-2 underline-offset-4"
      >
        Ver el repositorio en GitHub
      </a>
    );
  }
  return (
    <p className="text-muted-foreground">
      {project.repository.visibility === "privado"
        ? "El repositorio es privado."
        : "Todavía no hay repositorio."}
    </p>
  );
}

function Entry({ project, index }: { project: Project; index: number }) {
  const cover = toDataUri(coverSvg(project.slug, index));
  return (
    <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className={cn("flex justify-center", index % 2 === 1 && "md:order-2")}>
        <HoloCard
          image={cover}
          alt={`Carátula ilustrada de ${project.name}`}
          preset={PRESETS[index % PRESETS.length]}
          width={300}
          radius={22}
          tiltMax={12}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-pixel text-lg text-violet">{PROJECT_STATUS_LABEL[project.status]}</p>
        <h3 className="font-display text-4xl leading-[0.95] font-bold tracking-tight [font-stretch:85%] sm:text-5xl">
          {project.name}
        </h3>
        <p className="text-lg leading-relaxed">{project.summary}</p>
        {project.metrics[0] ? (
          <p className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold tabular-nums">
              {formatMetric(project.metrics[0])}
            </span>
            <span className="text-muted-foreground">{project.metrics[0].label}</span>
          </p>
        ) : null}
        <details className="group rounded-2xl border bg-card/70 backdrop-blur">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
            Cómo está hecho
            <span
              aria-hidden="true"
              className="text-2xl leading-none transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="flex flex-col gap-4 px-5 pb-5">
            <p>{project.problem}</p>
            <ul className="flex flex-col gap-2">
              {[...project.approach, ...project.highlights].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.45em] text-magenta">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul aria-label="Tecnologías" className="flex flex-wrap gap-1.5">
              {project.stack.map((tool) => (
                <li key={tool} className="rounded-full border px-2.5 py-0.5 text-sm">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </details>
        <Repository project={project} />
      </div>
    </article>
  );
}

/** Projects as a collection of holographic covers, alternating sides. */
export function ProjectCollection({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-20">
      {projects.map((project, index) => (
        <Entry key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
