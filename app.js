const tg = window.Telegram.WebApp;
tg.expand();

// Проверяем, доступно ли облачное хранилище
if (!tg.CloudStorage) {
    tg.showAlert("Облачное хранилище недоступно. Используем localStorage.");
}

// Загрузка профиля
async function loadProfile() {
    let name, weight;

    // Пробуем получить данные из Telegram Cloud
    try {
        name = await tg.CloudStorage.getItem("profile_name");
        weight = await tg.CloudStorage.getItem("profile_weight");
    } catch (e) {
        console.error("Ошибка CloudStorage:", e);
    }

    // Если в CloudStorage пусто, берём из localStorage или дефолтные значения
    if (!name || !weight) {
        name = localStorage.getItem("profile_name") || tg.initDataUnsafe.user?.first_name || "Аноним";
        weight = localStorage.getItem("profile_weight") || 70;
    }

    document.getElementById("input-name").value = name;
    document.getElementById("input-weight").value = weight;
}

// Сохранение профиля
document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("input-name").value;
    const weight = document.getElementById("input-weight").value;
    
    try {
        // Пробуем сохранить в Telegram Cloud
        await tg.CloudStorage.setItem("profile_name", name);
        await tg.CloudStorage.setItem("profile_weight", weight);
        tg.showAlert("✅ Профиль сохранён в облако!");
    } catch (e) {
        // Если ошибка, сохраняем в localStorage
        localStorage.setItem("profile_name", name);
        localStorage.setItem("profile_weight", weight);
        tg.showAlert("✅ Профиль сохранён локально (без облака).");
    }
});

// Инициализация
document.addEventListener("DOMContentLoaded", loadProfile);