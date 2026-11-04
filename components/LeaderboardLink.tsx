"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuizActive } from "@/lib/quizActive";
import { TrophyIcon } from "./icons";

/** Header link to the leaderboards. Hidden mid-game, like the home link, so only Quit leaves a game. */
export default function LeaderboardLink() {
  const playing = useQuizActive();
  const pathname = usePathname();
  if (playing) return null;

  const here = pathname === "/leaderboard";
  return (
    <Link
      href="/leaderboard"
      aria-label="Leaderboards"
      aria-current={here ? "page" : undefined}
      className={`flex items-center gap-2 rounded-lg p-2 text-sm font-medium transition-colors hover:bg-line/60 hover:text-foreground sm:px-3 ${
        here ? "text-foreground" : "text-muted"
      }`}
    >
      <TrophyIcon className="size-5" />
      <span className="hidden sm:inline">Leaderboards</span>
    </Link>
  );
}
