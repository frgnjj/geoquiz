import type { Country } from "@/data/countries";

export type Mode = "flags" | "capitals";

/**
 * Makes typed answers comparable: ignores case, accents, punctuation,
 * "&" vs "and", "St." vs "Saint" and a leading "The".
 * Misspellings are still wrong.
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

/** Every answer that counts as correct for this country in this mode. */
export function acceptedAnswers(country: Country, mode: Mode): string[] {
  return mode === "flags"
    ? [country.name, ...country.aliases]
    : [...country.capitals, ...country.capitalAliases];
}

export function isCorrect(typed: string, country: Country, mode: Mode): boolean {
  const guess = normalize(typed);
  if (!guess) return false;
  return acceptedAnswers(country, mode).some((answer) => normalize(answer) === guess);
}

/** The answer as shown on screen. Several capitals are joined with "/". */
export function displayAnswer(country: Country, mode: Mode): string {
  return mode === "flags" ? country.name : country.capitals.join("/");
}
