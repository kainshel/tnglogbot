self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()); });
self.addEventListener('install', (event) => { self.skipWaiting();
 (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});