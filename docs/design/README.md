# Design

Design source of truth for ETF Kompas (SPEC §24). The wireframes are at revision 4. Wireframe B is the layout direction chosen by David.

## Files

| File                               | What it is                                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [DESIGN-GUIDE.md](DESIGN-GUIDE.md) | Palette, type, spacing, radius, borders, components, motion and focus, with contrast ratios. Read before writing any style. |
| [wireframe-b.md](wireframe-b.md)   | Text spec of every screen and state: structure, copy, behaviour, rules, open points.                                        |
| [wireframes/](wireframes/)         | The Design Study and Wireframe Board as HTML files, with the artboards and the scripts that build them. See its README.     |
| [images/](images/)                 | PNG exports of the artboards (index below).                                                                                 |

## Visual source

Two private Claude artifacts (owner David) hold the current design. The files in [wireframes/](wireframes/) are the same documents.

- **ETF Kompas Design Study:** https://claude.ai/artifact/HFPYudBZUkq6cin4p56rVC. The design as it stands, with the reasons.
- **Wireframe Board:** https://claude.ai/artifact/MqVUQ7bvX5JmjPgXGXYLnz. All screens on one canvas, plus the live motion board.

The older canvas (https://claude.ai/artifact/8PaM6Y6wAcy6nZbQhtaDoi) shows revision 1 and is out of date.

## Images

Exports of the rev. 4 artboards (content height, 2x, 256-colour PNG).

| Screen                                | Image                                                                                                                                                                                                                                                      |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing page, desktop and mobile      | [landing-desktop.png](images/landing-desktop.png), [landing-mobile.png](images/landing-mobile.png)                                                                                                                                                         |
| Calculator states, desktop and mobile | [calculator-states-desktop.png](images/calculator-states-desktop.png), [calculator-states-mobile.png](images/calculator-states-mobile.png)                                                                                                                 |
| After submit, desktop and mobile      | [success-desktop.png](images/success-desktop.png), [success-mobile.png](images/success-mobile.png)                                                                                                                                                         |
| Comparison page, desktop and mobile   | [results-desktop.png](images/results-desktop.png), [results-mobile.png](images/results-mobile.png)                                                                                                                                                         |
| E-mail and pages for the tips opt-in  | [optin-email.png](images/optin-email.png), [optin-confirmed-mobile.png](images/optin-confirmed-mobile.png), [optin-expired-mobile.png](images/optin-expired-mobile.png)                                                                                    |
| Unsubscribe, 404                      | [unsubscribed-mobile.png](images/unsubscribed-mobile.png), [not-found-mobile.png](images/not-found-mobile.png)                                                                                                                                             |
| Menu (phone)                          | [menu-mobile.png](images/menu-mobile.png)                                                                                                                                                                                                                  |
| Cookies, bar and settings             | [cookies-bar-mobile.png](images/cookies-bar-mobile.png), [cookies-settings-mobile.png](images/cookies-settings-mobile.png), [cookies-bar-desktop.png](images/cookies-bar-desktop.png), [cookies-settings-desktop.png](images/cookies-settings-desktop.png) |
| Privacy policy                        | [privacy-desktop.png](images/privacy-desktop.png), [privacy-mobile.png](images/privacy-mobile.png)                                                                                                                                                         |
| Form errors                           | [form-errors-desktop.png](images/form-errors-desktop.png), [form-errors-mobile.png](images/form-errors-mobile.png)                                                                                                                                         |
| PDF, A4 pages 1 and 4                 | [pdf-page-1.png](images/pdf-page-1.png), [pdf-page-4.png](images/pdf-page-4.png)                                                                                                                                                                           |
| Favicon, share image                  | [favicon.png](images/favicon.png), [share-image.png](images/share-image.png)                                                                                                                                                                               |
| Motion (still of the live board)      | [motion.png](images/motion.png)                                                                                                                                                                                                                            |
| First screen after ad A (hero a)      | [hero-a-mobile.png](images/hero-a-mobile.png)                                                                                                                                                                                                              |
| Ads A and B, 4:5 and 9:16             | [ad-a-4x5.png](images/ad-a-4x5.png), [ad-a-9x16.png](images/ad-a-9x16.png), [ad-b-4x5.png](images/ad-b-4x5.png), [ad-b-9x16.png](images/ad-b-9x16.png)                                                                                                     |

The text spec and the design guide are the working references for agents. If an image or the Design Study disagrees with them, tell David and fix the files after he decides.

## Rules

- Spacing, type and colour only from tokens (SPEC §24). A value that is not in the guide needs a note in the PR.
- Wireframe copy is a draft. Final Czech copy comes from SPEC §25 and `src/content/copy.ts`, which lags the rev. 4 wireframes (note 0035).
- No logo design: the logo is final and lives in `public/brand/`.
- A change to the design lands in the Design Study first, then in these files.
