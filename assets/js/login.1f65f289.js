(() => {
  'use strict';
  const NIC = window.NIC;
  const form = document.getElementById('loginForm');
  if (!form) return;
  const campos = {
    nomeAluno: document.getElementById('username'),
    diaAula: document.getElementById('diaAula'),
    horarioAula: document.getElementById('horarioAula')
  };
  Object.entries(campos).forEach(([k, el]) => { el.value = NIC.store.get(k); });
  const limpar = (v) => v.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    campos.nomeAluno.value = limpar(campos.nomeAluno.value);
    if (campos.nomeAluno.value.length < 2 || !campos.diaAula.value || !campos.horarioAula.value) { form.reportValidity(); return; }
    Object.entries(campos).forEach(([k, el]) => NIC.store.set(k, el.value));
    window.location.assign('./dashboard.html');
  });
  const dados = NIC.dados('nic-login');
  const alvo = document.getElementById('typed-text');
  if (alvo && dados?.frases?.length) {
    alvo.textContent = `“${dados.frases[0]}”`;
    if (dados.frases.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let i = 0;
      window.setInterval(() => {
        i = (i + 1) % dados.frases.length;
        alvo.style.opacity = '0';
        window.setTimeout(() => { alvo.textContent = `“${dados.frases[i]}”`; alvo.style.opacity = '1'; }, 250);
      }, 5000);
    }
  }
})();
