import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copy, type Locale } from "@/lib/i18n";
import type { SessionInfo } from "@/lib/market/types";

export function DeskHeader({
  locale,
  onToggleLocale,
  session,
  live,
  countdown,
}: {
  locale: Locale;
  onToggleLocale: () => void;
  session: SessionInfo;
  live: boolean;
  countdown: number;
}) {
  const t = copy[locale];
  return (
    <header className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl tracking-tight text-fg sm:text-3xl">
            {t.brand}
          </h1>
          <p className="truncate text-xs text-muted sm:text-sm">{t.tag}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={live ? "live" : "quiet"}>
            {live ? <span className="live-dot" /> : null}
            {live ? t.live : t.lastPrint}
          </Badge>
          <Badge tone="quiet" className="hidden tabular-nums sm:inline-flex">
            {t.nextRefresh} {countdown}s
          </Badge>
          <Button
            variant="outline"
            size="default"
            onClick={onToggleLocale}
            aria-label={locale === "en" ? "हिंदी" : "English"}
            className="h-11"
          >
            <Languages />
            {t.lang}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-xs text-subtle">
        {session.nyTime} · {locale === "hi" ? session.labelHi : session.labelEn}
        <span className="tabular-nums sm:hidden"> · {countdown}s</span>
      </p>
    </header>
  );
}
