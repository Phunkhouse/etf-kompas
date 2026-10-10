# 0017. Wireframe copy is the working copy

Date: 2026-10-10
Status: accepted
Phase: 1b

## Context

The copy drawn in wireframe B differs in places from the copy brief in SPEC §25 (for example the CTA "Spočítat, kolik ušetřím" instead of "Spočítat moje poplatky", and the hero headlines, which are not from the headline bank).

## Decision

Use the copy from the wireframe for now. It is reviewed later by David (SPEC §17.10), and the plain-language rules and `pnpm copy:check` from SPEC §25 still apply when Phase 3 builds it.

## Alternatives considered

- Use the SPEC §25 wording: not chosen, David chose to keep the design's copy and review it later.

## Consequences

- All strings still live in `src/content/copy.ts`. Where wireframe copy breaks a `copy:check` rule, the check or the string is changed in Phase 3 and David decides which.
- `docs/design/wireframe-b.md` holds the wireframe copy as the starting set.
