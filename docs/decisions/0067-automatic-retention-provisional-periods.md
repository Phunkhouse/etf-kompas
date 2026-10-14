# 0067. Automatic deletion with provisional periods

Date: 2026-10-14
Status: accepted
Phase: 6

Note: the reasons are David's (2026-10-14): the period stays `TODO_VERIFY` and is listed in the legal pack, the deletion should be automatic, with "6 months after the last contact" and "until unsubscribe plus 30 days" for now, transparent and ready to change. David approved the design and test cases ("Approved"). He gave no reason for the two numbers beyond "for now"; the rest of the note is written by the agent.

## Context

Leads, their result links and first-party events had no deletion and no stated period, so the privacy text had `[doplnit]` where a period belongs. There is no lawyer to say what period is right.

## Decision

Delete automatically and say plainly that the numbers are provisional.

- A lead is deleted for good (not marked) 6 months after its last contact, or 30 days after unsubscribe, whichever comes first. The last contact is the later of the sign-up and the confirmation of the tips. Its result links and the events of its session go with it.
- Events older than 6 months and rate-limit counters older than 2 days are deleted too. Tying events to the lead period is the agent's assumption (David approved the design).
- The periods are settings (`src/config/retention.ts`, overridable by two environment variables), with a `provisional` flag. The privacy page and the unsubscribe page name them and say they are provisional.
- A daily Vercel Cron call of `/api/purge`, protected by `CRON_SECRET`; the answer and the log carry counts only. `pnpm lead:delete <e-mail>` erases one person by hand.

## Alternatives considered

- Manual deletion only: David asked for something automatic.
- Soft delete (`deletedAt`): the row would still hold the e-mail address.
- Invent a "legal" period and drop the marker: no source, so it stays `TODO_VERIFY` in the legal pack.

## Consequences

- A person who returns after deletion is a new lead and counts as a new `lead` event.
- If a period changes, the pages follow the settings; the legal pack point 5 says what to ask the reviewer.
- Run so far only against the in-memory store and a mocked Supabase API; the first real run is on Vercel.
- The FAQ answer used to say the e-mail is "nowhere stored", which has been untrue since the lead flow; it now points to the policy (found while changing the wording).
