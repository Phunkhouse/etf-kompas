# 0029. Wireframes rev. 2: honest framing of what is buyable from Czechia

Date: 2026-10-11
Status: accepted
Phase: 1b

## Context

Checking the fees for the wireframes gave VOO 0,03 %, QQQ 0,18 % and CSPX 0,07 %. The US fund is cheaper, so the highlighted "cheapest" row in revision 1 (DESIGN-GUIDE §5) was wrong. The US funds are also not buyable from Czechia at DEGIRO, Trading 212 and XTB (verified). Fio and IBKR are not verified.

## Decision

David decided to be honest about the findings. The highlighted row means "buyable from Czechia", not "cheapest", and the fee is shown next to it. The calculator shows "méně o" when the US fund is cheaper, with a note that it is not buyable at every broker. A new amber pill state `[ověřit]` (`--pill-ver-bg` `#F3E6BE`, `--pill-ver-ink` `#6B4E00`, contrast 6.22) marks what is unverified: "Ne" appears only with a source per broker. The hero, gate, results page and ads are reframed around "which ETF can you really buy from Czechia" (a fund and broker availability check). Results are sorted "koupitelné z ČR nahoře · pak podle poplatku" and include a fund × broker matrix.

## Alternatives considered

The note records no alternatives: David gave only the reason above.

## Consequences

- Wireframes, `docs/design/` and the PNG exports are rev. 2. The original canvas still shows revision 1.
- The app copy in `src/content/copy.ts` (hero headlines, CTA) still has the revision 1 wording. It needs a follow-up change in Phase 3.
- The broker names (DEGIRO, Fio, IBKR, Trading 212, XTB) and the "Ne" claims need a source per broker in `data/` before launch (SPEC §18).
