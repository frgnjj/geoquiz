import { createClient } from "@/lib/supabase/client";

/** A finished ranked game, as sent to Supabase's submit_score. */
export type RankedGame = {
  board: string;
  score: number;
  correct: number;
  asked: number;
  playedMs: number;
};

/** The player's best on that board after saving, and its rank. */
export type Saved = { improved: boolean; score: number; correct: number; rank: number };

export async function submitScore(game: RankedGame): Promise<Saved> {
  const { data, error } = await createClient().rpc("submit_score", {
    p_board: game.board,
    p_score: game.score,
    p_correct: game.correct,
    p_asked: game.asked,
    p_played_ms: game.playedMs,
  });
  if (error) throw error;
  return data as Saved;
}

// A game finished before signing in waits here, so it can be saved once the player is back.
// It's in localStorage rather than sessionStorage because an email link opens a new tab.
const PENDING_KEY = "pending-score";
const PENDING_MAX_AGE_MS = 60 * 60 * 1000;

export function keepForLater(game: RankedGame) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...game, at: Date.now() }));
  } catch {}
}

/** The waiting game, if there's one from the last hour. Taking it removes it. */
export function takeWaiting(): RankedGame | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    localStorage.removeItem(PENDING_KEY);
    const { at, ...game } = JSON.parse(raw) as RankedGame & { at: number };
    return Date.now() - at < PENDING_MAX_AGE_MS ? game : null;
  } catch {
    return null;
  }
}
