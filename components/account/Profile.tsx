"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAccountUsername, signOut, useAccount } from "@/lib/account";
import { PRESETS } from "@/lib/ranked";
import { loadBests, loadProfile, type Entry, type Profile as Player } from "@/lib/scores";
import { USERNAME_FORMAT, USERNAME_RULE, usernameError } from "@/lib/username";
import Segmented from "@/components/Segmented";

const GROUPS = [
  { mode: "flags", answer: "choice", title: "Flags · Multiple choice" },
  { mode: "flags", answer: "type", title: "Flags · Type-in" },
  { mode: "capitals", answer: "choice", title: "Capitals · Multiple choice" },
  { mode: "capitals", answer: "type", title: "Capitals · Type-in" },
];
const BOARD_COUNT = GROUPS.length * PRESETS.length;

type Loaded =
  | { key: string; player: Player; bests: Entry[] }
  | { key: string; missing: true }
  | { key: string; failed: true };

/** A player's page: their bests and ranks on every board. Their own page also lets them rename or leave. */
export default function Profile({ username }: { username: string }) {
  const account = useAccount();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = `${username.toLowerCase()}|${attempt}`;

  useEffect(() => {
    let current = true;
    loadProfile(username)
      .then(async (player) => {
        if (!current) return;
        if (!player) return setLoaded({ key, missing: true });
        const bests = await loadBests(player.id);
        if (current) setLoaded({ key, player, bests });
      })
      .catch(() => current && setLoaded({ key, failed: true }));
    return () => {
      current = false;
    };
  }, [username, key]);

  const ready = loaded?.key === key ? loaded : null;

  if (!ready) return <Skeleton />;

  if ("missing" in ready) {
    return (
      <div>
        <h1 className="text-4xl font-semibold tracking-[-0.03em]">No player called {username}</h1>
        <p className="mt-3 text-muted">
          Check the spelling, or find players on the{" "}
          <Link href="/leaderboard" className="text-foreground underline decoration-line underline-offset-4 hover:decoration-foreground">
            leaderboards
          </Link>
          .
        </p>
      </div>
    );
  }

  if ("failed" in ready) {
    return (
      <p>
        Couldn&rsquo;t load this profile.{" "}
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="font-medium underline decoration-line underline-offset-4 hover:decoration-foreground"
        >
          Try again
        </button>
      </p>
    );
  }

  const { player, bests } = ready;
  const own = account.status === "signed-in" && account.userId === player.id;
  const joined = new Date(player.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div>
        <div className="flex items-center gap-4 lg:gap-6">
          {/* The same round initial as the header menu, at page size. */}
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-2xl font-semibold uppercase shadow-sheet lg:size-20 lg:text-3xl"
          >
            {player.username[0]}
          </span>
          <h1 className="min-w-0 break-words text-5xl leading-[1.05] font-semibold tracking-[-0.03em] lg:text-6xl">
            {player.username}
          </h1>
        </div>
        <p className="mt-4 text-lg text-muted">
          Joined {joined} &middot; <span className="tabular-nums">{bests.length}</span> of {BOARD_COUNT} boards played
        </p>
        {own && <OwnActions userId={player.id} username={player.username} />}
      </div>

      <Bests bests={bests} />

      {own && <DeleteAccount />}
    </div>
  );
}

/** Every board at a glance: a grid on wider screens, one quiz type at a time on phones. */
function Bests({ bests }: { bests: Entry[] }) {
  const [mode, setMode] = useState("flags");
  const [answer, setAnswer] = useState("choice");
  const best = (group: { mode: string; answer: string }, presetId: string) =>
    bests.find((b) => b.board === `${group.mode}:${group.answer}:${presetId}`);

  return (
    <section aria-label="Best scores">
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-sheet sm:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-[28%] px-5 py-4 text-xs font-medium uppercase tracking-wider text-muted lg:px-6">
                Board
              </th>
              {GROUPS.map((g) => (
                <th key={g.title} scope="col" className="border-l border-line px-4 py-4 text-right font-normal lg:px-5">
                  <span className="block font-semibold">{g.mode === "flags" ? "Flags" : "Capitals"}</span>
                  <span className="block text-sm text-muted">{g.answer === "choice" ? "Multiple choice" : "Type-in"}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRESETS.map((preset) => (
              <tr key={preset.id} className="border-t border-line first:border-t-0">
                <th scope="row" className="px-5 py-3 font-medium lg:px-6">
                  {preset.label}
                </th>
                {GROUPS.map((g) => {
                  const entry = best(g, preset.id);
                  return (
                    <td key={g.title} className="border-l border-line p-0">
                      <Link
                        href={`/leaderboard?board=${g.mode}:${g.answer}:${preset.id}`}
                        aria-label={`${g.title}, ${preset.label}: ${entry ? `${entry.score}, rank ${entry.rank}` : "not played"}`}
                        className="flex h-full items-baseline justify-end gap-2 px-4 py-3 tabular-nums transition-colors hover:bg-line/40 lg:px-5"
                      >
                        {entry ? (
                          <>
                            <span className="text-sm text-muted">#{entry.rank}</span>
                            <span className="text-lg font-semibold">{entry.score}</span>
                          </>
                        ) : (
                          <span className="text-muted/60">&ndash;</span>
                        )}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        <Segmented
          label="Quiz"
          options={[
            { id: "flags", label: "Flags" },
            { id: "capitals", label: "Capitals" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <Segmented
          label="Answer mode"
          options={[
            { id: "choice", label: "Multiple choice" },
            { id: "type", label: "Type-in" },
          ]}
          value={answer}
          onChange={setAnswer}
        />
        <ul className="mt-1 rounded-2xl border border-line bg-surface shadow-sheet">
          {PRESETS.map((preset) => {
            const entry = best({ mode, answer }, preset.id);
            return (
              <li key={preset.id} className="border-t border-line first:border-t-0">
                <Link
                  href={`/leaderboard?board=${mode}:${answer}:${preset.id}`}
                  className="flex items-baseline justify-between gap-4 px-5 py-3 transition-colors active:bg-line/40"
                >
                  <span className={entry ? "font-medium" : "text-muted"}>{preset.label}</span>
                  {entry ? (
                    <span className="flex items-baseline gap-3 tabular-nums">
                      <span className="text-sm text-muted">#{entry.rank}</span>
                      <span className="text-lg font-semibold">{entry.score}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-muted">Not played</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function OwnActions({ userId, username }: { userId: string; username: string }) {
  const router = useRouter();
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(username);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function rename(e: React.FormEvent) {
    e.preventDefault();
    const next = name.trim();
    if (next === username) return setRenaming(false);
    if (!USERNAME_FORMAT.test(next)) return setError(USERNAME_RULE);
    setBusy(true);
    setError(null);
    const { error } = await createClient().from("profiles").update({ username: next }).eq("id", userId);
    setBusy(false);
    if (error) return setError(usernameError(error));
    setAccountUsername(next);
    setRenaming(false);
    router.replace(`/u/${encodeURIComponent(next)}`);
  }

  if (!renaming) {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <SmallButton onClick={() => setRenaming(true)}>Change username</SmallButton>
        <SmallButton
          onClick={async () => {
            await signOut();
            router.replace("/");
          }}
        >
          Sign out
        </SmallButton>
      </div>
    );
  }

  return (
    <form onSubmit={rename} className="mt-6 max-w-md">
      <label htmlFor="new-username" className="text-sm font-medium">
        New username
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="new-username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          autoFocus
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="done"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3 shadow-sheet outline-none transition-colors focus:border-foreground"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-foreground px-5 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          Save
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">
        3 to 20 letters, numbers or underscores.{" "}
        <button
          type="button"
          onClick={() => {
            setRenaming(false);
            setName(username);
            setError(null);
          }}
          className="underline decoration-line underline-offset-4 hover:text-foreground"
        >
          Cancel
        </button>
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-wrong">
          {error}
        </p>
      )}
    </form>
  );
}

function DeleteAccount() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function remove() {
    setBusy(true);
    setFailed(false);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_account");
    if (error) {
      setBusy(false);
      setFailed(true);
      return;
    }
    // The account is gone on the server, so only this browser's session needs clearing.
    await supabase.auth.signOut({ scope: "local" });
    router.replace("/");
  }

  return (
    <section className="rounded-2xl border border-line p-5 lg:p-6">
      <h2 className="font-semibold">Delete account</h2>
      <p className="mt-1 text-sm text-muted">
        Removes your username, email and every score for good. This can&rsquo;t be undone.
      </p>
      {confirming ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            autoFocus
            className="rounded-xl border border-wrong px-4 py-2 text-sm font-medium text-wrong transition-colors hover:bg-wrong hover:text-background disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete for good"}
          </button>
          <SmallButton onClick={() => setConfirming(false)}>Cancel</SmallButton>
        </div>
      ) : (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-xl border border-wrong bg-surface px-4 py-2 text-sm font-medium text-wrong shadow-sheet transition-colors hover:bg-wrong hover:text-background"
          >
            Delete account
          </button>
        </div>
      )}
      {failed && (
        <p role="alert" className="mt-3 text-sm text-wrong">
          Couldn&rsquo;t delete your account. Try again.
        </p>
      )}
    </section>
  );
}

function SmallButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium shadow-sheet transition-colors hover:border-foreground"
    >
      {children}
    </button>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="motion-safe:animate-pulse">
      <div className="h-14 w-64 rounded-lg bg-line" />
      <div className="mt-4 h-5 w-80 max-w-full rounded bg-line" />
      <div className="mt-10 h-96 rounded-2xl bg-line/60" />
    </div>
  );
}
