# 0053. Supabase and Resend over plain `fetch`, without their SDKs

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is David's own words in chat on 2026-10-14. The context and the consequences are written by the agent from the repo; David confirms or corrects them.

## Context

Phase 4 stores leads in Supabase and sends e-mail through Resend. Both have an official SDK (`@supabase/supabase-js`, `resend`); both are also plain HTTPS APIs. SPEC §12a asks for a one-line reason for every new dependency.

## Decision

The adapters call the two APIs with `fetch` (`src/server/supabase-store.ts`, `src/server/mailer.ts`). No SDK is installed. Reason (David): "makes sense for our case, to keep it simple".

## Alternatives considered

- The two SDKs: not used. David's reason: not needed for our case; keep it simple.

## Consequences

- The only new runtime dependency of Phase 4 is `@react-pdf/renderer` (note 0057).
- Each adapter is tested with a stubbed `fetch`; the request shapes (PostgREST upsert, the `rate_limit_hit` function, the `apikey` header, Resend's `POST /emails`) are ours to keep right. They were checked once against the real services on 2026-10-14.
- A change in either API reaches us as a failing request, not as a version bump to read about.
