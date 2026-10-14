# 0063. The tracker is an inline script, like the cookie bar

Date: 2026-10-14
Status: accepted
Phase: 5

Note: the reason is drafted by the agent; David accepted it on 2026-10-14 ("ok"). Context and consequences are written by the agent.

## Context

The first-party events (SPEC §9) need code in the browser: it watches the calculator, the result, the form and the e-mail field. The landing route is at 149.9 of 150 KB of JavaScript (note 0034), so a `track()` module imported by the calculator would not fit.

## Decision

The tracker is one inline script written as a self-contained function (`src/lib/track-client.ts`) and rendered by `Tracker` into the page, the same way as the cookie bar (note 0062). The page only marks what it watches with `data-track` attributes. Reason (drafted by the agent): the JS budget.

## Alternatives considered

- A `lib/track.ts` module imported by the calculator, as SPEC §9 names it: it adds framework-bundle JavaScript that does not fit in the budget.
- Raising the budget: dropped by David for the consent bar (note 0062) and not reopened here.

## Consequences

- The budget test does not count inline scripts, but the script is real weight: about 2 KB raw in the HTML, and again in the page data payload. Measured: the route stays at 149.9 of 150 KB, the margin is 0.1 KB.
- The script cannot import anything; changes to it are tested with the real script in jsdom (`Tracker.test.tsx`) and in Playwright.
- GA4 and Meta (PR 3) must be loaded by this script after consent, not from the React bundle.
