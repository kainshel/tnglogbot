import { loadJSON, saveJSON, getKey } from './storage.js';
import { uidKey } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const key = getKey('profile');
  const raw = localStorage.getItem(key);
  const profile = raw ? JSON.parse(raw) : {};
  const byId = id => document.getElementById(id);

  if (byId('username')) byId('username').value = profile.username||'';
  if (byId('age')) byId('age').value = profile.age ?? '';
  if (byId('height')) byId('height').value = profile.height ?? '';
  if (byId('weight')) byId('weight').value = profile.weight ?? '';

  function calculateStats() {
    const wKey = getKey('workouts');
    let store = {};
    try { store = JSON.parse(localStorage.getItem(wKey) || '{}'); } catch (e) { store = {}; }
    const dates = Object.keys(store);
    const setCount = Object.values(store).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.flat().length || arr.length : 0), 0);
    const exercises = new Set();
    Object.values(store).forEach(arr => (arr||[]).forEach(it => exercises.add(it.name)));
    return {
      totalWorkouts: dates.length,
      totalExercises: exercises.size,
      totalSets: setCount,
      lastWorkout: dates.length ? new Date(dates.sort((a,b)=> new Date(b)-new Date(a))[0]).toLocaleDateString('ru-RU') : '—'
    };
  }

  const stats = calculateStats();
  const ids = ['totalWorkouts','totalExercises','totalSets','lastWorkout'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = stats[id] ?? '—'; });

  document.getElementById('saveProfile').addEventListener('click', () => {
    const p = {
      username: byId('username').value.trim(),
      age: Number(byId('age').value) || null,
      height: Number(byId('height').value) || null,
      weight: Number(byId('weight').value) || null
    };
    localStorage.setItem(key, JSON.stringify(p));
    alert('Профиль сохранён');
    location.reload();
  });

  document.getElementById('logout').addEventListener('click', () => {
    if (confirm('Выйти? Это удалит локально сохранённый профиль и тренировочные данные.')) {
      // remove tng keys for this user
      Object.keys(localStorage).filter(k => k.startsWith('tng_')).forEach(k=>localStorage.removeItem(k));
      alert('Данные удалены');
      location.reload();
    }
  });
});
