// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран

// Элементы DOM
const exerciseInput = document.getElementById('exercise-input');
const addBtn = document.getElementById('add-btn');
const exerciseList = document.getElementById('exercise-list');

// Добавление упражнения
addBtn.addEventListener('click', () => {
    const exerciseName = exerciseInput.value.trim();
    if (exerciseName) {
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.textContent = exerciseName;
        exerciseList.appendChild(exerciseItem);
        exerciseInput.value = '';
    }
});

// Кнопка закрытия (для демонстрации)
const closeBtn = document.createElement('button');
closeBtn.textContent = 'Закрыть приложение';
closeBtn.addEventListener('click', () => tg.close());
document.body.appendChild(closeBtn);