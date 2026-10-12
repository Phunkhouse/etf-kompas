# 0041. The hero A/B test compares headline framing only

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

SPEC §6 gave ad A and ad B each their own hero, and the code on main renders `?v=a` calculator-first and `?v=b` table-first (note 0028). In rev. 4 both heroes had the same headline, so the pair differed in layout and sub-copy and, together with the ad each visitor came from, in the ad angle. That does not test any of the three hypotheses ranked in SPEC §11 and cannot show which part worked. The original brief asks for expected conversion and three hypotheses ranked by expected impact.

## Decision

David chose Option 1 from the comparison draft on 2026-10-12. `?v=a` and `?v=b` use one layout and differ only in the h1, which tests hypothesis 2 (headline framing; metric visit to `calc_start`).

- `a` (default, also for unknown `v`): "Americké indexy z Česka: u koho je koupíte a za kolik?"
- `b`: "U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?" The amount is the saving box maximum for the default setting, and a sentence under the table states the setting and "odhad bez českých daní a inflace".
- `b` is served only when the saving box hide rule is met (at least two brokers with verified prices). Otherwise everyone gets `a`.
- Both ad sets send traffic to both variants, split equally, so ad angle and headline are separate factors.
- Hypotheses 1 (gate placement) and 3 (form friction) run later as separate tests.
- The calculator-first hero and its artboard (G5) are dropped from the design documents.

## Alternatives considered

- Keep calculator-first against table-first (Option 2, what is built): not chosen. It needs no work but tests hero order, which is not on the ranked list, and the result could not say which of order, copy or ad angle moved the numbers.

## Consequences

- The code needs a change: one layout for both variants (the calculator-first branch in `Landing` and the `hero.a` copy keys go), a `b` headline in `copy.ts`, a server-side check of the hide rule, and `track()` with `variant` on every event. This is a follow-up and is not in the docs PR. Note 0028 (two static pages chosen by a rewrite) can stay as the mechanism.
- The `b` headline names no "broker" and passes the glossary, but `copy:check` must be run on it. The hero fit on 375 x 667 with the longer headline and extra sentence is not measured yet.
- The decision records only David's choice. No further reason was given.
