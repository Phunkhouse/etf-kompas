# 0045. The amount in the variant b headline is in the cost red

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

The variant b headline names an amount ("U stejného fondu můžete zbytečně zaplatit až 28 302 Kč. Kde?", note 0041). David asked for the number in red, in a shade of the calculator's cost number that works on a light background. The calculator's salmon (`--color-cost`, #f2a18c) has 1.9:1 contrast on the page background, so it cannot be used there.

## Decision

The amount is in `--color-cost-strong` (#c23a1b, 4.8:1 on the page background; the pair is already in `src/styles/contrast-pairs.ts`); the rest of the headline stays ink. Reason (David): more aggressive and visible, and in line with version b.

## Alternatives considered

Not recorded: David gave only the reason above.

## Consequences

- A red number can read as a warning. The agent said this fits "zbytečně zaplatit", but that is an opinion, not a test; how it reads in a real ad is not tested.
- Variant a has no number, so it stays all ink; the two variants now differ in colour as well as in wording, which is part of what the test measures.
- The headline copy in `copy.ts` is split around the amount, and `HeroB` renders it in its own element (tested).
