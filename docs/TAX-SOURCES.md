# Tax statements: what is on the page, what is still open

Updated 2026-10-14 (after Phase 6). **Status: the sourced statements below wait for David's reading and a reviewer's check; the open items need a qualified reviewer.** Unknown stays `TODO_VERIFY` / `[ověřit zdroj]` (CLAUDE.md, SPEC §18).

## 1. On the page (sourced records in `data/tax.json`)

I read each provision in the full text on 2026-10-14 (not through a summary) and saved the SHA-256 of the page in the record's `evidence`. The records carry `verifiedBy` and `verifiedOn` as `TODO_VERIFY` until David has read the same passages; the page shows nothing until then.

| Record                    | Statement                                                             | Where it stands                                                                                                                                                                     |
| ------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timeTestYears`           | A sale after more than 3 years is exempt                              | ZDP § 4 odst. 1 písm. u), [zakonyprolidi.cz](https://www.zakonyprolidi.cz/cs/1992-586), version 157 (valid 1 Aug to 31 Dec 2026)                                                    |
| `annualLimitKc`           | Sales up to 100 000 Kč a year (the sum of the sale prices) are exempt | ZDP § 4 odst. 1 písm. t), same text                                                                                                                                                 |
| `exemptionsExclusive`     | The two exemptions cannot be combined                                 | [Finanční správa, "Ostatní"](https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/fyzicke-osoby/ostatni); same in Pokyn GFŘ-D-59, point 20                                       |
| `businessAssetsExcluded`  | Neither exemption holds for securities in business assets             | ZDP § 4 odst. 1 písm. t) and u)                                                                                                                                                     |
| `foreignIssuerSecurities` | A security of a foreign issuer counts as a security                   | [Pokyn GFŘ-D-59](https://financnisprava.gov.cz/assets/cs/prilohy/d-sprava-dani-a-poplatku/Pokyn_GFR-D-59.pdf), point 19 to § 4 odst. 1 (written with the earlier letters w) and x)) |
| `dividendsCapitalIncome`  | A share of a fund's profit is capital income                          | ZDP § 8 odst. 1 písm. a) ("podíly na zisku … podílového fondu, je-li v něm podíl představován cenným papírem")                                                                      |

Also read, **not on the page on purpose:**

- The 40 million Kč cap on the time test is gone for securities from 1 Jan 2026 (the [2026 press release](https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2026/danove-novinky-pro-rok-2026); the law keeps 40 000 000 Kč only in § 4 odst. 3 for crypto-assets).
- Exempt income above 5 000 000 Kč must be notified (§ 38v); the fine is 0,1 %, 10 % or 15 % (§ 38w). Not useful to this audience.
- The Czech-Ireland treaty (163/1996 Sb.): Article 13(5) taxes a gain only in the seller's state of residence; Article 10(2) caps dividend withholding at 5 % or 15 %. Neither is used yet.

## 2. Open: for a qualified reviewer

These stay `[ověřit zdroj]`. For each, what I looked for and did not find.

1. **A gain on an accumulating fund before the sale (the main open item).** No Finanční správa statement found. The reasoning "nothing is paid out, so no income under § 3 and § 8" is ours, not a source.
2. **Foreign dividends: the rate, the credit of foreign tax, Příloha č. 3.** § 38f was not read in the current law, and the current instruction for Příloha č. 3 was not read (the 2009 one must not be used). What the Czech tax on a dividend is (15 %, 23 % above a threshold) is not sourced here either.
3. **Whether Ireland withholds tax on payouts of a UCITS fund to a Czech resident.** The treaty only caps it; it does not say what Ireland charges.
4. **FIFO, and whether the time test runs per purchase.** § 4 odst. 1 písm. u) speaks of the time "mezi nabytím a úplatným převodem tohoto cenného papíru". I found no rule on the order of sale in § 10 (§ 10 odst. 4 is the tax base; § 10 odst. 5 the expense). Monthly purchases need a reviewer's reading.
5. **Whether a unit of an Irish UCITS ETF is a "cenný papír".** D-59 says a foreign issuer does not matter; it does not name ETFs.
6. **"Přiznání": what to put in the return and where.** No text written.
7. **US estate tax (SPEC §1).** Never sourced.
8. **May the page say any of this without a licence (SPEC §19, question a)?** A legal question; the addendum's "yes" has no source.
9. **The "Ostatní" page of Finanční správa still names písm. q) and describes the 40 million Kč cap**; the law and the press release disagree with it. A reviewer should note which text a visitor may meet.
10. **The third card of "Za co platíte"** stays `[ověřit zdroj]` (David, 2026-10-14): a sale exemption does not fit a card about costs you do not see.

Not used on the page and not checked: the Czech-US treaty (32/1994 Sb.) and the US-Ireland convention, Article 10 (the US-listed funds are not on the page; the fund-level US withholding was read for note 0025, but the sources were dropped with note 0069).

## 3. Keeping it current

A statement about the law goes stale when the law changes, so each record has an `asOf` and the strict validator fails after 120 days. To renew: read the passage again, set `asOf` and `evidence`, and update `verifiedOn`. Next: the "refresh data" check in the monthly routine.
