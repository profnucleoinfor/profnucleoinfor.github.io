(() => {
  'use strict';
  const NIC = window.NIC;
  const D = NIC.dados('nic-prova');
  if (!D) return;
  const $ = (id) => document.getElementById(id);
  const mostrar = (id, sim = true) => { const e = $(id); if (e) e.hidden = !sim; };
  const set = (id, v) => { const e = $(id); if (e) e.textContent = v; };
  const faixa = (lista, nota) => (lista || []).find((f) => nota >= f.min) || null;
  const embaralhar = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const LETRAS = 'ABCDEFGH';
  const nomeCampo = $('nome');
  if (nomeCampo) nomeCampo.value = NIC.store.get('nomeAluno');
  let nome = '';
  let perguntas = D.perguntas.slice();
  let atual = 0;
  let acertos = 0;
  let historico = [];
  const lerNome = () => {
    nome = (nomeCampo?.value || '').trim();
    if (nomeCampo && (D.pedirNome !== false) && !nome) {
      set('erroNome', 'Digite o nome do aluno.');
      nomeCampo.focus();
      return false;
    }
    set('erroNome', '');
    if (nome && D.salvarNome !== false) NIC.store.set('nomeAluno', nome);
    return true;
  };
  const resumoFinal = () => {
    const total = perguntas.length;
    const percentual = Math.round((acertos / total) * 100);
    const nota = Number(((acertos * 10) / total).toFixed(1));
    return { total, percentual, nota };
  };
  const preencherResultado = () => {
    const { total, percentual, nota } = resumoFinal();
    const st = faixa(D.status, nota);
    set('aluno', D.tituloResultado ? D.tituloResultado.replace('{nome}', nome) : (nome || 'Resultado'));
    set('nota', nota.toFixed(1));
    set('acertos', `${acertos} de ${total}`);
    set('percentual', `${percentual}%`);
    set('dataResultado', new Date().toLocaleDateString('pt-BR'));
    const s = $('status');
    if (s) { s.textContent = st ? st.texto : D.statusFinal || ''; s.classList.toggle('rev', !!st?.revisar); }
    set('comentarioFinal', faixa(D.comentario, nota)?.texto || '');
    set('feedback', faixa(D.feedback, nota)?.texto || '');
    const arco = $('arco');
    if (arco) { arco.style.strokeDashoffset = String(408.4 - (percentual / 100) * 408.4); set('arcoTexto', `${percentual}%`); }
    if (D.storage) {
      NIC.store.set(D.storage, JSON.stringify({ aluno: nome, nota, acertos, total, percentual, data: new Date().toLocaleDateString('pt-BR') }));
    }
    return { total, percentual, nota };
  };
  const listarRevisao = () => {
    const alvo = $('revisao');
    if (!alvo) return;
    alvo.replaceChildren();
    historico.forEach((h, i) => {
      const item = document.createElement('div');
      item.className = 'q-rev-item';
      const marca = document.createElement('b');
      marca.textContent = h.ok ? '✅' : '❌';
      const info = document.createElement('div');
      const t = document.createElement('strong'); t.textContent = `Questão ${i + 1}`;
      const q = document.createElement('p'); q.textContent = h.q;
      const r = document.createElement('p'); r.textContent = `Resposta correta: ${h.certa}`;
      info.append(t, q, r);
      item.append(marca, info);
      alvo.appendChild(item);
    });
    mostrar('revisaoBox', historico.length > 0);
  };
  const finalizar = () => {
    mostrar('start', false); mostrar('quiz', false); mostrar('desafio', false);
    preencherResultado();
    if (D.modo === 'treino') listarRevisao();
    mostrar('fim', true);
    $('fim').scrollIntoView({ block: 'start' });
    $('fim').querySelector('h1')?.focus();
  };
  const desenharOpcoes = (q, nomeGrupo = 'resposta') => {
    const box = $('opcoes');
    box.replaceChildren();
    q.o.forEach((texto, i) => {
      const l = document.createElement('label');
      l.className = 'q-op';
      const r = document.createElement('input');
      r.type = 'radio'; r.name = nomeGrupo; r.value = String(i);
      r.addEventListener('change', () => {
        box.querySelectorAll('.q-op').forEach((x) => x.classList.remove('sel'));
        l.classList.add('sel');
        const b = $('btnAcao'); if (b) b.disabled = false;
        set('avisoQ', '');
      });
      const s = document.createElement('span'); s.textContent = texto;
      l.append(r, s);
      box.appendChild(l);
    });
  };
  const marcada = () => {
    const r = document.querySelector('input[name="resposta"]:checked');
    return r ? Number(r.value) : -1;
  };
  const cabecalhoQuestao = (q) => {
    const p = Math.round((atual / perguntas.length) * 100);
    set('contador', `Questão ${atual + 1} de ${perguntas.length}`);
    set('pct', `${p}%`);
    $('barra').style.width = `${p}%`;
    set('pergunta', q.q);
    set('tema', q.tema || '');
    mostrar('tema', !!q.tema);
    set('placar', `Acertos: ${acertos}`);
    $('pergunta').focus({ preventScroll: true });
  };
  const mostrarProva = () => {
    const q = perguntas[atual];
    cabecalhoQuestao(q);
    desenharOpcoes(q);
    set('btnAcao', atual === perguntas.length - 1 ? 'Finalizar' : 'Próxima');
  };
  const proximaProva = () => {
    const m = marcada();
    if (m < 0) { set('avisoQ', 'Selecione uma resposta.'); return; }
    if (m === perguntas[atual].c) acertos++;
    atual++;
    if (atual < perguntas.length) mostrarProva();
    else { $('barra').style.width = '100%'; finalizar(); }
  };
  let respondida = false;
  const mostrarTreino = () => {
    const q = perguntas[atual];
    respondida = false;
    cabecalhoQuestao(q);
    desenharOpcoes(q);
    mostrar('feedbackQ', false);
    mostrar('dicaQ', false);
    set('dicaQ', q.dica || '');
    const bd = $('btnDica'); if (bd) { bd.hidden = !q.dica; bd.disabled = false; }
    const b = $('btnAcao'); b.disabled = true;
    set('btnAcao', D.botaoVerificar || 'Verificar resposta');
  };
  const acaoTreino = () => {
    const q = perguntas[atual];
    if (respondida) {
      atual++;
      if (atual < perguntas.length) mostrarTreino();
      else if (D.desafio) { mostrar('quiz', false); mostrar('desafio', true); $('desafio').scrollIntoView(); }
      else { $('barra').style.width = '100%'; finalizar(); }
      return;
    }
    const m = marcada();
    if (m < 0) { set('avisoQ', 'Escolha uma alternativa antes de continuar.'); return; }
    respondida = true;
    const ok = m === q.c;
    if (ok) acertos++;
    historico.push({ q: q.q, ok, certa: q.o[q.c] });
    document.querySelectorAll('#opcoes .q-op').forEach((l, i) => {
      l.querySelector('input').disabled = true;
      if (i === q.c) l.classList.add('certa');
      else if (i === m) l.classList.add('errada');
    });
    const fb = $('feedbackQ');
    fb.className = `q-fb ${ok ? 'q-fb--ok' : 'q-fb--no'}`;
    fb.replaceChildren();
    const t = document.createElement('strong'); t.textContent = ok ? D.acerto : D.erro;
    fb.appendChild(t);
    if (q.explicacao) { const p = document.createElement('span'); p.textContent = q.explicacao; fb.appendChild(p); }
    fb.hidden = false;
    set('placar', `Acertos: ${acertos}`);
    const bd = $('btnDica'); if (bd) bd.disabled = true;
    set('btnAcao', atual === perguntas.length - 1 ? (D.botaoUltima || 'Ver resultado') : (D.botaoProxima || 'Próxima'));
  };
  $('btnDica')?.addEventListener('click', () => { const d = $('dicaQ'); d.hidden = !d.hidden; });
  $('btnDesafio')?.addEventListener('click', () => {
    const box = $('desafioFb');
    const resp = D.desafio.situacoes.map((s) => $(`resp${s.l}`).value);
    box.hidden = false;
    if (resp.some((r) => !r)) { box.className = 'q-fb q-fb--no'; box.textContent = D.desafio.incompleto; return; }
    const certo = D.desafio.situacoes.every((s, i) => resp[i] === s.c);
    box.className = `q-fb ${certo ? 'q-fb--ok' : 'q-fb--no'}`;
    box.innerHTML = certo ? D.desafio.ok : D.desafio.nok; // texto autoral do JSON (CSP bloqueia scripts inline)
  });
  $('btnVerResultado')?.addEventListener('click', finalizar);
  const corrigirFolha = () => {
    if (!lerNome()) return;
    acertos = 0;
    document.querySelectorAll('.q-q').forEach((bloco, qi) => {
      const q = D.perguntas[qi];
      const sel = bloco.querySelector('input:checked');
      const fb = bloco.querySelector('.q-fb');
      bloco.querySelectorAll('.q-op').forEach((l) => l.classList.remove('certa', 'errada'));
      const certa = bloco.querySelectorAll('.q-op')[q.c];
      if (sel) {
        if (Number(sel.value) === q.c) { acertos++; sel.closest('.q-op').classList.add('certa'); fb.textContent = '✓ Resposta correta!'; fb.className = 'q-fb q-fb--ok'; }
        else { sel.closest('.q-op').classList.add('errada'); certa.classList.add('certa'); fb.textContent = '✗ Resposta incorreta. A alternativa correta foi destacada.'; fb.className = 'q-fb q-fb--no'; }
      } else { certa.classList.add('certa'); fb.textContent = '⚠ Questão não respondida.'; fb.className = 'q-fb q-fb--no'; }
      fb.hidden = false;
      bloco.querySelectorAll('input').forEach((i) => { i.disabled = true; });
    });
    const { total, percentual, nota } = resumoFinal();
    set('placarFolha', `${acertos}/${total}`);
    set('percentual', `${percentual}% de aproveitamento`);
    set('mensagem', (faixa(D.comentario, nota)?.texto || '').replace('{nome}', nome));
    $('barra').style.width = `${percentual}%`;
    mostrar('fim', true);
    $('btnAcao').disabled = true;
    $('fim').scrollIntoView({ behavior: 'smooth' });
  };
  const refazerFolha = () => {
    document.querySelectorAll('.q-q').forEach((b) => {
      b.querySelectorAll('input').forEach((i) => { i.checked = false; i.disabled = false; });
      b.querySelectorAll('.q-op').forEach((l) => l.classList.remove('certa', 'errada', 'sel'));
      b.querySelector('.q-fb').hidden = true;
    });
    mostrar('fim', false);
    $('btnAcao').disabled = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const iniciar = () => {
    if (!lerNome()) return;
    if (D.embaralhar) embaralhar(perguntas);
    atual = 0; acertos = 0; historico = [];
    mostrar('start', false); mostrar('fim', false); mostrar('desafio', false); mostrar('quiz', true);
    (D.modo === 'treino' ? mostrarTreino : mostrarProva)();
  };
  const reiniciar = () => {
    if (D.desafio) { D.desafio.situacoes.forEach((s) => { $(`resp${s.l}`).value = ''; }); mostrar('desafioFb', false); }
    mostrar('fim', false);
    mostrar('start', true);
    perguntas = D.perguntas.slice();
    if (nomeCampo) nomeCampo.value = nome || NIC.store.get('nomeAluno');
    $('start').scrollIntoView();
  };
  $('btnIniciar')?.addEventListener('click', iniciar);
  $('btnReiniciar')?.addEventListener('click', D.modo === 'folha' ? refazerFolha : reiniciar);
  $('btnImprimir')?.addEventListener('click', () => window.print());
  $('btnAcao')?.addEventListener('click', D.modo === 'folha' ? corrigirFolha : D.modo === 'treino' ? acaoTreino : proximaProva);
  nomeCampo?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && D.modo !== 'folha') { e.preventDefault(); iniciar(); } });
})();
