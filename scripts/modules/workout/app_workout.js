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

// === Глобальные переменные ===
let exercises = [];
let plan = [];
let currentExerciseIndex = 0;
let currentSetIndex = 0;

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

if (modalClose) modalClose.addEventListener("click", hideModal);
if (modalBack) modalBack.addEventListener("click", e => { if (e.target === modalBack) hideModal(); });

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

// === Валидация и обработка ввода ===
function validateNumberInput(inputElement, isFloat = false) {
  let value = inputElement.value;
  
  value = value.replace(isFloat ? /[^\d.]/g : /[^\d]/g, '');
  
  if (isFloat) {
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
  }
  
  inputElement.value = value;
  return value;
}

function handleWeightInput(input, set) {
  const value = validateNumberInput(input, true);
  set.weight = value ? parseFloat(value) : null;
}

function handleRepsInput(input, set) {
  const value = validateNumberInput(input, false);
  set.reps = value ? parseInt(value, 10) : null;
}

function handleCompleteSet(exerciseIndex, setIndex, EX) {
  const s = EX.sets[setIndex];
  
  if (!s.weight || !s.reps) {
    alert("Заполните вес и количество повторений!");
    return false;
  }
  
  if (currentSetIndex < EX.sets.length - 1) {
    currentSetIndex++;
  } else {
    currentSetIndex = 0;
    if (currentExerciseIndex < plan.length - 1) {
      currentExerciseIndex++;
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
    plan.splice(exerciseIndex, 1);
    if (exerciseIndex <= currentExerciseIndex) {
      currentExerciseIndex = Math.max(0, currentExerciseIndex - 1);
      currentSetIndex = 0;
    }
  }
}

// === Загрузка базы упражнений ===
async function loadExercises() {
  try {
    exercisesContainer.innerHTML = '<div class="loading">🔄 Загрузка упражнений...</div>';
    
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

// === Фильтры ===
function fillFilters() {
  [filterGroups, filterTargets, filterType, filterEquipment].forEach(filter => {
    filter.innerHTML = '<option value="">Все</option>';
  });
  
  const groups = [...new Set(exercises.flatMap(ex => ex.groups))];
  groups.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g; opt.textContent = g;
    filterGroups.appendChild(opt);
  });
  
  const targets = [...new Set(exercises.flatMap(ex => ex.targets))];
  targets.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    filterTargets.appendChild(opt);
  });
  
  const types = [...new Set(exercises.map(ex => ex.type))];
  types.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    filterType.appendChild(opt);
  });
  
  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))];
  equipments.forEach(eq => {
    const opt = document.createElement("option");
    opt.value = eq; opt.textContent = eq;
    filterEquipment.appendChild(opt);
  });
  
  setupDependentFilters();
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
  const currentGroup = filterGroups.value;
  filterGroups.innerHTML = '<option value="">Все</option>';
  
  if (!selectedTarget) {
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

function applyFilters() {
  let list = [...exercises];
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

[filterGroups, filterTargets, filterType, filterEquipment].forEach(sel => {
  sel.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", debounce(applyFilters, 300));

// === Отрисовка упражнений ===
function createExerciseCard(ex) {
  const card = document.createElement("div");
  card.className = "exercise-card";
  
  const groups = ex.groups.join(", ");
  const targets = ex.targets.join(", ");
  const gif = ex.gif ? `<img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif">` : "";
  
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
  
  return card;
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
      addExerciseToPlan(ex);
      document.querySelector('#plan').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    });
    
    card.querySelector(".details-btn").addEventListener("click", () => showDetails(ex));
    fragment.appendChild(card);
  });
  
  exercisesContainer.appendChild(fragment);
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
  const isCurrentSet = index === currentExerciseIndex && i === currentSetIndex;
  const isCompleted = i < currentSetIndex && index === currentExerciseIndex;
  
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
      renderPlan();
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
  wrap.className = `card plan-exercise ${index === currentExerciseIndex ? 'active-exercise' : ''}`;
  
  wrap.innerHTML = `
    <div class="row">
      <h3>${EX.meta.name_ru || EX.meta.name_en}</h3>
      <div class="exercise-status">
        ${index < currentExerciseIndex ? '✅ Выполнено' : 
          index === currentExerciseIndex ? '🏋️ Выполняется' : '⏳ Ожидание'}
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
    plan = plan.filter(p => p !== EX);
    if (index <= currentExerciseIndex) {
      currentExerciseIndex = Math.max(0, currentExerciseIndex - 1);
      currentSetIndex = 0;
    }
    renderPlan();
  });
  
  return setsEl;
}

function renderPlan() {
  planContainer.innerHTML = '';
  
  if (plan.length === 0) {
    planContainer.innerHTML = `
      <div class="empty-plan-message">
        <p>Ваш план тренировки пуст</p>
        <p>Добавьте упражнения из списка ниже или выберите готовую программу</p>
        <button class="btn" onclick="window.location.href='programs.html'">
          📋 Выбрать программу
        </button>
      </div>
    `;
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  // Группируем упражнения по дням (если есть информация о днях)
  const exercisesByDay = {};
  plan.forEach((exercise, index) => {
    const dayNumber = exercise.dayInfo?.dayNumber || 1;
    if (!exercisesByDay[dayNumber]) {
      exercisesByDay[dayNumber] = [];
    }
    exercisesByDay[dayNumber].push({ exercise, index });
  });
  
  // Рендерим по дням
  Object.entries(exercisesByDay).forEach(([dayNumber, dayExercises]) => {
    // Создаем секцию дня только если есть информация о днях
    if (plan.some(ex => ex.dayInfo)) {
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

function addExerciseToPlan(ex) {
  const EX = { meta: ex, sets: [] };
  plan.push(EX);
  EX.sets.push({ weight: null, reps: null });
  renderPlan();
  
  const lastExercise = planContainer.lastElementChild;
  if (lastExercise) {
    lastExercise.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// === Валидация данных ===
function validateWorkoutData() {
  if (!dateInput.value) {
    alert("Выберите дату тренировки!");
    dateInput.focus();
    return false;
  }
  
  // Проверяем, что есть хотя бы одно упражнение
  if (plan.length === 0) {
    alert("Добавьте хотя бы одно упражнение в план тренировки!");
    return false;
  }
  
  // Проверяем, что все подходы заполнены
  const incompleteSets = plan.some(ex => 
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

function resetWorkoutPlan() {
  plan = [];
  currentExerciseIndex = 0;
  currentSetIndex = 0;
  renderPlan();
}

// === Сохранение плана ===
function saveCurrent() {
  try {
    if (!validateWorkoutData()) return;
    
    const date = dateInput.value || todayISO();
    const workouts = JSON.parse(localStorage.getItem("workouts") || "{}");
    
    workouts[date] = plan.map(e => ({
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
    resetWorkoutPlan();
    
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
    plan = savedProgram.plan;
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

// Функция для поиска упражнения по названию
function findExerciseByName(name) {
  return exercises.find(ex => 
    ex.name_ru === name || ex.name_en === name
  );
}

// === Инициализация ===
document.addEventListener('DOMContentLoaded', function() {
  dateInput.value = todayISO();
  loadSavedProgram();
});

(function init() {
  dateInput.value = todayISO();
  loadSavedProgram();
  renderPlan();
  loadExercises().catch(error => {
    console.error("Ошибка при загрузке упражнений:", error);
  });
})();

// Добавляем CSS для стилизации дней
const style = document.createElement('style');
style.textContent = `
  .day-section {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #007bff;
  }
  
  .day-section h3 {
    margin: 0 0 1rem 0;
    color: #007bff;
    font-size: 1.2rem;
  }
  
  .empty-plan-message {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }
  
  .empty-plan-message .btn {
    margin-top: 1rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    font-size: 1.1rem;
  }
  
  .program-notification {
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
  }
  
  .program-notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
document.head.appendChild(style);