#!/usr/bin/env python3
"""Voeg contextuele 'Verder lezen'-blokken toe aan 15 pagina's (niet index):
- blok vóór <footer>, met data-i18n-keys
- CSS vóór </style>
- EN-vertalingen in translations/en.<pagina>.json
Links zijn root-relative extensionless (consistent met de nieuwe URL-structuur).
"""
import json, os, sys

os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')

# pagina -> (label, [(anchor_tekst_nl, href, en_tekst), ...])
BLOCKS = {
 'netcongestie': ('Verder lezen', [
   ('Bekijk hoe batterij en EMS netcongestie oplossen', '/producten', 'See how a battery and EMS solve grid congestion'),
   ('Alle oplossingen voor netcongestie op een rij', '/oplossingen', 'All grid congestion solutions in one overview'),
 ]),
 'verduurzamen': ('Verder lezen', [
   ('Ontdek welke subsidies uw verduurzaming versnellen', '/subsidies', 'Discover which grants accelerate your sustainability plans'),
   ('Bekijk onze producten voor verduurzaming', '/producten', 'Explore our products for going green'),
 ]),
 'maximum-belasting': ('Verder lezen', [
   ('Bereken uw besparing met de configurator', '/configurator', 'Calculate your savings with the configurator'),
   ('Bekijk hoe wij pieken snijden', '/producten', 'See how we cut peak loads'),
 ]),
 'stroom-overschot': ('Verder lezen', [
   ('Sla uw zonne-energie op met onze batterijen', '/producten', 'Store your solar energy with our batteries'),
   ('Alle oplossingen voor stroomoverschot', '/oplossingen', 'All solutions for solar surplus'),
 ]),
 'stroomuitval-noodaggregaat': ('Verder lezen', [
   ('Vervang uw dieselaggregaat door een batterij', '/producten', 'Replace your diesel generator with a battery'),
   ('Bekijk alle oplossingen voor stroomzekerheid', '/oplossingen', 'See all solutions for power security'),
 ]),
 'usp-veiligheid': ('Verder lezen', [
   ('Bekijk onze producten en veiligheidsarchitectuur', '/producten', 'Explore our products and safety architecture'),
   ('Ontdek de voordelen voor uw hotel', '/voordelen', 'Discover the benefits for your hotel'),
 ]),
 'blog': ('Verder lezen', [
   ('Bekijk onze oplossingen voor hotels', '/oplossingen', 'Explore our solutions for hotels'),
   ('Ontdek de actuele subsidies', '/subsidies', 'Discover current grants and subsidies'),
 ]),
 'blog-epbd-iv-laadinfra': ('Verder lezen', [
   ('Bekijk welke subsidies voor laadinfra gelden', '/subsidies', 'See which grants apply to charging infrastructure'),
   ('Bekijk onze laadproducten', '/producten', 'Explore our charging products'),
 ]),
 'nieuws': ('Verder lezen', [
   ('Bekijk de actuele subsidies op een rij', '/subsidies', 'See the current grants at a glance'),
   ('Ontdek onze oplossingen', '/oplossingen', 'Discover our solutions'),
 ]),
 'voordelen': ('Verder lezen', [
   ('Bereken uw besparing met de configurator', '/configurator', 'Calculate your savings with the configurator'),
   ('Bekijk onze producten', '/producten', 'Explore our products'),
 ]),
 'over-ons': ('Verder lezen', [
   ('Ontdek de voordelen voor uw hotel', '/voordelen', 'Discover the benefits for your hotel'),
   ('Bekijk onze producten', '/producten', 'Explore our products'),
 ]),
 'oplossingen': ('Verder lezen', [
   ('Bekijk onze producten', '/producten', 'Explore our products'),
   ('Ontdek de actuele subsidies', '/subsidies', 'Discover current grants'),
 ]),
 'producten': ('Verder lezen', [
   ('Bereken uw besparing met de configurator', '/configurator', 'Calculate your savings with the configurator'),
   ('Ontdek welke subsidies gelden', '/subsidies', 'Discover which grants apply'),
 ]),
 'subsidies': ('Verder lezen', [
   ('Bekijk onze producten voor laadinfra', '/producten', 'Explore our charging products'),
   ('Bereken uw besparing', '/configurator', 'Calculate your savings'),
 ]),
 'configurator': ('Verder lezen', [
   ('Bekijk onze producten', '/producten', 'Explore our products'),
   ('Ontdek de actuele subsidies', '/subsidies', 'Discover current grants'),
 ]),
}

CSS = ("/* Verder lezen (interne linkbuilding) */\n"
       ".related-links{margin:2.5rem 0 1rem;padding:1.6rem 2rem;"
       "background:#F5F7F2;border:1px solid #D4DDD0;border-radius:16px;"
       "display:flex;gap:0.9rem;flex-wrap:wrap;align-items:center}\n"
       ".related-links .section-label{margin:0;flex-basis:100%}\n"
       ".related-links .btn{margin:0}\n")

for page, (label, links) in BLOCKS.items():
    fn = page + '.html'
    html = open(fn, encoding='utf-8').read()
    if 'related-links' in html:
        print(f"{fn}: al aanwezig, overslaan")
        continue
    # 1) CSS injecteren vóór </style>
    if '</style>' not in html:
        print(f"{fn}: GEEN </style>, overslaan")
        continue
    html = html.replace('</style>', CSS + '</style>', 1)
    # 2) blok bouwen
    links_html = '\n'.join(
        f'    <a class="btn btn-primary" href="{href}" data-i18n="{page}.rl{i+1}">{txt}</a>'
        for i, (txt, href, _en) in enumerate(links))
    block = (f'<!-- Verder lezen (interne linkbuilding) -->\n'
             f'<aside class="related-links">\n'
             f'  <span class="section-label" data-i18n="{page}.label">{label}</span>\n'
             f'{links_html}\n'
             f'</aside>\n\n')
    if '<footer' not in html:
        print(f"{fn}: GEEN <footer>, overslaan")
        continue
    html = html.replace('<footer', block + '<footer', 1)
    open(fn, 'w', encoding='utf-8').write(html)
    # 3) EN-vertalingen
    tpath = f'translations/en.{page}.json'
    if os.path.exists(tpath):
        d = json.load(open(tpath, encoding='utf-8'))
    else:
        d = {}
    d[f'{page}.label'] = 'Keep reading'
    for i, (_txt, _href, en) in enumerate(links):
        d[f'{page}.rl{i+1}'] = en
    json.dump(d, open(tpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f"{fn}: blok + CSS + {len(links)+1} vertaalkeys")
print("klaar")
