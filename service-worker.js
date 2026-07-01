// ======================================
// NÚCLEO INFORMÁTICA - SERVICE WORKER
// Versão: v11
// Ambiente: Produção | GitHub Pages
// Alinhado com:
// - CACHE_NAME = nic-formacao-v11
// - manifest.json?v=11
// - Registro no HTML ?v=11
// Estratégia:
// - Network First: HTML, CSS, JS (sempre atualizado)
// - Cache First: Imagens e manifest locais (desempenho + offline)
// - Offline Fallback: Página dedicada quando sem internet
// ======================================

const CACHE_NAME = 'nic-formacao-v11';
const OFFLINE_URL = './offline.html';
const NOT_FOUND_URL = './404.html';

// ✅ Pré-cache apenas arquivos essenciais e estáticos
// Removidos index.html e login.html (usam Network First)
const STATIC_ASSETS = [
  OFFLINE_URL,
  NOT_FOUND_URL,

  './manifest.json',
  './robots.txt',
  './sitemap.xml',

  './assets/favicon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/og-image.png'
];

// ======================================
// INSTALAÇÃO
// ======================================
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando nova versão:', CACHE_NAME);
  
  // ✅ Ativa nova versão imediatamente, sem esperar abas fecharem
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Arquivos estáticos armazenados com sucesso');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch(err => console.error('[SW] Erro ao armazenar arquivos iniciais:', err))
  );
});

// ======================================
// ATIVAÇÃO
// ======================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando nova versão');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ✅ Remove todos os caches de versões antigas
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // ✅ Assume controle de todas as abas e janelas abertas
      return self.clients.claim();
    })
  );
});

// ======================================
// ATUALIZAÇÃO MANUAL (PARA FUTURAS MELHORIAS)
// Permite enviar mensagem do frontend para forçar atualização
// ======================================
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ======================================
// ESTRATÉGIAS DE RESPOSTA
// ======================================

/**
 * Cache First: Busca no cache primeiro, senão busca na rede e armazena
 * Usado para: imagens locais e manifest, arquivos que mudam pouco
 */
const cacheFirst = async (request) => {
  // Tenta encontrar no cache
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    // Se não tem, busca na rede
    const networkResponse = await fetch(request);
    
    // ✅ Melhoria: Apenas armazena se resposta for bem-sucedida (evita cache de erro 404/500)
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (err) {
    console.log('[SW] Recurso indisponível (offline):', request.url);
    
    // Se for imagem, retorna ícone padrão para não quebrar o layout
    if (request.destination === 'image') {
      return caches.match('./assets/icon-192.png');
    }

    // Para outros recursos, retorna vazio
    return new Response('', { status: 404, statusText: 'Not Found' });
  }
};

/**
 * Network First: Busca na rede primeiro, senão usa cache
 * Usado para: HTML, CSS, JS - conteúdo que deve estar sempre atualizado
 */
const networkFirst = async (request) => {
  try {
    // Busca sempre a versão mais nova na rede
    const networkResponse = await fetch(request);

    // ✅ Melhoria: Apenas armazena se resposta for bem-sucedida
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (err) {
    console.log('[SW] Rede indisponível, utilizando cache:', request.url);
    // Se rede falhar, tenta usar o cache
    const cached = await caches.match(request);
    
    // ✅ Se for página HTML e não tiver cache, mostra página offline
    if (request.destination === 'document') {
      return cached || caches.match(OFFLINE_URL);
    }

    return cached || new Response('', { status: 404 });
  }
};

// ======================================
// INTERCEPTAR REQUISIÇÕES
// ======================================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignora métodos que não sejam GET (apenas leitura de dados)
  if (request.method !== 'GET') return;

  // Apenas processa arquivos do seu domínio
  if (url.origin !== location.origin) return;

  // ======================================
  // HTML (Páginas) - SEMPRE ATUALIZADO
  // ======================================
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // ======================================
  // CSS e JS - SEMPRE ATUALIZADO
  // ======================================
  if (
    request.destination === 'style' ||
    request.destination === 'script'
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ======================================
  // IMAGENS e MANIFEST.JSON - CACHE PRIMEIRO
  // ✅ Melhoria: Verificação por URL para compatibilidade entre navegadores
  // ======================================
  if (
    request.destination === 'image' ||
    url.pathname.endsWith('/manifest.json') ||
    url.pathname.endsWith('manifest.json')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // ======================================
  // DEMAIS ARQUIVOS - PADRÃO REDE
  // ======================================
  event.respondWith(networkFirst(request));
});
