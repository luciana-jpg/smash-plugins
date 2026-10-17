#!/usr/bin/env python3
"""Folha de contato numerada pra curar imagens OLHANDO, não pelo nome do arquivo.

Uso: python3 contact_sheet.py <pasta_com_jpgs> <prefixo_saida> [colunas=6] [por_folha=36]
Gera <prefixo>_00.jpg, _01.jpg... com o nome de cada arquivo embaixo da miniatura.
Abra cada folha com a ferramenta de leitura de imagem e anote os números que ficam.
"""
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont

folder, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
per = int(sys.argv[4]) if len(sys.argv) > 4 else 36
files = sorted(glob.glob(os.path.join(folder, "*.jpg")))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except Exception:
    font = ImageFont.load_default()
cw, ch = 300, 300
for page in range(0, len(files), per):
    chunk = files[page:page + per]
    rows = (len(chunk) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, rows * (ch + 30)), "white")
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        try:
            im = Image.open(f).convert("RGB"); im.thumbnail((cw - 6, ch - 6))
        except Exception:
            continue
        x, y = (i % cols) * cw, (i // cols) * (ch + 30)
        sheet.paste(im, (x + 3, y + 3))
        d.rectangle([x, y + ch, x + cw, y + ch + 30], fill="black")
        d.text((x + 6, y + ch + 3), os.path.basename(f)[:-4], fill="yellow", font=font)
    name = f"{out}_{page // per:02d}.jpg"
    sheet.save(name, quality=80); print(name, len(chunk))
