# 0025. Dividend withholding rate is 15 % for all five funds

Date: 2026-10-11
Status: superseded by 0069 (the withholding rate was dropped)
Phase: 3

## Context

The calculator needs the share of a dividend withheld as tax (`withholdingRate`). For VOO and QQQ held by a Czech investor, the Czech-US treaty (Article 10(2)(b)) caps US withholding at 15 % of the gross dividend, and the investor claims it with Form W-8BEN. For the Irish funds (CSPX, VUAA, CNDX) the fund suffers the tax. The iShares VII and Vanguard Funds prospectuses only say the funds "may not be able to benefit" from treaty rates and name no rate. The US-Ireland convention (Article 10(2)(b)) sets 15 %, and the Vanguard annual report (year ended 30 June 2025, p. 359) says the fund return is adjusted by 15 %. The audited annual reports show actual withholding of 14.1 % (CSPX), 14.4 % (CNDX) and 14.1 % (VUAA) of dividend income. The reports are for years ended 31 July 2025 (iShares) and 30 June 2025 (Vanguard).

## Decision

`withholdingRate` is 15 for all five funds. VOO and QQQ cite the Czech-US treaty. CSPX, VUAA and CNDX cite the US-Ireland convention, with the annual reports as corroboration in `evidence`.

## Alternatives considered

- The effective rate of each Irish fund from its annual report: David's first choice. Not chosen. The reports are more than 14 months old, past the 120-day limit, so the draft validator would report STALE and CI would fail (decision note 0024). The agent also pointed out that VOO and QQQ would stay at 15 % while the twins get 14.1 to 14.4 %, which gives the twins a small advantage from the method, not from the funds.

## Consequences

- If the real rate is a little below 15 %, the calculator slightly overstates the withholding line, for every fund alike.
- VOO and QQQ depend on a W-8BEN on file at the broker.
- The Czech-US text is the 1994 publication. The agent could not read the current e-Sbírka page, so later amendments to Article 10 are not checked.
- Refresh the annual reports when new ones appear. If the effective rate moves away from 15 %, revisit this note.
- David's reason for 15 for all: the annual reports are dated. The like-for-like point above was raised by the agent and he chose 15 after hearing it.
