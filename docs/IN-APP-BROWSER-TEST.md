# In-app browser test (SPEC §23)

Phase 6. Most ad clicks open the page inside the Instagram or Facebook app, in a webview where downloads, storage and some inputs behave differently. This is the manual test on a real phone, against the live address. The result goes into a decision note (David gives the reasons); this file is the checklist and the record.

Address: `https://etf-kompas-kappa.vercel.app`. Use an address that is on `EMAIL_SANDBOX_ALLOWLIST` and that is **not** forwarded (the `pm.me` address works; mail to `david-krapka.eu` is lost in the forwarding).

## Setup

- [ ] Send the address to yourself in an **Instagram DM** and in a **Messenger** chat.
- [ ] Note the phone, the system version and the app versions in the record below.
- [ ] Open the link by tapping it **inside the app** (not "open in browser"). Do this in a fresh run for each app: Instagram first, then Messenger.

## Per app: Instagram, then Messenger

Mark each line `ok`, `problem` (write what you saw) or `n/a`.

**The page**

1. The first screen fits: headline, table and the button are visible without scrolling.
2. The page scrolls normally and nothing is cut off at the bottom (the bar of the app does not cover content).
3. Sliders (monthly amount) move by finger; the year chips change the result.
4. The cookie bar shows. "Přijmout vše" and "Odmítnout vše" both work, and the bar goes away. Open "Cookies" in the footer: the settings open.

**The form**

5. Scroll to the form. The e-mail field is **not** focused by itself (no keyboard on arrival).
6. Tap the field: the keyboard opens, the sticky bar (if shown) does not jump over the field, and the page does not zoom.
7. Type the address and press the button. The success state shows "Otevřít srovnání" first, then "Stáhnout PDF · 6 stran".
8. "Otevřít srovnání" opens the results page inside the app. It shows your setup and the table.
9. The PDF link: it opens or downloads. Write what happened (opens in the app, asks to open in Safari or Chrome, or does nothing). SPEC §23 asks for a hint "Nejde to otevřít? Zkopírovat odkaz" when it does not work. **That hint is not built yet** (checked in `src/`).
10. Back button of the app returns to the page without losing the filled calculator.

**The e-mails**

11. The comparison e-mail arrives. Open its link from the mail app (for example Proton Mail or Gmail), which opens its own webview: the results page works there.
12. The tips e-mail (tick the box when you submit): the confirm link opens the page, the button confirms, the confirmed page shows.
13. The unsubscribe link opens and works; "Přihlásit zpět" undoes it.

## Check the events afterwards

In Supabase, SQL editor (use the time of your test):

```sql
select created_at, name, device, in_app_browser, consent_measurement, variant
from events
where created_at > now() - interval '1 hour'
order by created_at desc
limit 40;
```

- [ ] The rows from the in-app visit have `in_app_browser = true` and `device = phone`.
- [ ] After "Odmítnout vše" the visit's first-party events are still written (`consent_measurement = false`).
- [ ] `lead` appears once for a new address (a repeat of the same address adds none).

## Record

Reported by David on 2026-10-14. A line he did not report is marked "not reported", not guessed.

| Field                | Value                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- |
| Date                 | 2026-10-14                                                                              |
| Phone and system     | iPhone 14 Pro, iOS 27.0.1                                                               |
| Instagram version    | 451.0.0                                                                                 |
| Messenger version    | 583.0.0                                                                                 |
| Mail app and version | not reported. E-mail links opened in Safari by default, so no mail-app webview was used |

| #   | Instagram    | Messenger    | Notes                                                                                 |
| --- | ------------ | ------------ | ------------------------------------------------------------------------------------- |
| 1   | ok           | ok           | screen fits                                                                           |
| 2   | not reported | not reported |                                                                                       |
| 3   | ok           | ok           | sliders and chips                                                                     |
| 4   | ok (bar)     | ok (bar)     | the cookie bar works; the footer "Cookies" reopening the settings: not reported       |
| 5   | ok           | ok           | not focused on arrival                                                                |
| 6   | ok           | ok           | no zoom, no jump                                                                      |
| 7   | ok           | ok           | "Otevřít srovnání" first, then the PDF                                                |
| 8   | not reported | not reported | the results page itself; the link after the submit is item 7                          |
| 9   | ok           | ok           | the PDF link opens inside the app, so the "Zkopírovat odkaz" hint was not needed here |
| 10  | ok           | ok           | the back button keeps the filled calculator                                           |
| 11  | n/a          | n/a          | e-mail links open in Safari by default, not in a mail-app webview                     |
| 12  | not reported | not reported | the tips confirmation                                                                 |
| 13  | ok           | ok           | unsubscribe works; "Přihlásit zpět" not reported                                      |

Events check (above), reported by David on 2026-10-14 from the Supabase table `events` (the 3 in-app visits between 15:47 and 15:55 UTC):

- The rows of the in-app visits have `in_app_browser = true` and `device = phone`; the desktop rows and the earlier phone rows (normal browser) have `in_app_browser = false`. The flag works in the real apps.
- Events are written before and without consent: the first `page_view` of an in-app visit has `consent_measurement = false`, and the later ones of the same visit have `true` after the cookie bar was accepted.
- The server-side `lead` rows have no device and no in-app flag (they are written by the server) and carry the visit's consent: one `lead` for the in-app submit at 15:54:28 UTC.
- On the phone the funnel runs in the order of the page: `page_view`, `calc_start`, `gate_view`, `form_focus`, `lead`; `calc_result` came after the `lead` in that visit because the result was in view for a second only after the visitor scrolled back to it (the rule of note about `calc_result` in `docs/PHASE-5-PLAN.md`).
- Not checked: which of the in-app visits was Instagram and which Messenger (the table has no app name), and the addresses (the table has none).

## After the test

Whatever is marked `problem` becomes a fix (one PR each) or a line in the README gaps. The decision note records the outcome and David's reasons for each decision (what we fix now, what we accept).
