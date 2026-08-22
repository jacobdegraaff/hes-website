/**
 * Netcongestie-check endpoint (Cloudflare Pages Function)
 *
 * Server-side point-in-polygon: postcode -> PDOK-coördinaat -> status uit de
 * Capaciteitskaart-dataset. Zo hoeft de bezoeker geen grote dataset te downloaden.
 *
 * Gebruik: GET /api/netcongestie-check?postcode=2671AA
 *
 * Data: Capaciteitskaart Netbeheer Nederland (zie assets/netcongestie/gebieden.json,
 * bijgewerkt met tools/update-netcongestie.py)
 */
import gebieden from "../../assets/netcongestie/gebieden.json";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const hits = new Map();

const STATUS = {
  3: "tekort",
  2: "in_onderzoek",
  1: "beperkt",
  0: "beschikbaar",
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(lon, lat, coords) {
  if (!pointInRing(lon, lat, coords[0])) return false;
  for (let g = 1; g < coords.length; g++) {
    if (pointInRing(lon, lat, coords[g])) return false; // gat
  }
  return true;
}

function pointInMulti(lon, lat, geom) {
  if (!geom) return false;
  if (geom.type === "Polygon") return pointInPolygon(lon, lat, geom.coordinates);
  if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      if (pointInPolygon(lon, lat, poly)) return true;
    }
  }
  return false;
}

/** Bepaal per richting de slechtste (hoogste) status en de bijbehorende netbeheerder. */
function worstDirection(hits, direction) {
  const relevant = hits.filter((h) => (h.laag || "").includes(direction));
  let best = null;
  for (const h of relevant) {
    const c = h.color_code;
    if (typeof c !== "number") continue;
    if (best === null || c > best.color_code) best = h;
  }
  if (!best) return null;
  return {
    code: best.color_code,
    status: STATUS[best.color_code] || "onbekend",
    netbeheerder: best.RNB || null,
  };
}

async function pdokLookup(postcode6) {
  const pc4 = postcode6.slice(0, 4);
  const pc2 = postcode6.slice(4);
  const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc4}%20${pc2}&fq=postcode:${postcode6}&rows=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const docs = (data.response && data.response.docs) || [];
  if (!docs.length) return null;
  const m = (docs[0].centroide_ll || "").match(/POINT\(([\d.]+) ([\d.]+)\)/);
  if (!m) return null;
  return {
    lon: parseFloat(m[1]),
    lat: parseFloat(m[2]),
    weergavenaam: docs[0].weergavenaam,
  };
}

export async function onRequestGet(context) {
  const { request } = context;

  // Rate limiting (best effort, per IP)
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const hit = hits.get(ip);
  if (hit && now - hit.ts < RATE_LIMIT_WINDOW_MS) {
    if (hit.count >= RATE_LIMIT_MAX) {
      return json({ error: "rate" }, 429);
    }
    hit.count++;
  } else {
    hits.set(ip, { ts: now, count: 1 });
  }

  const url = new URL(request.url);
  const raw = (url.searchParams.get("postcode") || "").replace(/\s+/g, "").toUpperCase();

  if (!/^[0-9]{4}[A-Z]{2}$/.test(raw)) {
    return json({ error: "format" }, 400);
  }

  const loc = await pdokLookup(raw);
  if (!loc) {
    return json({ error: "not_found", postcode: raw }, 404);
  }

  const found = [];
  for (const f of gebieden.features) {
    if (pointInMulti(loc.lon, loc.lat, f.geometry)) {
      found.push(f.properties);
    }
  }

  const afname = worstDirection(found, "afname");
  const opwek = worstDirection(found, "opwek");

  return json({
    postcode: raw,
    weergavenaam: loc.weergavenaam,
    peildatum: gebieden.peildatum || null,
    bron: gebieden.bron || null,
    afname,
    opwek,
  });
}
