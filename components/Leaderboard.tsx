"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "@/lib/account";
import { PRESETS } from "@/lib/ranked";
import { loadBoard, TOP_COUNT, type Entry } from "@/lib/scores";

const MODES = [
  { id: "flags", label: "Flags" },
  { id: "capitals", label: "Capitals" },
];
const ANSWERS = [
  { id: "choice", label: "Multiple choice" },
  { id: "type", label: "Type-in" },
];
const DEFAULT_BOARD = ["flags", "choice", "world"];

/** The board in the address, such as ?board=flags:choice:europe, or the default when it's not valid. */
function parseBoard(value: string | null) {
  const [mode, answer, preset] = value?.split(":") ?? [];
  const valid =
    MODES.some((m) => m.id === mode) &&
    ANSWERS.some((a) => a.id === answer) &&
    PRESETS.some((p) => p.id === preset);
  return valid ? [mode, answer, preset] : DEFAULT_BOARD;
}

type Loaded = { key: string; entries: Entry[]; mine: Entry | null } | { key: string; failed: true };

export default function Leaderboard() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const account = useAccount();
  const [mode, answer, preset] = parseBoard(params.get("board"));
  const board = `${mode}:${answer}:${preset}`;
  const userId = account.status === "signed-in" ? account.userId : undefined;
  // Waits for the account so the player's own row loads with the rest.
  const key = account.status === "loading" ? null : `${board}|${userId ?? ""}`;

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!key) return;
    let current = true;
    loadBoard(board, userId).then(
      (data) => current && setLoaded({ key, ...data }),
      () => current && setLoaded({ key, failed: true }),
    );
    return () => {
      current = false;
    };
  }, [key, board, userId, attempt]);

  function pick(next: { mode?: string; answer?: string; preset?: string }) {
    const value = [next.mode ?? mode, next.answer ?? answer, next.preset ?? preset].join(":");
    router.replace(`${pathname}?board=${value}`, { scroll: false });
  }

  const ready = loaded && loaded.key === key ? loaded : null;

  return (
    <div className="mt-8 flex flex-col gap-6 lg:mt-10">
      {/* What was played (two switches), then which board: Hardcore on its own, Ranked by region. */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-4 shadow-sheet sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Segmented label="Quiz" options={MODES} value={mode} onChange={(id) => pick({ mode: id })} />
          <Segmented label="Answer mode" options={ANSWERS} value={answer} onChange={(id) => pick({ answer: id })} />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Group title="Hardcore">
            <Chip selected={preset === "hardcore"} onClick={() => pick({ preset: "hardcore" })}>
              All 197
            </Chip>
          </Group>
          <span className="hidden w-px self-stretch bg-line sm:block" aria-hidden="true" />
          <Group title="Ranked">
            {PRESETS.filter((p) => p.id !== "hardcore").map((p) => (
              <Chip key={p.id} selected={preset === p.id} onClick={() => pick({ preset: p.id })}>
                {p.label}
              </Chip>
            ))}
          </Group>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-surface shadow-sheet">
        <header className="flex flex-col gap-1 border-b border-line px-5 py-5 lg:px-8 lg:py-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {preset === "hardcore" ? "Hardcore" : `Ranked ${PRESETS.find((p) => p.id === preset)?.label}`}
          </h2>
          <p className="text-sm text-muted">
            {mode === "flags" ? "Flags" : "Capitals"} &middot; {answer === "choice" ? "Multiple choice" : "Type-in"} &middot;{" "}
            {preset === "hardcore"
              ? "all 197 countries, 1 min +5s per right answer, one try"
              : "every country, 5 min +5s per right answer, no retry"}
          </p>
        </header>
        {!ready ? (
          <Skeleton />
        ) : "failed" in ready ? (
          <p className="p-6 lg:p-8">
            Couldn&rsquo;t load the leaderboard.{" "}
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="font-medium underline decoration-line underline-offset-4 hover:decoration-foreground"
            >
              Try again
            </button>
          </p>
        ) : ready.entries.length === 0 ? (
          <div className="p-6 lg:p-8">
            <p className="text-lg font-medium">No scores yet.</p>
            <p className="mt-1 text-muted">
              Play a {preset === "hardcore" ? "Hardcore" : "Ranked"} game to be the first on this board.
            </p>
            <Link
              href={`/${mode}`}
              className="mt-5 inline-block rounded-xl bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Play {mode === "flags" ? "Flags" : "Capitals"}
            </Link>
          </div>
        ) : (
          <Table entries={ready.entries} mine={ready.mine} userId={userId} />
        )}
      </section>
    </div>
  );
}

function Table({ entries, mine, userId }: { entries: Entry[]; mine: Entry | null; userId?: string }) {
  const pinned = mine && mine.rank > TOP_COUNT ? mine : null;
  return (
    <div>
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_5rem] gap-4 border-b border-line px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted sm:grid-cols-[3rem_minmax(0,1fr)_6rem_5rem_6rem] lg:px-8">
        <span>Rank</span>
        <span>Player</span>
        <span className="hidden text-right sm:block">Right</span>
        <span className="text-right">Score</span>
        <span className="hidden text-right sm:block">Date</span>
      </div>
      <ol>
        {entries.map((entry) => (
          <Row key={entry.user_id} entry={entry} you={entry.user_id === userId} />
        ))}
      </ol>
      {pinned && (
        <>
          <p className="border-t border-line px-5 py-2 text-center text-muted lg:px-8" aria-hidden="true">
            &middot;&middot;&middot;
          </p>
          <ol>
            <Row entry={pinned} you />
          </ol>
        </>
      )}
    </div>
  );
}

function Row({ entry, you }: { entry: Entry; you: boolean }) {
  return (
    <li
      className={`grid grid-cols-[3rem_minmax(0,1fr)_5rem] items-baseline gap-4 border-t border-line px-5 py-3.5 first:border-t-0 sm:grid-cols-[3rem_minmax(0,1fr)_6rem_5rem_6rem] lg:px-8 ${
        you ? "bg-line/40" : ""
      }`}
    >
      <span className="font-medium tabular-nums text-muted">{entry.rank}</span>
      <span className="min-w-0">
        <span className="block truncate font-medium">
          {entry.username}
          {you && <span className="ml-2 text-sm font-normal text-muted">you</span>}
        </span>
        <span className="block text-sm text-muted tabular-nums sm:hidden">
          {entry.correct} right &middot; {formatDate(entry.achieved_at)}
        </span>
      </span>
      <span className="hidden text-right text-muted tabular-nums sm:block">{entry.correct}</span>
      <span className="text-right text-lg font-semibold tabular-nums">{entry.score}</span>
      <span className="hidden text-right text-sm text-muted tabular-nums sm:block">
        {formatDate(entry.achieved_at)}
      </span>
    </li>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5 p-5 lg:p-8">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="h-4 w-6 rounded bg-line" />
          <span className="h-4 flex-1 rounded bg-line" />
          <span className="h-4 w-12 rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

/** "4 Nov", or "4 Nov 2025" for an earlier year. */
function formatDate(iso: string) {
  const date = new Date(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
}

/** A two-way switch: one track, with the chosen side raised. */
function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="grid grid-flow-col auto-cols-fr rounded-xl bg-line/60 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
            value === o.id ? "bg-surface text-foreground shadow-sheet" : "text-muted hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{title}</h2>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-line bg-surface hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
