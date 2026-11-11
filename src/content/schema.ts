import { z } from "zod";

/**
 * Shape of the site content. Every data file is parsed against these schemas
 * when it is imported, so a typo or a missing field fails the build and the
 * tests instead of reaching the page.
 */

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  role: z.string().min(1),
  focus: z.string().min(1),
  summary: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  location: z.string().min(1),
  email: z.email(),
  links: z.object({
    github: linkSchema,
    linkedin: linkSchema,
  }),
});

export const capabilitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tools: z.array(z.string().min(1)).min(1),
});

export const projectStatusSchema = z.enum(["terminado", "en-progreso", "en-diseno"]);

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.number(),
  decimals: z.number().int().min(0).max(4).default(0),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  note: z.string().optional(),
});

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    status: projectStatusSchema,
    kind: z.string().min(1),
    summary: z.string().min(1),
    problem: z.string().min(1),
    approach: z.array(z.string().min(1)).min(1),
    highlights: z.array(z.string().min(1)).min(1),
    metrics: z.array(metricSchema).default([]),
    stack: z.array(z.string().min(1)).min(1),
    repository: z.discriminatedUnion("visibility", [
      z.object({ visibility: z.literal("publico"), url: z.url() }),
      z.object({ visibility: z.literal("privado") }),
      z.object({ visibility: z.literal("sin-repositorio") }),
    ]),
  })
  .refine(
    (project) => project.status !== "en-diseno" || project.repository.visibility !== "publico",
    {
      message: "A project still in design cannot link to a public repository",
    },
  );

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  current: z.boolean().default(false),
  description: z.string().min(1),
});

export const studySchema = z.object({
  title: z.string().min(1),
  center: z.string().min(1),
  period: z.string().optional(),
  current: z.boolean().default(false),
});

export type Profile = z.infer<typeof profileSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Study = z.infer<typeof studySchema>;

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  terminado: "Terminado",
  "en-progreso": "En progreso",
  "en-diseno": "En diseño",
};
