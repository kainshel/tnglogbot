// notifications.js - простые тосты
(function(){
  function showToast(text, timeout){
    let root = document.getElementById('toasts-root');
    if (!root){
      root = document.createElement('div');
      root.id = 'toasts-root';
      root.className = 'toasts';
      document.body.appendChild(root);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    root.appendChild(t);
    setTimeout(()=> t.classList.add('visible'), 10);
    setTimeout(()=> t.classList.remove('visible'), timeout||3000);
    setTimeout(()=> t.remove(), (timeout||3000)+500);
  }
  window.Notify = { toast: showToast };
})();
