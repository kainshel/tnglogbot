
// CONFIG - замените токен в безопасном месте при деплоем
const BOT_CONFIG = {
  bot_username: "@tng_log_bot",
  public_name: "Дневник тренировки",
  bot_token: "8108534803:AAFI_XhxnrGRkVnOwIUCL0IqnaNtKXDcX_0"
};

// config.js
// Конфигурация для приложения "Дневник тренировок"

const config = {
  // Название приложения
  appName: 'Дневник тренировок',

  // Telegram Mini App ID (если необходимо интегрировать с Telegram)
  telegramBotId: '8108534803:AAFI_XhxnrGRkVnOwIUCL0IqnaNtKXDcX_0',

  // API URL для взаимодействия с сервером (если необходимо)
  apiUrl: https://kainshel.github.io/tnglogbot/,

  // Конфигурация тем
  themes: {
    light: {
      backgroundColor: '#f0f0f0',
      textColor: '#000000',
      accentColor: '#7F9B75',  // Цвет лаврового листа
    },
    dark: {
      backgroundColor: '#0f1520',
      textColor: '#e7e8ea',
      accentColor: '#A9BA9D',  // Цвет лаврового листа
    }
  },

  // Локальные настройки
  localStorageKey: 'trainingDiaryData',

  // Формат хранения данных в LocalStorage
  storageFormat: 'JSON',

  // Календарь
  calendar: {
    firstDayOfWeek: 'Monday', // Понедельник или Воскресенье
    enableReminders: true,    // Включить напоминания о тренировках
  },

  // Настройки статистики
  stats: {
    enableTracking: true,     // Включить отслеживание прогресса
    showTopExercises: 5,      // Количество лучших упражнений для отображения
  },

  // Тренировки
  workout: {
    maxExercises: 10,         // Максимальное количество упражнений на одну тренировку
    maxSetsPerExercise: 5,    // Максимальное количество подходов на одно упражнение
  },

  // Дополнительные настройки (опционально)
  settings: {
    enableDarkMode: true,     // Включить тёмную тему по умолчанию
    autoSave: true,           // Автоматическое сохранение данных
    enableNotifications: true, // Включить уведомления о новых тренировках
  }
};

// Вы экспортируете этот объект, чтобы использовать его в других частях приложения
export default config;