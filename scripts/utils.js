export function uidKey(base) {
  // use Telegram user id if present
  try {
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
      return base + '_' + Telegram.WebApp.initDataUnsafe.user.id;
    }
  } catch (e) {}
  return base;
}

export function parseSets(text) {
  // Accepts formats like "10,8,6" => [10,8,6] or "10@60,8@70" => [{reps:10,weight:60},...]
  const parts = (text||'').split(',').map(s=>s.trim()).filter(Boolean);
  const numeric = parts.every(p => /^[0-9]+$/.test(p));
  if (numeric) return parts.map(p=>({reps: Number(p), weight: null}));
  return parts.map(p => {
    const m = p.split('@').map(x=>x.trim());
    const reps = Number(m[0]) || null;
    const weight = m[1] ? Number(m[1]) : null;
    return {reps, weight};
  });
}

export function formatSets(sets) {
  if (!Array.isArray(sets)) return '—';
  return sets.map(s => (s.reps ?? s) + (s.weight ? '@'+s.weight : '')).join(', ');
}

export function isoToday() {
  return new Date().toISOString().slice(0,10);
}

export function downloadFile(filename, content) {
  const blob = new Blob([content], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 500);
}
