(function(){
  function navigate(path) {
    history.pushState({}, '', path);
    loadPage(path);
  }

  function loadPage(path) {
    console.log("Navigating to:", path);
    // Здесь можно реализовать подгрузку контента
  }

  function init() {
    document.body.addEventListener('click', function(e){
      const a = e.target.closest('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('http')) return;

      e.preventDefault();
      navigate(href);
    });

    window.addEventListener('popstate', () => {
      loadPage(location.pathname);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
