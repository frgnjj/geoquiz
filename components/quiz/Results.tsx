"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { displayAnswer, type Mode } from "@/lib/answers";
import type { Settings } from "@/lib/quiz";
import type { Result } from "./Game";
import GameSummary from "./GameSummary";

type Props = {
  mode: Mode;
  settings: Settings;
  results: Result[];
  total: number;
  score: number;
  onPlayAgain: () => void;
  onChangeSettings: () => void;
};

export default function Results({
  mode,
  settings,
  results,
  total,
  score,
  onPlayAgain,
  onChangeSettings,
}: Props) {
  const correct = results.filter((r) => r.correct).length;
  const missed = results.filter((r) => !r.correct);
  const finishedAll = results.length === total;

  return (
    // Phones: result, score and buttons, then your run and misses, then the settings summary.
    <div className="flex flex-col gap-6 pt-2 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-14 lg:pt-8">
      <aside className="contents lg:block">
        <div className="order-1">
        <h1 className="text-5xl leading-[1.05] lg:text-6xl font-semibold tracking-[-0.03em] text-balance">
          <span className="tabular-nums">{correct}</span> right out of{" "}
          <span className="tabular-nums">{results.length}</span>
        </h1>
        <p className="mt-3 text-lg text-muted">
          {finishedAll
            ? `You got through all ${total} countries before time ran out.`
            : `Time ran out with ${total - results.length} of ${total} countries left.`}
        </p>

        <div className="mt-8 flex items-baseline justify-between rounded-2xl border border-line bg-surface px-6 py-5 shadow-sheet">
          <span className="text-muted">Score</span>
          <span className="text-4xl font-semibold tracking-tight tabular-nums">{score}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full rounded-xl bg-foreground py-4 text-lg font-medium text-background transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            Play again
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onChangeSettings}
              className="rounded-xl border border-line bg-surface py-3 font-medium shadow-sheet transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-foreground hover:shadow-lifted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground motion-safe:hover:-translate-y-0.5"
            >
              Change settings
            </button>
            <Link
              href="/"
              className="rounded-xl py-3 text-center font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              Home
            </Link>
          </div>
        </div>

        </div>

        <div className="order-3 lg:mt-10">
          <GameSummary settings={settings} questions={total} />
        </div>
      </aside>

      <div className="order-2 flex flex-col gap-6">
        <Card title="Your run" note={`${results.length} of ${total} asked`}>
          {/* One dot per country, in the order asked: green right, red missed, empty not reached. */}
          <ol className="flex flex-wrap gap-1.5" aria-label={`${correct} right, ${missed.length} missed`}>
            {Array.from({ length: total }, (_, i) => {
              const result = results[i];
              const color = !result ? "bg-line" : result.correct ? "bg-correct" : "bg-wrong";
              return <li key={i} className={`size-2.5 rounded-full ${color}`} />;
            })}
          </ol>
        </Card>

        <Card title="Missed" note={missed.length > 0 ? `${missed.length}` : undefined}>
          {results.length === 0 ? (
            <p className="text-lg">Time ran out before the first answer.</p>
          ) : missed.length === 0 ? (
            <p className="text-lg">
              Nothing missed. Every country you were asked, you got right.
            </p>
          ) : (
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:gap-y-5">
              {missed.map(({ country }) => (
                <li key={country.code} className="flex items-center gap-4">
                  <Image
                    src={`/flags/${country.code}.svg`}
                    alt=""
                    width={48}
                    height={36}
                    unoptimized
                    className="shrink-0 rounded-[3px] shadow-flag ring-1 ring-line"
                  />
                  <span className="leading-snug">
                    <span className="block font-medium">{country.name}</span>
                    {mode === "capitals" && (
                      <span className="block text-sm text-muted">{displayAnswer(country, mode)}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-sheet lg:p-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">{title}</h2>
        {note && <span className="text-sm text-muted tabular-nums">{note}</span>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
