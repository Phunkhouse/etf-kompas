@AGENTS.md

# Project

Czech-language, mobile-first lead-gen landing page for ETF cost comparison. Source of truth: `docs/SPEC.md`. Phase overview: `docs/PHASES.md`. Tooling conventions: `docs/starter-guide.md` as adapted in SPEC §12a (where they disagree, the spec wins).

# Rules

- Work phase by phase (SPEC §20/§22). Do not start a phase without a plan I have approved.
- Never invent data, sources, URLs, legal statements or Czech tax rules. Unknown = `TODO_VERIFY`.
- All user-facing text is Czech, lives in `src/content/copy.ts`, and must pass `pnpm copy:check` (plain-language glossary, SPEC §25). Use the nbsp() typography rules.
- No dependency without a one-line reason in the PR.
- Run `pnpm check && pnpm format:check` before finishing any change. Never use `--no-verify`.
- One concern per branch/PR, Conventional Commit titles, never push to `main`.
- After each phase, append to `docs/AI-LOG.md`: prompt used, what you produced, what you got wrong or had to fix.
- If the spec is silent or contradictory, make the smallest decision, draft a decision note in `docs/decisions/` (see its README), and tell me.
- Decision notes record only reasons the author (David) actually gave. If a reason or the considered alternatives are missing, ask instead of inventing them. Verify every claim about the repo against the repo.

# Conventions (short form, details in `docs/starter-guide.md`)

- pnpm only (Node 24), no `package-lock.json`. `next`, `react`, `react-dom` and `eslint-config-next` are pinned exactly.
- TypeScript strict, ESLint flat config, Prettier (no semicolons, single quotes).
- Named exports everywhere except Next route files. No barrel files that re-export many components.
- SCSS Modules, design tokens as CSS variables, spacing and type only from tokens. No Tailwind, no component libraries.
- React Compiler is on: no `useMemo`/`useCallback`/`React.memo` without measuring.
- Tests: `*.test.ts` (node), `*.test.tsx` (jsdom), Playwright in `e2e/`. Prefer `getByRole`, no fixed sleeps.
- Money crossing the API boundary is an integer (whole Kč).
- `src/server` stays framework-free (no `next`/`react` imports).
- Git: author email is the GitHub noreply address; the SSH remote uses the `github-personal` host alias.
