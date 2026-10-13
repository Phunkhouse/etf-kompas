# rev6 (2026-10-13): the boards take in the design review and the data we have now.
# - Review: header and green box stay as drawn (the built page now follows them); hero table column
#   "Poplatek*" with a footnote, the index as the row title with manager, ticker and description under it,
#   no "nebo rovnou srovnání brokerů", no [ověřit] where the data is verified.
# - Data (calculator at 3 000 Kč a month, 10 years, 6 %, CSPX, ČNB rates of 2026-10-12): the amounts are the
#   output of the real calculator, not invented. Where the data is not verified (IBKR, "Česky") [ověřit] stays.
# Runs after apply_rev5.py, on artboards-v4.
import re

D = 'artboards-v4'
# numbers from the calculator (src/server/broker-pricing.ts) with the verified data of 2026-10-13
TOTAL, FUND, FX, BROKER = '30 778 Kč', '1 748 Kč', '13 434 Kč', '15 596 Kč'
VALUE, SAVING, SAVING_B = '456 642 Kč', '28 302 Kč', '28 302 Kč'
TAG_OLD = 'Za 10 let vás koupitelné ETF (CSPX) bude stát'
TAG_NEW = 'Za 10 let vás fond (CSPX) může u ověřených brokerů stát i'
ROWS = [
    ('S&amp;P 500', 'iShares CSPX, 500 největších firem', '0,07 %', 'Acc'),
    ('S&amp;P 500', 'Vanguard VUAA, 500 největších firem', '0,07 %', 'Acc'),
    ('Nasdaq 100', 'iShares CNDX, 100 technologických firem', '0,30 %', 'Acc'),
    ('Nasdaq 100', 'Invesco EQQQ, 100 technologických firem', '0,30 %', 'Dist'),
]
FOOTNOTE = '* Roční poplatek fondu, počítaný z vašich peněz ve fondu.'
CALLOUT_OLD = '<strong>ETF</strong> je fond, který jen kopíruje trh. Nemá drahé správce, a proto je levný.'
CALLOUT_NEW = '<strong>ETF</strong> je fond, který jen kopíruje trh. Americké fondy (VOO, QQQ) u většiny brokerů z Česka nekoupíte, evropské verze stejných indexů ano.'


def read(f):
    return open(f'{D}/{f}.html').read()


def write(f, s):
    open(f'{D}/{f}.html', 'w').write(s)


def one(s, old, new, n=1):
    assert s.count(old) == n, (old[:60], s.count(old))
    return s.replace(old, new)


def in_order(s, old, news):
    # replace the first len(news) occurrences of `old`, one by one, in document order
    assert s.count(old) >= len(news), (old, s.count(old), len(news))
    for new in news:
        s = s.replace(old, new, 1)
    return s


def dates(s):
    # the oldest date in all the data is 2026-06-30 (VOO factsheet): "6. 2026"
    for old in ('ověřeno k 10. 2026', 'Ověřeno k 10. 2026', 'ověřena k 10. 2026'):
        s = s.replace(old, old.replace('10. 2026', '6. 2026'))
    return s


def calc_block(s, mobile):
    s = one(s, TAG_OLD, TAG_NEW)
    s = one(s, 'převod korun na dolary', 'převod korun na cizí měnu')
    # the built page says it without the dollars; the phone board also lacked the sentence about taxes
    s = one(s, ' Fond CSPX počítáme v dolarech.', ' Nepočítáme české daně ani inflaci.' if mobile else '')
    if mobile:
        assert s.count('Nepočítáme české daně ani inflaci. Nepočítáme') == 0
    # big number, three parts, value, fees, saving: document order
    s = in_order(s, 'X XXX Kč', [TOTAL, FUND, FX, BROKER, VALUE, TOTAL, SAVING])
    return s


def hero_rows_mobile(s):
    head = '<div class="row" style="padding:8px 0;border-bottom:1.5px solid #16150F">'
    i = s.index(head)
    j = s.index('</div>\n<a class="btn" href="#calc">')
    rows = ''.join(
        f'<div class="row"><span><strong>{t}</strong><br><span style="font-size:12px;color:#6B665A">{d}</span></span>'
        f'<span class="num">{fee}</span><span class="pill">{ty}</span></div>'
        for t, d, fee, ty in ROWS
    )
    k = s.index('</div>', i) + len('</div>')
    s = s[:k] + '\n' + rows + '\n' + s[j:]
    s = one(s, '<span class="tag">Poplatek</span>', '<span class="tag">Poplatek*</span>')
    s = one(s, '</div>\n<a class="btn" href="#calc">',
            f'</div>\n<p style="font-size:12px;color:#6B665A">{FOOTNOTE}</p>\n<a class="btn" href="#calc">')
    s = one(s, 'CSPX: DEGIRO, Trading 212, XTB', 'CSPX: DEGIRO, Fio e-Broker, Trading 212, XTB')
    s = one(s, 'žádné výnosy.', 'ne výnosy.')
    s = one(s, CALLOUT_OLD, CALLOUT_NEW)
    return s


def hero_rows_desktop(s):
    i = s.index('<div class="tr2">')
    j = s.index('<p style="padding:12px 12px 4px;font-size:13px;color:#6B665A">CSPX:')
    rows = ''.join(
        f'<div class="tr2"><div><strong>{t}</strong><br><span style="font-size:13px;color:#6B665A">{d}</span></div>'
        f'<span class="num">{fee}</span><span class="pill">{ty}</span></div>'
        for t, d, fee, ty in ROWS
    )
    s = s[:i] + rows + '\n' + f'<p style="padding:8px 12px 0;font-size:13px;color:#6B665A">{FOOTNOTE}</p>\n' + s[j:]
    s = one(s, '<span class="tag">Roční poplatek</span>', '<span class="tag">Poplatek*</span>')
    s = one(s, 'zdroj: stránky fondů · ověřeno k 10. 2026', 'zdroj: stránky fondů a brokerů · ověřeno k 10. 2026')
    s = one(s, 'CSPX: DEGIRO, Trading 212, XTB', 'CSPX: DEGIRO, Fio e-Broker, Trading 212, XTB')
    s = one(s, '<a href="#gate" style="font-size:15px">nebo rovnou srovnání brokerů</a>', '')
    return s


def landing(f, mobile, variant_b):
    s = read(f)
    if variant_b:
        # the headline of rev5 uses no-break spaces
        # the amount is red (the cost red for light backgrounds, #C23A1B), the rest ink
        s = one(s, 'zaplatit až X\u00a0XXX\u00a0Kč. Kde?',
                'zaplatit až <span style="color:#C23A1B">' + SAVING_B.replace(' ', '\u00a0') + '</span>. Kde?')
    s = hero_rows_mobile(s) if mobile else hero_rows_desktop(s)
    s = calc_block(s, mobile)
    write(f, dates(s))
    print('ok', f)


landing('ad67ec35', True, False)
landing('a8f21cef', False, False)
landing('vb02hero-m', True, True)
landing('vb01hero-d', False, True)

# after submit: the same result sentence and amount
for f in ('642661e9', '4555091e'):
    s = read(f)
    s = one(s, TAG_OLD, TAG_NEW)
    s = one(s, 'X XXX Kč', TOTAL)
    write(f, dates(s))
    print('ok', f)

# motion board: the hero table rows are the real ones (the calculator demo there says "numbers are not data")
s = read('mo01motion')
m_rows = ''.join(
    f'<div class="tr a{n}"><div><b>{t}</b><small>{d}</small></div><span class="num">{fee}</span><span class="pill">{ty}</span></div>'
    for n, (t, d, fee, ty) in enumerate(ROWS, 1)
)
i = s.index('<div class="tr a1">')
j = s.index('</div></div><p class="note">The card rises 24 px')
s = s[:i] + m_rows + s[j:]
s = one(s, '<span class="tag">Poplatek</span>', '<span class="tag">Poplatek*</span>')
write('mo01motion', s)
print('ok mo01motion')

# comparison page (not built yet): the funds, the CSPX prices per broker, the fees per broker
FUNDS = [('iShares CSPX', 'S&amp;P 500', 'Acc', '0,07 %'), ('Vanguard VUAA', 'S&amp;P 500', 'Acc', '0,07 %'),
         ('Vanguard VUSA', 'S&amp;P 500', 'Dist', '0,07 %'), ('iShares CNDX', 'Nasdaq 100', 'Acc', '0,30 %'),
         ('Invesco EQQQ', 'Nasdaq 100', 'Dist', '0,30 %')]
VER = '<span class="pill ver">[ověřit]</span>'
YES = '<span class="pill yes">Ano</span>'
# CSPX at each broker: (name, sold?, fees = broker + conversion, total over 10 years); IBKR is not verified
PRICES = [('DEGIRO', True, '12 668 Kč', '14 416 Kč'), ('Fio', True, '29 030 Kč', '30 778 Kč'), ('IBKR', None, None, None),
          ('Trading 212', True, '729 Kč', '2 476 Kč'), ('XTB', True, '2 428 Kč', '4 176 Kč')]
LOWEST = '2 476 Kč'
# fee per broker, from data/brokers.json (the 5 listed): purchase, conversion; "Česky" is not in the data
FEES = [('DEGIRO', '1 € (Tradegate), jinde 3 €', '0 % na eura, 0,25 % na dolary'), ('Fio', '3,95 € (XETRA)', '2,77 %'),
        ('IBKR', None, None), ('Trading 212', '0 Kč', '0,15 %'), ('XTB', '0 Kč', '0,5 %')]


def results(f, mobile):
    s = read(f)
    s = one(s, TAG_OLD, TAG_NEW)
    s = in_order(s, 'X XXX Kč', [TOTAL])  # the result box; the rest is set below
    # section 1: funds
    if mobile:
        i = s.index('<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>iShares CSPX')
        j = s.index('<p class="src">Acc = fond')
        cards = ''.join(
            f'<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>{n}</strong><span class="pill">{ty}</span></div>'
            f'<div class="kv" style="margin-top:6px"><span>{idx} · roční poplatek</span><span class="num">{fee}</span></div></div>'
            for n, idx, ty, fee in FUNDS)
        s = s[:i] + cards + '\n' + s[j:]
        i = s.index('<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>DEGIRO')
        j = s.index('<p class="src">3 000 Kč měsíčně')
        cards = ''
        for n, sold, fees, total in PRICES:
            cards += (f'<div class="card" style="padding:12px 14px"><div style="display:flex;justify-content:space-between;gap:10px"><strong>{n}</strong>{YES if sold else VER}</div>'
                      f'<div class="kv" style="margin-top:6px"><span>Poplatky brokera a převod</span>{"<span class=num>" + fees + "</span>" if fees else VER}</div>'
                      f'<div class="kv"><span>Za 10 let celkem</span><span class="num">{total or "–"}</span></div></div>')
        s = s[:i] + cards + '\n' + s[j:]
        # section 3: DEGIRO and Fio shown, "Zobrazit dalších 3 firmy" stays
        for n, buy, conv in FEES[:2]:
            old = (f'<strong>{n}</strong><div class="kv" style="margin-top:6px"><span>Poplatek za nákup</span><span>[ověřit]</span></div>'
                   f'<div class="kv"><span>Převod korun</span><span>[ověřit]</span></div><div class="kv"><span>Česky</span><span>[ano/ne]</span></div>')
            new = (f'<strong>{n}</strong><div class="kv" style="margin-top:6px"><span>Poplatek za nákup</span><span>{buy}</span></div>'
                   f'<div class="kv"><span>Převod korun</span><span>{conv}</span></div><div class="kv"><span>Česky</span><span>[ověřit]</span></div>')
            s = one(s, old, new)
    else:
        i = s.index('<tr><td><strong>iShares CSPX')
        j = s.index('</tbody></table></div>\n<p class="src" style="margin:10px 0 28px">')
        rows = ''.join(f'<tr><td><strong>{n}</strong><br><span class="src">{idx}</span></td><td><span class="pill">{ty}</span></td><td class="num">{fee}</td></tr>'
                       for n, idx, ty, fee in FUNDS)
        s = s[:i] + rows + s[j:]
        i = s.index('<tr><td><strong>DEGIRO</strong></td><td><span class="pill yes">Ano</span>')
        j = s.index('</tbody></table></div>\n<p class="src" style="margin-top:8px">3 000')
        rows = ''.join(
            f'<tr><td><strong>{n}</strong></td><td>{YES if sold else VER}</td><td>{"<span class=num>" + fees + "</span>" if fees else VER}</td><td class="num">{total or "–"}</td></tr>'
            for n, sold, fees, total in PRICES)
        s = s[:i] + rows + s[j:]
        # section 3: the table of all five brokers
        for n, buy, conv in FEES:
            b = (buy or '[ověřit]'); c = (conv or '[ověřit]')
            old = (f'<sc-raw-td><strong>{n}</strong></sc-raw-td><sc-raw-td class="num">[ověřit]</sc-raw-td>'
                   f'<sc-raw-td class="num">[ověřit]</sc-raw-td><sc-raw-td>[ano/ne]</sc-raw-td>')
            if n == 'XTB':
                old = old.replace('<sc-raw-td><strong>', '<sc-raw-td style="border-bottom:0"><strong>').replace('class="num">[ověřit]', 'class="num" style="border-bottom:0">[ověřit]').replace('<sc-raw-td>[ano/ne]', '<sc-raw-td style="border-bottom:0">[ano/ne]')
            new = old.replace('class="num">[ověřit]</sc-raw-td><sc-raw-td class="num">[ověřit]', f'class="num">{b}</sc-raw-td><sc-raw-td class="num">{c}', 1) if 'style="border-bottom:0"' not in old else old.replace('class="num" style="border-bottom:0">[ověřit]</sc-raw-td><sc-raw-td class="num" style="border-bottom:0">[ověřit]', f'class="num" style="border-bottom:0">{b}</sc-raw-td><sc-raw-td class="num" style="border-bottom:0">{c}', 1)
            new = new.replace('[ano/ne]', '[ověřit]')
            s = one(s, old, new)
    s = one(s, '<strong>Mezi ověřenými brokery se výsledek liší až o X XXX Kč.</strong> Nejnižší možné poplatky s vaším nastavením: X XXX Kč za 10 let.',
            f'<strong>Mezi ověřenými brokery se výsledek liší až o {SAVING}.</strong> Nejnižší možné poplatky s vaším nastavením: {LOWEST} za 10 let.')
    s = one(s, 'Ceny brokerů: [ověřit u každého, zdroj k číslu].', 'Ceny brokerů: u každého je zdroj a datum ověření; u IBKR zatím ověřujeme.')
    s = one(s, '>CSNDX</span>', '>CNDX</span>')
    s = one(s, 'Poplatky fondů a to, u koho je koupíte', 'Poplatky fondů a to, u koho je koupíte')
    if not mobile:
        s = one(s, '<th>Poplatky brokera</th>', '<th>Poplatky brokera a převod</th>')
    write(f, dates(s))
    print('ok', f)


results('92ef8ee0', False)
results('24e61a2e', True)

# PDF page 1: availability of the five funds at the five brokers (IBKR is not verified), the real value and fees
s = read('pd01pdf1')
FN = [('S&amp;P 500 · CSPX', 'Acc', '0,07 %'), ('S&amp;P 500 · VUAA', 'Acc', '0,07 %'), ('S&amp;P 500 · VUSA', 'Dist', '0,07 %'),
      ('Nasdaq 100 · CNDX', 'Acc', '0,30 %'), ('Nasdaq 100 · EQQQ', 'Dist', '0,30 %')]
i = s.index('<tbody>') + len('<tbody>')
j = s.index('</tbody>')
rows = ''.join(
    f'<tr><td><b>{n}</b><br><span style="font-size:11px;color:#555">{ty}</span></td><td class="num">{fee}</td>'
    f'<td>{YES}</td><td>{YES}</td><td>{VER}</td><td>{YES}</td><td>{YES}</td></tr>' for n, ty, fee in FN)
s = s[:i] + rows + s[j:]
s = one(s, '[ověřit] = zatím neověřeno, doplníme zdroj. „Ano“ jen s uvedeným zdrojem a datem.', '[ověřit] = zatím neověřeno, doplníme zdroj. „Ano“ jen s uvedeným zdrojem a datem. Interactive Brokers zatím ověřujeme.')
s = one(s, 'Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč.', f'Ilustrativní hodnota po 10 letech: {VALUE}, z toho poplatky {TOTAL}.')
write('pd01pdf1', dates(s))
print('ok pd01pdf1')

# the rest: only the date of the data
for f in ('pd02pdf4', '734d3e9c'):
    write(f, dates(read(f)))
print('ok dates')
