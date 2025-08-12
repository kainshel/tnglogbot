// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Элементы интерфейса
const profileCard = document.getElementById('profile-data');
const lastWorkoutCard = document.getElementById('workout-data');

// Загрузка данных профиля (заглушка)
// Загрузка профиля из памяти Telegram
function loadProfile() {
    const userData = tg.initDataUnsafe.user || {};
    const savedData = {
        name: localStorage.getItem('profile_name') || userData.first_name || 'Аноним',
        weight: localStorage.getItem('profile_weight') || 70
    };

    document.getElementById('input-name').value = savedData.name;
    document.getElementById('input-weight').value = savedData.weight;
}

// Сохранение профиля
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('input-name').value;
    const weight = document.getElementById('input-weight').value;
    
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_weight', weight);
    
    tg.showAlert('✅ Профиль сохранен!');
});

// Загрузка последней тренировки (заглушка)
function loadLastWorkout() {
    lastWorkoutCard.innerHTML = `
        <p>Сегодня тренировки нет</p>
    `;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadLastWorkout();
});

// Обработчики кнопок
document.getElementById('btn-new-workout').addEventListener('click', () => {
    tg.showAlert('Форма новой тренировки будет здесь!');
});

document.getElementById('btn-exercises').addEventListener('click', () => {
    tg.showAlert('База упражнений откроется здесь!');
});