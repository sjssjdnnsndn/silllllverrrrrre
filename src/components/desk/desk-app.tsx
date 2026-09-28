import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketSnapshot } from "@/lib/market/snapshot";
import { copy } from "@/lib/i18n";
import { useDesk } from "@/store/desk";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeskHeader } from "./header";
import { SilverHero } from "./silver-hero";
import { DirectionCall } from "./direction-call";
import { MacroGrid } from "./macro-grid";
import { SilverChart } from "./silver-chart";
import { Playbook } from "./playbook";
import { SignalTape } from "./signal-tape";
import type { MarketPayload } from "@/lib/market/types";

const INTERVAL = 15_000;

export function DeskApp({ initial }: { initial?: MarketPayload }) {
  const locale = useDesk((s) => s.locale);
  const setLocale = useDesk((s) => s.setLocale);
  const tape = useDesk((s) => s.tape);
  const record = useDesk((s) => s.record);
  const t = copy[locale];
  const [countdown, setCountdown] = useState(15);

  const query = useQuery({
    queryKey: ["market-snapshot"],
    queryFn: () => getMarketSnapshot(),
    initialData: initial,
    refetchInterval: INTERVAL,
    refetchIntervalInBackground: true,
  });

  const data = query.data;

  useEffect(() => {
    if (!data || !data.ok) return;
    record({
      at: data.fetchedAt,
      direction: data.analysis.direction,
      quality: data.analysis.quality,
      conviction: data.analysis.conviction,
      alignedCount: data.analysis.alignedCount,
      silverLast: data.silver.last,
    });
  }, [data, record]);

  useEffect(() => {
    setCountdown(15);
    const id = window.setInterval(() => {
      setCountdown((n) => (n <= 1 ? 15 : n - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [data?.fetchedAt]);

  if (query.isLoading && !data) {
    return <DeskSkeleton />;
  }

  if (!data || !data.ok) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-3xl">{t.brand}</h1>
        <p className="text-sm text-muted">{data && !data.ok ? data.error : t.error}</p>
        <Button onClick={() => query.refetch()}>{t.retry}</Button>
      </main>
    );
  }

  const live = data.session.metalsOpen && data.silver.staleMs < 15 * 60_000;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <DeskHeader
        locale={locale}
        onToggleLocale={() => setLocale(locale === "en" ? "hi" : "en")}
        session={data.session}
        live={live}
        countdown={countdown}
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 stagger-in">
        <div className="grid gap-4 lg:grid-cols-2">
          <SilverHero locale={locale} data={data} />
          <DirectionCall locale={locale} data={data} />
        </div>
        <MacroGrid locale={locale} data={data} />
        <SilverChart locale={locale} data={data} />
        <Playbook locale={locale} data={data} />
        <SignalTape locale={locale} tape={tape} />
        <p className="pb-8 text-center text-xs leading-relaxed text-subtle">{t.disclaimer}</p>
      </main>
    </div>
  );
}

export function DeskSkeleton() {
  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <Skeleton className="mb-4 h-16 w-full rounded-xl" />
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <div className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  );
}
