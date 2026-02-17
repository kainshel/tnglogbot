// app.js - Инициализация приложения с глобальным Error Boundary
(function(){
  window.App = {
    version: 'v2.0',
    ready: false,
    onReadyQueue: [],
    errors: [],
    errorHandlers: []
  };

  // Error Boundary класс для компонентов
  class ErrorBoundary {
    constructor(componentName, fallbackUI = null) {
      this.componentName = componentName;
      this.fallbackUI = fallbackUI;
      this.hasError = false;
      this.error = null;
    }

    wrap(renderFn) {
      return (...args) => {
        try {
          if (this.hasError) {
            return this.showFallback();
          }
          return renderFn(...args);
        } catch (error) {
          this.handleError(error);
          return this.showFallback();
        }
      };
    }

    handleError(error) {
      this.hasError = true;
      this.error = error;
      
      // Логируем ошибку
      console.error(`❌ Error Boundary [${this.componentName}]:`, error);
      
      // Добавляем в глобальный список ошибок
      App.errors.push({
        component: this.componentName,
        error: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      // Вызываем обработчики
      App.errorHandlers.forEach(handler => {
        try {
          handler(error, this.componentName);
        } catch (e) {
          console.error('Error in error handler:', e);
        }
      });

      // Показываем уведомление
      if (App.showErrorNotification) {
        App.showErrorNotification(`Ошибка в компоненте ${this.componentName}`);
      }
    }

    showFallback() {
      if (this.fallbackUI) {
        return this.fallbackUI(this.error);
      }
      
      // Дефолтный fallback UI
      return `
        <div class="error-boundary-fallback" style="
          padding: 20px;
          margin: 10px;
          border: 1px solid #ff4d4f;
          border-radius: 8px;
          background: #fff2f0;
          text-align: center;
        ">
          <div style="color: #ff4d4f; font-size: 24px; margin-bottom: 10px;">⚠️</div>
          <h4 style="color: #ff4d4f; margin: 0 0 10px 0;">
            Ошибка в компоненте "${this.componentName}"
          </h4>
          <button onclick="location.reload()" style="
            padding: 8px 16px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">
            Перезагрузить
          </button>
        </div>
      `;
    }

    reset() {
      this.hasError = false;
      this.error = null;
    }
  }

  // Глобальный Error Boundary для всего приложения
  class GlobalErrorBoundary {
    constructor() {
      this.setupGlobalHandlers();
      this.createErrorOverlay();
    }

    setupGlobalHandlers() {
      // Перехват синхронных ошибок
      window.addEventListener('error', (e) => {
        this.handleError(e.error || e.message, 'global');
        console.error('🌍 Global error:', e.error);
        
        // Показываем уведомление, но не для всех ошибок (игнорируем ресурсные ошибки)
        if (!e.target || e.target.tagName !== 'SCRIPT' && e.target.tagName !== 'LINK') {
          showNotification('Произошла ошибка. Обновите страницу.', 'error');
        }
        
        return false;
      });

      // Перехват Promise ошибок
      window.addEventListener('unhandledrejection', (e) => {
        this.handleError(e.reason, 'promise');
        console.error('🌍 Unhandled promise:', e.reason);
        showNotification('Асинхронная ошибка. Обновите страницу.', 'error');
      });

      // Перехват ошибок в React рендере (если используется)
      if (window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
        const originalOnError = window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.handleError;
        window.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__.handleError = (error) => {
          this.handleError(error, 'react');
          if (originalOnError) originalOnError(error);
        };
      }
    }

    createErrorOverlay() {
      // Создаем контейнер для глобального fallback UI
      if (!document.getElementById('global-error-boundary')) {
        const overlay = document.createElement('div');
        overlay.id = 'global-error-boundary';
        overlay.style.cssText = `
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          z-index: 9999;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        `;
        document.body.appendChild(overlay);
      }
    }

    handleError(error, source) {
      // Сохраняем ошибку
      App.errors.push({
        source,
        error: error?.toString() || 'Unknown error',
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });

      // Вызываем обработчики
      App.errorHandlers.forEach(handler => {
        try {
          handler(error, source);
        } catch (e) {
          console.error('Error in error handler:', e);
        }
      });

      // Если ошибка критическая, показываем глобальный fallback
      if (this.isCriticalError(error)) {
        this.showGlobalFallback(error);
      }
    }

    isCriticalError(error) {
      // Определяем критические ошибки
      const criticalMessages = [
        'chunk',
        'loading',
        'network',
        'permission',
        'out of memory'
      ];
      
      const errorStr = error?.toString()?.toLowerCase() || '';
      return criticalMessages.some(msg => errorStr.includes(msg));
    }

    showGlobalFallback(error) {
      const overlay = document.getElementById('global-error-boundary');
      if (!overlay) return;

      overlay.innerHTML = `
        <div style="
          max-width: 400px;
          padding: 30px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          text-align: center;
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">🔴</div>
          <h2 style="color: #ff4d4f; margin: 0 0 15px 0;">
            Критическая ошибка
          </h2>
          <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
            ${error?.toString() || 'Произошла непредвиденная ошибка'}
          </p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="location.reload()" style="
              padding: 10px 20px;
              background: #ff4d4f;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            ">
              Перезагрузить
            </button>
            <button onclick="App.errorBoundary.reset()" style="
              padding: 10px 20px;
              background: #f0f0f0;
              color: #333;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            ">
              Попробовать снова
            </button>
          </div>
        </div>
      `;
      
      overlay.style.display = 'flex';
    }

    reset() {
      const overlay = document.getElementById('global-error-boundary');
      if (overlay) {
        overlay.style.display = 'none';
      }
      App.errors = [];
    }
  }

  // Инициализация глобального Error Boundary
  App.errorBoundary = new GlobalErrorBoundary();
  
  // Метод для создания Error Boundary для компонентов
  App.createErrorBoundary = (componentName, fallbackUI) => {
    return new ErrorBoundary(componentName, fallbackUI);
  };

  // Метод для добавления обработчика ошибок
  App.onError = (handler) => {
    App.errorHandlers.push(handler);
    return () => {
      const index = App.errorHandlers.indexOf(handler);
      if (index > -1) App.errorHandlers.splice(index, 1);
    };
  };

  // Метод для показа уведомления об ошибке
  App.showErrorNotification = (message) => {
    if (typeof showNotification === 'function') {
      showNotification(message, 'error');
    } else {
      console.warn('showNotification not available:', message);
    }
  };

  // Метод для получения истории ошибок
  App.getErrorHistory = () => {
    return [...App.errors];
  };

  // Метод для очистки истории ошибок
  App.clearErrorHistory = () => {
    App.errors = [];
  };

  function ready() {
    App.ready = true;
    App.onReadyQueue.forEach(fn => { 
      try { 
        fn(); 
      } catch(e){ 
        App.errorBoundary.handleError(e, 'ready-callback');
        console.error(e);
      } 
    });
    App.onReadyQueue = [];
    document.dispatchEvent(new Event('appReady'));
  }

  // wait for DOM and tg-init
  document.addEventListener('DOMContentLoaded', function(){
    // small delay to ensure tg-init fires its event first
    setTimeout(ready, 10);
  });

  window.App.readyOr = function(fn){
    if (App.ready) {
      try {
        fn();
      } catch(e) {
        App.errorBoundary.handleError(e, 'readyOr-callback');
      }
    } else {
      App.onReadyQueue.push(fn);
    }
  };
})();

// Переопределяем глобальные обработчики
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (window.App && App.showErrorNotification) {
    App.showErrorNotification('Произошла ошибка. Обновите страницу.');
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise:', e.reason);
  if (window.App && App.showErrorNotification) {
    App.showErrorNotification('Асинхронная ошибка. Обновите страницу.');
  }
});
import { initScrollToTop } from '../ui/scroll-to-top.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollToTop();
});
// Пример использования в компонентах:
/*
// Создаем Error Boundary для компонента
const userProfileBoundary = App.createErrorBoundary('UserProfile');

// Оборачиваем рендер функцию
function renderUserProfile() {
  return userProfileBoundary.wrap(() => {
    // Ваш код рендера
    return '<div>User Profile</div>';
  })();
}

// Сброс состояния после исправления ошибки
userProfileBoundary.reset();
*/