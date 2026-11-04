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
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sheet lg:p-8">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <ChipRow>
            {MODES.map((m) => (
              <Chip key={m.id} selected={mode === m.id} onClick={() => pick({ mode: m.id })}>
                {m.label}
              </Chip>
            ))}
          </ChipRow>
          <ChipRow>
            {ANSWERS.map((a) => (
              <Chip key={a.id} selected={answer === a.id} onClick={() => pick({ answer: a.id })}>
                {a.label}
              </Chip>
            ))}
          </ChipRow>
        </div>
        <ChipRow>
          {PRESETS.map((p) => (
            <Chip key={p.id} selected={preset === p.id} onClick={() => pick({ preset: p.id })}>
              {p.label}
            </Chip>
          ))}
        </ChipRow>
        <p className="text-sm text-muted">
          {preset === "hardcore"
            ? "Hardcore: all 197 countries, 1 min +5s per right answer, one try."
            : `Ranked ${PRESETS.find((p) => p.id === preset)?.label}: every country, 5 min +5s per right answer, no retry.`}
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-surface shadow-sheet">
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

function ChipRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
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
