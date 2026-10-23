"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Country } from "@/data/countries";
import { displayAnswer, isCorrect, type Mode } from "@/lib/answers";
import {
  countriesFor,
  makeChoices,
  MAX_PAUSES,
  shuffle,
  timeOption,
  triesFor,
  type Settings,
} from "@/lib/quiz";
import { meterRates, METER_FULL_HOLD_MS, pointsFor } from "@/lib/score";
import { setQuizActive } from "@/lib/quizActive";
import { PauseIcon, PlayIcon } from "@/components/icons";
import ScoreMeter from "./ScoreMeter";
import QuitButton from "./QuitButton";

export type Result = {
  country: Country;
  correct: boolean;
};

type Feedback = null | "correct" | "reveal";

const CORRECT_PAUSE_MS = 700;
const REVEAL_PAUSE_MS = 1800;

type Props = {
  mode: Mode;
  settings: Settings;
  onFinish: (results: Result[], total: number, score: number) => void;
  onQuit: () => void;
};

export default function Game({ mode, settings, onFinish, onQuit }: Props) {
  const time = timeOption(settings.timeId);
  const tries = triesFor(settings);
  const rates = meterRates(settings.hardcore);
  const [queue] = useState(() => {
    const pool = shuffle(countriesFor(settings.continents));
    return pool.slice(0, settings.questionCount ?? pool.length);
  });
  const [endAt, setEndAt] = useState(() => Date.now() + time.seconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [bonusKey, setBonusKey] = useState(0);

  // Score and meter
  const [score, setScore] = useState(0);
  const [lastPoints, setLastPoints] = useState<{ points: number; key: number } | null>(null);
  const [meter, setMeter] = useState(0);
  const holdUntil = useRef(0);

  // Multiple choice
  const [choices, setChoices] = useState(() => makeChoices(queue[0]));
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);

  // Type-in
  const [typed, setTyped] = useState("");
  const [wrongTries, setWrongTries] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pause freezes the timer, the meter and the pause before the next question.
  const [paused, setPaused] = useState(false);
  const [pausesLeft, setPausesLeft] = useState(MAX_PAUSES);
  const pausedRef = useRef(false);
  const pausedAt = useRef(0);

  const finished = useRef(false);
  const country = queue[index];
  const remaining = Math.max(0, endAt - now);
  const correctCount = results.filter((r) => r.correct).length;

  const finish = useEffectEvent(() => {
    if (finished.current) return;
    finished.current = true;
    onFinish(results, queue.length, score);
  });

  const next = useEffectEvent(() => {
    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      finish();
      return;
    }
    setIndex(nextIndex);
    setChoices(makeChoices(queue[nextIndex]));
    setWrongPicks([]);
    setTyped("");
    setWrongTries(0);
    setFeedback(null);
  });

  useEffect(() => {
    setQuizActive(true);
    return () => setQuizActive(false);
  }, []);

  useEffect(() => {
    const { drain } = meterRates(settings.hardcore);
    let last = Date.now();
    const id = setInterval(() => {
      const t = Date.now();
      const elapsed = t - last;
      last = t;
      if (pausedRef.current) return;
      setNow(t);
      if (t >= holdUntil.current) {
        setMeter((m) => Math.max(0, m - (drain * elapsed) / 1000));
      }
    }, 100);
    return () => clearInterval(id);
  }, [settings.hardcore]);

  useEffect(() => {
    if (remaining <= 0) finish();
  }, [remaining]);

  useEffect(() => {
    if (!feedback || paused) return;
    const id = setTimeout(next, feedback === "correct" ? CORRECT_PAUSE_MS : REVEAL_PAUSE_MS);
    return () => clearTimeout(id);
  }, [feedback, paused]);

  useEffect(() => {
    if (settings.answerMode === "type" && !feedback && !paused) inputRef.current?.focus();
  }, [settings.answerMode, feedback, index, paused]);

  function togglePause() {
    if (paused) {
      // Push the deadline and any full-meter hold back by however long the game was paused.
      const pausedFor = Date.now() - pausedAt.current;
      setEndAt((e) => e + pausedFor);
      if (holdUntil.current > pausedAt.current) holdUntil.current += pausedFor;
      setNow(Date.now());
      pausedRef.current = false;
      setPaused(false);
    } else if (pausesLeft > 0) {
      pausedAt.current = Date.now();
      pausedRef.current = true;
      setPaused(true);
      setPausesLeft((n) => n - 1);
    }
  }

  /** Any wrong try (or a skip) empties the meter. */
  function breakMeter() {
    holdUntil.current = 0;
    setMeter(0);
  }

  /** Only a first-try correct answer scores. Points depend on the meter before it rises. */
  function scoreCorrect(firstTry: boolean) {
    if (firstTry) {
      const points = pointsFor(meter);
      setScore((s) => s + points);
      setLastPoints((p) => ({ points, key: (p?.key ?? 0) + 1 }));
    }
    const next = Math.min(100, meter + rates.rise);
    if (next >= 100) holdUntil.current = Date.now() + METER_FULL_HOLD_MS;
    setMeter(next);
  }

  function resolve(correct: boolean, firstTry = false) {
    setResults((r) => [...r, { country, correct }]);
    if (correct) {
      scoreCorrect(firstTry);
      if (time.bonus > 0) {
        setEndAt((e) => e + time.bonus * 1000);
        setBonusKey((k) => k + 1);
      }
    } else {
      breakMeter();
    }
    setFeedback(correct ? "correct" : "reveal");
  }

  function pick(choice: Country) {
    if (feedback || wrongPicks.includes(choice.code)) return;
    if (choice.code === country.code) {
      resolve(true, wrongPicks.length === 0);
      return;
    }
    const wrong = [...wrongPicks, choice.code];
    setWrongPicks(wrong);
    breakMeter();
    if (wrong.length >= tries) resolve(false);
  }

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (settings.answerMode !== "choice" || paused) return;
    const n = Number(e.key);
    if (n >= 1 && n <= choices.length) pick(choices[n - 1]);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submitTyped(e: React.FormEvent) {
    e.preventDefault();
    if (feedback || !typed.trim()) return;
    if (isCorrect(typed, country, mode)) {
      resolve(true, wrongTries === 0);
      return;
    }
    const used = wrongTries + 1;
    setWrongTries(used);
    setShakeKey((k) => k + 1);
    breakMeter();
    // A wrong try empties the box, ready for the next one.
    setTyped("");
    if (used >= tries) resolve(false);
  }

  const answer = displayAnswer(country, mode);
  const answered = index + (feedback ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-2">
      <div className="flex items-center justify-between">
        <span className="-ml-3 flex items-center gap-1">
          <QuitButton onConfirm={onQuit} />
          <button
            type="button"
            onClick={togglePause}
            disabled={!paused && pausesLeft === 0}
            aria-label={paused ? "Resume" : `Pause (${pausesLeft} left)`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-line/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground active:bg-line/60 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted"
          >
            {paused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
            {paused ? (
              "Resume"
            ) : (
              <>
                <span className="hidden sm:inline">Pause ({pausesLeft} left)</span>
                <span className="tabular-nums sm:hidden">{pausesLeft}</span>
              </>
            )}
          </button>
        </span>
        <span className="hidden text-sm text-muted tabular-nums lg:inline">
          {settings.hardcore && (
            <>
              <span className="font-medium text-foreground">Hardcore</span>
              <span className="mx-3 opacity-40">·</span>
            </>
          )}
          Question <span className="font-medium text-foreground">{index + 1}</span> of {queue.length}
          <span className="mx-3 opacity-40">·</span>
          {correctCount} correct
        </span>
        <span className="flex items-baseline gap-4 lg:gap-8">
          <span className="relative">
            <span className="text-sm text-muted">Score</span>{" "}
            <span className="text-xl font-semibold tracking-tight tabular-nums lg:text-2xl">{score}</span>
            {lastPoints && (
              <span
                key={lastPoints.key}
                className="animate-bonus absolute -top-5 right-0 text-sm font-medium text-correct"
              >
                +{lastPoints.points}
              </span>
            )}
          </span>
          <span className="relative font-mono text-xl tabular-nums lg:text-2xl">
            <span className={remaining <= 10_000 ? "text-wrong" : undefined}>
              {formatTime(remaining)}
            </span>
            {bonusKey > 0 && (
              <span
                key={bonusKey}
                className="animate-bonus absolute -top-5 right-0 font-sans text-sm font-medium text-correct"
              >
                +{time.bonus}s
              </span>
            )}
          </span>
        </span>
      </div>

      {/* Progress through the questions. */}
      <div className="mt-3 h-px w-full bg-line lg:mt-4" aria-hidden="true">
        <div
          className="h-px bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${(answered / queue.length) * 100}%` }}
        />
      </div>

      {/* Phones: the question count moves under the bar, and the meter turns sideways. */}
      <p className="mt-2 text-center text-xs text-muted tabular-nums lg:hidden">
        {settings.hardcore && <span className="font-medium text-foreground">Hardcore · </span>}
        Question <span className="font-medium text-foreground">{index + 1}</span> of {queue.length}
        {" · "}
        {correctCount} correct
      </p>
      <div className="mt-3 lg:hidden">
        <ScoreMeter meter={meter} layout="horizontal" />
      </div>

      <div className="flex flex-1 items-center justify-center py-5 lg:gap-12 lg:py-12">
        {/* Balances the meter so the question stays centred. */}
        <div className="hidden w-16 shrink-0 lg:block" aria-hidden="true" />
        <div className="flex w-full max-w-3xl flex-col items-center">
        {paused ? (
          <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-line bg-surface px-6 py-10 text-center shadow-sheet lg:px-10 lg:py-14">
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">Paused</h1>
            <p className="mt-3 text-muted">
              {pausesLeft === 0
                ? "That was your last pause."
                : `${pausesLeft} ${pausesLeft === 1 ? "pause" : "pauses"} left.`}
            </p>
            <button
              type="button"
              onClick={togglePause}
              className="mt-8 flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              <PlayIcon className="size-4" />
              Resume
            </button>
          </div>
        ) : (
          <>
          {mode === "flags" ? (
            <Image
              src={`/flags/${country.code}.svg`}
              alt="Flag to identify"
              width={420}
              height={315}
              unoptimized
              priority
              className="aspect-[4/3] h-[min(315px,32svh)] w-auto max-w-full lg:h-[315px] rounded-lg object-cover shadow-flag ring-1 ring-line"
            />
          ) : (
            <div className="text-center">
              <p className="text-muted lg:text-lg">What is the capital of</p>
              <h1 className="mt-2 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance lg:text-6xl">
                {country.name}
              </h1>
            </div>
          )}

          <p
            className={`mt-4 min-h-7 text-center font-medium lg:mt-8 lg:text-lg ${
              feedback === "correct" ? "text-correct" : "text-wrong"
            }`}
            aria-live="polite"
          >
            {feedback === "correct" && "Correct"}
            {feedback === "reveal" && `The answer is ${answer}`}
          </p>

          {settings.answerMode === "choice" ? (
            <div className="mt-3 grid w-full grid-cols-2 gap-2 lg:mt-6 lg:gap-3">
              {choices.map((choice, i) => {
                const isAnswer = choice.code === country.code;
                const pickedWrong = wrongPicks.includes(choice.code);
                const showRight = isAnswer && feedback !== null;
                return (
                  <button
                    key={choice.code}
                    type="button"
                    onClick={() => pick(choice)}
                    disabled={feedback !== null || pickedWrong}
                    className={`flex items-center gap-4 rounded-xl border bg-surface px-4 py-3.5 text-left leading-snug shadow-sheet transition duration-300 enabled:active:scale-[0.98] lg:px-5 lg:py-4 lg:text-lg ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                      showRight
                        ? "border-correct text-correct"
                        : pickedWrong
                          ? "border-wrong text-wrong line-through opacity-70"
                          : "border-line enabled:hover:border-foreground enabled:hover:shadow-lifted motion-safe:enabled:hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Keys 1 to 4 only help with a keyboard. */}
                    <span className="font-mono text-sm text-muted [@media(pointer:coarse)]:hidden">{i + 1}</span>
                    {displayAnswer(choice, mode)}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={submitTyped} className="mt-3 w-full max-w-md lg:mt-6">
              <div key={shakeKey} className={shakeKey > 0 ? "animate-shake" : undefined}>
                <input
                  ref={inputRef}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  disabled={feedback !== null}
                  placeholder={mode === "flags" ? "Country" : "Capital"}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  enterKeyHint="go"
                  spellCheck={false}
                  className={`w-full rounded-xl border bg-surface px-5 py-3.5 text-lg lg:py-4 shadow-sheet outline-none transition-colors placeholder:text-muted focus:border-foreground ${
                    feedback === "correct"
                      ? "border-correct"
                      : wrongTries > 0
                        ? "border-wrong"
                        : "border-line"
                  }`}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted">
                <span>
                  {feedback === null &&
                    wrongTries > 0 &&
                    `Not quite. ${tries - wrongTries} ${
                      tries - wrongTries === 1 ? "try" : "tries"
                    } left.`}
                  {feedback === null && wrongTries === 0 && (
                    <span className="[@media(pointer:coarse)]:hidden">Press Enter to answer.</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => resolve(false)}
                  disabled={feedback !== null}
                  className="-mr-2 rounded-lg px-2 py-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground disabled:opacity-40"
                >
                  Skip
                </button>
              </div>
            </form>
          )}
          </>
        )}
        </div>
        <div className="hidden lg:block">
          <ScoreMeter meter={meter} />
        </div>
      </div>
    </div>
  );
}

function formatTime(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
