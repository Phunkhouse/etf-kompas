# 0071. The server-side Meta Lead stays built and switched off

Date: 2026-10-14
Status: accepted
Phase: 6

Note: the reason is David's ("I have changed my mind it's too much hassle", 2026-10-14). The context, the alternatives and the consequences are written by the agent.

## Context

`Lead` goes to Meta from the browser (the Pixel) and, with advertising consent, from the server (the Conversions API, `src/server/capi.ts`) with one shared `event_id` so Meta deduplicates them. The browser side was checked in Meta's Test Events on the deployed address on 2026-10-14 (`PageView`, `ViewContent`, `Lead` with an event ID; nothing after "Odmítnout vše"). The server side is off: it needs a Conversions API access token and the Graph API version, and it has never reached Meta. To check it in Test Events it would also need a test code in the request, which was prepared as an optional setting (PR #103).

## Decision

Leave the server call built and switched off. Only the browser Pixel sends the lead.

## Alternatives considered

- Enable it and check deduplication in Test Events: needs the token, the Graph version (Meta's changelog lists v26.0 as the latest), a test code, two deploys and a manual check. Not done: too much hassle (David).
- Remove the server code: not chosen; it is tested against a stub and enabling it later is configuration only.

## Consequences

- A visitor whose browser blocks the Pixel is not counted as a `Lead` in Meta, and the cost per lead there under-counts. The first-party `lead` event in our own table counts every new address.
- The deduplication of the browser and server `Lead`, and the `fbc` format, are untested against Meta.
- The README, `docs/DEPLOY.md` and the legal pack already describe the server call as built, not enabled. Enabling it later is the procedure in `docs/DEPLOY.md` plus a check in Test Events.
- Pull request #103 (the optional test code) has no use while the call is off; whether to merge or close it is David's call.
