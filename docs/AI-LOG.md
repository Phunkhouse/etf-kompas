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

**Follow-up in a second PR (rev. 5):** PR #26 was already merged when this work started, so rev. 5 is a new branch from main. David chose the A/B definition "same layout, headline only" (note 0041). The Study and Board gained two variant b hero boards, the calculator-first hero was removed from the documents, `hero-b-desktop.png` and `hero-b-mobile.png` replaced `hero-a-mobile.png`, and SPEC §6, §11 and §22 and the README sections for conversion and hypotheses were updated. Mistakes: the brief said the PR was open and its decision would be note 0036, but PR #26 was merged and 0036 to 0040 already existed, so I numbered the note 0041; the brief's own sample-size figure (3,300 per variant) was a little high, and I recomputed 3,200. Limit: the 375 x 667 hero fit with the longer headline and the extra sentence is not measured.

### Data needs per screen (after wireframe rev. 4)

**Prompt (summary):** David asked how PR #26 (the rev. 4 design docs) affects the phases, and to fill the data gaps without another design review. He answered: deliver by tomorrow evening, build `docs/DATA-NEEDS.md` and `pnpm data:gaps`, "poplatky brokera" counts both purchase commission and custody fee, fees stay static, and asked me to explain what I meant by a design freeze and to suggest a fund set.

**Produced:** `src/server/data/needs.ts` (what each screen needs), `gaps.ts` and `scripts/data-gaps.ts` (`pnpm data:gaps`), 11 tests, `docs/DATA-NEEDS.md`, and placeholder records for VUSA and EQQQ in `data/` (all `TODO_VERIFY`).

**Mistakes and corrections**

- **My first impact analysis stated what the redesign changed, but I had not yet looked at the data against it.** Only when the report ran did the real gap show: 32 of 118 values verified, and 35 values the data model has no place for (purchase commission, listing currency).
- **A value two screens need was counted twice** in my first version of the report, which made the gap look bigger than it is. I added a count of unique missing values.
- **I broke an existing test by adding two funds.** `validate.test.ts` pinned the data to exactly 8 funds. I updated its list to the 10 now in the data (the 8 of SPEC §5 plus VUSA and EQQQ) and gave it a comment. David should look at that edit.
- **The wireframe's CSNDX 0,33 % is contradicted by our own verified data**: the iShares factsheet we saved is named "csndx" and says 0,30 %. The wireframe marks its figure "from memory". Nothing in the data uses the wireframe figure.
- Limits: the needs list is my reading of the rev. 4 text spec, not of the Design Study itself, so a screen detail only in the Study could be missing.

### Fund set: five twins

**Prompt (summary):** "#27 landed. Ok, use your suggestion about fund set." plus a question whether adding funds later is easy.

**Produced:** VTI, SCHD and VWCE removed from `data/` (and from every broker's availability keys), "8 fondů" changed to "5 fondů" in SPEC §3.2, §5, §25 and the ad copy, `needs.ts`, the pinned fund list in `validate.test.ts`, `DATA-NEEDS.md`, decision note 0036 with the answer to "is it easy to add more later".

**Mistakes and corrections**

- **My first search for "8 funds" matched "height" and "weight" everywhere** (I had searched for "eight"). I narrowed it to the real phrases. Nothing was changed from the first result.
- **SPEC §3.2 still conflicts with rev. 4** (it lists 5 and 10 year performance; the wireframes show no returns, rule "bez výnosů"). I did not change it, because that is a different decision, and wrote it into note 0036 instead.
- I edited the pinned fund list in an existing validator test a second time (the first was for VUSA and EQQQ). David should look at it.

### Calculator v2: methodology and test list (draft)

**Prompt (summary):** "#27 landed ... Do you want the new broker fee model drafted now (tests first)? Yes". "Poplatky brokera" counts both purchase commission and custody fee; fees stay static.

**Produced:** `docs/METHODOLOGY-V2.md` (draft: broker fee model, formulas, golden-case inputs, four questions) and `src/server/cost.test.ts` with 43 `it.todo` cases. `METHODOLOGY.md` gets a banner pointing to the draft. No code that calculates.

**Mistakes and corrections**

- **My first idea of the fee model was too simple.** I started from one `custodyFeePct` per broker, as in the old schema. DEGIRO's own fee document, which David had verified, showed otherwise: the purchase fee depends on the exchange a fund is listed on (€0 on its Tradegate selection, €2 elsewhere, plus a €1 handling fee per order), there is a fixed yearly fee per exchange used, and EUR to CZK is free. So the model prices a broker and a listing together, and fees in euro or dollar need an exchange rate in Kč, which the data did not have. I found this by reading the document, not by designing first.
- **I cannot say the model fits the other four brokers.** Only DEGIRO's schedule is on file. The shapes for Fio, IBKR, Trading 212 and XTB are my expectation, to be checked when David verifies them; the model may need one more field.
- **Withholding and dividend yield leave the formula** because the rev. 4 text lists three result parts without them. I read that from the text spec, not the Design Study, and asked David to confirm.
- Golden cases G1 and G2 repeat the verified v1 cases (2 400 and 1 672) so that the new formulas can be checked against numbers David already hand-verified. G3 to G5 have no expected values: David computes them.
- **The branch conflicted with #28 in `AI-LOG.md`.** Both PRs appended an entry at the end of the file. I rebased onto `main` and kept both entries in order. No other file conflicted. I then wrote David's four answers into the draft and into note 0037, and added 4 more `it.todo` cases for them (now 47). One thing the answers left open: today no broker has every value verified, so the headline rule would produce no number. I asked about it instead of choosing.

### Calculator v2: decisions A and B, and a new open point

**Prompt (summary):** "#29 landed", with answers to the two open points: go with the fund-fee-only state while no broker is priced, and the headline wording "u ověřených brokerů vás to bude stát nejvýš X XXX Kč" is OK for now.

**Produced:** both answers in METHODOLOGY-V2 and note 0037, two test cases changed or added (48 `it.todo` in all), and a third open point.

**Mistakes and corrections**

- **My model priced one listing per fund, as the wireframe does, and I had not checked what the brokers actually offer.** Reading the saved DEGIRO screenshots again showed CSPX in two listings (London in dollars, Amsterdam in euros). In euros the conversion from korunas is free, so pricing only the dollar listing overstates DEGIRO's cost by up to 0,25 % of the deposits. I added it as open point C and did not decide it.
- **I did not treat #29 as approval of the tests.** The PR asked for approval of the test list and for G3 to G5. Merging it is not that, so I am asking again before writing any calculation code.

### Calculator v2 core: tests first, then the maths

**Prompt (summary):** David approved the 48-case test list, said "do it as suggested" for the listing question (cheapest listing), and asked what exactly I need for the golden cases G3 to G5.

**Produced:** `src/server/cost.ts` (the pure maths: `calcCost`, `splitRounded`, `purchaseFeeKc`, `findPurchaseRule`, `conversionFeePct`, `toKc`, `assertPlainPercent`) and its tests: 33 real tests, 17 still `it.todo` (brokers with a price, the data model, golden cases G3 to G5). A spreadsheet recipe for the golden cases in METHODOLOGY-V2 §7, decision C in the draft and in note 0037.

**Mistakes and corrections**

- **The tests were written against a stub first and failed as they should:** 27 failed and 6 passed trivially. The implementation then passed all 33 on the first run, and G1 and G2 reproduce the verified old values (2 400 and 1 672). No test was changed to fit the code.
- **I added a few small cases to the approved list** because the functions need them: a conversion fee for a currency without a verified fee is `null` (not 0), currency conversion of amounts, `calcCost` rejecting a fee that looks like a fraction, and two crafted cases for the rounding rule. David should know they were not in the 48.
- **My golden-case table was ambiguous.** G1 to G4 said "listing CZK" next to a conversion fee, but a CZK listing pays no conversion. The pure maths takes the conversion fee as a given number; the step from a listing to that number is a different function. The spreadsheet recipe now gives the already-resolved numbers (purchase fee and custody in Kč).
- **I have not computed G3 to G5 myself.** They are for David's spreadsheet. I will cross-check them with a month-by-month loop, which is a different method from the closed form, after his numbers arrive.

### Golden cases G3 to G5

**Prompt (summary):** David sent his spreadsheet results in `golden cases.md` and asked me to check them.

**Produced:** the three cases as real tests in `cost.test.ts` and the results table in METHODOLOGY-V2 §7.

**Mistakes and corrections**

- **No mismatch to report.** I recomputed the three cases with a month-by-month loop (a different method from the closed form) and then ran the code. Both agree with David's numbers to the Kč, including G5, where the broker part is 5 207 before the rounding remainder and 5 208 after. His note on G5 describes the same rule.
- **Two of my edits missed because of Prettier's quote style**: my search string used single quotes, and Prettier had switched that line to double quotes because of an apostrophe. The script stopped with an error before changing anything, so nothing was half-applied. I matched the lines by position instead.
- Limit: three cases cover the purchase minimum, a currency conversion of fixed fees and the rounding remainder. They do not cover a maximum that binds or a rule picked by venue; those are in the unit tests of the helper functions.

### Broker pricing and the data model for broker fees

**Prompt (summary):** "#30 landed, there are conflicts in #31", then "what do you want from me for DEGIRO: check the exact fees on the website?"

**Produced:** `priceBroker` and `priceBrokers` (`src/server/broker-pricing.ts`), `fundFeeKc`, the schema for broker fees (`fees`: conversion per currency, purchase rules, custody, listings per fund) and `rates`, the 45-day freshness limit for them in the validator, `data/rates.json` (all `TODO_VERIFY`), and the 15 remaining approved cases as real tests (21 tests in two files). The 15 `it.todo` in `cost.test.ts` are gone.

**Mistakes and corrections**

- **The #31 conflict was my stacking.** #31 was based on #30, which landed as a squash, so my branch still carried #30's commits. I replayed only my two commits onto `main` with `rebase --onto`. No file conflicted.
- **My new type was called `Record`**, which hid TypeScript's own `Record` in the same file. Typecheck caught it; the tests had already passed, because vitest does not type-check. Renamed to `SourcedValue`.
- **I added a case that was not in the approved 15**: a broker falls back to a listing that can be priced when the cheaper one cannot (for example no verified dollar fee). Without it a broker with one unpriceable listing would lose its price even though another listing is fine.
- **The gaps report is out of date on one point.** `needs.ts` still lists purchase commission and listing currency as "not in the model yet", but the model now has them. I left it for the next PR, which also moves the calculator to version 2, so the report and the UI change together.
- **`fees` and `rates` are optional in the schema** so that existing fixtures and the current data (no broker has fee values yet) stay valid. The consequence: no broker is priced today, which is the state decided in note 0037.

### DEGIRO fee records, the first priced broker

**Prompt (summary):** "Could you check from this PDF?" (David's own copy of DEGIRO's fee overview), then "I am fine with the rest".

**Produced:** DEGIRO's conversion (USD 0,25 %, EUR 0), two purchase rules, the annual custody fee and the listings of CSPX, CNDX and VUAA in `data/brokers.json`, all with hashes computed from the files; a real-data test that prices CSPX at DEGIRO.

**Mistakes and corrections**

- **David's copy of the PDF has the same SHA-256 as the one my fetch tool saved** (`ab01346d…`), so the evidence hash was right from the start. I had flagged it as a risk; it was not one.
- **The first price looked too big, and I checked it before trusting it.** At EUR 3 per order on about EUR 123, broker fees come to 12 655 Kč of the 14 403 Kč total, against 1 748 Kč for the fund. A month-by-month loop gives the same figures, so the arithmetic is right. It is a result of the fee schedule, and it is the reason the broker choice matters.
- **Assumptions I wrote into the evidence, not hid:** the Tradegate rule follows the PDF literally ("ETF listed on Tradegate"), the cap of 0,25 % of the account and the CNX connection fee are ignored, and the model has one custody fee per broker although DEGIRO exempts ETF Selection. All three are in the `evidence` text of the records.
- **The record says `verifiedBy` David** on his "fine with the rest" after he saw the list. The values themselves were read by me from his PDF, and he confirmed them.
- **I pushed a red build.** The seed-data test in `validate.test.ts` checks the real data on a fixed day (2026-10-11), and the DEGIRO fee records are dated 2026-10-12, so they counted as future dates. `pnpm check` printed the failure, but I had chained the commit and the push after it with `;` instead of `&&`, so both went ahead. I fixed the date (2026-10-12) in a second commit. The same slip happened with the earlier data PR on 2026-10-11, which is why the test has its own fixed day. From now on a commit follows a green check only.

### A daily exchange rate (proposal)

**Prompt (summary):** "Exchange rate concerns me a little bit. Is there a way you could fetch it lightly at least once a day? Exchange rates could get old pretty fast."

**Produced:** a proposal in METHODOLOGY-V2 (fetch the Czech National Bank daily file on the server, cache it for 12 hours, fall back to a verified record, never use a rate older than 45 days) and a test list of 18 `it.todo` cases in `src/server/cnb.test.ts`. No code that fetches or calculates.

**Mistakes and corrections**

- **My earlier decision was too static, and David saw it first.** I had asked for the rate as "a sourced record that goes stale like the fees" and David accepted. He then pointed out that a rate ages in days, not months, and a hand-verified record could not keep up. The 45-day limit is the right rule for a fee schedule and the wrong one for a rate.
- **I checked the caching call against the installed Next.js docs, not memory.** `use cache` with an inline `cacheLife({ revalidate })` is supported in this version, and the docs recommend a lifetime in every cached scope.
- **One open risk I could not test here:** whether Vercel keeps the cached rate across deployments. It is listed as a Phase 6 check.

### The daily exchange rate, implemented

**Prompt (summary):** "#34 approved, but needs to resolve merge conflicts."

**Produced:** `src/server/cnb.ts` (parse the bank's daily file, freshness, choosing between the fetched and the verified rate, one plain request), 18 tests that were listed first and approved, `src/app/rates.ts` (the cached fetch, 12 hours or 5 minutes after a failure), decision note 0038.

**Mistakes and corrections**

- **Only `AI-LOG.md` conflicted** with `main` after #33 landed; I kept both entries in order.
- **Tests first, then the code:** 17 of 18 failed against stubs (1 passed trivially), and the implementation passed all 18 on the first run, with no test changed.
- **I did not trust that the cache would behave, so I checked a real build.** A temporary change to the page called `getRates()`. The build reported the route as revalidating every 12 hours with a 1 week expire, the page contained the bank's actual rates, and the response header said `s-maxage=43200`. I then reverted the temporary change. Nothing on the page uses `getRates()` yet: the calculator UI does, in the next PR.
- Limits: a failing bank was tested only with a stubbed `fetch`, not with a real outage. The first request happens at build time, so a build without network access falls back to the verified record, which is a placeholder today.

### SPEC and PHASES synced with rev. 4 (docs only)

**Prompt (summary):** "Before we start calculator UI I guess we should check latest v4 design change and docs change against specs.md. Could you verify the file is up to date?", then David's answers 1 to 7 on the open points.

**Produced:** SPEC.md brought to draft v3 (§0 to §29: hero and calculator, data and rates, schedule, methodology §21, launch gate, glossary), PHASES.md, decision note 0039.

**Mistakes and corrections**

- **The spec had silently drifted.** Nothing in the earlier PRs touched it after #28, so the notes (0030 to 0038) and rev. 4 were never written in. I found it only when David asked; I should have flagged the drift when each note was written.
- **A dangling reference** in §2 pointed at `docs/audience-and-plain-language.md`, which does not exist; replaced.
- **Point 5 ("Adapt it") was ambiguous.** I read it as adapting the tokens to the wireframe sizes, and wrote it so, with the hero fit still to be re-measured. David should confirm.
- **Note 0039 records only one reason** (point 7); the others were decisions without reasons, and I did not invent any.

### Copy checker: "broker" allowed, index names allowed in the lead

**Prompt (summary):** "#35 landed, start the code PR tests first", then "approved, implement the rules".

**Produced:** `copy-check.ts` no longer bans "broker" and allows "S&P 500" and "Nasdaq 100" under a key named `lead` (as already allowed in rows with a plain name). Tests changed first (one removed, one replaced, two added) and approved; 2 failed before the change, all 352 pass after.

**Mistakes and corrections**

- None found in this change. Limit: the exemption is by key name only, so any future string under a key called `lead` gets it; the PR keeps type tokens and the rev. 4 headline out, because they change the hero's geometry.

### Type tokens and the rev. 4 hero headline

**Prompt (summary):** "#36 landed, start the type tokens PR tests first", then "approved, implement the tokens".

**Produced:** `hero-phone` 28 to 30 px, `4xl` 58 to 54 px, hero b headline and lead from the rev. 4 wireframe, DESIGN-GUIDE updated. Tests first: two font-size checks and the headline expectations; 7 failed before, all 352 unit and 37 e2e tests pass after.

**Mistakes and corrections**

- **I missed one stale test** when listing the test changes (`HeroB.test.tsx` still expected the old headline); it failed on the first check and I updated it after approval. The styleguide token labels (`page.tsx`) also still said 28 and 58 px.
- Limit: the 375x667 fit passes at 30 px with the new headline in Chromium (Pixel 7 profile); other fonts and devices are not measured.

### Calculator data for the browser (`calculatorData`)

**Prompt (summary):** "Browser maths is fine, keep that order, start PR 1 tests", then "approved, implement calculatorData".

**Produced:** `src/server/calculator-data.ts`: the verified fee of one fund, every broker by name, the pricing data of brokers with fees (verified records and the chosen fund only) and the exchange rates with their oldest date. 15 tests first, all failing against a stub that threw; 367 tests pass after.

**Mistakes and corrections**

- **My first implementation leaked unverified values.** The test "no TODO_VERIFY reaches the browser" failed: I passed whole broker objects, and a broker's own `fxFeePct`, `custodyFeePct` and `czSupport` are still `TODO_VERIFY` (pricing never reads them). I fixed it by narrowing the pricing functions' parameter to `PricingBroker` (`id`, `availability`, `fees`). That is a type-only change in `broker-pricing.ts`; its tests did not change and still pass. I had not thought of those fields when I wrote the test list; the test was written to catch exactly this class of mistake.
- Limit: nothing uses `calculatorData` yet; the page wiring and the UI come in PR 2.

### Calculator UI v2

**Prompt (summary):** "#38 landed, draft the PR 2 tests", then "approved, implement the calculator".

**Produced:** the new `Calculator` (browser maths with `priceBrokers`; priced, fund-fee-only and failure states; the saving box under its hide rule), `CalculatorSection`, `NumberDisplay` with a swap instead of a count-up, the saving-box colour tokens with their contrast pairs, new copy in `copy.ts`, both pages calling `getRates()` and `calculatorData()`. Removed the v1 code (`calc.ts`, `calculator-inputs.ts`, their tests, `cheaperNote`). Tests first: 25 component tests failed before; 339 unit/component and 38 e2e tests pass after.

**Mistakes and corrections**

- **I blew the JS budget and nearly did not notice.** The first full e2e run failed the budget test: our code added 42.8 KB over an empty page (limit 20) and the route was 178.5 KB (limit 150). Cause: the pricing code imported the `TODO_VERIFY` constant from `schema.ts`, which dragged the whole Zod library into the browser. I moved the constant into `data/todo.ts` (re-exported from `schema.ts`, no other change). Now ours is 11.0 KB and the route 143.5 KB. A unit test cannot see this; only the budget e2e did.
- **Two bugs in my own approved tests**, found when I ran them against the implementation: the new NumberDisplay tests compared against ordinary spaces while the page uses non-breaking spaces, and one fund-only test normalised only the expected text. I fixed the comparisons only; what they assert did not change. I also added a one-line type guard to the test fixture (`record.value` can be the `TODO_VERIFY` string) that typecheck required.
- **Not done:** the motion scale says the old number rises out as the new one rises in; I built only the rise-in (no exit animation, no extra JS). The loading state is skipped (pricing is synchronous). The saving-box link goes to `#formular`, which does not exist until Phase 4.
- **Not checked by eye:** I ran the unit, component and e2e tests and the budget, but did not look at the result on a phone screen. Layout of the new parts and the saving box needs your review on `/styleguide` and the live page.

- Decision note 0040 (keep Zod out of browser code) added to this PR after David gave the reason: fitting the JS budget.

### Acc/Dist of CSPX, VUAA and CNDX

**Prompt (summary):** "Acc/Dist … for CSPX, VUAA and CNDX. The documents are already saved. If you have it already saved, why do I need to check it?", then "yes, download both" and "yes, write the three records".

**Produced:** three `distribution` records (all `accumulating`) in `data/etfs.json`, each with the source, date and hash of the document already cited for that fund's fee, and the quoted line in the evidence text. `pnpm data:gaps`: the hero table is at 9 of 12.

**Mistakes and corrections**

- **I told David the documents were saved when they were not.** DATA-NEEDS said the factsheets and the KID were "already saved in `evidence/`", and I put the check on David's list. Only the VUAA KID existed locally (in Downloads); the CSPX and CNDX factsheets had been fetched once and not kept. David asked why he had to check something already saved, which was the right question: I read the documents myself. I downloaded both again, and their SHA-256 matched the records, so they are the same versions.
- The records say `verifiedBy` David because he confirmed the values after seeing the quoted lines, not because he read the documents himself.
- **The EQQQ KID David supplied is for a different share class** ("CHF Hdg Acc", ISIN IE00BYVTMT69, accurate as at 26 June 2026, ongoing costs 0,35 %), not the USD class that brokers list as EQQQ. Its fee and Acc type belong to that class, so I wrote nothing for EQQQ. It also states no source URL, which the data requires. Waiting for the right document and where it came from.

### EQQQ availability at DEGIRO, Trading 212 and XTB

**Prompt (summary):** David supplied the EQQQ search screenshots from the three brokers (already saved in `evidence/brokers/`).

**Produced:** three availability records for `eqqq` (all true), each with the screenshot's SHA-256 and what it shows.

**Mistakes and corrections**

- **The first EQQQ documents (the KID and the factsheet) and the Invesco screenshot were for the CHF Hdg Acc class** (EQCH, IE00BYVTMT69), not the fund brokers sell as EQQQ. The broker screenshots settle it: the ticker EQQQ is ISIN IE0032077012; DEGIRO also lists IE00BFZXGZ54 (EQQB/EQAC, Acc), IE00BYVTMT69 (EQCH, CHF), IE00BYVTMS52 (EQEU, EUR hedged) and IE00BYVTMW98 (EQGB, GBP hedged). Trading 212 labels EQQQ "(Dist)" and XTB "DIST", so the fund EQQQ is the distributing class. That is the brokers' labelling; the issuer's own document for IE0032077012 is still needed for the fee and the type.
- `eqqq` in the data therefore means the class IE0032077012. DEGIRO's screenshot is a logged-in search; the other two are as David supplied them. All three are availability only: no fee, name or type has been written for EQQQ yet.

### EQQQ name, ISIN, fee and type

**Prompt (summary):** David supplied the key investor information for the Dist class (IE0032077012) and its Invesco URL, after "This is it?".

**Produced:** `name`, `isin`, `ter` (0,30) and `distribution` (`distributing`) for EQQQ in `data/etfs.json`, one `asOf` 2026-06-26 (the date printed in the document), and the source added to `sources.json`. The hero table is at 12 of 12 values.

**Mistakes and corrections**

- This is the third document for EQQQ; the first two (KID and factsheet) were for the CHF hedged class and I did not write anything from them. I checked the ISIN and the share-class line in each document before using it, which is what caught it.
- The document is a UCITS KIID (the older format), accurate as at 26 June 2026. By note 0024 that date is the `asOf`, so the record goes stale on 2026-10-24 (120 days) and needs a newer document by then.
- The record says `verifiedBy` David, as for the other funds: he confirmed the values after seeing the quoted lines.

### Fio availability for EQQQ and VUAA

**Prompt (summary):** David supplied Fio e-Broker screenshots (instrument pages and purchase forms) for VUAA, EQQQ, SXR8 and SXRV, and after a first set of symbol searches asked what to do about the tickers that change.

**Produced:** `availability true` at Fio for `eqqq` and `vuaa`, with the hashes of both screenshots and what they show (XETRA, EUR). CSPX and CNDX are held. The Fio source (`https://www.fio.cz`, the broker's home page like the other brokers') is added to `sources.json`.

**Mistakes and corrections**

- **My first suggestion was too eager and then too cautious.** The first Fio screenshots were symbol searches only, and I almost took them as evidence; they showed no ISIN, exchange or currency, so I asked for the instrument page and the purchase form. David also pushed back on my list: VOO and QQQ need no Fio and IBKR check (3 of 5 brokers are already verified as not selling them, which is the majority the hero line needs).
- **CSPX and CNDX are held on purpose.** Fio's pages say only "ISHARES S&P 500 ETF (SXR8)" and "ISHARES NAS. 100 ETF (SXRV)", with no ISIN, and iShares has more than one S&P 500 fund. Our iShares factsheets say the funds are listed on Deutsche Börse Xetra but do not give the tickers; the SXR8/SXRV link to our ISINs rests on a Gemini note and my own knowledge, neither of which is a document. Waiting for the iShares product page (it lists the Xetra ticker with the ISIN) or David's decision to accept the inference.
- The Fio evidence is a demo account and a purchase form that was not submitted. It proves the instrument exists on XETRA in Fio's system, not that an order would be accepted. The `https://www.fio.cz` source is the broker's home page, not a document.
- The listing (XETRA, EUR) is not written yet: a Fio `fees` block with only listings would make the calculator treat Fio as a priced broker with fees, and a test pins DEGIRO as the only one. It goes in with the Fio fee batch; the screenshots are its evidence.

### Fio availability for VUSA, and why VUSA's own data waits

**Prompt (summary):** "And what about VUSA?", then David supplied the Vanguard KIID and its URL and said "write Fio records right away, other brokers will follow".

**Produced:** `availability true` for VUSA at Fio, from the page and purchase form (XETRA, EUR), added to the open Fio PR.

**Mistakes and corrections**

- **I had skipped the VUSA screenshots without saying why.** David asked; the reason (VUSA had no ISIN or fund data in the repo to tie the ticker to) should have been in my message.
- **VUSA's fund values are not written.** The KIID (Vanguard S&P 500 UCITS ETF, (USD) Distributing, ISIN IE00B3XXRP09, ongoing charges 0.07 %, "Income from the ETF Shares will be paid out") is accurate as at 17/02/2026. By note 0024 that date is the `asOf`, which is 237 days old; the validator rejects a value over 120 days even in draft mode, so writing it would turn CI red. Needs either a newer Vanguard document or David's decision on the rule for a current KID.
- The ticker VUSA is tied to the ISIN by the KIID's class name plus the ticker alone; the KIID prints no ticker. The Fio evidence text says so. Other brokers' VUSA screenshots (ticker and ISIN together) will upgrade it.

### VUSA name, ISIN, fee and type from the August factsheet

**Prompt (summary):** David added the Vanguard factsheet for VUSA (dated 31 August 2026), after the KIID turned out to be too old for the validator.

**Produced:** VUSA `name`, `isin`, `ter` (0,07) and `distribution` (`distributing`), `asOf` 2026-08-31, source added to `sources.json`. The Fio VUSA evidence now cites the factsheet line "Deutsche Börse, EUR, VUSA, VUSA.DE" for ISIN IE00B3XXRP09, which ties the ticker to the ISIN with a document and not by inference.

**Mistakes and corrections**

- **The February KIID I had first read was the wrong choice of source for `asOf`**, not a wrong document: it is accurate as at 17/02/2026, so the validator would have rejected the values. The factsheet from Vanguard's own site carries the same facts with a fresh date. The KIID is still cited in the earlier Fio evidence text.
- **One risk to decide:** the factsheet says it "is directed at professional investors and should not be distributed to, or relied upon by retail investors". We cite facts from it (ISIN, fee, income schedule), not the document itself, and the KIID (the retail document) says the same ISIN, fee and income treatment. Flagged for David.
- The record goes stale on 2026-12-29 (120 days after 31 August).
- **A test depended on data that has now changed.** `calculator-data.test.ts` used VUSA's missing fee as its example of an unverified fee; once VUSA was verified it failed. I changed that one test to blank the fee in a copy of the data (same assertion). I changed an approved test without asking first; it is a one-line fixture change, listed here so David can see it.

### VUSA availability at DEGIRO, Trading 212 and XTB

**Prompt (summary):** David added the VUSA screenshots for the three brokers.

**Produced:** `availability true` for `vusa` at DEGIRO (shows "VUSA | IE00B3XXRP09", exchange Tradegate), Trading 212 (LSE, Dist) and XTB (VUSA.DE and VUSA.UK, DIST), each with the screenshot's hash and what it shows.

**Mistakes and corrections**

- None found. Limits: only DEGIRO prints the ISIN next to the ticker; for Trading 212 and XTB the link rests on the ticker and the "Dist" label plus DEGIRO's screenshot and Vanguard's factsheet, and the evidence text says so. XTB's account was not yet activated (the page says "Aktivovat účet"), the same condition as for the earlier XTB screenshots.

### Fio availability for CSPX and CNDX, written as an accepted inference

**Prompt (summary):** David: "Accept the inference for Fio".

**Produced:** `availability true` at Fio for `cspx` (SXR8) and `cndx` (SXRV), with the screenshots' hashes. The evidence text says in capitals that it is an inference accepted by David, and why: Fio shows no ISIN, the names ("ISHARES S&P 500 ETF") do not tell iShares funds apart, and the iShares factsheets do not print the Xetra tickers.

**Mistakes and corrections**

- This is the weakest evidence in the data so far, and I wrote it only because David decided to accept it. A document that prints "SXR8" and "SXRV" next to the ISINs (the iShares product pages) would replace it; until then the records read as an inference.

### Hero table rev. 4 (four twins, Acc/Dist, muted line)

**Prompt (summary):** David decided the open points (keep the button label "Spočítat, kolik zaplatím", hero a in its own PR, accept the Fio inference), then "tests are fine, proceed".

**Produced:** `src/server/hero.ts` (`heroTwins`, `heroNote`), the four-row hero table with Acc and Dist pills, the muted line under it, a `neutral` Pill tone, new copy, and `heroRows` removed. Tests first: 39 failed before; 351 unit/component and 43 e2e tests pass after. JS budget unchanged (ours 11.0 KB, route 143.5 KB).

**Mistakes and corrections**

- **The hero no longer fitted 375x667 and I had warned it might not.** With four rows the button's bottom edge was at 726 px (limit 667). I measured the layout (rows 89 px each) and fixed it in CSS only: tighter row and header padding and a tighter title line height on phones. Now 653 px, 14 px of margin (note 0031 had 20). Same copy, same order of elements. A narrower margin means a font or rendering change on another machine could push it over; the geometry test runs in CI.
- **A test I did not list was wrong for four rows:** `hero-fit.spec.ts` counted rows as header plus three funds. I changed it to five rows after approval.
- **My new `HeroTable` source-line test typed ordinary spaces where the page uses non-breaking ones**, and failed. Fixed the comparison only, not what it asserts.
- **A real behaviour slip:** my first `Landing` change fell back to hero a when hero b had no note, which broke an existing Landing test. Hero b now renders without the muted line when there is no note.
- **The first screenshots caught the table's intro animation mid-fade and showed empty rows.** I retook them after the animation; not a bug.
- **The date in the muted line is the oldest `asOf` on the page** (June 2026, the VOO factsheet), the same as the top bar, not the date of the CSPX availability screenshots (October). It is conservative; the wireframe example shows 10. 2026.
- **Dead code, removed after David asked.** `buyability` in `availability.ts` (and its `Buyability` type and 12 tests) became unused when the table lost its buy column. I first left it in place and wrote that down; David asked why it was still there, and it went in the same PR. `availability.ts` keeps `verifiedValue`, which `hero.ts` uses, now with its own small test. The rule "no only with a source per firm" (note 0029) lives on in `heroNote` and will apply per broker on the comparison page.

### Hero a (calculator-first)

**Prompt (summary):** "#45 landed, draft the PR 4 plan", David's three OKs (same rev. 4 headline, no start button on desktop, heading visually hidden), then "approved, implement hero a".

**Produced:** hero a now has the rev. 4 headline, the "Zjistěte to za 20 sekund. Zdarma, bez registrace." line and the calculator band as the hero: slider and chips, the start button "Ukázat, kolik mě to bude stát" with its muted line (phones only), and the result below the first screen at `#vysledek`. `Calculator` got `action` and `headingHidden`, `CalculatorSection` a `hero` flag. Tests first: 6 failed before; 354 unit/component and 50 e2e pass after. JS budget: ours 11.3 KB, route 143.9 KB.

**Mistakes and corrections**

- **My earlier plan was wrong about the reason to split hero a off.** I had said it needed shared state between hero inputs and the result band. The drawing showed the inputs are the same calculator, so one calculator moved up the page and no shared state was needed. The split still helped keep the PR small, but the premise was mine, not the design's.
- **The first run failed my own approved test:** at 375x667 the top of the result number (y=649) peeked into the first screen, a half-cut "14 416 Kč" at the bottom edge. I added 32 px of space under the start button on phones, which puts the result at about 681 px.
- The old hero-a headline ("Které fondy si z Česka opravdu koupíte?") is gone from the code. Any ad copy that still points to it would no longer match the page.
- Desktop hero a is not drawn; it was built as agreed (inputs left, result right, no start button) and looked at in a screenshot only, not reviewed by David.

### Hero polish (A of the Phase 3 checklist)

**Prompt (summary):** "Fix all hero differences, order A B C D, also create a checklist"; then "yes, keep, keep, keep; tests approved".

**Produced:** the callout in the drawing's wording (its second sentence only when the data supports it), the link "nebo rovnou srovnání brokerů" (to `#formular`, a dead anchor until B), the table header "Cena fondů" with the source at its top right on desktop, "brokerů" in the top bar and the source line, the button label "Spočítat, kolik mě to bude stát", and a desktop grid fix that packs headline, callout and button together. Tests first: 7 failed before; 358 unit/component and 52 e2e pass after. JS unchanged.

**Mistakes and corrections**

- **My edit script replaced nothing in four test files** (I passed a replacement count of 0 to `str.replace`), so the old button label stayed in the tests and two failed. Fixed by replacing all occurrences. The earlier test-first step of this slice is why I noticed at once.
- **A macOS `sed -i` call failed** (it needs an empty suffix argument); I used Python for the one-line edit instead.
- **I missed a hero difference when I listed them:** on desktop the table's height stretched the grid, so the callout and button were pushed far apart and the button was cut off at an 800 px-high screen. I found it only by looking at the screenshot; fixed with a grid row that takes the spare height.
- Kept on purpose (David's decisions): the phone shows no lead and the callout stays after the table (fit), long plain names in the rows (note 0026), the muted line below the card. The hamburger menu moved to C, with its panel.
- The "ověřeno k 6. 2026" in the top bar and the card is the oldest `asOf` in the whole data, not only in what the page shows; the drawing's 10. 2026 is a placeholder. Not changed.

### The e-mail form (B1 of the Phase 3 checklist)

**Prompt (summary):** "yes to both, #47 landed, draft the B plan", David's four OKs (honest placeholder before Phase 4, one form in the band, conversion wording, abstract preview bars), then "approved, implement the form".

**Produced:** `src/server/leads.ts` (address check, tips box, `submitLead` with a sink, `noStorage`), the server action `src/app/lead-action.ts`, the `LeadForm` component (idle, wrong address, send failure, and the honest "Zkušební provoz: váš e-mail jsme nikam neuložili ani neodeslali." state), and the form placed in the calculator band as a third column on desktop. Tests first: 46 failed before; 406 unit/component and 62 e2e pass after, including real no-JavaScript posts. Nothing is stored, logged or sent.

**Mistakes and corrections**

- **The form's button could not use the shared `Button`.** Inside the dark band that component turns paper-coloured, which would have made it invisible on the light card. I gave the form its own ink button. Caught by reading the Button styles before building, not by a test.
- **A type slip:** `useActionState` widened my initial `{ status: 'idle' }` to a plain string status and typecheck failed; fixed by typing the initial state.
- **JS budget is getting tight:** our code now adds 14.2 KB (limit 20) and the route is 146.7 KB (limit 150), up 2.8 KB from this PR. The remaining PRs (B2, C, Phase 4 and 5) have about 3 KB to spend on the route, so they must be mostly server-rendered.
- **Not done on purpose:** the calculator's amount and years are not sent with the lead (Phase 4); no honeypot, no rate limit, no storage (Phase 4); no link on "Zásady zpracování osobních údajů" (privacy page, C).
- **Noticed, not changed:** on hero b the calculator's own heading ("Kolik vás to bude stát?") renders as a small mono label, while the drawing shows a large bold heading. Left for D (the side-by-side review).

### The explainer sections (B2 of the Phase 3 checklist)

**Prompt (summary):** David's decision to leave the JS budget alone for now, then "approved, implement B2".

**Produced:** `HiddenCosts` ("Za co platíte, aniž to vidíte": three numbered cards, the numbers drawn by a CSS counter so the text has no figures) and `EmailPreview` ("Co dostanete e-mailem": heading, text, the button to the form, two drawn page previews with captions), both server-rendered and placed after the calculator band. Tests first: 12 failed before; 419 unit/component and 69 e2e pass after. JS: ours 14.5 KB, route 147.1 KB (+0.4 KB, the Landing wiring only).

**Mistakes and corrections**

- None found in the code. The wording of the three cards is a proposal for David's copy review: the conversion card is mine (the wireframe's "Americké fondy chtějí dolary" does not match our data), the tax card is the wireframe's sentence as David approved.
- **Cosmetic, not fixed:** on a 375 px phone the preview caption "Strana 1 · Srovnání" wraps to two lines on the narrow card. Left for D.
- The "Otevře se hned po odeslání" line promises the finished product (the results page comes in Phase 4); the site is noindex until then.

### One layout for both variants (E1)

**Prompt (summary):** David landed #50 (design rev. 5: `?v=a` and `?v=b` share one layout and differ only in the h1, note 0041), answered the three questions, then "approved, implement E1".

**Produced:** the calculator-first hero is gone. `Landing` always renders the table-first hero; `data-variant` on `<main>` says which variant is shown; `copy.hero.b` became `copy.hero`; the muted line ends with "Jen cena a dostupnost, ne výnosy."; a shared `LandingPage` serves `/` and `/v/b`. Removed with it: the `hero` flag, `action`, `headingHidden` and the `#vysledek` anchor, their styles and tests, and `e2e/hero-a.spec.ts`. Tests first: 7 failed before; 417 unit/component and 68 e2e pass after. JS: ours 14.1 KB, route 146.7 KB (down 0.4 KB).

**Mistakes and corrections**

- **My calculator-first hero (#46) lasted one day before the design dropped it.** I had built it from the rev. 4 drawing; rev. 5 replaced it. The removal is the cost of building a layout that the A/B decision (note 0041) had not been made for. I did warn that its premise was mine, not the design's, but not that it could be dropped.
- **A leftover in my own tests:** the new Landing test used `within` without importing it (left from an edit I discarded), and typecheck caught it. A second existing test, the lead-form desktop layout, depended on the `#vysledek` anchor I removed; I switched it to find the result by its sentence. I had not grepped the e2e folder for the anchor before removing it.
- **Left on purpose:** `/v/b` shows variant a (`data-variant="a"`) because variant b is allowed only with two priced brokers and has no headline yet; that is E2. The component is still named `HeroB`: renaming it would change the approved tests' imports, so I left it and noted it here.

### The trust block and the FAQ (C1)

**Prompt (summary):** "Keep the order, draft the C1 plan", David's four yes answers (the "provize" statement, the hedged KID reason, "Jak počítáme" as a short list, the e-mail answer without a retention period), then "approved, implement C1".

**Produced:** `TrustBlock` ("Proč nám věřit", three items with the ids the header links to) and `Faq` ("Časté dotazy", four native `<details>` questions that work without JavaScript), placed after the preview. The FAQ answer about the American funds is chosen from the data by the new `originalsFacts` (how many brokers are verified as not selling them, the smaller count of VOO and QQQ). The header button now points at `#formular`. Tests first: 26 failed before; 443 unit/component and 81 e2e pass after.

**Mistakes and corrections**

- **The header button had pointed at `#gate` since the shell was built**, an anchor from the old gate design that no longer existed, and a test had pinned it. I found it only by reading the header while planning C1. Fixed, with the test.
- **Static sections still cost JavaScript.** The route grew from 146.7 to 147.3 KB although both sections are server-rendered. The cause is not the components: every client component imports `copy`, and `copy.ts` is one object, so each new string (FAQ answers, trust texts) ships to the browser even if only a server component uses it. Our code is now 14.8 KB and the route has 2.7 KB of room. The fix is to split `copy.ts` into one export per section so client bundles take only theirs. Not done in this PR; flagged to David.
- **Left on purpose:** no retention period in the e-mail answer (not decided, SPEC §19); the "Jak počítáme" list is inline and a separate page is later; "Nedostáváme provize" and the "zdarma" answer are statements about the project that David confirmed.

### Splitting the copy by section

**Prompt (summary):** "#52 landed, split copy.ts first", after I found that static sections still cost client JavaScript.

**Produced:** `src/content/copy.ts` now has one export per section (`shellCopy`, `heroCopy`, `trustBlockCopy`, `faqCopy`, `hiddenCostsCopy`, `emailPreviewCopy`, `leadFormCopy`, `calculatorCopy`) and a combined `copy` that only the copy checker and its tests use. Every component imports its own section. The route went from 147.3 KB to 145.3 KB and our code from 14.8 KB to 12.8 KB (room on the route: 4.7 KB). A small test fails if app code imports the whole `copy` again. Behaviour is unchanged: 444 unit/component and 81 e2e tests pass, `copy:check` reports the same 0 problems.

**Mistakes and corrections**

- **Not a mistake in this PR, but the cause of the problem:** I wrote `copy.ts` as one object and every client component imported all of it, which I did not check until C1 added a lot of text and the route grew although the sections were static. The JS budget test caught the effect, not the cause.
- No tests changed besides the new guard; this was a refactor covered by the existing tests, and I did not write the failing test first because there was no new behaviour to test. The guard test was written with the change, not before it.
- Limit: the split does not remove strings that a client component imports but never uses within its own section (for example `calculatorCopy` has a failure text that renders only on error). Splitting further would need a separate module per component.

### The phone menu and the sticky bar (C2a)

**Prompt (summary):** David's five yes answers to the C2 plan, then "approved, implement C2a".

**Produced:** `MobileMenu` (a "Menu" button and a full-height panel built on the browser's own modal `<dialog>`, so focus trap, Esc and the inert page come from the browser; JavaScript only opens and closes it), `StickyBar` (shown on phones once the hero button has scrolled out, hidden while the form is in view, hidden at the top so it cannot cover the hero button), `menuCopy` and `stickyBarCopy` sections, and an `id="hero-cta"` on the hero button's block. The footer has extra room at the bottom on phones. Tests first: 19 failed before; 467 unit/component and 90 e2e pass after. JS: ours 14.5 KB, route 147.0 KB (+1.7 KB for both pieces).

**Mistakes and corrections**

- **Two of my own approved e2e tests were wrong, not the component.** One looked for the sticky bar as "the last link named Poslat mi srovnání", which on the page is the preview section's visible button. The other scrolled to a spot where the form was already in view, where the bar hides on purpose. I measured the page (hero button ends at about 690 px, the form starts at about 1620 px) and used a scroll position of 900 px, and the first test now finds the bar by its own attribute.
- The menu's links to `/zasady`, `/zasady#cookies` and `/zasady#kdo-zpracovava` point at pages that arrive in C2b, so they 404 until then.
- Limit: without JavaScript a phone has no working menu button; the page is one scroll, so the header anchors are only a convenience.

**Follow-up on the menu (found by David after C2a):** the logo and the button jumped up by the height of the "Čísla ze stránek…" bar whenever the menu opened or closed, because the panel covered that bar. The drawing shows the menu without the bar, but the jump is worse than the difference from the drawing, so the panel now starts where the header starts (its top is set when it opens) and the bar stays visible. "Zavřít" also comes first in the panel, so the browser's first focus goes to it and not to the logo; the row is reversed in CSS, so the logo stays on the left. Two e2e tests were added first and failed (the logo and button stay in place; the panel starts below the bar).

- **My first version of the second test was wrong:** it checked "what is on top at the bar's centre", but a modal dialog's dimmed backdrop makes the browser report the dialog for every point outside the panel. It now compares positions.
- **My mistake behind the bug:** I built the panel from the drawing and only checked it opened; I never compared the header's position before and after. A screenshot pair, or a test of the logo's position, would have caught it in C2a.
- Limit: if the page is scrolled when the menu opens, the header is off-screen and the panel starts at the top of the screen, so the logo moves. The header is not sticky, so the menu button is only visible near the top of the page.

### The cost number ran under the form (found by David)

**Prompt (summary):** David sent a screenshot at about 1068 px: the big number "14 416 Kč" was cropped by the form card.

**Produced:** the number's font size is now `min(design size, 17 % of its own column)` (a container query unit), so it can never be wider than its column. Below 1100 px the form drops below the calculator (inputs and result stay side by side), since three columns on a tablet made the labels wrap and cut the e-mail placeholder. Test first: `e2e/number-fit.spec.ts` checks the number at 12 widths from 375 to 1920 px, at 3 000 Kč a month for 10 years and at 20 000 Kč for 20 years; 9 of 12 failed before, all 12 pass after. 467 unit/component and 104 e2e tests pass.

**Mistakes and corrections**

- **The number overflowed its column at every desktop width, not only 1068 px.** At 1280 px it ended exactly at the edge of the form, so it looked fine; my test showed it was already too wide there. I built the calculator at the design's 80 px size and checked it only at 1280 px and on a phone. I should have run a wider set of widths when I built the form as a third column.
- **My first wording of the fix cap was too small for long amounts:** I checked the cap with the default number and the largest one the slider can give (20 000 Kč, 20 years) before settling on 17 %.
- Not drawn: the tablet layout (768 to 1099 px); the form below the calculator is my choice, and the number is smaller than the 80 px design at 1280 px (about 70 px).

### A flaky e2e test that failed only in CI

**Prompt (summary):** David: "e2e test is failing in ci" (the test "the hero still fits with the longer b headline" got a null box for the button).

**Cause and fix:** the test, which I wrote for E1, swapped the h1's text right after the page loaded. In CI the page hydrates more slowly than on my laptop, so React had not finished: it saw a page that differed from its own, rebuilt it, put the original headline back and detached the button. I reproduced it by slowing the page's scripts (the old code failed, the h1 was reverted), then fixed the test to wait until the calculator's slider is hydrated, give React two animation frames, change the text, and check that the change stays before measuring. The same scenario now passes 5 of 5 under slow scripts, and the real spec passes 15 repeats in a row.

**Mistakes and corrections**

- **My test depended on timing and I did not see it, because it never failed locally.** I ran it once or twice on a fast machine, then wrote it down as passing. For a test that changes the DOM, a run under slowed scripts should have been part of writing it.
- Not found by `--repeat-each` on my machine (40 passes); only the slowed-scripts reproduction showed it.
- Other tests act right after loading a page, but they use Playwright's own waits, or they work without JavaScript, so they do not rely on hydration having finished.

### The footer links, the privacy page and the 404 (C2b)

**Prompt (summary):** David's five yes answers to the C2 plan, then "approved, implement C2b".

**Produced:** four footer links (Jak počítáme, Zásady zpracování, Cookies, Kontakt), the privacy page `/zasady` (the wireframe's own seven sections with seven `[doplnit]` markers, a contents list, noindex), a real 404 page, the form's legal line now linking to the policy, and a `base` prop on the header and the menu so they work on pages other than the landing page. Tests first: 18 failed before; 484 unit/component and 104 e2e pass after, including that the pages set no cookies at all.

**Mistakes and corrections**

- **My edit helper emptied `copy.ts`.** It opened the file for writing before computing the new text, so when one of my anchors did not match (the form's legal line had a different shape after the split), the file was left with 0 bytes. I restored it from git and fixed the helper to compute first. No work was lost because the file was committed.
- **The 404 page broke the JavaScript budget twice.** (1) I used `next/link` in it, and because the root 404 page ships inside every route, the whole site grew by about 11 KB (146.7 to 158.4 KB); a plain link fixes it. (2) The budget test measured "an empty page" using Next's own 404, which is no longer empty now that our 404 has the header and menu; it reported "ours 0.0 KB". The test now uses a fixed empty-page size of 132.5 KB (measured on 2026-10-11 with Next 16.4), to be measured again at the next Next upgrade. This changed an approved test.
- **Left as drawn, flagged for David:** section 7 of the policy says the cookie settings are reachable through the footer link, but until Phase 5 that link leads to the same section. The privacy text has not been reviewed by a qualified person (decision B7, note 0039). Today the pages set no cookies, which the policy relies on; a test checks it and will fail on purpose when Phase 5 adds consent.

### Trading 212 fees: the second priced broker

**Prompt (summary):** David: "we can move to the E", with Trading 212's Costs & Charges Disclosure PDF, its URL, and a screenshot of the Czech "Podmínky a poplatky" page.

**Produced:** Trading 212's fees for CSPX in `data/brokers.json`: conversion 0,15 % (USD and EUR), a purchase rule of 0 (commission free), custody 0, and the CSPX listing (London, USD). Sources and hashes of the PDF and the page screenshot are in each record, with quotes and page numbers. Trading 212 now has a price for CSPX: 2 476 Kč over 10 years at 3 000 Kč a month (fund fee 1 748 Kč, conversion about 729 Kč, checked with an independent month-by-month loop), against DEGIRO's 14 403 Kč. The spread is about 11 900 Kč, so the green saving box now shows on the page, and the hide rule for variant b is met on real data.

**Mistakes and corrections**

- **The PDF alone was not enough, and I said so.** Its "no fees on ETF trades" sits in an example's assumptions, and it never mentions korunas. David's screenshot of the Czech page closed both gaps (commission free, custody fee free, and an interest rate for CZK, so the account holds korunas and a dollar ETF costs one conversion). The copy of the screenshot I first received was shrunk too small to read; the original in `evidence/fees/` was readable after a crop.
- **Eight tests pinned "DEGIRO is the only priced broker" and had to change.** In the calculator tests the "one broker" and "no broker" fixtures now take the real data and restrict or empty its pricing; the calculator-data tests expect both brokers; one test now expects Trading 212 to be priced even without exchange rates (it charges nothing in a currency that needs one); the seed-data test's fixed "today" moved to 13 October; and the landing e2e test that said "no saving box with one broker" now says the box is shown. The assertions are the same strength, but they are changes to approved tests.
- **A real bug appeared only now:** the saving box's button text wraps to two lines on a narrow column and touched the box's edges, because I gave the button no vertical padding. It was built in the calculator PR and never seen with real data. Fixed with padding and line height.
- **Limits:** the model has no GBP, so Trading 212's other funds (for example VUSA on London in pounds) are not priced; only CSPX. The records are fee data and go stale after 45 days (about 27 November). The PDF has no date of its own, so `asOf` is the capture day (13 October, note 0024), and the web page URL is the clean path without the ad tracking parameters of the link David sent.

### XTB fees for CSPX (added to the Trading 212 PR)

**Prompt (summary):** David: "Could we add also fio and xtb before I land?", then the XTB fee PDF (dated 30 September 2026), the Czech "Podmínky a poplatky" page and a note on deposit conversion, saved in `evidence/fees/`.

**Produced:** XTB's fees for CSPX in `data/brokers.json`: conversion 0,5 % (USD and EUR), commission 0 (0 % up to EUR 100 000 a month), custody 0, and the CSPX listing (London, USD). XTB is priced at 4 176 Kč for the default setting (fund fee 1 748 Kč, conversion about 2 428 Kč), checked with an independent loop. The spread, the headline and the saving box are unchanged, because DEGIRO (14 403 Kč) and Trading 212 (2 476 Kč) are still the dearest and the cheapest.

**Mistakes and corrections**

- **David had already saved the files, and I asked him to.** I first answered that nothing from XTB was in the evidence folder and asked for the documents; I had looked before he saved them, and he told me to check again. I should have listed the folder again before replying.
- **Two simplifications in the XTB records, written into their evidence text and not hidden:** the 0,02 % custody fee applies only to the part of a portfolio above EUR 250 000 (our slider reaches that only at the very top, so custody is 0), and the EUR 10 monthly account fee is charged only after a year without a trade and 90 days without a deposit (never for a monthly saver). Also, "0 % commission" holds below EUR 100 000 of turnover a month on all of a client's accounts; a saver is far below it, but a reader with other trading on XTB is not covered.
- **The PDF warns that without a direct currency pair XTB converts through USD in two steps of 0,5 % each.** For a CZK account buying a dollar ETF the target is already USD, so it is one step; I assumed the account is in CZK (an earlier XTB screenshot shows 0.00 CZK). A euro listing from a CZK account might be two steps; no euro listing is priced for XTB.
- The records use the PDF's date (30 September) as `asOf`, not the day I captured the page, because the document is dated (note 0024). They go stale on 14 November, earlier than Trading 212's.

### Fio fees for CSPX (added to the same PR)

**Prompt (summary):** David sent Fio's two price-list PDFs, the "Obchodování v Německu" page (fee table from February 2026), the "Devizové konverze" page, and finally a screenshot of the e-Broker "Konverze deviz" screen from his demo account.

**Produced:** Fio's fees for CSPX in `data/brokers.json`: commission 3,95 EUR per order on XETRA (the tier for orders up to EUR 1 400, standard account), custody 0, conversion 2,766 % (euros received at Fio's selling rate 25,08480 against the reference rate), and the CSPX listing (XETRA, EUR). Fio is priced at 30 762 Kč for the default setting (fund fee 1 748, conversion about 13 434, commission about 15 581), checked with an independent loop. Fio is now the dearest broker, so the page's headline became 30 778 Kč ("nejvýš") and the saving box "až 28 302 Kč" (live exchange rate).

**Mistakes and corrections**

- **The first Fio files were not what I needed, and I said so instead of guessing.** The two PDFs were the bank's general price list and the exchange annex (Prague, Poland, the US); neither had the German exchange or the conversion. The next page had the commission and custody, and the conversion page said the rate is "the one in the e-Broker app", which the page itself did not show. I held back until David sent the e-Broker screen, because Fio's conversion rate changes the result by about 13 000 Kč and moves the page's headline.
- **My first estimate used the wrong direction of the percentage.** The page says the selling rate is 2,84 % above the reference rate; the euros the client receives are 1 - 1/1,0284442 = 2,766 % fewer, which is what the model's "fee" has to be. Using 2,84 % directly would have overstated Fio by about 700 Kč.
- **The page's claims got bigger overnight.** With Fio priced, "nejvýš X" jumped from 14 416 to 30 778 Kč and the saving box from 11 940 to 28 302 Kč. The numbers follow the documents, but they rest on four assumptions worth stating: orders are monthly and each pays 3,95 EUR (about 3,2 % of a 3 000 Kč deposit); the standard account, not the DIP account (1,98 EUR); the conversion happens at the small-volume selling rate, not the large-volume one (above USD 10 000); and the ticker SXR8 is the CSPX fund (the accepted inference).
- Fio's conversion percentage varies a little from day to day (the page shows 2,8 to 3,0 % across currencies); the record is the day it was captured, and fee records go stale after 45 days.

### A line about the commission in "Jak počítáme"

**Prompt (summary):** David, after Fio was priced: "add a line to the 'Jak počítáme' text explaining that the commission" (the request was cut off; I read it as: the commission is charged on every monthly purchase).

**Produced:** one sentence pair in the trust block: "Provizi brokera počítáme u každé měsíční investice zvlášť. Pevná částka za objednávku proto nejvíc zdraží malé měsíční vklady." It is general on purpose and names no broker, so it does not go stale when the data changes. Test first (it failed), then the copy; 485 unit/component and 116 e2e tests pass, JS unchanged.

**Mistakes and corrections**

- **The request arrived cut off, and I guessed its end.** I wrote what I took it to mean and said so; David should confirm the wording or tell me what the line was meant to say (for example, a specific line about Fio's 3,95 EUR per order, or about the conversion rate).
- **My text anchor missed once more** because the copy file had been re-indented by the earlier split; the first run did not change the file and I noticed only because the new test still failed. The same slip as in C2b: a script that edits by matching text should print how many places it changed.
- **The line is a fact about the model, not a claim about any broker:** the calculator charges the purchase fee on each monthly investment, one order a month (SPEC §21, METHODOLOGY-V2 §3).

### Variant b of the hero headline (E2)

**Prompt (summary):** David: "yes, start the E2 tests", then "approved, implement E2" (design rev. 5, decision note 0041).

**Produced:** `?v=b` now shows "U stejného fondu můžete zbytečně zaplatit až 28 302 Kč. Kde?" and, under the table, "Částka v nadpisu: 3 000 Kč měsíčně, 10 let, odhad bez českých daní a inflace." The amount is `heroSavingKc` (highest cost minus lowest among priced brokers at the starting setting) and is the same number the green saving box shows. `chooseHeroVariant` gives b only when b is asked for and the saving is above 0; everything else (`/`, `?v=a`, unknown values, no saving) gives a. `data-variant` says which headline was really shown. The starting setting (3 000 Kč, 10 years, 6 %) lives in one file shared by the calculator and the headline. Tests first: 20 failed before; 511 unit/component and 117 e2e pass after. JS unchanged (146.7 KB).

**Mistakes and corrections**

- **Two earlier tests contradicted the new rule and had to change.** An E1 component test rendered variant b with no amount and expected `data-variant="b"`; it now supplies an amount. An E1 e2e test said the muted line must end with "Jen cena a dostupnost, ne výnosy." on `?v=b`, where the setting sentence now follows; it now checks variant a. Both are changes to approved tests; the assertions are as strong as before.
- **The earlier plan for a dev-only preview of b was dropped:** with two or more priced brokers, b is served on the real page, so there was nothing to preview. I said so before writing the tests.
- **The stand-in hero-fit test (pasting the long headline into the h1) is removed.** It was the test that was flaky in CI (#57); the real `/?v=b` page now takes its place in the fit loop.
- **Something worth saying plainly:** the amount in the headline is 28 302 Kč only because Fio's 3,95 EUR per order and 2,77 % conversion make it the dearest broker. The headline is true to the data, and its size is a result of that one broker's fees, so it moves with every fee update (fee records go stale after 45 days). Not tested here: how it reads as an ad; the hypothesis test of note 0041 is still to be run.
- Not done: `track()` with `variant` on every event (Phase 5). Landing pages record the variant shown in `data-variant` for it.

### Lighthouse run and inlined CSS (D1)

**Prompt (summary):** David: "yes to all, start with D1" (Lighthouse on the production build against SPEC §22), then "yes" to using applied throttling for the LCP target and "yes" to keeping `inlineCss`.

**Produced:** Lighthouse (one-off via `pnpm dlx`, nothing added to the repo) on `/`, `/?v=b` and `/zasady`: performance 96-97, accessibility 100, CLS 0 everywhere. `experimental.inlineCss` in `next.config.ts` puts the ~9 KB of CSS in the HTML; applied LCP on `/` went from 1.90 s to about 0.8 s. SPEC §22 now says which Lighthouse mode the LCP target means.

**Mistakes and corrections**

- **The spec did not say which LCP it meant**, and the default simulated figure (~2.65 s, even on `/zasady`) can never meet 2.0 s. I noticed only after measuring; David chose applied throttling.
- **One applied run in three spiked to 2.7 s** on `/`; I did not find the cause. Playwright with the same throttling gave 350-400 ms in three of three runs, so I treat it as noise, not proven.
- **`/?v=b` and `/zasady` were measured with the default (simulated) mode only.**
- **I asked for a reason David had already given.** He said "yes" to keeping `inlineCss` after I had listed the performance gain; I treated that as no reason and waited. He pointed out the reason was the performance gain I had named. Note 0042 is written with it.

### Design review: the built site follows the drawings (rev. 6, PR 1)

**Prompt (summary):** David compared drawings and built page and listed what he likes better in the drawings: the header, the hero table (column "Poplatek*", the index as the row title with the description under it, no "nebo rovnou srovnání brokerů"), the green saving box, the "Za co platíte" cards and the logo in the footer. Then "Approved" after the tests.

**Produced:** header with a thin line and a 28 px logo; the table column "Poplatek*" with the footnote under the table; rows titled "S&P 500" / "Nasdaq 100" with "iShares CSPX, 500 největších firem" under them; the hero link removed; saving box with the label in capitals, a white heading and the amount in green; cards with the number on the left; the light logo in the footer. Decision note 0043 (David's reason: better readability while the description keeps more information). Tests first (10 failed); 517 unit/component and 123 e2e pass; JS unchanged (146.7 KB).

**Mistakes and corrections**

- **My comparison page was only half checked.** I sent David the side-by-side file after looking closely at two pairs; the review he did found the differences I had not listed (header, green box, cards, footer logo). I said which pairs I had not looked at, but I should have looked at all of them before sending.
- **I guessed that the green box had no label** from a crop that started below it; the label was already built, only its style (capitals, small mono) differed.
- **One approved e2e test broke:** `home.spec.ts` looked for "the" ETF Kompas logo, and the footer now has a second one. It is now limited to the banner; the assertion is as strong as before.
- **Removed an approved e2e test** ("the hero link lands on the form") together with the link. The form stays reachable from the saving box button and the sticky bar.
- **Open:** the footnote text "* Roční poplatek fondu, počítaný z vašich peněz ve fondu." is mine, for the copy review. SPEC §25 rule 3 and the glossary still say the plain description comes first (docs sync, D3). The design boards and PNGs are still the old ones (PR 2).

### The cost sentence says "může stát i" (added to PR 1 of rev. 6)

**Prompt (summary):** David wanted "Za 10 let vás fond (CSPX) u ověřených brokerů bude stát až 30 778 Kč" instead of "koupitelný fond … nejvýš"; I advised keeping "nejvýš" (it marks a ceiling, and "až" is the saving's word); he proposed "klidně" and said he did not like "nejvýš"; I advised against "klidně" (slang, can read as "easily") and proposed "může stát i"; he chose it.

**Produced:** the sentence in `copy.ts` is now "Za 10 let vás fond (CSPX) může u ověřených brokerů stát i X Kč. Z toho jde na:". Tests first (one failed), then the copy; note 0037 has an update line.

**Mistakes and corrections**

- **I argued for my own wording twice before accepting that the user's ear for his own audience decides copy.** The reason I gave (a ceiling must sound like one) still holds, but "může stát i" says the same thing in words he likes. Not wrong, only slower than it needed to be.
- **The "fund-only state does not say it" test now checks the new phrase,** so it is weaker in one way: it passed before the change too. It is kept for the case where the sentence leaks into the fund-only state.
- **SPEC §3 and METHODOLOGY-V2 still say "nejvýš"**: left for the docs sync (D3).

### Centred text in the saving box button (added to PR 1 of rev. 6)

**Prompt (summary):** David: "The button text should be centered" (screenshot of the box on a phone, label on two lines, left-aligned).

**Produced:** `justify-content: center` and `text-align: center` on the button; an e2e test first (it failed with `start`).

**Mistakes and corrections**

- **I missed it in my own review.** The button was left-aligned already in the drawing comparison I made and in the screenshot I read for this PR; I looked at the text, not at where it sat. The earlier fix in #58 (vertical padding for the wrapped label) did not centre it either. A button whose label can wrap needs its alignment tested, not only its height.

### Design update: the boards follow the review and the real data (rev. 6, PR 2)

**Prompt (summary):** David: "Also update the design with the data we have now", with the review of the drawings versus the built page; then "#62 landed, start PR 2". Earlier answer: update both design artifacts too.

**Produced:** `docs/design/wireframes/apply_rev6.py` (one step in the chain, `make_rev6.sh`) patches the boards: hero table with "Poplatek*", the footnote, the index as the row title with the description under it, no "nebo rovnou srovnání brokerů", real fees and types (CSPX, VUAA, CNDX, EQQQ; the old VUSA and CSNDX rows and the 0,33 % are gone), the calculator result from the real calculator (30 778 Kč, 1 748 + 13 434 + 15 596, value 456 642 Kč, saving 28 302 Kč), the sentence "může u ověřených brokerů stát i", the headline of variant b with 28 302 Kč, the comparison page with real broker prices and fees, the PDF page with the real availability, and the date "6. 2026". Design Study and Board texts updated (`build_study.py`, `mkboard.py`), `wireframe-b.md`, READMEs. 11 PNGs re-exported.

**Mistakes and corrections**

- **My first run wrote a headline with no-break spaces everywhere** (I replaced every space in "zaplatit až 28 302 Kč" with a no-break space, and "zbytečně" ended up alone on a line). Found by looking at the exported image; fixed to put them only inside the amount.
- **The headline of rev. 5 uses no-break spaces, and my text match failed on it** until I looked at the bytes. The script asserts one match per replacement, so it stopped instead of writing a half-changed board.
- **The Design Study and the Board still said the calculator counts CSPX in dollars and the CSNDX fee is "from memory" at 0,33 %.** Both statements were stale since the data work; I found them only because I searched the generator scripts for the old strings, not the boards. Fixed (the verified CNDX fee is 0,30 %).
- **The PNG export script needs Python Playwright and Pillow, which are not installed here.** I exported with Node (the repo's Playwright) and `sharp` (already in `node_modules`), outside the repo, and only copied the 11 images whose boards changed. The renderers differ slightly (the motion image is 118 px shorter), so the other 22 PNGs are not regenerated; `export_images.py` is unchanged.
- **Left as it was:** the card texts of "Za co platíte" and the FAQ in the boards still differ from the built copy (David said the built version is better there); the uppercase calculator label wraps with an orphan "STÁT I" on the phone board; "Česky" stays `[ověřit]` because the data has no verified value.
- **Republished the two Claude artifacts** (Design Study, now version 16; Wireframe Board, version 11) from the rebuilt files, as David asked. The Board still said "REV. 4" in its corner label although it had been at rev. 5 since the last PR: a stale label I found while republishing, fixed to "REV. 6". I republished before the PR was reviewed (the PR text said "after review"); if review changes the boards they need publishing again.
- **The "Co se změnilo" note on the Board overflowed into the "Landing page" heading** after I added the rev. 6 line (1089 px tall against 890 px of room). David noticed it on the live artifact; I had checked the exported PNGs, not the Board canvas, where the notes have fixed positions. Fixed by widening the note to 1000 px and moving the four notes to its right by 340 px; I measured every note afterwards (all end above 890 px). A check that boards still fit belongs after any text added to a fixed-position note.

### The amount in the variant b headline is red (added to PR 2 of rev. 6)

**Prompt (summary):** David: "I would use red for the number here. Maybe some shade of what we have in calc, but working on light background. What do you think?"; I proposed the existing `cost-strong` (#c23a1b); he said "yes, go ahead, put it on #63".

**Produced:** the b headline in `copy.ts` is split into the text before and after the amount; `HeroB` renders the amount in its own `<span>` in `--color-cost-strong` (4.8:1 on the paper background; the pair is already in `contrast-pairs.ts`). Tests first (one component test failed, one e2e test for the colours); 518 unit/component and 125 e2e pass, JS unchanged. The two b boards and their PNGs show the red amount; both Claude artifacts republished.

**Mistakes and corrections**

- None found in the change itself. Not checked: how the red amount reads in an actual ad, and whether the red suggests a warning more than David intends (I said it fits "zbytečně zaplatit", but that is my reading, not a test).

### Docs sync: SPEC, METHODOLOGY-V2 and PHASES (D3)

**Prompt (summary):** David: "start D3" (the plan he approved: sync SPEC §7, §20 and §22 and PHASES.md with what was built and decided, and list the decision notes that are still missing).

**Produced:** SPEC status line (draft v4, rev. 6, notes up to 0043); §3.1 cost sentence ("může u ověřených brokerů stát i", note 0037); §7 (rev. 6, "brokerů" in the top bar, "Poplatek*", row title rule of note 0043, no second link under the button); §20 and §22 (rev. 4 references); §25 (glossary "cizí měnu", the table-row rule of note 0043, the two headlines of note 0041); METHODOLOGY-V2 (headline wording, row label "převod korun na cizí měnu"); PHASES.md (a status block and the wireframe revision). Only things that were already built or decided; no new decision.

**Mistakes and corrections**

- **My first scripted edit stopped half way** (one text anchor did not match: the spec says "A dark top bar", I had written "a dark"). The first three replacements were already written; I looked at the diff before running the rest and did not re-run the first ones. The usual lesson, again: scripts that edit by matching text should report what they changed.
- **Not changed, on purpose:** the spec's schedule (§20). The Tuesday target of the lead flow was missed (it needs David's accounts); moving Phases 4 to 6 is a plan change for David to decide, so PHASES.md only states the status.
- **Left as they are:** the "original starting set" of microcopy in §25 (old CTA, old table columns), which is marked as original and is not the source any more.
- **Decision notes still missing** are listed in the PR description and in the chat, because each needs David's reason.

### Decision notes 0044 to 0050

**Prompt (summary):** David answered my list of missing notes with a reason for six of them and "draft a reason" for two (Fio data, Trading 212 and XTB data); for the A/B assignment question he wrote "not sure what you are asking".

**Produced:** notes 0044 (design review), 0045 (red amount), 0046 ("cizí měnu"), 0049 (native dialog and details) and 0050 (sticky bar) with David's reasons in his words. Notes 0047 (Fio) and 0048 (Trading 212 and XTB) have status `proposed` and say in a line at the top that the reason is drafted by the agent from the evidence in the records, for David to confirm. No note on the A/B assignment yet.

**Mistakes and corrections**

- **My list said the sticky bar "appears after the first scroll", copying SPEC §7.** The component shows it when the hero button is out of view and hides it again while the form is in view; I read `StickyBar.tsx` before writing note 0050 and corrected the title and text. David's reason stands as he gave it.
- **The staleness date I first wrote for Trading 212 was a day off** (28 November instead of 27 November): 45 days from 13 October. Recomputed.
- **Not invented, but close:** the "alternatives considered" of 0047 and 0048. 0047 says the agent rejected estimating the commission (that is what happened); 0048 says "Not recorded". Both reasons are labelled as agent-drafted.

### README: how the A/B test would be run (designed, not run)

**Prompt (summary):** David asked whether fix 1 (Meta's own A/B test) can be tested for free; I said I could not verify Meta's pricing or screens and that a real test needs ad spend; he said "put it in the README as designed, not run".

**Produced:** a README subsection under the three hypotheses: status (nothing spent, not run), the two URLs and `data-variant`, who splits the traffic, the UTM links, the option not chosen (fix 2) and what would be needed first.

**Mistakes and corrections**

- **Meta's tool is described from my understanding, not from its documentation or screens.** The README says so in the text, and the fee of the tool itself is not claimed. This should be checked when the first ad is set up.
- **No decision note** on the assignment method yet: David chose fix 1 but gave no reason, so none is written.

### "Zdarma, bez registrace" under the hero button

**Prompt (summary):** David asked for the line before the 5-second test (agreed in the D plan); I mocked up two placements (under the button, inside the button) and a desktop view; he chose "Option A, write the tests", then "approved, implement it".

**Produced:** `heroCopy.ctaNote` rendered as a muted, centred line under the hero button (left-aligned on desktop); the boards and four PNGs show it; `wireframe-b.md` notes it. Tests first (3 component tests failed, 5 e2e tests failed); 521 unit/component and 127 e2e pass, JS unchanged (146.7 KB).

**Mistakes and corrections**

- **The mockup used 13 px, which is not a type token.** The project allows only tokens, so the built line is 14 px (`--font-size-sm`), one pixel larger than the version David approved visually; the e2e test was changed from 13 to 14 px before the implementation and the boards say 14 px. Said in the PR text.
- **The first mockup crop cut off the line** in option A (my crop ended at the artboard's sticky bar); I rendered it again with a taller viewport before sending, but the first image I looked at was wrong and I should have checked the crop before sending the first time.
- **Not tested:** whether the line helps the 5-second test; that is the point of the test.

Note 0051 ("Zdarma, bez registrace") was added to PR 67 with David's reason in his words ("more converting"); the one-sentence reason is thin, so the note says that conversion is a hope, not a measurement, and flags the "bez registrace" against "an e-mail is needed" wording for the copy review.

### Data: IBKR availability of the five funds

**Prompt (summary):** David got access to Interactive Brokers and sent a quote screenshot of CSPX, then the search popup; he saved the quote page as `ibkr-cspx-search-2026-10-13.png` and said the date is the file name's, the account is his own, and search shows only the single LSE line.

**Produced:** `availability.cspx` of IBKR (`true`, source `https://www.interactivebrokers.com`, SHA-256 of the saved file, the quoted page text) and one entry in `sources.json`. IBKR now counts as a seller of CSPX, so the hero line names five brokers. IBKR is still not priced: commission, conversion and account fees are missing, and so is the CSPX listing record (it lives with the fees).

**Mistakes and corrections**

- **My first record failed the validator** (the source URL was not in `sources.json`). The draft check caught it before commit; I added the source entry.
- **Two screenshots arrived in the chat but only one was saved to disk** (the quote page, not the search popup). The record says what the popup showed from David's description, and the evidence hash covers only the quote page. The search popup should be saved too if it is meant as evidence.
- **The screenshot does not show which IBKR entity the account belongs to**; David said it is his own account. The record says the screenshot does not show it.
- **Side effect I did not expect:** the hero line now names five brokers ("CSPX: DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212, XTB") and the sentence "U ostatních fondů a brokerů ověřujeme." disappeared, because the rule says every broker is now verified for CSPX. The line is longer, which is the opposite of what David wants; it is the next change.

**Update (same PR):** David saved searches for SXR8, SXRV, VUAA, VUSA, CNDX and EQQQ; the availability of all five funds is now recorded, each with the SHA-256 of its search screenshot.

- **A saved file was overwritten.** David saved the CSPX search popup under the name `ibkr-cspx-search-2026-10-13.png`, which replaced the quote page I had hashed (`8cc233d6...`); my first record in this PR then pointed to a file that no longer existed in the evidence folder. I found it when I listed the folder before writing the new records. The chat copy of the quote page (`images/36.png`) has exactly the same SHA-256, so I copied it into the evidence folder as `ibkr-cspx-quote-2026-10-13.png` and cite both files. Lesson for the evidence folder: one name per file, and I should hash a file right when it arrives.
- **The searches show the exchange but no currency** and no ISIN. The records say so; the identity of VUAA, VUSA, CNDX and EQQQ rests on the ticker and the abbreviated name ("VANG S&P500 USDA", "VANG S&P500 USDD", "INVESCO NASDAQ-100 DIST"), as it did for Fio. The euro listing of CSPX (SXR8 on IBIS2) is therefore not recorded as a listing yet: I need its quote page with a price in euro.
- VOO and QQQ at IBKR are not searched yet.

**Update 2 (same PR): VOO at IBKR.** David saved the quote pages of VOO and QQQ and the notice of the VOO page (`ibkr-notice.png`). The notice says a "Retail" client under MiFID cannot trade the product because it has no KID in an approved language, so `availability.voo` of IBKR is `false`, with the search, the quote page and the notice cited together (three SHA-256).

- **I read the red "NT" badge and the "Notice" button as a restriction before I could read the text** and said so as "my reading, not verified"; I wrote no record until the notice text was in the file. The text confirmed the reading for VOO.
- **QQQ is not recorded.** Its quote page has the same badge and button, but the notice text of QQQ is not in a file (the notice file shows only the VOO page). I did not infer QQQ from VOO. The FAQ count "U 3 z 5 brokerů" needs both VOO and QQQ to be `false`, so it does not change yet.
- **The notice file has no date or fund in its name** (`ibkr-notice.png`); the record names it as the VOO notice. A name with date and fund would be clearer.

**Update 3 (same PR): QQQ at IBKR.** David saved the QQQ notice (`ibkr-qqq-notice.png`): the same text as for VOO (a retail client under MiFID cannot trade a product with no KID in an approved language). `availability.qqq` of IBKR is `false`, citing the search, the quote page and the notice. The FAQ now says "U 4 z 5 brokerů".

- **An approved test changed with the data:** `landing-data.test.ts` expected 3 brokers verified as not selling VOO and QQQ; it now expects 4 and names IBKR in the comment. The assertion is as strong as before. The same kind of change as in #58 (a test that counts data).
- **David renamed the VOO notice file** (`ibkr-notice.png` to `ibkr-voo-notice.png`; the SHA-256 is the same). My first VOO record named the old file, so I corrected the name in the record. Renaming evidence after it is cited is the same trap as the overwritten CSPX file; the hash stays the proof, and I check the folder before every record.

**Update 4 (same PR): IBKR is priced.** David chose the Fixed plan and gave the URLs of the commission, currency and account pages; the files are the full-page screenshots in `evidence/fees` and the SXR8 quote page. The records: commission 0,05 % with a minimum of EUR 3.00 (Germany table, IB SmartRouting Fixed) for the IBIS2 listing and USD 4.00 for the LSE listing, custody 0 (the FAQ sentence), conversion 0,03 % (the auto-conversion footnote), and two CSPX listings (LSE in USD, IBIS2 in EUR). Tests first (3 failed): the list of brokers with fees, the euro listing being picked with the 3 EUR minimum, and the custody statement.

**Mistakes and corrections**

- **My first test assumed the broker part is just the sum of the fees** (120 orders of 3 EUR = 8 771 Kč); the calculator's broker part also contains the return lost on the money paid in fees, so it was 11 833 Kč. I rewrote the test to compare with Fio's flat 3,95 EUR on the same euro rate (a ratio of 3 to 3,95) and to check that it is above the plain sum. The assertion is stronger than a guessed number.
- **The conversion rate rests on a footnote with soft words** ("typically", "at its discretion") and on the account being able to convert automatically. The pages do not show whether David's account can hold CZK or which base currency it has; I wrote this into the record and asked David. IBKR's manual currency order (0.20 basis points, minimum USD 2.00) is not used.
- **The IBIS2 exchange is taken to be covered by the Germany table**, because the search shows the German flag; the commission page does not name IBIS2. The record says so.
- **"Custody" is taken from a general FAQ sentence**, not from a table; third-party custody fees are not priced and the record says so.
- **The venue of the LSE listing is named "LSE"**, as at Trading 212 and XTB, while IBKR shows "LSEETF".

### A short line under the hero table

**Prompt (summary):** David did not like the long grey line under the hero table ("5 známých brokerů" instead, details lower or under an asterisk); I made two options for phone and desktop; he chose A for desktop and B for phone, but without the wall of text and with only one asterisk; I showed the revision and he said the note below the fold was fine ("additional info, not the claim itself"); then "approved, implement it".

**Produced:** the line is now "CSPX: 5 známých brokerů · ověřeno k 6. 2026" (Czech plural, from the data). On wide screens it goes on with "jen cena a dostupnost, ne výnosy", and in variant b a second line gives the setting of the amount. On a phone a note after the callout says "Brokeři: DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212, XTB. Jen cena a dostupnost, ne výnosy." (plus the setting in b). The sentences about the American funds and "U ostatních fondů a brokerů ověřujeme" are gone (the callout explains the funds). The boards, four PNGs, the text spec and the Design Study show the same. Tests first (6 component and 4 e2e failed); 524 unit/component and 129 e2e pass.

**Mistakes and corrections**

- **I kept "CSPX:" in front of "5 známých brokerů"**, which David's wording did not have: only CSPX is priced at all five brokers, and "5 známých brokerů" next to a table of four funds could be read as five for each of them. I said so before implementing and offered to drop it; he approved the implementation without objecting.
- **Dead code removed:** `othersUnverified` of the hero note was no longer used by any copy; I removed the field and the two tests that only checked it (the assertions were about that field alone).
- **The JS grew by 0.7 KB** (146.7 to 147.4 KB, 150 KB budget): the new strings and the second block of markup. Not reduced; the margin is now 2.6 KB.
- **Board and built page differ in one detail:** the board's phone line is left-aligned like the built page, but the draft David approved showed it centred. I followed the built footnote above it.
- **The amount in the headline on the live page is now 28 293 Kč**, not 28 302 Kč (the daily ČNB rate changed); the boards show the amount of 2026-10-12 and the design study says the numbers are from that data.

### 5-second test (one person) and a more visible "Zdarma, bez registrace"

**Prompt (summary):** David ran the reduced 5-second test with one person (his partner, not named) and sent her answers; I read them, showed a mockup of four versions of the line, he chose option B, I wrote the test first and he approved ("approved, implement it").

**Produced:** the line "Zdarma, bez registrace" is now 16 px semibold in ink (it was a muted 14 px caption). Boards, four PNGs and `wireframe-b.md` show the same; note 0051 says so; new note 0052 records the test: what she understood (what she gets), what she did not (that it is free), and that n=1 is a pilot that does not meet SPEC §22 (2 of 3). Tests first (2 e2e failed); 524 unit/component and 129 e2e pass; JS unchanged at 147.4 KB.

**Mistakes and corrections**

- **The line I added a few hours earlier was too quiet, and I did not test that it would be seen.** My own test only checked that it existed, was muted, and fit the screen; the first person who looked did not notice it. I changed that approved test (14 px muted to 16 px semibold ink), which is the point of the test. Lesson: "present and in the right place" is not "noticed"; the 5-second test is where that shows.
- **I wrote her answers into a note word for word, in Czech, with no name**, as David wished; the note says who she is only as "David's partner, who does not invest".
- **Not tested:** whether the new line is noticed. The pilot needs a second round with the new hero.

Notes 0047 (Fio data) and 0048 (Trading 212 and XTB data) are now `accepted`: David confirmed the reasons I had drafted from the evidence in the records, without changes (2026-10-13). The reasons are still the agent's wording; the note line says so.

### Closing Phase 3

**Prompt (summary):** David: the copy review was done on the go and there will be one final check before it goes live, "take it as checked"; notes 0047 and 0048 were confirmed. I wrote the closing PR: PHASES.md status and the README's known gaps.

**Produced:** PHASES.md says Phase 3 is done with three caveats (the one-person 5-second test, the copy reviewed on the go, the A/B test not run); the README has a "Known gaps" section.

**Mistakes and corrections**

- **I did not write that the copy was "reviewed" in the plain sense.** David's words were that he changed things while building and will check once more before going live; PHASES.md and the README say exactly that, and the legal text as unreviewed by a lawyer.
- **I listed a phone menu defect that does not exist.** I "reproduced" it by scrolling the page to 1 200 px and clicking the Menu button with Playwright, and the page ended at 0. But the header is not sticky, so at 1 200 px the button is off screen, and Playwright's click scrolls the element into view first: the jump was the test tool, not the page. A person cannot tap the button there. David noticed none of it; I found it when I started the fix and measured with real mouse clicks at the button's position (scroll 0, 20 and 40 px): the scroll position is kept, before and after closing. I removed the bullet from the README and told David. The lesson: a reproduction must use the input a user has; "the tool did something" is not "the page does something".
- **`pnpm data:validate` (strict) fails with 56 `TODO_VERIFY` values.** It is the Phase 6 deploy gate and was always meant to fail until the data is complete, but it is a number David should see now: the deploy needs those fields filled or removed.

### Phone menu: a guard test instead of a fix

**Prompt (summary):** David: "Well let's do it now" (fix the phone menu bug I had listed).

**Produced:** no fix, because there is no bug. One new e2e test: opening and closing the menu keeps the scroll position (the page is scrolled 20 px and the button is clicked at its coordinates, not by element). It passes.

**Mistakes and corrections**

- **The bug I reported does not exist** (details in the entry "Closing Phase 3" above). I found out when I started on a fix and asked why the scroll reset: Playwright's element click scrolls the button into view first, and the header is not sticky, so the page can never be 1 200 px down with the button in reach. The known-gaps bullet is removed in PR 72.
- **The test is a guard, not a regression test:** it passed before and after because nothing changed in the code. I wrote it so that the next change to the menu cannot break the scroll without notice, and so that the test does not hide the problem again: it clicks by position.
- **A small real thing I noticed on the way:** when the header is scrolled partly out of view (about 40 px), the panel starts at the top of the screen, so the logo and the Menu button in the panel are a few pixels away from where they were in the header. It is the clamp in `show()`; not a jump of the page, and not changed.

### Phase 4 start: env names and the first migration

**Prompt (summary):** David: Phase 4 checklist; then Supabase (EU, Ireland) and Resend accounts are ready, the sending domain exists, "start on `.env.example` and the migration draft on a branch".

**Produced:** `.env.example` (names only) and `supabase/migrations/0001_lead_flow.sql` (`leads`, `result_tokens`, `rate_limits`, RLS on with no policies, an atomic `rate_limit_hit` function). Not run against any database yet.

**Mistakes and corrections**

- None yet. Open: the folder `supabase/migrations/` is not in SPEC §13; I used the Supabase convention and am asking David (a decision note needs his reason). `events` is left for Phase 5.

### Phase 4 plan and test cases

**Prompt (summary):** David: "#74 landed, proceed to phase 4 plan and test cases".

**Produced:** `docs/PHASE-4-PLAN.md`: five PRs, eight decisions, about 40 test cases. David approved all eight decisions as proposed and answered the open questions (404 for expired tokens, `delete-lead.ts` in Phase 6; for a deleted lead who resubmits he asked for my suggestion, which is now S-7).

**Mistakes and corrections**

- **My first commit left out this entry and the P-2 wording**: a `sed -i` that works on Linux failed on macOS and the `&&` chain after it was skipped, while the commit below it ran. Fixed in a second commit.
- S-7 and the 404 choice are my suggestions that David accepted without giving reasons, so they are not decision notes yet.

### Phase 4, PR 1: store leads

**Prompt (summary):** David approved the test cases ("Approved"); I implemented them.

**Produced:** the lead rules in `src/server/leads.ts` (honeypot, time check, IP and e-mail limits, idempotency, tokens, reset of a deleted lead), a memory and a Supabase adapter (plain `fetch`), `src/config/env.ts`, `POST /api/lead` (429 with `Retry-After`), the form's new fields (calculator setting through `form="lead-form"`, honeypot, time, campaign fields), a test-only `/api/test-leads` route (404 unless `LEAD_STORE=memory`), unit, component and e2e tests. The approved tests passed unchanged on the first run; the extra tests for the adapter, env, form and e2e are mine.

**Mistakes and corrections**

- **My own time check dropped real leads silently.** The plan measured the time "since the form appeared". The first e2e run showed every fast submit turned into a fake success: it would also catch a visitor who jumps to the form from the sticky bar and lets the browser autofill it. Changed to the time since the page loaded (`performance.now()`), and `docs/PHASE-4-PLAN.md` says why. A test type-ahead is still faster than 2 s, so e2e lowers the limit with `LEAD_MIN_FILL_MS=0` (memory store only).
- **A guard I wrote in the plan could not work.** "The memory store refuses `NODE_ENV=production`" fails in CI, which runs the e2e on a production build. The guard is now `VERCEL` being set (tested).
- **The test route was frozen at build time.** With `cacheComponents` a `GET` without request data is prerendered, so the production-build e2e saw an empty store while the dev run passed. Fixed with `connection()`. The lesson is the same as before: the dev server passing is not the production build passing; I ran `CI=1 pnpm test:e2e`.
- **The success text is deliberately small** ("Hotovo. Váš e-mail jsme uložili."): the link to the comparison is returned by the server but not shown, because the results page does not exist yet (PR 2).
- **Verified later by David (2026-10-14):** I tested the Supabase adapter only against a stubbed `fetch`; David sent one lead through the real project and checked the three tables. The request shapes (PostgREST upsert, the `rate_limit_hit` rpc, the `apikey` header for the new secret keys) worked as written.
- `pnpm test:e2e` JS budget: 148.0 KB of 150 KB (was 147.4 KB).

### Phase 4, PR 2: results page

**Prompt (summary):** David: "Tests are fine, proceed", with answers on five deviations (resend form moves to PR 4, full broker names also in the design, no brand prefix on fund rows, test route to expire tokens, fund picker needs JavaScript).

**Produced:** `resolveResults` (token to lead), `comparison()` (five funds x five brokers from the calculator's own pricing), the route `/srovnani/[token]` with `noindex` and `Cache-Control: private, no-store` set in `next.config.ts`, the components `ResultsPage`, `BrokerPicker` and `ResultsGone`, the "Otevřít srovnání" link in the success state, `POST /api/test-leads` to expire tokens in e2e. The approved tests passed on the first run; I changed two things in the e2e file (below).

**Mistakes and corrections**

- **David approved "404 for an unknown link", and I could not deliver it.** With `cacheComponents` the page is prerendered as a static shell and streams the rest, so the status is already 200 when `notFound()` runs; a real 404 needs a Proxy that repeats the lookup. I found out from the first e2e run, not from reading the docs before promising it in the plan. The goal behind the approval (out of caches and search) is met by the headers and the same page for every reason; the plan and the e2e file say 200 now. Not hidden in a test: David is told in the PR.
- **Two e2e assertions were my own errors.** (1) "the calculator's headline" was read with `getByText(/Kč/).first()`, which is the slider value, so it would have passed for the wrong reason; now the `status` element is read. (2) The test expected an `[ověřit]` broker in the CSPX table, but all five brokers are now priced for CSPX. The `[ověřit]` rule is covered by a component test with hand-made data and a unit test that removes one broker's fees.
- **`new Date()` in a prerendered shell broke the production build** (not the dev server): fixed with `connection()` before the lookup. The same lesson as in PR 1: run `CI=1 pnpm test:e2e`.
- **Two layout defects I only saw in a screenshot:** the big number in the dark strip was invisible on desktop (it measures its own column and collapsed to 0 width, and it needs `data-tone="dark"` for its colour), and "Koupíte?" ran into the next header on a phone (column widths). Unit tests could not have caught either.
- **Not built:** section 3 of the drawing ("Kde fond koupit", the purchase-fee table) and the contents "Na stránce" as a sticky desktop list is only a plain list; the tax cards show the drawing's own `[Text se doplní podle ověřeného podkladu]` placeholders. The page numbers the sections 1 to 3 instead of 1 to 4. These are gaps, listed in the PR.
- JS budget: 148.9 KB of 150 KB (it was 148.0): about 1 KB left.

**After review (David, 2026-10-14):**

- **No space between header and content or content and footer on desktop.** I used `var(--space-20)`, a token that does not exist (the scale ends at `--space-16`), so the whole `padding-block` declaration was invalid at `md` and `lg` and the padding was 0. My screenshot of the phone looked fine and I did not compare the desktop edges. The same invalid token was already in `NotFound.module.scss`; fixed there too. Lesson: a custom property that is not defined fails silently, so a new spacing value must be looked up in `variables.scss`.
- **"Redraw it" (broker names in the design):** I changed the sources (`apply_rev6.py` renames Fio to Fio e-Broker and IBKR to Interactive Brokers in the three artboards, `build_study.py`, and the two HTML documents rebuilt with `make_rev6.sh`; the diff is only those names). I did **not** re-export the PNGs: `export_images.py` needs IBM Plex installed locally, and without it the line breaks change, so three new PNGs would not match the other 30. David needs to run the export on his machine. The private claude.ai artifacts were not touched.
- The design boards still show data from before the latest verification (for example IBKR "[ověřit]" and 14 416 Kč for DEGIRO, where the page now shows IBKR priced and 14 408 Kč). I left that: it is a different change.

### Data: listings of VUAA, VUSA, CNDX and EQQQ

**Prompt (summary):** David asked why the other funds are empty on the comparison page, pointed to `~/Downloads/evidence/brokers`, and said "Fill the data now". I read the screenshots, gave him a table of what I would write and what I would leave empty, he confirmed four judgement calls, then I wrote the records.

**Produced:** 21 listing records in `data/brokers.json` (DEGIRO 7, Fio 4, Trading 212 5, XTB 5; I first wrote "28" in this entry from memory and counted 21 in the diff), each with the SHA-256 of the screenshot, its file name and what I read. `pnpm data:validate:draft`: 0 errors. Prices now appear for VUAA, VUSA, CNDX and EQQQ at DEGIRO, Fio, Trading 212 and XTB where the data allows.

**Mistakes and corrections**

- **I said at first the data was missing, and it was not.** I looked only in the repo, where the evidence is not committed (the repo is public and third-party files do not belong in it), and told David the cells needed verification. He knew where the files were. Lesson: before saying "this needs data", ask where the evidence folder is.
- **What I could not record, and said so instead of guessing:** Trading 212 VUSA (only a GBP listing on LSE: the model knows CZK, EUR and USD), the GBP and GBX listings elsewhere, and all four Interactive Brokers cells (the searches show the exchange but no currency, as David's own availability notes say; quote pages with a price are needed).
- **Judgement calls David confirmed, 2026-10-14:** XTB `.DE` is recorded as venue XETRA and `.UK` as LSE (the search shows only the suffix); DEGIRO EQQQ gets all six listings in EUR or USD; Trading 212 EQQQ only MIL and SIX; the EQQQ and VUSA ISINs rely on the ticker and the Dist class matching the DEGIRO screenshot, written into the evidence text.
- **Suggested decision note (needs David's reason):** the data model has no GBP or GBX, so a listing in pounds cannot be recorded and the cheapest real listing may be missing from the price.

**Second round (same PR, 2026-10-14):** David saved new Interactive Brokers quote pages (with a price and its currency) and a Trading 212 VUSA page in Amsterdam, and approved six more records: IBKR VUAA (LSE in USD, BVME.ETF in EUR), IBKR CNDX (LSE in USD), IBKR EQQQ (EBS in USD, BVME.ETF in EUR) and Trading 212 VUSA (AMS in EUR). That makes 27 records in the PR.

- **A capture was mislabelled, and I caught it by reading it, not from its name:** `ibkr-vusa-detail-usd-2026-10-14.png` shows VUAA on LSEETF, not VUSA. It was not used for VUSA. IBKR VUSA stays unpriced: the two real VUSA captures are in GBP (LSEETF) and CHF (EBS), which the model cannot hold. The Amsterdam (AEB) page is still missing.
- **IBKR prices that appear:** VUAA and CNDX, because their LSE listings in USD match the existing LSE commission rule. The BVME.ETF and EBS listings are recorded as facts but not priced: IBKR has purchase rules only for the venues IBIS2 and LSE. David decided to leave the Italy rule out for now ("is it critical? could we omit it?"; it is not: IBKR EQQQ stays unpriced). The Swiss commission is in CHF, which the model cannot hold either.
- **My reading of a full-page screenshot went wrong once:** I cropped `ibkr-fees-commision.png` to find Italy and first landed on Norway, Poland and Portugal, then on the Netherlands table (the table above "Netherlands - Fees" belongs to the Netherlands, not to Italy). I stopped there instead of guessing a rule from the wrong country.
- **I committed and pushed with a failing test.** The new records have `asOf` 2026-10-14, and `validate.test.ts` checks the seed data on a fixed day (`SEED_TODAY`, "the day the latest values were verified") that was still 2026-10-13, so the validator saw dates in the future. I had run `pnpm check` and `pnpm format:check` in one command with the commit after them, filtered the output with `grep`, and the commit ran anyway because nothing in the chain stopped it. Fixed by moving `SEED_TODAY` to 2026-10-14, which is what its own comment says it should be. Lesson: do not put `git commit` in the same command as a check whose result I have not read.

**Third round (same PR, 2026-10-14):** David saved the Amsterdam quote page for IBKR VUSA (EUR) and told me to continue with the Italy rule. Added: IBKR VUSA on AEB in EUR (132.280), and two IBKR purchase rules, BVME.ETF (Italy table) and AEB (Netherlands table, tab EUR Denominated), both Fixed - IB SmartRouting, 0.05 %, minimum EUR 3.00, read from the same `ibkr-fees-commision.png` as the Germany rule. IBKR now has a price for VUAA (13 727, through the Milan listing), VUSA (13 727) and EQQQ (19 282).

- **I read the wrong country first and wrote nothing from it.** Cropping the 17 560 px full-page capture by guessed offsets, I landed on Norway, Poland and Portugal, then on the table above "Netherlands - Fees", which I took for Italy. The heading is above its table: that block was the Netherlands. I cropped again, saw "ITALY" and "NETHERLANDS" as headings, and only then wrote the two rules. Same lesson as before: read the heading in the crop before using the numbers under it.
- **Judgement calls in the evidence text, as for IBIS2:** the venue BVME.ETF is taken to be covered by the Italy table and AEB by the Netherlands table (the quote pages show the Italian and Dutch flags). Not verified: whether David's account entity gets the same plan.

**Fourth round (same PR, 2026-10-14): Czech-language support.** David gave the five answers (IBKR no; Trading 212, XTB, DEGIRO, Fio yes) and said to stay with "Czech language" as the meaning of `czSupport`: the interface the visitor uses is available in Czech. I asked for the evidence instead of writing his answers down; he saved language screenshots (`evidence/language/`). Five `czSupport` records written.

- **What counts as evidence, and what does not:** DEGIRO, Fio and XTB are shown in Czech in screenshots he had already saved (the Czech UI strings are quoted in each record). Trading 212: the app's Settings screen ("Jazyk: Česky") and the Czech terms page. IBKR "no": two captures of the portal's language menu, which together list 15 languages without Czech.
- **I wrote the IBKR absence carefully:** two overlapping captures of a scrolled list are not the whole list. The record says the second capture ends the list and that the absence is read from these captures. If IBKR adds Czech, the value is stale after 120 days, as for every other value.
- **The page does not use `czSupport` yet** (the "Kde fond koupit" table with the "Česky" column is not built), so no visitor-facing number changed. `pnpm data:validate:draft` warnings went from 56 to 51.

### Data gaps checker brought up to date

**Prompt (summary):** David: "Yes update the gaps before pdf" (after I said `pnpm data:gaps` still counted listings and purchase rules as missing).

**Produced:** `needs.ts` and `gaps.ts` check the calculator's current model (a purchase rule and a custody fee per broker, a conversion fee for each currency of the broker's verified listings, a verified listing for every pair verified as sold, and that the calculator's own pricing code can price every such pair) instead of the version 1 broker fields and the two "planned" needs. New tests in `gaps.test.ts`; `DATA-NEEDS.md` has the status of 2026-10-14. The output now says 138 of 138 verified.

**Mistakes and corrections**

- **"138 of 138" reads like "done", and it is not.** The checker answers what the rev. 4 screens need, and says nothing about the strict validation (`pnpm data:validate`, the Phase 6 gate), which still fails on 51 `TODO_VERIFY` values in fields no screen uses. I added a line to the output and a section in `DATA-NEEDS.md` so the number is not read as readiness for deploy.
- **First draft of that section said VOO and QQQ were open at Fio and IBKR; only Fio is.** IBKR's `false` was verified earlier. Found by running `node` over the file before committing, not by trusting my memory of the table.
- **`gaps.ts` now imports the calculator's `priceBroker`** so that "can be priced" is the calculator's own answer and cannot drift from it. The rates in the check are placeholders (only the existence of a price matters).
