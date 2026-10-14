# 0023. One dividend yield per index, with a fund-based exception for the Nasdaq-100

Date: 2026-10-11
Status: superseded by 0069 (the dividend yield was dropped)
Phase: 3

## Context

The calculator needs a dividend yield to price the withholding tax (`docs/METHODOLOGY.md`). Fund documents do not give a comparable one: only the VUAA factsheet prints an equity yield, and accumulating UCITS funds have no distribution yield. Twin funds hold the same shares, so they should use the same yield and differ only in cost. S&P Dow Jones Indices publishes an "Indicated Div Yield" for the S&P 500 (1.11 %, 2026-09-30). The Nasdaq-100 factsheet, the "NDX vs. SPX" two-pager and the December 2025 one-pager publish none. The Invesco QQQ Trust page, printed 2026-10-11, shows a 30-day SEC yield of 0.37 % as of 2026-10-08.

## Decision

Use one yield per index. For the S&P 500 it is the index's indicated yield from the index provider. For the Nasdaq-100, where the index provider publishes none, it is the 30-day SEC yield of Invesco QQQ Trust, and CNDX shares it. METHODOLOGY states which measure each number is.

## Alternatives considered

- A fund-level yield for every fund: proposed by the agent, not chosen. Accumulating UCITS funds do not publish one, and the twins would get different numbers for the same shares.

## Consequences

- The two indices use different kinds of yield (an index's indicated yield and a fund's SEC yield, which is net of fund expenses). The dividend line is small next to the fund fee, but any copy that shows the numbers must not call them the same measure.
- The S&P factsheet is marked for institutional use. We store only the number, the date and the file hash, not the PDF. Whether the figure may feed a retail page is an open question for the README's known gaps.
- The S&P figure is an indicated (forward-looking) yield, where the first proposal was a trailing 12-month one. David accepted this on 2026-10-11 without giving a reason.
- Both yields go stale. Refresh them with the data refresh.
- David's reason for the Nasdaq-100 exception: "Nasdaq publishes no index yield". He chose 0.37 % as of 2026-10-08 on 2026-10-11.
