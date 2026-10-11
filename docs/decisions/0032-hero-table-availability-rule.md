# 0032. The hero table says "Ano", "Ne" or "[ověřit]" by a fixed rule

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

The hero table shows whether each fund can be bought from Czechia. Note 0029 says "Ne" may only be shown where there is a source per firm, and adds the amber `[ověřit]` state. Today three of five firms are verified for the US funds, and Fio and IBKR are not.

## Decision

For a fund, over all firms in `data/brokers.json`: "Ano" when at least one firm is verified as selling it; "Ne" only when every firm is verified as not selling it; otherwise `[ověřit]`, with "Ne u {n} z {total} firem" under it. A value counts as verified only when it has a source URL and evidence. A fund with no firms at all is never "Ne". The highlighted row is every "Ano" row, not the cheapest. The rule is in `src/server/availability.ts`, tested by 20 cases written and approved before the implementation.

## Alternatives considered

Not recorded.

## Consequences

- With today's data VOO and QQQ show `[ověřit]` with "Ne u 3 z 5 firem", and CSPX shows "Ano". Verifying Fio and IBKR turns the first two into "Ne" without a code change.
- The footnote under the table is chosen from the same data, so it never says the highlighted fund is not the cheapest unless that is true.
- The rule does not check how old a record is. Staleness is the data validator's job.
- David approved the test list and the five choices behind it on 2026-10-11 and gave no further reason.
