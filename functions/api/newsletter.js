/**
 * Nieuwsbrief inschrijving (Cloudflare Pages Function)
 * Schrijft een e-mailadres in bij de Lemnion Mailchimp audience, met
 * double opt-in (status "pending" -> Mailchimp stuurt bevestigingsmail).
 *
 * Vereisten (Pages project secrets):
 * - MAILCHIMP_API_KEY : "abc123-us10" (suffix is het datacenter)
 * - MAILCHIMP_LIST_ID : id van de audience/list
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minuten
const RATE_LIMIT_MAX = 10; // max 10 inschrijvingen per IP per venster
const hits = new Map();

const MSG = {
  nl: {
    rate: "Te veel verzoeken. Probeer het later opnieuw.",
    invalid: "Ongeldige aanvraag.",
    email: "Vul een geldig e-mailadres in.",
    emailTooLong: "E-mailadres is te lang.",
    config: "Inschrijven is tijdelijk niet beschikbaar. Probeer het later opnieuw.",
    fail: "Het inschrijven is mislukt. Probeer het later opnieuw.",
  },
  en: {
    rate: "Too many requests. Please try again later.",
    invalid: "Invalid request.",
    email: "Please enter a valid email address.",
    emailTooLong: "Email address is too long.",
    config: "Sign-up is temporarily unavailable. Please try again later.",
    fail: "Sign-up failed. Please try again later.",
  },
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const apiKey = env.MAILCHIMP_API_KEY || "";
  const listId = env.MAILCHIMP_LIST_ID || "";

  if (!apiKey || !listId) {
    return json({ success: false, message: MSG.nl.config }, 500);
  }

  // Rate limiting (best effort, per IP)
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const hit = hits.get(ip);
  if (hit && now - hit.ts < RATE_LIMIT_WINDOW_MS) {
    if (hit.count >= RATE_LIMIT_MAX) {
      return json({ success: false, message: MSG.nl.rate }, 429);
    }
    hit.count += 1;
  } else {
    hits.set(ip, { ts: now, count: 1 });
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    return json({ success: false, message: MSG.nl.invalid }, 400);
  }

  let data;
  try {
    data = await request.json();
  } catch (e) {
    return json({ success: false, message: MSG.nl.invalid }, 400);
  }

  // Honeypot: bots vullen dit onzichtbare veld
  if (data.website && String(data.website).trim() !== "") {
    return json({ success: true }, 200);
  }

  const L = MSG[data.lang === "en" ? "en" : "nl"];
  const email = typeof data.email === "string" ? data.email.trim() : "";

  if (!email) {
    return json({ success: false, message: L.email }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ success: false, message: L.email }, 400);
  }
  if (email.length > 150) {
    return json({ success: false, message: L.emailTooLong }, 400);
  }

  // Datacenter uit de key-suffix: "...-us10" -> base https://us10.api.mailchimp.com/3.0
  const dc = apiKey.includes("-") ? apiKey.split("-").pop() : "";
  if (!dc) {
    return json({ success: false, message: L.config }, 500);
  }

  try {
    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from("anystring:" + apiKey).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "pending", // double opt-in: Mailchimp stuurt eerst bevestiging
        merge_fields: { FNAME: "", LNAME: "" },
      }),
    });

    // 400 = al ingeschreven/aanwezig -> netjes afhandelen als succes (double opt-in)
    if (res.status === 400) {
      return json({ success: true, already: true }, 200);
    }
    if (!res.ok) {
      return json({ success: false, message: L.fail }, 500);
    }
    return json({ success: true }, 200);
  } catch (e) {
    return json({ success: false, message: L.fail }, 500);
  }
}
