import {DB, MUSCLE_GROUPS, toast, uid} from './storage.js';
const exBody=document.getElementById('exercisesBody'), exTpl=document.getElementById('exerciseRowTpl');
const search=document.getElementById('search'), groupFilter=document.getElementById('groupFilter'), subgroupFilter=document.getElementById('subgroupFilter');
const addBtn=document.getElementById('addExercise'); const modalBack=document.getElementById('modalBack'); const modal=document.getElementById('modal');
Object.keys(MUSCLE_GROUPS).forEach(g=>{ const o=document.createElement('option'); o.value=g;o.textContent=g; groupFilter.appendChild(o); });
groupFilter.onchange=()=>{ fillSub(); render(); }; subgroupFilter.onchange=render; search.oninput=render;
function fillSub(){ const g=groupFilter.value; subgroupFilter.innerHTML='<option value=\"\">Все подгруппы</option>'; const subs=MUSCLE_GROUPS[g]||[]; subs.forEach(s=>{ const o=document.createElement('option'); o.value=s;o.textContent=s; subgroupFilter.appendChild(o); }); subgroupFilter.disabled=subs.length===0; }
fillSub();
function render(){ const q=search.value.trim().toLowerCase(); const g=groupFilter.value, sg=subgroupFilter.value; exBody.innerHTML=''; DB.exercises.filter(e=>(!q||e.name.toLowerCase().includes(q))&&(!g||e.group===g)&&(!sg||e.subgroup===sg)).forEach(e=>{
  const row=exTpl.content.firstElementChild.cloneNode(true); const img=row.querySelector('img'); img.src=e.gif||'icon.png'; img.alt=e.name;
  row.querySelector('.name').textContent=e.name; row.querySelector('.group').textContent=e.group; row.querySelector('.subgroup').textContent=e.subgroup||'—'; row.querySelector('.gif').textContent=e.gif||'—';
  row.querySelector('.view').onclick=()=>view(e); row.querySelector('.edit').onclick=()=>edit(e); row.querySelector('.del').onclick=()=>{ if(confirm('Удалить?')){ DB.exercises=DB.exercises.filter(x=>x.id!==e.id); render(); } };
  exBody.appendChild(row);
}); }
render();
addBtn.onclick=()=>edit();
function edit(ex=null){ modal.innerHTML=''; const h=el('h3', ex?'Редактировать упражнение':'Новое упражнение'); const form=div('row wrap');
  const name=input('Название', ex?.name||''); const groupSel=select(Object.keys(MUSCLE_GROUPS), ex?.group||''); const subSel=select(MUSCLE_GROUPS[groupSel.value]||[], ex?.subgroup||'');
  groupSel.addEventListener('change',()=>{ updateSelect(subSel, MUSCLE_GROUPS[groupSel.value]||[], ''); });
  const gif=input('GIF URL', ex?.gif||''); const desc=textarea('Описание', ex?.description||'');
  const save=button('Сохранить','btn'), cancel=button('Отмена','btn ghost');
  save.onclick=()=>{ const obj={id:ex?.id||uid(), name:name.value.trim(), group:groupSel.value, subgroup:subSel.value, gif:gif.value.trim(), description:desc.value.trim()};
    if(!obj.name) return alert('Введите название'); if(ex){ DB.exercises=DB.exercises.map(x=>x.id===ex.id?obj:x);} else { DB.exercises=DB.exercises.concat(obj);} close(); render(); toast('Сохранено'); };
  cancel.onclick=close; [name,groupSel,subSel,gif,desc,save,cancel].forEach(el=>form.appendChild(el)); modal.append(h,form); open(); }
function view(e){ modal.innerHTML=''; const h=el('h3',e.name); const row=div('row wrap');
  const image=new Image(); image.src=e.gif||'icon.png'; image.style.maxWidth='280px'; image.style.borderRadius='12px'; image.style.border='1px solid var(--border)';
  const text=div(); text.innerHTML=`<div class="badge">${e.group}</div> <div class="badge">${e.subgroup||'—'}</div><p style="margin-top:8px;white-space:pre-wrap">${e.description||'Описание не добавлено.'}</p>`;
  const closeBtn=button('Закрыть','btn'); closeBtn.onclick=close; row.append(image,text); modal.append(h,row,closeBtn); open(); }
function open(){ document.getElementById('modalBack').style.display='flex'; } function close(){ document.getElementById('modalBack').style.display='none'; }
document.getElementById('modalBack').addEventListener('click',(e)=>{ if(e.target.id==='modalBack') close(); });
// helpers
function el(t,txt){ const e=document.createElement(t); if(txt) e.textContent=txt; return e } function div(cls){ const d=document.createElement('div'); if(cls) d.className=cls; return d }
function input(ph,val){ const i=document.createElement('input'); i.placeholder=ph; i.value=val; return i }
function textarea(ph,val){ const t=document.createElement('textarea'); t.placeholder=ph; t.value=val; return t }
function select(opts,selected){ const s=document.createElement('select'); updateSelect(s,opts,selected); return s }
function updateSelect(sel, arr, selected){ sel.innerHTML=''; arr.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; sel.appendChild(o); }); sel.value=selected||''; }
function button(txt, cls){ const b=document.createElement('button'); b.textContent=txt; b.className=cls; return b }
