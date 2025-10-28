// app_edit_profile.js - редактирование профиля
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('editProfileForm');
    if (!form) return;
    const p = Auth.getProfile();
    form.name.value = p.name||'';
    form.height.value = p.height||'';
    form.weight.value = p.weight||'';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const updated = { name: form.name.value, height: parseFloat(form.height.value)||null, weight: parseFloat(form.weight.value)||null };
      Auth.saveProfile(updated);
      Notify.toast('Профиль сохранён');
      window.location.href = 'profile.html';
    });
  });
})();
