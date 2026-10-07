/* NIC Formação — V21.1
 * Configuração central dos links de materiais, atividades, provas e revisões.
 * Para disponibilizar um conteúdo, basta preencher a propriedade "url".
 * URL vazia = conteúdo ainda não disponível; o portal informa "Em breve".
 */
(() => {
  'use strict';

  window.NIC_MATERIAIS = Object.freeze({
    windows: {
      slides: { titulo: 'Slides Windows + Linux', url: 'https://docs.google.com/presentation/d/1HFMF2ffLUZk1jy3Lzh6UtnyvjuRgRpk6/embed?usp=sharing&ouid=117693596403024623615&rtpof=true&sd=true', modo: 'visualizador' },
      apostila: { titulo: 'Apostila Completa — Windows + Linux', url: 'https://drive.google.com/file/d/1gqNYTYBZHHvUvnsSwSWOiixcQin5suX_/view?usp=drive_link', modo: 'externo' },
      exercicios: { titulo: 'Exercícios Windows + Linux', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de Windows', url: '', modo: 'externo' },
      revisao: { titulo: 'Revisão Windows + Linux', url: '', modo: 'externo' }
    },

    word: {
      slides: { titulo: 'Slides Word + Digitação', url: 'https://docs.google.com/presentation/d/1tFp0vR61l2u96PF3DQWwDd2IvVg13m-DaDIVhFf0VYA/edit?usp=drive_link', modo: 'visualizador' },
      apostila: { titulo: 'Apostila Completa — Word + Digitação', url: 'https://drive.google.com/file/d/1gqNYTYBZHHvUvnsSwSWOiixcQin5suX_/view?usp=drive_link', modo: 'externo' },
      exercicios: { titulo: 'Exercícios Word + Digitação', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de Word', url: '', modo: 'externo' },
      revisao: { titulo: 'Revisão Word + Digitação', url: '', modo: 'externo' }
    },

    excel: {
      slides: { titulo: 'Slides Excel', url: 'https://docs.google.com/presentation/d/16xlaEGZ-ESgbTo6z1Pfpp2S76Vq4Dtuf/edit?usp=drive_link&ouid=117693596403024623615&rtpof=true&sd=true', modo: 'visualizador' },
      apostila: { titulo: 'Apostila Excel', url: 'https://drive.google.com/file/d/10LysaWBrohy8xBN5BmJMFVhyEYeoNxGI/view?usp=drive_link', modo: 'externo' },
      exercicios: { titulo: 'Exercícios Excel', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de Excel', url: '', modo: 'externo' },
      revisao: { titulo: 'Revisão Excel', url: '', modo: 'externo' }
    },

    powerpoint: {
      slides: { titulo: 'Slides PowerPoint', url: 'https://docs.google.com/presentation/d/1sML9keDawByawJSHErq8jGz2CDRinWufyOtvTwtMvhA/edit?usp=drive_link', modo: 'visualizador' },
      apostila: { titulo: 'Apostila PowerPoint', url: 'https://drive.google.com/file/d/10LysaWBrohy8xBN5BmJMFVhyEYeoNxGI/view?usp=drive_link', modo: 'visualizador' },
      exercicios: { titulo: 'Exercícios PowerPoint', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de PowerPoint', url: 'https://forms.gle/PPqTCoeAoFCmnS6v8', modo: 'externo' },
      revisao: { titulo: 'Revisão PowerPoint', url: 'https://gemini.google.com/share/3f4a288fe62f', modo: 'externo', novaAba: true }
    },

    internet: {
      slides: { titulo: 'Slides Internet', url: 'https://docs.google.com/presentation/d/1xb1PU1MLe6kekrd9kamOqux7wSL5Cqj1/edit?usp=drive_link&ouid=117693596403024623615&rtpof=true&sd=true', modo: 'visualizador' },
      apostila: { titulo: 'Apostila Internet', url: '', modo: 'externo' },
      exercicios: { titulo: 'Exercícios Internet', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de Internet', url: './prova-internet.html', modo: 'externo' },
      revisao: { titulo: 'Revisão Internet', url: './rvnet.html', modo: 'externo' }
    },

    canva: {
      slides: { titulo: 'Slides Canva', url: 'https://docs.google.com/presentation/d/1Tf2KiBXjDloOIJvsTxo7orzocKstLhsh/embed', modo: 'visualizador' },
      apostila: { titulo: 'Apostila Canva', url: 'https://drive.google.com/file/d/16UmEJleEKtdwhSRrtQToFoq8sZyILYlp/preview', modo: 'visualizador' },
      exercicios: { titulo: 'Exercícios Canva', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      prova: { titulo: 'Prova Final de Canva', url: './canva-quest.html', modo: 'externo' },
      revisao: { titulo: 'Revisão Canva', url: '', modo: 'externo' }
    },

    ia: {
      slides: { titulo: 'Slides da Aula — IA', url: 'https://docs.google.com/presentation/d/1qoLqX-G0ktIQcIgTLk5Im0fIN-Wn4Gju/edit?usp=sharing&ouid=117693596403024623615&rtpof=true&sd=true', modo: 'visualizador' },
      apostila: { titulo: 'Apostila do Módulo — IA', url: 'https://drive.google.com/file/d/1dTwz1ozqXX_xPOUFM3iJ-26R21mubr-r/view?usp=sharing', modo: 'visualizador' },
      exercicios: { titulo: 'Exercícios IA', url: 'https://forms.gle/BV6gxxEkJJXq1z3A9', modo: 'externo' },
      chatgpt: { titulo: 'ChatGPT', url: 'https://chat.openai.com/', modo: 'externo', novaAba: true },
      prova: { titulo: 'Prova Final de IA', url: './ia-quest.html', modo: 'externo' },
      revisao: { titulo: 'Revisão IA', url: 'https://share.gemini.google/tln7SqgQRmQX', modo: 'externo', novaAba: true }
    }
  });
})();
