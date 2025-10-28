// tg-init.js - Complete Telegram WebApp initialization
(function(){
    'use strict';
    
    window.TelegramApp = {
        isTelegram: false,
        webApp: null,
        user: null,
        initData: null,
        themeParams: null,
        version: '1.0.0'
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
        TelegramApp.startParam = tg.initDataUnsafe.start_param || '';
        TelegramApp.chatType = tg.initDataUnsafe.chat_type || '';
        TelegramApp.chatInstance = tg.initDataUnsafe.chat_instance || '';
        TelegramApp.themeParams = tg.themeParams || {};
        TelegramApp.colorScheme = tg.colorScheme || 'light';
        TelegramApp.platform = tg.platform || 'unknown';
        TelegramApp.version = tg.version || 'unknown';
    }
    
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
        TelegramApp.user = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru',
            is_premium: true
        };
        TelegramApp.themeParams = {
            bg_color: '#f9faf9',
            text_color: '#333333',
            button_color: '#A9BA9D',
            button_text_color: '#ffffff'
        };
        TelegramApp.colorScheme = 'light';
        
        setTimeout(() => {
            dispatchTelegramReadyEvent();
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
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTelegramWebApp);
    } else {
        initTelegramWebApp();
    }
})();