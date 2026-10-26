(() => {
  'use strict';
  const NIC = window.NIC;
  const dados = NIC.dados('nic-curso');
  if (!dados) return;
  const { slug, acessos, materiais } = dados;
  const abrir = (chave) => {
    const item = materiais[chave];
    if (!item?.url) { NIC.aviso(`📚 ${item?.titulo || 'Este conteúdo'} ainda está em preparação. Em breve estará disponível.`); return; }
    if (item.modo === 'visualizador') { window.location.href = item.visualizador; return; }
    if (item.url.startsWith('./') || item.novaAba === false) { window.location.assign(item.url); return; }
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };
  document.querySelectorAll('[data-material-key].is-soon').forEach((a) => {
    a.addEventListener('click', (e) => { e.preventDefault(); abrir(a.dataset.materialKey); });
  });
  const acessar = async (tipo) => {
    const regra = acessos?.[slug]?.[tipo];
    if (!regra) return;
    const ok = await NIC.codigo({
      titulo: tipo === 'prova' ? '🔒 Digite a senha da PROVA:' : '🔑 Digite a senha de REVISÃO:',
      erro: tipo === 'prova' ? '❌ Senha incorreta! Fale com o instrutor.' : '❌ Acesso negado. Senha incorreta.',
      validar: (c) => NIC.verificarCodigo(acessos, slug, tipo, c)
    });
    if (!ok) return;
    const chave = tipo;
    const item = materiais[chave];
    if (!item?.url) { NIC.aviso(`📚 ${item?.titulo || 'Este conteúdo'} ainda está em preparação. Em breve estará disponível.`); return; }
    NIC.aviso(`✅ ${regra.mensagem || 'Acesso liberado!'}`, { botao: 'Abrir', acao: () => abrir(chave) });
  };
  document.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-acesso]');
    if (!botao) return;
    e.preventDefault();
    acessar(botao.dataset.acesso);
  });
})();
