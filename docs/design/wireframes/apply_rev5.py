# rev5: A/B test option 1. Same landing layout; ?v=b only changes the headline (loss-framed number).
# Writes two new artboards: vb01hero-d (desktop) and vb02hero-m (phone), copies of the landing pages with the b headline.
A = 'Americké indexy z Česka: u koho je koupíte a za kolik?'
B = 'U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?'
for src, dst, title in (('a8f21cef', 'vb01hero-d', 'Landing page · verze b · desktop'), ('ad67ec35', 'vb02hero-m', 'Landing page · verze b · mobil')):
    s = open(f'artboards-v4/{src}.html').read()
    assert s.count(A) == 1, src
    s = s.replace(A, B)
    for old in ('Jen cena a dostupnost, ne výnosy.', 'Jen cena a dostupnost, žádné výnosy.'):
        if old in s:
            s = s.replace(old, old + ' Částka v nadpisu: 3 000 Kč měsíčně, 10 let, odhad bez českých daní a inflace.')
    s = s.replace('<title>', '<title>' + title + ' – ', 1) if '<title>' in s else s
    open(f'artboards-v4/{dst}.html', 'w').write(s)
    print('ok', dst)
