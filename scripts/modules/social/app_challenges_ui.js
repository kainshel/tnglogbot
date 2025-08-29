// app_challenges_ui.js - UI для страницы челленджей
(function(){
  function render(){
    const list = Challenges.list();
    const root = document.getElementById('challenges-root');
    if (!root) return;
    root.innerHTML = list.map(c=>`<div class="challenge card"><h4>${c.title} ${Storage.get('achieved_'+c.id)?c.reward:''}</h4><p>${c.desc}</p><div class="progress"><div class="bar" style="width:${c.progress||0}%"></div></div></div>`).join('');
  }
  document.addEventListener('DOMContentLoaded', function(){ Challenges.updateProgress(); render(); });
  document.addEventListener('workoutsUpdated', function(){ Challenges.updateProgress(); render(); });
  document.addEventListener('achievementUnlocked', render);
})();
