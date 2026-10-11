# 0027. `copy:check` also bans the wording in SPEC §25 rule 7

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

SPEC §25 lists four things `pnpm copy:check` must catch (glossary terms, "ETF" more than once, abbreviations in headlines, tickers outside a table row). The same section's rule 7 bans a list of words and says there are no exclamation marks and no emoji, but does not put them in the checker's list.

## Decision

The checker also fails on the banned words from rule 7 (zaručeně, garantovaný výnos, bez rizika, zbohatněte, pasivní příjem, finanční svoboda, revoluční, tajemství bohatých, exkluzivní, nenechte si ujít, poslední šance), on "!" and on emoji. Text under `legal` is exempt, as for the other rules.

## Alternatives considered

Not recorded.

## Consequences

- This extends the spec's checker list. SPEC §25 itself is unchanged.
- Words are matched by stem, so unusual inflections can slip through.
- No reason was given for this decision. David approved it on 2026-10-11 and asked for the reason to be left out.
