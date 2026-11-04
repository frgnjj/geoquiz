"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/lib/account";
import { boardLabel } from "@/lib/ranked";
import { submitScore, takeWaiting, type RankedGame, type Saved } from "@/lib/scores";

type Notice = { game: RankedGame; saved: Saved } | { game: RankedGame; failed: true };

/** After signing in to save a score, saves the waiting game and says how it went. */
export default function WaitingScore() {
  const account = useAccount();
  const ready = account.status === "signed-in" && account.username !== null;
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (!ready) return;
    const game = takeWaiting();
    if (!game) return;
    submitScore(game).then(
      (saved) => setNotice({ game, saved }),
      () => setNotice({ game, failed: true }),
    );
  }, [ready]);

  // It fades out on its own after a while.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 8000);
    return () => clearTimeout(id);
  }, [notice]);

  if (!notice) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-md items-start gap-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-lifted"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {"failed" in notice
            ? "Couldn't save your score."
            : notice.saved.improved
              ? `Score saved: ${notice.game.score}, ranked #${notice.saved.rank}.`
              : `Your best is still ${notice.saved.score}, ranked #${notice.saved.rank}.`}
        </p>
        <p className="mt-0.5 truncate text-sm text-muted">{boardLabel(notice.game.board)}</p>
      </div>
      <button
        type="button"
        onClick={() => setNotice(null)}
        className="-mr-2 rounded-lg px-2 py-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        Close
      </button>
    </div>
  );
}
