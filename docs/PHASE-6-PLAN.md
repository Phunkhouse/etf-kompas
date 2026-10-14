# Phase 6 plan: deploy and polish

Status: **draft, open items answered by David on 2026-10-14 (see "Answers"); waiting for the final approval.** Written 2026-10-14. Source: SPEC §17.14, §19 (launch gate), §20, §22 (Phase 6), §23, `docs/PHASES.md`, `docs/PHASE-5-PLAN.md` (open items) and the README "Known gaps". Deadline: **Fri 2026-10-16**. Today is Wed 2026-10-14, so there are about two working days.

## Acceptance (SPEC §22)

- Deployed on Vercel, `noindex` header verified by `curl -I`.
- Manual in-app-browser checklist (§23) done and recorded in a decision note.
- 404 page, privacy page, favicon and share image as drawn.
- README complete per §16, every known gap listed.

## What already exists (verified in the repo)

- `src/app/not-found.tsx`, `src/app/zasady/page.tsx` (placeholder text), `src/app/icon.svg`.
- `robots` set in `src/app/layout.tsx`; `X-Robots-Tag` on results, opt-in and unsubscribe routes in `next.config.ts`.
- `.env.example` lists every variable; CI runs `pnpm check`-equivalent steps and Playwright.
- Missing: a share (OG) image, a site-wide `X-Robots-Tag` header, a deployed URL, `scripts/delete-lead.ts`, the data fixes below, README sections 7 and 11 to 12 in final form.

## Answers from David (2026-10-14)

1. **Unused data fields:** drop them, but check each one first and keep any that turns out to be essential (PR 1 reports the kept ones).
2. **Strict data gate in CI on `main`:** agreed (PR 4).
3. **Retention and deletion:** the period stays `TODO_VERIFY` and is listed in `docs/LEGAL-PACK.md`. Build it **automatic**, with provisional defaults of **6 months after the last contact** for a lead and **30 days after unsubscribe**, transparent on the page and easy to change (PR 2). David gave no reason for these two numbers beyond "for now"; the decision note waits for one.
4. **Meta Conversions API:** prepare it, do not enable it. The README says "built, not enabled" until the token and Graph version exist.
5. **`EMAIL_MODE` on Vercel:** David is reminded at the end of the phase.
6. **Pre-release decision audit:** notes 0019, 0025 and 0023 in one short session.

## How retention will work (PR 2, for approval)

- **Settings in one place:** `src/config/retention.ts` holds two numbers (`leadMonthsAfterLastContact = 6`, `daysAfterUnsubscribe = 30`) and a `provisional: true` flag. Env variables can override them, so changing a period is a config change, not a code change.
- **"Last contact":** the later of `created_at` and `consent_confirmed_at` of the lead (the only e-mails we send are the Kompas and the opt-in). If we add more e-mails later this definition must be revisited (noted in the code and the legal pack).
- **Purge service** in `src/server/` (no `next` or `react` imports): finds due leads, deletes the lead (tokens cascade) and the events whose `session_id` equals the lead's; also deletes first-party events older than the lead period and expired rate-limit rows. Returns counts only, never e-mail addresses.
- **Trigger:** `GET /api/purge`, protected by a `CRON_SECRET` bearer header, called daily by a Vercel Cron entry in `vercel.json` (Hobby allows one daily run). The deletion also exists as `scripts/delete-lead.ts <email>` for a single erasure request.
- **On the page:** the privacy text and the unsubscribe page name both periods and say they are provisional. `copy:check` and the contrast check apply.
- **Tests first, approved before implementing** (CLAUDE.md, risky logic): due and not-due edges for both periods, an unsubscribed lead, a lead without `session_id`, a failed delete does not stop the rest, the route answers 401 without the secret, and no e-mail address in the result or the logs.
- **New env var:** `CRON_SECRET` (secret, Vercel only, in `.env.example`).

## Meta Conversions API (decided: prepared, not enabled)

- The code stays as built in Phase 5 PR 4 and is off without `META_CAPI_TOKEN` and `META_GRAPH_VERSION`.
- README states "built, not enabled" in the gaps and in the tracking section; the production switch checklist says how to enable it (generate the token in Events Manager, read the current Graph version from Meta's docs, add both to Vercel, check Test Events).
- The checklist rows below are marked accordingly.

## Branches and PRs (one concern each, cut from `main`)

| PR  | Branch / title                                      | Concern                                                    |
| --- | --------------------------------------------------- | ---------------------------------------------------------- |
| 1   | `fix: data model without unused TODO_VERIFY fields` | Open item 1; strict validator green                        |
| 2   | `feat: automatic retention and delete a lead`       | Retention above; tests first, approved before implementing |
| 3   | `feat: noindex header, share image, metadata`       | Site-wide header, OG image, title/description              |
| 4   | `ci: strict data gate on main`                      | Open item 2                                                |
| 5   | `docs: deploy notes and env table`                  | Vercel setup steps, env names, production switch checklist |
| 6   | `docs: in-app browser record`                       | Result of §23 checklist (note)                             |
| 7   | `docs: README complete, close Phase 6`              | README §16, PHASES, AI-LOG, notes                          |

Deploy itself is a Vercel project connected to the repo (needs you, see below); it is not a PR.

## Checklist

### Needs from David (blockers, in order)

- [ ] Approve this plan (answers recorded above).
- [ ] Add `CRON_SECRET` to Vercel (a random value, `openssl rand -base64 32`).
- [ ] Remind: decide `EMAIL_MODE` (`live` or `sandbox`) **at the end of the phase**.
- [ ] Create the Vercel project (Hobby), connect the GitHub repo, region near the Supabase EU project.
- [ ] Put the environment variables into Vercel (names in `.env.example`): Supabase URL and secret key, Resend key, `EMAIL_MODE`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `SITE_URL` (the `*.vercel.app` address), `IP_HASH_SECRET`, `TOKEN_SIGNING_SECRET` (new values, not the local ones), `GA4_MEASUREMENT_ID`, `META_PIXEL_ID`, and the CAPI pair if you have it.
- [ ] Make sure `LEAD_STORE=memory` is **not** set on Vercel (test routes are 404 only without it).
- [ ] Apply the three Supabase migrations to the production project (or confirm the one in use is the production one).
- [ ] Final read of the Czech copy in `src/content/copy.ts` (SPEC §17.10, named step).
- [ ] Real-phone tests: Meta Test Events, network tab with consent refused, in-app browser (below).

### Deploy

- [ ] First production deploy from `main`; build is green on Vercel.
- [ ] `curl -I https://<site>.vercel.app/` shows `X-Robots-Tag: noindex` (and the `<meta robots>` is in the HTML); same check on `/srovnani/x`, `/zasady`.
- [ ] `/robots.txt` disallows everything or is absent by decision.
- [ ] Security headers reviewed (no inline-script breakage if a CSP is added; if not added, listed as a gap).
- [ ] PDF route works on Vercel (fonts and logo traced by `outputFileTracingIncludes`): open a real PDF, check pages and fonts. **Open caveat from Phase 4.**
- [ ] Results link from the e-mail uses the deployed `SITE_URL`; opt-in and unsubscribe links work against production.
- [ ] Daily exchange-rate fetch works on Vercel (note 0038); fallback behaviour seen once.
- [ ] Vercel Cron runs `/api/purge` once (401 without the secret, counts only in the answer).
- [ ] Rate limit (6th request, 429) works against the deployed Supabase-backed store.
- [ ] Lighthouse mobile on the live URL: performance >= 90, accessibility >= 95, LCP < 2.0 s, CLS < 0.05; JS still <= 150 KB gzipped.
- [ ] INP and TBT with and without consent measured (open from Phase 5 PR 3).
- [ ] `after` (server-side Lead send) confirmed on Vercel (open from Phase 5).

### Tracking on the live site (Phase 5 leftovers)

- [ ] Network tab on a real phone: zero third-party requests before consent and after "Odmítnout vše".
- [ ] GA4 DebugView and Meta Test Events show `page_view` ... `lead` with one shared `event_id`.
- [ ] Meta Conversions API: documented as "built, not enabled" (token and Graph version missing); enabling is a later step.
- [ ] Decision notes waiting on your "ok": vendors only after consent, no GA4 Measurement Protocol.

### In-app browser (SPEC §23), on a real phone

- [ ] Send the deployed link to yourself in Instagram DM and Messenger; open it **inside the app**.
- [ ] Hero fits, sticky bar does not jump with the keyboard, no autofocus on e-mail, `100dvh` behaves.
- [ ] Calculator works; submit works; success state shows "Otevřít přehled" first, then "Stáhnout PDF" and the copy-link hint.
- [ ] Results page opens; PDF link opens (no `download` attribute reliance).
- [ ] Open the opt-in and results links from the e-mail inside the mail app's webview (Gmail, Seznam).
- [ ] `in_app_browser=true` appears on the events.
- [ ] Record results (what worked, what did not, device and app versions) in a decision note.

### Polish

- [ ] 404 page checked on the live site against the drawing.
- [ ] Privacy page and unsubscribe page name the provisional retention periods; `docs/LEGAL-PACK.md` point 5 updated (period still `TODO_VERIFY`, defaults and how to change them).
- [ ] Privacy page text matches what actually runs (cookies, events, processors); placeholders marked `TODO_VERIFY`; controller details still placeholders.
- [ ] Footer "Zásady zpracování" and "Cookies" linked (memory: needs wireframes; if none drawn, state that in the README). Mobile menu likewise.
- [ ] Favicon in all sizes; OG image 1200x630, Czech title and description, checked in a link preview.
- [ ] Data freshness: no record stale on deploy day (earliest: EQQQ KIID 2026-10-24, VOO 2026-10-28, XTB about 14 Nov). **Remind David: add the monthly "refresh data" issue action** (SPEC §18, P1).
- [ ] Delivery of the Kompas e-mail checked at Seznam, Gmail and Outlook (spam folder too).
- [ ] Tax cards and PDF page 4: either verified Finanční správa text, or the README keeps the gap listed (never invent).

### README (SPEC §16)

- [ ] 1 to 6 present and current; 7 tracking plan and how to read the funnel; 8 expected conversion; 9 A/B hypotheses (already there).
- [ ] 10 "How I worked with AI" written from `docs/AI-LOG.md`, with the real mistakes.
- [ ] 11 gaps updated to the end-of-Phase-6 state: no lawyer, legal pack unsigned, placeholder controller, test sending domain, Vercel Hobby terms, data refresh cadence, 200 on unknown link, retention, CAPI status, 5-second test with one person.
- [ ] 12 run, test, deploy instructions and the **production switch checklist** (real domain with SPF/DKIM/DMARC, controller details, `EMAIL_MODE=live`, lift `noindex`).
- [ ] Launch gate (SPEC §19.5) stated plainly: the site stays `noindex`, no paid traffic.
- [ ] Czech README only if time is left (cut first).

### Close the phase

- [ ] `docs/PHASES.md` status and `docs/PHASE-5-PLAN.md` leftovers updated.
- [ ] Pre-release decision audit session (notes 0019, 0025, 0023).
- [ ] Decision notes drafted from your reasons (data model trim, retention defaults (reason still needed), in-app browser result, audit outcomes, deploy gate).
- [ ] `docs/AI-LOG.md` entry per PR, mistakes included.
- [ ] `pnpm check && pnpm format:check` green on every PR; no new dependency without a reason.
- [ ] Final review with David Thu evening; Fri 10-16 is buffer and submission (public repo + working `*.vercel.app` URL).

## Timeline

| When                     | Work                                                              | David                                                 |
| ------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------- |
| Wed 14.10. (rest of day) | Approve plan; PR 1 (data), PR 2 (delete lead), PR 3 (noindex, OG) | Answer open items, create Vercel project and env vars |
| Thu 15.10. morning       | First deploy, curl checks, PDF and rate-limit checks, PR 4 and 5  | Apply migrations, Meta Test Events                    |
| Thu 15.10. afternoon     | In-app browser test, fixes, README                                | Real-phone tests, Czech copy read                     |
| Fri 16.10.               | Buffer, final review, submission                                  | Final review                                          |

## Cut order if we slip

Czech README, funnel dashboard, Lighthouse CI, PDF (keep the results page), second hero variant. Never cut: sourced data validation, consent, `lead` tracking, honest README gaps.
