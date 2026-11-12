import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProject, projects } from "@/content";
import { ProjectsScreen } from "../_components/ProjectsScreen";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project
    ? {
        title: project.name,
        description: project.summary,
        alternates: { canonical: `/proyectos/${project.slug}` },
      }
    : {};
}

/**
 * A project is the projects board with that project open, and the board finds
 * out which one from the URL. So this page renders the board as it is, without
 * waiting for anything: its HTML is complete and readable without JavaScript.
 * The only thing that reads the params is the guard that turns away the slugs
 * that are not projects.
 */
export default function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  return (
    <>
      <Suspense>
        <Guard params={params} />
      </Suspense>
      <ProjectsScreen />
    </>
  );
}

async function Guard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return null;
}
