// tg-init.js - Complete Telegram WebApp initialization with Authorization
(function(){
    'use strict';
    
    window.TelegramApp = {
        isTelegram: false,
        webApp: null,
        user: null,
        initData: null,
        initDataUnsafe: null,
        themeParams: null,
        version: '1.0.0',
        auth: {
            isAuthenticated: false,
            token: null,
            expiresAt: null,
            sessionId: null
        }
    };
    
    // Конфигурация авторизации
    const AUTH_CONFIG = {
        TOKEN_KEY: 'tg_auth_token',
        EXPIRES_KEY: 'tg_auth_expires',
        SESSION_KEY: 'tg_session_id',
        AUTH_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 дней
        REFRESH_THRESHOLD: 24 * 60 * 60 * 1000, // Обновлять за 24 часа до истечения
        API_ENDPOINT: 'https://your-api.com/auth/telegram' // Замените на ваш endpoint
    };
    
    function initTelegramWebApp() {
        try {
            if (typeof Telegram === 'undefined' || !window.Telegram.WebApp) {
                console.warn('Telegram WebApp API not available - running in browser mode');
                handleBrowserMode();
                return;
            }
            
            const tg = window.Telegram.WebApp;
            TelegramApp.webApp = tg;
            TelegramApp.isTelegram = true;
            
            initAppData(tg);
            setupAppearance(tg);
            setupBehavior(tg);
            setupTheme(tg);
            setupBackButton(tg);
            
            // Инициализация авторизации
            initAuthorization();
            
            tg.ready();
            tg.expand();
            
            console.log('✅ Telegram WebApp initialized successfully');
            dispatchTelegramReadyEvent();
            
        } catch (error) {
            console.error('❌ Error initializing Telegram WebApp:', error);
            handleBrowserMode();
        }
    }
    
    function initAppData(tg) {
        TelegramApp.user = tg.initDataUnsafe.user || null;
        TelegramApp.initData = tg.initData || '';
        TelegramApp.initDataUnsafe = tg.initDataUnsafe || {};
        TelegramApp.startParam = tg.initDataUnsafe.start_param || '';
        TelegramApp.chatType = tg.initDataUnsafe.chat_type || '';
        TelegramApp.chatInstance = tg.initDataUnsafe.chat_instance || '';
        TelegramApp.themeParams = tg.themeParams || {};
        TelegramApp.colorScheme = tg.colorScheme || 'light';
        TelegramApp.platform = tg.platform || 'unknown';
        TelegramApp.version = tg.version || 'unknown';
    }
    
    // ==================== АВТОРИЗАЦИЯ ====================
    
    async function initAuthorization() {
        try {
            // Проверяем сохраненную сессию
            const savedAuth = loadSavedAuth();
            
            if (savedAuth && !isTokenExpired(savedAuth.expiresAt)) {
                // Есть валидная сохраненная сессия
                TelegramApp.auth = savedAuth;
                TelegramApp.auth.isAuthenticated = true;
                console.log('✅ Restored existing session');
                
                // Проверяем, нужно ли обновить токен
                if (shouldRefreshToken(savedAuth.expiresAt)) {
                    refreshToken().catch(console.warn);
                }
            } else if (TelegramApp.isTelegram && TelegramApp.initData) {
                // Нет сессии, но есть initData - пробуем авторизоваться
                await authenticateWithTelegram();
            } else {
                console.warn('No authentication data available');
                handleUnauthenticated();
            }
            
            // Устанавливаем обработчики
            setupAuthHandlers();
            
        } catch (error) {
            console.error('❌ Authorization initialization failed:', error);
            handleUnauthenticated();
        }
    }
    
    async function authenticateWithTelegram() {
        try {
            console.log('🔐 Authenticating with Telegram...');
            
            // Получаем данные для авторизации
            const authData = prepareAuthData();
            
            // Отправляем запрос на сервер
            const response = await sendAuthRequest(authData);
            
            if (response.success && response.token) {
                // Сохраняем сессию
                saveAuthSession(response);
                TelegramApp.auth.isAuthenticated = true;
                
                console.log('✅ Authentication successful');
                
                // Обновляем данные пользователя если нужно
                if (response.user) {
                    TelegramApp.user = { ...TelegramApp.user, ...response.user };
                }
                
                dispatchAuthEvent('authenticated', response);
                return true;
            } else {
                throw new Error(response.error || 'Authentication failed');
            }
            
        } catch (error) {
            console.error('❌ Authentication failed:', error);
            handleAuthenticationError(error);
            return false;
        }
    }
    
    function prepareAuthData() {
        // Создаем объект с данными для авторизации
        const authData = {
            initData: TelegramApp.initData,
            user: TelegramApp.user,
            timestamp: Date.now(),
            platform: TelegramApp.platform,
            version: TelegramApp.version
        };
        
        // Добавляем хеш для безопасности
        authData.hash = generateAuthHash(authData);
        
        return authData;
    }
    
    function generateAuthHash(data) {
        // Простая хеш-функция для демонстрации
        // В продакшене использовать нормальное хеширование
        const str = JSON.stringify(data) + 'your-secret-salt';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    async function sendAuthRequest(authData) {
        // Имитация запроса к серверу
        // В реальном приложении здесь должен быть fetch к вашему API
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Генерируем тестовый ответ
                resolve({
                    success: true,
                    token: generateToken(),
                    expiresIn: AUTH_CONFIG.AUTH_DURATION,
                    sessionId: generateSessionId(),
                    user: {
                        id: authData.user?.id,
                        first_name: authData.user?.first_name,
                        last_name: authData.user?.last_name,
                        username: authData.user?.username,
                        auth_date: Date.now()
                    }
                });
            }, 500);
        });
        
        /* Реальный запрос:
        try {
            const response = await fetch(AUTH_CONFIG.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('Auth request failed:', error);
            throw error;
        }
        */
    }
    
    function saveAuthSession(response) {
        const expiresAt = Date.now() + (response.expiresIn || AUTH_CONFIG.AUTH_DURATION);
        const sessionId = response.sessionId || generateSessionId();
        
        TelegramApp.auth = {
            isAuthenticated: true,
            token: response.token,
            expiresAt: expiresAt,
            sessionId: sessionId,
            refreshToken: response.refreshToken
        };
        
        // Сохраняем в localStorage
        try {
            localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token);
            localStorage.setItem(AUTH_CONFIG.EXPIRES_KEY, expiresAt.toString());
            localStorage.setItem(AUTH_CONFIG.SESSION_KEY, sessionId);
        } catch (e) {
            console.warn('Failed to save auth to localStorage:', e);
        }
    }
    
    function loadSavedAuth() {
        try {
            const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
            const expiresAt = localStorage.getItem(AUTH_CONFIG.EXPIRES_KEY);
            const sessionId = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
            
            if (token && expiresAt && sessionId) {
                return {
                    isAuthenticated: true,
                    token: token,
                    expiresAt: parseInt(expiresAt),
                    sessionId: sessionId
                };
            }
        } catch (e) {
            console.warn('Failed to load auth from localStorage:', e);
        }
        
        return null;
    }
    
    function isTokenExpired(expiresAt) {
        return Date.now() > expiresAt;
    }
    
    function shouldRefreshToken(expiresAt) {
        return (expiresAt - Date.now()) < AUTH_CONFIG.REFRESH_THRESHOLD;
    }
    
    async function refreshToken() {
        if (!TelegramApp.auth.refreshToken) {
            return false;
        }
        
        try {
            console.log('🔄 Refreshing token...');
            
            // Запрос на обновление токена
            const response = await fetch(`${AUTH_CONFIG.API_ENDPOINT}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TelegramApp.auth.token}`
                },
                body: JSON.stringify({
                    refreshToken: TelegramApp.auth.refreshToken,
                    sessionId: TelegramApp.auth.sessionId
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                saveAuthSession(data);
                console.log('✅ Token refreshed successfully');
                return true;
            }
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
        }
        
        return false;
    }
    
    function setupAuthHandlers() {
        // Обработка закрытия приложения
        window.addEventListener('beforeunload', () => {
            if (TelegramApp.auth.isAuthenticated) {
                // Можно отправить сигнал о завершении сессии
                console.log('Session ended');
            }
        });
    }
    
    function handleAuthenticationError(error) {
        TelegramApp.auth.isAuthenticated = false;
        dispatchAuthEvent('auth_error', error);
    }
    
    function handleUnauthenticated() {
        TelegramApp.auth.isAuthenticated = false;
        dispatchAuthEvent('unauthenticated');
    }
    
    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
    
    function generateToken() {
        return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
    
    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }
    
    function dispatchAuthEvent(type, data = null) {
        const event = new CustomEvent('telegramAuth', { 
            detail: { type, data, auth: TelegramApp.auth } 
        });
        document.dispatchEvent(event);
    }
    
    // ==================== ОСТАЛЬНЫЕ ФУНКЦИИ (без изменений) ====================
    
    function setupAppearance(tg) {
        tg.setHeaderColor(TelegramApp.themeParams.bg_color || '#A9BA9D');
        tg.backgroundColor = TelegramApp.themeParams.bg_color || '#f9faf9';
        const primaryColor = TelegramApp.themeParams.button_color || '#A9BA9D';
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--primary-dark', darkenColor(primaryColor, 20));
    }
    
    function setupBehavior(tg) {
        tg.enableClosingConfirmation();
        setupBackButtonVisibility();
    }
    
    function setupTheme(tg) {
        const isDark = tg.colorScheme === 'dark';
        if (isDark) {
            document.documentElement.classList.add('theme-dark');
            document.documentElement.classList.remove('theme-light');
        } else {
            document.documentElement.classList.add('theme-light');
            document.documentElement.classList.remove('theme-dark');
        }
        updateCssVariables(tg.themeParams);
        
        tg.onEvent('themeChanged', function() {
            const newIsDark = tg.colorScheme === 'dark';
            if (newIsDark !== isDark) {
                window.location.reload();
            }
        });
    }
    
    function setupBackButton(tg) {
        if (tg.isVersionAtLeast('6.1')) {
            tg.BackButton.onClick(handleBackButtonPress);
            tg.BackButton.show();
        }
    }
    
    function setupBackButtonVisibility() {
        const canGoBack = window.history.length > 1;
        if (TelegramApp.webApp && TelegramApp.webApp.BackButton) {
            if (canGoBack) {
                TelegramApp.webApp.BackButton.show();
            } else {
                TelegramApp.webApp.BackButton.hide();
            }
        }
    }
    
    function handleBackButtonPress() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            TelegramApp.webApp.close();
        }
    }
    
    function handleBrowserMode() {
        console.log('🌐 Running in browser mode');
        
        // Тестовый пользователь
        TelegramApp.user = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru',
            is_premium: true,
            auth_date: Date.now()
        };
        
        TelegramApp.themeParams = {
            bg_color: '#f9faf9',
            text_color: '#333333',
            button_color: '#A9BA9D',
            button_text_color: '#ffffff'
        };
        
        TelegramApp.colorScheme = 'light';
        TelegramApp.initData = 'test_init_data';
        TelegramApp.initDataUnsafe = { user: TelegramApp.user };
        
        // Тестовая авторизация
        setTimeout(() => {
            authenticateWithTelegram().then(() => {
                dispatchTelegramReadyEvent();
            });
        }, 100);
    }
    
    function updateCssVariables(themeParams) {
        const root = document.documentElement;
        if (themeParams.bg_color) root.style.setProperty('--bg-color', themeParams.bg_color);
        if (themeParams.text_color) root.style.setProperty('--text-color', themeParams.text_color);
        if (themeParams.button_color) {
            root.style.setProperty('--primary-color', themeParams.button_color);
            root.style.setProperty('--primary-dark', darkenColor(themeParams.button_color, 20));
        }
        if (themeParams.button_text_color) root.style.setProperty('--button-text-color', themeParams.button_text_color);
        if (themeParams.hint_color) root.style.setProperty('--text-light', themeParams.hint_color);
        if (themeParams.link_color) root.style.setProperty('--link-color', themeParams.link_color);
    }
    
    function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
    }
    
    function dispatchTelegramReadyEvent() {
        const event = new CustomEvent('telegramReady', { detail: TelegramApp });
        document.dispatchEvent(event);
    }
    
    // ==================== ПУБЛИЧНЫЕ МЕТОДЫ ====================
    
    TelegramApp.sendData = function(data) {
        if (TelegramApp.isTelegram && TelegramApp.webApp) {
            TelegramApp.webApp.sendData(JSON.stringify(data));
            return true;
        }
        console.log('📤 Data sent (simulated):', data);
        return false;
    };
    
    TelegramApp.showAlert = function(message) {
        if (TelegramApp.isTelegram && TelegramApp.webApp) {
            TelegramApp.webApp.showAlert(message);
            return true;
        }
        alert(message);
        return false;
    };
    
    TelegramApp.showConfirm = function(message, callback) {
        if (TelegramApp.isTelegram && TelegramApp.webApp) {
            TelegramApp.webApp.showConfirm(message, callback);
            return true;
        }
        const result = confirm(message);
        if (callback) callback(result);
        return false;
    };
    
    TelegramApp.close = function() {
        if (TelegramApp.isTelegram && TelegramApp.webApp) {
            TelegramApp.webApp.close();
            return true;
        }
        console.log('WebApp close simulated');
        return false;
    };
    
    // Новые методы для работы с авторизацией
    
    TelegramApp.getAuthToken = function() {
        return TelegramApp.auth.token;
    };
    
    TelegramApp.isAuthenticated = function() {
        return TelegramApp.auth.isAuthenticated && !isTokenExpired(TelegramApp.auth.expiresAt);
    };
    
    TelegramApp.getAuthHeaders = function() {
        if (TelegramApp.isAuthenticated()) {
            return {
                'Authorization': `Bearer ${TelegramApp.auth.token}`,
                'X-Session-ID': TelegramApp.auth.sessionId
            };
        }
        return {};
    };
    
    TelegramApp.logout = async function() {
        try {
            // Отправляем запрос на сервер для инвалидации токена
            if (TelegramApp.auth.token) {
                await fetch(`${AUTH_CONFIG.API_ENDPOINT}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TelegramApp.auth.token}`
                    }
                }).catch(console.warn);
            }
        } finally {
            // Очищаем локальные данные
            TelegramApp.auth = {
                isAuthenticated: false,
                token: null,
                expiresAt: null,
                sessionId: null
            };
            
            try {
                localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
                localStorage.removeItem(AUTH_CONFIG.EXPIRES_KEY);
                localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
            } catch (e) {
                console.warn('Failed to clear localStorage:', e);
            }
            
            dispatchAuthEvent('logout');
            console.log('👋 Logged out successfully');
        }
    };
    
    TelegramApp.refreshAuth = async function() {
        return await refreshToken();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegramWebApp);
    } else {
        initTelegramWebApp();
    }
})();