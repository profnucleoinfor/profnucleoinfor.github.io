(() => {
  'use strict';
  const tabs=[...document.querySelectorAll('[data-tab]')];
  const panels={materiais:document.getElementById('painel-materiais'),treino:document.getElementById('painel-treino'),atalhos:document.getElementById('painel-atalhos'),desempenho:document.getElementById('painel-desempenho')};
  function activate(name,focus=false){
    tabs.forEach(tab=>{const active=tab.dataset.tab===name;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    Object.entries(panels).forEach(([key,panel])=>{if(!panel)return;const active=key===name;panel.hidden=!active;panel.classList.toggle('is-active',active);});
    if(focus)tabs.find(t=>t.dataset.tab===name)?.focus();
    if(name==='desempenho')window.dispatchEvent(new CustomEvent('nic:desempenho-aberto'));
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.tab));
    tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activate(tabs[next].dataset.tab,true)});
  });
  document.querySelectorAll('[data-acesso="revisao"]').forEach(btn=>btn.addEventListener('click',()=>{}));
  activate('materiais');
})();