#!/usr/bin/env python3
"""
Lemnion i18n inventory: lijst alle vertaalbare tekstelementen van een pagina.

Gebruik:  python3 tools/inventory.py <pagina.html>
Output: per regel  <tag> <tekst-voorbeeld> | <attrs-voorbeeld>
Gebruik dit om translations/specs/<pagina>.json op te stellen.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def main():
    if len(sys.argv) != 2:
        print("Gebruik: inventory.py <pagina.html>")
        sys.exit(1)
    html = (ROOT / sys.argv[1]).read_text(encoding="utf-8")

    pattern = re.compile(
        r'<(h[1-4]|p|a|button|span|label|td|th|li|text)(?![a-zA-Z0-9])(?P<attrs>[^>]*?)>(?P<inner>.*?)</\1>',
        re.S,
    )
    seen = []
    for m in pattern.finditer(html):
        inner = m.group("inner")
        attrs = m.group("attrs")
        text = re.sub(r"<[^>]+>", "", inner).strip()
        if not text:
            continue
        if "data-i18n" in attrs:
            continue
        if "nav-logo" in attrs and "svg" in inner:
            continue
        # sla SVG-attributes op met data-i18n (al gemarkeerd) of path-achtige vals positieven
        if re.match(r"^ath ", attrs):
            continue
        snip = inner.replace("\n", " ").strip()[:60]
        seen.append((m.group(1), text[:50], attrs.strip()[:50], snip))

    print(f"TOTAAL: {len(seen)} tekstelementen (zonder data-i18n)\n")
    for i, (tag, text, attrs, snip) in enumerate(seen):
        print(f"{i:3} <{tag}> {text!r} | attrs={attrs!r}")

if __name__ == "__main__":
    main()
