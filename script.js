
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

function startWorkout(workoutType) {
    alert("Вы выбрали тренировку: " + workoutType);
    // Здесь можно добавить логику для начала тренировки
}

function generateProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Прогресс',
                data: [20, 30, 45, 50, 70, 80, 90],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Ваш прогресс'
                }
            }
        });
}

window.onload = generateProgressChart;
