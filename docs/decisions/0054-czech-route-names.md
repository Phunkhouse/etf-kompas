# 0054. Czech names for the routes of the lead flow

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is David's own words in chat on 2026-10-14. The context and the consequences are written by the agent from the repo; David confirms or corrects them.

## Context

SPEC §13 lists the routes `results/[token]`, `unsubscribe` and `confirm`. The existing pages already have a Czech route (`/zasady`, the privacy policy).

## Decision

The routes are `/srovnani/[token]` (and `/srovnani/[token]/pdf`), `/potvrdit/[token]` and `/odhlasit/[token]` (and `/odhlasit/[token]/zpet`). This deviates from the names in SPEC §13. Reason (David): "it's a Czech website, Czech routes then".

## Alternatives considered

- The English names of SPEC §13: not used. David's reason: it is a Czech website.

## Consequences

- The visitor sees Czech words in the address bar and in the e-mails.
- The security headers (`noindex`, `Cache-Control: private, no-store`) are set per path in `next.config.ts`: `/srovnani`, `/potvrdit` and `/odhlasit`. A new route of the same kind needs its own entry.
- SPEC §13 still lists the English names; it was not changed.
