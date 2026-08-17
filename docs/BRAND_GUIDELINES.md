# Lemnion Brand Guidelines

**Versie:** 1.0
**Datum:** 17 augustus 2026
**Status:** Single source of truth voor alle Lemnion design- en ontwikkelwerk

Dit document beschrijft het complete Lemnion merk. Het is gebaseerd op de bestaande website en repo, niet op een nieuwe visie. Lees dit document plus `AI_BRAND_RULES.md` en `brand-system.json` voordat je iets aan de site verandert.

---

## 1. Brand Overview

**Merk:** Lemnion
**Descriptor:** Hospitality Energy Solutions
**Tagline:** Optimizing Every Watt

Lemnion is een premium energie-infrastructuur- en technologiepartner, specifiek gebouwd voor de hospitality. Het merk draait om het lemniscaat (∞), het symbool van oneindigheid: energie die blijft stromen, kosten die worden geoptimaliseerd, een hotel dat altijd draait.

---

## 2. Brand Positioning

Lemnion staat op het snijvlak van hospitality, energie, technologie, duurzaamheid en bedrijfsresultaat.

**Het merk communiceert:** expertise, vertrouwen, premium kwaliteit, technologische intelligentie, eenvoud, energie-onafhankelijkheid, duurzaamheid, financieel voordeel, betrouwbaarheid, hospitality-kennis en innovatie zonder experimenteel te lijken.

**Zo voelt Lemnion:** een premium energie- en technologiepartner voor de hospitality.

**Zo voelt Lemnion NIET:** geen generieke zonnepaneleninstallateur, geen elektromonteur, geen nutsbedrijf, geen agressieve EV-laadstartup, geen generiek SaaS-bedrijf, geen consumenten-duurzaamheidsmerk.

---

## 3. Brand Architecture

```
LEMNION
└── Hospitality Energy Solutions  (descriptor)
    └── Optimizing Every Watt     (tagline)

Technisch ecosysteem / partnerschap:
    Lemnion  +  Stroomlijnen
```

- **Lemnion** is het merk, het gezicht, de herinnering. Kort, onderscheidend, premium.
- **Hospitality Energy Solutions** is de uitleg. Het beschrijft wat Lemnion doet en voor wie.
- **Optimizing Every Watt** is de belofte en de houding.
- **Stroomlijnen** is de technische uitvoeringspartner. Wordt in de communicatie als partner genoemd, nooit als gelijkwaardig merk boven Lemnion.

**Wanneer wat gebruiken:**
- **Alleen "Lemnion":** logo's, iconen, socials, kort merkgebruik, zodra het merk bekend is.
- **"Lemnion" + descriptor:** website header, briefpapier, offertes, contracten, eerste kennismaking.
- **"Optimizing Every Watt":** hero, campagnes, presentaties, als afsluitende regel onder het merk.
- **"Lemnion + Stroomlijnen":** als partnership-lockup bij technische of uitvoeringsclaims.

**Nooit afkorten tot HES.** Vermijd de afkorting volledig, ook in tekst.

---

## 4. Logo System

### 4.1 Het merkteken

Het Lemnion merkteken is een lemniscaat (∞) als doorlopende energieband, met een horizontale gradient van `#7FBF3A` → `#B7E08A` → `#7FBF3A`, afgeronde uiteinden, en twee "energiepuntjes" (cirkels) die door de lus stromen.

Canonieke pad (deel door alle lockups):

```
M40 120 C0 120 0 40 40 40 C80 40 80 120 120 120 C160 120 160 40 120 40 C80 40 80 120 40 120 Z
```

### 4.2 Varianten en bronbestanden

| Variant | Bestand | Status |
|---|---|---|
| Symbool (∞) | `assets/lemnion-mark.svg` | Bestaand |
| Horizontaal (symbool + lemnion) | `assets/lemnion-logo.svg` | Bestaand |
| Wit voor donkere achtergrond | `assets/lemnion-logo-white.svg` | Bestaand |
| Raster PNG versies | `assets/lemnion-logo.png`, `assets/lemnion-mark.png`, `assets/lemnion-logo-white.png` | Bestaand |
| OG afbeelding | `assets/logo-og.png` | Bestaand |

**Navigatie-lockup (volledige handtekening)** wordt in de site als HTML opgebouwd: symbool (inline SVG) + woordmerk "lemnion" + descriptor "HOSPITALITY ENERGY SOLUTIONS". Deze opbouw blijft de standaard.

### 4.3 Woordmerk

- "lemnion" in kleine letters, Montserrat weight 700, letter-spacing -1px (grote maten) of -0.5px (navigatie).
- Kleur: `#0F3D23` op lichte achtergrond, `#FFFFFF` op donkere achtergrond.
- Descriptor in hoofdletters, Inter weight 600, letter-spacing 2.5px, kleur `#2E7032`.

### 4.4 Favicon

Nieuwe set in `assets/brand/favicon/`:
`favicon.svg`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` (180), `favicon-192.png`, `favicon-512.png`.

Koppel in elke pagina met:

```html
<link rel="icon" href="/assets/brand/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/favicon/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/brand/favicon/apple-touch-icon.png">
```

---

## 5. Logo Usage

### 5.1 Minimale grootte

- Desktop: symbool minimaal 34px hoog, horizontaal logo minimaal 96px breed.
- Mobiel: symbool minimaal 30px hoog.
- Print: symbool minimaal 12mm breed.

### 5.2 Duidelijke ruimte (clear space)

Rond het logo geldt een vrije zone ter hoogte van de helft van de symboolhoogte, aan alle zijden. Plaats geen tekst, afbeeldingen of randen in deze zone.

### 5.3 Achtergrondregels

**Toegestaan:** wit, licht neutraal (`#F5F7F2`), primair groen (`#0F3D23`), donkere merkkleur (`#163D26`, `#0A2E1A`), goedgekeurde fotografie met voldoende contrast.

**Vermijden:** visueel drukke achtergronden, laag contrast, ongecontroleerde gradients.

### 5.4 Niet toegestaan

Het logo mag nooit:
- uitgerekt, samengedrukt of geroteerd worden
- willekeurig worden herkleurd
- worden voorzien van een contour of drop shadow
- op een achtergrond met onvoldoende contrast worden geplaatst
- in een ander lettertype worden nagemaakt

---

## 6. Colour Palette

Bron: `assets/brand/tokens.css`. Alle waarden zijn geëxtraheerd uit de live site.

### 6.1 Primair

| Token | Hex | Gebruik |
|---|---|---|
| `--lemnion-primary` | `#0F3D23` | Merkkern, donkere achtergronden, koppen op licht |
| `--lemnion-secondary` | `#2E7032` | Descriptors, "optimaal" staten, secundaire accenten |
| `--lemnion-accent` | `#7FBF3A` | CTA's, focus, actieve staten, energie-accenten |
| `--lemnion-accent-hover` | `#6FAA2E` | CTA hover |
| `--lemnion-light` | `#B7E08A` | Logo-gradient, highlights, footer hover |
| `--lemnion-deep-0` | `#0A2E1A` | Hero-gradient start |
| `--lemnion-deep-1` | `#163D26` | Hero-gradient einde, sectie-gradients |

### 6.2 Neutraal

| Token | Hex | Gebruik |
|---|---|---|
| `--neutral-white` | `#FFFFFF` | Oppervlakken, cards |
| `--neutral-50` | `#F5F7F2` | Pagina-achtergrond (off-white) |
| `--neutral-100` | `#F0F5EA` | Lichte groentint (highlights) |
| `--neutral-300` | `#D4DDD0` | Borders |
| `--neutral-400` | `#A0AEA0` | Placeholders, disabled tekst |
| `--neutral-500` | `#556B58` | Muted tekst |
| `--neutral-700` | `#3D4F40` | Card body tekst |
| `--neutral-900` | `#2F3437` | Primaire tekst |

### 6.3 Semantisch

| Token | Hex | Gebruik |
|---|---|---|
| `--color-success` | `#27AE60` | Succes (beperkt gebruikt) |
| `--color-warning` | `#E67E22` | Waarschuwing (beperkt gebruikt) |
| `--color-error` | `#C0392B` | Fout |
| `--color-error-soft-bg` | `#FFF3F0` | Waarschuwingscallout achtergrond |
| `--color-error-soft-border` | `#E8A090` | Callout border/tekst |
| `--color-info` | `#33658A` | Voorgesteld, nog niet in gebruik |

### 6.4 Gradients

- Hero: `linear-gradient(160deg, #0A2E1A 0%, #0F3D23 40%, #163D26 100%)`
- Sectie: `linear-gradient(135deg, #0F3D23, #163D26)`
- Accent glow: `radial-gradient(circle, rgba(127,191,58,0.1) 0%, transparent 70%)`

**Regel:** introduceer geen nieuwe kleuren. Zie `AI_BRAND_RULES.md`.

---

## 7. Typography

### 7.1 Fonts

- **Display (koppen, labels, knoppen):** Montserrat, weights 500 / 600 / 700.
- **Body:** Inter, weights 400 / 500 / 600.

Geladen via Google Fonts: `family=Inter:opsz@14..32&family=Montserrat:wght@500;600`.

### 7.2 Schaal

| Stijl | Family | Weight | Grootte | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Display / H1 | Montserrat | 600 | `clamp(2rem, 5vw, 3.5rem)` | 1.2 | -0.02em |
| H2 | Montserrat | 600 | `clamp(1.5rem, 3.5vw, 2.5rem)` | 1.2 | -0.01em |
| H3 | Montserrat | 600 | `clamp(1.1rem, 2vw, 1.5rem)` | 1.2 | 0 |
| H4 | Montserrat | 500 | `1.1rem` | 1.2 | 0 |
| Body Large | Inter | 400 | `1.15rem` | 1.7 | 0 |
| Body | Inter | 400 | `1rem` | 1.65 | 0 |
| Body Small | Inter | 400 | `0.95rem` | 1.65 | 0 |
| Small | Inter | 400 | `0.9rem` | 1.65 | 0 |
| XS | Inter | 400 | `0.85rem` | 1.65 | 0 |
| Caption / label | Inter | 400 | `0.8rem` | 1.65 | 0 |
| Navigatie | Inter | 500 | `0.9rem` | 1.65 | 0 |
| Button | Montserrat | 500 | `0.95rem` | 1.2 | 0 |
| Section label | Montserrat | 500 | `0.8rem` | 1.2 | 0.15em, uppercase |

### 7.3 Merkregels voor typografie

Koppen voelen confident, bondig, premium, helder en modern. Vermijd overmatig gebruik van hoofdletters, overmatig technische typografie, overmatig futuristische typografie, te veel vetgedrukte tekst en lange gecentreerde alinea's.

Body tekst moet zeer leesbaar blijven voor hoteleigenaren, general managers, asset managers, CFO's, facility managers en operationele teams.

---

## 8. Spacing

8px basisschaal, tokens in `tokens.css` sectie 5.

`0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` (px) via `--space-0` t/m `--space-24`.

- Sectie padding: desktop `5rem` (80px), mobiel `2rem` (32px).
- Container: max `1200px`, padding desktop `1.5rem`, mobiel `1rem`.
- Bestaande lichte afwijkingen (0.35rem, 0.4rem, 0.6rem, 0.8rem, 0.85rem) worden gedocumenteerd en bij refactors naar de schaal gezet. Layouts worden niet zomaar gewijzigd.

---

## 9. Buttons

### 9.1 Primaire CTA (`.btn-primary`)

Voorbeeld: "Bereken je besparing"

- Achtergrond `#7FBF3A`, tekst `#0F3D23`, geen border
- Radius `50px` (pill), padding `0.85rem 2rem`, Montserrat 500, `0.95rem`
- Min hoogte `44px`
- Hover: achtergrond `#6FAA2E`, `translateY(-1px)`, glow `0 6px 20px rgba(127,191,58,0.35)`
- Focus: `outline: 2px solid #7FBF3A; outline-offset: 2px`

### 9.2 Secundaire CTA (`.btn-outline`)

Voorbeeld: "Ontdek hoe het werkt"

- Transparante achtergrond, tekst `#0F3D23`, border `2px solid #0F3D23`
- Hover: achtergrond `#0F3D23`, tekst `#F5F7F2`

### 9.3 Tertiair / tekst CTA (`.btn-ghost` op donker)

Voorbeeld: "Lees meer"

- Transparant, tekst `#F5F7F2`, border `1.5px solid rgba(245,247,242,0.3)`
- Hover: achtergrond `rgba(245,247,242,0.1)`, border `#F5F7F2`

### 9.4 Grootte

- Desktop: padding `0.85rem 2rem`, tekst `0.95rem`.
- Mobiel (tot 480px): padding `0.5rem 0.85rem`, tekst `0.8rem`.
- Minimale touch target: `44x44px` op alle interactieve elementen.

---

## 10. Forms

Forms voelen professioneel, eenvoudig en betrouwbaar.

| Element | Default | Focus | Overig |
|---|---|---|---|
| Text/email/tel input | `1.5px solid #D4DDD0`, radius `8px`, padding `0.75rem 1rem`, wit | border `#7FBF3A` + ring `0 0 0 3px rgba(127,191,58,0.15)` | placeholder `#A0AEA0` |
| Textarea | idem, min-height `120px`, `resize: vertical` | idem | |
| Label | Inter 600, `0.85rem`, kleur `#0F3D23` | | verplicht: `*` in `#7FBF3A` |
| Checkbox / toggle | accent `#7FBF3A` | | |

Fout-, succes- en disabled-staten gebruiken de semantische kleuren uit sectie 6.3.

---

## 11. Cards

Eén coherente kaartenfamilie, geen vijftien varianten.

**Basis card:** achtergrond wit, border `1px solid #D4DDD0`, radius `20px`, padding `2rem`, shadow `0 4px 24px rgba(15,61,35,0.06)`.

Varianten bouwen hierop voort:
- **Problem / benefit card:** basis card + icoon `48px` in `#7FBF3A` boven de titel.
- **Statistiek / KPI card:** basis card + grote Montserrat waarde.
- **Scenario benefit (inline):** kleinere radius `12px`, padding `1rem`.
- **Card op donkere sectie:** `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.1)`.

---

## 12. Icons

Stijl: inline SVG, clean, minimaal, technisch en begrijpelijk, consistente stroke breedte. Energie-stroomlijnen gebruiken `stroke-width: 2.5` met ronde lijnuiteinden (`stroke-linecap: round`).

Kleur: `#7FBF3A` voor iconen, `currentColor` waar het icoon de tekstkleur moet volgen.

Concepten: batterij, elektriciteit, EV-laden, zonne-energie, EMS, net, hotel, besparing, omzet, weerbaarheid, veiligheid, monitoring, duurzaamheid.

Meng geen iconenstijlen. Voeg geen nieuw icoon toe in een afwijkende stijl.

---

## 13. Photography

Fotografie versterkt altijd: energieoplossingen in een echte hospitality-omgeving.

**Hospitality:** premium hotels, boutique hotels, stadshotels, resorts, congreshotels.

**Energie-infrastructuur:** batterijsystemen, EV-laden, elektrische infrastructuur, dakzonnepanelen.

**Menselijke context:** hoteloperators, hotelgasten, facility managers, hotelparkeergarages, hospitality-omgevingen.

**Vermijden (clichématig):** losse blaadjes, handen met plantjes, generieke windturbines, geïsoleerde zonnevelden.

---

## 14. Data Visualisation

Diagrammen en data gebruiken het Lemnion kleurensysteem en zijn ook zonder kleur begrijpbaar.

- Lijngewichten: `2px` tot `2.5px`, rond.
- Gridlijnen: `#D4DDD0`, subtiel.
- Typografie: Inter voor labels, Montserrat voor titels.
- Positief: accent `#7FBF3A` of secundair `#2E7032`. Negatief: `#C0392B`.
- Legends en annotaties altijd in leesbare grootte (minimaal `0.8rem`).
- Onderscheid niet alleen via kleur: gebruik ook lijnstijl, arcering of labels.

Toepassingen: energie-stroomdiagrammen, hotel-energieprofielen, piekbelasting, batterij laden/ontladen, zonopwekking, net import/export, EV-laden, ROI-visualisaties, voor/na vergelijkingen.

---

## 15. Energy Diagrams

De herkenbare Lemnion visual voor het energie-ecosysteem:

```
NET (grid)
   ↓
EMS  ↔  BATTERIJ  ↔  ZON  ↔  HOTEL  ↔  EV-LADEN
```

Diagrammen voelen eenvoudig, intelligent, modulair en technisch maar begrijpelijk. Geen complexe elektrotechnische schema's voor algemene sitebezoekers.

Animaties (bestaand, behouden): `flowDot` (stroompuntjes die door de lijnen bewegen), `pulseGreen`, `pulseGlow`.

---

## 16. Accessibility

Doel: WCAG 2.2 AA minimum, zonder de bestaande identiteit onnodig op te geven.

- Body tekst, navigatie, knoppen en links voldoen aan AA (zie audit, sectie 3).
- Tekst op groene achtergronden: off-white `#F5F7F2` (11.37:1 op `#0F3D23`).
- Section-labels in accent `#7FBF3A` op wit voldoen NIET (2.23:1). Bij refactor: gebruik secundair groen `#2E7032` (6.03:1).
- Callout tekst `#E8A090` op `#FFF3F0` voldoet NIET (1.96:1). Bij refactor: tekst op `#C0392B`.
- Focus altijd zichtbaar: `outline: 2px solid #7FBF3A; outline-offset: 2px`.
- Skip-link aanwezig en behouden.
- Minimale touch target `44x44px`.

---

## 17. Responsive Behaviour

Breakpoints: `480px`, `768px`, `1024px`.

- **320px+ en 375px+:** één kolom, hero teksten gecentreerd, section padding `2rem`, buttons volle breedte (max 280px).
- **430px+:** idem als 375px.
- **768px+:** navigatie compact, logo 34px, grids naar twee kolommen.
- **1024px+:** navigatie volledig, logo 40px.
- **1280px+ / 1440px+:** container max `1200px` blijft gecentreerd.

Deze schaling is al aanwezig in de site en wordt niet gewijzigd. Typografie schaalt via `clamp()`.

---

## 18. Design Tokens

De centrale bronnen:

- `assets/brand/tokens.css` (CSS custom properties, live te koppelen)
- `assets/brand/brand.config.js` (JS/TS config)
- `docs/brand-system.json` (machine-readable)

Alle kleuren, typografie, spacing, radius, borders, shadows, containers, breakpoints, transities, z-index en componenttokens staan hier. Dupliceer brandwaarden niet in componenten.

---

## 19. Do / Don't

**Do**
- Gebruik de tokens uit `tokens.css`.
- Hergebruik bestaande componenten en patronen.
- Gebruik het lemniscaat als herkenbaar grafisch element.
- Behoud het premium hospitality-energiegevoel.
- Houd WCAG 2.2 AA aan.

**Don't**
- Geen nieuwe kleuren of fonts introduceren.
- Geen willekeurige spacing of radius verzinnen.
- Geen nieuwe iconenstijl.
- Geen componenten herontwerpen zonder expliciete opdracht.
- Geen em dash (—) of en dash (–) als stijlmiddel in copy.

---

## 20. Copy Style (brand voice)

Toon: deskundig, helder, commercieel intelligent, kalm, zelfverzekerd, praktisch, hospitality-gericht, technisch geloofwaardig.

Vermijd onnodige vaktaal. Waar een technische term nodig is, leg deze uit.

Communicatiemodel:

```
Hotelprobleem
   ↓
Operationele consequentie
   ↓
Energieoplossing
   ↓
Financieel of operationeel voordeel
```

Vermijd typische AI-formuleringen en AI-achtige interpunctie. Gebruik normale Nederlandse zinsbouw met komma's, punten, dubbele punten en waar passend puntkomma's.

**Taalconsistentie:** de merkidentiteit blijft identiek in Nederlands, Engels, Frans en Spaans. Geen aparte visuele identiteit per taal. Houd rekening met tekstuitloop in vertalingen: knoppen, navigatie en cards moeten langere labels kunnen dragen.

---

## 21. Developer Implementation Rules

1. Lees `BRAND_GUIDELINES.md`, `AI_BRAND_RULES.md` en `brand-system.json` voor elke visuele wijziging.
2. Refereer altijd naar de tokens, nooit naar hardcoded waarden.
3. Hergebruik bestaande componenten.
4. Behoud de bestaande contentstructuur, navigatie en conversieflows.
5. Wijzig de live site niet visueel zonder noodzaak; documenteer in plaats van automatisch doorvoeren.
6. Bij centralisatie van stijlen: draai visuele regressie op 375px, 430px, 768px, 1024px en 1440px.
