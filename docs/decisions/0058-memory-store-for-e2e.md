# 0058. The e2e tests run on an in-memory store and a recording mailer

Date: 2026-10-14
Status: proposed
Phase: 4

Note: David gave the reason against the alternative in his own words on 2026-10-14. The decision itself and the guard were the agent's; David accepted them in the Phase 4 plan. Context and consequences are written by the agent from the repo.

## Context

The Playwright tests of the lead flow need a place to keep leads and a way to "send" e-mail, in CI and on a laptop, without secrets and without writing to David's real database or sending real e-mail. The plan (decision 8) proposed an in-memory store with a recording mailer, plus one manual run against the real services. The first idea for a guard was to refuse the memory store when `NODE_ENV=production`; that fails, because CI runs the tests against a production build (`pnpm build && pnpm start`).

## Decision

`LEAD_STORE=memory` selects `src/server/memory-store.ts` and a recording mailer; `playwright.config.ts` sets it for the test server. The store refuses to start when `VERCEL` is set, so it cannot hold real leads on a deployment. A test-only route `/api/test-leads` shows what the store holds and what was "sent", and is a plain 404 without `LEAD_STORE=memory`. Reason against the alternative (David): a second Supabase project is too robust a solution.

## Alternatives considered

- A second Supabase project for tests: not done. David's reason: too robust a solution.

## Consequences

- CI needs no secrets and the e2e run is fast and deterministic.
- The real Supabase and Resend adapters are tested only with a stubbed `fetch` and by one manual run (2026-10-14); a change in either service shows up late. The manual run belongs in the checklist before a launch.
- `/api/test-leads` exists in every build and is protected only by the environment variable.
