import { z } from "zod";
import { capabilitiesData, experienceData, profileData, studiesData } from "./profile";
import { projectsData } from "./projects";
import {
  capabilitySchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  storyStepSchema,
  studySchema,
} from "./schema";
import { storyData } from "./story";

export const profile = profileSchema.parse(profileData);
export const capabilities = z.array(capabilitySchema).parse(capabilitiesData);
export const projects = z.array(projectSchema).parse(projectsData);
export const experience = z.array(experienceSchema).parse(experienceData);
export const studies = z.array(studySchema).parse(studiesData);

export const story = z.array(storyStepSchema).parse(storyData);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export * from "./artwork";
export * from "./collages";
export * from "./schema";
