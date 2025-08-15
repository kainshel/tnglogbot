
import {DB, MUSCLE_GROUPS, toast} from './storage.js';

// Elements
const grid = document.getElementById('exercisesGrid');
const search = document.getElementById('filterSearch');
const groupFilter = document.getElementById('filterGroup');
const zoneFilter = document.getElementById('filterZone');
const typeFilter = document.getElementById('filterType');
const equipFilter = document.getElementById('filterEquip');
const sortBy = document.getElementById('filterSort');
const resetBtn = document.getElementById('filterReset');

// Populate filters
function fillGroups() {
  const groups = Object.keys(MUSCLE_GROUPS).sort();
  groups.forEach(g => {
    const o = document.createElement('option');
    o.value = g; o.textContent = g;
    groupFilter.appendChild(o);
  });
}
function fillZones() {
  const g = groupFilter.value;
  const zones = g ? MUSCLE_GROUPS[g] || [] : Array.from(new Set(Object.values(MUSCLE_GROUPS).flat()));
  zoneFilter.innerHTML = '<option value="">Все целевые зоны</option>';
  zones.forEach(z => {
    const o = document.createElement('option');
    o.value = z; o.textContent = z;
    zoneFilter.appendChild(o);
  });
  zoneFilter.disabled = zones.length === 0;
}
function fillTypesAndEquip() {
  const list = DB.exercises;
  const types = Array.from(new Set(list.map(e => (e.type||'').trim()).filter(Boolean))).sort();
  const equips = Array.from(new Set(list.map(e => (e.equipment||'').trim()).filter(Boolean))).sort();
  typeFilter.innerHTML = '<option value="">Все типы</option>';
  equipFilter.innerHTML = '<option value="">Все оборудование</option>';
  types.forEach(t => { const o=document.createElement('option'); o.value=t; o.textContent=t; typeFilter.appendChild(o); });
  equips.forEach(eq => { const o=document.createElement('option'); o.value=eq; o.textContent=eq; equipFilter.appendChild(o); });
}

fillGroups();
fillZones();
fillTypesAndEquip();

groupFilter.onchange = () => { fillZones(); render(); };
zoneFilter.onchange = render;
typeFilter.onchange = render;
equipFilter.onchange = render;
search.oninput = render;
sortBy.onchange = render;
resetBtn.onclick = () => {
  search.value = '';
  groupFilter.value = '';
  fillZones();
  zoneFilter.value = '';
  typeFilter.value = '';
  equipFilter.value = '';
  sortBy.value = 'name';
  render();
};

function sortList(list) {
  const key = sortBy.value || 'name';
  const collator = new Intl.Collator('ru', {numeric:true, sensitivity:'base'});
  return list.slice().sort((a,b)=>collator.compare((a[key]||'').toString(), (b[key]||'').toString()));
}

function passesFilters(e) {
  const q = search.value.trim().toLowerCase();
  const g = groupFilter.value;
  const z = zoneFilter.value;
  const t = typeFilter.value;
  const eq = equipFilter.value;
  return (!q || (e.name && e.name.toLowerCase().includes(q)) || (e.name_en && e.name_en.toLowerCase().includes(q)))
    && (!g || e.group === g)
    && (!z || (e.target_zone||'') === z)
    && (!t || (e.type||'') === t)
    && (!eq || (e.equipment||'') === eq);
}

function render() {
  const list = DB.exercises.filter(passesFilters);
  const sorted = sortList(list);
  grid.innerHTML = '';
  if (sorted.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Ничего не найдено';
    grid.appendChild(empty);
    return;
  }
  sorted.forEach(e => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <h3 class="ex-title">${e.name}</h3>
      <div class="ex-image-wrap"><img loading="lazy" src="${e.gif || 'icon.png'}" alt="${e.name}"></div>
      <div class="ex-meta">
        <span class="badge">${e.group}</span>
        <span class="dot">•</span>
        <span class="badge secondary">${e.target_zone || 'Целевая зона не указана'}</span>
      </div>
      <div class="ex-tags">
        ${e.type ? `<span class="tag">${e.type}</span>` : ''}
        ${e.equipment ? `<span class="tag">${e.equipment}</span>` : ''}
      </div>
      <div class="ex-actions">
        <button class="btn add">Добавить</button>
        <a class="btn ghost" target="_blank" rel="noopener" href="${e.gif}">Открыть GIF</a>
      </div>
    `;
    card.querySelector('.add').onclick = () => {
      toast('Упражнение добавлено в тренировку');
      // Hook for integration with workout flow can be placed here
    };
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', render);
