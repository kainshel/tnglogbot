// workout-engine.js - создание/сохранение/запуск тренировки
(function(){
  function loadWorkouts(){
    return Storage.get('workouts', []) ;
  }
  function saveWorkouts(lst){ Storage.set('workouts', lst); }
  function createWorkout(title, exercises, date){
    const list = loadWorkouts();
    const w = { id: 'w'+Date.now(), title: title||'Тренировка', exercises, date: date||DateTime.todayISO(), created: Date.now() };
    list.unshift(w);
    saveWorkouts(list);
    document.dispatchEvent(new CustomEvent('workoutsUpdated', {detail: w}));
    return w;
  }
  function deleteWorkout(id){
    let list = loadWorkouts().filter(w=> w.id !== id);
    saveWorkouts(list);
    document.dispatchEvent(new Event('workoutsUpdated'));
  }
  function getWorkout(id){
    return loadWorkouts().find(w=>w.id===id);
  }
  window.WorkoutEngine = { loadWorkouts, saveWorkouts, createWorkout, deleteWorkout, getWorkout };
})();
