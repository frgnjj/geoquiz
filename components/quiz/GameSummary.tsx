import type { ReactNode } from "react";
import { regionLabel, timeOption, triesFor, type Settings } from "@/lib/quiz";

const TRIES = ["", "one try", "two tries", "three tries"];

/** The chosen settings as a short list, shown beside the settings and on the end screen. */
export default function GameSummary({ settings, questions }: { settings: Settings; questions: number }) {
  const time = timeOption(settings.timeId);
  const tries = triesFor(settings);
  return (
    <dl className="divide-y divide-line border-y border-line text-sm">
      {settings.hardcore && <Row label="Mode">Hardcore</Row>}
      <Row label="Region">{regionLabel(settings.continents)}</Row>
      <Row label="Questions">
        <span className="tabular-nums">{questions}</span> countries
      </Row>
      <Row label="Answer">
        {settings.answerMode === "choice" ? "Multiple choice" : "Type it in"}, {TRIES[tries]}
      </Row>
      <Row label="Time">
        {time.label}
        {time.bonus > 0 && `, +${time.bonus}s per right answer`}
      </Row>
    </dl>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
