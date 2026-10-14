# 0065. One events table, and `lead` is counted once per new e-mail

Date: 2026-10-14
Status: accepted
Phase: 5

Note: the reasons are drafted by the agent; David accepted them on 2026-10-14 ("ok"). Context and consequences are written by the agent.

## Context

The plan asked that UTM, `fbclid`, the variant and the in-app flag are stored "with the session and the lead", and that `lead` fires exactly once per submission. A separate `sessions` table would need an upsert in both stores. A repeat submit of the same address would count a conversion twice in the cost per lead.

## Decision

One `events` table with the campaign columns on every row; `fbclid` is kept on the `page_view` row only. The server writes `lead` when a lead is stored for the first time (a new address, or one that was deleted and comes back), never on a repeat submit. Reasons (drafted by the agent): fewer moving parts for the same questions, and a conversion is a new person.

## Alternatives considered

- A `sessions` table: more code in both adapters for the same funnel queries.
- `lead` on every accepted submit: a person who submits twice would count twice.

## Consequences

- Campaign values repeat on each row (small). Funnel queries group by `session_id`; a session before consent lasts one page load.
- A repeat submit by the same person is invisible in the events (the lead row is updated).
- Retention of events is not decided (`TODO_VERIFY`, legal pack point 5).
