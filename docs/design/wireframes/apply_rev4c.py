# rev4c: stale text fixes (fund/broker counts, method text, cover wording)
import glob
R=[('Fondy a 5 brokerů vedle sebe: kdo co nabízí a kolik stojí nákup.','Fondy a brokeři vedle sebe: kdo co nabízí a kolik stojí nákup.'),
('8 fondů, 5 brokerů a co z toho koupíte z Česka','Fondy, brokeři a co z toho koupíte z Česka'),
('Počítáme roční poplatek fondu, převod korun a daň, kterou stáhne zahraničí. Nepočítáme poplatky brokera, inflaci ani české daně.','Počítáme roční poplatek fondu, převod korun a poplatky brokera. Nepočítáme inflaci ani české daně.')]
for p in glob.glob('artboards-v4/*.html'):
    s=open(p).read();o=s
    for a,b in R: s=s.replace(a,b)
    if s!=o: open(p,'w').write(s); print('patched',p)
