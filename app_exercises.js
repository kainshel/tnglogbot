
// === Exercises Page Logic ===
(async function () {
  const container = document.getElementById('exercises-container');
  const searchInput = document.getElementById('search');
  const filterGroups = document.getElementById('filter-groups');
  const filterTargets = document.getElementById('filter-targets');
  const filterType = document.getElementById('filter-type');
  const filterEquipment = document.getElementById('filter-equipment');

  const detail = {
    root: document.getElementById('exercise-details'),
    title: document.getElementById('detail-title'),
    gif: document.getElementById('detail-gif'),
    desc: document.getElementById('detail-description'),
    meta: document.getElementById('detail-meta'),
    close: document.getElementById('detail-close')
  };
  if (detail.close) detail.close.onclick = () => (detail.root.style.display = 'none');

  // Load data
  let exercises = [];
  try {
    const res = await fetch('exercises.json', { cache: 'no-store' });
    exercises = await res.json();
  } catch (e) {
    console.error('Не удалось загрузить exercises.json', e);
    container.innerHTML = '<div class="muted">Не удалось загрузить список упражнений.</div>';
    return;
  }

  // Normalize entries to prevent runtime errors
  exercises = exercises.map(x => ({
    name_ru: x.name_ru || x.name || '',
    name_en: x.name_en || '',
    type: x.type || '',
    equipment: Array.isArray(x.equipment) ? x.equipment : (x.equipment ? [x.equipment] : []),
    groups: Array.isArray(x.groups) ? x.groups : (x.groups ? [x.groups] : []),
    targets: Array.isArray(x.targets) ? x.targets : (x.targets ? [x.targets] : []),
    description: x.description || x.desc || '',
    gif: x.gif || '',
    id: x.id || (x.name_en || x.name_ru || Math.random().toString(36).slice(2))
  }));

  // Populate filter selects from unique values
  function fillSelect(select, values) {
    const unique = Array.from(new Set(values.filter(Boolean))).sort((a,b)=>a.localeCompare(b, 'ru'));
    unique.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  }

  fillSelect(filterType, exercises.map(ex => ex.type));
  fillSelect(filterEquipment, exercises.flatMap(ex => ex.equipment));
  fillSelect(filterGroups, exercises.flatMap(ex => ex.groups));
  fillSelect(filterTargets, exercises.flatMap(ex => ex.targets));

  function card(ex) {
    const eq = ex.equipment.join(', ');
    const gr = ex.groups.join(', ');
    const tg = ex.targets.join(', ');
    const gifSafe = ex.gif ? `
      <img class="thumb" src="${ex.gif}" alt="${ex.name_en}" onerror="this.style.display='none'">
    ` : '';
    const el = document.createElement('div');
    el.className = 'exercise-card';
    el.innerHTML = `
      <div class="exercise-head">
        <h3>${ex.name_ru || ex.name_en}</h3>
      </div>
      <div class="exercise-media">${gifSafe}</div>
      <div class="exercise-meta muted">
        <span>${ex.type || 'Тип не указан'}</span>
        ${eq ? ` · <span>${eq}</span>` : ''}
        ${gr ? ` · <span>${gr}</span>` : ''}
        ${tg ? ` · <span>${tg}</span>` : ''}
      </div>
      <div class="exercise-actions">
        <button class="btn" data-action="details">Подробнее</button>
      </div>
    `;
    el.querySelector('[data-action="details"]').onclick = () => showDetails(ex);
    return el;
  }

  function showDetails(ex) {
    if (!detail.root) return;
    detail.title.textContent = ex.name_ru || ex.name_en;
    detail.gif.src = ex.gif || '';
    detail.gif.style.display = ex.gif ? 'block' : 'none';
    detail.desc.textContent = ex.description || 'Описание отсутствует';
    detail.meta.innerHTML = `
      <span><strong>Тип:</strong> ${ex.type || '—'}</span>
      ${ex.equipment.length ? `<span><strong>Оборудование:</strong> ${ex.equipment.join(', ')}</span>` : ''}
      ${ex.groups.length ? `<span><strong>Группы мышц:</strong> ${ex.groups.join(', ')}</span>` : ''}
      ${ex.targets.length ? `<span><strong>Целевые зоны:</strong> ${ex.targets.join(', ')}</span>` : ''}
    `;
    detail.root.style.display = 'block';
  }

  function render(list) {
    container.innerHTML = '';
    if (!list.length) {
      container.innerHTML = '<div class="muted">Упражнений не найдено.</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(ex => frag.appendChild(card(ex)));
    container.appendChild(frag);
  }

  function applyFilters() {
    let list = exercises;

    const q = (searchInput?.value || '').trim().toLowerCase();
    if (q) {
      list = list.filter(ex =>
        (ex.name_ru || '').toLowerCase().includes(q) ||
        (ex.name_en || '').toLowerCase().includes(q)
      );
    }

    const gr = (filterGroups?.value || '').trim();
    if (gr) list = list.filter(ex => ex.groups.includes(gr));

    const tg = (filterTargets?.value || '').trim();
    if (tg) list = list.filter(ex => ex.targets.includes(tg));

    const t = (filterType?.value || '').trim();
    if (t) list = list.filter(ex => ex.type === t);

    const eq = (filterEquipment?.value || '').trim();
    if (eq) list = list.filter(ex => ex.equipment.includes(eq));

    render(list);
  }

  // Bind events
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  [filterGroups, filterTargets, filterType, filterEquipment].forEach(sel => {
    if (sel) sel.addEventListener('change', applyFilters);
  });

  // Initial display
  render(exercises);
  // Apply filters once selects are filled (no-op but consistent)
  applyFilters();
})();
