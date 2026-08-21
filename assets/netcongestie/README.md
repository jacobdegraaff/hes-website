# Netcongestie data (Capaciteitskaart Netbeheer Nederland)

Dit bestand bevat de netcongestie-statusvlakken voor Nederland, afkomstig van de
officiële Capaciteitskaart Netbeheer Nederland
(https://capaciteitskaart.netbeheernederland.nl/).

## Inhoud
- `gebieden.json`: GeoJSON FeatureCollection met de statusvlakken per richting:
  - `rnb_afnamefgb` / `rnb_opwekfgb`: regionale netbeheerders (Coteq, Enexis,
    Liander, Rendo, Stedin, Westland Infra), afname en teruglevering
  - `tennet_afnamefgb` / `tennet_opwekfgb`: TenneT (landelijk net)
- Eigenschappen per feature: `color_code` (0 = beschikbaar, 1 = beperkt,
  2 = in onderzoek, 3 = tekort), `RNB` (netbeheerder), `laag`
- `peildatum` en `bron` staan bovenaan het bestand

## Data verversen (maandelijks aanbevolen)

```bash
python3 tools/update-netcongestie.py 10 assets/netcongestie/gebieden.json
```

Het script downloadt de vector-tiles van MapTiler (met referer-header), zet ze
om naar GeoJSON (lon/lat), simplificeert de geometrie en schrijft het bestand
met een nieuwe peildatum. Daarna committen en deployen:

```bash
git add assets/netcongestie/gebieden.json
git commit -m "data(netcongestie): dataset ververst (peildatum YYYY-MM-DD)"
git push origin dev
```

## Let op
- De dataset wordt gebruikt door `functions/api/netcongestie-check.js`
  (server-side check). Na een update moet ook de function opnieuw deployen
  (automatisch bij een commit naar de dev/main-branch).
- Hergebruik met bronvermelding: de widget toont altijd
  "Capaciteitskaart Netbeheer Nederland" met link en peildatum.
