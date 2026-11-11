# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Curious adults who like geography and want to test or improve what they know about flags, capitals and where countries are, a few minutes at a time.
- Friends competing on scores: signed-in players save their best Ranked and Hardcore games to public leaderboards and profiles.

## Product Purpose

Geoquiz is a geography quiz with three quizzes: **Flags** (see a flag, name the country), **Capitals** (see a country, name its capital) and **Maps** (find a country on the map, or name the one highlighted). It covers 197 countries.

A game is a success when the player both:

- **learns:** knows more flags, capitals or map positions than before, helped by the list of missed countries at the end;
- **beats a score:** does better than last time.

## Positioning

Two things, equally:

- **Clean and calm:** no ads, no clutter, no childish look. A quiz that feels good to use.
- **The score meter:** quick correct answers in a row fill the meter and score more, so speed and streaks are rewarded.

## Operating Context

- Played on desktop or phone, in short sessions, at the player's own pace.
- Each game is set up first: region (World or 1 to 5 continents), number of questions, answer mode (multiple choice or type-in; Maps also has Find it), time limit, retry, and mode: Practice (anything goes, never saved), Ranked or Hardcore (fixed settings, saved to leaderboards).
- The full game rules live in the "Game spec" section of `CLAUDE.md`.

## Capabilities and Constraints

- Desktop and phones, English only for now.
- Supabase handles accounts (Google or an emailed link) and scores. Anyone can play without an account; signing in is only needed to save Ranked and Hardcore scores, which go on 56 leaderboards and a public profile.
- Light mode is warm cream paper; dark mode is near-black. The site follows the system theme until the player picks one. Maps also has its own map themes.
- Country content comes only from `data/countries.ts`; map shapes come from Natural Earth (`public/maps/`).
- In type-in, any one capital counts for countries with several (confirmed by the owner).
- **Later:** maybe an installable web app (PWA), possibly with offline practice.

## Brand Commitments

- Name: **Geoquiz**.
- Logo: a line globe whose outline forms a "G", beside the name in the header and in the browser tab.
- Aimed at adults rather than children.

## Evidence on Hand

- 197 country flags in `public/flags/` (flag-icons, MIT).
- Country data based on world-countries (ODbL), curated in `data/countries.ts`.
- Map shapes and country outlines from Natural Earth 1:50m (public domain, via world-atlas).
- Real scores now exist on the leaderboards, but there are no testimonials or usage statistics. Don't invent any.

## Product Principles

1. **The question comes first.** During a game, nothing competes with the flag, country or map being asked about.
2. **Calm, not childish.** Adults should feel at home: no cartoon rewards, no noise.
3. **Reward speed and streaks.** The meter and score make a good run feel good.
4. **Every game teaches.** Show the right answer when it's missed and list the misses at the end.
