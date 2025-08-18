
const CACHE = 'tng-cache-v2';
const ASSETS = [
  "./",
  "./app_workout.js",
  "./exercises.html",
  "./exercises.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon.png",
  "./index.html",
  "./manifest.json",
  "./nav.js",
  "./profile.html",
  "./storage.js",
  "./styles.css",
  "./workout.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
