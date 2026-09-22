export const SITE_CONFIG = {
  name: "LADDER TO THE MOON",
  subtitle: "A journey to $1M",
};

export const TOKEN_CONFIG = {
  contractAddress: "3wMj4yBCGoV4fBJKdhHHCP9ZR1npcoBb6FQpCbSLpump",
  targetMarketCap: 1_000_000,
  // Change this to the real Axiom trade URL for this token when available.
  axiomUrl:
    "https://axiom.trade/t/3wMj4yBCGoV4fBJKdhHHCP9ZR1npcoBb6FQpCbSLpump",
};

export const MARKET_CAP_CONFIG = {
  // Live pump.fun data is used by default (Dexscreener as secondary
  // cross-check); mock is only the last-resort fallback if both fail.
  useMockProvider: false,
  // Polling interval in ms — kept short so the UI feels near-instant.
  pollIntervalMs: 2500,
  // Mock provider config: simulates organic growth toward the target.
  mock: {
    startValue: 42_000,
    volatility: 0.06,
    driftPerTick: 9_000,
  },
};

export const MILESTONES = [0, 250_000, 500_000, 750_000, 1_000_000];

export const LADDER_CONFIG = {
  // Maximum number of steps rendered at 100% progress.
  maxSteps: 140,
  stepHeight: 0.42,
  stepDepth: 0.5,
  stepWidth: 2.1,
  // Total vertical distance the ladder can travel, in world units.
  maxHeight: 58.8,
};
