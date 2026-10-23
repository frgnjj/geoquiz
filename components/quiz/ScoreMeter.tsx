import { pointsFor } from "@/lib/score";

// Where each points zone sits on the meter, as a % from the bottom.
const ZONES = [
  { points: 25, at: 100 },
  { points: 15, at: 75 },
  { points: 10, at: 25 },
  { points: 5, at: 0 },
];

/**
 * Vertical meter beside the question. It fills with correct answers and drains over time;
 * the label shows what the next first-try correct answer is worth, and the side marks
 * show what each level is worth.
 */
export default function ScoreMeter({
  meter,
  layout = "vertical",
}: {
  meter: number;
  /** Phones show it sideways, under the top bar. */
  layout?: "vertical" | "horizontal";
}) {
  const full = meter >= 100;
  const next = pointsFor(meter);
  const fill = full ? "bg-correct" : meter >= 50 ? "bg-foreground" : "bg-muted";
  const zoneClass = (points: number) =>
    points === next
      ? points === 25
        ? "font-semibold text-correct"
        : "font-semibold text-foreground"
      : "text-muted";

  if (layout === "horizontal") {
    return (
      <div
        className="flex items-start gap-3"
        role="meter"
        aria-label={`Score meter: next right answer is worth ${next} points`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(meter)}
      >
        <span className="flex w-10 shrink-0 flex-col items-center leading-none">
          <span className={`text-base font-semibold tabular-nums ${full ? "text-correct" : ""}`}>
            +{next}
          </span>
          <span className="mt-0.5 text-xs text-muted">next</span>
        </span>
        <div className="flex-1 pt-1">
          <div
            key={full ? "full" : "filling"}
            className={`relative h-2.5 overflow-hidden rounded-full bg-line ${
              full ? "motion-safe:animate-meter-full-x" : ""
            }`}
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-150 ease-linear ${fill}`}
              style={{ width: `${meter}%` }}
            />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-background" />
          </div>
          <div className="relative mt-1 h-4" aria-hidden="true">
            {ZONES.map((zone) => (
              <span
                key={zone.points}
                className={`absolute text-xs tabular-nums transition-colors ${zoneClass(zone.points)} ${
                  zone.at === 0 ? "" : zone.at === 100 ? "-translate-x-full" : "-translate-x-1/2"
                }`}
                style={{ left: `${zone.at}%` }}
              >
                +{zone.points}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex w-16 shrink-0 flex-col items-center gap-3"
      role="meter"
      aria-label={`Score meter: next right answer is worth ${next} points`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(meter)}
    >
      <span className="flex flex-col items-center">
        <span className={`text-xl font-semibold tabular-nums ${full ? "text-correct" : ""}`}>
          +{next}
        </span>
        <span className="text-xs text-muted">next</span>
      </span>
      <div className="relative">
        {/* Re-keyed when it fills, so the pop plays each time. */}
        <div
          key={full ? "full" : "filling"}
          className={`relative h-80 w-4 overflow-hidden rounded-full bg-line ${
            full ? "motion-safe:animate-meter-full" : ""
          }`}
        >
          <div
            className={`absolute inset-x-0 bottom-0 rounded-full transition-[height,background-color] duration-150 ease-linear ${fill}`}
            style={{ height: `${meter}%` }}
          />
          <div className="absolute inset-x-0 bottom-1/2 h-0.5 bg-background" />
        </div>
        <div className="absolute inset-y-0 left-full ml-2.5" aria-hidden="true">
          {ZONES.map((zone) => (
            <span
              key={zone.points}
              className={`absolute translate-y-1/2 text-xs tabular-nums transition-colors ${zoneClass(zone.points)}`}
              style={{ bottom: `${zone.at}%` }}
            >
              +{zone.points}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
