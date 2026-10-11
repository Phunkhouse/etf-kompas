#!/usr/bin/env python3
"""Builds etf-kompas-wireframes.html from the unpacked artboards, the handoff and the logo files.
usage: build.py <artboard-dir> <logo-dir> <out.html>   e.g. python3 build.py artboards logo etf-kompas-wireframes.html"""
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
    ('T1-radky', '174eb66f', 'Animace hero tabulky', 1280, 700),
    ('E1-success-desktop', '642661e9', 'Po odeslání · desktop', 1280, 640),
    ('E2-success-mobile', '4555091e', 'Po odeslání · mobil', 390, 1300),
    ('F1-results-desktop', '92ef8ee0', 'Srovnání · desktop', 1280, 2300),
    ('F2-results-mobile', '24e61a2e', 'Srovnání · mobil', 390, 2800),
    ('G1-adA-4x5', '8e84da19', 'Reklama A · 4:5', 540, 675),
    ('G2-adA-9x16', '6bf92b0b', 'Reklama A · 9:16', 405, 720),
    ('G3-adB-4x5', 'c2093dbc', 'Reklama B · 4:5', 540, 675),
    ('G4-adB-9x16', '4b5adee3', 'Reklama B · 9:16', 405, 720),
    ('G5-hero-A-mobile', '734d3e9c', 'První obrazovka po reklamě A', 375, 667),
]
BD = {b[0]: b for b in BOARDS}
# rendered height = measured content height (declared canvas heights leave empty space below the footer)
RH = {'Main': 2642, 'B-mobile': 3216, 'E1-success-desktop': 777, 'E2-success-mobile': 1014,
      'F1-results-desktop': 1681, 'F2-results-mobile': 2563}


def board_doc(fid):
    s = open(f'{ART}/{fid}.html').read()
    s = re.sub(r'@font-face\s*\{[^}]*\}', '', s)
    s = re.sub(r'/\* [a-z0-9-]+ \*/\s*', '', s)
    s = re.sub(r'<script[^>]*>.*?</script>', '', s, flags=re.S)
    s = s.replace('<x-dc>', '').replace('</x-dc>', '').replace('<helmet>', '').replace('</helmet>', '')
    s = s.replace('<style></style>', '')
    s = s.replace('sc-camel-view-box=', 'viewBox=')
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

# ───────────────────────── annotations (from handoff, copy kept verbatim) ─────────────────────────
N_MAIN = [
    ('Disclosure bar', 'Left: „Čísla z oficiálních stránek fondů a Finanční správy · aktualizováno 10. 2026“. Right: „Investování nese riziko ztráty.“ Ink band, 13px, padding 10px 56px.'),
    ('Header', 'Logo 126×32, links „Jak počítáme“, „Odkud máme čísla“, „Časté dotazy“ and a small button „Poslat mi srovnání“ that jumps to the gate.'),
    ('Hero', 'Grid 0.85fr / 1.15fr, gap 64, padding 64px 56px. Left: H1 58/1.04, lead 20px, definition callout, button „Spočítat, kolik ušetřím“ plus link „nebo rovnou srovnání všech 8“.'),
    ('Hero comparison card', 'Tag „Cena a dostupnost“, source line „zdroj: oficiální stránky fondů · 10. 2026“, three rows. Row 3 (European version) is the winner, highlighted <code>--win</code>. Animates once on load.'),
    ('Calculator and gate', 'Ink band, anchor <code>#calc</code>, columns 1fr / 1fr / 1.1fr. Slider 500–20 000 Kč, chips 5 / 10 / 20 let, result 80px in <code>--result</code> with a three-line breakdown, then the e-mail gate (<code>#gate</code>).'),
    ('Cost cards', '„Za co platíte, aniž to vidíte“: three numbered cards, gap 24 — Roční poplatek fondu, Převod korun, Daň ze zisků.'),
    ('E-mail preview', '„Co dostanete e-mailem“: two columns, gap 56. Right side holds two 300px placeholders „strana 1 – srovnání“ and „strana 4 – daně“.'),
    ('Trust items', '„Proč nám věřit“: Odkud máme čísla (<code>#z</code>), Jak počítáme (<code>#m</code>), Nic neprodáváme. 1.5px ink top rule.'),
    ('FAQ and footer', 'Four collapsed rows (<code>#f</code>); ink footer with cream logo 110×28, legal text capped at 44em and links „Zásady zpracování“, „Cookies“.'),
]
N_B = [
    ('Short disclosure bar', '11px: „Čísla z oficiálních stránek fondů · aktualizováno 10. 2026“.'),
    ('Header', 'Logo 102×26 and a „Menu“ chip. The menu panel is not designed.'),
    ('Hero stack', 'H1 32px, lead, comparison card with shorter heads („Poplatek“, „Z ČR?“), full-width button, note „Jen cena a dostupnost, žádné výnosy.“ The winner row bleeds 8px past the text edge.'),
    ('Calculator band', 'Ink band, padding 28px 16px: H2, slider, chips, 1px divider, result at 60px with a 13px breakdown.'),
    ('E-mail gate', 'Its own light band after the calculator, <code>--card</code> panel with 1.5px ink border, padding 20, 22px checkbox.'),
    ('Numbered cards', 'Stacked, index to the left of the text, with the shorter phone copy.'),
    ('Sticky CTA bar', 'Paper background, 1.5px ink top border, 48px button „Poslat mi srovnání“. Footer gets 96px bottom padding.'),
]
N_T1 = [
    ('Loop', '12s, review only. Card in 0–6 %, row 1 at 8–16 % (≈1 s), row 2 at 16–24 % (≈1.9 s), row 3 at 24–32 % (≈2.9 s).'),
    ('Winner highlight', 'Fades to <code>--win</code> at 38–48 %, held until 88 %, everything fades out 92–100 %.'),
    ('Replay', 'Outline button „Přehrát znovu“, 44px, 14px label. The only scripted behaviour in the whole canvas.'),
    ('Conflict with Main', 'Timings differ from the production animation in <code>Main</code> (0.4 / 0.9 / 1.4 s, highlight at 2.2 s). Choose one set; in production play once.'),
]
N_E1 = [
    ('Result kept', 'Calculator controls and the result stay on screen (80px), without the breakdown, so the visitor can keep playing.'),
    ('Success panel', 'Paper panel, radius 10, padding 28: check badge, „Hotovo. Srovnání je připravené.“, primary „Otevřít srovnání“, outline „Stáhnout PDF · 6 stran“, address confirmation and „Zkopírovat odkaz“.'),
    ('Co dál', 'Three items with a 1.5px ink top rule: 8 fondů vedle sebe, stránka o daních, kde fond koupit.'),
    ('Consent note', '13px, max 60em. Double opt-in for tips is confirmed with a second click in an e-mail; the comparison arrives without it. The artboard is cropped: no header and no footer.'),
]
N_E2 = [
    ('Result strip', 'Ink, padding 20px 16px. Number 52px, „3 000 Kč měsíčně · 10 let · příklad, ne slib“.'),
    ('Success block', 'Badge beside an H1 26px, two full-width 56px buttons, address line and copy-link line.'),
    ('Co dál', 'Three numbered cards (index 28px, title 16px, text 14px).'),
    ('Consent and footer', 'Phone wording of the consent note; footer with legal text and links.'),
]
N_F1 = [
    ('Disclosure bar', 'Left: „Stav 10. 2026 · u každého čísla je zdroj“. Right: „Investování nese riziko ztráty. Obecná informace, ne poradenství.“'),
    ('Header', 'Logo and the outline button „Stáhnout PDF · 6 stran“.'),
    ('Table of contents', 'Sticky at top 24px in a 220px column. Active item: 1.5px ink rule, weight 600. Anchors <code>#t1</code>–<code>#t4</code>.'),
    ('Result banner', 'Ink, radius 10, padding 20px 24px: „Váš výsledek · 3 000 Kč měsíčně · 10 let“ and <code>X XXX Kč</code> at 48px.'),
    ('1 · Fondy vedle sebe', 'Eight funds, tag „řazeno od nejlevnějšího“. Columns: Co koupíte, Roční poplatek, Fond sídlí, Koupíte z ČR?, Zdroj („stránka fondu ↗“).'),
    ('2 · Daně v Česku', 'Three placeholder cards (Prodej po letech, Dividendy ze zahraničí, Přiznání), each with a source line. Under them: „Obecná informace, ne daňové poradenství.“'),
    ('3 · Kde fond koupit', 'Five rows <code>[Firma A]</code>–<code>[Firma E]</code>, tag „abecedně · bez provizí · stav 10. 2026“.'),
    ('4 · Jak počítáme', 'Method summary with link „Otevřít postup“ and a resend card: „Odkaz platí 30 dní. Zapomněli jste ho?“'),
]
N_F2 = [
    ('Header', 'Logo and a text link „PDF“.'),
    ('Intro', 'H1 36px, lead 16px, result banner (number 44px), horizontally scrolling 44px outline chips: Fondy, Daně, Kde koupit, Jak počítáme.'),
    ('Fund cards', 'Three shown (European 500, VOO, QQQ), button „Zobrazit dalších 5 fondů“. Key-value rows 14px, 12px source link.'),
    ('Taxes and brokers', 'Tax cards with the shorter placeholder „[Text se doplní z ověřeného zdroje.]“; two firm cards and „Zobrazit dalších 3 firmy“.'),
    ('Method and resend', 'Short method text, link „Otevřít postup“, resend card („Odkaz platí 30 dní.“).'),
]
N_ADA = [
    ('Idea', '„The unknown number“. Paper background, three groups spread top to bottom: logo, headline + number, call to action + legal line.'),
    ('Type', 'Headline 44px (9:16: 36px), „? Kč“ 150px / 700 / −0.04em in <code>--alert</code> (9:16: 120px), caption in Plex Mono 12px, CTA 22px / 600.'),
    ('Spacing', 'Padding 44px in 4:5; <code>110px 32px 150px</code> in 9:16 — 110px at the top and 150px at the bottom are left free for platform UI.'),
    ('Legal line', '„Investování nese riziko ztráty. Příklad výpočtu, ne slib výnosu.“ 11px (9:16: 10px).'),
]
N_ADB = [
    ('Idea', '„US versus Europe“. Two panels: ink „Americký fond“ and <code>--win</code> „Evropský fond“, a 64px „vs“ circle on the seam (9:16: 44px).'),
    ('4:5 layout', 'Top: two equal panels, padding 44px 28px. Below: H1 „Co vás stojí víc?“ 40px, line 19px / 500, legal line max 230px, logo 94×24 at the right.'),
    ('9:16 layout', 'Three stacked bands: ink (padding 110px 32px 32px), paper band with 2px ink top and bottom borders, <code>--win</code> band (bottom padding 150px). Logo 86×22.'),
    ('Call to action', 'Ad B has none of its own; the ad platform\'s button has to carry it.'),
]
N_G5 = [
    ('Matches the ad', 'H1 „Kolik z vašich peněz sní poplatky fondu?“ 34/1.04 repeats the ad headline, followed by „Spočítejte to za 20 sekund. Zdarma, bez registrace.“'),
    ('Calculator above the fold', 'Ink band fills the rest: slider, chips, inverted full-width button „Spočítat moje poplatky“ (<code>#result</code>) and note „Příklad výpočtu. Investování nese riziko ztráty.“'),
    ('Not designed', 'The state after pressing „Spočítat moje poplatky“.'),
]

SWATCHES = [
    ('--paper', '#F6F3EC', 'Page background; text on ink'),
    ('--ink', '#16150F', 'Body text, primary buttons, dark sections, strong rules'),
    ('--card', '#FFFDF8', 'Cards; e-mail form panel on phones'),
    ('--line', '#D4CEBE', 'Hairlines, card borders, row dividers'),
    ('--ink-2', '#3A372E', 'Secondary body text'),
    ('--muted', '#6B665A', 'Tags, captions, footnotes, source links'),
    ('--on-dark-muted', '#B9B3A2', 'Tags and footnotes on ink'),
    ('--on-dark-soft', '#D9D4C5', 'Secondary and footer text on ink'),
    ('--on-dark-line', '#4A473D', 'Dividers on ink'),
    ('--result', '#F2A18C', 'The big „you pay more“ number on ink'),
    ('--alert', '#C23A1B', 'The „? Kč“ number in ad A'),
    ('--pill-no-bg', '#F4D9D1', 'Pill: cannot buy from CZ'),
    ('--pill-no-ink', '#7A2410', 'Pill text: cannot buy'),
    ('--pill-yes-bg', '#D6E8DE', 'Pill: can buy; success badge'),
    ('--pill-yes-ink', '#154A33', 'Pill text: can buy'),
    ('--win', '#DCEEE3', 'Winner row; Europe panel in ad B'),
    ('--kv-line', '#E6E1D4', 'Key-value dividers in phone cards'),
    ('--row-hover', '#F3EEDF', 'Row hover (only in T1-radky)'),
    ('--ph-a', '#E6E1D4', 'Placeholder stripe A'),
    ('--ph-b', '#ECE8DC', 'Placeholder stripe B'),
    ('--ph-border', '#B5AE9C', 'Placeholder dashed border'),
    ('Logo · light', '#17140F', 'Wordmark ink; needle accent #D9480F'),
    ('Logo · dark', '#F6F1E7', 'Wordmark on dark; needle accent #F06A2E'),
]

TYPE = [
    ('Landing H1', '58px / 1.04 · 700', '32px / 1.06 · 700', 'Americký, nebo evropský fond?'),
    ('Results H1', '52px / 1.04 · 700', '36px / 1.04 · 700', 'Srovnání 8 fondů'),
    ('Calculator H2', '28px / 1.1', '24px / 1.1', 'Kolik to u vás dělá?'),
    ('Results section H2', '30px', '24px', '1 · Fondy vedle sebe'),
    ('E-mail preview H2', '32px / 1.15', '22px / 1.15', '8 fondů vedle sebe, daně v Česku a kde je koupit'),
    ('E-mail form title', '24px / 1.15', '24px / 1.12', 'Chcete porovnat všech 8 fondů?'),
    ('Success title', '26px / 1.12', '26px / 1.1', 'Hotovo. Srovnání je připravené.'),
    ('Hero lead', '20px', '16px', 'Oba sledují stejné velké firmy.'),
    ('Body and table text', '15–17px', '14–16px', 'Fond si každý rok vezme malé procento.'),
    ('Big result number', '80px / 1 · 700 · −0.03em', '60 / 52 / 44px', 'X XXX Kč'),
    ('Results banner number', '48px', '44px', 'X XXX Kč'),
    ('Numbered card index', '40px · 700', '32px · 700', '1'),
    ('Tag · Plex Mono 500', '11px · uppercase · .06em', '10px', 'Cena a dostupnost'),
    ('Footnotes', '12–13px', '12–13px', 'Příklad, ne slib.'),
]

INVENTORY = [
    ('Main', 'Landing page · desktop', '1280 × 2900, fluid', 'Hero, calculator, e-mail gate, explainers, FAQ, footer', 'interactive'),
    ('B-mobile', 'Landing page · mobil', '390 × 3500, fluid', 'Same page on a phone with a sticky bottom CTA', 'interactive'),
    ('T1-radky', 'Animace hero tabulky', '1280 × 700', 'Hero table rows appearing one by one, with a replay button', 'interactive'),
    ('E1-success-desktop', 'Po odeslání · desktop', '1280 × 640, fluid', 'Success screen after the e-mail is sent', ''),
    ('E2-success-mobile', 'Po odeslání · mobil', '390 × 1300, fluid', 'Same on a phone', ''),
    ('F1-results-desktop', 'Srovnání · desktop', '1280 × 2300, fluid', 'Funds, taxes, where to buy, method', ''),
    ('F2-results-mobile', 'Srovnání · mobil', '390 × 2800, fluid', 'Same on a phone, tables turned into cards', ''),
    ('G1-adA-4x5', 'Reklama A · 4:5', '540 × 675', 'Feed ad A: „? Kč“ headline number', ''),
    ('G2-adA-9x16', 'Reklama A · 9:16', '405 × 720', 'Stories ad A', ''),
    ('G3-adB-4x5', 'Reklama B · 4:5', '540 × 675', 'Feed ad B: US fund versus European fund split', ''),
    ('G4-adB-9x16', 'Reklama B · 9:16', '405 × 720', 'Stories ad B', ''),
    ('G5-hero-A-mobile', 'První obrazovka po reklamě A', '375 × 667', 'First phone screen after ad A, calculator above the fold', 'interactive'),
]

NOT_DESIGNED = [
    'Methodology page („Otevřít postup“, nav item „Jak počítáme“).',
    'Privacy policy, cookies page and a cookie consent banner.',
    'Unsubscribe page („Odhlásit odběr“).',
    'The 6-page PDF itself — pages 1 („srovnání“) and 4 („daně“) appear only as striped placeholders.',
    'E-mails: the comparison link, the double opt-in confirmation and „send link again“.',
    'The mobile menu behind the „Menu“ chip.',
    'A tax page and a where-to-buy page — the success screen links to them while the results page already holds both as sections 2 and 3.',
    'FAQ answers — all four questions are shown collapsed.',
    'Error, loading and empty states for the form and the calculator.',
    'Hover and focus states — only T1-radky defines a row hover (#F3EEDF).',
]

ISSUES = [
    ('1', 'The id <code>m</code> is used twice: on the slider and on the „Jak počítáme“ block. Header link <code>#m</code> would jump to the slider.', 'Main', 'Rename the slider id (e.g. <code>monthly</code>)'),
    ('2', 'FAQ rows are plain divs with a „+“. Keyboard users cannot open them.', 'Main, B-mobile', '<code>&lt;details&gt;</code> / <code>&lt;summary&gt;</code>, or button with <code>aria-expanded</code>'),
    ('3', 'The 5 / 10 / 20 chips expose no selected state.', 'Calculator, G5', 'Radio group in a fieldset, legend „Na jak dlouho“'),
    ('4', 'A changed result is not announced.', 'Calculator', '<code>aria-live="polite"</code> on the result'),
    ('5', 'Pills carry meaning by colour plus a placeholder word.', 'Hero, results tables', 'Real text „Ano“ and „Ne“'),
    ('6', '„řazeno od nejlevnějšího“ cannot hold with placeholder fees (a 0,XX % row above 0,0X % rows).', 'F1', 'Sort by the real fee in code'),
    ('7', 'Success screen links to a tax page and a where-to-buy page; results page holds both as sections.', 'E1, E2, F1', 'Decide: anchors on one page, or two pages'),
    ('8', 'Disclosure bar differs between desktop and phone („a Finanční správy“).', 'Main, B-mobile', 'Use one wording'),
    ('9', 'No error, loading, empty, hover or focus states.', 'All', 'Design invalid e-mail, send failure, expired link, visible focus ring on paper and ink'),
    ('10', 'Tags are 10px on phone pages, footnotes 12px.', 'Phones', 'Raise tags to 11–12px; test on a real phone'),
    ('11', 'Defined but never used: <code>pIn</code> keyframe, <code>b1</code>–<code>b3</code> pill classes, <code>.tag.g</code>.', 'Main, B-mobile', 'Delete, or finish the winner-pill pop-in'),
    ('12', 'The „Menu“ chip opens nothing.', 'B-mobile', 'Design the menu panel'),
]

PLACEHOLDERS = [
    ('0,0X %, 0,XX %', 'Hero table, results table', 'Annual fee per fund, from the fund\'s own page, with the month it was read'),
    ('[ověřit] in „Koupíte z ČR?“ pills', 'Hero table, results table', 'Whether a Czech retail investor can buy the fund; show as text („Ano“ / „Ne“), not only colour'),
    ('X XXX Kč', 'Calculator result, success and results banners', 'Output of the calculator function'),
    ('„10. 2026“', 'Disclosure bars, table captions', 'Generate from the data\'s own as-of date'),
    ('VOO, QQQ, VTI, SCHD', 'Fund sub-lines', 'Confirm each ticker; European funds have no names or ISINs yet'),
    ('[SPRÁVCE], [SPRÁVCE – IČO, adresa]', 'Form note, consent note, footer', 'Legal name, company ID and address of the data controller'),
    ('Tax card texts, [paragraf zákona], [Finanční správa]', 'Results section 2', 'Text and links taken from the law and the tax authority'),
    ('[Firma A] … [Firma E], [ano/ne]', 'Results section 3', 'Five brokers or apps, alphabetical, with fees, Czech interface and price-list link'),
    ('„stránka fondu ↗“, „ceník ↗“', 'Results tables', 'Real source URLs'),
    ('jmeno@domena.cz', 'Success screens', 'The address the visitor typed'),
    ('„strana 1 – srovnání“, „strana 4 – daně“', 'E-mail preview', 'Real page images of the PDF'),
    ('FAQ answers', 'Landing page', 'Four answers; none are written'),
    ('„6 stran“', 'PDF buttons', 'Keep in step with the real PDF'),
]

CONTRAST = [
    ('--ink on --paper', '16.5'), ('--ink-2 on --paper', '10.7'), ('--muted on --paper', '5.2'),
    ('--muted on --card', '5.6'), ('--on-dark-muted on --ink', '8.7'), ('--result on --ink', '8.9'),
    ('--alert on --paper (150px number)', '4.8'), ('--pill-no-ink on --pill-no-bg', '7.5'),
    ('--pill-yes-ink on --pill-yes-bg', '8.0'), ('--muted on striped placeholder', '4.4'),
]

SETTLE = [
    'The calculator formula and the fund pair behind it.',
    'The real European funds (names, ISINs) and the five brokers or apps.',
    'One set of animation timings (Main or T1-radky).',
    'Whether tax and where-to-buy are separate pages or sections of the results page.',
    'Ad export sizes, and the call to action for ad B.',
    'The breakpoint value and the design of the phone menu.',
    'Data controller details and the e-mail provider.',
]

# ───────────────────────── page ─────────────────────────
NAV = [
    ('cover', '00', 'Cover'), ('obsah', '01', 'Contents'), ('prehled', '02', 'Overview'),
    ('landing', '03', 'Landing page'), ('animace', '04', 'Hero animation'), ('success', '05', 'After submit'),
    ('srovnani', '06', 'Comparison page'), ('reklamy', '07', 'Ads'), ('g5', '08', 'After ad A'),
    ('tokeny', '09', 'Design tokens'), ('komponenty', '10', 'Components'), ('chovani', '11', 'Behaviour'),
    ('otevrene', '12', 'Open items'),
]

CSS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'doc.css')).read()
JS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'doc.js')).read()


def section_head(num, title, lead=''):
    return (f'<header class="sh"><span class="num-big">{num}</span><div><h2>{title}</h2>'
            + (f'<p class="lead">{lead}</p>' if lead else '') + '</div></header>')


p = []
p.append(f'''<!doctype html><html lang="cs"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ETF Kompas Wireframes</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="{FONTS}">
<style>{CSS}</style></head><body>
<aside class="side" id="side"><a class="side-logo" href="#cover" aria-label="ETF Kompas">{logo(126, 32)}</a>
<nav aria-label="Obsah">{''.join(f'<a href="#{i}" data-s="{i}"><i>{n}</i>{t}</a>' for i, n, t in NAV)}</nav>
<p class="side-foot">Wireframes · design handoff<br>11. 10. 2026</p></aside>
<main>''')

# cover
p.append(f'''<section class="cover" id="cover"><div class="cover-top">{logo(188, 48, True)}<span class="tag on-dark">Design handoff · v1</span></div>
<div class="cover-mid"><span class="tag on-dark">Wireframes · 12 artboards</span><h1>ETF Kompas<br>Wireframes</h1>
<p>Česká landing page, která vymění e-mail za srovnání 8 ETF. Celá cesta od reklamy po stránku se srovnáním: obrazovky na desktopu a telefonu, reklamy, design tokeny a komponenty.</p></div>
<dl class="cover-meta"><div><dt>Datum</dt><dd>11. 10. 2026</dd></div><div><dt>Autor</dt><dd>David Krapka</dd></div><div><dt>Podklad</dt><dd>Canvas „ETF Kompas – wireframes“, 10. 10. 2026</dd></div><div><dt>Úroveň</dt><dd>Wireframe · všechna čísla jsou zástupná</dd></div></dl>
<div class="cover-compass" aria-hidden="true">{favicon(520)}</div></section>''')

# contents
toc = [('prehled', '02', 'Overview', 'User flow and artboard inventory'),
       ('landing', '03', 'Landing page', 'Desktop and phone, 9 + 7 annotated parts'),
       ('animace', '04', 'Hero animation', 'T1 · row-by-row table study'),
       ('success', '05', 'After submit', 'Success screen, desktop and phone'),
       ('srovnani', '06', 'Comparison page', 'Funds, taxes, where to buy, method'),
       ('reklamy', '07', 'Ads', 'Concepts A and B, feed and stories'),
       ('g5', '08', 'First screen after ad A', 'Calculator above the fold'),
       ('tokeny', '09', 'Design tokens', 'Colour, type, layout, motion'),
       ('komponenty', '10', 'Components', 'Shared building blocks'),
       ('chovani', '11', 'Behaviour', 'Calculator, e-mail flow, responsive'),
       ('otevrene', '12', 'Open items', 'Placeholders, claims, issues, decisions')]
p.append('<section id="obsah" class="sec">' + section_head('01', 'Contents') + '<ol class="toc">'
         + ''.join(f'<li><a href="#{a}"><i>{n}</i><b>{t}</b><span>{d}</span></a></li>' for a, n, t, d in toc) + '</ol></section>')

# overview
flow = ['Ad A / Ad B', 'Landing page', 'Calculator → e-mail gate', 'Success screen', 'Comparison page']
flow_sub = ['feed 4:5 · stories 9:16', 'desktop or mobile; ad A has its own first screen', 'one field, optional tips checkbox', 'keeps the result; opens comparison or 6-page PDF', '8 funds, Czech taxes, where to buy, method']
p.append('<section id="prehled" class="sec">' + section_head('02', 'Overview', 'ETF Kompas trades an e-mail address for an 8-fund ETF comparison. The wireframes cover the whole path from ad to results page.')
         + '<div class="claims"><div><span class="tag">Core claim</span><p>US-domiciled and European-domiciled funds that follow the same big companies differ in cost and in where a Czech investor can buy them. The page shows that difference in crowns for the visitor\'s own monthly amount.</p></div>'
         + '<div><span class="tag">Conversion goal</span><p>E-mail capture on the landing page, plus an optional checkbox for investing tips confirmed with a second click in an e-mail.</p></div>'
         + '<div><span class="tag">Tone</span><p>Plain Czech, no advice, no commissions, and every number carries a source and a month („10. 2026“).</p></div>'
         + '<div><span class="tag">Fidelity</span><p>Wireframes. Every figure is a placeholder (<code>0,0X %</code>, <code>X XXX Kč</code>, <code>[ověřit]</code>) and must be replaced with a verified, dated value before anything ships.</p></div></div>'
         + '<h3>User flow</h3><ol class="flow">' + ''.join(f'<li><b>{a}</b><span>{b}</span></li>' for a, b in zip(flow, flow_sub)) + '</ol>'
         + '<h3>Artboard inventory</h3><div class="tablewrap"><table class="inv"><thead><tr><th>Artboard</th><th>Title in the canvas</th><th>Size (px)</th><th>What it shows</th></tr></thead><tbody>'
         + ''.join(f'<tr><td><a href="#{a}"><code>{a}</code></a></td><td>{E(b)}</td><td>{c}</td><td>{d}{" <span class=\'badge\'>interactive</span>" if e else ""}</td></tr>' for a, b, c, d, e in INVENTORY)
         + '</tbody></table></div>'
         + '<p class="fine">Interactive in the canvas: Main, B-mobile, T1-radky and G5-hero-A-mobile. The sources contain only native controls (slider, buttons, checkbox) and CSS animation; the only script is the replay button in T1-radky. The artboards below are the original markup, embedded at native size and scaled to fit.</p></section>')

# landing
p.append('<section id="landing" class="sec">' + section_head('03', 'Landing page', 'Desktop (1280) and phone (390). Hero with animated comparison table, calculator, e-mail gate, explainers, FAQ, footer.')
         + plate('Main', 'wide') + '<h3>Desktop · annotations</h3>' + notes(N_MAIN)
         + '<div class="dual"><div>' + plate('B-mobile', 'phone') + '</div><div><h3>Phone · annotations</h3>' + notes(N_B, 1)
         + '<h3>Shorter phone copy</h3><div class="tablewrap"><table class="inv small"><thead><tr><th>Where</th><th>Desktop</th><th>Phone</th></tr></thead><tbody>'
         + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>' for a, b, c in [
             ('Cost card 1', 'Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu.', 'Fond si každý rok vezme malé procento. Nepošle vám za to fakturu.'),
             ('Cost card 2', 'Americké fondy chtějí dolary. Za každý převod z korun se platí.', 'Americké fondy chtějí dolary. Převod stojí peníze.'),
             ('Cost card 3', 'Část vyplacených zisků si stáhne zahraničí dřív, než se k vám dostanou.', 'Část zisků si stáhne zahraničí dřív, než k vám dorazí.'),
             ('E-mail preview', 'Otevře se hned po odeslání, nemusíte nic stahovat. U každého čísla uvádíme odkud je a z jakého měsíce.', 'Otevře se hned po odeslání. U každého čísla je zdroj a měsíc.'),
             ('Trust 1', 'Z oficiálních stránek fondů a zákona o daních. U všeho je datum.', 'Z oficiálních stránek fondů a zákona. U všeho je datum.'),
             ('Trust 2', 'Postup je na jedné stránce. Můžete si ho přepočítat.', 'Postup je na jedné stránce.'),
             ('Trust 3', 'Nedostáváme provize. Nejde o investiční poradenství.', 'Žádné provize. Nejde o poradenství.'),
             ('Calculator footnote', 'Počítáme s výnosem 6 % ročně u obou fondů. Je to příklad, ne slib.', 'Počítáme s výnosem 6 % ročně. Je to příklad, ne slib.'),
             ('Table footnote', 'Tabulka ukazuje jen cenu a dostupnost, ne výnosy. Minulé výnosy nezaručují budoucí.', 'Jen cena a dostupnost, žádné výnosy.')])
         + '</tbody></table></div></div></div></section>')

# animation
p.append('<section id="animace" class="sec">' + section_head('04', 'Hero animation', 'Only the hero table animates. Reduced motion switches every animation off. T1 is a slower study of the same idea — press the replay button.')
         + plate('T1-radky', 'wide') + notes(N_T1)
         + '<h3>Production timings (Main, B-mobile)</h3><pre class="code">@keyframes cIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}\n@keyframes rIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}\n@keyframes wIn{from{background:transparent}to{background:#DCEEE3}}\n.hc{animation:cIn .7s cubic-bezier(.2,.8,.2,1) both}\n.a1{animation:rIn .7s cubic-bezier(.2,.8,.2,1) .4s both}\n.a2{animation:rIn .7s cubic-bezier(.2,.8,.2,1) .9s both}\n.a3{animation:rIn .7s cubic-bezier(.2,.8,.2,1) 1.4s both,wIn .8s ease-in-out 2.2s both}\n@media (prefers-reduced-motion:reduce){.hc,.a1,.a2,.a3{animation:none}}</pre></section>')

# success
p.append('<section id="success" class="sec">' + section_head('05', 'After submit', 'The success screen keeps the visitor\'s calculator result on screen and puts the next action first.')
         + plate('E1-success-desktop', 'wide') + '<h3>Desktop · annotations</h3>' + notes(N_E1)
         + '<div class="dual"><div>' + plate('E2-success-mobile', 'phone') + '</div><div><h3>Phone · annotations</h3>' + notes(N_E2, 1) + '</div></div></section>')

# results
p.append('<section id="srovnani" class="sec">' + section_head('06', 'Comparison page', '8 funds side by side, Czech taxes, where to buy and the calculation method. Tables turn into cards on phones.')
         + plate('F1-results-desktop', 'wide') + '<h3>Desktop · annotations</h3>' + notes(N_F1)
         + '<h3>The eight funds, in wireframe order</h3><div class="tablewrap"><table class="inv small"><thead><tr><th>#</th><th>Co koupíte</th><th>Poplatek</th><th>Fond sídlí</th><th>Koupíte z ČR?</th></tr></thead><tbody>'
         + ''.join(f'<tr><td>{n}</td><td>{a}</td><td><code>{b}</code></td><td>{c}</td><td><span class="pl {"y" if d=="g" else "n"}">[ověřit]</span></td></tr>' for n, a, b, c, d in [
             (1, 'Evropská verze: 500 největších amerických firem', '0,0X %', 'Evropa', 'g'),
             (2, 'Evropská verze: celý svět', '0,XX %', 'Evropa', 'g'),
             (3, 'Americký fond: 500 největších firem <em>(značka VOO)</em>', '0,0X %', 'USA', 'r'),
             (4, 'Americký fond: celý americký trh <em>(značka VTI)</em>', '0,0X %', 'USA', 'r'),
             (5, 'Americký fond: firmy s vysokými dividendami <em>(značka SCHD)</em>', '0,0X %', 'USA', 'r'),
             (6, 'Americký fond: 100 technologických firem <em>(značka QQQ)</em>', '0,XX %', 'USA', 'r'),
             (7, 'Evropská verze: 100 technologických firem', '0,XX %', 'Evropa', 'g'),
             (8, 'Evropská verze: 500 největších firem, druhý poskytovatel', '0,0X %', 'Evropa', 'g')])
         + '</tbody></table></div>'
         + '<div class="dual"><div>' + plate('F2-results-mobile', 'phone') + '</div><div><h3>Phone · annotations</h3>' + notes(N_F2, 1) + '</div></div></section>')

# ads
p.append('<section id="reklamy" class="sec">' + section_head('07', 'Ads', 'Two concepts, each in feed (4:5, 540×675) and stories (9:16, 405×720). The sizes match 1080×1350 and 1080×1920 at 2× and 2.67×; the wireframes do not state an export size, so confirm it.')
         + '<h3>Ad A · „the unknown number“</h3><div class="adrow">' + plate('G1-adA-4x5', 'ad') + plate('G2-adA-9x16', 'ad') + '</div>' + notes(N_ADA)
         + '<h3>Ad B · „US versus Europe“</h3><div class="adrow">' + plate('G3-adB-4x5', 'ad') + plate('G4-adB-9x16', 'ad') + '</div>' + notes(N_ADB) + '</section>')

# g5
p.append('<section id="g5" class="sec">' + section_head('08', 'First screen after ad A', 'A 375×667 viewport, overflow hidden, built so the calculator is visible without scrolling and the headline repeats the ad.')
         + '<div class="dual"><div>' + plate('G5-hero-A-mobile', 'phone') + '</div><div>' + notes(N_G5, 1) + '</div></div></section>')

# tokens
sw = ''.join(f'<div class="sw"><i style="background:{h}"></i><b>{n}</b><code>{h}</code><span>{u}</span></div>' for n, h, u in SWATCHES)
def spec_style(a, b):
    m = re.match(r'(\d+)', b)
    st = 'font-size:%dpx;' % (min(26, int(m.group(1))) if m else 16)
    if 'Tag' in a:
        st = 'font-family:var(--mono);text-transform:uppercase;letter-spacing:.06em;font-size:11px;'
    if any(k in a for k in ('H1', 'H2', 'number', 'title')):
        st += 'font-weight:700;'
    return st


tr = ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td class="spec" style="{spec_style(a, b)}">{d}</td></tr>' for a, b, c, d in TYPE)
p.append('<section id="tokeny" class="sec">' + section_head('09', 'Design tokens', 'The look is warm paper, near-black ink and one signal red, set in IBM Plex. Every value is read from the wireframe source; token names are suggestions because the wireframes use raw hex.')
         + '<h3>Colour</h3><div class="swatches">' + sw + '</div>'
         + '<h3>Contrast <span class="fine">(WCAG ratios from the token values)</span></h3><div class="contrast">' + ''.join(f'<div class="{"low" if float(v)<4.5 else ""}"><span>{k}</span><b>{v}</b></div>' for k, v in CONTRAST) + '</div><p class="fine">Every text pair passes 4.5:1 except the label on the striped placeholder, which only exists in the wireframes.</p>'
         + '<h3>Typography</h3><p>IBM Plex Sans 400, 500, 600, 700 and IBM Plex Mono 500, from Google Fonts. Body 16px / 1.45. All numbers use <code>font-variant-numeric: tabular-nums</code>. Headings use negative letter-spacing (−0.025em H1, −0.015 to −0.02em H2).</p>'
         + '<div class="tablewrap"><table class="inv type"><thead><tr><th>Role</th><th>Desktop</th><th>Phone</th><th>Specimen</th></tr></thead><tbody>' + tr + '</tbody></table></div>'
         + '<p class="fine">Ad type: headline 44 / 36px, number 150 / 120px, CTA 22 / 19px (A, 4:5 / 9:16). Ad B panel titles 44 / 48px.</p>'
         + '<h3>Layout, shape, targets</h3><div class="facts">'
         + '<div><b>Container</b><span>max-width 1280px, centred; padding 56px desktop, 16px phone</span></div>'
         + '<div><b>Section rhythm</b><span>64px desktop (calculator 56, footer 40); 24–28px phone</span></div>'
         + '<div><b>Grids</b><span>hero .85fr / 1.15fr gap 64 · calculator 1fr / 1fr / 1.1fr gap 48 · card trios 3 equal, gap 24 (tax 20) · e-mail preview 1fr / 1fr gap 56 · results 220px / 1fr gap 48</span></div>'
         + '<div><b>Radii</b><span>6px buttons and inputs · 10px cards and panels · 999px chips and pills · 4px placeholders</span></div>'
         + '<div><b>Borders</b><span>1px <code>--line</code> hairlines · 1.5px <code>--ink</code> strong rules, outline buttons, chips, table heads</span></div>'
         + '<div><b>Touch targets</b><span>primary button 56px (48–52 on results, 44 small) · chips 48px · inputs 56px · nav chips 44px</span></div></div>'
         + '<h3>CSS variables</h3><pre class="code">:root{\n  --paper:#F6F3EC; --ink:#16150F; --card:#FFFDF8; --line:#D4CEBE;\n  --ink-2:#3A372E; --muted:#6B665A;\n  --on-dark-muted:#B9B3A2; --on-dark-soft:#D9D4C5; --on-dark-line:#4A473D;\n  --result:#F2A18C; --alert:#C23A1B;\n  --pill-no-bg:#F4D9D1; --pill-no-ink:#7A2410;\n  --pill-yes-bg:#D6E8DE; --pill-yes-ink:#154A33;\n  --win:#DCEEE3; --kv-line:#E6E1D4; --row-hover:#F3EEDF;\n  --ph-a:#E6E1D4; --ph-b:#ECE8DC; --ph-border:#B5AE9C;\n  --font-sans:\'IBM Plex Sans\',system-ui,sans-serif;\n  --font-mono:\'IBM Plex Mono\',monospace;\n  --r-sm:6px; --r-md:10px; --r-pill:999px;\n}</pre></section>')

# components
SPEC = lambda inner: f'<div class="spec-box">{inner}</div>'
comp = []
comp.append(('Logo', 'Wordmark with a compass „o“. Outlined paths, no font needed. Light and dark file; favicon follows the browser colour scheme.',
             f'<div class="logos"><div class="lg light">{logo(188, 48)}<span>etf-kompas-logo.svg</span></div><div class="lg dark">{logo(188, 48, True)}<span>etf-kompas-logo-dark.svg</span></div><div class="lg light fav">{favicon(48)}<span>favicon.svg</span></div></div>'
             '<p class="fine">Sizes used: 126×32 desktop header · 110×28 footers · 102×26 phone header, ad A feed, G5 · 94×24 ad A stories, ad B feed · 86×22 ad B stories. Accessibility: <code>role="img"</code>, <code>aria-label="ETF Kompas"</code>, <code>&lt;title&gt;</code>.</p>'))
comp.append(('Disclosure bar', 'Ink band at the very top. Desktop 13px, padding 10px 56px: source and date left, risk warning right. Phones 11px, padding 8px 16px, source line only.',
             '<div class="disc"><span>Čísla z oficiálních stránek fondů a Finanční správy · aktualizováno 10. 2026</span><span>Investování nese riziko ztráty.</span></div>'))
comp.append(('Header', f'Padding 20px 56px, hairline underneath. Logo 126×32 (phone 102×26). Landing desktop: three 15px links, gap 32, small primary button. Phone: „Menu“ chip. Results: outline button.',
             f'<div class="hdr">{logo(126, 32)}<nav><a>Jak počítáme</a><a>Odkud máme čísla</a><a>Časté dotazy</a><span class="btn sm">Poslat mi srovnání</span></nav></div>'))
comp.append(('Button', 'Primary (ink), small (44px), outline, inverted on ink. Full width on phones.',
             '<div class="row-s"><span class="btn">Spočítat, kolik ušetřím</span><span class="btn sm">Poslat mi srovnání</span><span class="btn o">Stáhnout PDF · 6 stran</span><span class="btn inv">Spočítat moje poplatky</span></div>'))
comp.append(('Chip', 'The 5 / 10 / 20 year selector. Selected chip is filled; on ink surfaces the colours swap.',
             '<div class="row-s"><span class="chip">5</span><span class="chip on">10</span><span class="chip">20</span><span class="dk"><span class="chip">5</span><span class="chip on">10</span><span class="chip">20</span></span></div>'))
comp.append(('Pill', 'Green „yes“ or red „no“ availability marker. Left-aligned in its cell, never wraps. Should read „Ano“ / „Ne“, not only a colour.',
             '<div class="row-s"><span class="pill no">[ověřit]</span><span class="pill yes">[ověřit]</span></div>'))
comp.append(('Tag', 'Small uppercase Plex Mono label above sections and inside table heads. 11px (phone 10px).',
             '<div class="row-s"><span class="tag">Cena a dostupnost</span><span class="tag">řazeno od nejlevnějšího</span></div>'))
comp.append(('Card, definition callout, trust item', 'Card: <code>--card</code>, 1px <code>--line</code>, radius 10. Callout: 3px ink left border, 12px padding. Trust item: 1.5px ink top rule.',
             '<div class="trio"><div class="card pad"><b>Card</b><br>Fond si každý rok vezme malé procento.</div><div class="callout"><b>ETF</b> je fond, který jen kopíruje trh. Nemá drahé správce, a proto je levný.</div><div class="trust"><b>Nic neprodáváme</b><br>Nedostáváme provize. Nejde o investiční poradenství.</div></div>'))
comp.append(('Hero comparison table', 'A card with source line on top, a three-column grid and a footnote. Phones use 1.5fr / .7fr / .9fr, gap 8, 14px text.',
             '<div class="card hct"><div class="hct-top"><span class="tag">Cena a dostupnost</span><span class="fine">zdroj: oficiální stránky fondů · 10. 2026</span></div>'
             '<div class="tr th"><span class="tag">Co koupíte</span><span class="tag">Roční poplatek</span><span class="tag">Koupíte z ČR?</span></div>'
             '<div class="tr"><div><b>Americký fond na 500 největších firem</b><br><small>odborně S&amp;P 500, značka VOO</small></div><span>0,0X %</span><span class="pill no">[ověřit]</span></div>'
             '<div class="tr win"><div><b>Evropská verze prvního fondu</b><br><small>stejných 500 firem, fond sídlí v Evropě</small></div><span>0,0X %</span><span class="pill yes">[ověřit]</span></div></div>'))
comp.append(('Range slider, result block', 'Native range, 500 to 20 000 in steps of 500, default 3 000. Value in 22px bold tabular numerals. Result block: tag, number in <code>--result</code>, optional three-line breakdown, footnote.',
             '<div class="dkbox"><div class="sl"><span>Kolik měsíčně uložíte</span><b>3 000 Kč</b></div><div class="track"><i></i></div><div class="res"><span class="tag on-dark">Za 10 let u amerického fondu zaplatíte víc o</span><div class="big">X XXX Kč</div><div class="bd"><span>roční poplatek fondu</span><span>X XXX Kč</span></div><div class="bd"><span>převod korun na dolary</span><span>X XXX Kč</span></div><div class="bd"><span>daň, kterou stáhne USA</span><span>X XXX Kč</span></div></div></div>'))
comp.append(('E-mail gate', 'Title, one line of promise, label, e-mail input, primary button, privacy line, optional checkbox. Desktop: paper panel, ink-bordered input. Phones: <code>--card</code> panel with 1.5px ink border.',
             '<div class="gate"><h4>Chcete porovnat všech 8 fondů?</h4><p>Ceny, daně a kde je koupit. Na jedné stránce, česky.</p><label>Váš e-mail</label><div class="inp">jmeno@domena.cz</div><span class="btn">Poslat mi srovnání</span><small>Pošleme vám srovnání. Správce: [SPRÁVCE]. Zásady zpracování osobních údajů.</small><div class="cb"><i></i>Chci občas dostat tip k investování (nepovinné)</div></div>'))
comp.append(('Numbered card, FAQ row', 'Numbered card: index, 20px title, 15px text (phones: index left). FAQ row: title and „+“, hairline underneath, list starts with a 1.5px ink rule.',
             '<div class="duo"><div class="card numc"><span>1</span><div><b>Roční poplatek fondu</b><br>Fond si každý rok vezme malé procento z vašich peněz.</div></div><div class="faq"><div>Můžu si americký fond koupit z Česka?<b>+</b></div><div>Je to zdarma?<b>+</b></div></div></div>'))
comp.append(('Success badge, placeholder image', '44px circle in <code>--pill-yes-bg</code> with a 26px check, stroke 2.4. Placeholder: 135° stripes, dashed 1px border, radius 4.',
             '<div class="row-s"><span class="badge-ok"><svg viewBox="0 0 26 26" width="26" height="26"><path d="M5 13.5l5.5 5.5L21 7.5" fill="none" stroke="#154A33" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="ph" style="width:160px;height:90px">strana 1 – srovnání</span></div>'))
comp.append(('Sticky CTA bar · results ToC · fund card', 'Sticky CTA (phone landing only): paper, 1.5px ink top border, 48px button, footer gets 96px bottom padding. ToC: sticky top 24px in 220px column. Fund card (phone): padding 14px 16px, key-value rows with <code>--kv-line</code>.',
             '<div class="trio"><div class="sticky-cta"><span class="btn sm full">Poslat mi srovnání</span></div><div class="toc-s"><span class="tag">Na stránce</span><a class="on">1 · Fondy vedle sebe</a><a>2 · Daně v Česku</a><a>3 · Kde fond koupit</a><a>4 · Jak počítáme</a></div><div class="card fc"><div class="fc-h"><b>Americký fond: 500 největších firem <small>(VOO)</small></b><span class="pill no">[ověřit]</span></div><div class="kv"><span>Roční poplatek</span><span>0,0X %</span></div><div class="kv"><span>Fond sídlí</span><span>USA</span></div><small class="lnk">stránka fondu ↗</small></div></div>'))
comp.append(('Footer', 'Ink, text <code>--on-dark-soft</code>, 13px (phone 12px), cream logo 110×28, legal text capped at 44em, links on the right (phone: stacked).',
             f'<div class="ftr">{logo(110, 28, True)}<p>Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství. Správce: [SPRÁVCE – IČO, adresa].</p><span><u>Zásady zpracování</u> <u>Cookies</u></span></div>'))
ctext = ''.join(f'<article class="comp"><div class="comp-t"><h4>{t}</h4><p>{d}</p></div><div class="comp-s">{s}</div></article>' for t, d, s in comp)
p.append('<section id="komponenty" class="sec">' + section_head('10', 'Components', 'A small set of components covers every screen. Build these once, then compose the pages from them.') + ctext + '</section>')

# behaviour
p.append('<section id="chovani" class="sec">' + section_head('11', 'Behaviour', 'The wireframes fix the calculator\'s inputs, defaults and assumptions but not its formula. <b>Specified</b> means it is in the wireframes; <b>Recommended</b> is a suggestion.')
         + '<div class="cols3"><div class="col"><h3>Calculator · specified</h3><ul>'
         '<li>Monthly amount 500 to 20 000 Kč in steps of 500, default 3 000 Kč.</li><li>Period 5, 10 or 20 years, default 10.</li>'
         '<li>Output „Za {N} let u amerického fondu zaplatíte víc o“ and one amount in three parts: annual fund fee, conversion from crowns to dollars, tax withheld by the USA.</li>'
         '<li>Assumption 6 % return per year for both funds, „příklad, ne slib“.</li><li>Counted: fund fee, currency conversion, foreign withholding tax. Not counted: broker fees, inflation, Czech taxes.</li>'
         '<li>Result carried to success and results screens as „3 000 Kč měsíčně · 10 let“.</li></ul></div>'
         '<div class="col"><h3>Calculator · decide before building</h3><ul><li>The formula and the rounding.</li><li>Which fund pair drives the number.</li><li>Source and date of each input: fees, conversion cost, withholding rate, dividend yield.</li><li>Whether the result updates live while the slider moves.</li><li>What the headline says if the European fund is costlier. „Zaplatíte víc“ assumes the US fund is dearer.</li></ul>'
         '<h3>Recommended</h3><ul><li>One pure function with unit tests; every rate from a dated data file; reuse on the methodology page.</li><li><code>aria-live="polite"</code> on the result.</li><li><code>Intl.NumberFormat(\'cs-CZ\')</code>: space as thousands separator, decimal comma, non-breaking space before „Kč“ and „%“.</li></ul></div>'
         '<div class="col"><h3>E-mail flow · specified</h3><ol><li>Visitor enters an e-mail and may tick „Chci občas dostat tip k investování (nepovinné)“.</li><li>Success screen appears and keeps the calculator result.</li><li>An e-mail carries the link to the comparison page, valid 30 days, resendable from the results page. A 6-page PDF is also offered.</li><li>Tips need a second click in an e-mail; the comparison does not.</li><li>Every e-mail has an unsubscribe link; results footer has „Odhlásit odběr“.</li></ol>'
         '<p class="fine">Not specified: validation rules and messages, error and loading states, expired links, whether results work without the link, analytics events, consent logging.</p></div></div>'
         '<h3>Responsive</h3><p>Two widths are designed: 1280px and 390px (375px for G5). No breakpoint is given; pick one and test everything between 320px and 1440px. On phones grids collapse to one column, the hero table keeps three columns with shorter labels, results tables become cards with a „show more“ button, the results ToC becomes a scrolling chip row, navigation collapses to „Menu“, and the sticky CTA bar appears on the landing page only.</p>'
         '<h3>Anchors</h3><div class="facts"><div><b>Landing</b><span><code>#calc</code> <code>#gate</code> <code>#z</code> <code>#m</code> <code>#f</code></span></div><div><b>Results</b><span><code>#t1</code> – <code>#t4</code></span></div><div><b>Placeholders for routes</b><span><code>#results</code> <code>#pdf</code> <code>#copy</code> <code>#resend</code> <code>#metodika</code> <code>#p</code> <code>#c</code> <code>#u</code> <code>#more</code> <code>#more2</code> <code>#result</code></span></div></div></section>')

# open items
p.append('<section id="otevrene" class="sec">' + section_head('12', 'Open items', 'What the wireframes leave out, what has to be substantiated, and what to fix in the build.')
         + '<h3>Referenced but not designed</h3><ul class="plain">' + ''.join(f'<li>{x}</li>' for x in NOT_DESIGNED) + '</ul>'
         + '<h3>Copy and placeholders</h3><p>No number in the wireframes is real. The build should refuse to show an unsourced number.</p><div class="tablewrap"><table class="inv small"><thead><tr><th>Placeholder</th><th>Where</th><th>What it needs</th></tr></thead><tbody>'
         + ''.join(f'<tr><td><code>{E(a)}</code></td><td>{b}</td><td>{c}</td></tr>' for a, b, c in PLACEHOLDERS) + '</tbody></table></div>'
         + '<h3>Claims to substantiate before publishing</h3><ul class="plain"><li>„Oba sledují stejné velké firmy“ and „Stejné firmy. Jiná cena.“ hold only for matched pairs. The results table also lists a world fund, a dividend fund and a technology fund.</li><li>„Nedostáváme provize“ and „Nic neprodáváme“ must stay true for every link, including broker links.</li><li>„Zdarma“ and „bez registrace“ stay true only if the calculator result appears before any e-mail request.</li><li>„Čísla z oficiálních stránek fondů a Finanční správy“ means every figure really comes from those sources; the phone bar drops „a Finanční správy“.</li><li>The sentences about dollar conversion and tax withheld by the USA need a source per statement.</li></ul><p class="fine">The page covers investment products in the Czech Republic: have the final copy and the consent flow reviewed by someone qualified before launch.</p>'
         + '<h3>Accessibility and known issues</h3><p>Already right, keep it: real <code>&lt;label for&gt;</code> on the e-mail field and slider, <code>aria-label</code> on the slider, <code>inputmode="email"</code>, <code>autocomplete="email"</code>; logo as SVG with <code>role="img"</code> and title; <code>prefers-reduced-motion</code> support; touch targets ≥ 44px; tabular numerals.</p>'
         '<div class="tablewrap"><table class="inv small"><thead><tr><th>#</th><th>Issue</th><th>Where</th><th>Fix</th></tr></thead><tbody>'
         + ''.join(f'<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in ISSUES) + '</tbody></table></div>'
         + '<h3>Settle these first</h3><ol class="plain">' + ''.join(f'<li>{x}</li>' for x in SETTLE) + '</ol>'
         + '<h3>Suggested build order</h3><ol class="plain"><li><b>Foundation</b> — project, tokens, fonts, reset, Logo component (light and dark).</li><li><b>Primitives</b> — Tag, Button, Chip group, Pill, Card, Disclosure bar, Header, Footer, Placeholder image.</li><li><b>Data and calculator</b> — typed data files (<code>{ value, source, asOf }</code>), tested pure function, methodology page.</li><li><b>Landing page</b> — hero, calculator band, gate, cost cards, e-mail preview, trust, FAQ with details, sticky CTA.</li><li><b>Success and results</b> — link token, success screen, results page, resend, PDF.</li><li><b>Ads and polish</b> — render both ads from tokens, work through the accessibility table, send copy for review.</li></ol>'
         '<p class="fine">A screen is done when it matches this document at both widths, uses no hard-coded colours, shows no unsourced number, works by keyboard and respects reduced motion.</p></section>')

p.append(f'<footer class="docfoot">{logo(110, 28, True)}<span>ETF Kompas · Wireframes · 11. 10. 2026 · David Krapka</span></footer></main><script>{JS}</script></body></html>')

open(OUT, 'w').write(''.join(p))
print('wrote', OUT, os.path.getsize(OUT))
