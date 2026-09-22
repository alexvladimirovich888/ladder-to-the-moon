import { MARKET_CAP_CONFIG, MILESTONES, TOKEN_CONFIG } from "@/config";
import { useMarketCapStore } from "@/store/marketCapStore";
import { DexscreenerProvider } from "./dexscreenerProvider";
import { PumpFunProvider } from "./pumpFunProvider";
import { MockMarketCapProvider } from "./mockProvider";
import type { MarketCapProvider } from "./types";

const mockProvider: MarketCapProvider = new MockMarketCapProvider();
// pump.fun's own API reflects trades fastest; Dexscreener is the secondary
// cross-check, and mock is the last-resort fallback if both are down.
const primaryProvider: MarketCapProvider = new PumpFunProvider(
  TOKEN_CONFIG.contractAddress
);
const secondaryProvider: MarketCapProvider = new DexscreenerProvider(
  TOKEN_CONFIG.contractAddress
);

let pollTimer: ReturnType<typeof setInterval> | null = null;
let lastMilestoneIndex = -1;
let started = false;

function checkMilestones(value: number) {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (value >= MILESTONES[i]) {
      if (i > lastMilestoneIndex) {
        lastMilestoneIndex = i;
        const milestone = MILESTONES[i];
        window.dispatchEvent(
          new CustomEvent("milestone-reached", { detail: { milestone } })
        );
        if (milestone >= TOKEN_CONFIG.targetMarketCap) {
          window.dispatchEvent(new CustomEvent("target-reached"));
        }
      }
      break;
    }
  }
}

async function tick() {
  const { setMarketCap, setStatus } = useMarketCapStore.getState();

  if (MARKET_CAP_CONFIG.useMockProvider) {
    const snapshot = await mockProvider.getMarketCap();
    setMarketCap(snapshot.value, snapshot.source);
    setStatus("ok");
    checkMilestones(snapshot.value);
    return;
  }

  try {
    const snapshot = await primaryProvider.getMarketCap();
    setMarketCap(snapshot.value, snapshot.source);
    setStatus("ok");
    checkMilestones(snapshot.value);
    return;
  } catch (err) {
    console.warn("[marketcap] pump.fun provider failed, trying Dexscreener", err);
  }

  try {
    const snapshot = await secondaryProvider.getMarketCap();
    setMarketCap(snapshot.value, snapshot.source);
    setStatus("ok");
    checkMilestones(snapshot.value);
    return;
  } catch (err) {
    console.warn("[marketcap] Dexscreener provider failed, falling back to mock", err);
  }

  try {
    const snapshot = await mockProvider.getMarketCap();
    setMarketCap(snapshot.value, "mock-fallback");
    setStatus("ok");
    checkMilestones(snapshot.value);
  } catch {
    setStatus("error");
  }
}

export function startMarketCapService() {
  if (started) return;
  started = true;
  tick();
  pollTimer = setInterval(tick, MARKET_CAP_CONFIG.pollIntervalMs);
}

export function stopMarketCapService() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
  started = false;
}
