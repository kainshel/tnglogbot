// app_profile.js - логика страницы профиля (просмотр)
(function(){
  function render(){
    const p = Auth.getProfile();
    document.getElementById('profile-name').textContent = p.name || 'Спортсмен';
    document.getElementById('profile-height').textContent = p.height || '—';
    document.getElementById('profile-weight').textContent = p.weight || '—';
    document.getElementById('profile-bmi').textContent = Calculations.bmi(p.weight, p.height) || '—';
  }
  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('profileUpdated', render);
})();
