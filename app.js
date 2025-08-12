
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
