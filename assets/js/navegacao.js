/* NIC Formação — V18
 * Ajustes leves e compartilhados de navegação e acessibilidade.
 * Não altera a lógica do portal nem cria navegação automática.
 */
(() => {
  'use strict';

  document.querySelectorAll('nav[aria-label]').forEach((nav) => {
    const link = nav.querySelector('a[href="./dashboard.html"]');
    if (link && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Voltar ao painel do aluno');
    }
  });

  const principal = document.getElementById('conteudo-principal');
  if (principal && !principal.hasAttribute('tabindex')) {
    principal.setAttribute('tabindex', '-1');
  }

  const skip = document.querySelector('.nic-skip-link');
  if (skip && principal) {
    skip.addEventListener('click', () => {
      window.setTimeout(() => principal.focus({ preventScroll: true }), 0);
    });
  }
})();
