import { CONTINENTS, type Continent } from "@/data/countries";
import type { Mode } from "@/lib/answers";
import { QUIZ_INFO, type Settings } from "@/lib/quiz";

/**
 * Ranked and Hardcore games are saved to leaderboards. Each mode and answer mode has
 * eight boards: Hardcore, and Ranked World or one continent (5 min +5s, no retry).
 * That's 2 × 2 × 8 = 32 boards.
 */
export type Preset = { id: string; label: string };

const HARDCORE: Preset = { id: "hardcore", label: "Hardcore" };
const WORLD: Preset = { id: "world", label: "World" };

const slug = (continent: Continent) => continent.toLowerCase().replace(" ", "-");

export const PRESETS: Preset[] = [
  HARDCORE,
  WORLD,
  ...CONTINENTS.map((continent) => ({ id: slug(continent), label: continent })),
];

/** The leaderboard a game goes on, or null for practice games. */
export function rankedPreset(settings: Settings): Preset | null {
  if (settings.hardcore) return HARDCORE;
  if (!settings.ranked) return null;
  if (settings.continents.length === 0) return WORLD;
  if (settings.continents.length > 1) return null;
  return PRESETS.find((p) => p.id === slug(settings.continents[0])) ?? null;
}

/** A board's id, such as "flags:choice:europe". It matches the boards table in Supabase. */
export function boardId(mode: Mode, settings: Settings): string | null {
  const preset = rankedPreset(settings);
  return preset ? `${mode}:${settings.answerMode}:${preset.id}` : null;
}

/** "Flags · Multiple choice · Europe" */
export function boardLabel(board: string): string {
  const [mode, answerMode, presetId] = board.split(":");
  return [
    QUIZ_INFO[mode as Mode].title,
    answerMode === "find" ? "Find it" : answerMode === "choice" ? "Multiple choice" : "Type-in",
    PRESETS.find((p) => p.id === presetId)?.label ?? presetId,
  ].join(" · ");
}
