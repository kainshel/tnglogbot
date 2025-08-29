// exercises-db.js - загрузка локальной базы упражнений и простая фильтрация
(function(){
  const CACHE_KEY = 'exercises_db';
  function load(){
    return Storage.get('exercises_data', null) || fetch('/data/exercises.json').then(r=>r.json()).then(j=>{ Storage.set('exercises_data', j); return j; });
  }
  function search(q){
    q = (q||'').toLowerCase();
    return load().then(list => list.filter(e => (e.name||'').toLowerCase().includes(q) || (e.groups||[]).join(' ').toLowerCase().includes(q)));
  }
  window.ExercisesDB = { load, search };
})();
