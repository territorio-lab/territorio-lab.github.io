## Memory

Your memory is OptMem:
- The tool is `~/.optmem/memo`
- Your memories are in `~/.optmem/memory`

OptMem outlives every session, compaction, model and vendor change.
Without it you do not know who you are, or what was decided and tried.

### At startup: activating OptMem (mandatory)

Run `~/.optmem/memo wake` before any other tool call, in every session, and
then do exactly what it prints, to the end of its output.

### While working: register memories (mandatory)

Call `~/.optmem/memo note "<1 line, max 280 bytes>"` whenever you learn
something new, or something worth keeping happens. That covers a task worth
real effort, a fact or insight the user teaches you, anything you learn about
their life (even indirectly), any event of lasting effect.

Do not register redundant memories.

If `~/.optmem/memo note` asks a compression: do it before your next action.

Never edit or delete anything under `~/.optmem/memory`: the tool manages it.

### When you need an old memory: search, or navigate

`~/.optmem/memo recall <regex>` searches every memory, word for word.

Your memories also form a binary tree: `#0-1`, `#2-3` ... exist as one-line
summaries, pairs of those as `#0-3`, and so on -- every `#a-b` line wake prints
is one node of it. `~/.optmem/memo zoom <a-b>` opens a node into its two
halves, down to the raw memories.

### If you're a subagent: skip everything above

Parallel sessions on this machine are all you, and may all write memories.
A subagent is not: it must never run `memo`, because it cannot judge what is
already known, and its notes would arrive duplicated and incorrectly. When you
spawn one, write: `You are a subagent. Don't run memo.`

## Projeto: Território Lab

### Visão geral

- Site estático de portfólio e laboratório de estudo/fabricação digital.
- A página inicial é `index.html`; o estilo compartilhado fica em `style.css` e
  o comportamento em `script.js`.
- `projetos/` contém páginas individuais de projetos e `laboratorio/` contém
  páginas sobre processo, método, fabricação e investigação.
- `documentos/` guarda PDFs para download; `vendor/` guarda bibliotecas de
  terceiros copiadas para o site; `ferramentas/` guarda scripts locais (não
  usados pelo site no navegador).
- As imagens ficam em `imagens/`. Preserve os nomes e caminhos relativos ao
  mover ou publicar os arquivos.
- A identidade visual usa fundo branco (`--paper:#fff`), tipografia editorial/monoespaçada,
  verde-lima como cor de destaque, cartões de projeto e navegação responsiva.
  A referência visual atual é o mappinglab.me: cabeçalho branco simples e
  rodapé preto só com ícones sociais. A home usa a fonte Inter (como a
  referência); títulos de seção em Inter 900 maiúsculo (`.section-title`).
- Cabeçalho e rodapé são iguais em todas as páginas: menu "projetos / sobre /
  contato" + ícones sociais (`.header-social`, ocultos até 760px) e rodapé com
  `.footer-social`. Ao mudar um, replique nas páginas de `projetos/` e
  `laboratorio/`. Cada SVG do Medium usa um `id` de máscara próprio
  (`medium-cutout-header` / `medium-cutout-footer`).
- As páginas de `laboratorio/` não têm mais seção na home; ficam acessíveis
  entre si pelos links "anterior/próximo".

### Comportamentos e layout importantes

- A grade principal de projetos (`.project-grid`) usa duas colunas em telas
  maiores e uma coluna até 430px.
- A home não exibe mais filtros de projetos, mas os cards mantêm
  `data-category`. Os filtros (projetos e galerias) usam a função `setupFilter`
  em `script.js`, com `data-filter`/`data-gallery-filter` e o estado
  `aria-pressed`; preserve esses atributos e a acessibilidade. O número no
  `<span>` de cada botão é calculado pelo script.
- As galerias das páginas de projeto usam `.gallery-row` com imagens flexíveis e
  variáveis de proporção (`.gallery-ratio-079`, `.gallery-ratio-133`,
  `.gallery-ratio-134`, `.gallery-ratio-136`, `.gallery-ratio-158`,
  `.gallery-ratio-167`,
  `.gallery-ratio-178`, `.gallery-ratio-243`, `.gallery-ratio-405`). A classe
  deve corresponder à proporção real do arquivo (largura ÷ altura); se nenhuma
  servir, crie uma nova em `style.css` e liste aqui. Faixas e panoramas muito
  largos (acima de ~2,4) ficam sozinhos na linha. Cada linha
  calcula uma altura comum a partir da soma das proporções, como no mosaico do
  Medium; até 760px, cada linha vira uma coluna.
- O filtro das galerias usa `data-gallery-filter` e `data-gallery-category`;
  linhas que ficam sem imagens visíveis recebem `hidden`. Evite juntar o
  panorama (`.gallery-ratio-405`) com outras imagens na mesma linha, pois a
  linha fica baixa demais.
- Imagens com `.lightbox-trigger` abrem no lightbox implementado em
  `script.js`; preserve teclado, foco, `Escape` e texto alternativo.
- O menu recolhível é ativado em telas pequenas.

### Fluxo de trabalho

- Abra `index.html` localmente para uma verificação rápida.
- Antes de publicar, substitua textos, imagens, links e o e-mail provisórios
  pelos dados reais dos projetos.
- Evite introduzir dependências ou um framework sem necessidade: o projeto é
  deliberadamente HTML, CSS e JavaScript estáticos.

## Changelog

### 2026-11-14 — Documentação inicial do projeto

- Registradas a estrutura de pastas e a identidade visual do Território Lab.
- Documentadas a grade de projetos, a grade/mosaico responsivo das galerias,
  os filtros e o lightbox.
- Registrado o fluxo atual de teste local e a natureza provisória de parte do
  conteúdo.

### 2026-11-14 — Proporção das galerias

- Corrigidas as proporções das imagens da galeria de Espaços Públicos conforme
  as dimensões reais dos arquivos.
- Ajustado o CSS para manter altura uniforme por linha, com `object-fit: cover`
  e fallback responsivo em coluna no mobile.

### 2026-11-17 — Home simplificada (referência: mappinglab.me)

- A home passou a usar `body.home`; os estilos novos ficam em um bloco no fim
  de `style.css`, escopados a essa classe para não afetar as páginas internas.
- Cabeçalho branco com menu só "projetos / sobre / contato" e ícones sociais
  pequenos em preto (ocultos no mobile); rodapé preto só com os ícones.
- Hero com imagem de fundo, título centralizado e tags centralizadas abaixo.
- Removidos da home: eyebrows numeradas, filtros de projetos e a seção
  "Método/Estudos" (as páginas em `laboratorio/` continuam existindo).
- Cartões de projeto com cantos arredondados e legenda maior em preto.

### 2026-11-17 — Correções do code review

- Cabeçalho e rodapé das páginas internas igualados aos da home; removidos os
  links para `#laboratorio`, que não existe mais (o breadcrumb virou texto).
- `style.css`: o bloco antigo de hero/cabeçalho absoluto e o bloco
  `body:has(.detail-hero)` que o desfazia foram substituídos por um bloco
  único no fim do arquivo (cabeçalho/rodapé globais e hero da home).
- Galeria de Espaços Públicos: panorama em linha própria; o filtro esconde
  linhas vazias e os contadores são calculados. Removido o ano automático
  do rodapé.

### 2026-11-17 — Tipografia e espaçamentos da home

- Home passa a usar Inter (fonte do mappinglab.me, via Google Fonts).
- Hero com 50% da altura da tela; tags em negrito com fundo escuro.
- Espaçamentos verticais de Projetos, Sobre e Contato reduzidos; Sobre em
  coluna de até 1024px (foto em 1/3, texto em 2/3); Contato sem fundo
  verde-lima.

### 2026-11-18 — Página de projeto no estilo mappinglab.me/venezia-2018

- `projetos/espacos-publicos.html` usa `body.project-page`: título em Inter
  700 (negrito) maiúsculo, texto de apresentação logo abaixo (`.project-intro`),
  galeria mantida e, no fim, só as informações em `.project-info` (rótulo
  pequeno em maiúsculas + valor). Removidos o bloco "Bora criar algo juntos"
  e os links anterior/próximo.
- As outras 3 páginas de `projetos/` usam o mesmo formato. O conteúdo delas
  ainda é provisório: as composições `.gallery-placeholder` devem virar
  `.gallery-image` com fotos reais. Os nomes dos arquivos não batem com os
  títulos (ex.: `fabricacao-cnc.html` = "Cartografias físicas", TL/002); os
  cards da home foram religados a eles pelo número TL.
- `dados-e-territorio.html` agora é o TCC "Eixo Moema-Capão" (texto e 6
  pranchas do post no Medium, salvas como `imagens/eixo-moema-capao-*.png`;
  o Medium bloqueia a página, mas o feed `medium.com/feed/@alineyuritm` traz
  o conteúdo). Epígrafe com `.project-epigraph`.
- Galeria do TCC usa `.detail-gallery.gallery-natural`, como no Medium: uma
  imagem por linha, centralizada, no tamanho original do arquivo (sem ampliar
  nem cortar) e na mesma ordem do post. Uma `.gallery-row` dentro dela põe pranchas
  lado a lado com a mesma altura (ex.: paisagem cultural + unidade
  geomorfológica). Pranchas com texto dentro (diagramas,
  capas) devem usar esse modo; o mosaico com `.gallery-ratio-*` é para fotos.

### 2026-11-18 — Caderno do TCC (flip book)

- Página do TCC ganhou um caderno que vira página, acima das pranchas.
  Biblioteca StPageFlip 2.0.7 (MIT) copiada em `vendor/page-flip/` (exceção
  justificada à regra de evitar dependências; sem CDN). Código em
  `flipbook.js`, carregado só nessa página; a lista de páginas fica num
  `<script type="application/json" id="flipbook-pages">` (`null` = página em
  branco). Controles: botões, setas do teclado com o caderno em foco, arrastar.
  Botões « e » (`data-flip="-10"`/`"10"`, `.tcc-book-jump`) e Shift+setas
  saltam 10 páginas.
- Imagens das páginas em `imagens/tcc/` (JPEG, 1000px), geradas do PDF por
  `ferramentas/gerar-caderno-tcc.py`: exclui as páginas 2, 4, 5, 6 e 7 (escolha
  da autora) e divide as 13 páginas largas. Regra do PDF (confirmada pela
  posição dos números de página): página PAR do PDF fica à esquerda, ÍMPAR à
  direita; o script insere brancas quando uma página cairia do lado errado
  (12 brancas, 117 páginas). Isso mantém inteiros os mapas que atravessam
  duas páginas simples (PDF 36+37 e 90+91). Imagens carregam sob demanda.
- Com o caderno fechado (só capa ou só contracapa, no modo de duas páginas),
  `flipbook.js` aplica `.is-cover`/`.is-back` e o CSS desloca o caderno 25%
  para centralizar a página; ao começar a virar, volta à posição aberta.
- Download: `documentos/tcc-eixo-moema-capao.pdf` (versão comprimida, 24 MB).
  O PDF original (48 MB) fica fora do git via `.gitignore`.

### 2026-11-24 — Índice do caderno do TCC

- Índice em aba recolhida na borda esquerda da tela (`.tcc-index[data-flip-index]`,
  `position:fixed`): a aba "Índice" só aparece enquanto o caderno está na tela
  e o painel desliza ao abrir; fecha com ×, `Escape`, clique fora ou ao
  escolher um item (o foco volta ao caderno).
- "Capítulos" em dois níveis: capítulos com seções (`.tcc-index-group`)
  abrem e fecham pelo botão `.tcc-index-expand` (`aria-expanded`); o grupo do
  capítulo aberto no caderno abre sozinho. Grupos: introdução (território …
  segregação), eixo Moema-Capão (percurso … projetos previstos) e estratégias
  de intervenção (roteiro temático). "Mapas" em `ol[data-flip-maps]`.
- Cada item aponta para o arquivo da página (`data-flip-to`, e
  `data-flip-end` nos mapas em página dupla); `flipbook.js` calcula o número
  (posição no caderno, a mesma do contador) e marca com `aria-current` o
  capítulo e o mapa abertos. O PDF não tem sumário: títulos vêm das páginas.

### 2026-11-25 — Aba do índice mais visível

- A aba do índice passou para a borda esquerda (a da direita passava
  despercebida): fundo verde-lima, ícone de lista, texto maior e sombra.
  Na primeira vez que aparece, acena duas vezes (`.is-hinting`; desligado com
  `prefers-reduced-motion`).

### 2026-11-25 — Grade de mapas do TCC

- Seção "Mapas" (`.tcc-maps`) entre o caderno e as pranchas, no estilo da
  grade do mappinglab.me/venezia-2018: título pequeno em maiúsculas, mosaico
  `.gallery-row` sem legendas, cantos arredondados, lightbox.
- Os 10 mapas do índice do caderno saem do PDF original por
  `ferramentas/gerar-mapas-tcc.py` para `imagens/tcc-mapas/` (JPEG, 1200px por
  página; mapas em página dupla numa imagem só, 2400×1515). Linhas: 2 duplas,
  2 duplas, 3 simples (`.gallery-ratio-079`), 2 duplas e a proposta sozinha.

Atualize esta seção quando uma mudança alterar layout, interação, estrutura de
arquivos ou fluxo de publicação. Registre o que mudou e por quê, sem transformar
o `AGENTS.md` em um histórico de cada pequena edição de texto.
