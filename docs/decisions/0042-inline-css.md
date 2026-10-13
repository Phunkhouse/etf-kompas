# 0042. Inline the page CSS (experimental Next flag)

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

The page's CSS (about 9 KB) was served as three render-blocking files, so the first paint waited for them. Lighthouse with applied throttling gave an LCP of 1.90 s on `/`; SPEC §22 asks for under 2.0 s.

## Decision

Set `experimental.inlineCss: true` in `next.config.ts`, so the CSS is part of the HTML. Reason (David): the performance gain.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- Applied-throttling LCP on `/` went from 1.90 s to about 0.8 s (one run of three was 2.7 s, cause not found). Performance score 96 → 97. JS size unchanged.
- The default simulated LCP (~2.65 s) hardly moved; it stays near 2.6 s even on `/zasady`, so SPEC §22 now names applied throttling as the gate.
- The flag is `experimental` in Next. Check it after every Next upgrade, and drop it if it breaks.
