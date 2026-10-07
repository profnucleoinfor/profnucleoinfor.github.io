// NÚCLEO INFORMÁTICA — Service Worker V21.1.2
const CACHE_NAME = 'nic-formacao-v21-1-2';
const CACHE_PREFIX = 'nic-formacao-';
const OFFLINE_URL = './offline.html';
const STATIC_ASSETS = [
  OFFLINE_URL, './404.html', './index.html', './login.html', './dashboard.html', './visualizador.html',
  './manifest.json?v=21.1.2', './robots.txt', './sitemap.xml',
  './assets/favicon.png', './assets/icon-192.png', './assets/icon-512.png',
  './assets/og-image.png', './assets/js/login.js', './assets/js/senhas.js', './assets/js/dashboard.js', './assets/js/materiais-config.js', './assets/js/materiais.js', './assets/js/curso.js', './assets/js/navegacao.js', './assets/js/pwa.js'
];

const valid = (response) => response && response.ok;

async function precache(cache, asset) {
  try {
    const response = await fetch(asset, { cache: 'reload' });
    if (valid(response)) await cache.put(asset, response);
  } catch (error) {
    console.warn('[SW] Pré-cache adiado:', asset, error);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(STATIC_ASSETS.map((asset) => precache(cache, asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
             .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (valid(response)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (request.destination === 'image') return caches.match('./assets/icon-192.png');
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (valid(response)) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.destination === 'document') return caches.match(OFFLINE_URL);
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (['document', 'style', 'script'].includes(request.destination)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (request.destination === 'image' || url.pathname.endsWith('/manifest.json')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  event.respondWith(networkFirst(request));
});
