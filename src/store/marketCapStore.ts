import { create } from "zustand";
import { TOKEN_CONFIG } from "@/config";

export type MarketCapStatus = "loading" | "ok" | "error";

interface MarketCapState {
  marketCap: number;
  progress: number;
  status: MarketCapStatus;
  source: string;
  setMarketCap: (value: number, source: string) => void;
  setStatus: (status: MarketCapStatus) => void;
}

export const useMarketCapStore = create<MarketCapState>((set) => ({
  marketCap: 0,
  progress: 0,
  status: "loading",
  source: "mock",
  setMarketCap: (value, source) =>
    set({
      marketCap: value,
      progress: Math.min(value / TOKEN_CONFIG.targetMarketCap, 1),
      source,
    }),
  setStatus: (status) => set({ status }),
}));
