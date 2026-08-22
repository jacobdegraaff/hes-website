#!/usr/bin/env python3
"""Verificatie van de interne linkstructuur in dist/ (na URL-normalisatie)."""
import os, re

files_nl = {f for f in os.listdir('dist') if f.endswith('.html')}
files_en = {f for f in os.listdir('dist/en') if f.endswith('.html')}
broken, html_resten, emdash = [], [], []

def check(page_path):
    html = open(page_path, encoding='utf-8').read()
    for m in re.finditer(r'href="(/[^"]*)"', html):
        h = m.group(1)
        if h.startswith(('http', 'mailto:', 'tel:', 'data:', '#')) or h == '/':
            continue
        if '.html' in h:
            html_resten.append((page_path, h))
        path, _, anchor = h.partition('#')
        if path in ('/', ''):
            continue
        if path.startswith('/en/'):
            slug = path[4:].strip('/')
            if slug == '':
                continue
            target = 'dist/en/' + slug
            if not (os.path.exists(target) or os.path.exists(target + '.html') or os.path.isdir(target)):
                broken.append((page_path, h))
        else:
            slug = path.strip('/')
            target = 'dist/' + slug
            if not (os.path.exists(target) or os.path.exists(target + '.html') or os.path.isdir(target)):
                broken.append((page_path, h))
    if '/en/' in page_path:
        for mm in re.finditer(r'[^\n]*\u2014[^\n]*', html):
            emdash.append((page_path, mm.group(0)[:80]))

for f in files_nl:
    check(f'dist/{f}')
for f in files_en:
    check(f'dist/en/{f}')

print("broken interne links:", len(broken))
for b in broken[:10]:
    print("  ", b)
print(".html-resten in interne links:", len(html_resten))
for h in html_resten[:10]:
    print("  ", h)
print("em-dashes in EN-output:", len(emdash))
for e in emdash[:5]:
    print("  ", e)

# orphan-check: elke sitemap-URL moet via interne links bereikbaar zijn
sm = open('dist/sitemap.xml').read()
locs = set(re.findall(r'<loc>(https://lemnion\.nl[^<]*)</loc>', sm))
alle_links = set()
for root, _, fs in os.walk('dist'):
    for f in fs:
        if f.endswith('.html'):
            html = open(os.path.join(root, f), encoding='utf-8').read()
            for m in re.finditer(r'href="(/[^"]*)"', html):
                h = m.group(1)
                if not h.startswith(('http', 'mailto:', 'tel:', 'data:', '#')):
                    alle_links.add(h.partition('#')[0])
bereikbaar = set()
for l in alle_links:
    if l == '/':
        bereikbaar.add('https://lemnion.nl/')
    elif l == '/en/':
        bereikbaar.add('https://lemnion.nl/en/')
    elif l.startswith('/en/'):
        bereikbaar.add('https://lemnion.nl/en/' + l[4:].strip('/'))
    else:
        bereikbaar.add('https://lemnion.nl' + l)
orphans = locs - bereikbaar
print("sitemap-URLs:", len(locs), "| via links bereikbaar:", len(locs.intersection(bereikbaar)), "| orphans:", len(orphans))
for o in orphans:
    print("  ORPHAN:", o)
