import type { Country } from "@/data/countries";

export type Mode = "flags" | "capitals" | "maps";

/**
 * Makes typed answers comparable: ignores case, accents, punctuation,
 * "&" vs "and", "St." vs "Saint" and a leading "The".
 * Spelling mistakes are judged separately, in checkAnswer.
 */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.,'’`()\-/]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word === "st" ? "saint" : word))
    .join(" ")
    .replace(/^the /, "");
}

/** Every answer that counts as correct for this country in this mode. Maps asks for the country's name. */
export function acceptedAnswers(country: Country, mode: Mode): string[] {
  return mode === "capitals"
    ? [...country.capitals, ...country.capitalAliases]
    : [country.name, ...country.aliases];
}

/** Names this long (letters only) forgive a couple of spelling mistakes; shorter ones must be exact. */
export const FORGIVING_LENGTH = 9;
export const MISTAKES_ALLOWED = 2;

/**
 * How a typed answer matches: "exact", "close" (a small spelling mistake in a long name, with the
 * right spelling to show), or null when it's wrong. A close guess only counts when no other
 * country's name is as close or closer, so Austria never passes for Australia.
 */
export type AnswerMatch = { kind: "exact" } | { kind: "close"; spelled: string } | null;

export function checkAnswer(typed: string, country: Country, mode: Mode, everyone: Country[]): AnswerMatch {
  const guess = normalize(typed);
  if (!guess) return null;
  const answers = acceptedAnswers(country, mode);
  if (answers.some((answer) => normalize(answer) === guess)) return { kind: "exact" };

  // The closest long answer within the allowed mistakes.
  let best: { spelled: string; mistakes: number } | null = null;
  for (const answer of answers) {
    const target = normalize(answer);
    if (target.replace(/ /g, "").length < FORGIVING_LENGTH) continue;
    const mistakes = typoDistance(guess, target);
    if (mistakes <= MISTAKES_ALLOWED && (!best || mistakes < best.mistakes)) best = { spelled: answer, mistakes };
  }
  if (!best) return null;

  // Wrong if it's as close (or closer) to another country's answer.
  for (const other of everyone) {
    if (other.code === country.code) continue;
    for (const answer of acceptedAnswers(other, mode)) {
      if (typoDistance(guess, normalize(answer)) <= best.mistakes) return null;
    }
  }
  return { kind: "close", spelled: best.spelled };
}

export function isCorrect(typed: string, country: Country, mode: Mode, everyone: Country[]): boolean {
  return checkAnswer(typed, country, mode, everyone) !== null;
}

/**
 * Spelling mistakes between two strings: a wrong, missing or extra letter, or two letters swapped
 * (optimal string alignment distance).
 */
export function typoDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > MISTAKES_ALLOWED + 1) return MISTAKES_ALLOWED + 2;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** The answer as shown on screen. Several capitals are joined with "/". */
export function displayAnswer(country: Country, mode: Mode): string {
  return mode === "capitals" ? country.capitals.join("/") : country.name;
}
