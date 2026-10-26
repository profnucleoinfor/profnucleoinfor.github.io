# 🤖 AGENT.md — Portal Educacional NIC

## 🧠 Função

Este arquivo define regras operacionais para qualquer agente humano ou artificial que modifique este projeto.

---

# 🚦 1. PRINCÍPIO ABSOLUTO

Se houver dúvida sobre impacto:

> ❌ NÃO ALTERAR

---

# 🔒 2. NÃO REGRESSÃO

Nenhuma alteração pode:

- Quebrar navegação existente
- Remover funcionalidades
- Alterar URLs sem necessidade real
- Depender de backend ou banco de dados
- Reduzir compatibilidade ou acessibilidade

---

# 📂 3. ARQUITETURA FIXA

/assets → CSS, JS, imagens  
/cursos → HTML (SEM subpastas)  
/pdf → materiais  
/forms → links externos  

## 🚫 Caminhos

- Permitido: `./` e `../`
- Proibido: `/assets`, `/cursos/...` absolutos

---

# 📱 4. PWA (CRÍTICO)

- Service Worker com versionamento obrigatório
- Cache nunca pode bloquear o site
- Sempre ter fallback para rede
- Nunca cachear conteúdo externo (Forms, links dinâmicos)

## ❌ Falha crítica:
Se o PWA quebrar → alteração inválida

---

# 🧠 5. JAVASCRIPT

- Apenas Vanilla JS
- Site deve funcionar sem JS
- JS não pode ser obrigatório para navegação
- Proibido frameworks externos

---

# 📱 6. RESPONSIVIDADE

- Mobile-first (360px base)
- Breakpoints: 360 / 390 / 412 / 768 / 1366 / 1920
- Sem medidas fixas absolutas

---

# 🌐 7. COMPATIBILIDADE

- Chrome
- Edge
- Firefox
- Chrome Android
- Samsung Internet

---

# 🖼️ 8. IMAGENS

- WebP preferencial
- PNG / SVG permitido
- Máx: 300KB (conteúdo), 100KB (ícones)

---

# ♿ 9. ACESSIBILIDADE

- alt obrigatório
- contraste AA (4.5:1)
- fonte mínima 16px mobile
- HTML semântico obrigatório

---

# 📏 10. CLASSIFICAÇÃO DE RISCO

## 🔴 MACRO (alto impacto global)
- service-worker.js
- manifest.json
- Navbar / Footer
- estrutura de pastas
- caminhos de arquivos

## 🟡 MESO (médio impacto)
- CSS global
- layout de páginas
- componentes reutilizáveis

## 🟢 MICRO (baixo impacto)
- textos
- cores
- imagens
- ajustes pontuais

---

# 🧩 11. COMPONENTES GLOBAIS

- Navbar e Footer são replicados manualmente
- Alterações devem ser copiadas para todas as páginas
- Template obrigatório: `template-curso.html`

---

# 📄 12. PADRÃO DE PÁGINA

## Obrigatório:

- Título
- Objetivo
- Conteúdo
- Exemplo prático
- Material complementar
- Atividade
- Próxima aula

## Exceção:
Microconteúdos podem reduzir para:

> Título + Conteúdo + Navegação

---

# 🚨 13. FLUXO DE DECISÃO OBRIGATÓRIO

Toda ação deve seguir:

1. Diagnóstico do impacto
2. Classificação (micro/meso/macro)
3. Verificação de risco
4. Execução controlada
5. Validação final

---

# 🧭 14. REGRA FINAL

> Estabilidade operacional tem prioridade absoluta sobre qualquer melhoria.
