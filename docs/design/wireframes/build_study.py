#!/usr/bin/env python3
"""Builds the design study (the current design, source of truth) from the artboards, the logo files and doc.css / doc.js.
usage: build_study.py <artboard-dir> <logo-dir> <out.html>   e.g. python3 build_study.py artboards-v4 logo etf-kompas-design-study.html"""
import re, sys, html, os

ART, LOGO, OUT = sys.argv[1:4]
LIGHT = open(f'{LOGO}/etf-kompas-logo.svg').read().strip()
DARK = open(f'{LOGO}/etf-kompas-logo-dark.svg').read().strip()
FAV = open(f'{LOGO}/favicon.svg').read().strip()


def logo(w, h, dark=False, extra=''):
    s = DARK if dark else LIGHT
    s = s.replace('width="188" height="48"', f'width="{w}" height="{h}" style="display:block;flex:none;{extra}"', 1)
    return s


def favicon(size):
    return FAV.replace('width="48" height="48"', f'width="{size}" height="{size}"', 1)


FONTS = ('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap')

BOARDS = [
    # id, file, title, w, h
    ('Main', 'a8f21cef', 'Landing page · desktop', 1280, 2900),
    ('B-mobile', 'ad67ec35', 'Landing page · mobil', 390, 3500),
    ('E1-success-desktop', '642661e9', 'Po odeslání · desktop', 1280, 640),
    ('E2-success-mobile', '4555091e', 'Po odeslání · mobil', 390, 1300),
    ('F1-results-desktop', '92ef8ee0', 'Srovnání · desktop', 1280, 2300),
    ('F2-results-mobile', '24e61a2e', 'Srovnání · mobil', 390, 2800),
    ('M1-menu', 'mm01menu', 'Menu otevřené · mobil', 390, 760),
    ('C1-bar-m', 'ck01bar-m', 'Cookies · mobil', 390, 780),
    ('C3-set-m', 'ck03set-m', 'Nastavení cookies · mobil', 390, 700),
    ('X1-404', 'er01404-m', 'Stránka nenalezena · mobil', 390, 760),
    ('X2-unsub', 'er02unsub-m', 'Odhlášeno z odběru · mobil', 390, 760),
    ('C2-bar-d', 'ck02bar-d', 'Cookies · desktop', 1280, 560),
    ('C4-set-d', 'ck04set-d', 'Nastavení cookies · desktop', 1280, 800),
    ('P1-priv-d', 'pp01priv-d', 'Zásady zpracování · desktop', 1280, 1500),
    ('P2-priv-m', 'pp02priv-m', 'Zásady zpracování · mobil', 390, 2300),
    ('FE1', 'fe01form-m', 'Formulář, chyby · mobil', 390, 946),
    ('FE2', 'fe02form-d', 'Formulář, chyby · desktop', 1280, 504),
    ('OI1', 'oi01mail', 'E-mail, potvrzení odběru tipů', 600, 600),
    ('OI2', 'oi02ok-m', 'Odběr potvrzen · mobil', 390, 760),
    ('OI3', 'oi03old-m', 'Odkaz už nefunguje · mobil', 390, 760),
    ('LC1', 'lc01calc-m', 'Kalkulačka, načítání a chyba · mobil', 390, 1048),
    ('LC2', 'lc02calc-d', 'Kalkulačka, načítání a chyba · desktop', 1280, 643),
    ('PD1', 'pd01pdf1', 'PDF · strana 1 (A4)', 794, 1123),
    ('PD2', 'pd02pdf4', 'PDF · strana 4 (A4)', 794, 1123),
    ('FV1', 'fv01favicon', 'Favicon', 640, 360),
    ('SH1', 'sh01share', 'Sdílený náhled', 1200, 630),
    ('MO1', 'mo01motion', 'Pohyb · živé ukázky', 1280, 2522),
    ('G1-adA-4x5', '8e84da19', 'Reklama A · 4:5', 540, 675),
    ('G2-adA-9x16', '6bf92b0b', 'Reklama A · 9:16', 405, 720),
    ('G3-adB-4x5', 'c2093dbc', 'Reklama B · 4:5', 540, 675),
    ('G4-adB-9x16', '4b5adee3', 'Reklama B · 9:16', 405, 720),
    ('VB1', 'vb01hero-d', 'Landing page · verze b · jen hero · desktop', 1280, 800),
    ('VB2', 'vb02hero-m', 'Landing page · verze b · jen hero · mobil', 390, 820),
]
BD = {b[0]: b for b in BOARDS}
# rendered height = measured content height (declared canvas heights leave empty space below the footer)
RH = {'Main': 2852, 'B-mobile': 3701, 'E1-success-desktop': 777, 'E2-success-mobile': 1050,'M1-menu':760,'C1-bar-m':780,'C3-set-m':700,'X1-404':760,'X2-unsub':760,'C2-bar-d':560,'C4-set-d':800,'P1-priv-d':1257,'P2-priv-m':1718,'FE1':946,'FE2':504,'OI1':600,'OI2':760,'OI3':760,'LC1':1048,'LC2':643,'PD1':1123,'PD2':1123,'FV1':360,'SH1':630, 'F1-results-desktop': 2679, 'F2-results-mobile': 3475, 'MO1': 2522}


def board_doc(fid):
    s = open(f'{ART}/{fid}.html').read()
    s = re.sub(r'@font-face\s*\{[^}]*\}', '', s)
    s = re.sub(r'/\* [a-z0-9-]+ \*/\s*', '', s)
    if not fid.startswith('mo'):
        s = re.sub(r'<script[^>]*>.*?</script>', '', s, flags=re.S)
    s = s.replace('<x-dc>', '').replace('</x-dc>', '').replace('<helmet>', '').replace('</helmet>', '')
    s = s.replace('<style></style>', '')
    s = s.replace('sc-camel-view-box=', 'viewBox=')
    s = s.replace('<sc-raw-', '<').replace('</sc-raw-', '</')
    s = s.replace('class="{{stageClass}}"', 'id="stage"')
    s = s.replace('sc-camel-on-click="{{replay}}"',
                  'onclick="var s=document.getElementById(\'stage\');s.classList.add(\'off\');setTimeout(function(){s.classList.remove(\'off\')},80)"')

    # swap every inline logo for the real file, keeping the artboard's size
    def sw(m):
        tag = m.group(0)
        w = re.search(r'width="(\d+)"', tag).group(1)
        h = re.search(r'height="(\d+)"', tag).group(1)
        dark = '#F6F1E7' in tag
        return logo(w, h, dark)
    s = re.sub(r'<svg viewBox="0 0 188.3 48.0"[^>]*aria-label="ETF Kompas">.*?</svg>', sw, s, flags=re.S)
    s = s.replace('<head>', f'<head><link rel="stylesheet" href="{FONTS}"><style>html{{overflow:hidden}}</style>', 1)
    return s


def frame(bid, scale_hint=None, cls=''):
    _, fid, title, w, h = BD[bid]
    h = RH.get(bid, h)
    src = html.escape(board_doc(fid), quote=True)
    return (f'<div class="frame {cls}" data-w="{w}" data-h="{h}" style="--w:{w}px;--h:{h}px">'
            f'<div class="frame-in"><iframe title="{html.escape(title)}" width="{w}" height="{h}" scrolling="no" '
            f'loading="lazy" srcdoc="{src}"></iframe></div></div>')


def plate(bid, kind, extra=''):
    _, fid, title, w, h = BD[bid]
    return (f'<figure class="plate {kind}" id="{bid}"><figcaption><span class="tag">Artboard · {bid}</span>'
            f'<b>{html.escape(title)}</b><span class="dim">{w} × {h}{extra}</span></figcaption>{frame(bid)}</figure>')


def notes(items, cols=2):
    out = f'<ol class="notes c{cols}">'
    for t, d in items:
        out += f'<li><b>{t}</b><span>{d}</span></li>'
    return out + '</ol>'


E = html.escape

# ───────────────────────── current design: source of truth ─────────────────────────
HERO = 'Americké indexy z Česka: u koho je koupíte a za kolik?'
EXTRA_CSS = '''.pill.ver,.pl.v{background:#F3E6BE;color:#6B4E00}.sw i.dk{border-color:#16150F}
.rules{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:0 40px}
.rules li{padding:14px 0;border-top:1px solid var(--line);font-size:14.5px;color:var(--ink-2)}.rules li b{display:block;color:var(--ink);font-size:15px;margin-bottom:2px}
.sitemap td:first-child{white-space:nowrap}
.hist{border-left:2px solid var(--line);padding-left:20px;display:flex;flex-direction:column;gap:18px;margin-top:8px}.hist div b{display:block;font:500 12px var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}.hist p{font-size:15px}
'''
CSS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'doc.css')).read() + EXTRA_CSS
JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'doc.js')).read()

def sw(name, hexv, use, dark=False):
    return f'<div class="sw"><i style="background:{hexv}"></i><b>{name}</b><code>{hexv}</code><span>{use}</span></div>'

def rules(items):
    return '<ul class="rules">' + ''.join(f'<li><b>{a}</b>{b}</li>' for a, b in items) + '</ul>'

def facts(items):
    return '<div class="facts">' + ''.join(f'<div><b>{a}</b>{b}</div>' for a, b in items) + '</div>'

def table(head, rows, cls='inv'):
    return (f'<div class="tablewrap"><table class="{cls}"><thead><tr>' + ''.join(f'<th>{h}</th>' for h in head) + '</tr></thead><tbody>'
            + ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows) + '</tbody></table></div>')

PRODUCT_CLAIMS = [
    ('What it is', 'A Czech-language comparison for people who want to buy American stock indexes (S&amp;P 500, Nasdaq 100) from Czechia: which European fund tracks the index, which broker sells it, and what it costs over the years, in koruna.'),
    ('The hook', f'„{HERO}“ American VOO and QQQ are what people search for, but most Czech brokers will not sell them. The page compares the European twins (CSPX, VUAA, VUSA, CNDX, EQQQ) and asks <i>where</i> and <i>for how much</i>.'),
    ('Who it is for', 'Beginners who read in a few seconds. Plain Czech, no jargon (ETF is explained once, in one sentence), native copy that David reviews himself.'),
    ('What it is not', 'No advice, no forecasts, no „nejlepší“. Costs and availability only, never returns. Nothing is sold, no commissions.'),
]
RULES = [
    ('Never „nejlevnější“', 'Not without verified prices for every broker. A highlighted row means „buyable from Czechia“, not „cheapest“.'),
    ('Every number has a source', 'Source and month next to it. A „Ne“ needs a source per broker. Anything unverified is the amber pill <code>[ověřit]</code>, never a guess.'),
    ('One illustrative assumption', '6 % a year, the same for every fund, always labelled „příklad, ne slib“, shown net of fees. Czech taxes and inflation are not counted and the page says so.'),
    ('The green saving box is a maximum', '„až X XXX Kč“, „při vašem nastavení“, „Odhad, bez českých daní a inflace“. Shown only when at least two brokers that offer the chosen fund have verified prices; otherwise the box and its button disappear.'),
    ('Currency', 'Each broker is priced at its cheapest listing of the fund (rev. 6), so the row reads „převod korun na cizí měnu“ (it was „na dolary“).'),
    ('Disclaimers stay visible', 'Top bar „Čísla ze stránek fondů a brokerů · ověřeno k 6. 2026“ (the oldest date in the data, rev. 6) and „Investování nese riziko ztráty“, plus the footer text on every page. Not investment or tax advice.'),
    ('Consent', 'The comparison needs only an e-mail. The tips checkbox is optional, unticked, and confirmed by a second e-mail (double opt-in). Measurement and advertising cookies stay off until the visitor agrees.'),
    ('Placeholders look like placeholders', 'X XXX Kč for computed amounts, <code>[ověřit]</code> for unverified facts, <code>[doplnit]</code> for legal gaps, <code>[SPRÁVCE]</code> for the controller.'),
]
SWATCHES = [
    ('Paper', '#F6F3EC', 'Page background'), ('Card', '#FFFDF8', 'Cards, forms'), ('Line', '#D4CEBE', 'Hairlines, card borders'),
    ('Ink', '#16150F', 'Text, buttons, dark bands'), ('Ink 2', '#3A372E', 'Body text on paper'), ('Muted', '#6B665A', 'Notes, captions, tags'),
    ('On dark', '#F6F3EC', 'Text on ink'), ('On dark 2', '#D9D4C5', 'Secondary text on ink'), ('On dark 3', '#B9B3A2', 'Tags and notes on ink'), ('Rule on dark', '#4A473D', 'Dividers on ink'),
    ('Result number', '#F2A18C', 'The big „X XXX Kč“ on ink'), ('Logo orange', '#D9480F', 'Needle in the logo (#F06A2E on ink)'),
    ('Saving green', '#1F3A2B', 'Saving box fill (border #2F6B49)'), ('Saving text', '#9AD4B2', 'Saving amount, tag, button fill; note text #B9D9C6'),
    ('Yes', '#D6E8DE', 'Pill „Ano“, text #154A33'), ('No', '#F4D9D1', 'Pill „Ne“ and error banners, text #7A2410'),
    ('Verify', '#F3E6BE', 'Pill <code>[ověřit]</code>, text #6B4E00'), ('Error', '#B3341A', 'Field border and message on invalid input'),
]
TYPE_ROWS = [
    ('H1 · landing', 'IBM Plex Sans 700', '54 / 1.04, −0.025em (desktop) · 30 / 1.06 (phone)'),
    ('H1 · other pages', 'IBM Plex Sans 700', '44 / 1.05 desktop (privacy) · 34–36 / 1.05 phone'),
    ('H2', 'IBM Plex Sans 700', '32 desktop · 24 phone, −0.02em'),
    ('Result number', 'IBM Plex Sans 700', '80 (after submit) · 60 landing phone · 52 phone result strip, −0.03em, tabular numbers, colour #F2A18C'),
    ('Lead', 'IBM Plex Sans 400', '20 desktop · 16 phone'),
    ('Body', 'IBM Plex Sans 400', '16 / 1.45; 15 in forms; 14 in rows'),
    ('Small and notes', 'IBM Plex Sans 400', '13 desktop · 12 phone, muted colour'),
    ('Tag', 'IBM Plex Mono 500', '11 (desktop) · 10 (phone), uppercase, +0.06em'),
    ('Button', 'IBM Plex Sans 600', '17 (15 in the small button)'),
    ('Wordmark', 'Serif wordmark with compass „o“', 'From the logo files only; never retyped. 126 px wide desktop header, 102 px phone, 110 px footer'),
]
SITEMAP = [
    ('Motion', '1280', 'One live artboard with looping demos of every animated section and the timing rules'),
    ('Ads', 'Feed 4:5, stories 9:16 · A and B', 'Concept A and B (artboards G1 to G4); both lead to both landing variants'),
    ('Landing page', 'Desktop 1280, phone 390', 'Main (hero, table, calculator, form, explainers, trust, FAQ, footer)'),
    ('Landing page · variant b', 'Desktop, phone (hero only)', 'Same page, headline for the A/B test (<code>?v=b</code>)'),
    ('After submit', 'Desktop, phone', 'E1, E2: the comparison is ready, link also sent by e-mail'),
    ('Comparison page', 'Desktop, phone', 'F1, F2: five funds, brokers, taxes, where to buy, method; valid 30 days'),
    ('PDF', 'A4', 'Six pages; pages 1 and 4 drawn'),
    ('E-mail: confirm tips', '600', 'Sent only when the tips checkbox was ticked'),
    ('Tips confirmed, link expired', 'Phone', 'Landing pages for the confirmation link'),
    ('Unsubscribe', 'Phone', 'Landing page for the link in every e-mail'),
    ('Menu, cookies', 'Phone, desktop', 'Open menu; cookie bar; cookie settings'),
    ('Privacy policy', 'Desktop, phone', 'Seven sections; also holds the controller contact'),
    ('404', 'Phone', 'Desktop is the same card centred'),
    ('Errors', 'Phone, desktop', 'Invalid e-mail, send failed, calculator loading and load failure'),
    ('Favicon, share image', '16 to 180 px, 1200 × 630', 'Compass mark; headline card'),
]
N_LANDING = [
    ('Top bar', '„Čísla ze stránek fondů a brokerů · ověřeno k 6. 2026“ and „Investování nese riziko ztráty.“ Ink band, 13 px (11 on the phone).'),
    ('Header', 'Desktop: wordmark and three anchors (Jak počítáme, Odkud máme čísla, Časté dotazy) plus the small button „Poslat mi srovnání“. Phone: wordmark and a hamburger button with the label „Menu“; the phone page also has a sticky bottom bar with the same button.'),
    ('Hero', f'H1 „{HERO}“, lead „Stejné firmy ze S&amp;P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik.“ (one line on the phone), an ETF explainer with a left rule, the button „Spočítat, kolik mě to bude stát“ (rev. 6: the link „nebo rovnou srovnání brokerů“ is gone). This is variant a; variant b changes only the headline, see below.'),
    ('Hero table', 'Card with four European twins: Co koupíte, Poplatek*, Typ (Acc / Dist), rev. 6. A row is titled by the index (S&amp;P 500, Nasdaq 100) with manager, ticker and a plain description under it („iShares CSPX, 500 největších firem“). A footnote explains the asterisk: „* Roční poplatek fondu, počítaný z vašich peněz ve fondu.“ A fact that is not verified would carry <code>[ověřit]</code>; today all four rows are verified. One short line under it: „CSPX: 5 známých brokerů · ověřeno k 6. 2026“ (wide screens add „jen cena a dostupnost, ne výnosy“ and, in variant b, the setting of the amount). On a phone a note after the ETF callout names the brokers. The callout alone explains the American funds.'),
    ('Calculator', 'Dark band, see section 05. It sits directly under the hero so the first scroll answers „what does it cost me“.'),
    ('E-mail form', 'Light card: „Chcete vidět, kde který fond koupíte?“, one field (e-mail), the button „Poslat mi srovnání“, controller and privacy link, and the optional tips checkbox. Error states in section 08.'),
    ('Za co platíte, aniž to vidíte', 'Three numbered cards: roční poplatek fondu, převod korun, daň ze zisků (what foreign tax withholding means). Plain words, one sentence each.'),
    ('Co dostanete e-mailem', 'Two blurred previews of the real PDF (page 1 comparison, page 4 taxes), a short heading and the button again. Final art is a blurred screenshot of the real pages.'),
    ('Proč nám věřit', 'Three items with a top rule: Odkud máme čísla, Jak počítáme, Nic neprodáváme. The anchors in the header land here.'),
    ('Časté dotazy', 'Four accordion questions: Můžu si americký fond koupit z Česka? · Je to zdarma? · Co uděláte s mým e-mailem? · Radíte mi, co koupit?'),
    ('Footer', 'Ink band: wordmark, risk and not-advice text, controller, four links (Jak počítáme, Zásady zpracování, Cookies, Kontakt).'),
]
N_CALC = [
    ('Question', '„Kolik vás to bude stát?“'),
    ('Inputs', 'Monthly amount 500 to 20 000 Kč in steps of 500, default 3 000 Kč, shown right-aligned and large. Period chips 5 / 10 / 20 years, default 10. One investment a month.'),
    ('Result', '„Za 10 let vás fond (CSPX) může u ověřených brokerů stát i 30 778 Kč“ (rev. 6; the amount is the real calculator result at the dearest verified broker), then the three parts: roční poplatek fondu, převod korun na cizí měnu, poplatky brokera. Then „Počítáme s výnosem 6 % ročně. Je to příklad, ne slib. Nepočítáme české daně ani inflaci.“'),
    ('Illustrative line', '„Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč · 6 % ročně, příklad, ne slib.“ Net of fees, same assumption for every fund, small, under the result.'),
    ('Green saving box', '„Při vašem nastavení · Správným brokerem si u stejného fondu ponecháte až X XXX Kč · Odhad, bez českých daní a inflace.“ Button „Ukázat, u kterého brokera to koupím“, which goes to the e-mail form. The amount is the spread between brokers that offer the chosen fund.'),
    ('Hide rule', 'The box and its button show only when at least two brokers have verified prices. Otherwise the calculator ends with the illustrative line and the form follows. Never „až 0 Kč“ and never an invented number.'),
    ('Loading and failure', 'Loading: grey placeholders and „Načítáme aktuální poplatky…“, sliders still work. Failure: no amount at all, „Částku teď nespočítáme, aby nebyla nepřesná“, button „Zkusit znovu“.'),
    ('Why not „expected return“', 'A return figure looks like a forecast and is identical for every fund, so it cannot be part of a comparison. The page shows what the visitor <i>keeps</i>, not what the market might give.'),
    ('Carry-through', 'The visitor\'s amount and period are carried to the comparison page, the PDF and the e-mail.'),
]
N_F1 = [
    ('Header', 'Wordmark and the button „Stáhnout PDF · 6 stran“. Left column on desktop: „Na stránce“ contents (1 Fondy vedle sebe, 2 Daně v Česku, 3 Kde fond koupit, 4 Jak počítáme). On the phone the contents become a card.'),
    ('Result strip', 'Dark band with the visitor\'s setup (3 000 Kč měsíčně · 10 let) and the same headline number as the calculator.'),
    ('1 · Fondy vedle sebe', 'Five twins with Typ and Roční poplatek. „Acc = fond výnosy sám reinvestuje. Dist = výnosy vyplácí.“ All five fees are verified (rev. 6); an unverified fee would carry <code>[ověřit]</code>.'),
    ('U kterého brokera?', 'Fund picker (CSPX selected), then five brokers (DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212, XTB) with Koupíte?, Poplatky brokera and Za 10 let celkem. Cells without a source stay <code>[ověřit]</code> and are left out of the spread.'),
    ('Assumption and summary', '„3 000 Kč měsíčně · 10 let · 6 % ročně · jedna investice měsíčně · příklad, ne slib. Částky se řídí kalkulačkou.“ Then „Mezi ověřenými brokery se výsledek liší až o X XXX Kč. Nejnižší možné poplatky s vaším nastavením: X XXX Kč za 10 let.“ and „Odhad. Bez českých daní a inflace.“'),
    ('2 · Daně v Česku', 'Three short items (prodej po letech, dividendy ze zahraničí, přiznání), each with a source link. Text is filled in only from a verified source; until then the placeholder says so.'),
    ('3 · Kde fond koupit', 'Table of brokers: poplatek za nákup, převod korun, česky, source link. To be merged with the broker table above once prices are verified.'),
    ('4 · Jak počítáme', 'One page of method: fund fee, currency conversion, broker fees counted; inflation and Czech taxes not. Link „Otevřít postup“.'),
    ('Resend link', '„Odkaz platí 30 dní.“ and a button to send the link to the visitor\'s e-mail again.'),
]
FUNDS = [('S&amp;P 500', 'iShares Core S&amp;P 500 UCITS · CSPX', 'Acc', '0,07 %', True), ('S&amp;P 500', 'Vanguard S&amp;P 500 UCITS · VUAA', 'Acc', '0,07 %', True),
         ('S&amp;P 500', 'Vanguard S&amp;P 500 UCITS · VUSA', 'Dist', '0,07 %', True), ('Nasdaq 100', 'iShares Nasdaq 100 UCITS · CNDX', 'Acc', '0,30 %', True),
         ('Nasdaq 100', 'Invesco EQQQ Nasdaq-100 UCITS · EQQQ', 'Dist', '0,30 %', True)]
N_AFTER = [
    ('Success page', 'Right after the form: the visitor\'s number again, „Hotovo. Srovnání je připravené.“, buttons „Otevřít srovnání“ and „Stáhnout PDF · 6 stran“, „Odkaz jsme poslali i na [e-mail]. Pokud nic nepřijde, zkontrolujte spam.“, „Zkopírovat odkaz“, three „Co dál“ items and the consent note.'),
    ('Tips and double opt-in', 'If the tips checkbox was ticked, a second e-mail arrives with one button „Ano, posílejte mi tipy“. The comparison never waits for it. Confirmation page: „Odběr tipů potvrzen“. A used or expired link gets „Tento odkaz už nefunguje“ with a way back.'),
    ('Unsubscribe', 'Every e-mail has a link. The page says „Odhlášeno“, offers „Přihlásit zpět“ and states when the e-mail is deleted.'),
]
N_NAV = [
    ('Phone menu', 'Hamburger with a label (44 px target, aria-expanded). Open: full-height panel with the three page anchors in 60 px rows, Zásady zpracování, Cookies, Kontakt, and the main button pinned to the bottom. The page behind does not scroll.'),
    ('Footer links', 'Jak počítáme, Zásady zpracování, Cookies, Kontakt. Kontakt goes to the controller section of the privacy page. Cookies reopens the settings.'),
    ('Cookies', 'First visit: bar (bottom sheet on the phone) with „Přijmout vše“ and „Odmítnout vše“ equally prominent, and „Nastavit“. Settings: Nezbytné (always on), Měření návštěvnosti, Reklama a remarketing, both off until agreed. Buttons „Uložit výběr“ and „Přijmout vše“.'),
    ('Privacy policy', 'Contents list and seven sections: kdo údaje zpracovává, jaké údaje, proč a na jakém základě, jak dlouho, komu je předáváme, vaše práva (including the complaint to the Czech data protection office), cookies. Text is a placeholder with <code>[doplnit]</code> gaps and needs a lawyer\'s review before launch.'),
    ('404', '„Tuhle stránku jsme nenašli“, button „Zpět na úvod“, link to Jak počítáme.'),
    ('Invalid e-mail', 'Red border and a message in words under the field: „Zadejte e-mail ve tvaru jmeno@domena.cz.“ Linked with aria-describedby, not shown by colour alone.'),
    ('Send failed', 'Banner above the form: „Odeslání se nepovedlo. Zkuste to prosím znovu za chvíli.“ The e-mail and the calculator setup stay filled; the button reads „Zkusit znovu“. No consent error exists, because the checkbox is optional.'),
]
N_OUT = [
    ('PDF on A4', 'White paper, ink only. Wordmark and the visitor\'s setup in the header; page 1 is the comparison table fund × broker with the same <code>[ověřit]</code> rule and the illustrative line; page 4 is the tax page and says nothing that is not from a verified source. Footer: not advice, verified month, controller, page x / 6.'),
    ('Favicon', 'The compass mark without text: SVG for browsers, PNG 180 px for iPhone, 32 and 16 px for tabs. Readable on light and dark browser chrome.'),
    ('Share image', '1200 × 630: wordmark, the headline, „Poplatky fondů a brokerů v korunách. Na jedné stránce.“, compass tile. Must stay readable at thumbnail size. Title for sharing: „ETF Kompas: americké indexy z Česka, u koho je koupíte“. Description: „Srovnání evropských ETF na S&amp;P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce.“ (to confirm).'),
]
N_AB = [
    ('What is tested', 'Headline framing: a loss-framed number against the neutral question (SPEC section 11, hypothesis 2). Metric: visit to <code>calc_start</code>. Guard metrics: bounce and lead quality.'),
    ('Variant a (<code>?v=a</code>, default)', f'H1 „{HERO}“. This is the landing page drawn above.'),
    ('Variant b (<code>?v=b</code>)', 'H1 „U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?“ Everything else is identical: layout, lead, table, calculator, form, buttons. The non-breaking spaces keep „X XXX Kč“ on one line.'),
    ('Honest number', 'The amount is the saving box maximum for the default setting (3 000 Kč a month, 10 years). One line under the table says so: „Částka v nadpisu: 3 000 Kč měsíčně, 10 let, odhad bez českých daní a inflace.“ Variant b is served only when the saving box hide rule is met (two brokers with verified prices). Otherwise every visitor gets a.'),
    ('Ads', 'Both ad sets send traffic to both variants, split equally. Ad angle and headline are separate factors.'),
    ('Not tested here', 'Calculator-first against table-first (dropped), gate placement (hypothesis 1) and form friction (hypothesis 3). They run later as separate tests, in that order of expected impact.'),
    ('Before launch', 'Check that the hero still fits 375 × 667 with the longer headline and the extra note (SPEC section 22). <code>track()</code> and the <code>variant</code> field on every event must exist, or the test cannot be read.'),
]
N_ADS = [
    ('Ad A', f'Headline „{HERO}“ and the unknown „? z 5“ with „brokerů nabízí evropský fond na S&amp;P 500“ (the number is a placeholder until verified). CTA „Zjistěte to za 20 sekund. Zdarma.“ Footer: „Investování nese riziko ztráty. Příklad výpočtu, ne slib výnosu.“'),
    ('Ad B', 'Two twins side by side, „iShares · CSPX 0,07 %“ (Fond A) and „Vanguard · VUAA 0,07 %“ (Fond B), „U koho je koupíte a za kolik?“ and „Stejný index, jiný fond i broker. Spočítáme to v korunách.“'),
    ('Sizes', 'Feed 4:5 is 540 × 675, stories 9:16 is 405 × 720. Keep the risk line inside the safe area.'),
    ('Ad and landing variant', 'The ad angle (A or B) and the landing headline (a or b) are separate factors. Each ad set sends traffic to two URLs, <code>?v=a</code> and <code>?v=b</code>, split equally, with <code>utm_content</code> carrying both. The calculator-first hero that used to follow ad A was dropped in rev. 5.'),
]
VERIFY = [
    ('Fees', 'VUAA, VUSA, CNDX, EQQQ', 'Verified (rev. 6): factsheets and KIDs of the issuers, date and link per number. The earlier „CSNDX 0,33 %“ was from memory; the verified CNDX fee is 0,30 %.'),
    ('Availability', '5 funds × 5 brokers', 'Broker search or price list. Verified so far: CSPX at DEGIRO, Trading 212, XTB. Fio and IBKR: open.'),
    ('Fio and IBKR for US funds', 'QQQ, VOO', 'Fio lists QQQ (under its old name) in its ETF directory and not VOO; order access is unverified. IBKR: unverified. Wording stays „u většiny brokerů nekoupíte“.'),
    ('Broker prices', 'Order fee, currency conversion, custody', 'Price list per broker, with date. Needed for „Za 10 let celkem“ and the saving box.'),
    ('Currency listing', 'CSPX and the others', 'USD or EUR line per broker; each broker is priced at its cheapest listing (verified for CSPX; the others follow).'),
    ('Tax text', 'Acc / Dist, 3-year test, foreign withholding', 'Only from a verified source (Finanční správa), with a link per statement.'),
    ('Legal text', 'Privacy policy, cookies, controller', 'Written and reviewed by someone qualified. Consent flow and retention periods decided.'),
    ('Calculator formula', 'Fund fee, FX, broker fees, rounding', 'Pure function with tests, every rate from a dated data file.'),
]
BUILD = [
    ('Not drawn', 'The main e-mail with the comparison link (subject, preview text, one button). The six PDF pages other than 1 and 4. Desktop versions of 404, unsubscribe and the confirmation pages (same card, centred).'),
    ('Exports', 'PNG exports of the favicon (16, 32, 180) and the share image from these designs. A blurred screenshot of the real PDF pages for the landing page.'),
    ('Focus and motion', 'Visible focus on every control: 3 px solid ring with 2 px offset, ink on paper and paper on dark bands (design guide section 6). Reduced motion is respected everywhere. The old hero table animation (artboard T1, drawn for the first table) is not part of this document; the motion artboard has the current hero sequence.'),
    ('Copy in code', 'The app copy file (<code>src/content/copy.ts</code>) must be brought in line with this document.'),
]
HISTORY = [
    ('rev. 1', 'The original wireframes: an American versus a European fund, and a calculator that showed the difference in Kč.'),
    ('rev. 2', 'Highlighted row means buyable from Czechia, not cheapest. Real fees, „Ne“ only with a source, <code>[ověřit]</code> otherwise. The calculator prices the fund you can buy.'),
    ('rev. 3', 'European twins instead of VOO and QQQ. New headline about <i>where</i> and <i>how much</i>. Typ column. Fund × broker comparison. New ad copy.'),
    ('rev. 5', 'A/B test defined: <code>?v=a</code> and <code>?v=b</code> share one layout and differ only in the headline (neutral question against a loss-framed number). The calculator-first hero and its artboard were dropped from the documents; ads A and B lead to both variants.'),
    ('rev. 4', 'The green saving box with its hide rule, CSPX in dollars, more room in the phone calculator, honest placeholder previews. Hamburger menu, cookies, privacy policy, 404, unsubscribe, double opt-in, form errors, calculator states, PDF, favicon and share image. This document rewritten as the current reference.'),
]

NAV = [('cover', '00', 'Cover'), ('produkt', '01', 'Product and rules'), ('system', '02', 'Design system'), ('mapa', '03', 'Screens and flow'),
       ('landing', '04', 'Landing page'), ('kalkulacka', '05', 'Calculator'), ('srovnani', '06', 'Comparison page'), ('po', '07', 'After submit and e-mail'),
       ('web', '08', 'Menu, cookies, legal, errors'), ('vystupy', '09', 'PDF, favicon, sharing'), ('motion', '10', 'Motion'), ('reklamy', '11', 'Ads'),
       ('otevrene', '12', 'Open data and build'), ('historie', '13', 'History')]

def section_head(num, title, lead=''):
    return (f'<header class="sh"><span class="num-big">{num}</span><div><h2>{title}</h2>'
            + (f'<p class="lead">{lead}</p>' if lead else '') + '</div></header>')

p = []
p.append(f'''<!doctype html><html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ETF Kompas Design Study</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="{FONTS}">
<style>{CSS}</style></head><body>
<aside class="side" id="side"><a class="side-logo" href="#cover" aria-label="ETF Kompas">{logo(126, 32)}</a>
<nav aria-label="Obsah">{''.join(f'<a href="#{i}" data-s="{i}"><i>{n}</i>{t}</a>' for i, n, t in NAV)}</nav>
<p class="side-foot">Design · rev. 6<br>13. 10. 2026</p></aside>
<main>''')
p.append(f'''<section class="cover" id="cover"><div class="cover-top">{logo(188, 48, True)}<span class="tag on-dark">Design · current · rev. 5</span></div>
<div class="cover-mid"><span class="tag on-dark">Source of truth</span><h1>ETF Kompas<br>Design study</h1>
<p>The design as it stands: what the product is and the rules it follows, the design system, every screen and every state. The Wireframe Board shows the same screens on one canvas; this document says why they look like this and what they must do.</p></div>
<dl class="cover-meta"><div><dt>Datum</dt><dd>13. 10. 2026</dd></div><div><dt>Autor</dt><dd>David Krapka</dd></div><div><dt>Stav</dt><dd>Hotový návrh · rev. 6</dd></div><div><dt>Úroveň</dt><dd>Wireframe · čísla jsou z ověřených dat k 13. 10. 2026, [ověřit] = neověřeno</dd></div></dl>
<div class="cover-compass" aria-hidden="true">{favicon(520)}</div></section>''')

p.append('<section id="produkt" class="sec">' + section_head('01', 'Product and rules', 'What the site is for and the rules every screen follows. If a screen and a rule disagree, the rule wins.')
         + '<div class="claims">' + ''.join(f'<div><h4>{a}</h4><p>{b}</p></div>' for a, b in PRODUCT_CLAIMS) + '</div>'
         + '<h3>Rules that hold everywhere</h3>' + rules(RULES) + '</section>')

p.append('<section id="system" class="sec">' + section_head('02', 'Design system', 'Light paper pages with dark ink bands, IBM Plex, one warm number colour. Small and strict: a handful of colours, two fonts, a few components.')
         + '<h3>Colour</h3><div class="swatches">' + ''.join(sw(*s) for s in SWATCHES) + '</div>'
         + '<h3>Type</h3>' + table(['Role', 'Face and weight', 'Size / line / tracking'], [(f'<b>{a}</b>', b, c) for a, b, c in TYPE_ROWS])
         + '<h3>Logo</h3><div class="logos"><div class="lg">' + logo(188, 48) + '<span>On paper</span></div><div class="lg dark">' + logo(188, 48, True) + '<span>On ink</span></div><div class="lg">' + favicon(64) + '<span>Compass mark · favicon</span></div></div>'
         + '<h3>Components</h3>'
         '<div class="comp"><div class="comp-t"><h4>Buttons</h4><p>Primary ink, outlined secondary, small. Minimum height 56 (44 small), radius 6, label 17 / 600. On ink bands the button is paper; in the saving box it is light green. Full width on the phone.</p></div><div class="comp-s"><div class="row-s"><span class="btn">Poslat mi srovnání</span><span class="btn o">Stáhnout PDF · 6 stran</span><span class="btn sm">Poslat mi srovnání</span><span class="btn" style="background:#9AD4B2;color:#16150F">Ukázat, u kterého brokera to koupím</span></div></div></div>'
         '<div class="comp"><div class="comp-t"><h4>Chips</h4><p>Period selector 5 / 10 / 20. 48 px high, pill, selected = filled. Inverts on ink bands.</p></div><div class="comp-s"><div class="row-s"><span class="chip">5</span><span class="chip on">10</span><span class="chip">20</span><div class="dk"><span class="chip">5</span><span class="chip on">10</span><span class="chip">20</span></div></div></div></div>'
         '<div class="comp"><div class="comp-t"><h4>Pills and tags</h4><p>Pills carry facts: Ano, Ne, [ověřit], Acc, Dist. Tags are mono caps labels above content. Colour is never the only signal; the word is always there.</p></div><div class="comp-s"><div class="row-s"><span class="pill yes">Ano</span><span class="pill no">Ne</span><span class="pill ver">[ověřit]</span><span class="pill" style="background:#E6E1D4">Acc</span><span class="tag">Co koupíte</span></div></div></div>'
         '<div class="comp"><div class="comp-t"><h4>Cards and the saving box</h4><p>Card: paper-white, 1 px line, radius 10. The saving box is the only green surface and only appears under the hide rule.</p></div><div class="comp-s"><div class="duo"><div class="card pad"><span class="tag">Cena fondů</span><p style="margin-top:8px">iShares CSPX · 0,07 %</p></div><div style="background:#1F3A2B;border:1px solid #2F6B49;border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:8px"><span class="tag" style="color:#9AD4B2">Při vašem nastavení</span><p style="font-size:17px;font-weight:600;color:#F6F3EC">Správným brokerem si u stejného fondu ponecháte až <span style="color:#9AD4B2">X XXX Kč</span></p><span style="font-size:12px;color:#B9D9C6">Odhad, bez českých daní a inflace.</span></div></div></div></div>'
         '<div class="comp"><div class="comp-t"><h4>Form field</h4><p>56 px high, 1.5 px ink border, 17 px text, label above. Error: 2 px red border and a message in words below; the field is marked invalid for screen readers.</p></div><div class="comp-s"><div class="duo"><div class="gate"><label>Váš e-mail</label><div class="inp">jmeno@domena.cz</div></div><div class="gate"><label>Váš e-mail</label><div class="inp" style="border:2px solid #B3341A;color:#16150F">jmeno@domena</div><small style="color:#B3341A;font-size:14px;font-weight:500">Zadejte e-mail ve tvaru jmeno@domena.cz.</small></div></div></div></div>'
         '<div class="comp"><div class="comp-t"><h4>Switch</h4><p>Cookie settings. 48 × 28, knob 22. Off: muted track (#6B665A, 5.6:1 on the card); on: green #2F6B49. Always-on „Nezbytné“ looks on and carries the label „vždy zapnuto“. Slides in 150 ms.</p></div><div class="comp-s"><div class="row-s"><span style="width:48px;height:28px;border-radius:99px;background:#6B665A;position:relative;display:inline-block"><i style="position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff"></i></span><span style="width:48px;height:28px;border-radius:99px;background:#2F6B49;position:relative;display:inline-block"><i style="position:absolute;left:23px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff"></i></span></div></div></div>'
         '<h3>Layout and behaviour</h3>' + facts([
             ('Frames', 'Desktop 1280 wide, content padding 56. Phone 390 wide, padding 16 (20 in the calculator).'),
             ('Rhythm', 'Sections 40 to 64 px apart on desktop, 24 to 40 on the phone. The calculator band is the one generous space: 40 px padding, 28 px between blocks on the phone.'),
             ('Touch targets', 'At least 44 px. Buttons 56, chips 48, hamburger 44.'),
             ('Radius', '6 on buttons and fields, 10 on cards, 99 on pills and chips.'),
             ('Theme', 'Light pages with dark ink bands. No dark mode for the site.'),
             ('Motion', 'Hero card and table rows slide in once (0.7 s). Everything stops under „reduce motion“.'),
             ('Language', 'Czech, with „“ quotation marks and a non-breaking space in „X XXX Kč“. Currency always Kč.'),
             ('Accessibility', 'Real labels, aria-describedby on errors, visible focus, contrast AA on all text, hamburger announces open or closed.'),
         ]) + '</section>')

p.append('<section id="mapa" class="sec">' + section_head('03', 'Screens and flow', 'The main path is five steps. Everything else supports it.')
         + '<ol class="flow"><li><b>Ad</b><span>Question headline, „? z 5“ or two twins</span></li><li><b>Landing</b><span>Hero table, calculator</span></li><li><b>Form</b><span>E-mail, tips optional</span></li><li><b>Success</b><span>Comparison ready, link sent</span></li><li><b>Comparison</b><span>Web page and PDF, valid 30 days</span></li></ol>'
         + '<h3>All screens</h3>' + table(['Screen', 'Sizes', 'What it is'], [(f'<b>{a}</b>', b, c) for a, b, c in SITEMAP], 'inv sitemap') + '</section>')

p.append('<section id="landing" class="sec">' + section_head('04', 'Landing page', 'One page, top to bottom: the question, the table, the cost, the e-mail, then trust. Desktop 1280 and phone 390.')
         + plate('Main', 'wide')
         + '<div class="dual"><div>' + plate('B-mobile', 'phone') + '</div><div><h3>Section by section</h3>' + notes(N_LANDING, 1) + '</div></div>'
         + '<h3>Hero variants for the A/B test</h3>' + notes(N_AB, 2) + plate('VB1', 'wide') + '<div class="dual"><div>' + plate('VB2', 'phone') + '</div><div></div></div></section>')

p.append('<section id="kalkulacka" class="sec">' + section_head('05', 'Calculator', 'It answers one question: what does the fund you can actually buy cost over the years, with the broker as the lever. It ends on something positive, but only when the data supports it.')
         + notes(N_CALC) + '<h3>Loading and failure</h3><div class="adrow">' + plate('LC1', 'ad') + '</div>' + plate('LC2', 'wide')
         + '<div class="cols3"><div class="col"><h3>Counted</h3><ul><li>Fund fee, currency conversion, broker fees.</li><li>6 % a year, one investment a month.</li></ul></div>'
         '<div class="col"><h3>Not counted</h3><ul><li>Czech taxes.</li><li>Inflation.</li><li>Returns as a forecast.</li></ul></div>'
         '<div class="col"><h3>Decide before building</h3><ul><li>Formula and rounding.</li><li>Which broker prices feed the spread, and what happens with <code>[ověřit]</code> cells (left out, with „mezi ověřenými brokery“).</li><li>How the setup reaches the e-mail.</li></ul></div></div></section>')

p.append('<section id="srovnani" class="sec">' + section_head('06', 'Comparison page', 'What the visitor receives: five European funds side by side, and for the chosen fund the five brokers with the cost over the chosen years.')
         + plate('F1-results-desktop', 'wide') + '<h3>Sections</h3>' + notes(N_F1)
         + '<div class="dual"><div>' + plate('F2-results-mobile', 'phone') + '</div><div><h3>The five funds</h3><div class="tablewrap"><table class="inv small"><thead><tr><th>Index</th><th>Fond</th><th>Typ</th><th>Poplatek</th></tr></thead><tbody>'
         + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td><code>{d}</code> {"" if e else "<span class=\'pl v\'>[ověřit]</span>"}</td></tr>' for a, b, c, d, e in FUNDS)
         + '</tbody></table></div><p class="fine">The phone page stacks the same content: five fund cards, the fund picker, one card per broker, the summary lines.</p></div></div></section>')

p.append('<section id="po" class="sec">' + section_head('07', 'After submit and e-mail', 'What happens after the visitor gives an e-mail, and the pages the e-mails link to.')
         + plate('E1-success-desktop', 'wide') + notes(N_AFTER)
         + '<div class="adrow">' + plate('E2-success-mobile', 'ad') + plate('OI2', 'ad') + plate('OI3', 'ad') + plate('X2-unsub', 'ad') + '</div>' + plate('OI1', 'wide') + '</section>')

p.append('<section id="web" class="sec">' + section_head('08', 'Menu, cookies, legal, errors', 'What a real site needs around the pages: navigation on the phone, consent, the privacy policy, and what happens when something goes wrong.')
         + notes(N_NAV) + '<h3>Menu and cookies · phone</h3><div class="adrow">' + plate('M1-menu', 'ad') + plate('C1-bar-m', 'ad') + plate('C3-set-m', 'ad') + '</div>'
         + '<h3>Cookies · desktop</h3>' + plate('C2-bar-d', 'wide') + plate('C4-set-d', 'wide')
         + '<h3>Privacy policy</h3><div class="dual"><div>' + plate('P2-priv-m', 'phone') + '</div><div>' + plate('P1-priv-d', 'wide') + '</div></div>'
         + '<h3>Form errors and 404</h3><div class="adrow">' + plate('FE1', 'ad') + plate('X1-404', 'ad') + '</div>' + plate('FE2', 'wide') + '</section>')

p.append('<section id="vystupy" class="sec">' + section_head('09', 'PDF, favicon, sharing', 'The things that leave the site: the PDF on paper, the browser icon and the link preview.')
         + notes(N_OUT) + '<h3>PDF on A4</h3><div class="adrow">' + plate('PD1', 'ad') + plate('PD2', 'ad') + '</div>'
         + '<h3>Favicon and share image</h3>' + plate('FV1', 'wide') + plate('SH1', 'wide') + '</section>')

N_MOTION = [
    ('Principle', 'Motion explains a change; it never decorates. Only the hero entrance runs longer than 300 ms, and it plays once.'),
    ('Timing', '100 ms press feedback · 150 ms small state (chip, switch, border) · 250 ms panels, boxes, number swap · 500 ms scroll reveal · 700 ms hero entrance.'),
    ('Easing', '<code>cubic-bezier(.2,.8,.2,1)</code> for things that appear or move, <code>ease</code> for colour changes. Only opacity and transform are animated, plus panel height.'),
    ('Numbers', 'The calculator number swaps (old rises out, new rises in, 250 ms). It is never counted up, and digits are tabular so the width does not jump.'),
    ('Hide rule and motion', 'The green saving box grows in under the result only when the hide rule allows it, and leaves the same way. Loading uses a grey shimmer; a failure has no animation, only the message.'),
    ('Reduced motion', 'With the system setting „reduce motion“ every animation stops and each screen shows its final state. Meaning never depends on motion: errors are also text, the menu state is also announced.'),
    ('Not allowed', 'Hover movement, looping decoration, parallax, auto-playing carousels, counting numbers.'),
]
p.append('<section id="motion" class="sec">' + section_head('10', 'Motion', 'Where the page moves, how long it takes and why. The artboard below is live: every demo loops on its own, and the button turns motion off to show the reduced-motion result.')
         + plate('MO1', 'wide') + '<h3>Rules</h3>' + notes(N_MOTION) + '</section>')

p.append('<section id="reklamy" class="sec">' + section_head('11', 'Ads', 'Two concepts, both ending on the landing page. Launch waits for verified data; the message does not.')
         + '<h3>Ad A</h3><div class="adrow">' + plate('G1-adA-4x5', 'ad') + plate('G2-adA-9x16', 'ad') + '</div>'
         + '<h3>Ad B</h3><div class="adrow">' + plate('G3-adB-4x5', 'ad') + plate('G4-adB-9x16', 'ad') + '</div>'
         + '<h3>Copy and rules</h3>' + notes(N_ADS, 1) + '</section>')

p.append('<section id="otevrene" class="sec">' + section_head('12', 'Open data and build', 'Every amber <code>[ověřit]</code> on the screens is a data task. Launch waits for these; the design does not.')
         + table(['What', 'For', 'How to close it'], [(f'<b>{a}</b>', b, c) for a, b, c in VERIFY])
         + '<h3>For the build</h3>' + notes(BUILD)
         + '<p class="fine">Have the final copy, the consent flow and the legal pages reviewed by someone qualified before launch.</p></section>')

p.append('<section id="historie" class="sec">' + section_head('13', 'History', 'How the design got here. Only for context; the sections above are the current state.')
         + '<div class="hist">' + ''.join(f'<div><b>{a}</b><p>{b}</p></div>' for a, b in HISTORY) + '</div></section>')

p.append(f'<footer class="docfoot">{logo(110, 28, True)}<span>ETF Kompas · Design study · rev. 6 · 13. 10. 2026 · David Krapka</span></footer></main><script>{JS}</script></body></html>')
open(OUT, 'w').write(''.join(p))
print('wrote', OUT, os.path.getsize(OUT))
