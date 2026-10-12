# 0037. Calculator version 2: what it counts and which number it shows

Date: 2026-10-12
Status: accepted
Phase: 3

## Context

Wireframe rev. 4 (note 0035) changes the result of the calculator: it is the cost of the buyable twin, split into fund fee, conversion and broker fees, with a saving box for the spread between brokers. SPEC §21 had broker commissions out of scope, and the old formula had withholding and a gap to the American fund. The draft is `docs/METHODOLOGY-V2.md`.

## Decision

- Broker fees are the purchase commission and the custody fee. Fees are static data in `data/`; the wireframe's loading and failure states are dropped.
- The headline number is the cost at the priced broker with the highest cost, and the saving box shows the spread ("až"). It is hidden when the spread is 0 Kč or fewer than two brokers are priced.
- Withholding and dividend yield are not in the formula. They stay in the data for the tax text.
- Exchange rates for fees in euro or dollar are the Czech National Bank rate on a stated date, a sourced record.
- One order a month. A free first order is entered as a fixed fee of 0.

## Alternatives considered

- A named default broker, or a range, as the headline: raised by the agent, not chosen.
- A fixed illustrative exchange rate stated on the page: raised by the agent, not chosen.

## Consequences

- SPEC §21 changes: broker commissions are in scope. The old calculator stays in the code until version 2 is implemented, then its tests and golden cases are replaced.
- With no priced broker the calculator has no number; what it shows then is still open (METHODOLOGY-V2 §8). Today no broker has all its values verified.
- A headline that is the highest verified cost should say so in its wording; that is a copy question for David.
- David accepted these proposals on 2026-10-12 and gave no further reason.
