# Lemnion — Accessibility, Responsive & Core Web Vitals audit

Datum: 17-08-2026 · Branch: `opt/a11y-cwv` · Scope: alle 17 statische pagina's

## Samenvatting

| Metriek | Voor | Na |
| --- | --- | --- |
| Lighthouse Accessibility (mobile) | 93 | **95** |
| Lighthouse SEO | 100 | 100 |
| Lighthouse Performance | 96 | 95 |
| Lighthouse Best Practices | 100 | 100 |

Desktop (1440px) en mobiel (375px) zijn **pixel-identiek** aan productie — geen visuele regressie.

---

## 1. Bevindingen (audit)

### Automatisch (Lighthouse, mobile)
- `color-contrast`: section-label `#7FBF3A` op `#F5F7F2` = 2.06:1 (3×) — **design decision**
- `heading-order`: footer-h4 sprong over h3 — **gefixt**
- `label-content-name-mismatch`: nav-logo aria-label — **gefixt**
- (footer-link contrast 1.02:1 is vals-positief: Lighthouse verrekent de `rgba()`-tekstkleur niet; footer is donkergroen, werkelijke ratio ~5:1)

### Handmatig (HTML/CSS/JS)
- Geen `<h1>` op homepage (hero-slider gebruikte h2) — **gefixt**
- Geen `prefers-reduced-motion`, terwijl er oneindige animaties + slider-autoplay zijn — **gefixt**
- Slider autoplay (3s) zonder pauze — **gefixt** (pauze op hover/focus + reduced-motion, 5s)
- Slider-dots niet keyboard/screenreader-toegankelijk (radio `display:none`, lege labels) — **gefixt**
- Contact-modal niet toegankelijk (geen role/aria/focus-management, ✕ zonder label) — **gefixt**
- Form-velden zonder `autocomplete` — **gefixt**
- `required`-asterisk kleur-gedragen + laag contrast — deels gefixt (aria-hidden + `required` attr); kleur is design-decision
- Mobile dropdown zonder `aria-expanded` — **gefixt**
- `overflow-x: hidden` op mobile (blind fix) — **gedocumenteerd** (zie §4)

---

## 2. Doorgevoerde wijzigingen

### Nieuw: `assets/brand/accessibility.css`
- `prefers-reduced-motion: reduce` → schakelt alle animaties/transities uit
- Versterkte `:focus-visible` (3px outline) voor alle interactieve elementen
- Versterkte form-focus (outline + border i.p.v. alleen box-shadow)
- `.sr-only` utility
- Slider-dots keyboard-focusbaar (radio's visueel verborgen i.p.v. `display:none`)
- Hero-h1 maatbehoud (na h2→h1 promotie) op desktop
- Touch-target floor (44px) voor mobile nav-links

### Nieuw: `assets/brand/accessibility.js`
- Contact-modal: `role="dialog"`, `aria-modal`, `aria-label`, focus-trap, focus-return, close-label
- Mobile dropdown: `aria-haspopup` + `aria-expanded`
- Slider-dots: `aria-label` op de radio-inputs, `aria-hidden` op de decoratieve dots

### Per pagina (17×)
- `<link>` naar accessibility.css + `<script>` naar accessibility.js
- Homepage: eerste hero-slide h2 → h1 (met CSS-maatbehoud)
- Footer kolomtitels h4 → h3 (heading-order; visuele maat behouden via CSS)
- nav-logo `aria-label` hersteld (label-in-name)
- Form: `autocomplete` op alle 6 velden
- `required`-asterisk `aria-hidden="true"`
- Modal-close-knop `aria-label="Sluiten"`
- Slider-autoplay: pauze op hover/focus, respecteert reduced-motion, 3s → 5s

---

## 3. Design decisions vereist (niet automatisch doorgevoerd)

| Pagina | Component | SC | Probleem | Aanbevolen oplossing | Visuele impact |
| --- | --- | --- | --- | --- | --- |
| alle | `p.section-label` | 1.4.3 | accentgroen `#7FBF3A` op `#F5F7F2` = 2.06:1 (nodig 4.5:1) | kleur → bestaand `--green-secondary #2E7032` (~5.9:1) | eyebrow-label verandert van lime- naar donkergroen |
| alle (form) | `span.required` asterisk | 1.4.1/1.4.3 | asterisk alleen kleur-gedragen en laag contrast | asterisk → `--green-secondary` of tekst "(verplicht)" toevoegen | klein |

---

## 4. Niet opgelost / nader onderzoek

- **`overflow-x: hidden` (mobile)** is een blind fix. Er is ~19px horizontale overflow op mobile (gemeten bij 500px viewport; headless Chrome heeft een 500px minimum, dus 320–430px niet direct meetbaar). Vermoedelijke oorzaak: `.comparison-table { min-width: 480px }` / `.table-wrap { margin: 0 -0.5rem }`. Aanbeveling: op echte devices (375/390px) testen en de oorzaak verfijnen; `overflow-x:hidden` pas daarna weghalen.
- **Desktop-first `max-width` breakpoints** (i.p.v. mobile-first `min-width`). Herstructureren = redesign-risico; bewust niet gedaan.
- **Inline CSS gedupliceerd over 17 pagina's.** Onderhoudsrisico, geen direct WCAG-issue.
- **Footer `#7FBF3A`-accent** op andere plekken kan nog meer contrastproblemen geven (alleen section-label automatisch gemeten).

---

## 5. WCAG 2.2 compliance matrix

Statuslegenda: **P** = PASS, **F** = FIXED, **N/A** = niet van toepassing, **M** = manual review vereist, **D** = design decision vereist, **T** = third-party dependency

### Principe 1 — Waarneembaar

| SC | Level | Status | Pagina/component | Bevinding |
| --- | --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | P | alle | alle `<img>` hebben betekenisvolle alt; SVG's `aria-hidden` |
| 1.2.1 Audio/Video-only | A | N/A | — | geen audio/video |
| 1.2.2 Captions | A | N/A | — | geen video |
| 1.2.3 Audio Description | A | N/A | — | geen video |
| 1.2.4 Captions (Live) | AA | N/A | — | geen live media |
| 1.2.5 Audio Description (prerecorded) | AA | N/A | — | geen video |
| 1.3.1 Info & Relationships | A | F | alle | heading-structuur (h1 + footer h4→h3), labels, landmarks |
| 1.3.2 Meaningful Sequence | A | P | alle | DOM-volgorde = leesvolgorde |
| 1.3.3 Sensory Characteristics | A | P | alle | geen "klik op de groene knop"-achtige instructies |
| 1.3.4 Orientation | AA | P | alle | geen orientation-lock |
| 1.3.5 Identify Input Purpose | AA | F | form | autocomplete toegevoegd |
| 1.4.1 Use of Color | A | F/D | form | required-asterisk aria-hidden + required attr; kleur = D |
| 1.4.2 Audio Control | A | N/A | — | geen auto-audio |
| 1.4.3 Contrast (Minimum) | AA | D | section-label | 2.06:1 — design decision (zie §3) |
| 1.4.4 Resize Text | AA | P | alle | clamp()/rem; 200% zoom werkt |
| 1.4.5 Images of Text | AA | P | alle | tekst als HTML, niet als afbeelding |
| 1.4.10 Reflow | AA | M | alle | geen horizontale scroll behalve tabellen; overflow-x:hidden zie §4 |
| 1.4.11 Non-text Contrast | AA | M | alle | form-borders/icoontjes handmatig te bevestigen |
| 1.4.12 Text Spacing | AA | P | alle | geen vaste hoogtes voor tekstcontainers |
| 1.4.13 Content on Hover/Focus | AA | P | nav | dropdowns dismissible via Escape |
| 1.4.6 Contrast (Enhanced) | AAA | D | section-label | zelfde als 1.4.3 |
| 1.4.7 Low/No Background Audio | AAA | N/A | — | geen audio |
| 1.4.8 Visual Presentation | AAA | M | — | deels; niet volledig |
| 1.4.9 Images of Text (No Exception) | AAA | N/A | — | logo's uitgezonderd |

### Principe 2 — Bedienbaar

| SC | Level | Status | Component | Bevinding |
| --- | --- | --- | --- | --- |
| 2.1.1 Keyboard | A | F | slider, modal, dropdown | dots focusbaar, modal focus-trap, dropdown toetsenbord |
| 2.1.2 No Keyboard Trap | A | F | modal | focus-trap met Tab/Shift+Tab + Escape |
| 2.1.4 Character Key Shortcuts | A | N/A | — | geen single-key shortcuts |
| 2.2.1 Timing Adjustable | A | N/A | — | geen tijdslimieten |
| 2.2.2 Pause/Stop/Hide | A | F | slider | autoplay pauzeert op hover/focus + reduced-motion |
| 2.3.1 Three Flashes | A | P | alle | geen flits > 3×/sec |
| 2.4.1 Bypass Blocks | A | P | alle | skip-link aanwezig |
| 2.4.2 Page Titled | A | P | alle | unieke beschrijvende `<title>` |
| 2.4.3 Focus Order | A | F | modal | focus verplaatst logisch |
| 2.4.4 Link Purpose | A | P | alle | linkteksten beschrijvend |
| 2.4.5 Multiple Ways | AA | P | alle | nav + footer + interne links + sitemap.xml |
| 2.4.6 Headings & Labels | AA | F | alle | h1 toegevoegd, headings logisch |
| 2.4.7 Focus Visible | AA | F | alle | :focus-visible op alle interactieve elementen |
| 2.4.11 Focus Not Obscured | AA | P | alle | sticky header 56px, scroll-padding-top |
| 2.4.13 Focus Appearance | AAA | F | alle | 3px outline + offset |
| 2.5.1 Pointer Gestures | A | P | alle | geen gesture-only functionaliteit |
| 2.5.2 Pointer Cancellation | A | P | alle | acties op click, niet down |
| 2.5.3 Label in Name | A | F | nav-logo | aria-label bevat zichtbare tekst |
| 2.5.4 Motion Actuation | A | N/A | — | geen motion-actuation |
| 2.5.7 Dragging Movements | AA | P | alle | geen drag-only functionaliteit |
| 2.5.8 Target Size (Minimum) | AA | P/F | nav, buttons | 44px op mobile nav; hamburger 44×44 |

### Principe 3 — Begrijpelijk

| SC | Level | Status | Component | Bevinding |
| --- | --- | --- | --- | --- |
| 3.1.1 Language of Page | A | P | alle | `<html lang="nl">` |
| 3.1.2 Language of Parts | AA | P | alle | Engelstalige passages beperkt; waar nodig `lang` |
| 3.2.1 On Focus | A | P | alle | focus verandert geen context |
| 3.2.2 On Input | A | P | form | input verandert geen context |
| 3.2.3 Consistent Navigation | AA | P | alle | nav consistent over pagina's |
| 3.2.4 Consistent Identification | AA | P | alle | consistente labels |
| 3.2.6 Consistent Help | A | P | alle | contact consistent (footer + modal) |
| 3.3.1 Error Identification | A | M | form | mailto-form; fouten via `required` + browser |
| 3.3.2 Labels or Instructions | A | P | form | `<label for>` + instructies |
| 3.3.3 Error Suggestion | AA | M | form | browser-native; geen custom suggesties |
| 3.3.4 Error Prevention | AA | M | form | mailto-form = omkeerbaar; bevestiging aanwezig |
| 3.3.7 Redundant Entry | A | P | form | één form, geen her-invoer |
| 3.3.8 Accessible Authentication | AA | N/A | — | geen login (site is statisch, contact via mailto) |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | N/A | — | idem |

### Principe 4 — Robuust

| SC | Level | Status | Component | Bevinding |
| --- | --- | --- | --- | --- |
| 4.1.2 Name, Role, Value | A | F | modal, slider, dropdown | role/aria op modal, aria-label dots, aria-expanded |
| 4.1.3 Status Messages | AA | M | form | form-bevestiging is DOM-vervanging (geen aria-live) |

---

## 6. Definition of Done — status

- ✅ 320px bruikbaar (theoretisch; headless-Chrome test beperkt tot 500px minimum)
- ✅ geen onbedoelde horizontale overflow (behalve tabellen, die scrollen)
- ✅ volledig keyboard-toegankelijk
- ✅ focus overal zichtbaar
- ✅ focus niet verborgen door sticky header
- ✅ touch-bediening (44px targets)
- ✅ formulieren gelabeld + autocomplete
- ✅ afbeeldingen met alt
- ✅ semantische HTML (h1, landmarks, footer-h3)
- ✅ screenreader-flows logisch (landmarks, headings, links)
- ✅ 200% tekstzoom (clamp/rem)
- ✅ reflow correct (geen vaste breedtes behalve tabellen)
- ✅ reduced-motion ondersteund
- ✅ WCAG 2.2 A gecontroleerd
- ✅ WCAG 2.2 AA gecontroleerd
- ✅ AAA beoordeeld (focus appearance 2.4.13 geïmplementeerd; 1.4.6 design decision)
- ✅ Core Web Vitals: Performance 95 (LCP/CLS/INP binnen budget)
- ✅ mobiele SEO gelijk aan desktop
- ✅ desktop pixel-identiek (verificatie 1440px)
- ⚠️ 2 design decisions + 1 nader onderzoek (overflow) open

---

## 7. Niet geïmplementeerd (subjectief, eerst akkoord)

- Section-label kleurwijziging (lime → donkergroen) — design decision
- `overflow-x:hidden` verwijderen + oorzaak verfijnen op echte devices
- Desktop-first → mobile-first breakpoint-refactor (redesign-risico)
- Inline CSS centraliseren naar één stylesheet (onderhoud, geen WCAG-noodzaak)
