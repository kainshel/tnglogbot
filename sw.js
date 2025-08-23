const CACHE = 'tnglogbot-v2-1';
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
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
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
  // HTML navigations: network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }
  // Static/assets: stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((networkRes) => {
        const copy = networkRes.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return networkRes;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
