import { saveWorkout, loadWorkout, loadAllWorkouts } from './storage.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

let DB = [];
let PLAN = [];

const dateEl = $('#date');
const exListEl = $('#exList');
const planEl = $('#plan');
const searchEl = $('#search');
const historyEl = $('#history');
const infoModal = $('#infoModal');
const infoTitle = $('#infoTitle');
const infoMeta = $('#infoMeta');
const infoGifWrap = $('#infoGifWrap');

function todayISO(){
  const d = new Date();
  const tz = new Date(d.getTime() - d.getTimezoneOffset()*60000);
  return tz.toISOString().slice(0,10);
}

function sanitize(str){ return (str||'').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function setDateFromHashOrToday(){
  const m = location.hash.match(/date=([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  const iso = m ? m[1] : todayISO();
  dateEl.value = iso;
}

function updateHash(){
  if (dateEl.value) {
    location.hash = 'date=' + dateEl.value;
  }
}

function renderDB(list){
  exListEl.innerHTML = '';
  list.forEach((ex, idx) => {
    const item = document.createElement('div');
    item.className = 'ex-item';
    const ru = ex.name_ru || ex.name_en || ('Упражнение #' + idx);
    const tags = [ex.type, (ex.groups||[]).join(', '), (ex.equipment||[]).join(', ')].filter(Boolean).join(' • ');
    item.innerHTML = \`
      <div>
        <h4>\${sanitize(ru)}</h4>
        <div class="tag">\${sanitize(tags)}</div>
      </div>
      <div class="actions">
        <button data-action="add">Добавить</button>
        <button data-action="info" title="Подробнее">i</button>
      </div>
    \`;
    item.querySelector('[data-action="add"]').addEventListener('click', () => addToPlan(ex));
    item.querySelector('[data-action="info"]').addEventListener('click', () => openInfo(ex));
    exListEl.appendChild(item);
  });
}

function openInfo(ex){
  infoTitle.textContent = ex.name_ru || ex.name_en || 'Упражнение';
  const meta = [];
  if (ex.name_en) meta.push('EN: ' + ex.name_en);
  if (ex.groups && ex.groups.length) meta.push('Группы: ' + ex.groups.join(', '));
  if (ex.targets && ex.targets.length) meta.push('Цели: ' + ex.targets.join(', '));
  if (ex.type) meta.push('Тип: ' + ex.type);
  if (ex.equipment && ex.equipment.length) meta.push('Оборудование: ' + ex.equipment.join(', '));
  infoMeta.textContent = meta.join(' • ');
  infoGifWrap.innerHTML = '';
  if (ex.gif) {
    const img = new Image();
    img.src = ex.gif;
    img.alt = ex.name_ru || ex.name_en || 'GIF';
    img.style.maxWidth = '100%';
    infoGifWrap.appendChild(img);
  }
  infoModal.showModal();
}

function addToPlan(ex){
  const node = document.createElement('div');
  node.className = 'card';
  const title = ex.name_ru || ex.name_en || 'Упражнение';
  node.innerHTML = \`
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:.2rem 0">\${sanitize(title)}</h3>
      <div>
        <button data-act="add-set">+ Подход</button>
        <button data-act="remove-ex" style="background:#ef4444;color:#111;margin-left:.35rem">Удалить</button>
      </div>
    </div>
    <div class="tag">\${sanitize([ex.type, (ex.groups||[]).join(', ')].filter(Boolean).join(' • '))}</div>
    <div class="sets"></div>
  \`;
  const setsEl = node.querySelector('.sets');
  const addSetBtn = node.querySelector('[data-act="add-set"]');
  const removeExBtn = node.querySelector('[data-act="remove-ex"]');

  const EX = { meta: ex, sets: [] };
  PLAN.push(EX);

  function renderSets(){
    setsEl.innerHTML = '';
    EX.sets.forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'set-row';
      row.innerHTML = \`
        <span>#\${i+1}</span>
        <input type="number" step="0.5" placeholder="Вес" value="\${s.weight ?? ''}" />
        <input type="number" step="1" placeholder="Повторы" value="\${s.reps ?? ''}" />
        <button data-i="\${i}" class="rm">×</button>
      \`;
      const [ , wEl, rEl, rm ] = row.children;
      wEl.addEventListener('input', () => { s.weight = parseFloat(wEl.value||'0'); });
      rEl.addEventListener('input', () => { s.reps = parseInt(rEl.value||'0',10); });
      rm.addEventListener('click', () => { EX.sets.splice(i,1); renderSets(); });
      setsEl.appendChild(row);
    });
  }

  addSetBtn.addEventListener('click', () => {
    EX.sets.push({ weight: null, reps: null });
    renderSets();
  });

  removeExBtn.addEventListener('click', () => {
    const idx = PLAN.indexOf(EX);
    if (idx >= 0) PLAN.splice(idx,1);
    node.remove();
  });

  planEl.appendChild(node);
  // create first set by default
  EX.sets.push({ weight: null, reps: null });
  renderSets();
}

function saveCurrent(){
  const date = dateEl.value || todayISO();
  const normalized = {
    date,
    exercises: PLAN.map(e => ({
      name_ru: e.meta.name_ru || null,
      name_en: e.meta.name_en || null,
      type: e.meta.type || null,
      groups: e.meta.groups || [],
      equipment: e.meta.equipment || [],
      sets: e.sets.map(s => ({ weight: s.weight ?? 0, reps: s.reps ?? 0 })),
    }))
  };
  saveWorkout(date, normalized);
  renderHistory();
  alert('Сохранено ✅');
}

function renderHistory(){
  const all = loadAllWorkouts();
  const dates = Object.keys(all).sort().reverse();
  historyEl.innerHTML = '';
  if (!dates.length){
    historyEl.innerHTML = '<div class="tag">Записей пока нет</div>';
    return;
  }
  dates.forEach(d => {
    const w = all[d];
    const details = document.createElement('details');
    details.innerHTML = \`
      <summary><strong>\${d}</strong> – \${(w.exercises||[]).length} упражн.</summary>
      <div style="margin:.5rem 0 0 0"></div>
    \`;
    const wrap = details.querySelector('div');
    (w.exercises || []).forEach(ex => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.margin = '.5rem 0';
      card.innerHTML = \`
        <h4 style="margin:.2rem 0">\${sanitize(ex.name_ru || ex.name_en || 'Упражнение')}</h4>
        <div class="tag">\${sanitize([ex.type, (ex.groups||[]).join(', ')].filter(Boolean).join(' • '))}</div>
        <div class="sets"></div>
      \`;
      const setsEl = card.querySelector('.sets');
      (ex.sets||[]).forEach((s, i) => {
        const row = document.createElement('div');
        row.className = 'set-row';
        row.innerHTML = \`
          <span>#\${i+1}</span>
          <span>\${s.weight} кг × \${s.reps}</span>
        \`;
        setsEl.appendChild(row);
      });
      wrap.appendChild(card);
    });
    historyEl.appendChild(details);
  });
}

async function loadDB(){
  try {
    const res = await fetch('./exercises.json', { cache: 'no-store' });
    DB = await res.json();
  } catch (e) {
    console.error('Не удалось загрузить базу упражнений', e);
    DB = [];
  }
  renderDB(DB);
}

function attachEvents(){
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    if (!q) return renderDB(DB);
    const filtered = DB.filter(ex => (ex.name_ru || ex.name_en || '').toLowerCase().includes(q));
    renderDB(filtered);
  });
  dateEl.addEventListener('change', () => {
    updateHash();
    // try loading existing workout for the date to continue editing
    const exist = loadWorkout(dateEl.value);
    PLAN = [];
    planEl.innerHTML = '';
    if (exist && Array.isArray(exist.exercises)){
      exist.exercises.forEach(ex => {
        // reconstruct minimal ex meta for plan
        addToPlan({
          name_ru: ex.name_ru,
          name_en: ex.name_en,
          type: ex.type,
          groups: ex.groups || [],
          equipment: ex.equipment || []
        });
        // fill sets
        const lastAdded = PLAN[PLAN.length-1];
        lastAdded.sets = (ex.sets || []).map(s => ({ weight: s.weight, reps: s.reps }));
        // re-render sets UI for the last card
        const card = planEl.lastElementChild;
        const setsEl = card.querySelector('.sets');
        setsEl.innerHTML = '';
        lastAdded.sets.forEach((s, i) => {
          const row = document.createElement('div');
          row.className = 'set-row';
          row.innerHTML = \`
            <span>#\${i+1}</span>
            <input type="number" step="0.5" placeholder="Вес" value="\${s.weight ?? ''}" />
            <input type="number" step="1" placeholder="Повторы" value="\${s.reps ?? ''}" />
            <button data-i="\${i}" class="rm">×</button>
          \`;
          const [ , wEl, rEl, rm ] = row.children;
          wEl.addEventListener('input', () => { s.weight = parseFloat(wEl.value||'0'); });
          rEl.addEventListener('input', () => { s.reps = parseInt(rEl.value||'0',10); });
          rm.addEventListener('click', () => { lastAdded.sets.splice(i,1); /* simple refresh */ dateEl.dispatchEvent(new Event('change')); });
          setsEl.appendChild(row);
        });
      });
    }
  });
  $('#saveBtn').addEventListener('click', saveCurrent);
}

(async function init(){
  setDateFromHashOrToday();
  attachEvents();
  await loadDB();
  renderHistory();
  // Trigger load existing for default date
  dateEl.dispatchEvent(new Event('change'));
})();