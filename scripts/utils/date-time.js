// date-time.js - минимальные утилиты
(function(){
  function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
  function formatDateISO(iso){ if(!iso) return '—'; return (new Date(iso)).toLocaleDateString(); }
  window.DateTime = { todayISO, formatDateISO };
})();
