(() => {
  'use strict';

  const STORAGE_KEYS = Object.freeze({
    nome: 'nomeAluno',
    dia: 'diaAula',
    horario: 'horarioAula'
  });

  const MODULOS = Object.freeze([
    { t: 'Windows + Linux', s: NIC_SENHAS.dashboard.windows, p: 'windows.html', xp: '1000 XP', d: 'Aprenda sistemas operacionais do zero até o nível profissional.' },
    { t: 'Word + Digitação', s: NIC_SENHAS.dashboard.word, p: 'word.html', xp: '1120 XP', d: 'Criação de documentos profissionais e digitação eficiente.' },
    { t: 'Excel', s: NIC_SENHAS.dashboard.excel, p: 'excel.html', xp: '1200 XP', d: 'Planilhas, fórmulas e automações essenciais para o mercado.' },
    { t: 'PowerPoint', s: NIC_SENHAS.dashboard.powerpoint, p: 'powerpoint.html', xp: '600 XP', d: 'Apresentações profissionais e impactantes.' },
    { t: 'Internet e Redes Sociais', s: NIC_SENHAS.dashboard.internet, p: 'internet.html', xp: '320 XP', d: 'Uso profissional da internet e mídias sociais.' },
    { t: 'Canva e Design', s: NIC_SENHAS.dashboard.canva, p: 'canva.html', xp: '360 XP', d: 'Criação de artes e identidade visual profissional.' },
    { t: 'Inteligência Artificial', s: NIC_SENHAS.dashboard.ia, p: 'ia.html', xp: '800 XP', d: 'Uso da IA para produtividade e aprendizado moderno.' }
  ]);

  const read = (key, fallback = '') => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      console.warn('[NIC] Não foi possível ler a identificação local.', error);
      return fallback;
    }
  };

  const nomeAluno = document.getElementById('nomeAluno');
  const diaAula = document.getElementById('diaAula');
  const horarioAula = document.getElementById('horarioAula');
  const frase = document.getElementById('frase');
  const grid = document.getElementById('gridModulos');

  if (nomeAluno) nomeAluno.textContent = read(STORAGE_KEYS.nome, 'Estudante');
  if (diaAula) diaAula.textContent = `Dia: ${read(STORAGE_KEYS.dia, 'A definir')}`;
  if (horarioAula) horarioAula.textContent = `Horário: ${read(STORAGE_KEYS.horario, 'A definir')}`;

  const frases = [
    'Você está no caminho certo!',
    'A educação transforma destinos.',
    'Aprenda tecnologia e evolua!',
    'Seu futuro começa aqui.',
    'Continue avançando!'
  ];

  if (frase) {
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % frases.length;
      frase.style.opacity = '0';
      window.setTimeout(() => {
        frase.textContent = frases[index];
        frase.style.opacity = '1';
      }, 300);
    }, 5000);
  }

  const acessar = (modulo) => {
    const senha = window.prompt(`Senha da aula de ${modulo.t}:`);
    if (senha === null) return;

    // Estas senhas são apenas uma barreira de conveniência do portal estático.
    if (senha.trim().toLocaleLowerCase() === modulo.s) {
      window.location.assign(`./${modulo.p}`);
      return;
    }

    window.alert('Senha incorreta!');
  };

  const criarCard = (modulo) => {
    const card = document.createElement('article');
    card.className = 'modulo-card';

    const badge = document.createElement('span');
    badge.className = 'xp-badge';
    badge.textContent = `💎 ${modulo.xp}`;

    const title = document.createElement('h3');
    title.textContent = modulo.t;

    const description = document.createElement('div');
    description.className = 'modulo-desc';
    description.textContent = modulo.d;

    const button = document.createElement('button');
    button.className = 'btn-acessar';
    button.type = 'button';
    button.textContent = 'Entrar na Aula';
    button.addEventListener('click', () => acessar(modulo));

    card.append(badge, title, description, button);
    return card;
  };

  if (grid) {
    const fragment = document.createDocumentFragment();
    MODULOS.forEach((modulo) => fragment.appendChild(criarCard(modulo)));
    grid.replaceChildren(fragment);
  }
})();
