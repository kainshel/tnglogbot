// ---- Безопасная «заплатка» для localStorage ----
(function () {
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    localStorage.setItem = (k, v) => { try { return _set(k, v); } catch (e) { console.error(e); } };
    localStorage.getItem = (k) => { try { return _get(k); } catch (e) { console.error(e); return null; } };
  } catch (e) { /* ignore */ }
})();

// === Централизованный менеджер состояния ===
const workoutState = {
  exercises: [],
  plan: [],
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  
  updatePlan(newPlan) {
    this.plan = newPlan;
    renderPlan();
  },
  
  updateCurrentExercise(index) {
    this.currentExerciseIndex = index;
    this.currentSetIndex = 0;
  },
  
  reset() {
    this.plan = [];
    this.currentExerciseIndex = 0;
    this.currentSetIndex = 0;
    renderPlan();
  },
  
  addExercise(ex) {
    const EX = { 
      meta: ex, 
      sets: [{ weight: null, reps: null }] 
    };
    this.plan.push(EX);
    renderPlan();
    
    // Прокрутка к добавленному упражнению
    const lastExercise = planContainer.lastElementChild;
    if (lastExercise) {
      lastExercise.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },
  
  removeExercise(index) {
    this.plan.splice(index, 1);
    if (index <= this.currentExerciseIndex) {
      this.currentExerciseIndex = Math.max(0, this.currentExerciseIndex - 1);
      this.currentSetIndex = 0;
    }
    renderPlan();
  }
};

// === Глобальные переменные ===
const searchInput = document.getElementById("search");
const filterGroups = document.getElementById("filter-groups");
const filterTargets = document.getElementById("filter-targets");
const filterType = document.getElementById("filter-type");
const filterEquipment = document.getElementById("filter-equipment");

const exercisesContainer = document.getElementById("exercises-container");
const planContainer = document.getElementById("plan");
const dateInput = document.getElementById("date");
const saveBtn = document.getElementById("saveBtn") || document.getElementById("saveWorkoutBtn");

// Модальное окно
const modalBack = document.getElementById("modalBack");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

// === Вспомогательные функции ===
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

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
}

function showModal(html) {
  if (modalBack && modalContent) {
    modalContent.innerHTML = html;
    modalBack.style.display = "flex";
  } else {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    alert(tmp.textContent || tmp.innerText || '');
  }
}

function hideModal() { 
  if (modalBack) modalBack.style.display = "none"; 
}

// Инициализация модального окна
if (modalClose) modalClose.addEventListener("click", hideModal);
if (modalBack) modalBack.addEventListener("click", e => { 
  if (e.target === modalBack) hideModal(); 
});

// === Обработчик ошибок ===
const ErrorHandler = {
  showError(message, isFatal = false) {
    const errorDiv = document.createElement('div');
    errorDiv.className = `error-message ${isFatal ? 'fatal' : ''}`;
    errorDiv.innerHTML = `
      <p>${message}</p>
      ${isFatal ? '<button onclick="location.reload()">Обновить страницу</button>' : ''}
    `;
    
    const content = document.querySelector('.content');
    if (content) {
      content.insertBefore(errorDiv, content.firstChild);
    }
    
    if (!isFatal) {
      setTimeout(() => errorDiv.remove(), 5000);
    }
  },
  
  handleAPIError(error, context) {
    console.error(`Ошибка в ${context}:`, error);
    this.showError(`Ошибка ${context}: ${error.message}`, context === 'loadExercises');
  }
};

// === Улучшенная валидация ввода ===
function validateNumberInput(inputElement, options = {}) {
  const { isFloat = false, min = 0, max = null } = options;
  let value = inputElement.value;
  
  // Очистка
  value = value.replace(isFloat ? /[^\d.]/g : /[^\d]/g, '');
  
  // Для дробных чисел
  if (isFloat) {
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
  }
  
  // Приведение к числу и проверка диапазона
  let numValue = isFloat ? parseFloat(value) : parseInt(value, 10);
  
  if (!isNaN(numValue)) {
    if (numValue < min) numValue = min;
    if (max !== null && numValue > max) numValue = max;
    value = numValue.toString();
  }
  
  inputElement.value = value;
  return value;
}

function handleWeightInput(input, set) {
  const value = validateNumberInput(input, { isFloat: true, min: 0 });
  set.weight = value ? parseFloat(value) : null;
}

function handleRepsInput(input, set) {
  const value = validateNumberInput(input, { min: 0 });
  set.reps = value ? parseInt(value, 10) : null;
}

function handleCompleteSet(exerciseIndex, setIndex, EX) {
  const s = EX.sets[setIndex];
  
  if (!s.weight || !s.reps) {
    alert("Заполните вес и количество повторений!");
    return false;
  }
  
  if (workoutState.currentSetIndex < EX.sets.length - 1) {
    workoutState.currentSetIndex++;
  } else {
    workoutState.currentSetIndex = 0;
    if (workoutState.currentExerciseIndex < workoutState.plan.length - 1) {
      workoutState.currentExerciseIndex++;
    } else {
      alert("🎉 Тренировка завершена! Сохраните результаты.");
    }
  }
  return true;
}

function handleRemoveSet(EX, setIndex, exerciseIndex) {
  if (!confirm("Удалить этот подход?")) return;
  
  EX.sets.splice(setIndex, 1);
  
  if (EX.sets.length === 0) {
    workoutState.removeExercise(exerciseIndex);
  } else {
    renderPlan();
  }
}

// === Загрузка базы упражнений ===
async function loadExercises() {
  try {
    exercisesContainer.innerHTML = '<div class="loading">🔄 Загрузка упражнений...</div>';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch('data/exercises.json', { 
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    workoutState.exercises = await res.json();
    
    if (!workoutState.exercises || workoutState.exercises.length === 0) {
      throw new Error('Получен пустой массив упражнений');
    }
    
    normalizeData();
    fillFilters();
    renderExercises(workoutState.exercises);
    
    return workoutState.exercises;
    
  } catch (e) {
    ErrorHandler.handleAPIError(e, 'loadExercises');
    return [];
  }
}

function normalizeData() {
  workoutState.exercises = workoutState.exercises.map(ex => ({
    ...ex,
    groups: Array.isArray(ex.groups) ? ex.groups : (ex.groups ? [ex.groups] : []),
    targets: Array.isArray(ex.targets) ? ex.targets : (ex.targets ? [ex.targets] : []),
    equipment: Array.isArray(ex.equipment) ? ex.equipment : (ex.equipment ? [ex.equipment] : []),
  }));
}

// === Оптимизированные фильтры ===
const filterData = {
  groups: new Set(),
  targets: new Set(),
  types: new Set(),
  equipment: new Set()
};

function fillFilters() {
  // Очистка фильтров
  [filterGroups, filterTargets, filterType, filterEquipment].forEach(filter => {
    filter.innerHTML = '<option value="">Все</option>';
  });
  
  // Заполнение данными
  workoutState.exercises.forEach(ex => {
    ex.groups.forEach(g => filterData.groups.add(g));
    ex.targets.forEach(t => filterData.targets.add(t));
    filterData.types.add(ex.type);
    ex.equipment.forEach(e => filterData.equipment.add(e));
  });
  
  // Заполнение выпадающих списков
  fillSelect(filterGroups, filterData.groups);
  fillSelect(filterTargets, filterData.targets);
  fillSelect(filterType, filterData.types);
  fillSelect(filterEquipment, filterData.equipment);
  
  setupDependentFilters();
}

function fillSelect(selectElement, dataSet) {
  Array.from(dataSet).sort().forEach(value => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    selectElement.appendChild(opt);
  });
}

function setupDependentFilters() {
  filterGroups.onchange = null;
  filterTargets.onchange = null;
  
  filterGroups.addEventListener('change', function() {
    updateTargetsFilter(this.value);
    applyFilters();
  });
  
  filterTargets.addEventListener('change', function() {
    updateGroupsFilter(this.value);
    applyFilters();
  });
}

function updateTargetsFilter(selectedGroup) {
  const currentTarget = filterTargets.value;
  filterTargets.innerHTML = '<option value="">Все</option>';
  
  if (!selectedGroup) {
    fillSelect(filterTargets, filterData.targets);
    if (currentTarget && filterData.targets.has(currentTarget)) {
      filterTargets.value = currentTarget;
    }
    return;
  }
  
  const filteredExercises = workoutState.exercises.filter(ex => ex.groups.includes(selectedGroup));
  const availableTargets = new Set(filteredExercises.flatMap(ex => ex.targets));
  
  fillSelect(filterTargets, availableTargets);
  
  if (currentTarget && availableTargets.has(currentTarget)) {
    filterTargets.value = currentTarget;
  }
}

function updateGroupsFilter(selectedTarget) {
  const currentGroup = filterGroups.value;
  filterGroups.innerHTML = '<option value="">Все</option>';
  
  if (!selectedTarget) {
    fillSelect(filterGroups, filterData.groups);
    if (currentGroup && filterData.groups.has(currentGroup)) {
      filterGroups.value = currentGroup;
    }
    return;
  }
  
  const filteredExercises = workoutState.exercises.filter(ex => ex.targets.includes(selectedTarget));
  const availableGroups = new Set(filteredExercises.flatMap(ex => ex.groups));
  
  fillSelect(filterGroups, availableGroups);
  
  if (currentGroup && availableGroups.has(currentGroup)) {
    filterGroups.value = currentGroup;
  }
}

function applyFilters() {
  let list = [...workoutState.exercises];
  const search = searchInput.value.toLowerCase();
  
  if (search) {
    list = list.filter(ex =>
      (ex.name_ru || "").toLowerCase().includes(search) ||
      (ex.name_en || "").toLowerCase().includes(search)
    );
  }
  
  const gr = filterGroups.value;
  const tg = filterTargets.value;
  const tp = filterType.value;
  const eq = filterEquipment.value;
  
  if (gr) list = list.filter(ex => ex.groups.includes(gr));
  if (tg) list = list.filter(ex => ex.targets.includes(tg));
  if (tp) list = list.filter(ex => ex.type === tp);
  if (eq) list = list.filter(ex => ex.equipment.includes(eq));
  
  renderExercises(list);
}

// Инициализация обработчиков фильтров
[filterGroups, filterTargets, filterType, filterEquipment].forEach(sel => {
  sel.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", debounce(applyFilters, 300));

// === Кэширование карточек упражнений ===
const exerciseCardCache = new Map();

function createExerciseCard(ex) {
  const cacheKey = JSON.stringify(ex);
  if (exerciseCardCache.has(cacheKey)) {
    return exerciseCardCache.get(cacheKey).cloneNode(true);
  }
  
  const card = document.createElement("div");
  card.className = "exercise-card";
  
  const groups = ex.groups.join(", ");
  const targets = ex.targets.join(", ");
  const gif = ex.gif ? `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3C/svg%3E" data-src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif lazy">` : "";
  
  card.innerHTML = `
    <h3>${ex.name_ru || ex.name_en}</h3>
    ${gif}
    <p><b>Группы:</b> ${groups}</p>
    <p><b>Цели:</b> ${targets}</p>
    <div class="card-actions">
      <button class="btn add-btn" aria-label="Добавить упражнение в план">➕ В план</button>
      <button class="btn details-btn" aria-label="Подробнее об упражнении">ℹ Подробнее</button>
    </div>
  `;
  
  exerciseCardCache.set(cacheKey, card);
  return card.cloneNode(true);
}

function renderExercises(list) {
  exercisesContainer.innerHTML = "";
  
  if (list.length === 0) {
    exercisesContainer.innerHTML = '<p class="empty-plan-message">Упражнения не найдены</p>';
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  list.forEach(ex => {
    const card = createExerciseCard(ex);
    
    card.querySelector(".add-btn").addEventListener("click", () => {
      workoutState.addExercise(ex);
    });
    
    card.querySelector(".details-btn").addEventListener("click", () => showDetails(ex));
    fragment.appendChild(card);
  });
  
  exercisesContainer.appendChild(fragment);
  
  // Инициализация ленивой загрузки изображений
  initLazyLoading();
}

function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback для браузеров без IntersectionObserver
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

function showDetails(ex) {
  const meta = [
    ex.type ? "Тип: " + ex.type : "",
    ex.groups?.length ? "Группы: " + ex.groups.join(", ") : "",
    ex.targets?.length ? "Цели: " + ex.targets.join(", ") : "",
    ex.equipment?.length ? "Оборудование: " + ex.equipment.join(", ") : ""
  ].filter(Boolean).join(" • ");
  
  const img = ex.gif ? `<img src="${ex.gif}" style="max-width:100%">` : "";
  showModal(`<h2>${ex.name_ru || ex.name_en}</h2><p>${meta}</p>${img}`);
}

// === План тренировки ===
function createSetRow(EX, s, i, index) {
  const isCurrentSet = index === workoutState.currentExerciseIndex && i === workoutState.currentSetIndex;
  const isCompleted = i < workoutState.currentSetIndex && index === workoutState.currentExerciseIndex;
  
  const row = document.createElement("div");
  row.className = `set-row ${isCurrentSet ? 'current-set' : ''} ${isCompleted ? 'completed-set' : ''}`;
  
  row.innerHTML = `
    <span>#${i + 1}</span>
    <input type="number" step="0.5" min="0" placeholder="Вес, кг" value="${s.weight ?? ""}" 
           ${isCompleted ? 'readonly' : ''}>
    <input type="number" step="1" min="0" placeholder="Повторы" value="${s.reps ?? ""}"
           ${isCompleted ? 'readonly' : ''}>
    ${isCurrentSet ? 
      `<button class="btn complete-set">✅ Завершить подход</button>` : 
      `<button class="rm">×</button>`}
  `;
  
  const inputs = row.querySelectorAll('input');
  const completeBtn = row.querySelector('.complete-set');
  const rmBtn = row.querySelector('.rm');
  
  inputs[0].addEventListener("input", () => handleWeightInput(inputs[0], s));
  inputs[1].addEventListener("input", () => handleRepsInput(inputs[1], s));
  
  if (completeBtn) {
    completeBtn.addEventListener("click", () => {
      if (handleCompleteSet(index, i, EX)) {
        renderPlan();
      }
    });
  }
  
  if (rmBtn) {
    rmBtn.addEventListener("click", () => { 
      handleRemoveSet(EX, i, index);
    });
  }
  
  return row;
}

function renderSets(EX, setsEl, index) {
  setsEl.innerHTML = "";
  const setsFragment = document.createDocumentFragment();
  
  EX.sets.forEach((s, i) => {
    const row = createSetRow(EX, s, i, index);
    setsFragment.appendChild(row);
  });
  
  setsEl.appendChild(setsFragment);
}

function createExerciseCardElement(EX, index) {
  const wrap = document.createElement("div");
  wrap.className = `card plan-exercise ${index === workoutState.currentExerciseIndex ? 'active-exercise' : ''}`;
  
  wrap.innerHTML = `
    <div class="row">
      <h3>${EX.meta.name_ru || EX.meta.name_en}</h3>
      <div class="exercise-status">
        ${index < workoutState.currentExerciseIndex ? '✅ Выполнено' : 
          index === workoutState.currentExerciseIndex ? '🏋️ Выполняется' : '⏳ Ожидание'}
      </div>
      <div>
        <button class="btn add-set">+ Подход</button>
        <button class="btn danger remove-ex">✖ Удалить</button>
      </div>
    </div>
    <div class="sets"></div>
  `;
  
  return wrap;
}

function setupExerciseEventListeners(wrap, EX, index) {
  const setsEl = wrap.querySelector(".sets");
  
  wrap.querySelector(".add-set").addEventListener("click", () => {
    EX.sets.push({ weight: null, reps: null });
    renderSets(EX, setsEl, index);
  });
  
  wrap.querySelector(".remove-ex").addEventListener("click", () => {
    if (!confirm("Удалить это упражнение из плана?")) return;
    workoutState.removeExercise(index);
  });
  
  return setsEl;
}

function renderPlan() {
  planContainer.innerHTML = '';
  
  if (workoutState.plan.length === 0) {
    planContainer.innerHTML = `
      <div class="empty-plan-message">
        <p>Ваш план тренировки пуст</p>
        <p>Добавьте упражнения из списка ниже или выберите готовую программу</p>
        <button class="btn" onclick="window.location.href='programs.html'">
          📋 Выбрать программу
        </button>
        <button class="btn secondary" onclick="workoutState.reset()">
          🗑️ Очистить план
        </button>
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  // Группируем упражнения по дням (если есть информация о днях)
  const exercisesByDay = {};
  workoutState.plan.forEach((exercise, index) => {
    const dayNumber = exercise.dayInfo?.dayNumber || 1;
    if (!exercisesByDay[dayNumber]) {
      exercisesByDay[dayNumber] = [];
    }
    exercisesByDay[dayNumber].push({ exercise, index });
  });
  
  // Рендерим по дням
  Object.entries(exercisesByDay).forEach(([dayNumber, dayExercises]) => {
    // Создаем секцию дня только если есть информация о днях
    if (workoutState.plan.some(ex => ex.dayInfo)) {
      const daySection = document.createElement('div');
      daySection.className = 'day-section';
      
      const dayTitle = document.createElement('h3');
      const dayInfo = dayExercises[0].exercise.dayInfo;
      dayTitle.textContent = `День ${dayNumber}${dayInfo?.focus ? ': ' + dayInfo.focus : ''}`;
      daySection.appendChild(dayTitle);
      
      dayExercises.forEach(({ exercise, index }) => {
        const wrap = createExerciseCardElement(exercise, index);
        const setsEl = setupExerciseEventListeners(wrap, exercise, index);
        daySection.appendChild(wrap);
        renderSets(exercise, setsEl, index);
      });
      
      fragment.appendChild(daySection);
    } else {
      // Обычный рендеринг без группировки по дням
      dayExercises.forEach(({ exercise, index }) => {
        const wrap = createExerciseCardElement(exercise, index);
        const setsEl = setupExerciseEventListeners(wrap, exercise, index);
        fragment.appendChild(wrap);
        renderSets(exercise, setsEl, index);
      });
    }
  });
  
  planContainer.appendChild(fragment);
}

// === Валидация данных ===
function validateWorkoutData() {
  if (!dateInput.value) {
    alert("Выберите дату тренировки!");
    dateInput.focus();
    return false;
  }
  
  // Проверяем, что есть хотя бы одно упражнение
  if (workoutState.plan.length === 0) {
    alert("Добавьте хотя бы одно упражнение в план тренировки!");
    return false;
  }
  
  // Проверяем, что все подходы заполнены
  const incompleteSets = workoutState.plan.some(ex => 
    ex.sets.some(set => set.weight === null || set.reps === null)
  );
  
  if (incompleteSets) {
    return confirm("Некоторые подходы не заполнены. Сохранить тренировку как есть?");
  }
  
  // Проверяем, не существует ли уже тренировка на эту дату
  const workouts = JSON.parse(localStorage.getItem("workouts") || "{}");
  if (workouts[dateInput.value]) {
    return confirm("Тренировка на эту дату уже существует. Перезаписать?");
  }
  
  return true;
}

function updateProfileStats(workouts) {
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  profile.totalWorkouts = Object.keys(workouts).length;
  
  let allExercises = [];
  Object.values(workouts).forEach(workout => {
    workout.forEach(ex => allExercises.push(ex.name_ru));
  });
  profile.totalExercises = new Set(allExercises).size;
  
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

// === Сохранение плана ===
function saveCurrent() {
  try {
    if (!validateWorkoutData()) return;
    
    const date = dateInput.value || todayISO();
    const workouts = JSON.parse(localStorage.getItem("workouts") || "{}");
    
    workouts[date] = workoutState.plan.map(e => ({
      name_ru: e.meta.name_ru,
      name_en: e.meta.name_en,
      type: e.meta.type,
      groups: e.meta.groups,
      equipment: e.meta.equipment,
      sets: e.sets,
      completed: e.sets.every(set => set.weight !== null && set.reps !== null)
    }));
    
    localStorage.setItem("workouts", JSON.stringify(workouts));
    
    // Обновляем статистику профиля
    updateProfileStats(workouts);
    
    alert("Тренировка сохранена! ✅");
    
    // Сбрасываем план
    workoutState.reset();
    
  } catch (error) {
    console.error("Ошибка при сохранении тренировки:", error);
    alert("Произошла ошибка при сохранении тренировки. Попробуйте еще раз.");
  }
}

if (saveBtn) saveBtn.addEventListener("click", saveCurrent);

// === Загрузка программы из localStorage ===
function loadSavedProgram() {
  const savedProgram = JSON.parse(localStorage.getItem('currentProgram') || 'null');
  
  if (savedProgram && savedProgram.plan) {
    workoutState.plan = savedProgram.plan;
    renderPlan();
    
    // Очищаем сохраненную программу после загрузки
    localStorage.removeItem('currentProgram');
    
    // Показываем уведомление
    showProgramLoadedNotification(savedProgram.name || 'Программа');
  }
}

function showProgramLoadedNotification(programName) {
  const notification = document.createElement('div');
  notification.className = 'program-notification';
  notification.innerHTML = `
    <p>✅ Программа "${programName}" загружена в план тренировки</p>
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Автоматическое скрытие через 5 секунд
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// === Инициализация ===
(function init() {
  dateInput.value = todayISO();
  loadSavedProgram();
  renderPlan();
  loadExercises().catch(error => {
    ErrorHandler.handleAPIError(error, 'init');
  });
})();