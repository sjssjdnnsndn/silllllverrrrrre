import { ArrowDownRight, ArrowUpRight, Pause } from "lucide-react";
import { copy, type Locale } from "@/lib/i18n";
import type { MarketSnapshot } from "@/lib/market/types";
import { Badge } from "@/components/ui/badge";

export function DirectionCall({
  locale,
  data,
}: {
  locale: Locale;
  data: MarketSnapshot;
}) {
  const t = copy[locale];
  const { analysis } = data;
  const isLong = analysis.direction === "long";
  const isShort = analysis.direction === "short";
  const label = isLong ? t.long : isShort ? t.short : t.wait;
  const action = isLong ? t.buy : isShort ? t.sell : t.standAside;
  const Icon = isLong ? ArrowUpRight : isShort ? ArrowDownRight : Pause;
  const tone = isLong ? "long" : isShort ? "short" : "wait";
  const qualityLabel =
    analysis.quality === "high"
      ? t.high
      : analysis.quality === "actionable"
        ? t.actionable
        : analysis.quality === "watch"
          ? t.watch
          : t.waitQuality;

  return (
    <section
      className={`rounded-xl p-5 shadow-[var(--shadow-border)] sm:p-6 ${
        isLong ? "bg-long/8" : isShort ? "bg-short/8" : "bg-surface"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{t.direction}</p>
        <Badge tone={tone}>{qualityLabel}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span
          className={`flex size-11 items-center justify-center rounded-lg ${
            isLong ? "bg-long/15 text-long" : isShort ? "bg-short/15 text-short" : "bg-surface-2 text-muted"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <div>
          <p
            className={`font-display text-4xl tracking-tight sm:text-5xl ${
              isLong ? "text-long" : isShort ? "text-short" : "text-fg"
            }`}
          >
            {label}
          </p>
          <p className="text-sm text-muted">{action}</p>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>{t.conviction}</span>
          <span className="font-mono tabular-nums text-fg">{analysis.conviction}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full ${isLong ? "bg-long" : isShort ? "bg-short" : "bg-caution"}`}
            style={{ width: `${analysis.conviction}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        {analysis.alignedCount} {t.of4} {t.votes}
        {analysis.silverConfirms ? ` · ${t.confirms}` : ` · ${t.diverges}`}
      </p>
      {analysis.chaseWarning ? (
        <p className="mt-2 text-sm text-caution">{t.chase}</p>
      ) : null}
    </section>
  );
}
