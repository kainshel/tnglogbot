// nav.js - обновлённое боковое меню с полным списком страниц
(function(){
  function qs(s){ return document.querySelector(s); }
  const body = document.body;
  const burger = qs('#burger');
  const sidebar = qs('#sidebar');
  const backdrop = qs('#backdrop');
  if (!burger || !sidebar) return;
  function openDrawer(){ body.classList.add('drawer-open'); burger.setAttribute('aria-expanded','true'); backdrop.hidden=false; }
  function closeDrawer(){ body.classList.remove('drawer-open'); burger.setAttribute('aria-expanded','false'); backdrop.hidden=true; }
  burger.addEventListener('click', function(){ if (body.classList.contains('drawer-open')) closeDrawer(); else openDrawer(); });
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeDrawer(); });
  // populate menu with full set
  const menuHtml = `
    <div class="brand">Дневник Тренировок</div>
    <nav role="navigation" class="nav">
      <a href="index.html">Главная</a>
      <a href="exercises.html">База упражнений</a>
      <a href="workout.html">Тренировка</a>
      <a href="history.html">История</a>
	  <a href="programs.html">Программы тренировок</a>
      <a href="challenges.html">Челленджи</a>
      <a href="profile.html">Профиль</a>
    </nav>
  `;
  sidebar.innerHTML = menuHtml;
  // close after clicking link
  sidebar.addEventListener('click', (e)=>{ const a = e.target.closest('a'); if (a) closeDrawer(); });
  
  // Автоматическое выделение активной страницы
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  sidebar.querySelectorAll('.nav a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // service worker registration (если есть)
  if ('serviceWorker' in navigator) window.addEventListener('load', ()=> navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();