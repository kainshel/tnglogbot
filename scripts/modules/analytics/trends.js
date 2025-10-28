// trends.js - анализ простых тенденций
(function(){
  function lastNVolume(n){
    const workouts = Storage.get('workouts', []).slice(0,n);
    return workouts.map(w=>({ label: w.date||w.created, value: (w.exercises||[]).reduce((s,e)=> s + ((e.sets||1)*(e.reps||1)*(e.weight||0)),0) }));
  }
  window.Trends = { lastNVolume };
})();
