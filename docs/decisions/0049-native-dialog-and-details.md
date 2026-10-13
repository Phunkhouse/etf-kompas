# 0049. The phone menu is a native dialog and the FAQ uses native details

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

The phone menu opens over the page and the FAQ opens and closes four answers. Both can be built with a script-driven component or with the browser's own elements.

## Decision

The menu uses the native `<dialog>` element opened with `showModal()`, and the FAQ uses `<details>` and `<summary>`. Reason (David): accessibility and the built-in features of the elements, the same for `<details>`.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- The browser supplies focus handling, the Escape key and the open/closed state without extra code, so less JavaScript (the JS budget, note 0034) and fewer accessibility bugs to maintain.
- The look of both is ours (SCSS); the behaviour is the browser's, so it must be checked in the in-app browsers of Instagram and Messenger (SPEC §23, Phase 6).
