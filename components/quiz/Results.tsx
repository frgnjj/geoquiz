"use client";

import Image from "next/image";
import Link from "next/link";
import { displayAnswer, type Mode } from "@/lib/answers";
import { regionLabel, timeOption, type Settings } from "@/lib/quiz";
import type { Result } from "./Game";

type Props = {
  mode: Mode;
  settings: Settings;
  results: Result[];
  total: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
};

export default function Results({
  mode,
  settings,
  results,
  total,
  onPlayAgain,
  onChangeSettings,
}: Props) {
  const correct = results.filter((r) => r.correct).length;
  const missed = results.filter((r) => !r.correct);
  const finishedAll = results.length === total;

  return (
    <div className="mx-auto w-full max-w-3xl pt-8">
      <p className="text-sm font-medium uppercase tracking-wider text-muted">
        {mode === "flags" ? "Flags" : "Capitals"} · {regionLabel(settings.continents)} ·{" "}
        {timeOption(settings.timeId).label} ·{" "}
        {settings.answerMode === "choice" ? "Multiple choice" : "Typed"}
      </p>
      <h1 className="mt-4 text-6xl font-semibold tracking-tight">
        {correct} right out of {results.length}
      </h1>
      <p className="mt-3 text-lg text-muted">
        {finishedAll
          ? `You got through all ${total} countries before time ran out.`
          : `Time ran out with ${total - results.length} of ${total} countries left.`}
      </p>

      <div className="mt-10 flex gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-xl bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onChangeSettings}
          className="rounded-xl border border-line bg-surface px-6 py-3 font-medium transition-colors hover:border-foreground"
        >
          Change settings
        </button>
        <Link
          href="/"
          className="rounded-xl px-6 py-3 font-medium text-muted transition-colors hover:text-foreground"
        >
          Home
        </Link>
      </div>

      {missed.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            Missed ({missed.length})
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
            {missed.map(({ country }) => (
              <li key={country.code} className="flex items-center gap-3">
                <Image
                  src={`/flags/${country.code}.svg`}
                  alt=""
                  width={32}
                  height={24}
                  unoptimized
                  className="rounded-sm border border-line"
                />
                <span>
                  {country.name}
                  {mode === "capitals" && (
                    <span className="text-muted"> · {displayAnswer(country, mode)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
