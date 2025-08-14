// Shared storage + helpers
export const KEYS = {
  profile:'gk_profile_v1',
  ex:'gk_exercises_v3',
  wo:'gk_workouts_v3',
};
export const LS = {
  get(k, fb){ try{ return JSON.parse(localStorage.getItem(k)) ?? fb }catch{ return fb } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};
export const MUSCLE_GROUPS = {
  'Грудь': ['Верх','Середина','Низ','Внутренняя','Внешняя'],
  'Спина': ['Широчайшие','Трапеции','Ромбовидные','Разгибатели'],
  'Ноги': ['Квадрицепс','Бицепс бедра','Ягодичные','Икры','Приводящие'],
  'Плечи': ['Передняя дельта','Средняя дельта','Задняя дельта','Вращатели'],
  'Руки': ['Бицепс','Трицепс','Предплечья'],
  'Пресс': ['Верх','Низ','Косые','Кор'],
};
export const DB = {
  get profile(){ return LS.get(KEYS.profile, {name:'',age:'',gender:'',height:'',weight:'',avatar:''}) },
  set profile(v){ LS.set(KEYS.profile, v) },
  get exercises(){ return LS.get(KEYS.ex, defaultExercises()) },
  set exercises(v){ LS.set(KEYS.ex, v) },
  get workouts(){ return LS.get(KEYS.wo, []) },
  set workouts(v){ LS.set(KEYS.wo, v) }
};
export function uid(){ return Math.random().toString(36).slice(2,9) }
export function today(){ return new Date().toISOString().slice(0,10) }
export function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1600); }
export function totalVolume(w){ return w.items.reduce((acc,i)=>acc + i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0) }
export function defaultExercises(){
  return [
    {id: uid(), name:'Жим лёжа', group:'Грудь', subgroup:'Середина', gif:'https://media.tenor.com/3WZk8h3J2SgAAAAC/bench-press.gif'},
    {id: uid(), name:'Тяга верхнего блока', group:'Спина', subgroup:'Широчайшие', gif:'https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif'},
    {id: uid(), name:'Приседания', group:'Ноги', subgroup:'Квадрицепс', gif:'https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif'},
    {id: uid(), name:'Жим гантелей сидя', group:'Плечи', subgroup:'Передняя дельта', gif:'https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif'},
    {id: uid(), name:'Подъём штанги на бицепс', group:'Руки', subgroup:'Бицепс', gif:'https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif'},
    {id: uid(), name:'Скручивания', group:'Пресс', subgroup:'Верх', gif:'https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif'}
  ];
}

// export/import global handlers on every page
window.addEventListener('DOMContentLoaded', ()=>{
  const exp = document.getElementById('exportBtn');
  const imp = document.getElementById('importInput');
  if(exp){
    exp.onclick = ()=>{
      const data = {version:3, exportedAt:new Date().toISOString(), profile:DB.profile, exercises:DB.exercises, workouts:DB.workouts};
      const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='gymkeeper_backup.json'; a.click();
      URL.revokeObjectURL(a.href);
    };
  }
  if(imp){
    imp.addEventListener('change', async (e)=>{
      const file = e.target.files[0]; if(!file) return;
      try{
        const data = JSON.parse(await file.text());
        if(data.profile) DB.profile = data.profile;
        if(Array.isArray(data.exercises)) DB.exercises = data.exercises;
        if(Array.isArray(data.workouts)) DB.workouts = data.workouts;
        alert('Импорт завершён. Обновите страницу.');
      }catch{ alert('Не удалось импортировать JSON'); }
      e.target.value='';
    });
  }
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }
});
