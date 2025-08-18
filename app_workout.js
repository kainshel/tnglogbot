let allExercises = [];
const searchInput = document.getElementById("search");
const filterGroup = document.getElementById("filter-groups");
const filterTarget = document.getElementById("filter-targets");
const filterType = document.getElementById("filter-type");
const filterEquipment = document.getElementById("filter-equipment");
const exercisesContainer = document.getElementById("exercises-container");
const planContainer = document.getElementById("plan");

// Шаблоны
const tplExercise = document.getElementById("pickItemTpl");
const tplPlanExercise = document.getElementById("planExerciseTpl");
const tplSetRow = document.getElementById("setRowTpl");

// === Загружаем упражнения из базы ===
async function loadExercises() {
  try {
    const res = await fetch("exercises.json");
    allExercises = await res.json();
    populateFilters();
    renderExercises();
  } catch (err) {
    console.error("Ошибка загрузки exercises.json:", err);
  }
}

// === Заполняем фильтры уникальными значениями ===
function populateFilters() {
  const groups = new Set();
  const targets = new Set();
  const types = new Set();
  const equipments = new Set();

  allExercises.forEach(e => {
    if (e.group) groups.add(e.group);
    if (e.target) targets.add(e.target);
    if (e.type) types.add(e.type);
    if (e.equipment) equipments.add(e.equipment);
  });

  fillSelect(filterGroup, groups, "Группа мышц");
  fillSelect(filterTarget, targets, "Целевая зона");
  fillSelect(filterType, types, "Тип");
  fillSelect(filterEquipment, equipments, "Оборудование");
}

function fillSelect(select, values, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  Array.from(values).sort().forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

// === Отрисовка упражнений с учётом фильтров ===
function renderExercises() {
  exercisesContainer.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const group = filterGroup.value;
  const target = filterTarget.value;
  const type = filterType.value;
  const equipment = filterEquipment.value;

  allExercises
    .filter(e =>
      (!search || e.name.toLowerCase().includes(search)) &&
      (!group || e.group === group) &&
      (!target || e.target === target) &&
      (!type || e.type === type) &&
      (!equipment || e.equipment === equipment)
    )
    .forEach(e => {
      const card = tplExercise.content.cloneNode(true);
      card.querySelector("h3").textContent = e.name;
      card.querySelector(".type").textContent = `Тип: ${e.type}`;
      card.querySelector(".target").textContent = `Целевая группа: ${e.target}`;
      card.querySelector(".equipment").textContent = `Оборудование: ${e.equipment || "нет"}`;

      const addBtn = card.querySelector(".btn");
      addBtn.addEventListener("click", () => addExerciseToPlan(e));

      exercisesContainer.appendChild(card);
    });
}

// === Добавление упражнения в план ===
function addExerciseToPlan(ex) {
  const planItem = tplPlanExercise.content.cloneNode(true);
  planItem.querySelector("h3").textContent = ex.name;

  const setsContainer = planItem.querySelector(".sets");

  // Кнопка добавления подхода
  const addSetBtn = planItem.querySelector(".add-set");
  addSetBtn.addEventListener("click", () => {
    const setRow = tplSetRow.content.cloneNode(true);
    setsContainer.appendChild(setRow);
  });

  // Кнопка удаления упражнения
  const removeBtn = planItem.querySelector(".remove-exercise");
  removeBtn.addEventListener("click", () => {
    planItemEl.remove();
  });

  const planItemEl = planItem.querySelector(".plan-exercise");
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

  searchInput.addEventListener("input", renderExercises);
  filterGroup.addEventListener("change", renderExercises);
  filterTarget.addEventListener("change", renderExercises);
  filterType.addEventListener("change", renderExercises);
  filterEquipment.addEventListener("change", renderExercises);

  document.getElementById("saveWorkoutBtn").addEventListener("click", saveWorkout);
});
