# 0008. No past-performance figures in ads or the ungated page

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

Ads and the free part of the page (calculator, headline result, top rows of the table) are public and reach cold traffic. Performance figures carry regulatory exposure and would pull the page away from its cost angle (SPEC §3.1).

## Decision

Past returns appear only inside the gated Kompas (5 and 10 year figures), each with source, "as of" date and the standard sentence "Minulá výkonnost není zárukou budoucích výsledků." Ads and the ungated page show cost and availability only.

## Alternatives considered

None recorded in the SPEC. Reasons from SPEC §3.1: keeps the public surface cost-focused and reduces regulatory exposure.

## Consequences

- Copy rule 5 in SPEC §25: no promise of returns, the table shows cost and availability.
- Any claim that cannot be proven is removed or softened (for example the absolute VOO claim in ad B, SPEC §18).
- The data model still stores `return5yPct` and `return10yPct` for the gated Kompas (0004).
