# Wireframe B: text spec

Written from the canvas [ETF Kompas – wireframes](https://claude.ai/artifact/8PaM6Y6wAcy6nZbQhtaDoi) and its exported images in [images/](images/) (index in [README.md](README.md)). Styles are in [DESIGN-GUIDE.md](DESIGN-GUIDE.md). All copy here is wireframe draft copy, in Czech as drawn. Final strings come from SPEC §25 in `src/content/copy.ts`.

Wireframes are at revision 2 (see decision note 0029). The fees of the three hero funds are real (VOO 0,03 %, QQQ 0,18 %, CSPX 0,07 %); the other fees and `X XXX Kč` stay placeholders until the data is verified (SPEC §18). The pill `[ověřit]` is a third, amber state ("unverified"): "Ne" is shown only where there is a source per broker. Square brackets such as `[SPRÁVCE]` and `[Firma A]` are slots filled from config or verified data.

## Sections of the landing page

The order matches SPEC §7. Desktop is 1280 px wide with 56 px gutters. Mobile is 390 px with 16 px gutters.

| #   | Section                         | Mobile                                      | Desktop                      |
| --- | ------------------------------- | ------------------------------------------- | ---------------------------- |
| 0   | Source bar                      | one line, 11 px                             | full width, two items        |
| 1   | Header                          | logo, "Menu" button                         | logo, nav, small CTA         |
| 2   | Hero                            | stacked                                     | two columns                  |
| 3   | Calculator and gate             | dark band, gate is a separate section below | one dark band, three columns |
| 4   | "Za co platíte, aniž to vidíte" | three stacked cards                         | three columns                |
| 5   | "Co dostanete e-mailem"         | two PDF previews, then text                 | text left, previews right    |
| 6   | "Proč nám věřit"                | three ruled blocks                          | three columns                |
| 7   | FAQ                             | four rows                                   | four rows                    |
| 8   | Footer                          | risk line, controller, links                | same, two columns            |
| 9   | Sticky CTA                      | bottom bar after first scroll               | none                         |

Images: [landing-desktop.png](images/landing-desktop.png), [landing-mobile.png](images/landing-mobile.png).

### 0. Source bar

Dark strip, one wording on desktop and phone: "Čísla ze stránek fondů a brokerů · ověřeno k 10. 2026". Desktop adds "Investování nese riziko ztráty." on the right. The date is generated from the data's `asOf`.

### 1. Header

Logo and "ETF Kompas". Desktop nav: Jak počítáme, Odkud máme čísla, Časté dotazy, and the small primary button "Poslat mi srovnání". Mobile: a "Menu" chip (44 px), the menu contents are not drawn.

### 2. Hero (variant b, table first)

- h1: "Které ETF si z Česka opravdu koupíte a kolik vás stojí?"
- Lead: "Stejný index často koupíte z Česka jen v evropské verzi. Ukážeme vám, kterou, u koho a za kolik."
- Callout: "**ETF** je fond, který jen kopíruje trh. Nemá drahé správce, a proto je levný." (the one use of "ETF", SPEC §25). On mobile it sits in its own band after the hero.
- Primary CTA: "Spočítat, kolik zaplatím", anchors to the calculator. Desktop adds a text link "nebo rovnou kontrola brokerů".
- Hero table card with caption "Cena a dostupnost", source line "zdroj: stránky fondů a brokerů · ověřeno k 10. 2026", header (Co koupíte, Roční poplatek, Koupíte z ČR?) and three rows:
  1. Americký fond na 500 největších firem, sub-label "odborně S&P 500, značka VOO", `0,03 %`, amber pill `[ověřit]` with "Ne u 3 z 5 brokerů".
  2. Americký fond na 100 technologických firem, "odborně Nasdaq 100, značka QQQ", `0,18 %`, amber pill `[ověřit]` with "Ne u 3 z 5 brokerů".
  3. Evropská verze prvního fondu, "stejných 500 firem, značka CSPX, sídlí v Evropě", `0,07 %`, pill "Ano", highlighted. The highlight means "buyable from Czechia", not "cheapest" (VOO has the lowest fee).
- Footnote: "Zvýrazněno je to, co koupíte z ČR, ne to nejlevnější. Nejnižší poplatek má VOO, ale u 3 z 5 brokerů ho nekoupíte. Jen cena a dostupnost, ne výnosy." (mobile: "Zvýrazněno = koupíte z ČR, ne nejlevnější. Jen cena a dostupnost, žádné výnosy.")
- Mobile order: h1, lead, table, CTA, footnote. The whole hero should fit 375x667 (SPEC §22, to be measured in Phase 3).
- Animation: see the table intro below.

### 2b. Hero (variant a, calculator first, board G5)

Image: [hero-a-mobile.png](images/hero-a-mobile.png).

Dark screen for visitors from ad A (375x667): source line, logo, h1 "Které ETF si z Česka opravdu koupíte?", sub-line "Zjistěte to za 20 sekund. Zdarma, bez registrace.", then the calculator controls directly (monthly slider, horizon chips 5 / 10 / 20), button "Ukázat, co koupím" and "Příklad výpočtu. Investování nese riziko ztráty." `?v=a` renders this hero and `?v=b` the table hero above (SPEC §22).

### 3. Calculator and gate

Dark band. Three desktop columns, one stacked column on mobile.

- **Inputs:** "Kolik to u vás dělá?"; slider "Kolik měsíčně uložíte" (500 to 20 000 Kč, step 500, default 3 000 Kč, value shown right); chips "Na jak dlouho" 5 / 10 / 20 "let", default 10.
- **Result:** tag "Za 10 let u amerického fondu zaplatíte víc o", then the big number (`X XXX Kč`), "Z toho jde na:" and three lines: roční poplatek fondu, převod korun na dolary, daň, kterou stáhne USA (each `X XXX Kč`), then "Počítáme s výnosem 6 % ročně u obou fondů. Je to příklad, ne slib." Under it a note: "Je americký fond levnější, uvidíte „méně o“. Z Česka ho ale zatím nekoupíte u všech brokerů [ověřit]." The label reads "zaplatíte víc o" or "méně o", depending on the result.
- **Gate** (right column on desktop, light card on the dark band; on mobile its own bordered card below the band): h2 "Chcete vidět, kde který fond koupíte?", "Fondy a 5 brokerů vedle sebe: kdo co nabízí a kolik stojí nákup. Česky, na jedné stránce.", label "Váš e-mail", placeholder `jmeno@domena.cz`, button "Poslat mi srovnání", legal line "Pošleme vám srovnání. Správce: [SPRÁVCE]. Zásady zpracování osobních údajů.", unticked checkbox "Chci občas dostat tip k investování (nepovinné)".

### 4. "Za co platíte, aniž to vidíte"

Three numbered cards. 1 Roční poplatek fondu: "Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu." 2 Převod korun: "Americké fondy chtějí dolary. Za každý převod z korun se platí." 3 Daň ze zisků: "Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou." (Mobile texts are shorter.)

### 5. "Co dostanete e-mailem"

Heading "8 fondů, 5 brokerů a co z toho koupíte z Česka", text "Otevře se hned po odeslání, nemusíte nic stahovat. U každého čísla uvádíme odkud je a z jakého měsíce.", button "Poslat mi srovnání" (desktop). Two page previews, "strana 1 – srovnání" and "strana 4 – daně", currently striped placeholders.

### 6. "Proč nám věřit"

Three ruled blocks: Odkud máme čísla ("Z oficiálních stránek fondů a zákona o daních. U všeho je datum."), Jak počítáme ("Postup je na jedné stránce. Můžete si ho přepočítat."), Nic neprodáváme ("Nedostáváme provize. Nejde o investiční poradenství.").

### 7. FAQ

Four collapsed rows with a "+" marker: Můžu si americký fond koupit z Česka? · Je to zdarma? · Co uděláte s mým e-mailem? · Radíte mi, co koupit? Answers are not drawn.

### 8. Footer

Dark. Risk line "Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství.", "Správce: [SPRÁVCE – IČO, adresa]", links Zásady zpracování and Cookies. The test-project notice from SPEC §17.15 is not drawn.

### 9. Sticky bar (mobile)

Appears after the first scroll: paper background, 1.5 px top border, a 48 px button "Poslat mi srovnání" that jumps to the gate.

## Hero table intro (board T1)

Image: [hero-table-animation.png](images/hero-table-animation.png).

Table card fades in, then rows 1 to 3 slide in one after another, then the highlighted row ("buyable from Czechia", CSPX) turns green. Timings are in [DESIGN-GUIDE.md](DESIGN-GUIDE.md) section 5. Reduced motion shows the final state. The board has a "Přehrát znovu" control for review only.

## After submit (boards E1 desktop, E2 mobile)

Images: [success-desktop.png](images/success-desktop.png), [success-mobile.png](images/success-mobile.png).

The success state replaces the gate in place, no redirect (SPEC §3.5).

- Green check icon and "Hotovo. Srovnání je připravené."
- Buttons: "Otevřít srovnání" (primary), "Stáhnout PDF · 6 stran" (outline).
- "Odkaz jsme poslali i na jmeno@domena.cz. Pokud nic nepřijde, zkontrolujte spam." and "Nejde to otevřít? Zkopírovat odkaz".
- Mobile: the calculator result stays on top as a compact dark band ("3 000 Kč měsíčně · 10 let · příklad, ne slib").
- Below: "Co dál" with three items (Projděte 8 fondů vedle sebe, Přečtěte si stránku o daních, Zjistěte, kde fond koupit).
- Small print: confirmation of the newsletter by one more tap in the email, the comparison is delivered either way, controller, unsubscribe in every email.

## Results page (boards F1 desktop, F2 mobile)

Images: [results-desktop.png](images/results-desktop.png), [results-mobile.png](images/results-mobile.png).

Top bar with source date "Ověřeno k 10. 2026 · u každého čísla je zdroj", logo and a PDF link. Then "Vaše srovnání" / "Srovnání 8 fondů" with "Ceny, sídlo fondu a to, kde je koupíte z Česka. Bez výnosů, jen to, co fond stojí." and the visitor's own result ("3 000 Kč měsíčně · 10 let", `X XXX Kč`). Desktop has a 220 px side navigation (Fondy, Daně, Kde koupit, Jak počítáme).

1. **Fondy vedle sebe**, sorted "koupitelné z ČR nahoře · pak podle poplatku". Desktop table: Co koupíte, Roční poplatek, Fond sídlí, Koupíte z ČR?, Zdroj ("stránka fondu ↗"). Eight rows with a plain name and ticker; mobile shows three and "Zobrazit dalších 5 fondů". Below the table, a fund × broker availability matrix ("Dostupnost podle brokera · ověřeno k 10. 2026"): CSPX Ano / [ověřit] / [ověřit] / Ano / Ano and VOO, QQQ Ne / [ověřit] / [ověřit] / Ne / Ne for DEGIRO, Fio, IBKR, Trading 212, XTB. Phone: a broker availability card.
2. **Daně v Česku**, three cards (Prodej po letech, Dividendy ze zahraničí, Přiznání), text from verified sources only, each with "Zdroj: … ↗", footnote "Obecná informace, ne daňové poradenství."
3. **Kde fond koupit**, "abecedně · bez provizí · stav 10. 2026", per broker: Poplatek za nákup, Převod korun, Česky, "ceník ↗"; mobile shows two and "Zobrazit dalších 3 firmy". Brokers are named and alphabetical: DEGIRO, Fio, IBKR, Trading 212, XTB.
4. **Jak počítáme**, what is and is not counted, "Otevřít postup".

- "Poslat odkaz znovu · Odkaz platí 30 dní · Poslat na můj e-mail".
- Footer with risk line, controller, "Zásady zpracování", "Odhlásit odběr".

## Ads (boards G1 to G4)

Images: [ad-a-4x5.png](images/ad-a-4x5.png), [ad-a-9x16.png](images/ad-a-9x16.png), [ad-b-4x5.png](images/ad-b-4x5.png), [ad-b-9x16.png](images/ad-b-9x16.png).

Ad creatives, not part of the app.

- **Ad A** (4:5 and 9:16): "Které ETF si z Česka opravdu koupíte?", huge `? z 8` in `cost-strong`, "fondů si z ČR opravdu koupíte", "Zjistěte to za 20 sekund. Zdarma.", "Investování nese riziko ztráty. Příklad výpočtu, ne slib výnosu."
- **Ad B** (4:5 and 9:16): split screen "Americký fond" (dark) versus "Evropský fond" (green tint) with a "vs" mark, panel labels "USA · VOO 0,03 %" and "Evropa · CSPX 0,07 %", "Který koupíte z Česka?", "Stejné firmy, jiná cena i dostupnost. Spočítáme to v korunách.", risk line.
- Ad A leads to hero a, ad B to hero b (my reading).
- The 9:16 layouts keep text out of the top 110 px and bottom 150 px for the Stories UI.

## Decisions (David, 2026-10-10)

1. **Calculator inputs:** monthly amount and horizon only. The initial lump sum is dropped for now, and SPEC §4 and §21 are updated. Note 0015.
2. **Hero animation:** kept. LCP is measured in Phase 3 and the animation is cut or shortened if the target (below 2.0 s) fails. SPEC §4 and §24 are updated. Note 0016.
3. **Copy:** the wireframe copy is the working copy and wins over SPEC §25 where they differ. It is reviewed later, and `copy:check` rules still apply when Phase 3 builds it. Note 0017.
4. **Hero variants:** `?v=a` is the calculator-first hero (board G5, ad A) and `?v=b` the table-first hero (ad B), as read in 2b. An unknown value falls back to `a`.

## Open points

1. **Not drawn:** FAQ answers, mobile menu, error and loading states, expired results link, StackedBar, cookie banner, the privacy page, the test-project notice.
2. **Wireframe sample data.** Row labels such as "Evropská verze prvního fondu" assume the verified data matches (same index, UCITS). If verification changes it, the rows change.
