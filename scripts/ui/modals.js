// modals.js - простая работа с модалками по id
(function(){
  window.Modals = {
    show(id, html){
      const back = document.getElementById('modalBack');
      const modal = document.getElementById(id) || document.getElementById('modal');
      if (modal && back){
        modal.innerHTML = html || modal.innerHTML;
        back.hidden = false;
      }
    },
    hide(){
      const back = document.getElementById('modalBack');
      if (back) back.hidden = true;
    }
  };
  document.addEventListener('click', function(e){
    if (e.target.matches('.modal-close') || e.target.id==='modalBack') Modals.hide();
  });
})();
