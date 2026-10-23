# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Now:** curious adults who like geography and want to test or improve what they know about flags and capitals, a few minutes at a time.
- **Later:** friends competing on scores, once scores and leaderboards arrive.

## Product Purpose

Geoquiz is a geography quiz with two modes: **Flags** (see a flag, name the country) and **Capitals** (see a country, name its capital). It covers 197 countries.

A game is a success when the player both:

- **learns:** knows more flags or capitals than before, helped by the list of missed countries at the end;
- **beats a score:** does better than last time.

## Positioning

Two things, equally:

- **Clean and calm:** no ads, no clutter, no childish look. A quiz that feels good to use.
- **The score meter:** quick correct answers in a row fill the meter and score more, so speed and streaks are rewarded.

## Operating Context

- Played on desktop or phone, in short sessions, at the player's own pace.
- Each game is set up first: region (World or 1 to 5 continents), number of questions, multiple choice or type-in, time limit, and retry.
- The full game rules live in the "Game spec" section of `CLAUDE.md`.

## Capabilities and Constraints

- Desktop and phones, English only for now.
- No backend in version 1. Scores aren't saved and there's no leaderboard yet; Supabase adds both later.
- Light and dark mode, following the system theme until the player picks one.
- Country content comes only from `data/countries.ts`.
- **Undecided:** whether any single capital counts in type-in mode for countries with several capitals (assumed yes, not confirmed by the owner).
- **Later:** a Maps mode.

## Brand Commitments

- Name: **Geoquiz**.
- Logo: a line globe whose outline forms a "G", beside the name in the header and in the browser tab.
- Aimed at adults rather than children.

## Evidence on Hand

- 197 country flags in `public/flags/` (flag-icons, MIT).
- Country data based on world-countries (ODbL), curated in `data/countries.ts`.
- No players, testimonials, scores or statistics exist yet. Don't invent any.

## Product Principles

1. **The question comes first.** During a game, nothing competes with the flag or country being asked.
2. **Calm, not childish.** Adults should feel at home: no cartoon rewards, no noise.
3. **Reward speed and streaks.** The meter and score make a good run feel good.
4. **Every game teaches.** Show the right answer when it's missed and list the misses at the end.
