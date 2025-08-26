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
    if (telegramApp.user) {
        const userName = `${telegramApp.user.first_name || ''} ${telegramApp.user.last_name || ''}`.trim();
        document.getElementById('user-name').textContent = userName || 'Спортсмен';
    }
}

function loadUserData() {
    loadUserStats();
    loadRecentWorkouts();
    loadFavoriteExercises();
    loadUpcomingWorkouts();
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
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekWorkouts = workoutHistory.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startOfWeek;
    }).length;
    
    const allExercises = new Set();
    workoutHistory.forEach(workout => {
        workout.exercises.forEach(exercise => {
            allExercises.add(exercise.id);
        });
    });
    
    const stats = {
        totalWorkouts: workoutHistory.length,
        weekWorkouts: weekWorkouts,
        totalExercises: allExercises.size,
        lastWorkout: workoutHistory.length > 0 ? formatDate(workoutHistory[0].date) : '—'
    };
    
    localStorage.setItem('userStats', JSON.stringify(stats));
    return stats;
}

function updateStatsUI(stats) {
    hideLoadingSkeletons();
    document.getElementById('total-workouts').textContent = stats.totalWorkouts;
    document.getElementById('week-workouts').textContent = stats.weekWorkouts;
    document.getElementById('total-exercises').textContent = stats.totalExercises;
    document.getElementById('last-workout').textContent = stats.lastWorkout;
}

function loadRecentWorkouts() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const container = document.getElementById('recent-workouts');
    
    if (workoutHistory.length === 0) return;
    
    container.innerHTML = '';
    workoutHistory.slice(0, 3).forEach(workout => {
        const workoutEl = document.createElement('div');
        workoutEl.className = 'workout-item';
        workoutEl.innerHTML = `
            <strong>${formatDate(workout.date)}</strong>
            <span>${workout.exercises.length} упражнений</span>
        `;
        workoutEl.addEventListener('click', () => {
            showWorkoutDetails(workout);
        });
        container.appendChild(workoutEl);
    });
}

function loadFavoriteExercises() {
    const favoriteExercises = JSON.parse(localStorage.getItem('favoriteExercises')) || [];
    const container = document.getElementById('favorite-exercises');
    
    if (favoriteExercises.length === 0) return;
    
    const exercisesData = JSON.parse(localStorage.getItem('exercises')) || [];
    const favoritesData = favoriteExercises.map(favId => 
        exercisesData.find(ex => ex.id === favId)
    ).filter(ex => ex);
    
    container.innerHTML = '';
    favoritesData.slice(0, 6).forEach(exercise => {
        const exerciseEl = document.createElement('div');
        exerciseEl.className = 'exercise-mini-item';
        exerciseEl.innerHTML = `
            <h4>${exercise.name}</h4>
            <p>${exercise.target}</p>
        `;
        exerciseEl.addEventListener('click', () => {
            window.location.href = `exercises.html#exercise-${exercise.id}`;
        });
        container.appendChild(exerciseEl);
    });
}

function loadUpcomingWorkouts() {
    // Заглушка для будущей функциональности
}

function setupEventListeners() {
    const startWorkoutBtn = document.querySelector('[href="workout.html"]');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startNewWorkout();
        });
    }
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            refreshData();
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
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
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
    window.location.href = `history.html?date=${workout.date}`;
}

// Имитация данных для тестирования
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