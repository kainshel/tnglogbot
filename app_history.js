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
const monthFilter = document.getElementById('month-filter');
const exerciseFilter = document.getElementById('exercise-filter');
const modalBack = document.getElementById('modalBack');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Основная функция загрузки и отображения истории
function loadWorkoutHistory() {
  const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  
  // Если тренировок нет - показываем сообщение
  if (Object.keys(allWorkouts).length === 0) {
    noWorkoutsMessage.style.display = 'block';
    workoutsContainer.innerHTML = '';
    return;
  }
  
  noWorkoutsMessage.style.display = 'none';
  
  // Преобразуем в массив и сортируем по дате (новые сверху)
  const workoutArray = Object.entries(allWorkouts)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
  
  // Заполняем фильтр упражнений
  populateExerciseFilter(allWorkouts);
  
  // Применяем фильтры и рендерим
  applyFilters(workoutArray);
}

// Заполнение фильтра упражнений
function populateExerciseFilter(workouts) {
  const allExercises = new Set();
  
  Object.values(workouts).forEach(workout => {
    workout.forEach(exercise => {
      allExercises.add(exercise.name_ru);
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

// Применение фильтров
function applyFilters(workoutArray) {
  const selectedMonth = monthFilter.value; // Формат: "2023-11"
  const selectedExercise = exerciseFilter.value;
  
  const filteredWorkouts = workoutArray.filter(([date, exercises]) => {
    // Фильтр по месяцу
    if (selectedMonth && !date.startsWith(selectedMonth)) {
      return false;
    }
    
    // Фильтр по упражнению
    if (selectedExercise) {
      return exercises.some(ex => ex.name_ru === selectedExercise);
    }
    
    return true;
  });
  
  renderWorkouts(filteredWorkouts);
}

// Рендеринг списка тренировок
function renderWorkouts(workouts) {
  workoutsContainer.innerHTML = '';
  
  workouts.forEach(([date, exercises]) => {
    const workoutElement = document.createElement('div');
    workoutElement.className = 'card workout-item';
    
    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    workoutElement.innerHTML = `
      <h3>${formattedDate}</h3>
      <p><strong>Упражнений:</strong> ${exercises.length}</p>
      <p><strong>Всего подходов:</strong> ${exercises.reduce((total, ex) => total + ex.sets.length, 0)}</p>
      <button class="btn view-details" data-date="${date}">Подробнее</button>
      <button class="btn danger delete-workout" data-date="${date}">Удалить</button>
    `;
    
    workoutsContainer.appendChild(workoutElement);
  });
  
  // Добавляем обработчики событий
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
    <h2>Тренировка за ${new Date(date).toLocaleDateString('ru-RU')}</h2>
    <div class="workout-details">
  `;
  
  workout.forEach(exercise => {
    detailsHTML += `
      <div class="exercise-detail">
        <h3>${exercise.name_ru}</h3>
        <p><strong>Тип:</strong> ${exercise.type}</p>
        <p><strong>Оборудование:</strong> ${exercise.equipment.join(', ')}</p>
        <table>
          <tr><th>Подход</th><th>Вес (кг)</th><th>Повторения</th></tr>
    `;
    
    exercise.sets.forEach((set, index) => {
      detailsHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${set.weight || '-'}</td>
          <td>${set.reps || '-'}</td>
        </tr>
      `;
    });
    
    detailsHTML += `
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
  if (!confirm(`Удалить тренировку за ${new Date(date).toLocaleDateString('ru-RU')}?`)) {
    return;
  }
  
  const workouts = JSON.parse(localStorage.getItem('workouts') || '{}');
  delete workouts[date];
  localStorage.setItem('workouts', JSON.stringify(workouts));
  
  // Обновляем профиль (уменьшаем счетчики)
  updateProfileStats(workouts);
  
  loadWorkoutHistory(); // Перезагружаем список
}

// Обновление статистики в профиле
function updateProfileStats(workouts) {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  profile.totalWorkouts = Object.keys(workouts).length;
  
  // Пересчитываем уникальные упражнения
  let allExercises = [];
  Object.values(workouts).forEach(workout => {
    workout.forEach(ex => allExercises.push(ex.name_ru));
  });
  profile.totalExercises = new Set(allExercises).size;
  
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

// Сброс фильтров
function clearFilters() {
  monthFilter.value = '';
  exerciseFilter.value = '';
  loadWorkoutHistory();
}

// Обработчики событий
monthFilter.addEventListener('change', () => loadWorkoutHistory());
exerciseFilter.addEventListener('change', () => loadWorkoutHistory());
modalClose.addEventListener('click', () => modalBack.style.display = 'none');
modalBack.addEventListener('click', (e) => {
  if (e.target === modalBack) modalBack.style.display = 'none';
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем текущий месяц в фильтр по умолчанию
  const now = new Date();
  monthFilter.value = now.toISOString().slice(0, 7);
  
  loadWorkoutHistory();
});