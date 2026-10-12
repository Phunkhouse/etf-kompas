# Calculator methodology, version 2 (draft)

Status: **draft for review** (after wireframe rev. 4, decision note 0035). It replaces [METHODOLOGY.md](METHODOLOGY.md) once approved and implemented; until then the current calculator keeps working. Anything marked **Proposed** is not in the SPEC and needs David's approval. Formulas are written so that they can be checked in a spreadsheet.

## 1. What changes, and why

Rev. 4 asks "what does the fund you can buy cost you over 10 years, and how much does the broker change it". The result has three parts: **fund fee, conversion of korunas, broker fees** (decided: broker fees = purchase commission **and** custody fee). Taxes and inflation are not counted.

|                             | Version 1                         | Version 2                                                      |
| --------------------------- | --------------------------------- | -------------------------------------------------------------- |
| Question                    | American fund against its twin    | what the buyable twin (CSPX) costs, per broker                 |
| Parts                       | fund fee, conversion, withholding | fund fee, conversion, **broker fees**                          |
| Dividend yield, withholding | in the formula                    | **not in the formula** (still in the data, used for text only) |
| Gap to another fund         | headline                          | gone                                                           |
| Broker commissions          | out of scope (SPEC §21)           | **in scope**                                                   |
| Result per broker           | no                                | yes; the spread between brokers is the saving box              |

The SPEC §21 sentence "broker commissions: out of scope" is therefore changed. **Proposed.**

## 2. Inputs

| Name            | Unit                   | Meaning                                                                                                                              |
| --------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `monthly` D     | whole Kč               | one investment at the end of every month                                                                                             |
| `years` Y       | years                  | 5, 10 or 20                                                                                                                          |
| `grossReturn` g | % p.a.                 | the same for every fund, default 6, 0 to 12                                                                                          |
| `ter` t         | % p.a.                 | the fund's annual fee (`0.07` means 0,07 %)                                                                                          |
| listing         | currency and venue     | how the chosen broker sells the fund, for example `USD` on the London Stock Exchange                                                 |
| broker fees     | see §3                 | verified per broker                                                                                                                  |
| rates           | Kč per EUR and per USD | the Czech National Bank rate on a stated date, a sourced record (decided). **Proposed:** the freshness limit of broker fees, 45 days |

Percentages are plain numbers everywhere (as in the data files). Lowercase symbols below are fractions: `g = grossReturn / 100`, `t = ter / 100`.

## 3. The broker fee model (**Proposed**)

Every leaf is a sourced record (`value`, `sourceUrl`, `asOf`, `verifiedBy`, `verifiedOn`, `evidence`), like the rest of the data. A value without a source and evidence is "not verified", and a broker with a needed value not verified has **no price**.

```
broker.listings[fundId]  = { currency: 'CZK' | 'EUR' | 'USD', venue: string }

broker.fx[currency]      = percent of the converted amount      // CZK needs none
                           (a missing currency = not verified)

broker.purchase[]        = rules, the first whose `venues` contains the listing's venue wins;
                           `venues: null` matches any venue
  rule = { venues, currency, fixed, percent, min, max }          // per order

broker.custody           = { currency, annualFixed, annualPercent }
```

- **Purchase fee per order**, in the rule's currency: `clamp(fixed + percent/100 x amount, min, max)`; `min` and `max` are optional. The amount is the deposit `D` in Kč converted at the rate, so there is no circle (the fee is not taken from a smaller amount).
- **One order per month.** A free-order allowance ("first order of the month is free") means `fixed = 0` for our order; say so in `evidence`.
- **Annual fixed custody fee** (for example a fee per year per exchange used) is spread evenly over the 12 months. **Annual percent** custody fee is a drag on the return, like the fund fee.
- The fee **depends on the listing**, not only on the broker: the DEGIRO document charges €0 for a fund on its Tradegate selection and €2 on other exchanges, plus a €1 handling fee per order, and €2.50 a year per foreign exchange used. The same document says EUR to CZK is free. The model has to say which listing it prices.

**Known simplifications, to be stated on the "Jak počítáme" page:** a cap on the annual fixed fee as a share of the account is ignored (it overstates the fee for very small accounts); trading spreads and bid-ask differences are not counted; one order a month.

## 4. Formulas

`m(r) = (1 + r)^(1/12) - 1` and `A(r) = ((1 + r)^Y - 1) / m(r)` (for `r = 0`, `A = 12 x Y`): the future value of one unit paid at the end of each month. This is unchanged from version 1 (METHODOLOGY §3).

Per broker, in Kč. `rate` is Kč per unit of the listing currency (`1` for CZK).

```
f   = fx[listing currency] / 100                       (0 for a CZK listing)
P   = clamp(fixed x rate + percent/100 x D, min x rate, max x rate)    purchase fee per order, Kč
K   = custody.annualFixed x rate                       annual fixed custody, Kč per year
c   = custody.annualPercent / 100
D'  = max(0, D x (1 - f) - P - K / 12)                 invested each month

S0 = D x A(g)                      no costs
S1 = D x A(g - t)                  + fund fee
S2 = D x (1 - f) x A(g - t)        + conversion
S3 = D' x A(g - t - c)             + broker fees = the value left (illustrative value)

part_fund   = S0 - S1
part_fx     = S1 - S2
part_broker = S2 - S3
Cost        = S0 - S3
```

- The parts add up to `Cost`, in the display order: fund fee, conversion, broker fees. Costs interact a little, so the order matters; broker fees are added last and absorb the interaction.
- **Rounding** is as in version 1: `total = round(Cost)`, each part is rounded, and the largest part (the first on a tie) is set to `total - (sum of the others)`.
- **Illustrative value** "Ilustrativní hodnota po 10 letech" is `S3`, and "z toho poplatky" is `Cost`. The two add up to `S0`.
- If the fees are larger than the deposit, `D'` is 0 and nothing is invested. The function does not fail.

## 5. Brokers, and the saving box

- A broker is **priced** for a fund when the fund's availability there is verified as sold, the listing is verified, and every fee value that the formula needs is verified. Otherwise it has no price and shows `[ověřit]`.
- **Spread** = highest `Cost` minus lowest `Cost` among priced brokers. The green box "až X XXX Kč" shows only with **at least two priced brokers** (wireframe rule 4). **Proposed:** it is also hidden when the spread rounds to 0 Kč.
- **The headline number** "bude stát X XXX Kč" is the `Cost` of the priced broker with the **highest** cost, so that the saving box reads as "až" (decided). With one priced broker the headline is that broker's cost and there is no spread. With none, the result shows only the fund-fee part and no total (decided, section 8).
- The page sorts nothing by price and never says "nejlevnější" (wireframe rule 1).

## 6. Clamping and units (unchanged, **Proposed** as in version 1)

`monthly` is rounded and clamped to 0 to 20 000 (the slider keeps 500 to 20 000 in steps of 500); `years` snaps to 5, 10 or 20; `grossReturn` is clamped to 0 to 12. Money that crosses the API boundary is a whole number of Kč.

## 7. Golden cases (to be computed by David)

Inputs only. The expected values are for David to calculate in a spreadsheet from the formulas above, as in version 1. G1 and G2 repeat the verified cases of version 1 with the new parts at zero, so their answers should be 2 400 and 1 672.

| #   | D     | Y   | g   | t    | listing      | f    | purchase rule                   | custody                   | What it checks                                                  |
| --- | ----- | --- | --- | ---- | ------------ | ---- | ------------------------------- | ------------------------- | --------------------------------------------------------------- |
| G1  | 2 000 | 10  | 0   | 0    | CZK          | 1    | none                            | none                      | `r = 0`; conversion only (v1 G1: 2 400)                         |
| G2  | 1 000 | 5   | 6   | 1    | CZK          | 0    | none                            | none                      | fund fee only (v1 G2: 1 672)                                    |
| G3  | 3 000 | 10  | 6   | 0.5  | CZK          | 0.5  | fixed 20 Kč                     | fixed 60 Kč a year, 0.1 % | all three parts                                                 |
| G4  | 1 000 | 10  | 6   | 0.2  | CZK          | 0    | 0.5 %, min 20 Kč                | none                      | the minimum of a percent fee applies                            |
| G5  | 3 000 | 10  | 6   | 0.07 | USD at 25 Kč | 0.25 | fixed 1 USD + 0.1 %, max 10 USD | fixed 2 USD a year        | currency conversion of fixed fees, a maximum that does not bind |

## 8. Decided, and still open

**Decided by David on 2026-10-12** (note 0037; he accepted these proposals and gave no further reason):

1. Broker fees are the purchase commission **and** the custody fee.
2. Fees are static data in `data/`, not fetched. The loading and failure states of the wireframe are dropped.
3. **Headline number:** the cost at the priced broker with the highest cost (section 5).
4. **Withholding and dividend yield** are not in the formula.
5. **Exchange rates:** the Czech National Bank rate on a stated date, a sourced record.
6. The saving box is **hidden when the spread is 0 Kč**; **one order a month** (a free first order is entered as `fixed = 0`).

7. **No priced broker:** the calculator shows only the fund-fee part ("roční poplatek fondu") with the rest as `[ověřit]` and no total. DEGIRO is priced first, because its schedule is on file.
8. **Headline wording** for now: "u ověřených brokerů vás to bude stát nejvýš X XXX Kč" (a copy change to the wireframe, for the copy review).

**Still open:**

C. **Which listing is priced.** A broker may sell a fund in several listings. DEGIRO sells CSPX on the London Stock Exchange in dollars and on Euronext Amsterdam in euros (screenshots of 2026-10-11). In dollars the Auto FX fee of 0,25 % applies; in euros the conversion from korunas is free, and the purchase fee is the same €2 plus €1 handling. The wireframe (rule 5) counts CSPX in dollars. Suggested: price the **cheapest listing the broker offers** and say so on the "Jak počítáme" page, with the row label following the listing ("převod korun na eura" or "na dolary"). Pricing only the dollar listing would overstate DEGIRO's cost.
