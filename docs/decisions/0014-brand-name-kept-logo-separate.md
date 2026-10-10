# 0014. Brand name kept, logo made separately

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

The page needs a name and wordmark now, and a logo is a design task that should not be improvised by the build (SPEC §8, §17.16, §24).

## Decision

"ETF Kompas" stays as brand name and wordmark. David makes the logo in a separate project thread. Until it is delivered, a text wordmark in the display font is used, assets live in `public/brand/` and the component slot is `src/components/Wordmark`. Agents do not design a logo. Favicon and OG image (P1) wait for the logo.

## Alternatives considered

No alternative names or logo approaches are recorded in the SPEC.

## Consequences

- `public/brand/` already holds brand assets from the scaffold commit; the SPEC says nothing logo-related is built until the logo is delivered.
- The name appears in copy only as the wordmark (header, footer, emails, PDF cover) and is read from `src/config/site.ts`.
- Visual identity work (Phase 1b) is limited to tokens and primitives.
