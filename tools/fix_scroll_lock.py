#!/usr/bin/env python3
"""iOS-veilige scroll-lock: vervang body overflow:hidden/'' door een lock die
de scrollpositie bewaart. Op iOS springt body overflow:hidden de pagina naar
boven bij het openen/sluiten van het mobiele menu ('menu schuift naar boven').
"""
import os, re

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

HELPER = """<script>
/* Scroll-lock die de scrollpositie bewaart (geen sprong naar boven op iOS) */
var __lemLockY = 0;
function lockScroll(on) {
    if (on) {
        __lemLockY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + __lemLockY + 'px';
        document.body.style.left = '0';
        document.body.style.width = '100%';
    } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        window.scrollTo(0, __lemLockY);
    }
}
</script>
"""

pages = [f for f in os.listdir('.') if f.endswith('.html') and f != 'admin.html']
for p in sorted(pages):
    html = open(p, encoding='utf-8').read()
    n_old = html.count("document.body.style.overflow")
    if n_old == 0 and 'lockScroll' in html:
        print(p, 'al gedaan'); continue
    if n_old == 0:
        print(p, 'geen overflow-calls'); continue
    # helper toevoegen vóór de menu-toggle button
    if 'lockScroll' not in html:
        html = html.replace('<button class="menu-toggle"', HELPER + '<button class="menu-toggle"', 1)
    # calls vervangen (let op variaties in whitespace)
    html = html.replace("document.body.style.overflow='hidden'", "lockScroll(true)")
    html = html.replace('document.body.style.overflow="hidden"', "lockScroll(true)")
    html = html.replace("document.body.style.overflow=''", "lockScroll(false)")
    html = html.replace('document.body.style.overflow = "";', "lockScroll(false)")
    html = html.replace("document.body.style.overflow = '';", "lockScroll(false)")
    html = html.replace("document.body.style.overflow='';", "lockScroll(false)")
    open(p, 'w', encoding='utf-8').write(html)
    rest = [m for m in re.findall(r"document\.body\.style\.overflow", html)]
    print(p, f'vervangen ({n_old}), resterend: {len(rest)}')
