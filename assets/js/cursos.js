/* NIC Formação — V21.1
 * Lógica compartilhada das páginas de curso.
 * Centraliza identificação local, Service Worker e acessos por código.
 */
(() => {
  'use strict';

  const CURSOS = Object.freeze({
    windows: { prova: { mensagem: 'Acesso liberado!' }, revisao: { mensagem: 'Conteúdo liberado!', exato: true } },
    word: { prova: { mensagem: 'Acesso liberado!' }, revisao: { mensagem: 'Conteúdo liberado!', exato: true } },
    excel: { prova: { mensagem: 'Acesso liberado!' }, revisao: { mensagem: 'Conteúdo liberado!', exato: true } },
    powerpoint: {
      prova: { mensagem: 'Acesso liberado! Você será redirecionado para a prova.' },
      revisao: { mensagem: 'Conteúdo liberado! Você será redirecionado para a revisão.', exato: true }
    },
    internet: {
      prova: { mensagem: 'Acesso liberado!' },
      revisao: { mensagem: 'Conteúdo liberado!', exato: true }
    },
    canva: { prova: { mensagem: '', exato: true } },
    ia: {
      prova: { mensagem: 'Acesso liberado!', exato: true },
      revisao: { mensagem: '', exato: true }
    },
    template: {
      missao: 'Dominar os conceitos essenciais deste módulo com prática aplicada.',
      prova: { mensagem: 'Acesso liberado!' }
    }
  });

  const curso = document.body?.dataset.curso;
  const configuracao = curso ? CURSOS[curso] : null;

  const carregarMissao = () => {
    if (!configuracao?.missao) return;
    const elemento = document.getElementById('missaoCurso');
    if (elemento) elemento.textContent = configuracao.missao;
  };

  const carregarNome = () => {
    const elemento = document.getElementById('nomeAlunoDisplay');
    if (!elemento) return;

    try {
      const nome = localStorage.getItem('nomeAluno');
      if (nome) elemento.textContent = nome;
    } catch (error) {
      console.warn('[NIC] Não foi possível ler a identificação local.', error);
    }
  };

  const acessar = (tipo) => {
    if (!configuracao || !configuracao[tipo] || !window.NIC_SENHAS?.[curso]?.[tipo]) return;

    const dados = configuracao[tipo];
    const senha = window.prompt(
      tipo === 'prova' ? '🔒 Digite a senha da PROVA:' : '🔑 Digite a senha de REVISÃO:'
    );
    if (senha === null) return;

    const informada = dados.exato ? senha.trim() : senha.trim().toLowerCase();
    const correta = window.NIC_SENHAS[curso][tipo];

    if (informada !== correta) {
      window.alert(tipo === 'prova'
        ? '❌ Senha incorreta! Fale com o instrutor.'
        : '❌ Acesso negado. Senha incorreta.');
      return;
    }

    const material = window.NICMateriais?.obter(curso, tipo);

    if (!material?.url) {
      window.alert(`📚 ${material?.titulo || 'Este conteúdo'} ainda está em preparação. Em breve estará disponível.`);
      return;
    }

    if (dados.mensagem) window.alert(`✅ ${dados.mensagem}`);
    window.NICMateriais?.abrir(curso, tipo);
  };

  document.addEventListener('click', (event) => {
    const botao = event.target.closest('[data-acesso]');
    if (!botao) return;

    const tipo = botao.dataset.acesso;
    if (!tipo) return;

    event.preventDefault();
    acessar(tipo);
  });

  window.NICCurso = Object.freeze({ acessar });
  carregarNome();
  carregarMissao();
})();
