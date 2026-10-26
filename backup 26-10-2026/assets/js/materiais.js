/* NIC Formação — V21.1
 * Abertura centralizada de materiais e conteúdos.
 * URLs ficam exclusivamente em materiais-config.js.
 */
(function () {
  'use strict';

  const VISUALIZADOR = './visualizador.html';
  const config = () => window.NIC_MATERIAIS || {};

  function obter(curso, chave) {
    return config()?.[curso]?.[chave] || null;
  }

  function montarUrl(url, titulo) {
    const destino = new URL(VISUALIZADOR, window.location.href);
    destino.searchParams.set('url', url);
    destino.searchParams.set('titulo', titulo || 'Material da Aula');
    return destino.href;
  }

  function avisoEmBreve(titulo) {
    window.alert(`📚 ${titulo || 'Este material'} ainda está em preparação. Em breve estará disponível.`);
  }

  function prepararElemento(elemento) {
    const item = obter(elemento.dataset.materialCourse, elemento.dataset.materialKey);
    if (!item) return;

    elemento.dataset.materialTitle = item.titulo || 'Material da Aula';

    if (!item.url) {
      elemento.setAttribute('aria-label', `${item.titulo || 'Material'} — disponível em breve`);
      elemento.setAttribute('title', 'Disponível em breve');
      return;
    }

    if (item.modo === 'visualizador') {
      elemento.href = montarUrl(item.url, item.titulo);
      elemento.removeAttribute('target');
      elemento.removeAttribute('rel');
      return;
    }

    elemento.href = item.url;
    if (item.novaAba !== false) {
      elemento.target = '_blank';
      elemento.rel = 'noopener noreferrer';
    }
  }

  function abrir(curso, chave) {
    const item = obter(curso, chave);
    if (!item || !item.url) {
      avisoEmBreve(item?.titulo || 'Este conteúdo');
      return;
    }

    if (item.modo === 'visualizador') {
      window.location.href = montarUrl(item.url, item.titulo);
      return;
    }

    if (item.novaAba !== false) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.assign(item.url);
  }

  document.querySelectorAll('[data-material-course][data-material-key]').forEach(prepararElemento);

  document.addEventListener('click', function (event) {
    const elemento = event.target.closest('[data-material-course][data-material-key]');
    if (!elemento) return;

    const curso = elemento.dataset.materialCourse;
    const chave = elemento.dataset.materialKey;
    const item = obter(curso, chave);
    if (!item) return;

    event.preventDefault();
    abrir(curso, chave);
  });

  window.NICMateriais = Object.freeze({ montarUrl, obter, abrir });
})();
