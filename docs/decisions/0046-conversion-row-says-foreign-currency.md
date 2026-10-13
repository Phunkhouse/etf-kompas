# 0046. The conversion row says "převod korun na cizí měnu"

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

The calculator prices each broker at its cheapest listing of the fund (note 0037). For CSPX that is a euro listing at DEGIRO and Fio and a dollar listing at Trading 212 and XTB, so the result block cannot say "převod korun na dolary" for every broker. METHODOLOGY-V2 §9 first planned a label that follows the listing ("na eura" or "na dolary").

## Decision

The row is labelled "převod korun na cizí měnu" for every broker (`calculatorCopy` in `src/content/copy.ts`). Reason (David): the currency could be euros too.

## Alternatives considered

- A label that follows the listing ("na eura" or "na dolary"): planned in METHODOLOGY-V2 §9 and not built; David gave no reason against it.

## Consequences

- The label is correct for every broker, but less specific than the visitor might expect. The "Jak počítáme" text explains that the listing differs per broker.
- SPEC §25 (glossary) and METHODOLOGY-V2 §9 now say "cizí měnu"; the original microcopy list in §25 still says "dolary" and is marked as the original set.
