import type { MarketCapProvider, MarketCapSnapshot } from "./types";

interface DexscreenerPair {
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
}

interface DexscreenerResponse {
  pairs?: DexscreenerPair[];
}

/**
 * Real Solana market-cap adapter backed by the public Dexscreener API.
 * Swap this out for another Solana market-data source without touching
 * any consumer code — it only needs to fulfil MarketCapProvider.
 */
export class DexscreenerProvider implements MarketCapProvider {
  constructor(private readonly contractAddress: string) {}

  async getMarketCap(): Promise<MarketCapSnapshot> {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${this.contractAddress}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Dexscreener request failed: ${res.status}`);
    }

    const data: DexscreenerResponse = await res.json();
    const pairs = data.pairs;

    if (!pairs || pairs.length === 0) {
      throw new Error("No trading pairs found for token");
    }

    const best = pairs.reduce((a, b) =>
      (b.liquidity?.usd ?? 0) > (a.liquidity?.usd ?? 0) ? b : a
    );

    const marketCap = best.marketCap ?? best.fdv;

    if (!marketCap || Number.isNaN(marketCap)) {
      throw new Error("Market cap not available in response");
    }

    return {
      value: marketCap,
      timestamp: Date.now(),
      source: "dexscreener",
    };
  }
}
