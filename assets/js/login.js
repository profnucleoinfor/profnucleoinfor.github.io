(() => {
  'use strict';

  const STORAGE_KEYS = Object.freeze({
    nome: 'nomeAluno',
    dia: 'diaAula',
    horario: 'horarioAula'
  });

  const form = document.getElementById('loginForm');
  const username = document.getElementById('username');
  const diaAula = document.getElementById('diaAula');
  const horarioAula = document.getElementById('horarioAula');
  const typedText = document.getElementById('typed-text');

  const frases = [
    'O conhecimento transforma vidas.',
    'Invista em você, invista no seu futuro.',
    'A educação é o caminho para o sucesso.'
  ];

  const normalizeName = (value) => value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

  const showQuote = () => {
    if (!typedText) return;
    typedText.textContent = `“${frases[0]}”`;
    let index = 0;

    window.setInterval(() => {
      index = (index + 1) % frases.length;
      typedText.style.opacity = '0';
      window.setTimeout(() => {
        typedText.textContent = `“${frases[index]}”`;
        typedText.style.opacity = '1';
      }, 250);
    }, 5000);
  };

  const loadProfile = () => {
    try {
      username.value = localStorage.getItem(STORAGE_KEYS.nome) || '';
      diaAula.value = localStorage.getItem(STORAGE_KEYS.dia) || '';
      horarioAula.value = localStorage.getItem(STORAGE_KEYS.horario) || '';
    } catch (error) {
      console.warn('[NIC] Não foi possível ler a identificação local.', error);
    }
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = normalizeName(username.value);
    username.value = nome;
    const dia = diaAula.value;
    const hora = horarioAula.value;

    if (nome.length < 2 || !dia || !hora) {
      form.reportValidity();
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.nome, nome);
      localStorage.setItem(STORAGE_KEYS.dia, dia);
      localStorage.setItem(STORAGE_KEYS.horario, hora);
    } catch (error) {
      console.warn('[NIC] Não foi possível salvar a identificação local.', error);
    }

    window.location.assign('./dashboard.html');
  });

  loadProfile();
  showQuote();
})();
