import {DB, MUSCLE_GROUPS, uid, today, toast} from './storage.js';

const workoutDate = document.getElementById('workoutDate');
workoutDate.valueAsDate = new Date();

const pickSearch = document.getElementById('pickSearch');
const pickGroup = document.getElementById('pickGroup');
const pickSubgroup = document.getElementById('pickSubgroup');
const results = document.getElementById('results');
const plan = document.getElementById('plan');
const saveBtn = document.getElementById('saveWorkout');
const clearBtn = document.getElementById('clearWorkout');

Object.keys(MUSCLE_GROUPS).forEach(g=>{ const o=document.createElement('option'); o.value=g;o.textContent=g; pickGroup.appendChild(o); });
pickGroup.onchange = ()=>{ fillSub(); searchRender(); };
pickSubgroup.onchange = searchRender;
pickSearch.oninput = searchRender;

function fillSub(){
  const g = pickGroup.value;
  pickSubgroup.innerHTML = '<option value=\"\">Все подгруппы</option>';
  const subs = MUSCLE_GROUPS[g]||[]; subs.forEach(s=>{ const o=document.createElement('option'); o.value=s;o.textContent=s; pickSubgroup.appendChild(o); });
  pickSubgroup.disabled = subs.length===0;
}
fillSub();

function searchRender(){
  const q = pickSearch.value.trim().toLowerCase();
  const g = pickGroup.value; const sg = pickSubgroup.value;
  const subset = DB.exercises.filter(e=>(!q || e.name.toLowerCase().includes(q)) && (!g || e.group===g) && (!sg || e.subgroup===sg)).slice(0,50);
  results.innerHTML='';
  subset.forEach(e=>{
    const btn = document.getElementById('pickItemTpl').content.firstElementChild.cloneNode(true);
    btn.querySelector('.name').textContent = e.name;
    btn.querySelector('.group').textContent = e.group;
    btn.querySelector('.subgroup').textContent = e.subgroup||'—';
    btn.querySelector('img').src = e.gif||'icon.png';
    btn.onclick = ()=>addToPlan(e);
    results.appendChild(btn);
  });
}
searchRender();

let planState = []; // {id,name,gif,sets:[]}
function addToPlan(ex){
  if(planState.find(x=>x.id===ex.id)){ toast('Уже в плане'); return; }
  planState.push({id:ex.id, name:ex.name, gif:ex.gif, sets:[]});
  renderPlan();
}
function renderPlan(){
  plan.innerHTML='';
  planState.forEach(item=>{
    const tpl = document.getElementById('planExerciseTpl').content.firstElementChild.cloneNode(true);
    tpl.querySelector('.t').textContent=item.name;
    const img=tpl.querySelector('img'); img.src=item.gif||'icon.png';
    tpl.querySelector('.del').onclick = ()=>{ planState=planState.filter(x=>x.id!==item.id); renderPlan(); };
    const setsWrap=tpl.querySelector('.sets'); const add=tpl.querySelector('.add-set');
    add.onclick = ()=>{ item.sets.push({w:null,r:null}); renderPlan(); };
    item.sets.forEach((s,i)=>{
      const row=document.getElementById('setRowTpl').content.firstElementChild.cloneNode(true);
      row.querySelector('.n').textContent=i+1;
      const w=row.querySelector('.w'); const r=row.querySelector('.r');
      w.value=s.w??''; r.value=s.r??'';
      w.oninput=()=>{ s.w = Number(w.value) }; r.oninput=()=>{ s.r=Number(r.value) };
      row.querySelector('.del').onclick=()=>{ item.sets.splice(i,1); renderPlan(); };
      setsWrap.appendChild(row);
    });
    plan.appendChild(tpl);
  });
}

saveBtn.onclick = ()=>{
  if(planState.length===0){ toast('Добавьте упражнения'); return; }
  const date = workoutDate.value || today();
  const autoTitle = `Тренировка ${date}`;
  const workout = { id: uid(), date, title:autoTitle, items: planState.map(x=>({exId:x.id, name:x.name, gif:x.gif, sets:x.sets.filter(s=>Number(s.r)>0)})) };
  DB.workouts = DB.workouts.concat(workout);
  planState=[]; renderPlan(); toast('Сохранено');
};
clearBtn.onclick = ()=>{ planState=[]; renderPlan(); };
