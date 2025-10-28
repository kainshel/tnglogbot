// progression.js - простая логика прогрессии: +2.5% при выполнении 3 успешных тренировок
(function(){
  function suggestNext(currentWeight, history){
    if (!currentWeight) return null;
    // count last 3 successes (naive)
    const last = (history||[]).slice(0,10);
    const successCount = last.filter(h => h.success).length;
    const factor = successCount >= 3 ? 1.025 : 1.015;
    return Math.round(currentWeight * factor * 10)/10;
  }
  window.Progression = { suggestNext };
})();
