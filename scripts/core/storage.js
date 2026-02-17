// storage.js - Безопасный wrapper для localStorage с namespace, TTL и валидацией
(function(){
  const NS = 'tng:';
  const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 часа
  const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB лимит
  
  // Внутренний класс для хранения данных с метаданными
  class StorageItem {
    constructor(value, ttl = null, options = {}) {
      this.value = value;
      this.created = Date.now();
      this.ttl = ttl;
      this.version = options.version || '1.0';
      this.encrypted = options.encrypted || false;
      this.readonly = options.readonly || false;
    }
    
    isExpired() {
      if (!this.ttl) return false;
      return Date.now() - this.created > this.ttl;
    }
  }
  
  // Основной объект Storage
  window.Storage = {
    _prefix: NS,
    _encryptionKey: null,
    _listeners: new Map(),
    
    // Инициализация с опциями
    init(options = {}) {
      if (options.encryptionKey) {
        this._encryptionKey = options.encryptionKey;
      }
      this._cleanExpired();
      return this;
    },
    
    // Безопасное получение значения
    get(key, fallback = null, options = {}) {
      try {
        const fullKey = this._prefix + key;
        const item = this._getItem(fullKey);
        
        if (!item) return fallback;
        
        // Проверка срока годности
        if (item.isExpired && item.isExpired()) {
          this.remove(key);
          return fallback;
        }
        
        let value = item.value;
        
        // Дешифрование если нужно
        if (item.encrypted && this._encryptionKey) {
          value = this._decrypt(value);
        }
        
        // Валидация схемы если указана
        if (options.schema && !this._validateSchema(value, options.schema)) {
          console.warn(`Schema validation failed for key: ${key}`);
          return fallback;
        }
        
        return value;
      } catch (e) {
        console.error(`Storage.get error for key ${key}:`, e);
        return fallback;
      }
    },
    
    // Безопасное сохранение с TTL и опциями
    set(key, value, options = {}) {
      try {
        // Проверка размера
        if (!this._checkSize(value)) {
          throw new Error('Storage quota would be exceeded');
        }
        
        // Санитизация для защиты от XSS
        if (options.sanitize) {
          value = this._sanitize(value);
        }
        
        // Валидация
        if (options.validate && !options.validate(value)) {
          throw new Error('Validation failed');
        }
        
        // Шифрование если нужно
        let processedValue = value;
        let encrypted = false;
        
        if (options.encrypt && this._encryptionKey) {
          processedValue = this._encrypt(value);
          encrypted = true;
        }
        
        const item = new StorageItem(processedValue, options.ttl, {
          version: options.version,
          encrypted: encrypted,
          readonly: options.readonly || false
        });
        
        const fullKey = this._prefix + key;
        const serialized = this._serialize(item);
        localStorage.setItem(fullKey, serialized);
        
        // Уведомление слушателей
        this._notifyListeners(key, 'set', value);
        
        return true;
      } catch (e) {
        console.error(`Storage.set error for key ${key}:`, e);
        return false;
      }
    },
    
    // Безопасное удаление
    remove(key) {
      try {
        const fullKey = this._prefix + key;
        localStorage.removeItem(fullKey);
        this._notifyListeners(key, 'remove');
        return true;
      } catch (e) {
        console.error(`Storage.remove error for key ${key}:`, e);
        return false;
      }
    },
    
    // Очистка с защитой от удаления важных ключей
    clearAll(protectedKeys = []) {
      try {
        const protectedFullKeys = protectedKeys.map(k => this._prefix + k);
        
        Object.keys(localStorage)
          .filter(k => k.indexOf(this._prefix) === 0 && !protectedFullKeys.includes(k))
          .forEach(k => {
            try {
              localStorage.removeItem(k);
            } catch (e) {
              console.error(`Failed to remove ${k}:`, e);
            }
          });
        
        this._notifyListeners('*', 'clear');
        return true;
      } catch (e) {
        console.error('Storage.clearAll error:', e);
        return false;
      }
    },
    
    // Получение всех ключей с фильтрацией
    keys(filter = null) {
      try {
        return Object.keys(localStorage)
          .filter(k => k.indexOf(this._prefix) === 0)
          .map(k => k.replace(this._prefix, ''))
          .filter(k => !filter || filter.test(k));
      } catch (e) {
        console.error('Storage.keys error:', e);
        return [];
      }
    },
    
    // Получение размера хранилища
    getSize() {
      try {
        let total = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.indexOf(this._prefix) === 0) {
            total += (localStorage[key].length * 2); // Примерно в байтах
          }
        }
        return total;
      } catch (e) {
        console.error('Storage.getSize error:', e);
        return 0;
      }
    },
    
    // Проверка доступности
    isAvailable() {
      try {
        const testKey = this._prefix + '_test_';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    },
    
    // Подписка на изменения
    subscribe(key, callback) {
      if (!this._listeners.has(key)) {
        this._listeners.set(key, new Set());
      }
      this._listeners.get(key).add(callback);
      
      return () => this.unsubscribe(key, callback);
    },
    
    unsubscribe(key, callback) {
      if (this._listeners.has(key)) {
        this._listeners.get(key).delete(callback);
      }
    },
    
    // Массовое получение
    getMany(keys, fallback = {}) {
      const result = {};
      keys.forEach(key => {
        result[key] = this.get(key, fallback[key]);
      });
      return result;
    },
    
    // Массовое сохранение
    setMany(items, options = {}) {
      const results = {};
      Object.entries(items).forEach(([key, value]) => {
        results[key] = this.set(key, value, options);
      });
      return results;
    },
    
    // Внутренние методы
    _getItem(fullKey) {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      return this._deserialize(raw);
    },
    
    _serialize(item) {
      return JSON.stringify({
        v: item.value,
        c: item.created,
        t: item.ttl,
        ver: item.version,
        e: item.encrypted,
        r: item.readonly
      });
    },
    
    _deserialize(raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          value: parsed.v,
          created: parsed.c,
          ttl: parsed.t,
          version: parsed.ver,
          encrypted: parsed.e || false,
          readonly: parsed.r || false,
          isExpired: function() {
            if (!this.ttl) return false;
            return Date.now() - this.created > this.ttl;
          }
        };
      } catch {
        // Поддержка старого формата
        return {
          value: raw,
          created: Date.now(),
          ttl: null,
          version: '1.0',
          encrypted: false,
          readonly: false,
          isExpired: () => false
        };
      }
    },
    
    _cleanExpired() {
      try {
        Object.keys(localStorage)
          .filter(k => k.indexOf(this._prefix) === 0)
          .forEach(k => {
            try {
              const item = this._getItem(k);
              if (item && item.isExpired && item.isExpired()) {
                localStorage.removeItem(k);
              }
            } catch (e) {
              console.error(`Error cleaning ${k}:`, e);
            }
          });
      } catch (e) {
        console.error('Storage._cleanExpired error:', e);
      }
    },
    
    _checkSize(value) {
      try {
        const currentSize = this.getSize();
        const valueSize = JSON.stringify(value).length * 2;
        return (currentSize + valueSize) < MAX_STORAGE_SIZE;
      } catch {
        return false;
      }
    },
    
    _sanitize(value) {
      if (typeof value === 'string') {
        // Базовая санитизация от XSS
        return value
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }
      if (Array.isArray(value)) {
        return value.map(v => this._sanitize(v));
      }
      if (typeof value === 'object' && value !== null) {
        const sanitized = {};
        for (let [k, v] of Object.entries(value)) {
          sanitized[this._sanitize(k)] = this._sanitize(v);
        }
        return sanitized;
      }
      return value;
    },
    
    _validateSchema(value, schema) {
      try {
        for (let [key, type] of Object.entries(schema)) {
          if (typeof value[key] !== type) {
            return false;
          }
        }
        return true;
      } catch {
        return false;
      }
    },
    
    _encrypt(data) {
      if (!this._encryptionKey) return data;
      // Простое XOR шифрование для демонстрации
      // В продакшене использовать нормальное шифрование
      const str = JSON.stringify(data);
      let result = '';
      for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ this._encryptionKey.charCodeAt(i % this._encryptionKey.length));
      }
      return btoa(result);
    },
    
    _decrypt(data) {
      if (!this._encryptionKey) return data;
      try {
        const str = atob(data);
        let result = '';
        for (let i = 0; i < str.length; i++) {
          result += String.fromCharCode(str.charCodeAt(i) ^ this._encryptionKey.charCodeAt(i % this._encryptionKey.length));
        }
        return JSON.parse(result);
      } catch {
        return data;
      }
    },
    
    _notifyListeners(key, action, value = null) {
      // Уведомляем специфичных слушателей
      if (this._listeners.has(key)) {
        this._listeners.get(key).forEach(cb => {
          try {
            cb({ key, action, value });
          } catch (e) {
            console.error('Listener error:', e);
          }
        });
      }
      
      // Уведомляем глобальных слушателей
      if (this._listeners.has('*')) {
        this._listeners.get('*').forEach(cb => {
          try {
            cb({ key, action, value });
          } catch (e) {
            console.error('Global listener error:', e);
          }
        });
      }
    }
  };
  
  // Автоматическая инициализация
  window.Storage.init();
})();

// Совместимый экспорт для модульной системы
export const storage = {
  // Основные методы
  get: (key, defaultValue = null, options = {}) => {
    return window.Storage.get(key, defaultValue, options);
  },
  
  set: (key, value, options = {}) => {
    return window.Storage.set(key, value, options);
  },
  
  remove: (key) => {
    return window.Storage.remove(key);
  },
  
  clear: (protectedKeys = []) => {
    return window.Storage.clearAll(protectedKeys);
  },
  
  // Дополнительные методы
  keys: (filter) => window.Storage.keys(filter),
  getSize: () => window.Storage.getSize(),
  isAvailable: () => window.Storage.isAvailable(),
  subscribe: (key, callback) => window.Storage.subscribe(key, callback),
  getMany: (keys, fallback) => window.Storage.getMany(keys, fallback),
  setMany: (items, options) => window.Storage.setMany(items, options),
  
  // Конфигурация
  init: (options) => window.Storage.init(options)
};

// Примеры использования:
/*
// Инициализация с ключом шифрования
storage.init({ encryptionKey: 'my-secret-key' });

// Сохранение с TTL (1 час)
storage.set('user', { name: 'John' }, { ttl: 60 * 60 * 1000 });

// Сохранение с шифрованием
storage.set('token', 'secret-token', { encrypt: true });

// Подписка на изменения
const unsubscribe = storage.subscribe('user', (event) => {
  console.log('User changed:', event);
});

// Валидация схемы
const user = storage.get('user', null, {
  schema: { name: 'string', age: 'number' }
});

// Защита от удаления важных ключей
storage.clear(['user', 'settings']); // Не удалит user и settings

// Проверка доступности
if (!storage.isAvailable()) {
  console.warn('Storage is not available');
}

// Получение информации о размере
console.log(`Storage size: ${storage.getSize()} bytes`);
*/