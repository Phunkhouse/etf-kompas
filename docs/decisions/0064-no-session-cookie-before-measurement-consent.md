# 0064. No session cookie before the visitor agrees to measurement

Date: 2026-10-14
Status: accepted
Phase: 5

Note: the reason is drafted by the agent; David accepted it on 2026-10-14 ("ok"). Context and consequences are written by the agent.

## Context

SPEC §9 limits tracking before consent to cookieless, aggregate, first-party counting. SPEC §23 says to keep session and variant in a first-party cookie. The two disagree.

## Decision

Before the visitor agrees to "Měření návštěvnosti" there is no cookie and no storage: the `session_id` is a random id kept in memory for one page load. After they agree it is kept in the session cookie `kompas_sid`, and withdrawing consent removes it. The variant needs no cookie (it comes from the URL, note 0041). The lead row and the server-side `lead` event get the session id only when measurement is agreed. Reason (drafted by the agent): SPEC §9 and §23 disagreed, and §9 is the stricter rule.

## Alternatives considered

- A session cookie from the first visit (SPEC §23): it is a non-essential cookie set before any choice.
- `sessionStorage`: the same problem, it is storage on the visitor's device.

## Consequences

- A visit before consent is counted as one page load, so a visitor who reloads is a new session, and a visit cannot be followed across pages.
- A visitor who refuses is counted in aggregate but never linked to a lead. The legal pack asks whether a session id on the lead row is acceptable at all (point 7).
- Weaker attribution of leads to visits, in exchange for a simpler legal position.
