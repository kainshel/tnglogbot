import { parseSets, formatSets, isoToday } from './utils.js';
import { loadJSON, saveJSON, getKey } from './storage.js';
import { openModal, closeModal } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('workoutForm');
  const openBtn = document.getElementById('openAddExercise');
  const modal = document.getElementById('modal');
  const saveEx = document.getElementById('saveEx');
  const cancelEx = document.getElementById('cancelEx');
  const exName = document.getElementById('modalExName');
  const exSets = document.getElementById('modalSets');
  const exCatalog = document.getElementById('exCatalog');
  const exercisesList = document.getElementById('exercisesList');
  const datalist = document.getElementById('exCatalog');

  // populate datalist from preloaded catalog
  const catalog = window.__EX_CATALOG || [];
  catalog.forEach(e => {
    const opt = document.createElement('option'); opt.value = e.name; datalist.appendChild(opt);
  });

  document.getElementById('w_date').value = isoToday();

  function addExerciseToList(obj) {
    const node = document.createElement('div');
    node.className = 'card ex-item';
    node.innerHTML = `<strong class="ex-title">${obj.name}</strong>
      <p class="ex-sets">${formatSets(obj.sets)}</p>
      <div class="form-actions">
        <button type="button" class="btn edit">Изменить</button>
        <button type="button" class="btn remove">Удалить</button>
      </div>`;
    node.querySelector('.remove').addEventListener('click', ()=>node.remove());
    node.querySelector('.edit').addEventListener('click', ()=>{
      // populate modal
      exName.value = obj.name;
      exSets.value = obj.sets.map(s => (s.reps ?? '') + (s.weight ? '@'+s.weight : '')).join(',');
      openModal(modal);
      // remove current node on save; we'll re-add
      node.remove();
    });
    exercisesList.appendChild(node);
  }

  openBtn.addEventListener('click', ()=> openModal(modal));
  cancelEx.addEventListener('click', ()=> closeModal(modal));

  saveEx.addEventListener('click', ()=> {
    const name = exName.value.trim();
    const sets = parseSets(exSets.value);
    if (!name) { alert('Введите название упражнения'); exName.focus(); return; }
    if (!sets.length) { alert('Укажите хотя бы один сет'); exSets.focus(); return; }
    addExerciseToList({name, sets});
    exName.value = ''; exSets.value = '';
    closeModal(modal);
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const date = document.getElementById('w_date').value || isoToday();
    const title = document.getElementById('w_title').value.trim() || 'Тренировка';
    const items = [];
    document.querySelectorAll('.ex-item').forEach(node => {
      const name = node.querySelector('.ex-title').textContent;
      const setsText = node.querySelector('.ex-sets').textContent;
      // try to parse back basic numeric sets (keep original format)
      items.push({name, sets: setsText.split(',').map(s=>s.trim())});
    });
    if (!items.length) { if (!confirm('Сохранить пустую тренировку?')) return; }
    // store under key 'workouts'
    const key = getKey('workouts');
    const raw = localStorage.getItem(key) || '{}';
    let store = {};
    try { store = JSON.parse(raw); } catch(e){ store = {}; }
    store[date] = store[date] || [];
    store[date] = store[date].concat(items);
    localStorage.setItem(key, JSON.stringify(store));
    alert('Тренировка сохранена');
    location.href = 'history.html';
  });
});
