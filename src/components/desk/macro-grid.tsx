import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { copy, type Locale } from "@/lib/i18n";
import { formatPct, formatPrice } from "@/lib/utils";
import type { MacroId, MarketSnapshot } from "@/lib/market/types";
import { Sparkline } from "./sparkline";

const ORDER: MacroId[] = ["dxy", "yield10y", "gold", "crude"];

export function MacroGrid({
  locale,
  data,
}: {
  locale: Locale;
  data: MarketSnapshot;
}) {
  const t = copy[locale];
  return (
    <section>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-xl text-fg">{t.macros}</h3>
          <p className="text-xs text-muted">{t.rule}</p>
        </div>
        <p className="text-xs text-subtle">
          {data.analysis.direction === "short" ? t.formulaShort : t.formulaLong}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ORDER.map((id) => {
          const inst = data.instruments[id];
          const signal = data.analysis.macros.find((m) => m.id === id)!;
          const name =
            id === "dxy" ? t.dxy : id === "yield10y" ? t.yield10y : id === "gold" ? t.gold : t.crude;
          const full =
            id === "dxy"
              ? t.dxyFull
              : id === "yield10y"
                ? t.yield10yFull
                : id === "gold"
                  ? t.goldFull
                  : t.crudeFull;
          const isYield = id === "yield10y";
          const vote = signal.silverVote;
          const MoveIcon =
            signal.instrumentMove === "up" ? ArrowUp : signal.instrumentMove === "down" ? ArrowDown : Minus;
          const price = isYield ? `${formatPrice(inst.last, 3)}%` : formatPrice(inst.last, id === "dxy" ? 3 : 2);
          const changeLabel = isYield
            ? `${inst.sessionChange >= 0 ? "+" : ""}${(inst.sessionChange * 100).toFixed(1)} bp`
            : formatPct(signal.changePct);
          const reason = locale === "hi" ? signal.reasonHi : signal.reasonEn;
          const voteLabel = vote === "long" ? t.helpsLong : vote === "short" ? t.helpsShort : t.flat;

          return (
            <article
              key={id}
              className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{name}</p>
                  <p className="text-xs text-subtle">{full}</p>
                </div>
                <Badge tone={vote === "long" ? "long" : vote === "short" ? "short" : "quiet"}>
                  <MoveIcon className="size-3" />
                  {signal.timeframe}
                </Badge>
              </div>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="font-mono text-2xl tabular-nums text-fg">
                  {isYield ? price : id === "gold" || id === "crude" ? `$${price}` : price}
                </p>
                <Sparkline
                  series={inst.series}
                  tone={vote === "long" ? "long" : vote === "short" ? "short" : "accent"}
                  className="h-8 w-20"
                />
              </div>
              <p
                className={`mt-1 font-mono text-sm tabular-nums ${
                  signal.changePct > 0 ? "text-long" : signal.changePct < 0 ? "text-short" : "text-muted"
                }`}
              >
                {changeLabel} · {signal.timeframe}
              </p>
              <p className="mt-3 text-xs font-medium text-fg">{voteLabel}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{reason}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
