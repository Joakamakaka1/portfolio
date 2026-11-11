"use client";

import { formatMetric } from "@/components/site/format";
import {
  Tabs,
  TabsHighlight,
  TabsHighlightItem,
  TabsList,
  TabsPanel,
  TabsPanels,
  TabsTab,
} from "@/components/vendor/animate-ui/primitives/base/tabs";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/vendor/motion-primitives/morphing-dialog";
import LatticeLoader from "@/components/vendor/react-bits/LatticeLoader";
import StatusMark, { type StatusMarkStatus } from "@/components/vendor/react-bits/StatusMark";
import { PROJECT_STATUS_LABEL, type Project, type ProjectStatus } from "@/content";

const RUN_STATUS: Record<ProjectStatus, StatusMarkStatus> = {
  terminado: "done",
  "en-progreso": "running",
  "en-diseno": "pending",
};

const TABS = [
  { value: "problema", label: "Problema" },
  { value: "enfoque", label: "Enfoque" },
  { value: "resultado", label: "Lo destacable" },
] as const;

function Repository({ project }: { project: Project }) {
  if (project.repository.visibility === "publico") {
    return (
      <a
        href={project.repository.url}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline decoration-brand decoration-2 underline-offset-4"
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RunDetail({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-5 pt-4 text-left">
      <p className="text-[1.0625rem] leading-relaxed">{project.summary}</p>

      <Tabs defaultValue="problema" className="flex flex-col gap-4">
        <TabsHighlight className="inset-0 rounded-full bg-foreground">
          <TabsList className="flex w-fit gap-1 rounded-full bg-muted p-1">
            {TABS.map((tab) => (
              <TabsHighlightItem key={tab.value} value={tab.value}>
                <TabsTab
                  value={tab.value}
                  className="cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors aria-selected:text-background"
                >
                  {tab.label}
                </TabsTab>
              </TabsHighlightItem>
            ))}
          </TabsList>
        </TabsHighlight>
        <TabsPanels>
          <TabsPanel value="problema">
            <p className="leading-relaxed">{project.problem}</p>
          </TabsPanel>
          <TabsPanel value="enfoque">
            <BulletList items={project.approach} />
          </TabsPanel>
          <TabsPanel value="resultado" className="flex flex-col gap-4">
            {project.metrics.length > 0 ? (
              <dl className="grid gap-3 sm:grid-cols-2">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-muted p-4">
                    <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                    <dd className="font-display text-3xl font-semibold tabular-nums">
                      {formatMetric(metric)}
                    </dd>
                    {metric.note ? (
                      <dd className="text-sm text-muted-foreground">{metric.note}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}
            <BulletList items={project.highlights} />
          </TabsPanel>
        </TabsPanels>
      </Tabs>

      <ul aria-label="Tecnologías" className="flex flex-wrap gap-1.5">
        {project.stack.map((tool) => (
          <li key={tool} className="rounded-md border px-2 py-0.5 text-sm">
            {tool}
          </li>
        ))}
      </ul>

      <Repository project={project} />
    </div>
  );
}

function Run({ project }: { project: Project }) {
  const headline = project.metrics[0];
  return (
    <MorphingDialog transition={{ type: "spring", bounce: 0.05, duration: 0.35 }}>
      <MorphingDialogTrigger className="grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 rounded-2xl border bg-card p-4 text-left transition-colors hover:border-foreground sm:grid-cols-[9.5rem_1fr_auto] sm:p-5">
        <span className="col-span-2 flex items-center gap-2.5 font-pixel text-base sm:col-span-1">
          {project.status === "en-diseno" ? (
            <LatticeLoader
              label=""
              pattern="orbit"
              cellSize={4}
              gap={2}
              color="var(--violet)"
              showTimer={false}
            />
          ) : (
            <StatusMark
              status={RUN_STATUS[project.status]}
              size={20}
              color="var(--cyan)"
              doneColor="var(--ok)"
            />
          )}
          {PROJECT_STATUS_LABEL[project.status]}
        </span>
        <span className="flex min-w-0 flex-col">
          <MorphingDialogTitle className="font-display text-xl font-semibold leading-tight sm:text-2xl">
            {project.name}
          </MorphingDialogTitle>
          <MorphingDialogSubtitle className="text-muted-foreground">
            {project.kind}
          </MorphingDialogSubtitle>
        </span>
        {headline ? (
          <span className="flex flex-col items-end text-right">
            <span className="font-display text-2xl font-semibold tabular-nums">
              {formatMetric(headline)}
            </span>
            <span className="max-w-[14ch] text-xs leading-tight text-muted-foreground">
              {headline.label}
            </span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Ver detalle</span>
        )}
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="relative max-h-[86dvh] w-[min(94vw,42rem)] overflow-y-auto rounded-3xl border bg-card p-6 sm:p-8">
          <MorphingDialogTitle className="pr-10 font-display text-3xl font-semibold leading-tight">
            {project.name}
          </MorphingDialogTitle>
          <MorphingDialogSubtitle className="text-muted-foreground">
            {project.kind}, {PROJECT_STATUS_LABEL[project.status].toLowerCase()}
          </MorphingDialogSubtitle>
          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 12 },
            }}
          >
            <RunDetail project={project} />
          </MorphingDialogDescription>
          <MorphingDialogClose className="cursor-pointer rounded-full p-1 text-foreground hover:bg-muted" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

/** Projects listed like the runs of an agent: status first, result last. */
export function ProjectRuns({ projects }: { projects: Project[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {projects.map((project) => (
        <li key={project.slug}>
          <Run project={project} />
        </li>
      ))}
    </ul>
  );
}
