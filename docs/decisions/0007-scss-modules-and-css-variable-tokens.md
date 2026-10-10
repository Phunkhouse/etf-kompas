# 0007. SCSS Modules and design tokens as CSS variables

Date: 2026-10-10
Status: proposed
Phase: 1

## Context

The page needs a distinctive, mobile-first look ("Czech financial print", SPEC §8), a small JavaScript budget (route JS at most 90 KB gzipped, SPEC §12) and one design source of truth (SPEC §24). SCSS Modules were requested in the brief.

## Decision

Style with SCSS Modules. Design tokens (colour, type, spacing, radius, borders, motion, breakpoints, z-index, touch targets) are CSS custom properties; spacing and type come only from tokens. `rem()` and `from()` helpers live in `src/styles/_utilities.scss`. No Tailwind, no component library, no UI kit and no chart library (charts are simple SVG).

## Alternatives considered

- Tailwind and component or UI kits: rejected in SPEC §12 for payload and for looking generic.
- Storybook for the design system: left out for now (extra tooling and build time); can be added later (SPEC §24).

## Consequences

- Token names follow the starter guide, the values come from the palette in SPEC §8 and are built in Phase 1b.
- Every colour pair used by primitives is checked for WCAG AA by a script (SPEC §22).
- Components need their own `.module.scss` files, which is more writing than utility classes.
