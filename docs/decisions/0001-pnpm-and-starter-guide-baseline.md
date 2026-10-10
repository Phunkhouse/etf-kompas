# 0001. pnpm and the starter-guide baseline

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

The project needs one tooling baseline. SPEC §12a adopts the team's Next.js starter guide (`docs/starter-guide.md`) and lists where this project differs. The guide is the reference, the spec wins when they disagree.

## Decision

Use pnpm only (Node 24), the guide's lint, format, test and CI setup, and these deviations from the guide:

- Playwright is mobile-first (Pixel 7 primary, one desktop smoke project), because the audience is mobile.
- `next-intl` and `messages/*.json` are dropped, see 0002.
- React Hook Form is dropped: the form has one field, so a native form, Zod and a small hook are enough and save bundle size.
- No Postgres service in CI; lead storage is tested against a mocked repository.
- Tokens keep the guide's names, the values come from the palette in SPEC §8.

## Alternatives considered

Reason for the baseline: SPEC §12a ("adopted from the starter guide"). No alternative package manager or toolchain was recorded.

## Consequences

- Every change runs `pnpm check && pnpm format:check` and CI runs the same steps.
- Guide placeholders (`<sha>`) and tool-version details are verified, not copied. Corrections go in `docs/AI-LOG.md`.
- Revisit the deviations if the form grows beyond one field.
