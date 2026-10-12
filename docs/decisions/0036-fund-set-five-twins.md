# 0036. The fund set is five European twins, plus VOO and QQQ for availability only

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

The rev. 4 wireframes (note 0035) compare five European twins: CSPX, VUAA, VUSA, CNDX and EQQQ. SPEC §3.2, §5 and the copy promised "8 fondů", including VTI, SCHD and VWCE, which no rev. 4 screen shows and for which no value was ever verified. `docs/DATA-NEEDS.md` counts what each fund costs to verify: about three values on the screens plus five availability checks.

## Decision

The data holds seven funds: the twins CSPX, VUAA, VUSA, CNDX and EQQQ, and VOO and QQQ, which the page names only to say where they cannot be bought. The hero table shows CSPX, VUAA, CNDX and EQQQ (two on each index), the comparison page all five twins. VTI, SCHD and VWCE are removed from the data. "8 fondů" becomes "5 fondů" in SPEC §3.2, §5, §25 and the ad copy.

## Alternatives considered

- Keep all ten funds in the data: not chosen. Each extra fund needs about 12 verified values and five availability checks, and no screen shows them.

## Consequences

- Adding a fund later (David asked): add its record to `data/etfs.json` and an availability placeholder at every broker, add its id to the lists in `src/server/data/needs.ts`, and update the fund list pinned in `validate.test.ts`. The comparison page will be built from the data, so a new twin appears there without page code. The hero table has four fixed rows, so a fifth hero row is a design change. Verification is the real cost: about three values plus five availability checks per fund.
- SPEC §3.2 still lists 5 and 10 year performance and a longer set of fields; rev. 4 shows no returns. That conflict is not changed here and needs David's decision.
- VTI, SCHD and VWCE stay in git history if they are ever wanted back.
- David chose the agent's suggestion on 2026-10-12 and gave no other reason.
