# 0056. "Česky" means that the interface is available in Czech

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is David's own words in chat on 2026-10-14. The context and the consequences are written by the agent from the repo; David confirms or corrects them.

## Context

The comparison table has a column "Česky" and the data has the field `czSupport` ("CZ-language support", SPEC §3.2). The phrase can mean that the interface is in Czech, or that customer support speaks Czech. David gave the five answers (IBKR no; Trading 212, XTB, DEGIRO and Fio yes) and asked the agent to stay with "Czech language".

## Decision

`czSupport` means that the interface the visitor uses is available in Czech. Each value is backed by a screenshot: the Czech interface of DEGIRO, Fio and XTB; the Czech settings of the Trading 212 app and its Czech terms page; two captures of IBKR's language menu, which lists 15 languages and no Czech. Reason (David): it is his own decision, and it is supporting information, not the main message of the site.

## Alternatives considered

- Customer support in Czech (phone, chat, e-mail): not recorded why it was not chosen; no evidence for it was collected.

## Consequences

- The column says nothing about whether anyone answers in Czech. The text on the pages must stay with "Česky" and not promise support.
- The IBKR "no" is read from two overlapping captures of a scrolled list; the record says so. If IBKR adds Czech, the value is stale after 120 days.
- The page does not show the column yet (the "Kde fond koupit" table is not built); it is on page 5 of the PDF.
