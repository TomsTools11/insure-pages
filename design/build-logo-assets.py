#!/usr/bin/env python3
"""Derive the two logo assets the site serves from the master lockup.

Master art is ip-logo.png at the repo root (800x350 RGBA, transparent). It is
padded and sized for a design tool, and its palette assumes a light background,
so neither property survives contact with the site. This script produces:

  site/public/images/insurepages-logo.png       header, on --cream
  site/public/images/insurepages-logo-dark.png  footer, on --ink

Both are trimmed to the art's bounding box (655x259) so CSS can size them
precisely, and palette-quantized (~54kB -> ~12kB; max deviation at display size
is 10/255 on 0.03% of pixels, i.e. invisible).

The dark variant exists because two of the master's colors fail on --ink: the
#1a1a1a outline/shadow disappears into the background entirely, and the #2c5972
"by ... labs" sits at 2.3:1, leaving only the blue "s3" legible. Those two are
remapped to the values this footer already uses on dark -- --yellow for the
shadow (what the old CSS pill used) and #8fc7ff for the attribution. Remapping
is distance-weighted rather than nearest-match so antialiased edge pixels
interpolate smoothly instead of banding.

Run from the repo root: python3 design/build-logo-assets.py
"""
import math
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MASTER = os.path.join(ROOT, "ip-logo.png")
OUT = os.path.join(ROOT, "site", "public", "images")

# (color in the master art) -> (color in the on-ink variant)
DARK_MAP = [
    ((255, 87, 87), (255, 87, 87)),  # brand red      -> unchanged
    ((255, 255, 255), (255, 255, 255)),  # wordmark white -> unchanged
    ((46, 157, 241), (46, 157, 241)),  # s3 blue        -> unchanged
    ((26, 26, 26), (255, 224, 102)),  # ink outline    -> --yellow
    ((44, 89, 114), (143, 199, 255)),  # slate "by/labs"-> footer light blue
]
SIGMA = 46.0  # falloff of the distance weighting, in RGB units


def recolor(img, mapping):
    """Distance-weighted remap: each pixel becomes the weighted blend of the
    target colors, weighted by its proximity to the matching source colors."""
    w, h = img.size
    src = img.load()
    out = Image.new("RGBA", (w, h))
    dst = out.load()
    cache = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a == 0:
                continue
            hit = cache.get((r, g, b))
            if hit is None:
                total, acc = 0.0, [0.0, 0.0, 0.0]
                for (sr, sg, sb), target in mapping:
                    d2 = (r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2
                    weight = math.exp(-d2 / (2 * SIGMA * SIGMA))
                    total += weight
                    for i in range(3):
                        acc[i] += weight * target[i]
                if total < 1e-9:  # far from every source color: leave it alone
                    hit = (r, g, b)
                else:
                    hit = tuple(int(round(min(255, max(0, c / total)))) for c in acc)
                cache[(r, g, b)] = hit
            dst[x, y] = (*hit, a)
    return out


def save(img, name):
    path = os.path.join(OUT, name)
    img.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(path, optimize=True)
    print(f"{name}: {img.size[0]}x{img.size[1]}, {os.path.getsize(path)} bytes")


master = Image.open(MASTER).convert("RGBA")
trimmed = master.crop(master.getbbox())
save(trimmed, "insurepages-logo.png")
save(recolor(trimmed, DARK_MAP), "insurepages-logo-dark.png")
