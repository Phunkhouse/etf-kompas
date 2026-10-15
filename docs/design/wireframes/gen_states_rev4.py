# rev4f: form errors, double opt-in e-mail and page, calculator loading/error, PDF print pages, favicon, share image
import re
from gen_pages_rev4 import *
import os
LOGO='logo' if os.path.isdir('logo') else '../logo'
FAV=re.sub(r'<metadata>.*?</metadata>','',open(LOGO+'/favicon.svg').read(),flags=re.S).strip()
def fav(sz): return re.sub(r'width="48" height="48"',f'width="{sz}" height="{sz}"',FAV,count=1)
out={}
ERR='#B3341A'
# ---------- 1 form error states
def form(kind,mobile):
    fs=15 if mobile else 16
    pad=20 if mobile else 28
    if kind=='invalid':
        field=('<input id="e" type="email" value="jmeno@domena" aria-invalid="true" aria-describedby="e-err" style="border-color:'+ERR+';border-width:2px">'
               f'<p id="e-err" role="alert" style="font-size:14px;color:{ERR};font-weight:500">Zadejte e-mail ve tvaru jmeno@domena.cz.</p>')
        top=''
    else:
        field='<input id="e" type="email" value="jmeno@domena.cz">'
        top=(f'<div role="alert" style="background:#F4D9D1;color:#7A2410;border-radius:8px;padding:12px 14px;font-size:14px"><b>Odeslání se nepovedlo.</b> Zkuste to prosím znovu za chvíli. Váš e-mail i nastavení kalkulačky zůstaly vyplněné.</div>')
    return (f'<form style="border:1.5px solid #16150F;border-radius:10px;background:#FFFDF8;padding:{pad}px;display:flex;flex-direction:column;gap:10px" onsubmit="return false">'
            f'<span class="tag">{"Špatný e-mail" if kind=="invalid" else "Chyba odeslání"}</span>'
            f'<h2 style="font-size:{24 if mobile else 28}px;line-height:1.12;letter-spacing:-.02em">Chcete vidět, kde který fond koupíte?</h2>{top}'
            '<label for="e" style="font-weight:500;font-size:15px">Váš e-mail</label>'+field+
            '<button class="btn" type="button" style="width:100%">'+('Poslat mi srovnání' if kind=='invalid' else 'Zkusit znovu')+'</button>'
            '<p style="font-size:12px;color:#6B665A">Pošleme vám srovnání. Správce: [SPRÁVCE]. Zásady zpracování osobních údajů.</p>'
            '<label style="display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:22px"><input type="checkbox" style="width:22px;height:22px;margin:0;flex:none"> Chci občas dostat tip k investování (nepovinné)</label></form>')
out['fe01form-m']=doc('Formulář, chyby – mobil',CM,'<div style="background:#F6F3EC;padding:20px 16px;display:flex;flex-direction:column;gap:24px">'+form('invalid',True)+form('server',True)+'</div>',390,1000)
out['fe02form-d']=doc('Formulář, chyby – desktop',CD,'<div style="max-width:1280px;margin:0 auto;background:#F6F3EC;padding:48px 56px;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start">'+form('invalid',False)+form('server',False)+'</div>',1280,560)

# ---------- 2 double opt-in e-mail and confirmation page
out['oi01mail']=doc('E-mail, potvrzení odběru',CM,
 '<div style="background:#E6E1D4;padding:28px 0;min-height:600px"><div style="width:540px;margin:0 auto;background:#fff;border:1px solid #D4CEBE;border-radius:8px;overflow:hidden">'
 '<div style="padding:10px 20px;background:#F6F3EC;border-bottom:1px solid #D4CEBE;font-size:13px;color:#3A372E;display:flex;flex-direction:column;gap:2px"><span><b>Od:</b> ETF Kompas</span><span><b>Předmět:</b> Potvrďte odběr tipů k investování</span></div>'
 '<div style="padding:28px 28px 24px;display:flex;flex-direction:column;gap:16px">'+logo(110,28)+
 '<h1 style="font-size:26px;line-height:1.12;letter-spacing:-.02em">Potvrďte odběr tipů</h1>'
 '<p style="font-size:16px;color:#3A372E">Při stažení srovnání jste zaškrtli, že chcete občas dostat tip k investování. Stačí jedno klepnutí.</p>'
 '<a class="btn" href="#c" style="min-height:52px">Ano, posílejte mi tipy</a>'
 '<p style="font-size:14px;color:#3A372E">Srovnání už máte, na něm tento krok nic nemění. Pokud jste o tipy nežádali, e-mail ignorujte a nic se nestane.</p></div>'
 '<div style="background:#16150F;color:#D9D4C5;padding:16px 28px;font-size:12px;line-height:1.5">Správce: [SPRÁVCE – IČO, adresa]. Zásady zpracování. Odhlásit se můžete v každém e-mailu.</div></div></div>',600,600)
def cardpg(kind,h1,lead,btn,extra=''):
    return card_page(kind,h1,lead,btn,extra)
out['oi02ok-m']=doc('Odběr potvrzen – mobil',CM,cardpg('Potvrzení','Odběr tipů potvrzen','Děkujeme. Tipy budeme posílat zřídka. Odhlásit se můžete v každém e-mailu.','Zpět na srovnání'),390,760)
out['oi03old-m']=doc('Odkaz už nefunguje – mobil',CM,cardpg('Odkaz','Tento odkaz už nefunguje','Platnost odkazu vypršela nebo už byl použit. Odběr tipů můžete zapnout znovu ve formuláři na úvodní stránce.','Zpět na úvod'),390,760)

# ---------- 3 calculator loading / error
def calc(state,mobile):
    pad='40px 20px' if mobile else '48px 56px'
    sk=lambda w,h,c='#3A372E':f'<i style="display:block;width:{w};height:{h}px;border-radius:4px;background:{c}"></i>'
    ctrl=('<div style="display:flex;flex-direction:column;gap:20px"><h2 style="font-size:24px;line-height:1.1;letter-spacing:-.015em">Kolik vás to bude stát?</h2>'
          '<div><div style="display:flex;justify-content:space-between;align-items:baseline"><label for="m" style="font-size:15px">Kolik měsíčně uložíte</label><strong class="num" style="font-size:22px">3 000 Kč</strong></div><input id="m" type="range" min="500" max="20000" step="500" value="3000" aria-label="Měsíční částka"></div>'
          '<div style="display:flex;align-items:center;gap:8px"><span style="font-size:15px">Na jak dlouho</span><button class="chip">5</button><button class="chip on">10</button><button class="chip">20</button><span style="font-size:15px">let</span></div></div>')
    if state=='loading':
        res=('<div role="status" aria-live="polite" style="display:flex;flex-direction:column;gap:14px"><span class="tag" style="color:#B9B3A2">Načítáme aktuální poplatky…</span>'+sk('78%',56 if mobile else 72,'#4A473D')+
             '<div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">'+sk('100%',14)+sk('100%',14)+sk('100%',14)+'</div>'
             '<p style="font-size:12px;color:#B9B3A2;margin-top:4px">Posuvníky můžete hýbat už teď, částky se dopočítají.</p></div>')
    else:
        res=('<div role="alert" style="display:flex;flex-direction:column;gap:14px"><span class="tag" style="color:#B9B3A2">Ceny se nepodařilo načíst</span>'
             '<p style="font-size:18px;line-height:1.35;color:#F6F3EC">Částku teď nespočítáme, aby nebyla nepřesná. Zkuste to prosím znovu.</p>'
             '<a class="btn" href="#r" style="background:#F6F3EC;color:#16150F;min-height:52px">Zkusit znovu</a>'
             '<p style="font-size:12px;color:#B9B3A2">Fondy a brokery můžete mezitím projít v tabulce výše.</p></div>')
    if mobile:
        return f'<section class="dk" style="background:#16150F;color:#F6F3EC;padding:{pad};display:flex;flex-direction:column;gap:28px">{ctrl}<div style="border-top:1px solid #4A473D;padding-top:28px">{res}</div></section>'
    return f'<section class="dk" style="background:#16150F;color:#F6F3EC;padding:{pad};display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;align-items:start">{ctrl}<div>{res}</div></section>'
lab=lambda t:f'<div style="background:#16150F;color:#9AD4B2;padding:10px 20px 0;font:500 11px \'IBM Plex Mono\',monospace;letter-spacing:.06em;text-transform:uppercase">{t}</div>'
out['lc01calc-m']=doc('Kalkulačka, načítání a chyba – mobil',CM,'<div style="background:#F6F3EC">'+lab('Načítá se')+calc('loading',True)+'<div style="height:8px;background:#F6F3EC"></div>'+lab('Chyba načtení')+calc('error',True)+'</div>',390,1000)
out['lc02calc-d']=doc('Kalkulačka, načítání a chyba – desktop',CD,'<div style="max-width:1280px;margin:0 auto;background:#F6F3EC">'+lab('Načítá se')+calc('loading',False)+'<div style="height:8px;background:#F6F3EC"></div>'+lab('Chyba načtení')+calc('error',False)+'</div>',1280,800)

# ---------- 4 PDF print pages (A4, 794 x 1123)
PCSS="body{margin:0;background:#fff;color:#111;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:13px;line-height:1.45}*{box-sizing:border-box}h1,h2,h3,p{margin:0}.tag{font:500 10px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#555}.num{font-variant-numeric:tabular-nums}.pill{padding:2px 8px;border-radius:99px;font-size:11px;font-weight:500;white-space:nowrap}.yes{background:#D6E8DE;color:#154A33}.no{background:#F4D9D1;color:#7A2410}.ver{background:#F3E6BE;color:#6B4E00}table{border-collapse:collapse;width:100%}th{font:500 10px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#555;text-align:left;padding:6px 8px;border-bottom:1.5px solid #111}td{padding:9px 8px;border-bottom:1px solid #ccc;font-size:13px}"
def sheet(inner,n):
    return ('<div style="width:794px;height:1123px;padding:56px 56px 40px;display:flex;flex-direction:column;gap:18px;background:#fff;position:relative;overflow:hidden">'
     '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #111;padding-bottom:12px">'+logo(104,27)+'<span class="tag">Vaše srovnání · 3 000 Kč měsíčně · 10 let · 6 % ročně</span></div>'
     +inner+
     f'<div style="margin-top:auto;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;gap:24px;font-size:10px;color:#555"><span>Obecná informace, ne investiční ani daňové poradenství. Čísla ověřena k 10. 2026, odhad bez českých daní a inflace. Správce: [SPRÁVCE]</span><span class="num" style="white-space:nowrap">{n} / 6</span></div></div>')
brokers=['DEGIRO','Fio','IBKR','Trading 212','XTB']
def cell(i,j):
    if i==0 and j in (0,3,4): return '<span class="pill yes">Ano</span>'
    return '<span class="pill ver">[ověřit]</span>'
rows=''.join(f'<tr><td><b>{f}</b><br><span style="font-size:11px;color:#555">{t}</span></td><td class="num">{p}</td>'+''.join(f'<td>{cell(i,j)}</td>' for j in range(5))+'</tr>' for i,(f,t,p) in enumerate([('S&amp;P 500 · CSPX','Acc','0,07 %'),('S&amp;P 500 · VUAA','Acc','0,07 %'),('S&amp;P 500 · VUSA','Dist','0,07 %'),('Nasdaq 100 · CSNDX','Acc','0,33 %'),('Nasdaq 100 · EQQQ','Dist','0,30 %')]))
p1=('<div style="display:flex;flex-direction:column;gap:6px"><span class="tag">Strana 1 · Srovnání</span><h1 style="font-size:30px;line-height:1.08;letter-spacing:-.02em">Americké indexy z Česka: u koho je koupíte a za kolik?</h1></div>'
 '<p style="font-size:14px;color:#333">Stejné firmy z S&amp;P 500 a Nasdaq 100, jen v evropské verzi. Níže je poplatek fondu a to, u kterého brokera ho koupíte.</p>'
 f'<table><thead><tr><th>Fond</th><th>Poplatek</th>{"".join(f"<th>{b}</th>" for b in brokers)}</tr></thead><tbody>{rows}</tbody></table>'
 '<p style="font-size:11px;color:#555">[ověřit] = zatím neověřeno, doplníme zdroj. „Ano“ jen s uvedeným zdrojem a datem.</p>'
 '<div style="border:1.5px solid #111;border-radius:6px;padding:14px 16px;display:flex;flex-direction:column;gap:6px"><span class="tag">Při vašem nastavení</span><p style="font-size:15px"><b>Ilustrativní hodnota po 10 letech: X XXX Kč, z toho poplatky X XXX Kč.</b></p><p style="font-size:11px;color:#555">6 % ročně, příklad, ne slib. Odhad, bez českých daní a inflace.</p></div>')
p4=('<div style="display:flex;flex-direction:column;gap:6px"><span class="tag">Strana 4 · Daně</span><h1 style="font-size:30px;line-height:1.08;letter-spacing:-.02em">Co platí v Česku</h1></div>'
 '<p style="font-size:14px;color:#333">Jedna strana o tom, co se děje s výnosem. Text vychází jen z ověřeného zdroje (Finanční správa), který u každé věty uvedeme.</p>'
 +''.join(f'<div style="border-top:1px solid #ccc;padding:12px 0;display:grid;grid-template-columns:160px 1fr;gap:16px"><b>{a}</b><span style="color:#333">{b} <span class="pill ver">[ověřit zdroj]</span></span></div>' for a,b in [('Fond, který výnosy reinvestuje','Co to znamená pro daň v Česku.'),('Fond, který výnosy vyplácí','Jak se zdaňují vyplacené výnosy.'),('Časový test','Za jakých podmínek je prodej osvobozen.'),('Daň z dividend v zahraničí','Co stáhne zahraničí a co se dá započítat.')])+
 '<p style="font-size:11px;color:#555">Nejde o daňové poradenství. Před rozhodnutím se poraďte s poradcem.</p>')
out['pd01pdf1']=doc('PDF, strana 1',PCSS,sheet(p1,1),794,1123)
out['pd02pdf4']=doc('PDF, strana 4',PCSS,sheet(p4,4),794,1123)

# ---------- 5 favicon + share image
tab=lambda bg,fg,t:(f'<div style="background:{bg};color:{fg};border-radius:8px 8px 0 0;padding:8px 14px;display:flex;align-items:center;gap:8px;font-size:13px;width:220px">{fav(16)}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{t}</span></div>')
out['fv01favicon']=doc('Favicon',CM.replace('body{margin:0;background:#F6F3EC','body{margin:0;background:#F6F3EC'),
 '<div style="background:#F6F3EC;padding:28px;width:640px;display:flex;flex-direction:column;gap:24px">'
 '<div style="display:flex;flex-direction:column;gap:6px"><span class="tag">Favicon</span><p style="font-size:14px;color:#3A372E">Kompas ve čtverci, bez textu. SVG pro prohlížeče, PNG 180 px pro iPhone, 32 a 16 px pro záložky. Na tmavém i světlém pozadí čitelný.</p></div>'
 '<div style="display:flex;align-items:flex-end;gap:28px"><div style="display:flex;flex-direction:column;gap:8px;align-items:center">'+fav(96)+'<span class="tag">96</span></div><div style="display:flex;flex-direction:column;gap:8px;align-items:center">'+fav(48)+'<span class="tag">48</span></div><div style="display:flex;flex-direction:column;gap:8px;align-items:center">'+fav(32)+'<span class="tag">32</span></div><div style="display:flex;flex-direction:column;gap:8px;align-items:center">'+fav(16)+'<span class="tag">16</span></div></div>'
 '<div style="display:flex;flex-direction:column;gap:0"><div style="background:#DEE1E6;padding:8px 8px 0;display:flex;gap:4px;border-radius:8px 8px 0 0">'+tab('#fff','#111','ETF Kompas: americké indexy z Česka')+tab('#C9CDD3','#555','Jiná záložka')+'</div>'
 '<div style="background:#2B2D31;padding:8px 8px 0;display:flex;gap:4px">'+tab('#3C4043','#eee','ETF Kompas: americké indexy z Česka')+tab('#232427','#999','Jiná záložka')+'</div></div></div>',640,420)
out['sh01share']=doc('Sdílený náhled',"body{margin:0;background:#16150F;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#F6F3EC}*{box-sizing:border-box}h1,p{margin:0}.tag{font:500 14px/1 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#B9B3A2}",
 '<div style="width:1200px;height:630px;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between;background:#16150F;position:relative;overflow:hidden">'
 '<div style="display:flex;justify-content:space-between;align-items:center">'+logo(188,48,True)+'<span class="tag">Evropská ETF · česky</span></div>'
 '<div style="display:flex;flex-direction:column;gap:20px;max-width:1056px"><h1 style="font-size:64px;line-height:1.05;letter-spacing:-.03em;font-weight:700">Americké indexy z Česka: u koho je koupíte a za kolik?</h1>'
 '<p style="font-size:28px;line-height:1.35;color:#D9D4C5">Poplatky fondů a brokerů v korunách. Na jedné stránce.</p></div>'
 '<div style="position:absolute;right:72px;bottom:64px;background:#F6F3EC;border-radius:28px;padding:14px">'+fav(112)+'</div></div>',1200,630)
for k,v in out.items(): open(D+k+'.html','w').write(v)
print('wrote',len(out))
