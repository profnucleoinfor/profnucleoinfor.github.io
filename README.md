# 📚 Portal Educacional NIC

## 🧠 Visão Geral

Portal educacional estático desenvolvido para funcionar como:

- 📚 Catálogo de cursos
- 📄 Biblioteca de materiais (HTML, PDF, PPT)
- 📱 Aplicativo PWA leve (instalação opcional + offline parcial)

---

## ❌ Fora de Escopo

Este projeto NÃO é:

- LMS (Moodle, Google Classroom)
- ERP ou sistema acadêmico
- Backend ou API
- Sistema de login com autenticação real
- Banco de dados

---

## 📂 Estrutura do Projeto

/assets   → CSS, JS, imagens e ícones  
/cursos   → páginas HTML dos cursos (SEM subpastas)  
/pdf      → materiais didáticos organizados por curso  
/forms    → links externos (Google Forms etc.)

---

## 📱 PWA (Progressive Web App)

- Suporte a instalação como aplicativo
- Funciona parcialmente offline
- Service Worker com versionamento obrigatório
- Nunca bloquear o acesso ao site por falha de cache

---

## ⚠️ Regras de Caminho

- Usar apenas caminhos relativos: `./` e `../`
- Proibido uso de caminhos absolutos `/assets/...`

---

## 🧠 JavaScript

- Apenas Vanilla JS
- O site deve funcionar mesmo sem JS
- JS não pode ser dependência para navegação

---

## 📱 Responsividade

- Mobile-first (base 360px)
- Breakpoints: 360 / 390 / 412 / 768 / 1366 / 1920
- Sem dimensões fixas absolutas

---

## ♿ Acessibilidade

- alt obrigatório em imagens
- contraste mínimo AA (4.5:1)
- fonte mínima 16px mobile
- HTML semântico obrigatório

---

## 🧩 Componentes

- Navbar e Footer são replicados manualmente
- Alterações devem ser copiadas para todas as páginas
- Template oficial: `template-curso.html`

---

## 🚀 Evolução do Sistema

1. Conteúdo HTML nativo
2. Redução de dependência de PDFs
3. Quiz offline
4. Biblioteca offline completa

---

## 🧭 Princípio Central

> Estabilidade sempre acima de estética ou inovação.
