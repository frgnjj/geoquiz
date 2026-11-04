"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { COUNTRIES, CONTINENTS, type Continent } from "@/data/countries";
import type { Mode } from "@/lib/answers";
import {
  availableTimes,
  countriesFor,
  HARDCORE_LOCKS,
  MIN_QUESTIONS,
  PLAY_MODE_LABELS,
  playMode as playModeOf,
  RANKED_LOCKS,
  TIME_OPTIONS,
  TYPE_IN_TRIES,
  type AnswerMode,
  type PlayMode,
  type Settings,
} from "@/lib/quiz";

import { ArrowLeftIcon } from "@/components/icons";
import GameSummary, { summaryLine } from "./GameSummary";

type Props = {
  mode: Mode;
  initial: Settings;
  onStart: (settings: Settings) => void;
};

const QUICK_PICKS = [10, 25, 50];

const PLAY_MODES: PlayMode[] = ["practice", "ranked", "hardcore"];

const PLAY_MODE_NOTES: Record<PlayMode, string> = {
  practice: "Any settings you like. Scores aren't saved.",
  ranked: "World or one continent, every country, 5 min +5s per right answer, no retry. Your best score goes on the leaderboard.",
  hardcore: `Name all ${COUNTRIES.length} countries in 1 min, +5s per right answer. One try per question, and the meter rises and drains 10% slower. Your best goes on the Hardcore leaderboard.`,
};

export default function SettingsScreen({ mode, initial, onStart }: Props) {
  const [playMode, setPlayMode] = useState<PlayMode>(playModeOf(initial));
  const [continents, setContinents] = useState<Continent[]>(initial.ranked ? [] : initial.continents);
  // Ranked keeps its own region (World or one continent), so practice choices survive switching.
  const [rankedRegion, setRankedRegion] = useState<Continent[]>(initial.ranked ? initial.continents : []);
  const [answerMode, setAnswerMode] = useState<AnswerMode>(initial.answerMode);
  const [timeId, setTimeId] = useState(initial.timeId);
  const [retry, setRetry] = useState(initial.retry);
  const [questionCount, setQuestionCount] = useState(
    initial.questionCount ?? countriesFor(initial.ranked ? [] : initial.continents).length,
  );

  const hardcore = playMode === "hardcore";
  const ranked = playMode === "ranked";
  const locked = playMode !== "practice";
  const lockedHint = `Set by ${PLAY_MODE_LABELS[playMode]}.`;

  const times = availableTimes(continents);
  // The 1 minute option disappears when the region changes; fall back to 3 minutes.
  const activeTimeId = times.some((t) => t.id === timeId) ? timeId : "3";
  const countryCount = countriesFor(continents).length;

  // Ranked and Hardcore lock most settings; the practice choices are kept for switching back.
  const chosen: Settings = hardcore
    ? { ...HARDCORE_LOCKS, answerMode, ranked: false, hardcore: true }
    : ranked
      ? { ...RANKED_LOCKS, continents: rankedRegion, answerMode, ranked: true, hardcore: false }
      : { continents, answerMode, timeId: activeTimeId, retry, questionCount, ranked: false, hardcore: false };
  const shownContinents = chosen.continents;
  const shownMax = countriesFor(shownContinents).length;
  const shownCount = locked ? shownMax : questionCount;

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

  const startLabel = locked ? `Start ${PLAY_MODE_LABELS[playMode]}` : "Start";

  return (
    // Phones: one column (title, settings, Mode) with Start in a bar fixed to the bottom.
    // Desktop: the title, summary, Start and Mode in a left column beside the settings.
    <div className="flex flex-col gap-6 pt-2 pb-36 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-14 lg:pt-8 lg:pb-0">
      {/* On desktop the column stays in view while the settings scroll, when the window is tall enough. */}
      <aside className="contents lg:sticky lg:top-8 lg:block lg:[@media(max-height:820px)]:static">
        <div className="order-1">
        <Link
          href="/"
          className="-ml-3 mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-line/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>
        <h1 className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] lg:text-6xl">
          {mode === "flags" ? "Flags" : "Capitals"}
        </h1>
        <p className="mt-3 text-lg text-muted">
          {mode === "flags"
            ? "See a flag, name the country."
            : "See a country, name its capital."}
        </p>

        </div>

        <div className="mt-10 hidden lg:block">
          <GameSummary settings={chosen} questions={shownCount} />
        </div>

        <button
          type="button"
          onClick={() => onStart(chosen)}
          className="mt-8 hidden w-full lg:block rounded-xl bg-foreground py-4 text-lg font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          {startLabel}
        </button>

        <section className="order-3 rounded-2xl border border-line bg-surface p-6 shadow-sheet lg:mt-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Mode</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLAY_MODES.map((m) => (
              <Chip key={m} selected={playMode === m} onClick={() => setPlayMode(m)}>
                {PLAY_MODE_LABELS[m]}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{PLAY_MODE_NOTES[playMode]}</p>
        </section>
      </aside>

      <div className="order-2 flex flex-col gap-6">
        <Card>
          <Setting
            title="Region"
            hint={
              hardcore
                ? lockedHint
                : ranked
                  ? "Ranked: pick World or one continent."
                  : "Pick World, or up to five continents."
            }
          >
            <Chip
              selected={shownContinents.length === 0}
              disabled={hardcore}
              onClick={() => (ranked ? setRankedRegion([]) : changeRegion([]))}
            >
              World
            </Chip>
            {CONTINENTS.map((continent) => {
              const selected = shownContinents.includes(continent);
              const blocked = !ranked && !selected && continents.length === CONTINENTS.length - 1;
              return (
                <Chip
                  key={continent}
                  selected={selected}
                  disabled={hardcore || blocked}
                  title={blocked ? "All six continents is the same as World" : undefined}
                  onClick={() => (ranked ? setRankedRegion([continent]) : toggleContinent(continent))}
                >
                  {continent}
                </Chip>
              );
            })}
          </Setting>

          <Setting
            title="Questions"
            hint={
              locked
                ? lockedHint
                : `How many countries to name, from ${MIN_QUESTIONS} to ${countryCount}.`
            }
          >
            <QuestionSlider
              value={shownCount}
              max={shownMax}
              disabled={locked}
              onChange={setQuestionCount}
            />
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
              hardcore
                ? "Hardcore gives one try per question."
                : answerMode === "type"
                  ? `Typed answers always get ${TYPE_IN_TRIES} tries.`
                  : ranked
                    ? lockedHint
                    : "Get a second try when you pick the wrong answer."
            }
          >
            <Chip
              selected={answerMode === "choice" && !chosen.retry}
              disabled={locked || answerMode === "type"}
              onClick={() => setRetry(false)}
            >
              Off
            </Chip>
            <Chip
              selected={answerMode === "choice" && chosen.retry}
              disabled={locked || answerMode === "type"}
              onClick={() => setRetry(true)}
            >
              On
            </Chip>
          </Setting>
        </Card>

        <Card>
          <Setting
            title="Time"
            hint={
              locked
                ? lockedHint
                : "Timed games marked +5s add five seconds for every correct answer."
            }
          >
            {(locked ? TIME_OPTIONS.filter((t) => t.id === chosen.timeId) : times).map((t) => (
              <Chip
                key={t.id}
                selected={chosen.timeId === t.id}
                disabled={locked}
                onClick={() => setTimeId(t.id)}
              >
                {t.label}
                {t.bonus > 0 && <span className="ml-1.5 opacity-60">+{t.bonus}s</span>}
              </Chip>
            ))}
          </Setting>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <p className="truncate text-center text-xs text-muted">{summaryLine(chosen, shownCount)}</p>
        <button
          type="button"
          onClick={() => onStart(chosen)}
          className="mt-2 w-full rounded-xl bg-foreground py-3.5 text-lg font-medium text-background transition-opacity active:opacity-80"
        >
          {startLabel}
        </button>
      </div>
    </div>
  );
}

/** The question count: a slider whose number rides on the handle, plus quick picks below. */
function QuestionSlider({
  value,
  max,
  disabled,
  onChange,
}: {
  value: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  // How far along the slider is, so its track fills up to the thumb.
  const fill = max > MIN_QUESTIONS ? ((value - MIN_QUESTIONS) / (max - MIN_QUESTIONS)) * 100 : 100;
  const picks = [...QUICK_PICKS.filter((n) => n < max), max];

  return (
    <div className="w-full">
      <div className={`relative pt-11 ${disabled ? "opacity-40" : ""}`} style={{ "--fill": `${fill}%` } as CSSProperties}>
        {/* The number sits above the handle; 14px is half the handle's width. */}
        <span
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border border-line bg-surface px-2.5 py-1 text-lg font-semibold tabular-nums shadow-sheet"
          style={{ left: `calc(${fill / 100} * (100% - 28px) + 14px)` }}
        >
          {value}
        </span>
        <input
          type="range"
          min={MIN_QUESTIONS}
          max={max}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Number of countries to name"
          className="range w-full"
        />
        <div className="mt-2 flex justify-between text-xs text-muted tabular-nums">
          <span>{MIN_QUESTIONS}</span>
          <span>{max}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {picks.map((n) => (
          <Chip key={n} selected={value === n} disabled={disabled} onClick={() => onChange(n)}>
            {n === max ? `All ${max}` : n}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8 rounded-2xl border border-line bg-surface p-6 shadow-sheet lg:gap-9 lg:p-8">
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
