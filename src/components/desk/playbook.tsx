import type { ReactNode } from "react";
import { copy, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import type { MarketSnapshot } from "@/lib/market/types";

export function Playbook({
  locale,
  data,
}: {
  locale: Locale;
  data: MarketSnapshot;
}) {
  const t = copy[locale];
  const { analysis, goldSilverRatio } = data;
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      <Card title={t.thesis}>
        {locale === "hi" ? analysis.thesisHi : analysis.thesisEn}
      </Card>
      <Card title={t.invalidation}>
        {locale === "hi" ? analysis.invalidationHi : analysis.invalidationEn}
      </Card>
      <Card title={t.tactical}>
        {locale === "hi" ? analysis.tacticalHi : analysis.tacticalEn}
        {goldSilverRatio ? (
          <span className="mt-3 block text-xs text-subtle">
            {t.ratio}:{" "}
            <span className="font-mono tabular-nums text-fg">
              {formatPrice(goldSilverRatio, 2)}
            </span>
            <span className="block">{t.ratioHint}</span>
          </span>
        ) : null}
      </Card>
    </section>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-fg">{children}</p>
    </article>
  );
}
