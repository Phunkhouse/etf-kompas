# 0018. Design tokens, palette and fonts come from wireframe B

Date: 2026-10-10
Status: accepted
Phase: 1b

## Context

SPEC §8 and §24 left palette and fonts open ("a strong serif or grotesk", "one decisive accent") and the first Phase 1b plan proposed shortlisting fonts. The wireframe canvas already defines both, and David asked to use what is in the design and to document the palette as a design guide.

## Decision

- Fonts: IBM Plex Sans (body and headings, variable weight 400 to 700) and IBM Plex Mono 500 (tags), self-hosted through `next/font` with the `latin` and `latin-ext` subsets.
- Palette and component values are taken from the wireframe, documented with calculated contrast ratios in `docs/design/DESIGN-GUIDE.md`, and implemented as CSS variables in `src/app/variables.scss`. Colour hex values are mirrored in `src/styles/colors.ts`, and a test keeps the two in sync.
- The wireframe's ~20 font sizes are merged into a 11-step token scale (some elements change by 1 px or, for tags, 2 px). David reviews it on `/styleguide`.
- Every colour pair used in the UI is listed in `src/styles/contrast-pairs.ts`. `pnpm contrast:check` (part of `pnpm check` and CI) fails on a pair below WCAG AA.

## Alternatives considered

- Shortlist two font pairings and let David pick on `/styleguide`: dropped, because the design already chose the fonts.
- Keep the wireframe's exact font sizes as tokens: not done, to keep the scale small. This is open to change after the styleguide review.

## Consequences

- Plex Sans digits are tabular by default, so the tabular-figures e2e test is a regression guard, not proof of the CSS setting.
- Preloading both subsets costs extra requests. Check the font transfer size against the 90 KB JS and LCP budgets when Lighthouse runs in Phase 3.
- Adding a colour means editing `variables.scss`, `colors.ts` and, if used for text or controls, `contrast-pairs.ts`.
