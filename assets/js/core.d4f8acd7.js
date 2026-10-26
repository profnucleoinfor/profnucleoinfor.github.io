(() => {
  'use strict';
  const NIC = (window.NIC = window.NIC || {});
  NIC.store = {
    get(chave, padrao = '') {
      try { return localStorage.getItem(chave) || padrao; } catch { return padrao; }
    },
    set(chave, valor) {
      try { localStorage.setItem(chave, valor); return true; } catch { return false; }
    },
    limpar() {
      try {
        Object.keys(localStorage)
          .filter((k) => ['nomeAluno', 'diaAula', 'horarioAula'].includes(k) || k.startsWith('resultado'))
          .forEach((k) => localStorage.removeItem(k));
      } catch { /* sem armazenamento: nada a limpar */ }
    }
  };
  NIC.dados = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch { return null; }
  };
  const temDialog = typeof HTMLDialogElement === 'function';
  function criarDialog(html) {
    const d = document.createElement('dialog');
    d.className = 'nic-dialog';
    d.innerHTML = html;
    document.body.appendChild(d);
    d.addEventListener('close', () => d.remove());
    return d;
  }
  const texto = (el, valor) => { el.textContent = valor; return el; };
  NIC.aviso = (mensagem, { titulo = '', botao = 'OK', acao = null } = {}) => new Promise((resolve) => {
    if (!temDialog) { window.alert(mensagem); if (acao) acao(); resolve(); return; }
    const d = criarDialog('<form method="dialog"><h2></h2><p></p><div class="acoes"><button class="btn btn--blue" value="ok"></button></div></form>');
    texto(d.querySelector('h2'), titulo); d.querySelector('h2').hidden = !titulo;
    texto(d.querySelector('p'), mensagem);
    texto(d.querySelector('button'), botao);
    d.querySelector('button').addEventListener('click', () => { if (acao) acao(); });
    d.addEventListener('close', () => resolve());
    d.showModal();
  });
  NIC.codigo = ({ titulo, erro, validar }) => new Promise((resolve) => {
    if (!temDialog) {
      const c = window.prompt(titulo);
      if (c === null) return resolve(false);
      Promise.resolve(validar(c)).then((ok) => { if (!ok) window.alert(erro); resolve(!!ok); });
      return;
    }
    const d = criarDialog(
      '<form method="dialog"><h2></h2><label class="sr-only" for="nic-codigo">Código de acesso</label>' +
      '<input id="nic-codigo" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" required>' +
      '<p class="erro" role="alert"></p><div class="acoes"><button type="button" class="btn btn--ghost" data-cancelar>Cancelar</button>' +
      '<button class="btn btn--blue" value="ok">Confirmar</button></div></form>'
    );
    texto(d.querySelector('h2'), titulo);
    const campo = d.querySelector('input');
    const msg = d.querySelector('.erro');
    let aceito = false;
    d.querySelector('[data-cancelar]').addEventListener('click', () => d.close());
    d.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const ok = await validar(campo.value);
      if (ok) { aceito = true; d.close(); }
      else { msg.textContent = erro; campo.select(); }
    });
    d.addEventListener('close', () => resolve(aceito));
    d.showModal();
    campo.focus();
  });
  async function sha256(txt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  NIC.verificarCodigo = async (acessos, curso, tipo, entrada) => {
    const regra = acessos?.[curso]?.[tipo];
    if (!regra) return false;
    if (!window.crypto?.subtle) {
      await NIC.aviso('Para validar o código, abra o portal por uma conexão segura (https).');
      return false;
    }
    const norm = regra.exato ? entrada.trim() : entrada.trim().toLowerCase();
    return (await sha256(`nic|${curso}|${tipo}|${norm}`)) === regra.h;
  };
  const nome = document.getElementById('nomeAlunoDisplay');
  if (nome) { const n = NIC.store.get('nomeAluno'); if (n) nome.textContent = n; }
  const principal = document.getElementById('conteudo-principal');
  if (principal && !principal.hasAttribute('tabindex')) principal.setAttribute('tabindex', '-1');
  document.querySelector('.skip-link')?.addEventListener('click', () => {
    window.setTimeout(() => principal?.focus({ preventScroll: true }), 0);
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' });
        reg.update();
      } catch (erro) {
        console.warn('[NIC] Service Worker indisponível.', erro);
      }
    }, { once: true });
  }
})();
