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
