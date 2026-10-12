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
