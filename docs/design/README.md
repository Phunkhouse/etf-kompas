# Design

Design source of truth for ETF Kompas (SPEC §24). Wireframe B is the layout direction chosen by David.

## Files

| File                               | What it is                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [DESIGN-GUIDE.md](DESIGN-GUIDE.md) | Palette, type, spacing, radius, borders, motion, components, with contrast ratios. Read before writing any style. |
| [wireframe-b.md](wireframe-b.md)   | Text spec of every screen in the wireframe: structure, copy, behaviour, open points.                              |

## Visual source

The wireframe is a design canvas: [ETF Kompas – wireframes](https://claude.ai/artifact/8PaM6Y6wAcy6nZbQhtaDoi) (private, owner David). Boards:

| Board                            | Screen             |
| -------------------------------- | ------------------ |
| Landing page · desktop and mobil | `Main`, `B-mobile` |
| Animace hero tabulky             | `T1-radky`         |
| Po odeslání · desktop and mobil  | `E1`, `E2`         |
| Srovnání · desktop and mobil     | `F1`, `F2`         |
| Reklama A and B (4:5, 9:16)      | `G1` to `G4`       |
| První obrazovka po reklamě A     | `G5`               |

Agents cannot always open the canvas, so the text spec and the design guide are the working references. If the canvas and these files disagree, tell David and fix the files after he decides.

## Rules

- Spacing, type and colour only from tokens (SPEC §24). A value that is not in the guide needs a note in the PR.
- Wireframe copy is a draft. Final Czech copy comes from SPEC §25 and `src/content/copy.ts`.
- No logo design: the logo is final and lives in `public/brand/`.
