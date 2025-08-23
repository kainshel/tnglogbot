const CACHE = 'tnglogbot-v1';
const ASSETS = [
  "./app_exercises.js",
  "./app_history.js",
  "./app_workout.js",
  "./avatar.png",
  "./edit_profile.html",
  "./exercises.html",
  "./exercises.json",
  "./history.html",
  "./icon-192.png",
  "./icon-512.png",
  "./index.html",
  "./manifest.json",
  "./nav.js",
  "./profile.html",
  "./styles/history.css",
  "./styles/main.css",
  "./styles/profile.css",
  "./styles/responsive.css",
  "./styles/workout.css",
  "./sw.js",
  "./workout.html"
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  }
});