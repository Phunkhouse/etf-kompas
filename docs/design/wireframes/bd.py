import re,html,os
HERE=os.path.dirname(os.path.abspath(__file__))
W=os.environ.get('WF_DIR',HERE)
LIGHT=open(f'{W}/logo/etf-kompas-logo.svg').read().strip(); DARK=open(f'{W}/logo/etf-kompas-logo-dark.svg').read().strip()
ART=os.environ.get('ART',os.path.join(HERE,'artboards-v4'))
def logo(w,h,dark=False,extra=''):
    s=DARK if dark else LIGHT
    return s.replace('width="188" height="48"',f'width="{w}" height="{h}" style="display:block;flex:none;{extra}"',1)
FONTS = ('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap')

BOARDS = [
    # id, file, title, w, h
    ('Main', 'a8f21cef', 'Landing page · desktop', 1280, 2900),
    ('B-mobile', 'ad67ec35', 'Landing page · mobil', 390, 3500),
    ('T1-radky', '174eb66f', 'Animace hero tabulky', 1280, 700),
    ('E1-success-desktop', '642661e9', 'Po odeslání · desktop', 1280, 640),
    ('E2-success-mobile', '4555091e', 'Po odeslání · mobil', 390, 1300),
    ('F1-results-desktop', '92ef8ee0', 'Srovnání · desktop', 1280, 2300),
    ('F2-results-mobile', '24e61a2e', 'Srovnání · mobil', 390, 2800),
    ('G1-adA-4x5', '8e84da19', 'Reklama A · 4:5', 540, 675),
    ('G2-adA-9x16', '6bf92b0b', 'Reklama A · 9:16', 405, 720),
    ('G3-adB-4x5', 'c2093dbc', 'Reklama B · 4:5', 540, 675),
    ('G4-adB-9x16', '4b5adee3', 'Reklama B · 9:16', 405, 720),
    ('G5-hero-A-mobile', '734d3e9c', 'První obrazovka po reklamě A', 375, 667),
]
BD = {b[0]: b for b in BOARDS}
# rendered height = measured content height (declared canvas heights leave empty space below the footer)
RH = {'Main': 2685, 'B-mobile': 3290, 'E1-success-desktop': 777, 'E2-success-mobile': 1014,
      'F1-results-desktop': 2665, 'F2-results-mobile': 2866}


def board_doc(fid):
    s = open(f'{ART}/{fid}.html').read()
    s = re.sub(r'@font-face\s*\{[^}]*\}', '', s)
    s = re.sub(r'/\* [a-z0-9-]+ \*/\s*', '', s)
    if not fid.startswith('mo'):
        s = re.sub(r'<script[^>]*>.*?</script>', '', s, flags=re.S)
    s = s.replace('<x-dc>', '').replace('</x-dc>', '').replace('<helmet>', '').replace('</helmet>', '')
    s = s.replace('<style></style>', '')
    s = s.replace('sc-camel-view-box=', 'viewBox=')
    s = s.replace('<sc-raw-', '<').replace('</sc-raw-', '</')
    s = s.replace('class="{{stageClass}}"', 'id="stage"')
    s = s.replace('sc-camel-on-click="{{replay}}"',
                  'onclick="var s=document.getElementById(\'stage\');s.classList.add(\'off\');setTimeout(function(){s.classList.remove(\'off\')},80)"')

    # swap every inline logo for the real file, keeping the artboard's size
    def sw(m):
        tag = m.group(0)
        w = re.search(r'width="(\d+)"', tag).group(1)
        h = re.search(r'height="(\d+)"', tag).group(1)
        dark = '#F6F1E7' in tag
        return logo(w, h, dark)
    s = re.sub(r'<svg viewBox="0 0 188.3 48.0"[^>]*aria-label="ETF Kompas">.*?</svg>', sw, s, flags=re.S)
    s = s.replace('<head>', f'<head><link rel="stylesheet" href="{FONTS}"><style>html{{overflow:hidden}}</style>', 1)
    return s


