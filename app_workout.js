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
    // Fallback: show plain-text modal via alert if markup is absent on this page
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
    card.querySelector(".add-btn").addEventListener("click", () => addExerciseToPlan(ex));
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
function addExerciseToPlan(ex) {
  const wrap = document.createElement("div");
  wrap.className = "card plan-exercise";
  wrap.innerHTML = `
    <div class="row">
      <h3>${ex.name_ru || ex.name_en}</h3>
      <div>
        <button class="btn add-set">+ Подход</button>
        <button class="btn remove-ex">✖ Удалить</button>
      </div>
    </div>
    <div class="sets"></div>
  `;
  const EX = { meta: ex, sets: [] };
  plan.push(EX);

  const setsEl = wrap.querySelector(".sets");
  function renderSets() {
    setsEl.innerHTML = "";
    EX.sets.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "set-row";
      row.innerHTML = `
        <span>#${i + 1}</span>
        <input type="number" step="0.5" placeholder="Вес, кг" value="${s.weight ?? ""}">
        <input type="number" step="1" placeholder="Повторы" value="${s.reps ?? ""}">
        <button class="rm">×</button>
      `;
      const [ , wEl, rEl, rm ] = row.children;
      wEl.addEventListener("input", () => s.weight = parseFloat(wEl.value || "0"));
      rEl.addEventListener("input", () => s.reps = parseInt(rEl.value || "0"));
      rm.addEventListener("click", () => { EX.sets.splice(i, 1); renderSets(); });
      setsEl.appendChild(row);
    });
  }

  wrap.querySelector(".add-set").addEventListener("click", () => {
    EX.sets.push({ weight: null, reps: null });
    renderSets();
  });
  wrap.querySelector(".remove-ex").addEventListener("click", () => {
    plan = plan.filter(p => p !== EX);
    wrap.remove();
  });

  planContainer.appendChild(wrap);
  // Добавляем первый пустой подход
  EX.sets.push({ weight: null, reps: null });
  renderSets();
}

// === Сохранение плана ===
function saveCurrent() {
  const date = dateInput.value || todayISO();
  const workouts = JSON.parse(localStorage.getItem("workouts") || "{}");
  workouts[date] = plan.map(e => ({
    name_ru: e.meta.name_ru,
    name_en: e.meta.name_en,
    type: e.meta.type,
    groups: e.meta.groups,
    equipment: e.meta.equipment,
    sets: e.sets
  }));
  localStorage.setItem("workouts", JSON.stringify(workouts));
  alert("Сохранено ✅");
}
if (saveBtn) saveBtn.addEventListener("click", saveCurrent);

// === Инициализация ===
(function init() {
  dateInput.value = todayISO();
  loadExercises();
})();
