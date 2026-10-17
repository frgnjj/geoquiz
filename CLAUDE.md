# Geoquiz

A geography quiz website with Flags and Capitals modes. Built with Next.js (App Router, TypeScript, Tailwind CSS).

@AGENTS.md

## Project layout
- `app/`: pages (home, settings, game, end screen).
- `components/`: reusable UI pieces (timer, answer buttons, ...).
- `data/countries.ts`: the 197 countries, with their continent, capitals and accepted alternative names. This is the single source of truth for quiz content.
- `public/flags/`: one SVG flag per country, named by lowercase ISO code (for example `fr.svg`). From flag-icons (MIT).

## Working rules
- Run `npm run lint` and `npm run build` before pushing.
- No backend in version 1. Scores and leaderboards come later with Supabase.
- Desktop only and English only for now.
- Pull before making changes, because the owner may also edit the code locally.

## Game spec (agreed with the owner)

Agreed with the owner on 2026-10-17.

### Stack
- Next.js (TypeScript), developed and tested on localhost.
- Hosting on Vercel at launch. Domain bought at launch.
- No backend in version 1. Supabase gets added later when scores and leaderboards come in.

### Countries
- 197 countries: the 193 UN members plus Taiwan, Kosovo, Vatican City (Holy See) and Palestine.
- Six continents: Africa, Asia, Europe, North America, South America, Oceania.
- Countries in two continents: Russia goes in Europe, Egypt in Africa, and Turkey, Kazakhstan, Georgia, Armenia, Azerbaijan and Cyprus in Asia.

### Home page
- Two buttons, **Flags** and **Capitals**, each leading to its settings screen.

### Settings screen (same for Flags and Capitals)
- **Region:** World, or 1 to 5 continents. All 6 can't be picked, because that is World.
- **Answer mode:** multiple choice or type-in.
- **Time:**
  - 3 min, +5 s per correct answer
  - 5 min, +5 s per correct answer
  - 10 min, countdown only
  - 20 min, countdown only
  - 1 min, +5 s per correct answer (only when exactly one continent is picked)
- **Retry (multiple choice only):** on or off. When it's on, the player gets one retry.

### Gameplay
- **Flags:** a flag is shown and the player names the country.
- **Capitals:** a country is shown and the player names its capital.
- **Multiple choice:**
  - With retry off, one wrong answer reveals the correct one.
  - With retry on, two wrong answers reveal it.
  - There is no skip button.
- **Type-in:**
  - The player gets up to 3 tries, and the correct answer is shown after the third wrong try.
  - Answers aren't case-sensitive and are accepted with or without accents.
  - Common names count (for example "USA"), but misspellings count as wrong.
  - A skip button is available, and a skip counts as wrong.
- **Countries with more than one capital:**
  - In multiple choice they appear as one option joined with a slash, such as "La Paz/Sucre" or "Pretoria/Cape Town/Bloemfontein".
  - In type-in, any one of them is accepted. (Assumed; not yet confirmed by the owner.)
- **End of game:** the game ends when the timer hits zero or when every country in the selection has been asked, whichever comes first.
- **End screen:** shows "X right out of Y". The result isn't saved, and there's no leaderboard yet.

### Implementation choices (not from the owner; change freely if asked)
- Multiple choice shows 4 options. Wrong options come from the same continent as the answer.
- After a correct answer the next question appears after 0.7 s; after a revealed answer, after 1.8 s. The timer keeps running.
- Keys 1 to 4 pick a multiple choice option. A wrong typed answer stays in the box so typos can be fixed.
- The end screen lists the missed countries.

### Look and feel
- Desktop only for now, and English only.
- Minimal and clean, aimed at adults rather than children.
- A light and dark mode toggle.

### Later
- Scores and leaderboards with Supabase.
- A Maps mode.
- Phone support.
