#!/usr/bin/env python3
"""
Netcongestie data-downloader voor de Capaciteitskaart Netbeheer Nederland.

Downloadt de officiële vector-tiles over heel Nederland, converteert ze naar
GeoJSON (lon/lat) en slaat de relevante lagen op in één bestand met peildatum.

Gebruik:
  python3 update-netcongestie.py [zoom] [uitvoerbestand]

Bron: Capaciteitskaart Netbeheer Nederland (capaciteitskaart.netbeheernederland.nl)
Data: netbeheerders (Coteq, Enexis, Liander, Rendo, Stedin, Westland Infra, TenneT)
"""
import json, math, os, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

from mapbox_vector_tile import decode
from shapely.geometry import shape, mapping
from shapely import simplify

TILE_URL = "https://api.maptiler.com/tiles/105ba28a-afb8-4232-ac3d-0b40bf3fc76c/{z}/{x}/{y}.pbf?key=LsAKfag3t3bTv3H1zlTP"
REFERER = "https://data.partnersinenergie.nl/"
BOUNDS = (3.358, 50.750, 7.227, 53.517)  # lon_min, lat_min, lon_max, lat_max (Nederland)

# Simplificatie-tolerantie per laag (graden lon/lat; ~0.0015 graad ≈ 170 m,
# voldoende voor postcode-niveau)
SIMPLIFY_TOL = {
    "missingfgb": 0.0002,  # postcode-polygonen zijn klein, weinig simplificeren
}
DEFAULT_TOL = 0.0015

# Lagen die we meenemen: de statusvlakken (regionale netbeheerders + TenneT,
# afname en teruglevering). De "gebied"-lagen (namen) en postcode-laag kunnen
# later worden toegevoegd; de "totaal"-lagen berekenen we zelf in de widget.
KEEP_LAYERS = {
    "rnb_afnamefgb", "rnb_opwekfgb", "tennet_afnamefgb", "tennet_opwekfgb",
}


def lonlat_of_tile(z, x, y):
    n = 2 ** z
    lon = x / n * 360.0 - 180.0
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    return lon, lat


def tile_to_lonlat(z, x, y, extent, cx, cy):
    """Converteer lokale tile-coördinaten naar lon/lat."""
    n = 2 ** z
    wx = (x + cx / extent) / n
    wy = (y + cy / extent) / n
    lon = wx * 360.0 - 180.0
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * wy))))
    return round(lon, 4), round(lat, 4)


def convert_geom(geom, z, x, y, extent):
    """MVT-geometrie (tile-coords, integers) naar GeoJSON-coördinaten (lon/lat)."""
    gtype = geom.get("type")
    coords = geom.get("coordinates")
    if gtype == "Polygon":
        return {
            "type": "Polygon",
            "coordinates": [[tile_to_lonlat(z, x, y, extent, px, py) for px, py in ring] for ring in coords],
        }
    if gtype == "MultiPolygon":
        return {
            "type": "MultiPolygon",
            "coordinates": [
                [[tile_to_lonlat(z, x, y, extent, px, py) for px, py in ring] for ring in poly]
                for poly in coords
            ],
        }
    if gtype == "Point":
        return {"type": "Point", "coordinates": tile_to_lonlat(z, x, y, extent, *coords)}
    return None


def tile_bounds(z):
    """Bereken de tile-range voor Nederland op een zoomniveau."""
    n = 2 ** z
    lon_min, lat_min, lon_max, lat_max = BOUNDS

    def y_for(lat):
        lat_r = math.radians(lat)
        return (1 - math.log(math.tan(lat_r) + 1 / math.cos(lat_r)) / math.pi) / 2 * n

    x0 = max(0, int((lon_min + 180) / 360 * n))
    x1 = min(n - 1, math.ceil((lon_max + 180) / 360 * n))
    y0 = max(0, int(y_for(lat_max)))
    y1 = min(n - 1, math.ceil(y_for(lat_min)))
    return x0, x1, y0, y1


def download_tile(z, x, y):
    url = TILE_URL.format(z=z, x=x, y=y)
    req = urllib.request.Request(url, headers={"Referer": REFERER, "User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return x, y, r.read()
    except Exception as e:
        return x, y, None


def main():
    z = int(sys.argv[1]) if len(sys.argv) > 1 else 11
    out_path = sys.argv[2] if len(sys.argv) > 2 else "assets/netcongestie/gebieden.json"
    x0, x1, y0, y1 = tile_bounds(z)
    tiles = [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]
    print(f"Zoom {z}: {len(tiles)} tiles (x {x0}-{x1}, y {y0}-{y1})")

    features = {layer: [] for layer in KEEP_LAYERS}
    ok = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        for x, y, data in ex.map(lambda t: download_tile(z, *t), tiles):
            if data is None:
                continue
            try:
                decoded = decode(data)
            except Exception:
                continue
            ok += 1
            for lname, ldata in decoded.items():
                if lname not in KEEP_LAYERS:
                    continue
                extent = ldata.get("extent", 4096)
                for ft in ldata.get("features", []):
                    geom = convert_geom(ft.get("geometry", {}), z, x, y, extent)
                    if geom is None:
                        continue
                    props = dict(ft.get("properties", {}))
                    # extra info voor de widget
                    props["laag"] = lname
                    # simplificeer de geometrie (behoudt geldigheid, incl. holes)
                    tol = SIMPLIFY_TOL.get(lname, DEFAULT_TOL)
                    shp = simplify(shape(geom), tolerance=tol)
                    if shp.is_empty:
                        continue
                    # buffer(0) herstelt eventuele ongeldige geometrie na simplificatie
                    if not shp.is_valid:
                        shp = shp.buffer(0)
                        if shp.is_empty:
                            continue
                    geom_s = mapping(shp)
                    features[lname].append({"type": "Feature", "properties": props, "geometry": geom_s})

    print(f"Tiles geladen: {ok}/{len(tiles)}")
    total = sum(len(v) for v in features.values())
    print(f"Features per laag: { {k: len(v) for k, v in features.items()} }")

    # Peildatum uit de tileset halen (processing timestamp in tiles.json is niet per tile;
    # we gebruiken vandaag als peildatum van deze download)
    peildatum = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    fc = {
        "type": "FeatureCollection",
        "name": "Capaciteitskaart Netbeheer Nederland (netcongestie)",
        "bron": "https://capaciteitskaart.netbeheernederland.nl/",
        "peildatum": peildatum,
        "zoom": z,
        "features": [f for layer in KEEP_LAYERS for f in features[layer]],
    }
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False)
    size_mb = os.path.getsize(out_path) / 1e6
    print(f"Geschreven: {out_path} ({size_mb:.2f} MB, {total} features, peildatum {peildatum})")


if __name__ == "__main__":
    main()
