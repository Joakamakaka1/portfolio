import { describe, expect, it } from "vitest";
import { formatMetric } from "./format";

describe("formatMetric", () => {
  it("uses a decimal comma", () => {
    expect(formatMetric({ label: "ROC-AUC", value: 0.8175, decimals: 4 })).toBe("0,8175");
  });

  it("groups thousands with a dot", () => {
    expect(formatMetric({ label: "Reservas", value: 119390, decimals: 0 })).toBe("119.390");
    expect(formatMetric({ label: "Reservas", value: 1500, decimals: 0 })).toBe("1.500");
  });

  it("adds prefix and suffix", () => {
    expect(formatMetric({ label: "ADR", value: 30, decimals: 0, prefix: "+" })).toBe("+30");
    expect(formatMetric({ label: "Cobertura", value: 80, decimals: 0, suffix: " %" })).toBe("80 %");
  });
});
