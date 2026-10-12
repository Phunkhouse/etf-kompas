# rev4d: placeholder boxes become blurred previews of PDF pages 1 and 4
import re
def bar(w,h=8,c='#CFC9B8'): return f'<i style="display:block;width:{w};height:{h}px;background:{c};border-radius:2px"></i>'
def page1(g):
    rows=''.join('<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:6px;align-items:center">'+bar('80%')+''.join(f'<i style="display:block;height:{g*2}px;border-radius:3px;background:{c}"></i>' for c in cs)+'</div>' for cs in (('#9AD4B2','#9AD4B2','#E8B9AA'),('#9AD4B2','#E8B9AA','#9AD4B2'),('#9AD4B2','#9AD4B2','#9AD4B2'),('#E8B9AA','#9AD4B2','#E8B9AA')))
    return f'<div style="display:flex;flex-direction:column;gap:{g*2}px;padding:{g*2}px;height:100%;box-sizing:border-box">{bar("55%",g*2,"#16150F")}{bar("80%",g)}<div style="display:flex;flex-direction:column;gap:{g*2}px;margin-top:{g}px">{rows}</div></div>'
def page4(g):
    return f'<div style="display:flex;flex-direction:column;gap:{g*2}px;padding:{g*2}px;height:100%;box-sizing:border-box">{bar("45%",g*2,"#16150F")}{bar("95%",g)}{bar("90%",g)}{bar("70%",g)}<div style="background:#DCEEE3;border-radius:4px;padding:{g*2}px;display:flex;flex-direction:column;gap:{g}px">{bar("60%",g,"#9AD4B2")}{bar("85%",g,"#B9D9C6")}</div>{bar("92%",g)}{bar("80%",g)}</div>'
def box(h,inner,cap,fs):
    return (f'<div style="flex:1;height:{h}px;position:relative;border:1px solid #D9D4C5;border-radius:4px;background:#FFFDF8;overflow:hidden">'
            f'<div style="filter:blur(2.5px);height:100%">{inner}</div>'
            f'<span class="tag" style="position:absolute;left:8px;bottom:8px;font-size:{fs}px;background:#16150F;color:#F6F3EC;padding:3px 6px;border-radius:3px">{cap}</span></div>')
for f,h,g,fs,gap in (('a8f21cef.html',300,6,11,16),('ad67ec35.html',170,4,9,12)):
    s=open('artboards-v4/'+f).read()
    pat=re.compile(f'<div style="display:flex;gap:{gap}px"><div class="ph".*?</div></div>(?=\\n)',re.S)
    m=pat.search(s); assert m,f
    new=f'<div style="display:flex;gap:{gap}px">'+box(h,page1(g),'strana 1 · srovnání',fs)+box(h,page4(g),'strana 4 · daně',fs)+'</div>'
    s=s[:m.start()]+new+s[m.end():]
    open('artboards-v4/'+f,'w').write(s); print('ok',f)
