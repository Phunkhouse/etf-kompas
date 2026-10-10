# 0015. Calculator inputs: monthly amount and horizon only

Date: 2026-10-10
Status: accepted
Phase: 1b

## Context

SPEC §4 and §21 defined three inputs: an initial amount, a monthly contribution and a horizon of 5, 10 or 20 years. Wireframe B draws only the monthly amount and the horizon.

## Decision

Drop the initial lump sum for now. The calculator takes `monthly`, `years` (5, 10 or 20), the selected fund and the return assumption. SPEC §4 and §21 are updated to match.

## Alternatives considered

- Add an initial-amount input to the design and keep the spec as it was: not chosen. David decided to drop it for now and gave no further reason.

## Consequences

- Fewer inputs on the page, and a simpler formula and test set (no `initial` term, FX fee applies to monthly deposits only).
- The lump sum can return later as a new input, with a new note and a design change.
