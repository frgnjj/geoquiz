// Score and meter rules (agreed with the owner, see CLAUDE.md).

export const METER_RISE = 20; // % added per correct answer
export const METER_DRAIN_PER_SECOND = 5; // % lost per second
export const METER_FULL_HOLD_MS = 3000; // a full meter pauses draining this long
export const HARDCORE_METER_SPEED = 0.9; // Hardcore: the meter rises and drains 10% slower
export const MAPS_DRAIN_SPEED = 0.9; // Maps: the meter drains 10% slower, leaving time to pan and zoom

/** How fast the meter rises per correct answer and drains per second. */
export function meterRates(hardcore: boolean, maps = false) {
  const speed = hardcore ? HARDCORE_METER_SPEED : 1;
  const drain = METER_DRAIN_PER_SECOND * speed * (maps ? MAPS_DRAIN_SPEED : 1);
  return { rise: METER_RISE * speed, drain };
}

/** Points for a first-try correct answer, based on the meter *before* the answer. */
export function pointsFor(meter: number): number {
  if (meter >= 100) return 25;
  if (meter >= 50) return 15;
  if (meter > 0) return 10;
  return 5;
}
