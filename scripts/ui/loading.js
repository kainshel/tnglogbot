// loading.js - индикатор загрузки
(function(){
  window.Loading = {
    show(msg){ 
      let el = document.getElementById('global-loading');
      if (!el){
        el = document.createElement('div');
        el.id = 'global-loading';
        el.className = 'loading-overlay';
        el.innerHTML = '<div class="spinner"></div><div class="msg"></div>';
        document.body.appendChild(el);
      }
      el.querySelector('.msg').textContent = msg||'Загрузка...';
      el.hidden = false;
    },
    hide(){ let el = document.getElementById('global-loading'); if (el) el.hidden = true; }
  };
})();
