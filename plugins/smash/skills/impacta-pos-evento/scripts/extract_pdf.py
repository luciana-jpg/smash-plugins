#!/usr/bin/env python3
"""
Extrai texto e imagens de um PDF de pós-evento (formato Smash/Impacta).

Uso:
    python extract_pdf.py "<caminho do PDF>" [pasta_saida]

Saída (default: ./impacta_extract/):
    - texto.txt           -> todo o texto, página a página
    - imgs/               -> todas as imagens (nome: pNN_x<xref>_<larg>x<alt>.png)
    - imgs/_catalogo.txt  -> lista de imagens com dimensões (ajuda a escolher fotos)

Ignora imagens minúsculas (<= 8px), que são artefatos de layout.
Requer: PyMuPDF (fitz) e Pillow. Instale com:
    python -m pip install pymupdf pillow
"""
import sys, os

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    try:
        import fitz
    except ImportError:
        print("Falta o PyMuPDF. Rode: python -m pip install pymupdf pillow"); sys.exit(1)

    pdf = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "impacta_extract"
    imgs = os.path.join(out, "imgs")
    os.makedirs(imgs, exist_ok=True)

    doc = fitz.open(pdf)

    # --- texto ---
    with open(os.path.join(out, "texto.txt"), "w") as f:
        for i, page in enumerate(doc):
            f.write(f"===== PÁGINA {i+1} =====\n{page.get_text()}\n\n")

    # --- imagens ---
    seen = set()
    catalogo = []
    for pno in range(doc.page_count):
        for img in doc[pno].get_images(full=True):
            xref = img[0]
            if xref in seen:
                continue
            seen.add(xref)
            try:
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha >= 4:            # CMYK -> RGB
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                w, h = pix.width, pix.height
                if w <= 8 or h <= 8:                   # artefato de layout
                    continue
                fn = f"p{pno+1:02d}_x{xref}_{w}x{h}.png"
                pix.save(os.path.join(imgs, fn))
                kb = os.path.getsize(os.path.join(imgs, fn)) // 1024
                catalogo.append((pno+1, fn, w, h, kb))
            except Exception as e:
                print("erro", pno+1, xref, e)

    with open(os.path.join(imgs, "_catalogo.txt"), "w") as f:
        f.write("pag  arquivo                          larg x alt     tamanho\n")
        for pno, fn, w, h, kb in catalogo:
            f.write(f"{pno:3d}  {fn:32s}  {w:5d}x{h:<5d}  {kb}KB\n")

    print(f"OK. {doc.page_count} páginas de texto e {len(catalogo)} imagens em '{out}/'.")
    print(f"Veja '{imgs}/_catalogo.txt' e abra as fotos maiores para escolher as boas.")
    print("Fotos boas em geral: >= 600px de largura. Descarte grafismos/plantas se não for usar.")

if __name__ == "__main__":
    main()
