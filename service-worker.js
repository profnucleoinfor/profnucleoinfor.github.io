// NÚCLEO INFORMÁTICA — Service Worker (gerado por build/build.mjs — não edite à mão)
// Regras: só arquivos LOCAIS, nunca bloqueia o site, sempre há fallback para a rede.
const BUILD = '0b0a2d762d42';
const CACHE_PREFIX = 'nic-formacao-';
const CACHE_NAME = CACHE_PREFIX + BUILD;
const OFFLINE_URL = './offline.html';
const NAV_TIMEOUT_MS = 4000; // rede lenta: após 4 s usa a cópia salva, se existir
const PRECACHE = [
  "./",
  "./index.html",
  "./login.html",
  "./dashboard.html",
  "./windows.html",
  "./word.html",
  "./excel.html",
  "./powerpoint.html",
  "./internet.html",
  "./canva.html",
  "./ia.html",
  "./sistema-pontos.html",
  "./privacidade.html",
  "./404.html",
  "./offline.html",
  "./visualizador.html",
  "./canva-quest.html",
  "./hardware-quest-simulado.html",
  "./ia-quest.html",
  "./prova-internet.html",
  "./rvnet.html",
  "./simulado_historia_computadores_windows_linux.html",
  "./simulado_software_sistemas_operacionais.html",
  "./manifest.json",
  "./assets/css/nic.2e7d6caa.css",
  "./assets/css/visualizador.7ecc811d.css",
  "./assets/js/core.d4f8acd7.js",
  "./assets/js/curso.92803554.js",
  "./assets/js/dashboard.b301a8c9.js",
  "./assets/js/landing.6360496d.js",
  "./assets/js/login.1f65f289.js",
  "./assets/js/quiz.a8dc9472.js",
  "./assets/js/visualizador.29d2d975.js",
  "./assets/favicon.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-192.png",
  "./assets/icon-maskable-512.png"
];

const ok = (r) => r && r.ok;

async function precache(cache, url) {
  try {
    const r = await fetch(url, { cache: 'reload' });
    if (ok(r)) await cache.put(url, r);
  } catch (e) {
    console.warn('[SW] Pré-cache adiado:', url);
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE.map((u) => precache(cache, u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith(CACHE_PREFIX) && n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// URLs com ?query (ex.: visualizador.html?url=...) não entram no cache.
const cacheavel = (url) => !url.search || url.pathname.endsWith('/manifest.json');
const guardar = async (req, res) => (await caches.open(CACHE_NAME)).put(req, res);
// arquivos com hash no nome (nic.ab12cd34.css) nunca mudam: cache primeiro.
const imutavel = (url) => /\/assets\/(css|js)\/[^/]+\.[0-9a-f]{8}\.(css|js)$/.test(url.pathname);

function paginas(event, url) {
  const req = event.request;
  const cache = () => caches.match(req, { ignoreSearch: true });
  const rede = fetch(req).then((res) => {
    if (ok(res) && cacheavel(url)) event.waitUntil(guardar(req, res.clone()));
    return res;
  });
  const limite = new Promise((resolve) => setTimeout(() => resolve(cache()), NAV_TIMEOUT_MS));
  return Promise.race([rede, limite])
    .then((res) => res || rede)
    .catch(() => cache().then((hit) => hit || caches.match(OFFLINE_URL)));
}

async function estaticos(event, url) {
  const req = event.request;
  const guardado = await caches.match(req);
  if (guardado && imutavel(url)) return guardado;
  const atualiza = fetch(req).then((res) => {
    if (ok(res) && cacheavel(url)) event.waitUntil(guardar(req, res.clone()));
    return res;
  });
  if (guardado) { atualiza.catch(() => {}); return guardado; }
  try {
    return await atualiza;
  } catch (e) {
    if (req.destination === 'image') return caches.match('./assets/icon-192.png');
    return new Response('', { status: 503, statusText: 'Offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // nunca intercepta conteúdo externo
  if (req.mode === 'navigate' || req.destination === 'document') event.respondWith(paginas(event, url));
  else event.respondWith(estaticos(event, url));
});
