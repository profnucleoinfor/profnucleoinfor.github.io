(() => {
  'use strict';
  const menu = document.querySelector('.menu-m');
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) menu.removeAttribute('open'); });
  const botao = document.getElementById('installAppBtn');
  let adiado = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    if (!botao) return;
    e.preventDefault();
    adiado = e;
    botao.hidden = false;
  });
  botao?.addEventListener('click', async () => {
    if (!adiado) return;
    adiado.prompt();
    await adiado.userChoice;
    adiado = null;
    botao.hidden = true;
  });
  window.addEventListener('appinstalled', () => { adiado = null; if (botao) botao.hidden = true; });
})();
