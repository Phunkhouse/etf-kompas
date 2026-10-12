# 0040. Keep the schema library out of browser code

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

The calculator prices brokers in the browser (`src/server/broker-pricing.ts`). It imported the `TODO_VERIFY` constant from `src/server/data/schema.ts`, which also holds the Zod schemas, so the whole Zod library was sent to the browser. The JS budget test failed: our code added 42.8 KB over an empty page (limit 20 KB) and the route was 178.5 KB (limit 150 KB, note 0034).

## Decision

`TODO_VERIFY` lives in its own file, `src/server/data/todo.ts`, and `schema.ts` re-exports it. Code that runs in the browser imports it from there and imports only types from `schema.ts`. Reason (David): we are trying to fit the JS budget.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- With the change our code adds 11.0 KB and the route is 143.5 KB.
- Any new browser-side module must not import `schema.ts` for a value (a type import is fine). Only the budget e2e test (`e2e/js-budget.spec.ts`) catches a slip; a unit test cannot see it.
