#!/usr/bin/env python3
"""Normaliseer alle interne links in de 16 bronpagina's:
- relatief "pagina.html"          -> root-relative extensionless "/pagina"
- root-relative "/pagina.html"    -> "/pagina"
- "index.html#anker"              -> "/#anker"
- "/en/index.html"                -> "/en/"
- "/en/<slug>.html"               -> "/en/<en-slug>" (waar mogelijk)
Externe links (https://) en niet-pagina-links (assets, #, mailto) blijven onaangetast.
"""
import os, re, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
PAGES = ['index', 'oplossingen', 'producten', 'over-ons', 'voordelen', 'verduurzamen',
         'usp-veiligheid', 'nieuws', 'subsidies', 'blog', 'blog-epbd-iv-laadinfra',
         'netcongestie', 'maximum-belasting', 'stroom-overschot',
         'stroomuitval-noodaggregaat', 'configurator']
EN_SLUGS = {'index': '', 'oplossingen': 'solutions', 'producten': 'products', 'over-ons': 'about-us',
            'voordelen': 'benefits', 'verduurzamen': 'sustainability', 'usp-veiligheid': 'safety',
            'nieuws': 'news', 'subsidies': 'grants', 'blog': 'blog',
            'blog-epbd-iv-laadinfra': 'blog-epbd-iv-ev-charging-infrastructure',
            'netcongestie': 'grid-congestion', 'maximum-belasting': 'peak-load',
            'stroom-overschot': 'solar-surplus', 'stroomuitval-noodaggregaat': 'power-outage',
            'configurator': 'configurator'}

def norm_href(h):
    """h = waarde van href (zonder quotes). Retourneert genormaliseerde waarde."""
    # extern of niet-pagina: niet aanraken
    if h.startswith(('http://', 'https://', 'mailto:', 'tel:', 'data:', 'javascript:', '#')):
        return h
    # root-relative "/en/<slug>.html" -> "/en/<en-slug>" (of "/en/" voor index)
    m = re.match(r'^/en/([a-z0-9-]+)\.html$', h)
    if m:
        en = EN_SLUGS.get(m.group(1), m.group(1))
        return ('/en/' + en) if en else '/en/'
    # root-relative "/index.html" of "/index.html#anker" -> "/" resp. "/#anker"
    m = re.match(r'^/index\.html(#.*)?$', h)
    if m:
        return '/' + (m.group(1) or '')
    # root-relative "/<slug>.html" of "/<slug>.html#anker" -> extensionless
    m = re.match(r'^/([a-z0-9-]+)\.html(#.*)?$', h)
    if m:
        return '/' + m.group(1) + (m.group(2) or '')
    # relatief "index.html" of "index.html#anker" -> root "/" resp. "/#anker"
    m = re.match(r'^index\.html(#.*)?$', h)
    if m:
        return ('/' + m.group(1)) if m.group(1) else '/'
    # relatief "<slug>.html" of "<slug>.html#anker" -> root-relative extensionless
    m = re.match(r'^([a-z0-9-]+)\.html(#.*)?$', h)
    if m:
        return '/' + m.group(1) + (m.group(2) or '')
    return h  # assets e.d. blijven relatief (build maakt ze root-absoluut voor EN)

changed = 0
for p in sorted(x + '.html' for x in PAGES):
    html = open(p, encoding='utf-8').read()
    new = re.sub(r'href="([^"]*)"', lambda m: f'href="{norm_href(m.group(1))}"', html)
    if new != html:
        open(p, 'w', encoding='utf-8').write(new)
        n = sum(1 for a, b in zip(html.split('href="'), new.split('href="')) if a != b)
        print(f"{p}: {n} href(s) genormaliseerd")
        changed += n
print(f"TOTAAL: {changed} hrefs")
