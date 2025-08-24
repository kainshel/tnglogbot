
// Drawer controller for burger menu
(function(){
  function qs(sel){ return document.querySelector(sel); }
  const body = document.body;
  const burger = qs('#burger');
  const sidebar = qs('#sidebar');
  const backdrop = qs('#backdrop');

  if (!burger || !sidebar || !backdrop) return;

  function openDrawer(){
    body.classList.add('drawer-open');
    burger.setAttribute('aria-expanded','true');
    sidebar.setAttribute('aria-hidden','false');
    backdrop.hidden = false;
  }
  function closeDrawer(){
    body.classList.remove('drawer-open');
    burger.setAttribute('aria-expanded','false');
    sidebar.setAttribute('aria-hidden','true');
    backdrop.hidden = true;
  }
  function toggleDrawer(){
    if (body.classList.contains('drawer-open')) closeDrawer();
    else openDrawer();
  }

  burger.addEventListener('click', toggleDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeDrawer();
  });
  // Close after navigating a link inside sidebar
  sidebar.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if (a && a.getAttribute('href')) closeDrawer();
  });
})();


/* PWA: register service worker */
(function(){
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./sw.js').catch(function(err){
        // Silently ignore in production, but helpful for dev
        console.error('SW registration failed:', err);
      });
    });
  }
})();


// Keep topbar visible and prevent text overlap on open
(function(){
  function onReady(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  onReady(function(){
    var topbar = document.querySelector('.topbar');
    var content = document.querySelector('.main-content');
    if (topbar && content){
      var h = topbar.getBoundingClientRect().height;
      content.style.scrollMarginTop = h + 'px';
    }
  });
})();
