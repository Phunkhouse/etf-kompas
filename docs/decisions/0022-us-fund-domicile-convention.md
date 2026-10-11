# 0022. Domicile of US-listed funds means "regulated in the US"

Date: 2026-10-11
Status: accepted
Phase: 3

## Context

Every fund record has a sourced `domicile` (SPEC §5, §18). UCITS documents state it directly: the KIDs for VUAA and the iShares factsheets for CSPX and CNDX say the fund is authorised or domiciled in Ireland. US fund documents do not. I read the VOO summary and statutory prospectuses and the QQQ prospectus: none has a sentence stating where the trust is organised. The VOO prospectus says the fund is a series of Vanguard Index Funds, registered under the Investment Company Act of 1940, and that the Trust's bylaws designate Delaware courts for certain claims. The advisor's Pennsylvania address is the advisor's, not the fund's. The QQQ prospectus says the fund was reclassified as an open-end management investment company on 19 December 2025. David searched for a domicile statement as well and found none.

## Decision

For US-listed funds, `domicile` is `US`, and the evidence is the prospectus statement that the fund is registered under the Investment Company Act of 1940 and regulated by the SEC. For UCITS funds it stays the country the KID or factsheet names. `data/README.md` says so.

## Alternatives considered

- Leave `domicile` as `TODO_VERIFY` for VOO and QQQ: not chosen. David found no document that states it, so the value could never be verified, and the strict validator would fail at the deploy gate (Phase 6).

## Consequences

- The field now means "regulatory home" for US funds. It is a weaker claim than the UCITS one, and the data README says so.
- The hero and the calculator do not display a US fund's domicile, so no copy depends on it. If copy ever does, check the statement again.
- If an SAI or other document later states the state of organisation, record that and supersede this note.
- David's reason: "otherwise there is no way to find that domicile" in the documents he searched. The alternative above was proposed by the agent. David approved the decision on 2026-10-11.
