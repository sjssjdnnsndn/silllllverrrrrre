export type MacroId = "dxy" | "yield10y" | "gold" | "crude";
export type InstrumentId = "silver" | MacroId;
export type Vote = "long" | "short" | "neutral";
export type Direction = "long" | "short" | "wait";
export type SetupQuality = "high" | "actionable" | "watch" | "wait";
export type Move = "up" | "down" | "flat";
export type Timeframe = "15m" | "1h" | "4h" | "session";

export type SeriesPoint = {
  t: number;
  v: number;
};

export type InstrumentSnapshot = {
  id: InstrumentId;
  symbol: string;
  name: string;
  last: number;
  previousClose: number;
  sessionChange: number;
  sessionChangePct: number;
  change15mPct: number | null;
  change1hPct: number | null;
  change4hPct: number | null;
  series: SeriesPoint[];
  asOf: number;
  staleMs: number;
};

export type SpotQuote = {
  last: number;
  asOf: number;
  source: string;
};

export type MacroSignal = {
  id: MacroId;
  instrumentMove: Move;
  silverVote: Vote;
  timeframe: Timeframe;
  changePct: number;
  reasonEn: string;
  reasonHi: string;
};

export type Analysis = {
  direction: Direction;
  quality: SetupQuality;
  conviction: number;
  alignedCount: number;
  longVotes: number;
  shortVotes: number;
  silverConfirms: boolean;
  silverMove: Move;
  chaseWarning: boolean;
  macros: MacroSignal[];
  thesisEn: string;
  thesisHi: string;
  invalidationEn: string;
  invalidationHi: string;
  tacticalEn: string;
  tacticalHi: string;
};

export type SessionInfo = {
  metalsOpen: boolean;
  labelEn: string;
  labelHi: string;
  nyTime: string;
};

export type MarketSnapshot = {
  ok: true;
  fetchedAt: number;
  session: SessionInfo;
  silver: InstrumentSnapshot;
  silverSpot: SpotQuote | null;
  goldSpot: SpotQuote | null;
  goldSilverRatio: number | null;
  instruments: Record<MacroId, InstrumentSnapshot>;
  analysis: Analysis;
};

export type MarketError = {
  ok: false;
  fetchedAt: number;
  error: string;
};

export type MarketPayload = MarketSnapshot | MarketError;
