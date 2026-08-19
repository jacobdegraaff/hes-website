#!/usr/bin/env python3
"""
Lemnion i18n marking tool.

Adds data-i18n="key" attributes to HTML elements based on a spec file, and
validates that every key exists in translations/en.json.

Usage:  python3 tools/mark_i18n.py <page.html> <spec.json>

Spec format (translations/specs/<page>.json):
[
  {"key": "nav.oplossingen", "tag": "a", "contains": "Oplossingen ▾"},
  {"key": "footer.netcongestie", "tag": "a", "contains": "Netcongestie", "all": true},
  {"key": "cta.contact", "tag": "a", "contains": "Contact", "attrs": "btn btn-primary"}
]

- contains : substring that must appear in the element's inner content
- attrs    : optional substring that must appear in the element's attributes
- all      : optional; mark EVERY unmarked match (for identical duplicates)
- Only elements without an existing data-i18n attribute are considered.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def main():
    if len(sys.argv) != 3:
        print("Usage: mark_i18n.py <page.html> <spec.json>")
        sys.exit(1)
    page_path = ROOT / sys.argv[1]
    spec_path = Path(sys.argv[2])
    if not spec_path.is_absolute():
        spec_path = ROOT / spec_path

    html = page_path.read_text(encoding="utf-8")
    spec = json.loads(spec_path.read_text(encoding="utf-8"))

    # Load dictionary to validate keys (merge en.json + alle en.*.json per-pagina-bestanden)
    en = {}
    for f in sorted((ROOT / "translations").iterdir()):
        if f.is_file() and f.name.startswith("en.") and f.name.endswith(".json"):
            en.update(json.loads(f.read_text(encoding="utf-8")))

    missing_keys = [e["key"] for e in spec if e["key"] not in en]
    if missing_keys:
        print(f"⚠️  keys niet in translations/en.json: {missing_keys}")
        # not fatal: marking can still happen (build falls back to NL)

    not_found = []
    marked = 0
    for entry in spec:
        key, tag = entry["key"], entry["tag"]
        contains = entry.get("contains", "")
        attrs_hint = entry.get("attrs", "")
        do_all = entry.get("all", False)

        # element regex: <tag attrs>inner</tag> without data-i18n yet.
        # (?![a-zA-Z0-9]) voorkomt dat <p> ook <path> of <picture> matcht.
        pat = re.compile(rf'<{tag}(?![a-zA-Z0-9])(?P<attrs>[^>]*?)>(?P<inner>.*?)</{tag}>', re.S)

        count = 0
        while True:
            # re-scan after every modification so positions stay valid
            m = next(
                (
                    m
                    for m in pat.finditer(html)
                    if "data-i18n" not in m.group("attrs")
                    and contains in m.group("inner")
                    and attrs_hint in m.group("attrs")
                ),
                None,
            )
            if m is None:
                break
            attrs = m.group("attrs")
            insertion = f' data-i18n="{key}"'
            new_attrs = insertion + attrs if attrs.strip() else attrs + insertion
            html = html[: m.start()] + f"<{tag}{new_attrs}>" + html[m.start() + len(f"<{tag}{attrs}>") :]
            count += 1
            if not do_all:
                break
        marked += count
        if count == 0:
            not_found.append(key)

    page_path.write_text(html, encoding="utf-8")
    print(f"✓ {page_path.name}: {marked} elementen gemarkeerd")
    if not_found:
        print(f"⚠️  niet gevonden ({len(not_found)}): {not_found}")
        sys.exit(2)

if __name__ == "__main__":
    main()
