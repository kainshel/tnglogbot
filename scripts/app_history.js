import { getKey } from './storage.js';
import { downloadFile } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const key = getKey('workouts');
  const raw = localStorage.getItem(key) || '{}';
  let store = {};
  try { store = JSON.parse(raw); } catch (e) { store = {}; }

  const container = document.getElementById('historyList');
  const filterText = document.getElementById('filterText');
  const filterFrom = document.getElementById('filterFrom');
  const filterTo = document.getElementById('filterTo');
  const apply = document.getElementById('applyFilter');
  const clear = document.getElementById('clearFilter');
  const exportBtn = document.getElementById('exportCsv');

  function render(filtered) {
    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = '<p class="card">Нет записей.</p>';
      return;
    }
    filtered.forEach(item => {
      const s = document.createElement('section'); s.className = 'card';
      s.innerHTML = `<h3>${new Date(item.date).toLocaleDateString('ru-RU')}</h3>`;
      const ul = document.createElement('ul');
      item.items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it.name + ' — ' + (it.sets ? it.sets.join(', ') : '—');
        ul.appendChild(li);
      });
      s.appendChild(ul);
      container.appendChild(s);
    });
  }

  function getAll() {
    return Object.keys(store).sort((a,b)=> new Date(b)-new Date(a)).map(date => ({date, items: store[date]}));
  }

  function applyFilter() {
    const q = filterText.value.trim().toLowerCase();
    const from = filterFrom.value;
    const to = filterTo.value;
    let list = getAll();
    if (q) list = list.map(d=>({...d, items: d.items.filter(it => it.name.toLowerCase().includes(q))})).filter(d=>d.items.length);
    if (from) list = list.filter(d => new Date(d.date) >= new Date(from));
    if (to) list = list.filter(d => new Date(d.date) <= new Date(to));
    render(list);
  }

  apply.addEventListener('click', applyFilter);
  clear.addEventListener('click', () => { filterText.value=''; filterFrom.value=''; filterTo.value=''; render(getAll()); });

  exportBtn.addEventListener('click', () => {
    const rows = ['date,exercise,sets'];
    getAll().forEach(d => d.items.forEach(it => rows.push([d.date, JSON.stringify(it.name), JSON.stringify(it.sets)].join(','))));
    downloadFile('workouts.csv', rows.join('\n'));
  });

  // initial render
  render(getAll());
});
