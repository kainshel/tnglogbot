// statistics.js - вычисление базовой статистики по тренировкам
(function(){
  function calcTotals(workouts){
    workouts = workouts || Storage.get('workouts', []);
    const total = workouts.length;
    let exercises = 0, volume = 0;
    workouts.forEach(w=>{
      w.exercises && w.exercises.forEach(ex=>{
        exercises++;
        // volume estimate: sets * reps * weight if present
        const sets = ex.sets||1, reps = ex.reps||1, weight = ex.weight||0;
        volume += sets*reps*weight;
      });
    });
    return { totalWorkouts: total, totalExercises: exercises, totalVolume: Math.round(volume) };
  }
  window.Statistics = { calcTotals };
})();
