# 0019. Cost breakdown: costs added one at a time, per fund

Date: 2026-10-11
Status: accepted
Phase: 2

## Context

SPEC §21 defines only the total cost (`FV_gross - FV_net`). Wireframe B shows three lines under it: fund fee, currency conversion, tax withheld by the USA. Splitting a total that comes from compounding is a formula choice, because the costs interact slightly.

## Decision

Add the costs to the no-cost baseline one at a time, in the wireframe's order (TER, then FX fee, then dividend withholding). Each part is the drop in final value caused by the cost just added, so the parts add up exactly to the total (`docs/METHODOLOGY.md` §5). The rounding remainder goes to the largest part, so the displayed parts add up to the displayed total. The breakdown is computed per fund; any gap between twins is derived from two fund breakdowns.

## Alternatives considered

- Compute each cost alone against the baseline: not chosen, the parts would not add up to the total.
- Break down the gap between twins instead of one fund's cost: not chosen for the calculator. With one FX fee for every fund the FX line in the gap is close to 0, which would mislead. Computing per fund keeps this a display choice for Phase 3.
- A different order (fund fee, tax, conversion): not chosen. The order only moves small interaction amounts between parts, and the wireframe's order is the one readers see.

## Consequences

- The breakdown rule is not in SPEC §21; it lives in `docs/METHODOLOGY.md` and in the tests.
- The Phase 3 label "Z toho jde na" must say whether the lines are one fund's costs or the gap.
- David approved this rule in chat on 2026-10-11. The reasons above were proposed by the agent and approved by David.
