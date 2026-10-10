# AI log

How the AI agent (Claude Code) was used, what it produced, and where it was wrong. Updated as the work happens, in the same PR as the change. The README section "How I worked with AI" is built from this file.

## Phase 1: CI, data, validator

**Prompt (summary):** "Let's move on with Phase 1 of the etf kompas project. I have just added the starter guide." The agent read the guide, `docs/PHASES.md` and SPEC §5, §12a, §15, §17, §18, §21, §22 and §29, then proposed a plan and open questions before writing anything (per `CLAUDE.md`). Follow-up prompts: write and sync `CLAUDE.md`, start each PR, fix CI, tidy git.

**Produced**

- `CLAUDE.md` (SPEC §29), later synced with conventions from the author's other projects.
- PR 1: Vitest (unit and components projects), Playwright (mobile first), `src/server` lint rule, GitHub Actions CI with actions pinned to commit SHAs resolved via the GitHub API.
- PR 2: Zod data schema, framework-free `validateData`, 26 tests written first and approved before implementation, seed data for 8 ETFs and 5 brokers (all `TODO_VERIFY`), `data:validate` and `data:validate:draft`.
- Small fix PR: deprecated Sass `map-get` replaced with `map.get`.
- This PR: decision notes 0001 to 0005 and this log.

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
