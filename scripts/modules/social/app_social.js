// app_social.js - простая логика страницы social
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const feedRoot = document.getElementById('feed-root');
    const form = document.getElementById('feed-form');
    function redraw(){ 
      const items = Feed.list();
      if (!feedRoot) return;
      feedRoot.innerHTML = items.map(i=>`<div class="feed-item card"><div class="date">${new Date(i.date).toLocaleString()}</div><div class="txt">${i.text}</div></div>`).join('');
    }
    if (form) form.addEventListener('submit', function(e){ e.preventDefault(); Feed.post(form.message.value); form.message.value=''; redraw(); });
    document.addEventListener('feedUpdated', redraw);
    redraw();
  });
})();
