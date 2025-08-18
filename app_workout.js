
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
  setTimeout(() => el.classList.remove('show'), 1200);
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

function renderPlan(plan, onRemove) {
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
      <div style="font-weight:600">${ex.name_ru}</div>
      <img class="exercise-gif" src="${ex.gif}" alt="${ex.name_en}">
      <div>
        ${ex.sets.map((set, setIdx) => `
          <div class="set-entry">
            <label>Подход ${setIdx + 1}</label>
            <input type="number" value="${set.sets || 1}" class="sets" data-index="${idx}" data-setindex="${setIdx}">
            <label>Повторения</label>
            <input type="number" value="${set.reps || 10}" class="reps" data-index="${idx}" data-setindex="${setIdx}">
            <label>Вес (кг)</label>
            <input type="number" value="${set.weight || 0}" class="weight" data-index="${idx}" data-setindex="${setIdx}">
          </div>
        `).join('')}
      </div>
      <button class="icon-btn" title="Удалить" onclick="onRemove(${idx})">✕</button>
    `;
    container.appendChild(row);
  });

  // Attach edit event listeners for sets, reps, and weight
  document.querySelectorAll('.sets, .reps, .weight').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = e.target.dataset.index;
      const setIdx = e.target.dataset.setindex;
      const value = e.target.value;
      if (e.target.classList.contains('sets')) {
        plan[idx].sets[setIdx].sets = value;
      } else if (e.target.classList.contains('reps')) {
        plan[idx].sets[setIdx].reps = value;
      } else if (e.target.classList.contains('weight')) {
        plan[idx].sets[setIdx].weight = value;
      }
      savePlan(plan);
    });
  });
}

function addSet(idx) {
  const plan = loadPlan();
  plan[idx].sets.push({ sets: 1, reps: 10, weight: 0 });
  savePlan(plan);
  renderPlan(plan, remove);
}

function remove(idx) {
  const plan = loadPlan();
  plan.splice(idx, 1);
  savePlan(plan);
  renderPlan(plan, remove);
}

(async function init() {
  const data = await loadData();

  // Populate filters
  const filterType = document.getElementById('w-filter-type');
  const filterEq = document.getElementById('w-filter-equipment');
  const filterGroup = document.getElementById('w-search-group');
  const filterTarget = document.getElementById('w-search-target');

  [...new Set(data.map(x => x.type))].forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; filterType.appendChild(o); });
  [...new Set(data.flatMap(x => x.equipment))].forEach(e => { const o = document.createElement('option'); o.value = e; o.textContent = e; filterEq.appendChild(o); });

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
    renderPick(list, (ex) => { plan.push(ex); savePlan(plan); renderPlan(plan, remove); });
  }

  function remove(idx) {
    plan.splice(idx, 1);
    savePlan(plan);
    renderPlan(plan, remove);
  }

  document.getElementById('clearPlan').onclick = () => { plan = []; savePlan(plan); renderPlan(plan, remove); };
  filterGroup.oninput = apply;
  filterTarget.oninput = apply;
  filterType.onchange = apply;
  filterEq.onchange = apply;

  apply();
  renderPlan(plan, remove);
})();
