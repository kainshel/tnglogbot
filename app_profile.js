function loadProfile() {
      const saved = localStorage.getItem("userProfile");
      return saved ? JSON.parse(saved) : null;
    }

    function calculateWorkoutStats() {
      const workouts = JSON.parse(localStorage.getItem("workouts") || "{}");
      const workoutDates = Object.keys(workouts);
      
      // Считаем разные упражнения
      const allExercises = new Set();
      let totalSets = 0;
      
      Object.values(workouts).forEach(workout => {
        workout.forEach(exercise => {
          allExercises.add(exercise.name_ru);
          totalSets += exercise.sets.length;
        });
      });
      
      // Находим последнюю тренировку
      let lastWorkoutDate = null;
      if (workoutDates.length > 0) {
        const sortedDates = workoutDates.sort((a, b) => new Date(b) - new Date(a));
        lastWorkoutDate = new Date(sortedDates[0]).toLocaleDateString('ru-RU');
      }
      
      return {
        totalWorkouts: workoutDates.length,
        totalExercises: allExercises.size,
        totalSets: totalSets,
        lastWorkout: lastWorkoutDate
      };
    }

    function renderProfile() {
      const p = loadProfile();
      if (p) {
        document.getElementById("username").textContent = p.username;
        document.getElementById("usergoal").textContent = "Цель: " + p.goal;
        document.getElementById("age").textContent = p.age;
        document.getElementById("height").textContent = p.height + " см";
        document.getElementById("weight").textContent = p.weight + " кг";
      }
      
      // Загружаем статистику из истории тренировок
      const stats = calculateWorkoutStats();
      document.getElementById("totalWorkouts").textContent = stats.totalWorkouts;
      document.getElementById("totalExercises").textContent = stats.totalExercises;
      document.getElementById("totalSets").textContent = stats.totalSets;
      document.getElementById("lastWorkout").textContent = stats.lastWorkout || "—";
      
      // Обновляем профиль с актуальной статистикой
      if (p) {
        const updatedProfile = {
          ...p,
          totalWorkouts: stats.totalWorkouts,
          totalExercises: stats.totalExercises
        };
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      }
    }

    function logout() {
      if (confirm("Выйти из профиля?")) {
        localStorage.removeItem("userProfile");
        location.reload();
      }
    }

    document.addEventListener("DOMContentLoaded", renderProfile);