# Lemnion Brand Audit

**Datum:** 17 augustus 2026
**Bron:** live site lemnion.nl + repo `jacobdegraaff/hes-website` (branch main)
**Methode:** alle 17 HTML pagina's, alle inline `<style>` blokken, alle kleuren, typografie, radii, shadows, breakpoints, z-index, transities en assets geëxtraheerd en vergeleken.

---

## 1. Bestaande sterke punten (behouden)

Deze zaken zijn al consistent en moeten worden behouden:

1. **Eén kleurenpalet, overal identiek.** Alle 17 pagina's dragen dezelfde `:root` variabelen met exact dezelfde waarden (`#0F3D23`, `#2E7032`, `#7FBF3A`, `#B7E08A`, `#F5F7F2`, `#2F3437`, `#556B58`, `#D4DDD0`). Er is geen groen-drift tussen pagina's in de tokens zelf.
2. **Tweefontsysteem, consequent geladen.** Montserrat (display, weights 500/600/700) + Inter (body, variabel) via Google Fonts, op elke pagina.
3. **Responsieve typografie via `clamp()`.** h1/h2/h3 schalen al vloeiend (`clamp(2rem, 5vw, 3.5rem)` etc.).
4. **Herkenbaar logosysteem in vector.** `lemnion-logo.svg`, `lemnion-mark.svg` en `lemnion-logo-white.svg` delen hetzelfde lemniscaat (∞) met horizontale gradient (#7FBF3A → #B7E08A → #7FBF3A) en twee "energiepuntjes". Dit is een sterk, onderscheidend merk.
5. **Eigen energie-visuele taal.** Inline SVG energiediagrammen met geanimeerde stroom (keyframes `flowDot`, `pulseGreen`, `pulseGlow`, `energy-flow` stroke-width 2.5). Uniek en herkenbaar.
6. **Basis toegankelijkheid aanwezig.** Skip-link, `:focus-visible` outline, min 44px touch targets op knoppen en het menu.
7. **Consistente schrijfstijl vastgelegd** in `CONTENT-RICHTLIJNEN.md` (geen em/en dash, natuurlijk Nederlands).

---

## 2. Bestaande inconsistenties

### 2.1 Duplicaat accentgroen (P1)
- Token `--green-accent: #7FBF3A` wordt gebruikt voor CTA's en focus.
- Knop-hover hardcodeert een ander groen: `#6FAA2E` (28 keer in de code).
- Twee visueel bijna identieke accentgroenen zonder formele relatie.

### 2.2 Drie overlappende grijsgroenen voor tekst (P1)
- `#556B58` (token `--text-muted`), `#3D4F40` (card body, 34 keer hardcoded) en `#A0AEA0` (placeholder, 16 keer).
- Deze hebben geen naam en geen onderlinge schaal.

### 2.3 Shadow tokens wijken af van gebruik (P1)
- Token `--shadow: rgba(15,61,35,0.08)`, maar kaarten gebruiken `0.06` (29 keer).
- Token `--shadow-lg: 0 12px 48px ... 0.12`, maar dropdowns/modals gebruiken `0 20px 60px ... 0.12 / 0.2` (32 keer).

### 2.4 Border-radius spreiding (P2)
Waarden in gebruik: `2px`, `3px`, `4px`, `8px`, `10px`, `12px`, `14px`, `16px`, `20px`, `50px`, `50%`. Er is geen vaste schaal.

### 2.5 Z-index chaos (P2)
`1, 2, 10, 98, 99, 100, 101, 102, 103, 200, 999, 99999`. Geen schaal, geen documentatie.

### 2.6 Font-family notatie-drift (P2)
Vier schrijfwijzen voor dezelfde stack: `'Montserrat',system-ui,sans-serif`, `'Montserrat',sans-serif`, `"Montserrat",system-ui,sans-serif`, `Montserrat,sans-serif`. Plus één afwijkende `arial, sans-serif`.

### 2.7 Font-size notatie-drift (P2)
`0.9rem` en `.9rem` naast elkaar, `0.8rem` en `.8rem`, `0.75rem` en `.75rem`. Eén hardcoded `16px`.

### 2.8 Breakpoint-drift (P2)
Canoniek `480px`, `768px`, `1024px`. Eenmalige afwijkingen `600px`, `640px`, `800px`, `900px`.

### 2.9 Transitie-drift (P2)
`0.15s`, `0.2s`, `0.25s`, `0.3s`, `0.6s`, afwisselend met `all` of eigenschap-specifiek.

### 2.10 Per pagina gedupliceerde CSS (P1)
Elke pagina draagt 16 tot 28 KB aan nagenoeg identieke inline `<style>`. Geen gedeeld stylesheet. Hoge onderhoudslast en drift-risico.

### 2.11 Logo per pagina opnieuw inlined (P2)
De navigatie rendert het merkteken als inline SVG met een unieke gradient-id per pagina (bijv. `lemnion-mark-eacf33`). De canonieke bestanden `assets/lemnion-*.svg` worden alleen niet gebruikt in de pagina's (behalve `logo-og.png` voor OG). Risico op id-botsingen en dubbele bronnen.

### 2.12 Geen favicon (P1)
Geen `<link rel="icon">`, geen favicon-bestand. Browsers tonen het standaard globepictogram.

### 2.13 Verouderde HES-assets (P1)
`hes-logo.png`, `logo-2026.png`, `logo-transparent.png`, `logo-monogram.png`, `logo-monogram-v2.png` en `assets/HES_Brand_Guidelines.pdf` (1,6 MB) zijn oude HES-branding en staan nog in de repo.

### 2.14 Near-duplicate lichte tint (P2)
`#F0F5EA` (8 keer) en `#EFF3EC` (1 keer) zijn visueel identieke lichte groentinten.

---

## 3. Toegankelijkheid (WCAG 2.2 AA)

Contrastmetingen van de belangrijkste combinaties:

| Combinatie | Contrast | Status |
|---|---|---|
| Off-white tekst op primair groen (hero/footer) | 11.37:1 | Voldoet AA |
| Primair groen op off-white (koppen) | 11.37:1 | Voldoet AA |
| Dark-grey tekst op off-white/wit (body) | 11.68:1 / 12.60:1 | Voldoet AA |
| Text-muted #556B58 op wit | 5.78:1 | Voldoet AA |
| Secundair groen #2E7032 op wit | 6.03:1 | Voldoet AA |
| Accent #7FBF3A op primair groen (CTA tekst) | 5.50:1 | Voldoet AA |
| **Accent #7FBF3A op wit (section-label)** | **2.23:1** | **Faalt AA** |
| **Callout tekst #E8A090 op #FFF3F0** | **1.96:1** | **Faalt AA** |
| Success #27AE60 op wit | 2.87:1 | Faalt AA normaal |
| Warning #E67E22 op wit | 2.85:1 | Faalt AA normaal |
| Knop-hover tekst (primair groen op #6FAA2E) | 4.36:1 | Faalt AA normaal (net) |
| Placeholder #A0AEA0 op wit | 2.32:1 | Best practice issue |

**Opmerking hero titels (opgelost in deze taak):** de drie sliders-titels op de homepage zijn `<h2>` en erfden `color: var(--green-primary)` (donkergroen) op de donkergroene hero-gradient. Donkergroen op donkergroen was vrijwel onleesbaar. Opgelost door `.hero h1, .hero h2, .hero h3, .hero h4` op off-white te zetten. Off-white op primair groen is 11.37:1.

---

## 4. Aanbevelingen

### P0 — merkconsistentie / leesbaarheidsprobleem
1. **Hero slider titels** (onleesbaar). **Opgelost** in deze taak, zie boven.

### P1 — belangrijke verbetering
2. **Favicon toevoegen.** Bestanden aangemaakt in `assets/brand/favicon/` (deze taak). Nog te koppelen via `<link rel="icon">` in elke pagina.
3. **Duplicaat accentgroen formaliseren** als `--lemnion-accent-hover: #6FAA2E` (token bestaat nu in `tokens.css`).
4. **Grijsgroenen formaliseren** als neutrale schaal (`tokens.css` sectie 2).
5. **Section-label contrast corrigeren.** Kleinste correctie: `--green-accent` vervangen door secundair groen `#2E7032` (6.03:1) voor section-labels op lichte achtergrond, of het accent donkerder maken. Niet automatisch toegepast (visuele verandering).
6. **Callout tekstcontrast corrigeren.** `#E8A090` op `#FFF3F0` is 1.96:1. Kleinste correctie: callout tekst op `#C0392B` (5.44:1 op wit) zetten. Niet automatisch toegepast.
7. **Verouderde HES-assets archiveren** naar `assets/legacy-hes/` of verwijderen.
8. **Gedeeld stylesheet introduceren** (migratie van inline CSS naar `assets/brand/tokens.css` + een gedeeld `styles.css`). Grote refactor, vereist visuele regressiecontrole. Alleen documenteren, niet automatisch uitvoeren.

### P2 — nice-to-have
9. Radius-, shadow-, z-index-, breakpoint- en transitiedrift consolideren naar de tokenschalen.
10. Inline per-pagina logo SVG vervangen door `<img src="/assets/lemnion-mark.svg">`.
11. `#EFF3EC` consolideren naar `#F0F5EA`.
12. Font-notatiedrift normaliseren naar één schrijfwijze.
13. Success/warning/info contrast op wit verhogen (gebruik is minimaal).

---

## 5. Status van deze taak

Zie het eindrapport in het chatantwoord voor:
- **Aangemaakt:** alle nieuwe bestanden.
- **Geconsolideerd:** welke bestaande stijlen naar tokens zijn gegaan.
- **Behouden:** welke merkbeslissingen bewust zijn behouden.
- **Wijzigingen:** de hero-titel fix (enkel deze visuele wijziging).
- **Niet uitgevoerd:** aanbevelingen 5, 6, 8 en de overige P2 punten.
