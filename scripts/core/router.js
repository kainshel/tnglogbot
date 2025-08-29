// router.js - простая маршрутизация через data-route на ссылках
(function(){
  function init() {
    document.body.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      // internal links only (no http)
      if (href.indexOf('http')===0 || href.indexOf('//')===0) return;
      // let browser handle file navigation; we only support optional hash routes
      return;
    });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
