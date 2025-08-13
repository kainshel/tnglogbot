
// Улучшенная логика UI — GymKeeper-like
const STORAGE_KEY = 'tnglog_data_v2';

function uid(){return Math.random().toString(36).slice(2,9);}
function qs(s){ return document.querySelector(s); }
function qsa(s){ return Array.from(document.querySelectorAll(s)); }

let data = loadData();
let editorEntries = [];

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    const initial = {
      profiles: {},
      exercises: [
        { id: uid(), name:'Приседания', gif:'', created: Date.now() },
        { id: uid(), name:'Жим лёжа', gif:'', created: Date.now() }
      ],
      workouts: []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try{return JSON.parse(raw);}catch(e){localStorage.removeItem(STORAGE_KEY); return loadData();}
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

/* ---------- Navigation ---------- */
qsa('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    qsa('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.getAttribute('data-view');
    showView(view);
  });
});
function showView(name){
  qsa('.view').forEach(v=> v.classList.add('hidden'));
  const sel = `.view--${name}`;
  const el = document.querySelector(sel);
  if(el) el.classList.remove('hidden');
}

/* ---------- Render ---------- */
function renderAll(){
  qs('#bot-username').textContent = BOT_CONFIG.bot_username;
  renderExercises();
  renderExerciseSelect();
  renderEditor();
  renderHistory();
  renderProfile();
}
function renderExercises(filter=''){
  const wrap = qs('#exercise-list');
  wrap.innerHTML = '';
  const list = data.exercises.filter(ex=> ex.name.toLowerCase().includes(filter.toLowerCase())).sort((a,b)=> b.created - a.created);
  list.forEach(ex=>{
    const card = document.createElement('div'); card.className='card';
    const thumb = document.createElement('div'); thumb.className='exercise-thumb';
    if(ex.gif && ex.gif.startsWith('data:video')){
      const v = document.createElement('video'); v.src=ex.gif; v.autoplay=true; v.loop=true; v.muted=true; v.playsInline=true;
      thumb.appendChild(v);
    } else {
      const img = document.createElement('img'); img.src = ex.gif || placeholderDataUrl(); img.alt = ex.name; thumb.appendChild(img);
    }
    const h = document.createElement('h3'); h.textContent = ex.name;
    const btns = document.createElement('div'); btns.className='row';
    const btnAdd = document.createElement('button'); btnAdd.textContent='В редактор'; btnAdd.onclick=()=> { addExerciseToEditor(ex); showView('workout'); qsa('.nav-btn').forEach(b=>b.classList.remove('active')); document.querySelector('.nav-btn[data-view="workout"]').classList.add('active'); };
    const btnDel = document.createElement('button'); btnDel.textContent='Удалить'; btnDel.onclick=()=>{ if(confirm('Удалить упражнение?')){ data.exercises = data.exercises.filter(e=>e.id!==ex.id); saveData(); renderAll(); } };
    btns.appendChild(btnAdd); btns.appendChild(btnDel);
    card.appendChild(thumb); card.appendChild(h); card.appendChild(btns);
    wrap.appendChild(card);
  });
}
function renderExerciseSelect(){
  const sel = qs('#select-exercise'); sel.innerHTML='';
  data.exercises.forEach(ex=>{ const o = document.createElement('option'); o.value=ex.id; o.textContent=ex.name; sel.appendChild(o); });
}
function renderEditor(){
  const wrap = qs('#workout-exercises'); wrap.innerHTML='';
  editorEntries.forEach((en, idx)=>{
    const card = document.createElement('div'); card.className='card';
    const thumb = document.createElement('div'); thumb.className='exercise-thumb';
    const img = document.createElement('img'); img.src = en.gif || placeholderDataUrl();
    thumb.appendChild(img);
    const title = document.createElement('h3'); title.textContent = en.name;
    const setsWrap = document.createElement('div'); setsWrap.className='sets';
    en.sets.forEach((s, si)=>{
      const sr = document.createElement('div'); sr.className='set-row';
      const lbl = document.createElement('div'); lbl.className='small'; lbl.textContent='Подход '+(si+1);
      const inpW = document.createElement('input'); inpW.placeholder='Вес'; inpW.value = s.weight || '';
      const inpR = document.createElement('input'); inpR.placeholder='Повторы'; inpR.value = s.reps || '';
      inpW.addEventListener('input', e=> s.weight = e.target.value);
      inpR.addEventListener('input', e=> s.reps = e.target.value);
      const add = document.createElement('button'); add.textContent='+'; add.onclick = ()=> { en.sets.push({weight:'', reps:''}); renderEditor(); };
      const del = document.createElement('button'); del.textContent='-'; del.onclick = ()=> { if(en.sets.length>1) en.sets.splice(si,1); renderEditor(); };
      sr.append(lbl, inpW, inpR, add, del);
      setsWrap.appendChild(sr);
    });
    const actions = document.createElement('div'); actions.className='row';
    const rem = document.createElement('button'); rem.textContent='Удалить'; rem.onclick = ()=> { editorEntries.splice(idx,1); renderEditor(); };
    actions.append(rem);
    card.appendChild(thumb); card.appendChild(title); card.appendChild(setsWrap); card.appendChild(actions);
    wrap.appendChild(card);
  });
}

/* ---------- History ---------- */
function renderHistory(){
  const wrap = qs('#history-list'); wrap.innerHTML='';
  if(!data.workouts.length){ wrap.innerHTML = '<div class="small">Нет сохранённых тренировок</div>'; return; }
  const sorted = data.workouts.slice().sort((a,b)=> b.date.localeCompare(a.date));
  sorted.forEach(w=>{
    const card = document.createElement('div'); card.className='card';
    const h = document.createElement('h3'); h.textContent = w.date + ' — ' + weekdayName(w.weekday);
    card.appendChild(h);
    w.entries.forEach(en=>{
      const p = document.createElement('div'); p.className='small'; p.textContent = en.name + ' — ' + en.sets.length + ' подходов';
      card.appendChild(p);
    });
    const btn = document.createElement('button'); btn.textContent='Открыть'; btn.onclick = ()=> openWorkoutModal(w);
    card.appendChild(btn);
    wrap.appendChild(card);
  });
}

/* ---------- Profile ---------- */
let currentProfileId = null;
function renderProfile(){
  const view = qs('#profile-view'); view.innerHTML='';
  if(currentProfileId && data.profiles[currentProfileId]){
    const p = data.profiles[currentProfileId];
    view.innerHTML = `<div class="small">Имя: <strong>${escapeHtml(p.name)}</strong></div><div class="small">Вес: <strong>${p.weight} кг</strong></div>`;
  } else {
    view.innerHTML = '<div class="small">Профиль не создан</div>';
  }
}

/* ---------- Actions / Events ---------- */
qs('#exercise-form').addEventListener('submit', async e=>{
  e.preventDefault();
  const name = qs('#exercise-name').value.trim();
  const file = qs('#exercise-gif').files[0];
  if(!name) return alert('Введите название');
  let gif = '';
  if(file) gif = await fileToDataUrl(file);
  data.exercises.push({ id: uid(), name, gif, created: Date.now() });
  saveData(); qs('#exercise-form').reset(); renderAll();
});

qs('#btn-add-ex-to-workout').addEventListener('click', e=>{
  e.preventDefault();
  const id = qs('#select-exercise').value;
  const ex = data.exercises.find(x=>x.id===id);
  if(ex) addExerciseToEditor(ex);
});
function addExerciseToEditor(ex){
  editorEntries.push({ exerciseId: ex.id, name: ex.name, gif: ex.gif, sets:[{weight:'', reps:''}] });
  renderEditor();
}

qs('#save-workout').addEventListener('click', ()=>{
  const date = qs('#workout-date').value || (new Date()).toISOString().slice(0,10);
  const weekday = Number(qs('#workout-weekday').value || new Date().getDay());
  if(editorEntries.length===0) return alert('Добавьте упражнение в тренировку');
  const w = { id: uid(), date, weekday, entries: JSON.parse(JSON.stringify(editorEntries)) };
  data.workouts.push(w); saveData(); editorEntries = []; renderAll(); alert('Тренировка сохранена');
});

qs('#clear-editor').addEventListener('click', ()=>{ editorEntries = []; renderEditor(); });

qs('#export-data').addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download='tnglog_export.json'; a.click(); URL.revokeObjectURL(url);
});
qs('#import-data').addEventListener('click', ()=> qs('#import-file').click());
qs('#import-file').addEventListener('change', e=>{
  const f = e.target.files[0]; if(!f) return;
  const reader = new FileReader(); reader.onload = ()=>{
    try{ data = JSON.parse(reader.result); saveData(); renderAll(); alert('Импорт завершён'); }catch(err){ alert('Ошибка при импорте: '+err.message); }
  }; reader.readAsText(f);
});

qs('#profile-form').addEventListener('submit', e=>{
  e.preventDefault(); const name = qs('#profile-name').value.trim(); const weight = Number(qs('#profile-weight').value);
  if(!name) return alert('Введите имя'); const id = uid(); currentProfileId = id; data.profiles[id] = { id, name, weight }; saveData(); renderAll();
});

qs('#search').addEventListener('input', e=> renderExercises(e.target.value) );

/* ---------- Utils ---------- */

function fileToDataUrl(file){
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=()=>rej(r.error); r.readAsDataURL(file); });
}
function placeholderDataUrl(){ return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAABkCAYAAABs8b5VAAAAAklEQVR4AewaftIAAAGBSURBVO3BQY4AAAgDoJvc/6cN4wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMc9AAEwQv7LAAAAAElFTkSuQmCC'; }
function escapeHtml(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function weekdayName(n){ return ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'][n] || ''; }
function openWorkoutModal(w){
  let txt = w.date + ' — ' + weekdayName(w.weekday) + '\n';
  w.entries.forEach(en=>{ txt += '\n'+en.name+'\n'; en.sets.forEach((s,i)=> txt += `  Подход ${i+1}: ${s.weight||'-'} кг x ${s.reps||'-'} повторов\n`); });
  alert(txt);
}

/* ---------- Init ---------- */
renderAll();
showView('workout');


/* ---------- Mobile: burger toggle ---------- */
document.getElementById('toggle-sidebar')?.addEventListener('click', ()=>{
  document.querySelector('.sidebar')?.classList.toggle('open');
});

/* ---------- Calendar ---------- */
let cal = (function(){
  const st = { year: new Date().getFullYear(), month: new Date().getMonth() }; // month 0-11
  function fmtMonth(y,m){ return new Date(y,m,1).toLocaleDateString('ru-RU', { month:'long', year:'numeric' }); }
  function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
  function pad(n){ return n<10? '0'+n : ''+n; }
  function dateStr(y,m,d){ return y + '-' + pad(m+1) + '-' + pad(d); }
  function render(){
    const title = document.getElementById('cal-title'); if(title) title.textContent = fmtMonth(st.year, st.month);
    const grid = document.getElementById('calendar-grid'); if(!grid) return;
    grid.innerHTML = '';
    const first = new Date(st.year, st.month, 1);
    let startWeekday = (first.getDay()+6)%7; // convert to Mon=0
    const total = daysInMonth(st.year, st.month);
    const todayStr = (new Date()).toISOString().slice(0,10);
    // headers
    ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(h=>{
      const hd = document.createElement('div'); hd.className='small muted'; hd.style.textAlign='center'; hd.textContent=h; grid.appendChild(hd);
    });
    // blank leading cells (week header already filled, so adjust)
    for(let i=0;i<startWeekday;i++){ const e=document.createElement('div'); grid.appendChild(e); }
    for(let d=1; d<=total; d++){
      const cell = document.createElement('div'); cell.className='day';
      const ds = dateStr(st.year, st.month, d);
      if(ds===todayStr) cell.classList.add('today');
      const dayWorkouts = (data.workouts||[]).filter(w=> w.date===ds);
      if(dayWorkouts.length) cell.classList.add('has-workout');
      const num = document.createElement('div'); num.className='dnum'; num.textContent = d;
      cell.appendChild(num);
      dayWorkouts.slice(0,3).forEach(w=>{
        const b = document.createElement('div'); b.className='badge'; b.textContent = (w.entries?.length||0) + ' упр.';
        cell.appendChild(b);
      });
      cell.addEventListener('click', ()=> openDay(ds));
      grid.appendChild(cell);
    }
    const prev = document.getElementById('cal-prev'); const next = document.getElementById('cal-next');
    prev?.addEventListener('click', ()=>{ st.month--; if(st.month<0){st.month=11; st.year--;} render(); });
    next?.addEventListener('click', ()=>{ st.month++; if(st.month>11){st.month=0; st.year++;} render(); });
  }
  function openDay(ds){
    const cont = document.getElementById('calendar-detail'); if(!cont) return;
    cont.innerHTML = '<h3>'+ ds +'</h3>';
    const todayWorkouts = (data.workouts||[]).filter(w=> w.date===ds);
    if(!todayWorkouts.length){
      const p = document.createElement('div'); p.className='muted'; p.textContent='Нет тренировок на эту дату';
      const btn = document.createElement('button'); btn.className='primary'; btn.textContent='Запланировать тренировку'; 
      btn.onclick = ()=>{ document.getElementById('workout-date').value = ds; document.querySelector('.nav-btn[data-view="workout"]').click(); };
      cont.append(p, btn);
      return;
    }
    todayWorkouts.forEach(w=>{
      const card = document.createElement('div'); card.className='card';
      const h = document.createElement('h3'); h.textContent = 'Тренировка ('+ (w.entries?.length||0) +' упр.)';
      const small = document.createElement('div'); small.className='small muted'; small.textContent = 'День недели: ' + weekdayName(w.weekday);
      card.append(h, small);
      w.entries.forEach(en=>{
        const p = document.createElement('div'); p.className='small'; p.textContent = en.name + ' — ' + en.sets.length + ' подходов';
        card.appendChild(p);
      });
      const btn = document.createElement('button'); btn.textContent='Открыть'; btn.onclick = ()=> openWorkoutModal(w);
      card.appendChild(btn);
      cont.appendChild(card);
    });
  }
  return { render };
})();

/* ---------- Stats ---------- */
function computeVolume(workout){
  let vol = 0;
  (workout.entries||[]).forEach(en=> (en.sets||[]).forEach(s=>{
    const w = parseFloat(s.weight||0)||0, r = parseFloat(s.reps||0)||0; vol += w*r;
  }));
  return vol;
}
function weekKey(dateStr){
  const d = new Date(dateStr+'T00:00:00'); // local
  const firstThu = new Date(d.getFullYear(),0,1);
  while(firstThu.getDay()!==4){ firstThu.setDate(firstThu.getDate()+1); }
  const ms = d - firstThu; const week = Math.floor(ms/ (7*24*3600*1000)) + 1;
  return d.getFullYear() + '-W' + String(week).padStart(2,'0');
}
function renderStats(){
  const canvas = document.getElementById('stats-volume'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const daily = {};
  (data.workouts||[]).forEach(w=>{ daily[w.date] = (daily[w.date]||0) + computeVolume(w); });
  const days = Object.keys(daily).sort();
  const vals = days.map(d=> daily[d]);
  const max = Math.max(10, ...vals);
  // margins
  const m = {l:40, r:10, t:10, b:26};
  const w = canvas.width - m.l - m.r;
  const h = canvas.height - m.t - m.b;
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.moveTo(m.l, m.t + h); ctx.lineTo(m.l, m.t); ctx.lineTo(m.l+w, m.t); ctx.stroke();
  if(days.length){
    const step = w / Math.max(1, days.length-1);
    ctx.beginPath();
    days.forEach((d,i)=>{
      const x = m.l + step*i;
      const y = m.t + h - (daily[d]/max)*h;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = 'rgba(124,92,255,0.9)'; ctx.lineWidth=2; ctx.stroke();
    // dots
    days.forEach((d,i)=>{
      const x = m.l + step*i;
      const y = m.t + h - (daily[d]/max)*h;
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill();
    });
    // labels
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='12px sans-serif';
    const every = Math.ceil(days.length/7);
    days.forEach((d,i)=>{ if(i%every===0){ ctx.fillText(d.slice(5), m.l + step*i - 10, m.t + h + 16); } });
  }else{
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='14px sans-serif'; ctx.fillText('Нет данных. Сохраните тренировку.', 20, 40);
  }
  // top exercises
  const topWrap = document.getElementById('stats-top-exercises'); if(topWrap){ 
    topWrap.innerHTML='';
    const counts = {};
    (data.workouts||[]).forEach(w=> w.entries.forEach(en=>{ counts[en.name]=(counts[en.name]||0)+1; }));
    const arr = Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,9);
    arr.forEach(([name,cnt])=>{
      const div = document.createElement('div'); div.className='card'; div.innerHTML = '<h4>'+ name +'</h4><div class="small muted">'+cnt+' раз</div>';
      topWrap.appendChild(div);
    });
  }
}


// Hook into renderAll
const _renderAll_orig = renderAll;
renderAll = function(){
  _renderAll_orig();
  cal.render();
  renderStats();
};
