let exercises = [];
let workoutPlan = [];

const exerciseList = document.getElementById("exerciseList");
const currentWorkout = document.getElementById("currentWorkout");

async function loadExercises() {
  try {
    const res = await fetch("exercises.json");
    exercises = await res.json();
    renderExercises();
  } catch (err) {
    console.error("Ошибка загрузки exercises.json:", err);
  }
}

function renderExercises() {
  exerciseList.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const level = document.getElementById("levelFilter").value;

  exercises
    .filter(e =>
      (!search || e.name.toLowerCase().includes(search)) &&
      (!type || e.type === type) &&
      (!level || e.level === level)
    )
    .forEach(e => {
      const li = document.createElement("li");
      li.className = "card";

      li.innerHTML = `
        <h3>${e.name}</h3>
        <p><strong>Тип:</strong> ${e.type}</p>
        <p><strong>Уровень:</strong> ${e.level}</p>
      `;

      const btn = document.createElement("button");
      btn.textContent = "Добавить";
      btn.className = "btn";
      btn.onclick = () => addExercise(e);

      li.appendChild(btn);
      exerciseList.appendChild(li);
    });
}

function addExercise(exercise) {
  workoutPlan.push(exercise);
  renderWorkout();
}

function renderWorkout() {
  currentWorkout.innerHTML = "";
  workoutPlan.forEach((e, i) => {
    const li = document.createElement("li");
    li.textContent = `${e.name} `;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.className = "btn danger";
    btn.onclick = () => {
      workoutPlan.splice(i, 1);
      renderWorkout();
    };
    li.appendChild(btn);
    currentWorkout.appendChild(li);
  });
}

function saveWorkout() {
  const date = document.getElementById("workoutDate").value || new Date().toISOString().slice(0,10);
  if (workoutPlan.length === 0) {
    alert("Добавьте хотя бы одно упражнение!");
    return;
  }

  let history = JSON.parse(localStorage.getItem("workoutHistory")) || [];
  history.push({
    date: date,
    exercises: workoutPlan
  });
  localStorage.setItem("workoutHistory", JSON.stringify(history));
  alert("Тренировка сохранена!");
  workoutPlan = [];
  renderWorkout();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("workoutDate").value = new Date().toISOString().slice(0,10);
  loadExercises();
  document.getElementById("search").addEventListener("input", renderExercises);
  document.getElementById("typeFilter").addEventListener("change", renderExercises);
  document.getElementById("levelFilter").addEventListener("change", renderExercises);
});
