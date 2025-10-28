// favorites.js - управление избранным
(function(){
  function list(){ return Storage.get('favorites', []); }
  function toggle(id){
    const fav = new Set(list());
    if (fav.has(id)){ fav.delete(id); } else { fav.add(id); }
    Storage.set('favorites', Array.from(fav));
    document.dispatchEvent(new Event('favoritesUpdated'));
  }
  function isFav(id){ return list().indexOf(id) !== -1; }
  window.ExFavorites = { list, toggle, isFav };
})();
