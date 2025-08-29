// calculations.js - BMI и простая суммарная статистика
(function(){
  function bmi(weightKg, heightCm){
    if (!weightKg || !heightCm) return null;
    const h = heightCm/100;
    return +(weightKg / (h*h)).toFixed(1);
  }
  function sum(arr, key){ return arr.reduce((s,i)=> s + (key? i[key]: i), 0); }
  window.Calculations = { bmi, sum };
})();
