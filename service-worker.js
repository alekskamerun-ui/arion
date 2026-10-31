const CACHE_NAME = 'arion-v3'; // Версия кэша обновлена для сброса старого
const urlsToCache = [
  '/arion/',
  '/arion/index.html',
  '/arion/manifest.json'
];

// Установка: кэшируем базовые файлы и активируемся немедленно
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Принудительно применяем новый Service Worker
});

// Активация: удаляем старые версии кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Удаляем старый кэш
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim()); // Берем контроль над страницей
});

// Стратегия "Network First, then Cache" (Сначала сеть, потом кэш)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если сеть доступна, возвращаем свежий ответ и обновляем кэш
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Если сети нет, пытаемся взять из кэша
        return caches.match(event.request);
      })
  );
});
