/**
 * Contactformulier endpoint (Cloudflare Pages Function)
 * Verstuurt het contactformulier naar info@lemnion.nl via Resend.
 *
 * Vereisten:
 * - RESEND_API_KEY als Pages project secret (Settings > Variables and secrets)
 * - Resend domein send.lemnion.nl geverifieerd (DNS in Cloudflare)
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minuten
const RATE_LIMIT_MAX = 5; // max 5 verzoeken per IP per venster
const hits = new Map();

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Rate limiting (best effort, per IP)
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const hit = hits.get(ip);
  if (hit && now - hit.ts < RATE_LIMIT_WINDOW_MS) {
    if (hit.count >= RATE_LIMIT_MAX) {
      return json(
        { success: false, message: "Te veel verzoeken. Probeer het later opnieuw." },
        429
      );
    }
    hit.count += 1;
  } else {
    hits.set(ip, { ts: now, count: 1 });
  }

  // Alleen JSON POST
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return json({ success: false, message: "Ongeldige aanvraag." }, 400);
  }

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ success: false, message: "Ongeldige aanvraag." }, 400);
  }

  // Honeypot: bots vullen dit onzichtbare veld
  if (data.website && String(data.website).trim() !== "") {
    return json({ success: true }, 200);
  }

  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const fields = {
    voornaam: str(data.voornaam),
    achternaam: str(data.achternaam),
    bedrijfsnaam: str(data.bedrijfsnaam),
    functie: str(data.functie),
    email: str(data.email),
    mobiel: str(data.mobiel),
    bericht: str(data.bericht),
  };

  // Validatie
  const errors = {};
  for (const key of Object.keys(fields)) {
    if (!fields[key]) errors[key] = "Dit veld is verplicht.";
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email)) {
    errors.email = "Vul een geldig e-mailadres in.";
  }
  if (fields.email && fields.email.length > 150) {
    errors.email = "E-mailadres is te lang.";
  }
  if (fields.bericht && fields.bericht.length > 2000) {
    errors.bericht = "Het bericht mag maximaal 2000 tekens bevatten.";
  }
  for (const key of ["voornaam", "achternaam", "bedrijfsnaam", "functie"]) {
    if (fields[key] && fields[key].length > 100) {
      errors[key] = "Dit veld is te lang (maximaal 100 tekens).";
    }
  }
  if (fields.mobiel && fields.mobiel.length > 30) {
    errors.mobiel = "Ongeldig telefoonnummer.";
  }

  if (Object.keys(errors).length > 0) {
    return json({ success: false, errors }, 400);
  }

  // E-mail opbouwen
  const subject =
    "Contactverzoek: " + fields.voornaam + " " + fields.achternaam + " (" + fields.bedrijfsnaam + ")";
  const html =
    "<h2>Nieuw contactformulier (lemnion.nl)</h2>" +
    "<table cellpadding='6' cellspacing='0' style='font-family:Arial,sans-serif;font-size:14px'>" +
    "<tr><td><strong>Naam</strong></td><td>" + escapeHtml(fields.voornaam) + " " + escapeHtml(fields.achternaam) + "</td></tr>" +
    "<tr><td><strong>Bedrijf</strong></td><td>" + escapeHtml(fields.bedrijfsnaam) + "</td></tr>" +
    "<tr><td><strong>Functie</strong></td><td>" + escapeHtml(fields.functie) + "</td></tr>" +
    "<tr><td><strong>E-mail</strong></td><td>" + escapeHtml(fields.email) + "</td></tr>" +
    "<tr><td><strong>Mobiel</strong></td><td>" + escapeHtml(fields.mobiel) + "</td></tr>" +
    "</table>" +
    "<p><strong>Bericht:</strong></p>" +
    "<p>" + escapeHtml(fields.bericht).replace(/\n/g, "<br>") + "</p>";

  // Versturen via Resend
  try {
    const apiKey = env.RESEND_API_KEY || env.Resend || "";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lemnion Website <no-reply@send.lemnion.nl>",
        to: ["info@lemnion.nl"],
        reply_to: fields.email,
        subject: subject,
        html: html,
      }),
    });

    if (!res.ok) {
      return json(
        { success: false, message: "Het versturen is mislukt. Probeer het later opnieuw." },
        500
      );
    }
    return json({ success: true }, 200);
  } catch (e) {
    return json(
      { success: false, message: "Het versturen is mislukt. Probeer het later opnieuw." },
      500
    );
  }
}
