/* 
   Micro-interações gerais do site.
   o conteúdo do site é sempre visível de imediato, sem depender de nenhum script. Este arquivo fica como espaço reservado para pequenas melhorias de interação que não escondem conteúdo. 
*/

document.addEventListener('DOMContentLoaded', () => {
  /* Preenche o ano corrente no rodapé automaticamente, para o
     copyright nunca ficar desatualizado. */
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
