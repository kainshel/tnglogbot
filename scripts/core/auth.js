// auth.js - минимальная "авторизация" с локальным профилем
(function(){
  function getProfile(){
    return Storage.get('profile', {name: 'Спортсмен', height: null, weight: null, avatar: null});
  }
  function saveProfile(p){
    Storage.set('profile', p);
    document.dispatchEvent(new CustomEvent('profileUpdated', {detail: p}));
  }
  window.Auth = {
    getProfile, saveProfile
  };
})();
