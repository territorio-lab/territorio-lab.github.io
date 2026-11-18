// Filtro genérico: botões com data-<filtro> mostram só os itens da categoria
// escolhida ("todos" mostra tudo) e mantêm aria-pressed atualizado.
// O número dentro do <span> de cada botão é calculado a partir dos itens.
const setupFilter = ({ buttonAttr, filterKey, items, categoryKey, onChange }) => {
  const buttons = document.querySelectorAll(`[${buttonAttr}]`);
  if (!buttons.length || !items.length) return;

  buttons.forEach((button) => {
    const filter = button.dataset[filterKey];
    const count = filter === 'todos'
      ? items.length
      : [...items].filter((item) => item.dataset[categoryKey] === filter).length;
    const badge = button.querySelector('span');
    if (badge) badge.textContent = String(count).padStart(2, '0');

    button.addEventListener('click', () => {
      buttons.forEach((item) => {
        const isSelected = item === button;
        item.classList.toggle('is-active', isSelected);
        item.setAttribute('aria-pressed', String(isSelected));
      });

      items.forEach((item) => {
        item.hidden = !(filter === 'todos' || item.dataset[categoryKey] === filter);
      });

      if (onChange) onChange();
    });
  });
};

// Filtro de projetos (cards com data-category).
setupFilter({
  buttonAttr: 'data-filter',
  filterKey: 'filter',
  items: document.querySelectorAll('.project-card[data-category]'),
  categoryKey: 'category',
});

// Filtro da galeria; linhas que ficam sem imagens visíveis também somem.
setupFilter({
  buttonAttr: 'data-gallery-filter',
  filterKey: 'galleryFilter',
  items: document.querySelectorAll('.gallery-image[data-gallery-category]'),
  categoryKey: 'galleryCategory',
  onChange: () => {
    document.querySelectorAll('.gallery-row').forEach((row) => {
      row.hidden = !row.querySelector('.gallery-image:not([hidden])');
    });
  },
});

// Menu recolhível para telas pequenas.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
  });

  // Ao escolher um link, fecha o menu no celular.
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    });
  });
}

// Galeria ampliável para as imagens das páginas de projeto.
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

if (lightboxTriggers.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Imagem ampliada');

  const closeButton = document.createElement('button');
  closeButton.className = 'lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Fechar imagem ampliada');
  closeButton.textContent = '×';

  const lightboxImage = document.createElement('img');
  lightbox.append(closeButton, lightboxImage);
  document.body.append(lightbox);

  let lastTrigger = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove('has-lightbox');
    lightboxImage.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  };

  const openLightbox = (trigger) => {
    lastTrigger = trigger;
    lightboxImage.src = trigger.dataset.lightboxSrc;
    lightboxImage.alt = trigger.dataset.lightboxAlt || '';
    lightbox.hidden = false;
    document.body.classList.add('has-lightbox');
    closeButton.focus();
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(trigger);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}
