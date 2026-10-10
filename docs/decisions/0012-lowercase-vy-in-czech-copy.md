# 0012. Lowercase "vy" in Czech copy

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

The site addresses visitors formally (vykání) and needs one consistent rule for how to write the pronoun in running text (SPEC §25).

## Decision

Use vykání with lowercase "vy / váš" in running text. No exclamation marks, no emoji, no hype. David decided this.

## Alternatives considered

- Capitalised "Vy / Váš": not chosen. Reason from SPEC §25: lowercase is the modern web convention.

## Consequences

- `pnpm copy:check` and David's string review (SPEC §17.10) apply this consistently.
- Applies to the page, emails and the PDF; legal pages should follow the same rule unless counsel says otherwise.
