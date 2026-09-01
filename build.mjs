#!/usr/bin/env node
/**
 * Lemnion static site i18n build (build-time translation, Option 3).
 *
 * - Reads NL source pages at repo root (*.html, excluding admin.html).
 * - For each language in LANGS: replaces the text of elements marked with
 *   data-i18n="key" using translations/<lang>.json. Missing keys fall back to
 *   the original NL text (site can never break or be half-translated).
 * - Injects per-language <html lang>, canonical and hreflang alternates.
 * - Writes everything to dist/:  dist/*.html (NL), dist/en/*.html (EN), ...
 * - Generates dist/sitemap.xml with hreflang annotations.
 * - Copies non-HTML root files (assets/, favicon, robots, etc.).
 *
 * Zero dependencies: runs with plain Node on Cloudflare Pages build image v3.
 * Usage:  node build.mjs   (from the repo root)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'dist');
const BASE_URL = 'https://lemnion.nl';
const LANGS = ['en']; // add 'fr', 'es' later (same mechanism)

// EN pages get English URL slugs (NL filenames stay as-is).
// Waarden zijn extensionless: de live site serveert /oplossingen (Cloudflare
// redirect 308: .html -> extensionless). Sitemap, canonical, hreflang en
// interne links gebruiken dus de extensionless vorm.
// EN-page slugs uit een centrale bron (translations/specs/_slugs.json).
// Zelfde kaart voor: interne link-herschrijving, lang-switch, sitemap en
// breadcrumbs -> kan nooit meer verdrift (alle pagina's blijven in de gekozen taal).
const SLUGS = JSON.parse(readFileSync(join(ROOT, 'translations/specs/_slugs.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const NL_TAG = /<html([^>]*)>/;
const DATA_I18N = /<([a-zA-Z][a-zA-Z0-9]*)(?![a-zA-Z0-9])([^>]*?)\bdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g;

function pageUrl(page, lang) {
  const slug = lang === 'nl' ? page : (SLUGS[page] || page);
  const base = slug === 'index.html' || slug === '' ? '/' : '/' + slug.replace(/\.html$/, '');
  return lang === 'nl' ? `${BASE_URL}${base}` : `${BASE_URL}/${lang}${base}`;
}

// ---------------------------------------------------------------------------
// Breadcrumbs: BreadcrumbList structured data + zichtbare trail
// (typische gebruikersroute conform de nav; platte URLs blijven gehandhaafd)
// ---------------------------------------------------------------------------
const TRAIL = {
  'oplossingen.html':   { parent: null,               nl: 'Oplossingen',            en: 'Solutions' },
  'netcongestie.html':  { parent: 'oplossingen.html', nl: 'Netcongestie',           en: 'Grid congestion' },
  'verduurzamen.html':  { parent: 'oplossingen.html', nl: 'Verduurzamen',           en: 'Sustainability' },
  'maximum-belasting.html': { parent: 'oplossingen.html', nl: 'Maximum belasting',  en: 'Peak capacity' },
  'stroom-overschot.html':  { parent: 'oplossingen.html', nl: 'Stroom (zon) overschot', en: 'Solar (surplus) power' },
  'stroomuitval-noodaggregaat.html': { parent: 'oplossingen.html', nl: 'Stroomuitval / noodaggregaat', en: 'Power outage / backup' },
  'voordelen.html':     { parent: null,               nl: 'Voordelen',              en: 'Benefits' },
  'usp-veiligheid.html': { parent: 'voordelen.html',  nl: 'USP en veiligheid',      en: 'USP & safety' },
  'configurator.html':  { parent: 'voordelen.html',   nl: 'Energieconfigurateur',   en: 'Energy configurator' },
  'nieuws.html':        { parent: null,               nl: 'Nieuws',                 en: 'News' },
  'blog.html':          { parent: 'nieuws.html',      nl: 'Blog',                   en: 'Blog' },
  'blog-epbd-iv-laadinfra.html': { parent: 'nieuws.html', nl: 'Blog',               en: 'Blog' },
  'producten.html':     { parent: null,               nl: 'Producten',              en: 'Products' },
  'subsidies.html':     { parent: null,               nl: 'Subsidies',              en: 'Subsidies' },
  'over-ons.html':      { parent: null,               nl: 'Over ons',               en: 'About us' },
};

function crumbName(entry, lang) {
  return lang === 'nl' ? entry.nl : entry.en;
}

function crumbItems(page, lang) {
  const trail = TRAIL[page];
  if (!trail) return null; // home e.d.: geen breadcrumb
  const items = [];
  items.push({ name: 'Home', url: pageUrl('index.html', lang) });
  if (trail.parent) {
    const p = TRAIL[trail.parent];
    items.push({ name: crumbName(p, lang), url: pageUrl(trail.parent, lang) });
  }
  items.push({ name: crumbName(trail, lang), url: pageUrl(page, lang) });
  return items;
}

function injectBreadcrumbs(html, page, lang) {
  const items = crumbItems(page, lang);
  let ld = '';
  if (items) {
    const json = items.map((it, i) =>
      `    { "@type": "ListItem", "position": ${i + 1}, "name": ${JSON.stringify(it.name)}, "item": ${JSON.stringify(it.url)} }`
    ).join(',\n');
    ld = `\n<!-- Breadcrumb (build) -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [\n${json}\n  ]\n}\n</script>`;
  }
  // Bestaand BreadcrumbList-blok vervangen (oude platte variant), of toevoegen als
  // het ontbreekt. Bij items=null (home) wordt het oude blok juist VERWIJDERD:
  // een 1-item breadcrumb voldoet niet aan Google's eis (minimaal 2 ListItems).
  const before = html;
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (block) => {
    if (!block.includes('BreadcrumbList')) return block;
    return ld;
  });
  if (items && html === before) {
    html = html.replace('</head>', ld + '\n</head>');
  }
  return html;
}

function loadDict(lang) {
  // merge translations/<lang>.json + alle translations/<lang>.*.json (per-pagina woordenboeken)
  const dict = {};
  let any = false;
  for (const f of readdirSync(join(ROOT, 'translations'))) {
    if (!f.startsWith(lang + '.') || !f.endsWith('.json')) continue;
    const p = join(ROOT, 'translations', f);
    if (!statSync(p).isFile()) continue;
    any = true;
    try {
      Object.assign(dict, JSON.parse(readFileSync(p, 'utf8')));
    } catch (e) {
      console.error(`[build] FOUT: translations/${f} is geen geldige JSON: ${e.message}`);
      process.exit(1);
    }
  }
  if (!any) return null;
  return dict;
}

function injectHead(html, page, lang) {
  const links = [];
  for (const l of ['nl', ...LANGS]) {
    if (l === lang) continue;
    links.push(`  <link rel="alternate" hreflang="${l}" href="${pageUrl(page, l)}">`);
  }
  links.push(`  <link rel="alternate" hreflang="x-default" href="${pageUrl(page, 'nl')}">`);
  links.push(`  <link rel="canonical" href="${pageUrl(page, lang)}">`);
  const block = `\n<!-- i18n (build) -->\n${links.join('\n')}\n`;
  // replace any existing canonical, then inject the block before </head>
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, '');
  if (html.includes('</head>')) return html.replace('</head>', block + '</head>');
  return html; // no head? leave as-is
}

function translateAttributes(html, dict) {
  // Vertaalt attributen via data-i18n-placeholder="key" / data-i18n-aria-label="key".
  // Elementen zonder het betreffende attribuut krijgen het erbij; bestaande
  // waarden worden overschreven. Ontbrekende sleutel = NL-fallback (attribuut
  // blijft staan, waarde wordt niet aangeraakt).
  let missing = 0;
  const MAP = [
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-aria-label', 'aria-label'],
  ];
  for (const [from, to] of MAP) {
    const re = new RegExp(`<([a-zA-Z][a-zA-Z0-9]*)(?![a-zA-Z0-9])([^>]*?)\\b${from}="([^"]+)"([^>]*)>`, 'g');
    html = html.replace(re, (m, tag, before, key, after) => {
      const t = dict[key];
      if (t === undefined) {
        missing += 1;
        return m;
      }
      let attrs = before + after;
      const targetRe = new RegExp(`(\\b${to}=")[^"]*(")`);
      if (targetRe.test(attrs)) attrs = attrs.replace(targetRe, `$1${t}$2`);
      else attrs += ` ${to}="${t}"`;
      return `<${tag}${attrs}>`;
    });
  }
  return { html, missing };
}

function translatePage(source, dict, page) {
  let missing = 0;
  let out = source.replace(DATA_I18N, (m, tag, before, key, after, inner) => {
    const t = dict[key];
    if (t !== undefined) {
      return `<${tag}${before}data-i18n="${key}"${after}>${t}</${tag}>`;
    }
    missing += 1; // fallback: keep NL text
    return m;
  });
  const attr = translateAttributes(out, dict);
  out = attr.html;
  missing += attr.missing;
  return { html: out, missing };
}

function finalizeHtml(html, page, lang) {
  // EN pages: rewrite internal links to /en/<slug>, relative assets to root-absolute
  html = rewriteLinks(html, lang);
  // ALLEEN externe links (naar andere domeinen): target=_blank + rel=noopener nofollow
  // (Jacob, 21-8-2026, verduidelijkt). Interne links (eigen domein of relatief) en
  // anker-/mailto-/tel-links blijven normaal in hetzelfde tabblad.
  html = html.replace(/<a([^>]*?)href=\"([^\"]*)\"([^>]*)>/g, (m, before, href, after) => {
    if (/^#/.test(href) || /^mailto:/.test(href) || /^tel:/.test(href)) return m;
    const extern = /^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?lemnion\.nl/.test(href);
    if (!extern) return m; // interne link: normaal, zelfde tabblad
    let b = before, a = after;
    if (!/\btarget=/.test(b + a)) a = a + ' target="_blank"';
    if (!/\brel=/.test(b + a)) a = a + ' rel="noopener nofollow"';
    return `<a${b}href="${href}"${a}>`;
  });
  // lang attribute (replace existing or add)
  html = html.replace(NL_TAG, (m, attrs) => {
    const cleaned = attrs.replace(/\slang="[^"]*"/, '');
    return `<html${cleaned} lang="${lang}">`;
  });
  // per-language <title> and meta description (keys: meta.<page>.title / .description)
  if (lang !== 'nl') {
    const dict = dicts[lang];
    const t = dict[`meta.${page}.title`];
    if (t) html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
    const d = dict[`meta.${page}.description`];
    if (d) html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`);
  }
  // language switcher: mark the current language link (aria-current)
  if (lang !== 'nl') {
    html = html.replace(
      /(<li class="lang-switch"[^>]*>)([\s\S]*?)(<\/li>)/,
      (m, open, inner, close) => {
        const swapped = inner
          .replace(/(<a[^>]*class="lang-link"[^>]*) aria-current="true"/, '$1')
          .replace(/(<a[^>]*hreflang="en"[^>]*)(>)/, '$1 aria-current="true"$2');
        return open + swapped + close;
      }
    );
  }
  // Breadcrumbs: JSON-LD (structured data) + zichtbare trail in de page-header
  html = injectBreadcrumbs(html, page, lang);
  return injectHead(html, page, lang);
}

function rewriteLinks(html, lang) {
  if (lang !== 'nl') {
    // 0) De taalwissel BESCHERMEN: die bevat al de correcte per-taal URLs
    //    (NL-link -> NL-pagina, EN-link -> EN-pagina). Zonder bescherming
    //    herschrijft stap 1/2 de NL-link naar de EN-URL ("NL klikken blijft EN").
    let langSwitch = null;
    html = html.replace(/(<li class="lang-switch"[^>]*>[\s\S]*?<\/li>)/, (m) => {
      langSwitch = m;
      return '@@LANGSWITCH@@';
    });
    // 1) home-link "/" en "/#anker" → "/en/" resp. "/en/#anker"
    html = html.replace(/href="\/(#)"/g, 'href="/en/#"');
    html = html.replace(/href="\/"/g, 'href="/en/"');
    // 2) interne paginalinks "/<nl-slug>[#anker]" → "/en/<en-slug>[#anker]"
    html = html.replace(/href="\/([a-z0-9-]+)(#[^"]*)?"/g, (m, slug, anchor = '') => {
      const en = SLUGS[slug + '.html'];
      if (en === undefined) return m; // geen bekende pagina (bv. /assets/…)
      return `href="/en/${en}${anchor}"`;
    });
    // 3) taalwissel: "/en/<nl-slug>" → "/en/<en-slug>" (bron gebruikt NL-slugs)
    html = html.replace(/href="\/en\/([a-z0-9-]+)"/g, (m, slug) => {
      const en = SLUGS[slug + '.html'];
      return en !== undefined && en !== '' ? `href="/en/${en}"` : m;
    });
    // 4) relatieve asset-paden → root-absoluut, zodat ze onder /en/… resolven
    html = html.replace(/(src=")(?!https?:|data:|#|\/)([^"]+)"/g, (m, pre, src) => `${pre}/${src}"`);
    html = html.replace(/(href=")(?!https?:|mailto:|tel:|data:|#|\/)([^"]+)"/g, (m, pre, h) => `${pre}/${h}"`);
    // herstel de taalwissel
    if (langSwitch) html = html.replace('@@LANGSWITCH@@', () => langSwitch);
  }
  return html;
}


function guardEnLinks(html) {
  // Build-guard: een gegenereerde EN-pagina mag GEEN interne link naar een
  // NL-slug bevatten (behalve de taalwissel, die bewust de NL-link toont).
  // Zo blijft de gebruiker na een klik in de gekozen taal. Anders: build faalt.
  const body = html.replace(/<li class="lang-switch"[\s\S]*?<\/li>/, '');
  const bad = new Set();
  for (const m of body.matchAll(/href="\/(?!#)([a-z][a-z0-9-]*)(#[^"]*)?"/g)) {
    if (m[1] === 'en') continue;
    const f = m[1] + '.html';
    if (f === 'admin.html' || f === 'netcongestie-check.html') continue;
    if (existsSync(join(ROOT, f))) bad.add(m[1]);
  }
  return [...bad];
}
// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------
function buildSitemap(pages) {
  const urls = [];
  for (const page of pages) {
    let lastmod = '';
    try { lastmod = statSync(join(ROOT, page)).mtime.toISOString().slice(0, 10); } catch { /* ignore */ }
    for (const l of ['nl', ...LANGS]) {
      const alts = ['nl', ...LANGS]
        .map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${pageUrl(page, x)}"/>`)
        .join('');
      urls.push(`  <url>\n    <loc>${pageUrl(page, l)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    ${alts}\n  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const allHtml = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const pages = allHtml.filter((f) => f !== 'admin.html'); // admin = internal tool, NL only

const dicts = {};
for (const lang of LANGS) {
  dicts[lang] = loadDict(lang);
  if (!dicts[lang]) {
    console.error(`[build] translations/${lang}.json ontbreekt — voeg hem toe of haal '${lang}' uit LANGS.`);
    process.exit(1);
  }
}

console.log(`[build] ${pages.length} pagina's, talen: nl + ${LANGS.join(', ')}`);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'en'), { recursive: true });

let totalMissing = 0;
for (const page of pages) {
  const source = readFileSync(join(ROOT, page), 'utf8');

  // NL version (source + head links, lang ensured)
  writeFileSync(join(OUT, page), finalizeHtml(source, page, 'nl'));

  // Translated versions
  for (const lang of LANGS) {
    const { html, missing } = translatePage(source, dicts[lang], page);
    totalMissing += missing;
    if (missing > 0) console.log(`  [${page}] ${lang}: ${missing} key(s) ontbreken (fallback NL)`);
    const slug = SLUGS[page] || page;
    const outName = slug === '' ? 'index.html' : slug.replace(/\.html$/, '') + '.html';
    const finalHtml = finalizeHtml(html, page, lang);
    writeFileSync(join(OUT, lang, outName), finalHtml);
    const leaked = guardEnLinks(finalHtml);
    if (leaked.length) {
      console.error(`[build] \u274c EN-pagina ${outName} bevat NL-links die taal breken: /${leaked.join(', /')}`);
      process.exitCode = 1;
    }
  }
}
if (totalMissing > 0) console.log(`[build] ⚠️ totaal ${totalMissing} ontbrekende vertaalsleutels (vallen terug op NL)`);

// admin.html: copy as-is (NL only)
writeFileSync(join(OUT, 'admin.html'), readFileSync(join(ROOT, 'admin.html'), 'utf8'));

// Non-HTML root files: copy ONLY what the site needs — internal docs,
// financial models (.xlsx), designs/ etc. must NEVER end up in dist/.
const PUBLIC_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.txt', '.xml', '.css', '.js', '.webmanifest']);
const PUBLIC_DIRS = new Set(['assets']);
for (const f of readdirSync(ROOT)) {
  if (
    f.endsWith('.html') || f.startsWith('.') ||
    f === 'dist' || f === 'translations' || f === 'content' || f === 'docs' ||
    f === 'tools' || f === 'designs' || f === 'build.mjs' ||
    f === 'package.json' || f === 'node_modules'
  ) continue;
  const src = join(ROOT, f);
  if (statSync(src).isDirectory()) {
    if (PUBLIC_DIRS.has(f)) cpSync(src, join(OUT, f), { recursive: true });
  } else if (PUBLIC_EXT.has(extname(f).toLowerCase())) {
    writeFileSync(join(OUT, f), readFileSync(src));
  }
}

// Generated sitemap (lemnion.nl + language variants)
writeFileSync(join(OUT, 'sitemap.xml'), buildSitemap(pages));

console.log(`[build] klaar → dist/ (${pages.length} NL + ${pages.length * LANGS.length} vertaald + sitemap)`);
