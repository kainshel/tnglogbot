// templates.js - несколько шаблонов тренировок
(function(){
  const templates = [
    { id: 't1', title: 'Full Body (A)', exercises: [{id:'squat', name:'Присед', sets:3, reps:8}, {id:'bench', name:'Жим лёжа', sets:3, reps:6}]},
    { id: 't2', title: 'Upper Focus', exercises: [{id:'bench', name:'Жим', sets:4, reps:6}, {id:'row', name:'Тяга', sets:4, reps:8}]}
  ];
  window.Templates = {
    list(){ return templates; },
    get(id){ return templates.find(t=>t.id===id); }
  };
})();
