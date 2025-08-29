// Вспомогательные функции
function formatDate(date, format = 'date') {
  const d = new Date(date);
  
  if (format === 'date') {
    return d.toLocaleDateString('ru-RU');
  }
  
  if (format === 'week') {
    const year = d.getFullYear();
    const weekNumber = getWeekNumber(d);
    return `Неделя ${weekNumber}, ${year}`;
  }
  
  return d.toISOString().split('T')[0];
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getWorkoutsData() {
  try {
    const workoutsJson = localStorage.getItem("workouts");
    if (!workoutsJson) return [];
    
    const workoutsData = JSON.parse(workoutsJson);
    
    // Преобразуем объект в массив тренировок
    const workouts = [];
    for (const [date, exercises] of Object.entries(workoutsData)) {
      workouts.push({
        date: date,
        exercises: exercises
      });
    }
    
    // Сортируем по дате (от новых к старым)
    return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Ошибка получения данных тренировок:', error);
    return [];
  }
}

function calculateVolume(sets) {
  if (!sets || !Array.isArray(sets)) return 0;
  
  return sets.reduce((total, set) => {
    const weight = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps) || 0;
    return total + (weight * reps);
  }, 0);
}

function getMuscleGroupsFromExercise(exercise) {
  if (exercise.groups && Array.isArray(exercise.groups)) {
    return exercise.groups;
  }
  return ['Другое'];
}

function filterWorkoutsByTimeRange(workouts, timeRange) {
  if (timeRange === 'all') return workouts;
  
  const days = parseInt(timeRange);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= cutoffDate;
  });
}

// Основная функция аналитики
function initializeAnalytics() {
  const workouts = getWorkoutsData();
  
  // Показываем сообщение если нет данных
  const noDataMessage = document.getElementById('noDataMessage');
  if (workouts.length === 0) {
    noDataMessage.style.display = 'block';
    return;
  } else {
    noDataMessage.style.display = 'none';
  }
  
  // Обработка фильтра по времени
  const timeRangeSelect = document.getElementById('timeRange');
  let filteredWorkouts = filterWorkoutsByTimeRange(workouts, timeRangeSelect.value);
  
  timeRangeSelect.addEventListener('change', () => {
    filteredWorkouts = filterWorkoutsByTimeRange(workouts, timeRangeSelect.value);
    updateAnalytics(filteredWorkouts);
  });
  
  // Первоначальное обновление аналитики
  updateAnalytics(filteredWorkouts);
}

function updateAnalytics(workouts) {
  // ---- Метрики ----
  const totalWorkouts = workouts.length;
  
  // Все уникальные упражнения
  const allExercises = workouts.flatMap(w => w.exercises);
  const uniqueExercises = new Set(allExercises.map(ex => ex.name_ru || ex.name_en));
  const totalExercises = uniqueExercises.size;
  
  // Расчет тоннажа
  const totalVolume = workouts.reduce((acc, w) => {
    return acc + w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0);
  }, 0);
  
  const avgVolume = totalWorkouts ? Math.round(totalVolume / totalWorkouts) : 0;
  
  // Лучший день
  let bestDay = null;
  let maxDayVolume = 0;
  
  workouts.forEach(w => {
    const dayVolume = w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0);
    if (dayVolume > maxDayVolume) {
      maxDayVolume = dayVolume;
      bestDay = formatDate(w.date);
    }
  });
  
  // Обновление DOM
  document.getElementById("totalWorkouts").querySelector('.stat-value').textContent = totalWorkouts;
  document.getElementById("totalExercises").querySelector('.stat-value').textContent = totalExercises;
  document.getElementById("totalVolume").querySelector('.stat-value').textContent = `${totalVolume} кг`;
  document.getElementById("avgVolume").querySelector('.stat-value').textContent = `${avgVolume} кг`;
  document.getElementById("bestDay").querySelector('.stat-value').textContent = bestDay || "—";
  
  // ---- Данные для графиков ----
  const byWeek = {};
  const volumeByDate = {};
  const muscleGroups = {};
  const exerciseFrequency = {};
  
  workouts.forEach(w => {
    const week = formatDate(w.date, "week");
    byWeek[week] = (byWeek[week] || 0) + 1;
    
    const dateStr = formatDate(w.date);
    const dayVolume = w.exercises.reduce((sum, ex) => sum + calculateVolume(ex.sets), 0);
    volumeByDate[dateStr] = (volumeByDate[dateStr] || 0) + dayVolume;
    
    w.exercises.forEach(ex => {
      // Мышечные группы
      const groups = getMuscleGroupsFromExercise(ex);
      groups.forEach(group => {
        muscleGroups[group] = (muscleGroups[group] || 0) + 1;
      });
      
      // Частота упражнений
      const exName = ex.name_ru || ex.name_en || 'Неизвестное';
      exerciseFrequency[exName] = (exerciseFrequency[exName] || 0) + 1;
    });
  });
  
  // Обновляем графики
  updateCharts(byWeek, volumeByDate, muscleGroups, exerciseFrequency);
  
  // Обновляем достижения
  updateAchievements(totalWorkouts, totalVolume, avgVolume, muscleGroups);
}

function updateCharts(byWeek, volumeByDate, muscleGroups, exerciseFrequency) {
  // Тренировки по неделям
  const workoutsChart = new Chart(document.getElementById("workoutsPerWeek"), {
    type: "bar",
    data: {
      labels: Object.keys(byWeek),
      datasets: [{
        label: "Количество тренировок",
        data: Object.values(byWeek),
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  
  // Динамика тоннажа
  const volumeChart = new Chart(document.getElementById("volumeTrend"), {
    type: "line",
    data: {
      labels: Object.keys(volumeByDate),
      datasets: [{
        label: "Тоннаж (кг)",
        data: Object.values(volumeByDate),
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  
  // Распределение по группам мышц
  const muscleChart = new Chart(document.getElementById("muscleDistribution"), {
    type: "doughnut",
    data: {
      labels: Object.keys(muscleGroups),
      datasets: [{
        data: Object.values(muscleGroups),
        backgroundColor: [
          "#e74c3c", "#3498db", "#2ecc71", "#f1c40f", 
          "#9b59b6", "#1abc9c", "#e67e22", "#95a5a6",
          "#34495e", "#d35400"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
  
  // Топ упражнений (топ 5)
  const topExercises = Object.entries(exerciseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const exercisesChart = new Chart(document.getElementById("topExercises"), {
    type: "bar",
    data: {
      labels: topExercises.map(e => e[0]),
      datasets: [{
        label: "Количество выполнений",
        data: topExercises.map(e => e[1]),
        backgroundColor: "#9b59b6"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      },
      indexAxis: 'y'
    }
  });
}

function updateAchievements(totalWorkouts, totalVolume, avgVolume, muscleGroups) {
  const achievements = [];
  
  // Критерии достижений
  if (totalWorkouts >= 1) achievements.push({ 
    title: "Первая тренировка!", 
    desc: "Вы начали свой путь",
    icon: "🎯"
  });
  
  if (totalWorkouts >= 5) achievements.push({ 
    title: "Регулярные тренировки", 
    desc: "5+ тренировок",
    icon: "💪"
  });
  
  if (totalWorkouts >= 10) achievements.push({ 
    title: "Серийный атлет", 
    desc: "10+ тренировок",
    icon: "🔥"
  });
  
  if (totalWorkouts >= 20) achievements.push({ 
    title: "Опытный спортсмен", 
    desc: "20+ тренировок",
    icon: "🏆"
  });
  
  if (totalVolume >= 1000) achievements.push({ 
    title: "Первая тонна", 
    desc: "1000+ кг общего тоннажа",
    icon: "⚖️"
  });
  
  if (totalVolume >= 5000) achievements.push({ 
    title: "Серьёзные объёмы", 
    desc: "5000+ кг общего тоннажа",
    icon: "🏋️"
  });
  
  if (totalVolume >= 10000) achievements.push({ 
    title: "Железный человек", 
    desc: "10000+ кг общего тоннажа",
    icon: "🤖"
  });
  
  if (avgVolume >= 500) achievements.push({ 
    title: "Стабильный прогресс", 
    desc: "Средний тоннаж > 500 кг",
    icon: "📈"
  });
  
  if (avgVolume >= 1000) achievements.push({ 
    title: "Мощная работа", 
    desc: "Средний тоннаж > 1000 кг",
    icon: "💥"
  });
  
  if (Object.keys(muscleGroups).length >= 3) achievements.push({ 
    title: "Разносторонний атлет", 
    desc: "3+ мышечные группы",
    icon: "🔀"
  });
  
  if (Object.keys(muscleGroups).length >= 5) achievements.push({ 
    title: "Полноценное развитие", 
    desc: "5+ мышечные группы",
    icon: "🌈"
  });
  
  // Отображаем достижения
  const list = document.getElementById("achievementsList");
  list.innerHTML = '';
  
  achievements.forEach(achievement => {
    const achievementEl = document.createElement('div');
    achievementEl.className = 'achievement-card';
    achievementEl.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-content">
        <h4>${achievement.title}</h4>
        <p>${achievement.desc}</p>
      </div>
    `;
    list.appendChild(achievementEl);
  });
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeAnalytics);