// animations.js - простые утилиты для плавных переходов
(function(){
  function fadeIn(el, ms){ el.style.transition = 'opacity '+(ms||200)+'ms'; el.style.opacity=0; el.hidden=false; requestAnimationFrame(()=> el.style.opacity=1); }
  function fadeOut(el, ms){ el.style.transition = 'opacity '+(ms||200)+'ms'; el.style.opacity=1; requestAnimationFrame(()=> el.style.opacity=0); setTimeout(()=> el.hidden=true, ms||200); }
  window.Anim = { fadeIn, fadeOut };
})();
