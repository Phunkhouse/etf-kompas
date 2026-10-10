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

## Images

Exports of every board, optimised (256-colour PNG, full pixel size; desktop boards are 2x, mobile boards 2x). Originals are in the canvas.

| Screen                           | Image                                                                      |
| -------------------------------- | -------------------------------------------------------------------------- |
| Landing page, desktop            | [landing-desktop.png](images/landing-desktop.png)                          |
| Landing page, mobile             | [landing-mobile.png](images/landing-mobile.png)                            |
| Hero table animation             | [hero-table-animation.png](images/hero-table-animation.png)                |
| After submit, desktop            | [success-desktop.png](images/success-desktop.png)                          |
| After submit, mobile             | [success-mobile.png](images/success-mobile.png)                            |
| Results page, desktop            | [results-desktop.png](images/results-desktop.png)                          |
| Results page, mobile             | [results-mobile.png](images/results-mobile.png)                            |
| First screen after ad A (hero a) | [hero-a-mobile.png](images/hero-a-mobile.png)                              |
| Ad A, 4:5 and 9:16               | [ad-a-4x5.png](images/ad-a-4x5.png), [ad-a-9x16.png](images/ad-a-9x16.png) |
| Ad B, 4:5 and 9:16               | [ad-b-4x5.png](images/ad-b-4x5.png), [ad-b-9x16.png](images/ad-b-9x16.png) |

The text spec and the design guide are the working references for agents. If an image or the canvas disagrees with them, tell David and fix the files after he decides.

## Rules

- Spacing, type and colour only from tokens (SPEC §24). A value that is not in the guide needs a note in the PR.
- Wireframe copy is a draft. Final Czech copy comes from SPEC §25 and `src/content/copy.ts`.
- No logo design: the logo is final and lives in `public/brand/`.
