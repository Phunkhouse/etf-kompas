# 0069. Pre-release audit: unused fund fields are dropped, and three older notes are marked

Date: 2026-10-14
Status: accepted
Phase: 6

Note: David chose the options below on 2026-10-14 from the findings the agent prepared ("Drop them" and "New audit note, old ones marked"). He gave no reason beyond choosing them, and none is invented here. The findings, the checks and the consequences are the agent's.

## Context

Before release David wanted to compare earlier decisions: the single conversion fee for every fund (note 0019), the dividend yield per index (note 0023) and the 15 % withholding rate for all funds (note 0025). Read against the code and data of 2026-10-14:

- **0019, one conversion fee.** Resolved by calculator version 2 (note 0037): conversion is now per broker and per listing currency (DEGIRO has EUR 0 and USD 0.25, the others their own values, a CZK listing pays none). The concern that the euro-listed twin pays no fee but is charged one no longer applies. **The breakdown rule** (costs added one at a time, the parts add up to the total, the rounding remainder goes to the largest part) is carried into version 2 (METHODOLOGY-V2 §4) with different parts: fund fee, conversion, broker fees. The note still names withholding as the third part.
- **0023 and 0025, dividend yield and withholding.** Version 2 took both out of the formula. A search of `src/` found no page, calculator or PDF that uses them, nor the fields `indexName`, `domicile`, or the name, ISIN and fee of VOO and QQQ. They were still stored and validated.
- **The finding.** The strict gate (the Vercel build and CI on `main`) fails on a stale record. The VOO factsheet records would have gone stale on 2026-10-29, and `indexName`, `domicile`, the dividend yield and the withholding rate for all funds between 2027-01-28 and 2027-02-09, stopping deploys over data that nobody sees.

## Decision

Drop what nothing uses (David: "Drop them").

- Removed from the model and the files: `dividendYieldPct`, `withholdingRate`, `indexName` and `domicile` for every fund; every record of VOO and QQQ (name, ISIN, fee). VOO and QQQ stay as ticker, region and index group, named only for the broker availability.
- `name`, `isin`, `distribution` and `ter` are optional in the schema (the twins need all four, which `pnpm data:gaps` checks screen by screen: 138 of 138 as before).
- Seven sources that nothing cites any more were removed from `data/sources.json` (the VOO factsheet and prospectus, the QQQ page and prospectus, the S&P 500 index factsheet, the Czech-US treaty, the US-Ireland convention). Two earlier unreferenced entries (Trading 212 costs and charges, XTB terms) were left.
- Notes 0023 and 0025 are marked superseded by this note. Note 0022 (the domicile convention for US funds) loses its subject with the field and is marked the same way. Note 0019 is marked partly superseded by 0037 and this note.
- This does not change what the page shows.

## Alternatives considered

- Keep the fields but exempt them from the freshness check: needs a change of the validator and a note; the unused data would stay unchecked by date.
- Keep them as they are and refresh by hand when the gate fails.

## Consequences

- The first date the gate fails is now 2026-10-25 (the EQQQ key information document, which the page uses), then 2026-11-15 (the XTB fees); the VOO date of 2026-10-29 and the January 2027 dates are gone.
- A future tax explanation needs its own source from Finanční správa and its own fields; the withholding text of the old notes is no source for it. The Czech-US text of 1994 was never checked for amendments.
- The twins' ISINs, which no code reads, are kept for now and go stale in late January 2027; they are the same kind of problem and were not part of this choice.
- The verified values of the dropped fields remain in the git history.
- The S&P factsheet question of note 0023 ("institutional use only") disappears with the field.
