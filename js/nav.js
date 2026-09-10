/* 
   Comportamento do menu fixo, compartilhado por todas as
   páginas:
     1. Adiciona fundo desfocado ao menu quando a página rola
     2. Abre/fecha o menu no formato mobile 
     3. Marca o link da página atual como ativo
*/
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!nav) return;

  /* Fundo do menu ao rolar  */
  const SCROLL_THRESHOLD = 8;

  function updateNavBackground() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  updateNavBackground();
  window.addEventListener('scroll', updateNavBackground, { passive: true });

  /* 2. Menu mobile  */
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Fecha o menu mobile ao clicar em qualquer link */
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* 3. Marca o link da página atual como ativo - Compara o nome do arquivo atual (ex.: "areas.html") com o href de cada link do menu. */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav__link').forEach((link) => {
    const linkPage = link.getAttribute('href').split('#')[0] || 'index.html';
    if (linkPage === currentPage) {
      link.classList.add('is-active');
    }
  });
});
