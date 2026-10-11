# Wireframes document

`etf-kompas-wireframes.html` is a single-page, designer-style presentation of the 12 wireframe artboards (revision 2) (desktop and phone), ads, design tokens, components, behaviour and open items. Open it in a browser; it needs network access only for IBM Plex from Google Fonts.

| File | What it is |
| --- | --- |
| `etf-kompas-wireframes.html` | The finished document (artboards embedded at native size, real logo SVGs inline) |
| `artboards/` | The 12 original (rev. 1) artboards, unpacked from the canvas export (`<x-dc>` markup, inline styles) |
| `artboards-v2/` | Rev. 2 artboards, generated: `python3 apply_rev2.py artboards artboards-v2` |
| `logo/` | `etf-kompas-logo.svg`, `etf-kompas-logo-dark.svg`, `favicon.svg`, as delivered with the handoff |
| `build.py`, `doc.css`, `doc.js` | Rebuild: `python3 build.py artboards-v2 logo etf-kompas-wireframes.html` |
| `apply_rev2.py` | Turns `artboards/` into `artboards-v2/` (honest framing, real fees, availability, see decision note 0029) |
| `dump_frames.py`, `png.js` | PNG export: `python3 dump_frames.py artboards-v2 logo /tmp/frames`, then `node png.js /tmp/frames ../images` (needs `playwright-core` and `sharp`) |

Artboard file to board: `a8f21cef` Main · `ad67ec35` B-mobile · `174eb66f` T1-radky · `642661e9` E1 · `4555091e` E2 · `92ef8ee0` F1 · `24e61a2e` F2 · `8e84da19` G1 · `6bf92b0b` G2 · `c2093dbc` G3 · `4b5adee3` G4 · `734d3e9c` G5.

The PNG exports in `../images/` are rendered from `artboards-v2/` at 2x (content height, 256 colours).
