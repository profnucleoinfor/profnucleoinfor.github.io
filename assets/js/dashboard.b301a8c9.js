(() => {
  'use strict';
  const NIC = window.NIC;
  const dados = NIC.dados('nic-painel');
  if (!dados) return;
  const $ = (id) => document.getElementById(id);
  $('nomeAluno').textContent = NIC.store.get('nomeAluno', 'Estudante');
  $('diaAula').textContent = `Dia: ${NIC.store.get('diaAula', 'A definir')}`;
  $('horarioAula').textContent = `Horário: ${NIC.store.get('horarioAula', 'A definir')}`;
  const frase = $('frase');
  if (frase && dados.frases?.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let i = 0;
    window.setInterval(() => {
      i = (i + 1) % dados.frases.length;
      frase.style.opacity = '0';
      window.setTimeout(() => { frase.textContent = dados.frases[i]; frase.style.opacity = '1'; }, 300);
    }, 5000);
  }
  document.querySelectorAll('[data-modulo]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const { modulo, nome, pagina } = btn.dataset;
      const ok = await NIC.codigo({
        titulo: `Senha da aula de ${nome}:`,
        erro: 'Senha incorreta!',
        validar: (c) => NIC.verificarCodigo(dados.acessos, 'dashboard', modulo, c)
      });
      if (ok) window.location.assign(`./${pagina}`);
    });
  });
  document.querySelector('[data-sair]')?.addEventListener('click', () => NIC.store.limpar());
})();
