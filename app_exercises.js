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

// Проверяем, что все необходимые элементы существуют
if (!container || !filterGroups || !filterTargets || !filterType || !filterEquipment || !searchInput || 
    !modalBack || !modalContent || !modalClose) {
  console.error('Не найдены необходимые DOM элементы');
}

async function loadExercises() {
  try {
    const res = await fetch('exercises.json', { cache: 'no-store' });
    exercises = await res.json();
    normalizeData();
    fillFilters();
    renderExercises(exercises);
  } catch (e) {
    console.error('Ошибка загрузки упражнений', e);
    container.innerHTML = '<p>Ошибка загрузки упражнений. Проверьте консоль для подробностей.</p>';
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
  if (!filterGroups || !filterTargets || !filterType || !filterEquipment) return;
  
  // Очищаем фильтры
  [filterGroups, filterTargets, filterType, filterEquipment].forEach(filter => {
    filter.innerHTML = '<option value="">Все</option>';
  });
  
  // Заполняем группы мышц
  const groups = [...new Set(exercises.flatMap(ex => ex.groups))];
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    filterGroups.appendChild(opt);
  });
  
  // Заполняем целевые зоны
  const targets = [...new Set(exercises.flatMap(ex => ex.targets))];
  targets.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterTargets.appendChild(opt);
  });
  
  // Заполняем типы упражнений
  const types = [...new Set(exercises.map(ex => ex.type))];
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterType.appendChild(opt);
  });
  
  // Заполняем оборудование
  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))];
  equipments.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    filterEquipment.appendChild(opt);
  });
  
  // Добавляем обработчики для зависимых фильтров
  setupDependentFilters();
}

function setupDependentFilters() {
  if (!filterGroups || !filterTargets) return;
  
  // Удаляем старые обработчики
  filterGroups.onchange = null;
  filterTargets.onchange = null;
  
  // При изменении группы мышц обновляем целевые зоны
  filterGroups.addEventListener('change', function() {
    updateTargetsFilter(this.value);
    applyFilters();
  });
  
  // При изменении целевых зон обновляем группы мышц
  filterTargets.addEventListener('change', function() {
    updateGroupsFilter(this.value);
    applyFilters();
  });
}

function updateTargetsFilter(selectedGroup) {
  if (!filterTargets) return;
  
  const currentTarget = filterTargets.value;
  filterTargets.innerHTML = '<option value="">Все</option>';
  
  let availableTargets;
  if (!selectedGroup) {
    availableTargets = [...new Set(exercises.flatMap(ex => ex.targets))];
  } else {
    const filteredExercises = exercises.filter(ex => ex.groups.includes(selectedGroup));
    availableTargets = [...new Set(filteredExercises.flatMap(ex => ex.targets))];
  }
  
  availableTargets.forEach(target => {
    const opt = document.createElement('option');
    opt.value = target;
    opt.textContent = target;
    if (target === currentTarget && availableTargets.includes(currentTarget)) {
      opt.selected = true;
    }
    filterTargets.appendChild(opt);
  });
}

function updateGroupsFilter(selectedTarget) {
  if (!filterGroups) return;
  
  const currentGroup = filterGroups.value;
  filterGroups.innerHTML = '<option value="">Все</option>';
  
  let availableGroups;
  if (!selectedTarget) {
    availableGroups = [...new Set(exercises.flatMap(ex => ex.groups))];
  } else {
    const filteredExercises = exercises.filter(ex => ex.targets.includes(selectedTarget));
    availableGroups = [...new Set(filteredExercises.flatMap(ex => ex.groups))];
  }
  
  availableGroups.forEach(group => {
    const opt = document.createElement('option');
    opt.value = group;
    opt.textContent = group;
    if (group === currentGroup && availableGroups.includes(currentGroup)) {
      opt.selected = true;
    }
    filterGroups.appendChild(opt);
  });
}

function renderExercises(list) {
  if (!container) return;
  
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p>Упражнения не найдены</p>';
    return;
  }
  
  list.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <h3>${ex.name_ru}</h3>
      <img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif" loading="lazy">
      <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
      <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
      <button class="details-btn">Подробнее</button>
    `;
    const btn = card.querySelector('.details-btn');
    if (btn) {
      btn.onclick = () => showDetails(ex);
    }
    container.appendChild(card);
  });
}

// Дебаунс для поиска
let searchTimeout;
function applyFilters() {
  if (searchTimeout) clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    let list = [...exercises];
    const search = searchInput?.value.toLowerCase() || '';
    if (search) {
      list = list.filter(ex => 
        ex.name_ru.toLowerCase().includes(search) || 
        ex.name_en.toLowerCase().includes(search)
      );
    }
    
    const gr = (filterGroups?.value || '').trim();
    if (gr) list = list.filter(ex => ex.groups.includes(gr));
    
    const tg = (filterTargets?.value || '').trim();
    if (tg) list = list.filter(ex => ex.targets.includes(tg));
    
    const tp = (filterType?.value || '').trim();
    if (tp) list = list.filter(ex => ex.type === tp);
    
    const eq = (filterEquipment?.value || '').trim();
    if (eq) list = list.filter(ex => ex.equipment.includes(eq));
    
    renderExercises(list);
  }, 300);
}

function showDetails(ex) {
  if (!modalContent || !modalBack) return;
  
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

// Добавляем обработчики безопасно
if (modalClose) {
  modalClose.onclick = () => {
    if (modalBack) modalBack.style.display = 'none';
  };
}

if (modalBack) {
  modalBack.onclick = (e) => { 
    if (e.target === modalBack) modalBack.style.display = 'none'; 
  };
}

// Добавляем обработчики для всех фильтров с проверкой
[filterGroups, filterTargets, filterType, filterEquipment].forEach(sel => {
  if (sel) sel.addEventListener('change', applyFilters);
});

if (searchInput) {
  searchInput.addEventListener('input', applyFilters);
}

// Загружаем упражнения только если контейнер существует
if (container) {
  loadExercises();
} else {
  console.error('Контейнер упражнений не найден');
}