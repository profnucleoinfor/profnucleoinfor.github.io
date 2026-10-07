/*
 * NÚCLEO INFORMÁTICA — Códigos de acesso
 *
 * Estes códigos são apenas uma barreira de conveniência para as aulas e
 * avaliações. Como o portal é 100% estático, qualquer código entregue ao
 * navegador pode ser inspecionado pelo usuário.
 *
 * Para alterar uma senha, edite SOMENTE este arquivo.
 */
(() => {
  'use strict';

  window.NIC_SENHAS = Object.freeze({
    dashboard: Object.freeze({
      windows: 'windows',
      word: 'word',
      excel: 'excel',
      powerpoint: 'powerpoint',
      internet: 'internet',
      canva: 'canva',
      ia: 'ia'
    }),

    windows: Object.freeze({
      prova: 'provawin',
      revisao: 'revisaoSO'
    }),

    word: Object.freeze({
      prova: 'provaword',
      revisao: 'revisaoWord'
    }),

    excel: Object.freeze({
      prova: 'provaexcel',
      revisao: 'revisaoExcel'
    }),

    powerpoint: Object.freeze({
      prova: 'provappt',
      revisao: 'revisaoPPT'
    }),

    internet: Object.freeze({
      prova: 'pvnet2026',
      revisao: 'rvnet'
    }),

    canva: Object.freeze({
      prova: 'nostentamos'
    }),

    ia: Object.freeze({
      prova: 'provaiaia',
      revisao: 'revisaoia'
    }),

    template: Object.freeze({
      prova: '1234'
    })
  });
})();
