#!/usr/bin/env python3
"""Extract the page template, CSS, markup, and latin-subset fonts from the
self-extracting prototype bundle (design/InsurePages.html).

The bundle stores assets in a <script type="__bundler/manifest"> JSON blob
(uuid -> {mime, compressed, data}) and the page in a
<script type="__bundler/template"> JSON string. Font data is plain base64
(wOF2). Run from the repo root: python3 design/extract-prototype.py
"""
import base64
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "reference")
FONTS = {
    # latin-subset variable fonts only (English copy); uuid prefix -> filename
    "b4595f22": "plus-jakarta-sans-latin.woff2",
    "b34f597b": "unbounded-latin.woff2",
}

with open(os.path.join(HERE, "InsurePages.html"), encoding="utf-8") as f:
    bundle = f.read()

manifest = json.loads(
    re.search(r'<script type="__bundler/manifest">(.*?)</script>', bundle, re.DOTALL).group(1)
)
template = json.loads(
    re.search(r'<script type="__bundler/template">(.*?)</script>', bundle, re.DOTALL).group(1)
)

os.makedirs(os.path.join(OUT, "fonts"), exist_ok=True)

with open(os.path.join(OUT, "template.html"), "w", encoding="utf-8") as f:
    f.write(template)

styles = re.findall(r"<style>(.*?)</style>", template, re.DOTALL)
main_css = next(s for s in styles if "@font-face" not in s)
with open(os.path.join(OUT, "main.css"), "w", encoding="utf-8") as f:
    f.write(main_css)

body = template.split("</helmet>", 1)[1]
body = body.replace("</x-dc>", "").replace("</body></html>", "").strip()
with open(os.path.join(OUT, "body.html"), "w", encoding="utf-8") as f:
    f.write(body)

for uuid, asset in manifest.items():
    name = FONTS.get(uuid[:8])
    if not name:
        continue
    raw = base64.b64decode(asset["data"])
    assert raw[:4] == b"wOF2", f"{name}: expected wOF2 magic, got {raw[:4]!r}"
    with open(os.path.join(OUT, "fonts", name), "wb") as f:
        f.write(raw)
    print(f"wrote fonts/{name} ({len(raw)} bytes)")

print("wrote template.html, main.css, body.html")
