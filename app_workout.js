// ---- Safe localStorage patch (align with app_exercises.js) ----
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
// ---------------------------------------------------------------

let allExercises = [];
const searchInput = document.getElementById("search");
const filterGroups = document.getElementById("filter-groups");
const filterTargets = document.getElementById("filter-targets");
const filterType = document.getElementById("filter-type");
const filterEquipment = document.getElementById("filter-equipment");
const exercisesContainer = document.getElementById("exercises-container");
const planContainer = document.getElementById("plan");

// Optional modal (may be absent in workout.html)
const modalBack = document.getElementById("modalBack");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");
const hasModal = !!(modalBack && modalContent && modalClose);

// Templates for plan items (present in workout.html)
const tplPlanExercise = document.getElementById("planExerciseTpl");
const tplSetRow = document.getElementById("setRowTpl");

// Guard: required containers must exist
if (!exercisesContainer || !planContainer) {
  console.error("[app_workout] Missing required containers #exercises-container or #plan");
}

// === Fetch & prepare data ===
async function loadExercises() {
  try {
    const res = await fetch("exercises.json", { cache: "no-store" });
    allExercises = await res.json();
    normalizeData();
    fillFilters();
    applyFilters(); // initial render with filters applied
  } catch (err) {
    console.error("Ошибка загрузки exercises.json:", err);
  }
}

function normalizeData() {
  allExercises = allExercises.map(ex => ({
    ...ex,
    // name fields normalization
    name_ru: ex.name_ru || ex.name || ex.name_en || "",
    name_en: ex.name_en || ex.name || ex.name_ru || "",
    // arrays normalization
    groups: Array.isArray(ex.groups) ? ex.groups.filter(Boolean) : (ex.group ? [ex.group] : []),
    targets: Array.isArray(ex.targets) ? ex.targets.filter(Boolean) : (ex.target ? [ex.target] : []),
    equipment: Array.isArray(ex.equipment) ? ex.equipment.filter(Boolean) : (ex.equipment ? [ex.equipment] : []),
    type: ex.type || "",
    gif: ex.gif || ex.image || ""
  }));
}

function fillFilters() {
  function fillSelect(select, values, placeholder) {
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>`;
    [...new Set(values)].filter(Boolean).sort().forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }
  fillSelect(filterGroups,   allExercises.flatMap(ex => ex.groups),    "Группа мышц");
  fillSelect(filterTargets,  allExercises.flatMap(ex => ex.targets),   "Целевая зона");
  fillSelect(filterType,     allExercises.map(ex => ex.type),          "Тип");
  fillSelect(filterEquipment,allExercises.flatMap(ex => ex.equipment), "Оборудование");
}

// === Render exercise cards (style like app_exercises.js) ===
function renderExercises(list) {
  if (!exercisesContainer) return;
  exercisesContainer.innerHTML = "";
  list.forEach(ex => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <h3>${escapeHtml(ex.name_ru || ex.name_en)}</h3>
      ${ex.gif ? `<img src="${escapeAttr(ex.gif)}" alt="${escapeAttr(ex.name_en || ex.name_ru)}" class="exercise-gif">` : ""}
      <p><b>Группы:</b> ${ex.groups.join(", ")}</p>
      <p><b>Цели:</b> ${ex.targets.join(", ")}</p>
      <div class="card-actions">
        <button class="details-btn">Подробнее</button>
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

// === Filtering logic ===
function applyFilters() {
  let list = [...allExercises];
  const search = (searchInput?.value || "").toLowerCase().trim();
  if (search) {
    list = list.filter(ex =>
      ex.name_ru.toLowerCase().includes(search) ||
      ex.name_en.toLowerCase().includes(search)
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

// === Details modal (graceful if modal is absent) ===
function showDetails(ex) {
  if (!hasModal) {
    // fallback: simple alert
    alert(
      `${ex.name_ru}\n\n` +
      `Группы: ${ex.groups.join(", ")}\n` +
      `Цели: ${ex.targets.join(", ")}\n` +
      `Тип: ${ex.type}\n` +
      `Оборудование: ${ex.equipment.join(", ")}`
    );
    return;
  }
  modalContent.innerHTML = `
    <h2>${escapeHtml(ex.name_ru || ex.name_en)}</h2>
    ${ex.gif ? `<img src="${escapeAttr(ex.gif)}" alt="${escapeAttr(ex.name_en || ex.name_ru)}" class="modal-gif">` : ""}
    <p><b>Группы:</b> ${ex.groups.join(", ")}</p>
    <p><b>Цели:</b> ${ex.targets.join(", ")}</p>
    <p><b>Тип:</b> ${ex.type}</p>
    <p><b>Оборудование:</b> ${ex.equipment.join(", ")}</p>
    <p>${ex.description ? escapeHtml(ex.description) : "Описание отсутствует"}</p>
  `;
  modalBack.style.display = "flex";
}

if (hasModal) {
  modalClose.onclick = () => modalBack.style.display = "none";
  modalBack.onclick = (e) => { if (e.target === modalBack) modalBack.style.display = "none"; };
}

// === Plan management ===
function addExerciseToPlan(ex) {
  if (!tplPlanExercise || !tplSetRow) {
    console.error("[app_workout] Missing templates #planExerciseTpl or #setRowTpl");
    return;
  }
  const planItemFrag = tplPlanExercise.content.cloneNode(true);
  const planItemEl = planItemFrag.querySelector(".plan-exercise");

  planItemEl.querySelector("h3").textContent = ex.name_ru || ex.name_en;

  const setsContainer = planItemEl.querySelector(".sets");

  // initial 1 set row (better UX)
  const initialRow = tplSetRow.content.cloneNode(true);
  setsContainer.appendChild(initialRow);

  const addSetBtn = planItemEl.querySelector(".add-set");
  addSetBtn.addEventListener("click", () => {
    const setRow = tplSetRow.content.cloneNode(true);
    setsContainer.appendChild(setRow);
  });

  const removeBtn = planItemEl.querySelector(".remove-exercise");
  removeBtn.addEventListener("click", () => {
    planItemEl.remove();
  });

  planContainer.appendChild(planItemFrag);
}

function saveWorkout() {
  const dateEl = document.getElementById("workoutDate");
  const date = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().slice(0,10);

  const exercises = [];
  planContainer.querySelectorAll(".plan-exercise").forEach(block => {
    const name = block.querySelector("h3").textContent;
    const sets = [];
    block.querySelectorAll(".set-row").forEach(row => {
      const reps = Number(row.querySelector(".reps").value || 0);
      const weight = Number(row.querySelector(".weight").value || 0);
      sets.push({ reps, weight });
    });
    exercises.push({ name, sets });
  });

  if (exercises.length === 0) {
    alert("Добавьте хотя бы одно упражнение!");
    return;
  }

  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("workoutHistory")) || [];
  } catch(e) {
    console.warn("workoutHistory parse error", e);
  }
  history.push({ date, exercises });
  localStorage.setItem("workoutHistory", JSON.stringify(history));

  alert("Тренировка сохранена!");
  planContainer.innerHTML = "";
}

// === Utils ===
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[m])); }
function escapeAttr(s){ return String(s).replace(/"/g,'&quot;'); }

// === Init ===
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.getElementById("workoutDate");
  if (dateEl) dateEl.value = new Date().toISOString().slice(0,10);

  loadExercises();

  // Inputs
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (filterGroups)  filterGroups.addEventListener("input", applyFilters);
  if (filterTargets) filterTargets.addEventListener("input", applyFilters);
  if (filterType)    filterType.addEventListener("input", applyFilters);
  if (filterEquipment) filterEquipment.addEventListener("input", applyFilters);

  const saveBtn = document.getElementById("saveWorkoutBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveWorkout);
});
