# Geoquiz

A geography quiz website with Flags and Capitals modes. Built with Next.js (App Router, TypeScript, Tailwind CSS).

@AGENTS.md

## Project layout
- `app/`: pages (home, settings, game, end screen).
- `components/`: reusable UI pieces (timer, answer buttons, ...).
- `data/countries.ts`: the 197 countries, with their continent, capitals and accepted alternative names. This is the single source of truth for quiz content.
- `lib/supabase/`, `lib/account.ts`, `components/account/`: Supabase clients, the signed-in player, and the sign-in pieces.
- `supabase/migrations/`: database SQL, numbered. The owner runs each new file once in the Supabase SQL Editor; there's no CLI link.
- `supabase/templates/`: the sign-in emails. The owner pastes each into Supabase > Authentication > Emails (subject in the file's first line).
- `public/maps/world.json`: the Maps mode map, built by `npm run map:build` (scripts/build-map.mjs) from Natural Earth 1:50m shapes (public domain, via world-atlas). Rebuild it if the country list changes.
- `lib/map.ts`, `components/map/`: map views per region, projection, and the map component.
- `public/flags/`: one SVG flag per country, named by lowercase ISO code (for example `fr.svg`). From flag-icons (MIT).

## Working rules
- Run `npm run lint` and `npm run build` before pushing.
- Supabase (project `qmhmuyiabeffyzmnnahb`) handles accounts, and later scores. Only the URL and publishable key are used (`.env.local` and Vercel); never the secret key. Access rules live in the database (row level security), so the browser talks to Supabase directly.
- Desktop and phones, English only for now. Screens 1024px and wider use the desktop layout; narrower ones use the phone layout.
- Pull before making changes, because the owner may also edit the code locally.

## Game spec (agreed with the owner)

Agreed with the owner on 2026-10-17, slider and score added 2026-10-19, Hardcore and type-in box clearing added 2026-10-23.

### Stack
- Next.js (TypeScript), developed and tested on localhost.
- Hosting on Vercel at launch. Domain bought at launch.
- Supabase for accounts (added 2026-11-03), and for scores and leaderboards as they come in.

### Countries
- 197 countries: the 193 UN members plus Taiwan, Kosovo, Vatican City (Holy See) and Palestine.
- Six continents: Africa, Asia, Europe, North America, South America, Oceania.
- Countries in two continents: Russia goes in Europe, Egypt in Africa, and Turkey, Kazakhstan, Georgia, Armenia, Azerbaijan and Cyprus in Asia.

### Home page
- Three cards, **Flags**, **Capitals** and **Maps**, each leading to its settings screen. The Maps card shows a random country's outline (from `public/maps/shapes/`), drawn in ink.

### Settings screen (same for Flags, Capitals and Maps)
- **Region:** World, or 1 to 5 continents. All 6 can't be picked, because that is World.
- **Questions:** a slider under Region sets how many countries to name, from 10 up to every country in the chosen region, in steps of 1. It starts at the maximum and resets to the new maximum when the region changes. The countries are a random pick from the region.
- **Answer mode:** multiple choice or type-in. Maps offers Find it, Name it · multiple choice and Name it · type it in, and starts on Find it.
- **Time:**
  - 3 min, +5 s per correct answer
  - 5 min, +5 s per correct answer
  - 10 min, countdown only
  - 20 min, countdown only
  - 1 min, +5 s per correct answer (only when exactly one continent is picked)
- **Retry (multiple choice only):** on or off. When it's on, the player gets one retry.
- **Mode:** Practice, Ranked or Hardcore (a block under Start, added 2026-11-04). Practice leaves every setting free and is never saved. Ranked and Hardcore are saved to leaderboards (see Ranked games). Locked settings say "Set by Ranked." or "Set by Hardcore.", and Start reads Start Ranked or Start Hardcore.
- **Ranked:** World or one continent, every country in it, 5 min +5 s per correct answer, retry off. Answer mode stays free.
- **Hardcore:** the player must name all 197 countries (World only) in 1 min, +5 s per correct answer, with one try per question in both multiple choice and type-in. The meter rises and drains 10% slower (+18% per correct answer, 4.5% per second). Region, Questions, Time and Retry are locked while it's on; Answer mode stays free. Skip, pauses and points are unchanged.

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
  - In type-in, any one of them is accepted (confirmed by the owner on 2026-11-04).
- **End of game:** the game ends when the timer hits zero or when every country in the selection has been asked, whichever comes first.
- **Score:** starts at 0. Only a first-try correct answer scores; a correct answer after a wrong try scores nothing but still counts as right.
- **Meter:** a vertical meter beside the question. It starts empty, rises 20% per correct answer (including after a retry), and drains 5% per second, also during the pause between questions. Any wrong try or skip resets it to 0%.
  - Points depend on the meter just before the answer: empty 0% = +5, under 50% = +10, 50% to 99% = +15, full 100% = +25.
  - When it reaches 100% it holds for 3 seconds before draining, and a correct answer while full restarts the hold.
  - The timer's +5 s bonus still applies alongside the score.
- **End screen:** shows "X right out of Y" and the final score. Ranked games are saved for signed-in players (see Ranked games).

### Implementation choices (not from the owner; change freely if asked)
- Multiple choice shows 4 options. Wrong options come from the same continent as the answer.
- After a correct answer the next question appears after 0.7 s; after a revealed answer, after 1.8 s. The timer keeps running.
- Keys 1 to 4 pick a multiple choice option.
- The Questions slider has quick picks (10, 25, 50, All) and shows its number above the handle.
- The meter marks its points zones (+5, +10, +15, +25) beside the track.
- The end screen lists the missed countries.

### Accounts (agreed 2026-10-27, built 2026-11-03)
- Anyone can play without an account. Signing in is only needed to save scores.
- Sign in with Google or an emailed link (Supabase Auth). A link only works in the browser it was asked from.
- At first sign-in the player picks a unique username: 3 to 20 letters, numbers or underscores, not case-sensitive, with a small blocklist. Emails are never shown to others.
- Header: "Sign in" for guests; for players, a round initial that opens a menu with the username, email, Profile and Sign out. Hidden during a game.
- A Privacy link sits in the footer of every page except the quiz pages, and on the sign-in page.
- Profile page (`/u/<username>`, not case-sensitive, built 2026-11-04): public. Shows the username, join month, boards played out of 56, and the best score and rank on every board in four groups (each row opens that leaderboard). On their own profile, players can change their username, sign out, and delete their account (with a second "Delete for good" step), which removes their profile and scores. Leaderboard names link to profiles.

### Ranked games (built 2026-11-04)
- 56 leaderboards: Flags and Capitals (multiple choice, type-in) and Maps (Find it, Pick name, Type name), each × 8 boards: Hardcore, and Ranked World or one of the six continents.
- Only Ranked and Hardcore games are saved, picked in the Mode block. A Practice game is never saved, even if its settings happen to match. The summary's Mode row shows Practice, Ranked or Hardcore.
- End screen: signed-in players' ranked games save automatically, showing "New personal best" with their rank, or their standing best. Guests see "Sign in to save your score"; the game waits in the browser for up to an hour and saves when they return signed in. A score of 0 isn't saved.
- Only each player's best per board is kept: higher score wins, then more right answers. Ties rank whoever got there first.
- Leaderboard page (`/leaderboard`, built 2026-11-04): filters for Flags or Capitals, multiple choice or type-in, and the board, kept in the address (`?board=flags:choice:europe`) so links open the right board. It shows the top 100 (rank, player, right answers, score, date); the player's own row is highlighted, and pinned below when they're outside the top 100. Linked from a trophy in the header (hidden during a game) and from the end screen's ranked card.
- The database (`submit_score`) rejects impossible games: over 25 points per right answer, more time than the clock allowed, faster than the answer delays allow, or an unfinished game that didn't use up the clock.

### Look and feel
- Desktop and phones (phone support added 2026-10-24), English only for now.
- On phones: the settings show one column with Start in a bar fixed to the bottom, the meter runs sideways under the game's top bar, and keyboard-only hints (keys 1 to 4, "Press Enter") are hidden on touch screens.
- Minimal and clean, aimed at adults rather than children.
- A light and dark mode toggle, shown as an icon of the current mode: a sun in light mode and a moon in dark mode. With no choice saved, the site follows the system theme, even when it changes.
- Logo: a line globe whose outline forms a "G", beside "Geoquiz" in the header and in the browser tab.
- Home page cards show a random flag and a random capital (with a government building icon) on every load. They always come from two different countries and never repeat the previous load's countries.

### Maps mode (agreed 2026-11-07, game built 2026-11-07)
- A third quiz beside Flags and Capitals, with the same settings, timer, meter, score, pauses, end screen and Practice / Ranked / Hardcore modes.
- Three answer modes: **Find it** (a country's name is shown; click it on the map), **Name it · multiple choice** and **Name it · type-in** (a country is highlighted; name it).
- Find it gives 3 tries (1 in Hardcore). A wrong click shows that country's name in red; after the third miss the right country turns green.
- The map fits the region: the whole world for World, the continent's box for one continent, and the box around several (the world when Oceania is mixed with others). Pinch, scroll, drag and +/− buttons zoom and pan.
- Countries too small to tap (Vatican City, Monaco, Pacific islands...) get a small round marker, drawn above every country and border. Once zoomed in far enough that the island itself is about 10 px across, its marker steps aside and the real shape is shown and tapped (both answer modes, added 2026-11-07). Tuvalu has no shape at this detail, so it's only a marker.
- Finger taps (phones and tablets only; mouse clicks stay exact, asked by the owner on 2026-11-08) are forgiving: a tap within 12 px of a small country's dot picks it (the closest dot wins), a tap on land picks that country, and a tap on the sea within 10 px of a coast picks the closest country. The country under the finger darkens while it's pressed.
- The meter drains 10% slower in Maps (4.5% per second, 4.05% in Hardcore), leaving time to pan and zoom (asked by the owner on 2026-11-07). Rise and points are unchanged.
- Kosovo is matched by name; Northern Cyprus and Somaliland are drawn as part of Cyprus and Somalia. Other territories (Greenland, Western Sahara...) are plain land that can't be picked; Antarctica is left off.
- Looks: grey sea, white region countries, grey land outside the region (dark mode: darkest sea, brighter region). The country asked about is ink; green and red only mean right and wrong.
- Game screen: on phones the game covers the whole screen (no site header) with the map edge to edge between the top bar and the answers; on desktop the stage widens to 1280px and the map fills the window's height, with the meter beside it and the four options in one row.
- The map can always be moved far enough to centre any country in the game, even one on the very edge (Samoa and Tonga in the world view), plus a quarter of the frame to spare. Tiny countries are aimed at by their marker, since some span the date line (Kiribati).
- Phones (upright frames): a wide region is drawn up to 1.6× larger than "fits entirely", so it fills the screen; the rest is a drag away. Tiny countries asked in Name it get a ring around their marker.
- Name it zooms in on each highlighted country so it fills about a third of the map (up to 6×), keeping its neighbours in view. Tiny islands are zoomed until their land is about 18 px across (up to 40×), so their real shape shows inside the ring; ones too small even then (Vatican City, Tuvalu) keep their dot. Players can zoom up to 40× themselves. Moving to the next country is a 0.45 s flight (asked by the owner on 2026-11-07): up to about a screen-width away (Egypt to Sudan, Germany to Romania) it just glides at the same zoom; farther jumps pull back a little mid-way, more the farther they go, up to 35% at three screen-widths. The meter doesn't drain during the flight, so it never costs points. Find it never zooms on its own (that would give the answer away), except to bring a revealed answer on screen.
- Leaderboards: 24 Maps boards (3 answer modes × Hardcore, World and six continents), added 2026-11-08. On the leaderboard and profile, Maps' answer modes read Find it, Pick name and Type name.
- Game screen details: feedback ("Correct", "That's Germany. 2 tries left.") floats in a small sheet at the top of the map rather than a row above it; the first question shows a "Pinch (or scroll) to zoom, drag to move" hint on the map.
- End screen: Maps lists missed countries with their outline (public/maps/shapes) instead of their flag. Outlines that would be mostly ocean drop far-flung pieces (French Guiana, the Chatham Islands) and island chains fall back to their main island (Micronesia, Palau).

### Later
- An installable web app (PWA), maybe with offline practice. Discussed 2026-11-04, on hold.
