// scripts/modules/social/app_social.js

document.addEventListener('DOMContentLoaded', function() {
    initializeSocialPage();
    loadUserData();
    loadFriends();
    loadActivities();
    loadAchievements();
    setupEventListeners();
});

function initializeSocialPage() {
    console.log('Инициализация социальной страницы...');
    // Устанавливаем текущую дату в формате для отображения
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function loadUserData() {
    try {
        // Загрузка данных пользователя
        const userData = JSON.parse(localStorage.getItem('userProfile')) || {};
        const userName = userData.name || 'Спортсмен';
        const userLevel = userData.level || 'Новичок';
        
        // Обновление интерфейса
        document.getElementById('userName').textContent = userName;
        document.getElementById('userLevel').textContent = `Уровень: ${userLevel}`;
        
        // Генерация инициалов для аватара
        const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('avatarInitials').textContent = initials || 'СП';
        
        // Загрузка статистики
        loadUserStats();
        
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
}

function loadUserStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('userStats')) || calculateUserStats();
        
        // Обновление badges
        document.getElementById('userWorkouts').textContent = stats.totalWorkouts || 0;
        document.getElementById('userStreak').textContent = calculateCurrentStreak();
        document.getElementById('userFriends').textContent = countFriends();
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
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

function calculateCurrentStreak() {
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    if (workoutHistory.length === 0) return 0;
    
    // Сортируем тренировки по дате (от новых к старым)
    const sortedWorkouts = [...workoutHistory].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Проверяем, была ли тренировка сегодня
    const today = new Date().toISOString().split('T')[0];
    if (sortedWorkouts[0].date === today) {
        streak = 1;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Проверяем предыдущие дни
    for (let i = streak > 0 ? 1 : 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].date);
        workoutDate.setHours(0, 0, 0, 0);
        
        const diffTime = currentDate - workoutDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > 1) {
            break; // Прерываем серию
        }
    }
    
    return streak;
}

function countFriends() {
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    return friends.filter(friend => friend.status === 'accepted').length;
}

function loadFriends() {
    try {
        const friends = JSON.parse(localStorage.getItem('friends')) || [];
        const container = document.getElementById('friends-container');
        
        if (friends.length === 0) {
            container.innerHTML = '<p class="empty-state">У вас пока нет друзей</p>';
            return;
        }
        
        const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
        
        if (acceptedFriends.length === 0) {
            container.innerHTML = '<p class="empty-state">У вас пока нет друзей</p>';
            return;
        }
        
        container.innerHTML = '';
        acceptedFriends.forEach(friend => {
            const friendEl = createFriendElement(friend);
            container.appendChild(friendEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки друзей:', error);
        const container = document.getElementById('friends-container');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки списка друзей</p>';
    }
}

function createFriendElement(friend) {
    const friendEl = document.createElement('div');
    friendEl.className = 'friend-item';
    
    // Генерация инициалов
    const initials = friend.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    friendEl.innerHTML = `
        <div class="friend-avatar">${initials}</div>
        <div class="friend-info">
            <div class="friend-name">${friend.name}</div>
            <div class="friend-stats">
                <span class="friend-stat">🏋️ ${friend.workouts || 0}</span>
                <span class="friend-stat">🔥 ${friend.streak || 0}</span>
                <span class="friend-stat">💪 ${friend.level || 'Новичок'}</span>
            </div>
        </div>
        <div class="friend-actions">
            <button class="btn small view-friend" data-friend-id="${friend.id}">Профиль</button>
            <button class="btn small secondary remove-friend" data-friend-id="${friend.id}">Удалить</button>
        </div>
    `;
    
    // Добавляем обработчики событий
    friendEl.querySelector('.view-friend').addEventListener('click', () => {
        viewFriendProfile(friend.id);
    });
    
    friendEl.querySelector('.remove-friend').addEventListener('click', () => {
        removeFriend(friend.id);
    });
    
    return friendEl;
}

function viewFriendProfile(friendId) {
    // В реальном приложении здесь бы загружались данные друга
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    const friend = friends.find(f => f.id === friendId);
    
    if (!friend) {
        alert('Друг не найден');
        return;
    }
    
    const modalContent = document.getElementById('friendProfileContent');
    modalContent.innerHTML = `
        <h2>Профиль друга</h2>
        <div class="friend-profile-header">
            <div class="friend-avatar-large">${friend.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>
            <div class="friend-details">
                <h3>${friend.name}</h3>
                <p>Уровень: ${friend.level || 'Новичок'}</p>
                <p>На платформе с: ${formatDate(friend.joinedDate)}</p>
            </div>
        </div>
        
        <div class="friend-stats-grid">
            <div class="stat-card">
                <div class="stat-value">${friend.workouts || 0}</div>
                <div class="stat-label">Тренировок</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${friend.streak || 0}</div>
                <div class="stat-label">Дней подряд</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${friend.achievements || 0}</div>
                <div class="stat-label">Достижений</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${friend.consistency || 0}%</div>
                <div class="stat-label">Регулярность</div>
            </div>
        </div>
        
        <h3>Недавние активности</h3>
        <div class="friend-activities">
            <p class="empty-state">Информация о активностях друга</p>
        </div>
        
        <div class="modal-actions">
            <button class="btn" id="challengeFriend">Бросить вызов</button>
            <button class="btn secondary" id="compareWithFriend">Сравнить результаты</button>
        </div>
    `;
    
    // Показываем модальное окно
    document.getElementById('friendProfileModal').style.display = 'flex';
    
    // Добавляем обработчики для кнопок в модальном окне
    document.getElementById('challengeFriend').addEventListener('click', () => {
        challengeFriend(friend.id);
    });
    
    document.getElementById('compareWithFriend').addEventListener('click', () => {
        compareWithFriend(friend.id);
    });
}

function removeFriend(friendId) {
    if (!confirm('Вы уверены, что хотите удалить этого друга?')) {
        return;
    }
    
    try {
        const friends = JSON.parse(localStorage.getItem('friends')) || [];
        const updatedFriends = friends.filter(friend => friend.id !== friendId);
        localStorage.setItem('friends', JSON.stringify(updatedFriends));
        
        // Обновляем список друзей
        loadFriends();
        
        // Показываем уведомление
        showNotification('Друг удален из вашего списка', 'success');
        
    } catch (error) {
        console.error('Ошибка удаления друга:', error);
        showNotification('Не удалось удалить друга', 'error');
    }
}

function loadActivities() {
    try {
        // В реальном приложении здесь бы загружались активности друзей
        const activities = JSON.parse(localStorage.getItem('friendActivities')) || generateMockActivities();
        const container = document.getElementById('activity-feed');
        const filter = document.getElementById('activityFilter').value;
        
        // Фильтрация активностей
        let filteredActivities = activities;
        if (filter !== 'all') {
            filteredActivities = activities.filter(activity => activity.type === filter);
        }
        
        if (filteredActivities.length === 0) {
            container.innerHTML = '<p class="empty-state">Нет активностей для отображения</p>';
            return;
        }
        
        container.innerHTML = '';
        filteredActivities.forEach(activity => {
            const activityEl = createActivityElement(activity);
            container.appendChild(activityEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки активностей:', error);
        const container = document.getElementById('activity-feed');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки активностей</p>';
    }
}

function createActivityElement(activity) {
    const activityEl = document.createElement('div');
    activityEl.className = 'activity-item';
    
    // Генерация инициалов
    const initials = activity.userName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    activityEl.innerHTML = `
        <div class="activity-avatar">${initials}</div>
        <div class="activity-content">
            <div>
                <span class="activity-user">${activity.userName}</span>
                <span class="activity-action">${getActivityText(activity)}</span>
            </div>
            <p class="activity-text">${activity.details || ''}</p>
            <div class="activity-meta">${formatDate(activity.date, true)}</div>
        </div>
    `;
    
    return activityEl;
}

function getActivityText(activity) {
    switch(activity.type) {
        case 'workouts':
            return 'завершил(а) тренировку';
        case 'achievements':
            return 'получил(а) достижение';
        case 'personalBests':
            return 'установил(а) новый рекорд';
        default:
            return 'выполнил(а) действие';
    }
}

function loadAchievements() {
    try {
        const achievements = JSON.parse(localStorage.getItem('achievements')) || generateMockAchievements();
        const container = document.getElementById('achievements-container');
        
        container.innerHTML = '';
        achievements.forEach(achievement => {
            const achievementEl = createAchievementElement(achievement);
            container.appendChild(achievementEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки достижений:', error);
        const container = document.getElementById('achievements-container');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки достижений</p>';
    }
}

function createAchievementElement(achievement) {
    const achievementEl = document.createElement('div');
    achievementEl.className = `achievement-card ${achievement.earned ? '' : 'locked'}`;
    
    achievementEl.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-desc">${achievement.description}</div>
        ${achievement.earned ? 
            `<div class="achievement-date">Получено: ${formatDate(achievement.earnedDate)}</div>` : 
            `<div class="achievement-progress">Прогресс: ${achievement.progress}%</div>`
        }
    `;
    
    return achievementEl;
}

function setupEventListeners() {
    // Поиск друзей
    document.getElementById('friendSearch').addEventListener('input', debounce(() => {
        searchFriends();
    }, 300));
    
    // Фильтр активностей
    document.getElementById('activityFilter').addEventListener('change', () => {
        loadActivities();
    });
    
    // Кнопка добавления друга
    document.getElementById('addFriendBtn').addEventListener('click', () => {
        document.getElementById('addFriendModal').style.display = 'flex';
    });
    
    // Закрытие модальных окон
    document.getElementById('closeAddFriendModal').addEventListener('click', () => {
        document.getElementById('addFriendModal').style.display = 'none';
    });
    
    document.getElementById('closeFriendModal').addEventListener('click', () => {
        document.getElementById('friendProfileModal').style.display = 'none';
    });
    
    // Отправка запроса на дружбу
    document.getElementById('sendFriendRequest').addEventListener('click', () => {
        sendFriendRequest();
    });
    
    // Поделиться достижениями
    document.getElementById('shareAchievements').addEventListener('click', () => {
        shareAchievements();
    });
}

function searchFriends() {
    const searchTerm = document.getElementById('friendSearch').value.toLowerCase();
    const friends = JSON.parse(localStorage.getItem('friends')) || [];
    const container = document.getElementById('friends-container');
    
    if (searchTerm === '') {
        loadFriends();
        return;
    }
    
    const filteredFriends = friends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm) && friend.status === 'accepted'
    );
    
    if (filteredFriends.length === 0) {
        container.innerHTML = '<p class="empty-state">Друзья не найдены</p>';
        return;
    }
    
    container.innerHTML = '';
    filteredFriends.forEach(friend => {
        const friendEl = createFriendElement(friend);
        container.appendChild(friendEl);
    });
}

function sendFriendRequest() {
    const username = document.getElementById('friendUsername').value.trim();
    const message = document.getElementById('friendMessage').value.trim();
    
    if (!username) {
        alert('Введите имя пользователя или ID');
        return;
    }
    
    // В реальном приложении здесь бы отправлялся запрос на сервер
    try {
        const friends = JSON.parse(localStorage.getItem('friends')) || [];
        
        // Проверяем, не добавлен ли уже этот пользователь
        const existingFriend = friends.find(f => f.id === username || f.name === username);
        if (existingFriend) {
            alert(existingFriend.status === 'pending' ? 
                'Запрос уже отправлен' : 'Этот пользователь уже у вас в друзьях');
            return;
        }
        
        // Добавляем нового друга со статусом "в ожидании"
        friends.push({
            id: username,
            name: username, // В реальном приложении имя бы загружалось с сервера
            status: 'pending',
            requestedDate: new Date().toISOString()
        });
        
        localStorage.setItem('friends', JSON.stringify(friends));
        
        // Закрываем модальное окно и очищаем поля
        document.getElementById('addFriendModal').style.display = 'none';
        document.getElementById('friendUsername').value = '';
        document.getElementById('friendMessage').value = '';
        
        // Показываем уведомление
        showNotification('Запрос на дружбу отправлен', 'success');
        
    } catch (error) {
        console.error('Ошибка отправки запроса:', error);
        showNotification('Не удалось отправить запрос', 'error');
    }
}

function shareAchievements() {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const earnedAchievements = achievements.filter(a => a.earned);
    
    if (earnedAchievements.length === 0) {
        alert('У вас пока нет достижений для分享');
        return;
    }
    
    // В реальном приложении здесь бы была интеграция с API分享
    const shareText = `Я заработал(а) ${earnedAchievements.length} достижений в приложении Дневник Тренировок! 🏋️💪\n\nМои достижения:\n` +
        earnedAchievements.map(a => `- ${a.title}: ${a.description}`).join('\n');
    
    if (navigator.share) {
        navigator.share({
            title: 'Мои достижения в Дневнике Тренировок',
            text: shareText
        }).catch(() => {
            // Fallback для копирования в буфер обмена
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Текст скопирован в буфер обмена', 'success');
    }).catch(() => {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Текст скопирован в буфер обмена', 'success');
    });
}

function challengeFriend(friendId) {
    // В реальном приложении здесь бы создавался вызов
    alert(`Вызов другу ${friendId} будет реализован в будущем обновлении`);
}

function compareWithFriend(friendId) {
    // В реальном приложении здесь бы открывалось сравнение с другом
    alert(`Сравнение с другом ${friendId} будет реализовано в будущем обновлении`);
}

function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Вспомогательные функции
function formatDate(dateString, relative = false) {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата';
    
    if (relative) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Сегодня';
        if (diffDays === 1) return 'Вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
    }
    
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

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

// Генерация mock-данных для демонстрации
function generateMockActivities() {
    return [
        {
            type: 'workouts',
            userName: 'Анна Петрова',
            details: 'Силовая тренировка: 15 подходов, 1200 кг общий тоннаж',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            type: 'achievements',
            userName: 'Иван Сидоров',
            details: 'Мастер тренировок: 50 завершенных тренировок',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            type: 'personalBests',
            userName: 'Мария Козлова',
            details: 'Новый рекорд в жиме лежа: 80 кг',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}

function generateMockAchievements() {
    return [
        {
            icon: '🏆',
            title: 'Первая тренировка',
            description: 'Завершите вашу первую тренировку',
            earned: true,
            earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 100
        },
        {
            icon: '🔥',
            title: 'Неделя активности',
            description: 'Тренируйтесь 7 дней подряд',
            earned: false,
            progress: 57
        },
        {
            icon: '💪',
            title: 'Силач',
            description: 'Поднимите 1000 кг за одну тренировку',
            earned: true,
            earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 100
        }
    ];
}