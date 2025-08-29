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

// Элементы DOM
const workoutsContainer = document.getElementById('workouts-container');
const noWorkoutsMessage = document.getElementById('no-workouts-message');
const noResultsMessage = document.getElementById('no-results-message');
const monthFilter = document.getElementById('month-filter');
const exerciseFilter = document.getElementById('exercise-filter');
const searchInput = document.getElementById('search-input');
const clearFiltersBtn = document.getElementById('clear-filters');
const modalBack = document.getElementById('modalBack');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Элементы статистики
const totalWorkoutsCount = document.getElementById('total-workouts-count');
const totalExercisesCount = document.getElementById('total-exercises-count');
const totalVolumeElement = document.getElementById('total-volume');
const filteredCountElement = document.getElementById('filtered-count');

// Пагинация
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Настройки пагинации
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredWorkouts = [];

// Вспомогательные функции
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

function calculateExerciseVolume(sets) {
  if (!sets || !Array.isArray(sets)) return 0;
  return sets.reduce((total, set) => {
    const weight = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps) || 0;
    return total + (weight * reps);
  }, 0);
}

function calculateTotalVolume(exercises) {
  return exercises.reduce((total, exercise) => {
    return total + calculateExerciseVolume(exercise.sets);
  }, 0);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Основная функция загрузки истории
function loadWorkoutHistory() {
  const allWorkouts = getWorkoutsData();
  
  if (allWorkouts.length === 0) {
    showNoWorkoutsMessage();
    return;
  }
  
  hideNoWorkoutsMessage();
  populateExerciseFilter(allWorkouts);
  updateGlobalStats(allWorkouts);
  applyFilters();
}

function getWorkoutsData() {
  try {
    const workoutsJson = localStorage.getItem("workouts");
    if (!workoutsJson) return [];
    
    const workoutsData = JSON.parse(workoutsJson);
    const workouts = [];
    
    for (const [date, exercises] of Object.entries(workoutsData)) {
      workouts.push({
        date: date,
        exercises: exercises,
        totalVolume: calculateTotalVolume(exercises),
        totalSets: exercises.reduce((total, ex) => total + (ex.sets?.length || 0), 0)
      });
    }
    
    return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Ошибка получения данных тренировок:', error);
    return [];
  }
}

function showNoWorkoutsMessage() {
  noWorkoutsMessage.style.display = 'block';
  noResultsMessage.style.display = 'none';
  workoutsContainer.innerHTML = '';
  pagination.style.display = 'none';
}

function hideNoWorkoutsMessage() {
  noWorkoutsMessage.style.display = 'none';
}

// Заполнение фильтра упражнений
function populateExerciseFilter(workouts) {
  const allExercises = new Set();
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.name_ru) allExercises.add(exercise.name_ru);
      if (exercise.name_en) allExercises.add(exercise.name_en);
    });
  });
  
  exerciseFilter.innerHTML = '<option value="">Все упражнения</option>';
  [...allExercises].sort().forEach(exercise => {
    const option = document.createElement('option');
    option.value = exercise;
    option.textContent = exercise;
    exerciseFilter.appendChild(option);
  });
}

// Обновление глобальной статистики
function updateGlobalStats(workouts) {
  totalWorkoutsCount.textContent = workouts.length;
  
  const allExercises = new Set();
  let totalVolume = 0;
  
  workouts.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.name_ru) allExercises.add(exercise.name_ru);
      if (exercise.name_en) allExercises.add(exercise.name_en);
    });
    totalVolume += workout.totalVolume;
  });
  
  totalExercisesCount.textContent = allExercises.size;
  totalVolumeElement.textContent = totalVolume;
}

// Применение фильтров
function applyFilters() {
  const allWorkouts = getWorkoutsData();
  const selectedMonth = monthFilter.value;
  const selectedExercise = exerciseFilter.value;
  const searchText = searchInput.value.toLowerCase();
  
  filteredWorkouts = allWorkouts.filter(workout => {
    // Фильтр по месяцу
    if (selectedMonth && !workout.date.startsWith(selectedMonth)) {
      return false;
    }
    
    // Фильтр по упражнению
    if (selectedExercise) {
      const hasExercise = workout.exercises.some(ex => 
        ex.name_ru === selectedExercise || ex.name_en === selectedExercise
      );
      if (!hasExercise) return false;
    }
    
    // Поиск по тексту
    if (searchText) {
      const hasMatch = workout.exercises.some(ex => 
        (ex.name_ru && ex.name_ru.toLowerCase().includes(searchText)) ||
        (ex.name_en && ex.name_en.toLowerCase().includes(searchText))
      );
      if (!hasMatch) return false;
    }
    
    return true;
  });
  
  filteredCountElement.textContent = filteredWorkouts.length;
  
  if (filteredWorkouts.length === 0) {
    noResultsMessage.style.display = 'block';
    workoutsContainer.innerHTML = '';
    pagination.style.display = 'none';
  } else {
    noResultsMessage.style.display = 'none';
    currentPage = 1;
    renderPaginatedWorkouts();
  }
}

// Пагинация и рендеринг
function renderPaginatedWorkouts() {
  const totalPages = Math.ceil(filteredWorkouts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const workoutsToShow = filteredWorkouts.slice(startIndex, endIndex);
  
  renderWorkouts(workoutsToShow);
  updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
  pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

function renderWorkouts(workouts) {
  workoutsContainer.innerHTML = '';
  
  workouts.forEach(workout => {
    const workoutElement = document.createElement('div');
    workoutElement.className = 'card workout-item';
    
    workoutElement.innerHTML = `
      <div class="workout-header">
        <h3>${formatDate(workout.date)}</h3>
        <span class="workout-volume">${workout.totalVolume} кг</span>
      </div>
      
      <div class="workout-stats">
        <span class="stat-badge">${workout.exercises.length} упражн.</span>
        <span class="stat-badge">${workout.totalSets} подходов</span>
      </div>
      
      <div class="exercises-preview">
        ${workout.exercises.slice(0, 3).map(ex => `
          <span class="exercise-tag">${ex.name_ru || ex.name_en}</span>
        `).join('')}
        ${workout.exercises.length > 3 ? `<span class="exercise-tag">+${workout.exercises.length - 3} еще</span>` : ''}
      </div>
      
      <div class="workout-actions">
        <button class="btn view-details" data-date="${workout.date}">📊 Подробнее</button>
        <button class="btn danger delete-workout" data-date="${workout.date}">🗑️ Удалить</button>
      </div>
    `;
    
    workoutsContainer.appendChild(workoutElement);
  });
  
  // Добавляем обработчики событий
  addWorkoutEventListeners();
}

function addWorkoutEventListeners() {
  document.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const date = e.target.dataset.date;
      showWorkoutDetails(date);
    });
  });
  
  document.querySelectorAll('.delete-workout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const date = e.target.dataset.date;
      deleteWorkout(date);
    });
  });
}

// Показать детали тренировки
function showWorkoutDetails(date) {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  const workout = workouts[date];
  
  if (!workout) return;
  
  let detailsHTML = `
    <h2>Тренировка за ${formatDate(date)}</h2>
    <div class="workout-details-header">
      <span class="total-volume">Общий тоннаж: ${calculateTotalVolume(workout)} кг</span>
    </div>
    <div class="workout-details">
  `;
  
  workout.forEach(exercise => {
    const exerciseVolume = calculateExerciseVolume(exercise.sets);
    
    detailsHTML += `
      <div class="exercise-detail-card">
        <div class="exercise-header">
          <h3>${exercise.name_ru || exercise.name_en}</h3>
          <span class="exercise-volume">${exerciseVolume} кг</span>
        </div>
        
        <div class="exercise-meta">
          ${exercise.type ? `<span class="meta-tag">${exercise.type}</span>` : ''}
          ${exercise.equipment?.length ? `<span class="meta-tag">${exercise.equipment.join(', ')}</span>` : ''}
          ${exercise.groups?.length ? `<span class="meta-tag">${exercise.groups.join(', ')}</span>` : ''}
        </div>
        
        <table class="sets-table">
          <thead>
            <tr>
              <th>Подход</th>
              <th>Вес (кг)</th>
              <th>Повторения</th>
              <th>Объем</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    exercise.sets.forEach((set, index) => {
      const setVolume = (set.weight || 0) * (set.reps || 0);
      detailsHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${set.weight || '-'}</td>
          <td>${set.reps || '-'}</td>
          <td>${setVolume} кг</td>
        </tr>
      `;
    });
    
    detailsHTML += `
          </tbody>
        </table>
      </div>
    `;
  });
  
  detailsHTML += '</div>';
  modalContent.innerHTML = detailsHTML;
  modalBack.style.display = 'flex';
}

// Удаление тренировки
function deleteWorkout(date) {
  if (!confirm(`Удалить тренировку за ${formatDate(date)}?`)) {
    return;
  }
  
  const workouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  delete workouts[date];
  localStorage.setItem('workouts', JSON.stringify(workouts));
  
  // Показываем уведомление
  showNotification('Тренировка удалена', 'success');
  
  // Перезагружаем историю
  loadWorkoutHistory();
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Сброс фильтров
function clearFilters() {
  monthFilter.value = '';
  exerciseFilter.value = '';
  searchInput.value = '';
  loadWorkoutHistory();
}

// Обработчики событий
monthFilter.addEventListener('change', () => applyFilters());
exerciseFilter.addEventListener('change', () => applyFilters());
searchInput.addEventListener('input', debounce(() => applyFilters(), 300));
clearFiltersBtn.addEventListener('click', clearFilters);

modalClose.addEventListener('click', () => {
  modalBack.style.display = 'none';
});

modalBack.addEventListener('click', (e) => {
  if (e.target === modalBack) {
    modalBack.style.display = 'none';
  }
});

// Пагинация
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedWorkouts();
  }
});

nextPageBtn.addEventListener('click', () => {
  const totalPages = Math.ceil(filteredWorkouts.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderPaginatedWorkouts();
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем текущий месяц в фильтр по умолчанию
  const now = new Date();
  monthFilter.value = now.toISOString().slice(0, 7);
  
  loadWorkoutHistory();
});

// Добавьте эти функции в конец файла app_history.js

// Показать расширенные детали тренировки с графиками
function showAdvancedWorkoutDetails(date) {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  const workout = workouts[date];
  
  if (!workout) return;
  
  const workoutHistory = getWorkoutHistoryForComparison(date);
  const exerciseProgressData = getExerciseProgressData(workout, workoutHistory);
  
  let detailsHTML = `
    <div class="workout-detail-view">
      <div class="detail-header">
        <h2>Тренировка за ${formatDate(date)}</h2>
        <div class="header-stats">
          <span class="stat">${workout.length} упражнений</span>
          <span class="stat">${calculateTotalVolume(workout)} кг</span>
          <span class="stat">${workout.reduce((total, ex) => total + (ex.sets?.length || 0), 0)} подходов</span>
        </div>
      </div>
      
      <div class="detail-tabs">
        <button class="tab-btn active" data-tab="exercises">Упражнения</button>
        <button class="tab-btn" data-tab="progress">Прогресс</button>
        <button class="tab-btn" data-tab="stats">Статистика</button>
      </div>
      
      <div class="tab-content">
        <div class="tab-pane active" id="tab-exercises">
          ${renderExercisesTab(workout)}
        </div>
        
        <div class="tab-pane" id="tab-progress">
          ${renderProgressTab(exerciseProgressData)}
        </div>
        
        <div class="tab-pane" id="tab-stats">
          ${renderStatsTab(workout, workoutHistory)}
        </div>
      </div>
    </div>
  `;
  
  modalContent.innerHTML = detailsHTML;
  modalBack.style.display = 'flex';
  
  // Инициализация табов
  initDetailTabs();
  
  // Инициализация графиков прогресса
  setTimeout(() => {
    initProgressCharts(exerciseProgressData);
  }, 100);
}

// Получение истории для сравнения
function getWorkoutHistoryForComparison(currentDate) {
  const workouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  const history = [];
  
  for (const [date, exercises] of Object.entries(workouts)) {
    if (date !== currentDate) {
      history.push({
        date: date,
        exercises: exercises,
        totalVolume: calculateTotalVolume(exercises)
      });
    }
  }
  
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Данные прогресса по упражнениям
function getExerciseProgressData(currentWorkout, workoutHistory) {
  const progressData = {};
  
  currentWorkout.forEach(exercise => {
    const exerciseName = exercise.name_ru || exercise.name_en;
    progressData[exerciseName] = {
      current: exercise,
      history: []
    };
    
    // Собираем историю этого упражнения
    workoutHistory.forEach(workout => {
      workout.exercises.forEach(ex => {
        if ((ex.name_ru === exerciseName || ex.name_en === exerciseName) && ex.sets) {
          const bestSet = ex.sets.reduce((best, set) => {
            const currentWeight = parseFloat(set.weight) || 0;
            const currentReps = parseInt(set.reps) || 0;
            return currentWeight > best.weight ? { weight: currentWeight, reps: currentReps } : best;
          }, { weight: 0, reps: 0 });
          
          progressData[exerciseName].history.push({
            date: workout.date,
            bestSet: bestSet,
            volume: calculateExerciseVolume(ex.sets),
            sets: ex.sets.length
          });
        }
      });
    });
    
    // Сортируем историю по дате
    progressData[exerciseName].history.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  
  return progressData;
}

// Рендер таба с упражнениями
function renderExercisesTab(workout) {
  return `
    <div class="exercises-detailed">
      ${workout.map((exercise, index) => `
        <div class="exercise-detail-card">
          <div class="exercise-header">
            <h3>${exercise.name_ru || exercise.name_en}</h3>
            <span class="exercise-volume">${calculateExerciseVolume(exercise.sets)} кг</span>
          </div>
          
          <div class="exercise-meta">
            ${exercise.type ? `<span class="meta-tag">${exercise.type}</span>` : ''}
            ${exercise.equipment?.length ? `<span class="meta-tag">${exercise.equipment.join(', ')}</span>` : ''}
            ${exercise.groups?.length ? `<span class="meta-tag">${exercise.groups.join(', ')}</span>` : ''}
          </div>
          
          <div class="sets-detailed">
            <h4>Подходы:</h4>
            <table class="sets-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Вес (кг)</th>
                  <th>Повторения</th>
                  <th>Объем</th>
                  <th>1ПМ*</th>
                </tr>
              </thead>
              <tbody>
                ${exercise.sets.map((set, setIndex) => {
                  const weight = set.weight || 0;
                  const reps = set.reps || 0;
                  const volume = weight * reps;
                  const oneRepMax = calculateOneRepMax(weight, reps);
                  
                  return `
                    <tr>
                      <td>${setIndex + 1}</td>
                      <td><strong>${weight}</strong></td>
                      <td>${reps}</td>
                      <td>${volume} кг</td>
                      <td>${oneRepMax} кг</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            <p class="note">*1ПМ - расчетный одноповторный максимум (формула Эпли)</p>
          </div>
          
          <div class="exercise-summary">
            <div class="summary-item">
              <span class="label">Лучший подход:</span>
              <span class="value">${getBestSet(exercise.sets)}</span>
            </div>
            <div class="summary-item">
              <span class="label">Средний вес:</span>
              <span class="value">${getAverageWeight(exercise.sets)} кг</span>
            </div>
            <div class="summary-item">
              <span class="label">Всего объема:</span>
              <span class="value">${calculateExerciseVolume(exercise.sets)} кг</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Рендер таба с прогрессом
function renderProgressTab(progressData) {
  return `
    <div class="progress-view">
      <h3>Прогресс по упражнениям</h3>
      ${Object.entries(progressData).map(([exerciseName, data]) => `
        <div class="exercise-progress">
          <h4>${exerciseName}</h4>
          ${data.history.length > 0 ? `
            <div class="progress-charts">
              <div class="chart-container">
                <canvas class="progress-chart" data-exercise="${exerciseName}" data-type="weight"></canvas>
              </div>
              <div class="chart-container">
                <canvas class="progress-chart" data-exercise="${exerciseName}" data-type="volume"></canvas>
              </div>
            </div>
          ` : `
            <p class="no-history">Нет данных для сравнения</p>
          `}
        </div>
      `).join('')}
    </div>
  `;
}

// Рендер таба со статистикой
function renderStatsTab(workout, workoutHistory) {
  const currentVolume = calculateTotalVolume(workout);
  const avgVolume = workoutHistory.length > 0 ? 
    workoutHistory.reduce((sum, w) => sum + w.totalVolume, 0) / workoutHistory.length : 0;
  
  const volumeComparison = currentVolume / avgVolume;
  
  return `
    <div class="stats-view">
      <h3>Сравнение с предыдущими тренировками</h3>
      
      <div class="comparison-cards">
        <div class="comparison-card ${volumeComparison >= 1.1 ? 'positive' : volumeComparison <= 0.9 ? 'negative' : 'neutral'}">
          <h4>Общий тоннаж</h4>
          <div class="comparison-value">${currentVolume} кг</div>
          <div class="comparison-diff">
            ${volumeComparison >= 1 ? '+' : ''}${Math.round((volumeComparison - 1) * 100)}%
          </div>
          <div class="comparison-label">от среднего</div>
        </div>
        
        <div class="comparison-card">
          <h4>Количество упражнений</h4>
          <div class="comparison-value">${workout.length}</div>
          <div class="comparison-label">всего</div>
        </div>
        
        <div class="comparison-card">
          <h4>Общее время</h4>
          <div class="comparison-value">~${Math.round(workout.length * 15)} мин</div>
          <div class="comparison-label">примерно</div>
        </div>
      </div>
      
      <div class="intensity-analysis">
        <h4>Анализ интенсивности</h4>
        ${workout.map(exercise => {
          const avgIntensity = calculateExerciseIntensity(exercise.sets);
          return `
            <div class="intensity-item">
              <span class="exercise-name">${exercise.name_ru || exercise.name_en}</span>
              <div class="intensity-bar">
                <div class="intensity-fill" style="width: ${avgIntensity}%"></div>
              </div>
              <span class="intensity-value">${Math.round(avgIntensity)}%</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Вспомогательные функции для расчетов
function calculateOneRepMax(weight, reps) {
  if (!weight || !reps || reps === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

function getBestSet(sets) {
  if (!sets || sets.length === 0) return '-';
  
  const bestSet = sets.reduce((best, set) => {
    const currentWeight = parseFloat(set.weight) || 0;
    return currentWeight > best.weight ? { weight: currentWeight, reps: set.reps || 0 } : best;
  }, { weight: 0, reps: 0 });
  
  return `${bestSet.weight} кг × ${bestSet.reps}`;
}

function getAverageWeight(sets) {
  if (!sets || sets.length === 0) return 0;
  
  const total = sets.reduce((sum, set) => sum + (parseFloat(set.weight) || 0), 0);
  return Math.round(total / sets.length);
}

function calculateExerciseIntensity(sets) {
  if (!sets || sets.length === 0) return 0;
  
  const maxWeight = sets.reduce((max, set) => Math.max(max, parseFloat(set.weight) || 0), 0);
  if (maxWeight === 0) return 0;
  
  const avgWeight = sets.reduce((sum, set) => sum + (parseFloat(set.weight) || 0), 0) / sets.length;
  return (avgWeight / maxWeight) * 100;
}

// Инициализация табов
function initDetailTabs() {
  const tabBtns = modalContent.querySelectorAll('.tab-btn');
  const tabPanes = modalContent.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      // Деактивируем все табы
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Активируем выбранный
      btn.classList.add('active');
      modalContent.querySelector(`#tab-${tabName}`).classList.add('active');
    });
  });
}

// Инициализация графиков прогресса
function initProgressCharts(progressData) {
  modalContent.querySelectorAll('.progress-chart').forEach(canvas => {
    const exerciseName = canvas.dataset.exercise;
    const chartType = canvas.dataset.type;
    const data = progressData[exerciseName];
    
    if (data && data.history.length > 0) {
      const chartData = prepareChartData(data, chartType);
      renderProgressChart(canvas, chartData, chartType, exerciseName);
    }
  });
}

function prepareChartData(data, chartType) {
  const labels = data.history.map(item => formatDate(item.date, 'short'));
  const values = data.history.map(item => 
    chartType === 'weight' ? item.bestSet.weight : item.volume
  );
  
  return { labels, values };
}

function renderProgressChart(canvas, data, chartType, exerciseName) {
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: chartType === 'weight' ? 'Вес (кг)' : 'Объем (кг)',
        data: data.values,
        borderColor: chartType === 'weight' ? '#e74c3c' : '#3498db',
        backgroundColor: chartType === 'weight' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `${exerciseName} - ${chartType === 'weight' ? 'Максимальный вес' : 'Объем'}`
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Обновите функцию showWorkoutDetails для использования расширенного просмотра
function showWorkoutDetails(date) {
  showAdvancedWorkoutDetails(date);
}

// Добавьте эту вспомогательную функцию для короткого формата даты
function formatDate(dateString, format = 'long') {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    });
  }
  
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}