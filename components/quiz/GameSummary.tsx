import type { ReactNode } from "react";
import type { Mode } from "@/lib/answers";
import { answerLabel, PLAY_MODE_LABELS, playMode, regionLabel, timeOption, triesFor, type Settings } from "@/lib/quiz";

const TRIES = ["", "one try", "two tries", "three tries"];

/** The chosen settings as a short list, shown beside the settings and on the end screen. */
export default function GameSummary({
  mode,
  settings,
  questions,
}: {
  mode: Mode;
  settings: Settings;
  questions: number;
}) {
  const time = timeOption(settings.timeId);
  const tries = triesFor(settings);
  return (
    <dl className="divide-y divide-line border-y border-line text-sm">
      <Row label="Mode">{PLAY_MODE_LABELS[playMode(settings)]}</Row>
      <Row label="Region">{regionLabel(settings.continents)}</Row>
      <Row label="Questions">
        <span className="tabular-nums">{questions}</span> countries
      </Row>
      <Row label="Answer">
        {answerLabel(mode, settings.answerMode)}, {TRIES[tries]}
      </Row>
      <Row label="Time">
        {time.label}
        {time.bonus > 0 && `, +${time.bonus}s per right answer`}
      </Row>
    </dl>
  );
}

/** The same choices on one line, for the phone's bottom bar. */
export function summaryLine(mode: Mode, settings: Settings, questions: number): string {
  const time = timeOption(settings.timeId);
  return [
    playMode(settings) !== "practice" && PLAY_MODE_LABELS[playMode(settings)],
    regionLabel(settings.continents),
    `${questions} countries`,
    answerLabel(mode, settings.answerMode),
    TRIES[triesFor(settings)],
    time.bonus > 0 ? `${time.label} +${time.bonus}s` : time.label,
  ]
    .filter(Boolean)
    .join(" · ");
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
