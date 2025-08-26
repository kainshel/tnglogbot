import { uidKey } from './utils.js';
document.addEventListener('DOMContentLoaded', () => {
  const catalogEl = document.getElementById('catalog');
  const search = document.getElementById('searchEx');
  const catalog = window.__EX_CATALOG || [];

  function render(list) {
    catalogEl.innerHTML = '';
    list.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h4>${ex.name}</h4><p class="muted">${ex.muscles || ''}</p><p>${ex.description || ''}</p>`;
      catalogEl.appendChild(card);
    });
  }

  render(catalog);

  search.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return render(catalog);
    render(catalog.filter(c => c.name.toLowerCase().includes(q) || (c.muscles||'').toLowerCase().includes(q)));
  });
});
