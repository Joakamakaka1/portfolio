import { describe, expect, it } from "vitest";
import { profile, projects } from "@/content";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists every page on the site's own domain", () => {
    for (const url of urls) expect(new URL(url).origin).toBe(profile.url);
  });

  it("lists every project once", () => {
    for (const project of projects) {
      expect(urls.filter((url) => url.endsWith(`/proyectos/${project.slug}`))).toHaveLength(1);
    }
  });
});

describe("robots", () => {
  it("points crawlers at the sitemap", () => {
    expect(robots().sitemap).toBe(`${profile.url}/sitemap.xml`);
  });
});
