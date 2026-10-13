# 0043. The index name is the title of a hero table row

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

Note 0026 allowed "S&P 500" and "Nasdaq 100" in a hero table row only as a sub-label under a plain name ("Evropský fond na 500 největších firem"), as SPEC §25 asks the plain description to come first. In the design review of 2026-10-13 David preferred the drawing, where the row title is the index and the description sits under it.

## Decision

A row title is the index ("S&P 500", "Nasdaq 100"); the detail line under it gives the manager and ticker, then a plain description ("iShares CSPX, 500 největších firem"). The key in `copy.ts` stays `plainName`, so `scripts/check-copy.ts` still allows the index names and tickers in these rows and needs no change. Reason (David): better readability, while still keeping more information in the description.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- Supersedes the part of 0026 that put the plain name first; the rest of 0026 (the exemption for rows with a `plainName`) still holds.
- The key name `plainName` is now a marker for the checker more than a description of the value.
- SPEC §25 rule 3 and the glossary line for "S&P 500" still say the plain description comes first; the docs sync PR (D3) needs to bring them in line.
