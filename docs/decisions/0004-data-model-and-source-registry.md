# 0004. Data model, source registry and seed set

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

SPEC §5 and §18 require every number to carry a source and date, and describe the record shape. They do not say which brokers to list, how `sources.json` is used, or which ETF fields exist.

## Decision

- Every sourced value is a record `{value, sourceUrl, asOf, verifiedBy, verifiedOn, evidence}` (SPEC §18). Percentages are plain numbers (`0.07` means 0.07 %).
- `sources.json` is a registry of source documents (`url`, `title`, `publisher`). Every record's `sourceUrl` must be listed there, otherwise the validator reports `UNKNOWN_SOURCE`. This catches typo'd URLs and keeps sources reviewable in one place. David approved it.
- ETFs: the 8 candidates from SPEC §5. `indexGroup` (`sp500`, `nasdaq100`, `us-total-market`, `all-world`, `us-dividend`) is an agent-made grouping used for "cheapest in the same group", not a sourced fact. David accepted it without expert review, so it should be checked when the data is verified.
- Brokers: DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212 and XTB, listed alphabetically (SPEC §17.2). They are the agent's suggestion from general knowledge, requested by David, who is not a broker expert. Every fact about them is `TODO_VERIFY`.
- Freshness limits: 120 days, 45 days for broker fees (`fxFeePct`, `custodyFeePct`).

## Alternatives considered

- Records without a registry: simpler, but typos in URLs would pass.
- No other alternatives were recorded.

## Consequences

- David verifies 100 % of values on every refresh (SPEC §18); `data/README.md` describes how.
- The broker list and `indexGroup` values can change without touching the validator.
