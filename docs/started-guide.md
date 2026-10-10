# Next.js frontend starter: setup guide

Stack: pnpm, Next.js (App Router), TypeScript strict, ESLint, Prettier, Husky + lint-staged, Vitest, Playwright, SCSS Modules, next-intl, Zod, React Hook Form, GitHub Actions CI.

## 1. Scaffold

Requires Node 24 and pnpm (via corepack).

```sh
corepack enable
pnpm create next-app@latest my-app --ts --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-tailwind
cd my-app
echo 24 > .nvmrc
```

Pin the package manager in `package.json` (`"packageManager": "pnpm@<version>"`). Use pnpm only and never commit `package-lock.json`.

## 2. Dependencies

```sh
# runtime
pnpm add sass zod react-hook-form next-intl

# tooling
pnpm add -D prettier husky lint-staged \
  vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/dom \
  @playwright/test babel-plugin-react-compiler
```

Pin `next`, `react` and `react-dom` exactly (no `^`) and let the others float. `eslint-config-next` is pinned to the same version as `next`.

## 3. package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run --project unit --project components",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check": "pnpm lint && pnpm typecheck && pnpm test",
    "prepare": "husky"
  }
}
```

`typecheck` runs `next typegen` first because route types are generated and git-ignored. Run `pnpm check && pnpm format:check` before finishing any change.

## 4. pnpm-workspace.yaml

pnpm 10+ blocks dependency build scripts by default. List the packages you have decided not to build:

```yaml
allowBuilds:
  '@parcel/watcher': false
  '@swc/core': false
  esbuild: false
  sharp: false
  unrs-resolver: false
```

## 5. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

This is the stock Next config. `strict` is on and `@/*` maps to `src/*`.

## 6. ESLint (eslint.config.mjs, flat config)

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  // Optional: keep business logic framework-free
  {
    files: ['src/server/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'next', message: 'src/server must not import from Next.' },
            { name: 'react', message: 'src/server must not import React.' },
            { name: 'react-dom', message: 'src/server must not import React.' },
          ],
          patterns: [
            {
              group: ['next/**', 'react/**', 'react-dom/**'],
              message: 'src/server must stay framework-free.',
            },
            {
              group: ['@/app/**', '@/components/**'],
              message: 'src/server must not depend on the UI layers.',
            },
          ],
        },
      ],
    },
  },
])
```

The `src/server` block is optional. Drop it if you don't want that layering rule.

## 7. Prettier

`.prettierrc`:

```json
{ "semi": false, "singleQuote": true }
```

`.prettierignore`:

```
.next
node_modules
pnpm-lock.yaml
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

## 8. Husky + lint-staged

```sh
pnpm exec husky init   # creates .husky/pre-commit
```

`.husky/pre-commit` (replace the generated content):

```
pnpm exec lint-staged
```

`.lintstagedrc.json`:

```json
{ "*": "prettier --write --ignore-unknown" }
```

The `prepare` script (`husky`) installs the hook on `pnpm install`. The hook only formats staged files. Lint, typecheck and tests run in CI and in `pnpm check`. Never bypass the hook with `--no-verify`.

## 9. next.config.ts

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Lets a phone on the home network open `pnpm dev` via the Mac's IP (dev only)
  allowedDevOrigins: ['192.168.*.*'],
  // Lets SCSS files `@use 'utilities'` without relative paths
  sassOptions: { loadPaths: ['src/styles'] },
}

export default withNextIntl(nextConfig)
```

- React Compiler is on, so don't add `useMemo`, `useCallback` or `React.memo` without measuring first. With React Hook Form use `useWatch`, not `watch()`.
- Drop the next-intl lines if you don't need i18n.

## 10. Vitest (vitest.config.mts)

Three kinds of tests are split by file suffix and run as separate projects:

| Suffix          | Project    | Environment |
| --------------- | ---------- | ----------- |
| `*.test.ts`     | unit       | node        |
| `*.test.tsx`    | components | jsdom       |
| `e2e/*.spec.ts` | Playwright | browser     |

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'components',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./vitest.setup.ts'],
          // next-intl imports 'next/navigation' without an extension
          server: { deps: { inline: ['next-intl'] } },
        },
      },
    ],
  },
})
```

`vitest.setup.ts` (needed because test globals are off, so Testing Library doesn't clean up on its own):

```ts
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())
```

Testing rules: prefer `getByRole` queries and never use fixed sleeps.

## 11. Playwright (playwright.config.ts)

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: process.env.CI ? 'pnpm build && pnpm start' : 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

Install the browser on first run with `pnpm exec playwright install chromium`.

## 12. Styling: CSS Modules + SCSS, with tokens as CSS variables

No Tailwind and no component library.

```
src/app/reset.css        # CSS reset
src/app/variables.scss   # :root design tokens
src/app/globals.css      # body, links, :focus-visible
src/styles/_utilities.scss  # rem() function, from() media mixin
```

`src/styles/_utilities.scss`:

```scss
@use 'sass:math';
$root-font-size: 16;

// rem(24) -> 1.5rem
@function rem($px) {
  @if math.is-unitless($px) == false {
    $px: math.div($px, 1px);
  }
  @return math.div($px, $root-font-size) * 1rem;
}

// Mobile-first: @include from(rem(768)) { ... }
@mixin from($width) {
  @media (min-width: $width) {
    @content;
  }
}
```

`src/app/variables.scss` (tokens):

```scss
@use 'utilities' as *;

:root {
  --color-bg: #fff;
  --color-text: #000;
  --color-muted: #4d4d4d;
  --color-border: #000;
  --color-focus: #0033cc;
  --color-accent: #0033cc;
  --color-on-accent: #fff;

  --space-1: #{rem(4)};
  --space-2: #{rem(8)};
  --space-3: #{rem(12)};
  --space-4: #{rem(16)};
  --space-5: #{rem(24)};
  --space-6: #{rem(32)};
  --space-7: #{rem(48)};
  --space-8: #{rem(64)};

  --border-width: 2px;
  --focus-width: 3px;

  --font-size-sm: #{rem(14)};
  --font-size-base: #{rem(16)};
  --font-size-md: #{rem(20)};
  --font-size-lg: #{rem(24)};
  --font-size-xl: #{rem(32)};
  --font-size-2xl: #{rem(40)};
}
```

`globals.css`: set `body` to `var(--color-bg)` / `var(--color-text)` and add a visible focus style:

```css
:focus-visible {
  outline: var(--focus-width) solid var(--color-focus);
  outline-offset: 2px;
}
```

Import the three files once in the root layout, in this order: `reset.css`, `variables.scss`, `globals.css`.

## 13. Folder and component conventions

```
src/
  app/           # routes (default exports only for Next route files)
  components/<Name>/
    <Name>.tsx
    <Name>.module.scss
    <Name>.test.tsx
    index.ts         # export { Name } from './Name'
  config/        # env schema (Zod), site config (name etc.)
  i18n/          # routing.ts, request.ts, navigation.ts
  lib/           # pure helpers + their *.test.ts, render-with-intl.tsx
  server/        # framework-free business logic (optional)
  styles/        # SCSS utilities
messages/        # cs.json (all UI strings)
e2e/             # Playwright specs
```

- Use named exports everywhere except Next route files. Don't create barrel files that re-export many components.
- Put all UI text in `messages/<locale>.json` and read the site name from one config value (`src/config/shop.ts`).
- Validate with Zod, shared between client and server. Store money as integer minor units.
- Accessibility: semantic HTML, visible focus, WCAG AA contrast, alt text, large touch targets.

Component test helper (`src/lib/render-with-intl.tsx`):

```tsx
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import messages from '../../messages/cs.json'

export function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="cs" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  )
}
```

## 14. .gitignore additions

Beyond the create-next-app default, add the Playwright output and keep `.env.example` tracked:

```
.env*
!.env.example
*.tsbuildinfo
next-env.d.ts
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

## 15. CI (.github/workflows/ci.yml)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@<sha> # pin actions to a commit SHA
      - uses: pnpm/setup@<sha>
        with:
          runtime: node@24
          cache: true
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  e2e:
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@<sha>
      - uses: pnpm/setup@<sha>
        with:
          runtime: node@24
          cache: true
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```

Pin third-party actions to a full SHA and keep the version in a trailing comment. The repo's CI also runs a Postgres service, which you can drop.

## 16. Workflow rules (put these in CLAUDE.md or CONTRIBUTING.md)

- One concern per branch and PR, and never push to `main`.
- PR titles use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `build:`, `style:`, `refactor:`).
- Say why in the PR body whenever you add a dependency.
- Never commit secrets or `.env*` (except `.env.example`).
- Run `pnpm check && pnpm format:check` before finishing.

## Bootstrap checklist

1. Scaffold with create-next-app (section 1), then `.nvmrc` and `packageManager`.
2. Install dependencies (2) and set the scripts (3).
3. Add `pnpm-workspace.yaml` (4), tsconfig (5), ESLint (6) and Prettier (7).
4. Run `pnpm exec husky init`, then add lint-staged (8).
5. Add `next.config.ts` (9) and enable the React Compiler.
6. Add the Vitest and Playwright configs (10, 11) and run `pnpm exec playwright install chromium`.
7. Add the SCSS tokens and utilities (12) and the folder conventions (13).
8. Add the CI workflow (15).
9. Run `pnpm format && pnpm check` and commit.
