# 0020. Calculator input limits

Date: 2026-10-11
Status: accepted
Phase: 2

## Context

SPEC §21 requires inputs to be clamped at the boundary and also requires that zero deposits give cost 0. The wireframe's slider runs from 500 to 20 000 Kč in steps of 500. The return assumption is editable in the "Jak počítáme" disclosure, so it needs a range.

## Decision

The pure function clamps `monthly` to 0 to 20 000 Kč (whole Kč), so a zero deposit is valid; the slider in the UI enforces 500 to 20 000 in steps of 500. `years` outside 5, 10, 20 goes to the nearest of them (a tie to the smaller). `grossReturn` is clamped to 0 to 12 %. Non-finite numbers fall back to the default.

## Alternatives considered

- Clamp `monthly` to 500 to 20 000 in the function: not chosen, it contradicts the required "zero deposits give cost 0" test.
- Allow a negative or very high return: not chosen. 0 % is the floor because a negative assumed return would read as a forecast of loss, and 12 % is the cap so the number does not look like a promise of returns (see note 0010).

## Consequences

- The reasons for the return range were proposed by the agent and approved by David on 2026-10-11.
- Raising the cap or the slider range later is a change to `docs/METHODOLOGY.md` §6 and to the tests.
