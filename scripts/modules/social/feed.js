// feed.js - локальная лента активности
(function(){
  function list(){ return Storage.get('feed', []); }
  function post(text){ const f=list(); f.unshift({id:'p'+Date.now(), text, date:new Date().toISOString()}); Storage.set('feed', f); document.dispatchEvent(new Event('feedUpdated')); }
  window.Feed = { list, post };
})();
