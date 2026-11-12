import type { MetadataRoute } from "next";
import { profile, projects } from "@/content";

/** Every page of the site: the home page, the board, each project and the credits. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/proyectos",
    ...projects.map((project) => `/proyectos/${project.slug}`),
    "/creditos",
  ];
  return paths.map((path) => ({ url: new URL(path, profile.url).toString() }));
}
