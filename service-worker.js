// ======================================
// NÚCLEO INFORMÁTICA - SERVICE WORKER
// Estratégia:
// - Network First para HTML, CSS e JS
// - Cache First para fontes e imagens
// - Offline fallback para navegação
// ======================================

const CACHE_NAME = 'nic-formacao-v10';

const STATIC_ASSETS = [
  './offline.html',
  './404.html',

  './manifest.json',
  './robots.txt',
  './sitemap.xml',

  './assets/favicon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/og-image.png',

  // Fontes e recursos externos
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  'https://cdn.tailwindcss.com'
];

// ======================================
// INSTALAÇÃO
// ======================================

self.addEventListener('install', (event) => {
  console.log('[SW] Instalando versão:', CACHE_NAME);

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.error('[SW] Erro ao criar cache:', err))
  );
});

// ======================================
// ATIVAÇÃO
// ======================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando nova versão');

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ======================================
// FETCH
// ======================================

self.addEventListener('fetch', (event) => {

  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ======================================
  // RECURSOS EXTERNOS
  // Cache First
  // ======================================

  if (
    url.origin.includes('fonts.googleapis.com') ||
    url.origin.includes('fonts.gstatic.com') ||
    url.origin.includes('cdn.tailwindcss.com')
  ) {

    event.respondWith(
      caches.match(event.request).then(cached => {

        if (cached) return cached;

        return fetch(event.request).then(response => {

          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));

          return response;
        });

      })
    );

    return;
  }

  // ======================================
  // APENAS ARQUIVOS DO PORTAL
  // ======================================

  if (url.origin !== location.origin) return;

  // ======================================
  // HTML
  // NETWORK FIRST
  // ======================================

  if (event.request.destination === 'document') {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));

          return response;
        })

        .catch(async () => {

          const cached = await caches.match(event.request);

          return cached || caches.match('./offline.html');

        })

    );

    return;
  }

  // ======================================
  // CSS E JS
  // NETWORK FIRST
  // ======================================

  if (
    event.request.destination === 'style' ||
    event.request.destination === 'script'
  ) {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));

          return response;
        })

        .catch(() => caches.match(event.request))

    );

    return;
  }

  // ======================================
  // IMAGENS
  // CACHE FIRST
  // ======================================

  if (event.request.destination === 'image') {

    event.respondWith(

      caches.match(event.request)
        .then(cached => {

          if (cached) return cached;

          return fetch(event.request)
            .then(response => {

              const clone = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, clone));

              return response;
            });

        })

    );

    return;
  }

  // ======================================
  // PADRÃO
  // NETWORK FIRST
  // ======================================

  event.respondWith(

    fetch(event.request)
      .then(response => {

        const clone = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, clone));

        return response;
      })

      .catch(() => caches.match(event.request))

  );

});
