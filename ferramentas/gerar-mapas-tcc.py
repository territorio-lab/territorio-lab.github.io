"""Extrai os mapas do PDF do TCC para a grade de mapas da página do projeto.

Uso (na raiz do projeto; requer `pip install pymupdf`):
  python ferramentas/gerar-mapas-tcc.py "documentos/CADERNO_FINAL-FINAL-ISSUU FINAL.pdf" imagens/tcc-mapas

Mapas em página dupla saem inteiros numa imagem só: as duas páginas simples
lado a lado (ex.: 36+37) ou a página larga do PDF. Os nomes e páginas são os
mesmos do índice do caderno em projetos/dados-e-territorio.html.
"""
import sys, pathlib
import pymupdf

pdf_path, out_dir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
PAGE_W = 1200          # largura em px de UMA página do PDF (dupla = 2400)

# (arquivo, páginas do PDF)
MAPAS = [
    ("01-bacias-hidrograficas", (36, 37)),
    ("02-mapa-da-desigualdade", (40, 41)),
    ("03-evolucao-da-mancha-urbana", (43,)),
    ("04-eixo-moema-capao", (46,)),
    ("05-padroes-de-deslocamento", (56,)),
    ("06-eixo-de-intervencao", (60,)),
    ("07-centralidades", (62,)),
    ("08-favelas-e-area-de-influencia", (64,)),
    ("09-perfil-do-percurso", (69,)),
    ("10-demandas-e-proposta", (94,)),
]

src = pymupdf.open(pdf_path)
out_dir.mkdir(parents=True, exist_ok=True)
single_w = src[0].rect.width

for name, pages in MAPAS:
    # Monta as páginas lado a lado num PDF temporário e rasteriza.
    rects = [src[n - 1].rect for n in pages]
    width, height = sum(r.width for r in rects), max(r.height for r in rects)
    tmp = pymupdf.open()
    sheet = tmp.new_page(width=width, height=height)
    x = 0
    for n, r in zip(pages, rects):
        sheet.show_pdf_page(pymupdf.Rect(x, 0, x + r.width, r.height), src, n - 1)
        x += r.width
    zoom = PAGE_W / single_w
    pix = sheet.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    pix.save(out_dir / f"{name}.jpg", jpg_quality=82)
    print(f"{name}.jpg  {pix.width}x{pix.height}")
