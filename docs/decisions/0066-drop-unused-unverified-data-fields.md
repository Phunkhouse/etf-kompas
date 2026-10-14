# 0066. Drop unused, unverified data fields so the strict validator can pass

Date: 2026-10-14
Status: accepted
Phase: 6

Note: the reason is David's ("yes drop, but verify if something isn't essential", 2026-10-14). The context, the per-field check and the consequences are written by the agent.

## Context

`pnpm data:validate` (strict, the deploy gate of SPEC §19) failed with 51 `TODO_VERIFY` values. No rev. 4 screen, the calculator or the PDF reads them. Filling them in would need sources we do not have, and inventing values is not allowed.

## Decision

Drop the unverified, unused values from the data and the model. Before dropping, each field was checked against `src/` (grep, then `pnpm data:gaps` 138 of 138 before and after).

- **Removed from the model and the files:** `replication`, `fundSizeEur`, `return5yPct`, `return10yPct` (every fund, no value anywhere); the version 1 broker fields `fxFeePct` and `custodyFeePct` (the calculator reads `fees`); `data/rates.json`.
- **Made optional, placeholders removed, verified values kept:** `indexName`, `domicile`, `dividendYieldPct`, `withholdingRate`, `distribution`. Most funds have verified values (notes 0023, 0025) and the pre-release audit needs them. `distribution` is missing for VOO and QQQ, which are named only for availability; `data:gaps` still demands it for the five twins.
- **Fio availability of VOO and QQQ:** the two unknown entries are removed. A missing entry means unknown, the same as before, so the page still says "4 of 5 brokers" (the claim uses only verified "no"). If Fio's answer is verified, the claim can become "5 of 5".
- **Stored exchange rates:** no fallback record. The seed would be older than the freshness limit within days, so it could never be used. Without the bank's answer the calculator shows the fund fee only (already the behaviour with an unusable seed).

The reason is David's: drop what is not essential. Whether each field is essential was my check, listed above.

## Alternatives considered

- Fill the values in: no sources, and nothing displays them.
- Keep the placeholders and relax the strict validator: defeats the deploy gate.

## Consequences

- `pnpm data:validate` passes strict (0 errors); the seed-data test now asserts it.
- A new screen that needs a dropped field must add it back with a source.
- The 45-day broker-fee limit now applies to everything under `fees` and to `rates`.
- Fio VOO and QQQ remain unverified; it is the one open item that could improve a claim.
