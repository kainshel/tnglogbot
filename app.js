
// Улучшенная логика UI — GymKeeper-like
const STORAGE_KEY = 'tnglog_data_v2';

function uid(){ return Math.random().toString(36).slice(2,9); }
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
  try{ return JSON.parse(raw); } catch(e){ localStorage.removeItem(STORAGE_KEY); return loadData(); }
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

// Навигация между разделами
function on(sel, evt, fn){
  const el = qs(sel);
  if(el) el.addEventListener(evt, fn);
  else console.warn('Missing element for', sel);
}

// Боковое меню
on('#openSidebar', 'click', () => {
  qs('#sidebar').classList.add('open');
  qs('#closeSidebarDim').classList.add('open');
});
on('#closeSidebar', 'click', () => {
  qs('#sidebar').classList.remove('open');
  qs('#closeSidebarDim').classList.remove('open');
});
on('#closeSidebarDim', 'click', () => { // клик по затемнению
  qs('#sidebar').classList.remove('open');
  qs('#closeSidebarDim').classList.remove('open');
});

// Навигация по разделам
qsa('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.getAttribute('data-view');
    showView(view);
  });
});
function showView(name){
  qsa('.view').forEach(v => v.classList.add('hidden'));
  const el = document.querySelector(`#view-${name}`);
  if(el) el.classList.remove('hidden');
}

// Рендеринг списка упражнений
function renderExercises(filter=''){
  const wrap = qs('#exercise-list');
  wrap.innerHTML = '';
  const list = data.exercises.filter(ex => ex.name.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => b.created - a.created);
  list.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="exercise-thumb">
        <img src="${ex.gif}" alt="${ex.name}" />
      </div>
      <div class="exercise-name">${ex.name}</div>
    `;
    wrap.appendChild(card);
  });
}

// Стартовый рендеринг упражнений
renderExercises(); 

