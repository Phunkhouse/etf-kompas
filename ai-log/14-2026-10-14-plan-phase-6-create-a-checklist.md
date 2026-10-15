# Plan Phase 6, create a checklist

- Session: `f973ec42-c5c3-42b1-8b92-6c28215fec9e`
- From 2026-10-14T13:50:24.895Z to 2026-10-14T19:13:58.501Z (UTC)
- Folder: /Users/davidkrapka/dev/learning/etf-kompas
- Git branches seen: main, fix/data-model-unused-fields, feat/retention-and-delete-lead, feat/noindex-share-image-metadata, ci/strict-data-gate, docs/deploy-notes, fix/site-url-does-not-break-build, docs/deploy-notes, docs/in-app-browser-test, main, perf/lcp-cookie-bar, docs/lighthouse-live ...
- 56 messages from David, 337 from Claude, 241 tool calls

> Converted from the stored transcript (not the output of `/export`): system reminders, thinking, images and the long tail of big tool results are left out; secrets and e-mail addresses are redacted.

---

### David 13:50

Plan Phase 6, create a checklist

### Claude 13:50

`Bash  command: cat docs/PHASES.md && ls docs docs/decisions | head -80 && grep -n "^## \|^### " docs/SPEC.md | sed -n 1,200p`

### Tool result 13:50

```
# Dev phases

Short version of [SPEC.md](SPEC.md) §14, §20 and §22. If this file and the spec disagree, the spec wins.

**Deadline:** Fri 2026-10-16. **Re-planned 2026-10-12:** the P0 core by Tuesday evening 2026-10-13, Wed to Thu is buffer (SPEC §20). Status of each phase is in the git history and `docs/AI-LOG.md`.

## At a glance

| #   | Phase                  | Target     | Needs from David                              |
| --- | ---------------------- | ---------- | --------------------------------------------- |
| 0   | Scaffold (done)        | Sat 10.10. | GitHub remote, starter guide                  |
| 1   | CI, data, validator    | done       | Verified data, wireframe B            [... 11926 more characters]
```

### Claude 13:50

`Bash  command: sed -n 346,362p docs/SPEC.md; sed -n 437,453p docs/SPEC.md; sed -n 520,556p docs/SPEC.md; sed -n 363,386p docs/SPEC.md; cat docs/PHASE-5-PLAN.md | head -60; cat ~/.claude/projects/-Users-davidkrapka-dev-learning-etf-kompas/memory/{data-freshness-control,pre-release-decision-audit,phase5-real-checks-pending,footer-links-and-wireframes}.md; ls; ls .github/workflows; cat vercel.json next.con [... 28 more characters]`

### Tool result 13:50

```
## 16. README outline (deliverable)

1. Target audience and the "NYSE vs UCITS" decision
2. Offer, gate moment, form, post-submit
3. The two ads (creatives plus UTM scheme)
4. Section order and rationale
5. Interactive element and methodology
6. Data sources
7. Tracking plan and how to read the funnel
8. Expected conversion and assumptions
9. Three A/B hypotheses (ranked)
10. How I worked with AI (instructions, validation, mistakes), from `AI-LOG.md`
11. What is missing and known risks (legal review, lead recipient, Vercel Hobby terms, data refresh cadence)
12. Run, test, deploy instructions

---

## 20. Timeline and cut order

Re-planned on 2026-10-12 (Monday). Hard deadline: Fri 2026-10-16 [... 20596 more characters]
```

### Claude 13:50

`Bash  command: sed -n 60,140p docs/PHASE-5-PLAN.md; sed -n 408,436p docs/SPEC.md; cat .env.example; ls src/app src/app/* | head -70; ls supabase/migrations scripts; wc -l README.md; grep -n "^#" README.md; cat .github/workflows/ci.yml | head -40; grep -rn "noindex\|robots" src/app --include=*.ts* -l | head; ls public`

### Tool result 13:50

```
- [ ] Measure INP and TBT with and without consent: not done in PR 3 (needs the real tags, see PR 5).
- [x] Playwright: zero non-essential third-party requests before consent and after "Odmítnout vše".
- [x] Playwright: the order `page_view, calc_start, calc_result, gate_view, form_focus` (the `lead` part comes in PR 4 with the shared `event_id`).

### PR 4: `feat: server-side lead event`

- [x] Test cases first, approved before implementing.
- [x] One `event_id` per submission, shared by the browser and the server.
- [x] Meta Conversions API from the server; hashed data only with advertising consent. The GA4 Measurement Protocol is not built (it would double count, David agreed 2026-10-14). [... 14095 more characters]
```

### Claude 13:50

`Bash  command: grep -rn "robots\|noindex" src --include=*.ts --include=*.tsx -l; ls src/app/api/test-capi src/app/api/test-leads; head -30 src/app/api/test-leads/route.ts; sed -n 32,53p README.md; ls docs/design | head -30; grep -n "TODO_VERIFY" src/config/site.ts | head; grep -n "og:\|openGraph" -r src | head -3; cat .env.local 2>/dev/null | sed 's/=.*/=…/' | head -0`

### Tool result 13:50

```
Exit code 1
(eval):1: no matches found: --include=*.ts
```

### Claude 13:50

`Bash  command: setopt nonomatch 2>/dev/null; grep -rln "robots\|noindex" src ; ls src/app/api/test-capi src/app/api/test-leads; head -25 src/app/api/test-leads/route.ts; sed -n 32,53p README.md; grep -n "TODO_VERIFY" src/config/site.ts | head; grep -rn "openGraph" src | head -3`

### Tool result 13:50

```
src/app/layout.tsx
src/app/srovnani/[token]/page.tsx
src/app/srovnani/[token]/pdf/route.ts
src/app/zasady/page.tsx
src/app/odhlasit/[token]/zpet/page.tsx
src/app/odhlasit/[token]/page.tsx
src/app/styleguide/page.tsx
src/app/potvrdit/[token]/page.tsx
src/app/api/test-capi:
[...path]

src/app/api/test-leads:
route.ts
// A view of the in-memory store for Playwright. It exists only when the server runs
// with LEAD_STORE=memory (never on Vercel); everywhere else it is a plain 404.
import { connection } from 'next/server'
import { memoryLeads, memoryMail } from '@/app/lead-service'

export async function GET() {
  // Read at request time, not once at build time.
  await connection()
  const memor [... 4741 more characters]
```

### Claude 13:50

Short status: I've read PHASES, SPEC §19/20/22/23, the Phase 5 plan, the README gaps and the repo layout. I'm now writing the Phase 6 plan and checklist to `docs/PHASE-6-PLAN.md`.

### Claude 13:51

`Write  file_path: /Users/davidkrapka/dev/learning/etf-kompas/docs/PHASE-6-PLAN.md`

### Tool result 13:51

```
File created successfully at: /Users/davidkrapka/dev/learning/etf-kompas/docs/PHASE-6-PLAN.md (file state is current in your context — no need to Read it back)
```

### Claude 13:51

I wrote the Phase 6 plan and checklist to [docs/PHASE-6-PLAN.md](docs/PHASE-6-PLAN.md). It's a draft and nothing is implemented. I read the repo's docs and a few source files but didn't run any commands or check the live state. No Vercel project is set up, and I haven't touched `docs/AI-LOG.md` or any decision notes.

**Plan in short.** The acceptance criteria are:
- Deploy on Vercel with `noindex` verified by `curl -I`.
- Run the in-app browser checklist (SPEC §23) and record it in a decision note.
- Finish the 404 page, privacy page, favicon and share image.
- Complete the README with every gap listed.

I split it into 7 small PRs, from `fix:` on the data model through `docs:` to close the phase. The timeline runs Wed to Thu, with Fri 16.10. as buffer. The checklist is grouped into:
- what I need from you
- deploy
- tracking on the live site
- in-app browser on a real phone
- polish
- README
- closing the phase

**Decisions I need from you** (my proposals are in the plan):
1. **Strict data gate.** `data:validate` fails on 51 `TODO_VERIFY` values in fields no screen uses. I propose dropping those fields from the data model, since inventing values is forbidden. That changes the model, so it needs your OK and your reason for a decision note.
2. **Deletion and retention.** Build `scripts/delete-lead.ts` and leave the retention period `TODO_VERIFY`, said openly in the README.
3. **Meta Conversions API.** The token and Graph version are missing. Either you supply them before Thursday, or the README says the server side is built but not enabled.
4. **`EMAIL_MODE` on Vercel.** `live` only once the test domain is verified; otherwise `sandbox`.
5. **Strict gate in CI.** Run the strict data validator on `main` as a deploy gate.
6. **Pre-release decision audit.** Compare notes 0019, 0025 and 0023 in one short session.

**Reminders I folded in.**
- The monthly "refresh data" action.
- Meta Test Events once the site is live.
- Footer links and menu wireframes.
- Verifying the PDF fonts on Vercel.
- Measuring INP and TBT with and without consent.

**Blockers on your side** are the Vercel project, the environment variables, the production Supabase migrations, the final read of the Czech copy, and the real-phone tests.

Approve the plan, or tell me what to change, and answer the 6 questions. I'll start on PR 1 after that.

### David 13:57

Q: Strict data gate. data:validate fails on 51 TODO_VERIFY values in fields no screen uses. I propose dropping those fields from the data model, since inventing values is forbidden. That changes the model, so it needs your OK and your reason for a decision note.
A: Yes drop, but verify if something isn't essential

Q: Deploy gate in CI. SPEC §19 says the validator passes before launch; CI today runs only the draft mode. Proposal: run strict `data:validate` as a Vercel build step or a separate CI job on `main`.
A: I agree

Q: Retention and deletion. No period is decided. Proposal: build `scripts/delete-lead.ts` (deletes the lead, its tokens and its events' `session_id`) and leave the period `TODO_VERIFY` on the page, said openly in the README.
A: Give me more info about it

Q: Meta Conversions API. The token and Graph version are missing, so the server-side Lead stays off. Proposal: either you give both before Thursday, or the README says the server side is built but not enabled.
A: More info about it please

Q: EMAIL_MODE on Vercel. live only once the test domain is verified; otherwise sandbox.
A: Ok, remind me in the end of the phase

Q: Pre-release decision audit. Compare notes 0019, 0025 and 0023 in one short session.
A: Ok

### Claude 13:57

`Bash  command: cat supabase/migrations/0001_lead_flow.sql | head -80; grep -n "create table\|session_id\|references" supabase/migrations/000[23]*.sql; grep -rln "META_CAPI_TOKEN" src; grep -n "retention\|Retention\|uchov" -ri docs/LEGAL-PACK.md | head`

### Tool result 13:57

```
-- Phase 4: lead storage (SPEC §26). Run once in the Supabase SQL editor.
-- Access is from the server only, with the secret key. RLS is on and there are
-- no policies, so the browser keys (anon, authenticated) can read and write nothing.
-- No raw IP and no raw token is stored anywhere. `events` comes in Phase 5.

create table public.leads (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null unique check (email = lower(email) and length(email) <= 254),
  created_at            timestamptz not null default now(),
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  utm_content           text,
  utm_ [... 3440 more characters]
```

### Claude 13:57

I checked the schema and the legal pack. Here are the two items you asked about. I won't change the plan until you answer.

## Retention and deletion

**What's stored today:**
- `leads`: e-mail, UTM values, `fbclid`, variant, calculator bucket, consent flags, `unsubscribed_at` and `deleted_at`, plus a `session_id` when the visitor agreed to measurement.
- `result_tokens`: hashes only. These cascade-delete with the lead.
- `events`: no e-mail and no IP. The only link to a person is `session_id`, which the lead row holds if measurement was agreed.
- `rate_limits`: hashed keys only.

**Why it matters:** the privacy text has `[doplnit]` where it should say how long we keep an e-mail. GDPR requires a stated period and a way to delete. The unsubscribe page can't say when the address is deleted until this exists.

**What I'd build:**
1. `scripts/delete-lead.ts <email>`. It deletes the lead and, via the cascade, its tokens. It also deletes that lead's events by `session_id` when one is stored, so nothing links back to the person. You run it manually.
2. Tests first, as the spec requires for lead handling.
3. The README states honestly that deletion is manual, so the demo can't claim an automatic deletion process.

**What I can't decide for you:** the period itself, for example "6 months after the last contact" or "until unsubscribe plus 30 days". It's a legal question and there's no lawyer, so I'd keep it `TODO_VERIFY` instead of inventing a number. If you want a figure, give me one with your reason and I'll use it.

**Optional extra:** an automatic purge, such as a scheduled job that deletes unsubscribed leads and old events. I'd skip it for the deadline and list it as a gap.

## Meta Conversions API (CAPI)

**What it is:** the Pixel in the browser sends `Lead`, and a server call sends the same `Lead` with the same `event_id`. Meta de-duplicates the two. The server copy survives ad blockers and in-app browser limits, which is the reason it exists for Instagram traffic.

**What's built (Phase 5 PR 4):** the server call, with hashed data sent only with advertising consent. A failed send never blocks the lead. It's tested against a stub. It stays off until `META_CAPI_TOKEN` and `META_GRAPH_VERSION` are set.

**What's missing, both from you:**
- **Token:** Events Manager → your dataset → Settings → Conversions API → "Generate access token". It's a secret. It goes only into Vercel's environment variables and never into the repo.
- **Graph API version:** read it from Meta's current docs when you generate the token. I won't guess one.

**Effect of leaving it off:**
- The `lead` event still reaches Meta from the Pixel, but only for visitors who consented and aren't blocked.
- Our own first-party table counts every lead.
- A refuser's lead appears only in our table, whichever way this goes (the README already says so).

**Cost of enabling it:** about 10 minutes of your time, then one Test Events check on the live site. I'd do it Thursday together with the other Meta checks.

**My suggestion:** generate the token and version when you create the Vercel project and add them to Vercel's environment variables. If it slips, the README says "built, not enabled", which is honest and costs nothing.

## Recorded so far

- **Drop the unused data fields.** I'll keep any field that turns out to be needed. I'll verify each of the 51 against the screens, the PDF and the calculator before removing it, and report the ones I keep.
- **Strict validator in CI on `main`.** Agreed.
- **`EMAIL_MODE`.** I'll remind you at the end of the phase.
- **Decision audit.** Notes 0019, 0025 and 0023 get one session.

Two answers would let me finalise the plan. Do you want the manual deletion script only, with no retention period? And will you provide the Meta token and Graph version, or should the README say "built, not enabled"?

### David 14:02

Q: What I can’t decide for you: the period itself, for example “6 months after the last contact” or “until unsubscribe plus 30 days”. It’s a legal question and there’s no lawyer, so I’d keep it TODO_VERIFY instead of inventing a number. If you want a figure, give me one with your reason and I’ll use it.
A: Keep it for TODO and mention that in legal pack

I would go with something automatic, and 6 months after the last contact” or “until unsubscribe plus 30 days for now. But keep it transparent and ready to change

Q: And will you provide the Meta token and Graph version, or should the README say “built, not enabled”?
A: We could just prepare it. But state it in readme

### Claude 14:02

`Bash  command: python3 - <<'E' ⏎ p='docs/PHASE-6-PLAN.md' ⏎ s=open(p).read() ⏎ s=s.replace("Status: **draft, waiting for David's approval.** Written 2026-10-14.","Status: **draft, open items answered by David on 2026-10-14 (see \"Answers\"); waiting for the final approval.** Written 2026-10-14.") ⏎ a=s.index("## Open items") ⏎ b=s.index("## Branches and PRs") ⏎ new='''## Answers from David (2026-10-14)  [... 4569 more characters]`

### Tool result 14:02

```
3:Status: **draft, open items answered by David on 2026-10-14 (see "Answers"); waiting for the final approval.** Written 2026-10-14. Source: SPEC §17.14, §19 (launch gate), §20, §22 (Phase 6), §23, `docs/PHASES.md`, `docs/PHASE-5-PLAN.md` (open items) and the README "Known gaps". Deadline: **Fri 2026-10-16**. Today is Wed 2026-10-14, so there are about two working days.
137:| Wed 14.10. (rest of day) | Approve plan; PR 1 (data), PR 2 (delete lead), PR 3 (noindex, OG) | Answer open items, create Vercel project and env vars |
```

### Claude 14:02

I updated [docs/PHASE-6-PLAN.md](docs/PHASE-6-PLAN.md) with your answers. The file had also changed on disk before my edit, so I'm treating that version as current.

**What the plan now says**
- **Unused data fields:** PR 1 drops them but checks each one first. It reports any field it keeps because it turns out to be needed.
- **Strict data gate in CI on `main`:** agreed (PR 4).
- **Retention:** the period stays `TODO_VERIFY` and is listed in `docs/LEGAL-PACK.md`. The purge itself is automatic, with provisional defaults of 6 months after the last contact and 30 days after unsubscribe.
  - **Where it's set:** the two numbers live in `src/config/retention.ts` with a `provisional` flag, and env variables can override them.
  - **How it runs:** a daily Vercel Cron calls `/api/purge`, protected by a new `CRON_SECRET`. It deletes due leads (their tokens cascade) and the events linked to them by `session_id`. It also deletes old events and expired rate-limit rows. `scripts/delete-lead.ts <email>` handles a single erasure request.
  - **What the page says:** the privacy and unsubscribe pages will name both periods as provisional.
- **Meta Conversions API:** prepared but not enabled. The README will say "built, not enabled" and give the switch-on steps.
- **`EMAIL_MODE`:** I'll remind you at the end of the phase.
- **Decision audit:** it's a checklist item in the plan, covering notes 0019, 0025 and 0023.

**Three things to check**
- **"Last contact"** is my definition: the later of `created_at` and `consent_confirmed_at`, since those e-mails are the only ones we send. Say so if you want a different definition.
- **The two retention numbers:** you gave no reason beyond "for now", so I'll draft that decision note only after you give one.
- **Test cases first:** the purge is risky lead handling, so I'll write the PR 2 test cases for your approval before any implementation.

**Next step:** say "go" and I'll start PR 1, the data-field audit.

### David 14:03

Yes, proceed

### Claude 14:03

`Bash  command: git checkout -b fix/data-model-unused-fields && ls data src/server src/server/data 2>/dev/null; pnpm -s data:validate 2>&1 | head -90`

### Tool result 14:03

```
Switched to a new branch 'fix/data-model-unused-fields'
data:
README.md
brokers.json
etfs.json
rates.json
sources.json

src/server:
availability.test.ts
availability.ts
broker-pricing.test.ts
broker-pricing.ts
calculator-data.test.ts
calculator-data.ts
capi.test.ts
capi.ts
cnb.test.ts
cnb.ts
comparison.test.ts
comparison.ts
cost.test.ts
cost.ts
data
emails.test.ts
emails.ts
events.test.ts
events.ts
hero-variant.test.ts
hero-variant.ts
hero.test.ts
hero.ts
ip-hash.ts
landing-data.test.ts
landing-data.ts
lead-mail.test.ts
lead-mail.ts
lead-ports.ts
lead-submit.test.ts
leads.test.ts
leads.ts
mailer.test.ts
mailer.ts
memory-store.test.ts
memory-store.ts
pdf
pdf-model.test.ts
pdf-model.ts
rate-li [... 4054 more characters]
```

### Claude 14:03

`Bash  command: cat src/server/data/schema.ts; for f in replication distribution fundSizeEur return5yPct return10yPct dividendYieldPct withholdingRate indexName domicile custodyFeePct fxFeePct; do echo "== $f"; grep -rn "\b$f\b" src scripts e2e --include=*.ts --include=*.tsx | grep -v "\.test\.\|schema.ts" | head -8; done`

### Tool result 14:03

```
import { z } from 'zod'

import { TODO_VERIFY } from './todo'
export { TODO_VERIFY }

// Metadata fields are nullable on purpose: a missing source is reported by the
// validator as MISSING_SOURCE rather than rejected as a schema error.
const meta = z.string().nullable()

// A sourced value (SPEC §18). `value` may still be the TODO_VERIFY placeholder.
function sourced<T extends z.ZodType>(value: T) {
  return z.object({
    value: z.union([value, z.literal(TODO_VERIFY)]),
    sourceUrl: meta,
    asOf: meta,
    verifiedBy: meta,
    verifiedOn: meta,
    evidence: meta,
  })
}

export const currencySchema = z.enum(['CZK', 'EUR', 'USD'])

// A percentage is a plain number (0.07 means 0,07 %) [... 4383 more characters]
```

### Claude 14:03

`Bash  command: for f in replication distribution fundSizeEur return5yPct return10yPct dividendYieldPct withholdingRate indexName domicile custodyFeePct fxFeePct "rates"; do echo "== $f"; grep -rnw "$f" src scripts e2e data/README.md docs/DATA-NEEDS.md 2>/dev/null | grep -v "\.test\.\|schema.ts\|copy.ts" | grep -v "^docs" | head -10; done; python3 - <<'E' ⏎ import json ⏎ d=json.load(open('data/etfs.json' [... 89 more characters]`

### Tool result 14:03

```
== replication
src/server/data/needs.ts:179:  'replication',
== distribution
src/server/hero.ts:52:    const type = verified(etf.distribution)
src/server/comparison.ts:88:    const type = verified(etf.distribution)
src/server/data/gaps.ts:17:  // the values that are missing, for example "vuaa.distribution"
src/server/data/needs.ts:88:    fields: ['name', 'ter', 'distribution'],
src/server/data/needs.ts:139:    fields: ['name', 'ter', 'distribution'],
== fundSizeEur
src/server/data/needs.ts:174:  'fundSizeEur',
== return5yPct
src/server/data/needs.ts:175:  'return5yPct',
== return10yPct
src/server/data/needs.ts:176:  'return10yPct',
== dividendYieldPct
src/server/data/needs.ts:177:  'dividend [... 21079 more characters]
```

### Claude 14:03

`Bash  command: sed -n 150,200p src/server/data/needs.ts; sed -n 40,62p src/server/hero.ts; sed -n 80,98p src/server/comparison.ts; python3 -c " ⏎ import json ⏎ d=json.load(open('data/etfs.json'));print([e['id'] for e in d['etfs']]) ⏎ b=json.load(open('data/brokers.json'));print([(x['id'],list(x['availability'])) for x in b['brokers']]) ⏎ print(list(d)); print(list(b))"; grep -n "tolerat\|TODO" src/serve [... 104 more characters]`

### Tool result 14:03

```
screen: 'Comparison page',
    what: 'whether the broker has Czech support ("česky" column)',
    brokerIds: BROKERS,
    fields: ['czSupport'],
  },
  {
    kind: 'listings',
    screen: 'Comparison page',
    what: 'the listing (USD or EUR) per fund and broker that sells it, for "Za 10 let celkem"',
    fundIds: ALL_TWINS,
    brokerIds: BROKERS,
  },
  {
    kind: 'priced',
    screen: 'Comparison page',
    what: 'a price in the table "Za 10 let celkem" for every fund a broker sells',
    fundIds: ALL_TWINS,
    brokerIds: BROKERS,
  },
]

// Data that no rev. 4 screen shows. Not worth verifying now. (VTI, SCHD and VWCE
// were removed from the data with note 0036.)
export const unusedFu [... 2389 more characters]
```

### Claude 14:03

`Bash  command: python3 -c " ⏎ import json ⏎ d=json.load(open('data/etfs.json'));print([e['id'] for e in d]) ⏎ b=json.load(open('data/brokers.json'));print([(x['id'],{k:v['value'] for k,v in x['availability'].items()}) for x in b]) ⏎ print([ (x['id'], x['fxFeePct']['value'], x['custodyFeePct']['value']) for x in b]) ⏎ r=json.load(open('data/rates.json'));print(list(r) if isinstance(r,dict) else r[:1]) ⏎  [... 179 more characters]`

### Tool result 14:03

```
['voo', 'qqq', 'cspx', 'vuaa', 'cndx', 'vusa', 'eqqq']
[('degiro', {'voo': False, 'qqq': False, 'cspx': True, 'vuaa': True, 'cndx': True, 'vusa': True, 'eqqq': True}), ('fio', {'voo': 'TODO_VERIFY', 'qqq': 'TODO_VERIFY', 'cspx': True, 'vuaa': True, 'cndx': True, 'vusa': True, 'eqqq': True}), ('ibkr', {'voo': False, 'qqq': False, 'cspx': True, 'vuaa': True, 'cndx': True, 'vusa': True, 'eqqq': True}), ('trading212', {'voo': False, 'qqq': False, 'cspx': True, 'vuaa': True, 'cndx': True, 'vusa': True, 'eqqq': True}), ('xtb', {'voo': False, 'qqq': False, 'cspx': True, 'vuaa': True, 'cndx': True, 'vusa': True, 'eqqq': True})]
[('degiro', 0.25, 'TODO_VERIFY'), ('fio', 'TODO_VERIFY', 'TODO_VERIFY'), [... 831 more characters]
```

### Claude 14:03

Still auditing: so far nothing in `src` reads the dropped-candidate fields except the fallback exchange rates and the VOO/QQQ distribution. I'm checking those and the VUSA/EQQQ fields next.

### Claude 14:03

`Bash  command: cat src/app/rates.ts | sed -n 1,40p; grep -n "chooseRates" -r src --include=*.ts | head -3; grep -n "indexName\|domicile\|\.isin" src/server/landing-data.ts src/server/comparison.ts | head; grep -n "voo\|qqq\|VOO\|QQQ" src/server/hero.ts src/server/landing-data.ts src/server/comparison.ts src/server/availability.ts src/content/copy.ts | head -20; sed -n 1,30p data/README.md`

### Tool result 14:03

```
import { cacheLife } from 'next/cache'
import { chooseRates, fetchCnbRates, type ChosenRates } from '@/server/cnb'
import { bundledData } from '@/server/data/bundled'
import { ratesSchema } from '@/server/data/schema'

// The exchange rates the calculator uses: the Czech National Bank's daily file,
// fetched by the server and cached, with the verified record in data/rates.json
// as the fallback (docs/METHODOLOGY-V2.md). About two small requests a day for
// the whole site, not one per visitor.
export async function getRates(): Promise<ChosenRates> {
  'use cache'
  const fetched = await fetchCnbRates(fetch)
  // 12 hours when the bank answered; only 5 minutes when it did not, so a failed
  [... 2322 more characters]
```

### Claude 14:03

`Bash  command: grep -n "chooseRates" -B3 -A40 src/server/cnb.ts | sed -n 1,90p; cat data/rates.json | head -30; grep -rn "voo\|qqq" src/server/landing-data.ts | head; grep -rn "ORIGINALS" src/server/landing-data.ts`

### Tool result 14:03

```
99-
100-// For each currency on its own: the fetched rate if it is fresh, else the verified
101-// record from the data if it is fresh, else nothing.
102:export function chooseRates(
103-  fetched: CnbDaily | null,
104-  seed: Partial<Record<Currency, SeedRecord>> | undefined,
105-  today: string,
106-): ChosenRates {
107-  const chosen: ChosenRates = {}
108-  for (const currency of ['EUR', 'USD'] as const) {
109-    const live = fetched?.rates[currency]
110-    if (fetched && live !== undefined && ratesAreFresh(fetched.date, today)) {
111-      chosen[currency] = { rate: live, date: fetched.date, source: 'cnb' }
112-      continue
113-    }
114-    const record = seed?.[currency]
115-    if [... 1526 more characters]
```

### Claude 14:03

`Bash  command: grep -n "ratesAreFresh" -A8 src/server/cnb.ts | head -20; grep -n "function originalsFacts" -A40 src/server/hero.ts | head -60; grep -rn "availability" src --include=*.ts -l | head`

### Tool result 14:03

```
88:export function ratesAreFresh(
89-  date: string,
90-  today: string,
91-  maxDays = MAX_RATE_AGE_DAYS,
92-): boolean {
93-  const then = parseIsoDate(date)
94-  const now = parseIsoDate(today)
95-  if (then === null || now === null) return false
96-  const age = Math.round((now - then) / DAY_MS)
--
110:    if (fetched && live !== undefined && ratesAreFresh(fetched.date, today)) {
111-      chosen[currency] = { rate: live, date: fetched.date, source: 'cnb' }
112-      continue
113-    }
114-    const record = seed?.[currency]
115-    if (
116-      record &&
117-      typeof record.value === 'number' &&
118-      record.value > 0 &&
--
108:export function originalsFacts(
109-  data: Data, [... 746 more characters]
```

### Claude 14:04

`Bash  command: cat src/server/data/verified.ts; sed -n 1,140p src/server/data/validate.ts; sed -n 1,60p src/server/data/gaps.ts`

### Tool result 14:04

```
import { TODO_VERIFY } from './todo'

// A value may be shown or used only with a source and evidence (SPEC §18).
// Freshness is the data validator's job, not checked here.
export function isSet(text: string | null | undefined): boolean {
  return typeof text === 'string' && text.trim() !== '' && text !== TODO_VERIFY
}

export function hasSource(record: {
  sourceUrl: string | null
  evidence: string | null
}): boolean {
  return isSet(record.sourceUrl) && isSet(record.evidence)
}
import { dataSchema, TODO_VERIFY } from './schema'

export type Mode = 'strict' | 'draft'

export type IssueCode =
  | 'MALFORMED'
  | 'MISSING_SOURCE'
  | 'UNKNOWN_SOURCE'
  | 'TODO_VERIFY'
  | 'STALE'
  | 'FUTUR [... 5442 more characters]
```

### Claude 14:04

`Bash  command: cat src/server/data/load.ts src/server/data/bundled.ts; grep -n "BROKER_FEE_KEYS\|isFee" src/server/data/validate.ts; grep -rln "fxFeePct\|custodyFeePct\|replication\|fundSizeEur\|return5yPct\|rates.json\|bundledData.rates\|\.rates" src scripts e2e data docs/*.md | sort`

### Tool result 14:04

```
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

// Reads the raw JSON files from `data/`. Validation happens in validateData.
export async function loadData(dir = path.join(process.cwd(), 'data')) {
  const read = async (file: string): Promise<unknown> =>
    JSON.parse(await readFile(path.join(dir, file), 'utf8'))
  const [etfs, brokers, sources, rates] = await Promise.all([
    read('etfs.json'),
    read('brokers.json'),
    read('sources.json'),
    read('rates.json'),
  ])
  return { etfs, brokers, sources, rates }
}

// The fund tickers, for the copy checker (SPEC §25 rule d).
export async function loadTickers(dir?: string): Promise<str [... 1762 more characters]
```

### Claude 14:04

`Bash  command: python3 - <<'E' ⏎ import json,re ⏎ # JSON data ⏎ etfs=json.load(open('data/etfs.json')) ⏎ drop={'replication','fundSizeEur','return5yPct','return10yPct'} ⏎ for e in etfs: ⏎     for k in list(e): ⏎         if k in drop: del e[k] ⏎         elif isinstance(e[k],dict) and e[k].get('value')=='TODO_VERIFY': del e[k] ⏎ json.dump(etfs,open('data/etfs.json','w'),indent=2,ensure_ascii=False);open(' [... 456 more characters]`

### Tool result 14:04

```
Exit code 1
 data/brokers.json | 120 ++++-----------------
 data/etfs.json    | 304 ------------------------------------------------------
 2 files changed, 18 insertions(+), 406 deletions(-)
Checking formatting...
[warn] data/brokers.json
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```

### Claude 14:04

Status: data files are trimmed (unused placeholders removed, `rates.json` deleted). Now updating the schema, loader and rates code to match, then I'll run the tests.

### Claude 14:04

`Bash  command: npx prettier --write data/*.json >/dev/null && python3 - <<'E' ⏎ import re ⏎ p='src/server/data/schema.ts'; s=open(p).read() ⏎ s=s.replace("""  indexName: sourced(z.string().min(1)), ⏎   isin: sourced(isin), ⏎   domicile: sourced(z.string().min(1)), ⏎   replication: sourced(z.string().min(1)), ⏎   distribution: sourced(z.string().min(1)),""","""  isin: sourced(isin), ⏎   // Not shown by a [... 2280 more characters]`

### Tool result 14:04

```
22-export const MAX_AGE_DAYS = 120
23-export const MAX_AGE_DAYS_BROKER_FEE = 45
24:const BROKER_FEE_KEYS = new Set(['fxFeePct', 'custodyFeePct'])
25-const META_FIELDS = [
26-  'sourceUrl',
27-  'asOf',
28-  'verifiedBy',
29-  'verifiedOn',
30-  'evidence',
--
146-      } else {
147-        const limit =
148:          BROKER_FEE_KEYS.has(key) || isFee
149-            ? MAX_AGE_DAYS_BROKER_FEE
150-            : MAX_AGE_DAYS
151-        const ageDays = Math.round((todayTime! - asOfTime) / DAY_MS)
152-        if (ageDays > limit) {
153-          add(
154-            'STALE',
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
src/server/broker-pricing.test.ts( [... 3414 more characters]
```

### Claude 14:04

`Bash  command: grep -n "function verified\b" -A10 src/server/hero.ts src/server/comparison.ts; sed -n 1,20p src/server/data/needs.ts; sed -n 60,125p src/server/data/gaps.ts; grep -n "unusedFundFields\|unusedBrokerFields\|unusedFundIds" -r src scripts | grep -v "needs.ts"; sed -n 30,60p src/server/data/gaps.test.ts; sed -n 110,130p src/server/data/gaps.test.ts; sed -n 40,55p src/server/broker-pricing.tes [... 4 more characters]`

### Tool result 14:04

```
src/server/comparison.ts:66:function verified(record: Sourced): unknown {
src/server/comparison.ts-67-  return record.value !== TODO_VERIFY && hasSource(record) ? record.value : null
src/server/comparison.ts-68-}
src/server/comparison.ts-69-
src/server/comparison.ts-70-export function comparison(
src/server/comparison.ts-71-  raw: unknown,
src/server/comparison.ts-72-  rates: ChosenRates,
src/server/comparison.ts-73-  setup: { monthly: number; years: number },
src/server/comparison.ts-74-): Comparison | null {
src/server/comparison.ts-75-  const parsed = dataSchema.safeParse(raw)
src/server/comparison.ts-76-  if (!parsed.success) return null
src/server/hero.ts:38:function verified(record: So [... 6051 more characters]
```

### Claude 14:04

`Bash  command: python3 - <<'E' ⏎ import re ⏎ def sub(p,a,b,cnt=1): ⏎     s=open(p).read() ⏎     assert a in s,(p,a) ⏎     open(p,'w').write(s.replace(a,b)) ⏎ for p in ['src/server/hero.ts','src/server/comparison.ts']: ⏎     sub(p,"function verified(record: Sourced): unknown {\n  return record.value !== TODO_VERIFY && hasSource(record) ? record.value : null","function verified(record: Sourced | undefined [... 1504 more characters]`

### Tool result 14:04

```
console.log(
    `\ndata:gaps: ${verified} of ${total} values verified (a value two screens need counts twice)`,
  )
  console.log(
    `To do: ${uniqueMissing} different missing values in the data model, and ${notInModel} values the model has no place for yet (NEW).`,
  )
  const unusedFunds = unusedFundIds.length
    ? `funds ${unusedFundIds.join(', ')}; `
    : ''
  console.log(
    `Not used by any rev. 4 screen (not worth verifying now): ${unusedFunds}fund fields ${unusedFundFields.join(', ')}.`,
  )
}

main()
40:    const key = String(part)
41:    return acc ? `${acc}.${key}` : key
99:    key: string,
168:      for (const [key, child] of Object.entries(node)) {
169:        walk(child,  [... 1859 more characters]
```

### Claude 14:04

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='src/server/broker-pricing.test.ts'; s=open(p).read() ⏎ s=s.replace("    fxFeePct: todo,\n    custodyFeePct: todo,\n","");open(p,'w').write(s) ⏎ p='src/server/data/gaps.test.ts'; s=open(p).read() ⏎ for a in ["    replication: todo,\n","    fundSizeEur: todo,\n","    return5yPct: todo,\n","    return10yPct: todo,\n","    fxFeePct: todo,\n    custodyFeePct: t [... 411 more characters]`

### Tool result 14:05

```
function checkRecord(
    record: Sourced,
    path: string,
    key: string,
    isFee: boolean,
  ) {
    const isPlaceholder =
      record.value === TODO_VERIFY ||
      META_FIELDS.some((field) => record[field] === TODO_VERIFY)
    if (isPlaceholder) {
      add('TODO_VERIFY', path, 'Value is still TODO_VERIFY')
      return
    }

    for (const field of META_FIELDS) {
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
$ eslint .
```

### Claude 14:05

Typecheck and lint pass. I'll tidy the now-unused `key` parameter, then run the tests and the strict validator.

### Claude 14:05

`Bash  command: python3 - <<'E' ⏎ p='src/server/data/validate.ts'; s=open(p).read() ⏎ s=s.replace("    path: string,\n    key: string,\n    isFee: boolean,\n  ) {","    path: string,\n    isFee: boolean,\n  ) {") ⏎ s=s.replace("checkRecord(node, formatPath(path), String(path[path.length - 1]), isFee)","checkRecord(node, formatPath(path), isFee)") ⏎ open(p,'w').write(s) ⏎ E ⏎ npx prettier --write src scri [... 116 more characters]`

### Tool result 14:05

```
$ tsx scripts/validate-data.ts

data:validate (strict): 0 errors, 0 warnings
  ok   25/25 the listing (USD or EUR) per fund and broker that sells it, for "Za 10 let celkem"
  ok   25/25 a price in the table "Za 10 let celkem" for every fund a broker sells

data:gaps: 138 of 138 values verified (a value two screens need counts twice)
To do: 0 different missing values in the data model, and 0 values the model has no place for yet (NEW).
Not used by any rev. 4 screen (not worth verifying now): fund fields indexName, domicile, dividendYieldPct, withholdingRate.

+ Received:
[]

 ❯ src/server/data/validate.test.ts:188:52
    186|         data({ brokers: [broker({ fxFeePct: record(0.5, { asOf }) } [... 1249 more characters]
```

### Claude 14:05

`Bash  command: pnpm -s test 2>&1 | grep -E "FAIL|✗|×" ; sed -n 150,205p src/server/data/validate.test.ts; sed -n 295,330p src/server/data/validate.test.ts`

### Tool result 14:05

```
× checks broker fields 5ms
       × uses a 45-day limit for broker fees 8ms
     × passes draft mode but not strict mode (some values are still TODO_VERIFY) 19ms
 FAIL  |unit| src/server/data/gaps.test.ts > computeGaps > checks broker fields
 FAIL  |unit| src/server/data/validate.test.ts > validateData > stale asOf > uses a 45-day limit for broker fees
 FAIL  |unit| src/server/data/validate.test.ts > seed data files > passes draft mode but not strict mode (some values are still TODO_VERIFY)
      const result = run(
        data({
          etfs: [etf({ ter: record(0.07, { verifiedBy: 'TODO_VERIFY' }) })],
        }),
      )
      expect(result.ok).toBe(false)
      expect(result.issues).to [... 2720 more characters]
```

### Claude 14:05

`Bash  command: sed -n 106,130p src/server/data/gaps.test.ts; grep -n "function broker" -A14 src/server/data/validate.test.ts`

### Tool result 14:05

```
expect(gap.missing).toEqual(['x/g', 'y/g'])
  })

  it('checks broker fields', () => {
    const x = broker('x')
    x.czSupport = sourced(true)
    const need: Need = {
      kind: 'broker',
      screen: 'S',
      what: 'fees',
      brokerIds: ['x', 'y'],
      fields: ['czSupport'],
    }
    const [gap] = computeGaps({ etfs: [], brokers: [x, broker('y')] }, [need])
    expect(gap).toMatchObject({ total: 2, verified: 1 })
    expect(gap.missing).toEqual(['y.fxFeePct'])
  })

  it('reports a planned need as missing and not in the model', () => {
    const need: Need = {
      kind: 'planned',
      screen: 'S',
      what: 'w',
      field: 'f',
      count: 5,
48:function broker(overrid [... 410 more characters]
```

### Claude 14:05

`Bash  command: python3 - <<'E' ⏎ p='src/server/data/gaps.test.ts'; s=open(p).read() ⏎ s=s.replace("['y.fxFeePct']","['y.czSupport']");open(p,'w').write(s) ⏎ p='src/server/data/validate.test.ts'; s=open(p).read() ⏎ s=s.replace("    fxFeePct: record(0.5),\n    custodyFeePct: record(0),\n","") ⏎ s=s.replace("""        data({ brokers: [broker({ fxFeePct: record(0.5, { asOf }) })] })""","""        data({ ⏎   [... 1310 more characters]`

### Tool result 14:06

```
ok   18.29 (min 4.5)  ink on white  text in fields
ok   16.50 (min 3)  ink on paper  borders and focus ring on paper
ok   16.50 (min 3)  paper on ink  borders and focus ring on dark
ok   10.73 (min 4.5)  paper on ink-soft  primary button on hover
ok   12.34 (min 4.5)  ink on inverse-soft  primary button on hover, dark
ok    8.39 (min 4.5)  paper on inverse-border  outline button and chip on hover, dark
ok    9.11 (min 4.5)  ink-soft on border-soft  disabled button
ok    6.27 (min 4.5)  inverse-soft on inverse-border  disabled button, dark
ok    4.73 (min 4.5)  muted on highlight  table detail on highlighted row
ok    4.93 (min 4.5)  muted on row-hover  table detail on hovered row

contrast:c [... 234 more characters]
```

### Claude 14:06

`Bash  command: npx prettier --write docs/PHASE-6-PLAN.md >/dev/null; cat docs/decisions/README.md | head -40; cat docs/decisions/0065*.md; tail -30 docs/AI-LOG.md; grep -n "fxFeePct\|custodyFeePct\|rates.json\|replication" docs/DATA-NEEDS.md docs/PHASES.md README.md data/README.md | head -20`

### Tool result 14:06

````
# Decision notes

Short notes explaining why the project is built the way it is. Each milestone ends with at least one note (see "Definition of done" in `docs/SPEC.md`).

A note is for a decision that someone might reasonably ask about later: a tool choice, a data model shape, a trade-off. Typo fixes and routine code don't need one.

## Naming

`NNNN-short-title.md`, numbered in the order written, for example `0001-package-manager-pnpm.md`. Never renumber. If a decision changes, write a new note and mark the old one as superseded.

## Format

```md
# NNNN. Title

Date: YYYY-MM-DD
Status: proposed | accepted | superseded by NNNN | deprecated
Phase: 1

## Context

What problem or question came [... 7578 more characters]
````

### Claude 14:06

`Bash  command: cat > docs/decisions/0066-drop-unused-unverified-data-fields.md <<'E' ⏎ # 0066. Drop unused, unverified data fields so the strict validator can pass ⏎  ⏎ Date: 2026-10-14 ⏎ Status: accepted ⏎ Phase: 6 ⏎  ⏎ Note: the reason is David's ("yes drop, but verify if something isn't essential", 2026-10-14). The context, the per-field check and the consequences are written by the agent. ⏎  ⏎ ## Co [... 5329 more characters]`

### Tool result 14:06

```
$ vitest run --project unit --project components --passWithNoTests
      Tests  861 passed (861)
contrast:check: 34 ok, 0 failing
Checking formatting...
All matched files use Prettier code style!
 M README.md
 M data/README.md
 M data/brokers.json
 M data/etfs.json
D  data/rates.json
 M docs/AI-LOG.md
 M docs/DATA-NEEDS.md
 M docs/PHASES.md
 M scripts/data-gaps.ts
 M src/app/rates.ts
 M src/server/broker-pricing.test.ts
 M src/server/comparison.ts
 M src/server/data/bundled.ts
 M src/server/data/gaps.test.ts
 M src/server/data/load.ts
 M src/server/data/needs.ts
 M src/server/data/schema.ts
 M src/server/data/validate.test.ts
 M src/server/data/validate.ts
 M src/server/hero.ts
?? docs/PHASE [... 71 more characters]
```

### Claude 14:06

Checks are green (861 tests, strict validator passes). I'm running the Playwright suite once before committing, since the exchange-rate fallback changed.

### Claude 14:06

`Bash  command: timeout 580 pnpm -s test:e2e 2>&1 | tail -15`

### Tool result 14:06

```
(eval):1: command not found: timeout
```

### Claude 14:06

`Bash  command: pnpm -s test:e2e 2>&1 | tail -15`

### Tool result 14:07

```
at /Users/davidkrapka/dev/learning/etf-kompas/e2e/results-page.spec.ts:130:50

    Error Context: test-results/results-page-a-link-that-d-c3936-ge-out-of-search-and-caches-mobile/error-context.md

  8 failed
    [mobile] › e2e/js-budget.spec.ts:28:5 › the page code adds little on top of the framework ──────
    [mobile] › e2e/js-budget.spec.ts:44:7 › route JavaScript for / is at most 150 KB gzipped ───────
    [mobile] › e2e/js-budget.spec.ts:44:7 › route JavaScript for /?v=b is at most 150 KB gzipped ───
    [mobile] › e2e/mail-flow.spec.ts:104:7 › double opt-in for the tips › the link opened again shows the confirmed page, and the date does not move 
    [mobile] › e2e/mail-flow.spec.ts:19 [... 531 more characters]
```

### Claude 14:07

`Bash  command: grep -n "webServer" -A12 playwright.config.ts; sed -n 1,25p test-results/results-page-a-link-that-d-c3936-ge-out-of-search-and-caches-mobile/error-context.md; ls .next 2>/dev/null | head -3`

### Tool result 14:07

```
43:  webServer: {
44-    command: process.env.CI
45-      ? `pnpm build && pnpm start -p ${port}`
46-      : `pnpm dev -p ${port}`,
47-    url: `http://localhost:${port}`,
48-    reuseExistingServer: !process.env.CI,
49-    timeout: 120_000,
50-    // The lead flow runs on the in-memory store, so e2e needs no secrets and
51-    // writes to no real database (the store is refused on Vercel).
52-    env: {
53-      LEAD_STORE: 'memory',
54-      LEAD_MIN_FILL_MS: '0',
55-      // A recording mailer in sandbox mode: tests put the addresses they need on the
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of cod [... 497 more characters]
```

### Claude 14:07

Those 8 failures are dev-server artifacts (cache headers and the JS budget need a production build). Re-running as CI does, on a production build.

### Claude 14:07

`Bash  command: CI=1 pnpm -s test:e2e 2>&1 | tail -12`

### Tool result 14:08

```
Running 188 tests using 4 workers
·····································JS /: 149.97 KB (empty page 132.50 KB, ours 17.47 KB)
·······JS /?v=b: 149.97 KB (empty page 132.50 KB, ours 17.47 KB)
····JS /: 149.97 KB of 150.00 KB
···JS /?v=b: 149.97 KB of 150.00 KB
·····························
··[WebServer] Meta Conversions API answered 500.
·····················[WebServer] Meta Conversions API call failed (TimeoutError).
·························································
····························
  188 passed (30.4s)
::notice title=🎭 Playwright Run Summary::  188 passed (30.4s)
```

### Claude 14:08

All 188 pass on a production build. Committing on the branch and opening the PR.

### Claude 14:08

`Bash  command: git add -A && git status --short | head -30 && git commit -q -m "fix: drop unused unverified data fields so the strict validator passes ⏎  ⏎ Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push -q -u origin fix/data-model-unused-fields 2>&1 | tail -3; git log --oneline -1`

### Tool result 14:08

```
M  README.md
M  data/README.md
M  data/brokers.json
M  data/etfs.json
D  data/rates.json
M  docs/AI-LOG.md
M  docs/DATA-NEEDS.md
A  docs/PHASE-6-PLAN.md
M  docs/PHASES.md
A  docs/decisions/0066-drop-unused-unverified-data-fields.md
M  scripts/data-gaps.ts
M  src/app/rates.ts
M  src/server/broker-pricing.test.ts
M  src/server/comparison.ts
M  src/server/data/bundled.ts
M  src/server/data/gaps.test.ts
M  src/server/data/load.ts
M  src/server/data/needs.ts
M  src/server/data/schema.ts
M  src/server/data/validate.test.ts
M  src/server/data/validate.ts
M  src/server/hero.ts
⋯ Backing up original state…
✔ Done backing up original state (be6a6e7)!
⋯ Running tasks for staged files…
    *.{ts,tsx,js, [... 533 more characters]
```

### Claude 14:08

`Bash  command: gh pr create --title "fix: drop unused unverified data fields so the strict validator passes" --body "$(cat <<'E' ⏎ ## What ⏎ Removes the 51 \'TODO_VERIFY\' values that no screen, calculator or PDF reads, so \'pnpm data:validate\' (strict, the deploy gate) passes. Also adds \'docs/PHASE-6-PLAN.md\' and decision note 0066. ⏎  ⏎ - Removed from model and files: \'replication\', \'fundSizeEur [... 1026 more characters]`

### Tool result 14:08

```
https://github.com/Phunkhouse/etf-kompas/pull/90
```

### Claude 14:08

`mcp__ccd_pr__get_status  `

### Tool result 14:08

```
{
  "bound": false,
  "message": "No pull request is bound to this session. The app binds one when this session runs `gh pr create`, reports the PR URL in a `<pr-created>` tag, or pushes a branch that has an open PR (or gets one later); to bind an existing PR, call bind_pr with its URL.",
  "monitor": {
    "auto_archive_on_close": false
  }
}
```

### Claude 14:08

`mcp__ccd_pr__bind_pr  url: https://github.com/Phunkhouse/etf-kompas/pull/90`

### Tool result 14:08

```
Phunkhouse/etf-kompas#90 is already bound to this session.
```

### Claude 14:08

PR 1 is open: [Phunkhouse/etf-kompas#90](https://github.com/Phunkhouse/etf-kompas/pull/90). I haven't merged it, because you merge after review. I haven't read CI yet, and I haven't started PR 2.

**Result**
- **Strict validator:** `pnpm data:validate` now reports 0 errors, down from 51. The seed-data test asserts this.
- **Other checks:** `pnpm check` is green with 861 tests, `pnpm format:check` is green, and `pnpm data:gaps` still reads 138 of 138. Playwright passed 188 tests on a production build. Eight tests fail on the dev server only, and they pass on a production build.
- **Removed outright:**
  - `replication`, `fundSizeEur` and the 5- and 10-year returns
  - the version 1 broker fees `fxFeePct` and `custodyFeePct`
  - `data/rates.json`
- **Why `rates.json` went:** a stored exchange rate would be too old to use within days. If the Czech National Bank is unreachable, the calculator shows the fund fee only.
- **Kept, as optional:** `indexName`, `domicile`, `dividendYieldPct`, `withholdingRate` and `distribution`. I removed their `TODO_VERIFY` placeholders but kept the verified values, which the pre-release audit needs.
- **Fio and VOO/QQQ:** Fio's availability of VOO and QQQ is unknown, so I removed those two entries. The page still says "4 of 5 brokers". If you verify Fio, it can say "5 of 5".
- **Record:** decision note 0066, `docs/AI-LOG.md` (including my two mistakes), and the README, PHASES and DATA-NEEDS updates.

**Your call:** you said "drop", but I kept those five fields as optional instead of deleting them. If you want them gone, I'll remove them in the same PR.

**Next:** PR 2 is automatic retention plus `delete-lead`. Per your rules I'll write its test cases first and wait for your approval before implementing.

### David 14:09

resolve conflicts on #90

### Claude 14:09

`Bash  command: git fetch -q origin && git status -sb | head -3; git log --oneline HEAD..origin/main | head; gh pr view 90 --json mergeable,mergeStateStatus | cat`

### Tool result 14:09

```
## fix/data-model-unused-fields...origin/fix/data-model-unused-fields
051db3d docs: close Phase 5 (GA4 checked, Meta waits for Vercel) (#89)
{"mergeStateStatus":"DIRTY","mergeable":"CONFLICTING"}
```

### Claude 14:09

`Bash  command: git merge origin/main 2>&1 | tail -8; git diff --name-only --diff-filter=U`

### Tool result 14:09

```
Auto-merging README.md
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Auto-merging docs/PHASES.md
CONFLICT (content): Merge conflict in docs/PHASES.md
Automatic merge failed; fix conflicts and then commit the result.
docs/AI-LOG.md
docs/PHASES.md
```

### Claude 14:09

`Bash  command: grep -n "^<<<<<<<\|^=======\|^>>>>>>>" docs/AI-LOG.md docs/PHASES.md;`

### Tool result 14:09

```
docs/PHASES.md:25:<<<<<<< HEAD
docs/PHASES.md:28:=======
docs/PHASES.md:32:>>>>>>> origin/main
docs/AI-LOG.md:1218:<<<<<<< HEAD
docs/AI-LOG.md:1232:=======
docs/AI-LOG.md:1245:>>>>>>> origin/main
```

### Claude 14:09

`Bash  command: sed -n 22,34p docs/PHASES.md | cut -c1-400; sed -n 1214,1222p docs/AI-LOG.md | cut -c1-200; sed -n 1230,1236p docs/AI-LOG.md | cut -c1-200`

### Tool result 14:09

```
- **Done:** phases 0, 1, 1b, 2, 3, 4 and 5 (Phase 5: GA4 checked, Meta open, see below).
- **Phase 3 (page): done, with three honest caveats** (details in the README): the 5-second test was run with one person, not three (note 0052); the Czech copy was reviewed by David while building and gets one final check before the page goes live; the A/B test is designed, not run.
- **Phase 4 (lead flow): done, with caveats.** Stored leads (Supabase, EU), honeypot, rate limits (429), the results page behind a token, the personalised six-page PDF, the Kompas e-mail and the opt-in e-mail (Resend, test domain, sandbox rule), double opt-in by a button, unsubscribe, "send the link again". Checked: `pnpm che [... 3044 more characters]
```

### Claude 14:10

`Bash  command: python3 - <<'E' ⏎ import re ⏎ # AI-LOG: keep theirs, then ours ⏎ s=open('docs/AI-LOG.md').read() ⏎ m=re.search(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> origin/main\n",s,re.S) ⏎ ours,theirs=m.group(1),m.group(2) ⏎ s=s[:m.start()]+theirs.rstrip('\n')+"\n\n"+ours+s[m.end():] ⏎ open('docs/AI-LOG.md','w').write(s) ⏎ # PHASES: theirs, with our data sentence ⏎ s=open('docs/PHASES.md').read() ⏎ [... 749 more characters]`

### Tool result 14:10

```
docs/PHASES.md:0
docs/AI-LOG.md:0
docs/AI-LOG.md:1085:- **"138 of 138" reads like "done", and it is not.** The checker answers what the rev. 4 screens nee
docs/AI-LOG.md:1233:**Prompt (summary):** David approved the Phase 6 plan and answered "yes drop, but verify if somethin
$ vitest run --project unit --project components --passWithNoTests
      Tests  861 passed (861)
contrast:check: 34 ok, 0 failing
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 14:10

Conflicts are resolved and checks are green; committing the merge and pushing.

### Claude 14:10

`Bash  command: grep -n "TODO_VERIFY" docs/PHASES.md | cut -c1-160 | head -5; git add -A && git commit -q -m "Merge main into fix/data-model-unused-fields ⏎  ⏎ Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" 2>&1 | tail -2; git push -q 2>&1 | tail -2; sleep 3; gh pr view 90 --json mergeable,mergeStateStatus | cat`

### Tool result 14:10

```
25:- **Phase 5 (tracking and consent): done, GA4 checked with the real property, Meta waits for Vercel.** The accounts exist since 2026-10-14. The cookie bar an
40:- Validator fails the build on a missing source, a `TODO_VERIFY`, or a stale `asOf` (one unit test each)
⋯ Cleaning up temporary files…
✔ Done cleaning up temporary files!
{"mergeStateStatus":"UNKNOWN","mergeable":"UNKNOWN"}
```

### Claude 14:10

`Bash  command: sleep 8; gh pr view 90 --json mergeable,mergeStateStatus | cat; git status -sb | head -2`

### Tool result 14:10

```
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
## fix/data-model-unused-fields...origin/fix/data-model-unused-fields
```

### Claude 14:10

PR #90 no longer conflicts. GitHub now shows it as mergeable, with the merge status "blocked" only because CI and review haven't finished. I haven't looked at the CI results yet.

I merged `main` into the branch, which brought in the Phase 5 close-out (#89). It conflicted in two docs:
- **`docs/AI-LOG.md`:** I kept both entries, the "Closing Phase 5" one first and then my Phase 6 PR 1 entry.
- **`docs/PHASES.md`:** I took the new Phase 5 and Phase 6 status lines from `main`. I then re-applied my one change, that strict `data:validate` now passes (note 0066).

After the merge, `pnpm check` (861 tests) and `pnpm format:check` are green. I pushed the merge commit.

### David 14:16

#90 landed, continue

### Claude 14:16

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b feat/retention-and-delete-lead && cat src/server/lead-ports.ts; wc -l src/server/memory-store.ts src/server/supabase-store.ts src/server/rate-limits.ts; cat supabase/migrations/0003_events.sql; ls src/config; cat src/config/env.ts | head -60; cat src/app/api/event/route.ts | head -30`

### Tool result 14:16

```
// Contract for storing leads (Phase 4, PR 1). Types only: the rules live in
// `leads.ts`, the adapters (memory, Supabase) only keep and fetch. Pure: no
// imports from next or react.
export type EmailStatus = 'queued' | 'sent' | 'failed' | 'bounced'

export type LeadRecord = {
  id: string
  email: string // lowercased
  createdAt: Date
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  fbclid: string | null
  variant: 'a' | 'b'
  calcMonthly: number // whole Kč, on the slider grid (column calc_monthly_bucket)
  calcYears: number // 5, 10 or 20
  marketingConsent: boolean
  consentTextVersion: string | n [... 7516 more characters]
```

### Claude 14:16

`Bash  command: grep -rn "deletedAt\|unsubscribedAt" src --include=*.ts --include=*.tsx | grep -v "test\|lead-ports" | head -20; cat vercel.json 2>/dev/null; grep -n "purgeBefore" -r src | grep -v test | head`

### Tool result 14:16

```
(eval):1: no matches found: --include=*.ts
src/server/memory-store.ts:32:    async purgeBefore(date) {
src/server/leads.ts:309:  await deps.limiter.purgeBefore(new Date(cutoff))
src/server/supabase-store.ts:198:    async purgeBefore(cutoff) {
src/server/lead-ports.ts:85:  purgeBefore(date: Date): Promise<void>
```

### Claude 14:16

`Bash  command: grep -rn "deletedAt\|unsubscribedAt" src | grep -v "\.test\.\|lead-ports" | head -20; sed -n 295,315p src/server/leads.ts`

### Tool result 14:16

```
src/server/leads.ts:187:    unsubscribedAt: null,
src/server/leads.ts:188:    deletedAt: null,
src/server/leads.ts:202:  if (existing.deletedAt !== null) {
src/server/leads.ts:256:    const isNew = !existing || existing.deletedAt !== null
src/server/subscriptions.ts:23:  return lead && lead.deletedAt === null ? lead : null
src/server/subscriptions.ts:61:        unsubscribedAt: null,
src/server/subscriptions.ts:82:    if (lead.unsubscribedAt === null) {
src/server/subscriptions.ts:83:      await deps.store.save({ ...lead, unsubscribedAt: deps.now() })
src/server/subscriptions.ts:100:    if (lead.unsubscribedAt !== null) {
src/server/subscriptions.ts:101:      await deps.store.save({ ...lead,  [... 1027 more characters]
```

### Claude 14:16

`Bash  command: cat >> docs/PHASE-6-PLAN.md <<'E' ⏎  ⏎ ## PR 2: design and test cases (waiting for David's approval, nothing implemented) ⏎  ⏎ Rules: CLAUDE.md ("for risky logic, write the test cases first and wait for approval"). Source: the answers above, SPEC §19, 'docs/LEGAL-PACK.md' point 5. ⏎  ⏎ ### Design decisions I need confirmed ⏎  ⏎ 1. **Hard delete.** A purged lead is removed from the table ( [... 6028 more characters]`

### Tool result 14:16

```
M docs/PHASE-6-PLAN.md
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 14:16

PR 1 (#90) is merged, and I'm now on branch `feat/retention-and-delete-lead` for PR 2. I haven't written any retention code. Your rules say to wait for approval of the test cases on risky lead handling, so the cases are written into [docs/PHASE-6-PLAN.md](docs/PHASE-6-PLAN.md) under "PR 2: design and test cases", which is still uncommitted. The retention clocks, the 401/200 route behaviour and the counts-only result are all open for you to change.

**Design points to confirm**
1. **Hard delete.** A due lead is removed from the table instead of being marked `deletedAt`, because a soft-deleted row still holds the e-mail address. Its result tokens go with it. If the same address comes back later, it counts as a new lead.
2. **"Last contact".** This is the later of `createdAt` and `consentConfirmedAt`. When the opt-in e-mail was sent (`optinSentAt`) does not count.
3. **Two clocks.** A lead is due after more than 30 days unsubscribed, or more than 6 months after its last contact, whichever comes first.
4. **Events.**
   - A due lead's events are deleted by its `sessionId`.
   - Every first-party event older than 6 months is also deleted, even for visitors who never left an e-mail. This ties events to the same provisional number, so it's an assumption I'd mark `TODO_VERIFY` in the legal pack.
5. **Trigger.**
   - Vercel Cron calls `GET /api/purge` once a day.
   - The route answers 401 unless `CRON_SECRET` is configured and matches.
   - It returns counts only. No e-mail, lead id or session id is ever returned or logged.
6. **Single erasure.** `scripts/delete-lead.ts <email>` deletes one lead and its data regardless of the two clocks.
7. **No migration.** The existing foreign key already cascades the tokens.

**Test cases.** There are about 30, in these groups:
- 15 on the retention rules (the two clocks and their edges, tokens, events, rate limits, one failure not stopping the rest, no personal data in output, running twice, a returning address)
- settings
- single erasure
- the route
- the Supabase adapter
- the privacy and unsubscribe copy
- 2 Playwright flows

**Decision for you:** approve the cases, or tell me what to change, especially points 2 to 4. When you do, I'll write the tests first, show them failing, then implement.

### David 14:17

Approved

### Claude 14:17

`Bash  command: cat src/server/memory-store.ts; sed -n 1,60p src/server/supabase-store.ts; sed -n 100,234p src/server/supabase-store.ts`

### Claude 14:17

`Bash  command: sed -n 60,140p src/config/env.ts; cat src/app/lead-service.ts | head -90; sed -n 1,50p src/server/leads.ts; sed -n 1,60p src/server/memory-store.test.ts; sed -n 1,50p src/server/supabase-store.test.ts`

### Tool result 14:17

```
// An in-memory store and limiter for tests and for the e2e run (LEAD_STORE=memory).
// It forgets everything on restart and is refused on Vercel, so it cannot hold
// real leads by mistake. No imports from next or react.
import type {
  EventRecord,
  LeadRecord,
  MemoryLeadStore,
  RateLimiter,
  TokenRecord,
} from './lead-ports'

export function createMemoryLeadStore(): MemoryLeadStore {
  if (process.env.VERCEL) {
    throw new Error('The in-memory lead store is not allowed on Vercel.')
  }
  const leads = new Map<string, LeadRecord>()
  const tokens: TokenRecord[] = []
  const events: EventRecord[] = []
  const windows = new Map<
    string,
    { key: string; windowStart: Date; hits: [... 7476 more characters]
```

### Tool result 14:17

```
export function leadEnv(
  source: Record<string, string | undefined> = process.env,
): LeadEnv {
  const parsed = leadEnvSchema.safeParse({
    ...source,
    LEAD_STORE: source.LEAD_STORE || 'supabase',
  })
  if (!parsed.success) {
    const names = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')
    throw new Error(`Missing or invalid environment variables: ${names}`)
  }
  return parsed.data
}

// What the first-party events need: only the store and the hashing secret, so they
// work without the e-mail settings (SPEC §17.12).
const eventEnvSchema = z.discriminatedUnion('LEAD_STORE', [
  z.object({
    LEAD_STORE: z.literal('memory'),
    IP_HASH_SECRET [... 8394 more characters]
```

### Claude 14:18

`Bash  command: sed -n 90,170p src/app/lead-service.ts; sed -n 1,50p src/app/event-service.ts; grep -rn "purgeOldRateLimits\|RATE_LIMIT_KEEP_DAYS" src | grep -v test | head; cat src/server/rate-limits.ts | head -20; cat src/server/subscriptions.test.ts | sed -n 1,50p`

### Tool result 14:18

```
}),
      mode: env.EMAIL_MODE,
      allowlist: env.EMAIL_SANDBOX_ALLOWLIST,
      siteUrl: env.SITE_URL,
      controller: controllerLabel(),
      linkSecret: env.TOKEN_SIGNING_SECRET,
    }
  }
  deps = {
    store: adapters.store,
    limiter: adapters.limiter,
    events: adapters.events,
    capi: capiConfig(env.SITE_URL),
    afterResponse: (task) => after(task),
    now: () => new Date(),
    secrets: { ipHash: env.IP_HASH_SECRET },
    mail,
    minFillMs: env.LEAD_STORE === 'memory' ? env.LEAD_MIN_FILL_MS : undefined,
  }
  return deps
}

// The address the platform saw. Vercel puts the real client first in
// x-forwarded-for; without it (local run) every visitor is one.
export as [... 4821 more characters]
```

### Claude 14:18

`Bash  command: ls src/app/api/*/ ; ls src/app/*.test.* 2>/dev/null; sed -n 1,40p src/app/api/lead/route.ts; ls e2e; sed -n 1,50p e2e/tracking.spec.ts; cat vitest.config.mts | head -40; grep -n "expireTokens" -r e2e src/app | head`

### Tool result 14:18

```
src/app/api/event/:
route.test.ts
route.ts

src/app/api/lead/:
route.ts

src/app/api/test-capi/:
[...path]

src/app/api/test-leads/:
route.ts
(eval):1: no matches found: src/app/*.test.*
// POST /api/lead: the same lead rules as the form's server action, with real HTTP
// statuses (SPEC §22 asks for a 429 on the 6th request). Thin: parse, call, answer.
import { handleLead } from '@/app/lead-service'
import type { LeadInput } from '@/server/leads'

async function readInput(request: Request): Promise<LeadInput> {
  const type = request.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    const body: unknown = await request.json()
    return body && typeof body === ' [... 4182 more characters]
```

### Claude 14:18

`Bash  command: sed -n 1,40p src/app/api/event/route.test.ts; sed -n 25,60p src/app/api/test-leads/route.ts; sed -n 60,100p src/server/subscriptions.test.ts; grep -n "unsubscribe\|odhl" src/content/copy.ts | head; grep -n "retention\|uchov\|\[doplnit\]" -i src/content/*.ts | head`

### Tool result 14:18

```
import { beforeEach, describe, expect, it } from 'vitest'
import { POST } from './route'

// Cases R-1 and R-2 of docs/PHASE-5-PLAN.md. The route runs on the in-memory store.
beforeEach(() => {
  process.env.LEAD_STORE = 'memory'
})

const body = {
  sessionId: '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e',
  name: 'page_view',
  variant: 'a',
  device: 'phone',
  inAppBrowser: false,
  measurement: false,
}

const post = (payload: string, ip = '198.51.100.1') =>
  POST(
    new Request('http://localhost/api/event', {
      method: 'POST',
      headers: { 'x-forwarded-for': ip },
      body: payload,
    }),
  )

describe('POST /api/event', () => {
  it('R-1 answers 204 with no body for a valid ev [... 3527 more characters]
```

### Claude 14:18

`Bash  command: cat > src/config/retention.test.ts <<'E' ⏎ import { describe, expect, it } from 'vitest' ⏎ import { retentionConfig } from './retention' ⏎  ⏎ // Phase 6, PR 2: cases RC-1 to RC-3 of docs/PHASE-6-PLAN.md. Written first. ⏎ describe('retentionConfig', () => { ⏎   it('RC-1 defaults to 6 months and 30 days and says it is provisional', () => { ⏎     expect(retentionConfig({})).toEqual({ ⏎       [... 13554 more characters]`

### Tool result 14:18

```
(Bash completed with no output)
```

### Claude 14:18

Still writing the failing tests first (config and rules are done). Now the route, Supabase adapter and Playwright tests.

### Claude 14:19

`Bash  command: mkdir -p src/app/api/purge && cat > src/app/api/purge/route.test.ts <<'E' ⏎ import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest' ⏎ import { memoryLeads } from '@/app/lead-service' ⏎ import { GET, POST } from './route' ⏎  ⏎ // Phase 6, PR 2: cases PR-1 to PR-4 of docs/PHASE-6-PLAN.md. Written first. The ⏎ // route runs on the in-memory store. ⏎ const SECRET = 'a-cron-se [... 9139 more characters]`

### Tool result 14:19

```
35:  await page.getByRole('textbox', field).fill(email)
49:  await page.getByRole('textbox', field).fill(email)
64:  await page.getByRole('textbox', field).fill(email)
79:    await page.getByRole('textbox', field).fill(email)
92:  await page.getByRole('textbox', field).fill(email)
52:    env: {
53-      LEAD_STORE: 'memory',
54-      LEAD_MIN_FILL_MS: '0',
55-      // A recording mailer in sandbox mode: tests put the addresses they need on the
56-      // allowlist, and nothing leaves the machine.
57-      EMAIL_MODE: 'sandbox',
58-      // Fake tag ids, so the loaders are built into the page; the vendor scripts are
59-      // answered by stubs in e2e/ad-tags.spec.ts and nothing leaves the  [... 409 more characters]
```

### Claude 14:19

`Bash  command: sed -n 1,50p e2e/lead-flow.spec.ts; sed -n 1,30p e2e/lead-helpers.ts; sed -n 120,140p e2e/results-page.spec.ts`

### Tool result 14:19

```
import { test, expect } from '@playwright/test'
import {
  randomEmail,
  randomIp,
  storedLeads,
  type StoredLead,
} from './lead-helpers'

// Phase 4, lead storage (SPEC §22): a valid address is stored with the visitor's
// setup, the same address twice is one lead, the honeypot is silent, and the
// 6th request from one address within the hour gets a 429. The server runs on the
// in-memory store (playwright.config.ts).
const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }
const doneText = 'Hotovo. Srovnání je připravené.'

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function leadFor [... 2665 more characters]
```

### Claude 14:19

`Bash  command: sed -n 100,120p e2e/results-page.spec.ts; python3 - <<'E' ⏎ p='e2e/retention.spec.ts'; s=open(p).read() ⏎ s=s.replace("""  const field = page.getByRole('textbox', { name: /e-mail/i }) ⏎   await field.fill(address)""","""  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(address)""") ⏎ s=s.replace("""import { test, expect } from '@playwright/test' ⏎ import { randomEmail, random [... 799 more characters]`

### Tool result 14:19

```
await page.goto(path)
  await expect(page.getByText('Odkaz platí 30 dní.')).toBeVisible()
  expect(await page.content()).not.toContain(email)
})

test('is out of search engines and out of shared caches', async ({ page }) => {
  const { path } = await signUp(page.context().request)
  const response = await page.goto(path)
  const headers = response!.headers()
  expect(headers['x-robots-tag']).toContain('noindex')
  expect(headers['cache-control']).toContain('private')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
})

test.describe('a link that does not work', () => {
  const generic = async (page: import('@playwright/test').Page) => {
  [... 156 more characters]
```

### Claude 14:19

`Bash  command: grep -n "GENERIC =" e2e/results-page.spec.ts; grep -n "Otevřít přehled" e2e/*.ts | head -3`

### Tool result 14:19

```
10:const GENERIC = 'Tento odkaz už nefunguje'
e2e/retention.spec.ts:30:    .getByRole('link', { name: 'Otevřít přehled' })
```

### Claude 14:19

`Bash  command: grep -rn "přehled\|resultsPath\|srovnani" e2e/pdf.spec.ts e2e/results-page.spec.ts | head -8`

### Tool result 14:19

```
e2e/pdf.spec.ts:19:  const body = (await response.json()) as { resultsPath: string }
e2e/pdf.spec.ts:20:  return { email, path: body.resultsPath }
e2e/pdf.spec.ts:52:  expect((await request.get(`/srovnani/${'A'.repeat(43)}/pdf`)).status()).toBe(
e2e/pdf.spec.ts:55:  expect((await request.get('/srovnani/abc/pdf')).status()).toBe(404)
e2e/pdf.spec.ts:70:  await expect(link).toHaveAttribute('href', /\/srovnani\/[\w-]{43}\/pdf$/)
e2e/results-page.spec.ts:25:  const body = (await response.json()) as { resultsPath: string }
e2e/results-page.spec.ts:26:  return { email, path: body.resultsPath }
e2e/results-page.spec.ts:43:  await expect(page).toHaveURL(/\/srovnani\/[A-Za-z0-9_-]{43}$/)
```

### Claude 14:19

`Bash  command: sed -n 12,28p e2e/results-page.spec.ts`

### Tool result 14:19

```
test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function signUp(
  request: APIRequestContext,
  email = randomEmail(),
  data: Record<string, unknown> = {},
): Promise<{ email: string; path: string }> {
  const response = await request.post('/api/lead', {
    headers: { 'x-forwarded-for': randomIp() },
    data: { email, monthly: 3000, years: 10, ...data },
  })
  const body = (await response.json()) as { resultsPath: string }
  return { email, path: body.resultsPath }
}
```

### Claude 14:19

Rewriting the Playwright spec to sign up through the API like the other specs, then moving on to the implementation.

### Claude 14:19

`Bash  command: cat > e2e/retention.spec.ts <<'E' ⏎ import { test, expect, type APIRequestContext } from '@playwright/test' ⏎ import { randomEmail, randomIp, storedLeads } from './lead-helpers' ⏎  ⏎ // Phase 6, PR 2: E2E-1 and E2E-2 of docs/PHASE-6-PLAN.md. The server runs on the ⏎ // in-memory store and a test CRON_SECRET (playwright.config.ts). The test route ages a ⏎ // lead by moving its dates back;  [... 2021 more characters]`

### Tool result 14:19

```
ok
```

### Claude 14:20

`Bash  command: grep -rn "purgeBefore" src --include=*.test.ts | head; cat > src/config/retention.ts <<'E' ⏎ // How long personal data is kept (SPEC §19, docs/LEGAL-PACK.md point 5). The two ⏎ // numbers are PROVISIONAL: David chose them "for now" on 2026-10-14 and no lawyer has ⏎ // seen them. They live here and in two environment variables, so changing a period ⏎ // is a configuration change, never a c [... 8725 more characters]`

### Tool result 14:20

```
(eval):1: no matches found: --include=*.test.ts
done
```

### Claude 14:20

That change notice is just my own edit to the memory store. Continuing with the retention service, the route and the wiring.

### Claude 14:20

`Bash  command: cat > src/server/retention.ts <<'E' ⏎ // Deleting personal data when its time is up (Phase 6, PR 2; SPEC §19, ⏎ // docs/LEGAL-PACK.md point 5). The periods are provisional and come in as 'config'. ⏎ // The result and the log carry counts only: never an address, a lead id or a session id. ⏎ // No imports from next or react. ⏎ import type { RetentionConfig } from '@/config/retention' ⏎ impo [... 8250 more characters]`

### Tool result 14:20

```
const MAX_LENGTH = 254
const MAX_TRACKING_LENGTH = 200
const MIN_FILL_MS = 2000
const DAY_MS = 86_400_000

// The slider grid of the calculator (Calculator.tsx) and its horizons.
import { loadData } from '@/server/data/load'
import { validateData } from '@/server/data/validate'

async function main() {
  const mode = process.argv.includes('--draft') ? 'draft' : 'strict'
  const today = new Date().toISOString().slice(0, 10)

  const result = validateData(await loadData(), { today, mode })

  for (const issue of result.issues) {
    const label = issue.severity === 'error' ? 'ERROR' : 'warn '
    console.log(
      `${label} ${issue.code.padEnd(14)} ${issue.path}  ${issue.message}`,
    )
  }
 [... 261 more characters]
```

### Claude 14:20

`Bash  command: cat > scripts/delete-lead.ts <<'E' ⏎ // Erasure on request: deletes one lead, its result links and the events of its ⏎ // session, whatever its dates say. Run by hand against the real database: ⏎ //   pnpm lead:delete jana@example.cz ⏎ // It reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local. The automatic purge is ⏎ // /api/purge (src/server/retention.ts); this is the manual path [... 1082 more characters]`

### Tool result 14:20

```
20:    "data:gaps": "tsx scripts/data-gaps.ts",
```

### Claude 14:20

`Bash  command: sed -i '20a\    "lead:delete": "tsx --env-file=.env.local scripts/delete-lead.ts",' package.json && npx prettier --write src scripts e2e package.json vercel.json >/dev/null; pnpm -s typecheck 2>&1 | tail -15; pnpm -s lint 2>&1 | tail; pnpm -s vitest run --project unit src/server/retention.test.ts src/config/retention.test.ts src/app/api/purge src/server/supabase-store.test.ts 2>&1 | tail  [... 3 more characters]`

### Tool result 14:20

```
sed: 1: "package.json
": extra characters at the end of p command
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
src/app/api/purge/route.test.ts(3,15): error TS2305: Module '"./route"' has no exported member 'POST'.
[ELIFECYCLE] Command failed with exit code 2.
$ eslint .
       |         ^
     23|   if (!authorised(request)) {
     24|     return new Response(null, { status: 401, headers: NO_STORE })
 ❯ call src/app/api/purge/route.test.ts:17:3
 ❯ src/app/api/purge/route.test.ts:72:28

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  |unit| src/app/api/purge/route.test.ts > GET /api/purge > PR-4 sets no cookie and is never cached
Error: `connection` was calle [... 1167 more characters]
```

### Claude 14:20

`Bash  command: python3 - <<'E' ⏎ p='package.json'; s=open(p).read() ⏎ s=s.replace('    "data:gaps": "tsx scripts/data-gaps.ts",\n','    "data:gaps": "tsx scripts/data-gaps.ts",\n    "lead:delete": "tsx --env-file=.env.local scripts/delete-lead.ts",\n') ⏎ open(p,'w').write(s) ⏎ p='src/app/api/purge/route.ts'; s=open(p).read() ⏎ s=s.replace("import { connection } from 'next/server'\n","").replace("  // Re [... 605 more characters]`

### Tool result 14:21

```
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
$ eslint .

 RUN  v5.0.3 /Users/davidkrapka/dev/learning/etf-kompas

Not implemented: navigation to another Document

 Test Files  74 passed (74)
      Tests  902 passed (902)
   Start at  16:20:55
   Duration  8.71s (environment 43%, tests 32%, transform 10%, import 8%, setup 6%, worker 1%)
```

### Claude 14:21

Unit tests all pass (902). Now the page copy (privacy text and unsubscribe page) and the docs.

### Claude 14:21

`Bash  command: sed -n 160,172p src/content/copy.ts; sed -n 318,324p src/content/copy.ts; sed -n 636,665p src/content/copy.ts; grep -n "TODO_VERIFY\|\[doplnit\]" scripts/check-copy.ts | head -5; grep -rn "doplnit" src --include=*.test.tsx -l | head; sed -n 10,20p docs/LEGAL-PACK.md | cut -c1-600`

### Tool result 14:21

```
us: 'Můžu si americký fond koupit z Česka?',
    free: 'Je to zdarma?',
    email: 'Co uděláte s mým e-mailem?',
    advice: 'Radíte mi, co koupit?',
  },
  answers: {
    free: 'Ano. Srovnání je zdarma. Nedostáváme provize a nic vám neprodáváme.',
    // No retention period: it is not decided yet (SPEC §19).
    email:
      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Zatím jde o zkušební provoz: e-mail nikam neukládáme.',
    advice:
      'Ne. Ukazujeme poplatky a dostupnost. Není to investiční ani daňové poradenství. Rozhodnutí je na vás.',
    us: {
      },
      {
        id: 'jak-dlouho',
        title: 'Jak dlouh [... 5804 more characters]
```

### Claude 14:21

`Bash  command: sed -n 288,312p src/content/copy.ts; grep -rn "controller" src/app/zasady/page.tsx | head -5; grep -rn "plural\|měsíc\|dnů" src/lib src/content/copy.ts | head -8; grep -rn "unsubscribe\b" src/app/odhlasit/\[token\]/page.tsx | head -5; grep -n "legalCopy\.\|{" scripts/check-copy.ts | sed -n 1,10p`

### Tool result 14:21

```
retry: 'Zkusit znovu',
  },
}

// The privacy policy page (wireframe B, "Menu, cookies, legal, errors"). It is the
// wireframe's own text with "[doplnit]" where the text is not decided yet; it has
// not been reviewed by a qualified person (SPEC §19, note 0039). The `legal` key
// is exempt from the copy checker.
export const legalCopy = {
  privacy: {
    label: 'Právní',
    title: 'Zásady zpracování osobních údajů',
    validFrom: 'Platí od',
    contents: 'Obsah',
    sections: [
      {
        id: 'kdo-zpracovava',
        title: 'Kdo údaje zpracovává',
        text: (controller: string) =>
          `Správcem je ${controller}. Napsat nám můžete na [doplnit].`,
      },
      {
       [... 1580 more characters]
```

### Claude 14:21

`Bash  command: grep -n "function\|typeof" src/lib/copy-check.ts | head -20; cat src/app/odhlasit/\[token\]/page.tsx | sed -n 20,70p; grep -n "legalCopy" src/app/zasady/page.tsx | head; sed -n 1,30p src/app/zasady/page.tsx; grep -n "privacy\|zasady" e2e/legal-pages.spec.ts | head`

### Tool result 14:21

```
85:function wordRegExp(source: string, caseSensitive = false): RegExp {
94:function escapeRegExp(text: string): string {
111:function joinPath(base: string, key: string | number): string {
112:  if (typeof key === 'number') return `${base}[${key}]`
116:function isRow(node: object): boolean {
118:  return typeof plainName === 'string' && plainName.trim() !== ''
121:// Collects every string in the copy, including the results of functions. A
122:// function is called once with the text "x" for every parameter.
123:function collect(
131:  if (typeof node === 'string') {
135:  if (typeof node === 'function') {
139:      if (typeof result === 'string') {
146:        message: `Could not call the fu [... 2721 more characters]
```

### Claude 14:21

`Bash  command: cat src/components/PrivacyPolicy/PrivacyPolicy.tsx | sed -n 1,80p; grep -n "export const subscribeCopy" src/content/copy.ts; grep -n "retention\|jak-dlouho" -r src e2e --include=*.ts --include=*.tsx | grep -v "src/server/retention\|config/retention\|purge" | head`

### Tool result 14:21

```
import type { ReactNode } from 'react'
import { Container } from '@/components/Container'
import { Tag } from '@/components/Tag'
import { legalCopy } from '@/content/copy'
import { controllerLabel } from '@/config/site'
import { nbsp } from '@/lib/typography'
import styles from './PrivacyPolicy.module.scss'

const text = legalCopy.privacy

// Shows each "[doplnit]" in a text as a marker, so a gap is never missed.
function withGaps(value: string) {
  return value.split('[doplnit]').flatMap((part, index, parts) => {
    const pieces: ReactNode[] = [nbsp(part)]
    if (index < parts.length - 1) {
      pieces.push(
        <span key={index} data-placeholder className={styles.gap}>
          [do [... 1702 more characters]
```

### Claude 14:21

`Bash  command: grep -rn "nikam neukládáme" src e2e docs README.md | cut -c1-140`

### Tool result 14:21

```
src/content/copy.ts:169:      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odka
src/components/Faq/Faq.test.tsx:58:      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mail
```

### Claude 14:21

`Bash  command: sed -n 52,62p src/components/Faq/Faq.test.tsx | cut -c1-200; python3 - <<'E' ⏎ p='src/content/copy.ts'; s=open(p).read() ⏎ s=s.replace("""    // No retention period: it is not decided yet (SPEC §19). ⏎     email: ⏎       'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Zatím jde o zkušební provoz: e-mail nikam neukládáme.', [... 2008 more characters]`

### Tool result 14:21

```
})

  it('answers the e-mail question without a retention period, and says it is a trial', () => {
    const { container } = render(<Faq facts={facts()} />)
    const text = answers(container)[2]
    expect(text).toContain(
      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Zatím jde o zkušební provoz: e-mail nikam neukládáme.',
    )
    expect(text).not.toMatch(/\d/)
  })

// All user-facing Czech text (SPEC §25, decision note 0002). The calculator
// strings are the wireframe's working copy (decision note 0017). Typography
// (non-breaking spaces) is applied at render time with nbsp(); a one-letter word
// at the very e [... 368 more characters]
```

### Claude 14:21

Copy edits are in; wiring them into the page, the FAQ test and a copy test now.

### Claude 14:21

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:50]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('src/content/copy.ts',"// All user-facing Czech text","import type { RetentionConfig } from '@/config/retention'\n\n// All user-facing Czech text") ⏎ sub('src/components/Faq/Faq.test.tsx',"""  it('answers the e-mail question without a retention period, and says it  [... 3663 more characters]`

### Tool result 14:22

```
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
     × 4: how long, with the number of months left as a gap 10ms
     × has no number of months, no date and no figure of its own 2ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  |components| src/components/PrivacyPolicy/PrivacyPolicy.test.tsx > PrivacyPolicy: the wording is the drawing's own > 4: how long, with the number of months left as a gap
 FAIL  |components| src/components/PrivacyPolicy/PrivacyPolicy.test.tsx > PrivacyPolicy: nothing is invented > has no number of months, no date and no figure of its own
      Tests  2 failed | 906 passed (908)
```

### Claude 14:22

`Bash  command: grep -n "how long\|no number of months" -B2 -A22 src/components/PrivacyPolicy/PrivacyPolicy.test.tsx | sed -n 1,80p`

### Tool result 14:22

```
84-  })
85-
86:  it('4: how long, with the number of months left as a gap', () => {
87-    const { container } = render(<PrivacyPolicy />)
88-    expect(text(container, 'jak-dlouho')).toContain(
89-      'E-mail uchováváme do odhlášení, nejdéle [doplnit] měsíců. Souhlas můžete kdykoli odvolat, odkaz je v každém e-mailu.',
90-    )
91-  })
92-
93-  it('5: who gets it, with each processor left as a gap', () => {
94-    const { container } = render(<PrivacyPolicy />)
95-    expect(text(container, 'komu-predavame')).toContain(
96-      'Zpracovatelům, které potřebujeme: služba pro rozesílání e-mailů [doplnit], hosting [doplnit], měření návštěvnosti [doplnit]. Každý z nich má smlouvu o zpracování [... 796 more characters]
```

### Claude 14:22

`Bash  command: python3 - <<'E' ⏎ p='src/components/PrivacyPolicy/PrivacyPolicy.test.tsx'; s=open(p).read() ⏎ s=s.replace("""  it('4: how long, with the number of months left as a gap', () => { ⏎     const { container } = render(<PrivacyPolicy />) ⏎     expect(text(container, 'jak-dlouho')).toContain( ⏎       'E-mail uchováváme do odhlášení, nejdéle [doplnit] měsíců. Souhlas můžete kdykoli odvolat, odkaz [... 1350 more characters]`

### Tool result 14:22

```
Tests  908 passed (908)
contrast:check: 34 ok, 0 failing
copy:check: 0 problem(s)
Checking formatting...
All matched files use Prettier code style!
```

### Claude 14:22

Unit and lint checks are green. Now the Playwright run on a production build, since this touches the privacy and unsubscribe pages and adds a route.

### Claude 14:22

`Bash  command: CI=1 pnpm -s test:e2e 2>&1 | tail -25`

### Tool result 14:23

```
$ playwright test
[WebServer] $ next build
[WebServer] $ next start -p 3000

Running 190 tests using 4 workers
······································JS /: 149.97 KB (empty page 132.50 KB, ours 17.47 KB)
·······JS /?v=b: 149.97 KB (empty page 132.50 KB, ours 17.47 KB)
···JS /: 149.97 KB of 150.00 KB
···JS /?v=b: 149.97 KB of 150.00 KB
·····························
·[WebServer] Meta Conversions API answered 500.
························[WebServer] Meta Conversions API call failed (TimeoutError).
·······················································
······························
  190 passed (30.0s)
::notice title=🎭 Playwright Run Summary::  190 passed (30.0s)
```

### Claude 14:23

190 Playwright tests pass (2 new). Now the docs: legal pack, README gap, decision note, AI-LOG.

### Claude 14:23

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/LEGAL-PACK.md'; s=open(p).read() ⏎ old=re.search(r"\| 5   \| Retention period.*?\| Phase 4 \|\n",s,re.S).group(0) ⏎ new="| 5   | Retention: **provisional**, not legally decided. Leads are deleted automatically 6 months after the last contact (the later of the sign-up and the confirmation of the tips) and 30 days after unsubscribe; first-party events o [... 6601 more characters]`

### Tool result 14:23

```
Tests  908 passed (908)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
c5b9b6d feat: delete personal data automatically, with provisional periods
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 14:23

`Bash  command: gh pr create --title "feat: delete personal data automatically, with provisional periods" --body "$(cat <<'E' ⏎ ## What ⏎ Automatic retention (PR 2 of \'docs/PHASE-6-PLAN.md\', design and test cases approved by David 2026-10-14). ⏎  ⏎ - Leads are deleted for good 6 months after the last contact or 30 days after unsubscribe (whichever first); their result links and session events go with t [... 1080 more characters]`

### Tool result 14:24

```
https://github.com/Phunkhouse/etf-kompas/pull/91
```

### Claude 14:24

PR 2 is open as [#91](https://github.com/Phunkhouse/etf-kompas/pull/91). Not merged: that's yours. I haven't read its CI yet.

I wrote the tests first and saw them fail on the missing modules. After the implementation, `pnpm check` passes with 908 tests, `pnpm format:check` is clean, and Playwright passes 190 tests on a production build. I haven't run any of it against the real Supabase or Vercel Cron, and the PR says so.

**What it does**
- **Retention:** a lead is deleted for good 6 months after its last contact, or 30 days after unsubscribe, whichever comes first. Its result links go with it, and so do the events of its session. Events older than 6 months and rate-limit counters older than 2 days are also deleted.
- **Trigger:** `GET /api/purge` is called daily by Vercel Cron (`vercel.json`). It answers 401 unless `CRON_SECRET` matches, and returns counts only.
- **Single erasure:** `pnpm lead:delete <e-mail>` deletes one person by hand.
- **Settings:** the periods live in `src/config/retention.ts` and can be overridden by `RETENTION_LEAD_MONTHS` and `RETENTION_UNSUBSCRIBED_DAYS`. The privacy and unsubscribe pages name them and say they're provisional.
- **Records:** legal pack point 5, decision note 0067 and `docs/AI-LOG.md` are updated.

**One mistake I found along the way.** The FAQ said "e-mail nikam neukládáme", meaning the e-mail isn't stored anywhere. That has been untrue since Phase 4. I replaced it with a line that points to the policy and added a test. It's in this PR, and you may want to look at that wording.

**Before the first deploy, you need to:**
- Add `CRON_SECRET` to Vercel (`openssl rand -base64 32`).
- Check that the first cron run deletes nothing it shouldn't. I'd run `/api/purge` once by hand and read the counts.

I haven't started PR 3 (the noindex header, share image and metadata). Say "continue" when #91 is merged.

### David 14:26

I see the vercel cron. Remind me when we will be in Vercel step

### Claude 14:26

`Bash  command: cd /Users/davidkrapka/.claude/projects/-Users-davidkrapka-dev-learning-etf-kompas/memory && cat > vercel-step-reminders.md <<'E' ⏎ --- ⏎ name: vercel-step-reminders ⏎ description: What to remind David of when the Vercel deploy step of Phase 6 starts (cron secret, env vars, cron check, EMAIL_MODE) ⏎ metadata: ⏎   type: project ⏎ --- ⏎  ⏎ When the Vercel step of Phase 6 starts (project crea [... 1594 more characters]`

### Tool result 14:26

```
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 14:26

I'll remind you as soon as you mention Vercel or deploy, or when PR 5 (deploy notes) starts. I saved the reminder, so it survives between sessions.

What I'll raise at that point:
1. **`CRON_SECRET`:** add it to Vercel's env. Without it `/api/purge` answers 401 and nothing is deleted. After the first deploy, call `/api/purge` once by hand with the Bearer secret and read the counts before trusting the daily cron. Also check that the cron shows up in Vercel's Cron Jobs settings.
2. **Env vars:** the full list from `.env.example`, with new `IP_HASH_SECRET` and `TOKEN_SIGNING_SECRET` values, and no `LEAD_STORE=memory`.
3. **Meta Conversions API:** the token and Graph version are still missing. Meta Test Events also wait for the live address.
4. **`EMAIL_MODE`:** you asked to decide this at the end of the phase.

I haven't started PR 3. Tell me when #91 is merged and I'll continue.

### David 14:29

#91 done

### Claude 14:29

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b feat/noindex-share-image-metadata && cat src/app/layout.tsx; ls public/brand; cat src/app/icon.svg | head -5; grep -n "share\|OG\|og:\|favicon" docs/design/wireframe-b.md | head -20; ls node_modules/next/dist/docs/ | head;`

### Tool result 14:29

```
import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { CookieConsent } from '@/components/CookieConsent'
import './reset.css'
import './variables.scss'
import './globals.css'

// Czech needs the latin-ext subset (ě š č ř ž ý á í é ů ú ň ť ď).
const plexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-plex-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: '500',
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ETF Kompas',
  description: 'Srovnání ETF s poplatky v korunách.',
  robots: { index: false,  [... 9493 more characters]
```

### Claude 14:29

`Bash  command: sed -n 128,150p docs/design/wireframe-b.md | cut -c1-500; ls docs/design/images | grep -i "share\|favicon"; ls node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/ | head -20`

### Tool result 14:29

```
- **Send failed:** banner above the form: "Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli." The e-mail and the calculator setup stay filled, the button reads "Zkusit znovu". There is no consent error, because the checkbox is optional.

## PDF, favicon, sharing

- **PDF on A4:** white paper, ink only. Wordmark and the visitor's setup in the header. Page 1 is the comparison table fund x broker with the same `[ověřit]` rule and the illustrative line. Page 4 is the tax page and says nothing that is not from a verified source. Footer: not advice, verified month, controller, page x / 6. Pages 2, 3, 5 and 6 are not drawn; they were proposed and approved in chat on 2026-10-14 and are built  [... 1825 more characters]
```

### Claude 14:30

`Read  file_path: /Users/davidkrapka/dev/learning/etf-kompas/docs/design/images/share-image.png`

### Tool result 14:30

```
[image]
```

### David 14:30

[Image: original 2400x1260, displayed at 2000x1050. Multiply coordinates by 1.20 to map to original image.]

### Claude 14:30

`Bash  command: file docs/design/images/favicon.png docs/design/images/share-image.png; ls src/app/*.png src/app/icon* 2>/dev/null; sed -n 1,60p node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md | cut -c1-200; grep -n "metadataBase" -r node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md | head -3; grep -n "title\|descr [... 63 more characters]`

### Tool result 14:30

```
docs/design/images/favicon.png:     PNG image data, 1280 x 720, 8-bit colormap, non-interlaced
docs/design/images/share-image.png: PNG image data, 2400 x 1260, 8-bit colormap, non-interlaced
(eval):1: no matches found: src/app/*.png
---
title: opengraph-image and twitter-image
description: API Reference for the Open Graph Image and Twitter Image file conventions.
---

The `opengraph-image` and `twitter-image` file conventions allow you to set Open Graph and Twitter images for a route segment.

They are useful for setting the images that appear on social networks and messaging apps when a user shares a link to your site.

There are two ways to set Open Graph and Twitter images:

- [Using imag [... 2702 more characters]
```

### Claude 14:30

`Bash  command: python3 - <<'E' ⏎ p='src/content/copy.ts'; s=open(p).read() ⏎ s=s.replace("// Page frame: source bar","""// The text of the page's <head> and of the link preview (wireframe B, "PDF, favicon, ⏎ // sharing": "to confirm" by David). Shown by search results, chats and social feeds. ⏎ export const siteCopy = { ⏎   name: 'ETF Kompas', ⏎   title: 'ETF Kompas: americké indexy z Česka, u koho je k [... 394 more characters]`

### Tool result 14:30

```
$ tsx scripts/check-copy.ts

copy:check: 0 problem(s)
```

### Claude 14:30

`Bash  command: file public/brand/*.png; ls src/server/pdf/fonts; python3 -c "import PIL;print(PIL.__version__)" 2>&1; head -c 600 public/brand/favicon.svg; echo; ls docs/design | head -20`

### Tool result 14:30

```
public/brand/logo-600w.png:      PNG image data, 600 x 153, 8-bit/color RGBA, non-interlaced
public/brand/logo-dark-600w.png: PNG image data, 600 x 153, 8-bit/color RGBA, non-interlaced
IBMPlexMono-Medium.woff
IBMPlexSans-Bold.woff
IBMPlexSans-Medium.woff
IBMPlexSans-Regular.woff
LICENSE-IBM-Plex.txt
Traceback (most recent call last):
  File "<string>", line 1, in <module>
    import PIL;print(PIL.__version__)
    ^^^^^^^^^^
ModuleNotFoundError: No module named 'PIL'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.0 48.0" width="48" height="48" role="img" aria-label="ETF Kompas" xmlns:c2pa="http://c2pa.org/manifest"><metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3E [... 431 more characters]
```

### Claude 14:30

Writing the Playwright test for the head first (noindex header, link preview tags, image and icons), then the implementation.

### Claude 14:30

`Bash  command: cat > e2e/head.spec.ts <<'E' ⏎ import { test, expect } from '@playwright/test' ⏎  ⏎ // Phase 6, PR 3: the site is out of search engines by header AND by tag (SPEC §17.7, §19.5, ⏎ // §22 Phase 6), and a shared link shows the title, the description and the share image. ⏎ // Written first. 'curl -I' on the live site repeats the header check after the deploy. ⏎ const PAGES = ['/', '/?v=b', '/ [... 3916 more characters]`

### Tool result 14:30

```
ok
```

### Claude 14:31

`Bash  command: SP=/private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad && mkdir -p $SP && cat > $SP/render.cjs <<'E' ⏎ const { createRequire } = require('node:module') ⏎ const root = '/Users/davidkrapka/dev/learning/etf-kompas' ⏎ const { chromium } = createRequire(root + '/package.json')('@playwright/test') ⏎ const fonts = root + '/src/server [... 2808 more characters]`

### Tool result 14:31

```
public/share-image.png: PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced
src/app/apple-icon.png: PNG image data, 180 x 180, 8-bit/color RGB, non-interlaced
src/app/icon1.png:      PNG image data, 32 x 32, 8-bit/color RGB, non-interlaced
-rw-r--r--@ 1 davidkrapka  staff  52049 Oct 14 16:31 public/share-image.png
```

### Claude 14:31

`Read  file_path: /Users/davidkrapka/dev/learning/etf-kompas/public/share-image.png`

### Tool result 14:31

```
[image]
```

### Claude 14:31

Fonts and the logo didn't load from `setContent` (blocked file access). Rendering from a real file instead.

### Claude 14:31

`Bash  command: SP=/private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad && python3 - <<E ⏎ p='$SP/render.cjs'; s=open(p).read() ⏎ s=s.replace("await page.setContent(html, { waitUntil: 'load' })","const file = out + '.html'.replace(/^/, '') ; const tmp = '$SP/' + require('node:path').basename(out) + '.html'; require('node:fs').writeFileSync(tmp [... 123 more characters]`

### Tool result 14:31

```
public/share-image.png: PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced
```

### Claude 14:31

`Read  file_path: /Users/davidkrapka/dev/learning/etf-kompas/public/share-image.png`

### Tool result 14:31

```
[image]
```

### Claude 14:31

The image reads well and doesn't overlap. One fix: the one-letter "u" ends a line, which breaks the Czech typography rule, so I'm adding non-breaking spaces. Then the layout and header wiring.

### Claude 14:31

`Bash  command: SP=/private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad && python3 - <<E ⏎ p='$SP/render.cjs'; s=open(p).read() ⏎ s=s.replace("<h1>Americké indexy z Česka: u koho je koupíte a za kolik?</h1>","<h1>Americké indexy z Česka: u koho je koupíte a za kolik?</h1>") ⏎ open(p,'w').write(s) ⏎ E ⏎ node $SP/render.cjs && python3 - <<'E' ⏎  [... 2290 more characters]`

### Tool result 14:31

```
src/app/zasady/page.tsx:8:  title: `${legalCopy.privacy.title} · ETF Kompas`,
src/app/styleguide/page.tsx:9:  title: 'Styleguide · ETF Kompas',
```

### Claude 14:31

`Bash  command: pnpm -s typecheck 2>&1 | tail -3; pnpm -s lint | tail -3; CI=1 pnpm -s exec playwright test e2e/head.spec.ts 2>&1 | tail -30`

### Tool result 14:31

```
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
$ eslint .
        2) <meta name="robots" content="noindex, nofollow"/> aka locator('meta[name="robots"]').nth(1)

    Call log:
      - Expect "toHaveAttribute" locator('meta[name="robots"]') with timeout 5000ms
      - waiting for locator('meta[name="robots"]')


      13 |       const response = await page.goto(path)
      14 |       expect(response!.headers()['x-robots-tag']).toContain('noindex')
    > 15 |       await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
         |                                                         ^
      16 |         'content',
      17 |         /noind [... 1013 more characters]
```

### Claude 14:31

`Bash  command: python3 - <<'E' ⏎ p='e2e/head.spec.ts'; s=open(p).read() ⏎ s=s.replace("""      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(""","""      // the 404 page has two (Next adds its own), so look at the first ⏎       await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(""") ⏎ open(p,'w').write(s) ⏎ E ⏎ npx prettier --write e2e >/dev/null; pnpm -s check [... 115 more characters]`

### Tool result 14:32

```
Tests  908 passed (908)
contrast:check: 34 ok, 0 failing
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
····JS /?v=b: 149.97 KB of 150.00 KB
·················
··············[WebServer] Meta Conversions API answered 500.
·····················[WebServer] Meta Conversions API call failed (TimeoutError).
·············································
··········································
  202 passed (28.7s)
::notice title=🎭 Playwright Run Summary::  202 passed (28.7s)
```

### Claude 14:32

`Bash  command: (LEAD_STORE=memory pnpm -s start -p 3111 >/dev/null 2>&1 &) ; sleep 5; curl -sI http://localhost:3111/ | grep -i "x-robots\|HTTP"; curl -sI http://localhost:3111/srovnani/abc | grep -i "x-robots\|cache-control"; curl -s http://localhost:3111/ | grep -o '<meta property="og:[a-z:]*" content="[^"]*"' | head -8; pkill -f "next start -p 3111"; pkill -f "next-server" ; true`

### Tool result 14:32

```
HTTP/1.1 200 OK
X-Robots-Tag: noindex, nofollow
Cache-Control: private, no-store
<meta property="og:title" content="ETF Kompas: americké indexy z Česka, u koho je koupíte"
<meta property="og:description" content="Srovnání evropských ETF na S&amp;P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce."
<meta property="og:locale" content="cs_CZ"
<meta property="og:image" content="http://localhost:3000/share-image.png"
<meta property="og:image:width" content="1200"
<meta property="og:image:height" content="630"
<meta property="og:image:alt" content="ETF Kompas. Americké indexy z Česka: u koho je koupíte a za kolik? Poplatky fondů a brokerů v korunách. Na jedné strán [... 47 more characters]
```

### Claude 14:32

`Bash  command: (LEAD_STORE=memory pnpm -s start -p 3112 >/dev/null 2>&1 &) ; sleep 5; echo "--- /"; curl -sI http://localhost:3112/ | grep -i "x-robots"; echo "--- /srovnani/abc"; curl -sI http://localhost:3112/srovnani/abc | grep -i "x-robots\|cache-control"; echo "--- GET"; curl -s -D - -o /dev/null http://localhost:3112/srovnani/abc | grep -i "x-robots"; pkill -f "next start -p 3112"; pkill -f next-s [... 11 more characters]`

### Tool result 14:32

```
--- /
X-Robots-Tag: noindex, nofollow
--- /srovnani/abc
X-Robots-Tag: noindex, nofollow
Cache-Control: private, no-store
--- GET
X-Robots-Tag: noindex, nofollow
```

### Claude 14:33

`Bash  command: cat >> docs/AI-LOG.md <<'E' ⏎  ⏎ ### Phase 6, PR 3: noindex everywhere, share image, head ⏎  ⏎ **Prompt (summary):** David: "#91 done" (continue with the plan: the noindex header, the share image and the metadata). ⏎  ⏎ **Produced:** 'e2e/head.spec.ts' first; the site-wide 'X-Robots-Tag: noindex, nofollow' in 'next.config.ts' (every path, files and API too; the results pages keep their ow [... 3902 more characters]`

### Tool result 14:33

```
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/92
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 14:33

PR 3 is open as [#92](https://github.com/Phunkhouse/etf-kompas/pull/92), and it's waiting for your review. `pnpm check` (908 tests), `pnpm format:check` and 202 Playwright tests on a production build all pass. A local `curl -I` shows one `X-Robots-Tag: noindex, nofollow` on `/` and on `/srovnani/...`. I haven't read the CI results for #92 yet.

**What it does**
- **noindex:** the header is on every path, including files and the API. The `robots` tag stays, and the results pages keep their private cache header. I added no `robots.txt` block, because a crawler that can't fetch a page never sees the noindex.
- **Link preview:** title and description come from the wireframe text, which marks them "to confirm", and `copy:check` passes. The image address is built from `SITE_URL`. Open Graph tags (locale `cs_CZ`) and the Twitter card are set.
- **Assets:** `public/share-image.png` (1200 × 630), `src/app/apple-icon.png` (180) and `src/app/icon1.png` (32).

**What I need from you**
1. **Look at the share image.** The drawn one has the compass tile covering the end of the headline ("je"), so I didn't copy it. This is a recreation with the same layout and no overlap, in IBM Plex Sans. It's a new design asset you haven't seen yet.
2. **Confirm the title and description.** The title is "ETF Kompas: americké indexy z Česka, u koho je koupíte".
3. **Vercel step (the reminder you asked for):** set `SITE_URL` in Vercel's **build** environment. Otherwise the share image address says `localhost`. I'll bring it up again with the cron secret.

**Not verified:** the preview in Messenger and Instagram, and `curl -I` on the real `*.vercel.app` address. Both need the deploy.

**Decision note to suggest:** recreating the share image instead of using the drawn one. I haven't drafted it, because you haven't given your reason. Tell me the reason if you want it recorded.

**Next:** PR 4 puts the strict data validator into CI on `main`. Say "continue" when #92 is merged.

### David 14:38

#92 merged

### Claude 14:38

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b ci/strict-data-gate && sed -n 40,80p .github/workflows/ci.yml; ls .github; grep -n "data:validate" -r package.json docs/*.md README.md CLAUDE.md | cut -c1-140 | head`

### Tool result 14:38

```
workflows
package.json:18:    "data:validate": "tsx scripts/validate-data.ts",
package.json:19:    "data:validate:draft": "tsx scripts/validate-data.ts --draft",
docs/AI-LOG.md:13:- PR 2: Zod data schema, framework-free `validateData`, 26 tests written first and approved before implementation, seed da
docs/AI-LOG.md:140:- **Produced:** records for VOO, QQQ, CSPX, VUAA and CNDX (name, index, ISIN, domicile, TER, dividend yield, withholding 
docs/AI-LOG.md:975:- **`pnpm data:validate` (strict) fails with 56 `TODO_VERIFY` values.** It is the Phase 6 deploy gate and was always mean
docs/AI-LOG.md:1050:**Produced:** 21 listing records in `data/brokers.json` (DEGIRO 7, Fio 4, Trading 212 5, XTB 5; [... 588 more characters]
```

### Claude 14:38

`Bash  command: cat > src/config/deploy-gate.test.ts <<'E' ⏎ import { readFileSync } from 'node:fs' ⏎ import path from 'node:path' ⏎ import { describe, expect, it } from 'vitest' ⏎  ⏎ // Phase 6, PR 4: the strict data check (no TODO_VERIFY, every value sourced and fresh) is ⏎ // the deploy gate of SPEC §19.5 and §22. Written first. These tests only keep the two ⏎ // places that enforce it from being remo [... 2107 more characters]`

### Tool result 14:38

```
× G-1 Vercel builds only after the strict data check passes 2ms
     × G-2 the strict check is not the draft one 1ms
     × G-3 CI runs the strict check as its own job on every push to main 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯
      Tests  3 failed | 2 passed (5)
```

### Claude 14:38

The new tests fail as expected (G-4 and G-5 already hold). Implementing the gate.

### Claude 14:38

`Bash  command: python3 - <<'E' ⏎ import json ⏎ p='vercel.json'; c=json.load(open(p)) ⏎ c={"buildCommand":"pnpm data:validate && pnpm build", **c} ⏎ json.dump(c,open(p,'w'),indent=2); open(p,'a').write('\n') ⏎ p='.github/workflows/ci.yml'; s=open(p).read().rstrip('\n') ⏎ s+=""" ⏎  ⏎   # The deploy gate (SPEC §19.5): the strict data check, no TODO_VERIFY, every value ⏎   # sourced and fresh. Only on main, [... 986 more characters]`

### Tool result 14:39

```
{
  "buildCommand": "pnpm data:validate && pnpm build",
  "crons": [
    {
      "path": "/api/purge",
      "schedule": "17 3 * * *"
    }
  ]
}
      Tests  5 passed (5)
      Tests  913 passed (913)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
15:      - uses: pnpm/setup@f618924e009e490c5badb81bc821e794d0ced591 # v3.1.0
33:      - uses: pnpm/setup@f618924e009e490c5badb81bc821e794d0ced591 # v3.1.0
51:      - uses: pnpm/setup@f618924e009e490c5badb81bc821e794d0ced591 # v3.1.0
```

### Claude 14:39

`Bash  command: cat > /tmp/stale-check.ts <<'E' ⏎ import { loadData } from '@/server/data/load' ⏎ import { validateData } from '@/server/data/validate' ⏎ async function main() { ⏎   const data = await loadData() ⏎   const start = Date.parse('2026-10-14T00:00:00Z') ⏎   const seen = new Set<string>() ⏎   for (let d = 0; d < 200; d++) { ⏎     const today = new Date(start + d * 86_400_000).toISOString().slic [... 418 more characters]`

### Tool result 14:39

```
2026-10-25 etfs[6].name.asOf
2026-10-25 etfs[6].isin.asOf
2026-10-25 etfs[6].distribution.asOf
2026-10-25 etfs[6].ter.asOf
2026-10-29 etfs[0].name.asOf
2026-10-29 etfs[0].isin.asOf
2026-10-29 etfs[0].indexName.asOf
2026-10-29 etfs[0].ter.asOf
2026-11-15 brokers[4].fees.fx.EUR.asOf
2026-11-15 brokers[4].fees.fx.USD.asOf
2026-11-15 brokers[4].fees.purchase[0].asOf
2026-11-15 brokers[4].fees.custody.asOf
 M .github/workflows/ci.yml
 M vercel.json
?? src/config/deploy-gate.test.ts
```

### Claude 14:39

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:40]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('CLAUDE.md',"pnpm data:validate       # strict: fails on TODO_VERIFY, missing source, stale data (the deploy gate, Phase 6)","pnpm data:validate       # strict: fails on TODO_VERIFY, missing source, stale data (the deploy gate: CI on main and the Vercel build)") ⏎  [... 3722 more characters]`

### Tool result 14:39

```
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/93
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 14:39

PR 4 is open as [#93](https://github.com/Phunkhouse/etf-kompas/pull/93). `pnpm check` (913 tests) and `pnpm format:check` pass. The new CI job and the Vercel build command haven't run yet, because there's no Vercel project and the job only runs on a push to `main`.

**What changed**
- **Vercel build:** `vercel.json` now builds with `pnpm data:validate && pnpm build`, so a deploy with a placeholder, an unsourced value or a stale record won't build. The daily purge cron is still there.
- **CI:** a `data-gate` job runs the strict check on every push to `main`. Pull requests keep the draft check, so you can still review data work in progress.
- **Guard test:** `src/config/deploy-gate.test.ts` was written first. Three of its five cases failed before the change, and it keeps both gates from being removed by accident.
- **Docs:** `CLAUDE.md` and the README are updated.

**The gate fails on stale data, not only on missing data.** I ran the validator for each day ahead. The first failures:
- **2026-10-25:** the EQQQ KIID goes stale.
- **2026-10-29:** the VOO factsheet.
- **2026-11-15:** the XTB fees.

The live site stays up, because Vercel builds only on a push. The next push to `main` after the first of those dates fails until the data is refreshed. That's also why the monthly "refresh data" action matters, which I'll raise again in the Vercel step.

**Correction:** my earlier notes said the first stale date was 24 Oct (from `PHASES.md`). The actual run says 25 Oct, so I used that.

Say "continue" when #93 is merged. PR 5 is the deploy notes and env table, and that's where the Vercel reminders come in.

### David 14:44

#93 merged

### Claude 14:45

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b docs/deploy-notes && grep -rhoE "process\.env\.[A-Z0-9_]+|\b[A-Z][A-Z0-9]+_[A-Z0-9_]+: (blank|z\.)" src scripts --include=*.ts --include=*.tsx 2>/dev/null | sort -u | head -50; grep -rhoE "source\.[A-Z0-9_]+|'[A-Z][A-Z0-9_]{5,}'" src/config/env.ts | sort -u; ls docs; sed -n 60,69p README.md; sed -n 50,58p README.md | cut -c1-200`

### Tool result 14:45

````
(eval):1: no matches found: --include=*.ts
'GA4_MEASUREMENT_ID'
'LEAD_STORE'
'META_CAPI_TOKEN'
'META_GRAPH_VERSION'
'META_PIXEL_ID'
source.LEAD_STORE
source.META_CAPI_TOKEN
source.META_GRAPH_BASE
source.META_GRAPH_VERSION
AI-LOG.md
DATA-NEEDS.md
LEGAL-PACK.md
METHODOLOGY-V2.md
METHODOLOGY.md
PHASE-4-PLAN.md
PHASE-5-PLAN.md
PHASE-6-PLAN.md
PHASES.md
SPEC.md
decisions
design
starter-guide.md
Next.js (App Router, TypeScript strict), SCSS Modules, pnpm, Node 24. Deploy target: Vercel.

## Develop

```bash
corepack enable
pnpm install
pnpm dev
```

- **The PDF** reads its fonts (IBM Plex, SIL OFL) and the logo from disk; this works on `next start` and is **not verified on Vercel**. `scripts/build [... 1170 more characters]
````

### Claude 14:45

`Bash  command: sed -n 140,175p src/config/env.ts; grep -n "VERCEL\|process.env" src/server/*.ts src/app/*.ts src/lib/*.ts 2>/dev/null | grep -v test | grep -v "^src/config" | cut -c1-150 | head -20; sed -n 1,40p src/config/site.ts; grep -n "Hobby\|hobby" -r docs/SPEC.md README.md | head -5`

### Tool result 14:45

```
// read from Meta's documentation when the account exists (TODO_VERIFY). `META_GRAPH_BASE`
// points the call at a local stub and is honoured only with the in-memory store.
export type MetaServerConfig = {
  pixelId: string
  token: string
  version: string
  base: string
}

export function metaServerEnv(
  source: Record<string, string | undefined> = process.env,
): MetaServerConfig | null {
  const pixelId = trackingEnv(source).pixel
  const token = source.META_CAPI_TOKEN?.trim() || null
  const version = source.META_GRAPH_VERSION?.trim() || null
  if (!pixelId && !token && !version) return null
  if (!pixelId || !token || !version) {
    const missing = [
      !pixelId && 'META_PIXEL_ID' [... 1527 more characters]
```

### Claude 14:45

`Bash  command: cat > docs/DEPLOY.md <<'E' ⏎ # Deploy to Vercel ⏎  ⏎ Written 2026-10-14 for Phase 6 ('docs/PHASE-6-PLAN.md'). The steps that need an account are David's; the checks after the deploy can be repeated by anyone. Anything about the Vercel or Supabase screens that this file cannot verify from the repo is marked **verify in their docs**. ⏎  ⏎ The site ships **'noindex'**, with no paid traffic,  [... 10448 more characters]`

### Tool result 14:45

```
32:## Known gaps (end of Phase 5, 2026-10-14)
58:## Deploy
62:## Stack
66:## Develop
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 14:45

`Bash  command: head -20 "src/app/api/test-capi/[...path]/route.ts"; grep -n "linkSecret\|signLink" src/server/lead-mail.ts | head -5`

### Tool result 14:45

```
// A stand-in for Meta's Conversions API in the end-to-end run. The server is pointed at it
// with META_GRAPH_BASE, which is honoured only with LEAD_STORE=memory (never on Vercel);
// everywhere else this route is a plain 404. It records what it gets. A request whose
// `fbc` ends in "fail500" is answered with 500, and one that ends in "hang" is answered
// after the server's own timeout has passed, so a test can check that a failing Meta never
// reaches the visitor.
import { connection } from 'next/server'

type Recorded = { path: string; body: Record<string, unknown> }
const globalForCapi = globalThis as typeof globalThis & {
  __capiRequests?: Recorded[]
}

function enabled() {
  return [... 395 more characters]
```

### Claude 14:45

`Bash  command: python3 - <<'E' ⏎ p='docs/PHASE-6-PLAN.md'; s=open(p).read() ⏎ s=s.replace("PR 4 (strict data gate) in review.**","PR 4 (strict data gate) merged; PR 5 (deploy notes) in review.**") ⏎ open(p,'w').write(s) ⏎ E ⏎ cat >> docs/AI-LOG.md <<'E' ⏎  ⏎ ### Phase 6, PR 5: deploy notes ⏎  ⏎ **Prompt (summary):** David: "#93 merged" (continue with PR 5, the deploy notes and the environment table). ⏎  [... 2573 more characters]`

### Tool result 14:45

```
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/94
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 14:46

PR 5 is open as [#94](https://github.com/Phunkhouse/etf-kompas/pull/94). It's documentation only: the full `docs/DEPLOY.md` is written, and the README has a short "Deploy" section linking to it. I ran only `pnpm format:check`, and I haven't read the CI results for #94.

**What's in `docs/DEPLOY.md`**
- **Before the first deploy:** the Supabase migrations in order (`0001`, `0002`, `0003`), Resend, and the GA4 and Meta ids.
- **The Vercel project:** `SITE_URL` must be in the build environment too, or the share image address says `localhost`.
- **The environment table:** each variable marked required or not, and secret or not. It also lists what must not be set on Vercel: `LEAD_STORE=memory` and `META_GRAPH_BASE`.
- **Checks after the first deploy:**
  - `curl -I` for noindex
  - the share image address
  - the PDF fonts
  - the purge run by hand
  - tracking on a phone
  - Lighthouse
- **What to do when something is wrong**, and the production-switch checklist, which is not done.

**Four platform statements are unverified.** I wrote them from general knowledge, not from the repo, and marked each "verify in their docs":
1. Where the function region is set.
2. That Vercel Cron sends `CRON_SECRET` as a Bearer header.
3. That Hobby allows a daily cron.
4. How to promote a previous deployment.

**Vercel step reminders, now that the notes exist**
- **`CRON_SECRET`:** add it to Vercel's env, then call `/api/purge` once by hand and read the counts before trusting the cron.
- **`SITE_URL`:** it has to be in the build environment.
- **Meta Conversions API:** the token and Graph version are still missing, so it stays "built, not enabled".
- **`EMAIL_MODE`:** you decide at the end of the phase.
- **Data gate:** the first stale record is on 2026-10-25.

**Next:** PR 6 records the in-app browser test. It needs the deployed address and a real phone, so it waits for the Vercel step. In the meantime I can do the README sections from the plan (§16 items 7, 8, 10 to 12 and the gaps), or the pre-release decision audit of notes 0019, 0025 and 0023. Tell me which one after #94 is merged.

### David 14:52

Q:Before the first deploy: the Supabase migrations in order (0001, 0002, 0003)
A: Since I had already ran migrations with you (whe we have tested it), do I need to run it again?

### Claude 14:52

No, not if production uses the same Supabase project you already tested against. Running the files again would fail with "already exists" errors, because the migrations create tables with plain `create table`. They're not written to be re-run.

I can't see your database, so check what's applied. Run this in the Supabase SQL editor:

```sql
select
  to_regclass('public.leads')         as leads,          -- 0001
  to_regclass('public.result_tokens') as result_tokens,  -- 0001
  to_regclass('public.rate_limits')   as rate_limits,    -- 0001
  to_regclass('public.events')        as events,         -- 0003
  (select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'leads'
      and column_name = 'optin_sent_at') as optin_sent_at,  -- 0002, expect 1
  (select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'leads'
      and column_name = 'session_id') as session_id;        -- 0003, expect 1
```

- **Everything filled in (names and 1s):** you're done, skip all three migrations.
- **Something is null or 0:** run only the missing file. For example, `events` null and `session_id` 0 means run `0003_events.sql` only. `0002` before `0003` if both are missing.

Two related points:
- **A new Supabase project for production** needs all three in order. That's the case the doc describes.
- **Your test rows are still in the tables.** The retention purge will treat them like real leads, deleting them after 6 months or 30 days after an unsubscribe. If you'd rather start clean before the live link goes around, delete the test leads by hand, or use `pnpm lead:delete <e-mail>` per address.

I'll add this check to `docs/DEPLOY.md` in #94, so the doc doesn't tell you to run applied migrations again. The doc stays untouched until you say so.

### Claude 14:52

`Bash  command: git status -sb | head -2; git branch --show-current`

### Tool result 14:52

```
## docs/deploy-notes...origin/docs/deploy-notes
docs/deploy-notes
```

### Claude 14:52

I wrote two conflicting things there. The edit is small and in my own open PR, so I'm making it now.

### Claude 14:52

`Bash  command: python3 - <<'E' ⏎ p='docs/DEPLOY.md'; s=open(p).read() ⏎ a="- [ ] Supabase project in the EU region. In the SQL editor run, in this order: 'supabase/migrations/0001_lead_flow.sql', '0002_optin_sent_at.sql', '0003_events.sql'. Row level security is on and there are no policies, so only the secret key reads or writes." ⏎ assert a in s ⏎ b="""- [ ] Supabase project in the EU region. Row leve [... 1761 more characters]`

### Tool result 14:52

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
8185c06 docs: check which migrations a Supabase project already has
```

### Claude 14:52

I pushed the fix to #94 (`docs/DEPLOY.md`), where it will show up after your next refresh. `pnpm format:check` is clean.

`docs/DEPLOY.md` now includes:
- **The migration check:** the SQL query from above, and what each result means.
- **No re-running:** it says plainly not to run the migrations again on a project that already has them.
- **Test leads:** a checkbox to remove them if the live address should start clean.

I said "no" to re-running above, and that holds only if the production site uses the same Supabase project as your tests. Run the query to confirm.

One thing I haven't verified: whether your test project has `0003`. Phase 5 events are only recorded as checked against stubs and a GA4 test, so the query is the way to find out.

### David 14:57

Ok, so I am creating vercel project (importing from github). Give me a list of evn variables I should put there

### Claude 14:57

Paste these in the Vercel import screen (Environment Variables), or under Settings → Environment Variables afterwards. Apply them to **Production**. Importing triggers a first deploy, so after adding the variables, **redeploy** so the build sees them. `SITE_URL` in particular is read at build time.

**Secrets you generate.** Run each separately in a terminal (a different value each time) and paste the output:

```bash
openssl rand -base64 32
```

| Variable               | Value                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| `IP_HASH_SECRET`       | new random value                                                            |
| `TOKEN_SIGNING_SECRET` | another new random value (this makes the old local links stop working, as intended) |
| `CRON_SECRET`          | a third new random value                                                    |

**Values you copy from your `.env.local`** (the same Supabase, Resend and GA4/Meta accounts you tested with):

| Variable              | Notes                                                    |
| --------------------- | -------------------------------------------------------- |
| `SUPABASE_URL`        | project URL                                              |
| `SUPABASE_SECRET_KEY` | secret                                                   |
| `RESEND_API_KEY`      | secret                                                   |
| `EMAIL_FROM`          | sender on your verified test domain, e.g. `ETF Kompas (test) <[email]>` |
| `GA4_MEASUREMENT_ID`  | `G-…`                                                    |
| `META_PIXEL_ID`       | digits                                                   |

**Settings:**

| Variable                  | Value                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `SITE_URL`                | `https://<project-name>.vercel.app`, no trailing slash (see below)                              |
| `EMAIL_MODE`              | `sandbox` for now (you decide on `live` at the end of the phase)                                |
| `EMAIL_SANDBOX_ALLOWLIST` | your own addresses, comma separated, for the tests (needed while the mode is `sandbox`)         |

**Optional, skip for now:** `EMAIL_REPLY_TO`, `RETENTION_LEAD_MONTHS` and `RETENTION_UNSUBSCRIBED_DAYS` (defaults 6 and 30 apply).

**Leave unset on purpose:**
- `META_CAPI_TOKEN` and `META_GRAPH_VERSION`: the server-side Lead stays off.
- `LEAD_STORE`: the in-memory store must not exist on Vercel.
- `LEAD_MIN_FILL_MS` and `META_GRAPH_BASE`: test-only.

**Two practical points:**
1. **`SITE_URL` needs the final address before you know it.** Pick the project name in the import screen, because `https://<project-name>.vercel.app` follows from it. If Vercel gives a different address (a taken name gets a suffix), correct `SITE_URL` and redeploy. Wrong values show up in the share image address and the links in e-mails.
2. **Mark the secrets as sensitive** with the checkbox if Vercel offers it: `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `IP_HASH_SECRET`, `TOKEN_SIGNING_SECRET`, `CRON_SECRET`.

Never paste the values into this chat. When the deploy is up, tell me the address and I'll run the checks from section 4 of `docs/DEPLOY.md` that I can do from here (`curl -I`, the share image address, the test routes). The rest need your phone and your inbox.

### David 14:58

One more thing, no apply to preview? Just production?

### Claude 14:58

Yes, Production only is fine, and I'd recommend it.

**What a preview deployment does without the variables:**
- **The build still works.** The variables are read when first needed, not on import. `pnpm data:validate` doesn't need them either.
- **The pages render, but nothing connects.**
  - The lead form shows its error state, because there's no database.
  - No e-mail goes out.
  - GA4 and the Pixel don't load, because their ids are missing at build time.
  - The share image address points to `localhost`.
  - `/api/purge` answers 401.

**Why that's the safer default:**
- A preview can't write test leads into your production Supabase.
- It can't send e-mail from your sender domain.
- It can't add events to your GA4 property or Meta dataset.
- The retention cron runs only on the production deployment anyway.

**When you'd want them on Preview:** only if you plan to test the form on a PR preview link. In that case give previews their own Supabase project and an `EMAIL_MODE=sandbox` allowlist, never the production values. I don't see a need for that now. We test locally, with the Playwright suite and the in-memory store, and on the production address.

So set everything for **Production** only. If a preview ever misbehaves, this is why.

### David 15:05

Ok, deployed, but it changed name to etf-kompas-kappa.vercel.app

### Claude 15:05

Before checking, one thing for you: `SITE_URL` must be exactly `https://etf-kompas-kappa.vercel.app` (no trailing slash), followed by a redeploy. Let me see what the deployment shows right now.

### Claude 15:05

`Bash  command: U=https://etf-kompas-kappa.vercel.app; for p in / /zasady /srovnani/x /nenalezeno; do echo "--- $p"; curl -sI "$U$p" | grep -iE "^HTTP|x-robots|cache-control"; done; echo "--- og"; curl -s $U/ | grep -oE '(og:image|og:title)" content="[^"]*"' ; echo "--- image"; curl -sI $U/share-image.png | grep -iE "^HTTP|content-type|x-robots"; echo "--- test routes / purge"; curl -s -o /dev/null -w "t [... 179 more characters]`

### Tool result 15:05

```
--- /
HTTP/2 200 
cache-control: public, max-age=0, must-revalidate
x-robots-tag: noindex, nofollow
--- /zasady
HTTP/2 200 
cache-control: public, max-age=0, must-revalidate
x-robots-tag: noindex, nofollow
--- /srovnani/x
HTTP/2 200 
cache-control: private, no-store
x-robots-tag: noindex, nofollow
--- /nenalezeno
HTTP/2 404 
cache-control: public, max-age=0, must-revalidate
x-robots-tag: noindex, nofollow
--- og
og:title" content="ETF Kompas: americké indexy z Česka, u koho je koupíte"
og:image" content="https://etf-kompas.vercel.app/share-image.png"
--- image
HTTP/2 200 
content-type: image/png
x-robots-tag: noindex, nofollow
--- test routes / purge
test-leads 404
purge no se [... 17 more characters]
```

### Claude 15:05

The first checks from `docs/DEPLOY.md` section 4 pass, with one fix needed. I ran them from here against `https://etf-kompas-kappa.vercel.app`.

**Passing**
- **noindex:** `X-Robots-Tag: noindex, nofollow` is on `/`, `/zasady`, `/srovnani/x`, the 404 page and the share image. The results page also has `Cache-Control: private, no-store`.
- **Test routes:** `/api/test-leads` answers 404, so the in-memory store is not active.
- **Purge:** `/api/purge` without the secret answers 401.
- **Assets:** the share image is `image/png` and answers 200, and `/apple-icon.png` answers 200.
- **Build:** the strict data gate passed, because the build ran.

**One wrong value**
`og:image` is `https://etf-kompas.vercel.app/share-image.png`, which is the name you originally planned. Chats and Instagram would fetch the image from an address that isn't yours. `SITE_URL` is still the old name.

**To fix it**
1. In Vercel, change `SITE_URL` to `https://etf-kompas-kappa.vercel.app`, without a trailing slash.
2. **Redeploy.** It's read at build time, so saving the variable alone changes nothing.

The same value is used in links in e-mails, so fix it before any form test.

Tell me when the redeploy is done and I'll repeat the `og:image` check. I can't run the checks that need your inbox or database from here. These are yours:
- Submit the form with an address on `EMAIL_MODE=sandbox`'s allowlist.
- Open the PDF and look at all six pages for the fonts. That's the one check still unverified on Vercel.
- Run `/api/purge` once with the Bearer secret.

I can walk through any of them with you.

### David 15:08

Ok, I changed the url, redeployed, but it failed

<pasted_content id="c55a">
Error: Failed to collect configuration for /_not-found
    at ignore-listed frames {
  [cause]: TypeError: Invalid URL
      at module evaluation (src/app/layout.tsx:30:17)
      at module evaluation (src/app/layout.tsx:72:1)
    28 | // and the X-Robots-Tag header in next.config.ts say the same thing twice.
    29 | export const metadata: Metadata = {
  > 30 |   metadataBase: new URL(siteUrl),
       |                 ^
    31 |   title: siteCopy.title,
    32 |   description: siteCopy.description,
</pasted_content id="c55a">

### Claude 15:08

Most likely `SITE_URL` was saved without `https://` (for example `etf-kompas-kappa.vercel.app`) or with a stray space. `new URL(...)` throws on that, and my layout runs it at build time, so one bad value kills the whole build. I'm making that failure harder to trigger.

### Claude 15:08

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b fix/site-url-does-not-break-build && cat > src/config/site-url.test.ts <<'E' ⏎ import { afterEach, describe, expect, it, vi } from 'vitest' ⏎ import { siteUrl } from './site-url' ⏎  ⏎ // A bad SITE_URL must never stop the build (found on the first Vercel deploy, ⏎ // 2026-10-14: a value that did not parse failed the whole build). W [... 3777 more characters]`

### Tool result 15:08

```
Tests  7 passed (7)
```

### Claude 15:08

`Bash  command: python3 - <<'E' ⏎ p='src/app/layout.tsx'; s=open(p).read() ⏎ a="""// The address chats and social feeds need to turn the share image into a full link. ⏎ // Set SITE_URL in the build environment (Vercel); the local default is only for dev. ⏎ const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000' ⏎ """ ⏎ assert a in s ⏎ s=s.replace(a,"""// The address chats and social feeds need to [... 844 more characters]`

### Tool result 15:09

```
(eval):16: no matches found: --include=*.ts
      Tests  920 passed (920)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!


○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand

og:image" content="https://etf-kompas-kappa.vercel.app/share-image.png"
```

### Claude 15:09

`Bash  command: grep -rln "SITE_URL" src | grep -v test; cat >> docs/AI-LOG.md <<'E' ⏎  ⏎ ### Phase 6, fix: a bad SITE_URL no longer fails the build ⏎  ⏎ **Prompt (summary):** David changed 'SITE_URL' in Vercel after the first deploy and redeployed; the build failed with 'TypeError: Invalid URL' at 'metadataBase: new URL(siteUrl)' in 'src/app/layout.tsx'. ⏎  ⏎ **Produced:** 'src/config/site-url.ts' ('sit [... 2669 more characters]`

### Tool result 15:09

```
src/app/layout.tsx
src/app/lead-service.ts
src/config/site-url.ts
src/config/env.ts
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/95
```

### Claude 15:09

The failed build was my bug from PR 3, and the fix is open as [#95](https://github.com/Phunkhouse/etf-kompas/pull/95). I put `new URL(process.env.SITE_URL)` in the root layout, so a `SITE_URL` that doesn't parse (most likely one missing `https://`, or with a stray space) stopped the whole build. I tested only good values and no value.

**The fix**
`siteUrl()` trims the value, adds `https://` if it's missing, keeps only the origin, and falls back to localhost with a warning that never shows the value. It never throws, so a bad value can't stop a build again.

**Checked**
- 7 new unit cases, and `pnpm check` (920 tests) passes.
- `pnpm format:check` passes.
- A local `pnpm build` with `SITE_URL=etf-kompas-kappa.vercel.app` (no scheme) builds, and `og:image` comes out as `https://etf-kompas-kappa.vercel.app/share-image.png`.
- I haven't seen your actual value or the Vercel build log, so "missing `https://`" is a likely cause, not a confirmed one. I haven't read the CI results for #95 either.

**What to do now**
1. **Check `SITE_URL` in Vercel.** It must read exactly `https://etf-kompas-kappa.vercel.app` (no trailing slash, no spaces). The form and the e-mail links check it at run time with a stricter rule, so a value without `https://` still gives a form error even after this fix.
2. **Merge #95**, then redeploy, or let the merge deploy it.
3. **Tell me when it's green.** I'll repeat the `og:image` check and look at the rest.

My PR 3 summary also said "set `SITE_URL`" without the exact format. That's recorded in `docs/AI-LOG.md`.

### David 15:14

#95 landed, build is ok. I will land #94 too, but first fix xonflicts

### Claude 15:14

`Bash  command: git fetch -q && git checkout -q docs/deploy-notes && git merge origin/main 2>&1 | tail -5; git diff --name-only --diff-filter=U; grep -n "^<<<<<<<\|^=======\|^>>>>>>>" docs/AI-LOG.md docs/PHASE-6-PLAN.md README.md 2>/dev/null`

### Tool result 15:14

```
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Automatic merge failed; fix conflicts and then commit the result.
docs/AI-LOG.md
docs/AI-LOG.md:1289:<<<<<<< HEAD
docs/AI-LOG.md:1303:=======
docs/AI-LOG.md:1316:>>>>>>> origin/main
```

### Claude 15:14

Only `docs/AI-LOG.md` conflicts (both sides appended an entry). Keeping both, the one already on `main` first.

### Claude 15:14

`Bash  command: python3 - <<'E' ⏎ import re ⏎ s=open('docs/AI-LOG.md').read() ⏎ m=re.search(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> origin/main\n",s,re.S) ⏎ s=s[:m.start()]+m.group(2).rstrip('\n')+"\n\n"+m.group(1)+s[m.end():] ⏎ open('docs/AI-LOG.md','w').write(s) ⏎ E ⏎ grep -c "^<<<<<<<\|^>>>>>>>" docs/AI-LOG.md; grep -n "^### Phase 6" docs/AI-LOG.md; npx prettier --write docs >/dev/null; pnpm -s che [... 307 more characters]`

### Tool result 15:15

```
0
1231:### Phase 6, PR 1: data model without unused unverified fields
1245:### Phase 6, PR 2: automatic retention and deleting a lead
1260:### Phase 6, PR 3: noindex everywhere, share image, head
1276:### Phase 6, PR 4: the strict data gate
1289:### Phase 6, fix: a bad SITE_URL no longer fails the build
1302:### Phase 6, PR 5: deploy notes
      Tests  920 passed (920)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
```

### Claude 15:15

The conflicts on #94 are resolved and it now shows as mergeable. "Blocked" only means CI and review haven't finished, and I haven't read the CI results yet. Only `docs/AI-LOG.md` conflicted, because both branches appended an entry at the end. I kept both, with the `SITE_URL` fix entry from `main` placed before the PR 5 entry. After the merge, `pnpm check` (920 tests) and `pnpm format:check` pass.

Since the build is green, here's what I can check from here against `https://etf-kompas-kappa.vercel.app`, once you've landed #94 or right now. Want me to repeat the `og:image` check?

The checks that need you are:
- **Submit the form with an allowlisted address:** this checks the lead, the e-mail and the results link.
- **Open the PDF:** look at all six pages for the fonts. That's the one check still unverified on Vercel.
- **Run `/api/purge` once by hand with the Bearer secret:** read the counts before trusting the cron.

### David 15:25

Just tested it

PDF seems fine, but I haven't received email (from allowlist)

### Claude 15:25

I can't see your Supabase or Vercel logs, so let me read how the app decides and records a send, so we can find the cause from what you can see.

### Claude 15:25

`Bash  command: grep -n "sandbox\|allowlist\|emailStatus\|delivery" src/server/lead-mail.ts | head -40; sed -n 1,80p src/server/mailer.ts | grep -n "resend\|status\|throw\|from\|ok" | head -30; grep -n "delivery\|status" src/components/LeadForm/LeadForm.tsx | head -20`

### Tool result 15:25

```
2:// sandbox rule lives in `deliver`; a failure to send is an answer, never an exception.
16:  mode: 'live' | 'sandbox'
18:  allowlist: string[]
3:// `fetch`; the recording mailer is for tests and the e2e run. No imports from next or react.
44:  from: string
50:        const response = await fetch('https://api.resend.com/emails', {
57:            from: options.from,
68:        // The status only: the answer can echo the address.
69:        return response.ok ? 'sent' : 'failed'
56:  const start: LeadFormState = initialState ?? { status: 'idle' }
73:  if (state.status === 'ok') {
80:        <p className={styles.notice} role="status">
90:        {state.email.status === 'sent' ? (
94:        )  [... 349 more characters]
```

### Claude 15:25

`Bash  command: grep -n "function deliver" -B3 -A40 src/server/lead-mail.ts | head -80; sed -n 84,102p src/components/LeadForm/LeadForm.tsx; grep -n "sandbox\|notSent\|failed" src/content/copy.ts | head`

### Tool result 15:25

```
<a href={state.resultsPath} className={styles.open}>
          {nbsp(text.done.open)}
        </a>
        <a href={`${state.resultsPath}/pdf`} className={styles.pdf}>
          {nbsp(text.done.pdf)}
        </a>
        {state.email.status === 'sent' ? (
          <p className={styles.mailed}>
            {nbsp(text.done.sent(state.email.address))}
          </p>
        ) : state.email.status === 'failed' ? (
          <p className={styles.mailed}>{nbsp(text.done.failed)}</p>
        ) : null}
      </div>
    )
  }

  const email =
    state.status === 'invalid' || state.status === 'error' ? state.email : ''
257:  // Nothing is said about an e-mail unless `sent` or `failed` below applies. [... 250 more characters]
```

### Claude 15:25

`Bash  command: grep -n "deliver\|allowlist" src/server/lead-mail.ts src/server/leads.ts | head -20; sed -n 255,268p src/content/copy.ts`

### Tool result 15:25

```
src/server/lead-mail.ts:2:// sandbox rule lives in `deliver`; a failure to send is an answer, never an exception.
src/server/lead-mail.ts:6:import { deliver, type Delivery, type Mailer } from './mailer'
src/server/lead-mail.ts:18:  allowlist: string[]
src/server/lead-mail.ts:68:  return deliver(mail.mailer, mail, { to: lead.email, ...content })
src/server/lead-mail.ts:86:  return deliver(mail.mailer, mail, { to: lead.email, ...content })
src/server/leads.ts:283:    const delivery = await sendKompas(lead, token, deps.mail)
src/server/leads.ts:284:    if (delivery !== 'skipped') {
src/server/leads.ts:285:      lead = { ...lead, emailStatus: delivery === 'sent' ? 'sent' : 'failed' }
src/server/ [... 664 more characters]
```

### Claude 15:25

`Bash  command: grep -n "export async function deliver" -A25 src/server/mailer.ts`

### Tool result 15:25

```
22:export async function deliver(
23-  mailer: Mailer,
24-  config: DeliveryMode,
25-  message: MailMessage,
26-): Promise<Delivery> {
27-  if (
28-    config.mode === 'sandbox' &&
29-    !config.allowlist.some((entry) => normal(entry) === normal(message.to))
30-  ) {
31-    return 'skipped'
32-  }
33-  try {
34-    return await mailer.send(message)
35-  } catch {
36-    return 'failed'
37-  }
38-}
39-
40-const SEND_TIMEOUT_MS = 5000
41-
42-export function createResendMailer(options: {
43-  apiKey: string
44-  from: string
45-  replyTo?: string | null
46-}): Mailer {
47-  return {
```

### Claude 15:25

Which of three things appeared under the buttons after you submitted tells us where it broke. The code has exactly three outcomes:

| What the success state showed | What it means | Where to look |
| --- | --- | --- |
| **"Odkaz jsme poslali i na …"** | Resend accepted the message. The problem is after our code. | Resend dashboard → Emails: look at the status (delivered, bounced, rejected). Check spam. |
| **"E-mail se nepodařilo odeslat…"** | Resend refused it, or took longer than 5 s. | Usually the API key, or `EMAIL_FROM` not on a verified domain. Resend's Emails or Logs page gives the reason. |
| **Nothing about e-mail** | Sandbox mode skipped it: the address isn't in `EMAIL_SANDBOX_ALLOWLIST`. | Vercel env. Common causes are a typo, an empty value, or the variable added **without a redeploy** (a change to an env variable applies to the next deployment only). |

You can confirm the same thing without logs. In Supabase → `leads`, find your row and read `email_status`:
- `sent`: Resend accepted it (first row).
- `failed`: Resend refused it (second row).
- `queued`: it was never attempted (third row).

I'd bet on the third. The page deliberately says nothing in that case, and a first deploy often has env values added after the build. That's a guess though, since I can't see your env or your Supabase.

Tell me which row it was, plus the `email_status` value if you can. Don't paste keys or full addresses. Then we'll fix that one cause.

### David 15:27

It's “Odkaz jsme poslali i na …”, nothing in spam

I can see it in Supabase in leads, email_status: sent

### Claude 15:27

Our side worked: `email_status: sent` means Resend's API accepted the message, so the app, the key and the sender all passed. What happens after that is visible only in Resend, and I can't see your account.

Open **Resend → Emails**, find the message to your address and read its status. It will be one of these:

| Status in Resend | What it means | What to do |
| --- | --- | --- |
| **Delivered** | The receiving server took it. | Look again: all folders, "Promotions" and "All mail" in Gmail, quarantine in a company mailbox. Search for the sender name or "Kompas". |
| **Bounced** | The receiving server refused it. | The details line gives the reason (unknown address, or a policy such as failed SPF, DKIM or DMARC). |
| **Complained / Suppressed** | The address is on a block list, for example after an earlier bounce. | Remove it from Resend's suppression list and send again. |
| **Sent**, but never "Delivered" | The receiving server is slow, or it silently dropped it. | Wait a few minutes. If it stays, this is usually a missing DKIM or DMARC record. |

Also check what `EMAIL_FROM` is. If it's Resend's shared test sender (`…@resend.dev`), Resend delivers only to the e-mail address of the Resend account owner. It would say "sent" and deliver nothing to any other address. Your own verified test domain doesn't have that limit.

Send me the Resend status for that message and the detail line next to it. I need only that; no keys or full addresses. With it I can say whether the fix is a DNS record, the sender, or the suppression list.

### David 15:30

it's Delivered in Resend (both, comparison and consent)

Nothing i my email client (redirect to Proton). It was working previously when we had tested it

### Claude 15:30

"Delivered" in Resend means the first receiving mail server accepted the message. Since your address redirects to Proton, there are two hops, and the problem is almost certainly in the second one: the forwarder accepted it, then handed it to Proton, which dropped or filed it. Resend can't see that part.

**Check in this order**
1. **Proton, every folder.** Search for "Kompas" in All Mail, Spam, Trash and Archive. Proton sometimes files forwarded mail as spam or scheduled it without notifying you.
2. **The forwarder's own log.** Wherever the redirect lives (your registrar, Cloudflare Email Routing, Proton's custom-domain setup, or similar), most services keep an activity log of forwarded mail with "dropped", "rejected" or "failed" reasons. That log shows what happened after Resend.
3. **Isolate the forwarding hop.** Add an address with no redirect (a plain Gmail, or the Proton address itself) to `EMAIL_SANDBOX_ALLOWLIST` in Vercel, **redeploy**, and submit once with it. If that arrives, the app and Resend are fine and the redirect is the problem.

**Why it may have changed since your earlier test**
- **A different receiving path.** Was the earlier test to the same address, or to a direct one?
- **Forwarding breaks SPF** (the sender check) and often leaves DKIM as the only passing check. If the sending domain's DKIM or DMARC record isn't passing, Proton can quietly reject or spam-file forwarded mail.
- **The sending domain changed.** If `EMAIL_FROM` on Vercel isn't the same as in your local `.env.local`, mail goes from another domain with its own DNS records and reputation.

I can look at the DNS side from here if you tell me the sending domain (the part after `@` in `EMAIL_FROM`, no keys). I'll check its SPF, DKIM and DMARC records, and whether `EMAIL_FROM` differs from the one you used locally.

### David 15:32

Sending domain is david-krapka.eu

### Claude 15:32

`Bash  command: D=david-krapka.eu; echo "--- MX"; dig +short MX $D; echo "--- TXT"; dig +short TXT $D; echo "--- DMARC"; dig +short TXT _dmarc.$D; echo "--- resend DKIM"; dig +short TXT resend._domainkey.$D; echo "--- send subdomain"; for s in send mail; do echo "[$s] MX"; dig +short MX $s.$D; echo "[$s] TXT"; dig +short TXT $s.$D; done; echo "--- NS"; dig +short NS $D; echo "--- proton dkim"; dig +short [... 31 more characters]`

### Tool result 15:32

```
--- MX
100 mx20.active24.cz.
10 mx10.active24.cz.
--- TXT
"v=spf1 a mx include:_spf.websupport.cz -all"
--- DMARC
"v=DMARC1; p=quarantine"
--- resend DKIM
"p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/t+gKiylGJHCyIO3wUYU9hJas/teiW630H9rJYVMo9Ze+B3gY0f6tfdvOc+t60w8Ap3zFLy5mzQ4jeNMxyDMJvhoS0qQB/+gQcnorQGkUsilZFjiwDnE71YCHunqolP6wN1ristKvimAbNhXe+wm0Uk7dR6ul8ho2sS24Ib/voQIDAQAB"
--- send subdomain
[send] MX
send.forge.rmta.net.
10 feedback.forge.rmta.net.
[send] TXT
send.forge.rmta.net.
"v=spf1 ip4:52.3.252.119 ip4:44.222.39.36 ip4:199.249.231.0/24 ~all"
[mail] MX
[mail] TXT
--- NS
ns1.websupport.cz.
ns3.websupport.eu.
ns2.websupport.cz.
--- proton dkim
```

### Claude 15:32

I checked the DNS of `david-krapka.eu` from here. Resend's side is set up correctly, and the likely problem is the forwarding path. This is inference from the records, not something I could observe.

**Verified from DNS**
- **Resend DKIM:** `resend._domainkey.david-krapka.eu` exists and has a key.
- **Return path:** `send.david-krapka.eu` has Resend's SPF and mail records. Resend's own checks (SPF and DKIM) are fine, which matches "Delivered".
- **Incoming mail:** the domain's MX goes to Active24, which is where your redirect to Proton happens.
- **Root SPF:** `v=spf1 a mx include:_spf.websupport.cz -all`. Resend isn't listed there, and it ends in a hard fail.
- **DMARC:** `v=DMARC1; p=quarantine`, with no report address.

**Why I suspect this path**
The app sends a message *From* `david-krapka.eu` *To* an address on `david-krapka.eu`, so Active24 receives an external message that claims to be from its own domain, and then forwards it to Proton. That has three weak points:
1. **Active24's filter** may treat it as spoofed or spam-file it, because the root SPF doesn't allow Resend and ends in `-all`.
2. **Forwarding without sender rewriting** breaks SPF at Proton.
3. **Proton's DMARC check:** if DKIM also breaks (Active24 changes the body or headers), the message fails DMARC, and with `p=quarantine` it goes to quarantine or Spam, or is rejected. Another recipient would never see this.

**The test**
Add `[email]` (a direct Proton address, no forwarding hop) to `EMAIL_SANDBOX_ALLOWLIST` in Vercel, **redeploy**, and submit once with it.
- **It arrives:** the app, Resend and your DNS are fine. Only mail to addresses on your own domain is affected, and visitors with Gmail and similar addresses won't see it.
- **It still doesn't arrive:** it's something about delivery to Proton in general, and I need the Resend detail line.

**Your earlier test.** It worked when you tested before. I can't tell what differed. If you used a direct address then, that fits.

**Two optional follow-ups, not now**
- Add `rua=mailto:...` to the DMARC record to get reports of which checks fail.
- Move sending to a subdomain, so the policy of the root domain doesn't collide with Active24's filtering.

Do the `pm.me` test first and tell me what arrives.

### David 15:36

It has arrived on .pm adress

### Claude 15:37

So the app, Resend and your DNS are all fine, and the problem is isolated: **mail to an address on `david-krapka.eu` does not get through the Active24 → Proton redirect.** A direct address works, so visitors with Gmail, Seznam and similar addresses won't be affected by this. Whether they receive it is still a separate check, since "Delivered" means the receiving server accepted it. I'll record it in `docs/DEPLOY.md` with the next batch of docs changes, as a line saying not to test with a forwarded own-domain address.

**Now that the e-mail is in your inbox, these are the checks left on the live site:**
1. **Links in the e-mail.** Hover or open them. They should start with `https://etf-kompas-kappa.vercel.app`, not `localhost` or the old `etf-kompas` name. Open the results link, and check the footer says it's a test project.
2. **The comparison e-mail and the tips e-mail.** You said both arrived as Delivered in Resend, so confirm that both reached `pm.me`. The tips e-mail has a button to confirm. Click it, press the button on the page, and check you get the confirmed page.
3. **Unsubscribe link.** Open it, then press "Přihlásit zpět" to check it undoes itself. The page should now name the 30-day period and say it's provisional.
4. **The purge by hand**, with your `CRON_SECRET` from Vercel. Don't paste it here:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" https://etf-kompas-kappa.vercel.app/api/purge
```

Expect `{"leads":0,"events":N,"rateLimits":N,"failed":0}`, with `leads: 0` because nothing is old yet. Tell me the result, with `failed` the key number.

**Leftover test leads:** the rows from your earlier tests are still in Supabase. They'll be purged at the 6-month mark, or you can delete them with `pnpm lead:delete <e-mail>` if the link is going to be shared.

Tell me what you find in 1 to 4, and I'll mark the Vercel checks done in the plan. After that, the in-app browser test on your phone is the next real step.

### David 15:40

Ok, 1., 2. 3. working.

Damn I haven't saved cron secret. Is it save to generate new one, save to pass manager and redeploy?

### Claude 15:40

Yes, it's safe. `CRON_SECRET` protects only `/api/purge`, and the only thing that uses it is Vercel Cron.

**What it affects**
- **Nothing is stored with it:** no link, e-mail, token or database row depends on it. It isn't a signing key, unlike `TOKEN_SIGNING_SECRET`.
- **Rotating it only makes the old value stop working.** Nobody has used it, so nothing breaks.
- **Do not change `TOKEN_SIGNING_SECRET` or `IP_HASH_SECRET`.** Those would invalidate unsubscribe and opt-in links already sent (and hashed rate-limit keys). You aren't touching those, just checking.

**Steps**
1. Generate it and put it straight into your password manager:

   ```bash
   openssl rand -base64 32
   ```

2. In Vercel → Environment Variables, edit `CRON_SECRET` (Production) and paste the new value. Mark it sensitive if offered.
3. **Redeploy.** The new value applies only to the next deployment.
4. Run the check with the new value, in a terminal where it doesn't land in your shell history. Setting a space before the command usually keeps it out of history in zsh if `HIST_IGNORE_SPACE` is on, but don't rely on that. A safer way is to read it from the clipboard:

   ```bash
   curl -s -H "Authorization: Bearer $(pbpaste)" https://etf-kompas-kappa.vercel.app/api/purge
   ```

   Copy the secret from the password manager just before running it. Expect the counts with `failed: 0`.

**Cron:** Vercel sends the stored value to the cron by itself, so the daily run uses the new one after the redeploy. I can't verify that from here: it's one of the statements marked "verify in their docs". The first real run (03:17 UTC) will show in the project's cron or function logs. The status of `/api/purge` there is the check.

Tell me the result of the `curl` (the counts, not the secret).

### David 15:42

So I should run locally in terminal?

### Claude 15:42

Yes, run it in your own terminal on your Mac. The command calls the live site over the internet, so it doesn't matter where you run it, as long as it's your machine and the secret doesn't get pasted into this chat.

You can also use the Terminal panel in this app (a shell tab next to our conversation). It's the same thing, but your clipboard approach (`pbpaste`) works there too.

The order, once more:
1. Copy the new secret from your password manager.
2. Run this, which reads the secret from your clipboard and never types it:

```bash
curl -s -H "Authorization: Bearer $(pbpaste)" https://etf-kompas-kappa.vercel.app/api/purge
```

3. Read the answer. It's JSON like `{"leads":0,"events":3,"rateLimits":1,"failed":0}`. That one line is safe to paste to me, since it has only counts.

If you get nothing at all, the secret wasn't picked up (wrong clipboard, or no redeploy yet), and the route answers 401 with an empty body. Check that the clipboard really holds the new secret, and that the redeploy finished.

### David 15:43

Ok, ran it. Output is {"leads":0,"events":0,"rateLimits":0,"failed":0}%

### Claude 15:43

That's the result I hoped for. The new secret works, and the route reached Supabase and ran all three steps without an error.

**What it proves**
- **Auth:** the Bearer secret is accepted (a wrong one answers 401 with an empty body), so `CRON_SECRET` is right in Vercel.
- **Database access:** `failed: 0` means the lead lookup, the event delete and the rate-limit delete all ran against the real Supabase without an error.
- **Zero counts are correct:** your test data is from today, and nothing is older than 6 months (or unsubscribed more than 30 days ago). The trailing `%` is only your shell saying the answer had no final newline.

**What it does not prove yet:** that a real **delete** works on Supabase. Nothing was due, so the delete calls and the count parsing ran on empty results. They're tested only against a mocked API. A real check costs one of your own test leads:
1. Unsubscribe one test lead via the link in its e-mail.
2. In Vercel set `RETENTION_UNSUBSCRIBED_DAYS=1` and redeploy.
3. A day later, call the purge by hand (or wait for the 03:17 UTC cron). Expect `"leads":1`, and the row gone from Supabase, along with its results link.
4. Set the variable back (or delete it, defaults to 30) and redeploy.

That's optional and takes a day of waiting. If you skip it, the README states "not run against the real database", as it does now, and I'd leave it so.

I'll update my reminders: `CRON_SECRET` is done, and the manual purge ran clean. Still open for the Vercel step:
- the tips-e-mail confirmation and unsubscribe (you've done check 2 and 3 already)
- Meta Test Events
- `EMAIL_MODE`, to decide at the end of the phase
- the in-app browser test

Next, either **the in-app browser test** (PR 6; I'll prepare a checklist to follow on your phone in Instagram and Messenger), or **the README sections and the decision audit**. Which first?

### Claude 15:43

`Bash  command: cd /Users/davidkrapka/.claude/projects/-Users-davidkrapka-dev-learning-etf-kompas/memory && python3 - <<'E' ⏎ p='vercel-step-reminders.md'; s=open(p).read() ⏎ s=s.replace("**Why:**","""**Status 2026-10-14:** deployed at https://etf-kompas-kappa.vercel.app; SITE_URL fixed (#95); 'CRON_SECRET' rotated and saved in David's password manager; manual '/api/purge' answered all zeros with 'failed [... 748 more characters]`

### Tool result 15:43

```
- [Pre-release decision audit](pre-release-decision-audit.md) — open decisions to compare before release; first: single FX fee (note 0019)
- [Phase 5 real checks pending](phase5-real-checks-pending.md) — GA4 tested; Meta Test Events wait for Vercel; CAPI token and Graph version missing
- [Vercel step reminders](vercel-step-reminders.md) — deployed 2026-10-14; open: Meta Test Events, EMAIL_MODE at end of phase, in-app browser test, Lighthouse, first cron run
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 15:43

I've updated my reminder notes with the Vercel status, so it survives between sessions.

Which do you want first: the in-app browser test (PR 6), or the README sections and the decision audit?

### David 15:45

let's tes in app browser

### Claude 15:45

`Bash  command: git fetch -q && git checkout -q main && git pull -q && git log --oneline -3 && git checkout -q -b docs/in-app-browser-test && grep -n "Zkopírovat\|Nejde to otevřít\|copyLink" -r src | head -5; grep -n "inAppBrowser\|in_app_browser" src/lib/track-client.ts | head -5; grep -n "autofocus\|autoFocus" -r src | grep -v test | head -3; grep -n "Instagram\|FBAN" src/lib/*.ts | grep -v test | head [... 3 more characters]`

### Tool result 15:45

```
baf5e58 docs: deploy notes with the environment table and the checks after deploy (#94)
53cb045 fix: a bad SITE_URL no longer fails the build (#95)
cbda6eb ci: strict data check before every build and on main (#93)
88:  const inAppBrowser = /Instagram|FBAN|FBAV/.test(navigator.userAgent)
124:      in_app_browser: inAppBrowser,
211:      inAppBrowser,
```

### Claude 15:45

`Bash  command: cat > docs/IN-APP-BROWSER-TEST.md <<'E' ⏎ # In-app browser test (SPEC §23) ⏎  ⏎ Phase 6. Most ad clicks open the page inside the Instagram or Facebook app, in a webview where downloads, storage and some inputs behave differently. This is the manual test on a real phone, against the live address. The result goes into a decision note (David gives the reasons); this file is the checklist and [... 4184 more characters]`

### Tool result 15:45

```
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 15:45

The checklist is ready in [docs/IN-APP-BROWSER-TEST.md](docs/IN-APP-BROWSER-TEST.md), on a local branch (`docs/in-app-browser-test`, based on `main` with #94 landed). It isn't pushed yet. After the test, it becomes PR 6 with your results filled in.

**Short version, for your phone**

1. **Setup**
   - Send `https://etf-kompas-kappa.vercel.app` to yourself in an **Instagram DM** and in **Messenger**, and open it by tapping inside each app.
   - Use the allowlisted address that isn't forwarded (the `pm.me` one).
   - Note the phone, system and app versions.
2. **The page, in each app**
   - The first screen fits without scrolling.
   - The sliders and year chips work by finger.
   - The cookie bar works: accept and reject both hide it, and the footer "Cookies" reopens the settings.
3. **The form**
   - The e-mail field is **not** focused on arrival.
   - Tapping it opens the keyboard with no jump or zoom.
   - After submitting, "Otevřít srovnání" comes first, then the PDF.
   - The results page opens inside the app.
   - **Write down what the PDF link does**: opens, asks for Safari or Chrome, or does nothing.
   - The app's back button keeps the filled calculator.
4. **The e-mails**
   - Open the results link from the comparison e-mail in your mail app's own webview.
   - Tick the tips box once, so you can check the confirm link, the button and the confirmed page.
   - Check the unsubscribe link and "Přihlásit zpět".
5. **Events afterwards.** Run the query from the file in the Supabase SQL editor. The in-app rows should show `in_app_browser = true` and `device = phone`.

**A likely gap, found while preparing:** SPEC §23 asks for a hint under the PDF link, "Nejde to otevřít? Zkopírovat odkaz". It isn't in `src/`. If the PDF misbehaves in Instagram, that hint is the fix and I'd build it as its own PR. So item 9 matters most.

**Not claiming:** I can't run this myself, because it needs a real phone and the real apps. Everything above is what to look for, not a result.

Send me the table results, or just the lines marked `problem` with what you saw. I'll fill in the record, write the decision note from your reasons, and open PR 6.

### David 15:57

Instagram in app, working
iPhone 14 Pro, iOS 27.0.1, Instagram v451.0.0

* screen fits
* sliders and chips working
* cookie bar works
* email not focused on arrival
* tapping it not zoom or jump
* After submitting, “Otevřít srovnání” comes first, then the PDF. - yes
* PDF link opens in app
* The app’s back button keeps the filled calculator. - yes
* emails webview open safari by default
* unsuscribe works


Messenger in app, working
iPhone 14 Pro, iOS 27.0.1, Messenger v583.0.0

* screen fits
* sliders and chips working
* cookie bar works
* email not focused on arrival
* tapping it not zoom or jump
* After submitting, “Otevřít srovnání” comes first, then the PDF. - yes
* PDF link opens in app
* The app’s back button keeps the filled calculator. - yes
* emails webview open safari by default
* unsuscribe works

### Claude 15:57

`Bash  command: python3 - <<'E' ⏎ p='docs/IN-APP-BROWSER-TEST.md'; s=open(p).read() ⏎ i=s.index("## Record") ⏎ j=s.index("## After the test") ⏎ rec="""## Record ⏎  ⏎ Reported by David on 2026-10-14. A line he did not report is marked "not reported", not guessed. ⏎  ⏎ | Field                | Value                                                                                  | ⏎ | --------------------  [... 2761 more characters]`

### Tool result 15:57

```
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 15:57

I've written your results into the record in `docs/IN-APP-BROWSER-TEST.md`. It's committed to nothing yet, still on the local branch. On the iPhone 14 Pro, in both Instagram and Messenger, the page fits, the sliders and chips work, the cookie bar works, the e-mail field isn't focused on arrival and tapping it causes no zoom or jump. The success state shows "Otevřít srovnání" first, the PDF opens inside the app, back keeps the calculator, and unsubscribe works.

**The "Zkopírovat odkaz" hint from SPEC §23 is not needed on this device**, because the PDF opened in the app. I'm not building it now. It stays a known gap for other phones and app versions (Android, older iOS), and I'd list it in the README.

**What I recorded as "not reported"** (I won't guess):
- **Item 2:** scrolling and nothing cut off by the app bar.
- **Item 4, footer part:** the footer "Cookies" link reopening the settings.
- **Item 8:** the results page itself. You reported the link after the submit, which is item 7.
- **Item 12:** the tips confirmation (the confirm link, the button, the confirmed page).
- **Item 13, second part:** "Přihlásit zpět".
- **The events check:** the Supabase query.

**Item 11:** e-mail links open in Safari by default on your phone, so no mail-app webview was tested. That's a good outcome for the user, not a problem. A recipient whose mail app opens links in its own webview (the Gmail app can) is untested.

**The events query is the one that proves the tracking side.** Please run it and tell me whether the in-app rows have `in_app_browser = true` and `device = phone`. `lead` once only counts if you submitted a new address. Without it I can't say the `in_app_browser` flag works on the real apps.

**Decision note:** I'd suggest "In-app browser test passed on iPhone 14 Pro; the copy-link hint is not built". I haven't drafted it. You gave no reason for leaving the hint out, and the rules say I draft only with your reason. Give me one sentence (for example "it opened in both apps, so it is not needed now") and I'll write it.

Send the events result and the unreported items you can still check, and I'll open PR 6.

### David 15:58

Reason - “it opened in both apps, so it is not needed now"

### Claude 15:58

`Bash  command: git fetch -q; git ls-tree --name-only origin/main docs/decisions/ | tail -3; ls docs/decisions | tail -2`

### Tool result 15:58

```
docs/decisions/0066-drop-unused-unverified-data-fields.md
docs/decisions/0067-automatic-retention-provisional-periods.md
docs/decisions/README.md
0067-automatic-retention-provisional-periods.md
README.md
```

### Claude 15:58

`Bash  command: cat > docs/decisions/0068-in-app-browser-test-and-no-copy-link-hint.md <<'E' ⏎ # 0068. In-app browser test passed on one phone; the copy-link hint is not built ⏎  ⏎ Date: 2026-10-14 ⏎ Status: accepted ⏎ Phase: 6 ⏎  ⏎ Note: the reason for leaving the hint out is David's ("it opened in both apps, so it is not needed now", 2026-10-14). The context, the record and the consequences are written [... 4184 more characters]`

### Tool result 15:58

```
Tests  920 passed (920)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
e8e0dbf docs: in-app browser test record and note 0068
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 15:59

I just caught a false entry in the AI log I wrote: it says I corrected an "Otevřít přehled" wording in a draft, which never happened. I'm fixing it before the PR goes up.

### Claude 15:59

`Bash  command: python3 - <<'E' ⏎ p='docs/AI-LOG.md'; s=open(p).read() ⏎ i=s.index("- **My checklist asked David to look for the \"Otevřít přehled\"") ⏎ j=s.index("\n",s.index("- **I wrote item 8",i)) ⏎ new="""- **No wrong claim reached David in the checklist that I know of.** The one wording difference I found (SPEC §23 says "Otevřít přehled", the page says "Otevřít srovnání") I checked against 'src/con [... 2294 more characters]`

### Tool result 15:59

```
1326:- **No wrong claim reached David in the checklist that I know of.** The one wording difference I found (SPEC §23 says "Otevřít přehled", the page says "Otevřít srovnání") I checked against `src/content/copy.ts` before writing the checklist, so the checklist uses the page's wording.
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
https://github.com/Phunkhouse/etf-kompas/pull/96
```

### Claude 15:59

PR 6 is open as [#96](https://github.com/Phunkhouse/etf-kompas/pull/96) and waits for your review. It's documentation only. `pnpm check` (920 tests) and `pnpm format:check` pass. I haven't read the CI results.

**What's in it**
- **The test record:** your iPhone 14 Pro results for Instagram and Messenger are in `docs/IN-APP-BROWSER-TEST.md`. Everything you didn't report is marked "not reported".
- **Decision note 0068:** the copy-link hint is not built, with your reason attributed to you: "it opened in both apps, so it is not needed now".
- **A README gap line:** Android, older iOS, TikTok and a mail app's own webview are untested, and the PDF may not open there.

**A correction to my own work.** While writing the AI-LOG entry I wrote a mistake that never happened: a "correction" of a checklist wording that I hadn't actually gotten wrong. I caught it before opening the PR and removed it. The entry now records only what really happened.

**Still open before the phase is done**
- **The events query:** run it and tell me whether the in-app rows have `in_app_browser = true` and `device = phone`. That's the one check proving the tracking flag works on the real apps. I'd add the answer to #96 before it's merged.
- **Item 12 (tips confirmation), item 13 second part, the footer "Cookies" link, and the results page itself.** They're quick if you still have the e-mails.
- **Meta Test Events.** The live address exists now.
- **Lighthouse on the live URL.** I can run this one myself if you want.
- **README sections** from the plan (§16 items 7, 8, 10 to 12), and **the decision audit** of notes 0019, 0025 and 0023.
- **`EMAIL_MODE`:** your decision at the end of the phase, as you asked.

Tell me which one first. My suggestion is Lighthouse on the live URL, because it needs only me.

### David 16:00

How should I run events query

### Claude 16:00

In the Supabase dashboard:

1. Open your project at supabase.com and pick the **production** project (the one the Vercel site uses).
2. In the left menu click **SQL Editor**, then **New query**.
3. Paste this and press **Run** (or Cmd+Enter):

```sql
select created_at, name, device, in_app_browser, consent_measurement, variant
from events
where created_at > now() - interval '1 day'
order by created_at desc
limit 60;
```

I widened it to the last day, so your Instagram and Messenger visits from today are included even if some hours have passed. The result is a table below the editor.

**What to look for**
- **`in_app_browser`:** `true` on the rows from your in-app visits, `false` on any visits from a normal browser. That's the check.
- **`device`:** `phone` on the in-app rows.
- **Sequence per visit:** `page_view` first, then `calc_start` and `calc_result` if you moved the slider, then `gate_view`, `form_focus`, and `lead` if you submitted a new address.
- **`consent_measurement`:** `false` on visits where you rejected, `true` where you accepted. Rows should exist either way.

Several rows come from other tests today (your desktop checks), so tell the visits apart by time. The in-app ones are around when you did the phone test.

If the table is empty, check that you're in the right project and the `events` table exists. Then tell me, and don't paste anything with an e-mail address. This table has none: the `lead` row has no address, only the event name.

Send me a few rows (the columns above are enough), or just tell me what you see for `in_app_browser`.

### David 16:02

Sending the output

<pasted_content id="c55a">
| created_at                 | name        | device  | in_app_browser | consent_measurement | variant |
| -------------------------- | ----------- | ------- | -------------- | ------------------- | ------- |
| 2026-10-14 15:55:38.856+00 | calc_result | phone   | true           | true                | a       |
| 2026-10-14 15:54:28.463+00 | lead        | null    | null           | true                | a       |
| 2026-10-14 15:53:53.706+00 | form_focus  | phone   | true           | true                | a       |
| 2026-10-14 15:53:53.22+00  | gate_view   | phone   | true           | true                | a       |
| 2026-10-14 15:53:18.396+00 | calc_start  | phone   | true           | true                | a       |
| 2026-10-14 15:52:35.321+00 | page_view   | phone   | true           | true                | a       |
| 2026-10-14 15:50:20.581+00 | form_focus  | phone   | true           | true                | a       |
| 2026-10-14 15:50:18.937+00 | gate_view   | phone   | true           | true                | a       |
| 2026-10-14 15:50:16.255+00 | page_view   | phone   | true           | false               | a       |
| 2026-10-14 15:47:28.986+00 | form_focus  | phone   | true           | true                | a       |
| 2026-10-14 15:47:27.865+00 | gate_view   | desktop | false          | false               | a       |
| 2026-10-14 15:47:06.706+00 | gate_view   | phone   | true           | true                | a       |
| 2026-10-14 15:47:05.146+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:47:04.691+00 | page_view   | phone   | true           | false               | a       |
| 2026-10-14 15:39:25.708+00 | page_view   | phone   | false          | true                | a       |
| 2026-10-14 15:36:14.523+00 | lead        | null    | null           | true                | a       |
| 2026-10-14 15:36:10.159+00 | form_focus  | phone   | false          | true                | a       |
| 2026-10-14 15:36:08.838+00 | gate_view   | phone   | false          | true                | a       |
| 2026-10-14 15:36:03.847+00 | page_view   | phone   | false          | true                | a       |
| 2026-10-14 15:35:48.498+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:35:47.938+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:31:13.246+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:31:12.968+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:21:07.61+00  | lead        | null    | null           | true                | a       |
| 2026-10-14 15:20:55.059+00 | form_focus  | phone   | false          | true                | a       |
| 2026-10-14 15:20:49.995+00 | gate_view   | phone   | false          | true                | a       |
| 2026-10-14 15:20:38.967+00 | calc_result | phone   | false          | true                | a       |
| 2026-10-14 15:20:37.97+00  | calc_start  | phone   | false          | true                | a       |
| 2026-10-14 15:20:19.958+00 | page_view   | phone   | false          | true                | a       |
| 2026-10-14 15:17:57.989+00 | gate_view   | desktop | false          | false               | a       |
| 2026-10-14 15:17:57.678+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:15:01.964+00 | calc_result | phone   | false          | true                | a       |
| 2026-10-14 15:15:01.879+00 | gate_view   | phone   | false          | true                | a       |
| 2026-10-14 15:14:59.532+00 | calc_start  | phone   | false          | true                | a       |
| 2026-10-14 15:14:48.787+00 | page_view   | phone   | false          | false               | a       |
| 2026-10-14 15:14:04.178+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:14:04.004+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:14:01.9+00   | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:11:04.638+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:11:04.489+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:05:08.774+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 15:05:08.756+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 13:40:47.897+00 | calc_result | desktop | false          | true                | a       |
| 2026-10-14 13:40:46.855+00 | calc_start  | desktop | false          | true                | a       |
| 2026-10-14 13:40:22.567+00 | gate_view   | desktop | false          | false               | a       |
| 2026-10-14 13:40:22.563+00 | page_view   | desktop | false          | false               | a       |
| 2026-10-14 13:37:15.84+00  | calc_result | desktop | false          | true                | a       |
| 2026-10-14 13:37:15.075+00 | calc_start  | desktop | false          | true                | a       |
| 2026-10-14 13:37:05.403+00 | gate_view   | desktop | false          | true                | a       |
| 2026-10-14 13:37:05.4+00   | page_view   | desktop | false          | true                | a       |
| 2026-10-14 12:50:25.587+00 | calc_result | desktop | false          | true                | a       |
| 2026-10-14 12:48:15.574+00 | calc_start  | desktop | false          | true                | a       |
| 2026-10-14 12:48:00.598+00 | page_view   | desktop | false          | true                | a       |
| 2026-10-14 12:48:00.596+00 | gate_view   | desktop | false          | true                | a       |
</pasted_content id="c55a">

### Claude 16:02

The events show what we hoped for. I'm adding the result to the record in #96.

### Claude 16:02

`Bash  command: git checkout -q docs/in-app-browser-test && python3 - <<'E' ⏎ p='docs/IN-APP-BROWSER-TEST.md'; s=open(p).read() ⏎ s=s.replace("Events check (above): not reported yet.","""Events check (above), reported by David on 2026-10-14 from the Supabase table 'events' (the 3 in-app visits between 15:47 and 15:55 UTC): ⏎  ⏎ - The rows of the in-app visits have 'in_app_browser = true' and 'device = ph [... 2927 more characters]`

### Tool result 16:02

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
58ebd01 docs: add the stored events to the in-app browser record
```

### Claude 16:02

The events confirm the tracking works in the real apps, and I added this result to the record in #96 (pushed; I haven't read CI).

**From your table**
- **The in-app visits (15:47 to 15:55 UTC)** have `in_app_browser = true` and `device = phone`. Desktop rows and your earlier normal-browser phone rows have `false`. The flag works in the real Instagram and Messenger.
- **Events are written without consent too.** The first `page_view` of each in-app visit has `consent_measurement = false`. After you accepted the cookie bar, the next rows of the same visit have `true`, as designed.
- **The funnel order on the phone matches the page:** `page_view`, `calc_start`, `gate_view`, `form_focus`, `lead`. In the last visit `calc_result` came about a minute after the `lead`. By design it fires only after the result has been in view for a second, and you scrolled back up to it after submitting.
- **`lead` rows** have no device and no in-app flag, since the server writes them. There's one at 15:54:28 for the in-app submit.

**What I can't tell from this:**
- **Instagram vs Messenger:** the table has no app name, so I can't say which in-app visit was which.
- **Whether `lead` was once per submission for every address.** I'd need the `leads` table for that, and it holds e-mail addresses.

This closes the in-app browser item in the plan, except the checks you didn't report (scrolling under the app bar, the footer "Cookies" link, the results page itself, the tips confirmation, "Přihlásit zpět"). I marked them "not reported", not "ok".

Merge #96 when you're ready. Next, my suggestion is **Lighthouse on the live URL**, since it needs only me. Then the README sections, the decision audit, and the Meta Test Events when you have a few minutes with the phone. Say "go" for Lighthouse, or pick another.

### David 16:06

#96

### Claude 16:06

`Bash  command: gh pr view 96 --json state,mergeable,mergeStateStatus,statusCheckRollup --jq '{state,mergeable,mergeStateStatus,checks:[.statusCheckRollup[]?|{n:.name,c:.conclusion,s:.status}]}' | cat`

### Tool result 16:06

```
The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.

Note: The user's next message may contain a correction or preference. Pay close attention — if they explain what went wrong or how they'd prefer you to work, consider saving that to memory for future sessions.
```

### David 16:06

[Request interrupted by user for tool use]

### David 16:06

#96 landed

### Claude 16:06

`AskUserQuestion  {"questions": [{"question": "How should I run Lighthouse on https://etf-kompas-kappa.vercel.app?", "header": "Lighthouse", "multiSelect": false, "options": [{"label": "npx lighthouse, one-off (Recommended)", "description": "Downloads the lighthouse npm package once through npx, runs it with your local Chrome, mobile profile. Not added to package.json or the repo. Gives me the numbers to write into [... 464 more characters]`

### Tool result 16:11

```
Your questions have been answered: "How should I run Lighthouse on https://etf-kompas-kappa.vercel.app?"="npx lighthouse, one-off (Recommended)". You can now continue with these answers in mind.
```

### Claude 16:11

`Bash  command: git checkout -q main && git pull -q; ls "/Applications/Google Chrome.app" >/dev/null 2>&1 && echo chrome-ok; SP=/private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad; mkdir -p $SP/lh && cd $SP/lh && npx --yes lighthouse@12 https://etf-kompas-kappa.vercel.app/ --form-factor=mobile --only-categories=performance,accessibility,best- [... 137 more characters]`

### Tool result 16:11

```
The user doesn't want to proceed with this tool use. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). STOP what you are doing and wait for the user to tell you how to proceed.

Note: The user's next message may contain a correction or preference. Pay close attention — if they explain what went wrong or how they'd prefer you to work, consider saving that to memory for future sessions.
```

### David 16:11

[Request interrupted by user for tool use]

### David 16:30

#96 landed, run the lighthouse one-off

### Claude 16:30

`Bash  command: git checkout -q main && git pull -q && git log --oneline -2; ls -d "/Applications/Google Chrome.app"`

### Tool result 16:30

```
6d30e80 docs: in-app browser test record and note 0068 (#96)
baf5e58 docs: deploy notes with the environment table and the checks after deploy (#94)
/Applications/Google Chrome.app
```

### Claude 16:30

`Bash  command: mkdir -p /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad/lh && cd /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad/lh && npx --yes lighthouse@12 https://etf-kompas-kappa.vercel.app/ --form-factor=mobile --only-categories=performance,accessibility,best-practi [... 106 more characters]`

### Tool result 16:30

```
home.json
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 16:30

`Bash  command: cd /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad/lh && python3 - <<'E' ⏎ import json ⏎ r=json.load(open('home.json')) ⏎ print(r['lighthouseVersion'], r['configSettings'].get('formFactor'), r['configSettings'].get('throttlingMethod')) ⏎ for k,v in r['categories'].items(): print(k, round(v['score']*100)) ⏎ for a in ['large [... 401 more characters]`

### Tool result 16:30

```
12.8.2 mobile simulate
performance 97
accessibility 100
best-practices 100
seo 63
largest-contentful-paint 2.4 s 0.91
cumulative-layout-shift 0.006 1
total-blocking-time 40 ms 1
first-contentful-paint 1.2 s 0.99
speed-index 2.4 s 0.98
interactive 2.4 s 0.98
FAIL is-crawlable  0
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 16:30

Home page: performance 97, accessibility 100, CLS 0.006. LCP is 2.4 s, which misses the spec's 2.0 s target. I'll run it a few more times and see what the LCP element is before concluding.

### Claude 16:31

`Bash  command: cd /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad/lh && for i in 2 3; do npx --yes lighthouse@12 https://etf-kompas-kappa.vercel.app/ --form-factor=mobile --only-categories=performance --output=json --output-path=./home$i.json --chrome-flags="--headless=new" --quiet >/dev/null 2>&1; done; npx --yes lighthouse@12 "https:// [... 918 more characters]`

### Tool result 16:31

```
home.json {'performance': 97, 'accessibility': 100, 'best-practices': 100, 'seo': 63} LCP 2.4 s CLS 0.006 TBT 40 ms
home2.json {'performance': 99} LCP 2.3 s CLS 0 TBT 30 ms
home3.json {'performance': 99} LCP 2.3 s CLS 0 TBT 10 ms
vb.json {'performance': 99, 'accessibility': 100} LCP 2.3 s CLS 0 TBT 30 ms
{"node": {"type": "node", "lhId": "page-0-P", "path": "1,HTML,1,BODY,12,SECTION,1,P", "selector": "body > section.PLk-IW_bar > p.PLk-IW_barText", "boundingRect": {"top": 495, "bottom": 599, "left": 32, "right": 380, "width": 348, "height": 104}, "snippet": "<p class=\"PLk-IW_barText\">", "nodeLabel"
{"phase": "TTFB", "timing": 785.0419999999999, "percent": "32%"}
{"phase": "Load Delay", "tim [... 298 more characters]
```

### Claude 16:31

`Bash  command: grep -rn "barText" src --include=*.tsx --include=*.scss | head -5; ls src/components | grep -i "cookie\|bar" | head; grep -n "animation\|transition\|opacity\|visibility\|hidden" src/components/CookieConsent/CookieConsent.module.scss | head -12`

### Tool result 16:31

```
(eval):1: no matches found: --include=*.tsx
CookieConsent
SourceBar
StackedBar
StickyBar
4:// <html> before paint, and then it is hidden. Fixed, so it never shifts the page.
190:  transition: background-color var(--duration-fast);
201:    transition: transform var(--duration-fast);
```

### Claude 16:31

`Bash  command: grep -rln "barText" src; grep -n "barText" -B2 -A8 src/components/StickyBar/StickyBar.module.scss | head -30; grep -n "barText" src/components/*/*.tsx | head`

### Tool result 16:31

```
src/components/CookieConsent/CookieConsent.module.scss
src/components/CookieConsent/CookieConsent.tsx
src/components/CookieConsent/CookieConsent.tsx:62:        <p className={styles.barText}>
```

### Claude 16:31

Lighthouse on the live site (Lighthouse 12.8.2, mobile, Lighthouse's default simulated throttling), run 3 times for the home page and once for `/?v=b`:

| Page | Performance | Accessibility | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- |
| `/` (3 runs) | 97, 99, 99 | 100 | 2.4, 2.3, 2.3 s | 0.006, 0, 0 | 10 to 40 ms |
| `/?v=b` | 99 | 100 | 2.3 s | 0 | 30 ms |

Best practices is 100, and SEO is 63 only because of `is-crawlable`, which is the intended `noindex`.

**Against the Phase 3 targets:**
- Performance is at least 90: **met**.
- Accessibility is at least 95: **met**.
- CLS is under 0.05: **met**.
- LCP is under 2.0 s: **not met**. It's 2.3 to 2.4 s on both heroes, consistently.

**What the LCP element is.** Lighthouse says the largest paint is `p.barText`, the paragraph of the **cookie bar** (`CookieConsent.tsx:62`), not the hero. On a first visit, which is every ad click, the bar is always shown, and its text block is large enough to count. The breakdown says 32 % server response (about 0.8 s) and 68 % render delay (about 1.65 s). That points at the bar's text appearing late. My guess is the bar is revealed after the head script runs, or the text waits for the web font. I haven't confirmed which.

**Context:** the earlier LCP measurements in the README predate the cookie bar (Phase 5). The bar is a likely regression from it. I can't prove that without comparing builds.

**Options**
1. **Investigate and fix as its own PR (my recommendation).** I measure a production build locally, compare with the bar hidden, and try a small change so the hero headline, not the bar, is the largest paint. That could be a smaller bar text or revealing it differently. The change touches the cookie bar's CSS or markup and needs a Playwright run and the JS budget test.
2. **Accept 2.3 s and say so in the README.** Performance is 97 to 99, and visitors with a stored consent choice don't see the bar. The 2.0 s target stays a listed gap.

I haven't changed anything. Which one? If you pick 1, I'll first show you the local comparison before touching the bar.

### David 16:34

Let's give investigation a shot. If proves too problematic, we'll accept 2,4

### Claude 16:34

`Bash  command: git checkout -q -b perf/lcp-cookie-bar && sed -n 1,130p src/components/CookieConsent/CookieConsent.module.scss; sed -n 40,110p src/components/CookieConsent/CookieConsent.tsx; ls src/components/CookieConsent src/lib | head -30`

### Tool result 16:34

```
@use 'styles/utilities' as *;

// The bar. Shown until a choice is stored: the cookie script sets data-consent on
// <html> before paint, and then it is hidden. Fixed, so it never shifts the page.
.bar {
  --color-focus: var(--color-paper);

  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: var(--z-overlay);
  display: grid;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-8) var(--space-8);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--color-ink);
  color: var(--color-inverse-soft);

  :global(html[data-consent]) & {
    display: none;
  }

  @include from('md') {
    right: var(--space-6);
    bottom: var(--space-6);
    left: var(- [... 4687 more characters]
```

### Claude 16:34

First a quick look at the sequence of LCP candidates the browser actually reports, on the live site, before changing anything.

### Claude 16:34

`Bash  command: SP=/private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad && cat > $SP/lcp.cjs <<'E' ⏎ const { createRequire } = require('node:module') ⏎ const { chromium } = createRequire('/Users/davidkrapka/dev/learning/etf-kompas/package.json')('@playwright/test') ⏎ const url = process.argv[2] ⏎ ;(async () => { ⏎   const browser = await chrom [... 1699 more characters]`

### Tool result 16:34

```
{
 "paint": [
  {
   "n": "first-paint",
   "t": 564
  },
  {
   "n": "first-contentful-paint",
   "t": 564
  }
 ],
 "lcp": [
  {
   "t": 564,
   "size": 34138,
   "el": "P.PLk-IW_barText",
   "text": "Nezbytné cookies používáme, ab"
  }
 ],
 "fonts": [
  "IBM Plex Sans 100 700 unloaded",
  "IBM Plex Sans 100 700 unloaded",
  "IBM Plex Sans 100 700 unloaded",
  "IBM Plex Sans 100 700 unloaded",
  "IBM Plex Sans 100 700 loaded",
  "IBM Plex Sans 100 700 loaded",
  "IBM Plex Sans Fallback normal loaded",
  "IBM Plex Mono 500 unloaded",
  "IBM Plex Mono 500 unloaded",
  "IBM Plex Mono 500 unloaded",
  "IBM Plex Mono 500 loaded",
  "IBM Plex Mono 500 loaded",
  "IBM Plex Mono Fallback normal loa [... 9 more characters]
```

### Claude 16:35

`Bash  command: cd /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/scratchpad/lh && for i in 1 2; do npx --yes lighthouse@12 https://etf-kompas-kappa.vercel.app/ --form-factor=mobile --throttling-method=devtools --only-categories=performance --output=json --output-path=./app$i.json --chrome-flags="--headless=new" --quiet >/dev/null 2>&1; done; pytho [... 417 more characters]`

### Tool result 16:35

```
app1.json 100 FCP 1.0 s LCP 1.0 s CLS 0.008 TBT 40 ms devtools
app2.json 100 FCP 0.9 s LCP 0.9 s CLS 0.008 TBT 30 ms devtools
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 16:36

`Bash  command: grep -n "Performance" README.md | cut -c1-400; grep -n "Lighthouse\|applied\|simulat" docs/decisions/0042-inline-css.md | head -8`

### Tool result 16:36

```
55:- **Performance** was measured under applied throttling on `/` only; the other pages were measured only in the default, pessimistic mode (note 0042). The JS budget is 149.97 KB of 150 KB: about 30 bytes are left, so any further client code needs a decision.
9:The page's CSS (about 9 KB) was served as three render-blocking files, so the first paint waited for them. Lighthouse with applied throttling gave an LCP of 1.90 s on `/`; SPEC §22 asks for under 2.0 s.
22:- The default simulated LCP (~2.65 s) hardly moved; it stays near 2.6 s even on `/zasady`, so SPEC §22 now names applied throttling as the gate.
```

### Claude 16:36

`Bash  command: git checkout -q -b docs/lighthouse-live && git branch -D perf/lcp-cookie-bar -q; python3 - <<'E' ⏎ p='README.md'; s=open(p).read() ⏎ a="- **Performance** was measured under applied throttling on '/' only; the other pages were measured only in the default, pessimistic mode (note 0042)." ⏎ assert a in s ⏎ s=s.replace(a,"- **Performance on the live site** ('https://etf-kompas-kappa.vercel.ap [... 4013 more characters]`

### Tool result 16:36

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/97
```

### Claude 16:36

Investigation closed, no fix needed: the LCP is fine where the spec measures it, and the 2.4 s was a Lighthouse estimate. I recorded the results in [#97](https://github.com/Phunkhouse/etf-kompas/pull/97), which is documentation only. `pnpm format:check` passes, and I haven't read its CI results.

**Results on the live site (Lighthouse 12.8.2, mobile)**

| Mode | Performance | LCP | CLS | TBT |
| --- | --- | --- | --- | --- |
| Applied throttling (the spec's gate, note 0042) | 100 | **0.9 to 1.0 s** | 0.008 | 30 to 40 ms |
| Simulated (Lighthouse default) | 97 to 99 | 2.3 to 2.4 s | 0 to 0.006 | 10 to 40 ms |

- **Accessibility and best practices:** 100 on `/` and `/?v=b`. SEO is 63 only because of the intended `noindex`.
- **The simulated LCP** is Lighthouse's estimate, not a measured time. An emulated slow phone (4× CPU, slow 4G) actually paints the cookie bar's text at 0.56 s.
- **The LCP element** is the cookie bar's paragraph, as the report said. It's plain HTML painted at once, so there was no late reveal to fix.
- **Note 0042** already says the gate is applied throttling. The simulated figure was about 2.65 s then, so 2.3 to 2.4 s is slightly better.

**My mistake.** I told you the LCP target was "not met" from the simulated number alone and offered to change the cookie bar. I hadn't checked which mode the spec gates on. One more run in the right mode showed there was nothing to fix. That's in the AI log.

**Not measured:** only `/` and `/?v=b`. The results, privacy and unsubscribe pages were not measured live, and the README says so. No code changed.

**Left for the phase**
- **README sections** (§16 items 7, 8, 10 to 12).
- **The decision audit** of notes 0019, 0025 and 0023.
- **Meta Test Events**, plus the unreported in-app items.
- **`EMAIL_MODE`:** the decision you wanted to make at the end of the phase.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.

Which one first? I'd take the README sections, since the deadline is Friday.

### David 16:42

#97 landed, let's move to the README

### Claude 16:42

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b docs/readme-complete && wc -l README.md && cat README.md`

### Tool result 16:42

```
79 README.md
# ETF Kompas

Czech-language, mobile-first lead-gen landing page for ETF cost comparison.
Source of truth: [docs/SPEC.md](docs/SPEC.md).

> README stub. The full structure is defined in SPEC §16. Dev phases: [docs/PHASES.md](docs/PHASES.md).

### Expected conversion and assumptions

These are assumptions, not measurements, to be replaced by the first 500 sessions. Cold paid-social mobile traffic, e-mail-only form, value shown before the ask: visit to `calc_start` 30 to 40 %, `calc_start` to `calc_result` 70 to 80 %, `calc_result` to `lead` 25 to 35 %. Visit to lead: about 8 % (plausible range 4 to 14 %). Reasoning: generic finance lead-gen pages report single-digit conversion; a [... 11545 more characters]
```

### Claude 16:42

`Bash  command: sed -n 1,130p docs/SPEC.md`

### Tool result 16:42

```
# SPEC: ETF landing page for Czech mobile traffic (Clientelo test project)

Status: draft v4, 2026-10-13 (synced with wireframe rev. 6 and the decision notes up to 0043; audience v2 and plain-language rules merged). Audience of this document: the developer (reviewer) and the Claude Code agents doing the implementation.

---

## 0. The one-line answer

**A mobile-first Czech landing page where the visitor enters a monthly amount and a horizon, instantly sees what the European fund they can actually buy costs them in CZK (fund fee, conversion of korunas and broker fees, broker by broker), and unlocks the full comparison of 5 funds and 5 brokers ("ETF Kompas 2026", personalised PDF + results pa [... 12261 more characters]
```

### Claude 16:42

`Bash  command: sed -n 130,232p docs/SPEC.md`

### Tool result 16:42

```
**Ad A: "Which fund can you really buy" (clarity)**
- Hook: the question which ETF a Czech can really buy, answered in 20 seconds. The creative shows a big unknown ("? z 5") that is a placeholder until verified.
- Hero: the landing page, see Landing variants below.

**Ad B: "Same index, different fund and broker" (curiosity)**
- Hook: two European twins of the same index side by side with their fees, and the question "U koho je koupíte a za kolik?".
- An absolute claim such as *"Americký fond z Česka nekoupíte"* is allowed **only** if the evidence file for every firm in the table (§18) proves it on the launch date. Otherwise use the soft wording ("u většiny brokerů nekoupíte").
- Hero: the l [... 8972 more characters]
```

### Claude 16:42

`Bash  command: sed -n 312,345p docs/SPEC.md; sed -n 645,690p docs/SPEC.md; cat data/sources.json | python3 -c "import json,sys;d=json.load(sys.stdin);print(len(d));[print(x['publisher'],'|',x['title'][:70]) for x in d]" | head -50`

### Tool result 16:42

```
## 14. Priorities and phases

**P0: launch blockers** (must exist for "launch tomorrow")
- Hero matched to both ads, calculator with tested maths, gate and one-field form, server-side lead storage, delivery email and instant success state, Kompas results page plus the personalised PDF
- Real sourced data with the build-time validator
- Consent banner and the full event taxonomy through `lead`, including server-side `lead`
- Privacy policy page (draft, flagged for legal review), risk disclaimers, mobile performance budget
- Deployed on Vercel; README complete

**P1:** funnel dashboard, `docs/LEGAL-PACK.md`, monthly data-refresh action, Playwright e2e in CI, Lighthouse CI, OG image, basic erro [... 7388 more characters]
```

### Claude 16:42

`Bash  command: python3 - <<'E' ⏎ import re ⏎ s=open('docs/AI-LOG.md').read() ⏎ print(len(s.splitlines()),'lines') ⏎ heads=[(m.start(),m.group(0)) for m in re.finditer(r"^#{2,3} .*$",s,re.M)] ⏎ print(len(heads),'sections') ⏎ for i,(pos,h) in enumerate(heads): ⏎     end=heads[i+1][0] if i+1<len(heads) else len(s) ⏎     body=s[pos:end] ⏎     m=re.search(r"(?:\*\*Mistakes[^\n]*\*\*|^#+ Mistakes[^\n]*|\*\*Wh [... 229 more characters]`

### Tool result 16:42

```
1342 lines
98 sections

## Phase 1: CI, data, validator | mistakes: 7
   - Commit author email blocked the first push.
   - Another project's name in a commit message.
   - CI failed on `esbuild`.
   - First draft of the validator tests was incomplete.
   - Commit on the wrong branch.
   - Spec gap handled by the agent, not the spec.
   - Brokers were not named in the spec.

## Phase 1b: design foundation | mistakes: 0

### Phase 1b PR 1: tokens, fonts, contrast check | mistakes: 0

### Phase 1b PR 2: basic primitives | mistakes: 0

### Phase 1b PR 3: Slider, Field, NumberDisplay, StackedBar | mistakes: 0

### Phase 1b closed | mistakes: 0

## Phase 2: calculator | mistakes: 0

### PR A: met [... 20241 more characters]
```

### Claude 16:42

Gathering the last facts I need to describe the page order and the maths accurately, then I'll draft.

### Claude 16:42

`Bash  command: grep -n "^#\|^##" docs/METHODOLOGY-V2.md | head -30; sed -n 1,40p docs/METHODOLOGY-V2.md | cut -c1-300; grep -n "<Section\|<Hero\|<Calculator\|<LeadForm\|<Faq\|<Trust\|<Explain\|<Preview\|<Cost\|<Footer\|<StickyBar\|<SourceBar\|<Site" src/app/landing-page.tsx | head -30`

### Tool result 16:42

```
1:# Calculator methodology, version 2 (draft)
5:## 1. What changes, and why
20:## 2. Inputs
34:### Exchange rates, fetched daily (decided, note 0038)
47:## 3. The broker fee model (**Proposed**)
71:## 4. Formulas
100:## 5. Brokers, and the saving box
107:## 6. Clamping and units (unchanged, **Proposed** as in version 1)
111:## 7. Golden cases (to be computed by David)
133:### How to compute a golden case
169:## 8. Decided, and still open
# Calculator methodology, version 2 (draft)

Status: **draft for review** (after wireframe rev. 4, decision note 0035). It replaces [METHODOLOGY.md](METHODOLOGY.md) once approved and implemented; until then the current calculator keeps working. Anything mark [... 4335 more characters]
```

### Claude 16:42

`Bash  command: grep -n "^import\|<[A-Z][A-Za-z]*" src/app/landing-page.tsx | sed -n 1,60p; grep -rn "rates.json" docs/*.md README.md CLAUDE.md data/README.md | cut -c1-130`

### Tool result 16:42

```
1:import { Landing } from '@/components/Landing'
2:import { calculatorData } from '@/server/calculator-data'
3:import { bundledData } from '@/server/data/bundled'
4:import {
9:import { landingData } from '@/server/landing-data'
10:import { getRates } from './rates'
30:    <Landing
docs/AI-LOG.md:346:**Produced:** `priceBroker` and `priceBrokers` (`src/server/broker-pricing.ts`), `fundFeeKc`, the schema for br
docs/AI-LOG.md:1235:**Produced:** `docs/PHASE-6-PLAN.md`; the 51 values removed from `data/*.json`; `data/rates.json` deleted; sch
docs/METHODOLOGY-V2.md:40:- **Fallback.** If the fetch fails or the answer cannot be read, the verified record in `data/rates.json
docs/SPEC.md:120:- Storag [... 455 more characters]
```

### Claude 16:42

`Bash  command: grep -n "<[A-Z][A-Za-z]*\b" src/components/Landing/Landing.tsx | sed -n 1,40p; ls src/app/srovnani/\[token\]; ls src/components | tr '\n' ' '`

### Tool result 16:42

```
49:      <SourceBar dataAsOf={dataAsOf} />
50:      <SiteHeader />
52:        <HeroB
60:          <CalculatorSection data={calculator} variant={shown} />
62:        <HiddenCosts />
63:        <EmailPreview />
64:        <TrustBlock />
65:        <Faq facts={faqFacts} />
67:      <SiteFooter />
68:      <StickyBar />
69:      <Tracker />
not-found.tsx
page.tsx
pdf
BrokerPicker Button Calculator CalculatorSection Callout Chip Container CookieConsent EmailPreview Faq Field HeroB HeroTable HiddenCosts Landing LeadForm MobileMenu NotFound NumberDisplay PdfDocument Pill PrivacyPolicy ResendCard ResendForm ResultsGone ResultsPage Section SiteFooter SiteHeader Slider SourceBar StackedBar StatusCard  [... 47 more characters]
```

### Claude 16:43

I have what I need. Drafting the full README now, reusing the existing sections word for word where they're already right and writing the missing ones from the spec, the code and the AI log.

### Claude 16:44

`Bash  command: python3 - <<'PYEOF' ⏎ import re ⏎ old=open('README.md').read() ⏎  ⏎ def between(start, end=None): ⏎     i=old.index(start) ⏎     j=old.index(end,i) if end else len(old) ⏎     return old[i:j] ⏎  ⏎ conv=between("### Expected conversion and assumptions","### Three A/B hypotheses") ⏎ hyp=between("### Three A/B hypotheses","## Known gaps") ⏎ gaps=between("## Known gaps","## Deploy") ⏎  ⏎ # --- [... 28567 more characters]`

### Tool result 16:44

```
254 README.md
11:## Contents
26:## 1. Target audience and the "NYSE vs UCITS" decision
34:## 2. Offer, gate moment, form, post-submit
43:## 3. The two ads and the UTM scheme
53:## 4. Section order and rationale
69:## 5. Interactive element and methodology
80:## 6. Data sources
91:## 7. Tracking plan and how to read the funnel
127:## 8. Expected conversion and assumptions
135:## 9. Three A/B hypotheses, ranked by expected impact
143:### How test 2 would be run (designed, not run)
153:## 10. How the work was done with AI
180:## 11. What is missing and known risks
218:## 12. Run, test, deploy
252:### Testing on a real phone
```

### Claude 16:44

The draft is written. Before anyone reads it, I'm checking its claims against the repo, since my rules say to verify every claim about it. A few I already suspect need fixing.

### Claude 16:44

`Bash  command: ls docs/decisions/0*.md | wc -l; gh pr list --state all --limit 300 --json number | python3 -c "import json,sys;print('PRs',len(json.load(sys.stdin)))"; grep -n "copy" .github/workflows/ci.yml package.json | head; grep -n "golden\|G3\|computed by David\|hand" docs/AI-LOG.md | sed -n 1,12p | cut -c1-200; grep -n "not verified on Vercel\|Not live\|(Phase 6)" README.md | cut -c1-120; grep -n [... 125 more characters]`

### Tool result 16:44

```
68
PRs 97
package.json:16:    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm contrast:check && pnpm copy:check",
package.json:23:    "copy:check": "tsx scripts/check-copy.ts"
24:- **Spec gap handled by the agent, not the spec.** SPEC §5 requires the build to fail on `TODO_VERIFY` while §18 requires placeholders, so strict CI would be red from day one. The agent proposed 
85:- `docs/METHODOLOGY.md`: formulas step by step (closed-form month-end annuity), the proposed breakdown rule, clamping, gap rule and a golden-case input table with the results left for David.
94:- Golden cases G1 to G3 computed by David in a spreadsheet and added to METHODOLOGY §9. David approved the Proposed i [... 1776 more characters]
```

### Claude 16:44

`Bash  command: grep -n "checkCopy(copy\|from '@/content/copy'\|real copy\|passes the copy" src/lib/copy-check.test.ts | head -5; sed -n 14,32p .github/workflows/ci.yml`

### Tool result 16:45

```
7:  return checkCopy(copy, { tickers })
293:describe('the real copy', () => {
298:    expect(checkCopy(copy, { tickers })).toEqual([])
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: pnpm/setup@f618924e009e490c5badb81bc821e794d0ced591 # v3.1.0
        with:
          runtime: node@24
          cache: true
          require-lockfile: true
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm data:validate:draft
      - run: pnpm contrast:check
      - run: pnpm build

  e2e:
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@3d3c42e5aac5b [... 36 more characters]
```

### Claude 16:45

`Bash  command: python3 - <<'E' ⏎ p='README.md'; s=open(p).read() ⏎ def sub(a,b): ⏎     global s ⏎     assert a in s,a[:60] ⏎     s=s.replace(a,b,1) ⏎ sub("(note 0065 and section 11)","(section 11)") ⏎ sub("A phone step (\"leave your number\") was moved out of scope until the lead recipient is defined (note [0009](docs/decisions/0009-lead-recipient-and-no-third-party-sharing.md)).","A phone step (\"leave [... 4439 more characters]`

### Tool result 16:45

```
$ prettier --check .
All matched files use Prettier code style!
254
```

### Claude 16:45

`Bash  command: python3 - <<'E' ⏎ p='README.md'; s=open(p).read() ⏎ a="the author supplied the fund and broker documents and signed each value as 'verifiedBy' with the document's SHA-256;" ⏎ assert a in s ⏎ s=s.replace(a,"the author supplied or confirmed the fund and broker documents, and every value is signed 'verifiedBy' with the document's SHA-256 in its evidence;") ⏎ open(p,'w').write(s) ⏎ E ⏎ cat >> [... 4896 more characters]`

### Tool result 16:45

```
Tests  920 passed (920)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/98
```

### Claude 16:46

The README is rewritten into the 12 sections of SPEC §16 and open as [#98](https://github.com/Phunkhouse/etf-kompas/pull/98). It's 254 lines. `pnpm check` (920 tests) and `pnpm format:check` pass, and I haven't read the CI results.

**What's in it**
- **Kept as they were:** the conversion assumptions, the three A/B hypotheses and "how test 2 would be run".
- **Updated to the end of Phase 6:**
  - The known gaps now describe a deployed demo.
  - The PDF opened on Vercel.
  - The Meta server call is "built, not enabled".
  - It mentions the e-mail finding: an address on your own domain is lost in the forwarding.
- **New:**
  - Audience and the NYSE vs UCITS decision.
  - Offer and gate.
  - Ads and the UTM scheme.
  - Section order.
  - Methodology.
  - Data sources.
  - The tracking plan with a funnel SQL query.
  - Lead economics.
  - Run, test and deploy.
  - A top-6 risk list ahead of the full gaps.

**Please look at these**
1. **Section 10 ("How the work was done with AI") is my summary from `docs/AI-LOG.md`.** It's written in the third person so you can rewrite it in your own voice. Check "What the author decided and checked" especially.
2. **The funnel SQL in section 7 is untested.** I wrote it from the table definition. Run it once in the Supabase SQL editor.
3. **`README.cs.md` is not written.** The spec puts it after P0 and P1, and the README says so.

**Mistakes I fixed in my own first draft**
While checking my draft against the repo, I had cited two notes that don't say what I claimed (0009 for the phone step, 0065 for the GA4 Measurement Protocol). I had also credited the wrong-share-class EQQQ documents to the agent, when you supplied them and the agent noticed. I had also claimed you "did not delegate" things I couldn't support from the repo. All three are corrected, and the AI-LOG entry lists them.

**Doc drift I did not fix:** SPEC §4 and §5 and METHODOLOGY-V2 §2 still describe `data/rates.json` as the exchange-rate fallback, which note 0066 removed. The README says what is true now. Syncing those two files changes a spec decision, so I'm asking before I do it. Say yes and I'll open a small docs PR.

**Left for the phase**
- **Meta Test Events**, plus the unreported in-app items.
- **The decision audit** of notes 0019, 0025 and 0023.
- **`EMAIL_MODE`**, which you decide at the end of the phase.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.

What next? I'd suggest the decision audit, because it needs a short conversation with you and then only notes.

### David 16:56

#98 landed. Now for the audit

### Claude 16:56

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b docs/decision-audit && cat docs/decisions/0019-cost-breakdown-added-one-at-a-time.md docs/decisions/0023-index-dividend-yield-source.md docs/decisions/0025-withholding-rate-15-for-all-funds.md; grep -n "Source of fxFeePct" -A14 docs/METHODOLOGY.md | head -30`

### Tool result 16:56

```
# 0019. Cost breakdown: costs added one at a time, per fund

Date: 2026-10-11
Status: accepted
Phase: 2

## Context

SPEC §21 defines only the total cost (`FV_gross - FV_net`). Wireframe B shows three lines under it: fund fee, currency conversion, tax withheld by the USA. Splitting a total that comes from compounding is a formula choice, because the costs interact slightly.

## Decision

Add the costs to the no-cost baseline one at a time, in the wireframe's order (TER, then FX fee, then dividend withholding). Each part is the drop in final value caused by the cost just added, so the parts add up exactly to the total (`docs/METHODOLOGY.md` §5). The rounding remainder goes to the largest part [... 5344 more characters]
```

### Claude 16:57

`Bash  command: python3 - <<'E' ⏎ import json ⏎ b=json.load(open('data/brokers.json')) ⏎ for x in b: ⏎     fx=x.get('fees',{}).get('fx',{}) ⏎     print(x['id'],{k:(v['value'],v['asOf']) for k,v in fx.items()}) ⏎ E ⏎ grep -rn "dividendYield\|withholding" src --include=*.ts --include=*.tsx 2>/dev/null | grep -v "test\|schema.ts\|needs.ts" | head; sed -n 71,100p docs/METHODOLOGY-V2.md | cut -c1-260; grep -r [... 108 more characters]`

### Tool result 16:57

````
degiro {'USD': (0.25, '2026-10-12'), 'EUR': (0, '2026-10-12')}
fio {'EUR': (2.766, '2026-10-13')}
ibkr {'EUR': (0.03, '2026-10-13'), 'USD': (0.03, '2026-10-13')}
trading212 {'USD': (0.15, '2026-10-13'), 'EUR': (0.15, '2026-10-13')}
xtb {'USD': (0.5, '2026-09-30'), 'EUR': (0.5, '2026-09-30')}
(eval):8: no matches found: --include=*.ts
## 4. Formulas

`m(r) = (1 + r)^(1/12) - 1` and `A(r) = ((1 + r)^Y - 1) / m(r)` (for `r = 0`, `A = 12 x Y`): the future value of one unit paid at the end of each month. This is unchanged from version 1 (METHODOLOGY §3).

Per broker, in Kč. `rate` is Kč per unit of the listing currency (`1` for CZK).

```
f   = fx[listing currency] / 100                       (0  [... 1632 more characters]
````

### Claude 16:57

`Bash  command: grep -rln "dividendYieldPct\|withholdingRate\|dividendYield" src scripts e2e 2>/dev/null; echo ---; grep -rn "Za co platíte\|daň\|zdan" src/content/copy.ts | head -6 | cut -c1-200; echo ---; sed -n 1,14p docs/decisions/0037-calculator-v2-decisions.md | cut -c1-300; python3 - <<'E' ⏎ import json ⏎ e=json.load(open('data/etfs.json')) ⏎ from datetime import date,timedelta ⏎ for x in e: ⏎     [... 220 more characters]`

### Tool result 16:57

```
src/server/data/schema.ts
src/server/data/validate.test.ts
src/server/data/needs.ts
---
src/content/copy.ts:33:    risk: 'Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství.',
src/content/copy.ts:184:      'Ne. Ukazujeme poplatky a dostupnost. Není to investiční ani daňové poradenství. Rozhodnutí je na vás.',
src/content/copy.ts:201:// "Za co platíte, aniž to vidíte": three plain cards. No figures here, on
src/content/copy.ts:204:  heading: 'Za co platíte, aniž to vidíte',
src/content/copy.ts:472:    note: 'Obecná informace, ne daňové poradenství.',
src/content/copy.ts:515:    advice: 'Obecná informace, ne investi [... 1836 more characters]
```

### Claude 16:57

I read notes 0019, 0023 and 0025 against the code and data as they are now. Most of the original concerns turn out to be settled or moot, but the audit found one problem that matters before the data goes stale.

| Note | Original concern | Status today |
| --- | --- | --- |
| **0019** one conversion fee for every fund | The euro-listed twin probably pays no conversion fee, so one fee understates the American fund's disadvantage. | **Resolved by calculator v2.** Conversion is now per broker and per listing currency. DEGIRO has EUR = 0 and USD = 0.25, the other brokers have their own values, and a CZK listing pays none. The single fee no longer exists. |
| **0019** breakdown "one cost at a time" | Parts must add up to the total, and the remainder goes to the largest part. | **Still true, with different parts.** v2 adds fund fee, then conversion, then broker fees (METHODOLOGY-V2 §4). The note still names withholding as the third part. |
| **0023** dividend yield per index | Index yield for the S&P 500, an SEC yield for the Nasdaq-100. David accepted the S&P 500 choice without a reason. | **Moot for the product.** v2 took yield out of the formula, and no code or page uses it. The data is still stored and validated. |
| **0025** 15 % withholding for all funds | Effective rates are 14.1 to 14.4 %, but the reports are too old, so 15 was used for all. | **Moot for the product** for the same reason. It still has open caveats: the Czech-US text is the 1994 publication with amendments not checked. |

**The finding.** These unused fields are still checked by the strict gate, so they can stop a deploy:

- **2026-10-29:** VOO's name, index and ISIN go stale. The page uses VOO only for its ticker and the availability claim, and shows none of that data.
- **2027-01-28 to 2027-02-09:** `indexName`, `domicile`, `dividendYieldPct` and `withholdingRate` go stale for all funds. Nothing displays them.

The first of these arrives before the project is likely to be touched again, so a real deploy would fail on data nobody sees. The earlier **25 Oct** stop (the EQQQ KID) is different: that fee is displayed.

### Claude 16:57

`AskUserQuestion  {"questions": [{"question": "What should happen to the stored but unused fields (dividend yield, withholding rate, indexName, domicile, and VOO/QQQ name, ISIN and fee), which the strict gate will otherwise stop a deploy on?", "header": "Unused data", "multiSelect": false, "options": [{"label": "Drop them (Recommended)", "description": "Remove them from the model and the files. Nothing displays the [... 1111 more characters]`

### Tool result 16:58

```
Your questions have been answered: "What should happen to the stored but unused fields (dividend yield, withholding rate, indexName, domicile, and VOO/QQQ name, ISIN and fee), which the strict gate will otherwise stop a deploy on?"="Drop them (Recommended)", "How should notes 0019, 0023 and 0025 be marked?"="New audit note, old ones marked (Recommended)". You can now continue with these answers in mind.
```

### Claude 16:58

Both answers recorded: drop the unused fields, and write a new audit note while marking the old ones. First checking exactly what depends on those fields before I remove anything.

### Claude 16:58

`Bash  command: git checkout -q -b fix/drop-unused-fund-fields && for f in isin indexName domicile; do echo "== $f"; grep -rnw "$f" src scripts e2e 2>/dev/null | grep -v "\.test\.\|schema.ts\|needs.ts" | head -5; done; echo "== ter/name/isin for voo/qqq usage"; grep -rn "voo\|qqq" src --include=*.ts --include=*.tsx 2>/dev/null | head -0; grep -rn "'voo'\|'qqq'\|\"voo\"" src scripts e2e 2>/dev/null | grep [... 314 more characters]`

### Tool result 16:58

```
== isin
== indexName
== domicile
== ter/name/isin for voo/qqq usage
(eval):1: no matches found: --include=*.ts
head: illegal line count -- 0
src/app/styleguide/Primitives.tsx:21:    id: 'voo',
src/app/styleguide/Primitives.tsx:34:    id: 'qqq',
src/server/landing-data.ts:26:const ORIGINALS = ['voo', 'qqq']
src/server/data/needs.ts:80:export const ORIGINALS = ['voo', 'qqq']
UNREF Trading 212 Costs & Charges Disclosure
UNREF XTB Podmínky a poplatky: Akcie a ETF (Czech page)
```

### Claude 16:59

`Bash  command: python3 - <<'E' ⏎ import json ⏎ p='data/etfs.json'; e=json.load(open(p)) ⏎ drop_all={'dividendYieldPct','withholdingRate','indexName','domicile'} ⏎ keep_meta={'id','ticker','region','indexGroup'} ⏎ for x in e: ⏎     for k in list(x): ⏎         if k in drop_all: del x[k] ⏎         elif x['id'] in ('voo','qqq') and k not in keep_meta: del x[k] ⏎ json.dump(e,open(p,'w'),indent=2,ensure_ascii [... 993 more characters]`

### Tool result 16:59

```
[('voo', ['id', 'indexGroup', 'region', 'ticker']), ('qqq', ['id', 'indexGroup', 'region', 'ticker']), ('cspx', ['distribution', 'id', 'indexGroup', 'isin', 'name', 'region', 'ter', 'ticker']), ('vuaa', ['distribution', 'id', 'indexGroup', 'isin', 'name', 'region', 'ter', 'ticker']), ('cndx', ['distribution', 'id', 'indexGroup', 'isin', 'name', 'region', 'ter', 'ticker']), ('vusa', ['distribution', 'id', 'indexGroup', 'isin', 'name', 'region', 'ter', 'ticker']), ('eqqq', ['distribution', 'id', 'indexGroup', 'isin', 'name', 'region', 'ter', 'ticker'])]
Generating route types...
✓ Types generated successfully
src/server/broker-pricing.test.ts(317,17): error TS18048: 'cspx.ter' is possibly 'und [... 2130 more characters]
```

### Claude 16:59

`Bash  command: sed -n 70,100p src/server/calculator-data.ts; sed -n 120,145p src/server/data/gaps.ts; sed -n 308,320p src/server/broker-pricing.test.ts; sed -n 60,80p src/server/data/gaps.test.ts; sed -n 168,182p src/server/data/needs.ts`

### Tool result 16:59

```
export function calculatorData(
  raw: unknown,
  rates: ChosenRates,
  fundId: string,
): CalculatorData | null {
  const parsed = dataSchema.safeParse(raw)
  if (!parsed.success) return null
  const { etfs, brokers } = parsed.data

  const fund = etfs.find((etf) => etf.id === fundId)
  if (!fund || !isVerified(fund.ter) || typeof fund.ter.value !== 'number') {
    return null
  }

  const chosen: Partial<Rates> = {}
  const dates: string[] = []
  for (const currency of ['EUR', 'USD'] as const) {
    const rate = rates[currency]
    if (rate) {
      chosen[currency] = rate.rate
      dates.push(rate.date)
    }
  }

  return {
    fundId,
    ticker: fund.ticker,
    ter: fund.ter.value,
  [... 3019 more characters]
```

### Claude 16:59

`Bash  command: python3 - <<'E' ⏎ import re ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:50]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('src/server/calculator-data.ts',"if (!fund || !isVerified(fund.ter) || typeof fund.ter.value !== 'number') {","if (\n    !fund ||\n    !fund.ter ||\n    !isVerified(fund.ter) ||\n    typeof fund.ter.value !== 'number'\n  ) {") ⏎ sub('src/server/data/gap [... 1370 more characters]`

### Tool result 16:59

```
`To do: ${uniqueMissing} different missing values in the data model, and ${notInModel} values the model has no place for yet (NEW).`,
  )
  const unusedFunds = unusedFundIds.length
    ? `funds ${unusedFundIds.join(', ')}; `
    : ''
  console.log(
    `Not used by any rev. 4 screen (not worth verifying now): ${unusedFunds}no fund fields.`,
  )
}

main()
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
scripts/data-gaps.ts(3,17): error TS2724: '"@/server/data/needs"' has no exported member named 'unusedFundFields'. Did you mean 'unusedFundIds'?
[ELIFECYCLE] Command failed with exit code 2.
```

### Claude 16:59

`Bash  command: sed -n 1,12p scripts/data-gaps.ts; python3 - <<'E' ⏎ import re ⏎ p='scripts/data-gaps.ts'; s=open(p).read() ⏎ s=re.sub(r"  const unusedFunds = unusedFundIds\.length.*?\n  \)\n(?=\}\n)","",s,flags=re.S) ⏎ open(p,'w').write(s) ⏎ E ⏎ sed -n 30,48p scripts/data-gaps.ts`

### Tool result 16:59

```
import { computeGaps, summarize } from '@/server/data/gaps'
import { loadData } from '@/server/data/load'
import { needs, unusedFundFields, unusedFundIds } from '@/server/data/needs'
import { dataSchema } from '@/server/data/schema'

// What the rev. 4 screens still need from data/*.json (see docs/DATA-NEEDS.md).
// Informational: the exit code is 0. `pnpm data:validate` is the deploy gate.
async function main() {
  const data = dataSchema.parse(await loadData())
  const gaps = computeGaps(data, needs)

  let screen = ''

  const { total, verified, uniqueMissing, notInModel } = summarize(gaps)
  console.log(
    `\ndata:gaps: ${verified} of ${total} values verified (a value two screens need  [... 186 more characters]
```

### Claude 16:59

`Bash  command: python3 - <<'E' ⏎ p='scripts/data-gaps.ts'; s=open(p).read() ⏎ s=s.replace("import { needs, unusedFundFields, unusedFundIds } from '@/server/data/needs'","import { needs } from '@/server/data/needs'") ⏎ open(p,'w').write(s) ⏎ p='src/server/data/needs.ts'; s=open(p).read() ⏎ s=s.replace("export const unusedFundIds: string[] = []\n","") ⏎ open(p,'w').write(s) ⏎ E ⏎ npx prettier --write src  [... 210 more characters]`

### Tool result 16:59

```
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
$ eslint .
       × reports a missing required field as MALFORMED 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  |unit| src/server/data/validate.test.ts > validateData > malformed input > reports a missing required field as MALFORMED
      Tests  1 failed | 919 passed (920)

data:validate (strict): 0 errors, 0 warnings

data:gaps: 138 of 138 values verified (a value two screens need counts twice)
To do: 0 different missing values in the data model, and 0 values the model has no place for yet (NEW).
[This command modified 1 file you've previously read: src/server/data/needs.ts. Call Read before editing.]
```

### Claude 16:59

`Bash  command: grep -n "reports a missing required field as MALFORMED" -B2 -A14 src/server/data/validate.test.ts`

### Tool result 16:59

```
289-    })
290-
291:    it('reports a missing required field as MALFORMED', () => {
292-      const withoutTer = { ...etf(), ter: undefined }
293-      const result = run(data({ etfs: [withoutTer] }))
294-      expect(result.issues).toContainEqual(
295-        expect.objectContaining({ code: 'MALFORMED', path: 'etfs[0].ter' }),
296-      )
297-    })
298-
299-    it('does not throw on garbage input', () => {
300-      expect(() =>
301-        validateData(null, { today: TODAY, mode: 'strict' }),
302-      ).not.toThrow()
303-      expect(validateData(null, { today: TODAY, mode: 'strict' }).ok).toBe(
304-        false,
305-      )
```

### Claude 17:00

`Bash  command: python3 - <<'E' ⏎ p='src/server/data/validate.test.ts'; s=open(p).read() ⏎ a=s.index("    it('reports a missing required field as MALFORMED', () => {"); b=s.index("    it('does not throw on garbage input'") ⏎ new="""    it('reports a missing required field as MALFORMED', () => { ⏎       const withoutTicker = { ...etf(), ticker: undefined } ⏎       const result = run(data({ etfs: [withoutT [... 783 more characters]`

### Tool result 17:00

```
Tests  921 passed (921)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
[This command modified 1 file you've previously read: src/server/data/validate.test.ts. Call Read before editing.]
```

### Claude 17:00

`Bash  command: python3 - <<'E' ⏎ import json ⏎ e=json.load(open('data/etfs.json')); b=json.load(open('data/brokers.json')); s=json.load(open('data/sources.json')) ⏎ txt=json.dumps(e)+json.dumps(b) ⏎ orph=[x for x in s if txt.count('"'+x['url']+'"')==0] ⏎ for x in orph: print('ORPHAN',x['publisher'],'|',x['title'][:75]) ⏎ E ⏎ cp /tmp/stale-check.ts scripts/_tmp-stale.ts && pnpm -s exec tsx scripts/_tmp-s [... 80 more characters]`

### Tool result 17:00

```
ORPHAN Vanguard | Vanguard S&P 500 ETF (VOO) factsheet, 30 June 2026
ORPHAN Vanguard | Vanguard S&P 500 ETF prospectus, 28 April 2026 (address printed in the pros
ORPHAN Invesco | Invesco QQQ Trust, Series 1 fund page, printed 2026-10-11
ORPHAN Invesco | Invesco QQQ Trust, Series 1 prospectus, 22 December 2025 (SEC filing)
ORPHAN S&P Dow Jones Indices | S&P 500 index factsheet, 30 September 2026
ORPHAN Czech Republic, e-Sbírka | Czech-US double taxation treaty, No. 32/1994 Sb., Article 10 (dividends)
ORPHAN US Internal Revenue Service | US-Ireland income tax convention, Article 10 (dividends)
ORPHAN Trading 212 Markets Ltd | Trading 212 Costs & Charges Disclosure
ORPHAN XTB | XTB Podmínky a  [... 324 more characters]
```

### Claude 17:00

`Bash  command: python3 - <<'E' ⏎ import json ⏎ s=json.load(open('data/sources.json')) ⏎ drop=("Vanguard S&P 500 ETF (VOO) factsheet","Vanguard S&P 500 ETF prospectus","Invesco QQQ Trust, Series 1 fund page","Invesco QQQ Trust, Series 1 prospectus","S&P 500 index factsheet","Czech-US double taxation treaty","US-Ireland income tax convention") ⏎ keep=[x for x in s if not x['title'].startswith(drop)] ⏎ pri [... 379 more characters]`

### Tool result 17:00

```
27 -> 20
data:validate (strict): 0 errors, 0 warnings
data/README.md:14:- `domicile` of a UCITS fund is the country its KID or factsheet names. US prospectuses do not state one, so for a US-listed fund it is `US`, with the e
docs/METHODOLOGY-V2.md:12:| Parts                       | fund fee, conversion, withholding | fund fee, conversion, **broker fees**                          |
docs/METHODOLOGY-V2.md:13:| Dividend yield, withholding | in the formula                    | **not in the formula** (still in the data, used for text only) |
docs/METHODOLOGY-V2.md:176:4. **Withholding and dividend yield** are not in the formula.
README.md:28:**Audience.** A Czech person of 25 to 40, on a phone, w [... 1786 more characters]
```

### Claude 17:00

`Bash  command: head -6 docs/decisions/0022-us-fund-domicile-convention.md; python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ import re ⏎ # data/README: drop the domicile convention line ⏎ p='data/README.md'; s=open(p).read() ⏎ s=re.sub(r"- 'domicile' of a UCITS fund.*?\n","",s,flags=re.S,count=1) ⏎ open(p,'w').write(s) ⏎ # DATA-NEED [... 1828 more characters]`

### Tool result 17:00

```
# 0022. Domicile of US-listed funds means "regulated in the US"

Date: 2026-10-11
Status: accepted
Phase: 3

86:- **No tax figure is on the page.** The dividend yield and withholding rate once stored for the o
```

### Claude 17:00

Data and docs are consistent now. Writing the audit note (with only the reasons you gave), marking the older notes, and then the log and PR.

### Claude 17:00

`Bash  command: cat > docs/decisions/0069-pre-release-audit-drop-unused-fund-fields.md <<'E' ⏎ # 0069. Pre-release audit: unused fund fields are dropped, and three older notes are marked ⏎  ⏎ Date: 2026-10-14 ⏎ Status: accepted ⏎ Phase: 6 ⏎  ⏎ Note: David chose the options below on 2026-10-14 from the findings the agent prepared ("Drop them" and "New audit note, old ones marked"). He gave no reason beyon [... 6426 more characters]`

### Tool result 17:01

```
Tests  921 passed (921)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 17:01

`Bash  command: git add -A && git commit -q -m "fix: drop unused fund fields after the pre-release audit ⏎  ⏎ Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" 2>&1 | tail -1; git push -q -u origin fix/drop-unused-fund-fields 2>&1 | tail -1; gh pr create --title "fix: drop unused fund fields after the pre-release audit" --body "$(cat <<'E' ⏎ ## What ⏎ The pre-release audit of notes 0019, 0023 an [... 1752 more characters]`

### Tool result 17:01

```
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/99
```

### Claude 17:01

`Bash  command: cd /Users/davidkrapka/.claude/projects/-Users-davidkrapka-dev-learning-etf-kompas/memory && cat > pre-release-decision-audit.md <<'E' ⏎ --- ⏎ name: pre-release-decision-audit ⏎ description: The pre-release audit of notes 0019, 0023, 0025 was done on 2026-10-14 (note 0069, PR #99); what it found ⏎ metadata: ⏎   type: project ⏎ --- ⏎  ⏎ Done 2026-10-14, PR #99, decision note 0069. Findings: [... 1045 more characters]`

### Tool result 17:01

```
3:- [Pre-release decision audit](pre-release-decision-audit.md) — done 2026-10-14 (note 0069, PR #99): unused fund fields dropped; ISIN staleness left open
Shell cwd was reset to /Users/davidkrapka/dev/learning/etf-kompas
```

### Claude 17:01

The audit is done and open as [#99](https://github.com/Phunkhouse/etf-kompas/pull/99), with decision note 0069. I haven't read its CI results. `pnpm check` (921 tests), `pnpm format:check` and strict `pnpm data:validate` pass, and `pnpm data:gaps` is unchanged at 138 of 138. I didn't run Playwright locally for this PR, since no screen reads the dropped fields. CI runs it.

**What the audit found**
- **0019 (single conversion fee):** resolved by calculator v2, where conversion is per broker and listing currency. The "costs added one at a time" breakdown rule still stands, with different parts.
- **0023 and 0025 (dividend yield, withholding):** moot. v2 took both out of the formula and nothing in the page, calculator or PDF reads them.
- **The real finding:** the strict gate also checks unused fields, so it would have stopped a deploy on 2026-10-29 (the VOO factsheet records) and again in late January 2027, over data nobody sees.

**What changed, as you chose ("drop them" and "new note, old ones marked")**
- **Dropped:** dividend yield, withholding rate, `indexName` and `domicile` for every fund, and every record of VOO and QQQ. They stay as tickers for the broker-availability claim.
- **Schema:** `name`, `isin`, `distribution` and `ter` are now optional. The twins still need all four, checked by `data:gaps`.
- **Sources:** seven that nothing cites any more were removed, so the registry is now 20 entries.
- **Notes:** 0019 is marked partly superseded, 0023 and 0025 superseded.
- **Gate dates:** the first failure is now 2026-10-25 (the EQQQ KID, which the page displays), then 2026-11-15 (the XTB fees).

**Two things to check**
1. **I also marked note 0022** (the US-fund domicile convention) as superseded, which you didn't name. Its field no longer exists, so leaving it "accepted" would be wrong. Overrule that in the PR if you disagree.
2. **No reason beyond your choice** is recorded in note 0069. It says so in its header, and your Q&A choices are the only reasons it attributes to you.

**One thing left open on purpose:** the twins' ISINs, which no code reads, go stale in late January 2027, the same kind of problem. I didn't touch them, since you didn't choose that. It's written in 0069 as a consequence.

**Left for the phase**
- **`EMAIL_MODE`:** your decision.
- **Meta Test Events:** needs your phone and the live address.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.
- **SPEC §4/§5 and METHODOLOGY-V2 §2:** the `rates.json` fallback drift, still waiting for your yes.

**My suggestion for the next step:** do the `EMAIL_MODE` decision and the closing docs together. Do you want to go over `EMAIL_MODE` now?

### David 17:06

Let's go for EMAIL_MODE. What are the options, pros and cons

### Claude 17:07

`Bash  command: git checkout -q main && git pull -q; grep -n "zkušeb\|test" -i src/server/emails.ts | head -8; grep -n "zkušeb" -i src/content/copy.ts | cut -c1-160 | head -6; grep -n "EMAIL_FROM" docs/DEPLOY.md | head -3; sed -n 1,30p docs/decisions/0011-test-sending-domain-and-email-mode.md | cut -c1-400`

### Tool result 17:07

```
62:<p style="margin:0 0 6px">${escapeHtml(text.footer.controller(footer.controller))} ${escapeHtml(shellCopy.footer.testNotice)}</p>
73:    shellCopy.footer.testNotice,
42:      'Zkušební projekt vytvořený jako ukázka. Není to nabídka investiční služby.',
182:      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Uchováváme ho jen o
488:    skipped: 'E-mail jsme neodeslali: zatím je zapnutý zkušební provoz.',
51:| `EMAIL_FROM`                  | yes             | no      | sender on the verified test domain, says it is a test project                                                                                                [... 1332 more characters]
```

### Claude 17:07

The code has two modes, and the one you choose decides who can receive the e-mail. This is how each behaves, from the code and the notes.

**What `EMAIL_MODE` controls:** only whether the e-mail with the links is sent. The results page and the PDF work either way, because the page is the primary delivery (SPEC §3.5, §23). In `sandbox` the page says nothing about an e-mail for an address not on the allowlist, and never claims one was sent.

| | `sandbox` (today) | `live` |
| --- | --- | --- |
| **Who gets e-mail** | Only addresses on `EMAIL_SANDBOX_ALLOWLIST`. | Any address typed in the form. |
| **For a reviewer or Clientelo** | They see the page, the results and the PDF, but **no e-mail**, unless you add their address to the allowlist beforehand. | They get the e-mail from the test domain and can see the whole flow, including the unsubscribe and tips-confirmation links. |
| **Pros** | No e-mail ever goes to a stranger. No personal data of third parties from mail. Nothing can hurt your domain's reputation. Safest while there is no legal review. | The demo works the way note 0011 and SPEC §17.15 intended ("real delivery to any visitor"). The e-mail path, including the footer saying it's a test project, is visible to whoever evaluates it. |
| **Cons** | A reviewer who doesn't know it's sandboxed may think the e-mail is broken. You need their address in advance. The e-mail path stays unseen by anyone but you. | Anyone with the link can enter any address (including someone else's), and that person gets one e-mail from your domain. Real people's e-mails are stored under a **placeholder controller and unreviewed privacy text**. Bounces and spam complaints land on `david-krapka.eu`, your own domain, which has DMARC `p=quarantine`. |
| **What limits the damage** | Not needed. | The form's limits (5 requests per IP an hour, 3 e-mails per address a day), one e-mail per submit (the tips e-mail only if ticked), a one-click unsubscribe, automatic deletion after 6 months, and a test-project notice in the footer and in every e-mail. There's no captcha, by design. |

**What I haven't verified for `live`**
- **Delivery to Seznam, Gmail and Outlook.** It's never been tested; only your `pm.me` address worked. A Czech audience mostly has Seznam, so this check matters most before going live.
- **Resend's limits on your plan** (daily and monthly sending caps). I didn't check, and a burst of visitors could hit them.
- **Whether a real recipient's mail provider accepts mail from your domain**, given the forwarding failure you saw. The sender's DNS (DKIM, return path) passed, but that doesn't prove inboxes accept it.

**My lean**, as judgement and not from any source: it depends on who sees the link next.
- **Only you and a few named reviewers:** stay in `sandbox` and add their addresses to the allowlist (needs a redeploy). It has the lowest risk and no real stranger can enter the system.
- **A link going to Clientelo's people or a wider group:** go `live`, but first send test mail to a Seznam, Gmail and Outlook address of yours, and switch back to `sandbox` after the review window.

Both involve a redeploy.

### Claude 17:07

`AskUserQuestion  {"questions": [{"question": "Which EMAIL_MODE should the live site have for the submission?", "header": "EMAIL_MODE", "multiSelect": false, "options": [{"label": "sandbox + allowlist (Recommended)", "description": "Keep sandbox. Add the addresses of the people who will review it to EMAIL_SANDBOX_ALLOWLIST and redeploy. No stranger can receive mail. The README says the mode and why."}, {"label": "l [... 503 more characters]`

### Tool result 17:09

```
Your questions have been answered: "Which EMAIL_MODE should the live site have for the submission?"="sandbox + allowlist (Recommended)". You can now continue with these answers in mind.
```

### Claude 17:09

You've chosen `sandbox` with an allowlist. Recording it in the README and the deploy notes now.

### Claude 17:09

`Bash  command: git checkout -q -b docs/email-mode-sandbox && python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('README.md',"6. **Test e-mail setup.** E-mail goes from the author's test domain; the production switch (a real domain, 'live' mode) is a checklist in [docs/DEPLOY.md](docs/DEPLOY.md).","6. **E-mail is in 'sandbox' mode [... 4322 more characters]`

### Tool result 17:09

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/100
```

### Claude 17:09

`EMAIL_MODE` stays `sandbox` for the submission, and I recorded it in [#100](https://github.com/Phunkhouse/etf-kompas/pull/100). It's docs only. `pnpm format:check` passes, and I haven't read the CI results. No code or Vercel setting changes, because Vercel is already on `sandbox`.

**What #100 adds**
- **README, risk 6:** says the e-mail goes only to an allowlist, why, and what a reviewer off the list sees.
- **`docs/DEPLOY.md`, new "Who receives e-mail in sandbox" part:** how to add addresses, what a reviewer off the list sees, and that the variable is decided.

**What you need to do**
1. **Add reviewers' addresses.** In Vercel, edit `EMAIL_SANDBOX_ALLOWLIST` (comma separated, Production) and **redeploy**. Keep the addresses in Vercel only. They're personal data, so not in the repo or in chat.
2. **Use direct addresses.** A forwarded address, like your own domain's, can lose the mail even when Resend says Delivered.
3. **Tell reviewers.** Anyone not on the list gets the results page and the PDF, but no e-mail.

**Decision note:** I haven't written one, because you chose the option without giving a reason. A suggested title: "E-mail stays in sandbox for the submission". Give me one sentence if you want it recorded.

**Still unverified:** delivery to Seznam, Gmail and Outlook has never been tested. It matters only if you later go `live`.

**What's left for the phase**
- **Meta Test Events:** needs your phone and the live address.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.
- **SPEC §4/§5 and METHODOLOGY-V2 §2:** the `rates.json` fallback drift, waiting for your yes.
- **A few unreported in-app items:** scrolling under the app bar, the footer "Cookies" link, the results page itself, the tips confirmation.

Say whether to start the closing docs, or whether you want to do the Meta Test Events first.

### David 17:11

One question. Could I add to allowlist whole clientelo.cz domain?

### Claude 17:11

`Bash  command: git checkout -q main && git pull -q; sed -n 1,22p src/server/mailer.ts; grep -n "allowlist" src/server/mailer.test.ts | head -8`

### Tool result 17:11

```
// Sending e-mail (SPEC §17.15). `Mailer` is the port; `deliver` adds the sandbox rule
// (only the allowlist gets mail, and the answer says so); the Resend adapter uses plain
// `fetch`; the recording mailer is for tests and the e2e run. No imports from next or react.
export type MailMessage = {
  to: string
  subject: string
  html: string
  text: string
  headers?: Record<string, string>
}

export type Mailer = { send(message: MailMessage): Promise<'sent' | 'failed'> }

export type DeliveryMode = { mode: 'live' | 'sandbox'; allowlist: string[] }

export type Delivery = 'sent' | 'skipped' | 'failed'

const normal = (address: string) => address.trim().toLowerCase()

// In sandbox mode only  [... 716 more characters]
```

### Claude 17:11

Not today. The allowlist matches whole addresses only, so an entry like `clientelo.cz` or `@clientelo.cz` would match nothing. `deliver()` in `src/server/mailer.ts` compares each entry to the recipient for exact equality, ignoring case and spaces. With a domain entry it would quietly send no e-mail to anyone, and that failure is silent.

**Adding domain support is small but it is a code change.** For example, an entry starting with `@` would match every address on that domain:

```
EMAIL_SANDBOX_ALLOWLIST=[email],@clientelo.cz
```

It would need tests first, since this is sandbox safety logic. They'd cover a domain entry matching its own addresses, not matching a lookalike such as `evilclientelo.cz` or `clientelo.cz.evil.com`, and a plain address keeping its exact behaviour.

**What you'd be accepting:**
- **Pro:** you don't have to collect each reviewer's address in advance. Anyone at Clientelo can test the full e-mail path.
- **Con (mild):** anyone who knows the link can type any `@clientelo.cz` address, and that person gets an e-mail from your test domain. Only people at a company that knows about the project can receive it, and the form's limits and the test notice still apply. It's still a stranger-proof boundary in practice, but not as tight as a named list.
- **Check first:** whether Clientelo's mail system accepts mail from `david-krapka.eu`. Company domains often filter new senders, and I've seen only a direct `pm.me` address accept it. Test it with one Clientelo address before relying on it.

**My suggestion:** add the domain rule, but only if you want reviewers to try the e-mail without telling you their address first. If the plan is "send the link to two or three named people", just list them and skip the code change.

Want me to build it as its own small PR (tests first, then the change, then a line in `docs/DEPLOY.md`)?

### David 17:13

Yes, build it, also mention free tier of Resend as a reason for sandbox

### Claude 17:13

Building the domain rule, tests first. For the free-tier reason I'd rather quote Resend's current limits than guess them, so I'm checking their pricing page.

### Claude 17:13

`ToolSearch  query: select:WebFetch`

### Claude 17:13

`WebFetch  url: https://resend.com/pricing`

### Tool result 17:13

```
**Free plan limits (as stated on the page):**

- **Emails per day:** "The Free plan is limited to 100 emails per day." The feature table also lists a daily limit of 100.
- **Emails per month:** The transactional table lists **3,000** emails/mo for Free.
- **Custom domains:** **3**. The highlights say "3 domains," and "Additional domains" is marked No.
- **Data retention:** **30 days**.
- **Inboxes:** **3**, and the Free plan "stops at 3" with no pay-as-you-go option.
- **Automation runs:** 10,000 per month, with no overage.
- **Webhook endpoints:** **1 endpoint**.
- **Overage:** Not available. The table shows "—" for Free.
- **Dedicated IPs:** Not included.
- **Marketing plan (separate from  [... 328 more characters]
```

### Claude 17:13

Resend's page says the free plan allows 100 e-mails a day and 3,000 a month (I read it through a fetch tool, not on screen). Now the tests for the domain rule, written first.

### Claude 17:13

`Bash  command: git checkout -q -b feat/sandbox-domain-allowlist && sed -n 50,90p src/server/mailer.test.ts; grep -n "EMAIL_SANDBOX_ALLOWLIST" src/config/env.test.ts | head -4`

### Tool result 17:13

```
})
})

describe('deliver: sandbox mode', () => {
  it('sends to an address on the allowlist, ignoring case and spaces', async () => {
    const mailer = createRecordingMailer()
    const result = await deliver(
      mailer,
      { mode: 'sandbox', allowlist: [' [email] ', '[email]'] },
      MESSAGE,
    )
    expect(result).toBe('sent')
    expect(mailer.sent()).toHaveLength(1)
  })

  it('does not send to any other address, and says skipped', async () => {
    const mailer = createRecordingMailer()
    const result = await deliver(
      mailer,
      { mode: 'sandbox', allowlist: ['[email]'] },
      MESSAGE,
    )
    expect(result).toBe('skipped')
    expect(mailer.sent( [... 688 more characters]
```

### Claude 17:13

`Bash  command: grep -n "const MESSAGE" -A6 src/server/mailer.test.ts | head -10; python3 - <<'E' ⏎ p='src/server/mailer.test.ts'; s=open(p).read() ⏎ s=s.rstrip('\n')+""" ⏎  ⏎ // Phase 6: a domain entry ("@clientelo.cz") in the sandbox allowlist, so every mailbox of ⏎ // a reviewing company can try the e-mail (cases D-1 to D-7, written first). Only the exact ⏎ // domain matches; a plain address keeps its [... 3215 more characters]`

### Tool result 17:13

```
11:const MESSAGE: MailMessage = {
12-  to: '[email]',
13-  subject: 'Vaše srovnání je připravené',
14-  html: '<p>Ahoj</p>',
15-  text: 'Ahoj',
16-  headers: { 'List-Unsubscribe': '<https://example.test/odhlasit/x>' },
17-}
 => {
  it('reads the Supabase settings by default', () => {
    expect(
      leadEnv({
        SUPABASE_URL: 'https://abc.supabase.co',
        SUPABASE_SECRET_KEY: 'sb_secret_x',
        IP_HASH_SECRET: secret,
        TOKEN_SIGNING_SECRET: 't'.repeat(32),
        SITE_URL: 'https://kompas.test',
        RESEND_API_KEY: 're_x',
        EMAIL_FROM: 'ETF Kompas <[email]>',
        EMAIL_SANDBOX_ALLOWLIST: '[email], [email]',
        EMAIL_REPLY_TO: '', [... 638 more characters]
```

### Claude 17:13

The two tests that need the new rule fail as expected, and the "must not match" cases already pass. I'm tidying one clumsy case, then implementing.

### Claude 17:13

`Bash  command: python3 - <<'E' ⏎ p='src/server/mailer.test.ts'; s=open(p).read() ⏎ a=s.index("  it('D-6 an empty or malformed domain entry never opens the list'"); b=s.index("  it('D-7") ⏎ s=s[:a]+"""  it('D-6 an empty or malformed domain entry never opens the list', async () => { ⏎     for (const entry of ['@', '@@', '@ ', '@.', '@*']) { ⏎       expect((await run([entry], '[email]')).result,  [... 1909 more characters]`

### Tool result 17:14

```
Tests  19 passed (19)
      Tests  928 passed (928)
copy:check: 0 problem(s)
```

### Claude 17:14

`Bash  command: git fetch -q && git ls-tree --name-only origin/main docs/decisions/ | tail -3; gh pr view 100 --json state | cat; grep -n "EMAIL_SANDBOX_ALLOWLIST" .env.example docs/DEPLOY.md README.md | cut -c1-140`

### Tool result 17:14

```
docs/decisions/0068-in-app-browser-test-and-no-copy-link-hint.md
docs/decisions/0069-pre-release-audit-drop-unused-fund-fields.md
docs/decisions/README.md
{"state":"OPEN"}
docs/DEPLOY.md:54:| `EMAIL_SANDBOX_ALLOWLIST`     | in sandbox      | no      | comma separated                                             
.env.example:10:# live: sends to anyone. sandbox: sends only to EMAIL_SANDBOX_ALLOWLIST and the UI never says "sent" otherwise.
.env.example:12:EMAIL_SANDBOX_ALLOWLIST=
```

### Claude 17:14

`Bash  command: git add -A && git commit -q -m "feat: a domain entry in the sandbox e-mail allowlist ⏎  ⏎ Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" 2>&1 | tail -1; git merge -q origin/docs/email-mode-sandbox 2>&1 | tail -2; git status -sb | head -2; python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('.env.example' [... 6812 more characters]`

### Tool result 17:15

```
✔ Done cleaning up temporary files!
## feat/sandbox-domain-allowlist
      Tests  928 passed (928)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
```

### Claude 17:15

`Bash  command: python3 - <<'E' ⏎ p='src/config/env.test.ts'; s=open(p).read() ⏎ a="  it('needs nothing else for the memory store', () => {" ⏎ assert a in s ⏎ s=s.replace(a,"""  it('keeps a domain entry of the allowlist as written', () => { ⏎     expect( ⏎       leadEnv({ ⏎         LEAD_STORE: 'memory', ⏎         EMAIL_SANDBOX_ALLOWLIST: '[email], @clientelo.cz', ⏎       }), ⏎     ).toMatchObject({ EMAIL_ [... 2181 more characters]`

### Tool result 17:15

```
Tests  929 passed (929)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/101
```

### Claude 17:15

The domain rule is built and open as [#101](https://github.com/Phunkhouse/etf-kompas/pull/101). `pnpm check` (929 tests) and `pnpm format:check` pass. I haven't read the CI results.

**How to use it:** in Vercel, set `EMAIL_SANDBOX_ALLOWLIST` to something like `[email],@clientelo.cz`, then redeploy.

**What the entry does**
- `@clientelo.cz` matches that exact domain only. It does not match a subdomain, a lookalike (`evilclientelo.cz`, `clientelo.cz.evil.com`), or an address with a second `@`.
- `clientelo.cz` without the `@` matches nothing, so a typo never widens the list.
- Plain addresses and `live` mode behave exactly as before.

**What I added**
- **Free tier as a reason for `sandbox`:** I quoted it from Resend's pricing page: 100 e-mails a day and 3,000 a month. It's in the README risk list and in decision note 0070 (your reason, attributed to you). I read the page through a fetch tool, not on screen.
- **Documentation:** `.env.example`, `docs/DEPLOY.md` and the README now describe the domain entry.

**Things to check**
1. **I did not wait for approval of the test cases**, which is your rule for risky logic. I had described the three behaviours in my last message and you said "build it", so I treated that as approval. I added the cases for a second `@`, a bare word, an empty `@` and live mode myself. Say so if you want any changed. It's in the AI log and the PR.
2. **#101 contains #100**, because it edits the same docs. Merge #100 first or this one first. Either works, and the diff shrinks after the first lands.
3. **Not verified:** delivery to a real `@clientelo.cz` mailbox. A company mail system can filter a new sender, so test one Clientelo address before relying on it.

Remaining for the phase:
- **Meta Test Events:** needs your phone and the live address.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.
- **SPEC §4/§5 and METHODOLOGY-V2 §2:** the `rates.json` fallback drift, waiting for your yes.
- **Unreported in-app items:** scrolling under the app bar, the footer "Cookies" link, the results page itself, the tips confirmation.

I'd close the docs next, because #99 to #101 will change the phase status.

### David 17:21

Resolve merge conflicts in #101

### Claude 17:21

`Bash  command: git fetch -q && git checkout -q feat/sandbox-domain-allowlist && git merge origin/main 2>&1 | tail -6; git diff --name-only --diff-filter=U; for f in $(git diff --name-only --diff-filter=U); do echo "== $f"; grep -n "^<<<<<<<\|^=======\|^>>>>>>>" $f; done`

### Tool result 17:21

```
CONFLICT (content): Merge conflict in README.md
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Auto-merging docs/DEPLOY.md
CONFLICT (content): Merge conflict in docs/DEPLOY.md
Automatic merge failed; fix conflicts and then commit the result.
README.md
docs/AI-LOG.md
docs/DEPLOY.md
== README.md
189:<<<<<<< HEAD
191:=======
193:>>>>>>> origin/main
== docs/AI-LOG.md
1383:<<<<<<< HEAD
1398:=======
1399:>>>>>>> origin/main
== docs/DEPLOY.md
54:<<<<<<< HEAD
56:=======
58:>>>>>>> origin/main
95:<<<<<<< HEAD
97:=======
98:>>>>>>> origin/main
```

### Claude 17:21

`Bash  command: sed -n 189,193p README.md | cut -c1-700; echo ======; sed -n 54,58p docs/DEPLOY.md | cut -c1-420; echo; sed -n 93,99p docs/DEPLOY.md | cut -c1-300; echo =====; sed -n 1380,1384p docs/AI-LOG.md | cut -c1-120; sed -n 1396,1402p docs/AI-LOG.md | cut -c1-120; git log --oneline origin/main -4`

### Tool result 17:21

```
Exit code 1
<<<<<<< HEAD
6. **E-mail is in `sandbox` mode on purpose.** The e-mail with the links goes only to an allowlist of reviewers' addresses or domains (`EMAIL_SANDBOX_ALLOWLIST` in Vercel; `@clientelo.cz` allows a whole domain), so no stranger receives mail and no real person's address can reach a project with a placeholder controller and unreviewed legal text. One reason is the free plan of Resend, which allows 100 e-mails a day and 3,000 a month (resend.com/pricing, read on 2026-10-14). Everyone else still gets the results page and the PDF, and the page says nothing about an e-mail. A reviewer whose address is not on the list sees no e-mail; the owner adds it and redeploys. The e-m [... 718 more characters]
```

### Claude 17:21

`Bash  command: sed -n 54,58p docs/DEPLOY.md | cut -c1-330; echo ----; sed -n 93,99p docs/DEPLOY.md | cut -c1-330; echo ----; sed -n 1383,1385p docs/AI-LOG.md | cut -c1-110; sed -n 1396,1400p docs/AI-LOG.md | cut -c1-110`

### Tool result 17:21

```
<<<<<<< HEAD
| `EMAIL_SANDBOX_ALLOWLIST`     | in sandbox      | no      | comma separated: addresses, or a whole domain written with the @ (`@clientelo.cz`, that exact domain only)                                                                  |
=======
| `EMAIL_SANDBOX_ALLOWLIST`     | in sandbox      | no      | comma separated                                                                                                                                                             |
>>>>>>> origin/main
----

- Add each reviewer's address to `EMAIL_SANDBOX_ALLOWLIST` in Vercel (comma separated, Production) and **redeploy**; a change applies to the next deployment only. Addresses are pers [... 940 more characters]
```

### Claude 17:21

`Bash  command: python3 - <<'E' ⏎ import re ⏎ for p in ['README.md','docs/DEPLOY.md','docs/AI-LOG.md']: ⏎     s=open(p).read() ⏎     s=re.sub(r"<<<<<<< HEAD\n(.*?)=======\n.*?>>>>>>> origin/main\n",lambda m:m.group(1),s,flags=re.S) ⏎     open(p,'w').write(s) ⏎ p='docs/AI-LOG.md'; s=open(p).read() ⏎ s=s.replace("- **Stacking:** this branch contains PR #100 (the docs it edits), so its diff shrinks when #10 [... 698 more characters]`

### Tool result 17:22

```
docs/DEPLOY.md:0
README.md:0
docs/AI-LOG.md:0
      Tests  929 passed (929)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
```

### Claude 17:22

The conflicts in #101 are resolved and pushed, and the PR now shows as mergeable. "Blocked" only means CI and review haven't finished. I haven't read the CI results.

The conflicts came from #100 having been merged into `main`. Three files conflicted, and the conflict in each was the old wording from #100 against my newer wording:
- **`README.md`, risk 6:** I kept my version, which adds the domain entry and the free-tier reason.
- **`docs/DEPLOY.md`:** I kept the allowlist table row with the domain syntax, and the bullet explaining the `@clientelo.cz` entry.
- **`docs/AI-LOG.md`:** I kept my entry. The "Stacking" bullet said the diff would shrink when #100 merged, which is no longer true, so I reworded it to say what happened.

After the merge, `pnpm check` (929 tests) and `pnpm format:check` pass.

Next: closing docs (`docs/PHASES.md` and the plan checklist), or the Meta Test Events on your phone?

### David 17:30

Ok, done, both landed, allowlist updated and redeployed.

Let's move to Meta Test Events

### Claude 17:30

`Bash  command: git checkout -q main && git pull -q; grep -n "fbq\|PageView\|Lead\|eventID\|fbevents" src/lib/track-client.ts | head -30; grep -n "test_event_code\|testEventCode\|TEST" src/server/capi.ts | head; sed -n 1,60p src/server/capi.ts | cut -c1-160`

### Tool result 17:30

```
172:        const fbq: Fbq = function (...args: unknown[]) {
173:          if (fbq.callMethod) fbq.callMethod(...args)
174:          else fbq.queue.push(args)
176:        fbq.queue = []
177:        fbq.loaded = true
178:        fbq.version = '2.0'
179:        w.fbq = fbq
180:        w._fbq = fbq
181:        w.fbq('init', vendors.pixel)
182:        w.fbq('track', 'PageView')
183:        idle(() => addScript('https://connect.facebook.net/en_US/fbevents.js'))
185:        w.fbq('consent', advertising ? 'grant' : 'revoke')
196:    if (metaOn && name === 'calc_result') w.fbq('track', 'ViewContent')
332:  const watchLead = () => {
339:      if (metaOn) w.fbq('track', 'Lead', {}, { eventID: id })
34 [... 2061 more characters]
```

### Claude 17:30

`WebFetch  url: https://developers.facebook.com/docs/graph-api/changelog`

### Claude 17:30

`WebFetch  url: https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api`

### Tool result 17:30

```
The latest Graph API version is **v26.0**, and the page lists its release date as **July 29, 2026**. The table column is labeled "Date Introduced."

The two versions before it:

- **v25.0**: February 18, 2026
- **v24.0**: October 8, 2025
```

### Tool result 17:30

```
**Test event code:** The page says the Test Events tool creates the code. "The Test Events tool generates a test ID. Send the test ID as a `test_event_code` parameter" (the page's example puts `test_event_code` alongside `data` in the JSON body). Responses appear in the Test Events window after the request is sent. The page also says the code is for testing only, so you must remove it from production payloads.

**Where to find the code:** You find the Test Events tool at "Events Manager > Data Sources > Your Pixel > Test Events" (the page's path, written with arrows). That is where the test ID is generated.

**Access token:** The page does not state where to find the access token in Events M [... 250 more characters]
```

### Claude 17:30

Test Events has two halves, and only the first can run today with no code change. These steps are from the code and Meta's docs. The exact button names in Events Manager are from memory, so tell me if they differ.

## Part A: browser events (the Pixel). Do this now

What the site sends to the Pixel, only after you accept advertising: `PageView` on load, `ViewContent` when the calculator result has been in view for a second, and `Lead` on a new submit. `Lead` carries an `eventID`. Nothing is sent before consent or after "Odmítnout vše".

1. In Events Manager, open your **dataset (Pixel) → Test Events**, the "Test browser events" tab.
2. Enter `https://etf-kompas-kappa.vercel.app` and open the site from there. This opens it in a test mode.
3. In the cookie bar, press **Přijmout vše**. That alone should show a `PageView`.
4. Move the slider, wait a couple of seconds, and you should see `ViewContent`.
5. Submit the form with an **address from your allowlist** (the same address twice creates no second lead, so use a fresh plus-address on `pm.me` only if it is allowlisted; otherwise any allowlisted one is fine for a first look). You should see `Lead`; open it and check that an **Event ID** is present.
6. Repeat once with **Odmítnout vše** in a fresh private window. Test Events should show **nothing**. That's the "zero before consent" check on the real vendor.

Tell me what appears, in one line per step. A screenshot of the Event ID row is enough, as long as nothing on it shows your address.

## Part B: the server-side Lead (not yet possible). Needs two things from you and one change from me

The server copy is built but off. To test it properly:
1. **`META_GRAPH_VERSION`:** Meta's changelog page lists **v26.0** (introduced 2026-07-29) as the latest, with v25.0 and v24.0 before it. I read it through a fetch tool. Use the latest unless Meta says otherwise.
2. **`META_CAPI_TOKEN`:** a Conversions API access token for the dataset. The docs page I read doesn't say where to generate it. I believe it's under **Settings → Conversions API → Generate access token**, but that's from memory. It's a secret: only into Vercel, never into chat.
3. **A small change from me:** the server call sends no `test_event_code`. Meta's docs say to send the code from Test Events alongside `data` and to remove it from production. Without it, the server events would go to your real dataset and not appear in Test Events, so you couldn't see them or the deduplication. I'd add an optional `META_TEST_EVENT_CODE` setting (unset in production), with tests first.

Then the check is: submit once, and Test Events shows the browser `Lead` and the server `Lead` with the same event ID, marked as deduplicated.

Do part A first. Should I prepare part B (the optional test-code setting) while you run it?

### David 17:38

Part A tested
Everything went fine

### Claude 17:38

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b docs/meta-test-events && grep -n "Meta is not verified\|Meta Test Events\|Test Events" README.md docs/PHASE-5-PLAN.md docs/PHASES.md docs/DEPLOY.md docs/PHASE-6-PLAN.md | cut -c1-200`

### Tool result 17:38

```
README.md:188:5. **Two vendor integrations are unverified:** Meta Test Events were not run on the deployed address, and the server-side Meta call is built but not enabled (no token, no Graph version).
README.md:196:- **Tracking is checked against the real GA4 only, by the author (2026-10-14).** The cookie bar, the first-party events, GA4 and the Meta Pixel (loaded after their category is agreed, Co
docs/DEPLOY.md:84:- [ ] Tracking, on a real phone with the network tab open: zero requests to Google or Meta before consent and after "Odmítnout vše"; after "Přijmout vše" the GA4 DebugView and Me
docs/DEPLOY.md:112:- [ ] Meta Conversions API enabled (token and Graph version), with Test Events che [... 1891 more characters]
```

### Claude 17:38

`Bash  command: sed -n 196p README.md; sed -n 78p docs/PHASE-5-PLAN.md; sed -n 25p docs/PHASES.md; sed -n 17p docs/PHASES.md; sed -n 84p docs/DEPLOY.md`

### Tool result 17:38

```
- **Tracking is checked against the real GA4 only, by the author (2026-10-14).** The cookie bar, the first-party events, GA4 and the Meta Pixel (loaded after their category is agreed, Consent Mode v2) and the lead for the vendors are built and tested with fake ids, stubbed vendor scripts and a stub for the Meta Conversions API; GA4 was then tested by the author with the real property. **Meta is not verified:** its Test Events were not run on the deployed address yet. Also open: Test Events, the `fbc` format, the Graph API version and the access token for the server-side call (there is no default, `TODO_VERIFY`), and INP and TBT with and without consent.
- [ ] **Open, waits for the Vercel add [... 1903 more characters]
```

### David 17:38

[Request interrupted by user]

### David 17:56

Screenshot shows consent output with all steps made

Q: Repeat once with Odmítnout vše in a fresh private window. Test Events should show nothing. That’s the “zero before consent” check on the real vendor.
A: Tested and confirmed (shows nothing)

### David 17:56

[Image: source: /private/tmp/claude-501/-Users-davidkrapka-dev-learning-etf-kompas/f973ec42-c5c3-42b1-8b92-6c28215fec9e/images/1.png]

### Claude 17:57

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:70]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('README.md',"5. **Two vendor integrations are unverified:** Meta Test Events were not run on the deployed address, and the server-side Meta call is built but not enabled (no token, no Graph version).","5. **The Meta Pixel was checked in Test Events (browser side on [... 6819 more characters]`

### Tool result 17:57

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/102
[This command modified 4 files you've previously read: docs/PHASES.md, README.md, docs/PHASE-5-PLAN.md, docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 17:57

Part A is recorded in [#102](https://github.com/Phunkhouse/etf-kompas/pull/102): README, `docs/PHASES.md`, `docs/PHASE-5-PLAN.md`, `docs/PHASE-6-PLAN.md` and the AI log. It's documentation only. `pnpm format:check` passes, and I haven't read the CI results.

**What your test showed**
- **After "Přijmout vše":** `PageView`, `ViewContent` (Zobrazení obsahu) and `Lead` (Potenciální zákazník) arrived from the browser, all processed, and `Lead` has an event ID.
- **After "Odmítnout vše":** nothing arrived. That's the zero-before-consent check, now confirmed on the real vendor.

**One event we did not send.** The screenshot's fourth row, "Subscribed… Automatické p…", is **Meta's own automatic detection** of a button click. Our tracker sends only the three events above. It comes from a dataset setting in Events Manager (I read that from the label, which is cut off in the screenshot). Meta's automatic features can also collect form data, so it may be worth checking whether **automatic advanced matching** is on, since our privacy text says we send hashed data only with advertising consent. You'd review that in Events Manager → the dataset's Settings. I haven't changed or verified it, and whether to switch it off, and what the privacy text should say, is your call.

**Still open**
- **The server-side call:** it needs two values from you, `META_CAPI_TOKEN` and `META_GRAPH_VERSION`. Meta's changelog lists v26.0 as the latest (introduced 2026-07-29, read through a fetch tool). It also needs a small change from me: an optional `META_TEST_EVENT_CODE`, so server events show up in Test Events and not in your real dataset. Then the check is that the browser and server `Lead` have the same event ID and show as deduplicated.
- **A different way out:** leave the server call "built, not enabled", as the README says now. That costs nothing and is honest.

Do you want me to prepare the `META_TEST_EVENT_CODE` change (tests first), or leave the server side as it is? If you leave it, the last items for the phase are closing `docs/PHASES.md` and the plan checklist, and your answer on the `rates.json` doc sync.

### David 18:28

Prepare it

### Claude 18:28

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b feat/meta-test-event-code && sed -n 60,140p src/server/capi.ts; sed -n 1,50p src/server/capi.test.ts; grep -n "metaServerEnv" -B2 -A25 src/config/env.test.ts | head -70; sed -n 160,185p src/config/env.ts; grep -n "capiConfig\|metaServerEnv" src/app/lead-service.ts`

### Tool result 18:28

```
action_source: 'website',
          event_source_url: config.siteUrl,
          user_data: userData,
        },
      ],
      access_token: config.token,
    },
  }
}

export async function sendLeadToMeta(
  config: CapiConfig,
  lead: CapiLead,
  doFetch: typeof fetch = fetch,
): Promise<void> {
  const { url, body } = buildLeadRequest(config, lead)
  try {
    const response = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error(`Meta Conversions API answered ${response.status}.`)
    }
  } [... 4879 more characters]
```

### Claude 18:28

`Bash  command: grep -n "capi\|test-capi\|recorded\|requests" e2e/lead-event.spec.ts | head -20; sed -n 50,110p src/server/capi.test.ts`

### Tool result 18:28

```
12:// goes to our own stub route /api/test-capi (decision 6), never to Meta. Every test starts
31:async function capiFor(request: APIRequestContext, fbclid: string) {
32:  const response = await request.get('/api/test-capi/state')
33:  const { requests } = (await response.json()) as { requests: Captured[] }
34:  return requests.filter((r) => r.body.data[0].user_data.fbc?.endsWith(fbclid))
83:  await expect.poll(async () => (await capiFor(request, click)).length).toBe(1)
84:  const sent = (await capiFor(request, click))[0].body.data[0]
110:  expect(await capiFor(request, click)).toEqual([])
127:  expect(await capiFor(request, click)).toEqual([])
141:  await expect.poll(async () => (await capi [... 2507 more characters]
```

### Claude 18:28

Writing the test cases first (env, request body, logging, and the Playwright stub check), and running them to see them fail.

### Claude 18:28

`Bash  command: sed -n 72,100p e2e/lead-event.spec.ts; sed -n 20,40p e2e/lead-event.spec.ts; grep -n "Captured" -A8 e2e/lead-event.spec.ts | head -14; sed -n 20,60p "src/app/api/test-capi/[...path]/route.ts"`

### Tool result 18:28

```
'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
      'generate_lead',
    ])
  const id = await page.locator('#formular').getAttribute('data-lead-event-id')
  expect(id).toMatch(/^[0-9a-f-]{36}$/)
  const meta = await metaCalls(page)
  expect(meta.at(-1)).toEqual(['track', 'Lead', {}, { eventID: id }])
  await expect.poll(async () => (await capiFor(request, click)).length).toBe(1)
  const sent = (await capiFor(request, click))[0].body.data[0]
  expect(sent).toMatchObject({ event_name: 'Lead', event_id: id })
  expect(sent.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/)
  const first = (await stored(request)).events.find(
    (e) => e.utmSource === utm [... 2479 more characters]
```

### Claude 18:28

`Bash  command: python3 - <<'E' ⏎ # --- env tests ⏎ p='src/config/env.test.ts'; s=open(p).read() ⏎ s=s.replace("""    expect(metaServerEnv(all)).toEqual({ ⏎       pixelId: '1234567890', ⏎       token: 'tok-secret', ⏎       version: 'v0.0', ⏎       base: 'https://graph.facebook.com', ⏎     })""","""    expect(metaServerEnv(all)).toEqual({ ⏎       pixelId: '1234567890', ⏎       token: 'tok-secret', ⏎       [... 6112 more characters]`

### Tool result 18:28

```
× is off when nothing is set, and on when the three are 3ms
       × T-1 is null by default and when empty, with no warning 0ms
       × T-2 is read, trimmed, from META_TEST_EVENT_CODE 0ms
       × T-3 a code that is not letters and digits is ignored, the API stays on, and the warning names the variable and not the value 0ms
       × T-4 a valid code warns that events go to Test Events only, without showing it 1ms
     × T-6 the body has test_event_code next to data when a code is set, and not otherwise 2ms
     × T-8 the code is sent through a real submit, and a failure does not log it 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 7 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected { pixelId: '1234567890', …(3) } to deeply equa [... 567 more characters]
```

### Claude 18:28

The tests fail for the right reasons. Implementing.

### Claude 18:29

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ # env ⏎ sub('src/config/env.ts',"""export type MetaServerConfig = { ⏎   pixelId: string ⏎   token: string ⏎   version: string ⏎   base: string ⏎ }""","""export type MetaServerConfig = { ⏎   pixelId: string ⏎   token: string ⏎   version: string ⏎   base: string ⏎   // T [... 2130 more characters]`

### Tool result 18:29

```
globalForLeads.__memoryLeads ??= createMemoryLeadStore()
  return globalForLeads.__memoryLeads
}

function capiConfig(siteUrl: string): LeadDeps['capi'] {
  const meta = metaServerEnv()
  return meta ? { ...meta, siteUrl } : undefined
}

let deps: LeadDeps | null = null

export function leadDeps(): LeadDeps {
  if (deps) return deps
$ next typegen && tsc --noEmit
Generating route types...
✓ Types generated successfully
      Tests  32 passed (32)
```

### Claude 18:29

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('src/server/capi.ts',"// production (note 0071).","// production (docs/DEPLOY.md).") ⏎ s=open('.env.example').read() ⏎ s=s.rstrip('\n') ⏎ s=s.replace("META_GRAPH_VERSION=","META_GRAPH_VERSION=\n# Meta Test Events: the code from Events Manager > Test Events (letters [... 2042 more characters]`

### Tool result 18:30

```
3
      Tests  937 passed (937)
copy:check: 0 problem(s)
·············[WebServer] Meta Conversions API answered 500.
······················[WebServer] Meta Conversions API call failed (TimeoutError).
·············································
··········································
  202 passed (32.1s)
::notice title=🎭 Playwright Run Summary::  202 passed (32.1s)
[This command modified 1 file you've previously read: docs/DEPLOY.md. Call Read before editing.]
```

### Claude 18:30

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('README.md',"**Not verified:** the server-side call (the 'fbc' format,","**Not verified:** the server-side call (an optional 'META_TEST_EVENT_CODE' is built so it can be tested in Test Events without touching the dataset, see [docs/DEPLOY.md](docs/DEPLOY.md); the ' [... 4420 more characters]`

### Tool result 18:30

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/103
[This command modified 2 files you've previously read: docs/PHASE-5-PLAN.md, README.md. Call Read before editing.]
```

### Claude 18:30

The optional `META_TEST_EVENT_CODE` is built and open as [#103](https://github.com/Phunkhouse/etf-kompas/pull/103). `pnpm check` (937 tests) and `pnpm format:check` pass, and Playwright passes 202 tests on a production build. I haven't read the CI results.

The tests came first and 7 of them failed beforehand.

**What it does**
- **With the code set:** the server's Conversions API request carries `test_event_code`, so the server `Lead` shows in Test Events and not in your real dataset.
- **Without it:** the request body is unchanged, so production is unaffected.
- **Validation:** the code must be 4 to 20 letters and digits (like `TEST15906`). Anything else is ignored with a warning that names the variable and never shows the value.

**The trap.** A code left set in production would send every server `Lead` to Test Events only, silently. The only safeguards are a start-up warning in the deploy log and the last step of the procedure in `docs/DEPLOY.md`: remove the code and redeploy after the test.

**To run the check, you need to give three values.** None go into chat, only into Vercel:
1. **`META_CAPI_TOKEN`:** a Conversions API access token for the dataset.
2. **`META_GRAPH_VERSION`:** Meta's changelog page lists `v26.0` as the latest, introduced 2026-07-29. I read it through a fetch tool, so check it yourself.
3. **`META_TEST_EVENT_CODE`:** the code from Events Manager → Test Events. The `TEST15906` in your screenshot is the format.

Then redeploy, accept the cookie bar, and submit with an allowlisted address. You should see **two `Lead` rows with the same event ID**, one from the browser and one from the server. Meta marks the second as deduplicated. Open the site once with `?fbclid=test123` to see the `fbc` value on the server row. Afterwards, remove the code and redeploy.

**Not verified:** the server call has still never reached Meta. The field name and its place in the body come from Meta's docs page, read through a fetch tool.

**Decision note:** I haven't written one, because you gave no reason beyond "prepare it". A suggested title: "Optional Test Events code for the server-side Lead".

Two PRs are waiting on your review: #102 (the browser-side result) and #103. Do you want to run the server-side check now, or leave the server call "built, not enabled"?

### David 18:42

I have changed my mind it's too much hassle

Let's go with
"A different way out: leave the server call “built, not enabled”, as the README says now. That costs nothing and is honest."

### Claude 18:42

`Bash  command: git checkout -q main && git pull -q; gh pr view 102 --json state --jq .state; gh pr view 103 --json state --jq .state; ls docs/decisions | tail -2; grep -n "built, not enabled" README.md docs/DEPLOY.md | cut -c1-150`

### Tool result 18:42

```
MERGED
OPEN
0070-email-stays-sandbox-with-domain-allowlist.md
README.md
docs/DEPLOY.md:60:| `META_CAPI_TOKEN`             | for server Lead | **yes** | not set yet: the server-side Lead is **built, not enabled**
```

### Claude 18:42

`Bash  command: git checkout -q -b docs/capi-stays-off && grep -n "server-side Meta call\|server-side call\|Conversions API" README.md | cut -c1-170`

### Tool result 18:42

```
188:5. **The Meta Pixel was checked in Test Events (browser side only);** the server-side Meta call is built but not enabled (no token, no Graph version), so the deduplic
196:- **Tracking is checked against the real GA4 only, by the author (2026-10-14).** The cookie bar, the first-party events, GA4 and the Meta Pixel (loaded after their ca
200:- **The server-side Meta call is built but not enabled:** the access token and the Graph API version are not set, so only the browser Pixel sends the lead. It runs af
```

### Claude 18:42

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ sub('README.md',"- **The server-side Meta call is built but not enabled:** the access token and the Graph API version are not set, so only the browser Pixel sends the lead.","- **The server-side Meta call is built but not enabled, on purpose** (note 0071): the access t [... 4327 more characters]`

### Tool result 18:43

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/104
[This command modified 2 files you've previously read: README.md, docs/DEPLOY.md. Call Read before editing.]
```

### Claude 18:43

The server-side Meta Lead stays built and switched off, and I recorded the decision in [#104](https://github.com/Phunkhouse/etf-kompas/pull/104). It's documentation only, `pnpm format:check` passes, and I haven't read the CI results.

**What's in #104**
- **Decision note 0071,** with your reason ("too much hassle") attributed to you. The rest of the note is mine.
- **README and `docs/DEPLOY.md`:** one line each, saying the call is off by decision. The README adds that turning it on later is configuration plus a Test Events check, none of which was done.

**The consequence:** a visitor whose browser blocks the Pixel is not counted as a `Lead` in Meta, so the cost per lead there under-counts. Our own first-party `lead` event still counts every new address.

**#103 (the optional test code) is no longer needed.** I left it open instead of closing it myself. Merging it adds a small, tested setting nobody uses, and closing it leaves it in git history if you ever enable the server call. I'd close it, but it's your call.

**What's left for the phase**
1. **Closing docs:** `docs/PHASES.md` and the plan checklist. This is the only item still needing real work.
2. **SPEC §4/§5 and METHODOLOGY-V2 §2:** the `rates.json` fallback drift. It's waiting for your yes, since it changes a spec decision.
3. **Unreported in-app items:** scrolling under the app bar, the footer "Cookies" link, the results page itself, the tips confirmation. Quick checks if you still have the e-mails.
4. **A short final review** before Friday: the Czech copy pass in `src/content/copy.ts` is still planned (SPEC §17.10).

Shall I start the closing docs while #103 and #104 are with you?

### David 18:47

#103 close, #104 landed

I would still do this part

* No tax figure is on the page. The dividend yield and withholding rate once stored for the old calculator (from the Czech-US treaty and the US-Ireland convention) were dropped because nothing used them (note 0069). The Czech tax explanation is not written: it needs text from Finanční správa and says `[ověřit zdroj]` until then.


Point where I can find the data, so we can prepare at least basis, which legal could later check

### Claude 18:47

`Bash  command: gh pr close 103 --comment "Closed by David's decision (2026-10-14): the server-side Meta Lead stays built and off (note 0071), so the optional test code has no use. The branch stays in git history if the server call is ever enabled." 2>&1 | tail -1; git checkout -q main && git pull -q; git log --oneline -2`

### Claude 18:47

`ToolSearch  query: select:WebSearch`

### Tool result 18:47

```
! Pull request Phunkhouse/etf-kompas#103 (feat: optional Meta Test Events code for the server-side Lead) is already closed
1a5c4fd docs: the server-side Meta Lead stays built and off (note 0071) (#104)
6f9ab4e docs: Meta Pixel checked in Test Events on the live site (#102)
```

### Claude 18:47

#103 was already closed. Now looking for the primary sources for the tax statements. I'll only point to official texts and mark what I couldn't read.

### Claude 18:47

`WebSearch  query: Finanční správa příjmy z prodeje cenných papírů časový test 3 roky osvobození limit 40 milionů daňové přiznání fyzické osoby`

### Claude 18:47

`WebSearch  query: Finanční správa dividendy ze zahraničí zápočet daně zaplacené v zahraničí fyzická osoba daňové přiznání § 38f příjmy z kapitálového majetku`

### Claude 18:47

`WebSearch  query: Finanční správa pokyny k zdanění příjmů z cenných papírů a podílových fondů zahraniční ETF fyzické osoby`

### Tool result 18:48

```
Web search results for query: "Finanční správa příjmy z prodeje cenných papírů časový test 3 roky osvobození limit 40 milionů daňové přiznání fyzické osoby"

Links: [{"title":"Ostatní","url":"https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/ostatni"},{"title":"Daňové novinky pro rok 2026: změny v daních z příjmů, DPH i v oblasti administrativních povinností","url":"https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2026/danove-novinky-pro-rok-2026"},{"title":"Daň z příjmů","url":"https://financnisprava.gov.cz/assets/cs/prilohy/KV1322008.pdf"},{"title":"Daňové přiznání za rok 2025: připomínáme prodloužené úřední hodiny, ko [... 3563 more characters]
```

### Tool result 18:48

```
Web search results for query: "Finanční správa pokyny k zdanění příjmů z cenných papírů a podílových fondů zahraniční ETF fyzické osoby"

Links: [{"title":"Kapitálové příjmy","url":"https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/kapitalove-prijmy"},{"title":"Ostatní","url":"https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/ostatni"},{"title":"Zdanění příjmů z úspor","url":"https://financnisprava.gov.cz/cs/mezinarodni-spoluprace/mezinarodni-zdanovani-prime-dane/zdaneni-prijmu-z-uspor/zdaneni-prijmu-z-uspor"},{"title":"586/1992 Sb., 1. 8. 2026, aktuální znění, informativní znění systému e-Sbírka","url":"https://e-sbirka.gov.cz/sb/1992/586?zalozka=text [... 5270 more characters]
```

### Tool result 18:48

```
Web search results for query: "Finanční správa dividendy ze zahraničí zápočet daně zaplacené v zahraničí fyzická osoba daňové přiznání § 38f příjmy z kapitálového majetku"

Links: [{"title":"Aktuálně k dani z příjmů fyzických osob za zdaňovací období 2025","url":"https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/dotazy-a-odpovedi/dan-z-prijmu-fyzickych-osob/aktualne-k-dani-z-prijmu-fyzickych-osob-2025"},{"title":"POKYNY K PŘÍLOZE č. 3","url":"https://adisspr.mfcr.cz/dpr/adis/idpr_pub/dpf/dp4/doc/pokyny_p3.pdf"},{"title":"Pokyny k vyplnění samostatné přílohy k tabulce I. Zápočet ...","url":"https://financnisprava.gov.cz/assets/cs/prilohy/dt-upozorneni-mf-k-tiskopisum/5404-D_15.pdf"},{"t [... 6374 more characters]
```

### Claude 18:48

The search results disagree about one thing (whether the 40 million Kč limit still applies in 2026), so I'm reading the official pages themselves instead of relying on the summaries.

### Claude 18:48

`WebFetch  url: https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/ostatni`

### Claude 18:48

`WebFetch  url: https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2026/danove-novinky-pro-rok-2026`

### Claude 18:48

`WebFetch  url: https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/kapitalove-prijmy`

### Tool result 18:48

```
**Sale of securities and business interests (cenné papíry, obchodní podíly)**

- **40 million CZK limit:** The page says the limit is being abolished: "Od 1. ledna 2026 se ruší limit 40 milionů korun pro osvobození příjmů fyzických osob" ("From 1 January 2026, the 40 million CZK limit for exempting individuals' income is abolished"). The page ties this to the 1 January 2026 effective date but does not name a specific tax year.
- **Time test:** The page mentions it only briefly: "pokud byl splněn tzv. časový test" ("if the so-called time test was met"). It does not explain the test's conditions.
- **Value test:** The page says the value test remains, set at 100,000 CZK: "Vedle toho je zachová [... 736 more characters]
```

### Tool result 18:48

```
**Source:** Finanční správa (Czech Tax Administration), "Kapitálové příjmy" page under Daň z příjmů, Fyzické osoby.

**Dividends and profit shares (§ 8 ZDP)**
- The page lists "podíly na zisku obchodní korporace nebo podílového fondu, je-li v něm podíl představován cenným papírem" as capital income under § 8 ZDP. Interest on securities and bond yields are also listed.
- It also lists "podíly na zisku tichého společníka z účasti na podnikání" (profit shares of a silent partner).

**Tax rate**
- Certain income is withheld by the payer under § 38d ZDP at a special rate of 15% (§ 36 ZDP), "pokud se jedná o příjmy plynoucí ze zdrojů na území České republiky." Dividends and fund profit shares are  [... 996 more characters]
```

### Tool result 18:48

```
**Source:** The "Cenné papíry" section of the "Ostatní" page under Fyzické osoby, Daň z příjmů, which cites § 4 ZDP.

**1. Value limit (100 000 Kč)**
The page says income from selling securities is exempt if the total for the taxpayer does not exceed 100 000 Kč in the tax period: "pokud jejich úhrn u poplatníka nepřesáhne ve zdaňovacím období částku 100 000 Kč." The securities bullets are not labelled with a paragraph letter, so the page does not state which letter applies to this rule.

**2. Time test (3 years)**
The exemption applies if more than 3 years pass between acquisition and sale: "přesáhne-li doba mezi nabytím a úplatným převodem tohoto cenného papíru při jeho úplatném převodu dob [... 1375 more characters]
```

### Claude 18:48

`WebFetch  url: https://www.zakonyprolidi.cz/cs/1992-586`

### Claude 18:48

`WebFetch  url: https://adisspr.mfcr.cz/dpr/adis/idpr_pub/dpf/dp4/doc/pokyny_p3.pdf`

### Tool result 18:49

```
I can't answer these questions from the content provided. It's a raw PDF file dump, and the page text is inside compressed (FlateDecode) streams that appear as binary gibberish. I can't see any readable Czech text about příloha č. 3, zápočet, the treaty limit, the tax administrator's confirmation, dividends, or § 38f.

The only readable information is metadata: the PDF was created on 7 July 2009, last modified on 2 November 2009, and produced with Adobe InDesign CS3 and Adobe PDF Library 8.0. That suggests the document dates from 2009, but it doesn't state which tax year the instruction covers.

To get an answer, please paste the instruction text directly, or extract it first (for example, c [... 294 more characters]
```

### Tool result 18:49

```
**§ 4 odst. 1 písm. u)** (3-year rule for securities) currently reads, in part: "příjem z úplatného převodu cenného papíru, přesáhne-li doba mezi nabytím a úplatným převodem tohoto cenného papíru" (the exemption applies when more than 3 years pass between acquisition and sale). The provision also shortens the period for inherited securities, excludes securities held as business assets within 3 years after that activity ends, and sets a 5-year period for a "kmenový list" (a single-share certificate).

**The 100 000 Kč limit** is in **písm. t)**, not u). It exempts sales of securities where the total per taxpayer in a tax period does not exceed "částku 100000 Kč." Mutual fund units are covered [... 691 more characters]
```

### Claude 18:49

`Bash  command: grep -n "ověřit zdroj" -r src | grep -v test | cut -c1-170; sed -n 198,232p src/content/copy.ts`

### Tool result 18:49

```
src/content/copy.ts:581:    unverified: '[ověřit zdroj]',
  },
}

// "Za co platíte, aniž to vidíte": three plain cards. No figures here, on
// purpose: every number on the page comes from the data (SPEC §18).
export const hiddenCostsCopy = {
  heading: 'Za co platíte, aniž to vidíte',
  cards: [
    {
      title: 'Roční poplatek fondu',
      text: 'Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu.',
    },
    {
      title: 'Převod korun',
      text: 'Když fond nebo broker účtuje v cizí měně, platí se za převod z korun.',
    },
    {
      title: 'Daň ze zisků',
      text: 'Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou.',
  [... 445 more characters]
```

### Claude 18:50

`Bash  command: git checkout -q -b docs/tax-sources && cat > docs/TAX-SOURCES.md <<'E' ⏎ # Tax statements: where the sources are, and a basis for a reviewer ⏎  ⏎ Written 2026-10-14 (Phase 6). **Status: a basis for a qualified reviewer, not legal text.** Nothing here may go on the page, in the PDF or in an ad until a human has read the primary source behind it and a reviewer has checked it (SPEC §18, §19, [... 14312 more characters]`

### Tool result 18:50

```
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/105
[This command modified 1 file you've previously read: README.md. Call Read before editing.]
```

### Claude 18:50

#103 was already closed. The tax basis is open as [#105](https://github.com/Phunkhouse/etf-kompas/pull/105) and is documentation only, so no page text changed. `pnpm format:check` passes, and I haven't read the CI results.

**What `docs/TAX-SOURCES.md` contains**
- **Where to read:**
  - The Income Tax Act on [e-Sbírka](https://e-sbirka.gov.cz/sb/1992/586?zalozka=text) and zakonyprolidi.
  - Three Finanční správa pages: "Ostatní" (securities), "Kapitálové příjmy", and "Daňové novinky pro rok 2026".
  - The Czech-US and US-Ireland treaties.
  - The IRS page for Form W-8BEN.
  - The tax forms page for the current Příloha č. 3.
- **Ten possible statements,** each with what the pages said, where to confirm it, and a status.
- **A basis of three supportable sentences**, about selling a fund: the 3-year time test, and the 100 000 Kč yearly limit when you sell sooner. The third is the old 40 million Kč cap, which probably isn't worth a sentence.
- **Six questions for a reviewer.**
- **What it does not give:** nothing about dividends, foreign tax credit or the tax return, because I found no primary-source reading for them.

**Nothing in it is verified.** I read the pages through a fetch tool that summarises with a small model. I saw only the first part (about 100 000 of 790 000 characters) of the consolidated law, and e-Sbírka itself and the 2009 instruction for Příloha č. 3 couldn't be read. The file says this at its top.

**What a reviewer needs to settle, found along the way**
- **Two Finanční správa pages disagree** on the 40 million Kč cap. The 2026 press release says it's abolished for securities, and the "Ostatní" page still describes it. The law text supports the press release.
- **The § 4 letters differ** between the pages (the time test is `u)`, the 100 000 Kč limit is `t)` on the law page).
- **No source found** for how a gain on an **accumulating** fund is taxed. This is the main open question.

**One tax sentence is already on the live page without a source.** The third card, "Daň ze zisků", says a part of paid-out profits is taken by a foreign state. No source has stood behind it since note 0069 dropped the treaty sources. For accumulating funds nothing is paid out, so it's also wrong for them. It slipped in during Phase 3, and I didn't notice it then either. I haven't changed it. If you want to be safe, replace it with `[ověřit zdroj]` until a reviewer looks. Should I do that as a small PR?

Also pending from you:
- **Doc sync:** the `rates.json` fallback drift in SPEC §4/§5 and METHODOLOGY-V2 §2.
- **Closing docs:** `docs/PHASES.md` and the plan checklist.

### David 18:51

So what exactly do you need?

### Claude 18:51

You don't need to answer all of this at once. I'm blocked on two yes/no decisions, and two other things are waiting on you.

**Two decisions I need from you**
1. **The third card, "Daň ze zisků".** It states a tax claim with no source behind it, and it's false for accumulating funds. Should I replace its text with `[ověřit zdroj]` in a small PR (the other tax cards already use it)? **Yes** or **no, leave it for now.** My suggestion is yes, because the only alternative is a claim on the live page that nobody has checked.
2. **The `rates.json` doc sync.** SPEC §4 and §5 and METHODOLOGY-V2 §2 still say the exchange-rate fallback is `data/rates.json`, which note 0066 removed. Syncing them edits spec text. **Yes** or **no, leave the spec as it is.** My suggestion is yes, since otherwise the spec contradicts the code.

**Two things waiting on you that aren't mine to do**
- **Merge #105** when you've looked at it. It changes nothing on the site.
- **The final read of the Czech copy** in `src/content/copy.ts`. SPEC §17.10 names it a required step before deploy, and you said you'd do one last pass.

**What I'll do next without waiting on you:** the closing docs, meaning `docs/PHASES.md` status and the Phase 6 plan checklist, so the repo says what is done and what isn't.

**Optional quick checks, if you still have the e-mails:** the tips-confirmation link, "Přihlásit zpět", the footer "Cookies" link, scrolling under the in-app bar, and the results page itself. I marked those "not reported" and haven't treated them as passed.

Reply with "yes, yes" (or "yes, no" and so on) for the two decisions, and I'll start.

### David 18:52

Yes for both decisions

### Claude 18:52

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b fix/tax-card-unsourced && cat src/components/HiddenCosts/HiddenCosts.tsx; grep -rn "stáhne zahraničí\|Daň ze zisků" src e2e docs/design/wireframe-b.md README.md | cut -c1-160; sed -n 575,585p src/content/copy.ts; grep -rn "unverified" src --include=*.tsx 2>/dev/null | head -5`

### Tool result 18:52

```
import { Section } from '@/components/Section'
import { Tag } from '@/components/Tag'
import { hiddenCostsCopy } from '@/content/copy'
import { nbsp } from '@/lib/typography'
import styles from './HiddenCosts.module.scss'

const text = hiddenCostsCopy

// "Za co platíte, aniž to vidíte": the three costs, one plain sentence each. Static
// content (no client JavaScript). The numbers on the cards are a CSS counter, so
// the text itself carries no figures.
export function HiddenCosts() {
  return (
    <Section labelledBy="hidden-costs-heading">
      <Tag as="h2" id="hidden-costs-heading">
        {nbsp(text.heading)}
      </Tag>
      <ol className={styles.list}>
        {text.cards.map((ca [... 1377 more characters]
```

### Claude 18:52

`Bash  command: sed -n 36,46p src/components/HiddenCosts/HiddenCosts.test.tsx; sed -n 8,20p e2e/explainers.spec.ts`

### Tool result 18:52

```
const sentences = screen
      .getAllByRole('listitem')
      .map((item) => flat(within(item).getByText(/\./).textContent))
    expect(sentences).toEqual([
      'Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu.',
      'Když fond nebo broker účtuje v cizí měně, platí se za převod z korun.',
      'Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou.',
    ])
  })

  it('contains no figures: it must not state a fee, a rate or an amount', () => {
      const costs = page.getByRole('region', {
        name: 'Za co platíte, aniž to vidíte',
      })
      await expect(costs.getByRole('heading', { level: 3 })).toHaveText([
        'Roční [... 242 more characters]
```

### Claude 18:53

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ p='src/components/HiddenCosts/HiddenCosts.test.tsx' ⏎ s=open(p).read() ⏎ i=s.index("    const sentences = screen"); j=s.index("  it('contains no figures") ⏎ new="""    const sentences = screen ⏎       .getAllByRole('listitem') ⏎       .map((item) => flat(within(item).g [... 1221 more characters]`

### Tool result 18:53

```
× says each in one plain sentence 9ms
     × says nothing about who takes what from the profits until a source stands behind it 1ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
      Tests  2 failed | 3 passed (5)
[This command modified 2 files you've previously read: src/components/HiddenCosts/HiddenCosts.test.tsx, e2e/explainers.spec.ts. Call Read before editing.]
```

### Claude 18:53

`Bash  command: python3 - <<'E' ⏎ p='src/content/copy.ts'; s=open(p).read() ⏎ a="      text: 'Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou.'," ⏎ assert a in s ⏎ s=s.replace(a,"      // No tax statement until a source is read and a reviewer has checked it\n      // (docs/TAX-SOURCES.md): the earlier sentence had no source and is wrong for a\n      // fund that pays nothing out.\n [... 233 more characters]`

### Tool result 18:53

```
Tests  930 passed (930)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
src/content/copy.ts:468:        text: '[Text se doplní podle ověřeného podkladu: co stáhne zahraničí a co dopočítáte u nás.]',
src/content/copy.ts:581:        hint: 'Co stáhne zahraničí a co se dá započítat.',
```

### Claude 18:53

`Bash  command: python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ p='docs/TAX-SOURCES.md'; s=open(p).read() ⏎ i=s.index("## 3. One tax statement is already on the live page"); j=s.index("## 4. A basis for a text") ⏎ s=s[:i]+"""## 3. The one tax statement that was on the page is gone ⏎  ⏎ The third card of "Za co platíte, aniž to vidí [... 2688 more characters]`

### Tool result 18:54

```
Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
FileNotFoundError: [Errno 2] No such file or directory: 'docs/TAX-SOURCES.md'
··············································
··········································
  202 passed (31.1s)
::notice title=🎭 Playwright Run Summary::  202 passed (31.1s)
```

### Claude 18:54

Playwright passes, but the doc edits failed because `docs/TAX-SOURCES.md` isn't on `main` yet (#105 is still open). Stacking this branch on #105, as I did before, and redoing the doc edits.

### Claude 18:54

`Bash  command: git status --short | head; git add -A; git commit -q -m "fix: the unsourced tax card says [ověřit zdroj] ⏎  ⏎ Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" 2>&1 | tail -1; git fetch -q; git merge origin/docs/tax-sources 2>&1 | tail -3; git diff --name-only --diff-filter=U`

### Tool result 18:54

```
M docs/AI-LOG.md
 M e2e/explainers.spec.ts
 M src/components/HiddenCosts/HiddenCosts.test.tsx
 M src/content/copy.ts
✔ Done cleaning up temporary files!
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Automatic merge failed; fix conflicts and then commit the result.
docs/AI-LOG.md
```

### Claude 18:54

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/AI-LOG.md'; s=open(p).read() ⏎ m=re.search(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n",s,re.S) ⏎ s=s[:m.start()]+m.group(2).rstrip('\n')+"\n"+m.group(1)+s[m.end():] ⏎ open(p,'w').write(s) ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:60]); open(p,'w').write(s.replace(a,b,1)) ⏎ p='docs/TAX-SOURCES.md'; s=open(p).read() ⏎ i=s.in [... 3175 more characters]`

### Tool result 18:54

```
0
      Tests  930 passed (930)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/106
[This command modified 1 file you've previously read: README.md. Call Read before editing.]
```

### Claude 18:54

Now the second approved item, the `rates.json` doc sync, as its own PR from `main`.

### Claude 18:54

`Bash  command: git checkout -q main && git checkout -q -b docs/sync-rates-json && grep -n "rates.json\|rates\b" docs/SPEC.md docs/METHODOLOGY-V2.md docs/METHODOLOGY.md docs/DATA-NEEDS.md docs/PHASES.md data/README.md | cut -c1-260`

### Tool result 18:54

```
docs/METHODOLOGY.md:38:DEGIRO's "Auto FX" fee, 0,25 % of the converted amount, from its "Přehled poplatků" ("rates from 2026-01-01"). The page applies it to both funds, as decided in note 0019 (one conversion fee for every fund).
docs/METHODOLOGY-V2.md:30:| rates           | Kč per EUR and per USD | the Czech National Bank rate on a stated date, a sourced record (decided). **Proposed:** the freshness limit of broker fees, 45 days |
docs/METHODOLOGY-V2.md:34:### Exchange rates, fetched daily (decided, note 0038)
docs/METHODOLOGY-V2.md:40:- **Fallback.** If the fetch fails or the answer cannot be read, the verified record in `data/rates.json` is used while it is at most 45 days old. With neith [... 1865 more characters]
```

### Claude 18:54

`Bash  command: sed -n 120p docs/SPEC.md | cut -c150-520; sed -n 395p docs/SPEC.md | cut -c150-600; sed -n 40,43p docs/METHODOLOGY-V2.md | cut -c1-500; sed -n 177p docs/METHODOLOGY-V2.md`

### Tool result 18:54

```
edOn, evidence}`. Schema validated at build time with Zod; **the build fails if any value lacks a source or is older than 120 days (45 days for broker fees and exchange rates, notes 0024 and 0038).**
b.archive.org) and/or a SHA-256 of the saved source PDF. The validator fails the build if any field is missing, `TODO_VERIFY` remains, or `asOf` is older than 120 days (45 days for broker fees and exchange rates). `asOf` is the date printed in a dated data document; for a source that stays in force or has no data date (a fee overview, a treaty, a live page) it is the date we captured it and confirmed it is current (note 0024).
- **Fallback.** If the fetch fails or the answer cannot be read, the  [... 624 more characters]
```

### Claude 18:55

`Bash  command: grep -n "MAX_RATE_AGE_DAYS" src/server/cnb.ts | head -3; python3 - <<'E' ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:70]); open(p,'w').write(s.replace(a,b,1)) ⏎ S='docs/SPEC.md' ⏎ sub(S,"'data/etfs.json', 'data/brokers.json', 'data/rates.json' and 'data/sources.json'","'data/etfs.json', 'data/brokers.json' and 'data/sources.json'") ⏎ sub(S,"(45 days for broker fees and e [... 1877 more characters]`

### Tool result 18:55

```
15:export const MAX_RATE_AGE_DAYS = 45
87:// Fresh up to and including MAX_RATE_AGE_DAYS; a date in the future is not fresh.
91:  maxDays = MAX_RATE_AGE_DAYS,
docs/METHODOLOGY-V2.md:40:- **No fallback record.** There was a verified record in `data/rates.json` for the case that the fetch fails; note 0066 remo
```

### Claude 18:55

`Bash  command: sed -n 40p docs/METHODOLOGY-V2.md; sed -n 1,8p docs/decisions/0038-exchange-rates-fetched-daily.md; grep -n "rates.json\|fallback" docs/decisions/0038-exchange-rates-fetched-daily.md | cut -c1-200`

### Tool result 18:55

```
- **No fallback record.** There was a verified record in `data/rates.json` for the case that the fetch fails; note 0066 removed it, because it would be older than the freshness limit within days. If the fetch fails or the answer cannot be read, there is no rate, brokers with fees in euro or dollars have no price, and the calculator is in the fund-fee-only state (decision A).
# 0038. Exchange rates are fetched daily from the Czech National Bank

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

13:The server fetches the bank's public daily file and caches it (`use cache` with `cacheLife`): 12 hours when the bank answered, 5 minutes after a failure. The site makes about two small request [... 5 more characters]
```

### Claude 18:55

`Bash  command: sed -n 13p docs/decisions/0038-exchange-rates-fetched-daily.md | cut -c150-700; python3 - <<'E' ⏎ p='docs/decisions/0038-exchange-rates-fetched-daily.md'; s=open(p).read() ⏎ s=s.replace("Status: accepted\n","Status: accepted; the stored fallback record was removed by 0066\n",1) ⏎ open(p,'w').write(s) ⏎ E ⏎ cat >> docs/AI-LOG.md <<'E' ⏎  ⏎ ### Phase 6: the 'rates.json' drift in the spec an [... 2195 more characters]`

### Tool result 18:55

```
ure. The site makes about two small requests a day, not one per visitor, and the request carries nothing about the visitor. If the fetch fails, the verified record in `data/rates.json` is used while it is at most 45 days old; otherwise there is no rate, brokers with fees in euro or dollars have no price, and the calculator is in the fund-fee-only state (note 0037). A rate older than 45 days is never used; each currency is chosen on its own. The page shows the rate's own date ("kurz ČNB z 9. 10. 2026").
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/107
```

### Claude 18:55

Two PRs are up. Now the closing docs, which I said I'd do without waiting.

### Claude 18:55

`Bash  command: git checkout -q main && git pull -q && git checkout -q -b docs/close-phase-6 && sed -n 1,35p docs/PHASES.md | cut -c1-420; grep -n "^## Phase 6" -A8 docs/PHASES.md`

### Tool result 18:55

```
# Dev phases

Short version of [SPEC.md](SPEC.md) §14, §20 and §22. If this file and the spec disagree, the spec wins.

**Deadline:** Fri 2026-10-16. **Re-planned 2026-10-12:** the P0 core by Tuesday evening 2026-10-13, Wed to Thu is buffer (SPEC §20). Status of each phase is in the git history and `docs/AI-LOG.md`.

## At a glance

| #   | Phase                                                                                   | Target     | Needs from David                              |
| --- | --------------------------------------------------------------------------------------- | ---------- | --------------------------------------------- |
| 0   | Scaffold (done)                         [... 3738 more characters]
```

### Claude 18:55

`Bash  command: grep -n "^- \[ \]\|^- \[x\]\|^###\|^## " docs/PHASE-6-PLAN.md | sed -n 1,90p | cut -c1-170; curl -s -o /dev/null -w "robots.txt %{http_code}\n" https://etf-kompas-kappa.vercel.app/robots.txt`

### Tool result 18:55

```
5:## Acceptance (SPEC §22)
12:## What already exists (verified in the repo)
19:## Answers from David (2026-10-14)
28:## How retention will work (PR 2, for approval)
38:## Meta Conversions API (decided: prepared, not enabled)
44:## Branches and PRs (one concern each, cut from `main`)
58:## Checklist
60:### Needs from David (blockers, in order)
62:- [ ] Approve this plan (answers recorded above).
63:- [ ] Add `CRON_SECRET` to Vercel (a random value, `openssl rand -base64 32`).
64:- [ ] Remind: decide `EMAIL_MODE` (`live` or `sandbox`) **at the end of the phase**.
65:- [ ] Create the Vercel project (Hobby), connect the GitHub repo, region near the Supabase EU project.
66:- [ ] Put the environme [... 5803 more characters]
```

### Claude 18:55

`Bash  command: curl -s https://etf-kompas-kappa.vercel.app/ | grep -o 'kurz ČNB[^<]\{0,40\}' | head -3; curl -s https://etf-kompas-kappa.vercel.app/ | grep -o '[0-9 ]\{3,9\} Kč' | head -5; curl -sI https://etf-kompas-kappa.vercel.app/ | grep -i "strict-transport\|content-security\|x-frame\|x-content-type\|referrer-policy"`

### Tool result 18:56

```
20 000 Kč
 20 000 Kč
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

### Claude 18:56

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/PHASE-6-PLAN.md'; lines=open(p).read().split('\n') ⏎ # (prefix to find, new mark, optional appended note) ⏎ rules=[ ⏎ ("- [ ] Approve this plan","x",""), ⏎ ("- [ ] Add 'CRON_SECRET'","x"," (rotated and saved by David; the manual '/api/purge' answered with 'failed: 0')"), ⏎ ("- [ ] Remind: decide 'EMAIL_MODE'","x"," Decided: 'sandbox' with an allowlist [... 5250 more characters]`

### Tool result 18:56

```
missing []
# Phase 6 plan: deploy and polish

Status: **approved by David on 2026-10-14. PR 1 (#90) merged; PR 2 (retention) merged; PR 3 (noindex, share image, head) merged;  Written 2026-10-14. Source: SPEC §17.14, §19 (launch gate), §20, §22 (Phase 6), §23, `docs/PHASES.md`, `docs/PHASE-5-PLAN.md` (open items) and the README "Known gaps
[This command modified 1 file you've previously read: docs/PHASE-6-PLAN.md. Call Read before editing.]
```

### Claude 18:56

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/PHASE-6-PLAN.md'; s=open(p).read() ⏎ s=re.sub(r"Status: \*\*approved by David on 2026-10-14\. PR 1.*?  Written 2026-10-14\.","Status: **approved by David on 2026-10-14; done on 2026-10-14 with the open items marked below.** Written 2026-10-14.",s,count=1,flags=re.S) ⏎ open(p,'w').write(s) ⏎ def sub(p,a,b): ⏎     s=open(p).read(); assert a in s,(p,a[:7 [... 4826 more characters]`

### Tool result 18:56

```
## Phase 6: Deploy and polish (done, with open items)

- Vercel deploy with `noindex` header verified by `curl -I`
- In-app browser checklist (SPEC §23) done and recorded in a decision note
- README complete per SPEC §16, all known gaps listed

## Priorities

$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
remote: 
https://github.com/Phunkhouse/etf-kompas/pull/108
[This command modified 3 files you've previously read: docs/PHASES.md, docs/PHASE-6-PLAN.md, README.md. Call Read before editing.]
```

### Claude 18:56

Both decisions and the closing docs are done, in four open PRs. I haven't read the CI results for any of them.

| PR | What it is |
| --- | --- |
| [#105](https://github.com/Phunkhouse/etf-kompas/pull/105) | The tax sources basis (`docs/TAX-SOURCES.md`). Documentation only. |
| [#106](https://github.com/Phunkhouse/etf-kompas/pull/106) | The third tax card now says `[ověřit zdroj]`. Tests first, `pnpm check` (930 tests) and Playwright (202) pass. It stacks on #105, so merge #105 first or this one first, either works. |
| [#107](https://github.com/Phunkhouse/etf-kompas/pull/107) | Syncs SPEC §4/§5 and METHODOLOGY-V2 with the removal of `rates.json`. Documentation only. |
| [#108](https://github.com/Phunkhouse/etf-kompas/pull/108) | Closes Phase 6: `docs/PHASES.md` and every line of the plan checklist, ticked or left open with a note. |

**One thing I found while ticking the checklist.** The live site sends only HSTS (from Vercel) and our own `X-Robots-Tag`. It has no Content-Security-Policy, `X-Frame-Options`, `X-Content-Type-Options` or `Referrer-Policy`. I listed it as a gap in the README and didn't change anything.

**Open items, as written in #108**
- **Czech copy:** your final read of `src/content/copy.ts` (SPEC §17.10).
- **Legal:** no review exists. Retention is provisional, and the tax text is `[ověřit zdroj]`.
- **E-mail:** delivery to Seznam, Gmail and Outlook has never been checked.
- **Cron:** the cron's own first run hasn't been seen, and a real deletion hasn't happened.
- **Performance:** INP and TBT are not measured.
- **Live checks not run:** the rate limit on the live site, and the exchange-rate fetch.
- **In-app items you didn't report:** the footer "Cookies" link, scrolling under the app bar, the results page, the tips confirmation.
- **Not written:** `README.cs.md`.

**What I need from you**
1. **Merge #105 to #108** after a look. None of them changes how the site behaves, except #106, which replaces the one tax sentence.
2. **Your Czech copy pass** and a final look at README section 10, which is my summary of the AI log and should be in your voice.

I haven't started anything beyond these. I'm not waiting on any other decision from you.

### David 19:01

Resolve conflicts in #106

### Claude 19:01

`Bash  command: git fetch -q && git checkout -q fix/tax-card-unsourced && git merge origin/main 2>&1 | tail -6; git diff --name-only --diff-filter=U; for f in $(git diff --name-only --diff-filter=U); do echo "== $f"; grep -n "^<<<<<<<\|^=======\|^>>>>>>>" $f; done`

### Tool result 19:01

```
CONFLICT (content): Merge conflict in README.md
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Auto-merging docs/TAX-SOURCES.md
CONFLICT (add/add): Merge conflict in docs/TAX-SOURCES.md
Automatic merge failed; fix conflicts and then commit the result.
README.md
docs/AI-LOG.md
docs/TAX-SOURCES.md
== README.md
86:<<<<<<< HEAD
88:=======
90:>>>>>>> origin/main
== docs/AI-LOG.md
1435:<<<<<<< HEAD
1451:=======
1452:>>>>>>> origin/main
== docs/TAX-SOURCES.md
36:<<<<<<< HEAD
40:=======
44:>>>>>>> origin/main
63:<<<<<<< HEAD
65:=======
67:>>>>>>> origin/main
```

### Claude 19:01

`Bash  command: sed -n 1451,1453p docs/AI-LOG.md | cut -c1-80; sed -n 1435,1437p docs/AI-LOG.md | cut -c1-90; sed -n 38,44p docs/TAX-SOURCES.md | cut -c1-160; sed -n 63,67p docs/TAX-SOURCES.md | cut -c1-120`

### Tool result 19:01

```
=======
>>>>>>> origin/main
<<<<<<< HEAD

### Phase 6: the unsourced tax card is replaced

The third card of "Za co platíte, aniž to vidíte" (`hiddenCostsCopy` in `src/content/copy.ts`) said that a part of paid-out profits is taken by a foreign sta
=======
## 3. One tax statement is already on the live page

The third card of "Za co platíte, aniž to vidíte" (`src/content/copy.ts`, `hiddenCostsCopy`) reads, in effect: _a part of paid-out profits is taken by a fore
>>>>>>> origin/main
<<<<<<< HEAD
6. What should the third card and the placeholders of the comparison page and the PDF say, if anything (section 3 above)
=======
6. Keep, reword or remove the third card (section 3 above).
>>>>>>> or [... 9 more characters]
```

### Claude 19:01

`Bash  command: python3 - <<'E' ⏎ import re ⏎ for p in ['README.md','docs/AI-LOG.md','docs/TAX-SOURCES.md']: ⏎     s=open(p).read() ⏎     s=re.sub(r"<<<<<<< HEAD\n(.*?)=======\n.*?>>>>>>> [^\n]*\n",lambda m:m.group(1),s,flags=re.S) ⏎     open(p,'w').write(s) ⏎ E ⏎ grep -c "^<<<<<<<\|^>>>>>>>\|^=======$" README.md docs/AI-LOG.md docs/TAX-SOURCES.md; grep -n "^### Phase 6: the basis for the tax text\|^###  [... 543 more characters]`

### Tool result 19:02

```
README.md:0
docs/TAX-SOURCES.md:0
docs/AI-LOG.md:0
1421:### Phase 6: the basis for the tax text (`docs/TAX-SOURCES.md`)
1436:### Phase 6: the unsourced tax card is replaced
36:## 3. The one tax statement that was on the page is gone
      Tests  930 passed (930)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
→ lint-staged could not find any staged files.
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
[This command modified 1 file you've previously read: README.md. Call Read before editing.]
```

### Claude 19:02

`Bash  command: git status -sb | head -3; git log --oneline -2; git diff origin/fix/tax-card-unsourced --stat | tail -1`

### Tool result 19:02

```
## fix/tax-card-unsourced...origin/fix/tax-card-unsourced
66e58de Merge main into fix/tax-card-unsourced
b7283d7 docs: where the tax sources are, and a basis for a reviewer (#105)
```

### Claude 19:02

The conflicts in #106 are resolved and pushed, and the PR now shows as mergeable. "Blocked" only means CI and review haven't finished. I haven't read the CI results. After the merge, `pnpm check` (930 tests) and `pnpm format:check` pass.

The conflicts came from #105 being merged into `main`, so `README.md`, `docs/AI-LOG.md` and `docs/TAX-SOURCES.md` had two versions of the same lines. In each file I kept the wording from this branch:
- **`docs/TAX-SOURCES.md`:** section 3 says the unsourced card is gone, not that it's still on the page, and question 6 asks what the card and placeholders should say.
- **`README.md`:** the line says the card now reads `[ověřit zdroj]`.
- **`docs/AI-LOG.md`:** both entries are kept, the tax-basis one first and the unsourced-card one after it.

#105, #107 and #108 may now conflict with each other or with `main` in the same files. Tell me which have landed, and I'll resolve what's left.

### David 19:07

Resolve conflicts in #107

### Claude 19:07

`Bash  command: git fetch -q && git checkout -q docs/sync-rates-json && git merge origin/main 2>&1 | tail -5; git diff --name-only --diff-filter=U; for f in $(git diff --name-only --diff-filter=U); do echo "== $f"; grep -n "^<<<<<<<\|^=======\|^>>>>>>>" $f; done`

### Tool result 19:07

```
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Automatic merge failed; fix conflicts and then commit the result.
docs/AI-LOG.md
== docs/AI-LOG.md
1421:<<<<<<< HEAD
1431:=======
1461:>>>>>>> origin/main
```

### Claude 19:07

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/AI-LOG.md'; s=open(p).read() ⏎ m=re.search(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n",s,re.S) ⏎ s=s[:m.start()]+m.group(2).rstrip('\n')+"\n"+m.group(1)+s[m.end():] ⏎ open(p,'w').write(s) ⏎ E ⏎ grep -c "^<<<<<<<\|^>>>>>>>\|^=======$" docs/AI-LOG.md; grep -n "^### Phase 6" docs/AI-LOG.md | tail -6; npx prettier --write docs >/dev/null; pnpm -s [... 348 more characters]`

### Tool result 19:07

```
0
1384:### Phase 6: a domain entry in the sandbox allowlist
1398:### Phase 6: Meta Test Events, browser side
1413:### Phase 6: the server-side Meta Lead stays off
1421:### Phase 6: the basis for the tax text (`docs/TAX-SOURCES.md`)
1436:### Phase 6: the unsourced tax card is replaced
1450:### Phase 6: the `rates.json` drift in the spec and the methodology
      Tests  930 passed (930)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
## docs/sync-rates-json...origin/docs/sync-rates-json
```

### Claude 19:07

The conflicts in #107 are resolved and pushed, and the PR now shows as mergeable. "Blocked" only means CI and review haven't finished, and I haven't read the CI results. After the merge, `pnpm check` (930 tests) and `pnpm format:check` pass.

Only `docs/AI-LOG.md` conflicted, because #105 and #106 had both appended their entries at the end. I kept both and put the entry from `main` first, followed by this branch's `rates.json` entry.

#108 will probably conflict the same way, since it also appends to `docs/AI-LOG.md` and edits `README.md`. Tell me when it's the one left, and I'll resolve it.

### David 19:13

Resolve conflicts in #108

### Claude 19:13

`Bash  command: git fetch -q && git checkout -q docs/close-phase-6 && git merge origin/main 2>&1 | tail -5; git diff --name-only --diff-filter=U; for f in $(git diff --name-only --diff-filter=U); do echo "== $f"; grep -n "^<<<<<<<\|^=======\|^>>>>>>>" $f; done`

### Tool result 19:13

```
Auto-merging README.md
Auto-merging docs/AI-LOG.md
CONFLICT (content): Merge conflict in docs/AI-LOG.md
Automatic merge failed; fix conflicts and then commit the result.
docs/AI-LOG.md
== docs/AI-LOG.md
1421:<<<<<<< HEAD
1434:=======
1474:>>>>>>> origin/main
```

### Claude 19:13

`Bash  command: python3 - <<'E' ⏎ import re ⏎ p='docs/AI-LOG.md'; s=open(p).read() ⏎ m=re.search(r"<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n",s,re.S) ⏎ s=s[:m.start()]+m.group(2).rstrip('\n')+"\n"+m.group(1)+s[m.end():] ⏎ open(p,'w').write(s) ⏎ E ⏎ grep -c "^<<<<<<<\|^>>>>>>>\|^=======$" docs/AI-LOG.md; grep -n "^### Phase 6" docs/AI-LOG.md | tail -4; grep -n "rates.json" docs/PHASES.md | head -2 [... 403 more characters]`

### Tool result 19:13

```
0
1421:### Phase 6: the basis for the tax text (`docs/TAX-SOURCES.md`)
1436:### Phase 6: the unsourced tax card is replaced
1451:### Phase 6: the `rates.json` drift in the spec and the methodology
1460:### Phase 6: closing the phase
      Tests  930 passed (930)
copy:check: 0 problem(s)
$ prettier --check .
All matched files use Prettier code style!
✔ Done cleaning up temporary files!
{"mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE"}
## docs/close-phase-6...origin/docs/close-phase-6
```

### Claude 19:13

The conflicts in #108 are resolved and pushed, and the PR now shows as mergeable. "Blocked" only means CI and review haven't finished, and I haven't read the CI results. After the merge, `pnpm check` (930 tests) and `pnpm format:check` pass.

The only conflict was `docs/AI-LOG.md`, because #105, #106 and #107 had landed their entries at the same spot as the "closing the phase" entry. I kept all of them in order: the tax basis, the unsourced tax card, the `rates.json` sync, and then the closing-the-phase entry from this branch. `README.md` and `docs/PHASES.md` merged without conflicts, so the security-headers gap line and the Phase 6 status are intact.

After #108 merges, the repo's status docs match what was done and what is still open. What's left is yours:
- **The final read of the Czech copy** in `src/content/copy.ts`.
- **Your rewrite of README section 10** in your own voice.
- **A legal review**, which can't happen inside this project.
