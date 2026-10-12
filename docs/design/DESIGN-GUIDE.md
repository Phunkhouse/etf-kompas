# Design guide

Extracted from the wireframes at revision 4 (see [README.md](README.md) and the Design Study listed there). Direction from SPEC §8: "Czech financial print", editorial and numeric, not app-like. Colour and type values below are what the wireframes use; token names are proposals for Phase 1b PR 1 (prefixed `--color-…` as in the starter guide). Rev. 4 adds the saving box colours, the error colour, the cookie switch, the motion scale and the logo orange; the values that differ from the code are listed in section 2.

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
| `--color-saving-bg` / `-border`     | `#1F3A2B` / `#2F6B49`          | Green saving box on the dark calculator band                  |
| `--color-saving-fg` / `-soft`       | `#9AD4B2` / `#B9D9C6`          | Saving amount, tag and button fill / note text in the box     |
| `--color-error`                     | `#B3341A`                      | Invalid field border and message (the banner uses no-bg/fg)   |
| `--color-switch-on`                 | `#2F6B49`                      | Cookie switch, on. Off uses `muted`                           |
| `--color-brand-orange`              | `#D9480F` (on dark: `#F06A2E`) | Needle in the logo only. Comes from the logo files            |
| `--color-focus`                     | `#16150F` (on dark: `#F6F3EC`) | Focus ring, see section 6                                     |

Two accents, as in SPEC §8: warm red for "cost" (`cost`, `cost-strong`) and green for "saved/OK" (`yes-fg`, `highlight`, the saving box). Everything else is warm neutral. No gradients. The saving box is the only green surface on the page and it only exists under the hide rule in `wireframe-b.md` section 3.

The two PDF previews on the landing page are drawn as blurred placeholders in rev. 4. Final art is a blurred screenshot of the real PDF pages. The old striped placeholder is gone from the wireframes and is not a product style.

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
| saving-fg on saving-bg                       | 7.32  | AA, AAA              |
| saving-soft on saving-bg                     | 8.13  | AA, AAA              |
| error on white (field message)               | 6.14  | AA                   |
| error on paper                               | 5.54  | AA                   |
| switch-on on surface (UI component)          | 6.22  | AA (needs 3)         |
| muted on surface (switch off, UI component)  | 5.62  | AA (needs 3)         |
| brand-orange on paper (logo, not text)       | 3.88  | logo only            |
| brand-orange on dark (`#F06A2E` on ink)      | 5.93  | logo only            |

Watch-outs:

- `muted` on `no-bg` is 4.27, which fails AA. Never put muted text on a pill.
- `saving-border` on `saving-bg` is 1.95 and is decorative. The cookie switch off state was first drawn with a light track at 1.63, which fails 3:1, and was changed to `muted`.
- `border` on `paper` is 1.42 and `inverse-border` on `ink` is 1.97. They are decorative dividers only. Anything that must be seen as a control (inputs, chips, outlined buttons) uses `ink` (or `paper` on dark) for its border.
- The AA script in Phase 1b (`pnpm contrast:check`) re-checks this table from the tokens and fails the build on a regression.

## 2. Type

- **Sans:** IBM Plex Sans, weights 400, 500, 600, 700. Body, headings, buttons.
- **Mono:** IBM Plex Mono, weight 500. Only for `tag` labels.
- Both are loaded from Google Fonts in the wireframes. The app self-hosts them through `next/font` with the `latin` and `latin-ext` subsets (Czech needs `ě š č ř ž ý á í é ů ú ň ť ď`). `pnpm test:e2e` checks that both fonts load and that every Czech diacritic has a glyph.
- All Kč amounts use tabular figures (`font-variant-numeric: tabular-nums`, class `num`), with a non-breaking space before `Kč` and between digit groups (`12 480 Kč`, `0,07 %`).
- Body 16 px, line-height 1.45. Headings: weight 700, tight tracking (`-0.015em` to `-0.04em`), line-height 1.04 to 1.15.
- **Tag:** Plex Mono 500, 10 px on mobile and 11 px on desktop, uppercase, letter-spacing `.06em`, colour `muted`.

| Role                                  | Mobile                                       | Desktop                           |
| ------------------------------------- | -------------------------------------------- | --------------------------------- |
| Display number (calculator result)    | 52 to 60 px, weight 700, -0.03em             | 80 px                             |
| Landing h1                            | 30 px / 1.06                                 | 54 px / 1.04, -0.025em            |
| h1 on other pages (privacy, 404, ...) | 34 to 36 px / 1.05                           | 44 px / 1.05                      |
| Section heading (h2)                  | 24 px                                        | 32 px, -0.02em                    |
| Card heading (h3)                     | 17 px                                        | 18 to 20 px                       |
| Lead                                  | 16 px                                        | 20 px                             |
| Body                                  | 16 px / 1.45 (15 in forms, 14 in rows)       | same                              |
| Caption, source line                  | 12 px                                        | 13 px                             |
| Button                                | 17 px (small 15 px), weight 600              | same                              |
| Wordmark                              | 102 px wide header, from the logo files only | 126 px wide header, 110 px footer |

The wireframes use about 20 different font sizes. The code merges them into the token scale below (`--font-size-*` in `src/app/variables.scss`). Some elements end up 1 px larger or smaller than drawn, for example tags are 12 px where the wireframe has 10 to 11 px, which also helps legibility. Review them on `/styleguide`.

| Token        | Size  | Replaces (wireframe)                        |
| ------------ | ----- | ------------------------------------------- |
| `xs`         | 12 px | 10, 11, 12 (tags, captions, sources)        |
| `sm`         | 14 px | 13, 14 (sub-labels, small body)             |
| `base`       | 16 px | 15, 16 (body)                               |
| `md`         | 18 px | 17, 18 (lead, buttons, card headings)       |
| `lg`         | 20 px | 20                                          |
| `xl`         | 24 px | 22, 24, 26                                  |
| `hero-phone` | 30 px | 30 (hero h1 on phones, notes 0031 and 0039) |
| `2xl`        | 32 px | 30, 32                                      |
| `3xl`        | 40 px | 40                                          |
| `4xl`        | 54 px | 54 (h1 desktop, rev. 4)                     |
| `display-sm` | 60 px | 52, 60 (result number, mobile)              |
| `display`    | 80 px | 80 (result number, desktop)                 |

**Decided (note 0039, 2026-10-12): the tokens adapt to rev. 4.** `4xl` is 54 px and `hero-phone` is 30 px (the 375 x 667 hero fit still holds, tested in `e2e/hero-fit.spec.ts`). The 44 px h1 for other pages has no token yet; it is added with the first page that uses it.

IBM Plex Sans digits are tabular by default (verified: `1` and `0` have the same width), so Kč amounts align even without `tabular-nums`. We still set it as a guard.

## 3. Spacing, radius, borders

- Spacing is a 4 px scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64. Page gutters: 16 px on mobile, 56 px on desktop (max width 1280 px). Section padding: 28 to 64 px.
- Radius: 6 px for buttons, inputs and chips-in-rows, 10 px for cards, 999 px for chips and pills, 3 to 5 px for small tags and the logo slot.
- Borders: 1 px dividers (`border`), 1.5 px for strong lines and controls (`ink`), 2 px for an invalid field (`error`) and in the ad "vs" mark.
- Frames: desktop 1280 wide with 56 px padding, phone 390 wide with 16 px padding (20 px inside the calculator band). Sections are 40 to 64 px apart on desktop and 24 to 40 px on the phone. The phone calculator is the one generous space: 40 px padding and 28 px between blocks.
- Touch targets: 56 px for primary buttons and the email field, 48 px for chips, switches and the sticky bar button, 44 px minimum for anything else, including the hamburger (SPEC §3.4).

## 4. Components

Primitives from SPEC §24, as drawn in the rev. 4 wireframes.

| Component                   | Spec from the wireframes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Button**                  | Primary: `ink` background, `paper` text, 6 px radius, 56 px high, 17 px / 600. Small: 44 px, 15 px. Outline: transparent, 1.5 px `ink` border. On dark sections the primary is inverted (`paper` background). Full width on mobile.                                                                                                                                                                                                                                                                                                                                      |
| **Chip**                    | Pill, 48 px high, min 56 to 64 px wide, 1.5 px `ink` border. Selected: filled `ink` with `paper` text. On dark: inverted. Used for the horizon (5 / 10 / 20 let).                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Slider**                  | Native `<input type="range">`, accent colour `paper` on dark, label left and tabular value right (`3 000 Kč`, 22 px / 700).                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Field**                   | Email, 56 px high, 1.5 px `ink` border, 6 px radius, white background, 17 px text. Label above in 500 weight. Optional checkbox row with a 20 to 22 px box. **Invalid state:** 2 px `error` border and a message in words under the field ("Zadejte e-mail ve tvaru jmeno@domena.cz."), linked with `aria-describedby`, field marked `aria-invalid`. **Send failed:** a banner (`no-bg`, `no-fg`) above the form, the e-mail and calculator setup stay filled, the button reads "Zkusit znovu".                                                                          |
| **Table**                   | Header row in `tag` style over a 1.5 px `ink` line. Rows have a bold label, a 13 px `muted` sub-label (technical name, ticker), tabular numbers and a status. The hero table has three columns on every width: Co koupíte, Roční poplatek, Typ (Acc / Dist). The comparison page adds the fund picker and a broker table (Koupíte?, Poplatky brokera, Za 10 let celkem).                                                                                                                                                                                                 |
| **Pill**                    | Radius 999 px, 14 px / 500. `no`, `yes` and `ver` (unverified, amber) variants, plus the neutral `Acc` and `Dist` type pills. A pill is always text: "Ano", "Ne" or `[ověřit]`, never colour alone. "Ne" is shown only with a source per broker; otherwise `[ověřit]`. The `yes` pill has a 1.5 px `yes-fg` border so it stays visible on the highlighted row.                                                                                                                                                                                                           |
| **Callout**                 | `<strong>ETF</strong>` explainer: 3 px `ink` left rule, 14 to 15 px `ink-soft` text. The risk line is plain text in footer and under the table; a boxed variant is not drawn.                                                                                                                                                                                                                                                                                                                                                                                            |
| **NumberDisplay**           | Large tabular Kč number in `cost` on dark, with a `tag` caption above and a breakdown (roční poplatek fondu, převod korun na dolary, poplatky brokera) below in 13 to 14 px `inverse-soft`. The number swaps, it never counts up (section 5). Loading: grey placeholders and "Načítáme aktuální poplatky…". Failed: no amount, "Částku teď nespočítáme, aby nebyla nepřesná" and a "Zkusit znovu" button.                                                                                                                                                                |
| **SavingBox**               | Green box under the calculator result: `saving-bg` fill, 1 px `saving-border`, 10 px radius. Tag "Při vašem nastavení", "Správným brokerem si u stejného fondu ponecháte **až X XXX Kč**" (amount in `saving-fg`), note "Odhad, bez českých daní a inflace." in `saving-soft`, and a `saving-fg` button "Ukázat, u kterého brokera to koupím" that scrolls to the form. **Hide rule:** shown only when at least two brokers that offer the chosen fund have verified prices. Otherwise neither the box nor its button exists. Never "až 0 Kč", never an invented number. |
| **Card**                    | `surface` background, 1 px `border`, 10 px radius, 14 to 28 px padding.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Section**                 | Alternating paper and `ink` bands. The calculator is the dark band. Section label is a `tag`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Wordmark**                | Logo from `public/brand/` plus the text "ETF Kompas" in 17 to 20 px / 700. Replaces the striped placeholder square in the wireframe.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Hamburger and menu**      | Phone header button with the label "Menu", 44 px target, `aria-expanded`. Open: full-height `ink` panel with the three page anchors in 60 px rows, Zásady zpracování, Cookies, Kontakt, and the primary button pinned to the bottom. The page behind does not scroll.                                                                                                                                                                                                                                                                                                    |
| **Cookie bar and settings** | Bottom sheet on the phone, bar on desktop. "Přijmout vše" and "Odmítnout vše" are equally prominent, plus "Nastavit". Settings list Nezbytné (always on, label "vždy zapnuto"), Měření návštěvnosti and Reklama a remarketing (both off until agreed), buttons "Uložit výběr" and "Přijmout vše".                                                                                                                                                                                                                                                                        |
| **Switch**                  | 48 x 28 px, knob 22 px. Off: `muted` track (5.62 on the card, passes 3:1). On: `switch-on`. Slides in 150 ms.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Legal page**              | Contents list and numbered sections, 44 px h1 on desktop and 34 to 36 px on the phone. Seven privacy sections, text is a placeholder with `[doplnit]` gaps until a lawyer has reviewed it.                                                                                                                                                                                                                                                                                                                                                                               |
| **StackedBar**              | Not drawn in the wireframe. To be designed in Phase 1b from the cost / saved colours.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## 5. Motion

Motion explains a change, it never decorates. The rev. 4 Motion board (live HTML, `images/motion.png` is a still) shows each animated section. Replaces the single hero animation of rev. 2, see note 0035.

| Duration | Used for                                            |
| -------- | --------------------------------------------------- |
| 100 ms   | Press feedback on buttons                           |
| 150 ms   | Small state: chip, switch, border colour            |
| 250 ms   | Panels, the saving box, the calculator number swap  |
| 500 ms   | Scroll reveal of sections                           |
| 700 ms   | Hero entrance, the only one over 300 ms, plays once |

- Easing `cubic-bezier(.2,.8,.2,1)` for things that appear or move, plain `ease` for colour changes.
- Only `opacity` and `transform` are animated, plus panel height.
- The calculator number swaps (the old one rises out, the new one rises in, 250 ms). It never counts up, and tabular digits keep the width still. This replaces the "result count-up" of rev. 2.
- The saving box grows in under the result only when the hide rule allows it, and leaves the same way. Loading uses a grey shimmer. A failure has no animation, only the message.
- `prefers-reduced-motion: reduce` stops every animation and each screen shows its final state. Meaning never depends on motion: errors are also text, the menu state is also announced.
- Not allowed: hover movement, looping decoration, parallax, auto-playing carousels, counting numbers.

Decision note 0016 (keep the hero intro) still stands, but the hero table is new in rev. 3, so the "highlight the buyable row at 2.2 s" stage described there is not drawn any more. The hero must not hurt LCP (target below 2.0 s): this is measured in Phase 3 and the animation is cut or shortened if it fails.

## 6. Focus and accessibility

- A visible focus ring on every interactive element: 3 px solid ring, 2 px offset. Use `ink` on paper and `paper` on dark sections, which both pass 3:1.
- Semantic HTML: real `<button>`, `<a>`, `<label>`, `<details>` for the FAQ.
- The hamburger and the accordion announce open or closed (`aria-expanded`). Errors are linked to their field with `aria-describedby`.
- A control is never identified by colour alone: pills and errors carry words.
- Ad creatives are outside the app and are not covered by `contrast:check`.
