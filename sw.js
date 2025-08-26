const CACHE = 'tnglogbot-expanded-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/workout.html',
  '/exercises.html',
  '/history.html',
  '/profile.html',
  '/styles/main.css',
  '/scripts/app_main.js',
  '/scripts/app_workout.js',
  '/scripts/app_exercises.js',
  '/scripts/app_history.js',
  '/scripts/app_profile.js',
  '/scripts/utils.js',
  '/scripts/storage.js',
  '/scripts/ui.js',
  '/nav-poly.js',
  '/nav.js',
  '/tg-init.js',
  '/exercises.json',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // navigation fallback
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(r=>{ return r; }).catch(()=>caches.match('/index.html')));
    return;
  }
  // serve from cache then update
  event.respondWith(caches.match(req).then(cached => {
    const network = fetch(req).then(res => {
      if (res && res.ok) caches.open(CACHE).then(c=>c.put(req,res.clone()));
      return res;
    }).catch(()=>cached);
    return cached || network;
  }));
});

// message to skip waiting if requested
self.addEventListener('message', (e)=>{
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
