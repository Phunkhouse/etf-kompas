# rev7 (2026-10-15): the two ads are replaced by the ideas David chose from the ten new drafts.
# - Ad A (4:5 and 9:16): "Stejný fond. Rozdíl až 28 000 Kč" (the saving in korunas).
# - Ad B (4:5 and 9:16): "Za 20 let se rozdíl vyšplhá na desítky tisíc" on a dark card (the 20-year range).
# Amounts: the verified data, 3 000 Kč a month, S&P 500 fund. 10 years: dearest broker 30 762 Kč, cheapest
# 2 476 Kč, gap 28 286 Kč (shown as "až 28 000 Kč", rounded down); 20 years: 91 238 Kč and 12 630 Kč (shown rounded
# to 91 200 and 12 600). No broker is named. Recompute before launch.
# Runs after apply_rev6.py, on artboards-v4. Only the root block of the four ad artboards is replaced; the
# head, the logo and the script stay as they are.
import re

D = 'artboards-v4'
MONO = ("font-family:'IBM Plex Mono',monospace;font-weight:500;letter-spacing:.06em;text-transform:uppercase")
RISK = 'Investování nese riziko ztráty. Příklad výpočtu, ne slib výnosu.'


def ad_a(size):
    """size: 'feed' (540 x 675) or 'story' (405 x 720)."""
    f = size == 'feed'
    root = ('width:540px;height:675px;background:#F6F3EC;padding:44px' if f
            else 'width:405px;height:720px;background:#F6F3EC;padding:110px 32px 150px')
    h1, big, body, mono = (38, 84, 19, 12) if f else (30, 66, 16, 11)
    cta, risk, gap = (22, 11, 10) if f else (19, 10, 8)
    return f'''<div style="{root};display:flex;flex-direction:column;justify-content:space-between">
<LOGO/>
<div style="display:flex;flex-direction:column;gap:6px">
<h1 style="font-size:{h1}px;line-height:1.08;letter-spacing:-.025em;font-weight:700">Stejný fond. Rozdíl až</h1>
<div class="num" style="font-size:{big}px;line-height:1;font-weight:700;letter-spacing:-.04em;color:#C23A1B;margin-top:8px">28&nbsp;000&nbsp;Kč</div>
<p style="font-size:{body}px;line-height:1.4;color:#3A372E;margin-top:10px">Za 10 let, podle toho, u kterého brokera ho koupíte. Spočítáme to v&nbsp;korunách.</p>
<p style="{MONO};font-size:{mono}px;color:#6B665A;margin-top:6px">3&nbsp;000&nbsp;Kč měsíčně · 10 let · příklad, ne slib</p>
</div>
<div style="display:flex;flex-direction:column;gap:{gap}px">
<p style="font-size:{cta}px;font-weight:600;line-height:1.2">Spočítat moje poplatky. Zdarma.</p>
<p style="font-size:{risk}px;color:#6B665A">{RISK}</p>
</div>
</div>
'''


def ad_b(size):
    f = size == 'feed'
    root = ('width:540px;height:675px;background:#16150F;color:#F6F3EC;padding:44px' if f
            else 'width:405px;height:720px;background:#16150F;color:#F6F3EC;padding:110px 32px 150px')
    h1, label, amount, bar_short, bar_long, body = (34, 11, 20, 46, 300, 16) if f else (27, 10, 17, 36, 215, 14)
    cta, risk, gap = (22, 11, 10) if f else (19, 10, 8)

    def row(text, width, fill, color):
        return f'''<div style="display:flex;flex-direction:column;gap:6px">
<span style="{MONO};font-size:{label}px;color:#B9B3A2">{text}</span>
<div style="display:flex;align-items:center;gap:12px"><div style="width:{width}px;height:22px;background:{fill}"></div><span class="num" style="font-size:{amount}px;font-weight:700;color:{color}">{{amount}}</span></div>
</div>
'''
    short = row('Nejlevnější z 5 ověřených brokerů', bar_short, '#F6F3EC', '#F6F3EC').replace('{amount}', '12&nbsp;600&nbsp;Kč')
    long = row('Nejdražší z 5 ověřených brokerů', bar_long, '#F2A18C', '#F2A18C').replace('{amount}', '91&nbsp;200&nbsp;Kč')
    return f'''<div style="{root};display:flex;flex-direction:column;justify-content:space-between">
<LOGO_DARK/>
<div style="display:flex;flex-direction:column;gap:20px">
<h1 style="font-size:{h1}px;line-height:1.1;letter-spacing:-.025em;font-weight:700">Za 20 let se rozdíl mezi brokery vyšplhá na desítky tisíc.</h1>
<div style="display:flex;flex-direction:column;gap:14px">
{short}{long}</div>
<p style="font-size:{body}px;line-height:1.4;color:#D9D4C5">Stejný fond na 500 největších amerických firem. 3&nbsp;000&nbsp;Kč měsíčně, 20 let, příklad.</p>
</div>
<div style="display:flex;flex-direction:column;gap:{gap}px">
<p style="font-size:{cta}px;font-weight:600;line-height:1.2">Spočítat moje poplatky. Zdarma.</p>
<p style="font-size:{risk}px;color:#B9B3A2">{RISK}</p>
</div>
</div>
'''


def dark_logo(svg):
    # the wordmark in the colour of the dark logo file (bd.py swaps in the real file where it finds this colour);
    # the needle keeps its orange
    return svg.replace('fill="#17140F"', 'fill="#F6F1E7"').replace('stroke="#17140F"', 'stroke="#F6F1E7"')


def patch(fid, build):
    path = f'{D}/{fid}.html'
    s = open(path, encoding='utf-8').read()
    logo = re.search(r'<svg sc-camel-view-box.*?</svg>', s, re.S).group(0)
    start = s.index('<div style="width:', s.index('</helmet>'))
    end = s.index('</x-dc>')
    block = build.replace('<LOGO_DARK/>', dark_logo(logo)).replace('<LOGO/>', logo)
    open(path, 'w', encoding='utf-8').write(s[:start] + block + s[end:])


patch('8e84da19', ad_a('feed'))    # Ad A, 4:5
patch('6bf92b0b', ad_a('story'))   # Ad A, 9:16
patch('c2093dbc', ad_b('feed'))    # Ad B, 4:5
patch('4b5adee3', ad_b('story'))   # Ad B, 9:16
print('rev7: ads A and B replaced')
