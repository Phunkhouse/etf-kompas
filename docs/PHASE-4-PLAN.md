# Phase 4 plan: lead flow

Status: **approved by David on 2026-10-13** (all eight decisions as proposed; the answers to the open questions are below). Source: SPEC §3.5, §17.15, §22 (Phase 4), §26 and `docs/design/wireframe-b.md`. Done: the schema (`supabase/migrations/0001_lead_flow.sql`, run, RLS on, PR 74).

## Decisions I need from you (the spec is silent or I propose a change)

1. **Adapters without a dependency.** Supabase and Resend are both plain HTTPS APIs. I propose a thin `fetch` wrapper for each (about 40 lines each) instead of `@supabase/supabase-js` and `resend`. Less payload on the server, no version churn, easy to fake in tests. The PDF is the one real dependency: `@react-pdf/renderer` (SPEC §12). Alternative: install the two SDKs.
2. **The 429.** A server action cannot set an HTTP status. I propose: one service (`submitLead`), two thin entry points. The form keeps its server action (works without JavaScript, as today) and shows a Czech message when limited. `POST /api/lead` (SPEC §13) returns the real `429`. Playwright checks the 429 on the route and the message in the form.
3. **Route names.** SPEC §13 says `results/[token]`, `unsubscribe`, `confirm`; the existing routes are Czech (`/zasady`). I propose `/srovnani/[token]`, `/srovnani/[token]/pdf`, `/odhlasit/[token]`, `/potvrdit/[token]`. Czech is what the visitor sees in the address bar.
4. **Same email twice.** One `leads` row, success again, a new token, and the email is sent again within the per-email limit (3 per day). The tips consent can be switched on by a second submit but never off by one (only unsubscribe turns it off). A person who unsubscribed still gets the Kompas but is not set to "tips" again by a plain submit.
5. **Calculator values.** The form sends the amount and years as whole numbers. The server accepts only the slider's grid (500 to 20 000 Kč in steps of 500, years in the calculator's range) and recomputes every number itself. `calc_monthly_bucket` stores that exact grid value (the grid is already the bucket).
6. **Minimum time-to-submit.** The page is static, so the server cannot stamp the render time. At submit the form's JavaScript fills a hidden `t` field with the milliseconds since the page loaded (`performance.now()`, not a clock time, so a wrong clock on the phone cannot break it; since the page, not the form, because a visitor who jumps to the form and autofills it is fast and must not be dropped); the server rejects under 2 s. A missing `t` (no JavaScript) is allowed. Weak, but the honeypot and the rate limits are the real defence. Is that acceptable?
7. **Lifetimes.** Results token and PDF: 30 days (spec). Double opt-in link: **7 days** (my proposal). Unsubscribe link: no expiry.
8. **CI e2e without secrets.** `LEAD_STORE=memory` and `EMAIL_MODE=sandbox` with a recording mailer, used by Playwright and CI. The memory store refuses to start on Vercel (`VERCEL` is set); `NODE_ENV=production` could not be the guard, because CI runs the e2e against a production build (`pnpm build && pnpm start`). One manual smoke test against the real Supabase and Resend, written into the PR. Alternative: a second Supabase test project.

## PRs (one concern each, in this order)

| #   | PR                         | Contents                                                                                                                                                                                       |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `feat: store leads`        | `LeadStore`, `RateLimiter`, `Mailer` ports; memory and Supabase adapters; honeypot, time check, rate limits, idempotency; `/api/lead`; form state `limited`; cleanup of old `rate_limits` rows |
| 2   | `feat: results page`       | tokens (create, hash, expire); `/srovnani/[token]`; expired page with "Poslat odkaz znovu"; `noindex`, `Cache-Control: private`; success state with the real link                              |
| 3   | `feat: personalised PDF`   | `/srovnani/[token]/pdf`, 6 pages from the same server numbers (pages 2, 3, 5, 6 are not drawn: I will list their content for approval first)                                                   |
| 4   | `feat: e-mails and opt-in` | Kompas e-mail, sandbox rule, double opt-in, unsubscribe, the four small pages (the e-mail and desktop versions are not drawn: draft first)                                                     |
| 5   | `docs: close Phase 4`      | PHASES.md, README gaps, decision notes, AI-LOG                                                                                                                                                 |

Each PR passes `pnpm check && pnpm format:check`, adds a line to `docs/AI-LOG.md`, and uses only Czech copy from `src/content/copy.ts` (`pnpm copy:check`). The notice "Zkušební provoz: váš e-mail jsme nikam neuložili" is removed in PR 1 and the success text depends on the mode (see test E-3).

## Architecture

- `src/server/`, no `next` or `react`: `leads.ts` (the service, takes its ports as arguments), `lead-store.ts` (port and memory adapter), `supabase-store.ts`, `rate-limit.ts`, `tokens.ts` (32 random bytes, sha256 hash, HMAC-signed links with an expiry), `mailer.ts` (port, sandbox rule, Resend adapter), `ip-hash.ts` (HMAC of the IP with the date, so the salt rotates daily).
- `src/app/`: `lead-action.ts` and `api/lead/route.ts` read the env and the request, call the service, return. They contain no rules.
- Env is read once in `src/config/env.ts` with Zod (SPEC §13 "env schema when needed"). A missing variable fails at start with its name, never with its value.
- Money and numbers: only integers cross the boundary. The results page and the PDF call the same calculator code with the stored amount and years. Nothing from the browser is trusted.
- No raw IP, no raw token and no email in `rate_limits` keys or in logs.

## Test cases (to approve before any implementation)

Vitest (`src/server/*.test.ts`, node) unless it says E2E. Ports are faked in memory with a fixed clock.

**Validation and form fields (extends `leads.test.ts`, the existing cases stay)**

- V-1 amount and years: a grid value is accepted; 0, 250, 20 500, a float, a string, a negative, a missing value are rejected as `invalid`.
- V-2 years outside the calculator's range are rejected.
- V-3 UTM fields, `fbclid` and variant: unknown variant becomes `a`; values longer than 200 characters are cut or rejected (to decide in the PR, tested); control characters are stripped.

**Storage and idempotency**

- S-1 a valid lead is stored lowercased with amount, years, variant and UTM; `email_status` starts `queued`.
- S-2 the same address twice (also `Jan@Domena.cz` then `jan@domena.cz`): one row, both calls return `ok`.
- S-3 the second call issues a new token and an old token still works until its expiry.
- S-4 tips: ticked once then unticked in a second submit stays on; ticked on a second submit turns on; never turned off by a submit.
- S-5 `consent_text_version` is stored when tips is ticked. `consent_confirmed_at` stays empty until the confirmation link is used.
- S-6 a store error returns `error` with the typed address kept (as today) and does not send an email.
- S-7 a lead with `deleted_at` set who submits again is a new person: the row is reset (`deleted_at`, `unsubscribed_at`, `consent_confirmed_at` cleared, UTM, variant, amount and tips replaced by the new values), Kompas is delivered, tips count only after a new double opt-in. A lead with `unsubscribed_at` set still gets the Kompas; ticking tips again sends the opt-in email, and `unsubscribed_at` is cleared only when that link is confirmed, not by the submit.

**Honeypot and time check**

- H-1 a filled honeypot returns an `ok`-looking state, stores nothing, sends nothing, counts no email limit, and its link does not resolve.
- H-2 `t` under 2 s is handled like the honeypot; `t` of 2 s or more passes; `t` missing passes; `t` that is not a non-negative number is handled like the honeypot.

**Rate limits**

- R-1 per hashed IP: requests 1 to 5 within an hour pass, the 6th is `limited` (HTTP 429 on the route with `Retry-After`), the 1st of the next hour passes.
- R-2 per email: 3 per day pass, the 4th is `limited`. The email is hashed before it becomes a key.
- R-3 a rejected honeypot request does not use the visitor's quota.
- R-4 the daily salt: the same IP on two days gives two different keys; the same IP on one day gives the same key; the key never contains the IP.
- R-5 a failing limiter fails closed for sending mail (nothing sent) and says `error`.
- R-6 cleanup removes windows older than 2 days and keeps the current ones.

**Tokens**

- T-1 a token is 32 random bytes, URL-safe, 43 characters; two tokens differ; the store holds only the hash, never the token.
- T-2 valid token resolves its lead; a token one second before expiry resolves, one second after does not; an unknown token and a malformed token give the same `unknown` answer as an expired one.
- T-3 a signed link (opt-in, unsubscribe): a valid signature passes; one changed character, another lead id, another purpose (opt-in link used as unsubscribe) and a link past its expiry all fail; comparison is constant-time.
- T-4 "send the link again": the same generic answer for an address that exists, one that does not, and one that is limited; a new token and an email only for an existing, not-deleted lead.

**E-mail and sandbox**

- E-1 `live`: the Kompas email is sent to any valid address; the status becomes `sent`, or `failed` when Resend answers an error (the lead stays stored).
- E-2 `sandbox`: an address on the allowlist (case and spaces ignored) is sent; any other address is stored, not sent, and the status stays `queued`.
- E-3 the success state says "Odkaz jsme poslali i na [e-mail]" only when a mail was sent. In sandbox for a non-allowlisted address it shows the results and PDF links and says nothing about an email. In the Resend error case it says the email did not go out. These strings come from `copy.ts`.
- E-4 the email contains the results link, the controller, the test-project line and the unsubscribe link, and no tracking pixel.
- E-5 the double opt-in email is sent only when tips was ticked, and only once per lead until it is confirmed or expired.

**Results page, PDF, small pages (component and route tests)**

- P-1 a valid token renders the visitor's amount and years, and the totals equal `cost.ts` and `broker-pricing.ts` for the same inputs (the same numbers as the calculator).
- P-2 expired, unknown and malformed tokens render the same generic message and the "Poslat odkaz znovu" form, with HTTP status 200 (decided 404, but the page streams after a static shell and cannot change its status; the intent, out of caches and search, is met by `Cache-Control: private, no-store` and `noindex`), never the lead's data.
- P-3 headers on every token page: `X-Robots-Tag: noindex`, `<meta robots noindex>`, `Cache-Control: private`.
- P-4 the PDF has 6 pages, the same totals as the page, `[ověřit]` wherever the page has it, and no figure that is `TODO_VERIFY`.
- P-5 confirm: a valid link sets `consent_confirmed_at`, a second use shows the confirmed page again without changing the date, an expired or altered link shows "Tento odkaz už nefunguje" with a way back.
- P-6 unsubscribe: a valid link sets `unsubscribed_at`, is repeatable, and an altered link changes nothing. After it, no nurture or tips email is queued.

**Playwright (mobile first, `LEAD_STORE=memory`, `EMAIL_MODE=sandbox` with a recording mailer)**

- A valid email gives the success state with a results link, and a lead exists (read through a test-only route that is disabled in production).
- The same email twice gives success twice and one lead.
- An invalid email shows "Zadejte e-mail ve tvaru jmeno@domena.cz." and keeps the value (exists today; stays).
- The honeypot (filled through script) shows the normal success state and stores nothing.
- The 6th `POST /api/lead` from one client within an hour gets 429; the form shows the "limited" message.
- A valid token page renders, has `noindex` and `Cache-Control: private`; an expired token (the test clock is moved) shows the generic message and the resend form; resend answers the same text for an unknown address.
- Opt-in: tick tips, open the confirmation link from the recorded email, see the confirmed page; open an expired one, see the expired page.
- Unsubscribe link from the recorded email works.
- Sandbox: an address not on the allowlist gets success and links but no sentence about an email.
- Everything above also runs without JavaScript where the form is concerned (a native POST).

## Gaps to put in the README (known now)

- An unknown, expired or malformed results link answers 200, not 404 (the page streams after a static shell). A real 404 needs a Proxy that repeats the lookup. David, 2026-10-14: a gap for now, maybe later if there is time.
- The PNG exports of the comparison page and PDF page 1 still show "Fio" and "IBKR"; the sources are fixed and the images need exporting on a machine with IBM Plex (`export_images.py`).

- Retention and deletion: `scripts/delete-lead.ts` and the contact address are not in Phase 4 (SPEC §26 suggests them): moved to Phase 6 (decided).
- Legal review of the consent wording and the controller details (placeholders stay).
- Delivery tests to Seznam, Gmail and Outlook with the real domain are manual and happen before launch.
- The email and the four small pages in desktop width are not drawn.

## Out of scope for Phase 4

Tracking and consent banner, `events` table and `lead` events (Phase 5), the optional phone step (P2), nurture emails (P2), Vercel deploy (Phase 6).
