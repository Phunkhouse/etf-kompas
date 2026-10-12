# AI log

How the AI agent (Claude Code) was used, what it produced, and where it was wrong. Updated as the work happens, in the same PR as the change. The README section "How I worked with AI" is built from this file.

## Phase 1: CI, data, validator

**Prompt (summary):** "Let's move on with Phase 1 of the etf kompas project. I have just added the starter guide." The agent read the guide, `docs/PHASES.md` and SPEC §5, §12a, §15, §17, §18, §21, §22 and §29, then proposed a plan and open questions before writing anything (per `CLAUDE.md`). Follow-up prompts: write and sync `CLAUDE.md`, start each PR, fix CI, tidy git.

**Produced**

- `CLAUDE.md` (SPEC §29), later synced with conventions from the author's other projects.
- PR 1: Vitest (unit and components projects), Playwright (mobile first), `src/server` lint rule, GitHub Actions CI with actions pinned to commit SHAs resolved via the GitHub API.
- PR 2: Zod data schema, framework-free `validateData`, 26 tests written first and approved before implementation, seed data for 8 ETFs and 5 brokers (all `TODO_VERIFY`), `data:validate` and `data:validate:draft`.
- Small fix PR: deprecated Sass `map-get` replaced with `map.get`.
- Decision notes 0001 to 0005 and this log (merged), then notes 0006 to 0014 for the remaining SPEC §22 seed topics (drafted from SPEC rationale, status `accepted` after David read them).

**Mistakes and corrections**

- **Commit author email blocked the first push.** The scaffold commits used the author's full personal email, and GitHub rejected the push of `main` (email privacy setting). The agent had not checked the author email before pushing. Fix: history rewritten once to the noreply address, then force-pushed.
- **Another project's name in a commit message.** The agent named the author's earlier project in a commit message ("sync CLAUDE.md with ... conventions") and repeated it in the PR body. David did not want it. Fix: the commit was reworded (second rewrite of `main`, ruleset disabled for the push) and the PR body edited. The old text may remain reachable through GitHub's PR refs.
- **CI failed on `esbuild`.** Adding `tsx` pulled in `esbuild`, which has an install script, and `pnpm install --frozen-lockfile` fails in CI until each build script is allowed or denied. Locally the install did not fail, so the agent did not catch it before pushing. The starter guide lists `esbuild: false` in `allowBuilds`, but the repo's `pnpm-workspace.yaml` was missing it. Fix: line added.
- **First draft of the validator tests was incomplete.** The ETF fixture had only three fields, so the "valid dataset" test would have failed with `MALFORMED` once the schema required all fields. Caught while implementing; fixtures were completed and approved tests kept their meaning.
- **Commit on the wrong branch.** The first commit of this PR landed on local `main` because a chained shell command failed halfway and the branch switch did not take effect. The agent noticed from `git status` (`main` ahead by 1) before anything reached `origin/main` (the ruleset would also have blocked it), moved the commit to the feature branch and reset local `main`.
- **Spec gap handled by the agent, not the spec.** SPEC §5 requires the build to fail on `TODO_VERIFY` while §18 requires placeholders, so strict CI would be red from day one. The agent proposed a draft mode (note 0003); David approved after asking why it was needed.
- **Brokers were not named in the spec.** The agent suggested five from general knowledge. They are unverified suggestions; all facts about them are `TODO_VERIFY` (note 0004).

**Starter-guide details verified instead of copied**

- `pnpm/setup` exists (v3.1.0) and its `runtime` and `cache` inputs are valid; `require-lockfile` was added.
- `resolve.tsconfigPaths` is supported by the installed Vite 8.
- Dropped from the guide: `next-intl` inline dependency in the Vitest config (next-intl is not used), React Hook Form.
- `@types/node` raised from `^20` to `^24` because Vitest 5 requires it (peer dependency) and the project runs Node 24.

## Phase 1b: design foundation

**Prompt (summary):** "Plan Phase 1b", then: use the wireframe canvas as the design, build a documented palette and design guide from it, and prepare wireframe B as text from the link.

**Produced**

- `docs/design/DESIGN-GUIDE.md`, `docs/design/wireframe-b.md` and `docs/design/README.md`, written from the design canvas (all 12 boards). Palette, type, spacing, components and motion are the values the canvas uses. Contrast ratios were calculated, not estimated.

**Mistakes and corrections**

- The agent's first plan proposed choosing fonts and a palette itself. The canvas already defined both (IBM Plex Sans and Mono, a warm neutral palette with two accents), so the plan was changed to extract them.
- Flagged while reading the canvas, not yet decided: the wireframe has no initial-amount input although SPEC §4 and §21 do, and its hero table animation (about 3 s) conflicts with the SPEC rule that only the result count-up animates (see `docs/design/wireframe-b.md`, open points).
- David's answers (initial amount dropped, hero animation kept, wireframe copy wins, `?v=a` is the calculator hero) are recorded in notes 0015 to 0017 and in SPEC §4, §21 and §24. The SPEC edits were made only because David decided them, per the rule "ask before changing the spec's decisions".

### Phase 1b PR 1: tokens, fonts, contrast check

- Produced: complete token set in `src/app/variables.scss`, Plex fonts via `next/font`, `pnpm contrast:check` with unit tests, a first `/styleguide` page and e2e tests for fonts, diacritics and tabular figures, decision note 0018.
- Checked instead of assumed: the glyph-coverage e2e test was run against a character the font lacks (it flags it) and a Czech one (it passes). The tabular-figures test turned out not to be discriminating, because Plex Sans digits are tabular by default; the note and the test comment say so.
- Wireframe font sizes were merged into a smaller scale. This changes some sizes by 1 to 2 px and needs David's review on `/styleguide`.
- **Mistake: the first glyph-coverage test was unsound.** It compared a character's width in the Plex stack with its width in plain `serif`. On the GitHub Linux runner `ý` has the same width in both, so CI failed (false alarm), and a truly missing glyph would have fallen back to a different font than `serif` and could have gone unnoticed. The agent had "verified" it only with an Armenian letter, which both fallbacks render with the same system font. Fix: measure with a serif and a monospace fallback and compare the two; a glyph the web font has gives the same width in both. Checked with `ǆ` (missing in Plex, flagged). It still cannot detect scripts where both fallbacks resolve to the same system font, which is fine for Czech.
- `allowedDevOrigins: ['192.168.*.*']` added for phone review. Tested against a running dev server with simulated cross-origin requests: a 192.168 address gets 200, a 10.x address, an outside site and a request without a referer get 403. Not yet tried from a real phone.

### Phase 1b PR 2: basic primitives

- Produced: Tag, Pill, Button (+ ButtonLink), Chip, Callout, Container, Section, Table (+ TableLabel) and Wordmark, each with SCSS Module, tests and index.ts; all states on `/styleguide`, on paper and on a dark Section; 7 new contrast pairs; a keyboard focus e2e test.
- Caught while checking: the disabled-button text (muted on border-soft) was 4.38:1, just below AA, found by `contrast:check`; text colour changed to ink-soft. The wordmark looked blank in a full-page screenshot only because the logo images load lazily, so the header logo now has a `priority` option.
- Wireframe issue noticed, not changed: the "yes" pill on the highlighted table row is nearly the same colour as the row (`yes-bg` vs `highlight`), so the pill outline disappears. Needs a decision.
- Agent mistake: the first Button draft was one component with a union of button and link props and lint-disable comments for the unused props. Replaced by `Button` and `ButtonLink` sharing one stylesheet.

### Phase 1b PR 3: Slider, Field, NumberDisplay, StackedBar

- Produced: native-range `Slider` (value text for screen readers, filled track, dark variant), `Field` (label, hint, error with `role="alert"`, `aria-describedby`, `aria-invalid`), `NumberDisplay` (Kč count-up under 300 ms, none with reduced motion, screen readers get only the final value), `StackedBar` (one SVG, scaled to the numbers, exact amounts in the legend); `formatKc` and `formatPercent`; interactive demos on `/styleguide`; 28 unit and component tests and 2 new e2e tests.
- **Mistake caught by a test: count-up bug.** The first `NumberDisplay` took its start time from `performance.now()` but compared it with the animation-frame timestamp, which can be earlier. Progress went negative and the number dipped below its start value (`-26 545 Kč` in jsdom, a small flicker in a browser). Fix: time zero is the first frame, progress is clamped to 0..1. The replacement test steps fake frames and checks the value stays in range, never decreases and ends exactly on target within 300 ms.
- **Mistake in my own tests:** my first "passes through intermediate values" test sampled the DOM inside `act`, which batches updates, so it saw only two values. Replaced by the fake-frame test above.
- **Visual review found layout problems in the demos, not in the components:** slider and fields shrank to content width in the styleguide, and the SVG `rx` corner radius was stretched by `preserveAspectRatio="none"` (blobby bar ends). Fixed with stretching wrappers and a CSS `border-radius` on the SVG, which also removed the clip-path id.
- Contrast: `cost-strong` on paper and white raised to the 4.5 text threshold (error messages). Still all pairs pass.
- Not built (not in the primitive list): a Checkbox for the newsletter consent. It is needed with the gate form in Phase 3.

### Phase 1b closed

- David reviewed `/styleguide` and accepted it. Decision on the open wireframe issue: the positive pill gets a 1.5 px `yes-fg` border (option A) so it stays visible on the highlighted table row. Done in `fix/positive-pill-border`, with a new contrast pair for the border.
- Tooling slip: my docs-update script stopped halfway because Prettier had reformatted a table row I was matching by exact text. The code change was already written, the docs were finished with a regex afterwards. Lesson: match formatted files with patterns, not exact strings.

## Phase 2: calculator

### PR A: methodology and test list

**Prompt (summary):** "Phase 2", with a pasted plan (calculator in three PRs, five open questions). David answered the questions in chat: one FX fee for all funds, breakdown per fund, wireframe order, `src/server/calc.ts`, fund with its twin only.

**Produced**

- `docs/METHODOLOGY.md`: formulas step by step (closed-form month-end annuity), the proposed breakdown rule, clamping, gap rule and a golden-case input table with the results left for David.
- `src/server/calc.test.ts`: the SPEC §21 test list plus extra cases as `it.todo` entries.
- SPEC §4: `lib/calc.ts` changed to `src/server/calc.ts`, because David decided it.

**Mistakes and corrections (caught by the agent while checking the plan against the repo)**

- The first plan said "failing tests first" in PR A. Failing tests would turn CI red and the PR could not be merged. Changed to `it.todo`.
- The first plan did not notice that with one `fxFeePct` for all funds the FX line in the twin gap is about 0, so the wireframe's FX line under a gap headline would mislead. Raised with David; the breakdown is now computed per fund.
- The SPEC §21 test list contradicts itself: "zero deposits give cost 0" and "inputs clamped at the boundary" cannot both hold if the minimum is the slider's 500 Kč. Proposed: the function clamps to 0 to 20 000 and the slider enforces 500. Needs David's approval.
- Golden cases G1 to G3 computed by David in a spreadsheet and added to METHODOLOGY §9. David approved the Proposed items (breakdown, clamping, 0 to 12 % cap with the agent's suggested reason, zero deposit accepted by the function). Decision notes 0019 and 0020 record them; the reasons in both were proposed by the agent and approved by David, and the notes say so.

### PR B: calc.ts

- Produced: `src/server/calc.ts` (`calcCost`, `calcComparison`) implemented against the tests David approved; the `it.todo` list became 30 real tests. All three golden cases pass, including the G3 rounding remainder.
- Tests were written before the implementation and approved by David first, as CLAUDE.md requires. The implementation passed on the first run, so no test was changed to fit it; the only edit to the test file was removing an unused variable flagged by lint.
- Decision made while writing the tests: the gap is the difference of the two displayed totals (David approved).
- Agent slip: my first shell command to move the test file between branches used a wrong scratchpad path and half ran. The file was recovered from a copy in `$TMPDIR`; nothing was lost.

### PR C: Calculator component

- Produced: `Calculator` (slider, 5 / 10 / 20 year chips, gap headline, the featured fund's own cost lines, assumption line), `src/content/copy.ts` with the calculator strings, `nbsp()` in `src/lib/typography.ts` (SPEC §25 names it, it did not exist yet), sample-number demos on `/styleguide`, 8 component tests, 3 Playwright tests (keyboard, chips by Tab and Enter, status region, no sideways scroll), 3 typography tests. The old fake-number demo is gone.
- **Mistake in my plan (point 3), found by calculating before building.** I planned "Z toho jde na" as the gap split per part (difference of the two funds' parts) because it adds up to the gap exactly. With sample numbers it gave a withholding line of -6 395 Kč at equal withholding rates (20 000 Kč a month, 20 years), and a negative FX line: the cheaper fund keeps a bigger base, so it pays more FX and tax in Kč. The sum is right, the meaning is not. Changed to the alternative flagged earlier: the headline is the gap, the lines are the featured fund's own costs (note 0019, per-fund breakdown). The sentence above the lines says so.
- Checked, not assumed: screenshots at 375 px and 1100 px of the demos. A lone "o" wrapped onto its own line after "víc"; `nbsp()` binds a one-letter word to the next word, so the trailing "o" got its non-breaking space written into the copy string.
- Limit: keyboard and ARIA attributes are tested, a real screen reader was not run. The status region announces only the number (from `NumberDisplay`), not the sentence above it.
- `pnpm copy:check` does not exist yet (Phase 3); the new copy follows the glossary by hand (no TER, FX, UCITS in the strings).
- Existing e2e test `styleguide.spec.ts` (slider and result) failed after the change because it asserted the old fake 8 % cost. Its result assertion was dropped; the new `calculator.spec.ts` covers the result changing. Found by running the full Playwright suite, not only the new spec.
- Decision note 0021 (calculator runs in the browser on the shared pure function) drafted from the reasons David approved in the PR C plan. They were proposed by the agent, and the note says so. Bundle size is not measured yet; the note says that too.

## Phase 3: page

### Data preparation (before PR A)

**Prompt (summary):** "Let's plan Phase 3", then "Let's talk about data verification. Where should I start?". David supplied a separate analysis file (written by another AI tool), screenshots of three brokers' instrument searches, and fund documents.

**Produced**

- `docs/DATA-CHECKLIST-PHASE3.md`: the value checklist for five funds and three brokers, with source pointers and blank value cells (not committed yet).
- A review of the other analysis file against the repo's rules, the screenshots and the documents.
- Decision note 0022 (US fund domicile) and a line in `data/README.md`, from David's decision and reason.

**Mistakes and corrections**

- **My estimate was wrong.** I first said about 35 to 45 values were needed. With availability for 5 funds on 5 brokers it is 61. Corrected in the checklist.
- **I called identical yields suspicious, wrongly.** CSPX and VUAA showing the same figure is correct if the measure is the underlying index's yield. The real inconsistency was VOO's figure against theirs, from mixing measures.
- **The other analysis file had real errors, found by checking it:** fractions where the repo stores plain percent (`0.0003`, not `0.03`); QQQ TER 0.20 where the prospectus says 0.18; QQQ SEC yield 0.43 where Invesco shows 0.37; a dead DEGIRO link; the Czech-US treaty cited for three Irish funds; no evidence for fund values. Its "I have verified" opening was not evidence.
- **Screenshot evidence was wrong in three places, found by looking at each image:** the DEGIRO VOO search typed `V00`, the XTB VOO "yes" came from a public product page that a logged-in Czech account does not show, and the XTB QQQ list was cut off. All three were redone by David.
- **A date was misread.** The QQQ supplements are dated in US format (June 10, 2026), not 6 October.
- **Tooling:** `pdftotext` and `pdftoppm` are not installed, so the Read tool could not render PDFs and web fetches could not decode them. I extracted text with a small PDFKit script kept in the scratchpad, outside the repo.
- Limit: web.archive.org is blocked for the fetch tool, so no archive links were created. Evidence is SHA-256 of the saved PDFs and dated page prints.

- **Yield sources.** I misread the S&P factsheet's ratio row in extracted text (headings and values came out in different orders). David's screenshot of the box showed the yield is the "Indicated Div Yield", 1.11 %. I had planned a trailing 12-month yield; the source gives an indicated one, so METHODOLOGY says so.
- **A second unsupported figure.** David's message gave the Nasdaq-100 fund yield as 0.43 % as of 2026-09-30 (with another AI tool's citation markers). The Invesco page he saved shows 0.37 % as of 2026-10-08, and 0.43 appears nowhere in it. I wrote the figure the document supports and asked him to confirm it. He did.

### Data records (the first sourced values)

- **Produced:** records for VOO, QQQ, CSPX, VUAA and CNDX (name, index, ISIN, domicile, TER, dividend yield, withholding rate), DEGIRO's FX fee, 15 availability records for DEGIRO, Trading 212 and XTB, 14 registered sources, and decision notes 0024 and 0025. Every SHA-256 was computed from the saved file by the writing script, not copied by hand. `pnpm data:validate:draft` reports 0 errors and 100 warnings, all of them values postponed to Phase 4.
- **Found by reading the validator, not by running it:** STALE is an error even in draft mode, so David's first choice (effective withholding rate per fund, sourced to annual reports dated mid-2025) would have turned CI red. I raised it before writing, and he chose 15 for all five.
- **Reading annual reports:** text extraction scrambled the columns across funds, so the dividend income and tax figures were read from page images instead. The effective rates (14.1 %, 14.4 %, 14.1 %) come from those images.
- **Treaty:** the Czech-US treaty is a scan, so I read it with OCR (macOS Vision). The e-Sbírka page could not be read by my tools, so amendments to Article 10 are not checked.
- **Weak spots I left in the data, to fix:** the VOO domicile cites `https://www.vanguard.com/prospectus`, the address printed in the prospectus, not the PDF's own URL. The VOO ISIN is derived from the CUSIP in the factsheet. The CSPX, CNDX and DEGIRO hashes are of copies my fetch tool saved, not David's own downloads. `verifiedBy` is "David" because he asked me to write it from his verification, and he still needs to read the diff.
- **A test failed after the data change.** `src/server/data/validate.test.ts` checks the real data files on a fixed "today" of 2026-10-10, so my records dated 2026-10-11 counted as future dates. I found it when `pnpm check` ran, not before. The seed-data test now has its own fixed day (2026-10-11) and a title that says some values are still `TODO_VERIFY`. That is an edit to an existing validator test; David should look at it.

### PR A: `copy:check`

**Prompt (summary):** "Let's proceed" after the data PRs landed. David confirmed the six design choices, the `S&P 500` / `Nasdaq 100` exemption inside rows with a `plainName`, and the extra rule (e), and approved the test list.

**Produced**

- `src/lib/copy-check.ts`: `checkCopy(copy, { tickers })`, pure. Rules: glossary, "ETF" at most once, no abbreviation in a headline, tickers only in rows with a `plainName`, banned wording, `!` and emoji. Functions in `copy.ts` are called once with `"x"` for every parameter. Text under `legal` is skipped.
- `src/lib/copy-check.test.ts`: 60 tests, written and approved before the implementation. `scripts/check-copy.ts` and `pnpm copy:check`, wired into `pnpm check`. CLAUDE.md command list updated.
- The ticker list is read from `data/etfs.json` in the script, so there is no second list.

**Mistakes and corrections**

- The checker passed all 59 approved tests on the first run and still had a bug: the ticker patterns used the `g` flag and were reused with `test()`, which remembers `lastIndex`, so the same ticker in consecutive strings could be missed. Found by reading the code, not by a test. I wrote a failing test first (`flags the same ticker in several strings in a row`), then removed the flag. That makes 60 tests.
- 15 of the 59 tests passed against the empty stub (the "should not flag" cases). They only become meaningful with the implementation, so a passing stub run was not evidence.
- Deviation from my own test list: the script's exit code is not covered by a test. I checked it by hand with a deliberately bad heading (4 problems, exit 1), then restored the file.
- Limits: a banned word behind a branch the sample call does not take is missed. Inflection is covered by stems, not a dictionary, so an unusual form could slip through.
- **Typecheck failed on the first full `pnpm check`.** The script and the test both read `data.etfs` from `loadData()`, which returns `unknown` by design. I added `loadTickers()` to `src/server/data/load.ts` (Zod-parsed) and used it in both, so the ticker list has one reader.
- **Decision notes for the two rule choices.** Note 0026 (index names allowed in rows with a `plainName`) uses the reason David had already written in the PR. Note 0027 (rule e) records no reason: David asked to leave it out, and the note says so instead of inventing one.

### PR B: page shell and hero variants

**Prompt (summary):** "Yes to all three, go ahead with PR B". David approved the variant mechanism (as my recommendation), left the mobile "Menu" chip out, agreed the source bar shows the oldest `asOf`, and agreed the policy links stay plain text for now.

**Produced**

- `src/config/site.ts` (placeholder controller), shell strings and hero headlines in `copy.ts`, components `SourceBar`, `SiteHeader`, `SiteFooter` and `Landing` with tests, routes `/` (hero a) and `/v/b` (hero b), the `beforeFiles` rewrite, `e2e/variants.spec.ts`, decision note 0028.
- Helpers with tests: `formatMonthYear` (`6. 2026`) and `oldestAsOf` (the date for the source bar), plus `bundledData`.
- The old logo-only page and `page.module.scss` are gone.

**Mistakes and corrections**

- **My first rewrite did nothing.** I used a plain `rewrites()` array. `/` is an existing page and pages are served before `afterFiles` rewrites, so `/?v=b` still showed hero a. I found it by running the production server, not by reading the docs again. Fixed with `beforeFiles`.
- **My check script misread the output.** React puts `<!-- -->` between `HERO-` and `{variant}`, so my grep reported an empty hero for b and I briefly thought the rewrite was broken. It was the grep.
- **`/v/[variant]` answered `/v/zzz` with a 200** in the prototype, so I used the fixed route `/v/b`.
- **The first real build failed.** I read the data files with `fs` in the page. With Cache Components that counts as uncached data and blocks prerendering, and Turbopack also warned that the dynamic path pulls the project into the server bundle. I switched the page to statically imported JSON (`bundled.ts`) and removed the file-reading helper I had just added.
- **Wireframe copy I did not use as drawn:** the source bar's second item, "a Finanční správy". Our tax source is the treaty text, not Finanční správa, so the statement would be untrue. The date comes from the data, not the wireframe's "10. 2026".
- **New Czech copy to review:** the test-project notice is my draft.
- Limits: the variant routes are verified on a local production server only (Phase 6 checks Vercel). The footer is not pinned to the bottom of short pages; that goes away with real content.

### Wireframes rev. 2 (docs only)

**Prompt (summary):** David accepted the honest framing ("we are honest about our findings") and asked for a PR with updated docs and the `/design` screenshots.

**Produced**

- `docs/design/wireframes/`: rev. 2 artboards (`artboards-v2/`, generated from the originals by `apply_rev2.py`), rebuilt document, scripts; 12 re-exported PNGs; updates to `wireframe-b.md`, `DESIGN-GUIDE.md`, `design/README.md`; decision note 0029.

**Mistakes and corrections**

- **Revision 1 called a row "cheapest" that was not.** The fee check showed the US fund is cheaper, and it is not buyable from Czechia at three of five brokers.
- **`dump_frames.py` wrote into the wrong folder.** The code it runs overwrites `OUT`, so frames landed in `dummy.html/`. I kept the output path in its own variable.
- **The published `index.html` is not byte-identical to the local build.** The artifact service wraps the page, so I used the output of `build.py` and compared the artboards instead (identical).
- Not changed: the app copy in `src/` still has the revision 1 wording.

### PR C0: copy.ts at wireframe revision 2

**Prompt (summary):** "Use your wording for both, start C0", after I listed the two conflicts between the revision 2 wireframe copy and `copy:check` ("ETF" in headlines, "broker" on the banned list).

**Produced:** the source bar line and both hero headlines in `copy.ts` at the revision 2 meaning, with "fondy" for "ETF" and "firem" for "brokerů"; tests and Playwright expectations updated; decision note 0030.

**Mistakes and corrections**

- **My proposed source-bar wording wrapped.** "Čísla ze stránek fondů a firem, kde je koupíte · ověřeno k 6. 2026" took two lines at 375 px, and each extra line costs 17 px of the 667 px the hero has to fit in. I measured it in the browser, tried four candidates, and used the shorter "Čísla ze stránek fondů a firem · ověřeno k …". It is not the wording I told David I would use, so I said so in the PR.
- Found while searching for the old strings: `src/app/styleguide/page.tsx` still has "Kolik z vašich peněz sní poplatky" as demo text. I left it, because it is a style demo and `copy:check` does not read it.

### PR C1: hero b (table, amber pill, animation, fit)

**Prompt (summary):** "start C1 tests now", then "approved, implement the rule", then "Go with option 1, headline 28 px. We can iterate on it later" after I showed the measured options.

**Produced**

- `src/server/availability.ts`: `buyability` and `heroRows`, with 20 tests written and approved first. All passed on the first run and no test was changed.
- The amber `unverified` Pill state with tokens, `Table` options `card`, `intro` and `compact`, `HeroTable`, `HeroB`, hero b copy, `e2e/hero-fit.spec.ts`, decision notes 0031 and 0032, the `--font-size-hero-phone` token.

**Mistakes and corrections**

- **The hero did not fit, and my plan had said it was "tight".** The first build put the button at 851 px on a 667 px screen. The `hero-fit` e2e test failed, and I did not weaken it. I measured candidate layouts live in the browser, gave David the numbers, and implemented the option he chose.
- **The fit test passed while the page looked broken.** With the chosen layout the button was at 645 px, but a screenshot showed the "POPLATEK" header running into its neighbour and a pill poking past the card edge. A geometry test cannot see that. I fixed the column widths, header letter spacing and pill size (button now at 656 px) and looked again. The fit test should be paired with a look at the page, and the PR description says so.
- **Two Prettier traps in my own edit scripts.** My string-replace edits twice missed because Prettier had reflowed the lines or because the file held a real non-breaking space where I had written an escape. Both showed up as an assertion failure, not as a silent miss.
- **A test matcher normalised away the thing it tested.** `getByText('0,03 %')` with a non-breaking space did not match, because Testing Library normalises the DOM text. I compared `textContent` instead.
- Limits: the fit is verified at 375 x 667 only, with an 11 px margin. The intro animation's effect on LCP is not measured yet (note 0016); that comes with the performance PR. Fio and IBKR are not verified, so two pills stay amber.

### PR C2: the calculator band

**Prompt (summary):** "start C2 now", then "approved, keep the single fee and implement the mapping". The calculator-inputs tests were written and approved before the implementation.

**Produced**

- `calculatorInputs` (8 tests, none changed to fit), `landingData` (one place for the dates, the hero rows and the calculator inputs, used by both pages), a shared `hasSource` check used by both the availability rule and the mapping, `CalculatorSection`, the "cheaper" note under the result, Playwright tests for the landing calculator, the METHODOLOGY paragraph on the conversion fee, decision note 0033.

**Mistakes and corrections**

- **My first e2e test failed because of my own regex.** The page says "méně~o" with a non-breaking space that `copy.ts` writes before the trailing "o", and I matched a normal space. The page was right; I used `\s` in the test.
- **A spec number cannot be met, and I only found out by measuring.** SPEC §22 asks for at most 90 KB of JavaScript. A Playwright test (cold cache, compressed request sizes) gave 142.3 KB for the landing page, of which an empty page (the 404 page, no code of ours) is 132.5 KB. Our own code adds 9.8 KB. Turning off `partialPrefetching` changed nothing. I did not change the spec: the test of our share (at most 20 KB over an empty page) is on, and the absolute 90 KB test is `fixme` until David decides.
- **I looked at the first measurement in the wrong unit.** A `curl` of every referenced script gave 180 KB, a different number from Playwright's 142.3 KB, because some referenced scripts are not loaded. The Playwright figure is the one that counts what the browser downloads.
- **A screenshot tool failed**: the Browser pane was not displayed. I used Playwright's own screenshot to look at the band at 375 px and 1280 px instead.
- Limits: the page was checked at 375 px and 1280 px only. The calculator uses one conversion fee for both funds, a known simplification (see above).
- **The JavaScript budget was changed, by David's decision.** After the measurement above he asked to replace the 90 KB with a realistic number (our code at most 20 KB over an empty page, the route at most 150 KB), saying the 90 KB was never a real concern and he chose Next because he knows it. SPEC §12, SPEC §22, PHASES and the e2e test now say so, and note 0034 records it. The skipped test is now a real one. The older notes that mention 90 KB are left as written.

### PR: design docs at rev. 4

**Prompt (summary):** David reviewed the new Design Study and Wireframe Board and asked for them to be reflected in `docs/`, especially `design`.

**Produced**

- `docs/design/DESIGN-GUIDE.md`, `wireframe-b.md`, `README.md` and `wireframes/README.md` rewritten to rev. 4: saving box, error and switch colours with calculated contrasts, the motion scale, the new screens and states, the open points.
- 32 new PNG exports in `docs/design/images/` (the old set and the hero animation image replaced), the Design Study and Board HTML with their build scripts, decision note 0035.
- The old `build.py`, `dump_frames.py`, `png.js` and the rev. 2 document removed.

**Mistakes and corrections**

- **I first wrote a 2 px focus ring into the Design Study.** The repo guide says 3 px with 2 px offset (section 6). I corrected the study and the motion board before copying the text here.
- **The cookie switch failed contrast.** The first off track was 1.63:1 against the card, below the 3:1 for controls. It is now `muted` (5.62:1) and the on state is `#2F6B49`.
- **A rebuild script edited another script.** One of my patch scripts changed `build_study.py`, which broke the clean rebuild chain. I removed that edit and checked that `make_rev4.sh` reproduces the same files.
- **Fonts fell back to serif in the motion board** because of shorthands without a generic family. Fixed, and the exported image was checked.
- Limits: `pnpm check` and the browser were not run against app code, because only docs and wireframe files changed. The copy, type token and headline differences between the design and the code are listed in note 0035 and not resolved here.

### Data needs per screen (after wireframe rev. 4)

**Prompt (summary):** David asked how PR #26 (the rev. 4 design docs) affects the phases, and to fill the data gaps without another design review. He answered: deliver by tomorrow evening, build `docs/DATA-NEEDS.md` and `pnpm data:gaps`, "poplatky brokera" counts both purchase commission and custody fee, fees stay static, and asked me to explain what I meant by a design freeze and to suggest a fund set.

**Produced:** `src/server/data/needs.ts` (what each screen needs), `gaps.ts` and `scripts/data-gaps.ts` (`pnpm data:gaps`), 11 tests, `docs/DATA-NEEDS.md`, and placeholder records for VUSA and EQQQ in `data/` (all `TODO_VERIFY`).

**Mistakes and corrections**

- **My first impact analysis stated what the redesign changed, but I had not yet looked at the data against it.** Only when the report ran did the real gap show: 32 of 118 values verified, and 35 values the data model has no place for (purchase commission, listing currency).
- **A value two screens need was counted twice** in my first version of the report, which made the gap look bigger than it is. I added a count of unique missing values.
- **I broke an existing test by adding two funds.** `validate.test.ts` pinned the data to exactly 8 funds. I updated its list to the 10 now in the data (the 8 of SPEC §5 plus VUSA and EQQQ) and gave it a comment. David should look at that edit.
- **The wireframe's CSNDX 0,33 % is contradicted by our own verified data**: the iShares factsheet we saved is named "csndx" and says 0,30 %. The wireframe marks its figure "from memory". Nothing in the data uses the wireframe figure.
- Limits: the needs list is my reading of the rev. 4 text spec, not of the Design Study itself, so a screen detail only in the Study could be missing.
