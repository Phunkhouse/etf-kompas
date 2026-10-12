# rev4g: motion artboard (live looping demos). Scripts must survive board_doc/build_study (ids starting with "mo").
from gen_pages_rev4 import logo, CD, burger_btn, BURGER, CLOSE
D='artboards-v4/'
CSS='''
:root{--o:cubic-bezier(.2,.8,.2,1)}
body{margin:0;background:#F6F3EC;color:#16150F;font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:16px;line-height:1.45}
*{box-sizing:border-box}h1,h2,h3,p{margin:0}
.tag{font:500 11px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#6B665A}
.wrap{max-width:1280px;margin:0 auto;padding:48px 56px 56px;display:flex;flex-direction:column;gap:32px;background:#F6F3EC}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;border-bottom:1.5px solid #16150F;padding-bottom:20px}
.top h1{font-size:44px;line-height:1.05;letter-spacing:-.025em;font-weight:700}.top p{font-size:16px;color:#3A372E;max-width:34em;margin-top:8px}
.rmbtn{font:600 14px 'IBM Plex Sans',sans-serif;min-height:44px;padding:0 16px;border:1.5px solid #16150F;border-radius:6px;background:transparent;color:#16150F;cursor:pointer;white-space:nowrap}
.tok{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.tok div{border-top:1.5px solid #16150F;padding-top:10px;display:flex;flex-direction:column;gap:4px;font-size:14px;color:#3A372E}.tok b{font-size:22px;color:#16150F}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 24px}
.cell{display:flex;flex-direction:column;gap:10px;min-width:0}.cell.w2{grid-column:span 2}
.hd{display:flex;justify-content:space-between;gap:12px;align-items:baseline}.spec{font:500 11px 'IBM Plex Mono',monospace;color:#6B665A;text-align:right}
.stage{background:#EAE5D8;border:1px solid #D4CEBE;border-radius:10px;height:360px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center}
.stage.dk{background:#16150F;border-color:#16150F;color:#F6F3EC}
.note{font-size:13.5px;color:#3A372E}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 24px;background:#16150F;color:#F6F3EC;font:600 17px 'IBM Plex Sans',sans-serif;border:0;border-radius:6px;text-decoration:none}
.card{background:#FFFDF8;border:1px solid #D4CEBE;border-radius:10px}
.num{font-variant-numeric:tabular-nums}
/* A hero */
@keyframes cIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes rIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}
.hcard{width:440px;padding:12px 16px}.tr{display:grid;grid-template-columns:1.6fr .8fr .8fr;gap:10px;align-items:center;padding:10px 8px;border-bottom:1px solid #D4CEBE;font-size:15px}.tr small{display:block;color:#6B665A;font-size:12px}.tr.th{border-bottom:1.5px solid #16150F;padding:6px 8px}
.pill{padding:3px 10px;border-radius:99px;font-size:12px;font-weight:500;background:#E6E1D4;justify-self:start}
.go .hc{animation:cIn .7s var(--o) both}.go .a1{animation:rIn .7s var(--o) .4s both}.go .a2{animation:rIn .7s var(--o) .9s both}.go .a3{animation:rIn .7s var(--o) 1.4s both}.go .a4{animation:rIn .7s var(--o) 1.9s both}
/* B calculator */
.calc{width:340px;display:flex;flex-direction:column;gap:12px;padding:14px 0 28px}
.chips{display:flex;gap:8px;align-items:center;font-size:14px}.chip{min-height:40px;min-width:48px;border:1.5px solid #F6F3EC;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;transition:background .15s ease,color .15s ease}.chip.on{background:#F6F3EC;color:#16150F}
.trk{height:4px;background:#4A473D;border-radius:4px;position:relative;margin:8px 0}.thumb{position:absolute;top:-7px;left:12%;width:18px;height:18px;border-radius:50%;background:#F6F3EC;transition:left .25s var(--o)}
.big{font-size:48px;line-height:1;font-weight:700;letter-spacing:-.03em;color:#F2A18C;height:50px;overflow:hidden;position:relative}
.big span{display:block;transition:transform .25s var(--o),opacity .25s var(--o)}.big .n2{position:absolute;left:0;top:0;transform:translateY(60%);opacity:0}.calc.b .n1{transform:translateY(-60%);opacity:0}.calc.b .n2{transform:none;opacity:1}
.sav{background:#1F3A2B;border:1px solid #2F6B49;border-radius:10px;padding:0 14px;max-height:0;opacity:0;transform:translateY(-8px);overflow:hidden;transition:max-height .25s var(--o),opacity .25s var(--o),transform .25s var(--o),padding .25s var(--o)}
.calc.s .sav{max-height:110px;opacity:1;transform:none;padding:12px 14px}.sav p{font-size:15px;font-weight:600;color:#F6F3EC}.sav .tag{color:#9AD4B2}.sav .bt{display:block;margin-top:8px;background:#9AD4B2;color:#16150F;border-radius:6px;padding:10px;text-align:center;font:600 14px 'IBM Plex Sans',sans-serif}
.lbl{position:absolute;left:14px;bottom:10px;font:500 11px 'IBM Plex Mono',monospace;color:#9AD4B2}
/* D loading */
@keyframes sh{from{background-position:200% 0}to{background-position:-200% 0}}
.ld{width:300px;display:flex;flex-direction:column;gap:12px}.sk{height:14px;border-radius:4px;background:linear-gradient(90deg,#3A372E 0,#5A564A 50%,#3A372E 100%);background-size:200% 100%;animation:sh 1.4s linear infinite}.sk.big2{height:48px;width:70%}
.ld .res{position:absolute;left:0;top:0;opacity:0;transition:opacity .25s ease}.ld .skw{transition:opacity .25s ease}.ldw{position:relative;width:300px}.ldw.done .skw{opacity:0}.ldw.done .res{opacity:1}
.res .big{height:auto;font-size:44px}.res p{font-size:13px;color:#D9D4C5;margin-top:8px}
/* E menu */
.ph{width:300px;height:260px;background:#F6F3EC;border:1px solid #D4CEBE;border-radius:12px;overflow:hidden;position:relative}
.hdr{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #D4CEBE;height:52px;background:#F6F3EC;position:relative;z-index:2}
.ham{width:44px;height:44px;border:1.5px solid #16150F;border-radius:99px;position:relative}.ham i{position:absolute;left:12px;width:18px;height:2px;background:#16150F;border-radius:2px;transition:transform .25s var(--o),opacity .15s ease}.ham i:nth-child(1){top:14px}.ham i:nth-child(2){top:21px}.ham i:nth-child(3){top:28px}
.open .ham i:nth-child(1){transform:translateY(7px) rotate(45deg)}.open .ham i:nth-child(2){opacity:0}.open .ham i:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.pnl{position:absolute;left:0;right:0;top:52px;bottom:0;background:#F6F3EC;padding:6px 12px;opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .25s var(--o),transform .25s var(--o);z-index:1}.open .pnl{opacity:1;transform:none}
.pnl a{display:block;padding:14px 0;border-bottom:1px solid #D4CEBE;font-weight:600;font-size:16px;opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .2s var(--o)}.open .pnl a{opacity:1;transform:none}.open .pnl a:nth-child(2){transition-delay:.04s}.open .pnl a:nth-child(3){transition-delay:.08s}
/* F cookies */
.scr{position:absolute;inset:0;background:rgba(22,21,15,.5);opacity:0;transition:opacity .25s ease}.in .scr{opacity:1}
.sheet{position:absolute;left:0;right:0;bottom:0;background:#16150F;color:#F6F3EC;padding:14px;display:flex;flex-direction:column;gap:8px;border-radius:12px 12px 0 0;transform:translateY(105%);transition:transform .3s var(--o)}.in .sheet{transform:none}
.sheet .b{display:block;border-radius:6px;padding:10px;text-align:center;font:600 13px 'IBM Plex Sans',sans-serif}.sw{width:48px;height:28px;border-radius:99px;background:#6B665A;position:relative;transition:background .15s ease;flex:none}.sw::after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .15s var(--o)}.sw.on{background:#2F6B49}.sw.on::after{transform:translateX(20px)}
.row2{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:#D9D4C5}
/* G faq */
.faq{width:420px;border-top:1.5px solid #16150F}.q{border-bottom:1px solid #D4CEBE;padding:14px 0}.q .h{display:flex;justify-content:space-between;font-weight:500}.q .pl{width:18px;height:18px;position:relative;transition:transform .25s var(--o)}.q .pl::before,.q .pl::after{content:"";position:absolute;background:#16150F;border-radius:2px}.q .pl::before{left:2px;right:2px;top:8px;height:2px}.q .pl::after{top:2px;bottom:2px;left:8px;width:2px}
.q .a{max-height:0;overflow:hidden;opacity:0;font-size:14px;color:#3A372E;transition:max-height .25s var(--o),opacity .25s var(--o),margin .25s var(--o)}.q.open .a{max-height:90px;opacity:1;margin-top:8px}.q.open .pl{transform:rotate(45deg)}
/* H form */
@keyframes shk{0%,100%{transform:none}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.fm{width:340px;display:flex;flex-direction:column;gap:8px;background:#FFFDF8;border:1px solid #D4CEBE;border-radius:10px;padding:18px}.inp{border:1.5px solid #16150F;border-radius:6px;background:#fff;min-height:52px;padding:0 14px;display:flex;align-items:center;font-size:16px;transition:border-color .15s ease,border-width .15s ease}
.err{font-size:13px;color:#B3341A;font-weight:500;max-height:0;opacity:0;transform:translateY(-4px);overflow:hidden;transition:max-height .2s var(--o),opacity .2s var(--o),transform .2s var(--o)}.bad .inp{border-color:#B3341A;border-width:2px;animation:shk .24s ease-in-out}.bad .err{max-height:40px;opacity:1;transform:none}
/* I success */
@keyframes pop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}@keyframes dr{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}
.ok{display:flex;flex-direction:column;align-items:center;gap:12px;font-size:20px;font-weight:700}.okc{width:64px;height:64px;border-radius:50%;background:#D6E8DE;display:grid;place-items:center}.okc path{stroke-dasharray:30;stroke-dashoffset:30}.go .okc{animation:pop .3s var(--o) both}.go .okc path{animation:dr .4s ease-out .25s both}.go .okt{animation:cIn .5s var(--o) .5s both}
/* J sticky */
.pg{width:240px;height:260px;border:1px solid #D4CEBE;border-radius:12px;overflow:hidden;position:relative;background:#F6F3EC}.pgc{padding:14px;display:flex;flex-direction:column;gap:10px;transition:transform .6s var(--o)}.pgc i{display:block;height:10px;background:#D9D3C3;border-radius:3px}.pgc .hero{height:70px;background:#16150F;border-radius:6px}.scrolled .pgc{transform:translateY(-80px)}
.stk{position:absolute;left:0;right:0;bottom:0;background:#F6F3EC;border-top:1.5px solid #16150F;padding:8px;transform:translateY(105%);transition:transform .25s var(--o)}.scrolled .stk{transform:none}.stk .btn{min-height:40px;width:100%;font-size:14px}
/* K reveal */
.rv{display:flex;gap:10px}.rv .card{width:104px;padding:12px;font-size:13px;opacity:0;transform:translateY(24px);transition:opacity .5s var(--o),transform .5s var(--o)}.rv.in .card{opacity:1;transform:none}.rv.in .card:nth-child(2){transition-delay:.08s}.rv.in .card:nth-child(3){transition-delay:.16s}.rv .card b{display:block;font-size:26px;line-height:1;margin-bottom:6px}
/* L press */
.pr{display:flex;flex-direction:column;gap:14px;align-items:center}.pr .btn{transition:transform .1s ease,background .1s ease}.pr .btn.p{transform:scale(.98);background:#3A372E}
.rm *,.rm *::before,.rm *::after{animation:none!important;transition:none!important}
.rm .okc path{stroke-dashoffset:0}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.okc path{stroke-dashoffset:0}}
'''
def cell(t,spec,stage,note,cls='',dk=False):
    return f'<section class="cell {cls}"><div class="hd"><span class="tag">{t}</span><span class="spec">{spec}</span></div><div class="stage{" dk" if dk else ""}">{stage}</div><p class="note">{note}</p></section>'
rows=''.join(f'<div class="tr a{i}"><div><b>{a}</b><small>{b}</small></div><span class="num">{c}</span><span class="pill">{d}</span></div>' for i,(a,b,c,d) in enumerate([('S&amp;P 500','iShares CSPX','0,07 %','Acc'),('S&amp;P 500','Vanguard VUAA','0,07 %','Acc'),('S&amp;P 500','Vanguard VUSA','0,07 %','Dist'),('Nasdaq 100','iShares CSNDX','0,33 %','Acc')],1))
cells=[
 cell('A · Hero','700 ms · ease-out · once on load','<div class="hcard card hc" id="hero"><div class="tr th"><span class="tag">Co koupíte</span><span class="tag">Poplatek</span><span class="tag">Typ</span></div>'+rows+'</div>',
      'The card rises 24 px and fades in (700 ms). Rows then slide in from the left, 500 ms apart, in table order. Nothing moves after that. The sequence ends about 2.6 s after load, before most visitors have read the headline.','w2'),
 cell('B · Calculator','250 ms · ease-out · on input','<div class="lbl">Ukázka pohybu, čísla nejsou data</div><div class="calc" id="calc"><div class="chips"><span>Na jak dlouho</span><span class="chip" id="c5">5</span><span class="chip on" id="c10">10</span><span class="chip" id="c20">20</span></div><div class="trk"><i class="thumb"></i></div><div class="big num"><span class="n1">12 345 Kč</span><span class="n2">31 880 Kč</span></div><div class="sav"><span class="tag">Při vašem nastavení</span><p>Správným brokerem si ponecháte až 1 200 Kč</p><span class="bt">Ukázat, u kterého brokera to koupím</span></div></div>',
      'The chip fills in 150 ms. The old number slides up and fades while the new one rises in (250 ms); digits are tabular so the width does not jump, and the number is never counted up. The green box grows under the result (250 ms) only when the hide rule allows it; it leaves the same way.',dk=True),
 cell('C · Loading','1.4 s shimmer · 250 ms swap','<div class="ldw" id="ld"><div class="skw ld"><span class="tag" style="color:#B9B3A2">Načítáme aktuální poplatky…</span><div class="sk big2"></div><div class="sk"></div><div class="sk"></div><div class="sk" style="width:80%"></div></div><div class="res"><span class="tag" style="color:#B9B3A2">Za 10 let vás ETF bude stát</span><div class="big num">X XXX Kč</div><p>roční poplatek fondu · převod korun · poplatky brokera</p></div></div>',
      'Grey bars with a slow light sweep (1.4 s, linear) hold the place of the result. When data arrives they cross-fade to the real layout in 250 ms, so nothing jumps. If loading fails there is no animation, only the message.',dk=True),
 cell('D · Phone menu','250 ms · ease-out · tap','<div class="ph" id="mn"><div class="hdr"><b style="font-family:Georgia,serif">ETF Kompas</b><div class="ham"><i></i><i></i><i></i></div></div><div class="pnl"><a>Jak počítáme</a><a>Odkud máme čísla</a><a>Časté dotazy</a></div></div>',
      'The three lines turn into a cross (250 ms). The panel fades in and drops 8 px; the three links follow 40 ms apart. Closing is the same in reverse, 200 ms. The page behind stays still.'),
 cell('E · Cookies','300 ms · ease-out · first visit','<div class="ph" id="ck"><div class="hdr"><b style="font-family:Georgia,serif">ETF Kompas</b></div><div style="padding:14px;display:flex;flex-direction:column;gap:8px"><i style="display:block;height:10px;background:#D9D3C3;border-radius:3px"></i><i style="display:block;height:10px;background:#D9D3C3;border-radius:3px;width:70%"></i></div><div class="scr"></div><div class="sheet"><span class="tag" style="color:#B9B3A2">Cookies</span><div class="row2"><span>Měření návštěvnosti</span><span class="sw" id="sw1"></span></div><span class="b" style="background:#F6F3EC;color:#16150F">Přijmout vše</span><span class="b" style="border:1.5px solid #F6F3EC">Odmítnout vše</span></div></div>',
      'The bar slides up from the bottom edge (300 ms) while the page dims (250 ms). A switch slides in 150 ms. Dismissing slides it down in 200 ms. The bar appears after first paint, so it never delays the page.'),
 cell('F · FAQ','250 ms · ease-out · tap','<div class="faq" id="fq"><div class="q"><div class="h">Můžu si americký fond koupit z Česka?<i class="pl"></i></div><div class="a">U většiny brokerů ne. Evropské verze stejných indexů ano.</div></div><div class="q" id="q2"><div class="h">Je to zdarma?<i class="pl"></i></div><div class="a">Ano. Nic neprodáváme a nedostáváme provize.</div></div><div class="q"><div class="h">Radíte mi, co koupit?<i class="pl"></i></div><div class="a">Ne. Ukazujeme poplatky a dostupnost.</div></div></div>',
      'The answer grows and fades in (250 ms) while the plus turns into a cross. Only one answer is open at a time; the others close at the same moment.'),
 cell('G · Form error','150 + 200 ms · on submit','<div class="fm" id="fm"><span style="font-weight:500;font-size:15px">Váš e-mail</span><div class="inp">jmeno@domena</div><div class="err">Zadejte e-mail ve tvaru jmeno@domena.cz.</div><span class="btn" style="min-height:48px;font-size:15px">Poslat mi srovnání</span></div>',
      'The border turns red (150 ms), the field shakes 4 px twice (240 ms, dropped under reduced motion) and the message slides down (200 ms). The message is also announced to screen readers, so motion never carries the meaning.'),
 cell('H · Success','300 + 400 ms · once','<div class="ok" id="ok"><div class="okc"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#154A33" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><span class="okt">Hotovo. Srovnání je připravené.</span></div>',
      'The circle pops in (300 ms) and the check draws itself (400 ms), then the heading rises. It plays once; a second visit shows the final state.'),
 cell('I · Sticky button (phone)','250 ms · ease-out · on scroll','<div class="pg" id="pg"><div class="pgc"><div class="hero"></div><i></i><i style="width:70%"></i><i></i><i style="width:85%"></i><i></i><i style="width:60%"></i><i></i><i></i></div><div class="stk"><span class="btn">Poslat mi srovnání</span></div></div>',
      'The bottom bar slides up (250 ms) once the hero button leaves the screen and slides away again when the form or footer is visible, so it never covers the field it points to.'),
 cell('J · Scroll reveal','500 ms · 80 ms stagger · once','<div class="rv" id="rv"><div class="card"><b class="num">1</b>Roční poplatek fondu</div><div class="card"><b class="num">2</b>Převod korun</div><div class="card"><b class="num">3</b>Daň ze zisků</div></div>',
      'Blocks below the first screen rise 24 px and fade in (500 ms) when they enter the view, siblings 80 ms apart. Once only; scrolling back does not replay it. The calculator and form never wait for a reveal.'),
 cell('K · Button press','100 ms · on tap','<div class="pr" id="pr"><span class="btn" id="bt">Spočítat, kolik mě to bude stát</span><span class="tag">Stisk, ne najetí: na telefonu není hover</span></div>',
      'On press the button scales to 98 % and lightens (100 ms). There is no hover movement. Focus is an instant 3 px ring, never animated.'),
]
tok=''.join(f'<div><b>{a}</b>{b}</div>' for a,b in [('100 ms','Press feedback'),('150 ms','Small state: chip, switch, border'),('250 ms','Panels, boxes, number swap'),('500 ms','Scroll reveal'),('700 ms','Hero entrance, once')])
BODY=f'''<div class="wrap" id="root">
<div class="top"><div><span class="tag">Pohyb</span><h1>Motion</h1><p>Motion explains a change, it never decorates. Everything below plays on its own and loops; only the hero sequence is more than 300 ms long.</p></div><button class="rmbtn" id="rm" type="button">Omezit pohyb (náhled)</button></div>
<div class="tok">{tok}</div>
<div class="grid">{''.join(cells)}</div>
<p class="note" style="max-width:70em"><b>Rules.</b> Easing is <code>cubic-bezier(.2,.8,.2,1)</code> (fast start, soft stop) for things that appear or move, <code>ease</code> for colour. Only opacity and transform are animated, except for panel height. No motion on hover, no looping decoration, no parallax. Under „omezit pohyb“ in the system, or the button above, every animation stops and the screen shows its final state. Numbers are never counted up.</p></div>'''
JS='''
(function(){
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var root=document.getElementById('root'),timers=[];
function $(i){return document.getElementById(i)}
function t(fn,ms){var h=setTimeout(fn,ms);timers.push(h);return h}
function replay(el){el.classList.remove('go');void el.offsetWidth;el.classList.add('go')}
function loop(fn,ms){fn();var h=setInterval(fn,ms);timers.push(h)}
function start(){
 loop(function(){replay($('hero').parentNode.parentNode.querySelector('.stage'))},6500);
 var calc=$('calc');loop(function(){calc.className='calc';$('c5').className='chip';$('c10').className='chip on';calc.querySelector('.thumb').style.left='12%';
   t(function(){$('c10').className='chip';$('c20').className='chip on';calc.querySelector('.thumb').style.left='62%';calc.classList.add('b')},1300);
   t(function(){calc.classList.add('s')},2500)},7000);
 var ld=$('ld');loop(function(){ld.classList.remove('done');t(function(){ld.classList.add('done')},2400)},5600);
 var mn=$('mn');loop(function(){mn.classList.add('open');t(function(){mn.classList.remove('open')},2600)},4800);
 var ck=$('ck');loop(function(){ck.classList.add('in');t(function(){$('sw1').classList.add('on')},1400);t(function(){ck.classList.remove('in');$('sw1').classList.remove('on')},3200)},5400);
 var q2=$('q2');loop(function(){q2.classList.add('open');t(function(){q2.classList.remove('open')},2400)},4600);
 var fm=$('fm');loop(function(){fm.classList.remove('bad');t(function(){fm.classList.add('bad')},900)},4200);
 loop(function(){replay($('ok'))},4200);
 var pg=$('pg');loop(function(){pg.classList.remove('scrolled');t(function(){pg.classList.add('scrolled')},1200)},4600);
 var rv=$('rv');loop(function(){rv.classList.remove('in');t(function(){rv.classList.add('in')},600)},4600);
 var bt=$('bt');loop(function(){bt.classList.add('p');t(function(){bt.classList.remove('p')},220)},1800);
}
function stop(){timers.forEach(function(h){clearTimeout(h);clearInterval(h)});timers=[]}
function still(){
 $('hero').parentNode.classList.remove('go');
 $('calc').className='calc b s';$('c10').className='chip';$('c20').className='chip on';$('c5').className='chip';
 $('ld').classList.add('done');$('mn').classList.add('open');$('ck').classList.add('in');$('q2').classList.add('open');$('fm').classList.add('bad');
 $('ok').classList.add('go');$('pg').classList.add('scrolled');$('rv').classList.add('in');
}
function apply(){if(root.classList.contains('rm')||rm){stop();still()}else{start()}}
$('rm').onclick=function(){root.classList.toggle('rm');apply()};
apply();
})();
'''
html=f'''<!DOCTYPE html>
<html lang="cs"><head>
<meta charset="utf-8">
<title>Pohyb</title>
</head>
<body>
<x-dc>
<helmet>
<style></style>
<style>{CSS}</style>
</helmet>
{BODY}
</x-dc>
<script>{JS}</script>
</body></html>
'''
open(D+'mo01motion.html','w').write(html); print('ok',len(html))
