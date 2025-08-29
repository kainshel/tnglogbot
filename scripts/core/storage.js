// storage.js - простой wrapper для localStorage с namespace и JSON
(function(){
  const NS = 'tng:';
  window.Storage = {
    get(key, fallback){
      try{
        const v = localStorage.getItem(NS+key);
        return v===null ? fallback : JSON.parse(v);
      }catch(e){ console.error(e); return fallback; }
    },
    set(key, value){
      try{ localStorage.setItem(NS+key, JSON.stringify(value)); }catch(e){ console.error(e); }
    },
    remove(key){ try{ localStorage.removeItem(NS+key); }catch(e){} },
    clearAll(){ 
      try{
        Object.keys(localStorage)
          .filter(k => k.indexOf(NS)===0)
          .forEach(k => localStorage.removeItem(k));
      }catch(e){}
    }
  };
})();
