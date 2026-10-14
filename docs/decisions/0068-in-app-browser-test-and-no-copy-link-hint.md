# 0068. In-app browser test passed on one phone; the copy-link hint is not built

Date: 2026-10-14
Status: accepted
Phase: 6

Note: the reason for leaving the hint out is David's ("it opened in both apps, so it is not needed now", 2026-10-14). The context, the record and the consequences are written by the agent from David's report; the full record is in `docs/IN-APP-BROWSER-TEST.md`.

## Context

SPEC §23 asks for a manual test on a real phone, with the deployed link opened inside Instagram and Messenger, and for a hint "Nejde to otevřít? Zkopírovat odkaz" next to the PDF in case the PDF does not open in a webview. The test was run on 2026-10-14 on an iPhone 14 Pro (iOS 27.0.1), in Instagram 451.0.0 and Messenger 583.0.0, against `https://etf-kompas-kappa.vercel.app`.

## Decision

The hint is not built. The PDF opened inside both apps, so it is not needed now.

## Result of the test (as reported by David)

- Both apps: the first screen fits; sliders and year chips work; the cookie bar works; the e-mail field is not focused on arrival; tapping it causes no zoom and no jump; "Otevřít srovnání" comes before the PDF; the PDF link opens in the app; the app's back button keeps the filled calculator; the unsubscribe link works.
- E-mail links open in Safari by default on this phone, so no mail-app webview was tested.
- The stored events (Supabase `events`) show `in_app_browser = true` and `device = phone` for the in-app visits and `false` for the others; events are written before consent too.
- Not reported: scrolling under the app bar, the footer "Cookies" link, the results page itself, the tips confirmation and "Přihlásit zpět".

## Alternatives considered

- Build the hint now: not needed on the tested setup (David's reason). It costs a small component and copy that passes `copy:check`.

## Consequences

- One phone and one iOS version were tested. Android, older iOS and other apps (TikTok, Gmail's webview) are untested, and on those the PDF may not open; the README lists this as a known gap.
- If a later test shows the PDF failing in a webview, the hint of SPEC §23 is the first fix.
- The in-app browser checklist of SPEC §22 Phase 6 is met for this device; the stored `in_app_browser` flag is confirmed by the Supabase query.
