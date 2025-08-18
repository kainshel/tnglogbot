
// ---- Safe localStorage patch (auto-injected) ----
(function(){
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    const _remove = localStorage.removeItem.bind(localStorage);
    const _clear = localStorage.clear.bind(localStorage);
    localStorage.setItem = function(k,v){ try { return _set(k,v); } catch(e){ console.error('localStorage.setItem error', e); } };
    localStorage.getItem = function(k){ try { return _get(k); } catch(e){ console.error('localStorage.getItem error', e); return null; } };
    localStorage.removeItem = function(k){ try { return _remove(k); } catch(e){ console.error('localStorage.removeItem error', e); } };
    localStorage.clear = function(){ try { return _clear(); } catch(e){ console.error('localStorage.clear error', e); } };
  } catch(e){ /* silent */ }
})();
// -----------------------------------------------

let exercises = [];
const container = document.getElementById('exercises-container');
const filterGroups = document.getElementById('filter-groups');
const filterTargets = document.getElementById('filter-targets');
const filterType = document.getElementById('filter-type');
const filterEquipment = document.getElementById('filter-equipment');
const searchInput = document.getElementById('search');

const modalBack = document.getElementById('modalBack');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

async function loadExercises() {
  try {
    const res = await fetch('exercises.json', { cache: 'no-store' });
    exercises = await res.json();
    normalizeData();
    fillFilters();
    renderExercises(exercises);
  } catch (e) {
    console.error('Ошибка загрузки упражнений', e);
  }
}

function normalizeData() {
  exercises = exercises.map(ex => ({
    ...ex,
    groups: Array.isArray(ex.groups) ? ex.groups : (ex.groups ? [ex.groups] : []),
    targets: Array.isArray(ex.targets) ? ex.targets : (ex.targets ? [ex.targets] : []),
    equipment: Array.isArray(ex.equipment) ? ex.equipment : (ex.equipment ? [ex.equipment] : []),
  }));
}

function fillFilters() {
  const groups = [...new Set(exercises.flatMap(ex => ex.groups))];
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    filterGroups.appendChild(opt);
  });
  const targets = [...new Set(exercises.flatMap(ex => ex.targets))];
  targets.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterTargets.appendChild(opt);
  });
  const types = [...new Set(exercises.map(ex => ex.type))];
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterType.appendChild(opt);
  });
  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))];
  equipments.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    filterEquipment.appendChild(opt);
  });
}

function renderExercises(list) {
  container.innerHTML = '';
  list.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <h3>${ex.name_ru}</h3>
      <img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif">
      <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
      <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
      <button class="details-btn">Подробнее</button>
    `;
    card.querySelector('.details-btn').onclick = () => showDetails(ex);
    container.appendChild(card);
  });
}

function applyFilters() {
  let list = [...exercises];
  const search = searchInput.value.toLowerCase();
  if (search) list = list.filter(ex => ex.name_ru.toLowerCase().includes(search) || ex.name_en.toLowerCase().includes(search));
  const gr = (filterGroups?.value || '').trim();
  if (gr) list = list.filter(ex => ex.groups.includes(gr));
  const tg = (filterTargets?.value || '').trim();
  if (tg) list = list.filter(ex => ex.targets.includes(tg));
  const tp = (filterType?.value || '').trim();
  if (tp) list = list.filter(ex => ex.type === tp);
  const eq = (filterEquipment?.value || '').trim();
  if (eq) list = list.filter(ex => ex.equipment.includes(eq));
  renderExercises(list);
}

function showDetails(ex) {
  modalContent.innerHTML = `
    <h2>${ex.name_ru}</h2>
    <img src="${ex.gif}" alt="${ex.name_en}" class="modal-gif">
    <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
    <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
    <p><b>Тип:</b> ${ex.type}</p>
    <p><b>Оборудование:</b> ${ex.equipment.join(', ')}</p>
    <p>${ex.description || 'Описание отсутствует'}</p>
  `;
  modalBack.style.display = 'flex';
}

modalClose.onclick = () => modalBack.style.display = 'none';
modalBack.onclick = (e) => { if (e.target === modalBack) modalBack.style.display = 'none'; };

[filterGroups, filterTargets, filterType, filterEquipment, searchInput].forEach(sel => {
  sel.addEventListener('input', applyFilters);
});

loadExercises();
