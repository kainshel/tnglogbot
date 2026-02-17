// app.js - Инициализация приложения с глобальным Error Boundary

// Импорты должны быть в начале файла
import { initScrollToTop } from '../ui/scroll-to-top.js';

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
  // Проверяем наличие Telegram WebApp
  if (window.Telegram?.WebApp?.showPopup) {
    Telegram.WebApp.showPopup({
      title: type === 'error' ? 'Ошибка' : 'Внимание',
      message: message,
      buttons: [{ type: 'ok' }]
    });
  } else {
    // Fallback для браузера
    console.log(`[${type}] ${message}`);
    alert(message);
  }
}

(function(){
  window.App = {
    version: 'v2.0',
    ready: false,
    onReadyQueue: [],
    errors: [],
    errorHandlers: [],
    componentBoundaries: new Map() // Храним все созданные boundary
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
      
      console.error(`❌ Error Boundary [${this.componentName}]:`, error);
      
      App.errors.push({
        component: this.componentName,
        error: error.toString(),
        stack: error.stack,
        timestamp: new Date().toISOString()
      });

      App.errorHandlers.forEach(handler => {
        try {
          handler(error, this.componentName);
        } catch (e) {
          console.error('Error in error handler:', e);
        }
      });

      if (App.showErrorNotification) {
        App.showErrorNotification(`Ошибка в компоненте ${this.componentName}`);
      }
    }

    showFallback() {
      if (this.fallbackUI) {
        return this.fallbackUI(this.error);
      }
      
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
          <button onclick="App.resetComponentBoundary('${this.componentName}')" style="
            padding: 8px 16px;
            background: #ff4d4f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          ">
            Попробовать снова
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
      // Удаляем существующие обработчики, чтобы избежать дублирования
      window.removeEventListener('error', this.globalErrorHandler);
      window.removeEventListener('unhandledrejection', this.promiseErrorHandler);
      
      // Добавляем новые обработчики
      this.globalErrorHandler = this.handleGlobalError.bind(this);
      this.promiseErrorHandler = this.handlePromiseError.bind(this);
      
    }

    handleGlobalError(e) {
      // Игнорируем ресурсные ошибки
      if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK' || e.target.tagName === 'IMG')) {
        console.warn('Resource error ignored:', e.target);
        return false;
      }
      
      this.handleError(e.error || e.message, 'global');
      return false;
    }

    handlePromiseError(e) {
      this.handleError(e.reason, 'promise');
    }

    createErrorOverlay() {
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
      App.errors.push({
        source,
        error: error?.toString() || 'Unknown error',
        stack: error?.stack,
        timestamp: new Date().toISOString()
      });

      App.errorHandlers.forEach(handler => {
        try {
          handler(error, source);
        } catch (e) {
          console.error('Error in error handler:', e);
        }
      });

      if (this.isCriticalError(error)) {
        this.showGlobalFallback(error);
      }
    }

    isCriticalError(error) {
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
            <button onclick="App.resetAllBoundaries()" style="
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

    hideGlobalFallback() {
      const overlay = document.getElementById('global-error-boundary');
      if (overlay) {
        overlay.style.display = 'none';
      }
    }
  }

  // Инициализация глобального Error Boundary
  App.errorBoundary = new GlobalErrorBoundary();
  
  // Метод для создания Error Boundary для компонентов
  App.createErrorBoundary = (componentName, fallbackUI) => {
    const boundary = new ErrorBoundary(componentName, fallbackUI);
    App.componentBoundaries.set(componentName, boundary);
    return boundary;
  };

  // Метод для сброса конкретного компонента
  App.resetComponentBoundary = (componentName) => {
    const boundary = App.componentBoundaries.get(componentName);
    if (boundary) {
      boundary.reset();
    }
  };

  // Метод для сброса всех компонентов
  App.resetAllBoundaries = () => {
    App.componentBoundaries.forEach(boundary => boundary.reset());
    App.errorBoundary.hideGlobalFallback();
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
    showNotification(message, 'error');
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

  document.addEventListener('DOMContentLoaded', function(){
    // Инициализируем scroll-to-top
    try {
      initScrollToTop();
    } catch(e) {
      App.errorBoundary.handleError(e, 'init-scroll-to-top');
    }
    
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