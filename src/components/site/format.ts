import type { Metric } from "@/content";

/** Formats a metric the Spanish way: "0,8175", "119.390", "+30". */
export function formatMetric(metric: Metric): string {
  const number = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: metric.decimals,
    maximumFractionDigits: metric.decimals,
    useGrouping: "always",
  }).format(metric.value);
  return `${metric.prefix ?? ""}${number}${metric.suffix ?? ""}`;
}
