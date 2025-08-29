// sync.js - заглушка синхронизации (emit/receive events)
(function(){
  window.Sync = {
    push(){ console.info('Sync.push() called - no-op in local build'); },
    pull(){ console.info('Sync.pull() called - no-op in local build'); }
  };
})();
