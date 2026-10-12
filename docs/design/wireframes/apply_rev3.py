#!/usr/bin/env python3
"""Revision 3 of the artboards (twin ETFs, where and how much). usage: apply_rev3.py <artboards-v2> <artboards-v3>"""
import re, sys, os, glob
SRC, DST = sys.argv[1:3]
os.makedirs(DST, exist_ok=True)
T = {os.path.basename(f)[:-5]: open(f).read() for f in glob.glob(f'{SRC}/*.html')}
MAIN, BM, E1, E2, F1, F2, G1, G2, G3, G4, G5 = ('a8f21cef', 'ad67ec35', '642661e9', '4555091e', '92ef8ee0', '24e61a2e', '8e84da19', '6bf92b0b', 'c2093dbc', '4b5adee3', '734d3e9c')

def rep(b, old, new):
    assert old in T[b], (b, old[:60]); T[b] = T[b].replace(old, new)

def sec(b, start_pat):
    m = re.search(start_pat, T[b]); assert m, (b, start_pat)
    e = T[b].find('</section>', m.start()) + 10
    return m.start(), e

H1 = 'Americké indexy z Česka: u koho je koupíte a za kolik?'
LEAD = 'Stejné firmy ze S&amp;P 500 a Nasdaq 100, jen v evropské verzi. Ukážeme, u koho je koupíte a za kolik.'
V = '<span class="pill ver">[ověřit]</span>'
ROWS = [('S&amp;P 500', 'iShares CSPX', 'Acc', '0,07 %', False), ('S&amp;P 500', 'Vanguard VUAA', 'Acc', '0,07 %', True),
        ('S&amp;P 500', 'Vanguard VUSA', 'Dist', '0,07 %', True), ('Nasdaq 100', 'iShares CSNDX', 'Acc', '0,33 %', True),
        ('Nasdaq 100', 'Invesco EQQQ', 'Dist', '0,30 %', True)]
AVAIL = 'CSPX: DEGIRO, Trading 212, XTB (ověřeno k 10. 2026). U ostatních fondů a brokerů ověřujeme. Americké VOO a QQQ u většiny brokerů nekoupíte.'

def hero_d():
    rows = ''
    for ix, n, ad, fee, v in ROWS[:4]:
        rows += (f'<div class="tr2"><div><strong>{ix}</strong><br><span style="font-size:13px;color:#6B665A">{n}</span></div>'
                 f'<span class="num">{fee}{"<br>" + V if v else ""}</span><span class="pill">{ad}</span></div>')
    return f'''<section style="display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:64px;padding:64px 56px;align-items:center">
<div style="display:flex;flex-direction:column;gap:22px">
<h1 style="font-size:54px;line-height:1.04;letter-spacing:-.025em;font-weight:700">{H1}</h1>
<p style="font-size:20px;color:#3A372E">{LEAD}</p>
<p style="font-size:15px;color:#3A372E;border-left:3px solid #16150F;padding-left:12px;max-width:28em"><strong>ETF</strong> je fond, který jen kopíruje trh. Americké fondy (VOO, QQQ) u většiny brokerů z Česka nekoupíte, evropské verze stejných indexů ano.</p>
<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><a class="btn" href="#calc">Spočítat, kolik mě to bude stát</a><a href="#gate" style="font-size:15px">nebo rovnou srovnání brokerů</a></div>
</div>
<div class="card hc" style="padding:16px 20px">
<div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 12px 8px"><span class="tag">Cena fondů</span><span style="font-size:12px;color:#6B665A">zdroj: stránky fondů · ověřeno k 10. 2026</span></div>
<div class="th2"><span class="tag">Co koupíte</span><span class="tag">Roční poplatek</span><span class="tag">Typ</span></div>
{rows}
<p style="padding:12px 12px 4px;font-size:13px;color:#6B665A">{AVAIL} Jen cena a dostupnost, ne výnosy.</p>
</div>
</section>'''

def hero_m():
    rows = ''
    for ix, n, ad, fee, v in ROWS[:4]:
        rows += (f'<div class="row"><span><strong>{ix}</strong><br><span style="font-size:12px;color:#6B665A">{n}</span></span>'
                 f'<span class="num">{fee}{"<br>" + V if v else ""}</span><span class="pill">{ad}</span></div>')
    return f'''<section style="padding:20px 16px 24px;display:flex;flex-direction:column;gap:14px">
<h1 style="font-size:30px;line-height:1.06;letter-spacing:-.025em;font-weight:700">{H1}</h1>
<p style="font-size:16px;color:#3A372E">Stejné firmy ze S&amp;P 500 a Nasdaq 100, jen v evropské verzi.</p>
<div class="card hc" style="padding:4px 14px">
<div class="row" style="padding:8px 0;border-bottom:1.5px solid #16150F"><span class="tag">Co koupíte</span><span class="tag">Poplatek</span><span class="tag">Typ</span></div>
{rows}
</div>
<a class="btn" href="#calc">Spočítat, kolik mě to bude stát</a>
<p style="font-size:12px;color:#6B665A;text-align:center">{AVAIL} Jen cena a dostupnost, žádné výnosy.</p>
</section>'''

for b, fn in ((MAIN, hero_d), (BM, hero_m)):
    a, e = sec(b, r'<section'); T[b] = T[b][:a] + fn() + T[b][e:]

# calculator: positive line (stage 2) + illustrative line
OLD_NOTE = '<p style="font-size:13px;color:#D9D4C5;border-top:1px solid #4A473D;padding-top:10px">Podle brokera se výsledek liší až o X XXX Kč. Kdo vyjde nejlevněji, ukážeme vám v srovnání.</p>'
NEW_NOTE = ('<div style="border-top:1px solid #4A473D;padding-top:10px;display:flex;flex-direction:column;gap:6px">'
            '<p style="font-size:13px;color:#D9D4C5">Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč · 6 % ročně, příklad, ne slib.</p>'
            '<p style="font-size:15px;color:#F6F3EC;font-weight:600">Správným brokerem si u stejného fondu ponecháte až X XXX Kč.</p>'
            '<span class="mono" style="font-size:11px;color:#E6C86E">návrh · potřebuje ověřené ceny brokerů</span></div>')
for b in (MAIN, BM):
    rep(b, OLD_NOTE, NEW_NOTE)
    if 'class="mono"' not in T[b] and '.mono' not in T[b]:
        T[b] = T[b].replace('</helmet>', '<style>.mono{font-family:\'IBM Plex Mono\',monospace;font-weight:500;letter-spacing:.06em;text-transform:uppercase}</style></helmet>', 1)

# success pages
for b in (E1, E2):
    rep(b, 'Projděte 8 fondů vedle sebe', 'Projděte 5 fondů vedle sebe')
rep(E1, 'Cena, sídlo fondu a kde ho koupíte.', 'Poplatek, typ fondu a kde ho koupíte.')
rep(E2, 'Cena, sídlo fondu, kde ho koupíte.', 'Poplatek, typ fondu, kde ho koupíte.')

# results pages: fund tables + broker section
BR = [('DEGIRO', 'Ano', V, 'X XXX Kč'), ('Fio', V, V, '–'), ('IBKR', V, V, '–'), ('Trading 212', 'Ano', V, 'X XXX Kč'), ('XTB', 'Ano', V, 'X XXX Kč')]
def pill(x): return x if x.startswith('<') else f'<span class="pill yes">{x}</span>'
PICK = ''.join(f'<span class="pill{" yes" if i == 0 else ""}" style="padding:4px 12px">{n}</span>' for i, n in enumerate(['CSPX', 'VUAA', 'VUSA', 'CSNDX', 'EQQQ']))
SETUP = '3 000 Kč měsíčně · 10 let · 6 % ročně · jedna investice měsíčně · příklad, ne slib. Částky se řídí kalkulačkou.'
SUMMARY = ('<p style="margin-top:10px;font-size:15px"><strong>Mezi ověřenými brokery se výsledek liší až o X XXX Kč.</strong> Nejnižší možné poplatky s vaším nastavením: X XXX Kč za 10 let.</p>'
           '<p class="src" style="margin-top:4px">Odhad. Bez českých daní a inflace. Ceny brokerů: [ověřit u každého, zdroj k číslu].</p>')

def results_d():
    ft = ''.join(f'<tr><td><strong>{n}</strong><br><span class="src">{ix}</span></td><td><span class="pill">{ad}</span></td><td class="num">{fee} {V if v else ""}</td></tr>' for ix, n, ad, fee, v in ROWS)
    bt = ''.join(f'<tr><td><strong>{n}</strong></td><td>{pill(a)}</td><td>{f}</td><td class="num">{t} {V if t != "–" else ""}</td></tr>' for n, a, f, t in BR)
    return f'''<section id="t1">
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><h2 style="font-size:30px;letter-spacing:-.015em">1 · Fondy vedle sebe</h2><span class="tag">stejný index, jiný fond</span></div>
<div class="card" style="padding:8px 16px"><table><thead><tr><th>Co koupíte</th><th>Typ</th><th>Roční poplatek</th></tr></thead><tbody>{ft}</tbody></table></div>
<p class="src" style="margin:10px 0 28px">Acc = fond výnosy sám reinvestuje. Dist = výnosy vyplácí. Jen cena a dostupnost, ne výnosy.</p>
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><h2 style="font-size:30px;letter-spacing:-.015em">U kterého brokera?</h2><span class="tag">vyberte fond</span></div>
<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">{PICK}</div>
<div class="card" style="padding:8px 16px"><table><thead><tr><th>Broker</th><th>Koupíte?</th><th>Poplatky brokera</th><th>Za 10 let celkem</th></tr></thead><tbody>{bt}</tbody></table></div>
<p class="src" style="margin-top:8px">{SETUP}</p>{SUMMARY}
</section>'''

def results_m():
    fc = ''.join(f'<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>{n}</strong><span class="pill">{ad}</span></div><div class="kv" style="margin-top:6px"><span>{ix} · roční poplatek</span><span class="num">{fee} {V if v else ""}</span></div></div>' for ix, n, ad, fee, v in ROWS)
    bc = ''.join(f'<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>{n}</strong>{pill(a)}</div><div class="kv" style="margin-top:6px"><span>Poplatky brokera</span>{f}</div><div class="kv"><span>Za 10 let celkem</span><span class="num">{t}</span></div></div>' for n, a, f, t in BR)
    return f'''<section id="t1" style="padding:8px 16px 24px;display:flex;flex-direction:column;gap:10px">
<h2 style="font-size:24px;letter-spacing:-.015em">1 · Fondy vedle sebe</h2><span class="tag">stejný index, jiný fond</span>
{fc}
<p class="src">Acc = fond výnosy sám reinvestuje. Dist = výnosy vyplácí.</p>
<h2 style="font-size:24px;letter-spacing:-.015em;margin-top:12px">U kterého brokera?</h2>
<div style="display:flex;gap:6px;flex-wrap:wrap">{PICK}</div>
{bc}
<p class="src">{SETUP}</p>{SUMMARY}
</section>'''

for b, fn in ((F1, results_d), (F2, results_m)):
    a, e = sec(b, r'<section id="t1"'); T[b] = T[b][:a] + fn() + T[b][e:]
    rep(b, 'Srovnání 8 fondů', 'Srovnání 5 fondů')
    rep(b, 'Ceny, sídlo fondu a to, kde je koupíte z Česka.', 'Poplatky fondů a to, u koho je koupíte a kolik za to zaplatíte.')

# ads
for b in (G1, G2):
    rep(b, 'Které ETF si z Česka opravdu koupíte?', 'Americké indexy z Česka: u koho je koupíte a za kolik?')
    rep(b, '? z 8', '? z 5'); rep(b, 'fondů si z ČR opravdu koupíte', 'brokerů nabízí evropský fond na S&amp;P 500')
for b in (G3, G4):
    rep(b, 'USA · VOO 0,03 %', 'iShares · CSPX 0,07 %'); rep(b, 'Americký fond', 'Fond A')
    rep(b, 'Evropa · CSPX 0,07 %', 'Vanguard · VUAA 0,07 %'); rep(b, 'Evropský fond', 'Fond B')
    rep(b, 'Který koupíte z Česka?', 'U koho je koupíte a za kolik?')
    rep(b, 'Stejné firmy, jiná cena i dostupnost. Spočítáme to v korunách.', 'Stejný index, jiný fond i broker. Spočítáme to v korunách.')
rep(G5, 'Které ETF si z Česka opravdu koupíte?', 'Americké indexy z Česka: u koho je koupíte a za kolik?')
rep(G5, 'Ukázat, co koupím', 'Ukázat, kolik mě to bude stát')

for k, v in T.items():
    open(f'{DST}/{k}.html', 'w').write(v)
print('ok', len(T))
