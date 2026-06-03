const CACHE_NAME = 'nic-formacao-v9';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './offline.html',
  './privacidade.html',
  './visualizador.html',
  './login.html',
  './dashboard.html',
  './sistema-pontos.html',
  './windows.html',
  './word.html',
  './excel.html',
  './powerpoint.html',
  './internet.html',
  './prova-internet.html',
  './quizzes/internet-redes-sociais.html',
  './modulos/internet-redes-sociais/index.html',
  './assets/css/portal.css',
  './assets/js/portal-progress.js',
  './assets/js/internet-module.js',
  './canva.html',
  './ia.html',
  './manifest.json',
  './robots.txt',
  './sitemap.xml',
  './assets/favicon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/og-image.png',
  // Recursos externos usados no seu HTML
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  'https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2',
  'https://cdn.tailwindcss.com'
];

// Instalação: guarda os arquivos locais e externos no cache, tratando erros individuais
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Iniciando instalação...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto, adicionando arquivos...');
        return Promise.all(
          ASSETS_TO_CACHE.map(asset => 
            cache.add(asset)
              .then(() => console.log(`[Service Worker] Arquivo cacheado: ${asset}`))
              .catch(err => console.warn(`[Service Worker] Falha ao cachear: ${asset}`, err))
          )
        );
      })
      .then(() => {
        console.log('[Service Worker] Instalação concluída, ativando imediatamente...');
        return self.skipWaiting();
      })
  );
});

// Ativação: limpa caches antigos e assume as páginas abertas
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando nova versão...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
              .map((key) => {
                console.log(`[Service Worker] Apagando cache antigo: ${key}`);
                return caches.delete(key);
              })
        );
      })
      .then(() => {
        console.log('[Service Worker] Novo cache ativado e pronto para uso!');
        return self.clients.claim();
      })
  );
});

// Busca: usa cache para arquivos locais e externos, rede como fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  // Trata recursos externos (fontes, CDN do Tailwind) com estratégia Cache First
  if (
    requestUrl.origin === 'https://fonts.googleapis.com' ||
    requestUrl.origin === 'https://fonts.gstatic.com' ||
    requestUrl.origin === 'https://cdn.tailwindcss.com'
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          console.log(`[Service Worker] Usando cache externo: ${event.request.url}`);
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Abaixo: regra para arquivos do seu próprio site
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        console.log(`[Service Worker] Usando cache: ${event.request.url}`);
        return cachedResponse;
      }

      try {
        console.log(`[Service Worker] Buscando na rede: ${event.request.url}`);
        const networkResponse = await fetch(event.request);
        
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
        
        return networkResponse;
      } catch (error) {
        console.log(`[Service Worker] Falha ao buscar: ${event.request.url}`, error);
        
        if (event.request.mode === 'navigate') {
          console.log('[Service Worker] Usando página de modo offline');
          return caches.match('./offline.html') || caches.match('./404.html');
        }

        throw error;
      }
    })
  );
});