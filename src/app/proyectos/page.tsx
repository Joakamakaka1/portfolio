import type { Metadata } from "next";
import { ProjectsScreen } from "./_components/ProjectsScreen";

export const metadata: Metadata = {
  title: "Proyectos",
  alternates: { canonical: "/proyectos" },
  description:
    "Cuatro proyectos propios, cada uno con su problema, su enfoque, sus cifras y con qué está hecho.",
};

export default function ProjectsPage() {
  return <ProjectsScreen />;
}
