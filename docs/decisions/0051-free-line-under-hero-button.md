# 0051. The hero button has "Zdarma, bez registrace" under it

Date: 2026-10-13
Status: accepted
Phase: 3

## Context

The 5-second test (SPEC §22, Phase 3) asks whether at least two of three non-investors can say what they get and that it costs nothing. The hero said nothing about price. The calculator is free and needs no account; the e-mail comes only with the comparison.

## Decision

A line "Zdarma, bez registrace" sits under the primary hero button (`heroCopy.ctaNote`): centred on a phone, left-aligned on desktop. It was first a muted 14 px caption; after the 5-second test (note 0052) it is 16 px semibold in ink. David chose this placement (option A) over putting the line inside the button. Reason (David): it should convert more.

## Alternatives considered

- The line inside the button as a second, smaller line: shown in a mockup, not chosen; David gave no reason against it.

## Consequences

- The effect on conversion is a hope, not a measurement. The 5-second test checks whether the "free" message is understood, not whether it converts; the A/B test and the funnel (Phases 4 and 5) would show conversion.
- The hero still fits 375 x 667 with the line (the button ends at 597 px).
- The first version, in muted grey, was not noticed in the 5-second test (note 0052), so it was made darker and bigger.
- "Bez registrace" is true (no account is created), but the comparison needs an e-mail address; the FAQ answer "Je to zdarma?" says what happens with it. The copy review should check that the two do not read as a contradiction.
