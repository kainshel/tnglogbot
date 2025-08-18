
// ---- Safe localStorage patch (auto-injected) ----
(function(){
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    const _remove = localStorage.removeItem.bind(localStorage);
    const _clear = localStorage.clear.bind(localStorage);
    localStorage.setItem = function(k,v){ try { return _set(k,v); } catch(e){ console.error('localStorage.setItem error', e); } };
    localStorage.getItem = function(k){ try { return _get(k); } catch(e){ console.error('localStorage.getItem error', e); return null; } };
    localStorage.removeItem = function(k){ try { return _remove(k); } catch(e){ console.error('localStorage.removeItem error', e); } };
    localStorage.clear = function(){ try { return _clear(); } catch(e){ console.error('localStorage.clear error', e); } };
  } catch(e){ /* silent */ }
})();
// -----------------------------------------------

export const KEYS = { profile:'dt_profile_v2', ex:'dt_exercises_v4', wo:'dt_workouts_v3' };
export const LS = { get:(k,fb)=>{try{return JSON.parse(localStorage.getItem(k))??fb}catch{return fb}}, set:(k,v)=>localStorage.setItem(k, JSON.stringify(v)) };
export const MUSCLE_GROUPS = {
  'Грудь': ['Верх','Середина','Низ','Внутренняя','Внешняя'],
  'Спина': ['Широчайшие','Трапеции','Ромбовидные','Разгибатели'],
  'Ноги': ['Квадрицепс','Бицепс бедра','Ягодичные','Икры','Приводящие'],
  'Плечи': ['Передняя дельта','Средняя дельта','Задняя дельта','Вращатели'],
  'Руки': ['Бицепс','Трицепс','Предплечья'],
  'Пресс': ['Верх','Низ','Косые','Кор'],
};
export const DB = {
  get profile(){ return LS.get(KEYS.profile,{name:'',age:'',gender:'',height:'',weight:'',avatar:'',level:'',goal:'',bodyfat:'',neck:'',chest:'',waist:'',hips:'',notes:''}) },
  set profile(v){ LS.set(KEYS.profile,v) },
  get exercises(){ return LS.get(KEYS.ex, defaultExercises()) },
  set exercises(v){ LS.set(KEYS.ex,v) },
  get workouts(){ return LS.get(KEYS.wo,[]) },
  set workouts(v){ LS.set(KEYS.wo,v) }
};
export const toast = (m)=>{ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1600); };
export const uid = ()=>Math.random().toString(36).slice(2,9);
export const today = ()=>new Date().toISOString().slice(0,10);
export const totalVolume = (w)=>w.items.reduce((acc,i)=>acc+i.sets.reduce((a,s)=>a+(Number(s.w||0)*Number(s.r||0)),0),0);

const GIFS=[
 'https://www.inspireusafoundation.org/wp-content/uploads/2023/10/barbell-banded-bench-press.gif',
 'https://media.tenor.com/9iZp1M2I6-sAAAAC/lat-pulldown.gif',
 'https://media.tenor.com/Sb4-8M5G8U4AAAAC/squat-gym.gif',
 'https://media.tenor.com/9l4ZbSjxB2EAAAAC/dumbbell-shoulder-press.gif',
 'https://media.tenor.com/wbXK5P8z0TgAAAAC/barbell-curl.gif',
 'https://media.tenor.com/jWz3bF6g8J8AAAAC/crunches.gif',
 'https://media.tenor.com/aQH0gmb8bXwAAAAC/triceps-pushdown.gif',
 'https://media.tenor.com/1u6Qp3oJ2a0AAAAC/leg-press.gif'
];
function desc(name,g,sg){ return `Техника: ${name}. Рабочая группа: ${g} (${sg}). Разминка 1–2 подхода, затем рабочие. Держите корпус стабильно, контролируйте амплитуду и дыхание.`; }
export function defaultExercises(){
  const names={'Грудь':['Жим штанги лёжа','Жим гантелей лёжа','Разведение гантелей','Жим на наклонной скамье','Отжимания с весом'],
               'Спина':['Тяга верхнего блока','Тяга горизонтального блока','Тяга штанги в наклоне','Подтягивания','Пуловер с канатами'],
               'Ноги':['Приседания со штангой','Жим ногами','Выпады','Становая на прямых ногах','Подъёмы на носки стоя'],
               'Плечи':['Жим гантелей сидя','Жим штанги стоя','Махи в стороны','Махи назад','Тяга к подбородку'],
               'Руки':['Подъём штанги на бицепс','Сгибание гантелей стоя','Разгибания на блоке','Французский жим','Молотки'],
               'Пресс':['Скручивания','Подъёмы ног в висе','Планка','Велосипед','Русский твист']};
  const out=[]; let i=0;
  Object.entries(names).forEach(([g,arr])=>{
    (MUSCLE_GROUPS[g]||['Общая']).forEach(sg=>{
      arr.forEach(base=>{ for(let v=0; v<4; v++){ const n=v?`${base} ${v+1}`:base; out.push({id:uid(),name:n,group:g,subgroup:sg,gif:GIFS[i%GIFS.length],description:desc(n,g,sg)}); i++; } });
    });
  });
  return out.slice(0,130);
}
