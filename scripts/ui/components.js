// components.js - несколько простых web components
(function(){
  class IconBtn extends HTMLElement{
    connectedCallback(){
      this.innerHTML = '<button class="icon-btn">'+(this.getAttribute('label')||'')+'</button>';
    }
  }
  if (!customElements.get('icon-btn')) customElements.define('icon-btn', IconBtn);
})();
