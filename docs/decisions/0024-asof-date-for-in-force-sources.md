# 0024. `asOf` is the document date, or the capture date for in-force sources

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

Every sourced value has an `asOf`, and the validator rejects values older than 120 days (45 days for broker fees). A stale value is an error even in draft mode, so CI fails on it. Some sources have no data date of their own, or stay valid until they change: the Czech-US treaty (1994), the Ireland-US convention, DEGIRO's fee overview ("rates from 2026-01-01"), a prospectus that is still the current one, and the issuer fund pages we printed on 2026-10-11. If `asOf` were always the date on the document, these could never pass.

## Decision

- A dated document that carries the data (factsheet, KID, index factsheet, a page that prints an "as of" date next to the figure): `asOf` is that date.
- A source that is in force until it changes or has no data date (treaty, statute, fee overview, a current prospectus, a live page): `asOf` is the date we captured it and confirmed it is still current. The source's own date goes into `evidence`.

## Alternatives considered

- `asOf` always the document date: proposed by the agent, not chosen. A 1994 treaty and a fee schedule effective from January would be stale for ever, and CI would stay red.

## Consequences

- A capture date restarts the freshness clock, so each data refresh must really re-open the source. Re-stamping a date without checking would hide staleness.
- Figures taken from dated documents go stale on a fixed day. The VOO factsheet values (30 June 2026) go stale on 2026-10-28, and the iShares, S&P and Vanguard KID values in late January 2027.
- `data/README.md` states the rule.
- David accepted the agent's proposal on 2026-10-11 and gave no further reason.
