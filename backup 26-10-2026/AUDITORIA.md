# Auditoria do Projeto NIC

Data: 2026-06-30

## Resumo

Auditoria realizada nos arquivos obrigatorios e nas paginas HTML, com foco em PWA, caminhos, acessibilidade, SEO, seguranca, performance e consistencia. As correcoes automaticas ficaram restritas a pontos tecnicamente seguros e alinhados ao AGENTS.md.

Arquivos analisados: `README.md`, `AGENTS.md`, `index.html`, `offline.html`, `404.html`, `service-worker.js`, `manifest.json`, `version.json`, `robots.txt`, `sitemap.xml`, `assets/` e paginas HTML existentes na raiz.

## Problemas Encontrados

## Arquivo

service-worker.js

### Problema

O Service Worker pre-cacheava fontes, Tailwind, Font Awesome e outros recursos externos, alem de interceptar requisicoes externas.

### Impacto

Viola a regra critica do AGENTS.md: nunca cachear conteudo externo. Tambem aumenta risco de falha no `install()` se CDN ou fonte estiver indisponivel.

### Prioridade

🔴 MACRO

### Correção recomendada

Manter cache apenas para arquivos locais essenciais e deixar recursos externos seguirem direto para a rede.

### Justificativa técnica

O PWA deve ter fallback para rede e nao pode depender de cache de terceiros para instalar ou atualizar.

### Pode corrigir automaticamente?

SIM

Status: corrigido.

## Arquivo

visualizador.html

### Problema

Havia caminhos absolutos para manifest, icone, dashboard e service worker.

### Impacto

Viola a regra de caminhos do AGENTS.md e pode quebrar em publicacoes com subcaminho, como GitHub Pages.

### Prioridade

🔴 MACRO

### Correção recomendada

Trocar `/manifest.json`, `/assets/...`, `/dashboard.html` e `/service-worker.js` por caminhos relativos `./`.

### Justificativa técnica

Caminhos relativos preservam compatibilidade com a arquitetura fixa do projeto.

### Pode corrigir automaticamente?

SIM

Status: corrigido.

## Arquivo

offline.html, 404.html, dashboard.html, paginas de modulos e provas

### Problema

Varias paginas carregavam o manifest sem `?v=11`, enquanto `index.html`, `service-worker.js` e `version.json` usam versao 11. O registro do Service Worker foi posteriormente padronizado sem query string para simplificar manutencao.

### Impacto

Pode atrasar atualizacao do manifest do PWA e dificultar diagnostico quando paginas usam URLs diferentes para os mesmos arquivos.

### Prioridade

🔴 MACRO

### Correção recomendada

Sincronizar chamadas para `./manifest.json?v=11` e registrar o Service Worker sempre como `./service-worker.js`.

### Justificativa técnica

Mantem consistencia entre `CACHE_NAME`, `version.json`, manifest e registro do Service Worker, reduzindo pontos manuais de versao.

### Pode corrigir automaticamente?

SIM

Status: corrigido nas paginas que ja usavam PWA.

## Arquivo

canva.html

### Problema

Um link para `visualizador.html` estava sem aspas no atributo `href`.

### Impacto

HTML invalido pode quebrar a navegacao do material em alguns navegadores.

### Prioridade

🟡 MESO

### Correção recomendada

Adicionar aspas ao `href` e manter URL relativa.

### Justificativa técnica

Atributos HTML com caracteres especiais devem ser delimitados para leitura consistente.

### Pode corrigir automaticamente?

SIM

Status: corrigido.

## Arquivo

template-curso.html

### Problema

O AGENTS.md e o README.md citam `template-curso.html` como template obrigatorio, mas o arquivo nao existe no repositorio.

### Impacto

Reduz padronizacao e aumenta risco de divergencia entre paginas de curso.

### Prioridade

🟡 MESO

### Correção recomendada

Criar o template somente apos confirmar o padrao desejado das aulas.

### Justificativa técnica

Criar um template sem alinhamento pode induzir futuras paginas a um layout incorreto.

### Pode corrigir automaticamente?

NÃO

Status: recomendado, nao corrigido por risco de decisao editorial/estrutural.

## Arquivo

sitemap.xml

### Problema

O sitemap lista apenas parte das paginas existentes.

### Impacto

SEO e descoberta de paginas podem ficar inconsistentes.

### Prioridade

🟡 MESO

### Correção recomendada

Definir quais paginas devem ser indexaveis e atualizar o sitemap apenas com essas URLs.

### Justificativa técnica

Nem toda pagina deve entrar no sitemap, especialmente provas, visualizadores e paginas auxiliares.

### Pode corrigir automaticamente?

NÃO

Status: recomendado, nao corrigido por precisar de decisao de indexacao.

## Arquivo

paginas HTML

### Problema

Ha uso amplo de recursos externos em paginas HTML, como fontes, Tailwind, Bootstrap, Bootstrap Icons, Font Awesome, Typed.js e imagens externas.

### Impacto

Reduz desempenho offline e aumenta dependencia de terceiros.

### Prioridade

🟡 MESO

### Correção recomendada

Migrar gradualmente apenas os recursos essenciais para arquivos locais em `assets/`, sem quebrar layout ou navegacao.

### Justificativa técnica

A migracao exige testes visuais e pode alterar comportamento de componentes existentes.

### Pode corrigir automaticamente?

NÃO

Status: recomendado, nao corrigido por alto risco visual/funcional.

## Arquivo

manifest.json

### Problema

Existem icones WebP otimizados em `assets/`, mas o manifest referencia PNG.

### Impacto

Pequeno impacto de peso de download; os PNG atuais ainda estao abaixo dos limites do AGENTS.md.

### Prioridade

🟢 MICRO

### Correção recomendada

Avaliar suporte e, se desejado, adicionar entradas WebP mantendo PNG como compatibilidade.

### Justificativa técnica

PNG e aceito por navegadores PWA; trocar sem teste pode afetar instalacao em alguns dispositivos.

### Pode corrigir automaticamente?

NÃO

Status: recomendado, nao corrigido por compatibilidade.

## Validação

- Service Worker mantem `CACHE_NAME = nic-formacao-v11`.
- `version.json` permanece em versao `11`.
- Recursos externos foram removidos do pre-cache do Service Worker.
- `visualizador.html` nao depende mais de caminhos absolutos para arquivos locais.
- `STATIC_ASSETS` usa `./manifest.json?v=11`, consistente com as paginas.
- O Service Worker e registrado sem query string; a versao do cache fica concentrada no `CACHE_NAME`.
- O pre-cache do Service Worker e tolerante: falhas pontuais em arquivos locais nao abortam a instalacao inteira do PWA.
- `index.html` possui checagens defensivas antes de registrar listeners nos botoes de menu e instalacao.
- Imagens em `assets/` estao abaixo dos limites informados no AGENTS.md.
- Nao foram criadas dependencias de backend, banco de dados ou framework novo.
