
// ---- Safe localStorage patch (auto-injected) ----
(function(){
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    const _remove = localStorage.removeItem.bind(localStorage);
    const _clear = localStorage.clear.bind(localStorage);
    localStorage.setItem = function(k,v){ try { return _set(k,v); } catch(e){ console.error('localStorage.setItem error', e); } };
    localStorage.getItem = function(k){ try { return _get(k); } catch(e){ console.error('localStorage.getItem error', e); return null; } };
    localStorage.removeItem = function(k){ try { return _remove(k); } catch(e){ console.error('localStorage.removeItem error', e); } };
    localStorage.clear = function(){ try { return _clear(); } catch(e){ console.error('localStorage.clear error', e); } };
  } catch(e){ /* silent */ }
})();
// -----------------------------------------------

import {DB, toast} from './storage.js';
const qs=(id)=>document.getElementById(id);
const fields=['name','age','gender','height','weight','level','goal','bodyfat','neck','chest','waist','hips','notes'];
const p=DB.profile; fields.forEach(f=>{ const el=qs(f); if(el) el.value=p[f]??''; });
const avatarPreview=qs('avatarPreview'); avatarPreview.src=p.avatar||'icon.png';
function save(){ const obj={}; fields.forEach(f=>obj[f]=qs(f).value); obj.avatar=avatarPreview.src; DB.profile=obj; toast('Профиль сохранён'); }
qs('saveProfile').onclick=save;
['change','input'].forEach(ev=>fields.forEach(f=>qs(f).addEventListener(ev,()=>{ DB.profile={...DB.profile,[f]:qs(f).value}; })));
qs('avatarInput').addEventListener('change',(e)=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=()=>{ avatarPreview.src=r.result; DB.profile={...DB.profile,avatar:r.result}; toast('Фото обновлено'); }; r.readAsDataURL(file); });
qs('clearAvatar').onclick=()=>{ avatarPreview.src='icon.png'; DB.profile={...DB.profile,avatar:''}; };
