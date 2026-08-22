#!/usr/bin/env python3
"""Lemnion nav-breakpoint fix: hamburger vanaf <=1180px (was <=768px).

Het probleem: tussen 769 en ~1170px past de desktop-nav niet (items krimpen,
tekst breekt, "Over ons" op 2 regels) en de hamburger was nog niet actief.
Fix: een @media (min-width:769px) and (max-width:1180px) block met ALLEEN de
nav-regels (uit de bestaande 768-block), plus alle JS-drempels 768 -> 1180.

Handelt beide formaten af: index.html (spaced + comments) en subpagina's
(minified). Count-geverifieerde vervangingen.
"""
import re, glob, sys

PAGES = sorted(f for f in glob.glob('*.html') if f != 'admin.html')
VERIFY_ONLY = '--verify' in sys.argv

def find_block(h, start):
    depth = 0; i = start
    while i < len(h):
        if h[i] == '{': depth += 1
        elif h[i] == '}':
            depth -= 1
            if depth == 0: break
        i += 1
    return i + 1

results = []
for f in PAGES:
    h = open(f, encoding='utf-8').read()
    orig = h

    # 1. Vind het grote 768-block (met html,body overflow-x hidden)
    m = re.search(r'@media\s*\(\s*max-width\s*:\s*768px\s*\)\s*\{\s*(?:/\*.*?\*/\s*)?html,\s*body\s*\{\s*overflow-x\s*:\s*hidden', h)
    if not m:
        results.append((f, 'FAIL: big 768 block niet gevonden')); continue
    block_start = m.start()
    block_end = find_block(h, block_start)
    block = h[block_start:block_end]

    # 2. NAV-sectie uit dat block halen
    if f == 'index.html':
        n = re.search(r'/\* ── NAV ── \*/.*?(?=/\* ── HERO ── \*/)', block, re.S)
        nav = n.group(0).rstrip() if n else None
    else:
        n = re.search(r'nav\{position:sticky.*?\.nav-links\s*\.btn-primary\{[^}]*\}', block, re.S)
        nav = n.group(0) if n else None
    if not nav:
        results.append((f, 'FAIL: NAV-sectie niet gevonden')); continue

    if VERIFY_ONLY:
        results.append((f, f'OK nav-sectie {len(nav)} chars, block {block_end-block_start} chars'))
        continue

    # 3. Nieuw 1180-block invoegen na het 768-block
    new_block = '@media (min-width: 769px) and (max-width: 1180px) {\n' + nav + '\n}\n\n'
    h = h[:block_end] + new_block + h[block_end:]

    # 4. JS-drempels 768 -> 1180 (beide formats)
    c_spaced = h.count('innerWidth <= 768')
    c_min = h.count('innerWidth<=768')
    h = h.replace('innerWidth <= 768', 'innerWidth <= 1180').replace('innerWidth<=768', 'innerWidth<=1180')

    if h == orig:
        results.append((f, 'FAIL: niets veranderd')); continue
    open(f, 'w', encoding='utf-8').write(h)
    results.append((f, f'OK: +1180-block ({len(nav)} ch), JS {c_spaced}+{c_min} -> 1180'))

for f, r in results:
    print(f'{f}: {r}')
fails = [r for _, r in results if r.startswith('FAIL')]
print(f'\nTotaal: {len(results)} pagina\'s, {len(fails)} failures')
sys.exit(1 if fails else 0)
