// recommendations.js - простая рекомендация по целевой группе
(function(){
  function byTarget(target){
    return ExercisesDB.load().then(list => list.filter(e => (e.targets||[]).includes(target)).slice(0,6));
  }
  window.Recommendations = { byTarget };
})();
