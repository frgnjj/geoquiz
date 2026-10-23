"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { CONTINENTS, type Continent } from "@/data/countries";
import type { Mode } from "@/lib/answers";
import {
  availableTimes,
  countriesFor,
  MIN_QUESTIONS,
  TYPE_IN_TRIES,
  type AnswerMode,
  type Settings,
} from "@/lib/quiz";

import GameSummary from "./GameSummary";

type Props = {
  mode: Mode;
  initial: Settings;
  onStart: (settings: Settings) => void;
};

export default function SettingsScreen({ mode, initial, onStart }: Props) {
  const [continents, setContinents] = useState<Continent[]>(initial.continents);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(initial.answerMode);
  const [timeId, setTimeId] = useState(initial.timeId);
  const [retry, setRetry] = useState(initial.retry);
  const [questionCount, setQuestionCount] = useState(
    initial.questionCount ?? countriesFor(initial.continents).length,
  );

  const times = availableTimes(continents);
  // The 1 minute option disappears when the region changes; fall back to 3 minutes.
  const activeTimeId = times.some((t) => t.id === timeId) ? timeId : "3";
  const countryCount = countriesFor(continents).length;
  const chosen: Settings = { continents, answerMode, timeId: activeTimeId, retry, questionCount };

  // Changing the region resets the slider to the new maximum.
  function changeRegion(next: Continent[]) {
    setContinents(next);
    setQuestionCount(countriesFor(next).length);
  }

  function toggleContinent(continent: Continent) {
    changeRegion(
      continents.includes(continent)
        ? continents.filter((c) => c !== continent)
        : [...continents, continent],
    );
  }

  // How far along the slider is, so its track fills up to the thumb.
  const sliderFill = countryCount > MIN_QUESTIONS
    ? ((questionCount - MIN_QUESTIONS) / (countryCount - MIN_QUESTIONS)) * 100
    : 100;

  return (
    <div className="grid grid-cols-[22rem_minmax(0,1fr)] items-start gap-14 pt-8">
      {/* The summary and Start stay in view while the settings scroll. */}
      <aside className="sticky top-8">
        <h1 className="text-6xl leading-[1.05] font-semibold tracking-[-0.03em]">
          {mode === "flags" ? "Flags" : "Capitals"}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {mode === "flags"
            ? "See a flag, name the country."
            : "See a country, name its capital."}
        </p>

        <div className="mt-10">
          <GameSummary settings={chosen} questions={questionCount} />
        </div>

        <button
          type="button"
          onClick={() => onStart(chosen)}
          className="mt-8 w-full rounded-xl bg-foreground py-4 text-lg font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          Start
        </button>
      </aside>

      <div className="flex flex-col gap-6">
        <Card>
          <Setting title="Region" hint="Pick World, or up to five continents.">
            <Chip selected={continents.length === 0} onClick={() => changeRegion([])}>
              World
            </Chip>
            {CONTINENTS.map((continent) => {
              const selected = continents.includes(continent);
              const blocked = !selected && continents.length === CONTINENTS.length - 1;
              return (
                <Chip
                  key={continent}
                  selected={selected}
                  disabled={blocked}
                  title={blocked ? "All six continents is the same as World" : undefined}
                  onClick={() => toggleContinent(continent)}
                >
                  {continent}
                </Chip>
              );
            })}
          </Setting>

          <Setting
            title="Questions"
            hint={`How many countries to name, from ${MIN_QUESTIONS} to ${countryCount}.`}
          >
            <label className="flex w-full items-center gap-6">
              <span className="w-24 shrink-0">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">
                  {questionCount}
                </span>
                <span className="text-sm text-muted tabular-nums"> / {countryCount}</span>
              </span>
              <input
                type="range"
                min={MIN_QUESTIONS}
                max={countryCount}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                aria-label="Number of countries to name"
                style={{ "--fill": `${sliderFill}%` } as CSSProperties}
                className="range flex-1"
              />
            </label>
          </Setting>
        </Card>

        <Card>
          <Setting title="Answer">
            <Chip selected={answerMode === "choice"} onClick={() => setAnswerMode("choice")}>
              Multiple choice
            </Chip>
            <Chip selected={answerMode === "type"} onClick={() => setAnswerMode("type")}>
              Type it in
            </Chip>
          </Setting>

          <Setting
            title="Retry"
            hint={
              answerMode === "choice"
                ? "Get a second try when you pick the wrong answer."
                : `Typed answers always get ${TYPE_IN_TRIES} tries.`
            }
          >
            <Chip
              selected={answerMode === "choice" && !retry}
              disabled={answerMode === "type"}
              onClick={() => setRetry(false)}
            >
              Off
            </Chip>
            <Chip
              selected={answerMode === "choice" && retry}
              disabled={answerMode === "type"}
              onClick={() => setRetry(true)}
            >
              On
            </Chip>
          </Setting>
        </Card>

        <Card>
          <Setting
            title="Time"
            hint="Timed games marked +5s add five seconds for every correct answer."
          >
            {times.map((t) => (
              <Chip key={t.id} selected={activeTimeId === t.id} onClick={() => setTimeId(t.id)}>
                {t.label}
                {t.bonus > 0 && <span className="ml-1.5 opacity-60">+{t.bonus}s</span>}
              </Chip>
            ))}
          </Setting>
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-9 rounded-2xl border border-line bg-surface p-8 shadow-sheet">
      {children}
    </div>
  );
}

function Setting({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
      {hint && <p className="mt-3 text-sm text-muted">{hint}</p>}
    </section>
  );
}

function Chip({
  selected,
  disabled,
  title,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-line bg-surface hover:border-foreground disabled:hover:border-line"
      }`}
    >
      {children}
    </button>
  );
}
