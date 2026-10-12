@AGENTS.md

# Project

Czech-language, mobile-first lead-gen landing page for ETF cost comparison. Source of truth: `docs/SPEC.md`. Phase overview: `docs/PHASES.md`. Design: `docs/design/DESIGN-GUIDE.md` (palette, type, components) and `docs/design/wireframe-b.md` (screens); read them before writing any UI or style. Tooling conventions: `docs/starter-guide.md` as adapted in SPEC §12a (where they disagree, the spec wins).

# Rules

- Work phase by phase (SPEC §20/§22). Do not start a phase without a plan I have approved.
- Never invent data, sources, URLs, legal statements or Czech tax rules. Unknown = `TODO_VERIFY`.
- All user-facing text is Czech, lives in `src/content/copy.ts`, and must pass `pnpm copy:check` (plain-language glossary, SPEC §25). Use the nbsp() typography rules.
- No dependency without a one-line reason in the PR.
- Run `pnpm check && pnpm format:check` before finishing any change. Never use `--no-verify`.
- One concern per branch/PR, Conventional Commit titles, never push to `main`.
- Keep `docs/AI-LOG.md` current as you work, in the same PR as the change: add the prompt used, what you produced, and every mistake you made or David corrected (wrong assumption, failed CI, rewritten commit, wrong data). The README reports where the AI erred, and this cannot be reconstructed later. Do it when the mistake happens, not at the end of the phase.
- Watch for decisions worth a note in `docs/decisions/`: a tool or dependency choice, a data-model shape, a deviation from the spec or starter guide, a trade-off, a workflow rule. When you see one, suggest a note (title and one-line reason) instead of silently deciding. Draft it only after David gives the reason (see the rule below).
- Ask before changing the spec's decisions. Propose the change instead.
- If the spec is silent or contradictory, make the smallest decision, draft a decision note in `docs/decisions/` (see its README), and tell me.
- Decision notes record only reasons the author (David) actually gave. If a reason or the considered alternatives are missing, ask instead of inventing them. Verify every claim about the repo against the repo.

# Commands

```sh
pnpm dev            # Next dev server on http://localhost:3000
pnpm build          # production build
pnpm start          # serve the production build

pnpm check          # lint + typecheck + test + contrast:check + copy:check (no format check). Run before finishing, together with pnpm format:check
pnpm format         # Prettier --write
pnpm format:check   # Prettier --check (CI runs this)
pnpm lint           # ESLint
pnpm typecheck      # runs `next typegen` first (route types are generated and git-ignored)
pnpm test           # Vitest: unit + component tests
pnpm test:watch     # Vitest in watch mode
pnpm contrast:check     # WCAG AA check of every colour pair in src/styles/contrast-pairs.ts (part of pnpm check)
pnpm copy:check         # glossary and plain-language lint of src/content/copy.ts (SPEC §25, part of pnpm check)
pnpm data:validate       # strict: fails on TODO_VERIFY, missing source, stale data (the deploy gate, Phase 6)
pnpm data:validate:draft # same, but TODO_VERIFY is only a warning (CI today)
pnpm data:gaps           # what the rev. 4 screens still need from data/*.json, with counts (docs/DATA-NEEDS.md)
pnpm test:e2e       # Playwright (mobile + desktop smoke). First run: pnpm exec playwright install chromium
```

- This list covers only scripts that exist today: update it when a phase adds one.
- Use only scripts that exist in `package.json`. Check it before inventing a command.

# Stack and tooling

- pnpm only (Node 24). Never create `package-lock.json`. `next`, `react`, `react-dom` and `eslint-config-next` are pinned exactly.
- Next.js App Router, TypeScript strict, `src/` directory, import alias `@/*` -> `src/*`.
- ESLint flat config, Prettier (no semicolons, single quotes).
- Styling: SCSS Modules, design tokens as CSS variables in `src/app/variables.scss` (colours are mirrored in `src/styles/colors.ts`: change both), spacing and type only from tokens. A new colour pair used in the UI goes into `src/styles/contrast-pairs.ts`. `/styleguide` shows every token. No Tailwind, no component library.
- React Compiler is on: no `useMemo`/`useCallback`/`React.memo` without a measured reason.
- Validation: Zod, shared between client and server. Money crossing the API boundary is an integer (whole Kč), never a float.

# Architecture

- Business logic lives in `src/server/` and imports nothing from `next` or `react` (calculator, data validation, lead handling).
- Route handlers and server actions are thin: parse input with Zod, call a service, return.
- Never trust numbers from the browser. Recompute on the server.
- Planned folders (SPEC §13) may not exist yet. Create them when first needed, don't invent others without asking.
- Components live in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.module.scss`, `<Name>.test.tsx` and an `index.ts` that exports that one component. Named exports only (default exports only for Next route files). No barrel files that re-export many components.

# Testing

- `*.test.ts` = unit (node), `*.test.tsx` = component (jsdom), `e2e/*.spec.ts` = Playwright (mobile profile first).
- Prefer `getByRole` queries. Never use fixed sleeps.
- For risky logic (calculator, data validator, lead handling), write the test cases first and wait for approval before implementing.

# Workflow

- One concern per branch and PR. Never push to `main`. Keep PRs small; the PR body says what changed and why.
- PR titles and commits use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `build:`, `style:`, `refactor:`).
- Open PRs with `gh pr create`. Never merge: David merges after review.
- Prettier runs on staged files in a pre-commit hook (husky + lint-staged). Never bypass it: no `--no-verify` or `-n`, no `HUSKY=0`. If the hook fails, fix the cause or ask.
- Git identity: author email is the GitHub noreply address; the SSH remote uses the `github-personal` host alias.

# Never commit

- Secrets, `.env*` (except `.env.example`), personal data. The repo is public.
- Third-party source PDFs (store the archive link and SHA-256 instead, SPEC §17.11).
