---
name: Geoquiz
description: A calm geography quiz for flags and capitals.
colors:
  paper: "#fafafa"
  ink: "#18181b"
  graphite: "#71717a"
  hairline: "#e4e4e7"
  sheet: "#ffffff"
  correct-green: "#059669"
  wrong-red: "#dc2626"
  night-paper: "#0c0c0e"
  night-ink: "#f4f4f5"
  night-graphite: "#a1a1aa"
  night-hairline: "#27272a"
  night-sheet: "#151518"
  night-correct-green: "#34d399"
  night-wrong-red: "#f87171"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
  numeral:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  flag: "6px"
  popover: "8px"
  control: "12px"
  card: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "40px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-ghost:
    textColor: "{colors.graphite}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  answer-option:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  text-input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
  mode-card:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "40px"
---

# Design System: Geoquiz

## Overview

**Creative North Star: "The Quiet Atlas"**

Geoquiz should feel like a well-made atlas: calm pages of paper and ink, where the only colour comes from the world itself. Flags and place names are the content and the colour. Everything around them is black, white and grey, drawn with fine lines like a map grid, so the eye always lands on the question.

The pages are spacious and unhurried, but sure of themselves: large confident headlines, a few large surfaces, and soft, lifted sheets that respond when touched. It is made for adults: no cartoon rewards, no bright buttons and no noise. Delight comes from craft, like a flag that lifts on hover or a globe that turns slightly, not from decoration.

Light and dark mode are equal partners. Both follow the same rules, with paper and ink swapped.

**Key Characteristics:**
- Colour comes only from flags, plus green for right and red for wrong.
- Fine line work (1px hairlines, the line-globe logo and its graticule) as the signature motif.
- Soft, lifted surfaces: gentle shadows at rest, a little more lift on hover.
- One sans family (Geist) with big steps in size and weight; mono only for numbers that change.
- Calm motion: slow ease-out, transform only, off with reduced motion.

## Colors

A monochrome atlas page; colour belongs to the flags.

### Primary
- **Ink** (#18181b, night: #f4f4f5): text, headlines, primary buttons, selected chips, and the hover border of anything clickable. It does the job an accent colour would do elsewhere.

### Neutral
- **Paper** (#fafafa, night: #0c0c0e): the page background.
- **Sheet** (#ffffff, night: #151518): cards, options, inputs and anything that sits on the page.
- **Graphite** (#71717a, night: #a1a1aa): secondary text, descriptions, icons at rest, and the empty meter.
- **Hairline** (#e4e4e7, night: #27272a): borders, dividers, loading placeholders and the faint graticule globe.

### Feedback
- **Correct Green** (#059669, night: #34d399): right answers, the full meter and the time bonus. Nothing else.
- **Wrong Red** (#dc2626, night: #f87171): wrong answers and the Quit confirm button. Nothing else.

### Named Rules
**The Flags Bring the Colour Rule.** No brand or accent colour exists. If an element needs to stand out, use ink, size or weight, never a new hue.

**The Green Means Right Rule.** Green and red mean only right and wrong (and red also means "this ends the game"). Never use them for decoration, links or emphasis.

## Typography

**Display Font:** Geist (with system sans fallback)
**Body Font:** Geist
**Numeral Font:** Geist Mono, for the timer, option numbers and other numbers that change

**Character:** one neutral, modern sans used at very different sizes. The confidence comes from scale and tight tracking on headings, not from a second typeface.

### Hierarchy
- **Display** (600, 4.5rem, line height 1.02, tracking -0.035em): the home page headline only. Balanced over two lines.
- **Headline** (600, 2.25rem to 3.75rem, tracking -0.025em): page titles (Flags, Capitals), the final score, and capital names shown as the question or on home cards.
- **Title** (600, 1.5rem to 1.875rem): card titles and stats.
- **Body** (400, 1rem to 1.125rem, line height 1.5): descriptions and answers. Keep lines under 70 characters.
- **Label** (500, 0.875rem, uppercase, tracking 0.05em, graphite): settings section labels only.

### Named Rules
**The Tabular Numbers Rule.** Any number that changes while you watch it (timer, score, counts) uses tabular numerals so it doesn't jiggle.

## Layout

- A centred 1024px column (`max-w-5xl`) with 32px side padding holds the header and the home page. Settings use a narrower 672px column, the game 768px.
- The home page content is vertically centred under the header.
- Spacing steps: 8, 12, 24, 40 and 56px. Tight inside groups, generous between them, and more space above a heading than below it.
- Desktop only for now. Check every page at 1024px wide and at 1440px wide.

## Elevation & Depth

Surfaces are **soft and lifted**: sheets sit slightly above the paper with a gentle shadow and rise a little on hover. In dark mode shadows barely show, so a lighter sheet colour and the hairline border carry the depth instead.

### Shadow Vocabulary
- **Sheet at rest** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px -4px rgb(0 0 0 / 0.06)`): cards, answer options, inputs and secondary buttons.
- **Sheet lifted** (`box-shadow: 0 2px 4px rgb(0 0 0 / 0.06), 0 12px 32px -8px rgb(0 0 0 / 0.14)`): the hover state of clickable sheets, together with a 2px rise.
- **Flag** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.08), 0 8px 24px -6px rgb(0 0 0 / 0.18)`): every flag, with a 1px hairline ring so white flags keep their edge.

### Named Rules
**The Soft Lift Rule.** Shadows always have a downward offset and a soft blur. Never use a hard offset shadow or a coloured glow.

The three shadows are Tailwind utilities defined in `app/globals.css`: `shadow-sheet`, `shadow-lifted` and `shadow-flag`.

Every page now follows this: flags, settings cards, end screen cards, answer options and the type-in field.

## Shapes

- Gently rounded, with radius growing with size: flags 6px, popovers 8px, buttons, options and inputs 12px, cards 16px, chips and the meter fully round.
- 1px hairline borders on every sheet. Hover darkens the border to ink.
- Line drawings (logo, icons, globe) use round caps and joins with a 1.75px stroke at 24px.

## Components

### Buttons
- **Shape:** gently rounded (12px).
- **Primary:** ink background, paper text, 12px by 24px padding (16px tall for Start). Hover lowers the opacity to 90%. Use one per screen at most.
- **Secondary:** sheet background with a hairline border; hover darkens the border to ink.
- **Ghost:** graphite text only; hover turns it to ink.
- **Danger:** Quit's Confirm uses wrong-red text on a sheet, with a red border on hover.

### Chips
- **Style:** fully round, hairline border on sheet, 14px text.
- **Selected:** ink fill, paper text. Disabled chips fade to 40% opacity.

### Answer Options
- Sheet with a hairline border, 12px radius, large 18px text, and the key number (1 to 4) in graphite mono at the left.
- Right: green border and text. Wrong: red border and text, crossed out at 70% opacity.

### Inputs
- Sheet, hairline border, 12px radius, 18px text. Focus darkens the border to ink.
- A wrong try turns the border red and shakes the field once; a right answer turns it green.

### Mode Cards (home page)
- Sheet with a hairline border, 16px radius, 40px padding, overflow hidden.
- The top part shows a large preview: a 192 by 144px flag, or the capital in headline type beside the capitol icon.
- A faint graticule globe in hairline sits off the top-right corner, tilted 23.4° like the Earth's axis.
- Hover: border to ink, globe turns to -8° over 1s, flag rises 4px, arrow slides 4px right. Ease `cubic-bezier(0.16, 1, 0.3, 1)`. Keyboard focus shows a 2px ink outline, 4px away.

### Settings Screen
- Two columns: a 352px summary on the left, the settings on the right.
- The summary (title, description, a list of the current choices separated by hairlines, and Start) stays in view while the settings scroll.
- Settings sit in three resting sheets (16px radius, 32px padding): what to play, how to answer, and time.

### End Screen
- The same two columns as settings. Left: "X right out of Y" in headline type, the score in a resting sheet, Play again (primary), Change settings (secondary) and Home (ghost), then the settings summary. The left column scrolls with the page so the buttons never hide.
- Right: a "Your run" sheet and a "Missed" sheet listing each missed country with a 48 by 36px flag, its name and (in Capitals) its capital.

### Game Screen
- Top bar: Quit and Pause as quiet ghost buttons with drawn icons on the left, "Question N of M" in the middle, and the score and timer (24px, the timer in mono) on the right. The timer turns wrong-red in the last 10 seconds.
- A 1px hairline under the bar fills with ink as questions are answered.
- The question sits centred, with the score meter beside it and an equal empty space on the other side to keep it centred.
- Paused: the question is replaced by a resting sheet with "Paused", the pauses left and Resume.
- Quit's Confirm appears below Quit as a lifted sheet with wrong-red text.

### Run Dots
- One 10px dot per country in the game, in the order asked: correct-green for right, wrong-red for missed, hairline for not reached. It shows streaks at a glance.

### Slider
- A 6px fully round track: ink up to the thumb, hairline after it.
- The thumb is a 22px ink circle with a 4px sheet border and the resting sheet shadow. Keyboard focus shows a 2px ink outline.

### Score Meter (signature)
- A 12px wide, 288px tall fully round track in hairline beside the question, with the points the next first-try answer is worth above it ("+15", labelled "next").
- The fill is graphite under 50%, ink from 50% and correct-green when full.

## Do's and Don'ts

### Do:
- **Do** let flags and place names be the only colour on the page.
- **Do** use the line-globe motif (logo, graticule) in hairline when a page needs a geographic touch.
- **Do** give every clickable sheet a hover state and a visible keyboard focus outline.
- **Do** keep motion slow, transform-only and wrapped in `motion-safe`.
- **Do** design light and dark together and check both.

### Don't:
- **Don't** add a brand or accent colour, or gradients.
- **Don't** use green or red for anything except right, wrong and ending the game.
- **Don't** put anything colourful or moving near the question during a game.
- **Don't** use emoji, cartoon rewards or confetti; Geoquiz is for adults.
- **Don't** use hard offset shadows or coloured glows.
