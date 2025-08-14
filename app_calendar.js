import {DB, totalVolume} from './storage.js';
const calGrid=document.getElementById('calendarGrid'), calTitle=document.getElementById('calTitle');
const dayCard=document.getElementById('dayWorkoutsCard'), dayTitle=document.getElementById('dayTitle'), dayTbody=document.getElementById('dayWorkouts');
const prevMonth=document.getElementById('prevMonth'), nextMonth=document.getElementById('nextMonth');
let cal=new Date(); cal.setDate(1);
function renderCalendar(){ const y=cal.getFullYear(), m=cal.getMonth(); calTitle.textContent=new Date(y,m).toLocaleString('ru-RU',{month:'long',year:'numeric'}); calGrid.innerHTML='';
  const first=new Date(y,m,1), start=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate();
  for(let i=0;i<start;i++){ calGrid.appendChild(empty()); } for(let d=1; d<=days; d++){ const dateStr=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cell=document.createElement('div'); cell.className='cal-cell'; const list=DB.workouts.filter(w=>w.date===dateStr);
    cell.innerHTML=`<div class="d">${d}</div>` + (list.length? `<div class="cal-badge">${list.length} трен.</div>`:'');
    if(list.length) cell.classList.add('has'); cell.onclick=()=>showDay(dateStr, list); calGrid.appendChild(cell); } }
function empty(){ const d=document.createElement('div'); d.className='cal-cell'; return d }
function showDay(dateStr,list){ dayCard.hidden=false; dayTitle.textContent=`Тренировки за ${dateStr}`; dayTbody.innerHTML='';
  list.forEach(w=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${w.date}</td><td>${totalVolume(w)}</td>`;
    const td=document.createElement('td'); const open=document.createElement('a'); open.className='icon-btn'; open.textContent='Открыть'; open.href=`view.html?id=${w.id}`;
    const del=document.createElement('button'); del.className='icon-btn'; del.textContent='Удалить'; del.onclick=()=>{ if(confirm('Удалить?')){ DB.workouts=DB.workouts.filter(x=>x.id!==w.id); renderCalendar(); dayCard.hidden=true; } };
    td.append(open,del); tr.appendChild(td); dayTbody.appendChild(tr); }); }
prevMonth.onclick=()=>{ cal.setMonth(cal.getMonth()-1); renderCalendar(); }; nextMonth.onclick=()=>{ cal.setMonth(cal.getMonth()+1); renderCalendar(); }; renderCalendar();
