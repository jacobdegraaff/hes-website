#!/usr/bin/env python3
"""Genereer de Lemnion-deelafbeeldingen (Open Graph) in huisstijl.

Gebruik:
    /usr/bin/python3 tools/make_og_images.py

- assets/logo-og.png   1200x627 (LinkedIn-linkpreview, 1.91:1): alleen het
                       Lemnion-logo, gecentreerd op donkergroen.
- assets/logo-org.png  512x512 vierkant logo voor het Organization-schema.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "assets" / "fonts"

W, H = 1200, 627                # LinkedIn link preview: 1.91:1
GREEN_DARK = (15, 61, 35)       # #0F3D23
GREEN_ACCENT = (127, 191, 58)   # #7FBF3A
GREEN_LIGHT = (183, 224, 138)   # #B7E08A
WHITE = (255, 255, 255)

BOLD = FONT_DIR / "Montserrat-Bold.ttf"
SEMI = FONT_DIR / "Montserrat-SemiBold.ttf"


def letterspaced(draw, xy, text, font, fill, spacing=3.0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + spacing
    return x


def bezier(p0, p1, p2, p3, steps=120):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def draw_symbol(img, x, y, height, color=WHITE):
    """Lemniscaat uit de site-header (viewBox 160, stroke 13) als PIL-pad."""
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
    for X, Y in pts:  # stempel schijfjes: gladde lijn zonder kartels
        d.ellipse([X - r, Y - r, X + r, Y + r], fill=color)
    for cx, cy in ((40, 40), (120, 120)):
        X, Y = P((cx, cy))
        r2 = 6 * scale
        d.ellipse([X - r2, Y - r2, X + r2, Y + r2], fill=color)
    layer = layer.resize((int(round(height)), int(round(height))), Image.LANCZOS)
    img.paste(layer, (int(round(x)), int(round(y))), layer)


def lockup(symbol_h):
    """Volledige logo-lockup op transparante laag: symbool + woordmerk + descriptor."""
    width = int(symbol_h * 8)
    height = int(symbol_h * 1.7)
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    draw_symbol(layer, 0, 0, symbol_h, color=WHITE)
    word_size = round(symbol_h * 0.49)
    word_font = ImageFont.truetype(str(BOLD), word_size)
    word_y = round(symbol_h * 0.06)
    wx = symbol_h + round(symbol_h * 0.28)
    letterspaced(draw, (wx, word_y), "lemnion", word_font, WHITE, spacing=-symbol_h * 0.008)

    desc_font = ImageFont.truetype(str(SEMI), max(8, round(symbol_h * 0.19)))
    desc_y = word_y + round(word_size * 1.14)
    letterspaced(draw, (wx, desc_y), "HOSPITALITY ENERGY SOLUTIONS", desc_font, GREEN_LIGHT,
                 spacing=symbol_h * 0.042)
    return layer.crop(layer.getbbox())


def build_share_card() -> Image.Image:
    """Alleen het logo, gecentreerd, 1200x627 (LinkedIn-formaat)."""
    img = Image.new("RGB", (W, H), GREEN_DARK)
    logo = lockup(symbol_h=132)
    img.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2), logo)
    return img


def build_org_logo() -> Image.Image:
    """Vierkant logo (512x512) voor JSON-LD/Organization."""
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
    card = build_share_card()
    # Bestandsnaam = cache-buster: LinkedIn cachet per URL, dus een nieuwe
    # afbeelding krijgt een nieuwe naam in plaats van dezelfde te overschrijven.
    card.save(ROOT / "assets" / "lemnion-share-1200x627.png", optimize=True)
    card.save(ROOT / "lemnion-share-1200x627.png", optimize=True)  # root: buiten /assets/
    card.save(ROOT / "assets" / "logo-og.png", optimize=True)  # legacy URL
    print(f"assets/lemnion-share-1200x627.png  {card.width}x{card.height}")

    org = build_org_logo()
    org.save(ROOT / "assets" / "logo-org.png", optimize=True)
    print("assets/logo-org.png  512x512")


if __name__ == "__main__":
    main()
