// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let exercises = [
    { id: uid(), name: 'Жим лёжа', gif: '', created: Date.now() },
    { id: uid(), name: 'Приседания', gif: '', created: Date.now() },
    { id: uid(), name: 'Становая тяга', gif: '', created: Date.now() },
    { id: uid(), name: 'Подтягивания', gif: '', created: Date.now() },
    { id: uid(), name: 'Тяга штанги в наклоне', gif: '', created: Date.now() },
    { id: uid(), name: 'Жим стоя', gif: '', created: Date.now() },
    { id: uid(), name: 'Сгибания на бицепс с гантелями', gif: '', created: Date.now() },
    { id: uid(), name: 'Отжимания на брусьях', gif: '', created: Date.now() },
    { id: uid(), name: 'Планка', gif: '', created: Date.now() }
];

let workouts = JSON.parse(localStorage.getItem("workouts") || "[]");
let currentWorkout = null;

// ==================== УТИЛИТЫ ====================
function uid() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function saveWorkouts() {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

// ==================== МЕНЮ ====================
document.getElementById("burger").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.add("open");
});

document.getElementById("close-sidebar").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.remove("open");
});

// ==================== ДОБАВЛЕНИЕ ПОДХОДОВ ====================
function addSet(exerciseId) {
    const exercise = currentWorkout.exercises.find(e => e.id === exerciseId);
    exercise.sets.push({ weight: 0, reps: 0 });
    renderWorkoutEditor();
}

function updateSet(exerciseId, setIndex, field, value) {
    const exercise = currentWorkout.exercises.find(e => e.id === exerciseId);
    exercise.sets[setIndex][field] = parseInt(value) || 0;
    saveWorkouts();
}

// ==================== РАБОТА С ТРЕНИРОВКАМИ ====================
function newWorkout(date) {
    currentWorkout = {
        id: uid(),
        date: date || new Date().toISOString().split("T")[0],
        exercises: []
    };
    workouts.push(currentWorkout);
    saveWorkouts();
    renderWorkoutEditor();
}

function addExerciseToWorkout(exerciseId) {
    const ex = exercises.find(e => e.id === exerciseId);
    if (ex) {
        currentWorkout.exercises.push({ ...ex, sets: [] });
        saveWorkouts();
        renderWorkoutEditor();
    }
}

function renderWorkoutEditor() {
    const container = document.getElementById("workout-editor");
    if (!currentWorkout) {
        container.innerHTML = "<p>Выберите тренировку или создайте новую.</p>";
        return;
    }

    container.innerHTML = `
        <h2>Тренировка ${currentWorkout.date}</h2>
        ${currentWorkout.exercises.map(ex => `
            <div class="exercise-block">
                <h3>${ex.name}</h3>
                ${ex.sets.map((set, idx) => `
                    <div class="set-row">
                        <input type="number" value="${set.weight}" onchange="updateSet('${ex.id}', ${idx}, 'weight', this.value)" placeholder="Вес (кг)">
                        <input type="number" value="${set.reps}" onchange="updateSet('${ex.id}', ${idx}, 'reps', this.value)" placeholder="Повт.">
                    </div>
                `).join("")}
                <button onclick="addSet('${ex.id}')">Добавить подход</button>
            </div>
        `).join("")}
        <select id="exercise-select">
            ${exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join("")}
        </select>
        <button onclick="addExerciseToWorkout(document.getElementById('exercise-select').value)">Добавить упражнение</button>
    `;
}

// ==================== КАЛЕНДАРЬ ====================
function renderCalendar() {
    const container = document.getElementById("calendar");
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let html = `<h2>${today.toLocaleString('ru', { month: 'long' })} ${year}</h2><div class="calendar-grid">`;

    for (let i = 1; i <= 31; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasWorkout = workouts.some(w => w.date === dateStr);

        html += `<div class="day ${hasWorkout ? 'workout-day' : ''}" onclick="newWorkout('${dateStr}')">${i}</div>`;
    }

    html += "</div>";
    container.innerHTML = html;
}

// ==================== СТАРТ ====================
document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    renderWorkoutEditor();
});
