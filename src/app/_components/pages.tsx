import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Collage } from "@/components/collage/Collage";
import { CopyEmail } from "@/components/site/CopyEmail";
import {
  type Ink,
  PROJECT_STATUS_LABEL,
  type Project,
  profile,
  projects,
  type StoryPage,
  story,
} from "@/content";
import { cn } from "@/lib/utils";

/*
 * The pages of the notebook. Sizes are in `em` on purpose: a page sets its
 * font-size from its width, so everything here scales with the notebook.
 */

const INK: Record<Ink, string> = {
  ink: "text-ink",
  vermilion: "text-vermilion-ink",
  cobalt: "text-cobalt",
  leaf: "text-leaf-ink",
};

export function Cover() {
  return (
    <div className="nb-cover-art">
      <Image
        src="/collage/notebook/cover-marble.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 30rem, 90vw"
        className="object-cover"
      />
      {/* The cloth spine of a half-bound book. */}
      <span aria-hidden="true" className="nb-spine" />
      <div className="absolute top-[15%] right-[9%] left-[22%] bg-[#efeadb] px-[1.4em] pt-[1.2em] pb-[1.1em] text-ink shadow-[0_0.08em_0.15em_rgb(0_0_0/0.45),0_0.5em_1em_rgb(0_0_0/0.3)]">
        <p className="nb-small text-ink-soft">{profile.role}</p>
        <p className="mt-[0.2em] font-serif text-[2.1em] leading-[1.04] tracking-[-0.015em]">
          {profile.name}
        </p>
        <p className="nb-small mt-[1.1em] border-ink/25 border-t pt-[0.7em] text-ink-soft">
          Cuaderno de {story.length} páginas
        </p>
      </div>
    </div>
  );
}

function Lines({ page }: { page: StoryPage }) {
  return (
    <div className="nb-text flex flex-col gap-[0.62em]">
      {page.lines.map((line) => (
        <p key={line.text} className={INK[line.ink]}>
          {line.text}
        </p>
      ))}
    </div>
  );
}

/** A page of the story: a pasted collage, a title and a few lines. */
export function StoryPageView({
  page,
  artFirst = false,
  children,
}: {
  page: StoryPage;
  /** Puts the picture above the text instead of below it. */
  artFirst?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="nb-sheet">
      <div className={cn("relative z-[1] flex flex-col gap-[0.8em]", artFirst && "order-2")}>
        <h2 className="nb-title">{page.title}</h2>
        <Lines page={page} />
        {children}
      </div>
      <div className={cn("nb-art", artFirst && "order-1")}>
        <Collage id={page.id} alt={page.picture} width="min(26rem, 80vw)" />
      </div>
    </div>
  );
}

/** The page that lists the projects; each line turns to that project's page. */
export function ProjectsPageView({ page }: { page: StoryPage }) {
  return (
    <StoryPageView page={page}>
      <ol className="mt-[0.2em] flex flex-col">
        {projects.map((project, index) => (
          <li key={project.slug} className="border-ink/15 border-t last:border-b">
            <a
              href={`#${project.slug}`}
              className="group flex items-baseline gap-[0.7em] py-[0.42em]"
            >
              <span className="nb-small w-[1.4em] text-ink-soft tabular-nums">{index + 1}</span>
              <span className="nb-text flex-1 underline-offset-[0.18em] group-hover:underline">
                {project.name}
              </span>
              <span className="nb-small text-ink-soft">{PROJECT_STATUS_LABEL[project.status]}</span>
            </a>
          </li>
        ))}
      </ol>
    </StoryPageView>
  );
}

function Repository({ project }: { project: Project }) {
  const { repository } = project;
  if (repository.visibility === "publico") {
    return (
      <a href={repository.url} className="nb-link">
        Repositorio
      </a>
    );
  }
  return (
    <span className="text-ink-soft">
      {repository.visibility === "privado" ? "Repositorio privado" : "Todavía sin repositorio"}
    </span>
  );
}

/** A project told in two lines, with the way to its file. */
export function ProjectPageView({
  page,
  project,
  artFirst,
}: {
  page: StoryPage;
  project: Project;
  artFirst?: boolean;
}) {
  return (
    <StoryPageView page={page} artFirst={artFirst}>
      <p className="nb-small mt-[0.3em] flex flex-wrap items-baseline gap-x-[1.3em] gap-y-[0.3em]">
        <span className="text-ink-soft">
          {project.kind}, {PROJECT_STATUS_LABEL[project.status].toLowerCase()}
        </span>
        <Link href={`/proyectos/${project.slug}`} className="nb-link">
          Leer la ficha
        </Link>
        <Repository project={project} />
      </p>
    </StoryPageView>
  );
}

export function ContactPageView({ page }: { page: StoryPage }) {
  const links = [profile.links.linkedin, profile.links.github];
  return (
    <StoryPageView page={page}>
      <ul className="nb-text flex flex-col gap-[0.5em]">
        <li>
          <CopyEmail email={profile.email} className="nb-link" />
        </li>
        {links.map((link) => (
          <li key={link.url}>
            <a href={link.url} className="nb-link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </StoryPageView>
  );
}
