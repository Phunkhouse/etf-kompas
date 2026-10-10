# 0011. Test sending domain and `EMAIL_MODE`

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

Leads receive a transactional email with their Kompas (and a double opt-in confirmation if the newsletter box is ticked). The demo should send real emails to any visitor, but it is a test project and must say so (SPEC §17.15).

## Decision

The demo sends from David's own test domain, verified in Resend (SPF, DKIM, DMARC). The sender name, email footer, page footer and README state that it is a test project, and nothing is sent beyond the Kompas email and the optional confirmation. The sending domain, sender name, reply-to and controller details live in environment variables and `src/config/site.ts`, so moving to Clientelo's domain is a config change plus DNS records. `EMAIL_MODE=live|sandbox` stays as a safe fallback: sandbox sends only to allowlisted addresses, and the UI never claims an email was sent when it was not.

## Alternatives considered

- The Vercel URL plus a Resend test sender (SPEC §17.5): superseded by SPEC §17.15 because it cannot deliver to arbitrary visitors.

## Consequences

- The README documents the test-domain status and a production switch checklist.
- In-page delivery (results page, PDF) stays the primary deliverable regardless of email (SPEC §3.5, §23).
- Needs a real domain with DNS access before Phase 4 testing.
