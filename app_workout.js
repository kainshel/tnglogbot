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
let currentExerciseIndex = 0; // Текущее активное упражнение
let currentSetIndex = 0; // Текущий активный подход

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

// === Вспомогательные ===
function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
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
function hideModal() { if (modalBack) modalBack.style.display = "none"; }
if (modalClose) modalClose.addEventListener("click", hideModal);
if (modalBack) modalBack.addEventListener("click", e => { if (e.target === modalBack) hideModal(); });

// === Загрузка базы упражнений ===
async function loadExercises() {
  try {
    const res = await fetch("exercises.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    exercises = await res.json();
    normalizeData();
    fillFilters();
    renderExercises(exercises);
  } catch (e) {
    console.error("Ошибка при загрузке упражнений", e);
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
  if (search) list = list.filter(ex =>
    (ex.name_ru || "").toLowerCase().includes(search) ||
    (ex.name_en || "").toLowerCase().includes(search)
  );
  const gr = filterGroups.value; if (gr) list = list.filter(ex => ex.groups.includes(gr));
  const tg = filterTargets.value; if (tg) list = list.filter(ex => ex.targets.includes(tg));
  const tp = filterType.value; if (tp) list = list.filter(ex => ex.type === tp);
  const eq = filterEquipment.value; if (eq) list = list.filter(ex => ex.equipment.includes(eq));
  renderExercises(list);
}

[filterGroups, filterTargets, filterType, filterEquipment, searchInput].forEach(sel => {
  sel.addEventListener("input", applyFilters);
});

// === Отрисовка упражнений ===
function renderExercises(list) {
  exercisesContainer.innerHTML = "";
  
  if (list.length === 0) {
    exercisesContainer.innerHTML = '<p class="empty-plan-message">Упражнения не найдены</p>';
    return;
  }
  
  list.forEach(ex => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <h3>${ex.name_ru || ex.name_en}</h3>
      ${ex.gif ? `<img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif">` : ""}
      <p><b>Группы:</b> ${ex.groups.join(", ")}</p>
      <p><b>Цели:</b> ${ex.targets.join(", ")}</p>
      <div class="card-actions">
        <button class="btn add-btn">➕ В план</button>
        <button class="btn details-btn">ℹ Подробнее</button>
      </div>
    `;
    
    card.querySelector(".add-btn").addEventListener("click", () => {
      addExerciseToPlan(ex);
      document.querySelector('#plan').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    });
    
    card.querySelector(".details-btn").addEventListener("click", () => showDetails(ex));
    exercisesContainer.appendChild(card);
  });
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
function renderPlan() {
  planContainer.innerHTML = '';
  
  if (plan.length === 0) {
    planContainer.innerHTML = `
      <div class="empty-plan-message">
        <p>Ваш план тренировки пуст</p>
        <p>Добавьте упражнения из списка ниже</p>
      </div>
    `;
    return;
  }
  
  plan.forEach((EX, index) => {
    const wrap = document.createElement("div");
    wrap.className = `card plan-exercise ${index === currentExerciseIndex ? 'active-exercise' : ''}`;
    wrap.innerHTML = `
      <div class="row">
        <h3>${EX.meta.name_ru || EX.meta.name_en}</h3>
        <div class="exercise-status">
          ${index < currentExerciseIndex ? '✅' : 
            index === currentExerciseIndex ? }
        </div>
        <div>
          <button class="btn add-set">+ Подход</button>
          <button class="btn danger remove-ex">✖ Удалить</button>
        </div>
      </div>
      <div class="sets"></div>
    `;
    
    const setsEl = wrap.querySelector(".sets");
    
    function renderSets() {
      setsEl.innerHTML = "";
      EX.sets.forEach((s, i) => {
        const isCurrentSet = index === currentExerciseIndex && i === currentSetIndex;
        const row = document.createElement("div");
        row.className = `set-row ${isCurrentSet ? 'current-set' : ''} ${i < currentSetIndex && index === currentExerciseIndex ? 'completed-set' : ''}`;
        row.innerHTML = `
          <span>#${i + 1}</span>
          <input type="number" step="0.5" min="0" placeholder="Вес, кг" value="${s.weight ?? ""}" 
                 ${i < currentSetIndex && index === currentExerciseIndex ? 'readonly' : ''}>
          <input type="number" step="1" min="0" placeholder="Повторы" value="${s.reps ?? ""}"
                 ${i < currentSetIndex && index === currentExerciseIndex ? 'readonly' : ''}>
          ${isCurrentSet ? 
            `<button class="btn complete-set">Завершить подход</button>` : 
            `<button class="rm">×</button>`}
        `;
        
        const inputs = row.querySelectorAll('input');
        const completeBtn = row.querySelector('.complete-set');
        const rmBtn = row.querySelector('.rm');
        
        // Валидация ввода
        const validateNumberInput = (inputElement) => {
          if (inputElement.value && !/^\d*\.?\d*$/.test(inputElement.value)) {
            inputElement.value = '';
          }
        };
        
        inputs[0].addEventListener("input", () => {
          validateNumberInput(inputs[0]);
          s.weight = inputs[0].value ? parseFloat(inputs[0].value) : null;
        });
        
        inputs[1].addEventListener("input", () => {
          validateNumberInput(inputs[1]);
          s.reps = inputs[1].value ? parseInt(inputs[1].value, 10) : null;
        });
        
        if (completeBtn) {
          completeBtn.addEventListener("click", () => {
            // Проверяем, заполнены ли поля
            if (!s.weight || !s.reps) {
              alert("Заполните вес и количество повторений!");
              return;
            }
            
            // Переходим к следующему подходу
            if (currentSetIndex < EX.sets.length - 1) {
              currentSetIndex++;
            } else {
              // Все подходы выполнены, переходим к следующему упражнению
              currentSetIndex = 0;
              if (currentExerciseIndex < plan.length - 1) {
                currentExerciseIndex++;
              } else {
                // Все упражнения выполнены
                alert("Тренировка завершена! Сохраните результаты.");
              }
            }
            renderPlan();
          });
        }
        
        if (rmBtn) {
          rmBtn.addEventListener("click", () => { 
            EX.sets.splice(i, 1); 
            renderSets();
            if (EX.sets.length === 0) {
              plan.splice(index, 1);
              // Корректируем текущие индексы при удалении упражнения
              if (index <= currentExerciseIndex) {
                currentExerciseIndex = Math.max(0, currentExerciseIndex - 1);
                currentSetIndex = 0;
              }
              renderPlan();
            }
          });
        }
        
        setsEl.appendChild(row);
      });
    }
    
    wrap.querySelector(".add-set").addEventListener("click", () => {
      EX.sets.push({ weight: null, reps: null });
      renderSets();
    });
    
    wrap.querySelector(".remove-ex").addEventListener("click", () => {
      plan = plan.filter(p => p !== EX);
      // Корректируем текущие индексы при удалении упражнения
      if (index <= currentExerciseIndex) {
        currentExerciseIndex = Math.max(0, currentExerciseIndex - 1);
        currentSetIndex = 0;
      }
      renderPlan();
    });
    
    planContainer.appendChild(wrap);
    renderSets();
  });
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

// === Сохранение плана ===
function saveCurrent() {
  if (plan.length === 0) {
    alert("Добавьте хотя бы одно упражнение в план тренировки!");
    return;
  }
  
  // Проверяем, все ли подходы заполнены
  const incompleteSets = plan.some(ex => 
    ex.sets.some(set => set.weight === null || set.reps === null)
  );
  
  if (incompleteSets) {
    if (!confirm("Некоторые подходы не заполнены. Сохранить тренировку как есть?")) {
      return;
    }
  }
  
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
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  profile.totalWorkouts = Object.keys(workouts).length;
  
  let allExercises = [];
  Object.values(workouts).forEach(workout => {
    workout.forEach(ex => allExercises.push(ex.name_ru));
  });
  profile.totalExercises = new Set(allExercises).size;
  
  localStorage.setItem("userProfile", JSON.stringify(profile));
  
  alert("Тренировка сохранена!");
  
  // Сбрасываем план и текущие индексы
  plan = [];
  currentExerciseIndex = 0;
  currentSetIndex = 0;
  renderPlan();
}

if (saveBtn) saveBtn.addEventListener("click", saveCurrent);

// === Инициализация ===
(function init() {
  dateInput.value = todayISO();
  renderPlan();
  loadExercises();
})();

    // Добавляем текущую дату по умолчанию
    document.addEventListener('DOMContentLoaded', function() {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();
      
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      
      const formattedToday = yyyy + '-' + mm + '-' + dd;
      document.getElementById('date').value = formattedToday;
    });