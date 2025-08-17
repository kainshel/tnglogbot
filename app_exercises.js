
async function loadExercises() {
  const response = await fetch('exercises.json');
  const exercises = await response.json();

  const container = document.getElementById('exercises-container');
  const searchInput = document.getElementById('search');
  const filterType = document.getElementById('filter-type');
  const filterEquipment = document.getElementById('filter-equipment');

  function render(list) {
    container.innerHTML = '';
    list.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card';

      const gif = new Image();
      gif.src = ex.gif;
      gif.onload = () => {
        card.innerHTML = `
          <h2 class="exercise-title">${ex.name_ru}</h2>
          <img src="${ex.gif}" alt="${ex.name_en}" class="exercise-gif">
          <p><strong>Группы мышц:</strong> ${ex.groups.join(', ')}</p>
          <p><strong>Целевые зоны:</strong> ${ex.targets.join(', ')}</p>
          <p><strong>Тип:</strong> ${ex.type}</p>
          <p><strong>Оборудование:</strong> ${ex.equipment.join(', ')}</p>
          <div class="exercise-actions">
            <button>Добавить</button>
            <button>Подробнее</button>
          </div>
        `;
      };
      gif.onerror = () => {
        card.innerHTML = `
          <h2 class="exercise-title">${ex.name_ru}</h2>
          <p>GIF не доступен</p>
          <p><strong>Группы мышц:</strong> ${ex.groups.join(', ')}</p>
          <p><strong>Целевые зоны:</strong> ${ex.targets.join(', ')}</p>
          <p><strong>Тип:</strong> ${ex.type}</p>
          <p><strong>Оборудование:</strong> ${ex.equipment.join(', ')}</p>
          <div class="exercise-actions">
            <button>Добавить</button>
            <button>Подробнее</button>
          </div>
        `;
      };

      container.appendChild(card);
    });
  }

  
function applyFilters() {
  let filtered = exercises;

  const query = searchInput.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(ex =>
      ex.name_ru.toLowerCase().includes(query) ||
      ex.name_en.toLowerCase().includes(query)
    );
  }
  
  const groups = document.getElementById('filter-group').value;
  if (groups) {
    filtered = filtered.filter(ex => ex.groups.some(group => group.toLowerCase().includes(groups.toLowerCase())));
  }
  
  const targets = document.getElementById('filter-target').value;
  if (targets) {
    filtered = filtered.filter(ex => ex.targets.some(target => target.toLowerCase().includes(targets.toLowerCase())));
  }
  
  const type = filterType.value;
  if (type) {
    filtered = filtered.filter(ex => ex.type === type);
  }

  const equipment = filterEquipment.value;
  if (equipment) {
    filtered = filtered.filter(ex => ex.equipment.includes(equipment));
  }

  render(filtered);
}

    let filtered = exercises;

    const query = searchInput.value.toLowerCase();
    if (query) {
      filtered = filtered.filter(ex =>
        ex.name_ru.toLowerCase().includes(query) ||
        ex.name_en.toLowerCase().includes(query)
      );
    }
	
    const groups = filterGroups.value;
    if (groups) {
      filtered = filtered.filter(ex => ex.Groups === groups);
    }
	
	 const targets = filtertargets.value;
    if (targets) {
      filtered = filtered.filter(ex => ex.targets === targets);
    }
	
    const type = filterType.value;
    if (type) {
      filtered = filtered.filter(ex => ex.type === type);
    }

    const equipment = filterEquipment.value;
    if (equipment) {
      filtered = filtered.filter(ex => ex.equipment.includes(equipment));
    }

    render(filtered);
  }

  // Заполним фильтры
    const groups = [...new Set(exercises.flatMap(ex => ex.groups))];
  groups.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    filtergroups.appendChild(opt);
  });
  
    const targets = [...new Set(exercises.flatMap(ex => ex.targets))];
  targets.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    filtertargets.appendChild(opt);
  });
  
  const types = [...new Set(exercises.map(ex => ex.type))];
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterType.appendChild(opt);
  });

  const equipments = [...new Set(exercises.flatMap(ex => ex.equipment))];
  equipments.forEach(eq => {
    const opt = document.createElement('option');
    opt.value = eq;
    opt.textContent = eq;
    filterEquipment.appendChild(opt);
  });

  searchInput.addEventListener('input', applyFilters);
  filterType.addEventListener('change', applyFilters);
  filterEquipment.addEventListener('change', applyFilters);
  filtergroups.addEventListener('change', applyFilters);  
  filtertargets.addEventListener('change', applyFilters);

  render(exercises);
}

document.addEventListener('DOMContentLoaded', loadExercises);
