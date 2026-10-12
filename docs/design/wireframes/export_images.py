#!/usr/bin/env python3
"""Exports every artboard to a PNG (content height, 2x, 256 colours).
usage: python3 export_images.py [artboard-dir] [out-dir]    default: artboards-v4 ../images
needs: pip install playwright pillow, and a Chromium for Playwright (the page is rendered offline: IBM Plex must be installed
locally, or the fallback font changes line breaks)"""
import sys, os, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ART = sys.argv[1] if len(sys.argv) > 1 else 'artboards-v4'
OUT = sys.argv[2] if len(sys.argv) > 2 else '../images'
os.environ['ART'] = ART
import bd
from playwright.sync_api import sync_playwright
from PIL import Image
# artboard id, file name, viewport width
FRAMES = [
 ('a8f21cef', 'landing-desktop', 1280), ('ad67ec35', 'landing-mobile', 390),
 ('642661e9', 'success-desktop', 1280), ('4555091e', 'success-mobile', 390),
 ('92ef8ee0', 'results-desktop', 1280), ('24e61a2e', 'results-mobile', 390),
 ('vb01hero-d', 'hero-b-desktop', 1280), ('vb02hero-m', 'hero-b-mobile', 390),
 ('8e84da19', 'ad-a-4x5', 540), ('6bf92b0b', 'ad-a-9x16', 405), ('c2093dbc', 'ad-b-4x5', 540), ('4b5adee3', 'ad-b-9x16', 405),
 ('lc01calc-m', 'calculator-states-mobile', 390), ('lc02calc-d', 'calculator-states-desktop', 1280),
 ('mm01menu', 'menu-mobile', 390),
 ('ck01bar-m', 'cookies-bar-mobile', 390), ('ck03set-m', 'cookies-settings-mobile', 390),
 ('ck02bar-d', 'cookies-bar-desktop', 1280), ('ck04set-d', 'cookies-settings-desktop', 1280),
 ('pp01priv-d', 'privacy-desktop', 1280), ('pp02priv-m', 'privacy-mobile', 390),
 ('fe01form-m', 'form-errors-mobile', 390), ('fe02form-d', 'form-errors-desktop', 1280),
 ('oi01mail', 'optin-email', 600), ('oi02ok-m', 'optin-confirmed-mobile', 390), ('oi03old-m', 'optin-expired-mobile', 390),
 ('er01404-m', 'not-found-mobile', 390), ('er02unsub-m', 'unsubscribed-mobile', 390),
 ('pd01pdf1', 'pdf-page-1', 794), ('pd02pdf4', 'pdf-page-4', 794),
 ('fv01favicon', 'favicon', 640), ('sh01share', 'share-image', 1200),
 ('mo01motion', 'motion', 1280),
]
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROMIUM') or None)  # CHROMIUM=/path/to/chrome if Playwright's own is missing
    for fid, name, w in FRAMES:
        pg = b.new_page(viewport={'width': w, 'height': 300}, device_scale_factor=2)
        pg.emulate_media(reduced_motion='reduce')  # animated boards show their final state
        pg.set_content(bd.board_doc(fid).replace('https://fonts.googleapis.com', 'data:,#'))
        pg.wait_for_timeout(400)
        h = pg.evaluate('document.documentElement.scrollHeight')
        pg.set_viewport_size({'width': w, 'height': h})
        pg.wait_for_timeout(200)
        png = pg.screenshot(full_page=True)
        im = Image.open(io.BytesIO(png)).convert('RGB')
        CROP = {'hero-b-desktop': 800, 'hero-b-mobile': 820}  # hero-only boards: the artboard is the whole landing page
        if name in CROP:
            im = im.crop((0, 0, im.width, CROP[name] * 2))
        im = im.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        im.save(f'{OUT}/{name}.png', optimize=True)
        print(name, im.size, os.path.getsize(f'{OUT}/{name}.png') // 1024, 'KB')
        pg.close()
    b.close()
