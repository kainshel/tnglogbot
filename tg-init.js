(function () {
  try {
    if (!window.Telegram || !Telegram.WebApp) return;
    const app = Telegram.WebApp;
    app.ready();
    try { app.expand(); } catch (e) {}
    if (app.BackButton) {
      app.BackButton.show();
      app.BackButton.onClick(() => app.close());
    }
    const tp = app.themeParams || {};
    if (tp.bg_color) document.documentElement.style.setProperty('--bg', tp.bg_color);
    // expose init data user id for storage namespacing
    window.__TG_INIT = Telegram.WebApp.initDataUnsafe || null;
  } catch (err) {
    console.warn('tg-init error', err);
  }
})();