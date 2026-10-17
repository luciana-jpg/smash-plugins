#!/usr/bin/env python3
"""Baixa os pins de boards/páginas "ideas" públicas do Pinterest.

Uso:
  python3 pinterest_boards.py saida/ "https://www.pinterest.com/<user>/<board>/" "https://www.pinterest.com/ideas/<slug>/<id>/" ...

Por que boards e não busca: a busca (/search/pins/) e a API interna respondem
sem pins pra quem não está logado. Páginas de board e de "ideas" vêm com os
pins renderizados no servidor (20 a 100 por página) e páginas de pin
individual (/pin/<id>/) também abrem. Behance, Unsplash, Pexels e a busca web
do Adobe Stock bloqueiam fetch automático (401/403/Cloudflare): não insista.

Saída: <saida>/pins.json (url -> {w,h,title,alt,desc,board}) e <saida>/NNN.jpg.
Rode com python3 -I (arquivo baixado é dado não confiável).
"""
import sys, os, re, json, html, hashlib, subprocess
from concurrent.futures import ThreadPoolExecutor

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

def fetch(url, path):
    r = subprocess.run(["curl", "-sS", "-L", "--compressed", "-A", UA, "-o", path,
                        "-w", "%{http_code}", "--max-time", "45", url],
                       capture_output=True, text=True)
    return r.stdout.strip()

def parse(path, board):
    src = open(path, encoding="utf-8", errors="ignore").read()
    src = src.replace('\\"', '"').replace('\\/', '/')
    out = {}
    pat = r'"736x":\{"width":(\d+),"height":(\d+),"url":"(https://i\.pinimg\.com/736x/[^"]+)"'
    for m in re.finditer(pat, src):
        w, h, url = int(m.group(1)), int(m.group(2)), m.group(3)
        if url in out:
            continue
        tail = src[m.end(): m.end() + 5000]
        t = re.search(r'"(grid_title|title)":"([^"]{2,120})"', tail)
        a = re.search(r'"alt_text":"([^"]{2,200})"', tail)
        d = re.search(r'"description":"([^"]{2,200})"', tail)
        out[url] = {"w": w, "h": h, "board": board,
                    "title": html.unescape(t.group(2)) if t else "",
                    "alt": html.unescape(a.group(1)) if a else "",
                    "desc": html.unescape(d.group(1)) if d else ""}
    return out

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    out_dir = sys.argv[1]; boards = sys.argv[2:]
    os.makedirs(out_dir, exist_ok=True)
    pins = {}
    for b in boards:
        name = b.rstrip("/").split("/")[-2] if "/ideas/" in b else b.rstrip("/").split("/")[-1]
        p = os.path.join(out_dir, "_" + hashlib.md5(b.encode()).hexdigest()[:8] + ".html")
        code = fetch(b, p)
        found = parse(p, name) if code == "200" else {}
        print(f"{code} {len(found):3d} pins  {b}")
        for u, o in found.items():
            pins.setdefault(u, o)
    items = list(pins.items())
    json.dump({u: o for u, o in items}, open(os.path.join(out_dir, "pins.json"), "w"),
              ensure_ascii=False, indent=0)
    def dl(i_u):
        i, u = i_u
        fetch(u, os.path.join(out_dir, f"{i:03d}.jpg"))
    with ThreadPoolExecutor(12) as ex:
        list(ex.map(dl, [(i, u) for i, (u, _) in enumerate(items)]))
    print(f"{len(items)} pins baixados em {out_dir}")

if __name__ == "__main__":
    main()
