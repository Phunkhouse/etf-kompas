# Deploy to Vercel

Written 2026-10-14 for Phase 6 (`docs/PHASE-6-PLAN.md`). The steps that need an account are David's; the checks after the deploy can be repeated by anyone. Anything about the Vercel or Supabase screens that this file cannot verify from the repo is marked **verify in their docs**.

The site ships **`noindex`**, with no paid traffic, until the launch gate of SPEC §19.5 is met (see "Production switch" at the end).

## 1. Before the first deploy

- [ ] Supabase project in the EU region. In the SQL editor run, in this order: `supabase/migrations/0001_lead_flow.sql`, `0002_optin_sent_at.sql`, `0003_events.sql`. Row level security is on and there are no policies, so only the secret key reads or writes.
- [ ] Resend: an API key with sending access, and a test domain verified with SPF, DKIM and DMARC (SPEC §17.15).
- [ ] GA4 property and Meta dataset (ids exist since 2026-10-14).
- [ ] The data is fresh. `pnpm data:validate` passes locally; Vercel runs it before every build (`vercel.json`). It first fails on 2026-10-25 if nothing is refreshed.

## 2. Vercel project

- [ ] Import the GitHub repo (`main` is the production branch). Hobby plan (SPEC §12: its terms are non-commercial, so a real launch needs Pro; the README says so).
- [ ] Framework: Next.js. Node 24. The build command comes from `vercel.json` (`pnpm data:validate && pnpm build`); the install command is the default for pnpm.
- [ ] Function region close to the Supabase region (**verify in their docs** where to set it).
- [ ] Environment variables from the table below, for Production (and Preview if previews are used). `SITE_URL` must be present in the **build** environment too: the share image address is built from it.

## 3. Environment variables

Names come from `.env.example`; **never commit a value** (the repo is public). A value can be shown nowhere, not even in a log.

| Variable                      | Required        | Secret  | Notes                                                                                                                                                            |
| ----------------------------- | --------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`                | yes             | no      | the project URL                                                                                                                                                  |
| `SUPABASE_SECRET_KEY`         | yes             | **yes** | bypasses RLS, server only                                                                                                                                        |
| `IP_HASH_SECRET`              | yes             | **yes** | at least 32 bytes, new random value, not the local one                                                                                                           |
| `TOKEN_SIGNING_SECRET`        | yes             | **yes** | at least 32 bytes, a different random value                                                                                                                      |
| `SITE_URL`                    | yes             | no      | the public address, no trailing slash; also in the build                                                                                                         |
| `RESEND_API_KEY`              | yes             | **yes** | sending access only                                                                                                                                              |
| `EMAIL_FROM`                  | yes             | no      | sender on the verified test domain, says it is a test project                                                                                                    |
| `EMAIL_REPLY_TO`              | no              | no      |                                                                                                                                                                  |
| `EMAIL_MODE`                  | no              | no      | `sandbox` (default, only the allowlist) or `live`. **David decides at the end of the phase.** In `sandbox` the page never says an e-mail was sent to anyone else |
| `EMAIL_SANDBOX_ALLOWLIST`     | in sandbox      | no      | comma separated                                                                                                                                                  |
| `CRON_SECRET`                 | yes             | **yes** | at least 32 bytes. Vercel Cron sends it as `Authorization: Bearer ...` to `/api/purge` (**verify in their docs**); without it the route answers 401              |
| `RETENTION_LEAD_MONTHS`       | no              | no      | default 6 (provisional, note 0067)                                                                                                                               |
| `RETENTION_UNSUBSCRIBED_DAYS` | no              | no      | default 30 (provisional, note 0067)                                                                                                                              |
| `GA4_MEASUREMENT_ID`          | for GA4         | no      | `G-...`; without it only first-party events run                                                                                                                  |
| `META_PIXEL_ID`               | for the Pixel   | no      | digits                                                                                                                                                           |
| `META_CAPI_TOKEN`             | for server Lead | **yes** | not set yet: the server-side Lead is **built, not enabled**                                                                                                      |
| `META_GRAPH_VERSION`          | for server Lead | no      | read the current version from Meta's documentation; no default. Not set yet                                                                                      |

Must **not** be set on Vercel: `LEAD_STORE=memory` (the in-memory store refuses to start on Vercel, and the test routes `/api/test-leads` and `/api/test-capi` answer 404 without it), `LEAD_MIN_FILL_MS`, `META_GRAPH_BASE`.

## 4. Checks after the first deploy

Replace `$URL` with the `*.vercel.app` address.

- [ ] `curl -I $URL/` shows `X-Robots-Tag: noindex, nofollow`. Same for `$URL/zasady` and `$URL/srovnani/x` (the last also `Cache-Control: private, no-store`).
- [ ] `curl -s $URL/ | grep -o 'og:image" content="[^"]*"'` shows the `$URL` address, not `localhost`; open that address and see the share image.
- [ ] `curl -I $URL/api/test-leads` answers 404.
- [ ] Submit the form with an address on the allowlist. A row appears in Supabase `leads` and `events` (a `lead` event). The e-mail arrives; the results link works; the unsubscribe and the opt-in links work.
- [ ] Open the PDF from the results page. **Unverified on Vercel until now:** the fonts and the logo are read from disk (`outputFileTracingIncludes`); check that all six pages show the fonts.
- [ ] The 6th request from one address in an hour answers 429 (the limiter runs in Supabase).
- [ ] The calculator shows kroner for brokers (the daily exchange rate is fetched from the Czech National Bank; if it fails the page shows the fund fee only).
- [ ] Retention: call the purge once by hand and read the counts before trusting the cron:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" $URL/api/purge
```

It answers `{"leads":0,"events":0,"rateLimits":0,"failed":0}` or counts of what was old. The cron itself (daily, 03:17 UTC) has to be seen in the project's cron settings (Hobby runs a cron once a day, **verify in their docs**), and its first run read in the function logs.

- [ ] Tracking, on a real phone with the network tab open: zero requests to Google or Meta before consent and after "Odmítnout vše"; after "Přijmout vše" the GA4 DebugView and Meta Test Events show `page_view` to `lead` with one `event_id`.
- [ ] Lighthouse mobile on the live address: performance at least 90, accessibility at least 95, LCP under 2.0 s, CLS under 0.05; route JavaScript still at most 150 KB gzipped (`pnpm test:e2e` on a production build checks the budget).
- [ ] The in-app browser checklist of SPEC §23, on a real phone, recorded in a decision note.

## 5. If something is wrong

- A build fails on the data check: `pnpm data:validate` locally shows which value is missing or stale. Refresh the record with a source, or drop the field (note 0066). Do not edit the check.
- A wrong deploy: promote the previous deployment in Vercel (**verify in their docs**). Data in Supabase is not touched by a deploy; the migrations are run by hand.
- A leaked secret: rotate it in its service (Supabase, Resend, Meta), then in Vercel, then redeploy. `TOKEN_SIGNING_SECRET` rotates all unsubscribe and opt-in links; result links are separate (hashed in the database).
- To delete one person: `pnpm lead:delete <e-mail>` from a machine with `.env.local` holding the Supabase values.

## 6. Production switch (not done, and not this project's job)

The README states the same. A real launch needs all of these, and none is done:

- [ ] Controller details real (`src/config/site.ts`; Clientelo confirms) and the privacy text without `[doplnit]`.
- [ ] The legal pack (`docs/LEGAL-PACK.md`) signed off by a qualified reviewer, including the retention periods (provisional today).
- [ ] A real sending domain with SPF, DKIM and DMARC; `EMAIL_FROM`, `EMAIL_REPLY_TO` and the e-mail footers no longer say "test"; `EMAIL_MODE=live`.
- [ ] Vercel Pro (or another host) instead of the Hobby terms.
- [ ] The consent behaviour verified on a real phone (SPEC §19.5 iv).
- [ ] Meta Conversions API enabled (token and Graph version), with Test Events checked.
- [ ] The monthly "refresh data" action (SPEC §18) so the strict gate does not stop deploys.
- [ ] Only then: lift `noindex` (the header in `next.config.ts` and the tag in `src/app/layout.tsx`), and start paid traffic.
