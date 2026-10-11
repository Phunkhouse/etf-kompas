# 0026. Technical index names are allowed in table rows with a plain name

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

SPEC §25 bans "S&P 500" and "Nasdaq 100" in the copy and says a ticker may appear only next to a plain description. The wireframe's hero table has the sub-label "odborně S&P 500, značka VOO" under the plain name "Americký fond na 500 největších firem" (`docs/design/wireframe-b.md`, section 2). `pnpm copy:check` would reject that sub-label.

## Decision

Inside a table row that has a `plainName`, the checker allows "S&P 500", "Nasdaq 100" and the fund's ticker. Every other glossary term stays banned there, and the two index names stay banned outside such rows.

## Alternatives considered

- Change the wireframe sub-label so it contains no index name: raised by the agent, not chosen.

## Consequences

- The wireframe copy can stay as drawn. The plain name still comes first, so the rule "plain language first" holds.
- The exemption depends on the `plainName` field. A row without one gets no exemption (tested in `src/lib/copy-check.test.ts`).
- David's reason, as written in PR #20: the wireframe sub-label "odborně S&P 500, značka VOO" can stay.
