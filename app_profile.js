import {DB, toast} from './storage.js';

const p = DB.profile;
const nameEl = document.getElementById('name');
const ageEl = document.getElementById('age');
const genderEl = document.getElementById('gender');
const heightEl = document.getElementById('height');
const weightEl = document.getElementById('weight');
const avatarPreview = document.getElementById('avatarPreview');

nameEl.value = p.name||''; ageEl.value=p.age||''; genderEl.value=p.gender||''; heightEl.value=p.height||''; weightEl.value=p.weight||'';
avatarPreview.src = p.avatar || 'icon.png';

document.getElementById('saveProfile').onclick = ()=>{
  DB.profile = {name:nameEl.value.trim(), age:ageEl.value, gender:genderEl.value, height:heightEl.value, weight:weightEl.value, avatar:avatarPreview.src};
  toast('Профиль сохранён');
};
document.getElementById('avatarInput').addEventListener('change', async (e)=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{ avatarPreview.src = reader.result; };
  reader.readAsDataURL(file);
});
document.getElementById('clearAvatar').onclick = ()=>{ avatarPreview.src='icon.png'; };
