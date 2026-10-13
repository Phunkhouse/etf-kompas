# 0047. How the Fio fee and listing records were filled

Date: 2026-10-13
Status: accepted
Phase: 3

Note: David asked the agent to draft the reason, built from the evidence in the records (and, for Fio, from what the agent did). David confirmed it on 2026-10-13 without changes.

## Context

Fio was priced last. The first Fio documents (price-list PDFs) did not contain the XETRA commission or the conversion rate, so the agent held Fio back instead of estimating them. David then supplied screenshots: Fio's "Obchodování v Německu" page (commission 3,95 EUR for an order up to EUR 1 400), the "Devizové konverze" page and the e-Broker conversion screen of a demo account (rate 2,766 % for small amounts), and two searches in e-Broker for the ticker SXR8 on XETRA.

## Decision

`data/brokers.json` holds for Fio e-Broker: commission 3,95 EUR on XETRA (the standard account; the lower 1,98 EUR rate applies to accounts with DIP only), custody 0, conversion 2,766 % to EUR, and the CSPX listing as SXR8 on XETRA in EUR. Each record has the source URL, the SHA-256 of the saved screenshot or PDF and the quoted text. The listing and the availability of CSPX at Fio rest on one inference, which the records state: the ticker SXR8 is taken to be iShares Core S&P 500. David accepted this inference. Reason (drafted by the agent): a value counts only with a source and evidence (SPEC §18), so Fio stayed unpriced until the commission and the conversion rate could be quoted from Fio's own pages, and the one inference is written into the records instead of hidden.

## Alternatives considered

- Estimating the commission and conversion from other brokers' fees or from the Fio PDFs: rejected by the agent because it would be a guess presented as data; not discussed further.

## Consequences

- Fio is priced and, at 30 778 Kč over 10 years for CSPX, is the dearest broker; the headline amount of the page (and the 28 302 Kč in hero b) therefore rests on these records.
- The e-Broker rate is a demo-account screen, not a published price list. If Fio publishes a rate or changes it, the record is stale after 45 days (the freshness rule for broker fees, note 0004).
- The record says the 3,95 EUR holds up to an order of EUR 1 400; the calculator's largest deposit (20 000 Kč, about EUR 800) is below that.
