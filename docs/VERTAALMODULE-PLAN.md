# Vertaalmodule Lemnion-site — Concreet plan (Optie 3: build-time)

Status: VOORSTEL — nog niet uitgevoerd. Auteur: Hermes, voor Jacob (aug 2026).
Doel: veilige, efficiënte meertalige site (NL basis + EN, later FR/ES) zonder
Google Translate-widget, met echte URL's per taal en volledige SEO-ondersteuning.

---

## 1. Uitgangspunten

- **NL blijft de bron van waarheid** in de repo. Vertalingen zijn dictionaries.
- **Geen runtime-JS voor vertaling**: alle talen worden bij de build als
  statische pagina's gegenereerd → geen layout-bugs, werkt zonder JS, SEO-proof.
- **Fallback-regel**: ontbreekt een vertaling → pagina toont gewoon NL. De site
  kan nooit kapot of half-vertaald online staan.
- **Bestaande techniek blijft**: statische HTML, zelfde tokens/huisstijl
  (MASTER_INSTRUCTION + lemnion-brand-skill), zelfde cronflow, Cloudflare Pages.
- **Eerst EN, daarna FR/ES**: één mechanisme, een nieuwe taal = één JSON erbij.

## 2. Architectuur (in één zin)

Een klein Node-script `build.mjs` in de repo leest de NL-pagina's, vervangt
gemarkeerde teksten (`data-i18n` attributen) met de woordenboeken
`translations/{en,fr,es}.json`, en schrijft het resultaat naar `dist/`:
`dist/index.html` (NL), `dist/en/index.html`, enz. Cloudflare Pages draait het
script bij elke deploy en serveert `dist/`.

```
hes-website/
├── build.mjs                  # NIEW: build-script (Node, geen dependencies)
├── translations/
│   ├── en.json                # NIEW: NL→EN woordenboek (per pagina/key)
│   ├── fr.json                # later
│   └── es.json                # later
├── content/
│   ├── nieuws.json            # NIEW: nieuws-items (velden: nl, en, fr, es)
│   ├── subsidies.json         # NIEW: subsidieblokken (nl, en)
│   └── ...                    # dynamische content als data
├── *.html                     # GEWIJZIGD: data-i18n="pagina.key" op vertaalbare elementen
└── dist/                      # GENERATED (niet committen): /, /en/, /fr/, /es/
```

## 3. Stappen (uitvoeringsvolgorde zodra akkoord)

### Stap 0 — Cloudflare Pages build aanzetten (1 wijziging, via API)
- `build_command: "node build.mjs"`, `destination_dir: "dist"`.
- Pages bouwt dan automatisch bij elke push (ook cron-pushes via content→main).
- Eerst op een **test-branch** (preview-deployment) valideren, pas daarna main.

### Stap 1 — `build.mjs` bouwen (het hart)
- Parse elke `*.html` (zonder build-tooling: simpele string/regex-vervanging is
  hier prima en betrouwbaar).
- Vervang `data-i18n="key"`-elementen: tekst = `translations/<taal>.json[key]`
  (alleen als de key bestaat; anders originele NL-tekst laten staan = fallback).
- Pas per taal aan: `<html lang="en">`, injecteer `<link rel="alternate"
  hreflang="nl|en|fr|es">` + `hreflang="x-default"` en correcte `canonical`.
- Genereer `dist/` (NL), `dist/en/`, en later `dist/fr/`, `dist/es/`.
- Kopieer assets/fonts/favicon/robots/sitemap mee.
- Log per taal hoeveel keys ontbreken (fallback-melding), zodat we nooit
  ongemerkt half-vertaald deployen.

### Stap 2 — Taalwisselaar in de navigatie
- Kleine switcher (NL | EN | FR | ES) in de nav, links naar `/en/<zelfde-pagina>`.
- Eigen stijl volgens tokens (accent, focus-ring WCAG), mobiel in het menu.
- Niet afhankelijk van JS: gewone `<a>`-links.

### Stap 3 — Woordenboeken + pagina's markeren
- Nav/footer en alle vaste labels: `data-i18n` attributen op de elementen
  (mechanisch werk over 17 pagina's; nav verschilt licht per pagina, dus per
  pagina markeren).
- `translations/en.json` met keys `index.hero_title`, `nav.oplossingen`, enz.
- **Volgorde**: eerst `index.html` + chrome (nav/footer) volledig, dan
  `oplossingen`, `producten`, `over-ons`, `voordelen`, `verduurzamen`.
  Blog- en diepte-artikelen mogen in MVP op NL vallen (fallback) en later.

### Stap 4 — Dynamische content data-driven maken (nieuws/subsidies/blog)
- De cronjobs schrijven nu rechtstreeks HTML (nieuws.html, subsidies.html).
  Dit verhuist naar `content/nieuws.json` en `content/subsidies.json` met
  per item velden: `nl`, `en` (later `fr`, `es`).
- `build.mjs` genereert `nieuws.html` en `en/nieuws.html` uit hetzelfde JSON.
- **De cron-agent levert voortaan beide talen aan** (de prompt wordt uitgebreid:
  "schrijf het item in NL én EN"). Kwaliteit onder controle, geen machine-vertaling.
- Ontbreekt `en` bij een item → item verschijnt in /en/ als NL (fallback) met
  log-melding, nooit weg.

### Stap 5 — SEO compleet
- `sitemap.xml`: huidige verwijst nog naar **lemnion.com** → herstellen naar
  lemnion.nl + taalvarianten (hreflang-annotaties of aparte sitemaps).
- `robots.txt` controleren; canonical per taal; `lang` attributen correct.

### Stap 6 — Testen op dev/preview (verplicht vóór main)
- Branch → automatische preview-URL (elke branch krijgt er al één).
- Check: EN-teksten die langer zijn dan NL (brandregel: tekstuitloop mag),
  geen gebroken layout, switcher werkt, WCAG (focus, lang-switch),
  fallback-gedrag, sitemap.
- Daarna PR dev → main → live.

### Stap 7 — FR/ES later
- Nieuwe taal = `translations/fr.json` + content-velden uitbreiden. Script en
  structuur blijven identiek.

## 4. Werkt dit meteen voor nieuwe content? — JA, met deze afspraken

| Type nieuwe content | Werkt automatisch? | Hoe |
|---|---|---|
| Nieuwe tekst in bestaande sectie | Ja, zodra key+vertaling in dictionary staat | Hermes voegt bij het schrijven de key + EN-tekst toe; build pakt het mee |
| Nieuw nieuws-item / subsidie-update (cron) | **Ja, volledig** | Cron levert nl+en aan in content JSON → build genereert beide talen |
| Nieuwe pagina | Ja, als hij data-i18n gebruikt | Nieuwe keys in dictionary; anders valt hij op NL terug (nog steeds live) |
| Vertaling nog niet klaar | Ja, veilig | Fallback op NL; site blijft heel; log toont wat mist |

Kort: zodra het systeem staat, is nieuwe content in 2 talen een kwestie van
"aanleveren in de JSON" — de build doet de rest. Zonder vertaling breekt er
nooit iets (NL-fallback).

## 5. Risico's & beheersing

- **Publieke repo-inhoud (huidige situatie!)**: omdat Pages nu zonder build de
  repo-root serveert, staan álle bestanden publiek op lemnion.nl — o.a.
  `HES_Budget_2026-2029.xlsx` (financieel model) en `docs/*.md` zijn
  downloadbaar. Met de build naar `dist/` is dit automatisch opgelost (alleen
  dist/ wordt geserveerd). Tot de build er is: gevoelige bestanden uit de
  repo-root (of de hele repo privaat maken op GitHub).
- **Dictionary-drift** (key mist): fallback NL + build-log per taal → zichtbaar.
- **Layout door langere EN-teksten**: brandregel staat tekstuitloop toe; testen
  op preview bij elke stap; CSS waar nodig (min-width, wrap) zonder nieuwe tokens.
- **Cronflow**: ombouw van HTML-schrijvend naar JSON-schrijvend is de grootste
  wijziging → apart testen op content-branch vóór auto-merge aanpassen.
- **GitHub Pages-mirror** (jacobdegraaff.github.io/hes-website, legacy): blijft
  NL-only draaien of wordt later uitgezet; niet het live doelwit.
- **Build-fout**: Pages deployment faalt dan (geen kapotte site live); preview
  vangt het vóór main.

## 6. Wat NIET verandert

- Huisstijl/tokens (lemnion-brand skill, MASTER_INSTRUCTION).
- Statische aanpak en cronflow (content → auto-merge → main → live).
- Geen nieuwe frameworks, geen runtime-vertaling, geen externe vertaaldiensten.

## 7. Beslissingen (vastgelegd, aug 2026)

1. **Eerste taal: EN** (FR/ES later, zelfde mechanisme).
2. **Alles meteen EN** — ook blog/diepte-artikelen; Jacob reviewt de technische
   claims in de EN-versies op dev vóór livegang.
3. **Plan gecommit als voorstel** op de dev-branch (transparant voor Melle);
   de publieke-bestanden-bevinding (par. 5) wordt meegenomen in de uitvoering.
