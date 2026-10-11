# Design guide

Extracted from wireframe B (see [README.md](README.md)). Direction from SPEC §8: "Czech financial print", editorial and numeric, not app-like. Colour and type values below are what the wireframe uses; token names are proposals for Phase 1b PR 1 (prefixed `--color-…` as in the starter guide).

Every contrast ratio is calculated (WCAG 2.x relative luminance). AA needs 4.5:1 for normal text and 3:1 for large text (24 px, or 19 px bold) and UI components.

## 1. Colour

### Palette

| Token (proposed)                    | Hex                            | Used for                                                      |
| ----------------------------------- | ------------------------------ | ------------------------------------------------------------- |
| `--color-paper`                     | `#F6F3EC`                      | Page background, text on dark                                 |
| `--color-surface`                   | `#FFFDF8`                      | Cards                                                         |
| `--color-ink`                       | `#16150F`                      | Text, primary button, dark sections, strong borders           |
| `--color-ink-soft`                  | `#3A372E`                      | Secondary body text                                           |
| `--color-muted`                     | `#6B665A`                      | Captions, tags, sources                                       |
| `--color-border`                    | `#D4CEBE`                      | Dividers, card borders                                        |
| `--color-border-soft`               | `#E6E1D4`                      | Fine row separators                                           |
| `--color-white`                     | `#FFFFFF`                      | Input background, text on `cost-strong`                       |
| `--color-inverse-soft`              | `#D9D4C5`                      | Secondary text on ink                                         |
| `--color-inverse-subtle`            | `#B9B3A2`                      | Captions on ink                                               |
| `--color-inverse-border`            | `#4A473D`                      | Dividers on ink                                               |
| `--color-cost`                      | `#F2A18C`                      | The cost number on dark ("X XXX Kč")                          |
| `--color-cost-strong`               | `#C23A1B`                      | The cost number on paper (ads), badge background              |
| `--color-no-bg` / `--color-no-fg`   | `#F4D9D1` / `#7A2410`          | Pill "Ne" (not buyable, with a source per broker)             |
| `--color-yes-bg` / `--color-yes-fg` | `#D6E8DE` / `#154A33`          | Pill "buyable", check icon                                    |
| `--color-pill-ver-bg` / `-ink`      | `#F3E6BE` / `#6B4E00`          | Pill "[ověřit]" (unverified, amber)                           |
| `--color-highlight`                 | `#DCEEE3`                      | Highlighted row "buyable from Czechia", European side of ad B |
| `--color-row-hover`                 | `#F3EEDF`                      | Table row hover                                               |
| `--color-focus`                     | `#16150F` (on dark: `#F6F3EC`) | Focus ring, see section 6                                     |

Two accents, as in SPEC §8: red for "cost" (`cost`, `cost-strong`) and green for "saved/OK" (`yes-fg`, `highlight`). Everything else is warm neutral. No gradients.

The wireframe's striped placeholder (`#E6E1D4`/`#ECE8DC`, dashed `#B5AE9C`) only marks unfinished slots (logo, PDF previews). It is not a product style.

### Contrast of used pairs

| Foreground on background                     | Ratio | Result               |
| -------------------------------------------- | ----- | -------------------- |
| ink on paper                                 | 16.50 | AA, AAA              |
| ink-soft on paper                            | 10.73 | AA, AAA              |
| ink-soft on surface                          | 11.70 | AA, AAA              |
| muted on paper                               | 5.16  | AA                   |
| muted on surface                             | 5.62  | AA                   |
| muted on white                               | 5.72  | AA                   |
| paper on ink (primary button, dark sections) | 16.50 | AA, AAA              |
| inverse-soft on ink                          | 12.34 | AA, AAA              |
| inverse-subtle on ink                        | 8.74  | AA, AAA              |
| cost on ink                                  | 8.93  | AA, AAA              |
| white on cost-strong                         | 5.36  | AA                   |
| cost-strong on paper                         | 4.84  | AA (ads, large text) |
| no-fg on no-bg                               | 7.52  | AA, AAA              |
| yes-fg on yes-bg                             | 7.99  | AA, AAA              |
| yes-fg on paper                              | 9.20  | AA, AAA              |
| ink on highlight                             | 15.14 | AA, AAA              |
| pill-ver-ink on pill-ver-bg                  | 6.22  | AA                   |
| ink on row-hover                             | 15.77 | AA, AAA              |

Watch-outs:

- `muted` on `no-bg` is 4.27, which fails AA. Never put muted text on a pill.
- `border` on `paper` is 1.42 and `inverse-border` on `ink` is 1.97. They are decorative dividers only. Anything that must be seen as a control (inputs, chips, outlined buttons) uses `ink` (or `paper` on dark) for its border.
- The AA script in Phase 1b (`pnpm contrast:check`) re-checks this table from the tokens and fails the build on a regression.

## 2. Type

- **Sans:** IBM Plex Sans, weights 400, 500, 600, 700. Body, headings, buttons.
- **Mono:** IBM Plex Mono, weight 500. Only for `tag` labels.
- Both are loaded from Google Fonts in the wireframe. The app self-hosts them through `next/font` with the `latin` and `latin-ext` subsets (Czech needs `ě š č ř ž ý á í é ů ú ň ť ď`). `pnpm test:e2e` checks that both fonts load and that every Czech diacritic has a glyph.
- All Kč amounts use tabular figures (`font-variant-numeric: tabular-nums`, class `num`), with a non-breaking space before `Kč` and between digit groups (`12 480 Kč`, `0,07 %`).
- Body 16 px, line-height 1.45. Headings: weight 700, tight tracking (`-0.015em` to `-0.04em`), line-height 1.04 to 1.15.
- **Tag:** Plex Mono 500, 10 px on mobile and 11 px on desktop, uppercase, letter-spacing `.06em`, colour `muted`.

| Role                               | Mobile                          | Desktop     |
| ---------------------------------- | ------------------------------- | ----------- |
| Display number (calculator result) | 52 to 60 px, weight 700         | 80 px       |
| Hero headline (h1)                 | 32 px                           | 58 px       |
| Section heading (h2)               | 22 to 24 px                     | 28 to 32 px |
| Card heading (h3)                  | 17 px                           | 18 to 20 px |
| Lead                               | 16 px                           | 20 px       |
| Body                               | 14 to 15 px                     | 15 to 17 px |
| Caption, source line               | 12 to 13 px                     | 12 to 13 px |
| Button                             | 17 px (small 15 px), weight 600 | same        |

The wireframe uses about 20 different font sizes. The code merges them into the token scale below (`--font-size-*` in `src/app/variables.scss`). Some elements end up 1 px larger or smaller than drawn, for example tags are 12 px where the wireframe has 10 to 11 px, which also helps legibility. Review them on `/styleguide`.

| Token        | Size  | Replaces (wireframe)                  |
| ------------ | ----- | ------------------------------------- |
| `xs`         | 12 px | 10, 11, 12 (tags, captions, sources)  |
| `sm`         | 14 px | 13, 14 (sub-labels, small body)       |
| `base`       | 16 px | 15, 16 (body)                         |
| `md`         | 18 px | 17, 18 (lead, buttons, card headings) |
| `lg`         | 20 px | 20                                    |
| `xl`         | 24 px | 22, 24, 26                            |
| `hero-phone` | 28 px | 28 (hero h1 on phones, note 0031)     |
| `2xl`        | 32 px | 30, 32                                |
| `3xl`        | 40 px | 40                                    |
| `4xl`        | 58 px | 58 (h1 desktop)                       |
| `display-sm` | 60 px | 52, 60 (result number, mobile)        |
| `display`    | 80 px | 80 (result number, desktop)           |

IBM Plex Sans digits are tabular by default (verified: `1` and `0` have the same width), so Kč amounts align even without `tabular-nums`. We still set it as a guard.

## 3. Spacing, radius, borders

- Spacing is a 4 px scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64. Page gutters: 16 px on mobile, 56 px on desktop (max width 1280 px). Section padding: 28 to 64 px.
- Radius: 6 px for buttons, inputs and chips-in-rows, 10 px for cards, 999 px for chips and pills, 3 to 5 px for small tags and the logo slot.
- Borders: 1 px dividers (`border`), 1.5 px for strong lines and controls (`ink`), 2 px in the ad "vs" mark.
- Touch targets: 56 px for primary buttons and the email field, 48 px for chips and the sticky bar button, 44 px minimum for anything else (SPEC §3.4).

## 4. Components

Primitives from SPEC §24, as drawn in the wireframe.

| Component         | Spec from the wireframe                                                                                                                                                                                                                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button**        | Primary: `ink` background, `paper` text, 6 px radius, 56 px high, 17 px / 600. Small: 44 px, 15 px. Outline: transparent, 1.5 px `ink` border. On dark sections the primary is inverted (`paper` background). Full width on mobile.                                                                                                                                              |
| **Chip**          | Pill, 48 px high, min 56 to 64 px wide, 1.5 px `ink` border. Selected: filled `ink` with `paper` text. On dark: inverted. Used for the horizon (5 / 10 / 20 let).                                                                                                                                                                                                                |
| **Slider**        | Native `<input type="range">`, accent colour `paper` on dark, label left and tabular value right (`3 000 Kč`, 22 px / 700).                                                                                                                                                                                                                                                      |
| **Field**         | Email, 56 px high, 1.5 px `ink` border, 6 px radius, white background, 17 px text. Label above in 500 weight. Optional checkbox row with a 20 to 22 px box.                                                                                                                                                                                                                      |
| **Table**         | Header row in `tag` style over a 1.5 px `ink` line. Rows have a bold label, a 13 px `muted` sub-label (technical name, ticker), tabular numbers and a status pill. Responsive: three columns also on 375 px (label, fee, buyable). Results page adds "Fond sídlí" and "Zdroj" columns.                                                                                           |
| **Pill**          | Radius 999 px, 14 px / 500. `no`, `yes` and `ver` (unverified, amber) variants (colours above). A pill is always text: "Ano", "Ne" or `[ověřit]`, never colour alone. "Ne" is shown only with a source per broker; otherwise `[ověřit]`. The `yes` pill has a 1.5 px `yes-fg` border so it stays visible on the highlighted row (a change from the wireframe, decided by David). |
| **Callout**       | `<strong>ETF</strong>` explainer: 3 px `ink` left rule, 14 to 15 px `ink-soft` text. The risk line is plain text in footer and under the table; a boxed variant is not drawn.                                                                                                                                                                                                    |
| **NumberDisplay** | Large tabular Kč number in `cost` on dark, with a `tag` caption above and a breakdown (fee, currency conversion, tax) below in 13 to 14 px `inverse-soft`.                                                                                                                                                                                                                       |
| **Card**          | `surface` background, 1 px `border`, 10 px radius, 14 to 28 px padding.                                                                                                                                                                                                                                                                                                          |
| **Section**       | Alternating paper and `ink` bands. The calculator is the dark band. Section label is a `tag`.                                                                                                                                                                                                                                                                                    |
| **Wordmark**      | Logo from `public/brand/` plus the text "ETF Kompas" in 17 to 20 px / 700. Replaces the striped placeholder square in the wireframe.                                                                                                                                                                                                                                             |
| **StackedBar**    | Not drawn in the wireframe. To be designed in Phase 1b from the cost / saved colours.                                                                                                                                                                                                                                                                                            |

## 5. Motion

Besides the result count-up (under 300 ms), the wireframe has one deliberate animation, the hero table intro (board "Animace hero tabulky"). Kept by decision note 0016:

- Card: fade and rise 24 px, 0.7 s, `cubic-bezier(.2,.8,.2,1)`.
- Rows 1 to 3: fade and slide in from the left, 0.7 s, delays 0.4 s, 0.9 s and 1.4 s.
- The highlighted row (row 3, "buyable from Czechia", not "cheapest") gets a green highlight (`highlight`) at 2.2 s, 0.8 s long.
- `prefers-reduced-motion: reduce` turns all of it off.

It must not hurt LCP (target below 2.0 s): this is measured in Phase 3 and the animation is cut or shortened if it fails.

## 6. Focus and accessibility

- A visible focus ring on every interactive element: 3 px solid ring, 2 px offset. Use `ink` on paper and `paper` on dark sections, which both pass 3:1.
- Semantic HTML: real `<button>`, `<a>`, `<label>`, `<details>` for the FAQ.
- Ad creatives are outside the app and are not covered by `contrast:check`.
