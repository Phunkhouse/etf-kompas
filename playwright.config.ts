import { defineConfig, devices } from '@playwright/test'

// E2E_PORT lets a run use another port when a dev server already holds 3000.
const port = process.env.E2E_PORT ?? '3000'

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    // Every test starts with a cookie choice already made (everything refused), so
    // the cookie bar does not cover the page. e2e/cookie-consent.spec.ts starts
    // without one.
    storageState: {
      cookies: [
        {
          name: 'kompas_consent',
          value: 'v1-m0-a0-1760000000',
          domain: 'localhost',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
  },
  projects: [
    // Primary: our audience is mobile (SPEC §12a).
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    // One desktop smoke project: only tests tagged @smoke.
    {
      name: 'desktop-smoke',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `pnpm build && pnpm start -p ${port}`
      : `pnpm dev -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // The lead flow runs on the in-memory store, so e2e needs no secrets and
    // writes to no real database (the store is refused on Vercel).
    env: {
      LEAD_STORE: 'memory',
      LEAD_MIN_FILL_MS: '0',
      // A recording mailer in sandbox mode: tests put the addresses they need on the
      // allowlist, and nothing leaves the machine.
      EMAIL_MODE: 'sandbox',
    },
  },
})
