const CACHE='gk-laurel-mp-v1';
const ASSETS=['./','index.html','exercises.html','workout.html','calendar.html','stats.html','view.html',
'styles.css','storage.js','app_profile.js','app_exercises.js','app_workout.js','app_calendar.js','app_stats.js','app_view.js','manifest.json','icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });
