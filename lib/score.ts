// Score and meter rules (agreed with the owner, see CLAUDE.md).

export const METER_RISE = 20; // % added per correct answer
export const METER_DRAIN_PER_SECOND = 5; // % lost per second
export const METER_FULL_HOLD_MS = 3000; // a full meter pauses draining this long

/** Points for a first-try correct answer, based on the meter *before* the answer. */
export function pointsFor(meter: number): number {
  if (meter >= 100) return 25;
  if (meter >= 50) return 15;
  if (meter > 0) return 10;
  return 5;
}
