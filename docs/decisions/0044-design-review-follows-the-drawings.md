# 0044. The built page follows the drawings for the header, cost cards, saving box and footer

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

David compared the built page with the rev. 5 drawings (side by side, phone and desktop) and preferred the drawings for the header, the "Za co platíte, aniž to vidíte" cards, the green saving box and the footer logo. He kept the built version for everything else.

## Decision

The built page follows the drawings for: the header (a thin line under it, a logo 28 px tall), the cost cards (number on the left, flat card), the saving box (label in capitals, white heading, only the amount green) and the logo at the top of the footer. The drawings were then updated with the data we have now (rev. 6, PR 63). Reason (David): better visibility, the hero is more compact now, and the overall experience is better.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- The built page and the boards agree again; `e2e/design-rev6.spec.ts` checks the header line, the logo width, the card geometry, the saving box and the footer logo.
- The logo height (28 px) is the nearest spacing token to the drawing's 101 px width, so it is not an exact match.
- The card and FAQ texts in the boards still differ from the built copy (the built wording was kept).
