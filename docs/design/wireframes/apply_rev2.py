#!/usr/bin/env python3
"""Revision 2 of the artboards: highlighted row = 'buyable from CZ' (not 'cheapest'), real fees,
availability by broker with [ověřit] where unverified, hero and ads reframed.
usage: apply_rev2.py <artboards-in> <artboards-out>"""
import re, sys, os, glob, shutil
SRC, DST = sys.argv[1:3]
os.makedirs(DST, exist_ok=True)
T = {}
for f in glob.glob(f'{SRC}/*.html'):
    T[os.path.basename(f)[:-5]] = open(f).read()
MAIN, BM, T1, E1, E2, F1, F2, G1, G2, G3, G4, G5 = ('a8f21cef', 'ad67ec35', '174eb66f', '642661e9', '4555091e', '92ef8ee0', '24e61a2e', '8e84da19', '6bf92b0b', 'c2093dbc', '4b5adee3', '734d3e9c')


def rep(b, old, new, n=1):
    s = T[b]
    assert old in s, (b, old[:70])
    T[b] = s.replace(old, new) if n == 0 else s.replace(old, new, n)


def rx(b, pat, new, flags=0):
    s, k = re.subn(pat, new, T[b], flags=flags)
    assert k, (b, pat[:70])
    T[b] = s


VER_CSS = '.ver{background:#F3E6BE;color:#6B4E00}'
for b in (MAIN, BM, T1, F1, F2):
    rep(b, '.yes{background:#D6E8DE;color:#154A33}', '.yes{background:#D6E8DE;color:#154A33}\n' + VER_CSS)

# disclosure bars (one wording, desktop and phone)
for b in T:
    for old in ('Čísla z oficiálních stránek fondů a Finanční správy · aktualizováno 10. 2026',
                'Čísla z oficiálních stránek fondů · aktualizováno 10. 2026'):
        if old in T[b]:
            T[b] = T[b].replace(old, 'Čísla ze stránek fondů a brokerů · ověřeno k 10. 2026')
    T[b] = T[b].replace('Stav 10. 2026 · u každého čísla je zdroj', 'Ověřeno k 10. 2026 · u každého čísla je zdroj')

# hero copy
H1 = 'Které ETF si z Česka opravdu koupíte a kolik vás stojí?'
for b in (MAIN, BM, T1):
    rep(b, 'Americký, nebo evropský fond? Co vás stojí víc?', H1)
    rep(b, 'Oba sledují stejné velké firmy. Liší se cenou a tím, kde je koupíte.',
        'Stejný index často koupíte z Česka jen v evropské verzi. Ukážeme vám, kterou, u koho a za kolik.')
    rep(b, 'Spočítat, kolik ušetřím', 'Spočítat, kolik zaplatím')
rep(MAIN, 'nebo rovnou srovnání všech 8', 'nebo rovnou kontrola brokerů')
rep(MAIN, 'zdroj: oficiální stránky fondů · 10. 2026', 'zdroj: stránky fondů a brokerů · ověřeno k 10. 2026')

# hero table: real fees, availability, highlight = buyable from CZ
short = {MAIN: 'Ne u 3 z 5 brokerů', T1: 'Ne u 3 z 5 brokerů', BM: '3 z 5: Ne'}
for b in (MAIN, BM, T1):
    rx(b, r'(značka VOO</span>(?:</span>|</div>)<span class="num">)0,0X %', r'\g<1>0,03 %')
    rx(b, r'(značka QQQ</span>(?:</span>|</div>)<span class="num">)0,XX %', r'\g<1>0,18 %')
    rx(b, r'(Evrop[^<]*</span>(?:</span>|</div>)<span class="num">)0,0X %', r'\g<1>0,07 %')
    rx(b, r'<span class="pill no (\w+)">\[ověřit\]</span>',
       r'<div><span class="pill ver \1">[ověřit]</span><span style="display:block;font-size:12px;color:#6B665A;margin-top:4px">' + short[b] + '</span></div>')
    rx(b, r'<span class="pill yes (\w+)">\[ověřit\]</span>', r'<span class="pill yes \1">Ano</span>')
for b in (MAIN, T1):
    rep(b, 'stejných 500 firem, fond sídlí v Evropě', 'stejných 500 firem, značka CSPX, sídlí v Evropě')
rep(BM, 'stejných 500 firem, fond v Evropě', 'stejných 500 firem, značka CSPX')
rep(MAIN, 'Tabulka ukazuje jen cenu a dostupnost, ne výnosy. Minulé výnosy nezaručují budoucí.',
    'Zvýrazněno je to, co koupíte z ČR, ne to nejlevnější. Nejnižší poplatek má VOO, ale u 3 z 5 brokerů ho nekoupíte. Jen cena a dostupnost, ne výnosy.')
rep(BM, 'Jen cena a dostupnost, žádné výnosy.', 'Zvýrazněno = koupíte z ČR, ne nejlevnější. Jen cena a dostupnost, žádné výnosy.')
rep(T1, 'Jen cena a dostupnost, ne výnosy. Minulé výnosy nezaručují budoucí.', 'Zvýrazněno = koupíte z ČR, ne nejlevnější. Jen cena a dostupnost, ne výnosy.')

# calculator (rev. 2b): what the ETF you can really buy costs you; broker is the lever
CALC_TAG = 'Za 10 let vás koupitelné ETF (CSPX) bude stát'
for b in (MAIN, BM, E1, E2):
    rep(b, 'Za 10 let u amerického fondu zaplatíte víc o', CALC_TAG)
for b in (MAIN, BM, E1):
    rep(b, 'Kolik to u vás dělá?', 'Kolik vás to bude stát?')
for b in (MAIN, BM):
    rep(b, 'daň, kterou stáhne USA', 'poplatky brokera')
rep(F1, 'U amerického fondu zaplatíte víc o', 'Za 10 let vás koupitelné ETF (CSPX) bude stát')
rep(F2, 'U amerického fondu zaplatíte víc o', 'Za 10 let vás koupitelné ETF (CSPX) bude stát')
NOTE = '<p style="font-size:13px;color:#D9D4C5;border-top:1px solid #4A473D;padding-top:10px">Podle brokera se výsledek liší až o X XXX Kč. Kdo vyjde nejlevněji, ukážeme vám v srovnání.</p>'
rep(MAIN, '<p style="font-size:12px;color:#B9B3A2">Počítáme s výnosem 6 % ročně u obou fondů. Je to příklad, ne slib.</p>',
    '<p style="font-size:12px;color:#B9B3A2">Počítáme s výnosem 6 % ročně. Je to příklad, ne slib. Nepočítáme české daně ani inflaci.</p>' + NOTE)
rx(BM, r'(<p style="[^"]*">)Počítáme s výnosem 6 % ročně\. Je to příklad, ne slib\.</p>',
   r'\1Počítáme s výnosem 6 % ročně. Je to příklad, ne slib.</p>' + NOTE)
rep(E1, 'Počítáme s výnosem 6 % ročně u obou fondů. Je to příklad, ne slib.', 'Počítáme s výnosem 6 % ročně. Je to příklad, ne slib. Nepočítáme české daně ani inflaci.')

# gate and e-mail preview: lead magnet = fund + broker check
for b in (MAIN, BM):
    rep(b, 'Chcete porovnat všech 8 fondů?', 'Chcete vidět, kde který fond koupíte?')
    rep(b, 'Ceny, daně a kde je koupit. Na jedné stránce, česky.', 'Fondy a 5 brokerů vedle sebe: kdo co nabízí a kolik stojí nákup. Česky, na jedné stránce.')
    rep(b, '8 fondů vedle sebe, daně v Česku a kde je koupit', '8 fondů, 5 brokerů a co z toho koupíte z Česka')

# ads
for b, cta in ((G1, 'Zjistěte to za 20 sekund. Zdarma.'), (G2, 'Zjistěte to za 20 sekund. Zdarma.')):
    rep(b, 'Kolik z vašich peněz sní poplatky fondu?', 'Které ETF si z Česka opravdu koupíte?')
    rep(b, '? Kč', '? z 8')
    rep(b, 'za 10 let · u vás', 'fondů si z ČR opravdu koupíte')
    rep(b, 'Spočítejte to za 20 sekund. Zdarma.', cta)
rep(G5, 'Kolik z vašich peněz sní poplatky fondu?', 'Které ETF si z Česka opravdu koupíte?')
rep(G5, 'Spočítejte to za 20 sekund. Zdarma, bez registrace.', 'Zjistěte to za 20 sekund. Zdarma, bez registrace.')
rep(G5, 'Spočítat moje poplatky', 'Ukázat, co koupím')
for b in (G3, G4):
    rep(b, '>USA</span>', '>USA · VOO 0,03 %</span>')
    rx(b, r'>Evropa</span>', '>Evropa · CSPX 0,07 %</span>')
    rep(b, 'Co vás stojí víc?', 'Který koupíte z Česka?')
    rep(b, 'Stejné firmy. Jiná cena. Rozdíl spočítáme v korunách.', 'Stejné firmy, jiná cena i dostupnost. Spočítáme to v korunách.')

rep(G4, '<p style="font-size:17px;font-weight:600;line-height:1.2">', '<p style="font-size:17px;font-weight:600;line-height:1.2;margin-top:10px">')

# results page, desktop
rep(F1, 'řazeno od nejlevnějšího', 'koupitelné z ČR nahoře · pak podle poplatku')
row1 = ('<sc-raw-tr><sc-raw-td><strong>Evropská verze: 500 největších amerických firem</strong></sc-raw-td><sc-raw-td class="num">0,0X %</sc-raw-td>'
        '<sc-raw-td>Evropa</sc-raw-td><sc-raw-td><span class="pill yes">[ověřit]</span></sc-raw-td><sc-raw-td class="src">stránka fondu ↗</sc-raw-td></sc-raw-tr>')
hl = 'style="background:#DCEEE3"'
rep(F1, row1, f'<sc-raw-tr><sc-raw-td {hl}><strong>Evropská verze: 500 největších amerických firem</strong><br><span class="src">značka CSPX</span></sc-raw-td><sc-raw-td class="num" {hl}>0,07 %</sc-raw-td>'
    f'<sc-raw-td {hl}>Evropa</sc-raw-td><sc-raw-td {hl}><span class="pill yes">Ano</span></sc-raw-td><sc-raw-td class="src" {hl}>stránka fondu ↗</sc-raw-td></sc-raw-tr>')
rx(F1, r'(značka VOO</span></sc-raw-td><sc-raw-td class="num">)0,0X %', r'\g<1>0,03 %')
rx(F1, r'(značka QQQ</span></sc-raw-td><sc-raw-td class="num">)0,XX %', r'\g<1>0,18 %')
T[F1] = T[F1].replace('<span class="pill yes">[ověřit]</span>', '<span class="pill ver">[ověřit]</span>').replace('<span class="pill no">[ověřit]</span>', '<span class="pill ver">[ověřit]</span>')


def cell(v):
    cls = {'Ano': 'yes', 'Ne': 'no'}.get(v, 'ver')
    return f'<sc-raw-td><span class="pill {cls}">{v}</span></sc-raw-td>'


rows = [('CSPX · evropská verze', ['Ano', '[ověřit]', '[ověřit]', 'Ano', 'Ano']),
        ('VOO · americký fond', ['Ne', '[ověřit]', '[ověřit]', 'Ne', 'Ne']),
        ('QQQ · americký fond', ['Ne', '[ověřit]', '[ověřit]', 'Ne', 'Ne'])]
matrix = ('<div class="card" style="padding:12px 16px;margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0 6px">'
          '<span class="tag">Dostupnost podle brokera · ověřeno k 10. 2026</span><span class="src">zdroj: stránky brokerů ↗</span></div><sc-raw-table><sc-raw-thead><sc-raw-tr>'
          '<sc-raw-th>Fond</sc-raw-th><sc-raw-th>DEGIRO</sc-raw-th><sc-raw-th>Fio</sc-raw-th><sc-raw-th>IBKR</sc-raw-th><sc-raw-th>Trading 212</sc-raw-th><sc-raw-th>XTB</sc-raw-th></sc-raw-tr></sc-raw-thead><sc-raw-tbody>'
          + ''.join('<sc-raw-tr><sc-raw-td><strong>' + n + '</strong></sc-raw-td>' + ''.join(cell(v) for v in vs) + '</sc-raw-tr>' for n, vs in rows)
          + '</sc-raw-tbody></sc-raw-table></div>'
          '<p style="font-size:13px;color:#6B665A;margin-top:10px">Zvýrazněný řádek je to, co koupíte z ČR, ne to nejlevnější: nejnižší poplatek má VOO (0,03 %). „Ne“ ukazujeme jen tam, kde máme zdroj u konkrétního brokera; zbytek zůstává [ověřit].</p>')
i = T[F1].index('<section id="t1">')
j = T[F1].index('</section>', i)
T[F1] = T[F1][:j] + matrix + '\n' + T[F1][j:]
for old, new in (('[Firma A]', 'DEGIRO'), ('[Firma B]', 'Fio'), ('[Firma C]', 'IBKR'), ('[Firma D]', 'Trading 212'), ('[Firma E]', 'XTB')):
    rep(F1, old, new)

# results page, phone
rep(F2, 'řazeno od nejlevnějšího', 'koupitelné z ČR nahoře')
rep(F2, '<strong>Evropská verze: 500 největších amerických firem</strong><span class="pill yes">[ověřit]</span></div><div class="kv" style="margin-top:8px"><span>Roční poplatek</span><span class="num">0,0X %</span>',
    '<strong>Evropská verze: 500 největších amerických firem <span class="src">(CSPX)</span></strong><span class="pill yes">Ano</span></div><div class="kv" style="margin-top:8px"><span>Roční poplatek</span><span class="num">0,07 %</span>')
rep(F2, '<div class="card" style="padding:14px 16px"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><strong>Evropská verze: 500',
    '<div class="card" style="padding:14px 16px;background:#DCEEE3"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><strong>Evropská verze: 500')
rx(F2, r'(\(VOO\)</span></strong><span class="pill )no(">\[ověřit\]</span></div><div class="kv" style="margin-top:8px"><span>Roční poplatek</span><span class="num">)0,0X %', r'\g<1>ver\g<2>0,03 %')
rx(F2, r'(\(QQQ\)</span></strong><span class="pill )no(">\[ověřit\]</span></div><div class="kv" style="margin-top:8px"><span>Roční poplatek</span><span class="num">)0,XX %', r'\g<1>ver\g<2>0,18 %')
mm = ('<div class="card" style="padding:14px 16px"><span class="tag">Dostupnost podle brokera · ověřeno k 10. 2026</span>'
      + ''.join(f'<div class="kv" style="margin-top:6px"><span><strong>{n}</strong></span><span>{v}</span></div>' for n, v in [
          ('DEGIRO', 'CSPX Ano · VOO Ne · QQQ Ne'), ('Fio', '[ověřit]'), ('IBKR', '[ověřit]'),
          ('Trading 212', 'CSPX Ano · VOO Ne · QQQ Ne'), ('XTB', 'CSPX Ano · VOO Ne · QQQ Ne')])
      + '<p class="src" style="margin-top:8px">„Ne“ jen tam, kde máme zdroj u brokera. Zvýrazněný fond je koupitelný z ČR, ne nejlevnější.</p></div>')
end = T[F2].index('<a class="btn o" href="#more"')
T[F2] = T[F2][:end] + mm + T[F2][end:]
rep(F2, '[Firma A]', 'DEGIRO')
rep(F2, '[Firma B]', 'Fio')

for b, s in T.items():
    open(f'{DST}/{b}.html', 'w').write(s)
print('ok', len(T))
