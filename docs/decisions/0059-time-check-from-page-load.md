# 0059. The submit-time check counts from the page load

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is drafted by the agent from what the first end-to-end run showed; David accepted it on 2026-10-14 ("That was your suggestion and I have accepted it"). Context and consequences are written by the agent.

## Context

SPEC §26 asks for a minimum time to submit, besides the honeypot and the rate limits. The page is static, so the server cannot stamp the time of rendering. The plan proposed that the form's JavaScript sends the time since the form appeared, and the server treats a submit under 2 seconds as a bot (silently, with a believable success). The first e2e run showed the flaw: a person who jumps to the form from the sticky bar and lets the browser fill it in is faster than 2 seconds from the moment the form appears, and would lose the lead without knowing.

## Decision

The hidden field `t` holds the milliseconds since the page loaded (`performance.now()`, filled in when the form is submitted). A missing `t` (no JavaScript) passes. The limit is 2 000 ms, and an optional variable `LEAD_MIN_FILL_MS` (honoured only by the in-memory store) lowers it for the e2e run, because a test types faster than a person. Reason (drafted by the agent): a bot is caught by the page-load time just as well, and a real visitor is never that quick.

## Alternatives considered

- Counting from the moment the form appears: the plan's proposal; it would drop real visitors who autofill, so it was changed.
- A clock time sent by the browser: not used; a wrong clock on a phone would break it.

## Consequences

- The check is weak (anything can be sent in `t`). The honeypot and the rate limits are the real defence; David accepted this in the plan.
- A visitor who is dropped by mistake sees a normal success state. The cost of a false positive is a lost lead, which is why the limit is counted from the page load.
