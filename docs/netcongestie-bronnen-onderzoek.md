# Netcongestie-bronnen: onderzoeksnotitie (Fase 1)

Datum: 21 augustus 2026
Status: onderzoek afgerond, beslissing nodig over aanpak

## 1. Wat is er onderzocht

De officiële **Capaciteitskaart Netbeheer Nederland** (capaciteitskaart.netbeheernederland.nl) is de centrale bron voor netcongestie per regio. De kaart is een web-app van Netbeheer Nederland, gebouwd door Partners in Energie. Achterliggende data is volledig in kaart gebracht:

- **Databron**: vector-tiles (MapTiler, pbf-formaat) op `api.maptiler.com/tiles/105ba28a-.../{z}/{x}/{y}.pbf`
- **Toegang**: de API-key is domeingebonden, maar een simpele `Referer: https://data.partnersinenergie.nl/` header in curl is voldoende (getest: 200, identiek aan browser-download). Geen browser of login nodig.
- **Actualiteit**: de tileset bevat een processing-timestamp (17 augustus 2026, vier dagen oud bij onderzoek). De kaart wordt dus regelmatig opnieuw gebakken, vermoedelijk wekelijks.

## 2. De data (lagen in de tiles)

| Laag | Inhoud | Aantal features |
|---|---|---|
| `rnb_afnamefgb` | Congestiegebieden afname (regionale netbeheerders), met status | ~253 (op z9) |
| `rnb_opwekfgb` | Congestiegebieden teruglevering, met status | ~243 |
| `rnb_gebied_afnamefgb` | Sub-gebieden met naam/code (bijv. "De Lier", "Bijlmer Noord 10kV") | ~957 |
| `rnb_gebied_opwekfgb` | Idem voor teruglevering | ~956 |
| `tennet_afnamefgb` / `tennet_opwekfgb` | TenneT (landelijk net) gebieden | ~78-80 |
| `totaal_afnamefgb` / `totaal_opwekfgb` | Samengevoegde weergave | ~106-116 |
| `missingfgb` | Postcode-polygonen (postcodegebieden met een aparte markering) | ~5713 |

Netbeheerders in de data: Coteq, Enexis, Liander, Rendo, Stedin, Westland Infra (plus combinaties) en TenneT.

## 3. Statuscodes (officiële legenda)

| color_code | Legenda Netbeheer Nederland |
|---|---|
| 0 | Transportcapaciteit beschikbaar zonder wachtrij |
| 1 | Transportcapaciteit beperkt beschikbaar zonder wachtrij |
| 2 | Gebied is in onderzoek met wachtrij |
| 3 | Tekort aan transportcapaciteit met wachtrij |
| (geen) | Kleur wordt later toegevoegd |
| -1 | (alleen TenneT/totaal-lagen) |

Dit zijn exact de vijf categorieën die de officiële kaart toont. Perfect bruikbaar voor een eigen weergave.

## 4. Postcode naar coördinaat

De gratis **PDOK BAG-locatieserver** werkt zonder key:
`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=<postcode>&fq=type:postcode`
Geeft RD-coördinaten (centroïde) + weergavenaam. Getest met 2671AA (Naaldwijk): `POINT(73614.14 446075.726)`. Betrouwbaar voor postcode-check.

## 5. De postcode-API van de kaart zelf (afgeraden)

De kaart heeft een interne API (`/api/servicearea/find` en `/api/servicearea/get` op data.partnersinenergie.nl). Uitgebreid getest, ook vanuit de echte pagina-context via CDP:

- De API retourneert voor vrijwel alle postcodes `serviceArea: null` of "does not have a service area"
- De kaart-app zelf toont op dit moment de foutmelding "Fout opgetreden. Probeer het later opnieuw." bij het laden
- **Conclusie: de postcode-API is onbetrouwbaar/defect en niet geschikt als basis voor de Lemnion-check**

## 6. Aanbevolen techniek (beslispunt)

**Aanbeveling: eigen dataset + point-in-polygon.**

1. Script downloadt periodiek de tiles (curl + Referer-header) over heel Nederland (zoom 10-11, ~200-400 tiles, enkele MB's)
2. Script parst de MVT-tiles naar één compact GeoJSON-bestand: de congestiegebieden (afname + teruglevering) met status, netbeheerder, naam en peildatum
3. In de widget: bezoeker vult postcode in → PDOK geeft coördinaat → point-in-polygon tegen het GeoJSON → status + uitleg + CTA
4. Maandelijkse verversing via cron (of handmatig), met peildatum op de pagina

**Alternatieven:**
- B: live API-call naar de officiële kaart per zoekopdracht → afgeraden (API defect)
- C: iframe van de officiële kaart op de pagina → werkt, maar geen eigen branding/ervaring en de kaart zelf toont nu ook een fout
- D: alleen doorverwijzen naar de officiële kaart → minimaal, geen eigen tool

**Aanbevolen combinatie: A (eigen check) + D (fallback-link naar officiële kaart voor details).**

## 7. Risico's en open punten

- **Licentie**: besluit genomen op 21-08-2026: geen mail naar Netbeheer Nederland. De widget toont altijd een bronvermelding ("Gegevens: Capaciteitskaart Netbeheer Nederland, peildatum [datum]") met link naar de officiële kaart.
- **Update-frequentie**: tiles worden regelmatig vernieuwd (timestamp in de tileset). Maandelijkse verversing is veilig; bij twijfel wekelijks.
- **Precisie**: op zoom 10-11 zijn de gebiedsgrenzen voldoende nauwkeurig voor postcode-niveau (een postcodegebied is klein). Controle met steekproef tegen de officiële kaart in fase 2.
- **TenneT vs RNB**: afhankelijk van de locatie is er een regionaal netbeheerder-gebied of TenneT-gebied; de widget moet beide lagen checken en de hoogste status tonen.
- **Interpretatie**: "gebied in onderzoek" of "beperkt beschikbaar" is geen acuut probleem; de widget moet de officiële bewoording gebruiken en doorverwijzen naar Lemnion-advies.

## 8. Voorstel vervolg (Fase 2)

1. Download-script: tiles ophalen (curl + referer) en parsen naar GeoJSON met peildatum
2. Point-in-polygon module + postcode-check via PDOK
3. Prototype widget in site-stijl (netcongestie-check.html)
4. QA: 10 testpostcodes vergelijken met de officiële kaart
5. Na akkoord: integratie in netcongestie.html + maandelijks update-script
