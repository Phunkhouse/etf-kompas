# 0006. NYSE ETFs vs UCITS: how the page frames them

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

The brief talks about "NYSE-traded ETFs", and Czech searchers type names like VOO. US-domiciled ETFs generally cannot be bought by EU retail clients at most EU brokers (no PRIIPs KID), and Czech investors in practice buy UCITS ETFs that track the same indices. Tax treatment differs by domicile and must be verified against primary sources (SPEC §1).

## Decision

Keep "NYSE" in the hook, because it is what people search for. Make the page's value the honest answer: what these ETFs really cost from Czechia, and which UCITS equivalent can actually be bought. Availability is verified per broker, never assumed.

## Alternatives considered

No alternative framing is recorded in the SPEC. Reasons from SPEC §1: this is the differentiated angle, because most content states a TER and stops, while this page converts it into Kč, includes tax drag, and answers "can I even buy it?".

## Consequences

- The data model holds both US-listed and UCITS funds (0004), and the calculator compares twins within an `indexGroup`.
- The page must not imply a tax advantage the data does not show (SPEC §21).
- The decision and its rationale go into the README (SPEC §1, §16).
