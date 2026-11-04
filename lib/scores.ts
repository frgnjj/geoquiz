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

/** One row of a leaderboard. */
export type Entry = {
  board?: string;
  user_id: string;
  username: string;
  score: number;
  correct: number;
  asked: number;
  achieved_at: string;
  rank: number;
};

export const TOP_COUNT = 100;

/** The top of a board, plus the player's own row when they're further down. */
export async function loadBoard(board: string, userId?: string) {
  const supabase = createClient();
  const top = supabase
    .from("leaderboard")
    .select("user_id, username, score, correct, asked, achieved_at, rank")
    .eq("board", board)
    .order("rank")
    .limit(TOP_COUNT);
  const mine = userId
    ? supabase
        .from("leaderboard")
        .select("user_id, username, score, correct, asked, achieved_at, rank")
        .eq("board", board)
        .eq("user_id", userId)
        .maybeSingle()
    : null;
  const [topResult, mineResult] = await Promise.all([top, mine]);
  if (topResult.error) throw topResult.error;
  return {
    entries: (topResult.data ?? []) as Entry[],
    mine: (mineResult?.data ?? null) as Entry | null,
  };
}

export type Profile = { id: string; username: string; created_at: string };

/** A player by username, ignoring case, or null when there's no such player. */
export async function loadProfile(username: string): Promise<Profile | null> {
  // Underscores are wildcards in ilike, so they're escaped, and the match is checked again here.
  const { data, error } = await createClient()
    .from("profiles")
    .select("id, username, created_at")
    .ilike("username", username.replace(/[\\%_]/g, (c) => `\\${c}`))
    .limit(5);
  if (error) throw error;
  return (data ?? []).find((p) => p.username.toLowerCase() === username.toLowerCase()) ?? null;
}

/** A player's best on every board they've played, with their rank. */
export async function loadBests(userId: string): Promise<Entry[]> {
  const { data, error } = await createClient()
    .from("leaderboard")
    .select("board, user_id, username, score, correct, asked, achieved_at, rank")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as (Entry & { board: string })[];
}
