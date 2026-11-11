import { z } from "zod";
import { capabilitiesData, experienceData, profileData, studiesData } from "./profile";
import { projectsData } from "./projects";
import {
  capabilitySchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  studySchema,
} from "./schema";

export const profile = profileSchema.parse(profileData);
export const capabilities = z.array(capabilitySchema).parse(capabilitiesData);
export const projects = z.array(projectSchema).parse(projectsData);
export const experience = z.array(experienceSchema).parse(experienceData);
export const studies = z.array(studySchema).parse(studiesData);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export * from "./artwork";
export * from "./schema";
