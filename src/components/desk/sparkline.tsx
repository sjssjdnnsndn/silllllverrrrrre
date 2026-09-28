import { cn } from "@/lib/utils";
import type { SeriesPoint } from "@/lib/market/types";

export function Sparkline({
  series,
  className,
  tone = "accent",
}: {
  series: SeriesPoint[];
  className?: string;
  tone?: "accent" | "long" | "short";
}) {
  if (series.length < 2) return null;
  const w = 120;
  const h = 36;
  const values = series.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = series
    .map((p, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((p.v - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const color =
    tone === "long" ? "var(--color-long)" : tone === "short" ? "var(--color-short)" : "var(--color-accent)";

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-9 w-28 overflow-visible", className)}
      aria-hidden
    >
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
