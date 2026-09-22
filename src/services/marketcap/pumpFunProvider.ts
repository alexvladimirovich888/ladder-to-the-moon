import type { MarketCapProvider, MarketCapSnapshot } from "./types";

interface PumpFunCoin {
  usd_market_cap?: number;
  market_cap_usd?: number;
}

/**
 * Primary Solana market-cap adapter for pump.fun tokens — reads the
 * platform's own live market cap, which is faster and more accurate for
 * pump.fun bonding-curve / PumpSwap tokens than aggregator APIs.
 */
export class PumpFunProvider implements MarketCapProvider {
  constructor(private readonly contractAddress: string) {}

  async getMarketCap(): Promise<MarketCapSnapshot> {
    const res = await fetch(
      `https://frontend-api-v3.pump.fun/coins/${this.contractAddress}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`pump.fun request failed: ${res.status}`);
    }

    const data: PumpFunCoin = await res.json();
    const marketCap = data.usd_market_cap ?? data.market_cap_usd;

    if (!marketCap || Number.isNaN(marketCap)) {
      throw new Error("Market cap not available in pump.fun response");
    }

    return {
      value: marketCap,
      timestamp: Date.now(),
      source: "pumpfun",
    };
  }
}
