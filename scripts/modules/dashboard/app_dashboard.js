// app_dashboard.js - Логика главной страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

// Ожидаем инициализации Telegram
document.addEventListener('telegramReady', function(event) {
    const telegramApp = event.detail;
    updateUserInterface(telegramApp);
    loadUserData();
});

function initializeDashboard() {
    console.log('Инициализация главной страницы...');
    showLoadingSkeletons();
}

function updateUserInterface(telegramApp) {
    if (telegramApp && telegramApp.user) {
        const userName = `${telegramApp.user.first_name || ''} ${telegramApp.user.last_name || ''}`.trim();
        document.getElementById('user-name').textContent = userName || 'Спортсмен';
    }
}

function loadUserData() {
    loadUserStats();
    loadRecentWorkouts();
    loadFavoriteExercises();
    // loadUpcomingWorkouts(); // Убрано, так как функция не реализована
}

function loadUserStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('userStats')) || calculateUserStats();
        updateStatsUI(stats);
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
        
        const weekWorkouts = workoutHistory.filter(workout => {
            if (!workout || !workout.date) return false;
            
            // Улучшенная обработка дат
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
        
        const allExercises = new Set();
        workoutHistory.forEach(workout => {
            if (workout.exercises && Array.isArray(workout.exercises)) {
                workout.exercises.forEach(exercise => {
                    if (exercise && exercise.id) {
                        allExercises.add(exercise.id);
                    }
                });
            }
        });
        
        const stats = {
            totalWorkouts: workoutHistory.length,
            weekWorkouts: weekWorkouts,
            totalExercises: allExercises.size,
            lastWorkout: workoutHistory.length > 0 ? formatDate(workoutHistory[0].date) : '—'
        };
        
        localStorage.setItem('userStats', JSON.stringify(stats));
        return stats;
    } catch (error) {
        console.error('Ошибка расчета статистики:', error);
        return {
            totalWorkouts: 0,
            weekWorkouts: 0,
            totalExercises: 0,
            lastWorkout: '—'
        };
    }
}

function updateStatsUI(stats) {
    hideLoadingSkeletons();
    document.getElementById('total-workouts').textContent = stats.totalWorkouts;
    document.getElementById('week-workouts').textContent = stats.weekWorkouts;
    document.getElementById('total-exercises').textContent = stats.totalExercises;
    document.getElementById('last-workout').textContent = stats.lastWorkout;
}

function loadRecentWorkouts() {
    try {
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        const container = document.getElementById('recent-workouts');
        
        if (workoutHistory.length === 0) {
            container.innerHTML = '<p class="empty-state">У вас пока нет завершённых тренировок</p>';
            return;
        }
        
        container.innerHTML = '';
        workoutHistory.slice(0, 3).forEach(workout => {
            if (!workout) return;
            
            const workoutEl = document.createElement('div');
            workoutEl.className = 'workout-item';
            workoutEl.innerHTML = `
                <strong>${formatDate(workout.date)}</strong>
                <span>${workout.exercises ? workout.exercises.length : 0} упражнений</span>
            `;
            workoutEl.addEventListener('click', () => {
                showWorkoutDetails(workout);
            });
            container.appendChild(workoutEl);
        });
    } catch (error) {
        console.error('Ошибка загрузки последних тренировок:', error);
        const container = document.getElementById('recent-workouts');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки данных</p>';
    }
}

function loadFavoriteExercises() {
    try {
        const favoriteExercises = JSON.parse(localStorage.getItem('favoriteExercises')) || [];
        const container = document.getElementById('favorite-exercises');
        
        if (favoriteExercises.length === 0) {
            container.innerHTML = '<p class="empty-state">Добавьте упражнения в избранное</p>';
            return;
        }
        
        const exercisesData = JSON.parse(localStorage.getItem('exercises')) || [];
        const favoritesData = favoriteExercises.map(favId => 
            exercisesData.find(ex => ex && ex.id === favId)
        ).filter(ex => ex);
        
        if (favoritesData.length === 0) {
            container.innerHTML = '<p class="empty-state">Добавьте упражнения в избранное</p>';
            return;
        }
        
        container.innerHTML = '';
        favoritesData.slice(0, 6).forEach(exercise => {
            const exerciseEl = document.createElement('div');
            exerciseEl.className = 'exercise-mini-item';
            exerciseEl.innerHTML = `
                <h4>${exercise.name || 'Неизвестное упражнение'}</h4>
                <p>${exercise.target || ''}</p>
            `;
            exerciseEl.addEventListener('click', () => {
                window.location.href = `exercises.html#exercise-${exercise.id}`;
            });
            container.appendChild(exerciseEl);
        });
    } catch (error) {
        console.error('Ошибка загрузки избранных упражнений:', error);
        const container = document.getElementById('favorite-exercises');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки данных</p>';
    }
}

function setupEventListeners() {
    const startWorkoutBtn = document.querySelector('[href="workout.html"]');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startNewWorkout();
        });
    }
    
    // Добавляем задержку для предотвращения частых обновлений
    let refreshTimeout;
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            clearTimeout(refreshTimeout);
            refreshTimeout = setTimeout(refreshData, 1000);
        }
    });
}

function startNewWorkout() {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('currentWorkoutDate', today);
    window.location.href = 'workout.html';
}

function refreshData() {
    loadUserData();
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
    skeletons.forEach(skeleton => skeleton.remove());
}

function showEmptyStats() {
    document.getElementById('total-workouts').textContent = '0';
    document.getElementById('week-workouts').textContent = '0';
    document.getElementById('total-exercises').textContent = '0';
    document.getElementById('last-workout').textContent = '—';
}

function showWorkoutDetails(workout) {
    if (workout && workout.date) {
        window.location.href = `history.html?date=${workout.date}`;
    }
}

// Имитация данных для тестирования (только в development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (!localStorage.getItem('workoutHistory')) {
        const mockWorkouts = [
            {
                date: new Date().toISOString().split('T')[0],
                exercises: [
                    { id: '0001', name: 'Приседания', sets: 3, target: 'Ноги' },
                    { id: '0002', name: 'Отжимания', sets: 4, target: 'Грудь' }
                ]
            }
        ];
        localStorage.setItem('workoutHistory', JSON.stringify(mockWorkouts));
    }

    if (!localStorage.getItem('favoriteExercises')) {
        localStorage.setItem('favoriteExercises', JSON.stringify(['0001', '0002']));
    }
    
    if (!localStorage.getItem('exercises')) {
        const mockExercises = [
            { id: '0001', name: 'Приседания', target: 'Ноги', description: 'Базовое упражнение для ног' },
            { id: '0002', name: 'Отжимания', target: 'Грудь', description: 'Базовое упражнение для груди и рук' }
        ];
        localStorage.setItem('exercises', JSON.stringify(mockExercises));
    }
}