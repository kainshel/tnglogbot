import { uidKey } from './utils.js';
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered');
    } catch (e) { console.warn('SW failed', e); }
  });
}

// preload exercise catalog to cache
fetch('/exercises.json').then(r=>r.json()).then(data=>{
  // expose to window for simple access
  window.__EX_CATALOG = data;
}).catch(()=>{ window.__EX_CATALOG = []; });

// attach nav toggler (same logic as shared file but ensure available)
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  if (!burger || !sidebar || !backdrop) return;
  function open(){ sidebar.setAttribute('aria-hidden','false'); burger.setAttribute('aria-expanded','true'); backdrop.hidden = false; }
  function close(){ sidebar.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false'); backdrop.hidden = true; }
  burger.addEventListener('click', ()=> sidebar.getAttribute('aria-hidden') === 'true' ? open() : close());
  backdrop.addEventListener('click', close);
});
