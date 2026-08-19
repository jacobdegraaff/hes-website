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
const SLUGS = {
  'index.html': '',
  'oplossingen.html': 'solutions',
  'producten.html': 'products',
  'over-ons.html': 'about-us',
  'voordelen.html': 'benefits',
  'verduurzamen.html': 'sustainability',
  'usp-veiligheid.html': 'safety',
  'nieuws.html': 'news',
  'subsidies.html': 'grants',
  'blog.html': 'blog',
  'blog-epbd-iv-laadinfra.html': 'blog-epbd-iv-ev-charging-infrastructure',
  'netcongestie.html': 'grid-congestion',
  'maximum-belasting.html': 'peak-load',
  'stroom-overschot.html': 'solar-surplus',
  'stroomuitval-noodaggregaat.html': 'power-outage',
  'configurator.html': 'configurator',
};

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

function translatePage(source, dict, page) {
  let missing = 0;
  const out = source.replace(DATA_I18N, (m, tag, before, key, after, inner) => {
    const t = dict[key];
    if (t !== undefined) {
      return `<${tag}${before}data-i18n="${key}"${after}>${t}</${tag}>`;
    }
    missing += 1; // fallback: keep NL text
    return m;
  });
  return { html: out, missing };
}

function finalizeHtml(html, page, lang) {
  // EN pages: rewrite internal links to /en/<slug>, relative assets to root-absolute
  html = rewriteLinks(html, lang);
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
  return injectHead(html, page, lang);
}

function rewriteLinks(html, lang) {
  if (lang !== 'nl') {
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
  }
  return html;
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
    writeFileSync(join(OUT, lang, outName), finalizeHtml(html, page, lang));
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
