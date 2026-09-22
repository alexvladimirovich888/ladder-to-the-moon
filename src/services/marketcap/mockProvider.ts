import { MARKET_CAP_CONFIG, TOKEN_CONFIG } from "@/config";
import type { MarketCapProvider, MarketCapSnapshot } from "./types";

/**
 * Simulates organic market cap growth so the 3D mechanic works fully
 * without any live API connected.
 */
export class MockMarketCapProvider implements MarketCapProvider {
  private value: number;

  constructor() {
    this.value = MARKET_CAP_CONFIG.mock.startValue;
  }

  async getMarketCap(): Promise<MarketCapSnapshot> {
    const { driftPerTick, volatility } = MARKET_CAP_CONFIG.mock;
    const noise = (Math.random() * 2 - 1) * driftPerTick * volatility * 6;
    const next = this.value + driftPerTick + noise;
    this.value = Math.max(0, Math.min(next, TOKEN_CONFIG.targetMarketCap * 1.02));

    return {
      value: Math.round(this.value),
      timestamp: Date.now(),
      source: "mock",
    };
  }
}
