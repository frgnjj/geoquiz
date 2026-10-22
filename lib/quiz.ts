import { CONTINENTS, COUNTRIES, type Continent, type Country } from "@/data/countries";

export type AnswerMode = "choice" | "type";

export type TimeOption = {
  id: string;
  label: string;
  seconds: number;
  /** Seconds added for each correct answer. */
  bonus: number;
  /** Only offered when exactly one continent is picked. */
  singleContinentOnly?: boolean;
};

export const TIME_OPTIONS: TimeOption[] = [
  { id: "1", label: "1 min", seconds: 60, bonus: 5, singleContinentOnly: true },
  { id: "3", label: "3 min", seconds: 180, bonus: 5 },
  { id: "5", label: "5 min", seconds: 300, bonus: 5 },
  { id: "10", label: "10 min", seconds: 600, bonus: 0 },
  { id: "20", label: "20 min", seconds: 1200, bonus: 0 },
];

export type Settings = {
  /** Empty means World. Never all six. */
  continents: Continent[];
  answerMode: AnswerMode;
  timeId: string;
  /** Multiple choice only: one extra try per question. */
  retry: boolean;
  /** How many countries to ask. Null means every country in the region. */
  questionCount: number | null;
};

export const DEFAULT_SETTINGS: Settings = {
  continents: [],
  answerMode: "choice",
  timeId: "3",
  retry: false,
  questionCount: null,
};

export const TYPE_IN_TRIES = 3;
export const MIN_QUESTIONS = 10;
export const CHOICE_COUNT = 4;
export const MAX_PAUSES = 3;

export function availableTimes(continents: Continent[]): TimeOption[] {
  return TIME_OPTIONS.filter((t) => !t.singleContinentOnly || continents.length === 1);
}

export function timeOption(id: string): TimeOption {
  return TIME_OPTIONS.find((t) => t.id === id) ?? TIME_OPTIONS[1];
}

export function regionLabel(continents: Continent[]): string {
  if (continents.length === 0) return "World";
  return CONTINENTS.filter((c) => continents.includes(c)).join(", ");
}

export function countriesFor(continents: Continent[]): Country[] {
  if (continents.length === 0) return COUNTRIES;
  return COUNTRIES.filter((c) => continents.includes(c.continent));
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Multiple choice options: the answer plus wrong options from the same continent,
 * so they're plausible rather than obvious. Order is shuffled.
 */
export function makeChoices(answer: Country): Country[] {
  const neighbours = COUNTRIES.filter(
    (c) => c.continent === answer.continent && c.code !== answer.code,
  );
  return shuffle([answer, ...shuffle(neighbours).slice(0, CHOICE_COUNT - 1)]);
}
