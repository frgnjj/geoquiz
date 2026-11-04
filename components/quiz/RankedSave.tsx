"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "@/lib/account";
import { boardLabel } from "@/lib/ranked";
import { keepForLater, submitScore, type RankedGame, type Saved } from "@/lib/scores";

type Status = { name: "saving" } | { name: "saved"; saved: Saved } | { name: "error" };

/** End screen: saves a ranked game for signed-in players, or offers sign-in to save it. */
export default function RankedSave({ game }: { game: RankedGame | null }) {
  if (!game) {
    return (
      <p className="mt-4 text-sm text-muted">
        Practice game, so the score isn&rsquo;t saved. Pick Ranked or Hardcore to save it.
      </p>
    );
  }
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface px-6 py-5 shadow-sheet">
      <p className="text-sm text-muted">{boardLabel(game.board)}</p>
      {game.score === 0 ? (
        <p className="mt-2 font-medium">A score of 0 isn&rsquo;t saved.</p>
      ) : (
        <SaveState game={game} />
      )}
      <Link
        href={`/leaderboard?board=${game.board}`}
        className="mt-3 inline-block text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
      >
        See the leaderboard
      </Link>
    </div>
  );
}

function SaveState({ game }: { game: RankedGame }) {
  const account = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>({ name: "saving" });
  const sent = useRef(false);
  const ready = account.status === "signed-in" && account.username !== null;

  function save() {
    setStatus({ name: "saving" });
    submitScore(game).then(
      (saved) => setStatus({ name: "saved", saved }),
      () => setStatus({ name: "error" }),
    );
  }

  // Signed-in players' games save as soon as the end screen opens, once.
  useEffect(() => {
    if (!ready || sent.current) return;
    sent.current = true;
    submitScore(game).then(
      (saved) => setStatus({ name: "saved", saved }),
      () => setStatus({ name: "error" }),
    );
  }, [ready, game]);

  // The game waits in this browser while the player signs in, then saves on their return.
  function signInFirst(path: "/signin" | "/welcome") {
    keepForLater(game);
    router.push(`${path}?next=${encodeURIComponent(pathname)}`);
  }

  if (account.status === "loading") return <p className="mt-2 h-6" />;

  if (account.status === "signed-out") {
    return <Action onClick={() => signInFirst("/signin")}>Sign in to save your score</Action>;
  }

  if (!ready) {
    return <Action onClick={() => signInFirst("/welcome")}>Pick a username to save your score</Action>;
  }

  if (status.name === "saving") return <p className="mt-2 font-medium text-muted">Saving&hellip;</p>;

  if (status.name === "error") {
    return (
      <p className="mt-2 font-medium">
        Couldn&rsquo;t save.{" "}
        <button type="button" onClick={save} className="underline decoration-line underline-offset-4 hover:decoration-foreground">
          Try again
        </button>
      </p>
    );
  }

  const { saved } = status;
  return (
    <p className="mt-2 font-medium">
      {saved.improved ? (
        <>New personal best. You&rsquo;re <span className="tabular-nums">#{saved.rank}</span>.</>
      ) : (
        <>
          Saved. Your best is <span className="tabular-nums">{saved.score}</span>, ranked{" "}
          <span className="tabular-nums">#{saved.rank}</span>.
        </>
      )}
    </p>
  );
}

function Action({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full rounded-xl border border-foreground py-3 font-medium transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
    >
      {children}
    </button>
  );
}
