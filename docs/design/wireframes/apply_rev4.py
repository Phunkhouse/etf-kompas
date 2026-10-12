#!/usr/bin/env python3
"""Revision 4: the green "ponecháte si až X XXX Kč" box with CTA in the calculator.
usage: apply_rev4.py <artboards-v3> <artboards-v4>"""
import sys, os, glob
SRC, DST = sys.argv[1:3]
os.makedirs(DST, exist_ok=True)
T = {os.path.basename(f)[:-5]: open(f).read() for f in glob.glob(f'{SRC}/*.html')}
MAIN, BM = 'a8f21cef', 'ad67ec35'

OLD = ('<div style="border-top:1px solid #4A473D;padding-top:10px;display:flex;flex-direction:column;gap:6px">'
       '<p style="font-size:13px;color:#D9D4C5">Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč · 6 % ročně, příklad, ne slib.</p>'
       '<p style="font-size:15px;color:#F6F3EC;font-weight:600">Správným brokerem si u stejného fondu ponecháte až X XXX Kč.</p>'
       '<span class="mono" style="font-size:11px;color:#E6C86E">návrh · potřebuje ověřené ceny brokerů</span></div>')
NEW = ('<p style="font-size:13px;color:#D9D4C5;border-top:1px solid #4A473D;padding-top:10px">Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč · 6 % ročně, příklad, ne slib.</p>'
       '<div id="saving" data-show-if="alespoň 2 brokeři s ověřenými cenami" style="background:#1F3A2B;border:1px solid #2F6B49;border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:8px;margin-top:4px">'
       '<span class="tag" style="color:#9AD4B2">Při vašem nastavení</span>'
       '<p style="font-size:17px;line-height:1.3;color:#F6F3EC;font-weight:600">Správným brokerem si u stejného fondu ponecháte až <span class="num" style="color:#9AD4B2;white-space:nowrap">X XXX Kč</span></p>'
       '<p style="font-size:12px;color:#B9D9C6">Odhad, bez českých daní a inflace.</p>'
       '<a class="btn" href="#gate" style="background:#9AD4B2;color:#16150F;margin-top:4px;text-align:center">Ukázat, u kterého brokera to koupím</a></div>')
for b in (MAIN, BM):
    assert OLD in T[b], b
    T[b] = T[b].replace(OLD, NEW)
    # currency: the calculator assumes the USD listing of CSPX, so the line says dolary
    o = 'Počítáme s výnosem 6 % ročně. Je to příklad, ne slib.'
    assert o in T[b], b
    T[b] = T[b].replace(o, o + ' Fond CSPX počítáme v dolarech.', 1)
for k, v in T.items():
    open(f'{DST}/{k}.html', 'w').write(v)
print('ok', len(T))
