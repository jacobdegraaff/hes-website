#!/usr/bin/env python3
"""Fix CSS-volgorde mobiel menu: hover-neutralisatie moet VOOR de .open-regel staan,
zodat op touch (sticky :hover) de .open-regel (display:block) wint."""
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
pages = [f for f in os.listdir('.') if f.endswith('.html') and f != 'admin.html']

NICE_OLD = """            .nav-dropdown.open > .nav-dropdown-panel { display: block; }
            .nav-dropdown:hover .nav-dropdown-panel,
            .nav-dropdown:hover .nav-backdrop { display: none; }"""
NICE_NEW = """            .nav-dropdown:hover .nav-dropdown-panel,
            .nav-dropdown:hover .nav-backdrop { display: none; }
            .nav-dropdown.open > .nav-dropdown-panel { display: block; }"""

MIN_OLD = ".nav-dropdown.open>.nav-dropdown-panel{display:block}.nav-dropdown:hover .nav-dropdown-panel,.nav-dropdown:hover .nav-backdrop{display:none}"
MIN_NEW = ".nav-dropdown:hover .nav-dropdown-panel,.nav-dropdown:hover .nav-backdrop{display:none}.nav-dropdown.open>.nav-dropdown-panel{display:block}"

ok, fail = [], []
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    if NICE_OLD in html:
        html = html.replace(NICE_OLD, NICE_NEW, 1)
    elif MIN_OLD in html:
        html = html.replace(MIN_OLD, MIN_NEW, 1)
    else:
        fail.append((p, 'patroon niet gevonden'))
        continue
    open(p, 'w', encoding='utf-8').write(html)
    ok.append(p)

for p in ok:
    print(f"OK {p}")
for p, m in fail:
    print(f"FAIL {p}: {m}")
sys.exit(1 if fail else 0)
