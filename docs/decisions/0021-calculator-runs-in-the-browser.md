# 0021. Calculator runs in the browser on the shared pure function

Date: 2026-10-11
Status: accepted
Phase: 2

## Context

The calculator must answer as the visitor moves the slider and must be checkable by hand (SPEC §4, §21). CLAUDE.md says business logic lives in `src/server/` and that numbers from the browser are never trusted.

## Decision

The `Calculator` component imports the pure `src/server/calc.ts` and computes in the browser. The module has no imports from `next`, `react` or Node, so it runs in both places. Anything that is stored or sent (leads, Phase 4) is recomputed on the server from the raw inputs, never taken from the browser.

## Alternatives considered

- A server round trip for every slider step: not chosen. It is slower and adds nothing, because the function is pure and tiny.

## Consequences

- One formula in one file for the page and the server, tested once.
- `calc.ts` must stay free of server-only imports. If it ever needs them, this note is revisited.
- The effect on the route's JavaScript size (budget 90 KB gzipped, Phase 3) has not been measured yet.
- The reasons above were proposed by the agent and approved by David on 2026-10-11.
