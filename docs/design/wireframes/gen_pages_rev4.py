# rev4e: menu, cookies, privacy, 404, unsubscribe artboards + hamburger/footer patches
import re,os
D='artboards-v4/'
land_m=open(D+'ad67ec35.html').read(); land_d=open(D+'a8f21cef.html').read()
def css(s): return re.findall(r'<style>(.*?)</style>',s,re.S)[1]
CM,CD=css(land_m),css(land_d)
CM=re.sub(r'@keyframes.*?\n|\.hc\{.*?\n|\.a[123]\{.*?\n|@media \(prefers-reduced-motion.*?\n','',CM)
CD=re.sub(r'@keyframes.*?\n|\.hc\{.*?\n|\.a[123]\{.*?\n|@media \(prefers-reduced-motion.*?\n','',CD)
EXTRA='.ver{background:#F3E6BE;color:#6B4E00}.sw{width:48px;height:28px;border-radius:99px;background:#6B665A;position:relative;flex:none}.sw::after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff}.sw.on{background:#2F6B49}.sw.on::after{left:23px}.sw.lock{background:#2F6B49}.sw.lock::after{left:23px}'
def logo(w,h,dark=False):
    c='#F6F1E7' if dark else '#17140F'
    return f'<svg sc-camel-view-box="0 0 188.3 48.0" width="{w}" height="{h}" style="display:block;flex:none" role="img" aria-label="ETF Kompas"><title>ETF Kompas</title><path d="M0 0" fill="{c}"></path></svg>'
def doc(title,css_,body,w,h):
    return f'''<!DOCTYPE html>
<html lang="cs"><head>
<meta charset="utf-8">
<title>{title}</title>
</head>
<body>
<x-dc>
<helmet>
<style></style>
<style>
{css_}{EXTRA}
</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script="" data-props="{{&quot;$preview&quot;:{{&quot;width&quot;:{w},&quot;height&quot;:{h}}}}}">
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body></html>
'''
BURGER='<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M2 5h18M2 11h18M2 17h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
CLOSE='<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M4 4l14 14M18 4L4 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
def burger_btn(open_=False):
    return (f'<button class="chip" style="min-height:44px;min-width:44px;padding:0 12px;display:flex;align-items:center;gap:8px;font-size:14px" aria-label="{"Zavřít menu" if open_ else "Otevřít menu"}" aria-expanded="{"true" if open_ else "false"}">{CLOSE if open_ else BURGER}<span>{"Zavřít" if open_ else "Menu"}</span></button>')
HDR_M='<header style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #D4CEBE">'+logo(102,26)+'{b}</header>'
NAVLINKS=[('Jak počítáme','#m'),('Odkud máme čísla','#z'),('Časté dotazy','#f')]
FOOTL=[('Jak počítáme','#m'),('Zásady zpracování','#p'),('Cookies','#c'),('Kontakt','#k')]
def foot_m():
    ls=''.join(f'<a href="{h}" style="color:#D9D4C5">{t}</a>' for t,h in FOOTL)
    return ('<footer style="background:#16150F;color:#D9D4C5;padding:24px 16px 32px;font-size:12px;display:flex;flex-direction:column;gap:12px">'+logo(110,28,True)+
     '<p>Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství.</p><p>Správce: [SPRÁVCE – IČO, adresa]</p>'
     f'<div style="display:flex;flex-wrap:wrap;gap:10px 20px">{ls}</div></footer>')
def foot_d():
    ls=''.join(f'<a href="{h}" style="color:#D9D4C5">{t}</a>' for t,h in FOOTL)
    return ('<footer style="background:#16150F;color:#D9D4C5;padding:40px 56px;display:flex;justify-content:space-between;gap:48px;font-size:13px"><div style="display:flex;flex-direction:column;gap:20px">'+logo(110,28,True)+
     '<p style="max-width:44em">Investování nese riziko ztráty. Minulé výnosy nezaručují budoucí. Obsah je obecná informace, ne investiční ani daňové poradenství. Správce: [SPRÁVCE – IČO, adresa].</p></div>'
     f'<div style="display:flex;gap:24px;flex-wrap:wrap;align-content:flex-start;justify-content:flex-end;max-width:420px">{ls}</div></footer>')
def hdr_d(cta=True):
    n=''.join(f'<a href="{h}">{t}</a>' for t,h in NAVLINKS)
    return ('<header style="display:flex;align-items:center;justify-content:space-between;padding:20px 56px;border-bottom:1px solid #D4CEBE">'+logo(126,32)+
     f'<nav style="display:flex;align-items:center;gap:32px;font-size:15px">{n}<a class="btn sm" href="#gate" style="color:#F6F3EC">Poslat mi srovnání</a></nav></header>')
def bars(n,hs=None):
    ws=['92%','100%','84%','96%','70%','88%']
    return ''.join(f'<i style="display:block;height:10px;border-radius:3px;background:#D9D3C3;width:{ws[i%6]}"></i>' for i in range(n))
def ghost_m():
    return ('<div style="padding:20px 16px;display:flex;flex-direction:column;gap:14px;opacity:.55"><i style="display:block;height:30px;width:90%;background:#16150F;border-radius:3px"></i><i style="display:block;height:30px;width:60%;background:#16150F;border-radius:3px"></i>'+bars(4)+
            '<div style="height:150px;border:1px solid #D4CEBE;border-radius:10px;background:#FFFDF8"></div>'+bars(3)+'</div>')

# ---- patches to existing artboards: hamburger + footer links
def patch(f,subs):
    s=open(D+f).read()
    for a,b in subs:
        if b in s and a not in s: continue
        assert s.count(a)==1,(f,a[:70]); s=s.replace(a,b)
    open(D+f,'w').write(s)
OLDBTN='<button class="chip" style="min-height:44px;font-size:14px;padding:0 14px" aria-label="Menu">Menu</button>'
patch('ad67ec35.html',[(OLDBTN,burger_btn()),
 ('<div style="display:flex;gap:20px"><a href="#p" style="color:#D9D4C5">Zásady zpracování</a><a href="#c" style="color:#D9D4C5">Cookies</a></div>',
  '<div style="display:flex;flex-wrap:wrap;gap:10px 20px">'+''.join(f'<a href="{h}" style="color:#D9D4C5">{t}</a>' for t,h in FOOTL)+'</div>')])
patch('a8f21cef.html',[('<div style="display:flex;gap:24px"><a href="#p" style="color:#D9D4C5">Zásady zpracování</a><a href="#c" style="color:#D9D4C5">Cookies</a></div>',
  '<div style="display:flex;gap:24px;flex-wrap:wrap;align-content:flex-start;justify-content:flex-end;max-width:420px">'+''.join(f'<a href="{h}" style="color:#D9D4C5">{t}</a>' for t,h in FOOTL)+'</div>')])
patch('4555091e.html',[('<header style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #D4CEBE">\n<svg','<header style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #D4CEBE">\n<svg'),
 ('<div style="display:flex;gap:20px"><a href="#p" style="color:#D9D4C5">Zásady zpracování</a><a href="#c" style="color:#D9D4C5">Cookies</a></div>',
  '<div style="display:flex;flex-wrap:wrap;gap:10px 20px">'+''.join(f'<a href="{h}" style="color:#D9D4C5">{t}</a>' for t,h in FOOTL)+'</div>')])
# success mobile header: add hamburger after the logo svg
s=open(D+'4555091e.html').read()
if 'aria-expanded' not in s:
    i=s.find('<header'); j=s.find('</svg>',i)+6
    s=s[:j]+burger_btn()+s[j:]; open(D+'4555091e.html','w').write(s)

out={}
# ---- 1 mobile menu, open
links=''.join(f'<a href="{h}" style="display:flex;align-items:center;justify-content:space-between;min-height:60px;border-bottom:1px solid #D4CEBE;font-size:20px;font-weight:600;text-decoration:none">{t}<span aria-hidden="true">→</span></a>' for t,h in NAVLINKS)
sec=''.join(f'<a href="{h}" style="font-size:15px;color:#3A372E">{t}</a>' for t,h in [('Zásady zpracování','#p'),('Cookies','#c'),('Kontakt','#k')])
out['mm01menu']=doc('Menu – mobil',CM,'<div style="background:#F6F3EC;min-height:760px;display:flex;flex-direction:column">'+HDR_M.format(b=burger_btn(True))+
 f'<nav aria-label="Hlavní menu" style="padding:8px 16px 0;display:flex;flex-direction:column">{links}</nav>'
 f'<div style="padding:20px 16px;display:flex;flex-direction:column;gap:14px">{sec}</div>'
 '<div style="margin-top:auto;padding:16px;border-top:1.5px solid #16150F"><a class="btn" href="#gate">Poslat mi srovnání</a></div></div>',390,760)

# ---- 2 cookie bar mobile / desktop
COOK_TXT='Nezbytné cookies používáme, aby web fungoval. Měření návštěvnosti a reklamní cookies zapneme jen s vaším souhlasem.'
bar_m=('<div role="dialog" aria-label="Cookies" style="position:absolute;left:0;right:0;bottom:0;background:#16150F;color:#F6F3EC;padding:20px 16px 24px;display:flex;flex-direction:column;gap:12px;border-radius:14px 14px 0 0">'
 '<span class="tag" style="color:#B9B3A2">Cookies</span>'
 f'<p style="font-size:14px;line-height:1.45;color:#D9D4C5">{COOK_TXT} <a href="#p" style="color:#F6F3EC">Zásady zpracování</a></p>'
 '<div style="display:flex;flex-direction:column;gap:8px">'
 '<a class="btn" href="#a" style="background:#F6F3EC;color:#16150F;min-height:52px">Přijmout vše</a>'
 '<a class="btn" href="#r" style="background:transparent;color:#F6F3EC;border:1.5px solid #F6F3EC;min-height:52px">Odmítnout vše</a>'
 '<a href="#s" style="text-align:center;color:#F6F3EC;font-size:14px;padding:10px 0">Nastavit</a></div></div>')
out['ck01bar-m']=doc('Cookies lišta – mobil',CM,'<div style="position:relative;height:780px;overflow:hidden;background:#F6F3EC">'+HDR_M.format(b=burger_btn())+ghost_m()+'<div style="position:absolute;inset:0;background:rgba(22,21,15,.45)"></div>'+bar_m+'</div>',390,780)
bar_d=('<div role="dialog" aria-label="Cookies" style="position:absolute;left:24px;right:24px;bottom:24px;background:#16150F;color:#F6F3EC;padding:24px 28px;display:flex;align-items:center;gap:40px;border-radius:12px">'
 f'<div style="flex:1;display:flex;flex-direction:column;gap:8px"><span class="tag" style="color:#B9B3A2">Cookies</span><p style="font-size:15px;line-height:1.45;color:#D9D4C5;max-width:44em">{COOK_TXT} <a href="#p" style="color:#F6F3EC">Zásady zpracování</a></p></div>'
 '<div style="display:flex;gap:12px;align-items:center;flex:none"><a href="#s" style="color:#F6F3EC;font-size:15px;padding:0 8px">Nastavit</a>'
 '<a class="btn sm" href="#r" style="background:transparent;color:#F6F3EC;border:1.5px solid #F6F3EC;min-height:52px">Odmítnout vše</a><a class="btn sm" href="#a" style="background:#F6F3EC;color:#16150F;min-height:52px">Přijmout vše</a></div></div>')
ghost_d=('<div style="padding:56px;display:grid;grid-template-columns:1fr 1.1fr;gap:64px;opacity:.55"><div style="display:flex;flex-direction:column;gap:16px"><i style="display:block;height:44px;width:90%;background:#16150F;border-radius:4px"></i><i style="display:block;height:44px;width:70%;background:#16150F;border-radius:4px"></i>'+bars(4)+'</div><div style="height:300px;border:1px solid #D4CEBE;border-radius:10px;background:#FFFDF8"></div></div>')
out['ck02bar-d']=doc('Cookies lišta – desktop',CD,'<div style="position:relative;height:560px;overflow:hidden;background:#F6F3EC;max-width:1280px;margin:0 auto">'+hdr_d()+ghost_d+'<div style="position:absolute;inset:0;background:rgba(22,21,15,.45)"></div>'+bar_d+'</div>',1280,560)

# ---- 3 cookie settings
def rows(compact):
    items=[('Nezbytné','Bez nich web nefunguje (například uložení vaší volby). Vypnout je nejde.','lock'),
           ('Měření návštěvnosti','Anonymní statistiky, které nám řeknou, co na webu nefunguje.',''),
           ('Reklama a remarketing','Pomáhá změřit reklamy. Zapneme až po vašem souhlasu.','')]
    return ''.join(f'<div style="display:flex;gap:16px;align-items:flex-start;justify-content:space-between;padding:16px 0;border-top:1px solid #D4CEBE"><div style="display:flex;flex-direction:column;gap:4px"><strong style="font-size:16px">{t}</strong><span style="font-size:14px;color:#3A372E">{d}</span>{"<span class=tag style=margin-top:4px>vždy zapnuto</span>" if c=="lock" else ""}</div><span class="sw {c}" role="switch" aria-checked="{"true" if c else "false"}" aria-label="{t}"></span></div>' for t,d,c in items)
card_m=('<div role="dialog" aria-label="Nastavení cookies" style="position:absolute;left:0;right:0;bottom:0;top:64px;background:#FFFDF8;border-radius:14px 14px 0 0;padding:20px 16px 24px;display:flex;flex-direction:column;gap:6px;overflow:hidden">'
 '<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:24px;line-height:1.1;letter-spacing:-.015em">Nastavení cookies</h2>'+CLOSE.replace('<svg','<svg aria-label="Zavřít"')+'</div>'
 '<p style="font-size:14px;color:#3A372E">Vyberte, co smíme používat. Volbu kdykoli změníte přes odkaz Cookies v patičce.</p>'+rows(True)+
 '<div style="display:flex;flex-direction:column;gap:8px;margin-top:8px"><a class="btn" href="#sv" style="min-height:52px">Uložit výběr</a><a class="btn" href="#a" style="background:transparent;color:#16150F;border:1.5px solid #16150F;min-height:52px">Přijmout vše</a></div></div>')
out['ck03set-m']=doc('Nastavení cookies – mobil',CM,'<div style="position:relative;height:700px;overflow:hidden;background:#F6F3EC">'+HDR_M.format(b=burger_btn())+ghost_m()+'<div style="position:absolute;inset:0;background:rgba(22,21,15,.55)"></div>'+card_m+'</div>',390,700)
card_d=('<div role="dialog" aria-label="Nastavení cookies" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:640px;background:#FFFDF8;border-radius:14px;padding:32px 36px;display:flex;flex-direction:column;gap:6px;box-shadow:0 20px 60px rgba(0,0,0,.35)">'
 '<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:28px;letter-spacing:-.015em">Nastavení cookies</h2>'+CLOSE+'</div>'
 '<p style="font-size:15px;color:#3A372E">Vyberte, co smíme používat. Volbu kdykoli změníte přes odkaz Cookies v patičce.</p>'+rows(False)+
 '<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:12px"><a class="btn sm" href="#a" style="background:transparent;color:#16150F;border:1.5px solid #16150F;min-height:52px">Přijmout vše</a><a class="btn sm" href="#sv" style="min-height:52px">Uložit výběr</a></div></div>')
out['ck04set-d']=doc('Nastavení cookies – desktop',CD,'<div style="position:relative;height:800px;overflow:hidden;background:#F6F3EC;max-width:1280px;margin:0 auto">'+hdr_d()+ghost_d+'<div style="position:absolute;inset:0;background:rgba(22,21,15,.55)"></div>'+card_d+'</div>',1280,800)

# ---- 4 privacy policy
def P(t): return f'<p style="font-size:16px;color:#3A372E;max-width:44em">{t}</p>'
V='<span class="pill ver">[doplnit]</span>'
SEC=[('Kdo údaje zpracovává',f'Správcem je [SPRÁVCE – IČO, adresa]. Napsat nám můžete na {V}.'),
 ('Jaké údaje zpracováváme','Váš e-mail, nastavení kalkulačky (měsíční částka a počet let) a technické údaje o návštěvě, ty jen když povolíte cookies.'),
 ('Proč a na jakém základě',f'Zaslání srovnání, o které jste požádali (e-mail, nastavení). Nepovinné tipy k investování jen s vaším souhlasem. Měření a reklama jen s vaším souhlasem. Právní základ u každého účelu: {V}.'),
 ('Jak dlouho',f'E-mail uchováváme do odhlášení, nejdéle {V} měsíců. Souhlas můžete kdykoli odvolat, odkaz je v každém e-mailu.'),
 ('Komu údaje předáváme',f'Zpracovatelům, které potřebujeme: služba pro rozesílání e-mailů {V}, hosting {V}, měření návštěvnosti {V}. Každý z nich má smlouvu o zpracování.'),
 ('Vaše práva','Můžete požádat o přístup k údajům, opravu, výmaz, omezení zpracování a vznést námitku. Máte právo podat stížnost u Úřadu pro ochranu osobních údajů.'),
 ('Cookies','Přehled, co a proč používáme, a nastavení najdete přes odkaz Cookies v patičce.')]
def body_sections(h2,gap):
    return ''.join(f'<section id="p{i}" style="display:flex;flex-direction:column;gap:{gap}px"><h2 style="font-size:{h2}px;line-height:1.15;letter-spacing:-.015em">{i+1} · {t}</h2>{P(d)}</section>' for i,(t,d) in enumerate(SEC))
NOTEBOX='<div style="background:#F3E6BE;color:#6B4E00;border-radius:8px;padding:12px 14px;font-size:14px"><b>Zástupný text.</b> Obsah zásad nechte před spuštěním zkontrolovat právníkem. Údaje v hranatých závorkách doplníme.</div>'
toc=''.join(f'<a href="#p{i}" style="padding:8px 0;border-bottom:1px solid #D4CEBE;text-decoration:none">{i+1} · {t}</a>' for i,(t,_) in enumerate(SEC))
out['pp01priv-d']=doc('Zásady zpracování – desktop',CD,'<div style="max-width:1280px;margin:0 auto;background:#F6F3EC">'+hdr_d()+
 '<div style="display:grid;grid-template-columns:260px minmax(0,1fr);gap:56px;padding:56px 56px 72px;align-items:start">'
 f'<nav aria-label="Obsah" style="position:sticky;top:24px;display:flex;flex-direction:column;font-size:15px"><span class="tag" style="margin-bottom:8px">Na stránce</span>{toc}</nav>'
 '<div style="display:flex;flex-direction:column;gap:28px"><div style="display:flex;flex-direction:column;gap:12px"><span class="tag">Právní</span><h1 style="font-size:44px;line-height:1.05;letter-spacing:-.025em;font-weight:700">Zásady zpracování osobních údajů</h1>'
 f'<p style="font-size:14px;color:#6B665A">Platí od {V}</p></div>{body_sections(26,10)}</div></div>'+foot_d()+'</div>',1280,1500)
out['pp02priv-m']=doc('Zásady zpracování – mobil',CM,'<div style="background:#F6F3EC">'+HDR_M.format(b=burger_btn())+
 '<div style="padding:24px 16px 40px;display:flex;flex-direction:column;gap:24px"><div style="display:flex;flex-direction:column;gap:10px"><span class="tag">Právní</span><h1 style="font-size:30px;line-height:1.06;letter-spacing:-.025em;font-weight:700">Zásady zpracování osobních údajů</h1>'
 f'<p style="font-size:13px;color:#6B665A">Platí od {V}</p></div>'
 '<details open style="border:1px solid #D4CEBE;border-radius:10px;background:#FFFDF8;padding:12px 14px"><summary style="font-weight:600;font-size:15px">Obsah</summary><div style="display:flex;flex-direction:column;margin-top:8px;font-size:15px">'+toc+'</div></details>'
 +body_sections(20,8)+'</div>'+foot_m()+'</div>',390,2300)

# ---- 5 404 and unsubscribed
def card_page(kind,h1,lead,btn,sec):
    return ('<div style="background:#F6F3EC;min-height:760px;display:flex;flex-direction:column">'+HDR_M.format(b=burger_btn())+
     '<main style="padding:48px 16px 56px;display:flex;flex-direction:column;gap:16px;flex:1">'
     f'<span class="tag">{kind}</span><h1 style="font-size:34px;line-height:1.06;letter-spacing:-.025em;font-weight:700">{h1}</h1><p style="font-size:16px;color:#3A372E">{lead}</p>'
     f'<div style="display:flex;flex-direction:column;gap:12px;margin-top:8px"><a class="btn" href="#">{btn}</a>{sec}</div></main>'+foot_m()+'</div>')
out['er01404-m']=doc('Stránka nenalezena – mobil',CM,card_page('404','Tuhle stránku jsme nenašli','Odkaz je možná starý nebo v něm je překlep. Cenu fondů a kalkulačku najdete na úvodní stránce.','Zpět na úvod','<a href="#m" style="text-align:center;font-size:15px;padding:10px 0">Jak počítáme</a>'),390,760)
out['er02unsub-m']=doc('Odhlášeno – mobil',CM,card_page('Odhlášení','Odhlášeno','Srovnání vám už posílat nebudeme. Stalo se to omylem? Přihlásit se můžete znovu.','Přihlásit zpět',f'<p style="font-size:13px;color:#6B665A">Váš e-mail smažeme do {V} dnů.</p>'),390,760)
for k,v in out.items(): open(D+k+'.html','w').write(v)
print('wrote',len(out))
