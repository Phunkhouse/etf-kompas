# 0038. Exchange rates are fetched daily from the Czech National Bank

Date: 2026-10-12
Status: accepted; the stored fallback record was removed by 0066
Phase: 3

## Context

Fees in euro and dollars need a rate in Kč (METHODOLOGY-V2). Note 0037 accepted "the Czech National Bank rate on a stated date, a sourced record". A rate changes every working day, so a hand-verified record would be out of date almost at once, unlike a fee schedule.

## Decision

The server fetches the bank's public daily file and caches it (`use cache` with `cacheLife`): 12 hours when the bank answered, 5 minutes after a failure. The site makes about two small requests a day, not one per visitor, and the request carries nothing about the visitor. If the fetch fails, the verified record in `data/rates.json` is used while it is at most 45 days old; otherwise there is no rate, brokers with fees in euro or dollars have no price, and the calculator is in the fund-fee-only state (note 0037). A rate older than 45 days is never used; each currency is chosen on its own. The page shows the rate's own date ("kurz ČNB z 9. 10. 2026").

## Alternatives considered

- A scheduled job that commits a new rate to the repository every day: raised by the agent, not chosen. It needs a bot that writes to `main` or a daily pull request, and the repository's rule is that David merges.
- A hand-verified record only: the first decision (note 0037), replaced by this one.

## Consequences

- The fetch is checked in a production build: the page is prerendered with a 12 hour revalidate and a 1 week expire, and it received the bank's rates (EUR 24,365 and USD 21,745 of 9 October 2026).
- Between two refreshes the rate can be up to 12 hours old, and over a weekend the last working day's fixing is used. The page says which date it shows.
- `next build` needs network access to the bank, or it falls back to the record in the data.
- Whether Vercel keeps the cached rate across deployments is still to be checked in Phase 6.
- The 18 test cases were listed first and approved by David on 2026-10-12.
- David's reason: exchange rates can get old quickly.
