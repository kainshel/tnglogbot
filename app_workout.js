// ---- Безопасная «заплатка» для localStorage (синхронизировано с app_exercises.js) ----
(function(){
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    const _remove = localStorage.removeItem.bind(localStorage);
    const _clear = localStorage.clear.bind(localStorage);
    localStorage.setItem = function(k,v){ try { return _set(k,v); } catch(e){ console.error('Ошибка при выполнении localStorage.setItem', e); } };
    localStorage.getItem = function(k){ try { return _get(k); } catch(e){ console.error('Ошибка при выполнении localStorage.getItem', e); return null; } };
    localStorage.removeItem = function(k){ try { return _remove(k); } catch(e){ console.error('Ошибка при выполнении localStorage.removeItem', e); } };
    localStorage.clear = function(){ try { return _clear(); } catch(e){ console.error('Ошибка при выполнении localStorage.clear', e); } };
  } catch(e){ /* тихое игнорирование */ }
})();
// ---------------------------------------------------------------------------

let allExercises = [];
const searchInput = document.getElementById("search");
const filterGroups = document.getElementById("filter-groups");
const filterTargets = document.getElementById("filter-targets");
const filterType = document.getElementById("filter-type");
const filterEquipment = document.getElementById("filter-equipment");
const exercisesContainer = document.getElementById("exercises-container");
const planContainer = document.getElementById("plan");

// Шаблоны для элементов плана (должны быть в workout.html)
const tplPlanExercise = document.getElementById("planExerciseTpl");
const tplSetRow = document.getElementById("setRowTpl");

// Проверка: обязательные контейнеры должны существовать
if (!exercisesContainer || !planContainer) {
  console.error("[app_workout] Отсутствуют необходимые контейнеры #exercises-container или #plan");
}

// === Загрузка и подготовка данных ===
async function loadExercises() {
  try {
    const res = await fetch('exercises.json', { cache: 'no-store' });
    exercises = await res.json();
    normalizeData();
    fillFilters();
    renderExercises(exercises);
  } catch (e) {
    console.error('Ошибка при загрузке упражнений', e);
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

// Заполнение выпадающих фильтров
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

// === Отрисовка карточек упражнений ===
function renderExercises(list) {
  if (!exercisesContainer) return;
  exercisesContainer.innerHTML = "";
  list.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <h3>${ex.name_ru}</h3>
      <img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif">
      <p><b>Группы:</b> ${ex.groups.join(', ')}</p>
      <p><b>Цели:</b> ${ex.targets.join(', ')}</p>
      <div class="card-actions">
        <button class="btn add-btn">➕ В план</button>
      </div>
    `;
    const detailsBtn = card.querySelector(".details-btn");
    const addBtn = card.querySelector(".add-btn");

    detailsBtn.addEventListener("click", () => showDetails(ex));
    addBtn.addEventListener("click", () => addExerciseToPlan(ex));

    exercisesContainer.appendChild(card);
  });
}

// === Логика фильтров ===
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

// Привязка фильтров и поиска
[filterGroups, filterTargets, filterType, filterEquipment, searchInput].forEach(sel => {
  sel.addEventListener('input', applyFilters);
});

// === Управление планом тренировки ===
function addExerciseToPlan(ex) {
  if (!tplPlanExercise || !tplSetRow) {
    console.error("[app_workout] Отсутствуют шаблоны #planExerciseTpl или #setRowTpl");
    return;
  }
  const planItemFrag = tplPlanExercise.content.cloneNode(true);
  const planItemEl = planItemFrag.querySelector(".plan-exercise");

  planItemEl.querySelector("h3").textContent = ex.name_ru || ex.name_en;

  const setsContainer = planItemEl.querySelector(".sets");

  // по умолчанию добавляется 1 подход (удобнее для пользователя)
  const initialRow = tplSetRow.content.cloneNode(true);
  setsContainer.appendChild(initialRow);

  const addSetBtn = planItemEl.querySelector(".add-set");
  addSetBtn.addEventLi
