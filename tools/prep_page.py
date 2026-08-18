#!/usr/bin/env python3
"""
Per-page prep voor het Lemnion i18n-systeem.

Doet drie dingen voor één pagina:
1. Voegt de .lang-switch CSS toe (als die nog ontbreekt).
2. Vervangt het oude Google Translate-menu (🌐) door de echte NL/EN-schakelaar
   met correcte per-pagina links.
3. Past de gedeelde nav/footer-spec toe (translations/specs/_shared.json).

Gebruik:  python3 tools/prep_page.py <pagina.html>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CSS = (
    "        .lang-switch{display:flex;align-items:center;gap:0.45rem;margin-left:0.75rem;white-space:nowrap}\n"
    "        .lang-switch .lang-link{font-family:'Inter',system-ui,sans-serif;font-weight:500;font-size:0.9rem;color:var(--text-muted);text-decoration:none;line-height:1.65}\n"
    "        .lang-switch .lang-link:hover{color:var(--green-accent)}\n"
    "        .lang-switch .lang-link[aria-current=\"true\"]{color:var(--green-secondary)}\n"
    "        .lang-switch .lang-sep{color:var(--border);font-size:0.9rem}"
)

SWITCHER = (
    '            <li class="lang-switch" aria-label="Taal / Language">\n'
    '                <a href="{nl_href}" class="lang-link" lang="nl" hreflang="nl" aria-current="true">NL</a>\n'
    '                <span class="lang-sep" aria-hidden="true">/</span>\n'
    '                <a href="{en_href}" class="lang-link" lang="en" hreflang="en">EN</a>\n'
    "            </li>"
)

# Het oude Google Translate-blok: <li style="position:relative;"> ... </li>
GT_BLOCK = re.compile(
    r'<li style="position:relative;">.*?</li>', re.S
)


def mark_shared(html, spec_entries):
    """Pas de gedeelde spec toe (zelfde logica als tools/mark_i18n.py)."""
    marked = 0
    not_found = []
    for entry in spec_entries:
        key, tag = entry["key"], entry["tag"]
        contains = entry.get("contains", "")
        attrs_hint = entry.get("attrs", "")
        do_all = entry.get("all", False)
        pat = re.compile(rf'<{tag}(?![a-zA-Z0-9])(?P<attrs>[^>]*?)>(?P<inner>.*?)</{tag}>', re.S)
        count = 0
        while True:
            m = next(
                (m for m in pat.finditer(html)
                 if "data-i18n" not in m.group("attrs")
                 and contains in m.group("inner")
                 and attrs_hint in m.group("attrs")),
                None,
            )
            if m is None:
                break
            attrs = m.group("attrs")
            insertion = f' data-i18n="{key}"'
            new_attrs = insertion + attrs if attrs.strip() else attrs + insertion
            html = html[: m.start()] + f"<{tag}{new_attrs}>" + html[m.start() + len(f"<{tag}{attrs}>"):]
            count += 1
            if not do_all:
                break
        marked += count
        if count == 0:
            not_found.append(key)
    return html, marked, not_found


def main():
    if len(sys.argv) != 2:
        print("Gebruik: prep_page.py <pagina.html>")
        sys.exit(1)
    page = sys.argv[1]
    path = ROOT / page
    html = path.read_text(encoding="utf-8")

    # 1) CSS toevoegen als die ontbreekt (check op de echte CSS-content)
    if ".lang-switch .lang-link{" not in html:
        if "</style>" in html:
            html = html.replace("</style>", CSS + "\n        </style>", 1)
            css_added = True
        else:
            css_added = False
    else:
        css_added = False

    # 2) Google Translate-blok vervangen door de taalwisselaar
    m = GT_BLOCK.search(html)
    if m:
        nl_href = "/" if page == "index.html" else "/" + page
        en_href = "/en/" + page
        html = html[: m.start()] + SWITCHER.format(nl_href=nl_href, en_href=en_href) + html[m.end():]
        switcher_done = True
    else:
        switcher_done = False

    # 3) Gedeelde nav/footer-spec toepassen
    shared = json.loads((ROOT / "translations/specs/_shared.json").read_text(encoding="utf-8"))
    html, marked, not_found = mark_shared(html, shared)

    path.write_text(html, encoding="utf-8")
    print(f"✓ {page}: css={css_added} switcher={switcher_done} shared_gemarkeerd={marked}")
    if not_found:
        print(f"⚠️  shared keys niet gevonden op {page}: {not_found}")


if __name__ == "__main__":
    main()
