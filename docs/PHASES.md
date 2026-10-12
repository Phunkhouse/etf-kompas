# Dev phases

Short version of [SPEC.md](SPEC.md) §14, §20 and §22. If this file and the spec disagree, the spec wins.

**Deadline:** Fri 2026-10-16. **Re-planned 2026-10-12:** the P0 core by Tuesday evening 2026-10-13, Wed to Thu is buffer (SPEC §20). Status of each phase is in the git history and `docs/AI-LOG.md`.

## At a glance

| #   | Phase                  | Target     | Needs from David                              |
| --- | ---------------------- | ---------- | --------------------------------------------- |
| 0   | Scaffold (done)        | Sat 10.10. | GitHub remote, starter guide                  |
| 1   | CI, data, validator    | done       | Verified data, wireframe B                    |
| 1b  | Design foundation      | done       | Review `/styleguide` on desktop and phone     |
| 2   | Calculator v2          | Mon 12.10. | Data batches in `docs/DATA-NEEDS.md`          |
| 3   | Page sections and copy | Tue 13.10. | Review Czech copy, run 5-second test          |
| 4   | Lead flow              | Tue 13.10. | Supabase (EU), Resend, test domain            |
| 5   | Tracking and consent   | Wed 14.10. | GA4 and Meta dataset, real-phone test events  |
| 6   | Deploy and polish      | Wed to Thu | Open the live link inside Instagram/Messenger |

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

- Sections per SPEC §7, layout from wireframe B revision 4 (`docs/design/`), copy from §25
- Calculator in the fund-fee-only state until a broker is priced; saving box only with two priced brokers
- Hero fits 375x667 including the primary CTA, no scrolling (geometry test, note 0031)
- Lighthouse mobile: performance >= 90, accessibility >= 95, LCP < 2.0 s, CLS < 0.05, route JS: our code adds <= 20 KB over an empty page and the route is <= 150 KB gzipped
- Form works without JavaScript
- `?v=a` and `?v=b` show different heroes, unknown value falls back to `a`
- `pnpm copy:check` passes
- 5-second test: 3 non-investors, at least 2 can say what they get and that it is free

## Phase 4: Lead flow

- Valid email gives success state and a stored lead; same email twice is idempotent
- Invalid email shows the Czech error; honeypot is rejected silently; 6th request per hashed IP per hour gets 429
- Results page and personalised PDF: valid token renders; expired token shows a generic message and "send link again"; `noindex`, `Cache-Control: private`
- Unsubscribe and double opt-in work
- In `sandbox` email mode the UI never claims an email was sent to a non-allowlisted address

## Phase 5: Tracking and consent

- Zero non-essential third-party requests before consent
- Event order after consent: `page_view`, `calc_start`, `calc_result`, `gate_view`, `form_focus`, `lead`
- `lead` fires exactly once per submission with a shared `event_id` (browser and server)
- UTM, `fbclid`, variant and `in_app_browser` stored with session and lead
- First-party events written even without third-party consent (subject to legal sign-off)

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
