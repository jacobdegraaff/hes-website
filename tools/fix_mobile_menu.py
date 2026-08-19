#!/usr/bin/env python3
"""Mobiel-menu fix: dropdown inklapbaar maken (tap toggelt .open, tweede tap klapt in).

Per pagina:
1. Voegt een toggle-script toe vóór <!-- CONTACT MODAL --> (mits nog niet aanwezig).
2. Neutraliseert de :hover-regel op mobiel (zodat alleen .open het paneel toont).
3. Breidt de 'sluit menu bij klik'-handler uit met dropdown-panellinks.
"""
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
pages = [f for f in os.listdir('.') if f.endswith('.html') and f != 'admin.html']

TOGGLE_SCRIPT = """<script>
/* Mobile: dropdown taps toggle .open (tap again to collapse) */
document.querySelectorAll('.nav-dropdown > a').forEach(function(a){
    a.addEventListener('click', function(e){
        if (window.innerWidth <= 768) {
            var li = a.parentElement;
            var wasOpen = li.classList.contains('open');
            document.querySelectorAll('.nav-dropdown.open').forEach(function(o){ o.classList.remove('open'); });
            if (!wasOpen) li.classList.add('open');
            e.preventDefault();
        }
    });
});
</script>
"""

ok, fail = [], []
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    changed = 0

    # 1) toggle-script toevoegen vóór CONTACT MODAL
    if 'dropdown inklappen' not in html and '<!-- CONTACT MODAL -->' in html:
        html = html.replace('<!-- CONTACT MODAL -->', TOGGLE_SCRIPT + '<!-- CONTACT MODAL -->', 1)
        changed += 1

    # 2a) hover neutraliseren — nette variant (index)
    if '.nav-dropdown.open > .nav-dropdown-panel { display: block; }' in html and '.nav-dropdown:hover .nav-dropdown-panel { display: none; }' not in html:
        html = html.replace(
            '.nav-dropdown.open > .nav-dropdown-panel { display: block; }',
            '.nav-dropdown.open > .nav-dropdown-panel { display: block; }\n            .nav-dropdown:hover .nav-dropdown-panel,\n            .nav-dropdown:hover .nav-backdrop { display: none; }',
            1,
        )
        changed += 1
    # 2b) hover neutraliseren — minified variant (altijd na de .open-regel in de @media-sectie)
    if '.nav-dropdown.open>.nav-dropdown-panel{display:block}' in html and '.nav-dropdown:hover .nav-dropdown-panel{display:none}' not in html:
        html = html.replace(
            '.nav-dropdown.open>.nav-dropdown-panel{display:block}',
            '.nav-dropdown.open>.nav-dropdown-panel{display:block}.nav-dropdown:hover .nav-dropdown-panel,.nav-dropdown:hover .nav-backdrop{display:none}',
            1,
        )
        changed += 1

    # 3a) close-handler uitbreiden — nette variant
    old_nice = "document.querySelectorAll('.nav-links > li:not(.nav-dropdown) > a').forEach(link => {"
    if old_nice in html:
        html = html.replace(old_nice, "document.querySelectorAll('.nav-links > li:not(.nav-dropdown) > a, .nav-dropdown-panel a').forEach(link => {", 1)
        changed += 1
    # 3b) close-handler uitbreiden — minified variant
    old_min = ".nav-links > li:not(.nav-dropdown) > a').forEach(function(l){"
    if old_min in html and '.nav-dropdown-panel a\').forEach' not in html:
        html = html.replace(old_min, ".nav-links > li:not(.nav-dropdown) > a, .nav-dropdown-panel a').forEach(function(l){", 1)
        changed += 1

    # eindcheck
    if 'Mobile: dropdown' in html and '.nav-dropdown-panel a' in html:
        open(p, 'w', encoding='utf-8').write(html)
        ok.append((p, changed))
    else:
        fail.append((p, changed))

for p, c in ok:
    print(f"OK {p} ({c} wijzigingen)")
for p, c in fail:
    print(f"FAIL {p} ({c} wijzigingen) — eindcheck niet geslaagd")
sys.exit(1 if fail else 0)
