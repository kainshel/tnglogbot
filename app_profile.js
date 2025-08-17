
import { DB, toast, LS } from './storage.js';

// Load profile data from localStorage
const p = LS.get('dt_profile_v3', { name: '', age: '', gender: '', height: '', weight: '', level: '', goal: '', notes: '', avatar: 'icon.png' });

const qs = (id) => document.getElementById(id);
const fields = ['name', 'age', 'gender', 'height', 'weight', 'level', 'goal', 'notes'];
fields.forEach(f => { const el = qs(f); if(el) el.value = p[f] ?? ''; });
const avatarPreview = qs('avatarPreview'); 
avatarPreview.src = p.avatar || 'icon.png';

function save() {
    const obj = {};
    fields.forEach(f => obj[f] = qs(f).value);
    obj.avatar = avatarPreview.src;
    LS.set('dt_profile_v3', obj);  // Save to localStorage
    DB.profile = obj; // Update DB
    toast('Профиль сохранён');
}

qs('saveProfile').onclick = save;
['change', 'input'].forEach(ev => fields.forEach(f => qs(f).addEventListener(ev, () => {
    DB.profile = { ...DB.profile, [f]: qs(f).value };
})));
qs('avatarInput').addEventListener('change', (e) => {
    const file = e.target.files[0]; 
    if (!file) return; 
    const r = new FileReader(); 
    r.onload = () => { 
        avatarPreview.src = r.result; 
        DB.profile = { ...DB.profile, avatar: r.result }; 
        toast('Фото обновлено'); 
    }; 
    r.readAsDataURL(file); 
});
qs('clearAvatar').onclick = () => { 
    avatarPreview.src = 'icon.png'; 
    DB.profile = { ...DB.profile, avatar: '' }; 
};
