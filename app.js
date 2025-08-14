// Simple GymKeeper (tables only) — no frameworks
const LS = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

const DB = {
  exKey: 'gk_exercises_v1',
  woKey: 'gk_workouts_v1',
  get exercises(){ return LS.get(this.exKey, defaultExercises()) },
  set exercises(v){ LS.set(this.exKey, v) },
  get workouts(){ return LS.get(this.woKey, []) },
  set workouts(v){ LS.set(this.woKey, v) }
};

function defaultExercises(){
  return [
    {id: uid(), name:'Жим лёжа', group:'Грудь'},
    {id: uid(), name:'Тяга верхнего блока', group:'Спина'},
    {id: uid(), name:'Приседания', group:'Ноги'},
    {id: uid(), name:'Жим гантелей сидя', group:'Плечи'},
    {id: uid(), name:'Подъём штанги на бицепс', group:'Руки'},
    {id: uid(), name:'Скручивания', group:'Пресс'}
  ];
}

function uid(){ return Math.random().toString(36).slice(2,9) }

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const toast = (msg)=>{
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1800);
};

// NAV
$$('.nav-btn').forEach(b=>b.addEventListener('click', e=>{
  $$('.nav-btn').forEach(x=>x.classList.remove('active'));
  e.currentTarget.classList.add('active');
  const tab = e.currentTarget.dataset.tab;
  $$('.tab').forEach(s=>s.classList.toggle('active', s.id===tab));
  if(tab==='calendar') renderCalendar();
  if(tab==='stats') renderStats();
}));

// EXERCISES
const exBody = $('#exercisesBody');
const exTpl = $('#exerciseRowTpl');
const search = $('#search');
const groupFilter = $('#groupFilter');
const addExerciseBtn = $('#addExercise');

function renderExercises(){
  const q = search.value.trim().toLowerCase();
  const g = groupFilter.value;
  exBody.innerHTML = '';
  DB.exercises
    .filter(e => (!q || e.name.toLowerCase().includes(q)) && (!g || e.group===g))
    .forEach(e => {
      const row = exTpl.content.firstElementChild.cloneNode(true);
      row.querySelector('.name').textContent = e.name;
      row.querySelector('.group').textContent = e.group;
      row.querySelector('.edit').onclick = ()=>{
        const name = prompt('Название упражнения:', e.name);
        const group = prompt('Группа (Грудь/Спина/Ноги/Плечи/Руки/Пресс):', e.group);
        if(name && group){
          e.name = name.trim(); e.group = group.trim();
          DB.exercises = DB.exercises.map(x=>x.id===e.id? e : x);
          renderAll();
        }
      };
      row.querySelector('.del').onclick = ()=>{
        if(confirm('Удалить упражнение?')){
          DB.exercises = DB.exercises.filter(x=>x.id!==e.id);
          renderAll();
        }
      };
      exBody.appendChild(row);
    });
}
search.oninput = renderExercises;
groupFilter.onchange = renderExercises;
addExerciseBtn.onclick = ()=>{
  const name = prompt('Новое упражнение:');
  if(!name) return;
  const group = prompt('Группа (Грудь/Спина/Ноги/Плечи/Руки/Пресс):','Руки');
  if(!group) return;
  DB.exercises = DB.exercises.concat({id: uid(), name: name.trim(), group: group.trim()});
  renderAll(); toast('Упражнение добавлено');
};

// WORKOUT builder
const pickList = $('#pickList');
const pickSearch = $('#pickSearch');
const pickGroup = $('#pickGroup');
const plan = $('#plan');
const planExerciseTpl = $('#planExerciseTpl');
const setRowTpl = $('#setRowTpl');
const saveBtn = $('#saveWorkout');
const clearBtn = $('#clearWorkout');
const workoutDate = $('#workoutDate');
const workoutTitle = $('#workoutTitle');

workoutDate.valueAsDate = new Date();

let planState = []; // [{id, name, sets:[{w,r}]}]

function renderPick(){
  const q = pickSearch.value.trim().toLowerCase();
  const g = pickGroup.value;
  pickList.innerHTML='';
  DB.exercises
    .filter(e => (!q || e.name.toLowerCase().includes(q)) && (!g || e.group===g))
    .forEach(e=>{
      const btn = $('#pickItemTpl').content.firstElementChild.cloneNode(true);
      btn.querySelector('.name').textContent = e.name;
      btn.querySelector('.group').textContent = e.group;
      btn.onclick = ()=>addToPlan(e);
      pickList.appendChild(btn);
    });
}
pickSearch.oninput = renderPick;
pickGroup.onchange = renderPick;

function addToPlan(ex){
  if(planState.find(x=>x.id===ex.id)){ toast('Уже в плане'); return; }
  planState.push({ id: ex.id, name: ex.name, sets: [] });
  renderPlan();
}
function renderPlan(){
  plan.innerHTML='';
  planState.forEach(item=>{
    const el = planExerciseTpl.content.firstElementChild.cloneNode(true);
    el.querySelector('.title').textContent = item.name;
    el.querySelector('.del').onclick = ()=>{ planState = planState.filter(x=>x.id!==item.id); renderPlan(); };
    const setsWrap = el.querySelector('.sets');
    const addSet = el.querySelector('.add-set');
    addSet.onclick = ()=>{ item.sets.push({w:null,r:null}); renderPlan(); };
    item.sets.forEach((s, i)=>{
      const row = setRowTpl.content.firstElementChild.cloneNode(true);
      row.querySelector('.n').textContent = i+1;
      const w = row.querySelector('.w'); const r = row.querySelector('.r');
      w.value = s.w ?? ''; r.value = s.r ?? '';
      w.oninput = ()=>{ s.w = Number(w.value); }; r.oninput = ()=>{ s.r = Number(r.value); };
      row.querySelector('.del').onclick = ()=>{ item.sets.splice(i,1); renderPlan(); };
      setsWrap.appendChild(row);
    });
    plan.appendChild(el);
  });
}
saveBtn.onclick = ()=>{
  if(planState.length===0){ toast('Добавьте упражнения'); return; }
  const date = workoutDate.value || new Date().toISOString().slice(0,10);
  const title = workoutTitle.value.trim() || 'Тренировка';
  const workout = { id: uid(), date, title, items: planState.map(x=>({exId:x.id, name:x.name, sets:x.sets.filter(s=>s.r>0)})) };
  DB.workouts = DB.workouts.concat(workout);
  planState = []; renderPlan(); toast('Тренировка сохранена');
};
clearBtn.onclick = ()=>{ planState=[]; renderPlan(); };

// CALENDAR
const calGrid = $('#calendarGrid');
const calTitle = $('#calTitle');
const prevMonth = $('#prevMonth');
const nextMonth = $('#nextMonth');
let cal = new Date(); cal.setDate(1);

function monthKey(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` }

function renderCalendar(){
  const y = cal.getFullYear(); const m = cal.getMonth();
  calTitle.textContent = new Date(y,m).toLocaleString('ru-RU',{month:'long',year:'numeric'});
  calGrid.innerHTML='';
  const first = new Date(y,m,1);
  const startDay = (first.getDay()+6)%7; // Mon=0
  const days = new Date(y, m+1, 0).getDate();
  for(let i=0;i<startDay;i++){ calGrid.appendChild(emptyCell()); }
  for(let d=1; d<=days; d++){
    const dateStr = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cell = document.createElement('div'); cell.className='cal-cell';
    const list = DB.workouts.filter(w=>w.date===dateStr);
    cell.innerHTML = `<div class="d">${d}</div>` + (list.length? `<div class="cal-badge">${list.length} трен.</div>` : '');
    if(list.length) cell.classList.add('has');
    cell.onclick = ()=>showDay(dateStr, list);
    calGrid.appendChild(cell);
  }
}
function emptyCell(){ const d=document.createElement('div'); d.className='cal-cell'; return d; }
$('#prevMonth').onclick = ()=>{ cal.setMonth(cal.getMonth()-1); renderCalendar(); };
$('#nextMonth').onclick = ()=>{ cal.setMonth(cal.getMonth()+1); renderCalendar(); };

const dayCard = $('#dayWorkoutsCard');
const dayTitle = $('#dayTitle');
const dayTbody = $('#dayWorkouts');
function showDay(dateStr, list){
  dayCard.hidden = false;
  dayTitle.textContent = `Тренировки за ${dateStr}`;
  dayTbody.innerHTML='';
  list.forEach(w=>{
    const tr = document.createElement('tr');
    const volume = w.items.reduce((acc,i)=>acc + i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0);
    tr.innerHTML = `<td>${w.title}</td><td>${volume}</td>`;
    const td = document.createElement('td');
    const open = document.createElement('button'); open.className='icon-btn'; open.textContent='Открыть';
    open.onclick = ()=>openWorkout(w.id);
    const del = document.createElement('button'); del.className='icon-btn'; del.textContent='Удалить';
    del.onclick = ()=>{ if(confirm('Удалить тренировку?')){ DB.workouts = DB.workouts.filter(x=>x.id!==w.id); renderAll(); } };
    td.append(open, del);
    tr.appendChild(td);
    dayTbody.appendChild(tr);
  });
}
function openWorkout(id){
  const w = DB.workouts.find(x=>x.id===id); if(!w) return;
  // Load into builder for editing
  $('.nav-btn[data-tab="workout"]').click();
  workoutDate.value = w.date; workoutTitle.value = w.title;
  planState = w.items.map(i=>({ id:i.exId, name:i.name, sets: i.sets.map(s=>({w:s.w,r:s.r})) }));
  renderPlan();
}

// STATS (tables only)
const statsMonthly = $('#statsMonthly');
const statsTop = $('#statsTop');
function renderStats(){
  // Monthly summary
  const byMonth = new Map();
  DB.workouts.forEach(w=>{
    const k = w.date.slice(0,7);
    const vol = w.items.reduce((acc,i)=>acc + i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0);
    const exSet = new Set(w.items.map(i=>i.name));
    if(!byMonth.has(k)) byMonth.set(k, {count:0, vol:0, ex:new Set()});
    const m = byMonth.get(k); m.count++; m.vol+=vol; exSet.forEach(e=>m.ex.add(e));
  });
  statsMonthly.innerHTML='';
  Array.from(byMonth.entries()).sort((a,b)=>a[0]<b[0]?-1:1).forEach(([k,v])=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${k}</td><td>${v.count}</td><td>${v.vol}</td><td>${v.ex.size}</td>`;
    statsMonthly.appendChild(tr);
  });

  // Top exercises
  const map = new Map();
  DB.workouts.forEach(w=>w.items.forEach(i=>{
    const vol = i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0);
    const m = map.get(i.name) || {count:0, vol:0};
    m.count++; m.vol += vol; map.set(i.name, m);
  }));
  statsTop.innerHTML='';
  Array.from(map.entries()).sort((a,b)=>b[1].vol-a[1].vol).slice(0,50).forEach(([name, v])=>{
    const tr = document.createElement('tr'); tr.innerHTML = `<td>${name}</td><td>${v.count}</td><td>${v.vol}</td>`;
    statsTop.appendChild(tr);
  });
}

// INITIAL RENDER
function renderAll(){ renderExercises(); renderPick(); renderPlan(); renderCalendar(); renderStats(); }
renderAll();

// PWA
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js'));
}
