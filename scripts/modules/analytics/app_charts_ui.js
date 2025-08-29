// дополнительный ui-скрипт для analytics.html - hookup canvas sizes
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('canvas[data-chart]').forEach(c=>{ c.width = c.clientWidth*2; c.height = c.clientHeight*2; });
  });
})();
