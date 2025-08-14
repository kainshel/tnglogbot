// CONFIG (safe global). Do NOT put secrets here.
window.BOT_CONFIG = {
  bot_username: 'YourBotNameHere', // отображение в UI
};

// Public (non-secret) app settings
window.CONFIG = {
  apiUrl: 'https://kainshel.github.io/tnglogbot/', // исправлено: в кавычках
  workout: {
    maxExercises: 10,
    maxSetsPerExercise: 5,
  },
  settings: {
    enableDarkMode: true,
    autoSave: true,
    enableNotifications: true,
  }
};

// Secrets should be provided by your server-side API only.
// If you need local dev, create config.local.js (ignored by git) and override window.CONFIG there.
