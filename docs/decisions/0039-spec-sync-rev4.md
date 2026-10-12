# 0039. SPEC synced with wireframe rev. 4 and calculator v2

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

`docs/SPEC.md` had not been updated since #28. Wireframe revision 4, the calculator v2 decisions and notes 0030 to 0038 had changed the product, so the spec described a different page (eight funds, v1 calculator, editable return, old schedule). David asked for the spec to be checked and then decided seven open points.

## Decision

The spec and `docs/PHASES.md` now follow rev. 4 and the notes up to 0038. Decided by David on 2026-10-12:

1. The PDF is personalised (it carries the visitor's amount and horizon).
2. Returns and past performance are removed from the spec and the page.
3. The glossary no longer bans "broker".
4. "S&P 500" and "Nasdaq 100" are allowed in the hero lead.
5. The type sizes adapt to the rev. 4 wireframe (54, 44 and 30 px), where the 375x667 hero fit allows. Note 0031's 28 px stays until the hero is re-measured.
6. The assumed return is not editable on the page.
7. Legal sign-off is decided later: this is a learning project with no lawyer, so we do what the available legislation allows and keep the rest transparent.

## Alternatives considered

Not recorded: David gave a reason only for point 7 (no lawyer, learning project). For points 1 to 6 the alternatives and reasons were not given.

## Consequences

- Code follow-ups, tests first: unban "broker" in `src/lib/copy-check.ts`, a `lead` exemption for the index names, type tokens, rev. 4 headline in `copy.ts`.
- The README must say plainly that the legal pack was not reviewed by a qualified person.
- The launch gate in SPEC §19 stays the standard for any real launch.
