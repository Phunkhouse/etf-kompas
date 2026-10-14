# What the screens need from the data

Derived from the rev. 4 text spec ([wireframe-b.md](design/wireframe-b.md), decision note 0035). The list lives in `src/server/data/needs.ts` and `pnpm data:gaps` checks it against `data/*.json`, so the live status is one command away. A value counts only with a source and evidence (SPEC §18).

**Rule for design reviews:** a number or a claim on a wireframe is final only when its row below is verified. Unverified values stay `[ověřit]` in the design and in the page, and a screen that depends on them hides (the saving box) or says so. This avoids a second review after the data turns out different, which is what happened with VOO's fee in rev. 2.

## Status on 2026-10-14

`pnpm data:gaps`: **138 of 138 needed values verified** (a value two screens need counts twice). Nothing the rev. 4 screens need is missing from the data files, and nothing is left without a place in the data model. Since 2026-10-12 the model gained what the old list called "two things the model does not have yet": purchase commission rules, conversion fees per currency, custody fees and the listing (currency and venue) of each fund at each broker (calculator version 2, [METHODOLOGY-V2.md](METHODOLOGY-V2.md) §3). `pnpm data:gaps` now checks those, not the three broker fields of version 1.

| Screen          | Needs                                                                                                  | Verified |
| --------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| Hero table      | name, fee and Acc/Dist type of CSPX, VUAA, CNDX, EQQQ; where CSPX is sold; where VOO and QQQ are not   | 23 of 23 |
| Calculator      | CSPX fee; purchase rule, custody fee and conversion fee (per currency of the listings) of five brokers | 20 of 20 |
| Comparison page | five twins: fee and type; availability 5 x 5; Czech support; a listing and a price for every pair sold | 95 of 95 |

**What "verified" does not mean here:**

- It means a value has a source and evidence, not that the listing is the cheapest one a broker offers. Listings in GBP, GBX and CHF are not recorded (the model has only CZK, EUR and USD), and for IBKR the Swiss listing of EQQQ in USD has no purchase rule (the commission is in CHF).
- `pnpm data:validate` (strict, the deploy gate in Phase 6) passes since 2026-10-14: the unused fields without a verified value were dropped from the data model (note 0066). Fio's availability of VOO and QQQ is unknown and absent.
- The tax cards on the comparison page and the table "Kde fond koupit" (with the "Česky" column) are not built yet, so those values are verified but not shown.

## Not worth verifying now

No rev. 4 screen shows these fields: fund size, 5 and 10 year returns, dividend yield, withholding rate and replication. VOO and QQQ are needed only for availability. (VTI, SCHD and VWCE were removed from the data, note 0036.) Dividend yield and withholding were verified for the old calculator and stay in the data; the tax text is written from a source, not from these fields.

## Open decisions

- **Fund set (decided, note 0036):** five twins on the comparison page, four in the hero (CSPX, VUAA, CNDX, EQQQ), VUSA on the comparison page only. "8 fondů" became "5 fondů".
- **Ticker label:** the wireframe says CSNDX. The verified iShares NASDAQ 100 fund (IE00B53SZB19) is listed as CNDX at the three brokers we checked, and its factsheet is called "csndx". The wireframe's fee of 0,33 % (from memory) differs from the verified 0,30 %. The page should use the verified figure.
