"""Converte o PDF do TCC em imagens para o caderno (flip book).

Uso (na raiz do projeto; requer `pip install pymupdf`):
  python ferramentas/gerar-caderno-tcc.py "documentos/CADERNO_FINAL-FINAL-ISSUU FINAL.pdf" imagens/tcc > caderno.json
Depois, cole o conteúdo de caderno.json no <script id="flipbook-pages">
de projetos/dados-e-territorio.html.

Regra de diagramação do PDF (confirmada pela posição dos números de página):
páginas de número PAR no PDF foram feitas para ficar à ESQUERDA e as de
número ÍMPAR à DIREITA (a capa, página 1, fica sozinha à direita). Páginas
largas (duplas) são divididas: metade esquerda à esquerda, metade direita à
direita. Assim os mapas que atravessam duas páginas abrem inteiros.

O script:
- exclui as páginas escolhidas pela autora (EXCLUIR);
- insere páginas em branco (null) sempre que uma página cairia no lado errado;
- grava JPEGs em imagens/tcc/ e imprime o manifesto JSON da sequência.
No caderno, posição 1 = capa (direita); posições pares = esquerda.
"""
import json, sys, pathlib
import pymupdf

pdf_path, out_dir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
EXCLUIR = {2, 4, 5, 6, 7}
PAGE_W = 1000                       # largura em px de cada página do caderno
out_dir.mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(pdf_path)
seq = []                            # nomes de arquivo (str) ou None para página em branco


def place(name, left):
    """Acrescenta a página no lado pedido, com uma branca antes se preciso."""
    next_is_left = (len(seq) + 1) % 2 == 0
    if next_is_left != left:
        seq.append(None)
    seq.append(name)


def render(page, clip, name):
    zoom = PAGE_W / clip.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
    pix.save(out_dir / name, jpg_quality=78)


for i, page in enumerate(doc):
    n = i + 1
    if n in EXCLUIR:
        continue
    r = page.rect
    if r.width > 1000:              # página larga: duas metades
        mid = r.x0 + r.width / 2
        for side, clip, left in (("esq", pymupdf.Rect(r.x0, r.y0, mid, r.y1), True),
                                 ("dir", pymupdf.Rect(mid, r.y0, r.x1, r.y1), False)):
            name = f"p{n:03}-{side}.jpg"
            render(page, clip, name)
            place(name, left)
    else:
        name = f"p{n:03}.jpg"
        render(page, r, name)
        place(name, left=(n % 2 == 0))

blanks = [k + 1 for k, s in enumerate(seq) if s is None]
size = sum(f.stat().st_size for f in out_dir.glob("*.jpg"))
print(f"páginas no caderno: {len(seq)} | brancas: {len(blanks)} em {blanks} | "
      f"{len(list(out_dir.glob('*.jpg')))} imagens, {size/1e6:.1f} MB", file=sys.stderr)
print(json.dumps(seq))
