import { pointsFor } from "@/lib/score";

/**
 * Vertical meter beside the question. It fills with correct answers and drains over time;
 * the label shows what the next first-try correct answer is worth.
 */
export default function ScoreMeter({ meter }: { meter: number }) {
  const full = meter >= 100;
  const fill = full ? "bg-correct" : meter >= 50 ? "bg-foreground" : "bg-muted";

  return (
    <div
      className="flex w-12 shrink-0 flex-col items-center gap-3"
      role="meter"
      aria-label="Score meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(meter)}
    >
      <span className="flex flex-col items-center">
        <span className={`text-lg font-semibold tabular-nums ${full ? "text-correct" : ""}`}>
          +{pointsFor(meter)}
        </span>
        <span className="text-xs text-muted">next</span>
      </span>
      <div className="relative h-72 w-3 overflow-hidden rounded-full bg-line">
        <div
          className={`absolute inset-x-0 bottom-0 rounded-full transition-[height] duration-100 ease-linear ${fill}`}
          style={{ height: `${meter}%` }}
        />
        <div className="absolute inset-x-0 bottom-1/2 h-px bg-background" />
      </div>
    </div>
  );
}
