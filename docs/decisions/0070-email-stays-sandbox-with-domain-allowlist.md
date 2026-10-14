# 0070. E-mail stays in sandbox for the submission, with a domain entry in the allowlist

Date: 2026-10-14
Status: accepted
Phase: 6

Note: the reason is David's ("mention free tier of Resend as a reason for sandbox", 2026-10-14). He chose "sandbox + allowlist" after the agent compared the options, and asked for the domain entry. The comparison, the facts and the consequences are the agent's.

## Context

The site is live and `noindex`. Note 0011 and SPEC §17.15 describe a demo that sends real e-mail to any visitor from the author's test domain (`EMAIL_MODE=live`); `sandbox` sends only to an allowlist (`EMAIL_SANDBOX_ALLOWLIST`) and the page never claims an e-mail was sent otherwise. Resend's free plan allows 100 e-mails a day and 3,000 a month (resend.com/pricing, read on 2026-10-14 with a fetch tool; per-hour caps are not stated there).

## Decision

For the submission the live site runs in `sandbox`. The reason David gave: Resend's free tier. The allowlist takes addresses and whole domains: an entry starting with `@` (`@clientelo.cz`) matches that exact domain only, not a subdomain, a lookalike or an address with a second `@`; a word without the `@` matches nothing, so a typo never widens the list. The results page and the PDF work for everyone; a person off the list gets no e-mail and the page says nothing about one.

## Alternatives considered

- `live` for the review window, or staying `live` (note 0011's original plan): not chosen. Anyone with the link could then get an e-mail from the author's domain, real people's addresses would be stored under a placeholder controller and unreviewed privacy text, and a burst of visitors could use up the free plan's 100 a day (the agent's reading of the consequence, not David's words). Delivery to Seznam, Gmail and Outlook has never been tested.
- A named list only, without the domain rule: workable, but needs each reviewer's address beforehand.

## Consequences

- A reviewer off the list sees no e-mail and may think the path is broken; the README and `docs/DEPLOY.md` say how to add addresses (Vercel, then redeploy).
- Anyone who knows the link can type any address on an allowed domain and that mailbox receives one e-mail from the test domain. Only people at a company that knows about the project are reachable this way; the form's limits and the test notice still apply.
- A company mail system may filter a new sender; one address of the domain should be tested before relying on it (not done for Clientelo).
- Moving to `live` is a configuration change plus the production switch checklist in `docs/DEPLOY.md`.
