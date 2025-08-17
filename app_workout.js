
const STORAGE_KEY = 'currentWorkout';

async function loadData() {
  const res = await fetch('exercises.json');
  return await res.json();
}

function loadPlan() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  toast('План сохранён');
}

function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 1200);
}

function renderPick(list, onAdd) {
  const pick = document.getElementById('pick');
  pick.innerHTML = '';
  list.forEach(ex => {
    const item = document.createElement('button');
    item.className = 'pick-item';
    item.innerHTML = `
      <img class="thumb" alt="" src="${ex.gif}" onerror="this.style.display='none'">
      <div style="text-align:left">
        <div style="font-weight:600">${ex.name_ru}</div>
        <div class="muted">${ex.type} · ${ex.equipment.join(', ')}</div>
      </div>`;
    item.onclick = () => onAdd(ex);
    pick.appendChild(item);
  });
}

function renderPlan(plan, onRemove, onEdit) {
  const container = document.getElementById('plan');
  container.innerHTML = '';
  if (!plan.length) {
    container.innerHTML = '<div class="muted">План пуст. Добавьте упражнения слева.</div>';
    return;
  }
  plan.forEach((ex, idx) => {
    const row = document.createElement('div');
    row.className = 'set-row';
    row.innerHTML = `
      <div style="flex:1 1 auto">
        <div style="font-weight:600">${ex.name_ru}</div>
        <div class="muted">${ex.type} · ${ex.equipment.join(', ')}</div>
      </div>
      <div>
        <label>Подходы</label><input type="number" value="${ex.sets || 1}" class="sets" data-index="${idx}">
        <label>Повторения</label><input type="number" value="${ex.reps || 10}" class="reps" data-index="${idx}">
        <label>Вес (кг)</label><input type="number" value="${ex.weight || 0}" class="weight" data-index="${idx}">
      </div>
      <button class="icon-btn" title="Удалить" onclick="onRemove(${idx})">✕</button>
    `;
    container.appendChild(row);
  });
  // Attach edit event listeners for sets, reps, and weight
  document.querySelectorAll('.sets, .reps, .weight').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      const value = e.target.value;
      if (e.target.classList.contains('sets')) {
        plan[idx].sets = value;
      } else if (e.target.classList.contains('reps')) {
        plan[idx].reps = value;
      } else if (e.target.classList.contains('weight')) {
        plan[idx].weight = value;
      }
      savePlan(plan);
    });
  });
}

(async function init(){
  const data = await loadData();

  // Populate filters
  const filterType = document.getElementById('w-filter-type');
  const filterEq = document.getElementById('w-filter-equipment');
  const filterGroup = document.getElementById('w-search-group');
  const filterTarget = document.getElementById('w-search-target');

  [...new Set(data.map(x=>x.type))].forEach(t => {const o=document.createElement('option');o.value=t;o.textContent=t;filterType.appendChild(o);});
  [...new Set(data.flatMap(x=>x.equipment))].forEach(e => {const o=document.createElement('option');o.value=e;o.textContent=e;filterEq.appendChild(o);});

  let plan = loadPlan();

  function apply() {
    let list = data;
    const q = filterGroup.value.trim().toLowerCase();
    const t = filterType.value;
    const e = filterEq.value;
    const target = filterTarget.value.trim().toLowerCase();
    if (q) list = list.filter(x => x.groups.some(group => group.toLowerCase().includes(q)));
    if (target) list = list.filter(x => x.targets.some(zone => zone.toLowerCase().includes(target)));
    if (t) list = list.filter(x => x.type === t);
    if (e) list = list.filter(x => x.equipment.includes(e));
    renderPick(list, (ex) => { plan.push(ex); savePlan(plan); renderPlan(plan, remove, edit); });
  }

  function remove(idx) {
    plan.splice(idx, 1);
    savePlan(plan);
    renderPlan(plan, remove, edit);
  }

  function edit(idx, ex) {
    plan[idx] = ex;
    savePlan(plan);
    renderPlan(plan, remove, edit);
  }

  document.getElementById('clearPlan').onclick = () => { plan = []; savePlan(plan); renderPlan(plan, remove, edit); };
  filterGroup.oninput = apply;
  filterTarget.oninput = apply;
  filterType.onchange = apply;
  filterEq.onchange = apply;

  apply();
  renderPlan(plan, remove, edit);
})();
