// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Элементы интерфейса
const profileCard = document.getElementById('profile-data');
const lastWorkoutCard = document.getElementById('workout-data');

// Загрузка данных профиля (заглушка)
function loadProfile() {
    profileCard.innerHTML = `
        <p><strong>Имя:</strong> Пользователь</p>
        <p><strong>Вес:</strong> 70 кг</p>
    `;
}

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