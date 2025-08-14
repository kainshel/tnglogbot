import {DB, totalVolume, toast} from './storage.js';

function param(name){ return new URLSearchParams(location.search).get(name) }
const id = param('id');
const w = DB.workouts.find(x=>x.id===id);
const title = document.getElementById('title');
const histItems = document.getElementById('histItems');
const repeatBtn = document.getElementById('repeatBtn');

if(!w){ title.textContent='Тренировка не найдена'; }
else{
  title.textContent = `${w.title} — ${w.date} (объём: ${totalVolume(w)})`;
  w.items.forEach(i=>{
    const tr=document.createElement('tr');
    const setsStr=i.sets.map(s=>`${s.w||0}×${s.r||0}`).join(', ');
    const vol=i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0);
    tr.innerHTML=`<td>${i.name}</td><td>${setsStr}</td><td>${vol}</td>`;
    histItems.appendChild(tr);
  });
  repeatBtn.href = `workout.html#repeat=${w.id}`;
}

