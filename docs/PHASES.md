# Dev phases

Short version of [SPEC.md](SPEC.md) §14, §20 and §22. If this file and the spec disagree, the spec wins.

**Deadline:** Fri 2026-10-16. **Re-planned 2026-10-12:** the P0 core by Tuesday evening 2026-10-13, Wed to Thu is buffer (SPEC §20). Status of each phase is in the git history and `docs/AI-LOG.md`.

## At a glance

| #   | Phase                                | Target     | Needs from David                              |
| --- | ------------------------------------ | ---------- | --------------------------------------------- |
| 0   | Scaffold (done)                      | Sat 10.10. | GitHub remote, starter guide                  |
| 1   | CI, data, validator                  | done       | Verified data, wireframe B                    |
| 1b  | Design foundation                    | done       | Review `/styleguide` on desktop and phone     |
| 2   | Calculator v2                        | Mon 12.10. | Data batches in `docs/DATA-NEEDS.md`          |
| 3   | Page sections and copy               | Tue 13.10. | Review Czech copy, run 5-second test          |
| 4   | Lead flow (done)                     | Wed 14.10. | Supabase (EU), Resend, test domain            |
| 5   | Tracking and consent (done on stubs) | Wed 14.10. | GA4 and Meta dataset, real-phone test events  |
| 6   | Deploy and polish                    | Wed to Thu | Open the live link inside Instagram/Messenger |

## Status on 2026-10-14

- **Done:** phases 0, 1, 1b, 2, 3, 4 and 5 (Phase 5 on stubs, see below).
- **Phase 3 (page): done, with three honest caveats** (details in the README): the 5-second test was run with one person, not three (note 0052); the Czech copy was reviewed by David while building and gets one final check before the page goes live; the A/B test is designed, not run.
- **Phase 4 (lead flow): done, with caveats.** Stored leads (Supabase, EU), honeypot, rate limits (429), the results page behind a token, the personalised six-page PDF, the Kompas e-mail and the opt-in e-mail (Resend, test domain, sandbox rule), double opt-in by a button, unsubscribe, "send the link again". Checked: `pnpm check` (758 tests), the Playwright suite on a production build (169 tests), a real run by David on 2026-10-14 (both e-mails arrived, links, confirmation and unsubscribe worked, Supabase showed the right data), `copy:check`. The caveats: (1) an unknown, expired or mistyped results link answers **HTTP 200**, not 404, because the page streams after a static shell (a real 404 needs a Proxy that repeats the lookup; the plan said 404); (2) **page 4 of the PDF and the tax cards on the comparison page have no text yet**, only `[ověřit zdroj]`: it needs a verified Finanční správa source; (3) the **"Kde fond koupit" table** of the drawing is not on the page (the data is verified and page 5 of the PDF has it); (4) the PDF's fonts and logo are read from disk and shipped with `outputFileTracingIncludes`, which works on `next start` and is **unverified on Vercel**; (5) **deleting a lead** (`scripts/delete-lead.ts`) and the retention period are not done, so the page does not say when an e-mail is deleted; (6) the **JS budget** is 149.8 KB of 150 KB.
- **Phase 5 (tracking and consent): done on stubs, with caveats.** The cookie bar and settings (in-house, note 0062), first-party events (`/api/event`, the `events` table), GA4 and the Meta Pixel loaded only after their category is agreed (Consent Mode v2), and the lead for the vendors with one `event_id` (browser and Meta Conversions API). Checked: `pnpm check`, the Playwright suite on a production build (188 tests, with fake ids, stubbed vendor scripts and a stub for the Meta call). **Not checked against the real GA4 and Meta**: David's accounts do not exist yet, so DebugView, Test Events, the real-phone events, INP and TBT with and without consent, and the Graph API version (no default, `TODO_VERIFY`) are still open. Other caveats: (1) the GA4 Measurement Protocol is not built (it would double count; deviation from SPEC §9, agreed); (2) `in_app_browser` is stored on the events, not on the lead row; (3) the privacy text still says technical data is processed only with cookies, which no longer matches (legal pack point 8); (4) the JS budget is 149.97 KB of 150 KB, about 30 bytes left; (5) the server-side Meta call runs after the response (`after`) and is unverified on Vercel.
- **Phase 6: not started.**
- **Data:** what the screens need is verified: `pnpm data:gaps` says 138 of 138. That is the answer to "what do the screens need", not to "can we deploy": `pnpm data:validate` (strict, the deploy gate of Phase 6) still fails with 51 `TODO_VERIFY` values in fields no screen uses (the version 1 broker fields `fxFeePct` and `custodyFeePct`, fund size, returns, dividend yield, withholding rate, replication, `rates` in the data file, VOO and QQQ at Fio). They are filled in or dropped from the data model before the deploy (a decision note). Listings in GBP, GBX and CHF are not recorded (the model has only CZK, EUR and USD). Fee records go stale after 45 days (XTB about 14 Nov, the others about 27 Nov; the EQQQ KIID on 24 Oct).
- **Design:** the boards and the text spec carry the data of 2026-10-14 (prices, IBKR priced, "Česky" verified, full broker names). The PNG exports in `docs/design/images/` still show the older data and need exporting on a machine with IBM Plex (`export_images.py`). The private claude.ai artifacts were not touched.

## Phase 0: Scaffold (done)

- Next.js, TypeScript strict, SCSS Modules, pnpm, Node 24
- ESLint, Prettier, Husky, lint-staged
- Brand assets in `public/brand/`, README stub

## Phase 1: CI, data, validator

- `pnpm check && pnpm format:check` green locally and in CI
- Data schema (`etfs.json`, `brokers.json`, `sources.json`) and validator
- Validator fails the build on a missing source, a `TODO_VERIFY`, or a stale `asOf` (one unit test each)
- Starter guide copied to `docs/starter-guide.md`, `CLAUDE.md` at root
- Seed decision notes written (list in SPEC §22)

## Phase 1b: Design foundation

- Tokens: colour, type, spacing, radius, borders, motion, breakpoints, z-index, touch targets
- WCAG AA script for every colour pair used
- Primitives: Button, Chip, Slider, Field, Table, NumberDisplay, Callout, Section, Wordmark, StackedBar
- `/styleguide` (noindex) shows every state; **stop for David's review before Phase 3**
- Self-hosted fonts with full Czech diacritics and tabular figures
- Do not design a logo

## Phase 2: Calculator

- Exactly per SPEC §21 and `docs/METHODOLOGY-V2.md` (broker fees, daily exchange rate); no self-chosen formulas, tests first, ask if anything is unclear
- All §21 tests pass, golden cases hand-verified and documented
- Sliders and chips work by keyboard and screen reader
- Playwright: changing inputs changes the result

## Phase 3: Page

- Sections per SPEC §7, layout from wireframe B revision 6 (`docs/design/`), copy from §25
- Calculator in the fund-fee-only state until a broker is priced; saving box only with two priced brokers
- Hero fits 375x667 including the primary CTA, no scrolling (geometry test, note 0031)
- Lighthouse mobile: performance >= 90, accessibility >= 95, LCP < 2.0 s, CLS < 0.05, route JS: our code adds <= 20 KB over an empty page and the route is <= 150 KB gzipped
- Form works without JavaScript
- `?v=a` and `?v=b` show the same layout with a different h1, unknown value falls back to `a` (note 0041)
- `pnpm copy:check` passes
- 5-second test: 3 non-investors, at least 2 can say what they get and that it is free

## Phase 4: Lead flow

- Valid email gives success state and a stored lead; same email twice is idempotent
- Invalid email shows the Czech error; honeypot is rejected silently; 6th request per hashed IP per hour gets 429
- Results page and personalised PDF: valid token renders; expired token shows a generic message and "send link again"; `noindex`, `Cache-Control: private`
- Unsubscribe and double opt-in work
- In `sandbox` email mode the UI never claims an email was sent to a non-allowlisted address

**Result (2026-10-14):** all five met, with one deviation: the unknown-token page answers 200, not 404 (see the status above). Plan and test cases: [PHASE-4-PLAN.md](PHASE-4-PLAN.md).

## Phase 5: Tracking and consent (done on stubs)

- Zero non-essential third-party requests before consent
- Event order after consent: `page_view`, `calc_start`, `calc_result`, `gate_view`, `form_focus`, `lead`
- `lead` fires exactly once per submission with a shared `event_id` (browser and server)
- UTM, `fbclid`, variant and `in_app_browser` stored with session and lead
- First-party events written even without third-party consent (subject to legal sign-off)

**Result (2026-10-14), against the five criteria:**

- Zero non-essential third-party requests before consent: **met** on stubs (fake ids, stubbed scripts; before a choice and after "Odmítnout vše", no request leaves for Google or Meta).
- The event order after consent: **met** on stubs for GA4 (`page_view` to `generate_lead`); the Pixel gets `PageView`, `ViewContent` and `Lead`.
- `lead` once per submission with a shared `event_id`: **met** on stubs (the id of the stored `lead` event is the id of the browser event and of the Meta call; a repeat submit has none).
- UTM, `fbclid`, variant and `in_app_browser` stored: **partly**. UTM, `fbclid` and the variant are on the lead and on the events; `in_app_browser` is on the events only (no session table, note 0065).
- First-party events without consent: **met**, subject to legal sign-off (legal pack points 4 and 8).

Plan, decisions and test cases: [PHASE-5-PLAN.md](PHASE-5-PLAN.md). The real accounts are the open part: see the plan's PR 5 list.

## Phase 6: Deploy and polish

- Vercel deploy with `noindex` header verified by `curl -I`
- In-app browser checklist (SPEC §23) done and recorded in a decision note
- README complete per SPEC §16, all known gaps listed

## Priorities

- **P0 (launch blockers):** everything above through Phase 6
- **P1:** funnel dashboard, `docs/LEGAL-PACK.md`, monthly data-refresh action, Playwright e2e in CI, Lighthouse CI, OG image, error monitoring
- **P2:** nurture emails, English version (the personalised PDF is in the main path, note 0039)

## If we slip, cut in this order

1. Czech README
2. Funnel dashboard
3. Lighthouse CI
4. PDF (keep the results page)
5. Second ad variant landing hero (keep the ad copy)

Never cut: sourced data validation, consent, `lead` tracking, honest README gaps.

## Every phase ends with

- A decision note in `docs/decisions/` (David approves the reasons)
- An entry in `docs/AI-LOG.md`
