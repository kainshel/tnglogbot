import {DB, MUSCLE_GROUPS, toast} from './storage.js';

const exBody = document.getElementById('exercisesBody');
const exTpl = document.getElementById('exerciseRowTpl');
const search = document.getElementById('search');
const groupFilter = document.getElementById('groupFilter');
const subgroupFilter = document.getElementById('subgroupFilter');
const addBtn = document.getElementById('addExercise');

// fill filters
Object.keys(MUSCLE_GROUPS).forEach(g=>{ const o=document.createElement('option'); o.value=g;o.textContent=g; groupFilter.appendChild(o); });
groupFilter.onchange = ()=>{ fillSub(); render(); };
subgroupFilter.onchange = render;
search.oninput = render;

function fillSub(){
  const g = groupFilter.value;
  subgroupFilter.innerHTML = '<option value=\"\">Все подгруппы</option>';
  const subs = MUSCLE_GROUPS[g]||[]; subs.forEach(s=>{ const o=document.createElement('option'); o.value=s;o.textContent=s; subgroupFilter.appendChild(o); });
  subgroupFilter.disabled = subs.length===0;
}
fillSub();

function render(){
  const q = search.value.trim().toLowerCase();
  const g = groupFilter.value; const sg = subgroupFilter.value;
  exBody.innerHTML='';
  DB.exercises
    .filter(e=>(!q || e.name.toLowerCase().includes(q)) && (!g || e.group===g) && (!sg || e.subgroup===sg))
    .forEach(e=>{
      const row = exTpl.content.firstElementChild.cloneNode(true);
      const img=row.querySelector('img'); img.src=e.gif||'icon.png'; img.alt=e.name;
      row.querySelector('.name').textContent = e.name;
      row.querySelector('.group').textContent = e.group;
      row.querySelector('.subgroup').textContent = e.subgroup||'—';
      row.querySelector('.gif').textContent = e.gif || '—';
      row.querySelector('.edit').onclick = ()=>edit(e);
      row.querySelector('.del').onclick = ()=>{ if(confirm('Удалить?')){ DB.exercises = DB.exercises.filter(x=>x.id!==e.id); render(); } };
      exBody.appendChild(row);
    });
}
render();

addBtn.onclick = ()=>edit();
function edit(ex=null){
  const name = prompt('Название упражнения:', ex?.name||'');
  if(!name) return;
  const group = prompt('Группа (например: Плечи):', ex?.group||'');
  const subgroup = prompt('Подгруппа (например: Средняя дельта):', ex?.subgroup||'');
  const gif = prompt('Ссылка на GIF/изображение:', ex?.gif||'');
  if(ex){
    ex.name=name.trim(); ex.group=group.trim(); ex.subgroup=subgroup.trim(); ex.gif=gif.trim();
    DB.exercises = DB.exercises.map(x=>x.id===ex.id? ex : x);
  }else{
    DB.exercises = DB.exercises.concat({id:Math.random().toString(36).slice(2,9), name:name.trim(), group:group.trim(), subgroup:subgroup.trim(), gif:gif.trim()});
  }
  render(); toast('Сохранено');
}
