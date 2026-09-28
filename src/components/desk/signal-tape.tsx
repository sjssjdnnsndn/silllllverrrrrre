import { copy, type Locale } from "@/lib/i18n";
import { formatPrice, timeAgo } from "@/lib/utils";
import type { TapeItem } from "@/store/desk";

export function SignalTape({
  locale,
  tape,
}: {
  locale: Locale;
  tape: TapeItem[];
}) {
  const t = copy[locale];
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <h3 className="font-display text-xl text-fg">{t.tape}</h3>
      {tape.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{t.tapeEmpty}</p>
      ) : (
        <ol className="mt-3 divide-y divide-border">
          {tape.map((item) => {
            const dir =
              item.direction === "long" ? t.long : item.direction === "short" ? t.short : t.wait;
            const color =
              item.direction === "long"
                ? "text-long"
                : item.direction === "short"
                  ? "text-short"
                  : "text-caution";
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className={`font-medium ${color}`}>{dir}</p>
                  <p className="text-xs text-subtle">
                    {item.alignedCount}/4 · {item.conviction}% · ${formatPrice(item.silverLast, 3)}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs tabular-nums text-muted">
                  {timeAgo(item.at)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
