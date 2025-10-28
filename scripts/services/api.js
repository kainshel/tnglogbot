// api.js - простой fetch wrapper для чтения локальных data/*.json
(function(){
  function fetchData(name){
    return fetch('/data/' + name + '.json').then(r => {
      if (!r.ok) throw new Error('Fetch error ' + r.status);
      return r.json();
    });
  }
  function listExercises(){ return fetchData('exercises'); }
  function listWorkouts(){ return fetchData('workouts'); }
  window.Api = { fetchData, listExercises, listWorkouts };
})();
