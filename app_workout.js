
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
      <div style="flex:1 1 auto">
        <div style="font-weight:600">${ex.name_ru}</div>
        <div class="muted">${ex.type} · ${ex.equipment.join(', ')}</div>
      </div>
      <button class="icon-btn" title="Удалить">✕</button>`;
    row.querySelector('button').onclick = () => onRemove(idx);
    container.appendChild(row);
  });
}

(async function init(){
  const data = await loadData();

  // Populate filters
  const filterType = document.getElementById('w-filter-type');
  const filterEq = document.getElementById('w-filter-equipment');
  [...new Set(data.map(x=>x.type))].forEach(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;filterType.appendChild(o)});
  [...new Set(data.flatMap(x=>x.equipment))].forEach(e=>{const o=document.createElement('option');o.value=e;o.textContent=e;filterEq.appendChild(o)});

  const search = document.getElementById('w-search');
  let plan = loadPlan();

  function apply() {
    const q = search.value.trim().toLowerCase();
    const t = filterType.value;
    const e = filterEq.value;
    let list = data;
    if (q) list = list.filter(x => x.name_ru.toLowerCase().includes(q) || x.name_en.toLowerCase().includes(q));
    if (t) list = list.filter(x => x.type === t);
    if (e) list = list.filter(x => x.equipment.includes(e));
    renderPick(list, (ex) => { plan.push(ex); savePlan(plan); renderPlan(plan, remove); });
  }

  function remove(idx) {
    plan.splice(idx,1); savePlan(plan); renderPlan(plan, remove);
  }

  document.getElementById('clearPlan').onclick = ()=>{ plan=[]; savePlan(plan); renderPlan(plan, remove); };
  search.oninput = apply; filterType.onchange = apply; filterEq.onchange = apply;

  apply(); renderPlan(plan, remove);
})();