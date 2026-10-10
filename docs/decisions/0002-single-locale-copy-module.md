# 0002. Single-locale copy module instead of next-intl

Date: 2026-10-10
Status: accepted
Phase: 1

## Context

The site is Czech only (SPEC §17.6) and has a JavaScript budget (route JS at most 90 KB gzipped, SPEC §12). The starter guide uses `next-intl` with `messages/cs.json`.

## Decision

All UI strings live in one typed module, `src/content/copy.ts`, imported by server components and passed to client components as props. `next-intl` and JSON catalogs are not installed.

## Alternatives considered

- `next-intl` with `messages/cs.json` (the guide's default): extra bundle weight for a single language, and strings are split from their typed interpolation.

## Consequences

- One file for copy review (David reviews every string before deploy, SPEC §17.10) and for the glossary lint (`pnpm copy:check`).
- Functions in the module handle interpolation, for example `consent(controller)`.
- Reversible: add an i18n library and catalogs only if a second language appears (SPEC §17.17).
