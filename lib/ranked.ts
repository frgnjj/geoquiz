import { CONTINENTS, type Continent } from "@/data/countries";
import type { Mode } from "@/lib/answers";
import { countriesFor, HARDCORE_LOCKS, type AnswerMode, type Settings } from "@/lib/quiz";

/**
 * Ranked games have fixed settings, so scores on one leaderboard are comparable.
 * Each mode and answer mode has seven boards: Hardcore, and each whole continent
 * in 5 min +5s with retry off. That's 2 × 2 × 7 = 28 boards.
 */
export type Preset = { id: string; label: string; continent?: Continent };

export const RANKED_TIME_ID = "5";

export const PRESETS: Preset[] = [
  { id: "hardcore", label: "Hardcore" },
  ...CONTINENTS.map((continent) => ({
    id: continent.toLowerCase().replace(" ", "-"),
    label: continent,
    continent,
  })),
];

/** The settings a preset sets. Answer mode stays the player's choice. */
export function presetSettings(preset: Preset, answerMode: AnswerMode): Settings {
  if (!preset.continent) return { ...HARDCORE_LOCKS, answerMode, hardcore: true };
  return {
    continents: [preset.continent],
    answerMode,
    timeId: RANKED_TIME_ID,
    retry: false,
    questionCount: countriesFor([preset.continent]).length,
    hardcore: false,
  };
}

/** The preset these settings match exactly, or null when the game isn't ranked. */
export function rankedPreset(settings: Settings): Preset | null {
  if (settings.hardcore) return PRESETS[0];
  const [continent] = settings.continents;
  if (settings.continents.length !== 1 || settings.timeId !== RANKED_TIME_ID) return null;
  // Retry only matters in multiple choice; typed answers always get the same tries.
  if (settings.answerMode === "choice" && settings.retry) return null;
  const all = countriesFor([continent]).length;
  if ((settings.questionCount ?? all) !== all) return null;
  return PRESETS.find((p) => p.continent === continent) ?? null;
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
    mode === "flags" ? "Flags" : "Capitals",
    answerMode === "choice" ? "Multiple choice" : "Type-in",
    PRESETS.find((p) => p.id === presetId)?.label ?? presetId,
  ].join(" · ");
}
