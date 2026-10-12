# What the screens need from the data

Derived from the rev. 4 text spec ([wireframe-b.md](design/wireframe-b.md), decision note 0035). The list lives in `src/server/data/needs.ts` and `pnpm data:gaps` checks it against `data/*.json`, so the live status is one command away. A value counts only with a source and evidence (SPEC §18).

**Rule for design reviews:** a number or a claim on a wireframe is final only when its row below is verified. Unverified values stay `[ověřit]` in the design and in the page, and a screen that depends on them hides (the saving box) or says so. This avoids a second review after the data turns out different, which is what happened with VOO's fee in rev. 2.

## Status on 2026-10-12

`pnpm data:gaps`: 32 of 118 needed values verified (a value two screens need counts twice). To do: **43 different missing values** in the current data model and **35 values the model has no place for yet**.

| Screen          | Needs                                                                                       | Verified | Missing                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| Hero table      | name, fee and Acc/Dist type of CSPX, VUAA, CNDX, EQQQ                                       | 9 of 12  | name, fee and type of EQQQ (the KID given is for a different share class, see AI-LOG)   |
| Hero line       | where CSPX is sold; where VOO and QQQ are not                                               | 9 of 15  | Fio and IBKR for CSPX, VOO and QQQ                                                      |
| Calculator      | CSPX fee; conversion and custody fee of five brokers; purchase commission; listing currency | 2 of 16  | 4 conversion fees, 5 custody fees, 5 commission rules (new), 5 listing currencies (new) |
| Comparison page | five twins: fee and type; availability 5 x 5; Czech support; listing per fund and broker    | 15 of 70 | VUSA and EQQQ entirely, Fio and IBKR entirely, 5 `czSupport`, 25 listings (new)         |

## Two things the data model does not have yet

1. **Purchase commission per broker**, as a rule that can be calculated for one monthly purchase in Kč. "Poplatky brokera" counts both purchase commission and custody fee (David, 2026-10-12). Today the model has only `custodyFeePct`, which cannot express a fixed fee per year or a free tier. A change to the model needs a note and tests first.
2. **Listing currency per fund and broker** (USD or EUR). Wireframe rule 5: the calculator counts CSPX in dollars and the rows read "převod korun na dolary", so each broker's listing decides whether a conversion is paid. At DEGIRO, EUR to CZK is free (METHODOLOGY).

## Verification batches, easiest first

| Batch | What                                                                                                                      | Count    | Source                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| A     | Acc/Dist for CSPX, VUAA, CNDX: **done 2026-10-12**, read from the factsheets and the KID by Claude and confirmed by David | 3        | factsheets and the KID (the iShares ones are not kept locally, the hash is in the record) |
| B     | VUSA and EQQQ: name, fee, type                                                                                            | 6        | issuer factsheet or KID, as for the others                                                |
| C     | Availability screenshots: Fio and IBKR for 7 funds, and DEGIRO, Trading 212, XTB for VUSA and EQQQ                        | 20       | the broker's instrument search, logged in, as before                                      |
| D     | Conversion fee per broker                                                                                                 | 4        | each broker's fee page, saved as a dated PDF                                              |
| E     | Custody fee per broker                                                                                                    | 5        | same                                                                                      |
| F     | Purchase commission rule per broker                                                                                       | 5        | same, once the model is agreed                                                            |
| G     | Listing currency per fund and broker                                                                                      | up to 25 | the instrument page of each broker                                                        |
| H     | Czech support per broker                                                                                                  | 5        | the broker's site                                                                         |

## Not worth verifying now

No rev. 4 screen shows these fields: fund size, 5 and 10 year returns, dividend yield, withholding rate and replication. VOO and QQQ are needed only for availability. (VTI, SCHD and VWCE were removed from the data, note 0036.) Dividend yield and withholding were verified for the old calculator and stay in the data; the tax text is written from a source, not from these fields.

## Open decisions

- **Fund set (decided, note 0036):** five twins on the comparison page, four in the hero (CSPX, VUAA, CNDX, EQQQ), VUSA on the comparison page only. "8 fondů" became "5 fondů".
- **Ticker label:** the wireframe says CSNDX. The verified iShares NASDAQ 100 fund (IE00B53SZB19) is listed as CNDX at the three brokers we checked, and its factsheet is called "csndx". The wireframe's fee of 0,33 % (from memory) differs from the verified 0,30 %. The page should use the verified figure.
