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
let selectedDayIndex = null;

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

function toggleDay(dayIndex) {
  const dayContent = document.getElementById(`day-${dayIndex}-content`);
  const dayHeader = document.getElementById(`day-${dayIndex}-header`);
  
  const isExpanded = dayContent.classList.contains('expanded');
  
  if (isExpanded) {
    dayContent.classList.remove('expanded');
    dayHeader.querySelector('.toggle-icon').textContent = '▶';
    dayHeader.classList.remove('selected');
  } else {
    dayContent.classList.add('expanded');
    dayHeader.querySelector('.toggle-icon').textContent = '▼';
  }
}

function selectDay(dayIndex) {
  // Сбрасываем выделение со всех дней
  document.querySelectorAll('.day-header').forEach(header => {
    header.classList.remove('selected');
  });
  
  // Выделяем выбранный день
  const selectedHeader = document.getElementById(`day-${dayIndex}-header`);
  selectedHeader.classList.add('selected');
  
  selectedDayIndex = dayIndex;
  
  // Обновляем текст кнопки добавления
  const days = getProgramDays(selectedProgram);
  const selectedDay = days[dayIndex];
  addToPlanBtn.textContent = `➕ Добавить ${selectedDay.focus || `День ${dayIndex + 1}`}`;
  addToPlanBtn.style.display = 'block';
}

function createDayElement(day, dayIndex) {
  const dayElement = document.createElement('div');
  dayElement.className = 'day-accordion';
  
  dayElement.innerHTML = `
    <div id="day-${dayIndex}-header" class="day-header" onclick="toggleDay(${dayIndex})">
      <span>${day.focus || `День ${day.dayNumber || dayIndex + 1}`}</span>
      <span class="toggle-icon">▶</span>
    </div>
    <div id="day-${dayIndex}-content" class="day-content">
      <div class="day-actions">
        <button class="btn small select-day-btn" onclick="selectDay(${dayIndex})">✓ Выбрать этот день</button>
      </div>
      ${createExercisesContent(day.exercises, dayIndex)}
    </div>
  `;
  
  return dayElement;
}

function createExercisesContent(exercisesList, dayIndex) {
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

function getProgramDays(program) {
  if (program.days) {
    return program.days;
  } else if (program.weeks && program.weeks[0] && program.weeks[0].days) {
    return program.weeks[0].days;
  }
  return [];
}

function selectProgram(program) {
  selectedProgram = program;
  selectedDayIndex = null;
  
  programTitle.textContent = program.name;
  
  programMeta.innerHTML = `
    <div class="program-meta">
      <span class="program-tag">Уровень: ${program.level}</span>
      <span class="program-tag">Цель: ${program.goal}</span>
      <span class="program-tag">Продолжительность: ${program.duration} недель</span>
      <span class="program-tag">Частота: ${program.frequency} раз/неделю</span>
    </div>
    <p>${program.description}</p>
    <div class="program-instruction">
      <p>💡 <strong>Выберите нужный день тренировки ниже и нажмите "Добавить в план"</strong></p>
    </div>
  `;
  
  programWeeks.innerHTML = '';
  
  const days = getProgramDays(program);
  
  if (days.length === 0) {
    programWeeks.innerHTML = '<p class="empty-message">В программе нет дней тренировок</p>';
    addToPlanBtn.style.display = 'none';
    return;
  }
  
  days.forEach((day, index) => {
    programWeeks.appendChild(createDayElement(day, index));
  });
  
  // Добавляем обработчики для кнопок деталей упражнений
  programWeeks.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const exerciseId = e.target.dataset.exerciseId;
      const exercise = findExerciseById(exerciseId);
      showExerciseDetails(exercise);
    });
  });
  
  // Скрываем кнопку добавления до выбора дня
  addToPlanBtn.textContent = '➕ Добавить в план';
  addToPlanBtn.style.display = 'none';
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
  
  if (selectedDayIndex === null) {
    alert('Пожалуйста, выберите день тренировки!');
    return;
  }
  
  const days = getProgramDays(selectedProgram);
  const selectedDay = days[selectedDayIndex];
  const dayName = selectedDay.focus || `День ${selectedDayIndex + 1}`;
  
  const confirmAdd = confirm(`Добавить "${dayName}" в ваш план тренировок?`);
  
  if (confirmAdd) {
    const success = saveDayToWorkoutPlan(selectedProgram, selectedDayIndex);
    
    if (success) {
      alert(`"${dayName}" добавлен в ваш план! Перейдите на страницу "Тренировка" для просмотра.`);
      
      // Перенаправляем на страницу тренировки
      window.location.href = 'workout.html';
    } else {
      alert('Произошла ошибка при добавлении дня. Попробуйте еще раз.');
    }
  }
});

// Функция сохранения конкретного дня в план тренировок
function saveDayToWorkoutPlan(program, dayIndex) {
  try {
    const days = getProgramDays(program);
    const selectedDay = days[dayIndex];
    
    if (!selectedDay) {
      throw new Error('Выбранный день не найден');
    }
    
    // Преобразуем день в формат плана тренировки
    const workoutPlan = convertDayToWorkoutPlan(selectedDay, dayIndex);
    
    // Сохраняем в localStorage для передачи на страницу тренировки
    localStorage.setItem('currentProgram', JSON.stringify({
      id: program.id + '-day-' + (dayIndex + 1),
      name: `${program.name} - ${selectedDay.focus || `День ${dayIndex + 1}`}`,
      plan: workoutPlan,
      date: new Date().toISOString().split('T')[0],
      sourceProgram: program.name,
      dayNumber: dayIndex + 1
    }));
    
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении дня:', error);
    return false;
  }
}

// Функция преобразования дня в план тренировки
function convertDayToWorkoutPlan(day, dayIndex) {
  const workoutPlan = [];
  
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
  
  .program-instruction {
    background: #e8f5e9;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    border-left: 4px solid #4caf50;
  }
  
  .program-instruction p {
    margin: 0;
    color: #2e7d32;
  }
  
  .view-program {
    width: 100%;
  }
  
  .day-accordion {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow: hidden;
  }
  
  .day-header {
    background: #f8f9fa;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    transition: background-color 0.2s;
  }
  
  .day-header:hover {
    background: #e9ecef;
  }
  
  .day-header.selected {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
  }
  
  .day-content {
    display: none;
    padding: 0;
  }
  
  .day-content.expanded {
    display: block;
    padding: 1rem;
  }
  
  .day-actions {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .select-day-btn {
    background: #4caf50;
    color: white;
    border: none;
  }
  
  .select-day-btn:hover {
    background: #45a049;
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