import { copy, type Locale } from "@/lib/i18n";
import { formatPct, formatPrice } from "@/lib/utils";
import type { MarketSnapshot } from "@/lib/market/types";
import { Sparkline } from "./sparkline";

export function SilverHero({
  locale,
  data,
}: {
  locale: Locale;
  data: MarketSnapshot;
}) {
  const t = copy[locale];
  const { silver, silverSpot, analysis } = data;
  const up = silver.sessionChangePct >= 0;
  const tone = analysis.direction === "wait" ? "accent" : analysis.direction === "long" ? "long" : "short";

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{t.comex}</p>
          <h2 className="mt-1 font-display text-xl text-fg">{t.silver}</h2>
        </div>
        <Sparkline series={silver.series} tone={tone} className="hidden sm:block" />
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
        <p className="font-mono text-4xl font-medium tabular-nums tracking-tight text-fg sm:text-5xl">
          ${formatPrice(silver.last, 3)}
        </p>
        <p
          className={`pb-1 font-mono text-lg tabular-nums ${up ? "text-long" : "text-short"}`}
        >
          {formatPct(silver.sessionChangePct)}
        </p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label={t.session} value={formatPct(silver.sessionChangePct)} positive={silver.sessionChangePct >= 0} />
        <Stat label={t.m15} value={pctOrDash(silver.change15mPct)} positive={(silver.change15mPct ?? 0) >= 0} />
        <Stat label={t.h1} value={pctOrDash(silver.change1hPct)} positive={(silver.change1hPct ?? 0) >= 0} />
        <Stat
          label={t.spot}
          value={silverSpot ? `$${formatPrice(silverSpot.last, 3)}` : "—"}
        />
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-subtle">{t.mcxNote}</p>
    </section>
  );
}

function pctOrDash(value: number | null) {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <dt className="text-xs uppercase tracking-wider text-subtle">{label}</dt>
      <dd
        className={`mt-0.5 font-mono text-sm tabular-nums ${
          positive === undefined ? "text-fg" : positive ? "text-long" : "text-short"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
