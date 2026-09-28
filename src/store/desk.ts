import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n";
import type { Direction, SetupQuality } from "@/lib/market/types";

export type TapeItem = {
  id: string;
  at: number;
  direction: Direction;
  quality: SetupQuality;
  conviction: number;
  alignedCount: number;
  silverLast: number;
};

type DeskState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tape: TapeItem[];
  record: (item: Omit<TapeItem, "id">) => void;
};

let lastSignature = "";

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      tape: [],
      record: (item) => {
        const signature = `${item.direction}:${item.quality}:${item.alignedCount}`;
        const prev = get().tape[0];
        const prevSig = prev
          ? `${prev.direction}:${prev.quality}:${prev.alignedCount}`
          : "";
        if (signature === lastSignature || signature === prevSig) return;
        lastSignature = signature;
        const next: TapeItem = {
          ...item,
          id: `${item.at}-${item.direction}-${item.alignedCount}`,
        };
        set({ tape: [next, ...get().tape].slice(0, 24) });
      },
    }),
    { name: "argent-pulse-desk" },
  ),
);
