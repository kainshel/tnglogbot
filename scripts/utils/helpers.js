// helpers.js
(function(){
  function el(id){ return document.getElementById(id); }
  function q(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qAll(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
  window.Helpers = { el, q, qAll };
})();
