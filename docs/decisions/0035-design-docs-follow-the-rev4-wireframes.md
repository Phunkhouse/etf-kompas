# 0035. The design docs follow the rev. 4 wireframes

Date: 2026-10-12
Status: proposed
Phase: 3

## Context

After note 0030, David reworked the wireframes into revision 4 in the Design Study and the Wireframe Board and asked for `docs/design` to reflect them. Rev. 4 changes the hero (new headline and a four-fund table), adds the green saving box with a hide rule, the fund x broker comparison, and the pages and states that were missing (menu, cookies, privacy policy, 404, unsubscribe, double opt-in, form errors, calculator states, PDF, favicon, share image), and replaces the single hero animation with a motion scale. The design docs described rev. 2.

## Decision

`docs/design` is rewritten to rev. 4: the guide, the text spec, the README, the wireframes folder and all PNG exports. The Design Study is the source of truth and the files here follow it. The old `build.py`, `dump_frames.py`, `png.js`, the rev. 2 document and the hero animation image are removed. The code and `src/content/copy.ts` are not changed in this PR.

## Points that need David's decision

1. **Copy against SPEC §25.** Rev. 4 writes "ETF" in the share title and ad copy, "broker" throughout, and "S&P 500" and "Nasdaq 100" in the hero lead. `pnpm copy:check` bans some of these. Either the glossary moves or the wireframe copy does. Note 0030 chose the glossary for the app.
2. **Headline.** The wireframe h1 is "Americké indexy z Česka: u koho je koupíte a za kolik?". The app has the note 0030 headline. `copy.ts` and the components lag the design and are a follow-up.
3. **Type tokens.** Rev. 4 draws the landing h1 at 54 px desktop and 30 px phone and other-page h1 at 44 px. The tokens are 58 (`4xl`) and 28 (`hero-phone`, note 0031) with nothing at 44.
4. **Hero animation.** Note 0016 keeps the hero intro with a green highlight stage on the buyable row. The new hero table has no such row, so that stage is not drawn. The rev. 4 motion scale replaces it, and the result count-up becomes a number swap that never counts.
5. **Privacy policy text** is a placeholder with `[doplnit]` gaps and needs a lawyer's review before launch.

## Alternatives considered

- Leave the old docs and point to the artifacts only: not chosen, David asked for the docs to reflect the design, and the artifacts are private.

## Consequences

- Agents reading `docs/design` get rev. 4. Code that still follows rev. 2 differs until the follow-up PRs land.
- The wireframe HTML files and their build scripts live in the repo, so the PNGs can be regenerated.
- No reason beyond David's request was given for the rev. 4 content decisions, and none is recorded here.
