#!/usr/bin/env python3
"""usage: dump_frames.py <artboards-v2-dir> <logo-dir> <out-dir> -> writes <id>.html per board (same markup the document embeds)"""
import sys
ART, LOGO, OUT = sys.argv[1:4]
FRAMES = OUT
sys.argv = ['x', ART, LOGO, OUT + '/dummy.html']
src = open(__file__.rsplit('/', 1)[0] + '/build.py').read().split('# ───────────────────────── annotations')[0]
exec(src)
import os
os.makedirs(FRAMES, exist_ok=True)
for b in BOARDS:
    open(f'{FRAMES}/{b[1]}.html', 'w').write(board_doc(b[1]))
print('ok')
