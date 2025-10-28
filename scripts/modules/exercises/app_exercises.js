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
const searchInput = document.getElementById('exSearch'); // Исправлено на exSearch

const modalBack = document.getElementById('modalBack');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Добавляем функцию показа ошибок
function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <p>${message}</p>
    <button onclick="location.reload()">Обновить страницу</button>
  `;
  
  const content = document.querySelector('.content');
  if (content) {
    content.insertBefore(errorDiv, content.firstChild);
  }
}

// Функция debounce для поиска
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function loadExercises() {
  try {
    const res = await fetch('data/exercises.json', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    exercises = await res.json();
    
    if (!exercises || exercises.length === 0) {
      throw new Error('Получен пустой массив упражнений');
    }
    
    normalizeData();
    fillFilters();
    renderExercises(exercises);
    
    return exercises;
    
  } catch (e) {
    console.error('Ошибка загрузки упражнений', e);
    showErrorMessage('Не удалось загрузить упражнения. Попробуйте обновить страницу.');
    return [];
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
  // Очищаем фильтры
  [filterGroups, filterTargets, filterType, filterEquipment].forEach(filter => {
    if (filter) filter.innerHTML = '<option value="">Все</option>';
  });
  
  // Заполняем группы мышц
  const groups = [...new Set(exercises.flatMap(ex => ex.groups))];
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    if (filterGroups) filterGroups.appendChild(opt);
  });
  
  // Заполняем целевые зоны
  const targets = [...new Set(exercises.flatMap(ex => ex.targets))];
  targets.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (filterTargets) filterTargets.appendChild(opt);
  });
  
  // Заполняем типы упражнений
  const types = [...new Set(exercises.map(ex => ex.type))];
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (filterType) filterType.appendChild(opt);
  });
  
  // Заполняем оборудование
  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))];
  equipments.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    if (filterEquipment) filterEquipment.appendChild(opt);
  });
  
  // Добавляем обработчики для зависимых фильтров
  setupDependentFilters();
}

function setupDependentFilters() {
  if (!filterGroups || !filterTargets) return;
  
  // Удаляем старые обработчики, чтобы избежать дублирования
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
  
  // Сохраняем текущее выбранное значение
  const currentTarget = filterTargets.value;
  
  // Очищаем фильтр целевых зон
  filterTargets.innerHTML = '<option value="">Все</option>';
  
  if (!selectedGroup) {
    // Если группа не выбрана, показываем все целевые зоны
    const allTargets = [...new Set(exercises.flatMap(ex => ex.targets))];
    allTargets.forEach(target => {
      const opt = document.createElement('option');
      opt.value = target;
      opt.textContent = target;
      if (target === currentTarget) opt.selected = true;
      filterTargets.appendChild(opt);
    });
    return;
  }
  
  // Получаем целевые зоны только для выбранной группы
  const filteredExercises = exercises.filter(ex => ex.groups.includes(selectedGroup));
  const availableTargets = [...new Set(filteredExercises.flatMap(ex => ex.targets))];
  
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
  
  // Сохраняем текущее выбранное значение
  const currentGroup = filterGroups.value;
  
  // Очищаем фильтр групп
  filterGroups.innerHTML = '<option value="">Все</option>';
  
  if (!selectedTarget) {
    // Если целевая зона не выбрана, показываем все группы
    const allGroups = [...new Set(exercises.flatMap(ex => ex.groups))];
    allGroups.forEach(group => {
      const opt = document.createElement('option');
      opt.value = group;
      opt.textContent = group;
      if (group === currentGroup) opt.selected = true;
      filterGroups.appendChild(opt);
    });
    return;
  }
  
  // Получаем группы только для выбранной целевой зоны
  const filteredExercises = exercises.filter(ex => ex.targets.includes(selectedTarget));
  const availableGroups = [...new Set(filteredExercises.flatMap(ex => ex.groups))];
  
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
    container.innerHTML = '<p class="no-results">Упражнения не найдены</p>';
    return;
  }
  
  list.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <h3>${ex.name_ru || ex.name_en}</h3>
      ${ex.gif ? `<img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif" loading="lazy">` : ''}
      <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
      <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
      <button class="btn details-btn">Подробнее</button>
    `;
    
    const detailsBtn = card.querySelector('.details-btn');
    if (detailsBtn) {
      detailsBtn.onclick = () => showDetails(ex);
    }
    
    container.appendChild(card);
  });
}

function applyFilters() {
  let list = [...exercises];
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  
  if (search) {
    list = list.filter(ex => 
      (ex.name_ru && ex.name_ru.toLowerCase().includes(search)) || 
      (ex.name_en && ex.name_en.toLowerCase().includes(search))
    );
  }
  
  const gr = filterGroups ? filterGroups.value : '';
  if (gr) list = list.filter(ex => ex.groups.includes(gr));
  
  const tg = filterTargets ? filterTargets.value : '';
  if (tg) list = list.filter(ex => ex.targets.includes(tg));
  
  const tp = filterType ? filterType.value : '';
  if (tp) list = list.filter(ex => ex.type === tp);
  
  const eq = filterEquipment ? filterEquipment.value : '';
  if (eq) list = list.filter(ex => ex.equipment.includes(eq));
  
  renderExercises(list);
}

function showDetails(ex) {
  if (!modalContent || !modalBack) return;
  
  modalContent.innerHTML = `
    <h2>${ex.name_ru || ex.name_en}</h2>
    ${ex.gif ? `<img src="${ex.gif}" alt="${ex.name_en}" class="modal-gif">` : ''}
    <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
    <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
    <p><b>Тип:</b> ${ex.type || 'Не указан'}</p>
    <p><b>Оборудование:</b> ${ex.equipment.join(', ')}</p>
  `;
  modalBack.style.display = 'flex';
}

// Обработчики событий
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

// Добавляем обработчики для всех фильтров
const filterElements = [filterGroups, filterTargets, filterType, filterEquipment];
filterElements.forEach(filter => {
  if (filter) {
    filter.addEventListener('change', applyFilters);
  }
});

if (searchInput) {
  searchInput.addEventListener('input', debounce(applyFilters, 300));
}

// Загружаем упражнения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  loadExercises();
});