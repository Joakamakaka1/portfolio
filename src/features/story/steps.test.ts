import { describe, expect, it } from "vitest";
import { stepAt } from "./steps";

/** Five stretches of 800px, the first starting at `first`. */
const stretches = (first: number) => [0, 1, 2, 3, 4].map((index) => first + index * 800);

describe("stepAt", () => {
  it("shows the first step before the story starts", () => {
    expect(stepAt(stretches(1200), 450)).toBe(0);
  });

  it("shows the step whose stretch holds the line", () => {
    expect(stepAt(stretches(0), 450)).toBe(0);
    expect(stepAt(stretches(-800), 450)).toBe(1);
    expect(stepAt(stretches(-1700), 450)).toBe(2);
  });

  it("changes step exactly when a stretch reaches the line", () => {
    expect(stepAt(stretches(-349), 450)).toBe(0);
    expect(stepAt(stretches(-350), 450)).toBe(1);
  });

  it("stays on the last step once the story has scrolled past", () => {
    expect(stepAt(stretches(-9000), 450)).toBe(4);
  });

  it("answers the first step for a story with no steps yet", () => {
    expect(stepAt([], 450)).toBe(0);
  });
});
