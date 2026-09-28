import { clamp } from "@/lib/utils";
import type {
  Analysis,
  InstrumentSnapshot,
  MacroId,
  MacroSignal,
  Move,
  SetupQuality,
  Timeframe,
  Vote,
} from "./types";

const MACRO_ORDER: MacroId[] = ["dxy", "yield10y", "gold", "crude"];

/** User playbook: DXY ↓ + 10Y ↓ + Gold ↑ + Crude ↓ = silver long. Inverse = short. */
const LONG_WHEN_DOWN: Record<MacroId, boolean> = {
  dxy: true,
  yield10y: true,
  gold: false,
  crude: true,
};

const DEADBAND: Record<MacroId | "silver", number> = {
  silver: 0.08,
  dxy: 0.035,
  yield10y: 0.35,
  gold: 0.08,
  crude: 0.12,
};

function pickChange(inst: InstrumentSnapshot): { pct: number; timeframe: Timeframe } {
  const ranked: Array<{ pct: number | null; timeframe: Timeframe; minAbs: number }> = [
    { pct: inst.change1hPct, timeframe: "1h", minAbs: DEADBAND[inst.id] },
    { pct: inst.change15mPct, timeframe: "15m", minAbs: DEADBAND[inst.id] * 0.7 },
    { pct: inst.change4hPct, timeframe: "4h", minAbs: DEADBAND[inst.id] },
    { pct: inst.sessionChangePct, timeframe: "session", minAbs: DEADBAND[inst.id] },
  ];
  for (const row of ranked) {
    if (row.pct !== null && Math.abs(row.pct) >= row.minAbs) {
      return { pct: row.pct, timeframe: row.timeframe };
    }
  }
  const fallback = inst.change1hPct ?? inst.sessionChangePct;
  return { pct: fallback, timeframe: inst.change1hPct !== null ? "1h" : "session" };
}

function moveOf(pct: number, deadband: number): Move {
  if (pct > deadband) return "up";
  if (pct < -deadband) return "down";
  return "flat";
}

function voteForSilver(id: MacroId, move: Move): Vote {
  if (move === "flat") return "neutral";
  const wantsDown = LONG_WHEN_DOWN[id];
  if (wantsDown) return move === "down" ? "long" : "short";
  return move === "up" ? "long" : "short";
}

const REASON: Record<MacroId, Record<"long" | "short" | "neutral", { en: string; hi: string }>> = {
  dxy: {
    long: {
      en: "Dollar easing. Silver is priced in USD, so a softer DXY lifts the metal.",
      hi: "डॉलर नरम। चांदी डॉलर में प्राइस होती है, DXY गिरने से मेटल ऊपर।",
    },
    short: {
      en: "Dollar bid. A rising DXY is a headwind for silver.",
      hi: "डॉलर मजबूत। DXY चढ़ना चांदी के लिए हेडविंड है।",
    },
    neutral: {
      en: "DXY is flat — no dollar vote.",
      hi: "DXY फ्लैट है — डॉलर वोट नहीं।",
    },
  },
  yield10y: {
    long: {
      en: "Yields falling. Lower real rates raise the bid for non-yielding metal.",
      hi: "यील्ड गिर रही है। कम रियल रेट मेटल के लिए बोली बढ़ाते हैं।",
    },
    short: {
      en: "Yields rising. Higher rates compete with silver.",
      hi: "यील्ड चढ़ रही है। ऊँची दरें चांदी से प्रतिस्पर्धा करती हैं।",
    },
    neutral: {
      en: "10-year is quiet — no rate vote.",
      hi: "10-वर्ष शांत है — रेट वोट नहीं।",
    },
  },
  gold: {
    long: {
      en: "Gold bid. Silver usually follows the precious-metals tape.",
      hi: "सोना खरीदा जा रहा है। चांदी आमतौर पर प्रेशियस मेटल्स टेप फॉलो करती है।",
    },
    short: {
      en: "Gold offered. Weak gold rarely lets silver trend up alone.",
      hi: "सोना बिकाऊ। कमजोर सोने के साथ चांदी अकेले ट्रेंड कम ही करती है।",
    },
    neutral: {
      en: "Gold is mixed — no metals vote.",
      hi: "सोना मिक्स है — मेटल्स वोट नहीं।",
    },
  },
  crude: {
    long: {
      en: "Crude easing. Playbook treats softer energy as a silver tailwind with a weaker dollar.",
      hi: "क्रूड नरम। प्लेबुक नरम एनर्जी को कमजोर डॉलर के साथ चांदी के पक्ष में मानती है।",
    },
    short: {
      en: "Crude bid. Playbook treats firmer energy as a silver headwind with a stronger dollar.",
      hi: "क्रूड मजबूत। प्लेबुक मजबूत एनर्जी को मजबूत डॉलर के साथ चांदी के खिलाफ मानती है।",
    },
    neutral: {
      en: "Crude is flat — no energy vote.",
      hi: "क्रूड फ्लैट है — एनर्जी वोट नहीं।",
    },
  },
};

export function analyze(
  silver: InstrumentSnapshot,
  macros: Record<MacroId, InstrumentSnapshot>,
): Analysis {
  const signals: MacroSignal[] = MACRO_ORDER.map((id) => {
    const inst = macros[id];
    const picked = pickChange(inst);
    const instrumentMove = moveOf(picked.pct, DEADBAND[id]);
    const silverVote = voteForSilver(id, instrumentMove);
    const reason = REASON[id][silverVote];
    return {
      id,
      instrumentMove,
      silverVote,
      timeframe: picked.timeframe,
      changePct: picked.pct,
      reasonEn: reason.en,
      reasonHi: reason.hi,
    };
  });

  const longVotes = signals.filter((s) => s.silverVote === "long").length;
  const shortVotes = signals.filter((s) => s.silverVote === "short").length;
  const alignedCount = Math.max(longVotes, shortVotes);
  const net = longVotes - shortVotes;

  const silverPick = pickChange(silver);
  const silverMove = moveOf(silverPick.pct, DEADBAND.silver);

  let direction: Analysis["direction"] = "wait";
  if (net >= 2) direction = "long";
  else if (net <= -2) direction = "short";

  const silverConfirms =
    (direction === "long" && silverMove === "up") ||
    (direction === "short" && silverMove === "down");
  const silverFights =
    (direction === "long" && silverMove === "down") ||
    (direction === "short" && silverMove === "up");

  const ext =
    direction === "long"
      ? silver.sessionChangePct
      : direction === "short"
        ? -silver.sessionChangePct
        : 0;
  const chaseWarning = direction !== "wait" && ext >= 1.35;

  let quality: SetupQuality = "wait";
  if (direction !== "wait" && alignedCount === 4 && silverConfirms && !chaseWarning) {
    quality = "high";
  } else if (direction !== "wait" && alignedCount >= 3 && !silverFights) {
    quality = chaseWarning ? "watch" : "actionable";
  } else if (direction !== "wait" && alignedCount >= 3) {
    quality = "watch";
  } else {
    direction = alignedCount < 2 ? "wait" : direction;
    if (alignedCount < 3) {
      direction = "wait";
      quality = "wait";
    }
  }

  const mag =
    signals.reduce((acc, s) => acc + Math.abs(s.changePct), 0) / Math.max(1, signals.length);
  let conviction = alignedCount * 18;
  if (alignedCount === 4) conviction += 12;
  if (silverConfirms) conviction += 14;
  if (silverFights) conviction -= 18;
  if (chaseWarning) conviction -= 12;
  if (mag < 0.12) conviction -= 10;
  if (quality === "wait") conviction = Math.min(conviction, 38);
  conviction = clamp(Math.round(conviction), 8, 96);

  return {
    direction,
    quality,
    conviction,
    alignedCount,
    longVotes,
    shortVotes,
    silverConfirms,
    silverMove,
    chaseWarning,
    macros: signals,
    ...copyFor(direction, quality, alignedCount, silverConfirms, silverFights, chaseWarning, net),
  };
}

function copyFor(
  direction: Analysis["direction"],
  quality: SetupQuality,
  alignedCount: number,
  confirms: boolean,
  fights: boolean,
  chase: boolean,
  net: number,
): Pick<
  Analysis,
  | "thesisEn"
  | "thesisHi"
  | "invalidationEn"
  | "invalidationHi"
  | "tacticalEn"
  | "tacticalHi"
> {
  if (direction === "wait") {
    return {
      thesisEn: `Only ${alignedCount}/4 macros agree. The playbook needs DXY, 10Y, gold and crude pointing the same way before a silver side is taken.`,
      thesisHi: `केवल ${alignedCount}/4 मैक्रो सहमत हैं। प्लेबुक तभी साइड लेती है जब DXY, 10Y, सोना और क्रूड एक दिशा में हों।`,
      invalidationEn: "No position. A 3/4 or 4/4 alignment is the trigger, not a single tick.",
      invalidationHi: "कोई पोजीशन नहीं। ट्रिगर 3/4 या 4/4 अलाइनमेंट है, एक टिक नहीं।",
      tacticalEn: "Stay flat. Let the next 15-second scans prove a clean tape instead of forcing a trade.",
      tacticalHi: "फ्लैट रहें। अगले 15-सेकंड स्कैन साफ़ टेप दिखाएँ — ज़बरदस्ती ट्रेड न लें।",
    };
  }

  const sideEn = direction === "long" ? "upside" : "downside";
  const sideHi = direction === "long" ? "ऊपर" : "नीचे";
  const ruleEn =
    direction === "long"
      ? "DXY down, 10-year down, gold up, crude down"
      : "DXY up, 10-year up, gold down, crude up";
  const ruleHi =
    direction === "long"
      ? "DXY नीचे, 10Y नीचे, सोना ऊपर, क्रूड नीचे"
      : "DXY ऊपर, 10Y ऊपर, सोना नीचे, क्रूड ऊपर";

  const confirmEn = confirms
    ? "Silver itself is already printing in that direction."
    : fights
      ? "Silver is fighting the macros — treat that as lag or a trap, not a green light to size up."
      : "Silver is still flat versus the macros.";
  const confirmHi = confirms
    ? "चांदी खुद उसी दिशा में प्रिंट कर रही है।"
    : fights
      ? "चांदी मैक्रो से उल्टी चल रही है — इसे लैग या ट्रैप मानें, साइज़ बढ़ाने का सिग्नल नहीं।"
      : "चांदी अभी मैक्रो के मुकाबले फ्लैट है।";

  const qualityEn =
    quality === "high"
      ? "High-quality tape: all four legs agree and silver confirms."
      : quality === "actionable"
        ? "Actionable, not perfect. Three or four legs agree."
        : "Watch only — alignment is there but confirmation is dirty.";
  const qualityHi =
    quality === "high"
      ? "उच्च क्वालिटी टेप: चारों लेग सहमत हैं और चांदी कन्फर्म कर रही है।"
      : quality === "actionable"
        ? "एक्शनेबल, परफेक्ट नहीं। तीन या चार लेग सहमत हैं।"
        : "केवल वॉच — अलाइनमेंट है पर कन्फर्मेशन साफ़ नहीं।";

  return {
    thesisEn: `Playbook points ${sideEn}. Rule is ${ruleEn}. ${qualityEn} ${confirmEn} Net score ${net > 0 ? "+" : ""}${net}.`,
    thesisHi: `प्लेबुक ${sideHi} की तरफ़ है। नियम: ${ruleHi}। ${qualityHi} ${confirmHi} नेट स्कोर ${net > 0 ? "+" : ""}${net}।`,
    invalidationEn:
      direction === "long"
        ? "Stand down if DXY and the 10-year turn up together, or if gold loses its bid while crude rips."
        : "Stand down if DXY and the 10-year roll over together, or if gold catches a bid while crude breaks.",
    invalidationHi:
      direction === "long"
        ? "अगर DXY और 10Y साथ-साथ चढ़ें, या सोना बिड खोए और क्रूड उछले, तो साइड छोड़ दें।"
        : "अगर DXY और 10Y साथ-साथ गिरें, या सोना बिड पकड़े और क्रूड टूटे, तो साइड छोड़ दें।",
    tacticalEn: chase
      ? "Do not chase. The session move is already extended. Wait for a pullback that still holds the macro alignment."
      : quality === "high"
        ? "Take the side on a small pullback, not the spike. Risk off immediately if two macros flip."
        : "Scale small. Require the next two scans to hold the same side before adding.",
    tacticalHi: chase
      ? "पीछे न भागें। सेशन मूव पहले से लंबा है। पुलबैक का इंतज़ार करें जब तक मैक्रो अलाइन रहें।"
      : quality === "high"
        ? "स्पाइक पर नहीं, छोटे पुलबैक पर साइड लें। दो मैक्रो पलटें तो तुरंत रिस्क ऑफ।"
        : "छोटा साइज़। जोड़ने से पहले अगले दो स्कैन उसी साइड पर रहने दें।",
  };
}
