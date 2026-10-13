# ETF Kompas

Czech-language, mobile-first lead-gen landing page for ETF cost comparison.
Source of truth: [docs/SPEC.md](docs/SPEC.md).

> README stub. The full structure is defined in SPEC §16. Dev phases: [docs/PHASES.md](docs/PHASES.md).

### Expected conversion and assumptions

These are assumptions, not measurements, to be replaced by the first 500 sessions. Cold paid-social mobile traffic, e-mail-only form, value shown before the ask: visit to `calc_start` 30 to 40 %, `calc_start` to `calc_result` 70 to 80 %, `calc_result` to `lead` 25 to 35 %. Visit to lead: about 8 % (plausible range 4 to 14 %). Reasoning: generic finance lead-gen pages report single-digit conversion; an interactive result with a one-field form should beat the median, while cold social traffic with a 3-second attention span caps it (SPEC §10).

Test sizing: about 3,200 visitors per variant to detect 8 % against 10 % visit-to-lead (80 % power, 5 % significance), about 900 for 8 % against 12 %. At an assumed 10 Kč per click that is roughly 32,000 or 9,000 Kč per variant (the click price is an assumption, SPEC §28). These tests are slow, and decisions on small samples are noise.

### Three A/B hypotheses, ranked by expected impact

1. **Gate placement and format.** Showing the headline cost in Kč ungated and gating only the full comparison converts better than gating the calculator result. Metric `calc_result` to `lead`; guard: bounce, lead quality.
2. **Hero framing.** A loss-framed numeric headline ("U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?") beats the neutral question for cold mobile traffic. Metric visit to `calc_start`. This is the first test: `?v=a` against `?v=b` (note 0041).
3. **Form friction.** E-mail only gives more leads than e-mail plus optional amount chips, but the second may lower cost per qualified lead. Metric CPL and `lead_qualified` rate.

Order of running: 2, then 1, then 3, because test 2 needs only copy and test 1 needs a second build. Every event carries `variant`.

#### How test 2 would be run (designed, not run)

**Status: no ad money has been spent and the test has not been run.** The launch gate keeps paid traffic off, and the tracking and the lead flow that would measure it (Phases 4 and 5) are not built yet, so a result could not be read today.

- **The two pages.** The variants are two URLs of the same page: `/?v=a` (the neutral question) and `/?v=b` (the headline with the amount; served only while at least two brokers have verified prices, otherwise the visitor gets `a`). The page marks the variant it really showed in `data-variant`; that mark, not the URL, is what a count should use (note 0041).
- **Who splits the traffic.** The plan is to let the ad platform do it: create the two ads as a Meta A/B test in Ads Manager, one link ending in `?v=a`, the other in `?v=b`. The platform divides the audience randomly into groups that do not overlap, which two ordinary ads would not do (each ad is shown to different people, so the split would not be random). No code is needed for this. Meta's current Ads Manager screens and pricing were not checked here; the other platforms (Google, Sklik) have their own experiment tools and were not checked either.
- **The links.** Each ad link also carries the UTM parameters of SPEC §27, where `utm_content` is `{a|b}-{4x5|9x16|rsa}`.
- **What was not chosen.** Assigning the variant ourselves from the click id (`fbclid`) in a small `proxy.ts`. It would give one method for every platform and a split we can verify, but it uses the id before any consent, which nobody has reviewed legally. It stays an option if the platforms' own tools cannot be used.
- **What would be needed first.** A budget (about 3,200 visitors per variant for 8 % against 10 %, see above), the tracking of Phase 5 with `variant` on every event, and the lead flow of Phase 4.

## Stack

Next.js (App Router, TypeScript strict), SCSS Modules, pnpm, Node 24. Deploy target: Vercel.

## Develop

```bash
corepack enable
pnpm install
pnpm dev
```

### Testing on a real phone

Connect the phone to the same Wi-Fi, run `pnpm dev`, find the Mac's address (`ipconfig getifaddr en0`) and open `http://<that address>:3000/styleguide` on the phone. `next.config.ts` allows `192.168.*.*` origins in dev. If your network uses another range (for example `10.x`), add it to `allowedDevOrigins`.

Before finishing any change: `pnpm check && pnpm format:check`.
