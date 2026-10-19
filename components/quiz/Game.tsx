"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Country } from "@/data/countries";
import { displayAnswer, isCorrect, type Mode } from "@/lib/answers";
import {
  countriesFor,
  makeChoices,
  shuffle,
  timeOption,
  TYPE_IN_TRIES,
  type Settings,
} from "@/lib/quiz";
import {
  METER_DRAIN_PER_SECOND,
  METER_FULL_HOLD_MS,
  METER_RISE,
  pointsFor,
} from "@/lib/score";
import ScoreMeter from "./ScoreMeter";

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
    let last = Date.now();
    const id = setInterval(() => {
      const t = Date.now();
      const elapsed = t - last;
      last = t;
      setNow(t);
      if (t >= holdUntil.current) {
        setMeter((m) => Math.max(0, m - (METER_DRAIN_PER_SECOND * elapsed) / 1000));
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining <= 0) finish();
  }, [remaining]);

  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(next, feedback === "correct" ? CORRECT_PAUSE_MS : REVEAL_PAUSE_MS);
    return () => clearTimeout(id);
  }, [feedback]);

  useEffect(() => {
    if (settings.answerMode === "type" && !feedback) inputRef.current?.focus();
  }, [settings.answerMode, feedback, index]);

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
    const next = Math.min(100, meter + METER_RISE);
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
    if (wrong.length >= (settings.retry ? 2 : 1)) resolve(false);
  }

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (settings.answerMode !== "choice") return;
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
    const tries = wrongTries + 1;
    setWrongTries(tries);
    setShakeKey((k) => k + 1);
    breakMeter();
    if (tries >= TYPE_IN_TRIES) resolve(false);
    else inputRef.current?.select();
  }

  const answer = displayAnswer(country, mode);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col pt-4">
      <div className="flex items-center justify-between text-sm text-muted">
        <button type="button" onClick={onQuit} className="hover:text-foreground">
          ← Quit
        </button>
        <span>
          {index + 1} / {queue.length}
          <span className="mx-3 opacity-40">·</span>
          {correctCount} correct
        </span>
        <span className="flex items-center gap-8">
          <span className="relative text-foreground">
            <span className="text-muted">Score</span>{" "}
            <span className="text-lg font-semibold tabular-nums">{score}</span>
            {lastPoints && (
              <span
                key={lastPoints.key}
                className="animate-bonus absolute -top-5 right-0 text-sm text-correct"
              >
                +{lastPoints.points}
              </span>
            )}
          </span>
          <span className="relative font-mono text-lg tabular-nums text-foreground">
            <span className={remaining <= 10_000 ? "text-wrong" : undefined}>
              {formatTime(remaining)}
            </span>
            {bonusKey > 0 && (
              <span
                key={bonusKey}
                className="animate-bonus absolute -top-5 right-0 text-sm text-correct"
              >
                +{time.bonus}s
              </span>
            )}
          </span>
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center py-12">
        <ScoreMeter meter={meter} />
        {mode === "flags" ? (
          <Image
            src={`/flags/${country.code}.svg`}
            alt="Flag to identify"
            width={420}
            height={315}
            unoptimized
            priority
            className="h-[315px] w-[420px] rounded-md border border-line object-cover shadow-sm"
          />
        ) : (
          <div className="text-center">
            <p className="text-muted">What is the capital of</p>
            <h1 className="mt-2 text-5xl font-semibold tracking-tight">{country.name}</h1>
          </div>
        )}

        <p
          className={`mt-8 h-7 text-lg font-medium ${
            feedback === "correct" ? "text-correct" : "text-wrong"
          }`}
          aria-live="polite"
        >
          {feedback === "correct" && "Correct"}
          {feedback === "reveal" && `The answer is ${answer}`}
        </p>

        {settings.answerMode === "choice" ? (
          <div className="mt-6 grid w-full grid-cols-2 gap-3">
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
                  className={`flex items-center gap-4 rounded-xl border px-5 py-4 text-left text-lg transition-colors ${
                    showRight
                      ? "border-correct text-correct"
                      : pickedWrong
                        ? "border-wrong text-wrong line-through opacity-70"
                        : "border-line bg-surface hover:border-foreground disabled:hover:border-line"
                  }`}
                >
                  <span className="font-mono text-sm text-muted">{i + 1}</span>
                  {displayAnswer(choice, mode)}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={submitTyped} className="mt-6 w-full max-w-md">
            <div key={shakeKey} className={shakeKey > 0 ? "animate-shake" : undefined}>
              <input
                ref={inputRef}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={feedback !== null}
                placeholder={mode === "flags" ? "Country" : "Capital"}
                autoComplete="off"
                spellCheck={false}
                className={`w-full rounded-xl border bg-surface px-5 py-4 text-lg outline-none transition-colors focus:border-foreground ${
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
                  `Not quite. ${TYPE_IN_TRIES - wrongTries} ${
                    TYPE_IN_TRIES - wrongTries === 1 ? "try" : "tries"
                  } left.`}
                {feedback === null && wrongTries === 0 && "Press Enter to answer."}
              </span>
              <button
                type="button"
                onClick={() => resolve(false)}
                disabled={feedback !== null}
                className="hover:text-foreground disabled:opacity-40"
              >
                Skip
              </button>
            </div>
          </form>
        )}
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
