# 0033. The calculator on the page uses VOO against CSPX with DEGIRO's fee

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

The calculator needs two funds and one conversion fee. Notes 0019 and 0025 and the data work decided the funds (VOO and its European twin CSPX) and the fee (DEGIRO's Auto FX, 0,25 %, one fee for every fund). The page must show only numbers that have a source and evidence (SPEC §18).

## Decision

`calculatorInputs` (`src/server/calculator-inputs.ts`) takes the numbers for VOO, CSPX and DEGIRO from the data files, in plain percent. A fund fee, yield or withholding rate without a source and evidence makes the whole calculator band disappear; a missing conversion fee only switches that line off ("Převod korun na dolary zatím nepočítáme"). The band sits after the hero in both variants, with `id="spocitat"`. While the American fund is the cheaper one, a note under the result says where it cannot be bought, chosen from the same availability data as the hero table.

## Alternatives considered

Not recorded.

## Consequences

- With today's data VOO costs 986 Kč less than CSPX over ten years at 3 000 Kč a month, and the note says it cannot be bought at 3 of 5 firms.
- The single conversion fee is kept on purpose, although DEGIRO's document says EUR to CZK transfers are free (METHODOLOGY, "Source of fxFeePct"). The question is parked for the pre-release audit of earlier decisions.
- The 20 mapping tests were approved first, and none was changed to fit the code. They include a check that a fund fee below 0.01 (a fraction instead of a percent) fails.
- David approved the tests and said to keep the single fee on 2026-10-11, and gave no other reason.
