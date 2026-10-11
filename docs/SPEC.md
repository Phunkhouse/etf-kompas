# SPEC: ETF landing page for Czech mobile traffic (Clientelo test project)

Status: draft v2, 2026-10-10 (audience v2 and plain-language rules merged; wireframe B pending). Audience of this document: the developer (reviewer) and the Claude Code agents doing the implementation.

---

## 0. The one-line answer

**A mobile-first Czech landing page where the visitor enters an amount and a horizon, instantly sees what ETF fees plus tax cost them in CZK, and unlocks the full 8-ETF comparison ("ETF Kompas 2026", PDF + results page) for an email address, asked for at the moment the calculator result lands.**

Evaluation criterion: *"Could we launch paid traffic to this page tomorrow?"* This drives every priority below. Anything that blocks launch (consent, tracking, data accuracy, risk disclaimers, mobile performance, lead storage) is P0. Anything that merely polishes is P2.

---

## 1. Key decision: what "NYSE-traded ETFs" means for a Czech retail investor

This is the most important product decision, and the brief glosses over it.

- US-domiciled ETFs on NYSE Arca (VOO, VTI, QQQ, SPY, SCHD...) generally **cannot be bought by EU retail clients** at most EU brokers, because they lack a PRIIPs KID. Availability varies by broker and should be verified per broker, not assumed.
- Czech retail investors in practice buy **UCITS ETFs** (Ireland/Luxembourg domiciled, listed on Xetra, LSE, Euronext, etc.) that track the same indices (S&P 500, Nasdaq 100, FTSE All-World).
- Tax and withholding differ materially (US-domiciled fund: 15% US withholding on dividends with W-8BEN under the CZ-US treaty, plus US estate-tax exposure above a threshold; Irish UCITS: typically 15% at fund level on US dividends, no estate-tax issue). **All of this must be verified against primary sources before it goes on the page.**

**Decision:** keep "NYSE" in the hook because it is what Czech searchers type and it is the assignment's framing, but make the page's *value* the honest answer: *"These are the NYSE ETFs everyone talks about; here is what they really cost you from Czechia, and the UCITS equivalent you can actually buy."*

This also supplies the differentiated, non-generic angle: most competing content says "VOO has 0.03% TER" and stops. Ours converts that into Kč, includes tax drag, and answers "can I even buy it?".

Document this decision and rationale in the README (the brief explicitly asks us to decide ambiguities ourselves and justify them).

---

## 2. Target audience (v2, plain language)

Merged from `docs/audience-and-plain-language.md`, which stays as the glossary reference. v2 replaces the v1 "začátečník s první investicí" profile.

**Ideal customer:** *"Člověk, který ví, že by měl investovat, ale nerozumí tomu."*

- Czech, 25 to 40, on a phone, sees the ad for 3 to 5 seconds.
- Has money sitting in a bank or savings account. Has heard the word "ETF" from a friend, YouTube or Instagram but cannot explain it.
- Does **not** know: TER, UCITS, fund domicile, withholding tax, S&P 500 as an index. Does not know the tickers VOO or QQQ by heart.
- Main fear: *"Zaplatím poplatky, o kterých nevím."* Second: *"Udělám chybu a přijdu o peníze."*
- Wants: one clear number in Kč and a plain next step.

**Excluded on purpose:** people who already invest and compare funds by TER, day traders, and anyone looking for guaranteed returns.

**Consequences for the product**
1. The page sells clarity, not comparison depth. The investor-grade detail lives inside the gated comparison, still in plain words first.
2. Every cost is shown in Kč, named by what the customer sees.
3. Jargon is translated, never assumed. The glossary and the enforced rules are in §25.
4. The 5-second test gates Phase 3 (§22): a stranger reading only the hero (headline, one line, the table) must be able to say what the page gives them and why it costs nothing to try. If not, the copy is too clever.

Segmenting data captured on page (not in the form): the calculator's amount and horizon, stored with the lead as qualification data (a lead with a 5,000 Kč/month plan is worth more than a 200 Kč one).

---

## 3. Offer, gate and post-submit

### 3.1 Value before any form (the ungated part)

Everything below is visible with no email:
1. Calculator: amount, monthly contribution, horizon (default 10 yrs), ETF chosen from a small selector.
2. Headline result: *"Za 10 let zaplatíte na poplatcích a dani přibližně X Kč"* for the chosen ETF, plus the gap versus the cheapest comparable option.
3. Top 3 rows of the comparison table (TER, fund size, domicile, "buyable from CZ?"). **No past-performance figures in the ungated part or in ads**; returns appear only inside the gated Kompas, with the standard disclaimer. This keeps the public surface cost-focused and reduces regulatory exposure. In v2 these three rows sit in the hero (§7); after the calculator the same rows are shown again with Kč figures for the visitor’s own inputs.

### 3.2 What the email buys (the gated part): "ETF Kompas 2026"

Brand name: **ETF Kompas** (kept as brand and wordmark; the logo is being made in a separate thread). In body copy the deliverable is called "srovnání 8 fondů" (§25).

- Full comparison of **8 ETFs** (US-listed originals plus UCITS equivalents): TER, fund size, replication, distribution policy, domicile, tax treatment, 5/10-yr performance, each with source and "as of" date.
- One page on Czech taxation of ETFs (3-year time test, dividend withholding, W-8BEN, what to put in the tax return). Must be checked against current law and Finanční správa guidance.
- A "where can I buy it from CZ" table (4 to 5 brokers: availability, fees, FX cost, CZ-language support). **Do not rank brokers by commission income**; neutrality is the trust asset.
- 6-page PDF plus an identical interactive results page (so mobile users do not need to open a PDF).

### 3.3 When we ask

**Exactly once, immediately after the calculator result is shown** (peak curiosity, value already proven). Inline panel under the result, not a modal, not before. A secondary, softer entry point exists at the sticky bottom bar and the end of the page, but it opens the same inline form.

Rejected: gate before calculator (kills conversion on cold traffic), exit-intent popup (does not exist on mobile), pre-calculator "pick your goal" quiz as a gate (P2 experiment only).

### 3.4 Form

- **One required field: email.** Nothing else.
- Legal text under the button (Czech, plain): what they get, who sends it, link to privacy policy. Explicit, **unticked, optional** checkbox for ongoing tips/newsletter. Delivery of the Kompas itself must not depend on marketing consent. **Needs legal review before paid launch**; flag it in the README as a known gap, we are not lawyers.
- Button copy states the benefit: *"Poslat mi ETF Kompas"*, not "Odeslat".
- `inputmode="email"`, `autocomplete="email"`, `autocapitalize="off"`, big tap target (min 48px), no captcha (use honeypot plus server-side rate limit).

### 3.5 After submit

1. **Immediately, same screen (no redirect):** success state with the results page link and a download button for the PDF. Do not rely on email delivery alone.
2. **Within about 1 minute:** transactional email (Resend) with the same links, plain and mobile-readable.
3. **Optional second step on success screen, P2 and off at launch, see §17.4** (progressive profiling, tracked as a separate event `lead_qualified`): *"Chcete, aby vám někdo pomohl vybrat broker? Nechte telefon."* One phone field, clearly optional. Rationale: the first conversion stays frictionless; a high-intent minority self-selects.
4. **P2:** 3-email nurture over 7 days (tax return reminder, broker checklist, "common mistakes").

**Open business question for the README:** who receives these leads (broker, advisor, own newsletter)? The assignment does not say. Assumption: leads feed Clientelo's own list and later partner offers; the privacy text must name the controller. Flag it.

---

## 4. Interactive element: fee and tax drag calculator

Chosen over portfolio builder or pure comparison table because it (a) produces a personalised number in Kč, (b) takes under 10 seconds, (c) the output naturally raises the next question ("what about the other 7?"), which the gate answers.

**Inputs (2):** monthly contribution (slider), horizon (5/10/20 yrs chips). An initial lump sum is not asked for now (decision note 0015). ETF selector defaults to S&P 500 US-listed (VOO).
**Assumption:** a fixed gross return (default 6 % nominal p.a., identical for every ETF so only costs differ; editable in the "Jak počítáme" disclosure). The page must say it is an illustration, not a forecast.
**Outputs:** cumulative cost of TER, FX conversion, and dividend withholding, in Kč, plus the difference versus the cheapest alternative.

Rules:
- Pure function in `src/server/calc.ts`, fully unit-tested (Vitest), formulas documented in `docs/METHODOLOGY.md`. The reviewer must be able to verify the maths by hand.
- No claims such as "you will lose X". Wording: "orientační odhad nákladů".
- Result animates for under 300 ms, not longer. Respect `prefers-reduced-motion`. The one other animation is the hero table intro (decision note 0016).

---

## 5. Data (real, sourced, dated)

**Principle:** every number on the page carries a source and an "as of" date. No number is typed from memory or from an LLM.

- Candidate set (verify each; confirm tickers, ISINs, TER, and that UCITS twins track the same index):
  - US-listed: VOO, VTI, QQQ, SCHD (and possibly SPY as the "everyone knows it" baseline)
  - UCITS equivalents: iShares Core S&P 500 UCITS (CSPX), Vanguard S&P 500 UCITS (VUAA), Vanguard FTSE All-World UCITS (VWCE), iShares Nasdaq 100 UCITS (CNDX)
- Sources, in order of preference: issuer factsheets/KIDs (Vanguard, iShares, Invesco, Schwab), justETF for UCITS metadata, Finanční správa and the CZ-US double-tax treaty text for tax statements, broker fee schedules for the broker table.
- Storage: `data/etfs.json` plus `data/sources.json`, each record `{value, sourceUrl, asOf}`. Schema validated at build time with Zod; **the build fails if any value lacks a source or is older than 120 days.**
- Refresh: `scripts/fetch-data.ts` fetches where machine-readable, otherwise a documented manual-entry template. Agents may not fill in numbers they cannot fetch; they must mark `TODO_VERIFY` and the build must refuse to deploy with any `TODO_VERIFY`.
- Performance figures must carry the standard disclaimer: *"Minulá výkonnost není zárukou budoucích výsledků."* Investing carries risk of loss.

---

## 6. Ads (two variants)

Both run on Meta (Instagram/Facebook feed and Stories) with a Sklik/Google Search twin. Each ad has its own landing-page hero via `?v=a` / `?v=b` (and UTM), so message match is exact. Ad and hero copy follow the plain-language rules in §25 (no abbreviations in the headline, tickers only next to a plain description). Search keywords may still contain "ETF" because that is the term people type; the "ETF at most once" rule applies to the landing page itself.

**Ad A: "Cost" angle (clarity)**
- Hook: *"Kolik vás fond doopravdy stojí? Spočítejte to za 20 sekund."*
- Body: Poplatky fondu v korunách, ne v procentech. Srovnání 8 fondů zdarma.
- CTA: *Spočítat*
- Hero: same promise; headline, one line, the 3-row table, calculator one tap away.

**Ad B: "Myth-bust / curiosity" angle**
- Hook (default, soft): *"Americký fond z Česka často nekoupíte. Co místo něj?"*
- Absolute variant *"Americký fond z Česka nekoupíte"* is allowed **only** if the evidence file for every firm in the table (§18) proves it on the launch date. Otherwise use the soft hook.
- Body: Americký fond vs. jeho evropská verze: poplatky, daně, kde koupit. Srovnání zdarma.
- CTA: *Zobrazit srovnání*
- Hero: *"Americký fond, nebo jeho evropská verze?"* with the same table, the American vs. European rows first.

Compliance for both: no guaranteed return, no "get rich" language, risk statement in creative where required, and check the ad platforms' current policies for financial products. Include the planned UTM schema in the README.

---

## 7. Page structure (mobile-first, and why)

The hero layout is fixed by **wireframe B** (`docs/design/`, pending). The order below is fixed; the exact hero composition follows the wireframe.

1. **Hero (above the fold, 375x667 must show it all):** headline matching the ad, one line under it, the 3-row table (columns: roční poplatek fondu in Kč for an example of 100 000 Kč, and "Koupíte z ČR?", which stays `[ověřit]` until verified per §18), primary CTA to the calculator. Contains the one-line explanation of "ETF" (the only use of the word in body copy). No logo carousel, no stock photo. Trust line: "Odkud máme čísla: Vanguard, iShares, Finanční správa · aktualizováno {date}".
2. **Calculator and live result** ("Spočítejte si to"), the interactive proof, personalised in Kč.
3. **Gate panel** directly under the result (the ask, section 3.3).
4. **"Co je ve srovnání":** a visual preview of 2 PDF pages (reduces uncertainty about what they get).
5. **Trust block:** "Kdo to dělá" (Clientelo, once confirmed), "Jak počítáme", "Odkud máme čísla", independence statement.
6. **Short FAQ (4 items):** Je to zdarma? Co uděláte s mým e-mailem? Je to investiční doporučení? (Ne.) Dá se americký fond koupit z Česka?
7. **Footer:** privacy policy, cookie settings, risk line, company identification, test-project notice (§17.15).

A sticky bottom CTA bar appears after the first scroll and jumps to the gate.

Rationale in one sentence: the hero table already proves there is something worth knowing before any interaction, the calculator turns it into the visitor's own number, and the ask sits at the point of maximum curiosity; everything after it exists only to catch visitors who did not convert immediately (proof, preview, objections).

---

## 8. Design direction (explicitly not "default Claude")

Avoid: purple/blue gradients, glass cards, emoji icons, "Unlock your financial future", centered hero with three feature cards, generic Inter-on-white.

Direction: **"Czech financial print"**, editorial and numeric rather than app-like.
- Typography: a strong serif or grotesk display for numbers and headlines (check that the font has full Czech diacritics: ě š č ř ž ý á í é ů ú ň ť ď), tabular figures for all Kč amounts, a neutral sans for body. Self-hosted via `next/font`.
- Palette: warm off-white paper, near-black ink, one decisive accent (e.g. signal red/orange for "cost") and one calm accent (deep green for "saved"). Contrast must pass WCAG AA.
- The cost number is the visual hero: huge, tabular, in Kč, with the Czech thousands separator (non-breaking space: `12 480 Kč`).
- Charts: simple SVG bars; no chart library on the critical path.
- Copy voice: Czech, informal-polite `vy`, concrete, no anglicisms where a Czech word exists, no hype. All copy written in Czech by the agent, then reviewed by a native speaker (you), because machine Czech is the most likely tell-tale of a generic build.
- Layout direction: **wireframe B** (typography, contrast, layout), chosen by David, stored in `docs/design/` (see §24).
- Brand: wordmark "ETF Kompas"; the logo is created by David in a separate thread. Until it exists a text wordmark is used and no agent designs a logo.

---

## 9. Tracking: the full funnel

**Consent first.** Czech and EU law requires opt-in for non-essential cookies/tracking. Use a small, maintained open-source consent library rather than custom code (e.g. vanilla-cookieconsent; verify license, bundle size and Czech translation), granular (analytics, marketing), default-off, with Google Consent Mode v2 semantics. Tracking before consent is limited to cookieless, aggregate, first-party counting (Vercel Analytics or Plausible), which should be double-checked by legal.

**Event taxonomy** (single `track()` wrapper in `lib/track.ts`, fans out to GA4, Meta Pixel and a first-party `/api/event` endpoint; every event carries `variant`, `utm_*`, `session_id`, `device`):

| # | Event | Fires when |
|---|---|---|
| 1 | `page_view` | landing (with UTM, variant) |
| 2 | `hero_view` / `scroll_25/50/75` | engagement |
| 3 | `calc_start` | first input change |
| 4 | `calc_result` | result displayed (with amount/horizon buckets) |
| 5 | `gate_view` | gate panel enters viewport |
| 6 | `form_focus` | email field focused |
| 7 | `form_submit_attempt` / `form_error` | validation outcome |
| 8 | `lead` | server-confirmed submit (**the conversion**) |
| 9 | `kompas_download` / `results_open` | value delivered |
| 10 | `lead_qualified` | optional phone submitted |

- `lead` is also sent **server-side** to the Meta Conversions API (with deduplication `event_id`) and GA4 Measurement Protocol, because ad-blockers and iOS will drop client-side events.
- Funnel dashboard: a simple internal `/admin/funnel` (basic-auth) or documented GA4 Exploration, showing step-by-step drop-off per variant. **P1.**
- Success metrics: cost per lead (CPL), visit to lead %, calc_result to lead %.

---

## 10. Expected conversion (to state in README, with honest uncertainty)

Cold paid-social mobile traffic, email-only form, value shown before the ask.

| Step | Expected |
|---|---|
| Visit to `calc_start` | 30 to 40 % |
| `calc_start` to `calc_result` | 70 to 80 % |
| `calc_result` to `lead` | 25 to 35 % |
| **Visit to lead (base case)** | **~8 %** (plausible range 4 to 14 %) |

Reasoning: generic finance lead-gen landing pages commonly report single-digit conversion; an interactive result plus single-field form should beat the median, but cold social traffic with a 3-second attention span caps it. State clearly that these are assumptions to be replaced by the first 500 sessions of data. Do not present them as measured.

---

## 11. A/B test hypotheses (ranked by expected impact)

1. **Gate placement and format (highest impact).** H: showing the headline cost in Kč ungated and gating only the full 8-ETF comparison converts better than gating the calculator result itself. Metric: `calc_result` to `lead`; guard metric: bounce and lead quality.
2. **Hero framing.** H: a loss-framed numeric hero ("Zbytečně můžete platit až X Kč") beats the neutral/gain framing ("Porovnejte 8 ETF") for cold mobile traffic. Metric: visit to `calc_start`.
3. **Form friction.** H: email-only beats email plus optional "kolik chcete investovat?" chips in lead volume, but the second may increase lead quality enough to lower cost per *qualified* lead. Metric: CPL and `lead_qualified` rate.

Backlog (not top 3): social proof wording, sticky CTA on/off, PDF preview image vs. bullet list.

Tooling: Vercel Edge Config / cookie-based bucketing, or simply separate `?v=` URLs per ad set (simplest and cleanest for ad platforms). Choose the latter for launch.

---

## 12. Tech stack (accepted, with suggestions)

| Area | Choice | Note |
|---|---|---|
| Framework | **Next.js (App Router), TypeScript strict** | SSG for the page, route handlers for API |
| Styling | **SCSS Modules** (as requested) | Design tokens as CSS custom properties in `styles/tokens.scss`; no Tailwind |
| Hosting | **Vercel** (Hobby) | Note: the Hobby plan is non-commercial in its terms; for real launch use Pro or document this limitation |
| Lead storage | **Supabase Postgres** (free tier) via server route, RLS on, service key only server-side | Alternative: Neon via Vercel Marketplace |
| Email | **Resend** | SPF/DKIM on a real sending domain before launch |
| Validation | **Zod** shared by client and server | |
| Tests | **Vitest** (projects `unit` + `components`, split by file suffix) and **Playwright** (mobile-first happy path, form, consent) | See §12a |
| Analytics | GA4 + Meta Pixel/CAPI + Vercel Analytics | gated by consent |
| PDF | Pre-built static PDF, generated at build from the same data JSON (`@react-pdf/renderer`) | so the PDF cannot drift from the page |
| CI | GitHub Actions: format check, lint, typecheck, test, data validation, build, e2e; Lighthouse CI as P1 | Structure from the starter guide, see §12a |

Suggestions you can veto: skip a UI kit and charting library entirely (payload and genericness); use `next/font` self-hosting for GDPR-safe fonts; keep JS small (target: route JS under 90 KB gzipped, LCP under 2.0 s on mid-range Android over Slow 4G).

---

### 12a. Engineering baseline (adopted from the starter guide)

The reference is the team's Next.js starter setup guide. Copy it into the repo as `docs/starter-guide.md` so the agents can read it. Where this spec and the guide disagree, **this spec wins**, and every deviation is listed here.

**Adopted as-is**
- pnpm via corepack with `packageManager` pinned, Node 24 (`.nvmrc`), no `package-lock.json`
- `create-next-app` flags from the guide (`--ts --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-tailwind`); `next`, `react`, `react-dom` and `eslint-config-next` pinned exactly
- Stock strict `tsconfig`, ESLint flat config, Prettier (no semicolons, single quotes), Husky plus lint-staged (formatting only; never `--no-verify`)
- `pnpm-workspace.yaml` build-script allowlist, `.gitignore` additions, React Compiler on (no `useMemo`/`useCallback`/`React.memo` without measurement)
- Script set (`check`, `typecheck` with `next typegen`, `format:check`, etc.); `pnpm check && pnpm format:check` before finishing any change
- Vitest split by suffix (`*.test.ts` node, `*.test.tsx` jsdom), Testing Library with `getByRole` queries, no fixed sleeps
- SCSS Modules, design tokens as CSS variables, `rem()` and `from()` helpers, import order `reset.css`, `variables.scss`, `globals.css`
- Component folder convention, named exports, no barrel files, Zod shared between client and server, accessibility rules
- CI shape with third-party actions pinned to a commit SHA, Conventional Commit PR titles, one concern per PR, never push to `main`, dependency justification in the PR body, no committed secrets

**Adapted**
- **Playwright:** primary project is a mobile device profile (e.g. Pixel 7), plus one desktop smoke project. The guide's desktop-only config does not match our audience.
- **Tokens:** token names and structure kept; the guide's black/white/blue placeholder values are replaced by the palette from §8.
- **Money:** anything stored or sent over the API is an integer (whole Kč); no floats cross the API boundary. The calculator's internal maths may use floats, with one documented rounding step at output (`docs/METHODOLOGY.md`).
- **`src/server`:** the framework-free layering rule is kept and used for `calc`, lead handling and data validation, so the pure logic is unit-tested in the node environment.
- **`allowedDevOrigins`:** kept, because the review checklist requires testing on a real phone.
- **CI:** adds `data:validate` (fails on missing sources, stale data or `TODO_VERIFY`) and, as P1, Lighthouse CI.

**Dropped (reviewer may veto)**
- **`next-intl`:** single locale, and we have a JS budget (§12). UI strings live in one typed module, `src/content/copy.ts` (one file for copy review, lintable against the glossary in a test, functions for interpolation such as `consent(controller)`), imported by server components and passed to client components as props. `messages/*.json` catalogs are dropped for the same reason. Reinstate an i18n library and catalogs only if a second language is added.
- **React Hook Form:** the form has one field. Native form, Zod and a small hook are enough and save bundle size.
- **Postgres service in CI:** lead storage is tested against a mocked repository; the real database is covered in the manual launch checklist.

**Caveat for the agents:** the guide contains placeholders (`<sha>`) and a few config details that may not match current tool versions (for example the CI setup action name and some Vitest options). Verify each against current official docs and resolve real SHAs yourself instead of copying blindly. Log any correction in `docs/AI-LOG.md`.

---

## 13. Repository layout

```
src/
  app/               routes: page, results/[token], api/lead, api/event, privacy;
                     reset.css, variables.scss, globals.css
  components/<Name>/ <Name>.tsx, <Name>.module.scss, <Name>.test.tsx, index.ts
                     Hero, Calculator, ResultPanel, GatePanel, CompareTable, ...
  config/            env schema (Zod), site config (name, controller, contacts)
  content/           copy.ts (all UI strings, typed, single locale)
  lib/               track.ts, consent.ts, helpers + *.test.ts
  server/            framework-free logic: calc.ts, leads.ts, data validation
  styles/            _utilities.scss
data/                etfs.json, brokers.json, sources.json
scripts/             fetch-data.ts, validate-data.ts, build-pdf.ts
e2e/                 Playwright specs
docs/                SPEC.md, starter-guide.md, METHODOLOGY.md, AI-LOG.md,
                     TRACKING.md, LEGAL-PACK.md
docs/decisions/      README.md (format and rules), NNNN-short-title.md notes
docs/design/         wireframe-b.png (+ other states), wireframe-b.md (text spec), README.md
CLAUDE.md            agent rules (section 15)
README.md
```

---

## 14. Priorities and phases

**P0: launch blockers** (must exist for "launch tomorrow")
- Hero matched to both ads, calculator with tested maths, gate and one-field form, server-side lead storage, delivery email and instant success state, Kompas results page plus PDF
- Real sourced data with the build-time validator
- Consent banner and the full event taxonomy through `lead`, including server-side `lead`
- Privacy policy page (draft, flagged for legal review), risk disclaimers, mobile performance budget
- Deployed on Vercel; README complete

**P1:** funnel dashboard, `docs/LEGAL-PACK.md`, monthly data-refresh action, Playwright e2e in CI, Lighthouse CI, OG image, basic error monitoring.
**P2:** nurture emails, personalised PDF, broker comparison depth, English version.

Suggested sequencing: (1) scaffold plus tokens plus data pipeline, (2) calculator plus tests, (3) page sections plus design, (4) form/API/email/results page, (5) tracking and consent, (6) polish, e2e, deploy, README.

---

## 15. How we work with the agents (this feeds the README section)

You act as reviewer. Rules for the agents, to put in `CLAUDE.md`:

1. Work from this spec only. If the spec is silent, make the smallest reasonable decision, write a decision note in `docs/decisions/` (format in its README) with a reason, and continue.
2. Never invent data, sources, URLs or legal statements. Unknown means `TODO_VERIFY`.
3. All user-facing copy in natural Czech; every string lives in `src/content/copy.ts` so it can be reviewed in one file and linted (§25).
4. Small PRs per phase (section 14), each with tests and a short self-review comment listing risks.
5. No new dependency without a one-line justification in the PR.
6. Maintain `docs/AI-LOG.md`: for each phase, the prompt given, what was produced, what was wrong, what was changed. **Fill it in as you go**, because the README must honestly report where the AI erred and this cannot be reconstructed afterwards.
7. Tooling and conventions follow `docs/starter-guide.md` as adapted in §12a. Run `pnpm check && pnpm format:check` before finishing any change, one concern per branch and PR, Conventional Commit titles, never push to `main`.

**Reviewer checklist per PR:** (a) re-derive 2 calculator outputs by hand, (b) spot-check 5 data values against the cited source, (c) read all Czech strings aloud, (d) test on a real phone on mobile data, (e) check network tab: nothing marketing fires before consent, (f) confirm `lead` appears once in GA4/Meta test mode with matching `event_id`, (g) Lighthouse mobile run.

Known likely AI failure modes to watch: plausible but wrong TER/return figures, outdated Czech tax rules, calculator rounding and compounding errors, Czech grammar and diacritics slips, tracking firing pre-consent or double-counting `lead`, generic "SaaS" visual defaults creeping back, accessibility regressions in the custom slider.

---

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

## 17. Decisions on the open questions

1. **Lead recipient:** leads go to a single list owned by the data controller, and **are not passed to brokers or any third party at launch**. This is the simplest lawful setup (one controller, one purpose, no sharing). The controller's name, IČO, address and contact are one config value (`src/config/site.ts`). In the demo they are clearly marked placeholders; **do not name Clientelo as controller unless Clientelo agrees**. Before any real launch Clientelo fills in its own details and confirms.
2. **Broker relationships:** no affiliate links, no ranking by commission, brokers listed alphabetically, facts only. If Clientelo has any commercial relationship with a listed broker, it must be disclosed visibly next to that broker and the content treated as advertising. This is also a trust asset: "independent comparison" is the page's differentiator.
3. **Return assumption:** 6 % nominal, same for all ETFs, labelled "příklad, ne slib", editable. The page's message is about the *cost difference*, so the absolute return only scales the numbers. 6 % is deliberately below long-run US equity history so the page does not sound promissory.
4. **Phone step (§3.5):** moved to P2 until the lead recipient and purpose for phone numbers are defined by Clientelo. Email only for launch.
5. **Domain and sender:** Vercel URL plus a Resend test sender for the demo; a real sending domain with SPF/DKIM/DMARC is a launch step.
6. **Language:** Czech only.
7. **Indexing:** `noindex` and no paid traffic until the launch gate in §19 is signed off.
8. **Deadline:** hard deadline 2026-10-16; stretch target is Phases 1 to 4 by Sunday 2026-10-11 evening and P0 complete by Monday 2026-10-12. Plan and cut order in §20.
9. **README language:** English first (`README.md`). A Czech version `README.cs.md` is linked from the top of the English one and is done only after P0/P1 are complete.
10. **Czech copy review:** David (native Czech) reviews every string in `src/content/copy.ts` before deploy. This is a named step in the checklist, not optional.
11. **Repository:** public GitHub repo. Consequences: no secrets ever, `.env.example` only, controller details are placeholders, and third-party source PDFs are **not** committed (store the archive link and SHA-256 only).
12. **Analytics accounts:** David creates a free GA4 property and a free Meta dataset (pixel) with a test-events view; the IDs go into Vercel environment variables. First-party event storage (§9) is always on, so the full funnel is measurable and demonstrable even if GA4/Meta are not configured. A `?debug=1` mode prints events to the console.
13. **Lead value unknown:** Clientelo has not given lead economics. The README states this openly and uses the transparent assumption model in §28.
14. **Submission:** public GitHub repo plus a working `*.vercel.app` URL (no custom domain).
15. **Email sending domain:** the demo sends from David's own test domain, verified in Resend (SPF, DKIM, DMARC), so real delivery to any visitor works. This is **transparent test use**: the sender name and the email footer say it is a test project, the page footer and README say the same, and nothing is sent beyond the single Kompas email (plus the double opt-in confirmation if the newsletter box is ticked). The sending domain, sender name, reply-to and controller details live in environment variables and `src/config/site.ts`, so moving to Clientelo's real domain is a config change plus DNS records, with no code changes. `EMAIL_MODE=live|sandbox` stays as a safe fallback (sandbox sends only to allowlisted addresses and the UI never claims an email was sent when it wasn't). In-page delivery (results page, PDF) remains the primary deliverable regardless (see §23). The README documents the test-domain status and the production switch checklist.
16. **Brand and logo:** "ETF Kompas" is kept as the brand name and wordmark. The logo is made by David in a separate project thread; nothing logo-related is built until it is delivered (text wordmark placeholder, slot at `public/brand/`).
17. **Copy module instead of `messages/cs.json`:** the site is single-locale, so UI strings live in a typed `src/content/copy.ts` (see §12a). Reversible if a second language appears.
18. **Wireframe B** is stored in `docs/design/` as exported images plus a text spec (see `docs/design/README.md`), and the design foundation (tokens, primitives, `/styleguide`) is built before the page (§24, Phase 1b).

---

## 18. Data verification protocol (facts must be provable)

Principle: a number is only on the page if a human has checked it against a primary source and the proof is stored.

**Source rules**
- Fund facts (TER, index, domicile, replication, distribution policy, fund size): the issuer's own factsheet or KID/KIID PDF and issuer website. A second source (e.g. justETF for UCITS) is used only as a cross-check; mismatches are recorded in a decision note in `docs/decisions/`.
- Tax statements: the statute itself (Zákon č. 586/1992 Sb., o daních z příjmů), Finanční správa guidance, and the CZ-US double-tax treaty text. Each statement on the page cites the section it comes from. Wording is "obecná informace, ne daňové poradenství".
- Broker facts (fees, FX, availability of a given ETF): the broker's official fee schedule or product page, plus a dated screenshot of the broker's own instrument search for each ETF. Availability claims depend on that screenshot, not on memory or forum posts.

**Record schema (extends §5):** every value has `{value, sourceUrl, asOf, verifiedBy, verifiedOn, evidence}` where `evidence` is an archive link (web.archive.org) and/or a SHA-256 of the saved source PDF. The validator fails the build if any field is missing, `TODO_VERIFY` remains, or `asOf` is older than 120 days (45 days for broker fees).

**Process**
1. Agent proposes values via `scripts/fetch-data.ts`, or marks `TODO_VERIFY` where it cannot fetch. It may never fill from memory.
2. **You verify 100 % of values against the source on every data refresh**, not a spot-check. Scope: about 8 ETFs x 8 fields plus about 5 brokers x 4 fields is roughly 100 values, around an hour. You set `verifiedBy`/`verifiedOn`.
3. Calculator outputs: two hand-derived cases per PR (existing checklist).
4. A monthly GitHub Action opens an issue "refresh data" so staleness is a visible task, not a surprise.
5. Anything unprovable is removed or softened (e.g. the absolute VOO claim in Ad B).

**Tax content scope:** keep to a few statements (time test, dividend withholding and W-8BEN, where it goes in the tax return). Items from memory that must be re-verified against current law before use include the 3-year time test, the annual exemption limit, and the 15 % treaty rate. If possible, ask an accountant or tax adviser to read that one page; it is far cheaper than a full legal review.

---

## 19. Legal and compliance approach (no lawyer on the team)

We are not lawyers and the spec does not claim legal sufficiency. The strategy is: **shrink the legal surface, build to authoritative guidance, then hand a ready "legal pack" to a qualified person, with a hard launch gate.**

**1. Shrink the surface (design choices already in the spec)**
- Informational comparison only: no personalised recommendation, no "buy this", no guaranteed or promissory language, no testimonials.
- One field (email), one purpose, no third-party sharing, no affiliate links.
- No past-performance claims in ads or the ungated page; mandatory risk text.
- Delivery of the Kompas does not depend on marketing consent; the newsletter checkbox is separate, optional and unticked.
- Cookies and pixels: opt-in only, default off. EU-region services where available (e.g. Supabase and Resend EU regions) and each provider's standard DPA accepted and listed.

**2. Build to authoritative sources** (agents cite these in `docs/LEGAL-NOTES.md`, and a human checks the citations)
- Úřad pro ochranu osobních údajů (uoou.gov.cz): GDPR guidance, cookies and consent.
- Czech electronic communications and e-commerce law on cookies and unsolicited commercial email (to be confirmed by the reviewer: zákon č. 127/2005 Sb. and zákon č. 480/2004 Sb.).
- ČNB consumer-protection material and ESMA/MiFID II principles that marketing of investment products be fair, clear and not misleading.
- The ad platforms' current financial-products advertising policies (Meta, Google, Sklik).

**3. Legal pack (`docs/LEGAL-PACK.md`), the deliverable that makes review cheap**
- Data-flow map: what is collected, where it is stored, which processors, retention period, transfers outside the EU.
- Drafts: privacy policy, consent texts, cookie categories, risk disclaimer, "not investment advice" wording.
- Event list from §9 mapped to consent categories.
- Fixed list of questions for the reviewer, including: (a) does collecting leads for investment services and later passing them on trigger any licensing issue under Czech capital-market law? (b) is the consent wording valid? (c) is the "NYSE vs UCITS" statement acceptable as general information? (d) do the ads need specific disclaimers? (e) retention period and deletion process; (f) who is the controller?

**4. Who reviews:** the realistic path is that Clientelo, which already runs paid investment lead generation, has or can engage a lawyer or compliance person. The README states: "Legal pack prepared; sign-off pending", which shows business maturity rather than a gap. Where a quick review is impossible, an accountant covers the tax page and the privacy policy is based on UOOU guidance, but the page then stays at the gate below.

**5. Launch gate:** the site ships `noindex`, with a banner-free demo, and no paid traffic starts until (i) the controller details are real, (ii) the legal pack is signed off by a qualified reviewer, (iii) the data validator passes with all `verifiedBy` fields filled, and (iv) the consent behaviour is verified in the network tab on a real phone. The README documents this gate explicitly.

---

## 20. Timeline and cut order

Now: Sat 2026-10-10, evening. Hard deadline: Fri 2026-10-16. Stretch target: Phases 1 to 4 by Sunday evening, P0 complete Monday. Tue to Thu is buffer for P1 and polish.

| When | Work | Human step |
|---|---|---|
| Sat evening | Phase 1 scaffold, CI, data validator; Phase 1b design foundation (tokens, primitives, `/styleguide`); Phase 2 calculator and tests | Create the repo; review `/styleguide` in the browser; hand-check calculator golden cases |
| Sat late | Fill data (agent proposes, `TODO_VERIFY`) | **Verify data** (about 1 h); add wireframe B to `docs/design/` |
| Sun morning | Phase 3 page sections and copy (wireframe B, copy lint, 5-second test) | **Review Czech copy**; run the 5-second test |
| Sun afternoon | Phase 4 lead flow, results page, email | Create Supabase (EU region), Resend and the test domain |
| Sun evening / Mon | Phase 5 tracking and consent | GA4 and Meta dataset; network tab and test events on a real phone |
| Mon | Phase 6 deploy, in-app browser test, README draft | Open the deployed link inside Instagram/Messenger |
| Tue to Thu | P1 items, legal pack, README polish, `README.cs.md`, logo integration | Final review |
| Fri 16.10. | Buffer and submission | |

**If we slip, cut in this order (last item is cut first):** (1) Czech README, (2) funnel dashboard, (3) Lighthouse CI, (4) PDF (keep the results page), (5) second ad variant landing hero (keep the ad copy). Never cut: sourced data validation, consent, `lead` tracking, honest README gaps.

---

## 21. Calculator methodology (single source of truth)

Purpose: show the **cost drag** of holding a given ETF, in Kč, for the user's inputs. It is a cost illustration, not a return forecast.

**Inputs:** `monthly` (Kč, integer; no initial lump sum for now, see decision note 0015), `years` in {5, 10, 20}, `etfId`, `grossReturn` (default 6 % p.a., same for all funds), optional `fxFeePct`.

**Cost components, in scope**
1. **TER:** annual, deducted from the fund's NAV. Modelled as a reduction of the annual return.
2. **Dividend withholding drag:** `dividendYield x withholdingRate`, applied as a reduction of the annual return. `dividendYieldPct` and `withholdingRate` are sourced fields per fund (a withholding rate of 15 % is *expected* for treaty-eligible US dividends, **to be verified per fund and domicile**). For accumulating funds use the yield of the fund's distributing twin or the index, with the source stated.
3. **FX conversion fee:** one-off percentage on every deposit (each monthly deposit). Default comes from sourced broker data; if no sourced value exists the component is off and the UI says so.

**Explicitly out of scope** (stated in the "Jak počítáme" disclosure): broker commissions, bid-ask spreads, Czech personal income tax on dividends or gains (gains may be exempt after the time test, **verify**), inflation, US estate-tax exposure (a risk, not a running cost; mentioned in the Kompas only).

**Honesty note:** for pure S&P 500 exposure the withholding drag is expected to be similar for US-listed and Irish UCITS funds, so the difference between twins is mostly TER and FX. The page must **not** imply a tax advantage that the data does not show.

**Formulas** (monthly steps, deposits at month end)
- `r_net = grossReturn - TER - (dividendYield x withholdingRate)`
- monthly rate `m = (1 + r)^(1/12) - 1` for each of `r = grossReturn` and `r = r_net`
- deposit after FX: `d = deposit x (1 - fxFee)`
- `FV_gross` = baseline with no costs (full deposits, rate from `grossReturn`); `FV_net` = same schedule using `d` and `r_net`
- **Cost in Kč = `FV_gross - FV_net`**, rounded once to whole Kč at output
- "Gap vs cheapest" compares against the lowest-cost fund in the same `indexGroup` (e.g. S&P 500)

**Formatting:** `Intl.NumberFormat('cs-CZ')` with non-breaking space separators (`12 480 Kč`), decimal comma (`0,07 %`).

**Required tests (Vitest)**
- Zero costs (`TER=0, yield=0, fx=0`) gives cost 0.
- Cost scales linearly with `monthly` (double the input, double the cost).
- Cost is monotonic in years and in TER.
- Zero deposits give cost 0; no NaN or negative values for any valid input range; inputs clamped at the boundary.
- At least 3 **golden cases derived by hand by the reviewer** (not by the agent) and stored in `docs/METHODOLOGY.md` with the derivation.
- Rounding happens once; internal values are never rounded.

---

## 22. Acceptance criteria per phase

A phase is done only when every line is true. **Every phase also ends with at least one decision note** in `docs/decisions/` (format and rules in its README; `AI-LOG.md` stays separate and records the AI process, while decision notes record why the product and engineering are built this way). Notes are drafted by the agent, but David approves the reasons.

**Seed notes to write in Phase 1** (these decisions already exist in this spec and need their reasons captured): NYSE vs UCITS framing (§1); pnpm and the starter-guide baseline with its deviations (§12a: next-intl and React Hook Form dropped, mobile-first Playwright); SCSS Modules and tokens; no past-performance claims in ads or the ungated page (§3.1); lead recipient and no third-party sharing (§17.1); 6 % illustrative return (§17.3); test sending domain and `EMAIL_MODE` (§17.15); lowercase "vy" (§25); single-locale copy module instead of `next-intl` and JSON catalogs (§12a); audience v2 and plain-language rules (§2, §25); brand name kept, logo separate (§17.16).

**Phase 1: scaffold, tokens, data**
- `pnpm check && pnpm format:check` green locally and in CI.
- Tokens, fonts, and a render test with the string "Příliš žluťoučký kůň úpěl ďábelské ódy" show all diacritics.
- The data validator fails a build on a seeded record with a missing source, a `TODO_VERIFY`, and a stale `asOf` (one unit test each).

**Phase 1b: design foundation (before any page work)**
- Tokens exist for colour, type, spacing, radius, borders, motion, breakpoints, z-index and touch targets (§24). A script checks every foreground/background token pair used by the primitives for WCAG AA and fails the build otherwise.
- Primitives from §24 are built with SCSS Modules, with keyboard and focus states and component tests (`getByRole`).
- `/styleguide` (noindex) shows tokens and every primitive state. David reviews it in the browser on desktop and on a real phone; requested changes are made before Phase 3 starts.
- Fonts are self-hosted, tabular figures are verified on Kč amounts, and the diacritics test string renders.
- One decision note on the design foundation (fonts, palette, and why).

**Phase 2: calculator**
- All tests from §21 pass; golden cases hand-verified and documented.
- Sliders and chips operable by keyboard and screen reader; a Playwright test changes inputs and sees the result change.

**Phase 3: page**
- Hero fits 375x667 including the primary CTA with no scrolling (Playwright screenshot assertion at that viewport).
- Lighthouse mobile (throttled, lab): performance >= 90, accessibility >= 95; LCP < 2.0 s, CLS < 0.05, route JS <= 90 KB gzipped.
- The form works **without JavaScript** (native POST to a server action) and shows the success state.
- `?v=a` and `?v=b` render different heroes; an unknown value falls back to `a`.
- The hero layout matches wireframe B in `docs/design/` (reviewed side by side at 375 px).
- `pnpm copy:check` passes (glossary and plain-language lint, §25).
- **5-second test:** three people who do not invest (and are not developers) see only the hero for 5 seconds; at least two can say what they get and that it costs nothing. The result is recorded in a decision note.

**Phase 4: lead flow**
- Playwright: valid email gives success state and a stored lead; the same email twice is idempotent; invalid email shows the Czech error; honeypot is rejected silently; the 6th request from one hashed IP within an hour gets 429.
- Results page: valid token renders; expired or unknown token shows a generic message and a "send link again" form; page is `noindex` with `Cache-Control: private`.
- Unsubscribe link works and is tested; newsletter confirmation (double opt-in) works.
- In `sandbox` email mode the UI never claims an email was sent to a non-allowlisted address.

**Phase 5: tracking and consent**
- Playwright asserts **zero** non-essential third-party requests before consent.
- After consent the event sequence `page_view, calc_start, calc_result, gate_view, form_focus, lead` is observed in order; `lead` appears **exactly once** per submission with a stable `event_id` shared by browser and server-side calls.
- UTM, `fbclid`, variant and `in_app_browser` are stored with the session and the lead.
- First-party events are written even when consent for third parties is denied (aggregate, cookieless, no PII), subject to legal sign-off.

**Phase 6: deploy and polish**
- Deployed on Vercel with a `noindex` header verified by `curl -I`.
- Manual in-app-browser checklist (§23) completed and recorded in a decision note in `docs/decisions/`.
- README complete per §16, all known gaps listed.

---

## 23. In-app browser (Instagram/Facebook) handling

Most ad clicks open in a webview where downloads, storage and some inputs behave differently.

- Detect via user agent (`Instagram`, `FBAN`, `FBAV`) and send `in_app_browser=true` with every event.
- **The results page is the primary deliverable**; the PDF is secondary. The success state shows "Otevřít přehled" first, then "Stáhnout PDF". Do not rely on the `download` attribute or `target=_blank` for the PDF; link to it normally and show a hint "Nejde to otevřít? Zkopírovat odkaz".
- Essential flow must not depend on `localStorage`; keep session and variant in a first-party cookie with URL-parameter fallback.
- Use `100dvh`, not `100vh`; the sticky CTA bar must not jump with the on-screen keyboard; no autofocus on the email field.
- No `window.open`, no popups, no modals for the gate (it is inline).
- Manual test on a real phone: send the deployed link to yourself in Messenger/Instagram DM, open it **inside the app**, complete calculator, submit, open results, try the PDF. Record the outcome.
- Email links open in the mail app's webview; the results page must work there too.

---

## 24. Design source of truth, tokens and design system

**Wireframe B** (layout direction chosen by David: typography, contrast, layout) is the source of truth for the hero and the section layouts. It is stored in `docs/design/` as exported images (one per state: hero, after calculation, gate, success) plus a text spec `wireframe-b.md` written from the template in `docs/design/README.md`. Agents read text more reliably than images, and the reviewer gets measurable criteria.

**Order of work (Phase 1b, before the page):** tokens, then primitives, then `/styleguide`, then David's design review, then the page. The wireframe is annotated with token names once they exist.

**Tokens** (structure from the starter guide, values from §8)
- Colour: paper, ink, muted, border, focus, cost accent, saved accent, plus on-colour pairs. Every pair used is AA-checked by script.
- Type: display and body families (full Czech diacritics, tabular figures), a size scale, line heights, line length.
- Spacing on a 4 px scale, radius, border width, touch target minimum (48 px), motion durations and easing, breakpoints (mobile-first), z-index scale.

**Primitives (a deliberately small system):** Button (primary, secondary, loading, disabled), Chip (selected), Slider (accessible, tabular value), Field (email, hint, error), Table (row label plus sub-label, tabular numbers, responsive), NumberDisplay (Kč, count-up), Callout (info, risk), Section/Container, Wordmark (placeholder until the logo exists), StackedBar (one custom SVG: "po poplatcích" versus "zaplaceno na poplatcích", scaled to the visitor's numbers).

**`/styleguide`:** an internal route, `noindex`, rendering the tokens and every primitive state. Kept deployed and linked from the README as evidence of craft. Storybook was considered and left out for now (extra tooling and build time for a one-day build); it can be added later as an optional extra.

**Fixed rules from earlier decisions:** no stock photos, no icon sets, no emoji; result number count-up under 300 ms and respects `prefers-reduced-motion`; nothing else animates except the hero table intro (decision note 0016); AA contrast; spacing and type only from tokens; no component libraries; check on a real phone.

**Logo:** pending, created by David in a separate thread. Until then a text wordmark "ETF Kompas" in the display font. The slot is `src/components/Wordmark` with assets in `public/brand/`. Favicon and OG image (P1) wait for the logo. Agents must not design a logo.

---

## 25. Copy brief (Czech, plain language)

**Voice:** concrete, calm, numerate; a knowledgeable friend, not a salesman. Vykání, lowercase "vy/váš" in running text (modern web convention; decided by David). No exclamation marks, no emoji, no hype.

**Rules (from the audience v2 doc)**
1. One idea per sentence, short words, no abbreviations in the headline.
2. Say "ETF" at most once on the landing page, with a one-line explanation. Elsewhere say "fond". The wordmark "ETF Kompas" (header, footer, emails, PDF cover) is the brand and does not count; it lives in `src/config/site.ts`, not in the copy module. Proposed explanation line (David to edit): *"ETF je fond, se kterým se obchoduje jako s akcií. Většinou kopíruje celý trh a má nízké poplatky."*
3. Tickers (VOO, QQQ) only next to a plain description ("500 největších amerických firem"). In table data every ticker travels with a `plainName` field, enforced by the type.
4. Every cost is named by what the customer sees, in Kč.
5. No promise of returns. The table shows cost and availability only.
6. The same glossary applies to the gated comparison and the emails; a technical term may appear once in parentheses after its plain version.
7. No fake urgency: no countdowns, no "zbývá X míst", no invented counters or testimonials. Banned: zaručeně, garantovaný výnos, bez rizika, zbohatněte, pasivní příjem, finanční svoboda, revoluční, tajemství bohatých, exkluzivní, nenechte si ujít, poslední šance.
8. **Czech typography:** non-breaking space after one-letter prepositions and conjunctions (k, s, v, z, o, u, a, i) and between a number and its unit (`0,07 %`, `12 480 Kč`). Implemented once in `lib/typography.ts` (`nbsp()`), applied at render time, unit-tested. Dates `10. 2026`; decimal comma; "e-mail" with hyphen.

**Glossary: jargon to plain Czech**

| Do not use | Use instead |
|---|---|
| TER | roční poplatek fondu |
| UCITS, domicil, fond sídlí v Irsku | evropská verze, fond sídlí v Evropě |
| S&P 500 | 500 největších amerických firem |
| Nasdaq 100 | 100 největších technologických firem |
| kurzový rozdíl, FX poplatek | převod korun na dolary |
| srážková daň z dividend | daň, kterou stáhne USA / daň ze zisků |
| ilustrativní předpoklad | příklad, ne slib |
| Metodika | Jak počítáme |
| Zdroje | Odkud máme čísla |
| broker | firma nebo aplikace, kde fond koupíte |
| ETF Kompas (deliverable in body copy) | srovnání 8 fondů |
| gate, odemknout | not used in public text |

**Enforcement (`pnpm copy:check`, part of `pnpm check`):** `scripts/check-copy.ts` loads `src/content/copy.ts` and fails if (a) any "Do not use" term appears (word-boundary match; TER and UCITS case-sensitive), (b) "ETF" appears more than once across the landing-page copy, (c) a headline string contains an abbreviation (two or more capital letters), or (d) a ticker appears outside a table row that has `plainName`. Legal pages (privacy policy, cookie text) are exempt. A unit test covers the checker itself.

**Headline bank (to be tested and edited by you)**
- A: "Kolik vás fond doopravdy stojí?" · "Poplatky fondu v korunách, ne v procentech" · "Kolik z vašich peněz si vezmou poplatky?" · "Roční poplatek 0,07 % zní jako nic. Za {years} let je to {cost}." (number computed live, never hard-coded)
- B: "Americký fond, nebo jeho evropská verze?" · "Stejných 500 největších amerických firem. Jiná cena i pravidla." (only if supported by §18) · "Americký fond z Česka často nekoupíte. Co místo něj?"

**Microcopy (starting set, in `src/content/copy.ts`)**
- Primary CTA: "Spočítat moje poplatky" · Gate button: "Poslat mi srovnání"
- Gate heading: "Srovnání 8 fondů, daně a kde je koupit"
- Calculator: "Investuji měsíčně" · "Na dobu" · "Upřesnit" · disclosure "Jak počítáme" · return label "příklad, ne slib" · conversion label "převod korun na dolary" · tax label "daň, kterou stáhne USA"
- Table columns: "Roční poplatek fondu" · "v Kč při 100 000 Kč" · "Koupíte z ČR?"
- Email label: "Váš e-mail" · placeholder: `jmeno@domena.cz`
- Error: "Zadejte prosím e-mail ve tvaru jmeno@domena.cz." · typo hint: "Nemysleli jste @seznam.cz?"
- Consent line: "Odesláním získáte srovnání na uvedený e-mail. Správce: {controller}. Zásady zpracování osobních údajů." · checkbox: "Chci dostávat občasné tipy k investování (nepovinné)"
- Success: "Hotovo. Srovnání je připraveno." · Loading: "Počítám…" · Generic failure: "Něco se nepovedlo. Zkuste to prosím znovu."
- Risk line (footer and comparison): "Investování nese riziko ztráty. Minulá výkonnost není zárukou budoucích výsledků. Obsah je obecná informace, ne investiční ani daňové poradenství."
- Email typo helper knows Czech domains: seznam.cz, email.cz, centrum.cz, post.cz, volny.cz, gmail.com.

---

## 26. Lead and results-page mechanics

**Tables (Supabase Postgres, RLS on, access only from server routes)**
- `leads`: `id`, `email` (lowercased, unique), `created_at`, `utm_*`, `fbclid`, `variant`, `calc_monthly_bucket`, `calc_years`, `marketing_consent` (bool), `consent_text_version`, `consent_confirmed_at` (double opt-in), `email_status` (queued/sent/failed/bounced), `unsubscribed_at`, `deleted_at`. No raw IP stored.
- `events`: `id`, `session_id`, `name`, `ts`, `variant`, `props` (jsonb, no PII). Aggregation for the funnel view.
- `result_tokens`: `token_hash`, `lead_id`, `expires_at` (30 days).
- `rate_limits`: hashed IP (daily-rotating salt) plus counters, so no extra service is needed.

**Rules**
- Results token: 32 random bytes, URL-safe, stored only as a hash; page is `noindex`, `Cache-Control: private`. "Poslat odkaz znovu" asks for the email and always answers the same generic message (does not reveal whether an address exists), rate limited.
- Spam protection: honeypot field, minimum time-to-submit, per hashed-IP limit (5/hour) and per-email limit (3/day), no captcha.
- Newsletter checkbox uses **double opt-in** (confirmation email with a signed link); delivery of the Kompas is independent of it.
- Unsubscribe: signed-token link in every email; List-Unsubscribe header on any bulk/nurture mail.
- Retention and deletion (suggested, **legal to confirm**): leads kept until unsubscribe or deletion request, or 24 months of inactivity; events 12 months; deletion requests handled within 30 days via `scripts/delete-lead.ts` and a documented contact address.
- Deliverability for live mode: SPF, DKIM and DMARC on the sending domain; send tests to Seznam, Gmail and Outlook before launch (Seznam is strict).

---

## 27. Ad deliverables

**Formats (verify against current platform specs before building)**
- Meta: 4:5 feed (1080x1350) and 9:16 Stories/Reels (1080x1920) with key content kept inside the central safe zone; primary text front-loaded within the first ~125 characters, short headline.
- Google/Sklik search twin: responsive search ad with up to 15 short headlines and 4 descriptions (check current character limits), keywords such as "ETF poplatky", "jak koupit VOO z Česka", "nejlevnější ETF", "ETF daně Česko"; negatives for unrelated intent (kryptoměny, burza zdarma kurzy, etc.).

**Creative concepts (no stock photos, no issuer logos, tickers as plain text)**
- A: typographic card "0,07 % x 20 let = ? Kč" with the final number revealed in the landing hero.
- B: split card "VOO | CSPX", subtitle "Stejný index. Jiná cena i pravidla." (only claims supported by §18).
- Each ad has a risk line in-image where required and in the text.

**UTM schema:** `utm_source=meta|google|sklik`, `utm_medium=paid_social|cpc`, `utm_campaign=etf-kompas-2026-10`, `utm_content={a|b}-{4x5|9x16|rsa}`, `utm_term` for search; the landing URL always also has `?v=a|b`.

**Targeting (starting hypothesis):** Czechia, age 25 to 44, broad audience with interest signals around investing; separate ad sets per variant with equal budget; no lookalikes until at least 100 leads exist.

**Test sizing (arithmetic, assumption-based):** to detect a lift from 8 % to 10 % visit-to-lead at 80 % power and 5 % significance you need about 3,300 visitors per variant; for 8 % to 12 % about 900. At an assumed 10 Kč per click that is roughly 33,000 Kč or 9,000 Kč per variant. Meta's learning phase also wants about 50 conversions per ad set per week. The README must say these tests are slow and decisions on small samples are noise.

---

## 28. Lead economics (transparent assumptions)

Clientelo has not provided lead value, cost targets or CPC data, and the README says so plainly. We use a formula, not made-up facts:

- **Expected CPL = CPC / visit-to-lead rate.**
- **Maximum acceptable CPL = P(lead becomes a customer) x value of a customer.** Both inputs are unknown and must come from Clientelo.

Sensitivity table (all CPC values are **assumptions, not benchmarks**), at the base-case 8 % conversion:

| Assumed CPC | Expected CPL |
|---|---|
| 6 Kč | 75 Kč |
| 10 Kč | 125 Kč |
| 15 Kč | 188 Kč |

At the pessimistic 4 % conversion the same CPLs double. The README ends this section with a one-line question for Clientelo: "What is a lead worth to you, and what CPL do you consider acceptable?", and states that targets will be set after the first 500 sessions of real data.

---

## 29. Agent kickoff material

**`CLAUDE.md` (put at repo root)**
```
# Project
Czech-language, mobile-first lead-gen landing page for ETF cost comparison. Source of truth: docs/SPEC.md. Tooling conventions: docs/starter-guide.md as adapted in SPEC §12a.

# Rules
- Work phase by phase (SPEC §20/§22). Do not start a phase without a plan I have approved.
- Never invent data, sources, URLs, legal statements or Czech tax rules. Unknown = TODO_VERIFY.
- All user-facing text is Czech, lives in src/content/copy.ts, and must pass `pnpm copy:check` (plain-language glossary, SPEC §25). Use nbsp() typography rules.
- No dependency without a one-line reason in the PR.
- Run `pnpm check && pnpm format:check` before finishing any change. Never use --no-verify.
- One concern per branch/PR, Conventional Commit titles, never push to main.
- After each phase, append to docs/AI-LOG.md: prompt used, what you produced, what you got wrong or had to fix.
- If the spec is silent or contradictory, make the smallest decision, draft a decision note in docs/decisions/ (see its README), and tell me.
- Decision notes record only reasons the author (David) actually gave. If a reason or the considered alternatives are missing, ask instead of inventing them. Verify every claim about the repo against the repo.
```

**Phase prompt template** (use per phase, in plan mode first):
```
Phase {N}: {name}. Read docs/SPEC.md sections {list}. 
1) Produce a plan: files to create/change, risks, open questions. Wait for my approval.
2) Implement on branch phase-{N}-{slug} with tests.
3) Self-review against the acceptance criteria in SPEC §22 and list each criterion as pass/fail with evidence.
4) Update docs/AI-LOG.md and open a PR with a short risk summary.
Do not touch anything outside this phase's scope.
```

**Phase-specific additions**
1. Scaffold per starter guide, data schema and validator (§5, §18), CI, `copy:check` skeleton.
1b. Design foundation per §24: tokens, primitives, `/styleguide`, AA pair check. Stop for my design review before Phase 3. Do not design a logo.
2. Calculator exactly per §21; do not choose formulas yourself; stop and ask if anything is ambiguous.
3. Page sections per §7, wireframe B in `docs/design/` and `docs/design/wireframe-b.md`, copy from §25, no component libraries. `copy:check` must pass.
4. Lead flow per §26 and §3.4/§3.5; honest email messaging per §17.15.
5. Tracking and consent per §9, §22 phase 5; `lead` fires once, server-side and browser-side deduped.
6. Deploy, `noindex`, in-app browser checklist (§23), README per §16.
