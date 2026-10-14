# Phase 5 plan: tracking and consent

Status: **proposed, not approved.** Source: SPEC §9, §17.12, §22 (Phase 5), §23 and `docs/design/wireframe-b.md` (cookies). Written 2026-10-14.

## Answers from David (2026-10-14)

- **GA4 and Meta IDs:** not available yet. The accounts are delivered **at the end of the phase**. Until then the code is built and tested against stubs (a recording fake for GA4, Meta and the server calls), and first-party events work without any ID (§17.12).
- **JS budget:** **raise it** (instead of lazy loading). The new number is open (see below).
- **Plan file and branches:** this file; Phase 5 branches are cut from `main`.

## Open items (the spec is silent or I propose a change)

1. **The new JS budget.** It is 149.8 of 150 KB today (note 0034). I propose: pick the number after measuring PR 1 (the consent library), and write it into SPEC §12/§22, `PHASES.md` and a new decision note. A decision note needs your reason: why raise it rather than load lazily?
2. **Consent library.** Spec suggests vanilla-cookieconsent. To verify before choosing: licence, gzipped size, Czech translation, Consent Mode v2 support, and whether our own bar can match the wireframe. If it cannot be styled to the drawing, the alternative is a small own component (SPEC says a library is preferred).
3. **Before consent.** Only cookieless, aggregate first-party counting. Legal sign-off is still missing: marked `TODO_VERIFY`.
4. **Retention of events.** No period is decided (same gap as for leads). Marked `TODO_VERIFY` in the privacy text.

## Checklist

### Needs from David

- [ ] GA4 property: Measurement ID and an API secret (Measurement Protocol). **End of phase.**
- [ ] Meta dataset: Pixel ID, Conversions API token, Test Events code. **End of phase.**
- [ ] Vercel environment variables for these; the names go into `.env.example`.
- [ ] Approve this plan; decide open items 1 and 2.
- [ ] Real-phone test of events (reviewer checklist e and f, SPEC §19).

### PR 1: `feat: consent bar and settings`

- [ ] Choose and verify the library (open item 2); measure its size and set the new JS budget (open item 1).
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
- [ ] GA4 and the Pixel load only after consent, each by its own category.
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
