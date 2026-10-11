# 0028. Hero variants are two static pages chosen by a config rewrite

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

`?v=a` and `?v=b` must show different heroes, and an unknown value must show `a` (SPEC §22). The hero is probably the largest element on the page, so it should be in the static HTML for the 2.0 s LCP target. `next.config.ts` has `cacheComponents: true`. The Next.js docs (`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`) say that reading `searchParams` in a page opts it into dynamic rendering. With Cache Components the hero would then sit behind a Suspense boundary, outside the static shell.

## Decision

`app/page.tsx` renders the landing page with hero a. `app/v/b/page.tsx` renders it with hero b. A `beforeFiles` rewrite in `next.config.ts` maps `/?v=b` to `/v/b`. Any other `v` is not matched and falls through to `/`, so the fallback to `a` needs no code. Both pages are prerendered as static. The query string, including UTM parameters, stays in the address bar.

## Alternatives considered

- Read `searchParams` in the page: not chosen, because the hero would be dynamic (see Context).
- A `proxy.ts` that rewrites: not chosen. Proxy runs on the Node runtime for each request, and the docs advise config for simple rewrites. A proxy may be needed later for the variant cookie (SPEC §23); that cookie can also be set in the browser.

## Consequences

- Checked on a production build with `next start`: `/?v=b` gives hero b, `/`, `/?v=a`, `/?v=zzz`, `/?v=B` and `/?v=b%20` give hero a, and `/?v=b&utm_source=ig&fbclid=x` gives hero b. `/?v=a&v=b` also gives hero b.
- It has to be `beforeFiles`: a plain `rewrites()` array did nothing, because `/` is an existing page and pages are served before `afterFiles` rewrites.
- `/v/b` is reachable directly. The whole site is `noindex` until the launch gate.
- The match is case-sensitive, so `?v=B` shows hero a. Ad links must use lowercase.
- Verified locally only. Phase 6 must check the same URLs with `curl` on the Vercel deployment.
- Playwright (`e2e/variants.spec.ts`) covers the behaviour on the production build.
- The agent recommended this and David accepted the recommendation on 2026-10-11. No separate reason from David is recorded.
