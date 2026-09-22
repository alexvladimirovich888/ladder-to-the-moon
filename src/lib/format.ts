export function formatCurrency(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `$${Math.round(safe).toLocaleString("en-US")}`;
}

export function formatMilestoneLabel(value: number): string {
  if (value === 0) return "$0";
  if (value >= 1_000_000) return `$${value / 1_000_000}M`;
  return `$${value / 1_000}K`;
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${Math.round(value)}`;
}
