const CACHE_NAME = 'ong-1mais1-1794525001855';
const APP_FILES = ['./', './index.html', './style.css', './script.js', './manifest.json', './assets/logo-ong.jpeg', './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('ong-1mais1-') && key !== CACHE_NAME).map((key) => caches.delete(key)))));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(async (response) => {
    if (event.request.destination === 'image' && response.ok) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      } catch (_) {
        // A imagem continua disponível online se o armazenamento estiver cheio.
      }
    }
    return response;
  }).catch(() => caches.match(event.request).then((response) => response || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
