import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { copy, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import type { MarketSnapshot } from "@/lib/market/types";

export function SilverChart({
  locale,
  data,
}: {
  locale: Locale;
  data: MarketSnapshot;
}) {
  const t = copy[locale];
  const rows = useMemo(
    () =>
      data.silver.series.map((p) => ({
        t: p.t,
        v: Number(p.v.toFixed(3)),
      })),
    [data.silver.series],
  );
  const stroke =
    data.analysis.direction === "short"
      ? "var(--color-short)"
      : data.analysis.direction === "long"
        ? "var(--color-long)"
        : "var(--color-accent)";

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h3 className="mb-3 font-display text-xl text-fg">{t.chart}</h3>
      <div className="h-56 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="silverFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={formatTick}
              tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => formatPrice(v, 2)}
              tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip content={<ChartTip />} />
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              fill="url(#silverFill)"
              strokeWidth={1.6}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function formatTick(t: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(t);
}

function ChartTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { t: number; v: number } }>;
}) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-md bg-surface-2 px-3 py-2 text-xs text-fg shadow-[var(--shadow-border)]">
      <p className="font-mono tabular-nums">${formatPrice(row.v, 3)}</p>
      <p className="text-subtle">{formatTick(row.t)}</p>
    </div>
  );
}
