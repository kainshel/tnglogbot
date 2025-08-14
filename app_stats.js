import {DB} from './storage.js';
const statsMonthly=document.getElementById('statsMonthly');
function render(){ const byMonth=new Map(); DB.workouts.forEach(w=>{ const key=w.date.slice(0,7);
  const vol=w.items.reduce((acc,i)=>acc+i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0); const exSet=new Set(w.items.map(i=>i.name));
  if(!byMonth.has(key)) byMonth.set(key,{count:0,vol:0,ex:new Set()}); const m=byMonth.get(key); m.count++; m.vol+=vol; exSet.forEach(e=>m.ex.add(e)); });
  statsMonthly.innerHTML=''; Array.from(byMonth.entries()).sort((a,b)=>a[0]<b[0]?-1:1).forEach(([k,v])=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${k}</td><td>${v.count}</td><td>${v.vol}</td><td>${v.ex.size}</td>`; statsMonthly.appendChild(tr); }); }
render();
