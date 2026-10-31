const CACHE_NAME = 'arion-v2'; // Поменяли версию, чтобы сбросить старый кэш
const urlsToCache = [
  '/arion/',
  '/arion/index.html',
  '/arion/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Заставляет применить обновления немедленно
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Сначала пробуем скачать из интернета (свежую версию)
    fetch(event.request).catch(() => {
      // Если интернета нет — берем из кэша
      return caches.match(event.request);
    })
  );
});
