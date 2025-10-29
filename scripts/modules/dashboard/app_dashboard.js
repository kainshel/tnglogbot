// app_dashboard.js - Улучшенная логика главной страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
	 setupModalHandlers(); // Добавьте эту строку
    loadMotivationalQuote();
});

// Ожидаем инициализации Telegram
document.addEventListener('telegramReady', function(event) {
    const telegramApp = event.detail;
    updateUserInterface(telegramApp);
    loadUserData();
    checkAchievements();
});

function initializeDashboard() {
    console.log('Инициализация улучшенной главной страницы...');
    showLoadingSkeletons();
    initializeGreeting();
    setupNotificationSystem();
}

function updateUserInterface(telegramApp) {
    if (telegramApp && telegramApp.user) {
        const userName = `${telegramApp.user.first_name || ''} ${telegramApp.user.last_name || ''}`.trim();
        document.getElementById('user-name').textContent = userName || 'Спортсмен';
        
        // Обновляем аватар, если есть фото
        if (telegramApp.user.photo_url) {
            updateUserAvatar(telegramApp.user.photo_url);
        }
    }
}

function updateUserAvatar(photoUrl) {
    const avatarElement = document.getElementById('user-avatar');
    const placeholder = document.getElementById('avatar-placeholder');
    
    if (photoUrl) {
        placeholder.style.display = 'none';
        avatarElement.style.backgroundImage = `url(${photoUrl})`;
        avatarElement.classList.add('has-avatar');
    }
}

function initializeGreeting() {
    const hour = new Date().getHours();
    const greetingEmoji = document.getElementById('greeting-emoji');
    
    if (hour < 12) {
        greetingEmoji.textContent = '🌅';
    } else if (hour < 18) {
        greetingEmoji.textContent = '☀️';
    } else {
        greetingEmoji.textContent = '🌙';
    }
}

function loadUserData() {
    loadUserStats();
    loadRecentWorkouts();
    loadFavoriteExercises();
    loadUpcomingWorkouts();
    loadAchievementsPreview();
}

function loadUserStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('userStats')) || calculateUserStats();
        updateStatsUI(stats);
        updateProgressBars(stats);
        updateTrendIndicators(stats);
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        showEmptyStats();
    }
}

function calculateUserStats() {
    try {
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Подсчет тренировок за неделю
        const weekWorkouts = workoutHistory.filter(workout => {
            if (!workout || !workout.date) return false;
            
            let workoutDate;
            if (typeof workout.date === 'string') {
                workoutDate = new Date(workout.date);
            } else if (workout.date instanceof Date) {
                workoutDate = workout.date;
            } else {
                return false;
            }
            
            return workoutDate >= startOfWeek;
        }).length;
        
        // Подсчет уникальных упражнений
        const allExercises = new Set();
        let totalSets = 0;
        
        workoutHistory.forEach(workout => {
            if (workout.exercises && Array.isArray(workout.exercises)) {
                workout.exercises.forEach(exercise => {
                    if (exercise && exercise.id) {
                        allExercises.add(exercise.id);
                        totalSets += exercise.sets || 0;
                    }
                });
            }
        });
        
        // Расчет прогресса недели
        const weekProgress = Math.min(weekWorkouts / 7 * 100, 100);
        
        const stats = {
            totalWorkouts: workoutHistory.length,
            weekWorkouts: weekWorkouts,
            totalExercises: allExercises.size,
            totalSets: totalSets,
            weekProgress: weekProgress,
            lastWorkout: workoutHistory.length > 0 ? formatDate(workoutHistory[0].date) : '—',
            lastWorkoutDate: workoutHistory.length > 0 ? new Date(workoutHistory[0].date) : null
        };
        
        localStorage.setItem('userStats', JSON.stringify(stats));
        return stats;
    } catch (error) {
        console.error('Ошибка расчета статистики:', error);
        return getDefaultStats();
    }
}

function getDefaultStats() {
    return {
        totalWorkouts: 0,
        weekWorkouts: 0,
        totalExercises: 0,
        totalSets: 0,
        weekProgress: 0,
        lastWorkout: '—',
        lastWorkoutDate: null
    };
}

function updateStatsUI(stats) {
    hideLoadingSkeletons();
    
    document.getElementById('total-workouts').textContent = stats.totalWorkouts;
    document.getElementById('week-workouts').textContent = stats.weekWorkouts;
    document.getElementById('total-exercises').textContent = stats.totalExercises;
    document.getElementById('last-workout').textContent = stats.lastWorkout;
    
    // Обновляем индикатор давности последней тренировки
    updateWorkoutRecency(stats.lastWorkoutDate);
}

function updateProgressBars(stats) {
    const progressFill = document.getElementById('week-progress');
    const progressText = document.getElementById('week-progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${stats.weekProgress}%`;
        progressText.textContent = `${stats.weekWorkouts}/7 дней`;
    }
}

function updateTrendIndicators(stats) {
    const previousStats = JSON.parse(localStorage.getItem('previousUserStats')) || getDefaultStats();
    
    // Обновляем индикаторы трендов
    updateTrendIndicator('total-trend', stats.totalWorkouts, previousStats.totalWorkouts);
    updateTrendIndicator('exercises-trend', stats.totalExercises, previousStats.totalExercises);
    
    // Сохраняем текущую статистику как предыдущую
    localStorage.setItem('previousUserStats', JSON.stringify(stats));
}

function updateTrendIndicator(elementId, currentValue, previousValue) {
    const trendElement = document.getElementById(elementId);
    if (!trendElement) return;
    
    const difference = currentValue - previousValue;
    
    if (difference > 0) {
        trendElement.textContent = `+${difference} ↗️`;
        trendElement.className = 'stat-trend positive';
    } else if (difference < 0) {
        trendElement.textContent = `${difference} ↘️`;
        trendElement.className = 'stat-trend negative';
    } else {
        trendElement.textContent = '→';
        trendElement.className = 'stat-trend neutral';
    }
}

function updateWorkoutRecency(lastWorkoutDate) {
    const recencyElement = document.getElementById('workout-recency');
    if (!recencyElement || !lastWorkoutDate) return;
    
    const today = new Date();
    const lastDate = new Date(lastWorkoutDate);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        recencyElement.textContent = 'Вчера ✅';
        recencyElement.className = 'workout-recency recent';
    } else if (diffDays <= 3) {
        recencyElement.textContent = `${diffDays} дня назад ✅`;
        recencyElement.className = 'workout-recency recent';
    } else if (diffDays <= 7) {
        recencyElement.textContent = `${diffDays} дней назад ⚠️`;
        recencyElement.className = 'workout-recency warning';
    } else {
        recencyElement.textContent = `${diffDays} дней назад ❌`;
        recencyElement.className = 'workout-recency old';
    }
}

function loadRecentWorkouts() {
    try {
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        const container = document.getElementById('recent-workouts');
        const workoutsList = container.querySelector('.workouts-list');
        const emptyState = container.querySelector('.empty-state');
        
        if (workoutHistory.length === 0) {
            if (workoutsList) workoutsList.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (workoutsList) workoutsList.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        workoutsList.innerHTML = '';
        workoutHistory.slice(0, 5).forEach((workout, index) => {
            if (!workout) return;
            
            const workoutEl = document.createElement('div');
            workoutEl.className = 'workout-item';
            workoutEl.innerHTML = `
                <div class="workout-header">
                    <strong>${formatDate(workout.date)}</strong>
                    <span class="workout-duration">${calculateWorkoutDuration(workout)}</span>
                </div>
                <div class="workout-exercises">
                    ${workout.exercises ? workout.exercises.slice(0, 3).map(ex => 
                        `<span class="exercise-tag">${ex.name || 'Упражнение'}</span>`
                    ).join('') : ''}
                    ${workout.exercises && workout.exercises.length > 3 ? 
                        `<span class="more-exercises">+${workout.exercises.length - 3} еще</span>` : ''
                    }
                </div>
                <div class="workout-stats">
                    <span>${workout.exercises ? workout.exercises.length : 0} упр.</span>
                    <span>${calculateTotalSets(workout)} подх.</span>
                </div>
            `;
            workoutEl.addEventListener('click', () => {
                showWorkoutDetails(workout);
            });
            workoutsList.appendChild(workoutEl);
        });
    } catch (error) {
        console.error('Ошибка загрузки последних тренировок:', error);
        showErrorState('recent-workouts', 'Ошибка загрузки данных');
    }
}

function loadFavoriteExercises() {
    try {
        const favoriteExercises = JSON.parse(localStorage.getItem('favoriteExercises')) || [];
        const container = document.getElementById('favorite-exercises');
        const emptyState = container.querySelector('.empty-state');
        
        if (favoriteExercises.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        const exercisesData = JSON.parse(localStorage.getItem('exercises')) || [];
        const favoritesData = favoriteExercises.map(favId => 
            exercisesData.find(ex => ex && ex.id === favId)
        ).filter(ex => ex);
        
        if (favoritesData.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        container.innerHTML = '';
        favoritesData.slice(0, 6).forEach(exercise => {
            const exerciseEl = document.createElement('div');
            exerciseEl.className = 'exercise-mini-item';
            exerciseEl.innerHTML = `
                <div class="exercise-icon">💪</div>
                <div class="exercise-info">
                    <h4>${exercise.name || 'Неизвестное упражнение'}</h4>
                    <p>${exercise.target || 'Общее'}</p>
                </div>
                <button class="exercise-quick-action" data-exercise-id="${exercise.id}">+</button>
            `;
            exerciseEl.addEventListener('click', (e) => {
                if (!e.target.classList.contains('exercise-quick-action')) {
                    window.location.href = `exercises.html#exercise-${exercise.id}`;
                }
            });
            
            // Обработчик быстрого добавления в тренировку
            const quickAction = exerciseEl.querySelector('.exercise-quick-action');
            quickAction.addEventListener('click', (e) => {
                e.stopPropagation();
                addExerciseToCurrentWorkout(exercise.id);
            });
            
            container.appendChild(exerciseEl);
        });
    } catch (error) {
        console.error('Ошибка загрузки избранных упражнений:', error);
        showErrorState('favorite-exercises', 'Ошибка загрузки данных');
    }
}

function loadUpcomingWorkouts() {
    try {
        const upcomingWorkouts = JSON.parse(localStorage.getItem('upcomingWorkouts')) || [];
        const container = document.getElementById('upcoming-workouts');
        const emptyState = container.querySelector('.empty-state');
        
        if (upcomingWorkouts.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        // Здесь будет логика отображения запланированных тренировок
        // Пока оставляем empty state
        
    } catch (error) {
        console.error('Ошибка загрузки запланированных тренировок:', error);
        showErrorState('upcoming-workouts', 'Ошибка загрузки данных');
    }
}

function loadAchievementsPreview() {
    try {
        const achievements = JSON.parse(localStorage.getItem('userAchievements')) || [];
        const container = document.getElementById('achievements-preview');
        const achievementsGrid = container.querySelector('.achievements-grid');
        const emptyState = container.querySelector('.empty-state');
        
        if (achievements.length === 0) {
            if (achievementsGrid) achievementsGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (achievementsGrid) achievementsGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
        
        achievementsGrid.innerHTML = '';
        achievements.filter(ach => ach.unlocked).slice(0, 4).forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement-item';
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon || '🏆'}</div>
                <div class="achievement-info">
                    <strong>${achievement.name}</strong>
                    <span>${achievement.description}</span>
                </div>
            `;
            achievementsGrid.appendChild(achievementEl);
        });
    } catch (error) {
        console.error('Ошибка загрузки достижений:', error);
        showErrorState('achievements-preview', 'Ошибка загрузки данных');
    }
}

function setupEventListeners() {
    // Основные кнопки действий
    const startWorkoutBtn = document.querySelector('[href="workout.html"]');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startNewWorkout();
        });
    }
    
    // Кнопка обновления статистики
    const refreshStatsBtn = document.getElementById('refresh-stats');
    if (refreshStatsBtn) {
        refreshStatsBtn.addEventListener('click', refreshData);
    }
    
    // Кнопка быстрого планирования
    const quickPlanBtn = document.getElementById('quick-plan');
    if (quickPlanBtn) {
        quickPlanBtn.addEventListener('click', showPlanWorkoutModal);
    }
    
    // Кнопка мотивации
    const motivationTipBtn = document.getElementById('motivation-tip');
    if (motivationTipBtn) {
        motivationTipBtn.addEventListener('click', showMotivationModal);
    }
    
    // Кнопка экспорта данных
    const exportDataBtn = document.getElementById('export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportUserData);
    }
    
    // Задержка для предотвращения частых обновлений
    let refreshTimeout;
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(refreshData, 1000);
        }
    });
    
    // Обработчики модальных окон
    setupModalHandlers();
}

function setupModalHandlers() {
    // Закрытие модальных окон
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').setAttribute('hidden', 'true');
        });
    });
    
    // Клик по backdrop
    document.getElementById('backdrop').addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.setAttribute('hidden', 'true');
        });
    });
}

function setupNotificationSystem() {
    window.showNotification = function(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (!notification || !notificationText) return;
        
        notificationText.textContent = message;
        notification.className = `notification ${type}`;
        notification.removeAttribute('hidden');
        
        setTimeout(() => {
            notification.setAttribute('hidden', 'true');
        }, duration);
    };
}

function showPlanWorkoutModal() {
    const modal = document.getElementById('plan-workout-modal');
    if (modal) {
        modal.removeAttribute('hidden');
    }
}

function showMotivationModal() {
    const modal = document.getElementById('motivation-modal');
    const motivationText = document.getElementById('daily-motivation');
    
    if (modal && motivationText) {
        motivationText.textContent = getRandomMotivationalQuote();
        modal.removeAttribute('hidden');
    }
}

function loadMotivationalQuote() {
    const quoteElement = document.getElementById('motivational-quote');
    if (quoteElement) {
        quoteElement.textContent = getRandomMotivationalQuote();
    }
}

function getRandomMotivationalQuote() {
    const quotes = [
        "Каждая тренировка приближает тебя к цели",
        "Сила не в мышцах, а в силе воли",
        "Сегодняшний труд — завтрашний результат",
        "Не сдавайся, ты ближе к цели, чем вчера",
        "Маленькие шаги каждый день приводят к большим результатам",
        "Твое тело может все, нужно только убедить в этом разум",
        "Успех — это сумма небольших усилий, повторяющихся изо дня в день",
        "Лучшая тренировка — та, что сделана"
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function startNewWorkout() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('currentWorkoutDate', today);
    window.location.href = 'workout.html';
}

function addExerciseToCurrentWorkout(exerciseId) {
    // Логика быстрого добавления упражнения в текущую тренировку
    showNotification('Упражнение добавлено в текущую тренировку', 'success');
}

function exportUserData() {
    try {
        const userData = {
            workoutHistory: JSON.parse(localStorage.getItem('workoutHistory')) || [],
            favoriteExercises: JSON.parse(localStorage.getItem('favoriteExercises')) || [],
            userStats: JSON.parse(localStorage.getItem('userStats')) || {},
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `workout_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('Данные успешно экспортированы', 'success');
    } catch (error) {
        console.error('Ошибка экспорта данных:', error);
        showNotification('Ошибка при экспорте данных', 'error');
    }
}

function checkAchievements() {
    // Базовая логика проверки достижений
    const stats = JSON.parse(localStorage.getItem('userStats')) || getDefaultStats();
    const achievements = JSON.parse(localStorage.getItem('userAchievements')) || [];
    
    const newAchievements = [];
    
    // Проверяем различные достижения
    if (stats.totalWorkouts >= 1 && !achievements.some(a => a.id === 'first_workout')) {
        newAchievements.push({
            id: 'first_workout',
            name: 'Первая тренировка!',
            description: 'Вы завершили свою первую тренировку',
            icon: '🎯',
            unlocked: true
        });
    }
    
    if (stats.totalWorkouts >= 10 && !achievements.some(a => a.id === 'consistent_beginner')) {
        newAchievements.push({
            id: 'consistent_beginner',
            name: 'Последовательный новичок',
            description: '10 завершенных тренировок',
            icon: '🔥',
            unlocked: true
        });
    }
    
    if (stats.weekWorkouts >= 5 && !achievements.some(a => a.id === 'active_week')) {
        newAchievements.push({
            id: 'active_week',
            name: 'Активная неделя',
            description: '5 тренировок за неделю',
            icon: '⚡',
            unlocked: true
        });
    }
    
    // Добавляем новые достижения
    if (newAchievements.length > 0) {
        const updatedAchievements = [...achievements, ...newAchievements];
        localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
        
        // Показываем уведомление о новых достижениях
        newAchievements.forEach(achievement => {
            showNotification(`Новое достижение: ${achievement.name}`, 'success', 5000);
        });
        
        // Обновляем превью достижений
        loadAchievementsPreview();
    }
}

function refreshData() {
    console.log('Обновление данных...');
    loadUserData();
    loadMotivationalQuote();
    checkAchievements();
    showNotification('Данные обновлены', 'info', 2000);
}

// Вспомогательные функции
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Некорректная дата';
        }
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Ошибка форматирования даты:', error);
        return 'Некорректная дата';
    }
}

function calculateWorkoutDuration(workout) {
    if (!workout.startTime || !workout.endTime) return '~45 мин';
    
    try {
        const start = new Date(workout.startTime);
        const end = new Date(workout.endTime);
        const duration = Math.round((end - start) / (1000 * 60)); // в минутах
        
        return duration > 0 ? `${duration} мин` : '~45 мин';
    } catch (error) {
        return '~45 мин';
    }
}

function calculateTotalSets(workout) {
    if (!workout.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => total + (exercise.sets || 0), 0);
}

function showLoadingSkeletons() {
    const stats = ['total-workouts', 'week-workouts', 'total-exercises', 'last-workout'];
    stats.forEach(statId => {
        const element = document.getElementById(statId);
        if (element) {
            element.innerHTML = '<div class="skeleton-loader"></div>';
        }
    });
}

function hideLoadingSkeletons() {
    const skeletons = document.querySelectorAll('.skeleton-loader');
    skeletons.forEach(skeleton => {
        if (skeleton.parentElement) {
            skeleton.parentElement.textContent = skeleton.parentElement.textContent.replace('
			            skeleton.remove();
        }
    });
}

function showEmptyStats() {
    document.getElementById('total-workouts').textContent = '0';
    document.getElementById('week-workouts').textContent = '0';
    document.getElementById('total-exercises').textContent = '0';
    document.getElementById('last-workout').textContent = '—';
}

function showErrorState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
                <button class="btn small" onclick="refreshData()">Попробовать снова</button>
            </div>
        `;
    }
}

function showWorkoutDetails(workout) {
    if (workout && workout.date) {
        window.location.href = `history.html?date=${workout.date}`;
    }
}

// Расширенная система мотивационных цитат
const motivationalQuotes = {
    morning: [
        "Утренняя тренировка заряжает энергией на весь день! 🌅",
        "Начни день с победы над собой! 💪",
        "Утро — лучшее время для тренировки! ☀️"
    ],
    day: [
        "Каждая тренировка приближает тебя к цели",
        "Сила не в мышцах, а в силе воли",
        "Сегодняшний труд — завтрашний результат"
    ],
    evening: [
        "Вечерняя тренировка — отличный способ завершить день! 🌙",
        "Сделай сегодня то, о чем завтра будешь жалеть! 🔥",
        "Никогда не поздно стать лучше! 💫"
    ],
    achievement: [
        "Ты становишься сильнее с каждой тренировкой! 🚀",
        "Прогресс виден — продолжайте в том же духе! 📈",
        "Ваша дисциплина впечатляет! 🌟"
    ]
};

function getContextualMotivationalQuote() {
    const hour = new Date().getHours();
    const stats = JSON.parse(localStorage.getItem('userStats')) || getDefaultStats();
    
    let quoteCategory = 'day';
    
    if (hour < 12) {
        quoteCategory = 'morning';
    } else if (hour < 18) {
        quoteCategory = 'day';
    } else {
        quoteCategory = 'evening';
    }
    
    // Если пользователь активен, показываем achievement цитаты
    if (stats.weekWorkouts >= 3) {
        quoteCategory = 'achievement';
    }
    
    const quotes = motivationalQuotes[quoteCategory];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Система напоминаний
function setupReminders() {
    const lastReminder = localStorage.getItem('lastReminderDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastReminder !== today) {
        const stats = JSON.parse(localStorage.getItem('userStats')) || getDefaultStats();
        const lastWorkoutDate = stats.lastWorkoutDate;
        
        if (lastWorkoutDate) {
            const today = new Date();
            const lastDate = new Date(lastWorkoutDate);
            const diffDays = Math.ceil((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 3) {
                showNotification(`Прошло ${diffDays} дней с последней тренировки. Пора возобновить!`, 'warning', 5000);
            }
        } else if (stats.totalWorkouts === 0) {
            showNotification('Начните свой фитнес-путь сегодня! Первая тренировка ждет!', 'info', 5000);
        }
        
        localStorage.setItem('lastReminderDate', today);
    }
}

// Аналитика и рекомендации
function generateWorkoutInsights() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const stats = JSON.parse(localStorage.getItem('userStats')) || getDefaultStats();
    
    const insights = [];
    
    // Анализ частоты тренировок
    if (stats.weekWorkouts === 0) {
        insights.push({
            type: 'warning',
            message: 'На этой неделе еще не было тренировок. Пора начинать!',
            action: 'start_workout'
        });
    } else if (stats.weekWorkouts >= 3) {
        insights.push({
            type: 'success',
            message: `Отличная неделя! Уже ${stats.weekWorkouts} тренировок.`,
            action: null
        });
    }
    
    // Анализ разнообразия упражнений
    const exerciseFrequency = {};
    workoutHistory.forEach(workout => {
        if (workout.exercises) {
            workout.exercises.forEach(exercise => {
                if (exercise.id) {
                    exerciseFrequency[exercise.id] = (exerciseFrequency[exercise.id] || 0) + 1;
                }
            });
        }
    });
    
    const mostFrequent = Object.entries(exerciseFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    if (mostFrequent.length > 0) {
        insights.push({
            type: 'info',
            message: `Чаще всего вы делаете: ${mostFrequent.map(([id, count]) => `${count} раз`).join(', ')}`,
            action: 'view_exercises'
        });
    }
    
    return insights;
}

// Обработчик для отображения аналитики
function displayWorkoutInsights() {
    const insights = generateWorkoutInsights();
    
    if (insights.length > 0) {
        const mainInsight = insights[0];
        
        // Можно добавить отображение insights в интерфейсе
        console.log('Workout Insights:', insights);
        
        // Показываем самое важное уведомление
        if (mainInsight.type === 'warning') {
            showNotification(mainInsight.message, mainInsight.type, 6000);
        }
    }
}

// Инициализация расширенных функций
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем напоминания с задержкой
    setTimeout(setupReminders, 3000);
    
    // Показываем аналитику
    setTimeout(displayWorkoutInsights, 5000);
});

// Расширенная система тестовых данных
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initializeMockData();
}

function initializeMockData() {
    if (!localStorage.getItem('workoutHistory')) {
        const mockWorkouts = [
            {
                date: new Date().toISOString().split('T')[0],
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
                exercises: [
                    { id: '0001', name: 'Приседания', sets: 3, reps: 12, target: 'Ноги' },
                    { id: '0002', name: 'Отжимания', sets: 4, reps: 15, target: 'Грудь' },
                    { id: '0003', name: 'Подтягивания', sets: 3, reps: 8, target: 'Спина' }
                ]
            },
            {
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                exercises: [
                    { id: '0004', name: 'Жим лежа', sets: 4, reps: 10, target: 'Грудь' },
                    { id: '0005', name: 'Становая тяга', sets: 3, reps: 8, target: 'Спина' }
                ]
            }
        ];
        localStorage.setItem('workoutHistory', JSON.stringify(mockWorkouts));
    }

    if (!localStorage.getItem('favoriteExercises')) {
        localStorage.setItem('favoriteExercises', JSON.stringify(['0001', '0002', '0003']));
    }
    
    if (!localStorage.getItem('exercises')) {
        const mockExercises = [
            { id: '0001', name: 'Приседания', target: 'Ноги', description: 'Базовое упражнение для ног', difficulty: 'Начальный' },
            { id: '0002', name: 'Отжимания', target: 'Грудь', description: 'Базовое упражнение для груди и рук', difficulty: 'Начальный' },
            { id: '0003', name: 'Подтягивания', target: 'Спина', description: 'Упражнение для развития мышц спины', difficulty: 'Средний' },
            { id: '0004', name: 'Жим лежа', target: 'Грудь', description: 'Базовое упражнение для грудных мышц', difficulty: 'Средний' },
            { id: '0005', name: 'Становая тяга', target: 'Спина', description: 'Базовое упражнение для всего тела', difficulty: 'Продвинутый' }
        ];
        localStorage.setItem('exercises', JSON.stringify(mockExercises));
    }
    
    if (!localStorage.getItem('userAchievements')) {
        const mockAchievements = [
            {
                id: 'first_workout',
                name: 'Первая тренировка!',
                description: 'Вы завершили свою первую тренировку',
                icon: '🎯',
                unlocked: true
            }
        ];
        localStorage.setItem('userAchievements', JSON.stringify(mockAchievements));
    }
}

// Оптимизация производительности
let isRefreshing = false;
function optimizedRefreshData() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    refreshData();
    
    setTimeout(() => {
        isRefreshing = false;
    }, 1000);
}

// Обработка ошибок глобально
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('Произошла непредвиденная ошибка', 'error');
});

// Экспорт функций для глобального использования
window.Dashboard = {
    refreshData: optimizedRefreshData,
    showNotification: showNotification,
    exportUserData: exportUserData,
    startNewWorkout: startNewWorkout
};

console.log('Улучшенный Dashboard модуль загружен');
// Дополнительные обработчики для модальных окон
function setupModalHandlers() {
    // Закрытие модальных окон по кнопке закрытия
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const modal = this.closest('.modal');
            if (modal) {
                modal.setAttribute('hidden', 'true');
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    // Закрытие по клику на backdrop
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.setAttribute('hidden', 'true');
            document.body.classList.remove('modal-open');
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not([hidden])');
            if (openModal) {
                openModal.setAttribute('hidden', 'true');
                document.body.classList.remove('modal-open');
            }
        }
    });
}

// Обновленная функция показа модального окна мотивации
function showMotivationModal() {
    const modal = document.getElementById('motivation-modal');
    const motivationText = document.getElementById('daily-motivation');
    
    if (modal && motivationText) {
        motivationText.textContent = getRandomMotivationalQuote();
        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');
    }
}

// Обновленная функция показа модального окна планирования
function showPlanWorkoutModal() {
    const modal = document.getElementById('plan-workout-modal');
    if (modal) {
        modal.removeAttribute('hidden');
        document.body.classList.add('modal-open');
    }
}

// Добавьте этот CSS для блокировки скролла при открытом модальном окне
