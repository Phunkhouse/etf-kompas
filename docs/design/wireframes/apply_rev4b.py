# rev4b: more breathing room in the mobile calculator (ad67ec35)
p='artboards-v4/ad67ec35.html'
s=open(p).read()
R=[
('<section id="calc" class="dk" style="background:#16150F;color:#F6F3EC;padding:28px 16px;display:flex;flex-direction:column;gap:16px">',
 '<section id="calc" class="dk" style="background:#16150F;color:#F6F3EC;padding:40px 20px;display:flex;flex-direction:column;gap:28px">'),
('<div style="border-top:1px solid #4A473D;padding-top:16px;display:flex;flex-direction:column;gap:8px">\n<span class="tag" style="color:#B9B3A2;line-height:1.4">',
 '<div style="border-top:1px solid #4A473D;padding-top:28px;display:flex;flex-direction:column;gap:14px">\n<span class="tag" style="color:#B9B3A2;line-height:1.5">'),
('<div style="display:flex;flex-direction:column;gap:4px;font-size:13px;color:#D9D4C5;margin-top:4px">',
 '<div style="display:flex;flex-direction:column;gap:12px;font-size:14px;color:#D9D4C5;margin-top:10px">'),
('<p style="font-size:12px;color:#B9B3A2">Počítáme s výnosem',
 '<p style="font-size:12px;line-height:1.5;color:#B9B3A2;margin-top:6px">Počítáme s výnosem'),
('<p style="font-size:13px;color:#D9D4C5;border-top:1px solid #4A473D;padding-top:10px">Ilustrativní',
 '<p style="font-size:13px;line-height:1.5;color:#D9D4C5;border-top:1px solid #4A473D;padding-top:20px;margin-top:10px">Ilustrativní'),
('padding:16px;display:flex;flex-direction:column;gap:8px;margin-top:4px"><span class="tag" style="color:#9AD4B2">',
 'padding:20px;display:flex;flex-direction:column;gap:12px;margin-top:20px"><span class="tag" style="color:#9AD4B2">'),
('<p style="font-size:12px;color:#B9D9C6">Odhad,','<p style="font-size:12px;line-height:1.5;color:#B9D9C6">Odhad,'),
('background:#9AD4B2;color:#16150F;margin-top:4px;text-align:center','background:#9AD4B2;color:#16150F;margin-top:8px;text-align:center'),
]
for a,b in R:
    assert s.count(a)==1,a[:60]
    s=s.replace(a,b)
open(p,'w').write(s)
