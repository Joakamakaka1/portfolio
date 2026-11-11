import { describe, expect, it } from "vitest";
import { columnNumber, openProject, projectPath } from "./board";

const slugs = ["cronista", "twochi"];

describe("openProject", () => {
  it("shows the whole board at the base path", () => {
    expect(openProject("/proyectos", "/proyectos", slugs)).toBeNull();
    expect(openProject("/proyectos/", "/proyectos", slugs)).toBeNull();
  });

  it("opens the project named in the path", () => {
    expect(openProject("/proyectos/twochi", "/proyectos", slugs)).toBe("twochi");
    expect(openProject("/proyectos/twochi/", "/proyectos", slugs)).toBe("twochi");
  });

  it("opens nothing for a project that does not exist or for another section", () => {
    expect(openProject("/proyectos/otro", "/proyectos", slugs)).toBeNull();
    expect(openProject("/creditos/twochi", "/proyectos", slugs)).toBeNull();
    expect(openProject("/proyectos-viejos/twochi", "/proyectos", slugs)).toBeNull();
  });
});

describe("projectPath", () => {
  it("is the inverse of openProject", () => {
    for (const slug of [...slugs, null]) {
      expect(openProject(projectPath("/proyectos", slug), "/proyectos", slugs)).toBe(slug);
    }
  });
});

describe("columnNumber", () => {
  it("counts from one, with two digits", () => {
    expect(columnNumber(0)).toBe("01");
    expect(columnNumber(11)).toBe("12");
  });
});
