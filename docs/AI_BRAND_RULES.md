# AI Brand Rules — Lemnion

**Verplicht lezen** door elke AI-agent of ontwikkelaar vóór het maken van een visuele wijziging aan de Lemnion website.

> **Bestaande merkconsistentie heeft voorrang op het introduceren van nieuwe visuele ideeën.**

---

## Vóór elke wijziging aan Lemnion UI

1. Lees `docs/BRAND_GUIDELINES.md`.
2. Lees `docs/brand-system.json`.
3. Lees `assets/brand/tokens.css`.
4. Hergebruik bestaande componenten.
5. Hergebruik brand tokens.
6. Verzin geen nieuwe kleuren.
7. Introduceer geen nieuwe fonts.
8. Maak geen willekeurige spacing aan.
9. Introduceer geen nieuwe iconenstijl.
10. Herontwerp geen componenten tenzij expliciet gevraagd.
11. Behoud WCAG 2.2 AA.
12. Behoud responsief gedrag.
13. Behoud de bestaande premium hospitality-energiepositionering.

---

## Harde regels

- **Kleuren:** alle kleuren komen uit `tokens.css`. Geen nieuwe hex, rgb of rgba waarden in componentcode.
- **Fonts:** alleen Montserrat (display) en Inter (body). Geen derde font.
- **Logo:** gebruik alleen de bestaande `assets/lemnion-*.svg` bestanden of de vastgelegde lemniscaatpad. Herteken of herkleur het logo niet.
- **Icons:** inline SVG, ronde strokes, `stroke-width` 2.5 voor energielijnen. Geen andere iconbibliotheek introduceren.
- **Spacing:** alleen de `--space-*` schaal.
- **Radius:** alleen de `--radius-*` schaal.
- **Shadows:** alleen de `--shadow-*` schaal (subtiel, groen getint, geen SaaS-achtige zweefschaduwen).
- **Content:** wijzig geen paginacontent, SEO, secties, URL's, navigatie of conversieflows. Dit is een branding-taak, geen herontwerp.

---

## Interpunctie en schrijfstijl

Gebruik nooit em dash (—) of en dash (–) als stijlmiddel. Het koppelteken (-) alleen waar grammatica of techniek het vereist. Vermijd typische AI-formuleringen. Zie `CONTENT-RICHTLIJNEN.md` voor de volledige regel.

---

## Als een wijziging de live site visueel kan veranderen

Documenteer de wijziging in plaats van deze automatisch door te voeren. Voor doorvoeren: draai visuele regressie op 375px, 430px, 768px, 1024px en 1440px (header, hero, navigatie, knoppen, cards, forms, diagrammen, footer, modal, mobiel menu).

---

## Beslisvolgorde bij twijfel

1. Is er een bestaand token of component die het al oplost? Gebruik die.
2. Is er een gedocumenteerde merkwaarde? Gebruik die.
3. Twijfel je over een visuele verandering? Documenteer, voer niet uit, vraag de eigenaar.

**Onthoud:** dit merkbestand is gebouwd zodat het zeer moeilijk wordt om per ongeluk van het Lemnion merk af te wijken.
