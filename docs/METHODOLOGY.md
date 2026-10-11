# Calculator methodology

Status: **draft for review** (Phase 2, PR A; golden cases verified by David). Source of truth is SPEC §21; this file writes its formulas out step by step so they can be checked in a spreadsheet. Anything marked **Proposed** is not in the SPEC yet and needs David's approval.

The calculator shows the **cost drag** of holding a fund, in Kč. It is an illustration of costs, not a forecast of returns.

## 1. Inputs

| Name               | Unit                 | Meaning                                                | Valid range                   |
| ------------------ | -------------------- | ------------------------------------------------------ | ----------------------------- |
| `monthly`          | whole Kč             | Deposit at the end of every month                      | 0 to 20 000 (clamped, see §6) |
| `years`            | years                | Horizon                                                | 5, 10 or 20                   |
| `grossReturn`      | % p.a., plain number | Same for every fund (default 6)                        | 0 to 12 (**Proposed** cap)    |
| `ter`              | % p.a., plain number | Fund's annual cost (`0.07` means 0,07 %)               | from data, `>= 0`             |
| `dividendYieldPct` | % p.a., plain number | Dividend yield                                         | from data, `>= 0`             |
| `withholdingRate`  | %, plain number      | Tax withheld on dividends                              | from data, 0 to 100           |
| `fxFeePct`         | %, plain number      | Currency-conversion fee on every deposit; absent = off | from broker data, `>= 0`      |

No initial lump sum (decision note 0015). Percent values are plain numbers everywhere, as in the data files. Below, lowercase symbols are fractions: `g = grossReturn / 100`, `t = ter / 100`, `y = dividendYieldPct / 100`, `w = withholdingRate / 100`, `f = fxFeePct / 100` (0 when off), `D = monthly`, `Y = years`, `n = 12 x Y`.

### Source of `dividendYieldPct`

The yield is one number per index, the same for every fund that tracks it, so twins differ only in cost (decision note 0023).

- **S&P 500** (VOO, CSPX, VUAA): the index's indicated dividend yield, **1.11 %**, as of 2026-09-30 (S&P Dow Jones Indices factsheet). "Indicated" means the current dividend rate divided by price, so it looks forward. It is not a trailing 12-month figure.
- **Nasdaq-100** (QQQ, CNDX): Nasdaq does not publish an index dividend yield in the documents we reviewed (the NDX factsheet and two other Nasdaq documents). The figure is the 30-day SEC yield of Invesco QQQ Trust, **0.37 %**, as of 2026-10-08, from Invesco's page printed on 2026-10-11. The SEC yield is a fund figure and is calculated after fund expenses.

The two measures are not the same kind of number. The dividend line is small next to the fund fee, but the difference should be stated wherever the figures are shown.

### Source of `withholdingRate`

15 % for all five funds (decision note 0025). VOO and QQQ: Czech-US treaty, Article 10(2)(b), which needs Form W-8BEN. CSPX, VUAA and CNDX: US-Ireland convention, Article 10(2)(b), corroborated by the funds' annual reports (actual withholding 14.1 to 14.4 % of dividend income). The prospectuses of the Irish funds state no rate.

## 2. Rates

- `r_gross = g`
- `r_net = g - t - y x w` (TER and dividend withholding both reduce the annual return)
- Monthly rate for any annual rate `r`: `m(r) = (1 + r)^(1/12) - 1`

## 3. Future value of month-end deposits

For a deposit `d` at the end of each of `n` months at annual rate `r`:

```
FV(d, r) = d x ((1 + m)^n - 1) / m          where m = m(r)
```

Because `(1 + m)^12 = 1 + r`, we have `(1 + m)^n = (1 + r)^Y`, so the closed form is

```
A(r)     = ((1 + r)^Y - 1) / m(r)           (annuity factor)
FV(d, r) = d x A(r)
```

Special case `r = 0`: `m = 0`, and `A(0) = n` (just the sum of the deposits). Deposits are made at the **end** of each month, so the last deposit earns no growth.

Spreadsheet check: `=D*((1+r)^Y-1)/((1+r)^(1/12)-1)`, or a month-by-month loop `balance = balance x (1 + m) + d`. The unit tests compare the closed form against such a loop.

## 4. Total cost

```
FV_gross = D x A(r_gross)                      (no costs, full deposits)
FV_net   = D x (1 - f) x A(r_net)              (FX fee on each deposit, reduced return)
Cost     = FV_gross - FV_net                   (rounded once to whole Kč at the output)
```

If `fxFeePct` is absent the FX component is **off**: `f = 0` and the result carries `fxApplied: false` so the UI can say so (SPEC §21). Out of scope, as stated in SPEC §21: broker commissions, spreads, Czech income tax, inflation, estate tax.

## 5. Breakdown (**Proposed**, not in SPEC §21)

The wireframe splits the cost into fund fee, currency conversion and tax withheld by the USA. The split is a formula choice, so it needs approval. Costs are added **one at a time, in the wireframe's order**, and each part is the drop in the final value caused by the cost just added:

```
S0 = D x A(g)                          (no costs = FV_gross)
S1 = D x A(g - t)                      (+ TER)
S2 = D x (1 - f) x A(g - t)            (+ FX fee)
S3 = D x (1 - f) x A(g - t - y x w)    (+ dividend withholding = FV_net)

part_ter         = S0 - S1
part_fx          = S1 - S2
part_withholding = S2 - S3
```

The parts add up exactly to `Cost = S0 - S3`. Costs interact slightly (the FX fee shrinks the base on which the TER bites), so the order matters a little; withholding, added last, absorbs the interaction. The order matches the display order.

**Rounding.** Internal values are never rounded. At the output: `total = round(Cost)`; each part is rounded; the **largest** part (the first one in the order above on a tie) is then set to `total - (sum of the other two rounded parts)`. So the displayed parts always add up to the displayed total.

The breakdown is computed **per fund**. The wireframe shows it under a gap headline; whether the lines explain one fund's cost or the gap is a display decision for Phase 3 and does not change the maths. With a single `fxFeePct` for every fund the FX part is about the same for twins, so an FX line in the gap would be near 0.

## 6. Clamping (**Proposed**)

- `monthly`: rounded to a whole number, clamped to 0 to 20 000. The pure function accepts 0 (cost 0, as the SPEC tests require); the slider in the UI starts at 500 and moves in steps of 500.
- `years`: anything outside {5, 10, 20} goes to the nearest of them; a tie goes to the smaller value.
- `grossReturn`: clamped to 0 to 12.
- Non-finite numbers (`NaN`, `Infinity`) are replaced by the default for that input.

## 7. Gap versus the cheapest alternative

Compare with the lowest-`Cost` fund in the same `indexGroup`, computed with the same inputs. The gap is `Cost(fund) - Cost(cheapest)`, so it is 0 for the cheapest fund. A fund alone in its group (VTI, VWCE, SCHD) has **no gap** (`null`), and the UI shows none. Phase 2 compares a fund only with its twin (VOO, CSPX, VUAA for S&P 500; QQQ and CNDX for Nasdaq 100).

## 8. Money on the API boundary

Every amount that leaves `calc.ts` is an integer number of Kč. Percentages are plain numbers.

## 9. Golden cases (computed by David)

SPEC §21 requires at least 3 cases derived by hand by the reviewer, not the agent. These inputs are **invented test values, not real fund data**. Results below were computed by David in a spreadsheet; the agent copies them into tests unchanged.

| #   | monthly | years | grossReturn | ter | dividendYieldPct | withholdingRate | fxFeePct | What it checks                                  | Expected `Cost` (Kč) | Derivation                                                                                                                                                                                                                                                               |
| --- | ------- | ----- | ----------- | --- | ---------------- | --------------- | -------- | ----------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G1  | 2 000   | 10    | 0           | 0   | 0                | 0               | 1        | `r = 0` branch; cost is exactly 1 % of deposits | 2 400                | Verified by David in a spreadsheet. S0 = 240 000, S3 = 237 600. Parts: TER 0, FX 2 400, withholding 0.                                                                                                                                                                   |
| G2  | 1 000   | 5     | 6           | 1   | 0                | 0               | none     | TER only, no FX, no withholding                 | 1 672                | Verified by David in a spreadsheet. S0 = 69 485.79, S1 = S2 = S3 = 67 813.74. Parts: TER 1 672, FX 0, withholding 0.                                                                                                                                                     |
| G3  | 3 000   | 10    | 6           | 0.5 | 2                | 15              | 0.5      | All three components, and the three parts (§5)  | 21 913               | Verified by David in a spreadsheet. S0 = 487 420.33, S1 = 475 084.17, S2 = 472 708.75, S3 = 465 507.74. Rounded parts: TER 12 336, FX 2 375, withholding 7 201 add up to 21 912, so the largest part (TER) takes the remainder: TER 12 337, FX 2 375, withholding 7 201. |

For G1 the answer needs no spreadsheet: deposits total `2 000 x 120 = 240 000`, and the cost is 1 % of that. For G2 and G3 use the formulas in §3 to §5.
