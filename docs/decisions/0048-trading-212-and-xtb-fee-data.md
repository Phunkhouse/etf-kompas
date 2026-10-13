# 0048. How the Trading 212 and XTB fee records were filled

Date: 2026-10-13
Status: proposed
Phase: 3

Note: David asked the agent to draft the reason. It is built from the evidence in the records; David should confirm or correct it.

## Context

Hero variant b and the saving box need at least two priced brokers. DEGIRO was priced first; Trading 212 and XTB were added so the page shows a real spread. Both publish a fee table, and David saved the pages and PDFs.

## Decision

`data/brokers.json` holds for Trading 212: commission 0 (stated on its "Podmínky a poplatky" page and in the Costs & Charges Disclosure PDF), custody 0, conversion 0,15 %, CSPX as an LSE listing in USD. For XTB: commission 0 below a monthly turnover of EUR 100 000 (quoted from the table of 30 September 2026), custody 0 for the standard case, conversion 0,5 %, CSPX as the CSPX.UK listing in USD. Each record has the source URL, the SHA-256 of the saved file and the quoted text; `asOf` is the date of the document (XTB: 2026-09-30) or the capture date when the document has none (note 0024). Reason (drafted by the agent): the calculator may use only values with a source and evidence (SPEC §18), and both brokers state these fees in their own documents, so the records quote them.

## Alternatives considered

Not recorded.

## Consequences

- Both brokers are priced at the low end (2 476 Kč and 4 176 Kč for CSPX over 10 years), which makes the spread against Fio large; the page's saving figure depends on these two records and on Fio's.
- Broker fee records go stale after 45 days: the Trading 212 and XTB records need a check by about 27 November 2026 (XTB's table is dated 30 September, so it goes stale earlier, around 14 November).
- XTB's zero commission has a turnover limit and its account fee has a condition; the records say so, and the calculator's one order a month stays below both.
