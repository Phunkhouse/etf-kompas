# 0030. Revision 2 wireframe copy is adapted to the glossary and the headline rule

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

The revision 2 wireframes (note 0029) write "ETF" in both hero headlines ("Které ETF si z Česka opravdu koupíte …") and use "broker" in the source bar, the table pills and the links ("Ne u 3 z 5 brokerů", "kontrola brokerů"). SPEC §25 allows no abbreviation in a headline, allows "ETF" once on the page with an explanation, and lists "broker" among the terms to replace with "firma nebo aplikace, kde fond koupíte". `pnpm copy:check` enforces all three. Note 0017 says wireframe copy is working copy and the checker rules still apply when the page is built.

## Decision

The app copy follows SPEC §25. "ETF" in a headline becomes "fondy" ("Které fondy si z Česka opravdu koupíte?"), and "ETF" stays only in the explanatory callout. "broker" becomes "firma" ("u 3 z 5 firem"). The source bar reads "Čísla ze stránek fondů a firem · ověřeno k {měsíc}": the first wording I tried ("… a firem, kde je koupíte") wrapped to two lines at 375 px, and the wireframe has one line. The wireframes keep their wording as the design record.

## Alternatives considered

- Drop "broker" from the banned list, or allow "ETF" in headlines: raised by the agent as the other way to resolve it, not chosen. That would change SPEC §25.

## Consequences

- `docs/design/wireframe-b.md` and the exported images now differ from the app copy in these words. Note 0017 already covers that.
- The brokers' names (DEGIRO, Fio, IBKR, Trading 212, XTB) are proper names, not the glossary term. Where they appear in the app they are written as names.
- "firem" is vaguer than "brokerů". If testing shows that visitors do not understand it, revisit.
- David chose the agent's wording on 2026-10-11 and gave no further reason.
