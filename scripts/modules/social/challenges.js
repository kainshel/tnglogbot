// challenges.js - система челленджей и достижений
(function(){
  const DEFAULT = [
    { id:'c1', title:'5 тренировок', desc:'Закончить 5 тренировок', goal:5, progress:0, reward:'🏅' },
    { id:'c2', title:'10000 объём', desc:'Суммарный объём 10000', goal:10000, progress:0, reward:'🎖' }
  ];
  function list(){ return Storage.get('challenges', DEFAULT); }
  function updateProgress(){
    const workouts = Storage.get('workouts', []);
    const totals = workouts.length;
    const volume = workouts.reduce((s,w)=> s + (w.exercises||[]).reduce((s2,e)=> s2 + ((e.sets||1)*(e.reps||1)*(e.weight||0)),0),0);
    const ch = list().map(c=>{
      const copy = Object.assign({}, c);
      if (c.goal > 1000) copy.progress = Math.min(100, Math.round((volume/c.goal)*100));
      else copy.progress = Math.min(100, Math.round((totals/c.goal)*100));
      if (copy.progress >= 100 && !Storage.get('achieved_'+c.id, false)) {
        Storage.set('achieved_'+c.id, true);
        // push achievement
        const ach = Storage.get('achievements', []);
        ach.unshift({id:c.id, title:c.title, date:new Date().toISOString(), reward:c.reward});
        Storage.set('achievements', ach);
        document.dispatchEvent(new CustomEvent('achievementUnlocked', {detail: c}));
      }
      return copy;
    });
    Storage.set('challenges', ch);
    return ch;
  }
  window.Challenges = { list, updateProgress };
})();
