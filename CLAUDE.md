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

Agreed with the owner on 2026-10-17, slider and score added 2026-10-19, Hardcore and type-in box clearing added 2026-10-23.

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
- **Questions:** a slider under Region sets how many countries to name, from 10 up to every country in the chosen region, in steps of 1. It starts at the maximum and resets to the new maximum when the region changes. The countries are a random pick from the region.
- **Answer mode:** multiple choice or type-in.
- **Time:**
  - 3 min, +5 s per correct answer
  - 5 min, +5 s per correct answer
  - 10 min, countdown only
  - 20 min, countdown only
  - 1 min, +5 s per correct answer (only when exactly one continent is picked)
- **Retry (multiple choice only):** on or off. When it's on, the player gets one retry.
- **Hardcore:** on or off. When it's on, the player must name all 197 countries (World only) in 1 min, +5 s per correct answer, with one try per question in both multiple choice and type-in. The meter rises and drains 10% slower (+18% per correct answer, 4.5% per second). Region, Questions, Time and Retry are locked while it's on; Answer mode stays free. Skip, pauses and points are unchanged.

### Gameplay
- **Flags:** a flag is shown and the player names the country.
- **Capitals:** a country is shown and the player names its capital.
- **Quit:** pressing Quit opens a "Confirm" button below it, and only Confirm ends the game. The timer keeps running while it's open. A click elsewhere or Esc closes it.
- **Pause:** a Pause button beside Quit, with a limit of 3 pauses per game. Pausing freezes the timer and the meter and hides the question until Resume.
- **Header title:** during a game the Geoquiz title doesn't link home; only Quit leaves the game. Returning to Flags or Capitals always starts at the settings screen.
- **Multiple choice:**
  - With retry off, one wrong answer reveals the correct one.
  - With retry on, two wrong answers reveal it.
  - There is no skip button.
- **Type-in:**
  - The player gets up to 3 tries, and the correct answer is shown after the third wrong try.
  - A wrong try empties the answer box, ready for the next try.
  - Answers aren't case-sensitive and are accepted with or without accents.
  - Common names count (for example "USA"), but misspellings count as wrong.
  - A skip button is available, and a skip counts as wrong.
- **Countries with more than one capital:**
  - In multiple choice they appear as one option joined with a slash, such as "La Paz/Sucre" or "Pretoria/Cape Town/Bloemfontein".
  - In type-in, any one of them is accepted. (Assumed; not yet confirmed by the owner.)
- **End of game:** the game ends when the timer hits zero or when every country in the selection has been asked, whichever comes first.
- **Score** (not saved yet): starts at 0. Only a first-try correct answer scores; a correct answer after a wrong try scores nothing but still counts as right.
- **Meter:** a vertical meter beside the question. It starts empty, rises 20% per correct answer (including after a retry), and drains 5% per second, also during the pause between questions. Any wrong try or skip resets it to 0%.
  - Points depend on the meter just before the answer: empty 0% = +5, under 50% = +10, 50% to 99% = +15, full 100% = +25.
  - When it reaches 100% it holds for 3 seconds before draining, and a correct answer while full restarts the hold.
  - The timer's +5 s bonus still applies alongside the score.
- **End screen:** shows "X right out of Y" and the final score. Neither is saved, and there's no leaderboard yet.

### Implementation choices (not from the owner; change freely if asked)
- Multiple choice shows 4 options. Wrong options come from the same continent as the answer.
- After a correct answer the next question appears after 0.7 s; after a revealed answer, after 1.8 s. The timer keeps running.
- Keys 1 to 4 pick a multiple choice option.
- The Questions slider has quick picks (10, 25, 50, All) and shows its number above the handle.
- The meter marks its points zones (+5, +10, +15, +25) beside the track.
- The end screen lists the missed countries.

### Look and feel
- Desktop only for now, and English only.
- Minimal and clean, aimed at adults rather than children.
- A light and dark mode toggle, shown as an icon of the current mode: a sun in light mode and a moon in dark mode. With no choice saved, the site follows the system theme, even when it changes.
- Logo: a line globe whose outline forms a "G", beside "Geoquiz" in the header and in the browser tab.
- Home page cards show a random flag and a random capital (with a government building icon) on every load. They always come from two different countries and never repeat the previous load's countries.

### Later
- Scores and leaderboards with Supabase.
- A Maps mode.
- Phone support.
