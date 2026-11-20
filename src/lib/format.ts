/**
 * Swiss number formatting: 175’000 (typographic apostrophe as thousands separator).
 */
export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "’");
}

/** «CHF 124’900» */
export function formatChf(value: number): string {
  return `CHF ${formatNumber(value)}`;
}

/** «CHF 1’400.–» (Swiss style for round amounts) */
export function formatChfRound(value: number): string {
  return `CHF ${formatNumber(value)}.–`;
}

/** «57’500 km» */
export function formatKm(value: number): string {
  return `${formatNumber(value)} km`;
}
