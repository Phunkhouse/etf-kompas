# Phase 5 plan: tracking and consent

Status: **proposed, not approved.** Source: SPEC §9, §17.12, §22 (Phase 5), §23 and `docs/design/wireframe-b.md` (cookies). Written 2026-10-14.

## Answers from David (2026-10-14)

- **GA4 and Meta IDs:** not available yet. The accounts are delivered **at the end of the phase**. Until then the code is built and tested against stubs (a recording fake for GA4, Meta and the server calls), and first-party events work without any ID (§17.12).
- **JS budget:** first said "raise it", then changed his mind after exploring options: **the budget stays at 150 KB** and the consent bar is built in-house (vanilla JS, no React hydration). Reason (David): JS budget concern, so move to an in-house solution after exploring other options. Note 0062.
- **Plan file and branches:** this file; Phase 5 branches are cut from `main`.

## Open items (the spec is silent or I propose a change)

1. **Budget headroom.** 149.8 of 150 KB today, so the banner must be about 2 to 3 KB gzipped, outside the React bundle. To be measured in PR 1; if it does not fit, we come back to David.
2. **Fallback check.** Measure vanilla-cookieconsent once (size, whether it runs outside React). If it is about 3 KB gzipped the choice may reverse; David decides.
3. **Before consent.** Only cookieless, aggregate first-party counting. Legal sign-off is still missing: marked `TODO_VERIFY`.
4. **Retention of events.** No period is decided (same gap as for leads). Marked `TODO_VERIFY` in the privacy text.

## Architecture (agreed 2026-10-14)

Banner and consent state are separate from the React bundle: the head script reads the cookie, the banner is plain HTML and vanilla JS, `track()` always writes first-party events and loads GA4 and Meta only after consent. Rejected: Consent Mode defaults before consent (breaks "zero third-party requests before consent"), and edge or server cookie detection (makes the static page dynamic). A refuser's `lead` appears only in our own table, not in GA4 or Meta; the README says so.

## Checklist

### Needs from David

- [ ] GA4 property: Measurement ID and an API secret (Measurement Protocol). **End of phase.**
- [ ] Meta dataset: Pixel ID, Conversions API token, Test Events code. **End of phase.**
- [ ] Vercel environment variables for these; the names go into `.env.example`.
- [ ] Approve this plan.
- [ ] Real-phone test of events (reviewer checklist e and f, SPEC §19).

### PR 1: `feat: consent bar and settings`

- [ ] In-house banner, no React hydration: server-rendered HTML, inline CSS (note 0042), about 2 to 3 KB of vanilla JS.
- [ ] Blocking inline `<head>` script under 1 KB reads the consent cookie and sets `data-consent` on `<html>` before paint; CSS hides the banner then. The page stays static.
- [ ] Fixed-position banner (CLS 0); plain DOM handlers (INP, TBT).
- [ ] Consent cookie holds the choice, policy version and timestamp; a first-party "choice made" event, no PII.
- [ ] Measure the JS budget with the banner; measure vanilla-cookieconsent once as a fallback check (open item 2).
- [ ] Bar (bottom sheet on the phone): "Přijmout vše" and "Odmítnout vše" equally prominent, "Nastavit".
- [ ] Settings: Nezbytné (always on), Měření návštěvnosti, Reklama a remarketing (off until agreed); "Uložit výběr", "Přijmout vše".
- [ ] Footer and menu "Cookies" reopen the settings; the choice lives in a first-party cookie.
- [ ] Czech copy in `src/content/copy.ts`; `copy:check`, contrast pairs.
- [ ] Component and Playwright tests (first visit shows the bar, a choice hides it, the footer link reopens it).

### PR 2: `feat: track() and first-party events`

- [ ] Test cases first, approved before implementing (event schema, session, in-app-browser detection, UTM and `fbclid`).
- [ ] `track()` wrapper with `variant`, `utm_*`, `session_id`, `device`, `in_app_browser`.
- [ ] `/api/event`: Zod, no PII, hashed or dropped IP, runs even when consent is denied.
- [ ] Supabase tables and migration for sessions and events, RLS on.
- [ ] Session and variant in a first-party cookie with a URL fallback (§23).
- [ ] UTM, `fbclid`, variant and `in_app_browser` stored with the session and the lead.
- [ ] Events: `page_view`, `calc_start`, `calc_result`, `gate_view`, `form_focus`, `lead`.
- [ ] `?debug=1` prints events to the console.

### PR 3: `feat: GA4 and Meta after consent`

- [ ] Google Consent Mode v2: all denied by default, updated on the choice.
- [ ] GA4 and the Pixel are injected on idle (`requestIdleCallback`) only after consent, each by its own category. Consent Mode v2: `default` denied and `update` granted at that moment, no `gtag` before consent.
- [ ] Measure INP and TBT with and without consent.
- [ ] Playwright: zero non-essential third-party requests before consent and after "Odmítnout vše".
- [ ] Playwright: the order `page_view, calc_start, calc_result, gate_view, form_focus, lead`.

### PR 4: `feat: server-side lead event`

- [ ] Test cases first, approved before implementing.
- [ ] One `event_id` per submission, shared by the browser and the server.
- [ ] Meta Conversions API and GA4 Measurement Protocol from the server; hashed data only with consent.
- [ ] `lead` exactly once per submission (double click, resubmit, same e-mail twice).
- [ ] A failed or slow send never blocks or fails the lead.
- [ ] Privacy and cookie text match what actually runs (placeholder, needs a lawyer).

### PR 5: `docs: close Phase 5`

- [ ] Real accounts connected; test events seen in GA4 DebugView and Meta Test Events.
- [ ] `docs/PHASES.md`, README gaps, decision notes, `docs/AI-LOG.md`.

### Every PR

- [ ] `pnpm check && pnpm format:check` green; AI-LOG line; no new dependency without a one-line reason; decision notes suggested, not invented.

## Cut order if we slip

Optional events (`scroll_*`, `form_submit_attempt`, `kompas_download`, `results_open`), then the funnel dashboard (P1). Never cut: consent, the `lead` event, honest gaps.
