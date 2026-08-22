#!/usr/bin/env python3
"""Menu-robustheid: .open-regel wint ALTIJD van sticky :hover op touch.

De hover-neutralisatie (.nav-dropdown:hover ... display:none) heeft specificiteit
(0,3,0); de .open-regel (0,2,0) verliest daardoor op apparaten waar :hover blijft
'plakken' na een tap. Met !important wint de geopende staat altijd.
"""
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

OLD = '.nav-dropdown.open > .nav-dropdown-panel { display: block; }'
NEW = '.nav-dropdown.open > .nav-dropdown-panel { display: block !important; }'
OLD_MIN = '.nav-dropdown.open>.nav-dropdown-panel{display:block}'
NEW_MIN = '.nav-dropdown.open>.nav-dropdown-panel{display:block!important}'

pages = [f for f in os.listdir('.') if f.endswith('.html') and f != 'admin.html']
ok, miss = [], []
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    n = html.count(OLD) + html.count(OLD_MIN)
    if n == 0:
        miss.append(p)
        continue
    html = html.replace(OLD, NEW).replace(OLD_MIN, NEW_MIN)
    open(p, 'w', encoding='utf-8').write(html)
    ok.append(f"{p} ({n})")
for o in ok:
    print("OK ", o)
if miss:
    print("MISSEND:", miss)
