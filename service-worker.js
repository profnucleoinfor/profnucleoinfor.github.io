const CACHE_NAME = 'nic-formacao-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './404.html',
  './privacidade.html',
  './login.html',
  './dashboard.html',
  './sistema-pontos.html',
  './windows.html',
  './word.html',
  './excel.html',
  './powerpoint.html',
  './internet.html',
  './canva.html',
  './ia.html',
  './manifest.json',
  './robots.txt',
  './sitemap.xml',
  './assets/favicon.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/og-image.png'
];

// Instalação: guarda os arquivos locais no cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos e assume as páginas abertas.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Busca: usa cache para arquivos locais e rede para recursos externos.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        if (event.request.mode === 'navigate') {
          return caches.match('./404.html');
        }

        throw error;
      }
    })
  );
});
