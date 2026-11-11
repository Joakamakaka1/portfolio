import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getProject, story } from "@/content";
import { NotebookNoScript } from "@/features/notebook/NoScript";
import { Notebook, type NotebookFace } from "@/features/notebook/Notebook";
import { DeskStickers } from "./_components/DeskStickers";
import { Hero } from "./_components/Hero";
import {
  ContactPageView,
  Cover,
  ProjectPageView,
  ProjectsPageView,
  StoryPageView,
} from "./_components/pages";

function pageView(page: (typeof story)[number], index: number) {
  const project = page.project ? getProject(page.project) : undefined;
  if (project) return <ProjectPageView page={page} project={project} artFirst={index % 2 === 1} />;
  if (page.id === "proyectos") return <ProjectsPageView page={page} />;
  if (page.id === "contacto") return <ContactPageView page={page} />;
  return <StoryPageView page={page} artFirst={index % 2 === 1} />;
}

const faces: NotebookFace[] = [
  { id: "tapa", label: "Tapa", content: <Cover /> },
  ...story.map((page, index) => ({
    id: page.id,
    label: page.label,
    content: pageView(page, index),
  })),
];

export default function HomePage() {
  return (
    <>
      <SiteHeader home />
      <main className="flex flex-1 flex-col">
        <Hero />

        <section
          id="cuaderno"
          className="relative isolate flex flex-col items-center gap-8 overflow-x-clip bg-desk px-0 py-16 text-desk-foreground lg:py-20"
        >
          <DeskStickers />
          <div className="nb-heading relative z-10 px-5">
            <h2 className="font-sans text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.02em]">
              Mi historia
            </h2>
            <p className="text-desk-muted">{story.length} páginas</p>
          </div>
          <Notebook faces={faces} label="Cuaderno: mi historia" />
          <NotebookNoScript />
        </section>
      </main>
      <SiteFooter home />
    </>
  );
}
