const tg = window.Telegram.WebApp;
tg.expand();

// Получаем ID пользователя из Telegram
const userId = tg.initDataUnsafe.user?.id;
if (!userId) {
    tg.showAlert("Ошибка: пользователь не авторизован");
    throw new Error("User ID not available");
}

// Ключи для хранения данных с привязкой к ID пользователя
const PROFILE_KEY = `profile_${userId}`;

// Загрузка профиля
async function loadProfile() {
    try {
        // Пробуем получить данные из Telegram Cloud
        const savedData = await tg.CloudStorage.getItem(PROFILE_KEY);
        
        if (savedData) {
            // Данные найдены в облаке
            document.getElementById("input-name").value = savedData.name;
            document.getElementById("input-weight").value = savedData.weight;
            return;
        }
    } catch (e) {
        console.log("CloudStorage error:", e);
    }

    // Если данных нет - устанавливаем значения по умолчанию
    const user = tg.initDataUnsafe.user;
    document.getElementById("input-name").value = user?.first_name || "Аноним";
    document.getElementById("input-weight").value = 70;
}

// Сохранение профиля
document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById("input-name").value,
        weight: document.getElementById("input-weight").value
    };
    
    try {
        // Сохраняем в облако
        await tg.CloudStorage.setItem(PROFILE_KEY, profileData);
        tg.showAlert("✅ Профиль сохранён!");
        
        // Дополнительно сохраняем в localStorage
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    } catch (error) {
        tg.showAlert("⚠️ Ошибка сохранения: " + error.message);
    }
});

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
    // Проверяем доступность CloudStorage
    if (!tg.CloudStorage) {
        tg.showAlert("Внимание: облачное хранилище недоступно");
    }
    
    loadProfile();
});

console.log("User ID:", userId);
console.log("Telegram WebApp:", tg);
console.log("CloudStorage available:", !!tg.CloudStorage);