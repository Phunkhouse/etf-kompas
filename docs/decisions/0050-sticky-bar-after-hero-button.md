# 0050. The sticky button bar appears once the hero button has scrolled away

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

SPEC §7 describes a sticky bottom button bar on a phone that jumps to the e-mail form and appears after the first scroll. The component shows it once the hero button is out of view, which is the same moment in practice. The hero must show its primary button at 375 x 667 (note 0031), so a bar that is there from the start would take room from it.

## Decision

The bar is hidden while the hero button is in view, appears when it has scrolled out, and goes away again while the form is in view (`StickyBar`). Reason (David): it could help conversions, and it is easier on the eyes.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- The effect on conversions is a hypothesis, not a measurement; the funnel events of Phase 5 can show it.
- The footer has extra bottom padding on phones so the bar does not cover the links.
