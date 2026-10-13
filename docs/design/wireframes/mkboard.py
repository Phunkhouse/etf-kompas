import sys,html,json,re
import os; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import bd
H={'a8f21cef':2852,'ad67ec35':3701,'642661e9':777,'4555091e':1050,'mm01menu':760,'ck01bar-m':780,'ck03set-m':700,'er01404-m':760,'er02unsub-m':760,'ck02bar-d':560,'ck04set-d':800,'pp01priv-d':1257,'pp02priv-m':1718,'fe01form-m':946,'fe02form-d':504,'oi01mail':600,'oi02ok-m':760,'oi03old-m':760,'lc01calc-m':1048,'lc02calc-d':643,'pd01pdf1':1123,'pd02pdf4':1123,'fv01favicon':360,'sh01share':630,'mo01motion':2522,'92ef8ee0':2679,'24e61a2e':3475,'8e84da19':675,'6bf92b0b':720,'c2093dbc':675,'4b5adee3':720,'734d3e9c':667,'vb01hero-d':800,'vb02hero-m':820}
# id, label, w, x, y
Y0=1000
FR=[('a8f21cef','Landing page · verze a (?v=a) · desktop',1280,0,Y0,'landing'),('ad67ec35','Landing page · verze a (?v=a) · mobil',390,1360,Y0,'landing'),
    ('642661e9','Po odeslání · desktop',1280,1910,Y0,'success'),('4555091e','Po odeslání · mobil',390,3270,Y0,'success'),
    ('92ef8ee0','Srovnání · desktop',1280,3820,Y0,'compare'),('24e61a2e','Srovnání · mobil',390,5180,Y0,'compare'),
    ('8e84da19','Reklama A · 4:5 feed',540,5730,Y0,'ads'),('6bf92b0b','Reklama A · 9:16 Stories',405,6330,Y0,'ads'),
    ('c2093dbc','Reklama B · 4:5 feed',540,5730,Y0+860,'ads'),('4b5adee3','Reklama B · 9:16 Stories',405,6330,Y0+860,'ads'),
    ('mm01menu','Menu otevřené · mobil',390,7500,Y0,'extra'),('ck01bar-m','Cookies, první návštěva · mobil',390,7970,Y0,'extra'),
    ('ck03set-m','Nastavení cookies · mobil',390,8440,Y0,'extra'),('er01404-m','Stránka nenalezena · mobil',390,8910,Y0,'extra'),('er02unsub-m','Odhlášeno z odběru · mobil',390,9380,Y0,'extra'),
    ('ck02bar-d','Cookies, první návštěva · desktop',1280,7500,Y0+900,'extra'),('ck04set-d','Nastavení cookies · desktop',1280,8860,Y0+900,'extra'),
    ('pp01priv-d','Zásady zpracování · desktop',1280,7500,Y0+1850,'extra'),('pp02priv-m','Zásady zpracování · mobil',390,8860,Y0+1850,'extra'),
    ('fe01form-m','Formulář, chyby · mobil',390,7500,Y0+3750,'extra'),('lc01calc-m','Kalkulačka, načítání a chyba · mobil',390,7970,Y0+3750,'extra'),
    ('oi01mail','E-mail, potvrzení odběru tipů',600,8440,Y0+3750,'extra'),('oi02ok-m','Odběr potvrzen · mobil',390,9110,Y0+3750,'extra'),('oi03old-m','Odkaz už nefunguje · mobil',390,9580,Y0+3750,'extra'),
    ('fe02form-d','Formulář, chyby · desktop',1280,7500,Y0+5000,'extra'),('lc02calc-d','Kalkulačka, načítání a chyba · desktop',1280,8860,Y0+5000,'extra'),
    ('pd01pdf1','PDF · strana 1 (A4)',794,7500,Y0+5850,'extra'),('pd02pdf4','PDF · strana 4 (A4)',794,8374,Y0+5850,'extra'),('fv01favicon','Favicon',640,9248,Y0+5850,'extra'),
    ('sh01share','Sdílený náhled · 1200 × 630',1200,7500,Y0+7150,'extra'),
    ('vb01hero-d','Landing page · verze b (?v=b) · desktop, jen hero',1280,0,Y0+3800,'landing'),('vb02hero-m','Landing page · verze b (?v=b) · mobil, jen hero',390,1360,Y0+3800,'landing'),
    ('mo01motion','Pohyb · živé ukázky (HTML)',1280,7500,Y0+7990,'extra')]
SECT=[('landing','Landing page',0,1750),('success','Po odeslání',1910,1750),('compare','Srovnání',3820,1750),('ads','Reklamy',5730,1455),('extra','Menu a doplňkové stránky',7500,2640)]
def frame(fid,label,w,x,y):
    h=H[fid]
    src=html.escape(bd.board_doc(fid),quote=True)
    return (f'<div class="fr" style="left:{x}px;top:{y}px;width:{w}px"><div class="cap"><b>{label}</b><span>{w} × {h}</span></div>'
            f'<iframe width="{w}" height="{h}" scrolling="no" tabindex="-1" srcdoc="{src}"></iframe></div>')
def li(items): return ''.join(f'<li>{i}</li>' for i in items)
NOTES=f'''
<div class="note n1" style="left:0;top:0;width:860px"><span class="k">ROZHODNUTÍ · rev. 4</span><h2>Co už platí</h2><ol>{li([
 '<b>Hák:</b> americké indexy, evropské ETF. Americké VOO a QQQ u většiny brokerů z Česka nekoupíte, proto srovnáváme evropské dvojníky (S&amp;P 500: CSPX, VUAA, VUSA · Nasdaq 100: CNDX, EQQQ).',
 '<b>Nadpis:</b> „Americké indexy z Česka: u koho je koupíte a za kolik?“ Otázka není <i>jestli</i>, ale <i>u koho</i> a <i>za kolik</i>.',
 '<b>Hero tabulka:</b> bez sloupce „Koupíte z ČR?“ (všechny řádky jsou pro ČR). Sloupec Typ (Acc / Dist). Dostupnost jedním řádkem pod tabulkou.',
 '<b>Kalkulačka:</b> „Kolik vás to bude stát?“ Hlavní číslo = cena fondu, který koupíte. 6 % ročně jako příklad, bez českých daní a inflace.',
 '<b>Zelený box v kalkulačce:</b> „Při vašem nastavení: správným brokerem si u stejného fondu ponecháte až X XXX Kč“ + „Odhad, bez českých daní a inflace“ + tlačítko „Ukázat, u kterého brokera to koupím“ (vede na formulář). Pod číslem nákladů je malá ilustrativní hodnota po 10 letech (po poplatcích, 6 %, příklad, ne slib). Sedí s rozhodnutími 0008 a 0010.',
 '<b>Srovnání:</b> tabulka fondů + „U kterého brokera?“ s výběrem fondu, poplatky brokera a Za 10 let celkem. Čísla podle nastavení z kalkulačky, na webu i v e-mailu.',
 '<b>Nikdy „nejlevnější“</b> bez ověřených cen všech brokerů. Zvýraznění neznamená nejlevnější.',
 '<b>Daňové texty</b> (3letý časový test, Acc fondy) jen z ověřeného zdroje, později.'])}</ol></div>
<div class="note n2" style="left:920px;top:0;width:1000px"><span class="k">VERZE</span><h2>Co se změnilo</h2>
<div class="ver"><b>rev. 1</b><span>Původní wireframy: americký vs. evropský fond, kalkulačka s rozdílem v Kč.</span></div>
<div class="ver"><b>rev. 2</b><span>Zvýraznění = koupíte z ČR, ne nejlevnější. Skutečné poplatky, „Ne“ jen se zdrojem, [ověřit] jinak. Kalkulačka počítá cenu koupitelného ETF.</span></div>
<div class="ver"><b>rev. 3</b><span>Evropské dvojníky místo VOO a QQQ. Nový nadpis, hero tabulka s Typem, srovnání fondů × brokerů, pozitivní zpráva v kalkulačce, texty reklam. Animace hero tabulky je mimo desku, překreslí se podle nové tabulky.</span></div>
<div class="ver"><b>rev. 4</b><span>Zelený box „ponecháte si až X XXX Kč“ s tlačítkem v kalkulačce (web i mobil). Štítek „návrh“ je pryč ze stránky, pravidlo zobrazení je v poznámce. Kalkulačka počítá CSPX v dolarech. Nová sekce „Menu a doplňkové stránky“: otevřené mobilní menu s hamburgerem, cookies (lišta, nastavení), zásady zpracování, 404, odhlášení. Patička má 4 odkazy. Druhá řada: chyby formuláře, potvrzení tipů, kalkulačka při načítání a chybě, PDF, favicon, sdílený náhled.</span></div>
<div class="ver"><b>rev. 5</b><span>A/B test hlavní stránky: varianta a a b mají stejné rozložení (hero s tabulkou) a liší se jen nadpisem. a = „Americké indexy z Česka: u koho je koupíte a za kolik?“, b = „U stejného fondu můžete zbytečně zaplatit až X XXX Kč. Kde?“ (dole pod landingem). Hero s kalkulačkou jako první (dřívější G5) je pryč. Reklamy A a B vedou na obě varianty.</span></div>
<div class="ver now"><b>rev. 6</b><span>Podle kontroly hotového webu: sloupec „Poplatek*“ s poznámkou, řádek tabulky se jmenuje podle indexu (S&amp;P 500, Nasdaq 100) a pod ním je správce, značka a popis, odkaz „nebo rovnou srovnání brokerů“ je pryč. Místo zástupných údajů ([ověřit], X XXX Kč) jsou ověřená data a výsledek skutečné kalkulačky (3 000 Kč měsíčně, 10 let, 6 %, CSPX). Zůstává [ověřit] jen tam, kde data opravdu chybí (IBKR, „Česky“).</span></div>
</div>
<div class="note n3" style="left:1980px;top:0;width:700px"><span class="k">OTEVŘENÉ</span><h2>Co chybí ověřit</h2><ul>{li([
 'IBKR: nic není ověřeno (dostupnost fondů, poplatky, ceny). Ostatní brokeři mají ověřené poplatky a ceny jen pro CSPX; VUAA má cenu jen u DEGIRO, CNDX také.',
 'Sloupec „Česky“ (podpora v češtině) u všech brokerů: v datech zatím není.',
 'Fio: QQQ je ve výpisu ETF, VOO nenalezeno, přístup k nákupu neověřen.',
 'Ceny brokerů se hlídají: poplatky brokerů starší než 45 dní se neukážou.',
 'Obsah okénka Acc / Dist a texty o daních jen z ověřeného zdroje.'])}</ul></div>
<div class="note n6" style="left:4080px;top:0;width:900px"><span class="k">AUDIT · NOTE K NÁVRHU, NENÍ TEXT STRÁNKY</span><h2>Co na webu chybělo</h2><ul>{li([
 '<b>Menu na mobilu:</b> tlačítko „Menu“ bez ikony a bez otevřeného stavu. Teď hamburger s textem (44 px) na landingu i po odeslání a nová obrazovka s otevřeným menu a odkazy.',
 '<b>Zásady zpracování:</b> odkazy vedly nikam. Teď stránka se sedmi oddíly (správce, údaje, účel a základ, doba, příjemci, práva, cookies). Text je zástupný, nechte ho zkontrolovat právníkem.',
 '<b>Cookies:</b> chyběla lišta i nastavení. Teď lišta s tlačítky Přijmout i Odmítnout stejně výrazně, odkaz Nastavit, a nastavení se třemi kategoriemi (měření a reklama vypnuté, dokud nesouhlasíte). Volbu jde změnit přes patičku.',
 '<b>Patička:</b> čtyři odkazy místo dvou (Jak počítáme, Zásady zpracování, Cookies, Kontakt). Kontakt vede na oddíl správce v zásadách, vlastní stránka není potřeba.',
 '<b>Chybové a koncové stavy:</b> 404 a „Odhlášeno z odběru“ (odkaz z e-mailu musí někam vést).',
 '<b>Stavy a soubory (druhá řada níže):</b> chyby formuláře (špatný e-mail, odeslání se nepovedlo; souhlas je nepovinný, takže chyba souhlasu není), potvrzovací e-mail a stránka po potvrzení tipů, nefunkční odkaz, kalkulačka při načítání a při chybě (bez částky, nikdy odhad naslepo), PDF na A4 (strany 1 a 4) a favicon se sdíleným náhledem.',
 '<b>Pohyb:</b> živé ukázky všech animovaných míst na jedné desce (spodní řada), včetně pravidel a časů.',
 '<b>Text na sdílení (k ověření):</b> titulek „ETF Kompas: americké indexy z Česka, u koho je koupíte“, popis „Srovnání evropských ETF na S&amp;P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce.“ Zbývá jen skutečné PNG z těchto návrhů při stavbě.'])}</ul></div>
<div class="note n5" style="left:3320px;top:0;width:700px"><span class="k">POZNÁMKA K NÁVRHU · NENÍ TEXT STRÁNKY</span><h2>Kdy se zelený box zobrazí</h2><ul>{li([
 '<b>Zobrazit jen</b>, když jsou ověřené ceny alespoň u dvou brokerů, kteří nabízejí zvolený fond. Částka je rozdíl mezi nejlevnějším a nejdražším z nich.',
 '<b>Jinak box zmizí</b> včetně tlačítka. Stránka ukáže jen náklady, ilustrativní hodnotu a formulář. Žádné „až 0 Kč“ a žádné vymyšlené číslo.',
 '<b>Zůstává maximem:</b> „až X XXX Kč“, „při vašem nastavení“, „Odhad, bez českých daní a inflace“. Nikdy „nejlevnější“ bez ověřených cen všech brokerů.',
 '<b>Měna:</b> kalkulačka počítá u každého brokera jeho nejlevnější kotaci fondu (u CSPX eura u DEGIRO a Fia, dolary u Trading 212 a XTB), proto řádek „převod korun na cizí měnu“ (rev. 6).',
 'Do zveřejnění cen brokerů je box jen v návrhu. Wireframe ukazuje stav „zobrazeno“.'])}</ul></div>
<div class="note n4" style="left:2740px;top:0;width:520px"><span class="k">LEGENDA</span><h2>Jak číst desku</h2><div class="lg"><span class="pill ver">[ověřit]</span><span>zatím neověřeno, před spuštěním doplnit zdroj</span></div><div class="lg"><span class="x">X XXX Kč</span><span>zástupné číslo, počítá se z kalkulačky</span></div><div class="lg"><span class="pill yes">Ano</span><span>ověřeno k 10. 2026</span></div><p>Posouvejte tažením, zoom kolečkem s Ctrl nebo ikonami dole.</p></div>
'''
SECLBL='<div class="sec" style="left:7500px;top:'+str(Y0+3600)+'px;width:2640px">Stavy, PDF a sdílení</div><div class="sec" style="left:7500px;top:'+str(Y0+7880)+'px;width:2640px">Pohyb</div>'+''.join(f'<div class="sec" style="left:{x}px;top:{Y0-110}px;width:{w}px">{n}</div>' for _,n,x,w in SECT)
FRAMES=''.join(frame(f,l,w,x,y) for f,l,w,x,y,_ in FR)
page=f'''<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Wireframe Board</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap">
<style>
:root{{--bg:#E9E5DA;--dot:#C9C3B2;--ink:#16150F;--mute:#6B665A;--card:#FFFDF8;--line:#D9D3C3;--ui:#FFFDF8;--vb:#F3E6BE;--vi:#6B4E00;--win:#DCEEE3;--winink:#1F5B3A}}
@media(prefers-color-scheme:dark){{:root:not([data-theme=light]){{--bg:#1C1B16;--dot:#2E2C24;--ink:#F6F3EC;--mute:#A8A292;--card:#26251E;--line:#3A372E;--ui:#26251E;--vb:#4A3C12;--vi:#F3D98A;--win:#1F3A2B;--winink:#9AD4B2}}}}
*{{box-sizing:border-box}}html,body{{margin:0;height:100%;overflow:hidden;background:var(--bg);color:var(--ink);font:400 15px/1.5 'IBM Plex Sans',sans-serif}}
#vp{{position:fixed;inset:0;cursor:grab;background-image:radial-gradient(var(--dot) 1.2px,transparent 1.2px);background-size:24px 24px;touch-action:none}}
#vp.drag{{cursor:grabbing}}#cv{{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}}
.fr{{position:absolute}}.fr iframe{{display:block;border:0;background:#F6F3EC;box-shadow:0 1px 2px rgba(0,0,0,.15),0 12px 40px rgba(0,0,0,.14);pointer-events:none}}
.cap{{display:flex;gap:12px;align-items:baseline;margin-bottom:10px;font-size:15px}}.cap span{{font:500 12px 'IBM Plex Mono',monospace;color:var(--mute)}}
.sec{{position:absolute;font:700 56px/1.1 'IBM Plex Sans';letter-spacing:-.02em;border-bottom:3px solid var(--ink);padding-bottom:14px;white-space:nowrap}}
.note{{position:absolute;font-size:20px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:24px 26px;box-shadow:0 8px 28px rgba(0,0,0,.08)}}
.note .k{{font:500 14px 'IBM Plex Mono',monospace;letter-spacing:.08em;color:var(--mute)}}.note h2{{margin:6px 0 16px;font-size:34px;letter-spacing:-.01em}}
.note ol,.note ul{{margin:0;padding-left:22px}}.note li{{margin:0 0 10px;line-height:1.45}}.note p{{color:var(--mute);font-size:16px}}
.ver{{display:grid;grid-template-columns:76px 1fr;gap:10px;padding:10px 0;border-top:1px solid var(--line)}}.ver b{{font:500 16px 'IBM Plex Mono',monospace}}.ver.now b{{color:var(--winink)}}.ver span{{font-size:18px}}
.lg{{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line);font-size:18px}}
.pill{{display:inline-block;font:500 15px 'IBM Plex Sans';padding:2px 10px;border-radius:99px}}.pill.ver{{background:var(--vb);color:var(--vi)}}.pill.yes{{background:var(--win);color:var(--winink)}}.x{{font-weight:700}}
#bar{{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);display:flex;gap:4px;align-items:center;background:var(--ui);border:1px solid var(--line);border-radius:12px;padding:6px;box-shadow:0 8px 28px rgba(0,0,0,.18);max-width:calc(100vw - 24px);overflow-x:auto}}
#bar button{{font:500 13px 'IBM Plex Sans';color:var(--ink);background:transparent;border:0;border-radius:8px;padding:8px 12px;cursor:pointer;white-space:nowrap}}#bar button:hover{{background:var(--line)}}
#bar i{{width:1px;height:20px;background:var(--line);margin:0 4px}}#z{{font:500 12px 'IBM Plex Mono';min-width:46px;text-align:center;color:var(--mute)}}
#ttl{{position:fixed;left:16px;top:14px;font:500 12px 'IBM Plex Mono';letter-spacing:.06em;color:var(--mute);background:var(--ui);border:1px solid var(--line);border-radius:8px;padding:6px 10px}}
</style></head><body>
<div id="ttl">ETF KOMPAS · WIREFRAME BOARD · REV. 6</div>
<div id="vp"><div id="cv">{NOTES}{SECLBL}{FRAMES}</div></div>
<div id="bar"><button data-go="all">Vše</button><button data-go="0,0,4700,780">Rozhodnutí</button><button data-go="0,{Y0-130},1750,3650">Landing</button><button data-go="1910,{Y0-130},1750,1200">Po odeslání</button><button data-go="3820,{Y0-130},1750,3650">Srovnání</button><button data-go="5730,{Y0-130},1455,1800">Reklamy</button><button data-go="7500,{Y0-130},2640,3750">Doplňkové</button><button data-go="7500,{Y0+3580},2640,4150">Stavy a PDF</button><button data-go="7500,{Y0+7860},1280,2600">Pohyb</button><i></i><button id="zo">−</button><span id="z">100%</span><button id="zi">+</button><button id="z1">100 %</button></div>
<script>
(function(){{var vp=document.getElementById('vp'),cv=document.getElementById('cv'),zl=document.getElementById('z');var s=1,x=0,y=0;var W=10200,Hh={Y0+10700};
function ap(){{cv.style.transform='translate('+x+'px,'+y+'px) scale('+s+')';zl.textContent=Math.round(s*100)+'%'}}
function fit(a,b,w,h,pad){{pad=pad||48;var vw=innerWidth,vh=innerHeight-60;s=Math.min((vw-pad*2)/w,(vh-pad*2)/h,1.2);x=(vw-w*s)/2-a*s;y=Math.max(pad,(vh-h*s)/2)-b*s+(h*s>vh?0:0);if(h*s>vh-pad*2){{y=pad-b*s}}ap()}}
function zoomAt(f,cx,cy){{var ns=Math.min(2,Math.max(.04,s*f));x=cx-(cx-x)*ns/s;y=cy-(cy-y)*ns/s;s=ns;ap()}}
vp.addEventListener('wheel',function(e){{e.preventDefault();if(e.ctrlKey||e.metaKey){{zoomAt(Math.exp(-e.deltaY*.01),e.clientX,e.clientY)}}else{{x-=e.deltaX;y-=e.deltaY;ap()}}}},{{passive:false}});
var d=null;vp.addEventListener('pointerdown',function(e){{d={{x:e.clientX-x,y:e.clientY-y,id:e.pointerId}};vp.classList.add('drag');vp.setPointerCapture(e.pointerId)}});
vp.addEventListener('pointermove',function(e){{if(d){{x=e.clientX-d.x;y=e.clientY-d.y;ap()}}}});
function up(){{d=null;vp.classList.remove('drag')}}vp.addEventListener('pointerup',up);vp.addEventListener('pointercancel',up);
document.getElementById('zi').onclick=function(){{zoomAt(1.25,innerWidth/2,innerHeight/2)}};document.getElementById('zo').onclick=function(){{zoomAt(.8,innerWidth/2,innerHeight/2)}};
document.getElementById('z1').onclick=function(){{zoomAt(1/s,innerWidth/2,innerHeight/2)}};
document.querySelectorAll('[data-go]').forEach(function(b){{b.onclick=function(){{var g=b.dataset.go;if(g==='all')fit(0,0,W,Hh);else{{var p=g.split(',').map(Number);fit(p[0],p[1],p[2],p[3])}}}}}});
addEventListener('keydown',function(e){{if(e.key==='0')fit(0,0,W,Hh);if(e.key==='1')zoomAt(1/s,innerWidth/2,innerHeight/2);if(e.key==='+'||e.key==='=')zoomAt(1.25,innerWidth/2,innerHeight/2);if(e.key==='-')zoomAt(.8,innerWidth/2,innerHeight/2)}});
addEventListener('resize',function(){{}});fit(0,0,W,Hh);
}})();
</script></body></html>'''
open(sys.argv[1] if len(sys.argv)>1 else 'etf-kompas-board.html','w').write(page)
print(len(page))
