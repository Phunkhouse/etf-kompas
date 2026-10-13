# Wireframe B: text spec (rev. 6)

Text version of every screen and state in the rev. 6 wireframes. The sources are the Wireframe Board (all screens on one canvas) and the Design Study (the same screens with the reasons), both linked from [README.md](README.md). Images are in [images/](images/). Styles are in [DESIGN-GUIDE.md](DESIGN-GUIDE.md). If this file and the Design Study disagree, the Design Study wins and this file gets fixed.

All copy here is wireframe copy, in Czech as drawn. The app copy follows SPEC §25 (no "ETF" in headlines, "firma" for "broker"), see notes 0017 and 0030 and the open points at the end. Square brackets such as `[SPRÁVCE]`, `[doplnit]` and `[ověřit]` are slots and amber "unverified" markers. `X XXX Kč` is a computed amount that is a placeholder until the data is verified (SPEC §18).

## Rules that hold everywhere

1. **Never "nejlevnější".** Not without verified prices for every broker. A highlighted row means "buyable from Czechia", not "cheapest".
2. **Every number has a source** and a month next to it. A "Ne" needs a source per broker. Anything unverified is the amber pill `[ověřit]`, never a guess.
3. **One illustrative assumption:** 6 % a year, the same for every fund, always labelled "příklad, ne slib", shown net of fees. Czech taxes and inflation are not counted and the page says so.
4. **The green saving box is a maximum:** "až X XXX Kč", "při vašem nastavení", "Odhad, bez českých daní a inflace". It is shown only when at least two brokers that offer the chosen fund have verified prices; otherwise the box and its button disappear.
5. **Currency:** the calculator prices each broker at its cheapest listing of the fund (euro at DEGIRO and Fio, dollars at Trading 212 and XTB for CSPX), so the row reads "převod korun na cizí měnu".
6. **Disclaimers stay visible:** the top bar and "Investování nese riziko ztráty", plus the footer text on every page. Not investment or tax advice.
7. **Consent:** the comparison needs only an e-mail. The tips checkbox is optional, unticked and confirmed by a second e-mail (double opt-in). Measurement and advertising cookies stay off until the visitor agrees.
8. **Placeholders look like placeholders:** `X XXX Kč`, `[ověřit]`, `[doplnit]`, `[SPRÁVCE]`.

## Screens

| Screen                                 | Sizes                                    | Boards and images                                                                                                                                                                                                                                          |
| -------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing page                           | desktop 1280, phone 390                  | [landing-desktop.png](images/landing-desktop.png), [landing-mobile.png](images/landing-mobile.png)                                                                                                                                                         |
| Calculator states                      | phone, desktop                           | [calculator-states-mobile.png](images/calculator-states-mobile.png), [calculator-states-desktop.png](images/calculator-states-desktop.png)                                                                                                                 |
| After submit                           | desktop, phone                           | [success-desktop.png](images/success-desktop.png), [success-mobile.png](images/success-mobile.png)                                                                                                                                                         |
| Comparison page                        | desktop, phone                           | [results-desktop.png](images/results-desktop.png), [results-mobile.png](images/results-mobile.png)                                                                                                                                                         |
| E-mail: confirm tips                   | 600                                      | [optin-email.png](images/optin-email.png)                                                                                                                                                                                                                  |
| Tips confirmed, link expired           | phone                                    | [optin-confirmed-mobile.png](images/optin-confirmed-mobile.png), [optin-expired-mobile.png](images/optin-expired-mobile.png)                                                                                                                               |
| Unsubscribe                            | phone                                    | [unsubscribed-mobile.png](images/unsubscribed-mobile.png)                                                                                                                                                                                                  |
| Menu                                   | phone                                    | [menu-mobile.png](images/menu-mobile.png)                                                                                                                                                                                                                  |
| Cookies                                | phone, desktop                           | [cookies-bar-mobile.png](images/cookies-bar-mobile.png), [cookies-settings-mobile.png](images/cookies-settings-mobile.png), [cookies-bar-desktop.png](images/cookies-bar-desktop.png), [cookies-settings-desktop.png](images/cookies-settings-desktop.png) |
| Privacy policy                         | desktop, phone                           | [privacy-desktop.png](images/privacy-desktop.png), [privacy-mobile.png](images/privacy-mobile.png)                                                                                                                                                         |
| 404                                    | phone (desktop is the same card centred) | [not-found-mobile.png](images/not-found-mobile.png)                                                                                                                                                                                                        |
| Form errors                            | phone, desktop                           | [form-errors-mobile.png](images/form-errors-mobile.png), [form-errors-desktop.png](images/form-errors-desktop.png)                                                                                                                                         |
| PDF, A4 pages 1 and 4                  | A4                                       | [pdf-page-1.png](images/pdf-page-1.png), [pdf-page-4.png](images/pdf-page-4.png)                                                                                                                                                                           |
| Favicon, share image                   | 16 to 180 px, 1200 x 630                 | [favicon.png](images/favicon.png), [share-image.png](images/share-image.png)                                                                                                                                                                               |
| Motion (live HTML)                     | 1280                                     | [motion.png](images/motion.png) (still)                                                                                                                                                                                                                    |
| Hero variant b (A/B test), ads A and B | 4:5, 9:16, desktop, phone                | [ad-a-4x5.png](images/ad-a-4x5.png), [ad-a-9x16.png](images/ad-a-9x16.png), [ad-b-4x5.png](images/ad-b-4x5.png), [ad-b-9x16.png](images/ad-b-9x16.png), [hero-b-desktop.png](images/hero-b-desktop.png), [hero-b-mobile.png](images/hero-b-mobile.png)     |

The main path is five steps: ad, landing page (hero table and calculator), e-mail form, success page, comparison page and PDF (valid 30 days).

## Landing page

The order of sections matches SPEC §7. Desktop is 1280 px wide with 56 px gutters. Phone is 390 px with 16 px gutters (20 px in the calculator).

### Top bar and header

- **Top bar:** "Čísla ze stránek fondů a brokerů · ověřeno k 6. 2026" (the oldest date in the data) and "Investování nese riziko ztráty." Ink band, 13 px (11 on the phone). The date is generated from the data's `asOf`.
- **Header:** desktop has the wordmark, three anchors (Jak počítáme, Odkud máme čísla, Časté dotazy) and the small button "Poslat mi srovnání". Phone has the wordmark and a hamburger button labelled "Menu". The phone page also has a sticky bottom bar with the same button after the first scroll (48 px button, 1.5 px top border).

### Hero

- h1: "Americké indexy z Česka: u koho je koupíte a za kolik?"
- Lead: "Stejné firmy ze S&P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik." (one line on the phone)
- Callout with a left rule explaining ETF (the one use of the word).
- Primary button "Spočítat, kolik mě to bude stát", with the muted line "Zdarma, bez registrace" under it (centred on a phone, left-aligned on desktop; 14 px; decided 2026-10-13 before the 5-second test). The link "nebo rovnou srovnání brokerů" was dropped in rev. 6.
- **Hero table** card with four European twins: Co koupíte, Poplatek*, Typ (Acc / Dist). Rev. 6: a row is titled by the index ("S&P 500", "Nasdaq 100"), with manager, ticker and a plain description under it ("iShares CSPX, 500 největších firem"; note 0043). A footnote explains the asterisk: "* Roční poplatek fondu, počítaný z vašich peněz ve fondu." A fact that is not verified would carry `[ověřit]`; today all four rows are verified (CSPX, VUAA, CNDX, EQQQ). One short line under it: "CSPX: 5 známých brokerů · ověřeno k 6. 2026" (the count comes from the data; Czech plural: 1 známý broker, 2 to 4 známí brokeři, 5 známých brokerů). On wide screens the line goes on with " · jen cena a dostupnost, ne výnosy" and, in variant b, a second line with the setting of the amount. On a phone a note after the ETF callout names the brokers and says the rest: "Brokeři: DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212, XTB. Jen cena a dostupnost, ne výnosy." plus the setting sentence in variant b. The American funds are explained by the callout alone (decided 2026-10-13: the long line was a wall of text). The only asterisk is "Poplatek*".
- Mobile order: h1, lead, callout, table, button.

### Calculator

Dark band directly under the hero, so the first scroll answers "what does it cost me". Three desktop columns, one stacked column on the phone. States are in [calculator-states-mobile.png](images/calculator-states-mobile.png).

- **Question:** "Kolik vás to bude stát?"
- **Inputs:** monthly amount 500 to 20 000 Kč in steps of 500, default 3 000 Kč, shown right-aligned and large. Period chips 5 / 10 / 20 years, default 10. One investment a month.
- **Result:** "Za 10 let vás fond (CSPX) může u ověřených brokerů stát i X XXX Kč" (note 0037), then three parts: roční poplatek fondu, převod korun na cizí měnu, poplatky brokera. Then "Počítáme s výnosem 6 % ročně. Je to příklad, ne slib. Nepočítáme české daně ani inflaci." The boards show the real result of the calculator at 3 000 Kč, 10 years, 6 %: 30 778 Kč (1 748 + 13 434 + 15 596), value after 10 years 456 642 Kč, saving 28 302 Kč.
- **Illustrative line:** "Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč · 6 % ročně, příklad, ne slib." Net of fees, small, under the result.
- **Green saving box:** "Při vašem nastavení · Správným brokerem si u stejného fondu ponecháte až X XXX Kč · Odhad, bez českých daní a inflace." Button "Ukázat, u kterého brokera to koupím", which goes to the e-mail form. The amount is the spread between brokers that offer the chosen fund.
- **Hide rule:** the box and its button show only when at least two brokers have verified prices. Otherwise the calculator ends with the illustrative line and the form follows.
- **Loading:** grey placeholders and "Načítáme aktuální poplatky…", the inputs still work. **Failure:** no amount at all, "Částku teď nespočítáme, aby nebyla nepřesná", button "Zkusit znovu".
- The visitor's amount and period are carried to the comparison page, the PDF and the e-mail.
- There is no "expected return" figure: it looks like a forecast and is identical for every fund, so it cannot be part of a comparison. The page shows what the visitor keeps.

### E-mail form

Light card (on the phone its own card below the calculator). "Chcete vidět, kde který fond koupíte?", one field (Váš e-mail, placeholder `jmeno@domena.cz`), the button "Poslat mi srovnání", the legal line with the controller and a link to the privacy policy, and the optional unticked checkbox "Chci občas dostat tip k investování (nepovinné)". Errors are described under "Form errors" below.

### A/B test (hero variants)

`?v=a` and `?v=b` render the same page. Only the h1 differs. This tests headline framing, hypothesis 2 in SPEC §11 (metric: visit to `calc_start`; guard metrics: bounce and lead quality). Decision: note 0041.

| Variant                                | h1                                                                                                         | Images                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `a` (default, also for an unknown `v`) | "Americké indexy z Česka: u koho je koupíte a za kolik?"                                                   | [landing-desktop.png](images/landing-desktop.png), [landing-mobile.png](images/landing-mobile.png)         |
| `b`                                    | "U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?" (the amount in the cost red #C23A1B, rev. 6) | [hero-b-desktop.png](images/hero-b-desktop.png), [hero-b-mobile.png](images/hero-b-mobile.png) (hero only) |

- Layout, lead, table, calculator, form and buttons are identical. The non-breaking spaces keep "X XXX Kč" on one line.
- **Honest number:** the amount is the saving box maximum for the default setting (3 000 Kč a month, 10 years). Variant `b` adds one sentence to the line under the table: "Částka v nadpisu: 3 000 Kč měsíčně, 10 let, odhad bez českých daní a inflace."
- **Hide rule:** variant `b` is served only when the saving box hide rule is met (at least two brokers with verified prices). Otherwise every visitor gets `a`.
- **Ads:** both ad sets send traffic to both variants, split equally, so ad angle and headline are separate factors. `utm_content` carries both.
- **Not tested here:** calculator-first against table-first (dropped), gate placement (hypothesis 1) and form friction (hypothesis 3). They run later as separate tests.
- **Before launch:** check the hero still fits 375 x 667 with the longer headline and the extra sentence (SPEC §22), and build `track()` with `variant` on every event.

### The explainer sections

- **Za co platíte, aniž to vidíte:** three numbered cards: roční poplatek fondu, převod korun, daň ze zisků (what foreign tax withholding means). One plain sentence each.
- **Co dostanete e-mailem:** two blurred previews of the real PDF (page 1 comparison, page 4 taxes), a short heading and the button again. Final art is a blurred screenshot of the real pages.
- **Proč nám věřit:** three items with a top rule: Odkud máme čísla, Jak počítáme, Nic neprodáváme. The header anchors land here.
- **Časté dotazy:** four accordion questions: Můžu si americký fond koupit z Česka? · Je to zdarma? · Co uděláte s mým e-mailem? · Radíte mi, co koupit? The answers are not drawn.
- **Footer:** ink band with the wordmark, risk and not-advice text, controller, four links (Jak počítáme, Zásady zpracování, Cookies, Kontakt).

## After submit and e-mail

- **Success page** (replaces the gate in place, no redirect): the visitor's number again, "Hotovo. Srovnání je připravené.", buttons "Otevřít srovnání" and "Stáhnout PDF · 6 stran", "Odkaz jsme poslali i na [e-mail]. Pokud nic nepřijde, zkontrolujte spam.", "Zkopírovat odkaz", three "Co dál" items and the consent note.
- **Tips and double opt-in:** if the tips checkbox was ticked, a second e-mail arrives with one button "Ano, posílejte mi tipy". The comparison never waits for it. Confirmation page: "Odběr tipů potvrzen". A used or expired link gets "Tento odkaz už nefunguje" with a way back.
- **Unsubscribe:** every e-mail has a link. The page says "Odhlášeno", offers "Přihlásit zpět" and states when the e-mail is deleted.

## Comparison page

- **Header:** wordmark and the button "Stáhnout PDF · 6 stran". Desktop has a left "Na stránce" contents (1 Fondy vedle sebe, 2 Daně v Česku, 3 Kde fond koupit, 4 Jak počítáme). On the phone the contents become a card.
- **Result strip:** dark band with the visitor's setup (3 000 Kč měsíčně · 10 let) and the same headline number as the calculator.
- **1 · Fondy vedle sebe:** five European twins with Typ and Roční poplatek (CSPX, VUAA, VUSA, CNDX, EQQQ). "Acc = fond výnosy sám reinvestuje. Dist = výnosy vyplácí." All five fees are verified; an unverified fee would be `[ověřit]`.
- **U kterého brokera?** A fund picker (CSPX selected), then five brokers (DEGIRO, Fio, IBKR, Trading 212, XTB) with Koupíte?, Poplatky brokera a převod and Za 10 let celkem. The boards show CSPX with the real prices (DEGIRO 14 416 Kč, Fio 30 778 Kč, Trading 212 2 476 Kč, XTB 4 176 Kč); IBKR has nothing verified and stays `[ověřit]`. Cells without a source stay `[ověřit]` and are left out of the spread.
- **Assumption and summary:** "3 000 Kč měsíčně · 10 let · 6 % ročně · jedna investice měsíčně · příklad, ne slib. Částky se řídí kalkulačkou." Then "Mezi ověřenými brokery se výsledek liší až o X XXX Kč. Nejnižší možné poplatky s vaším nastavením: X XXX Kč za 10 let." and "Odhad. Bez českých daní a inflace."
- **2 · Daně v Česku:** three short items (prodej po letech, dividendy ze zahraničí, přiznání), each with a source link. Text is filled in only from a verified source.
- **3 · Kde fond koupit:** broker table: poplatek za nákup, převod korun, česky, source link. To be merged with the broker table above once prices are verified.
- **4 · Jak počítáme:** one page of method: fund fee, currency conversion, broker fees counted; inflation and Czech taxes not. Link "Otevřít postup".
- **Resend:** "Odkaz platí 30 dní." and a button to send the link to the visitor's e-mail again.
- The phone page stacks the same content: five fund cards, the fund picker, one card per broker, the summary lines.

## Menu, cookies, legal, errors

- **Phone menu:** hamburger with a label (44 px target, `aria-expanded`). Open: full-height panel with the three page anchors in 60 px rows, Zásady zpracování, Cookies, Kontakt, and the main button pinned to the bottom. The page behind does not scroll.
- **Footer links:** Jak počítáme, Zásady zpracování, Cookies, Kontakt. Kontakt goes to the controller section of the privacy page. Cookies reopens the settings.
- **Cookies:** first visit shows a bar (bottom sheet on the phone) with "Přijmout vše" and "Odmítnout vše" equally prominent, and "Nastavit". Settings: Nezbytné (always on), Měření návštěvnosti, Reklama a remarketing, both off until agreed. Buttons "Uložit výběr" and "Přijmout vše".
- **Privacy policy:** contents list and seven sections: kdo údaje zpracovává, jaké údaje, proč a na jakém základě, jak dlouho, komu je předáváme, vaše práva (including the complaint to the Czech data protection office), cookies. The text is a placeholder with `[doplnit]` gaps and needs a lawyer's review before launch.
- **404:** "Tuhle stránku jsme nenašli", button "Zpět na úvod", link to Jak počítáme.
- **Invalid e-mail:** red border and a message in words under the field: "Zadejte e-mail ve tvaru jmeno@domena.cz." Linked with `aria-describedby`, not shown by colour alone.
- **Send failed:** banner above the form: "Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli." The e-mail and the calculator setup stay filled, the button reads "Zkusit znovu". There is no consent error, because the checkbox is optional.

## PDF, favicon, sharing

- **PDF on A4:** white paper, ink only. Wordmark and the visitor's setup in the header. Page 1 is the comparison table fund x broker with the same `[ověřit]` rule and the illustrative line. Page 4 is the tax page and says nothing that is not from a verified source. Footer: not advice, verified month, controller, page x / 6. Pages 2, 3, 5 and 6 are not drawn.
- **Favicon:** the compass mark without text, SVG for browsers, PNG 180 px for iPhone, 32 and 16 px for tabs. Readable on light and dark browser chrome.
- **Share image:** 1200 x 630 with the wordmark, the headline, "Poplatky fondů a brokerů v korunách. Na jedné stránce." and the compass tile. Must stay readable at thumbnail size. Title: "ETF Kompas: americké indexy z Česka, u koho je koupíte". Description: "Srovnání evropských ETF na S&P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce." (to confirm).

## Motion

The Motion board is live HTML with a looping demo for every animated section and a button that shows the reduced-motion result. Timings and rules are in [DESIGN-GUIDE.md](DESIGN-GUIDE.md) section 5. [motion.png](images/motion.png) is a still of it.

## Ads

Ad creatives, not part of the app.

- **Ad A** (4:5 and 9:16): the hero headline and the unknown "? z 5" with "brokerů nabízí evropský fond na S&P 500" (the number is a placeholder until verified). CTA "Zjistěte to za 20 sekund. Zdarma." Footer "Investování nese riziko ztráty. Příklad výpočtu, ne slib výnosu."
- **Ad B** (4:5 and 9:16): two twins side by side, "iShares · CSPX 0,07 %" (Fond A) and "Vanguard · VUAA 0,07 %" (Fond B), "U koho je koupíte a za kolik?" and "Stejný index, jiný fond i broker. Spočítáme to v korunách."
- Both ad sets send traffic to both landing variants (see "A/B test" above). The calculator-first hero that followed ad A in rev. 4 was dropped in rev. 5.
- Feed 4:5 is 540 x 675 and stories 9:16 is 405 x 720. The 9:16 layouts keep text out of the top 110 px and bottom 150 px for the Stories UI.

## Open points

1. **Data to verify:** everything about IBKR; the "Česky" column for every broker; broker prices for VUAA, VUSA, CNDX and EQQQ (only DEGIRO has VUAA and CNDX priced, VUSA and EQQQ none); the fund fees and the availability of the five funds at DEGIRO, Fio, Trading 212 and XTB are verified; tax text from Finanční správa; the calculator formula as a tested pure function.
2. **Legal text** (privacy policy, cookies, controller, retention periods) must be written and reviewed by someone qualified before launch.
3. **Not drawn:** the main e-mail with the comparison link, PDF pages 2, 3, 5 and 6, desktop versions of 404, unsubscribe and the confirmation pages, FAQ answers, StackedBar, the test-project notice.
4. **Copy conflicts with SPEC §25.** The wireframes say "ETF" in the share title, ad copy and the calculator result, "broker" in many places, "S&P 500" and "Nasdaq 100" in the lead. `pnpm copy:check` bans some of these. Which side moves is David's call (note 0035).
5. **Type sizes:** the drawn 54 / 44 / 30 px headings do not match the tokens (DESIGN-GUIDE section 2).
