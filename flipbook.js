// Caderno do TCC (flip book) — usado só em projetos/dados-e-territorio.html.
// As páginas vêm de um JSON na própria página (null = página em branco).
// Biblioteca: StPageFlip 2.0.7 (MIT), em vendor/page-flip/.
(() => {
  const el = document.getElementById('flipbook');
  const data = document.getElementById('flipbook-pages');
  if (!el || !data || !window.St) return;

  const files = JSON.parse(data.textContent);
  const base = el.dataset.base || '';

  files.forEach((file, i) => {
    const page = document.createElement('div');
    page.className = 'flipbook-page';
    // Capa e contracapa viram como papel duro.
    if (i === 0 || i === files.length - 1) page.dataset.density = 'hard';
    if (file) {
      const img = document.createElement('img');
      img.dataset.src = base + file;
      img.alt = `Página ${i + 1} do caderno do TCC`;
      img.draggable = false;
      page.append(img);
    }
    el.append(page);
  });
  const pages = [...el.children];

  // Carrega só as imagens perto da página atual (o caderno tem ~16 MB).
  const loadAround = (index) => {
    for (let k = index - 4; k <= index + 6; k++) {
      const img = pages[k] && pages[k].querySelector('img[data-src]');
      if (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    }
  };
  loadAround(0);

  // Proporção da página do PDF: 595 × 751 pt.
  const book = new St.PageFlip(el, {
    width: 500,
    height: 631,
    size: 'stretch',
    minWidth: 260,
    maxWidth: 560,
    minHeight: 328,
    maxHeight: 707,
    showCover: true,
    maxShadowOpacity: 0.4,
    mobileScrollSupport: true,
  });
  book.loadFromHTML(pages);

  // Índice: aba recolhida na borda esquerda da tela, que desliza ao abrir.
  // Cada item aponta para o arquivo da página (data-flip-to e, nos mapas em
  // página dupla, data-flip-end). Os números exibidos são as posições no
  // caderno, calculados aqui para continuarem certos se o caderno for gerado
  // de novo. Capítulos com seções (.tcc-index-group) abrem e fecham.
  const toc = document.querySelector('[data-flip-index]');
  const tab = toc && toc.querySelector('.tcc-index-tab');
  const panel = toc && toc.querySelector('.tcc-index-panel');
  const tocBody = toc && toc.querySelector('.tcc-index-body');
  const entries = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setGroup = (group, open) => {
    group.classList.toggle('is-open', open);
    const toggle = group.querySelector('.tcc-index-expand');
    toggle.setAttribute('aria-expanded', String(open));
    const name = group.querySelector('[data-flip-to] span').textContent;
    toggle.setAttribute('aria-label', `${open ? 'Ocultar' : 'Mostrar'} seções de ${name}`);
  };

  // Rola a lista (não a página) até o item ativo.
  const revealActive = () => {
    const active = tocBody && tocBody.querySelector('[aria-current]');
    if (!active || tocBody.scrollHeight <= tocBody.clientHeight) return;
    const top = active.getBoundingClientRect().top - tocBody.getBoundingClientRect().top + tocBody.scrollTop;
    if (top < tocBody.scrollTop || top + active.offsetHeight > tocBody.scrollTop + tocBody.clientHeight) {
      tocBody.scrollTop = top - tocBody.clientHeight / 3;
    }
  };

  const setOpen = (open, { focusTab = false } = {}) => {
    if (!toc || toc.classList.contains('is-open') === open) return;
    toc.classList.toggle('is-open', open);
    tab.setAttribute('aria-expanded', String(open));
    if (open) {
      revealActive();
      const target = tocBody.querySelector('[aria-current]') || tocBody.querySelector('button');
      // Espera a aba ficar visível para poder receber o foco.
      requestAnimationFrame(() => target && target.focus({ preventScroll: true }));
    } else if (focusTab || toc.contains(document.activeElement)) {
      tab.focus({ preventScroll: true });
    }
  };

  if (toc) {
    toc.querySelectorAll('[data-flip-to]').forEach((button) => {
      const start = files.indexOf(button.dataset.flipTo);
      if (start < 0) { button.closest('li').hidden = true; return; }
      const end = button.dataset.flipEnd ? files.indexOf(button.dataset.flipEnd) : start;
      const label = button.querySelector('[data-flip-page]');
      if (label) label.textContent = end > start ? `${start + 1}–${end + 1}` : `${start + 1}`;
      entries.push({
        button,
        start,
        end: Math.max(start, end),
        isMap: !!button.closest('[data-flip-maps]'),
        group: button.closest('.tcc-index-group'),
      });
    });

    toc.querySelectorAll('.tcc-index-group').forEach((group) => {
      group.querySelector('.tcc-index-expand').addEventListener('click', () => {
        setGroup(group, !group.classList.contains('is-open'));
      });
    });

    tab.addEventListener('click', () => setOpen(!toc.classList.contains('is-open')));
    toc.querySelector('.tcc-index-close').addEventListener('click', () => setOpen(false, { focusTab: true }));
    toc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false, { focusTab: true });
    });
    // Clique fora do painel fecha o índice.
    document.addEventListener('pointerdown', (event) => {
      if (!toc.contains(event.target)) setOpen(false);
    });

    // A aba só aparece enquanto o caderno está na tela.
    const section = toc.closest('.tcc-book');
    if (section && 'IntersectionObserver' in window) {
      new IntersectionObserver(([item]) => {
        toc.classList.toggle('is-available', item.isIntersecting);
        // Na primeira vez que aparece, a aba acena para chamar atenção.
        if (item.isIntersecting && !toc.dataset.hinted) {
          toc.dataset.hinted = 'true';
          toc.classList.add('is-hinting');
          tab.addEventListener('animationend', () => toc.classList.remove('is-hinting'));
        }
        if (!item.isIntersecting) setOpen(false);
      }, { rootMargin: '-20% 0px -20% 0px' }).observe(section);
    } else {
      toc.classList.add('is-available');
    }
  }

  // Marca no índice o capítulo e o mapa abertos e abre o grupo do capítulo.
  let lastGroup = null;
  const markIndex = (current) => {
    if (!entries.length) return;
    const landscape = book.getOrientation() === 'landscape';
    // Em duas páginas, o par visível começa numa posição ímpar (esquerda).
    const first = landscape && current > 0 && current % 2 === 0 ? current - 1 : current;
    const last = landscape && current > 0 && current < files.length - 1 ? first + 1 : first;
    let chapter = null;
    entries.forEach((entry) => {
      if (!entry.isMap && entry.start <= last) chapter = entry;
    });
    entries.forEach((entry) => {
      const on = entry.isMap ? entry.start <= last && entry.end >= first : entry === chapter;
      if (on) entry.button.setAttribute('aria-current', 'true');
      else entry.button.removeAttribute('aria-current');
    });
    toc.querySelectorAll('.tcc-index-group').forEach((group) => {
      group.classList.toggle('has-current', !!chapter && chapter.group === group);
    });
    const group = chapter && chapter.group;
    if (group && group !== lastGroup) setGroup(group, true);
    lastGroup = group;
    revealActive();
  };

  const status = document.querySelector('[data-flip-status]');
  const update = (index) => {
    loadAround(index);
    markIndex(index);
    if (!status) return;
    // Com o caderno aberto (duas páginas), mostra o par; capa e contracapa ficam sozinhas.
    const spread = book.getOrientation() === 'landscape' && index > 0 && index < files.length - 1;
    status.textContent = spread
      ? `${index + 1}–${index + 2} / ${files.length}`
      : `${index + 1} / ${files.length}`;
  };
  // Caderno fechado (só a capa ou só a contracapa): desliza para centralizar
  // a página visível. Ao começar a virar, volta à posição de livro aberto.
  const stage = el.closest('[data-flip-stage]');
  const center = (index) => {
    if (!stage) return;
    const landscape = book.getOrientation() === 'landscape';
    stage.classList.toggle('is-cover', landscape && index === 0);
    stage.classList.toggle('is-back', landscape && index === files.length - 1);
  };
  book.on('changeState', (event) => {
    if (event.data === 'flipping' || event.data === 'user_fold') {
      stage && stage.classList.remove('is-cover', 'is-back');
    }
  });

  book.on('flip', (event) => { update(event.data); center(event.data); });
  book.on('changeOrientation', () => {
    const index = book.getCurrentPageIndex();
    update(index);
    center(index);
  });
  update(0);
  center(0);
  // Liga a transição só depois da primeira exibição (a capa já surge centralizada).
  if (stage) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-ready')));

  // Vai direto para uma página (índice e saltos de 10 em 10).
  const goTo = (target) => {
    const index = Math.max(0, Math.min(files.length - 1, target));
    if (index === book.getCurrentPageIndex()) return;
    loadAround(index);
    if (reduceMotion.matches) {
      book.turnToPage(index);
      update(book.getCurrentPageIndex());
      center(book.getCurrentPageIndex());
    } else {
      book.flip(index);
    }
  };
  const jump = (step) => goTo(book.getCurrentPageIndex() + step);

  document.querySelectorAll('[data-flip]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.flip;
      if (action === 'prev') book.flipPrev();
      else if (action === 'next') book.flipNext();
      else jump(Number(action));
    });
  });

  entries.forEach(({ button, start }) => {
    button.addEventListener('click', () => {
      goTo(start);
      // Fecha o índice e devolve o foco ao caderno (setas do teclado).
      setOpen(false);
      if (stage) {
        stage.focus({ preventScroll: true });
        stage.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  });

  // Setas do teclado quando o caderno está em foco (com Shift: 10 páginas).
  if (stage) {
    stage.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); event.shiftKey ? jump(-10) : book.flipPrev(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); event.shiftKey ? jump(10) : book.flipNext(); }
    });
  }
})();
