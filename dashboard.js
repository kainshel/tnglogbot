// app_dashboard.js - Логика для главной страницы

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация страницы
    initializeDashboard();
    
    // Инициализация аутентификации Telegram
    initializeTelegramAuth();
    
    // Загрузка данных пользователя
    loadUserData();
    
    // Настройка обработчиков событий
    setupEventListeners();
});

function initializeDashboard() {
    console.log('Инициализация главной страницы...');
    
    // Показываем скелетоны загрузки
    showLoadingSkeletons();
}

function initializeTelegramAuth() {
    // Проверяем, доступен ли Telegram WebApp
    if (typeof Telegram !== 'undefined' && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        const user = tg.initDataUnsafe.user;
        
        if (user) {
            // Пользователь авторизован через Telegram
            const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
            const userAvatar = user.photo_url;
            
            updateUserProfile(userName, userAvatar);
            
            // Расширяем WebApp на всю высоту
            tg.expand();
            
            // Можно также использовать tg.showAlert, tg.showPopup и другие методы
        } else {
            // Пользователь не авторизован, показываем гостевой режим
            setGuestMode();
        }
    } else {
        // Telegram WebApp не доступен (тестирование в браузере)
        setGuestMode();
        simulateUserData();
    }
}

function updateUserProfile(name, avatarUrl) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && name) {
        userNameElement.textContent = name;
    }
    
    // Можно добавить аватар если нужно
    // if (avatarUrl) { ... }
}

function setGuestMode() {
    console.log('Гостевой режим');
    // Можно добавить специфичную логику для гостевого режима
}

function loadUserData() {
    // Загрузка статистики
    loadUserStats();
    
    // Загрузка последних тренировок
    loadRecentWorkouts();
    
    // Загрузка избранных упражнений
    loadFavoriteExercises();
    
    // Загрузка предстоящих тренировок
    loadUpcomingWorkouts();
}

function loadUserStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('userStats')) || calculateUserStats();
        
        // Обновляем UI
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
    
    // Собираем все уникальные упражнения
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
    
    // Сохраняем статистику для быстрого доступа
    localStorage.setItem('userStats', JSON.stringify(stats));
    
    return stats;
}

function updateStatsUI(stats) {
    // Скрываем скелетоны
    hideLoadingSkeletons();
    
    // Обновляем значения
    document.getElementById('total-workouts').textContent = stats.totalWorkouts;
    document.getElementById('week-workouts').textContent = stats.weekWorkouts;
    document.getElementById('total-exercises').textContent = stats.totalExercises;
    document.getElementById('last-workout').textContent = stats.lastWorkout;
}

function loadRecentWorkouts() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const container = document.getElementById('recent-workouts');
    
    if (workoutHistory.length === 0) {
        container.innerHTML = '<p class="empty-state">У вас пока нет завершённых тренировок</p>';
        return;
    }
    
    const recentWorkouts = workoutHistory.slice(0, 3);
    container.innerHTML = '';
    
    recentWorkouts.forEach(workout => {
        const workoutEl = document.createElement('div');
        workoutEl.className = 'workout-item';
        workoutEl.innerHTML = `
            <strong>${formatDate(workout.date)}</strong>
            <span>${workout.exercises.length} упражнений, ${calculateTotalSets(workout)} подходов</span>
        `;
        
        // Добавляем обработчик клика
        workoutEl.addEventListener('click', () => {
            showWorkoutDetails(workout);
        });
        
        container.appendChild(workoutEl);
    });
}

function loadFavoriteExercises() {
    const favoriteExercises = JSON.parse(localStorage.getItem('favoriteExercises')) || [];
    const container = document.getElementById('favorite-exercises');
    
    if (favoriteExercises.length === 0) {
        container.innerHTML = '<p class="empty-state">Добавьте упражнения в избранное</p>';
        return;
    }
    
    // Загружаем полные данные упражнений
    const exercisesData = JSON.parse(localStorage.getItem('exercises')) || [];
    const favoritesData = favoriteExercises.map(favId => 
        exercisesData.find(ex => ex.id === favId)
    ).filter(ex => ex); // Убираем undefined
    
    container.innerHTML = '';
    
    favoritesData.slice(0, 6).forEach(exercise => {
        if (!exercise) return;
        
        const exerciseEl = document.createElement('div');
        exerciseEl.className = 'exercise-mini-item';
        exerciseEl.innerHTML = `
            <h4>${exercise.name}</h4>
            <p>${exercise.target}</p>
        `;
        
        exerciseEl.addEventListener('click', () => {
            // Переход к странице упражнений или показ деталей
            window.location.href = `exercises.html#exercise-${exercise.id}`;
        });
        
        container.appendChild(exerciseEl);
    });
}

function loadUpcomingWorkouts() {
    // Здесь можно реализовать логику для запланированных тренировок
    // Пока просто показываем placeholder
    const container = document.getElementById('upcoming-workouts');
    container.innerHTML = '<p class="empty-state">У вас нет запланированных тренировок</p>';
}

function showWorkoutDetails(workout) {
    // Можно реализовать модальное окно с деталями тренировки
    // или переход на страницу истории
    window.location.href = `history.html?date=${workout.date}`;
}

function setupEventListeners() {
    // Обработчик для кнопки начала тренировки
    const startWorkoutBtn = document.querySelector('[href="workout.html"]');
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startNewWorkout();
        });
    }
    
    // Обновление статистики при видимости страницы
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Страница стала видимой - обновляем данные
            refreshData();
        }
    });
}

function startNewWorkout() {
    // Создаем новую тренировку с текущей датой
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('currentWorkoutDate', today);
    
    // Переходим к странице тренировки
    window.location.href = 'workout.html';
}

function refreshData() {
    // Перезагружаем все данные
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

function calculateTotalSets(workout) {
    return workout.exercises.reduce((total, exercise) => {
        return total + (exercise.sets || 1);
    }, 0);
}

function showLoadingSkeletons() {
    // Показываем анимации загрузки
    const stats = ['total-workouts', 'week-workouts', 'total-exercises', 'last-workout'];
    
    stats.forEach(statId => {
        const element = document.getElementById(statId);
        if (element) {
            element.innerHTML = '<div class="skeleton-loader"></div>';
        }
    });
}

function hideLoadingSkeletons() {
    // Убираем анимации загрузки
    const skeletons = document.querySelectorAll('.skeleton-loader');
    skeletons.forEach(skeleton => skeleton.remove());
}

function showEmptyStats() {
    // Показываем заглушки если данных нет
    document.getElementById('total-workouts').textContent = '0';
    document.getElementById('week-workouts').textContent = '0';
    document.getElementById('total-exercises').textContent = '0';
    document.getElementById('last-workout').textContent = '—';
}

function simulateUserData() {
    // Функция для тестирования в браузере
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
}

// Стили для скелетонов (можно добавить в CSS)
const skeletonStyles = `
.skeleton-loader {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
    height: 24px;
    width: 80%;
    margin: 0 auto;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

@media (prefers-color-scheme: dark) {
    .skeleton-loader {
        background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
    }
}
`;

// Добавляем стили для скелетонов
const styleSheet = document.createElement('style');
styleSheet.textContent = skeletonStyles;
document.head.appendChild(styleSheet);

// Экспортируем функции для глобального доступа (если нужно)
window.dashboard = {
    refreshData,
    startNewWorkout,
    showWorkoutDetails
};