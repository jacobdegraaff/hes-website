#!/usr/bin/env python3
"""Verwijder het dubbele dropdown-toggle-script.

assets/brand/accessibility.js bevat AL een mobiele dropdown-toggle
(met aria-expanded-sync). Mijn script was een duplicaat; twee toggles
annuleren elkaar (de een voegt .open toe, de ander verwijdert het meteen).
"""
import os
import re
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
pages = [f for f in os.listdir('.') if f.endswith('.html') and f != 'admin.html']

# het blok: <script> ... Mobile: dropdown ... </script>
BLOCK = re.compile(
    r'<script>\s*/\* Mobile: dropdown taps toggle \.open \(tap again to collapse\) \*/\s*'
    r'document\.querySelectorAll\([\'"]\.nav-dropdown > a[\'"]\)\.forEach\(function\(a\)\{.*?\}\);'
    r'\s*</script>\s*',
    re.S,
)

ok, fail = [], []
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    new, n = BLOCK.subn('', html)
    if n == 1 and 'Mobile: dropdown taps' not in new:
        open(p, 'w', encoding='utf-8').write(new)
        ok.append(p)
    else:
        fail.append((p, n))

for p in ok:
    print(f"OK {p}")
for p, n in fail:
    print(f"FAIL {p}: {n} blokken verwijderd")
sys.exit(1 if fail else 0)
