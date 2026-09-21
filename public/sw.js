const CACHE_NAME = 'fagulha-studio-v5';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(
      ASSETS_TO_CACHE.map((asset) => cache.add(asset)),
    )),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request).catch(() => {
      if (event.request.headers.get('accept')?.includes('text/html')) return caches.match('./index.html');
      return undefined;
    })),
  );
});