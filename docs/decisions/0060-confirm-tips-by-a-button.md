# 0060. The opt-in is confirmed by a button, not by opening the link

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reason is drafted by the agent; David accepted it on 2026-10-14 ("I have accepted your reason"). Context and consequences are written by the agent.

## Context

The drawing confirms the tips on one click of the button in the opt-in e-mail. Mail providers and security scanners (for example Outlook's safe links) open the links in an e-mail before the reader does. If opening the link confirmed the consent, a scanner could "agree" for the visitor, and the double opt-in would prove nothing.

## Decision

The link opens a page "Potvrďte odběr tipů" with a button "Ano, posílejte mi tipy". Only the button (a POST) sets `consent_confirmed_at`. A confirmed link shows "Odběr tipů potvrzen" and does not move the date. Unsubscribing, in contrast, happens on opening the link, as drawn, because a mistaken unsubscribe is harmless and "Přihlásit zpět" undoes it. Reason (drafted by the agent): a consent has to be given by the person, not by software that opens links.

## Alternatives considered

- Confirming on opening the link, as drawn: not used, for the reason above.

## Consequences

- One more tap for the visitor. The drawing of the confirm page is not changed in the PNGs; the text spec lists the button.
- Opening an unsubscribe link also unsubscribes when a scanner opens it. That is a known nuisance; the page offers "Přihlásit zpět".
