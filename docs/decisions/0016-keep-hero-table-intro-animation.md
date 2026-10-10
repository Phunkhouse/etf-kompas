# 0016. Keep the hero table intro animation

Date: 2026-10-10
Status: accepted
Phase: 1b

## Context

SPEC §24 allowed only the result count-up (under 300 ms) to animate. Wireframe B has a hero table intro: the card fades in and the three rows slide in one after another, then the cheapest row is highlighted, about 3 seconds in total. The table is a likely LCP element and its rows start invisible, so LCP (target below 2.0 s, SPEC §22) may be measured late.

## Decision

Keep the animation. It is turned off for `prefers-reduced-motion`. LCP is measured in Phase 3, and the animation is shortened or cut if the LCP target fails. SPEC §4 and §24 now name the hero table intro as the one exception.

## Alternatives considered

- Follow the original SPEC rule and drop the animation: not chosen, David wants to keep it.

## Consequences

- Phase 3 needs an LCP check specifically on the hero with the animation running.
- Timings and easing are in `docs/design/DESIGN-GUIDE.md` section 5.
