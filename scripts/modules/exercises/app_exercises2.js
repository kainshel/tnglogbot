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

// Кэшируем DOM элементы для производительности
const domElements = {
  container: document.getElementById('exercises-container'),
  filterGroups: document.getElementById('filter-groups'),
  filterTargets: document.getElementById('filter-targets'),
  filterType: document.getElementById('filter-type'),
  filterEquipment: document.getElementById('filter-equipment'),
  searchInput: document.getElementById('exSearch'),
  modalBack: document.getElementById('modalBack'),
  modalContent: document.getElementById('modalContent'),
  modalClose: document.getElementById('modalClose')
};

let exercises = [];
let currentFilters = {
  search: '',
  group: '',
  target: '',
  type: '',
  equipment: ''
};

// Функция для безопасного создания изображения с обработкой ошибок
function createExerciseImage(gifSrc, altText, className = 'exercise-gif') {
  const img = document.createElement('img');
  img.src = gifSrc;
  img.alt = altText || 'Демонстрация упражнения';
  img.className = className;
  img.loading = 'lazy';
  
  img.onerror = function() {
    console.warn(`Не удалось загрузить изображение: ${gifSrc}`);
    img.style.display = 'none';
    
    // Создаем placeholder вместо сломанного изображения
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = '📷<br>Изображение<br>недоступно';
    img.parentNode.insertBefore(placeholder, img);
    img.remove();
  };
  
  return img;
}

// Функция для показа сообщений об ошибках
function showErrorMessage(message, isRetryable = true) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <p>${message}</p>
    ${isRetryable ? '<button onclick="location.reload()" class="btn retry-btn">Обновить страницу</button>' : ''}
  `;
  
  const content = document.querySelector('.content');
  if (content) {
    // Удаляем старые сообщения об ошибках
    const oldError = content.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    content.insertBefore(errorDiv, content.firstChild);
  }
}

// Функция для показа индикатора загрузки
function showLoadingIndicator() {
  if (!domElements.container) return;
  
  domElements.container.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Загрузка упражнений...</p>
    </div>
  `;
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

// Основная функция загрузки упражнений
async function loadExercises() {
  try {
    showLoadingIndicator();
    
    const res = await fetch('data/exercises.json', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!res.ok) {
      throw new Error(`Ошибка HTTP! Статус: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Получен пустой или некорректный массив упражнений');
    }
    
    exercises = data;
    normalizeData();
    fillFilters();
    renderExercises(exercises);
    
    return exercises;
    
  } catch (error) {
    console.error('Ошибка загрузки упражнений:', error);
    
    let errorMessage = 'Не удалось загрузить упражнения. ';
    
    if (error.message.includes('HTTP')) {
      errorMessage += 'Проблема с сетью или файлом данных.';
    } else if (error.message.includes('пустой')) {
      errorMessage += 'Файл с упражнениями пуст.';
    } else {
      errorMessage += 'Попробуйте обновить страницу.';
    }
    
    showErrorMessage(errorMessage);
    return [];
  }
}

// Нормализация и очистка данных
function normalizeData() {
  exercises = exercises
    .filter(ex => ex && ex.id) // Удаляем пустые элементы
    .map(ex => ({
      ...ex,
      name_ru: ex.name_ru?.trim() || ex.name_en || 'Без названия',
      name_en: ex.name_en?.trim() || ex.name_ru || 'No name',
      type: ex.type?.trim() || 'Не указан',
      groups: Array.isArray(ex.groups) ? ex.groups.filter(Boolean) : [],
      targets: Array.isArray(ex.targets) ? ex.targets.filter(Boolean) : [],
      equipment: Array.isArray(ex.equipment) ? ex.equipment.filter(Boolean) : [],
      gif: ex.gif ? ex.gif.replace(/ /g, '%20').replace(/\\/g, '/') : null
    }))
    // Удаляем дубликаты по id
    .filter((ex, index, self) => 
      index === self.findIndex(e => e.id === ex.id)
    )
    // Сортируем по русскому названию
    .sort((a, b) => a.name_ru.localeCompare(b.name_ru));
}

// Заполнение фильтров
function fillFilters() {
  // Очищаем фильтры
  [domElements.filterGroups, domElements.filterTargets, domElements.filterType, domElements.filterEquipment].forEach(filter => {
    if (filter) filter.innerHTML = '<option value="">Все</option>';
  });
  
  // Заполняем группы мышц
  const groups = [...new Set(exercises.flatMap(ex => ex.groups))].sort();
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    if (domElements.filterGroups) domElements.filterGroups.appendChild(opt);
  });
  
  // Заполняем целевые зоны
  const targets = [...new Set(exercises.flatMap(ex => ex.targets))].sort();
  targets.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (domElements.filterTargets) domElements.filterTargets.appendChild(opt);
  });
  
  // Заполняем типы упражнений
  const types = [...new Set(exercises.map(ex => ex.type))].sort();
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    if (domElements.filterType) domElements.filterType.appendChild(opt);
  });
  
  // Заполняем оборудование
  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))].sort();
  equipments.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    if (domElements.filterEquipment) domElements.filterEquipment.appendChild(opt);
  });
  
  // Настраиваем зависимые фильтры
  setupDependentFilters();
}

// Настройка зависимых фильтров
function setupDependentFilters() {
  if (!domElements.filterGroups || !domElements.filterTargets) return;
  
  // Удаляем старые обработчики
  domElements.filterGroups.onchange = null;
  domElements.filterTargets.onchange = null;
  
  domElements.filterGroups.addEventListener('change', function() {
    updateTargetsFilter(this.value);
    applyFilters();
  });
  
  domElements.filterTargets.addEventListener('change', function() {
    updateGroupsFilter(this.value);
    applyFilters();
  });
}

// Обновление фильтра целевых зон на основе выбранной группы
function updateTargetsFilter(selectedGroup) {
  if (!domElements.filterTargets) return;
  
  const currentTarget = domElements.filterTargets.value;
  domElements.filterTargets.innerHTML = '<option value="">Все</option>';
  
  if (!selectedGroup) {
    const allTargets = [...new Set(exercises.flatMap(ex => ex.targets))].sort();
    allTargets.forEach(target => {
      const opt = document.createElement('option');
      opt.value = target;
      opt.textContent = target;
      if (target === currentTarget) opt.selected = true;
      domElements.filterTargets.appendChild(opt);
    });
    return;
  }
  
  const filteredExercises = exercises.filter(ex => ex.groups.includes(selectedGroup));
  const availableTargets = [...new Set(filteredExercises.flatMap(ex => ex.targets))].sort();
  
  availableTargets.forEach(target => {
    const opt = document.createElement('option');
    opt.value = target;
    opt.textContent = target;
    if (target === currentTarget && availableTargets.includes(currentTarget)) {
      opt.selected = true;
    }
    domElements.filterTargets.appendChild(opt);
  });
}

// Обновление фильтра групп на основе выбранной целевой зоны
function updateGroupsFilter(selectedTarget) {
  if (!domElements.filterGroups) return;
  
  const currentGroup = domElements.filterGroups.value;
  domElements.filterGroups.innerHTML = '<option value="">Все</option>';
  
  if (!selectedTarget) {
    const allGroups = [...new Set(exercises.flatMap(ex => ex.groups))].sort();
    allGroups.forEach(group => {
      const opt = document.createElement('option');
      opt.value = group;
      opt.textContent = group;
      if (group === currentGroup) opt.selected = true;
      domElements.filterGroups.appendChild(opt);
    });
    return;
  }
  
  const filteredExercises = exercises.filter(ex => ex.targets.includes(selectedTarget));
  const availableGroups = [...new Set(filteredExercises.flatMap(ex => ex.groups))].sort();
  
  availableGroups.forEach(group => {
    const opt = document.createElement('option');
    opt.value = group;
    opt.textContent = group;
    if (group === currentGroup && availableGroups.includes(currentGroup)) {
      opt.selected = true;
    }
    domElements.filterGroups.appendChild(opt);
  });
}

// Создание карточки упражнения
function createExerciseCard(ex) {
  const card = document.createElement('div');
  card.className = 'exercise-card';
  card.setAttribute('data-id', ex.id);
  
  const safeJoin = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : 'Не указано';
  
  card.innerHTML = `
    <h3>${ex.name_ru}</h3>
    ${ex.gif ? '' : '<div class="image-placeholder">📷<br>Изображение<br>недоступно</div>'}
    <p><b>Группы:</b> ${safeJoin(ex.groups)}</p>
    <p><b>Цели:</b> ${safeJoin(ex.targets)}</p>
    <button class="btn details-btn">Подробнее</button>
  `;
  
  // Добавляем изображение если есть
  if (ex.gif) {
    const imgContainer = card.querySelector('h3').nextSibling;
    const img = createExerciseImage(ex.gif, ex.name_en);
    card.insertBefore(img, imgContainer);
  }
  
  // Обработчик для кнопки "Подробнее"
  const detailsBtn = card.querySelector('.details-btn');
  if (detailsBtn) {
    detailsBtn.onclick = () => showDetails(ex);
  }
  
  return card;
}

// Рендеринг списка упражнений
function renderExercises(list) {
  if (!domElements.container) return;
  
  requestAnimationFrame(() => {
    domElements.container.innerHTML = '';
    
    if (!list || list.length === 0) {
      domElements.container.innerHTML = `
        <div class="no-results">
          <p>Упражнения не найдены</p>
          <p class="no-results-hint">Попробуйте изменить параметры фильтрации</p>
          <button class="btn reset-filters-btn" onclick="resetFilters()">Сбросить фильтры</button>
        </div>
      `;
      return;
    }
    
    const fragment = document.createDocumentFragment();
    const countInfo = document.createElement('div');
    countInfo.className = 'results-count';
    countInfo.textContent = `Найдено упражнений: ${list.length}`;
    fragment.appendChild(countInfo);
    
    list.forEach(ex => {
      const card = createExerciseCard(ex);
      fragment.appendChild(card);
    });
    
    domElements.container.appendChild(fragment);
  });
}

// Применение фильтров
function applyFilters() {
  if (!exercises.length) return;
  
  // Обновляем текущие фильтры
  currentFilters = {
    search: domElements.searchInput ? domElements.searchInput.value.trim().toLowerCase() : '',
    group: domElements.filterGroups ? domElements.filterGroups.value : '',
    target: domElements.filterTargets ? domElements.filterTargets.value : '',
    type: domElements.filterType ? domElements.filterType.value : '',
    equipment: domElements.filterEquipment ? domElements.filterEquipment.value : ''
  };
  
  let filteredExercises = exercises.filter(ex => {
    // Поиск по названию
    if (currentFilters.search) {
      const searchTerm = currentFilters.search;
      const matchesSearch = 
        (ex.name_ru && ex.name_ru.toLowerCase().includes(searchTerm)) || 
        (ex.name_en && ex.name_en.toLowerCase().includes(searchTerm)) ||
        (ex.groups.some(group => group.toLowerCase().includes(searchTerm))) ||
        (ex.targets.some(target => target.toLowerCase().includes(searchTerm)));
      
      if (!matchesSearch) return false;
    }
    
    // Фильтр по группе мышц
    if (currentFilters.group && !ex.groups.includes(currentFilters.group)) {
      return false;
    }
    
    // Фильтр по целевой зоне
    if (currentFilters.target && !ex.targets.includes(currentFilters.target)) {
      return false;
    }
    
    // Фильтр по типу
    if (currentFilters.type && ex.type !== currentFilters.type) {
      return false;
    }
    
    // Фильтр по оборудованию
    if (currentFilters.equipment && !ex.equipment.includes(currentFilters.equipment)) {
      return false;
    }
    
    return true;
  });
  
  renderExercises(filteredExercises);
}

// Показ детальной информации
function showDetails(ex) {
  if (!domElements.modalContent || !domElements.modalBack) return;
  
  const safeJoin = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : 'Не указано';
  
  domElements.modalContent.innerHTML = `
    <div class="modal-header">
      <h2>${ex.name_ru}</h2>
      ${ex.name_en && ex.name_en !== ex.name_ru ? `<p class="exercise-name-en">${ex.name_en}</p>` : ''}
    </div>
    
    <div class="modal-body">
      ${ex.gif ? createExerciseImage(ex.gif, ex.name_en, 'modal-gif').outerHTML : '<div class="image-placeholder large">📷<br>Изображение<br>недоступно</div>'}
      
      <div class="exercise-details">
        <div class="detail-item">
          <strong>Группы мышц:</strong>
          <span>${safeJoin(ex.groups)}</span>
        </div>
        <div class="detail-item">
          <strong>Целевые зоны:</strong>
          <span>${safeJoin(ex.targets)}</span>
        </div>
        <div class="detail-item">
          <strong>Тип упражнения:</strong>
          <span>${ex.type}</span>
        </div>
        <div class="detail-item">
          <strong>Оборудование:</strong>
          <span>${safeJoin(ex.equipment)}</span>
        </div>
        ${ex.id ? `<div class="detail-item">
          <strong>ID:</strong>
          <span>${ex.id}</span>
        </div>` : ''}
      </div>
    </div>
  `;
  
  domElements.modalBack.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
}

// Сброс всех фильтров
function resetFilters() {
  if (domElements.searchInput) domElements.searchInput.value = '';
  if (domElements.filterGroups) domElements.filterGroups.value = '';
  if (domElements.filterTargets) domElements.filterTargets.value = '';
  if (domElements.filterType) domElements.filterType.value = '';
  if (domElements.filterEquipment) domElements.filterEquipment.value = '';
  
  currentFilters = {
    search: '',
    group: '',
    target: '',
    type: '',
    equipment: ''
  };
  
  applyFilters();
}

// Добавление кнопки сброса фильтров
function addResetFiltersButton() {
  const filtersSection = document.querySelector('.filters');
  if (!filtersSection) return;
  
  // Проверяем, не добавлена ли уже кнопка
  if (filtersSection.querySelector('.reset-filters-btn')) return;
  
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn reset-filters-btn';
  resetBtn.textContent = 'Сбросить фильтры';
  resetBtn.onclick = resetFilters;
  
  filtersSection.appendChild(resetBtn);
}

// Обработчики событий
function setupEventListeners() {
  // Закрытие модального окна
  if (domElements.modalClose) {
    domElements.modalClose.onclick = () => {
      if (domElements.modalBack) {
        domElements.modalBack.style.display = 'none';
        document.body.style.overflow = ''; // Восстанавливаем скролл
      }
    };
  }
  
  // Закрытие модального окна по клику на фон
  if (domElements.modalBack) {
    domElements.modalBack.onclick = (e) => { 
      if (e.target === domElements.modalBack) {
        domElements.modalBack.style.display = 'none';
        document.body.style.overflow = '';
      }
    };
  }
  
  // Закрытие модального окна по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && domElements.modalBack && domElements.modalBack.style.display === 'flex') {
      domElements.modalBack.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Обработчики для фильтров
  const filterElements = [domElements.filterGroups, domElements.filterTargets, domElements.filterType, domElements.filterEquipment];
  filterElements.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', applyFilters);
    }
  });
  
  // Поиск с debounce
  if (domElements.searchInput) {
    domElements.searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Очистка поиска по крестику (если браузер поддерживает)
    domElements.searchInput.addEventListener('search', applyFilters);
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  addResetFiltersButton();
  loadExercises();
});

// Экспортируем функции для глобального использования
window.resetFilters = resetFilters;
window.showDetails = showDetails;
// ---- Дополнительные функции для улучшения UX ----

// Сохранение состояния фильтров в localStorage
function saveFilterState() {
  try {
    localStorage.setItem('exerciseFilters', JSON.stringify(currentFilters));
    localStorage.setItem('exerciseFiltersTimestamp', Date.now().toString());
  } catch (e) {
    console.warn('Не удалось сохранить состояние фильтров:', e);
  }
}

// Восстановление состояния фильтров из localStorage
function restoreFilterState() {
  try {
    const savedFilters = localStorage.getItem('exerciseFilters');
    const timestamp = localStorage.getItem('exerciseFiltersTimestamp');
    
    // Очищаем сохраненные фильтры через 1 час
    if (timestamp && Date.now() - parseInt(timestamp) > 3600000) {
      localStorage.removeItem('exerciseFilters');
      localStorage.removeItem('exerciseFiltersTimestamp');
      return;
    }
    
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      currentFilters = filters;
      
      // Восстанавливаем значения в полях
      if (domElements.searchInput && filters.search) {
        domElements.searchInput.value = filters.search;
      }
      if (domElements.filterGroups && filters.group) {
        domElements.filterGroups.value = filters.group;
        updateTargetsFilter(filters.group);
      }
      if (domElements.filterTargets && filters.target) {
        domElements.filterTargets.value = filters.target;
        updateGroupsFilter(filters.target);
      }
      if (domElements.filterType && filters.type) {
        domElements.filterType.value = filters.type;
      }
      if (domElements.filterEquipment && filters.equipment) {
        domElements.filterEquipment.value = filters.equipment;
      }
    }
  } catch (e) {
    console.warn('Не удалось восстановить состояние фильтров:', e);
  }
}

// Обновляем applyFilters для сохранения состояния
const originalApplyFilters = applyFilters;
applyFilters = function() {
  originalApplyFilters();
  saveFilterState();
};

// Быстрый поиск по популярным группам мышц
function addQuickFilters() {
  const quickFiltersContainer = document.createElement('div');
  quickFiltersContainer.className = 'quick-filters';
  
  const popularGroups = ['Грудь', 'Спина', 'Плечи', 'Ноги', 'Пресс', 'Руки'];
  
  quickFiltersContainer.innerHTML = `
    <div class="quick-filters-header">
      <span>Быстрый выбор:</span>
    </div>
    <div class="quick-filters-buttons">
      ${popularGroups.map(group => `
        <button type="button" class="btn quick-filter-btn" data-group="${group}">
          ${group}
        </button>
      `).join('')}
      <button type="button" class="btn quick-filter-btn" data-action="favorites">
        ★ Избранное
      </button>
    </div>
  `;
  
  const content = document.querySelector('.content');
  const filtersSection = content.querySelector('.filters');
  content.insertBefore(quickFiltersContainer, filtersSection.nextSibling);
  
  // Обработчики для быстрых фильтров
  quickFiltersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-filter-btn');
    if (!btn) return;
    
    if (btn.dataset.group) {
      // Фильтр по группе мышц
      if (domElements.filterGroups) {
        domElements.filterGroups.value = btn.dataset.group;
        updateTargetsFilter(btn.dataset.group);
        applyFilters();
        
        // Прокрутка к результатам
        domElements.container.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (btn.dataset.action === 'favorites') {
      showFavorites();
    }
  });
}

// Система избранных упражнений
function setupFavoritesSystem() {
  // Инициализируем хранилище избранного
  if (!localStorage.getItem('favoriteExercises')) {
    localStorage.setItem('favoriteExercises', JSON.stringify([]));
  }
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favoriteExercises')) || [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(exerciseId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(exerciseId);
  
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(exerciseId);
  }
  
  localStorage.setItem('favoriteExercises', JSON.stringify(favorites));
  updateFavoriteButtons();
  return index === -1; // Возвращает true если добавлено в избранное
}

function updateFavoriteButtons() {
  const favorites = getFavorites();
  const favoriteBtns = document.querySelectorAll('.favorite-btn');
  
  favoriteBtns.forEach(btn => {
    const exerciseId = parseInt(btn.dataset.exerciseId);
    if (favorites.includes(exerciseId)) {
      btn.classList.add('favorited');
      btn.innerHTML = '★ В избранном';
    } else {
      btn.classList.remove('favorited');
      btn.innerHTML = '☆ В избранное';
    }
  });
}

function showFavorites() {
  const favorites = getFavorites();
  const favoriteExercises = exercises.filter(ex => favorites.includes(ex.id));
  
  if (favoriteExercises.length === 0) {
    renderExercises([]);
    // Показываем специальное сообщение для пустых избранных
    if (domElements.container) {
      domElements.container.innerHTML = `
        <div class="no-results">
          <p>В избранном пока нет упражнений</p>
          <p class="no-results-hint">Добавляйте упражнения в избранное, нажимая на звездочку в карточке</p>
          <button class="btn reset-filters-btn" onclick="resetFilters()">Показать все упражнения</button>
        </div>
      `;
    }
  } else {
    renderExercises(favoriteExercises);
  }
}

// Обновляем createExerciseCard для добавления кнопки избранного
const originalCreateExerciseCard = createExerciseCard;
createExerciseCard = function(ex) {
  const card = originalCreateExerciseCard(ex);
  
  // Добавляем кнопку избранного
  const detailsBtn = card.querySelector('.details-btn');
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'btn favorite-btn';
  favoriteBtn.dataset.exerciseId = ex.id;
  favoriteBtn.innerHTML = '☆ В избранное';
  
  favoriteBtn.onclick = (e) => {
    e.stopPropagation();
    const added = toggleFavorite(ex.id);
    
    // Визуальный фидбэк
    if (added) {
      favoriteBtn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        favoriteBtn.style.transform = 'scale(1)';
      }, 200);
    }
  };
  
  detailsBtn.parentNode.insertBefore(favoriteBtn, detailsBtn);
  
  return card;
};

// Обновляем showDetails для добавления избранного в модалку
const originalShowDetails = showDetails;
showDetails = function(ex) {
  originalShowDetails(ex);
  
  // Добавляем кнопку избранного в модальное окно
  const modalBody = domElements.modalContent.querySelector('.modal-body');
  const favoriteBtn = document.createElement('button');
  favoriteBtn.className = 'btn favorite-btn large';
  favoriteBtn.dataset.exerciseId = ex.id;
  favoriteBtn.innerHTML = '☆ Добавить в избранное';
  
  favoriteBtn.onclick = () => {
    const added = toggleFavorite(ex.id);
    if (added) {
      favoriteBtn.innerHTML = '★ В избранном';
    }
  };
  
  modalBody.appendChild(favoriteBtn);
  updateFavoriteButtons();
};

// Поиск с автодополнением
function setupSearchAutocomplete() {
  if (!domElements.searchInput) return;
  
  const autocompleteList = document.createElement('div');
  autocompleteList.className = 'autocomplete-list';
  domElements.searchInput.parentNode.appendChild(autocompleteList);
  
  domElements.searchInput.addEventListener('input', function() {
    const value = this.value.trim().toLowerCase();
    autocompleteList.innerHTML = '';
    
    if (value.length < 2) {
      autocompleteList.style.display = 'none';
      return;
    }
    
    // Ищем совпадения в названиях и группах мышц
    const suggestions = [];
    
    exercises.forEach(ex => {
      if (ex.name_ru.toLowerCase().includes(value)) {
        suggestions.push({
          text: ex.name_ru,
          type: 'Упражнение',
          group: ex.groups[0]
        });
      }
    });
    
    // Добавляем группы мышц
    const uniqueGroups = [...new Set(exercises.flatMap(ex => ex.groups))];
    uniqueGroups.forEach(group => {
      if (group.toLowerCase().includes(value)) {
        suggestions.push({
          text: group,
          type: 'Группа мышц'
        });
      }
    });
    
    // Ограничиваем количество suggestions
    const limitedSuggestions = suggestions.slice(0, 8);
    
    if (limitedSuggestions.length > 0) {
      limitedSuggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.innerHTML = `
          <strong>${suggestion.text}</strong>
          <span class="autocomplete-type">${suggestion.type}</span>
          ${suggestion.group ? `<span class="autocomplete-group">${suggestion.group}</span>` : ''}
        `;
        
        item.onclick = () => {
          domElements.searchInput.value = suggestion.text;
          autocompleteList.style.display = 'none';
          applyFilters();
        };
        
        autocompleteList.appendChild(item);
      });
      
      autocompleteList.style.display = 'block';
    } else {
      autocompleteList.style.display = 'none';
    }
  });
  
  // Скрываем autocomplete при клике вне
  document.addEventListener('click', (e) => {
    if (!domElements.searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
      autocompleteList.style.display = 'none';
    }
  });
}

// Аналитика использования (анонимная)
function trackExerciseView(exerciseId) {
  try {
    const stats = JSON.parse(localStorage.getItem('exerciseStats')) || {};
    stats[exerciseId] = (stats[exerciseId] || 0) + 1;
    localStorage.setItem('exerciseStats', JSON.stringify(stats));
  } catch (e) {
    console.warn('Не удалось сохранить статистику:', e);
  }
}

// Обновляем showDetails для трекинга
const originalShowDetailsWithTracking = showDetails;
showDetails = function(ex) {
  originalShowDetailsWithTracking(ex);
  trackExerciseView(ex.id);
};

// Сортировка результатов
function addSorting() {
  const filtersSection = document.querySelector('.filters');
  if (!filtersSection) return;
  
  const sortSelect = document.createElement('select');
  sortSelect.className = 'sort-select';
  sortSelect.innerHTML = `
    <option value="name">По названию (А-Я)</option>
    <option value="name-desc">По названию (Я-А)</option>
    <option value="popular">По популярности</option>
    <option value="group">По группе мышц</option>
  `;
  
  sortSelect.addEventListener('change', function() {
    sortExercises(this.value);
  });
  
  filtersSection.appendChild(sortSelect);
}

function sortExercises(sortBy) {
  let sortedExercises = [...exercises];
  
  switch (sortBy) {
    case 'name':
      sortedExercises.sort((a, b) => a.name_ru.localeCompare(b.name_ru));
      break;
    case 'name-desc':
      sortedExercises.sort((a, b) => b.name_ru.localeCompare(a.name_ru));
      break;
    case 'group':
      sortedExercises.sort((a, b) => {
        const groupA = a.groups[0] || '';
        const groupB = b.groups[0] || '';
        return groupA.localeCompare(groupB) || a.name_ru.localeCompare(b.name_ru);
      });
      break;
    case 'popular':
      try {
        const stats = JSON.parse(localStorage.getItem('exerciseStats')) || {};
        sortedExercises.sort((a, b) => {
          const viewsA = stats[a.id] || 0;
          const viewsB = stats[b.id] || 0;
          return viewsB - viewsA;
        });
      } catch (e) {
        console.warn('Не удалось отсортировать по популярности:', e);
      }
      break;
  }
  
  renderExercises(sortedExercises);
}

// Предзагрузка изображений для улучшения производительности
function preloadImages() {
  if (!exercises.length) return;
  
  // Предзагружаем только первые 10 изображений
  const imagesToPreload = exercises.slice(0, 10).filter(ex => ex.gif);
  
  imagesToPreload.forEach(ex => {
    const img = new Image();
    img.src = ex.gif;
  });
}

// Lazy loading для изображений
function setupLazyLoading() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  // Обновляем createExerciseImage для поддержки lazy loading
  const originalCreateExerciseImage = createExerciseImage;
  window.createExerciseImage = function(gifSrc, altText, className = 'exercise-gif') {
    const img = originalCreateExerciseImage(gifSrc, altText, className);
    img.dataset.src = gifSrc;
    img.src = ''; // Очищаем src
    
    observer.observe(img);
    return img;
  };
}

// Обновляем инициализацию
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  addResetFiltersButton();
  addQuickFilters();
  addSorting();
  setupFavoritesSystem();
  setupSearchAutocomplete();
  restoreFilterState();
  setupLazyLoading();
  
  loadExercises().then(() => {
    preloadImages();
    updateFavoriteButtons();
  });
});

// Глобальные функции
window.showFavorites = showFavorites;
window.toggleFavorite = toggleFavorite;

// Обработка ошибок для изображений в модальном окне
const originalCreateExerciseImage = createExerciseImage;
window.createExerciseImage = function(gifSrc, altText, className = 'exercise-gif') {
  const img = originalCreateExerciseImage(gifSrc, altText, className);
  
  // Дополнительная обработка для модальных изображений
  if (className === 'modal-gif') {
    img.onerror = function() {
      console.warn(`Не удалось загрузить изображение для модального окна: ${gifSrc}`);
      const placeholder = this.parentNode.querySelector('.image-placeholder');
      if (!placeholder) {
        const newPlaceholder = document.createElement('div');
        newPlaceholder.className = 'image-placeholder large';
        newPlaceholder.innerHTML = '📷<br>Изображение<br>недоступно';
        this.parentNode.insertBefore(newPlaceholder, this);
      }
      this.style.display = 'none';
    };
  }
  
  return img;
};

console.log('Exercise module loaded with enhanced features');