#!/usr/bin/env python3
"""Gera o HTML da seção "Refs de banco de imagem" a partir de uma curadoria.

Uso: python3 build_gallery.py curadoria.json pasta_saida/ > secao.html

curadoria.json:
{
  "pins": "dl/pins.json",                 # saída do pinterest_boards.py (opcional)
  "pins_dir": "dl/pins",
  "stock": [ {"id":"123","name":"...","url":"https://t4.ftcdn.net/.../240_F_123_x.jpg"} ],  # do asset_search StockAsset (opcional)
  "stock_dir": "dl/stock",
  "boards": {"nome-do-board": "https://www.pinterest.com/..."},
  "grupos": [
    {"titulo": "Forma e sistema", "tese": "uma linha dizendo o que esse grupo ensina",
     "itens": [["p131", "legenda: por que essa imagem está aqui"], ["s16", "..."]]}
  ]
}
Chaves: pNNN = índice do pin em pins.json; sNN = índice na lista stock.
Copia as imagens (máx. 900px) pra <pasta_saida>/refs/ e imprime o <section>.
"""
import sys, os, json, html
from PIL import Image

cfg = json.load(open(sys.argv[1])); out_dir = sys.argv[2]
os.makedirs(os.path.join(out_dir, "refs"), exist_ok=True)
pins = list(json.load(open(cfg["pins"])).items()) if cfg.get("pins") else []
stock = cfg.get("stock", [])
boards = cfg.get("boards", {})

def resolve(k):
    if k.startswith("p"):
        n = int(k[1:]); u, o = pins[n]
        src = os.path.join(cfg["pins_dir"], f"{n:03d}.jpg")
        return src, {"href": u, "cred": f'<a href="{u}">imagem</a> · <a href="{boards.get(o["board"], "#")}">board</a>', "alt": o["title"] or o["alt"]}
    n = int(k[1:]); a = stock[n]
    src = os.path.join(cfg["stock_dir"], f"s{n:02d}.jpg")
    href = f"https://stock.adobe.com/images/{a['id']}"
    return src, {"href": href, "cred": f'<a href="{href}">Adobe Stock #{a["id"]}</a>', "alt": a["name"]}

print('<section class="band" style="background:var(--paper-2)"><div class="in">')
print('<p class="eyebrow">Refs de banco de imagem</p><h2>O que achei nos bancos</h2>')
for g in cfg["grupos"]:
    print(f'<div class="grp"><h3>{html.escape(g["titulo"])}</h3><p class="note">{html.escape(g["tese"])}</p><div class="gal">')
    for k, cap in g["itens"]:
        src, m = resolve(k)
        dst = f"refs/{k}.jpg"
        im = Image.open(src).convert("RGB"); im.thumbnail((900, 900)); im.save(os.path.join(out_dir, dst), quality=82)
        print(f'<figure class="rf"><a href="{m["href"]}"><img src="{dst}" alt="{html.escape(m["alt"] or cap[:80])}" loading="lazy" width="{im.size[0]}" height="{im.size[1]}"></a>'
              f'<figcaption>{html.escape(cap)}<span>{m["cred"]}</span></figcaption></figure>')
    print('</div></div>')
print('</div></section>')
