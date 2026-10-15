#!/bin/sh
# Rebuilds everything for the current design (rev. 6, ads of rev. 7) from the rev. 2 artboards.
# Needs python3 only. Run from this folder.
set -e
python3 apply_rev3.py artboards-v2 artboards-v3
python3 apply_rev4.py artboards-v3 artboards-v4
python3 apply_rev4b.py
python3 apply_rev4c.py
python3 apply_rev4d.py
python3 gen_pages_rev4.py
python3 gen_states_rev4.py
python3 gen_motion_rev4.py
python3 apply_rev5.py
python3 apply_rev6.py
python3 apply_rev7.py
python3 mkboard.py etf-kompas-board.html
python3 build_study.py artboards-v4 logo etf-kompas-design-study.html
