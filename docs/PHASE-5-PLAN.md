# Phase 5 plan: tracking and consent

Status: **PRs 1 to 4 done on 2026-10-14 (#84, #86, #87, #88); PR 5 closes the docs, the real accounts are still open.** Approved by David on 2026-10-14. Source: SPEC §9, §17.12, §22 (Phase 5), §23 and `docs/design/wireframe-b.md` (cookies). Written 2026-10-14.

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

- [x] Test cases first, approved before implementing (event schema, session, in-app-browser detection, UTM and `fbclid`).
- [x] The tracker (`src/lib/track-client.ts`, an inline script, decisions below) with `variant`, `utm_*`, `session_id`, `device`, `in_app_browser`.
- [x] `/api/event`: Zod, no PII, hashed or dropped IP, runs even when consent is denied.
- [x] Supabase tables and migration for sessions and events, RLS on.
- [x] Session and variant in a first-party cookie with a URL fallback (§23).
- [x] UTM, `fbclid`, variant and `in_app_browser` stored with the session and the lead.
- [x] Events: `page_view`, `calc_start`, `calc_result`, `gate_view`, `form_focus`, `lead`.
- [x] `?debug=1` prints events to the console.

### PR 3: `feat: GA4 and Meta after consent`

- [x] Google Consent Mode v2: all denied by default, updated on the choice.
- [x] GA4 and the Pixel are injected on idle (`requestIdleCallback`) only after consent, each by its own category. Consent Mode v2: `default` denied and `update` granted at that moment, no `gtag` before consent.
- [ ] Measure INP and TBT with and without consent: not done in PR 3 (needs the real tags, see PR 5).
- [x] Playwright: zero non-essential third-party requests before consent and after "Odmítnout vše".
- [x] Playwright: the order `page_view, calc_start, calc_result, gate_view, form_focus` (the `lead` part comes in PR 4 with the shared `event_id`).

### PR 4: `feat: server-side lead event`

- [x] Test cases first, approved before implementing.
- [x] One `event_id` per submission, shared by the browser and the server.
- [x] Meta Conversions API from the server; hashed data only with advertising consent. The GA4 Measurement Protocol is not built (it would double count, David agreed 2026-10-14).
- [x] `lead` exactly once per submission (double click, resubmit, same e-mail twice).
- [x] A failed or slow send never blocks or fails the lead.
- [x] Privacy and cookie text match what actually runs (placeholder, needs a lawyer).

### PR 5: `docs: close Phase 5`

- [x] `docs/PHASES.md`, the README gaps, `docs/AI-LOG.md`.
- [ ] Decision notes for the vendors after consent and for no GA4 Measurement Protocol: suggested to David, written after his reason.
- [x] GA4 property created and the id in `.env.local` (2026-10-14); David tested GA4 with the real property. Meta dataset created, Pixel id in `.env.local`.
- [x] **Meta Test Events, browser side, done on the deployed address (2026-10-14):** `PageView`, `ViewContent` and `Lead` with an event ID after "Přijmout vše"; nothing after "Odmítnout vše". Meta also showed its own automatic "Subscribed Button Click".
- [ ] **Still open:** the Conversions API token and the current Graph API version into the Vercel environment variables, then the server-side call in Test Events (an optional `META_TEST_EVENT_CODE` setting is built for it, Phase 6).
- [ ] **Open:** the Meta server call accepted (`fbc` format, version, payload) and `after` on Vercel.
- [ ] **Open:** the real-phone check of the Meta side (nothing marketing before consent, `lead` once with matching `event_id`).
- [ ] **Open:** INP and TBT with and without consent.

## Cut order if we slip

Optional events (`scroll_*`, `form_submit_attempt`, `kompas_download`, `results_open`), then the funnel dashboard (P1). Never cut: consent, the `lead` event, honest gaps.

## PR 2: decisions and test cases (approved by David 2026-10-14)

Source: SPEC §9, §23, §26, the Phase 5 acceptance criteria. Test cases first: nothing below is implemented until David approves it.

### Decisions I need (the spec is silent or two parts disagree)

1. **Session before consent.** SPEC §9 says first-party counting before consent is cookieless; SPEC §23 says session and variant live in a first-party cookie. They disagree. Proposal: **no cookie and no storage before the visitor agrees to measurement.** The `session_id` is a random id kept in memory for one page load (it counts that visit only). After "Měření návštěvnosti" is agreed it is kept in a cookie `kompas_sid` (session cookie, no expiry). The variant needs no cookie: it comes from the URL (`?v=`, note 0041).
2. **The lead and the session.** A lead row stores UTM, `fbclid` and the variant already (Phase 4). Proposal: the lead row gets `session_id` **only when measurement is agreed**, because a session id on the lead row links the e-mail to the visit's events and makes them personal data. Added to `docs/LEGAL-PACK.md` as a point.
3. **No tracking code in the React bundle.** The JS budget has no room (note 0062). The tracker is one more inline script written like the consent script (`src/lib/track-client.ts`, delegated listeners and one IntersectionObserver, about 1.5 KB raw), not a module the calculator imports. The page marks what it needs with `data-track` attributes. Cost: the script appears twice in the page (inline and in the data payload), about 0.8 KB gzipped more per script; the budget test does not count it.
4. **When the events fire** (the spec says only "when"):
   - `page_view`: once per page load, with UTM, variant, device, `in_app_browser`.
   - `calc_start`: the first change of the slider or a horizon chip, once per page load.
   - `calc_result`: once per page load, **when the result has been in view for 1 second after `calc_start`** (the result is shown from the start with default values, so "result shown" alone would equal `calc_start` and tell us nothing). With the monthly amount and the years (they are on the slider grid, so they are the buckets).
   - `gate_view`: once, when the form is half in view.
   - `form_focus`: once, when the e-mail field gets focus.
   - `lead`: written by the **server** when a lead is stored for the first time (a new e-mail), not on a repeat submit of the same e-mail, so CPL is not counted twice. The browser side and `event_id` come in PR 4.
5. **One table.** `events` carries the campaign columns on every row (no `sessions` table); `fbclid` is stored on the `page_view` row only. Retention is `TODO_VERIFY` (legal pack point 5).
6. **Rate limit of `/api/event`.** The existing limiter, keyed by the hashed IP (never stored with the event): 120 events per hour per visitor, answer 429.

### Test cases

Unit (`*.test.ts`, node):

- E-1 `parseEvent` accepts each of the six names with its allowed properties, and rejects an unknown name, an unknown property, a string longer than 100 characters, `calc_result` with an amount off the slider grid or years not 5, 10 or 20, and any property that looks like an e-mail address.
- E-2 `variant` must be `a` or `b`; a UTM value is trimmed and cut at 100 characters; a missing UTM is `null`.
- E-3 `device` is `phone` or `desktop` only; `in_app_browser` is a boolean; no raw user agent is accepted or stored.
- E-4 `recordEvent` stores the row with the server's time (a time from the browser is ignored), the `session_id`, and `consent_measurement`.
- E-5 `session_id` must be a UUID; the same event name twice in one session is stored twice (the browser sends it once; the server does not deduplicate, the funnel query does).
- E-6 the 121st event from one hashed IP within an hour answers `limited`; the key is the hash, never the IP.
- E-7 the lead service writes one `lead` event for a new e-mail and none for a repeat of the same e-mail; a failed event write does not fail the lead.
- E-8 `fbclid` is kept only on `page_view`; every other event drops it.
- E-9 the lead row gets `session_id` only when `measurement` is true.

Route (`POST /api/event`, unit test with the memory store):

- R-1 valid body: 204 and no body; invalid body: 400; wrong method: 405; body over 2 KB: 413.
- R-2 the response sets no cookie and the route reads no cookie.

Browser script (`*.test.tsx`, jsdom, the real inline script):

- B-1 on load it sends `page_view` once with the variant, UTM, device and `in_app_browser` (`Instagram`, `FBAN`, `FBAV` in the user agent give true).
- B-2 no cookie and no `localStorage` or `sessionStorage` write before measurement consent; the id differs on the next load.
- B-3 after the `kompas:consent` event with measurement true, `kompas_sid` is set and the same id is used from then on.
- B-4 a refusal in the cookie at load means no `kompas_sid`, but events are still sent.
- B-5 `calc_start` once however many times the slider moves; `calc_result` only after `calc_start` and one second in view; neither fires twice.
- B-6 `gate_view` and `form_focus` fire once each.
- B-7 `?debug=1` prints each event to the console and does not change what is sent.
- B-8 a failed request does not throw and does not retry in a loop.
- B-9 the events leave in the order `page_view, calc_start, calc_result, gate_view, form_focus`.

Playwright (`e2e/tracking.spec.ts`, mobile, memory store):

- P-1 first visit: `/api/event` receives `page_view` and the context has no cookie before a choice (the existing "no cookies before a choice" test stays).
- P-2 the full path (move the slider, wait, scroll to the form, focus the e-mail field, submit) shows `page_view, calc_start, calc_result, gate_view, form_focus, lead` in the memory store, in that order, `lead` once.
- P-3 submitting the same e-mail twice gives one `lead`.
- P-4 UTM and `fbclid` from the URL are on the stored `page_view` and on the lead; the variant of `/?v=b` is `b`.
- P-5 after "Přijmout vše", `kompas_sid` is set and the lead has the same `session_id`; after "Odmítnout vše" there is no `kompas_sid` and the lead has none.
- P-6 JS budget test stays green (149.8 of 150 KB).

## PR 3: decisions and test cases (approved by David 2026-10-14)

Source: SPEC §9, §12 (analytics), §17.12, the Phase 5 acceptance criteria. Test cases first: nothing below is implemented until David approves it. The accounts do not exist yet, so everything runs against stubs (a fake GA4 id and Pixel id, and the two vendor scripts answered by empty stub files in Playwright). The real behaviour of the two vendors is only proven at the end of the phase, in GA4 DebugView and Meta Test Events (PR 5).

### Decisions I need

1. **Where it lives.** In the same inline tracker script (note 0063), not in the React bundle (the margin is 0.1 KB). The loader adds about 1.5 KB to the inline script.
2. **The ids.** Two optional server variables, read when the page is built: `GA4_MEASUREMENT_ID` (form `G-XXXXXXXXXX`) and `META_PIXEL_ID` (digits). Not secret (they are visible on any site that uses them), so no `NEXT_PUBLIC_` prefix is needed: the build writes them into the script. A missing or malformed id means that vendor is never loaded. Without both ids the site only counts first-party (SPEC §17.12). Added to `.env.example`.
3. **Which category loads what.** "Měření návštěvnosti" loads GA4. "Reklama a remarketing" loads the Meta Pixel and turns on the advertising signals in GA4 (`ad_storage`, `ad_user_data`, `ad_personalization`). Neither vendor is requested before its category is agreed. Loading starts on idle (`requestIdleCallback`, with a timeout fallback), not during the first paint.
4. **Consent Mode v2.** Because nothing loads before consent, there are no pings and no modelling. The script still sets Consent Mode the standard way at the moment it loads GA4: `default` all denied, then `update` with what the visitor agreed. A later withdrawal sends `update` denied, sets `window['ga-disable-<id>']`, and calls `fbq('consent','revoke')`. A script that is already loaded stays in memory until the next page load.
5. **What each vendor gets.** GA4: all five browser events under their own names (`page_view`, `calc_start`, `calc_result` with `monthly` and `years`, `gate_view`, `form_focus`) with `variant`, `device` and `in_app_browser`; its automatic page view is switched off so there is no double count. Meta: `PageView`, and the standard `ViewContent` for `calc_result`. `Lead` (and GA4 `generate_lead`) come in PR 4 with the shared `event_id`. The mapping to Meta events is my proposal.
6. **What the consent does not replay.** The visitor who agrees on the first screen has already produced `page_view`. I send that one to the vendors the moment consent arrives (the page they agreed on is being viewed now). Other earlier events are not replayed.
7. **The `lead` in the sequence.** The browser-side `lead` needs the shared `event_id` from PR 4, so the full order `page_view … form_focus, lead` for the vendors is tested in PR 4. In PR 3 the order up to `form_focus` is tested.

### Test cases

Browser script (`Tracker.test.tsx`, jsdom, the real inline script; the two ids passed in):

- T-1 with no ids, nothing third-party is ever added, even after full consent.
- T-2 before any choice, and after "Odmítnout vše", no `<script>` for Google or Meta is added and `dataLayer` and `fbq` do not exist.
- T-3 measurement only: after the consent event, on idle, the GA4 script with the id is added; `dataLayer` holds, in order, `consent default` (all four denied), `consent update` (`analytics_storage` granted, the other three denied), `js`, `config` with the id and `send_page_view: false`, then `page_view`. No Meta script.
- T-4 advertising only: the Meta script is added, `init` with the pixel id and `PageView` are queued; GA4 is not loaded.
- T-5 both: both loaded, and the `update` grants all four GA4 signals.
- T-6 events after consent: each of the five reaches GA4 under its name with `variant`, `device`, `in_app_browser`; `calc_result` carries `monthly` and `years`; Meta gets `PageView` and `ViewContent` only.
- T-7 a stored choice at load (a returning visitor) loads the vendors on idle, and sends `page_view` once.
- T-8 withdrawal: after measurement goes off, GA4 gets `consent update` denied and `ga-disable-<id>` is true; after advertising goes off, `fbq('consent','revoke')` is called; no further events reach the vendor.
- T-9 a malformed id (`G-` with spaces, a pixel with letters, a script tag in it) is ignored: that vendor is never loaded.
- T-10 loading is not synchronous: right after the consent event no script is in the page; after idle it is.
- T-11 events before consent are not replayed except `page_view`.
- T-12 the first-party events are sent exactly as in PR 2, whatever the vendors do (a vendor script that fails to load changes nothing).

Env (`env.test.ts`):

- V-1 both ids optional; a valid `G-` id and a numeric pixel id pass; a malformed one is dropped with a warning that names the variable and never shows the value.

Playwright (`e2e/ad-tags.spec.ts`, mobile, fake ids set in the webServer environment, vendor scripts answered by empty stubs):

- A-1 first visit, then "Odmítnout vše", then the whole path (slider, result, form): every request goes to localhost; no request to Google or Meta.
- A-2 "Přijmout vše": requests to the Google tag and `connect.facebook.net` appear (stubbed) only after the click; `dataLayer` and `fbq.queue` have the five events in the order `page_view, calc_start, calc_result, gate_view, form_focus`.
- A-3 settings with measurement only: the Google tag is requested, Meta is not.
- A-4 with the ids left out of the environment the same path makes no third-party request, even after "Přijmout vše" (a second small run of the same test with the variables unset).
- A-5 JS budget test stays green (149.9 of 150 KB; the inline script is not counted).
- A-6 INP and TBT, measured by hand once with and without consent on a throttled run, written into the PR (no assertion).

## PR 4: decisions and test cases (approved by David 2026-10-14; decisions 2 and 3 to be revisited when the accounts exist)

Source: SPEC §9 (`lead` also server-side), §17.12, the Phase 5 acceptance criteria, notes 0064 and 0065. Test cases first: nothing below is implemented until David approves it. As in PR 3 the accounts do not exist, so the Meta Conversions API (CAPI) is tested against a local stub route; whether Meta accepts the request is only proven at the end of the phase in Test Events.

### Decisions I need

1. **One `event_id`.** It is the id of the first-party `lead` event row (note 0065). The server returns it in the form state, the success markup carries it as `data-lead-event-id`, the tracker sends the browser `lead` with it, and the server CAPI call sends the same one. It exists **only for a new lead** (a repeat submit of the same address returns `null`), so neither vendor counts a person twice.
2. **GA4 gets `generate_lead` from the browser only; I propose not to build the GA4 Measurement Protocol call.** SPEC §9 asks for both, but GA4 has no `event_id` deduplication between a browser event and a Measurement Protocol event, so every visitor whose browser event arrives would count twice, and the server call also needs the visitor's GA client id, which exists only when measurement is agreed (the same people whose browser event arrives). This is a deviation from the spec: your decision. Alternative: build it anyway and accept the double count.
3. **CAPI only with advertising consent, and only when fully configured.** Without "Reklama a remarketing" agreed nothing about the visitor goes to Meta. The call is made when `META_PIXEL_ID`, `META_CAPI_TOKEN` and `META_GRAPH_VERSION` are all set. **I do not know which Graph API version is current, so there is no default** (`TODO_VERIFY`; you read it from Meta's documentation when the account exists). It sends: event name `Lead`, the event id, the server's time, `action_source: website`, the page address (`SITE_URL`), the SHA-256 of the lower-cased e-mail, the visitor's IP and user agent, and `fbc` built from the stored `fbclid` (and `fbp` when the browser sent it). The exact `fbc` format is from my memory of Meta's documentation: checked in Test Events at the end.
4. **How consent reaches the server.** At submit the tracker sets a hidden `ads` field to `1` only when advertising is agreed (like `sid`). The server trusts it, as it does `sid`. Anything but the literal `1` means no.
5. **Sending never blocks the answer.** The CAPI call runs after the response (Next's `after`), with a 3-second timeout and no retry. A failure is logged without the e-mail, the token or the response body. A lost event is accepted.
6. **A test hook.** `META_GRAPH_BASE` replaces `https://graph.facebook.com` and is honoured only when `LEAD_STORE=memory` (never on Vercel), so Playwright can point the server at a local stub route `/api/test-capi` (404 outside the memory store).
7. **Bundle.** The success markup needs `data-lead-event-id` in the form component, a few bytes in the client bundle; the margin is 0.1 KB. I measure it, and if it does not fit I come back to you before doing anything else.

### Test cases

Server (`leads.test.ts` and a new `capi.test.ts`, unit):

- L-1 the state of a new lead has an `eventId` equal to the id of its stored `lead` event row; a repeat submit has `null`; a bot's fake success has `null`.
- L-2 the event id is a UUID and is the same in the state, the event row and the CAPI body.
- C-1 with advertising consent and the three variables set, a new lead produces one request: URL `…/<version>/<pixel id>/events`, body with the fields of decision 3, the e-mail only as a SHA-256 of the lower-cased, trimmed address, time in seconds from the server's clock.
- C-2 no request when: the `ads` field is not `1`; any of the three variables is missing; the lead is a repeat; the submit was a bot.
- C-3 IP and user agent are in the request only because consent is given (no request, no data).
- C-4 `fbc` is built from `fbclid` only when there is one; `fbp` only when sent.
- C-5 a failing, refused or 3-second-slow Meta answer does not change the returned state and does not throw; the log line contains neither the e-mail, nor the token, nor the response body.
- C-6 the request is made after the response (the test collects the after-task and sees no request before it runs).
- C-7 `META_GRAPH_BASE` is ignored unless `LEAD_STORE=memory`.

Env (`env.test.ts`):

- V-2 the three Meta server variables are optional together: a token without a version, or the reverse, counts as not configured, with a warning that names the variable.

Browser script (`Tracker.test.tsx`, jsdom, the real inline script):

- B-L1 when `[data-lead-event-id]` appears, GA4 gets `generate_lead` with the id as `event_id`, and the Pixel gets `Lead` with `eventID` set, each once, whatever happens to the markup afterwards.
- B-L2 only the vendors that are on get it: nothing when both are off; GA4 only with measurement; the Pixel only with advertising.
- B-L3 no vendor event when the markup has no id (a repeat submit).
- B-L4 the first-party count is untouched: `lead` is never sent to `/api/event` by the browser.
- B-L5 the hidden `ads` field is `1` at submit only when advertising is agreed, and empty otherwise; `sid` behaves as before.

Component (`LeadForm.test.tsx`):

- F-1 the success state has `data-lead-event-id` when the state has an id, and no attribute when it has `null`.

Playwright (`e2e/lead-event.spec.ts`, mobile, fake ids, stubbed vendor scripts, the CAPI stub route):

- E-1 "Přijmout vše", the whole path and a submit: GA4 receives `page_view, calc_start, calc_result, gate_view, form_focus, generate_lead`; the Pixel queue ends with `Lead` and an `eventID`; the CAPI stub received one request with the same id, which is also the id of the stored `lead` event.
- E-2 "Odmítnout vše": the same path stores the lead and the first-party `lead` event; no vendor `lead`, and the CAPI stub received nothing.
- E-3 measurement only: GA4 `generate_lead`; the Pixel and CAPI nothing.
- E-4 the same address twice: one browser `lead` per vendor and one CAPI request.
- E-5 the CAPI stub answers 500 (and, in a second run, never answers): the submit still ends in "Hotovo", the lead is stored, the results link works.
- E-6 JS budget test stays green (149.9 of 150 KB or less).
