import { describe, expect, it } from "vitest";
import { capabilities, experience, getProject, profile, projects, studies } from ".";
import { projectSchema } from "./schema";

describe("content", () => {
  it("loads every collection through its schema", () => {
    expect(profile.name).toBe("Joaquín Castro Salas");
    expect(capabilities.length).toBeGreaterThan(0);
    expect(experience.length).toBeGreaterThan(0);
    expect(studies.length).toBeGreaterThan(0);
  });

  it("has unique project slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("finds a project by slug", () => {
    expect(getProject("cronista")?.name).toBe("Cronista");
    expect(getProject("no-existe")).toBeUndefined();
  });

  it("never links to a private or missing repository", () => {
    for (const project of projects) {
      if (project.repository.visibility !== "publico") {
        expect(project.repository).not.toHaveProperty("url");
      }
    }
  });

  it("marks exactly one current job", () => {
    expect(experience.filter((job) => job.current)).toHaveLength(1);
  });
});

describe("projectSchema", () => {
  const base = projects[0];

  it("rejects a project in design that links to a public repository", () => {
    const result = projectSchema.safeParse({
      ...base,
      status: "en-diseno",
      repository: { visibility: "publico", url: "https://github.com/example/repo" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects slugs that are not URL friendly", () => {
    expect(projectSchema.safeParse({ ...base, slug: "Con Espacios" }).success).toBe(false);
  });
});
