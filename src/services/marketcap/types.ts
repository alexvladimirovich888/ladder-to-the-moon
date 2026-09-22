export type MarketCapSource = "mock" | "mock-fallback" | "dexscreener" | "pumpfun";

export interface MarketCapSnapshot {
  value: number;
  timestamp: number;
  source: MarketCapSource;
}

export interface MarketCapProvider {
  getMarketCap(): Promise<MarketCapSnapshot>;
}
