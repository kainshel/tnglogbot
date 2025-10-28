// app.js - Инициализация приложения
(function(){
  window.App = {
    version: 'v2.0',
    ready: false,
    onReadyQueue: []
  };

  function ready() {
    App.ready = true;
    App.onReadyQueue.forEach(fn => { try { fn(); } catch(e){ console.error(e);} });
    App.onReadyQueue = [];
    document.dispatchEvent(new Event('appReady'));
  }

  // wait for DOM and tg-init
  document.addEventListener('DOMContentLoaded', function(){
    // small delay to ensure tg-init fires its event first
    setTimeout(ready, 10);
  });

  window.App.readyOr = function(fn){
    if (App.ready) fn(); else App.onReadyQueue.push(fn);
  };
})();
