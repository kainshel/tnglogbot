// ---- Безопасная «заплатка» для localStorage ----
(function () {
  if (!('localStorage' in window)) return;
  try {
    const _set = localStorage.setItem.bind(localStorage);
    const _get = localStorage.getItem.bind(localStorage);
    localStorage.setItem = (k, v) => { try { return _set(k, v); } catch (e) { console.error(e); } };
    localStorage.getItem = (k) => { try { return _get(k); } catch (e) { console.error(e); return null; } };
  } catch (e) { /* ignore */ }
})();

// === Глобальные переменные ===
let programs = [];
let exercises = [];
let selectedProgram = null;

const searchInput = document.getElementById("search-programs");
const filterLevel = document.getElementById("filter-level");
const filterGoal = document.getElementById("filter-goal");
const filterDuration = document.getElementById("filter-duration");

const programsContainer = document.getElementById("programs-container");
const programDetails = document.getElementById("program-details");
const programTitle = document.getElementById("program-title");
const programMeta = document.getElementById("program-meta");
const programWeeks = document.getElementById("program-weeks");
const addToPlanBtn = document.getElementById("add-to-plan");

// Модальное окно
const modalBack = document.getElementById("modalBack");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

// === Вспомогательные функции ===
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showModal(html) {
  if (modalBack && modalContent) {
    modalContent.innerHTML = html;
    modalBack.style.display = "flex";
  } else {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    alert(tmp.textContent || tmp.innerText || '');
  }
}

function hideModal() { 
  if (modalBack) modalBack.style.display = "none"; 
}

if (modalClose) modalClose.addEventListener("click", hideModal);
if (modalBack) modalBack.addEventListener("click", e => { if (e.target === modalBack) hideModal(); });

function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <p>${message}</p>
    <button onclick="location.reload()">Обновить страницу</button>
  `;
  
  const content = document.querySelector('.content');
  if (content) {
    content.insertBefore(errorDiv, content.firstChild);
  }
}

// === Загрузка данных ===
async function loadPrograms() {
  try {
    programsContainer.innerHTML = '<div class="loading">🔄 Загрузка программ...</div>';
    
    const res = await fetch('data/programs.json', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    programs = await res.json();
    
    if (!programs || programs.length === 0) {
      throw new Error('Получен пустой массив программ');
    }
    
    renderPrograms(programs);
    return programs;
    
  } catch (e) {
    console.error('Ошибка загрузки программ', e);
    showErrorMessage('Не удалось загрузить программы тренировок.');
    return [];
  }
}

async function loadExercises() {
  try {
    const res = await fetch('data/exercises.json', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    exercises = await res.json();
    
    if (!exercises || exercises.length === 0) {
      console.warn('Получен пустой массив упражнений');
      return [];
    }
    
    return exercises;
    
  } catch (e) {
    console.error('Ошибка загрузки упражнений', e);
    return [];
  }
}

// === Фильтрация программ ===
function applyFilters() {
  let list = [...programs];
  const search = searchInput.value.toLowerCase();
  
  if (search) {
    list = list.filter(program =>
      (program.name || "").toLowerCase().includes(search) ||
      (program.description || "").toLowerCase().includes(search)
    );
  }
  
  const level = filterLevel.value;
  const goal = filterGoal.value;
  const duration = filterDuration.value;
  
  if (level) list = list.filter(program => program.level === level);
  if (goal) list = list.filter(program => program.goal === goal);
  if (duration) list = list.filter(program => program.duration >= parseInt(duration));
  
  renderPrograms(list);
}

[filterLevel, filterGoal, filterDuration].forEach(sel => {
  sel.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", debounce(applyFilters, 300));

// === Отрисовка программ ===
function createProgramCard(program) {
  const card = document.createElement("div");
  card.className = "program-card";
  card.dataset.id = program.id;
  
  card.innerHTML = `
    <h3>${program.name}</h3>
    <div class="program-meta">
      <span class="program-tag">${program.level}</span>
      <span class="program-tag">${program.goal}</span>
      <span class="program-tag">${program.duration} недель</span>
    </div>
    <p class="program-description">${program.description}</p>
    <button class="btn view-program">👀 Просмотреть программу</button>
  `;
  
  return card;
}

function renderPrograms(list) {
  programsContainer.innerHTML = "";
  
  if (list.length === 0) {
    programsContainer.innerHTML = '<p class="empty-message">Программы не найдены</p>';
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  list.forEach(program => {
    const card = createProgramCard(program);
    
    card.querySelector(".view-program").addEventListener("click", () => {
      selectProgram(program);
      programDetails.scrollIntoView({ behavior: 'smooth' });
    });
    
    fragment.appendChild(card);
  });
  
  programsContainer.appendChild(fragment);
}

// === Детали программы ===
function findExerciseById(name_en) {
  return exercises.find(ex => ex.name_en === name_en) || { 
    name_ru: "Неизвестное упражнение", 
    name_en: name_en,
    groups: ["Неизвестно"],
    targets: ["Неизвестно"],
    type: "Неизвестно",
    equipment: ["Неизвестно"]
  };
}

function toggleWeek(weekIndex) {
  const weekContent = document.getElementById(`week-${weekIndex}-content`);
  const weekHeader = document.getElementById(`week-${weekIndex}-header`);
  
  const isExpanded = weekContent.classList.contains('expanded');
  
  if (isExpanded) {
    weekContent.classList.remove('expanded');
    weekHeader.querySelector('.toggle-icon').textContent = '▶';
  } else {
    weekContent.classList.add('expanded');
    weekHeader.querySelector('.toggle-icon').textContent = '▼';
  }
}

function createWeekElement(week, weekIndex) {
  const weekElement = document.createElement('div');
  weekElement.className = 'week-accordion';
  
  weekElement.innerHTML = `
    <div id="week-${weekIndex}-header" class="week-header" onclick="toggleWeek(${weekIndex})">
      <span>Неделя ${weekIndex + 1}</span>
      <span class="toggle-icon">▶</span>
    </div>
    <div id="week-${weekIndex}-content" class="week-content">
      ${createDaysContent(week.days, weekIndex)}
    </div>
  `;
  
  return weekElement;
}

function createDaysContent(days, weekIndex) {
  return days.map((day, dayIndex) => `
    <div class="day-section">
      <h4>День ${dayIndex + 1}: ${day.focus || 'Тренировка'}</h4>
      ${createExercisesContent(day.exercises, weekIndex, dayIndex)}
    </div>
  `).join('');
}

function createExercisesContent(exercisesList, weekIndex, dayIndex) {
  return exercisesList.map((ex, exIndex) => {
    const exercise = findExerciseById(ex.exerciseId);
    return `
      <div class="exercise-item">
        <div class="exercise-info">
          <h5>${exercise.name_ru || exercise.name_en}</h5>
          <div class="exercise-meta">
            ${ex.sets} × ${ex.reps} ${ex.weight ? `(${ex.weight})` : ''}
            ${ex.rest ? ` | Отдых: ${ex.rest}` : ''}
          </div>
        </div>
        <div class="exercise-actions">
          <button class="btn small details-btn" data-exercise-id="${ex.exerciseId}">ℹ</button>
        </div>
      </div>
    `;
  }).join('');
}

function selectProgram(program) {
  selectedProgram = program;
  
  programTitle.textContent = program.name;
  
  programMeta.innerHTML = `
    <div class="program-meta">
      <span class="program-tag">Уровень: ${program.level}</span>
      <span class="program-tag">Цель: ${program.goal}</span>
      <span class="program-tag">Продолжительность: ${program.duration} недель</span>
      <span class="program-tag">Частота: ${program.frequency} раз/неделю</span>
    </div>
    <p>${program.description}</p>
  `;
  
  programWeeks.innerHTML = '';
  program.weeks.forEach((week, index) => {
    programWeeks.appendChild(createWeekElement(week, index));
  });
  
  // Добавляем обработчики для кнопок деталей упражнений
  programWeeks.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exerciseId = e.target.dataset.exerciseId;
      const exercise = findExerciseById(exerciseId);
      showExerciseDetails(exercise);
    });
  });
  
  programDetails.style.display = 'block';
}

function showExerciseDetails(exercise) {
  const meta = [
    exercise.type ? "Тип: " + exercise.type : "",
    exercise.groups?.length ? "Группы: " + exercise.groups.join(", ") : "",
    exercise.targets?.length ? "Цели: " + exercise.targets.join(", ") : "",
    exercise.equipment?.length ? "Оборудование: " + exercise.equipment.join(", ") : ""
  ].filter(Boolean).join(" • ");
  
  const img = exercise.gif ? `<img src="${exercise.gif}" style="max-width:100%">` : "";
  showModal(`<h2>${exercise.name_ru || exercise.name_en}</h2><p>${meta}</p>${img}`);
}

// === Добавление программы в план ===
addToPlanBtn.addEventListener('click', function() {
  if (!selectedProgram) {
    alert('Выберите программу для добавления!');
    return;
  }
  
  const confirmAdd = confirm(`Добавить программу "${selectedProgram.name}" в ваш план тренировок?`);
  
  if (confirmAdd) {
    const success = saveProgramToWorkoutPlan(selectedProgram);
    
    if (success) {
      alert('Программа добавлена в ваш план! Перейдите на страницу "Тренировка" для просмотра.');
      
      // Перенаправляем на страницу тренировки
      window.location.href = 'workout.html';
    } else {
      alert('Произошла ошибка при добавлении программы. Попробуйте еще раз.');
    }
  }
});

// Функция сохранения программы в план тренировок
function saveProgramToWorkoutPlan(program) {
  try {
    // Преобразуем программу в формат плана тренировки
    const workoutPlan = convertProgramToWorkoutPlan(program);
    
    // Сохраняем в localStorage для передачи на страницу тренировки
    localStorage.setItem('currentProgram', JSON.stringify({
      id: program.id,
      name: program.name,
      plan: workoutPlan,
      date: new Date().toISOString().split('T')[0]
    }));
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении программы:', error);
    return false;
  }
}

// Функция преобразования программы в план тренировки
function convertProgramToWorkoutPlan(program) {
  const workoutPlan = [];
  
  // Берем первую неделю для демонстрации
  const firstWeek = program.weeks[0];
  
  firstWeek.days.forEach((day, dayIndex) => {
    day.exercises.forEach(exerciseData => {
      const exercise = findExerciseById(exerciseData.exerciseId);
      if (exercise) {
        // Создаем объект упражнения для плана
        const planExercise = {
          meta: exercise,
          sets: Array(exerciseData.sets).fill().map(() => ({
            weight: null,
            reps: null
          })),
          // Сохраняем информацию о дне для группировки
          dayInfo: {
            dayNumber: dayIndex + 1,
            focus: day.focus
          }
        };
        workoutPlan.push(planExercise);
      }
    });
  });
  
  return workoutPlan;
}

// === Инициализация ===
(async function init() {
  await loadExercises();
  await loadPrograms();
  
  setupAdvancedFilters();
  applyFilters();
})();

// Дополнительные функции фильтрации
function setupAdvancedFilters() {
  // Сохранение состояния фильтров
  const saveFilterState = debounce(() => {
    const filterState = {
      search: searchInput.value,
      level: filterLevel.value,
      goal: filterGoal.value,
      duration: filterDuration.value
    };
    localStorage.setItem('programFilters', JSON.stringify(filterState));
  }, 500);
  
  [searchInput, filterLevel, filterGoal, filterDuration].forEach(element => {
    element.addEventListener('change', saveFilterState);
  });
  
  // Восстановление состояния фильтров
  const savedFilters = JSON.parse(localStorage.getItem('programFilters') || '{}');
  if (savedFilters.search) searchInput.value = savedFilters.search;
  if (savedFilters.level) filterLevel.value = savedFilters.level;
  if (savedFilters.goal) filterGoal.value = savedFilters.goal;
  if (savedFilters.duration) filterDuration.value = savedFilters.duration;
}

// CSS стили для программ
const style = document.createElement('style');
style.textContent = `
  .programs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .program-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border: 1px solid #e9ecef;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .program-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  .program-card h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
  }
  
  .program-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .program-tag {
    background: #e3f2fd;
    color: #1976d2;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .program-description {
    color: #6c757d;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
  
  .view-program {
    width: 100%;
  }
  
  .week-accordion {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow: hidden;
  }
  
  .week-header {
    background: #f8f9fa;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    transition: background-color 0.2s;
  }
  
  .week-header:hover {
    background: #e9ecef;
  }
  
  .week-content {
    display: none;
    padding: 0;
  }
  
  .week-content.expanded {
    display: block;
    padding: 1rem;
  }
  
  .day-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .day-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .day-section h4 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1.1rem;
  }
  
  .exercise-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }
  
  .exercise-item:last-child {
    margin-bottom: 0;
  }
  
  .exercise-info h5 {
    margin: 0 0 0.25rem 0;
    color: #2c3e50;
    font-size: 1rem;
  }
  
  .exercise-meta {
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .exercise-actions {
    flex-shrink: 0;
  }
  
  .btn.small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .empty-message {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
    font-size: 1.1rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    font-size: 1.1rem;
  }
  
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .filters input, .filters select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    .programs-grid {
      grid-template-columns: 1fr;
    }
    
    .filters {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);