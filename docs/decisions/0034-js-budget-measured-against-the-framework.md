# 0034. The JavaScript budget is measured against the framework

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

SPEC §12 and §22 asked for at most 90 KB of gzipped JavaScript per route. Measured with Playwright (cold cache, compressed request sizes), an empty page already downloads 132.5 KB with Next 16 and React 19, and the landing page 142.3 KB. Our code, calculator included, adds 9.8 KB. Switching off `partialPrefetching` changed nothing. So the 90 KB number could not be met by any page on this stack.

## Decision

Two limits, both tested in `e2e/js-budget.spec.ts`: our code adds at most 20 KB gzipped over an empty Next page, and the whole route stays at or under 150 KB gzipped. SPEC §12, SPEC §22 and `docs/PHASES.md` say so.

## Alternatives considered

- Shrink the framework share, for example by dropping `cacheComponents`: raised by the agent, not chosen.
- Keep 90 KB and list it as a known gap: raised by the agent, not chosen.

## Consequences

- The 20 KB limit guards what we control, so a heavy dependency or a large client component fails the test. The 150 KB limit is a ceiling against growth, 7.7 KB above today's 142.3 KB.
- The older notes 0002, 0007, 0018 and 0021 mention the 90 KB budget as part of their reasoning. They are left as written; this note supersedes the number.
- LCP under 2.0 s and Lighthouse performance of at least 90 still apply, and are measured in the performance PR. A larger framework share makes them harder to reach on a slow phone, so they remain the real test of "small enough".
- David's reason: the 90 KB was never a real concern, and he chose Next because he knows it.
