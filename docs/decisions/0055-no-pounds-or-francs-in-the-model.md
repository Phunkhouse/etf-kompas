# 0055. The data model has no GBP, GBX or CHF

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is David's own words in chat on 2026-10-14. The context and the consequences are written by the agent from the repo; David confirms or corrects them.

## Context

The calculator prices a fund at a broker's cheapest listing, and the listing's currency decides whether a conversion fee is paid. The model knows three currencies: CZK, EUR and USD. While the listings of VUAA, VUSA, CNDX and EQQQ were filled in (PR 78), several listings were seen in other currencies: the London Stock Exchange in pounds (GBP, and GBX for pence, for example VUSA at Trading 212, XTB and IBKR, EQQQ at DEGIRO, Trading 212, XTB and IBKR) and the Swiss exchange in francs (CHF, for example VUSA at IBKR). IBKR's Swiss commission is in CHF too.

## Decision

Listings in GBP, GBX and CHF are not recorded; the model stays with CZK, EUR and USD. Reason (David): "let's keep it as simple as possible".

## Alternatives considered

- Adding GBP and CHF to the currencies, with their conversion fees and exchange rates: not done. David's reason: keep it as simple as possible.

## Consequences

- The cheapest real listing of a fund can be missing from a price, so a price is the cheapest of the listings we recorded, not necessarily of all the broker offers. The README says so.
- Trading 212 VUSA was priced only after an EUR listing (Amsterdam) was found; IBKR VUSA likewise.
- IBKR's listing of EQQQ on the Swiss exchange (in USD) is recorded but has no purchase rule, because that commission is in CHF; it is not priced.
- Adding a currency later means a change to the data schema, the cost formula, the rates and the checker `pnpm data:gaps`, with tests first.
