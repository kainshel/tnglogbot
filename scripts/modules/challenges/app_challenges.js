// scripts/modules/challenges/app_challenges.js

document.addEventListener('DOMContentLoaded', function() {
    initializeChallengesPage();
    loadUserProgress();
    loadChallenges();
    loadAchievements();
    loadDailyChallenges();
    loadRewards();
    setupEventListeners();
});

function initializeChallengesPage() {
    console.log('Инициализация страницы испытаний...');
    // Инициализация вкладок
    initializeTabs();
}

function initializeTabs() {
    // Обработка переключения вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabContainer = this.closest('.challenges-tabs') || this.closest('.rewards-tabs');
            const tabName = this.dataset.tab;
            
            // Деактивируем все кнопки в контейнере
            tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            
            // Активируем текущую кнопку
            this.classList.add('active');
            
            // Обрабатываем переключение контента
            if (tabContainer.classList.contains('challenges-tabs')) {
                filterChallenges(tabName);
            } else if (tabContainer.classList.contains('rewards-tabs')) {
                filterRewards(tabName);
            }
        });
    });
}

function loadUserProgress() {
    try {
        const userData = JSON.parse(localStorage.getItem('userProfile')) || {};
        const stats = JSON.parse(localStorage.getItem('userStats')) || calculateUserStats();
        const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        
        // Обновление прогресса пользователя
        document.getElementById('userLevel').textContent = userData.level || 1;
        document.getElementById('earnedAchievements').textContent = achievements.filter(a => a.earned).length;
        document.getElementById('completedChallenges').textContent = countCompletedChallenges();
        document.getElementById('totalPoints').textContent = calculateTotalPoints().toLocaleString();
        document.getElementById('dailyStreak').textContent = calculateCurrentStreak() + ' дней';
        
    } catch (error) {
        console.error('Ошибка загрузки прогресса пользователя:', error);
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

function countCompletedChallenges() {
    const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    return challenges.filter(challenge => challenge.status === 'completed').length;
}

function calculateTotalPoints() {
    const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    
    const achievementPoints = achievements
        .filter(a => a.earned)
        .reduce((sum, a) => sum + (a.points || 0), 0);
    
    const challengePoints = challenges
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + (c.rewardPoints || 0), 0);
    
    // Добавляем ежедневные бонусы
    const dailyBonus = calculateCurrentStreak() * 5;
    
    return achievementPoints + challengePoints + dailyBonus;
}

function loadChallenges() {
    try {
        const challenges = JSON.parse(localStorage.getItem('challenges')) || generateMockChallenges();
        const container = document.getElementById('challenges-container');
        
        if (challenges.length === 0) {
            container.innerHTML = '<p class="empty-state">У вас пока нет испытаний</p>';
            return;
        }
        
        // Фильтрация по активной вкладке
        const activeTab = document.querySelector('.challenges-tabs .tab-btn.active').dataset.tab;
        const filteredChallenges = filterChallengesByTab(challenges, activeTab);
        
        if (filteredChallenges.length === 0) {
            container.innerHTML = `<p class="empty-state">${getEmptyMessageForTab(activeTab)}</p>`;
            return;
        }
        
        container.innerHTML = '';
        filteredChallenges.forEach(challenge => {
            const challengeEl = createChallengeElement(challenge);
            container.appendChild(challengeEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки испытаний:', error);
        const container = document.getElementById('challenges-container');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки испытаний</p>';
    }
}

function filterChallengesByTab(challenges, tab) {
    switch(tab) {
        case 'active':
            return challenges.filter(c => c.status === 'active');
        case 'completed':
            return challenges.filter(c => c.status === 'completed');
        case 'available':
            return challenges.filter(c => c.status === 'available');
        default:
            return challenges;
    }
}

function getEmptyMessageForTab(tab) {
    switch(tab) {
        case 'active':
            return 'У вас нет активных испытаний';
        case 'completed':
            return 'Вы еще не завершили ни одного испытания';
        case 'available':
            return 'Нет доступных испытаний';
        default:
            return 'Испытания не найдены';
    }
}

function createChallengeElement(challenge) {
    const challengeEl = document.createElement('div');
    challengeEl.className = `challenge-card ${challenge.type}`;
    
    const progressPercent = challenge.goalCurrent && challenge.goalTotal ? 
        Math.min(100, Math.round((challenge.goalCurrent / challenge.goalTotal) * 100)) : 0;
    
    challengeEl.innerHTML = `
        <div class="challenge-header">
            <div>
                <h3 class="challenge-title">${challenge.title}</h3>
                <span class="challenge-type">${getChallengeTypeText(challenge.type)}</span>
            </div>
            <span class="challenge-duration">${challenge.daysLeft} дн.</span>
        </div>
        <p class="challenge-description">${challenge.description}</p>
        <div class="challenge-progress">
            <div class="progress-details">
                <span>Прогресс: ${challenge.goalCurrent || 0}/${challenge.goalTotal}</span>
                <span>${progressPercent}%</span>
            </div>
            <div class="progress-bar-small">
                <div class="progress-fill-small" style="width: ${progressPercent}%"></div>
            </div>
        </div>
        <div class="challenge-meta">
            <span>Награда: ${challenge.rewardPoints} очков</span>
            <span>Участников: ${challenge.participants || 1}</span>
        </div>
        <div class="challenge-actions">
            <button class="btn small view-challenge" data-challenge-id="${challenge.id}">Подробнее</button>
            ${challenge.status === 'active' ? 
                `<button class="btn small primary update-challenge" data-challenge-id="${challenge.id}">Обновить</button>` : ''}
            ${challenge.status === 'available' ? 
                `<button class="btn small primary join-challenge" data-challenge-id="${challenge.id}">Принять</button>` : ''}
        </div>
    `;
    
    // Добавляем обработчики событий
    if (challengeEl.querySelector('.view-challenge')) {
        challengeEl.querySelector('.view-challenge').addEventListener('click', () => {
            viewChallengeDetails(challenge.id);
        });
    }
    
    if (challengeEl.querySelector('.update-challenge')) {
        challengeEl.querySelector('.update-challenge').addEventListener('click', () => {
            updateChallengeProgress(challenge.id);
        });
    }
    
    if (challengeEl.querySelector('.join-challenge')) {
        challengeEl.querySelector('.join-challenge').addEventListener('click', () => {
            joinChallenge(challenge.id);
        });
    }
    
    return challengeEl;
}

function getChallengeTypeText(type) {
    switch(type) {
        case 'personal': return 'Личное';
        case 'group': return 'Групповое';
        case 'competition': return 'Соревнование';
        default: return type;
    }
}

function filterChallenges(tabName) {
    // Просто перезагружаем испытания с новым фильтром
    loadChallenges();
}

function loadAchievements() {
    try {
        const achievements = JSON.parse(localStorage.getItem('achievements')) || generateMockAchievements();
        const container = document.getElementById('achievements-container');
        const filterValue = document.getElementById('achievementsFilter').value;
        
        // Фильтрация достижений
        let filteredAchievements = achievements;
        if (filterValue === 'earned') {
            filteredAchievements = achievements.filter(a => a.earned);
        } else if (filterValue === 'not-earned') {
            filteredAchievements = achievements.filter(a => !a.earned);
        } else if (filterValue.startsWith('category-')) {
            const category = filterValue.replace('category-', '');
            filteredAchievements = achievements.filter(a => a.category === category);
        }
        
        if (filteredAchievements.length === 0) {
            container.innerHTML = '<p class="empty-state">Достижения не найдены</p>';
            return;
        }
        
        container.innerHTML = '';
        filteredAchievements.forEach(achievement => {
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
            `<div class="achievement-progress">Прогресс: ${achievement.progress || 0}%</div>`
        }
        ${achievement.points ? `<div class="achievement-points">${achievement.points} очков</div>` : ''}
    `;
    
    return achievementEl;
}

function loadDailyChallenges() {
    try {
        // В реальном приложении здесь бы загружались ежедневные задания
        // Сейчас просто обновляем статус выполненных заданий
        updateDailyChallengesStatus();
        
    } catch (error) {
        console.error('Ошибка загрузки ежедневных заданий:', error);
    }
}

function updateDailyChallengesStatus() {
    // Проверяем, какие ежедневные задания уже выполнены
    const completedChallenges = JSON.parse(localStorage.getItem('completedDailyChallenges')) || [];
    const today = new Date().toISOString().split('T')[0];
    
    document.querySelectorAll('.daily-challenge').forEach(challengeEl => {
        const challengeTitle = challengeEl.querySelector('h3').textContent;
        const isCompleted = completedChallenges.some(c => c.title === challengeTitle && c.date === today);
        
        if (isCompleted) {
            challengeEl.classList.add('completed');
            challengeEl.querySelector('.daily-checkbox').textContent = '✓';
        } else {
            challengeEl.classList.remove('completed');
            challengeEl.querySelector('.daily-checkbox').textContent = '';
        }
    });
}

function loadRewards() {
    try {
        const rewards = JSON.parse(localStorage.getItem('rewards')) || generateMockRewards();
        const container = document.getElementById('rewards-container');
        
        if (rewards.length === 0) {
            container.innerHTML = '<p class="empty-state">Награды не найдены</p>';
            return;
        }
        
        // Фильтрация по активной вкладке
        const activeTab = document.querySelector('.rewards-tabs .tab-btn.active').dataset.tab;
        const filteredRewards = filterRewardsByTab(rewards, activeTab);
        
        if (filteredRewards.length === 0) {
            container.innerHTML = `<p class="empty-state">${getEmptyMessageForRewardsTab(activeTab)}</p>`;
            return;
        }
        
        container.innerHTML = '';
        filteredRewards.forEach(reward => {
            const rewardEl = createRewardElement(reward);
            container.appendChild(rewardEl);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки наград:', error);
        const container = document.getElementById('rewards-container');
        container.innerHTML = '<p class="empty-state">Ошибка загрузки наград</p>';
    }
}

function filterRewardsByTab(rewards, tab) {
    switch(tab) {
        case 'earned-rewards':
            return rewards.filter(r => r.earned);
        case 'available-rewards':
        default:
            return rewards.filter(r => !r.earned);
    }
}

function getEmptyMessageForRewardsTab(tab) {
    switch(tab) {
        case 'earned-rewards':
            return 'Вы еще не получили ни одной награды';
        case 'available-rewards':
            return 'Нет доступных наград';
        default:
            return 'Награды не найдены';
    }
}

function createRewardElement(reward) {
    const rewardEl = document.createElement('div');
    rewardEl.className = `reward-card ${reward.earned ? '' : 'locked'}`;
    
    rewardEl.innerHTML = `
        <div class="reward-icon">${reward.icon}</div>
        <div class="reward-content">
            <h3>${reward.title}</h3>
            <p>${reward.description}</p>
        </div>
        <div class="reward-cost">${reward.cost} очков</div>
        ${!reward.earned ? 
            `<button class="btn small purchase-reward" data-reward-id="${reward.id}">Получить</button>` : 
            `<div class="reward-status">Получено</div>`
        }
    `;
    
    // Добавляем обработчик для кнопки покупки
    if (rewardEl.querySelector('.purchase-reward')) {
        rewardEl.querySelector('.purchase-reward').addEventListener('click', () => {
            purchaseReward(reward.id);
        });
    }
    
    return rewardEl;
}

function filterRewards(tabName) {
    // Перезагружаем награды с новым фильтром
    loadRewards();
}

function setupEventListeners() {
    // Фильтр достижений
    document.getElementById('achievementsFilter').addEventListener('change', () => {
        loadAchievements();
    });
    
    // Кнопка создания испытания
    document.getElementById('createChallengeBtn').addEventListener('click', () => {
        document.getElementById('createChallengeModal').style.display = 'flex';
    });
    
    // Закрытие модальных окон
    document.getElementById('closeCreateChallengeModal').addEventListener('click', () => {
        document.getElementById('createChallengeModal').style.display = 'none';
    });
    
    document.getElementById('closeChallengeDetailModal').addEventListener('click', () => {
        document.getElementById('challengeDetailModal').style.display = 'none';
    });
    
    // Создание испытания
    document.getElementById('createChallengeConfirm').addEventListener('click', () => {
        createNewChallenge();
    });
    
    // Обработка ежедневных заданий
    document.querySelectorAll('.daily-challenge').forEach(challenge => {
        challenge.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                completeDailyChallenge(this);
            }
        });
    });
}

function viewChallengeDetails(challengeId) {
    // В реальном приложении здесь бы загружались детали испытания
    const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
        alert('Испытание не найдено');
        return;
    }
    
    const modalContent = document.getElementById('challengeDetailContent');
    modalContent.innerHTML = `
        <h2>${challenge.title}</h2>
        <div class="challenge-detail-meta">
            <span class="challenge-type-badge">${getChallengeTypeText(challenge.type)}</span>
            <span class="challenge-duration">Осталось: ${challenge.daysLeft} дней</span>
            <span class="challenge-reward">Награда: ${challenge.rewardPoints} очков</span>
        </div>
        
        <div class="challenge-detail-description">
            <h3>Описание</h3>
            <p>${challenge.description}</p>
        </div>
        
        <div class="challenge-detail-progress">
            <h3>Прогресс</h3>
            <div class="progress-container">
                <div class="progress-details">
                    <span>${challenge.goalCurrent || 0} / ${challenge.goalTotal}</span>
                    <span>${Math.min(100, Math.round(((challenge.goalCurrent || 0) / challenge.goalTotal) * 100))}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, Math.round(((challenge.goalCurrent || 0) / challenge.goalTotal) * 100))}%"></div>
                </div>
            </div>
        </div>
        
        ${challenge.participants > 1 ? `
        <div class="challenge-detail-participants">
            <h3>Участники</h3>
            <div class="participants-list">
                <p>Участников: ${challenge.participants}</p>
                <!-- Здесь мог бы быть список участников -->
            </div>
        </div>
        ` : ''}
        
        <div class="challenge-detail-actions">
            ${challenge.status === 'active' ? 
                `<button class="btn primary" id="updateChallengeProgress">Обновить прогресс</button>` : ''}
            ${challenge.status === 'available' ? 
                `<button class="btn primary" id="joinChallengeBtn">Принять участие</button>` : ''}
        </div>
    `;
    
    // Показываем модальное окно
    document.getElementById('challengeDetailModal').style.display = 'flex';
    
    // Добавляем обработчики для кнопок в модальном окне
    if (modalContent.querySelector('#updateChallengeProgress')) {
        modalContent.querySelector('#updateChallengeProgress').addEventListener('click', () => {
            updateChallengeProgress(challengeId);
        });
    }
    
    if (modalContent.querySelector('#joinChallengeBtn')) {
        modalContent.querySelector('#joinChallengeBtn').addEventListener('click', () => {
            joinChallenge(challengeId);
        });
    }
}

function createNewChallenge() {
    const title = document.getElementById('challengeTitle').value.trim();
    const description = document.getElementById('challengeDescription').value.trim();
    const type = document.getElementById('challengeType').value;
    const duration = parseInt(document.getElementById('challengeDuration').value);
    const goal = document.getElementById('challengeGoal').value.trim();
    
    if (!title || !description || !goal) {
        alert('Заполните все обязательные поля');
        return;
    }
    
    try {
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        
        // Создаем новое испытание
        const newChallenge = {
            id: 'challenge-' + Date.now(),
            title: title,
            description: description,
            type: type,
            duration: duration,
            daysLeft: duration,
            goalDescription: goal,
            goalTotal: 100, // В реальном приложении это вычислялось бы из цели
            goalCurrent: 0,
            status: 'active',
            rewardPoints: duration * 10, // Награда зависит от продолжительности
            createdAt: new Date().toISOString()
        };
        
        challenges.push(newChallenge);
        localStorage.setItem('challenges', JSON.stringify(challenges));
        
        // Закрываем модальное окно и очищаем поля
        document.getElementById('createChallengeModal').style.display = 'none';
        document.getElementById('challengeTitle').value = '';
        document.getElementById('challengeDescription').value = '';
        document.getElementById('challengeGoal').value = '';
        
        // Перезагружаем список испытаний
        loadChallenges();
        
        // Показываем уведомление
        showNotification('Испытание создано!', 'success');
        
    } catch (error) {
        console.error('Ошибка создания испытания:', error);
        showNotification('Не удалось создать испытание', 'error');
    }
}

function updateChallengeProgress(challengeId) {
    const progress = prompt('Введите текущий прогресс (например: 25 из 100):', '0');
    if (progress === null) return;
    
    try {
        // Парсим введенное значение
        const match = progress.match(/(\d+)\s*(из|\/)\s*(\d+)/i);
        if (!match) {
            alert('Введите прогресс в формате "число из число"');
            return;
        }
        
        const current = parseInt(match[1]);
        const total = parseInt(match[3]);
        
        if (isNaN(current) || isNaN(total) || current < 0 || total <= 0 || current > total) {
            alert('Некорректные значения прогресса');
            return;
        }
        
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const challengeIndex = challenges.findIndex(c => c.id === challengeId);
        
        if (challengeIndex === -1) {
            alert('Испытание не найдено');
            return;
        }
        
        // Обновляем прогресс
        challenges[challengeIndex].goalCurrent = current;
        challenges[challengeIndex].goalTotal = total;
        
        // Проверяем, выполнено ли испытание
        if (current >= total) {
            challenges[challengeIndex].status = 'completed';
            challenges[challengeIndex].completedAt = new Date().toISOString();
            
            // Начисляем очки
            const rewardPoints = challenges[challengeIndex].rewardPoints;
            addPoints(rewardPoints);
            
            showNotification(`Испытание выполнено! Получено ${rewardPoints} очков`, 'success');
        }
        
        localStorage.setItem('challenges', JSON.stringify(challenges));
        
        // Обновляем интерфейс
        loadChallenges();
        loadUserProgress();
        
        // Закрываем модальное окно, если оно открыто
        document.getElementById('challengeDetailModal').style.display = 'none';
        
    } catch (error) {
        console.error('Ошибка обновления прогресса:', error);
        showNotification('Не удалось обновить прогресс', 'error');
    }
}

function joinChallenge(challengeId) {
    try {
        const challenges = JSON.parse(localStorage.getItem('challenges')) || [];
        const challengeIndex = challenges.findIndex(c => c.id === challengeId);
        
        if (challengeIndex === -1) {
            alert('Испытание не найдено');
            return;
        }
        
        // Присоединяемся к испытанию
        challenges[challengeIndex].status = 'active';
        challenges[challengeIndex].joinedAt = new Date().toISOString();
        
        // Для групповых испытаний увеличиваем счетчик участников
        if (challenges[challengeIndex].type === 'group' || challenges[challengeIndex].type === 'competition') {
            challenges[challengeIndex].participants = (challenges[challengeIndex].participants || 1) + 1;
        }
        
        localStorage.setItem('challenges', JSON.stringify(challenges));
        
        // Обновляем интерфейс
        loadChallenges();
        
        // Закрываем модальное окно, если оно открыто
        document.getElementById('challengeDetailModal').style.display = 'none';
        
        showNotification('Вы присоединились к испытанию!', 'success');
        
    } catch (error) {
        console.error('Ошибка присоединения к испытанию:', error);
        showNotification('Не удалось присоединиться к испытанию', 'error');
    }
}

function completeDailyChallenge(challengeEl) {
    const challengeTitle = challengeEl.querySelector('h3').textContent;
    
    try {
        // Отмечаем задание как выполненное
        const completedChallenges = JSON.parse(localStorage.getItem('completedDailyChallenges')) || [];
        const today = new Date().toISOString().split('T')[0];
        
        // Проверяем, не выполнено ли уже это задание сегодня
        if (completedChallenges.some(c => c.title === challengeTitle && c.date === today)) {
            return;
        }
        
        // Добавляем в выполненные
        completedChallenges.push({
            title: challengeTitle,
            date: today,
            completedAt: new Date().toISOString()
        });
        
        localStorage.setItem('completedDailyChallenges', JSON.stringify(completedDailyChallenges));
        
        // Начисляем очки
        const rewardText = challengeEl.querySelector('.daily-reward').textContent;
        const pointsMatch = rewardText.match(/\+(\d+)/);
        if (pointsMatch) {
            const points = parseInt(pointsMatch[1]);
            addPoints(points);
        }
        
        // Обновляем интерфейс
        challengeEl.classList.add('completed');
        challengeEl.querySelector('.daily-checkbox').textContent = '✓';
        
        // Обновляем прогресс пользователя
        loadUserProgress();
        
        showNotification('Ежедневное задание выполнено!', 'success');
        
    } catch (error) {
        console.error('Ошибка выполнения задания:', error);
        showNotification('Не удалось отметить задание как выполненное', 'error');
    }
}

function purchaseReward(rewardId) {
    try {
        const rewards = JSON.parse(localStorage.getItem('rewards')) || [];
        const rewardIndex = rewards.findIndex(r => r.id === rewardId);
        
        if (rewardIndex === -1) {
            alert('Награда не найдена');
            return;
        }
        
        const reward = rewards[rewardIndex];
        const userPoints = calculateTotalPoints();
        
        // Проверяем, хватает ли очков
        if (userPoints < reward.cost) {
            alert(`Недостаточно очков. Нужно: ${reward.cost}, у вас: ${userPoints}`);
            return;
        }
        
        // Покупка награды
        rewards[rewardIndex].earned = true;
        rewards[rewardIndex].earnedAt = new Date().toISOString();
        
        localStorage.setItem('rewards', JSON.stringify(rewards));
        
        // Обновляем интерфейс
        loadRewards();
        loadUserProgress();
        
        showNotification('Награда получена!', 'success');
        
    } catch (error) {
        console.error('Ошибка покупки награды:', error);
        showNotification('Не удалось получить награду', 'error');
    }
}

function addPoints(points) {
    // В реальном приложении здесь бы обновлялся счет очков пользователя
    console.log(`Начислено ${points} очков`);
    // Для демонстрации просто обновляем интерфейс
    loadUserProgress();
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
function formatDate(dateString) {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата';
    
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Генерация mock-данных для демонстрации
function generateMockChallenges() {
    return [
        {
            id: 'challenge-1',
            title: '30 дней приседаний',
            description: 'Выполняйте 50 приседаний каждый день в течение 30 дней',
            type: 'personal',
            duration: 30,
            daysLeft: 25,
            goalTotal: 1500,
            goalCurrent: 750,
            status: 'active',
            rewardPoints: 300,
            participants: 1,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'challenge-2',
            title: 'Мастер планки',
            description: 'Держите планку 5 минут без перерыва',
            type: 'personal',
            duration: 14,
            daysLeft: 14,
            goalTotal: 300,
            goalCurrent: 120,
            status: 'active',
            rewardPoints: 150,
            participants: 1,
            createdAt: new Date().toISOString()
        },
        {
            id: 'challenge-3',
            title: 'Групповой беговой марафон',
            description: 'Пробегите 100 км в составе группы за месяц',
            type: 'group',
            duration: 30,
            daysLeft: 30,
            goalTotal: 100,
            goalCurrent: 0,
            status: 'available',
            rewardPoints: 500,
            participants: 8,
            createdAt: new Date().toISOString()
        }
    ];
}

function generateMockAchievements() {
    return [
        {
            id: 'ach-1',
            icon: '🏆',
            title: 'Первая тренировка',
            description: 'Завершите вашу первую тренировку',
            category: 'training',
            earned: true,
            earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            points: 50,
            progress: 100
        },
        {
            id: 'ach-2',
            icon: '🔥',
            title: 'Неделя активности',
            description: 'Тренируйтесь 7 дней подряд',
            category: 'consistency',
            earned: false,
            points: 100,
            progress: 57
        },
        {
            id: 'ach-3',
            icon: '💪',
            title: 'Силач',
            description: 'Поднимите 1000 кг за одну тренировку',
            category: 'strength',
            earned: true,
            earnedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            points: 150,
            progress: 100
        },
        {
            id: 'ach-4',
            icon: '🏃',
            title: 'Марафонец',
            description: 'Пробегите 42 км за месяц',
            category: 'endurance',
            earned: false,
            points: 200,
            progress: 35
        },
        {
            id: 'ach-5',
            icon: '⭐',
            title: 'Ветеран',
            description: 'Завершите 100 тренировок',
            category: 'training',
            earned: false,
            points: 300,
            progress: 24
        },
        {
            id: 'ach-6',
            icon: '👑',
            title: 'Король/Королева тренажерного зала',
            description: 'Посещайте тренажерный зал 3 раза в неделю в течение месяца',
            category: 'consistency',
            earned: true,
            earnedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            points: 250,
            progress: 100
        }
    ];
}

function generateMockRewards() {
    return [
        {
            id: 'reward-1',
            icon: '🎁',
            title: 'Скидка 15% на спортивные товары',
            description: 'Используйте код: FITNESS15',
            category: 'discount',
            cost: 500,
            earned: false
        },
        {
            id: 'reward-2',
            icon: '📘',
            title: 'Гайд по питанию',
            description: 'PDF-руководство по правильному питанию',
            category: 'knowledge',
            cost: 300,
            earned: false
        },
        {
            id: 'reward-3',
            icon: '⭐',
            title: 'Персональная тренировка',
            description: '60 минут с персональным тренером',
            category: 'experience',
            cost: 1500,
            earned: false
        },
        {
            id: 'reward-4',
            icon: '🏅',
            title: 'Эксклюзивная футболка',
            description: 'Фирменная футболка приложения',
            category: 'merch',
            cost: 1000,
            earned: true,
            earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
}