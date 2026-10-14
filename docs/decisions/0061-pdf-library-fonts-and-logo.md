# 0061. The PDF is drawn with react-pdf, with committed IBM Plex fonts and the PNG logo

Date: 2026-10-14
Status: proposed
Phase: 4

Note: the reasons are drafted by the agent; David accepted them on 2026-10-14 ("I have accepted your reason"). The choice of `@react-pdf/renderer` was already in SPEC §12 and note 0039. Context and consequences are written by the agent.

## Context

The personalised PDF has six pages (SPEC §3.2). It has to show Czech text correctly, show the same numbers as the page, and be produced on request from the data and the visitor's setup.

## Decision

- **Library:** `@react-pdf/renderer`, the one new dependency of Phase 4. Reason (SPEC §12, note 0039): the PDF is built from the same data and the same pricing code as the page, so it cannot drift from it.
- **Fonts:** IBM Plex Sans (Regular, Medium, Bold) and IBM Plex Mono Medium are committed as WOFF files with their SIL OFL licence in `src/server/pdf/fonts/`. Reason (drafted by the agent): the standard PDF fonts have no ě, š, č, ř or ž, so a font must be embedded, and the files must be in the repository to be shipped with the route.
- **Logo:** the PNG `public/brand/logo-600w.png`. Reason (drafted by the agent): react-pdf draws PNG and JPEG images, not SVG files; the logo is the final one, only as a bitmap.

## Alternatives considered

- Standard PDF fonts: not usable for Czech.
- The SVG logo: not supported by react-pdf as an image file.
- A script `scripts/build-pdf.ts` for a sample file (SPEC §13): not built, because `tsx` cannot load the library.

## Consequences

- About 335 KB of font files are in the repository; the licence is kept with them. A change to the typeface means new files.
- The route reads the fonts and the logo from disk at request time, shipped with `outputFileTracingIncludes`. It works on `next start` and is **not verified on Vercel** (README gap, to check at the Phase 6 deploy).
- The PDF page 4 (taxes) has no text yet; see the README.
