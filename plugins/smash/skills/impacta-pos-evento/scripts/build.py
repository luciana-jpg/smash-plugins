#!/usr/bin/env python3
"""
Monta o dashboard final autocontido: pega o template.html com tokens,
otimiza as fotos, embute tudo como data URI e escreve um único .html
que abre em qualquer navegador (sem depender de arquivos externos).

Uso:
    python build.py <template.html> <mapa.json> <saida.html>

<mapa.json> mapeia cada token de imagem do template -> caminho do arquivo:
    {
      "__LOGO__":    "imgs/p01_x7_794x292.png",
      "__HERO__":    "imgs/p07_x183_1200x800.png",
      "__PLENARY__": "imgs/p02_x77_941x622.png",
      ...
    }

Regras de otimização (mantêm o arquivo leve sem perder qualidade):
    - Logo (transparência): PNG, largura <= 640.
    - Hero (imagem grande de topo): JPEG q80, largura <= 1400.
    - Demais fotos: JPEG q82-86, largura <= 900-1200.
O script decide pelo nome do token; ajuste TOKEN_RULES se precisar.

Os ícones (setas azul/roxo etc.) são injetados automaticamente — não precisam
estar no mapa. Requer Pillow: python -m pip install pillow
"""
import sys, os, json, base64, io, re

# largura máx e qualidade por token (fallback: 900px / q82)
TOKEN_RULES = {
    "__LOGO__":  ("png", 640, None),
    "__HERO__":  ("jpg", 1400, 80),
    "__BAR__":   ("jpg", 1200, 82),
    "__PLAN__":  ("jpg", 1200, 85),
    "__PAINEL__":("jpg", 960, 80),
    "__WELCOME__":("jpg", 1100, 82),
    "__GIFT__":  ("jpg", 760, 86),
    "__GIFTBOX__":("jpg", 640, 86),
}

# ícones inline — azul (#00E5FF) e roxo (#9333EA) SÓ aqui, pontualmente
ICONS = {
 "__ICO_UP__":  '<svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" stroke-width="3"><path d="M5 12l5 5L19 7"/></svg>',
 "__ICO_DN__":  '<svg viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="3"><path d="M12 5v13M6 12l6 6 6-6"/></svg>',
 "__ICO_UP2__": '<svg viewBox="0 0 24 24" fill="none" stroke="#00E5FF" stroke-width="3"><path d="M6 15l6-6 6 6"/></svg>',
 "__ICO_DN2__": '<svg viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>',
 "__ICO_WARN__":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 8v5"/><circle cx="12" cy="16.4" r=".5" fill="currentColor"/><circle cx="12" cy="12" r="9"/></svg>',
}

def data_uri(path, kind, w, q):
    from PIL import Image
    if kind == "png":
        im = Image.open(path).convert("RGBA")
        if w and im.width > w:
            im = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
        b = io.BytesIO(); im.save(b, "PNG", optimize=True)
        return "data:image/png;base64," + base64.b64encode(b.getvalue()).decode()
    im = Image.open(path).convert("RGB")
    if w and im.width > w:
        im = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=q or 82, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()

def main():
    if len(sys.argv) != 4:
        print(__doc__); sys.exit(1)
    template, mapa_path, saida = sys.argv[1:4]
    html = open(template).read()
    mapa = json.load(open(mapa_path))

    for token, path in mapa.items():
        kind, w, q = TOKEN_RULES.get(token, ("jpg", 900, 82))
        if not os.path.exists(path):
            print(f"AVISO: arquivo não encontrado para {token}: {path}"); continue
        html = html.replace(token, data_uri(path, kind, w, q))

    for token, svg in ICONS.items():
        html = html.replace(token, svg)

    # garante doctype/head para arquivo standalone
    if not html.lstrip().lower().startswith("<!doctype"):
        html = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width,initial-scale=1">'
                + html + "</html>")

    faltando = sorted(set(re.findall(r"__[A-Z0-9_]+__", html)))
    open(saida, "w").write(html)
    mb = len(html.encode())/1e6
    print(f"OK -> {saida}  ({mb:.2f} MB)")
    if faltando:
        print("ATENÇÃO: tokens não preenchidos (troque no mapa ou remova do template):")
        for t in faltando: print("  ", t)

if __name__ == "__main__":
    main()
