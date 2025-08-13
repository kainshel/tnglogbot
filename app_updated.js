
function showSection(view) {
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
        section.classList.remove('active');
    });
    document.getElementById(view).classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        showSection(view);
    });
});

// Добавление тренировок
const exercises = [
    { name: 'Приседания', sets: [] },
    { name: 'Жим лёжа', sets: [] },
    { name: 'Подтягивания', sets: [] },
    { name: 'Тяга штанги', sets: [] }
];

function addSet(exerciseIndex, weight, reps) {
    exercises[exerciseIndex].sets.push({ weight, reps });
    renderSets(exerciseIndex);
}

function renderSets(exerciseIndex) {
    const setsContainer = document.getElementById(`sets-${exerciseIndex}`);
    setsContainer.innerHTML = exercises[exerciseIndex].sets.map((set, idx) => 
        `<div>Подход ${idx + 1}: ${set.weight} кг, ${set.reps} повторений</div>`).join('');
}

function showExerciseDetails(exerciseIndex) {
    const exercise = exercises[exerciseIndex];
    const detailsContainer = document.getElementById('exercise-details');
    detailsContainer.innerHTML = `<h3>${exercise.name}</h3><div id="sets-${exerciseIndex}"></div>
        <input type="number" id="weight-${exerciseIndex}" placeholder="Вес (кг)" />
        <input type="number" id="reps-${exerciseIndex}" placeholder="Повторения" />
        <button onclick="addSet(${exerciseIndex}, document.getElementById('weight-${exerciseIndex}').value, document.getElementById('reps-${exerciseIndex}').value)">Добавить подход</button>`;
}

document.getElementById('exercises').innerHTML = exercises.map((exercise, index) =>
    `<button onclick="showExerciseDetails(${index})">${exercise.name}</button>`).join('');

// Календарь
function initializeCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const date = new Date();
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let calendarHTML = '<div class="calendar-header">';
    daysOfWeek.forEach((day) => {
        calendarHTML += `<div>${day}</div>`;
    });
    calendarHTML += '</div><div class="calendar-body">';
    for (let i = 1; i <= monthDays; i++) {
        calendarHTML += `<div class="calendar-day">${i}</div>`;
    }
    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;
}

initializeCalendar();
