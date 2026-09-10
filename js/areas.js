/*
   Só uma responsabilidade: destacar, na barra de navegação rápida (.jump-nav), o pill correspondente à área que está visível na tela no momento. se o IntersectionObserver não existir no navegador, a barra continua funcionando normalmente como links comuns, só sem o destaque automático.
*/

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.area-detail[id]');
  const pills = document.querySelectorAll('.jump-nav__item');

  if (!sections.length || !pills.length || !('IntersectionObserver' in window)) {
    return;
  }

  const pillById = new Map();
  pills.forEach((pill) => {
    const id = pill.getAttribute('href').replace('#', '');
    pillById.set(id, pill);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const pill = pillById.get(entry.target.id);
        if (!pill) return;
        if (entry.isIntersecting) {
          pills.forEach((p) => p.classList.remove('is-active'));
          pill.classList.add('is-active');
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
});
