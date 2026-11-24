#!/usr/bin/env python3
"""Genereer 1200x630 Open Graph-afbeeldingen in Lemnion-huisstijl.

Gebruik:
    /usr/bin/python3 tools/make_og_images.py

Maakt per blogartikel een kaart in assets/og/<slug>.png en de site-brede
fallback assets/logo-og.png. De kaarten worden gegenereerd uit de <h1> en de
meta-regel (datum) van het artikel, zodat titel en datum altijd kloppen.
"""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "assets" / "fonts"
OUT_DIR = ROOT / "assets" / "og"

W, H = 1200, 630
GREEN_DARK = (15, 61, 35)      # #0F3D23
GREEN_DARKER = (8, 38, 22)     # #082616
GREEN_ACCENT = (127, 191, 58)  # #7FBF3A
GREEN_LIGHT = (183, 224, 138)  # #B7E08A
WHITE = (255, 255, 255)

BOLD = FONT_DIR / "Montserrat-Bold.ttf"
SEMI = FONT_DIR / "Montserrat-SemiBold.ttf"
MEDIUM = FONT_DIR / "Montserrat-Medium.ttf"

# slug -> (bronbestand, optionele vaste titel)
ARTICLES = {
    "blog-sprila-2027": "blog-sprila-2027.html",
    "blog-salderingsregeling": "blog-salderingsregeling.html",
    "blog-leaseauto-belasting": "blog-leaseauto-belasting.html",
    "blog-epbd-iv-laadinfra": "blog-epbd-iv-laadinfra.html",
}


def gradient() -> Image.Image:
    img = Image.new("RGB", (W, H), GREEN_DARK)
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        color = tuple(
            round(GREEN_DARK[i] + (GREEN_DARKER[i] - GREEN_DARK[i]) * t) for i in range(3)
        )
        for x in range(W):
            px[x, y] = color
    return img


def letterspaced(draw, xy, text, font, fill, spacing=3.0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing
    return x


def wrap(draw, text, font, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_title(draw, text, max_width, max_lines=4, start=60, minimum=40):
    size = start
    while size >= minimum:
        font = ImageFont.truetype(str(BOLD), size)
        lines = wrap(draw, text, font, max_width)
        if len(lines) <= max_lines:
            return font, lines, size
        size -= 2
    font = ImageFont.truetype(str(BOLD), minimum)
    return font, wrap(draw, text, font, max_width)[:max_lines], minimum


def bezier(p0, p1, p2, p3, steps=80):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def draw_symbol(img, x, y, height, color=WHITE):
    """Lemniscaat-symbool uit assets/brand/logo/lemnion-symbol-white.svg (viewBox 160)."""
    s = height / 160
    ss = 6  # supersampling
    size = int(round(height * ss))
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    scale = size / 160

    def P(p):
        return (p[0] * scale, p[1] * scale)

    path = []
    path += bezier((40, 120), (0, 120), (0, 40), (40, 40))
    path += bezier((40, 40), (80, 40), (80, 120), (120, 120))
    path += bezier((120, 120), (160, 120), (160, 40), (120, 40))
    path += bezier((120, 40), (80, 40), (80, 120), (40, 120))
    pts = [P(p) for p in path]
    r = 13 * scale / 2
    # stempel schijfjes langs het pad: gladde, ronde lijn zonder kartelranden
    for X, Y in pts:
        d.ellipse([X - r, Y - r, X + r, Y + r], fill=color)
    # de twee stippen uit het origineel
    for cx, cy in ((40, 40), (120, 120)):
        X, Y = P((cx, cy))
        r2 = 6 * scale
        d.ellipse([X - r2, Y - r2, X + r2, Y + r2], fill=color)
    layer = layer.resize((int(round(height)), int(round(height))), Image.LANCZOS)
    img.paste(layer, (int(round(x)), int(round(y))), layer)
    return height


def draw_logo(img, draw, x, y, symbol_h=64, color=WHITE, descriptor=True):
    """Logo-lockup zoals in de site-header: symbool + 'lemnion' + descriptor."""
    draw_symbol(img, x, y, symbol_h, color=color)
    word_size = round(symbol_h * 0.49)
    word_font = ImageFont.truetype(str(BOLD), word_size)
    word_y = y + round(symbol_h * 0.08)
    wx = x + symbol_h + round(symbol_h * 0.28)
    letterspaced(draw, (wx, word_y), "lemnion", word_font, color, spacing=-0.5)
    if descriptor:
        desc_font = ImageFont.truetype(str(SEMI), max(8, round(symbol_h * 0.215)))
        desc_y = word_y + round(word_size * 1.05)
        letterspaced(draw, (wx, desc_y), "HOSPITALITY ENERGY SOLUTIONS", desc_font, GREEN_LIGHT, spacing=symbol_h * 0.055)
    return wx


def build_card(title: str, kicker: str) -> Image.Image:
    img = gradient()
    # subtiel lemniscaat-watermerk rechtsonder, loopt van de kaart af
    draw_symbol(img, 940, 250, 470, color=(127, 191, 58, 26))
    draw = ImageDraw.Draw(img)

    # logo linksboven (zelfde lockup als de site-header)
    draw_logo(img, draw, 72, 52, symbol_h=64)

    # accentlijn + kicker
    draw.rectangle([72, 178, 120, 182], fill=GREEN_ACCENT)
    kicker_font = ImageFont.truetype(str(SEMI), 19)
    letterspaced(draw, (72, 200), kicker.upper(), kicker_font, GREEN_LIGHT, spacing=2.6)

    # titel
    title_font, lines, size = fit_title(draw, title, max_width=880)
    y = 240
    line_height = round(size * 1.18)
    for line in lines:
        draw.text((72, y), line, font=title_font, fill=WHITE)
        y += line_height

    # voettekst + accentbalk
    foot = ImageFont.truetype(str(MEDIUM), 19)
    label = "lemnion.nl"
    draw.text((72, H - 78), label, font=foot, fill=GREEN_LIGHT)
    draw.rectangle([0, H - 7, W, H], fill=GREEN_ACCENT)
    return img


def article_meta(path: Path):
    html = path.read_text(encoding="utf-8")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    title = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else path.stem
    meta = re.search(r'data-i18n="[^"]*\.meta"[^>]*>([^<]+)<', html)
    date = meta.group(1).split("·")[0].strip() if meta else ""
    return title, date


def build_org_logo() -> Image.Image:
    """Vierkant logo (512x512) voor JSON-LD/Organization — geen OG-banner."""
    size = 512
    img = Image.new("RGB", (size, size), (245, 247, 242))  # #F5F7F2
    draw = ImageDraw.Draw(img)
    draw_symbol(img, 146, 84, 220, color=GREEN_ACCENT)
    word_font = ImageFont.truetype(str(BOLD), 96)
    word = "lemnion"
    w = sum(draw.textlength(c, font=word_font) for c in word) + (-1.2 * (len(word) - 1))
    letterspaced(draw, ((size - w) / 2, 352), word, word_font, GREEN_DARK, spacing=-1.2)
    desc_font = ImageFont.truetype(str(SEMI), 16)
    desc = "HOSPITALITY ENERGY SOLUTIONS"
    dw = sum(draw.textlength(c, font=desc_font) + 3.2 for c in desc) - 3.2
    letterspaced(draw, ((size - dw) / 2, 464), desc, desc_font, (46, 112, 50), spacing=3.2)
    return img


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for slug, filename in ARTICLES.items():
        title, date = article_meta(ROOT / filename)
        kicker = f"Blog · {date}" if date else "Blog"
        card = build_card(title, kicker)
        out = OUT_DIR / f"{slug}.png"
        card.save(out, optimize=True)
        print(f"{out.relative_to(ROOT)}  {out.stat().st_size // 1024} KB  — {title}")

    blog_index = build_card("Blogs over wetgeving en energie voor hotels", "Blog · Lemnion")
    blog_index.save(OUT_DIR / "blog.png", optimize=True)
    print("assets/og/blog.png (blogoverzicht)")

    default = build_card("Energieoplossingen voor hotels", "Lemnion")
    default.save(ROOT / "assets" / "logo-og.png", optimize=True)
    print("assets/logo-og.png (site-brede fallback)")

    org = build_org_logo()
    org.save(ROOT / "assets" / "logo-org.png", optimize=True)
    print("assets/logo-org.png (512x512, JSON-LD Organization logo)")


if __name__ == "__main__":
    main()
