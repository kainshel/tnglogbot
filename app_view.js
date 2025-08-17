import {DB, totalVolume} from './storage.js';
function param(n){ return new URLSearchParams(location.search).get(n) }
const id=param('id'); const w=DB.workouts.find(x=>x.id===id);
const title=document.getElementById('title'), histItems=document.getElementById('histItems'), repeatBtn=document.getElementById('repeatBtn');
if(!w){ title.textContent='Тренировка не найдена'; } else {
  title.textContent=`${w.title} — ${w.date} (объём: ${totalVolume(w)})`;
  w.items.forEach(i=>{ const tr=document.createElement('tr'); const sets=i.sets.map(s=>`${s.w||0}×${s.r||0}`).join(', ');
    const vol=i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0); tr.innerHTML=`<td>${i.name}</td><td>${sets}</td><td>${vol}</td>`; histItems.appendChild(tr); });
  repeatBtn.href=`workout.html#repeat=${w.id}`;
}
