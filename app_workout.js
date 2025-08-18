let allExercises = [];
const searchInput = document.getElementById("search");
const filterGroups = document.getElementById("filter-groups");
const filterTargets = document.getElementById("filter-targets");
const filterType = document.getElementById("filter-type");
const filterEquipment = document.getElementById("filter-equipment");
const exercisesContainer = document.getElementById("exercises-container");
const planContainer = document.getElementById("plan");

// Модальное окно для деталей
const modalBack = document.getElementById("modalBack");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

// Шаблон для упражнения в плане
const tplPlanExercise = document.getElementById("planExerciseTpl");
const tplSetRow = document.getElementById("setRowTpl");

// === Загрузка упражнений ===
async function loadExercises() {
  try {
    const res = await fetch("exercises.json", { cache: "no-store" });
    allExercises = await res.json();
    normalizeData();
    fillFilters();
    renderExercises(allExercises);
  } catch (err) {
    console.error("Ошибка загрузки exercises.json:", err);
  }
}

// === Приведение данных к единому формату ===
function normalizeData() {
  allExercises = allExercises.map(ex => ({
    ...ex,
    groups: Array.isArray(ex.groups) ? ex.groups : (ex.group ? [ex.group] : []),
    targets: Array.isArray(ex.targets) ? ex.targets : (ex.target ? [ex.target] : []),
    equipment: Array.isArray(ex.equipment) ? ex.equipment : (ex.equipment ? [ex.equipment] : []),
  }));
}

// === Заполнение фильтров ===
function fillFilters() {
  function fillSelect(select, values, placeholder) {
    select.innerHTML = `<option value="">${placeholder}</option>`;
    values.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  const groups = [...new Set(allExercises.flatMap(ex => ex.groups))];
  const targets = [...new Set(allExercises.flatMap(ex => ex.targets))];
  const types = [...new Set(allExercises.map(ex => ex.type))];
  const equipments = [...new Set(allExercises.flatMap(ex => ex.equipment))];

  fillSelect(filterGroups, groups, "Группа мышц");
  fillSelect(filterTargets, targets, "Целевая зона");
  fillSelect(filterType, types, "Тип");
  fillSelect(filterEquipment, equipments, "Оборудование");
}

// === Отрисовка карточек упражнений ===
function renderExercises(list) {
  exercisesContainer.innerHTML = "";
  list.forEach(ex => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <h3>${ex.name_ru || ex.name}</h3>
      <img src="${ex.gif}" alt="${ex.name_en || ex.name}" class="exercise-gif">
      <p><b>Группы:</b> ${ex.groups.join(", ")}</p>
      <p><b>Цели:</b> ${ex.targets.join(", ")}</p>
      <button class="details-btn">Подробнее</button>
      <button class="btn add-btn">➕ В план</button>
    `;

    // Кнопка "Подробнее"
    card.querySelector(".details-btn").onclick = () => showDetails(ex);

    // Кнопка "В план"
    card.querySelector(".add-btn").onclick = () => addExerciseToPlan(ex);

    exercisesContainer.appendChild(card);
  });
}

// === Фильтрация ===
function applyFilters() {
  let list = [...allExercises];
  const search = searchInput.value.toLowerCase();
  if (search) {
    list = list.filter(ex =>
      (ex.name_ru || "").toLowerCase().includes(search) ||
      (ex.name_en || "").toLowerCase().includes(search)
    );
  }
  const gr = (filterGroups?.value || "").trim();
  if (gr) list = list.filter(ex => ex.groups.includes(gr));
  const tg = (filterTargets?.value || "").trim();
  if (tg) list = list.filter(ex => ex.targets.includes(tg));
  const tp = (filterType?.value || "").trim();
  if (tp) list = list.filter(ex => ex.type === tp);
  const eq = (filterEquipment?.value || "").trim();
  if (eq) list = list.filter(ex => ex.equipment.includes(eq));

  renderExercises(list);
}

// === Модальное окно с деталями ===
function showDetails(ex) {
  modalContent.innerHTML = `
    <h2>${ex.name_ru || ex.name}</h2>
    <img src="${ex.gif}" alt="${ex.name_en || ex.name}" class="modal-gif">
    <p><b>Группы:</b> ${ex.groups.join(", ")}</p>
    <p><b>Цели:</b> ${ex.targets.join(", ")}</p>
    <p><b>Тип:</b> ${ex.type}</p>
    <p><b>Оборудование:</b> ${ex.equipment.join(", ")}</p>
    <p>${ex.description || "Описание отсутствует"}</p>
  `;
  modalBack.style.display = "flex";
}

modalClose.onclick = () => modalBack.style.display = "none";
modalBack.onclick = (e) => { if (e.target === modalBack) modalBack.style.display = "none"; };

// === Добавление упражнения в план ===
function addExerciseToPlan(ex) {
  const planItem = tplPlanExercise.content.cloneNode(true);
  const planItemEl = planItem.querySelector(".plan-exercise");

  planItemEl.querySelector("h3").textContent = ex.name_ru || ex.name;

  const setsContainer = planItemEl.querySelector(".sets");

  // Добавление подхода
  const addSetBtn = planItemEl.querySelector(".add-set");
  addSetBtn.addEventListener("click", () => {
    const setRow = tplSetRow.content.cloneNode(true);
    setsContainer.appendChild(setRow);
  });

  // Удаление упражнения
  const removeBtn = planItemEl.querySelector(".remove-exercise");
  removeBtn.addEventListener("click", () => {
    planItemEl.remove();
  });

  planContainer.appendChild(planItem);
}

// === Сохранение тренировки ===
function saveWorkout() {
  const date = document.getElementById("workoutDate").value || new Date().toISOString().slice(0,10);

  const exercises = [];
  planContainer.querySelectorAll(".plan-exercise").forEach(block => {
    const name = block.querySelector("h3").textContent;
    const sets = [];
    block.querySelectorAll(".set-row").forEach(row => {
      const reps = row.querySelector(".reps").value;
      const weight = row.querySelector(".weight").value;
      sets.push({ reps, weight });
    });
    exercises.push({ name, sets });
  });

  if (exercises.length === 0) {
    alert("Добавьте хотя бы одно упражнение!");
    return;
  }

  let history = JSON.parse(localStorage.getItem("workoutHistory")) || [];
  history.push({ date, exercises });
  localStorage.setItem("workoutHistory", JSON.stringify(history));

  alert("Тренировка сохранена!");
  planContainer.innerHTML = "";
}

// === Инициализация ===
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("workoutDate").value = new Date().toISOString().slice(0,10);

  loadExercises();

  [searchInput, filterGroups, filterTargets, filterType, filterEquipment].forEach(el => {
    el.addEventListener("input", applyFilters);
  });

  document.getElementById("saveWorkoutBtn").addEventListener("click", saveWorkout);
});
