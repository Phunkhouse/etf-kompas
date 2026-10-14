# 0072. Tax statements are sourced records, shown only when verified

Date: 2026-10-14
Status: proposed
Phase: 6

Note: the reason is David's ("we want to fill as much as possible with data and knowledge we have at our disposal", 2026-10-14). The context, the alternative and the consequences are written by the agent.

## Context

The tax cards of the comparison page and page 4 of the PDF were all `[ověřit zdroj]` (note 0069, `docs/TAX-SOURCES.md`). A part of what they could say had been read in the law and in Finanční správa's own texts. SPEC §18 wants every statement behind a source, and the data layer already knows how to hold one.

## Decision

Keep the few tax statements we could read in `data/tax.json`, as sourced records like the other data (`value`, `sourceUrl`, `asOf`, `verifiedBy`, `verifiedOn`, `evidence`). The sentences are built from them in `src/server/tax-statements.ts` with the wording in `taxCopy`; a sentence shows only with a verified record and links its source. What we could not find stays `[ověřit zdroj]`, listed in `docs/TAX-SOURCES.md` for the reviewer.

The reason is David's: fill as much as possible with the data and knowledge we have.

## Alternatives considered

- Plain sentences in `copy.ts` with a source line: offered to David and not chosen. (The agent's note: it would skip the validator's freshness and evidence rules.)

## Consequences

- `verifiedBy` and `verifiedOn` stay `TODO_VERIFY` until David has read the passages, so the strict validator, the seed-data test and the deploy gate fail until then, and the page shows no tax sentence.
- A statement that needs a number from the law gets it from the record, so a change of the law is a data change plus a re-read.
- Records go stale after 120 days; the monthly data refresh must include them.
