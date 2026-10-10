# 0003. Draft mode for the data validator

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

SPEC §5 says the build must fail on any `TODO_VERIFY`. SPEC §18 says agents must mark values they cannot fetch as `TODO_VERIFY`. All seed data is therefore `TODO_VERIFY` until David has verified about 150 values against their sources (96 ETF values and 55 broker values), so a strict check in CI would stay red from the start.

## Decision

`data:validate` is strict (spec behaviour). `data:validate:draft` still fails on malformed records, missing sources, unknown sources and stale or future dates, but reports `TODO_VERIFY` as a warning. CI runs the draft mode now. Strict mode becomes the deploy gate in Phase 6.

## Alternatives considered

- Strict mode in CI from day one: CI would stay red until every value is verified, which hides real failures.

The draft mode is not in the spec. David approved it in conversation on 2026-10-10 after the reasoning above.

## Consequences

- Run `pnpm data:validate` (strict) before any deploy; it must pass.
- A deploy gate for strict mode has to be wired up in Phase 6, otherwise placeholders could ship.
