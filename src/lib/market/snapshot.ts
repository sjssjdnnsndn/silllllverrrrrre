import { createServerFn } from "@tanstack/react-start";
import { analyze } from "./analyze";
import type { InstrumentId, InstrumentSnapshot, MacroId, MarketPayload } from "./types";

const TTL_MS = 12_000;
let cache: { at: number; payload: MarketPayload } | null = null;

const MACRO_IDS: MacroId[] = ["dxy", "yield10y", "gold", "crude"];

export const getMarketSnapshot = createServerFn({ method: "POST" }).handler(
  async (): Promise<MarketPayload> => {
    if (cache && Date.now() - cache.at < TTL_MS) return cache.payload;

    const { fetchSpotMetals, fetchYahooInstrument, nyClock } = await import(
      "./yahoo.server"
    );

    const ids: InstrumentId[] = ["silver", ...MACRO_IDS];
    const settled = await Promise.allSettled(ids.map((id) => fetchYahooInstrument(id)));
    const spots = await fetchSpotMetals().catch(() => ({ silver: null, gold: null }));

    const byId = new Map<InstrumentId, InstrumentSnapshot>();
    const errors: string[] = [];
    settled.forEach((result, i) => {
      const id = ids[i]!;
      if (result.status === "fulfilled") byId.set(id, result.value);
      else
        errors.push(`${id}: ${result.reason instanceof Error ? result.reason.message : "fail"}`);
    });

    const silver = byId.get("silver");
    const dxy = byId.get("dxy");
    const yield10y = byId.get("yield10y");
    const gold = byId.get("gold");
    const crude = byId.get("crude");

    if (!silver || !dxy || !yield10y || !gold || !crude) {
      const payload: MarketPayload = {
        ok: false,
        fetchedAt: Date.now(),
        error: errors.join(" · ") || "Live tape unavailable",
      };
      cache = { at: Date.now(), payload };
      return payload;
    }

    const goldPx = spots.gold?.last ?? gold.last;
    const silverPx = spots.silver?.last ?? silver.last;
    const goldSilverRatio = silverPx > 0 ? goldPx / silverPx : null;

    const payload: MarketPayload = {
      ok: true,
      fetchedAt: Date.now(),
      session: nyClock(),
      silver,
      silverSpot: spots.silver,
      goldSpot: spots.gold,
      goldSilverRatio,
      instruments: { dxy, yield10y, gold, crude },
      analysis: analyze(silver, { dxy, yield10y, gold, crude }),
    };
    cache = { at: Date.now(), payload };
    return payload;
  },
);
