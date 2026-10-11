# 0031. Hero b is compact on phones so the button stays above the fold

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

SPEC §22 says the hero, including the primary button, fits a 375 x 667 screen without scrolling. Built as drawn, hero b has its button's bottom edge at 851 px on a production build, 184 px too low. The three table rows alone were 97, 117 and 110 px. The wireframe has the button at about 660 px at 390 px wide, but with the real wording and the real fees at 375 px it does not hold. I tried layouts in the browser. Tighter rows, a narrower fee column, a 48 px header and a 28 px headline reached 730 px. Hiding the lead gave 680 px. Also hiding the visual table caption gave 647 px, with every table row and sub-label still there.

## Decision

On phones (below the md breakpoint): the lead is hidden, the visible table caption is hidden (screen readers still read it), the table has denser rows, a 54/22/24 column split (a first try at 60/16/24 made the "POPLATEK" header collide with its neighbour), narrower side padding and tighter header letters, pills are smaller, the header is 48 px high, and the hero headline is 28 px (new token `--font-size-hero-phone`). From md up nothing changes. The geometry is tested in `e2e/hero-fit.spec.ts`.

## Alternatives considered

- Put the button above the table, so it always fits: raised by the agent, not chosen.
- Loosen the requirement, for example "the button and the first row fit": raised by the agent, not chosen, because it would change SPEC §22.

## Consequences

- The button's bottom edge is at 656 px at 375 x 667, an 11 px margin. A longer headline, a fourth line anywhere or a wider font fallback could break it, and the e2e test will say so.
- 667 px is the screen, not the browser. In a real phone browser or an in-app browser the bars take 100 px or more, so the button will often be below the fold anyway. The spec's number is the one that is tested.
- Phone visitors do not see the lead sentence. Desktop does.
- The 28 px headline is smaller than the 32 px in the wireframe and is not on the existing scale, so it has its own token (DESIGN-GUIDE type table updated).
- Pills are smaller on phones everywhere, not only in this table.
- David chose this option on 2026-10-11 and said it can be iterated on later. No further reason was given.
