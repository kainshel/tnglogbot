// friends.js - простая модель друзей/подписок
(function(){
  function list(){ return Storage.get('friends', []); }
  function add(name){ const f = list(); f.push({id:'f'+Date.now(), name}); Storage.set('friends', f); document.dispatchEvent(new Event('friendsUpdated')); }
  window.Friends = { list, add };
})();
