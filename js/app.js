/**
 * Medical Orientation Platform - Main Application
 * Extracted from inline script for maintainability
 */

// ===== PASSWORD HASHING (SHA-256 via SubtleCrypto) =====
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '__mo_salt_2024__');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const DEBUG = (function () {
    try { return localStorage.getItem('debug') === '1'; } catch { return false; }
})();
try {
    if (!DEBUG && typeof console !== 'undefined' && console && typeof console.log === 'function') {
        console.log = function () { };
    }
} catch {
    // ignore
}

// ===== NON-BLOCKING TOAST NOTIFICATION =====
function showToast(msg, duration) {
    duration = duration || 4000;
    var t = document.getElementById('app-toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'app-toast';
        t.style.cssText = 'position:fixed;top:40px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(10,10,20,0.95);color:#fff;padding:14px 28px;border-radius:16px;font-size:14px;z-index:99999;pointer-events:none;opacity:0;transition:opacity 0.4s,transform 0.4s cubic-bezier(0.34,1.56,0.64,1);border:1px solid rgba(108,92,231,0.3);backdrop-filter:blur(16px);max-width:90vw;text-align:center;font-weight:500;box-shadow:0 10px 40px rgba(0,0,0,0.4);';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(t._timer);
    t._timer = setTimeout(function() {
        t.style.opacity = '0';
        t.style.transform = 'translateX(-50%) translateY(-20px)';
    }, duration);
}

console.log('=== SCRIPT START ===');

// Глобальный обработчик ошибок
window.onerror = function(msg, url, line, col, error) {
    console.error('GLOBAL ERROR:', msg, 'at line', line, error);
    return false;
};

console.log('1. Starting function definitions...');

// ============================================================
// LANDING PAGE И МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ
// ============================================================

function openAuthModal(tab = 'login') {
    const authContainer = document.getElementById('auth-container');
    
    // Показываем модальное окно поверх landing page (не скрываем landing!)
    if (authContainer) {
        authContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Переключаем на нужную вкладку
    setTimeout(() => switchTab(tab), 50);
}

function closeAuthModal() {
    const authContainer = document.getElementById('auth-container');
    
    if (authContainer) {
        authContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function scrollToFeatures() {
    const features = document.getElementById('landing-features');
    if (features) {
        features.scrollIntoView({ behavior: 'smooth' });
    }
}

// Красивый выпадающий список "Как это работает"
function toggleHowItWorks(event) {
    event.stopPropagation();
    const dropdown = event.target.closest('.how-it-works-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Закрытие списка при клике вне
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.how-it-works-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Скролл анимации для landing page
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Эффект навигации при скролле
function initNavScroll() {
    const nav = document.getElementById('landing-nav');
    if (!nav) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ============================================================
// ОСНОВНОЙ КОД
// ============================================================

// Инициализация хранилища
const USERS_KEY = 'medical_users_v5';
const CURRENT_USER_KEY = 'current_medical_user_v5';
const AVATARS_KEY = 'medical_avatars_v1';

// Проверка авторизации при загрузке
function checkAuthOnLoad() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const authContainer = document.getElementById('auth-container');
    const aiTutor = document.querySelector('.ai-tutor-btn');
    
    console.log('Auth check:', currentUser ? 'logged in' : 'not logged in');
    
    if (currentUser) {
        // Пользователь залогинен - показываем основной контент
        if (landingPage) {
            landingPage.classList.add('hidden');
            landingPage.style.setProperty('display', 'none', 'important');
        }
        if (mainContent) {
            mainContent.classList.add('visible'); // класс visible!
            mainContent.style.setProperty('display', 'flex', 'important');
        }
        if (aiTutor) aiTutor.style.display = 'flex';
        if (authContainer) {
            authContainer.classList.remove('active');
            authContainer.style.setProperty('display', 'none', 'important');
        }
        
        // Показываем секцию home
        setTimeout(() => {
            if (typeof showSection === 'function') {
                showSection('home');
            }
        }, 0);
    } else {
        // Пользователь не залогинен - показываем landing page
        if (landingPage) {
            landingPage.classList.remove('hidden');
            landingPage.style.setProperty('display', 'flex', 'important');
        }
        if (mainContent) {
            mainContent.classList.remove('visible');
            mainContent.style.setProperty('display', 'none', 'important');
        }
        if (aiTutor) aiTutor.style.display = 'none';
        if (authContainer) authContainer.classList.remove('active');
        
        // Инициализируем анимации landing page
        setTimeout(() => {
            if (typeof initScrollAnimations === 'function') initScrollAnimations();
            if (typeof initNavScroll === 'function') initNavScroll();
        }, 100);
    }
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', checkAuthOnLoad);

// ОТЛАДКА: Создаем тестового пользователя для входа
async function createTestUser() {
    const hashedPw = await hashPassword("123456");
    const testUser = {
        id: 1,
        name: "Тест Пользователь",
        email: "test@test.com",
        phone: "+7 900 000 0000", 
        age: 18,
        password: hashedPw,
        registrationDate: new Date().toISOString().split('T')[0],
        testsCompleted: 0,
        totalScore: 0,
        level: 1,
        achievements: [],
        testHistory: []
    };
    
    let users = [];
    if (localStorage.getItem(USERS_KEY)) {
        users = JSON.parse(localStorage.getItem(USERS_KEY));
    }
    
    // Проверим, есть ли уже тестовый пользователь
    if (!users.find(u => u.email === "test@test.com")) {
        users.push(testUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log('Test user created: test@test.com / 123456');
    }
}

function isLocalhost() {
    try {
        const h = String(location && location.hostname ? location.hostname : '').toLowerCase();
        return h === 'localhost' || h === '127.0.0.1' || h === '::1';
    } catch {
        return false;
    }
}

// Для удобства на локалке создаём демо-пользователя, если хранилище пустое.
try {
    const hasUsers = !!localStorage.getItem(USERS_KEY);
    if (DEBUG || (isLocalhost() && !hasUsers)) createTestUser();
} catch {
    // ignore
}

let verificationCode = '';
let currentTestType = '';
let currentQuestionIndex = 0;
let testAnswers = {};
let markedQuestions = {};
let userTestResults = {};
let currentTestQuestions = []; // Массив для текущих перемешанных вопросов

// Переключение между вкладками
function switchTab(tab) {
    console.log('switchTab called with:', tab);
    document.querySelectorAll('.auth-page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.querySelectorAll('.auth-tab').forEach(tabElement => {
        tabElement.classList.remove('active');
    });
    
    if (tab === 'login') {
        document.getElementById('login-page').classList.add('active');
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('register-page').classList.add('active');
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
    } else if (tab === 'verify') {
        document.getElementById('verification-page').classList.add('active');
    }
}

// Функции для работы с кодом подтверждения (упрощенные)
function moveToNext(current, nextIndex) {
    if (current.value.length >= current.maxLength) {
        const inputs = document.querySelectorAll('.code-inputs input');
        if (nextIndex >= 0 && nextIndex < inputs.length) {
            inputs[nextIndex].focus();
        }
    }
}

function moveOnBackspace(input, prevIndex) {
    if (input.value.length === 0 && event.key === 'Backspace') {
        const inputs = document.querySelectorAll('.code-inputs input');
        if (prevIndex >= 0) {
            inputs[prevIndex].focus();
        }
    }
}

// Регистрация - УПРОЩЕННАЯ БЕЗ ВЕРИФИКАЦИИ
async function handleRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase(); // Приводим к нижнему регистру
    const phone = document.getElementById('reg-phone').value.trim();
    const age = document.getElementById('reg-age').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Валидация
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    if (password.length < 6) {
        alert('Пароль должен содержать минимум 6 символов!');
        return;
    }
    
    if (age < 14 || age > 99) {
        alert('Возраст должен быть от 14 до 99 лет!');
        return;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный email!');
        return;
    }
    
    // Проверка номера телефона
    const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите корректный номер телефона!');
        return;
    }
    
    // Проверка существующего пользователя с таким email
    try {
        if (localStorage.getItem(USERS_KEY)) {
            const users = JSON.parse(localStorage.getItem(USERS_KEY));
            const existingUser = users.find(user => user.email.toLowerCase() === email);
            if (existingUser) {
                alert('Пользователь с таким email уже зарегистрирован!');
                return;
            }
        }
    } catch (e) {
        alert('Хранилище браузера (localStorage) недоступно. Откройте сайт в обычном браузере (Chrome/Edge) и попробуйте снова.');
        return;
    }
    
    // Hash password before storing
    const hashedPw = await hashPassword(password);
    
    // Сразу завершаем регистрацию без верификации
    window.tempUserData = {
        username,
        email,
        phone,
        age: parseInt(age),
        password: hashedPw
    };
    
    completeRegistration();
}

// Завершение регистрации (упрощенная версия без верификации)
function completeRegistration() {
    const userData = window.tempUserData;

    // Проверка доступности localStorage
    try {
        localStorage.setItem('__mo_ls_probe', '1');
        localStorage.removeItem('__mo_ls_probe');
    } catch {
        alert('Хранилище браузера (localStorage) недоступно. Откройте сайт в обычном браузере (Chrome/Edge) и попробуйте снова.');
        return;
    }
    
    // Инициализируем хранилище
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    
    // Создаем нового пользователя
    const newUser = {
        id: Date.now(),
        name: userData.username,
        email: userData.email,
        phone: userData.phone,
        age: userData.age,
        password: userData.password,
        registrationDate: new Date().toISOString().split('T')[0],
        testsCompleted: 0,
        totalScore: 0,
        level: 1,
        achievements: [],
        testHistory: []
    };

    // Добавляем пользователя в список
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Устанавливаем текущего пользователя
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    // Переходим к основному приложению (без блокирующего alert!)
    showMainContent(newUser);

    // Показываем неблокирующее уведомление вместо alert
    showToast('🎉 Регистрация успешна! Добро пожаловать!');
    
    // Очищаем временные данные
    window.tempUserData = null;
}

// Получение текущего пользователя
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error('Ошибка при загрузке данных пользователя:', e);
        return null;
    }
}

// Обновление интерфейса после входа/регистрации
function updateUserInterface() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Обновляем данные профиля
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email-text').textContent = currentUser.email;
    document.getElementById('profile-phone-text').textContent = currentUser.phone;
    document.getElementById('profile-age-text').textContent = `${currentUser.age} лет`;
    document.getElementById('profile-reg-date').textContent = new Date(currentUser.registrationDate).toLocaleDateString();
    
    // Обновляем статистику
    updateUserStats(currentUser);
}

// Повторная отправка кода (отключена)
function resendCode() {
    alert('Верификация отключена для упрощения регистрации');
}

// Вход
async function handleLogin(event) {
    console.log('handleLogin called');
    event.preventDefault();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    console.log('Attempting login with email:', email);
    
    let usersJson = '';
    try {
        usersJson = localStorage.getItem(USERS_KEY) || '';
    } catch {
        alert('Хранилище браузера (localStorage) недоступно. Откройте сайт в обычном браузере (Chrome/Edge) и попробуйте снова.');
        return;
    }

    if (!usersJson) {
        console.log('No users found in localStorage');
        alert('Пользователь не найден! Зарегистрируйтесь сначала.');
        return;
    }

    let users = [];
    try {
        users = JSON.parse(usersJson);
    } catch {
        users = [];
    }
    
    console.log('Looking for user. Total users:', users.length);
    
    // Hash the input password for comparison
    const hashedPw = await hashPassword(password);
    
    // Поиск пользователя - проверяем email и хешированный пароль
    const user = users.find(u => {
        const emailMatch = u.email && u.email.toLowerCase().trim() === email;
        const passMatch = u.password === hashedPw;
        console.log('Checking user:', u.email, 'email match:', emailMatch, 'pass match:', passMatch);
        return emailMatch && passMatch;
    });
    
    if (user) {
        console.log('User found:', user.name);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        
        // Очищаем форму
        emailInput.value = '';
        passwordInput.value = '';
        
        showMainContent(user);
    } else {
        console.log('User not found or wrong credentials');
        alert('Неверный email или пароль! Проверьте данные и попробуйте снова.');
    }
}

// Показать основной контент
function showMainContent(user) {
    console.log('showMainContent called with user:', user);
    
    // Скрываем landing page и auth modal
    const landingPage = document.getElementById('landing-page');
    const authContainer = document.getElementById('auth-container');
    const mainContent = document.getElementById('main-content');
    const aiTutor = document.querySelector('.ai-tutor-btn');
    
    if (landingPage) {
        landingPage.style.setProperty('display', 'none', 'important');
        landingPage.classList.add('hidden');
    }
    if (authContainer) {
        authContainer.classList.remove('active');
        authContainer.style.setProperty('display', 'none', 'important');
    }
    if (mainContent) {
        mainContent.style.setProperty('display', 'flex', 'important');
        mainContent.classList.add('visible');
        // Force reflow — fixes blank screen on mobile after registration
        void mainContent.offsetHeight;
    }
    if (aiTutor) {
        aiTutor.style.setProperty('display', 'flex', 'important');
    }
    
    document.body.style.overflow = '';
    document.body.style.background = '';
    
    // Обновляем сайдбар с данными пользователя
    const sidebarUsername = document.getElementById('sidebar-username');
    if (sidebarUsername && user) {
        sidebarUsername.textContent = user.name || 'Пользователь';
    }
    
    console.log('Main content should be visible now');
    
    // Показываем секцию home по умолчанию
    showSection('home');

    // Force extra reflow for mobile browsers (fixes blank screen after registration)
    requestAnimationFrame(() => {
        if (mainContent) {
            mainContent.style.setProperty('display', 'flex', 'important');
            mainContent.style.setProperty('flex-direction', 'column', 'important');
            mainContent.style.setProperty('min-height', '100vh', 'important');
            void mainContent.offsetHeight;
        }
        // Ensure app-content is visible
        const appContent = document.querySelector('.app-content');
        if (appContent) {
            appContent.style.setProperty('display', 'block', 'important');
            if (window.innerWidth <= 768) {
                appContent.style.setProperty('width', '100%', 'important');
                appContent.style.setProperty('margin-left', '0', 'important');
            }
        }
        window.scrollTo(0, 0);
        showSection('home');
    });

    // Third pass — nuclear option for stubborn mobile browsers
    setTimeout(() => {
        if (mainContent) {
            mainContent.style.setProperty('display', 'flex', 'important');
            void mainContent.offsetHeight;
        }
        const home = document.getElementById('home');
        if (home && getComputedStyle(home).display === 'none') {
            console.warn('Home section still hidden — forcing visibility');
            home.style.setProperty('display', 'block', 'important');
            home.style.setProperty('visibility', 'visible', 'important');
            home.style.setProperty('opacity', '1', 'important');
            home.classList.add('visible');
        }
    }, 300);
    
    // Инициализация тестов
    try {
        initializeTests();
        console.log('Tests initialized successfully');
    } catch (e) {
        console.error('Error initializing tests:', e);
    }
    
    // Загрузка аватара пользователя
    loadUserAvatar(user.id);
    
    // Загрузка профиля пользователя
    loadUserProfile();

    // Обновляем «реальную» статистику главного экрана
    updatePlatformStats();
    
    // Показываем кнопку AI тьютора после входа
    if (window.aiTutor && typeof window.aiTutor.updateTutorVisibility === 'function') {
        window.aiTutor.updateTutorVisibility();
    }
}

function updatePlatformStats() {
    const totalUsersEl = document.getElementById('total-users-count');
    const totalUsersGlobalEl = document.getElementById('total-users-global-count');
    const totalTestsEl = document.getElementById('total-tests-count');
    const totalTypesEl = document.getElementById('total-test-types-count');
    const totalQuestionsEl = document.getElementById('total-questions-count');

    if (!totalUsersEl && !totalUsersGlobalEl && !totalTestsEl && !totalTypesEl && !totalQuestionsEl) return;

    // Глобальный счётчик (все устройства) — требует Cloudflare Pages Functions + KV.
    try {
        if (totalUsersGlobalEl && !window.__globalUsersCountFetchInFlight) {
            const VISITOR_ID_KEY = 'mo_visitor_id_v1';
            let visitorId = '';
            try {
                visitorId = String(localStorage.getItem(VISITOR_ID_KEY) || '');
            } catch {
                visitorId = '';
            }

            if (!visitorId) {
                if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                    visitorId = window.crypto.randomUUID();
                } else {
                    visitorId = 'v_' + Math.random().toString(16).slice(2) + Date.now().toString(16);
                }
                try {
                    localStorage.setItem(VISITOR_ID_KEY, visitorId);
                } catch {
                    // ignore
                }
            }

            totalUsersGlobalEl.textContent = '…';
            window.__globalUsersCountFetchInFlight = true;

            // Только на продакшене (Cloudflare Pages) вызываем API
            const isProduction = window.location.hostname !== 'localhost' && 
                                window.location.hostname !== '127.0.0.1' &&
                                !window.location.hostname.includes('192.168.');
            
            if (!isProduction) {
                // На локальном сервере показываем заглушку
                totalUsersGlobalEl.textContent = '—';
                window.__globalUsersCountFetchInFlight = false;
                return;
            }

            fetch(`/api/visitors?id=${encodeURIComponent(visitorId)}`, { cache: 'no-store' })
                .then(async (r) => {
                    let data = null;
                    try {
                        data = await r.json();
                    } catch {
                        data = null;
                    }
                    return { ok: r.ok, status: r.status, data };
                })
                .then(({ ok, status, data }) => {
                    if (data && data.ok && typeof data.totalUsers === 'number') {
                        totalUsersGlobalEl.textContent = data.totalUsers.toLocaleString('ru-RU');
                        return;
                    }
                    // Если KV не настроен в Cloudflare Pages — покажем понятную подсказку
                    const err = data && typeof data.error === 'string' ? data.error : '';
                    if (!ok && (status === 501 || /not configured/i.test(err))) {
                        totalUsersGlobalEl.textContent = 'Нужно KV';
                        return;
                    }
                    totalUsersGlobalEl.textContent = '—';
                })
                .catch(() => {
                    totalUsersGlobalEl.textContent = '—';
                })
                .finally(() => {
                    window.__globalUsersCountFetchInFlight = false;
                });
        }
    } catch {
        if (totalUsersGlobalEl) totalUsersGlobalEl.textContent = '—';
    }

    let users = [];
    try {
        users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        if (!Array.isArray(users)) users = [];
    } catch {
        users = [];
    }

    const totalUsers = users.length;
    let totalTestsCompleted = 0;
    for (const user of users) {
        const testResults = user?.testResults && typeof user.testResults === 'object' ? user.testResults : {};
        totalTestsCompleted += Object.keys(testResults).length;
    }

    // Типов тестов на платформе (категории)
    const totalTestTypes = 4;

    // Вопросов в базе — считаем уникальные по id, если доступна база
    let totalQuestions = 0;
    try {
        // Предпочтительно: заранее рассчитанное распределение (не требует генерации банка)
        if (window.__questionCountsByTestId && typeof window.__questionCountsByTestId === 'object') {
            totalQuestions = Object.values(window.__questionCountsByTestId)
                .filter(v => typeof v === 'number' && Number.isFinite(v))
                .reduce((sum, v) => sum + v, 0);
        } else {
        const db = (typeof questionDatabase !== 'undefined' && questionDatabase) ? questionDatabase : (window.fullTestQuestions || null);
        if (db && typeof db === 'object') {
            const ids = new Set();
            let raw = 0;
            Object.values(db).forEach((val) => {
                if (Array.isArray(val)) {
                    val.forEach((q) => {
                        raw += 1;
                        if (q && q.id) ids.add(String(q.id));
                    });
                }
            });
            totalQuestions = ids.size > 0 ? ids.size : raw;
        }
        }
    } catch {
        totalQuestions = 0;
    }

    if (totalUsersEl) totalUsersEl.textContent = totalUsers.toLocaleString('ru-RU');
    if (totalTestsEl) totalTestsEl.textContent = totalTestsCompleted.toLocaleString('ru-RU');
    if (totalTypesEl) totalTypesEl.textContent = totalTestTypes.toLocaleString('ru-RU');
    if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions ? totalQuestions.toLocaleString('ru-RU') : '—';
}

// Загрузка аватара пользователя
function loadUserAvatar(userId) {
    const avatars = JSON.parse(localStorage.getItem(AVATARS_KEY)) || {};
    const avatar = avatars[userId];
    
    const avatarImage = document.getElementById('avatar-image');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    if (avatar) {
        avatarImage.src = avatar;
        avatarImage.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
        
        // Устанавливаем инициалы в атрибут alt
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (currentUser && currentUser.username) {
            const initials = getInitials(currentUser.username);
            avatarImage.alt = `Аватар ${currentUser.username} (${initials})`;
        }
    } else {
        avatarImage.style.display = 'none';
        avatarPlaceholder.style.display = 'flex';
        
        // Устанавливаем инициалы в placeholder
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (currentUser && currentUser.username) {
            const initials = getInitials(currentUser.username);
            avatarPlaceholder.textContent = initials;
        }
    }
}

// Получение инициалов из имени
function getInitials(username) {
    return username.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2);
}

// Обработка загрузки аватара
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Проверяем тип файла
    if (!file.type.match('image.*')) {
        alert('Пожалуйста, выберите изображение!');
        return;
    }
    
    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB!');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (!currentUser) return;
        
        // Сохраняем аватар
        const avatars = JSON.parse(localStorage.getItem(AVATARS_KEY)) || {};
        avatars[currentUser.id] = e.target.result;
        localStorage.setItem(AVATARS_KEY, JSON.stringify(avatars));
        
        // Обновляем отображение
        loadUserAvatar(currentUser.id);
        
        alert('Аватар успешно обновлен!');
    };
    
    reader.readAsDataURL(file);
}

// Загрузка профиля пользователя
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return;
    
    // Основная информация
    document.getElementById('profile-name').textContent = currentUser.username;
    document.getElementById('profile-email-text').textContent = currentUser.email;
    document.getElementById('profile-phone-text').textContent = currentUser.phone;
    document.getElementById('profile-age-text').textContent = `${currentUser.age} лет`;
    
    // Дата регистрации
    const regDate = new Date(currentUser.registrationDate);
    document.getElementById('profile-reg-date').textContent = regDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Дополнительная информация из профиля (элементы могут быть скрыты/удалены из UI)
    if (currentUser.profile) {
        const educationEl = document.getElementById('education-info');
        if (educationEl) educationEl.textContent = currentUser.profile.education || "Не указано";

        const locationEl = document.getElementById('location-info');
        if (locationEl) locationEl.textContent = currentUser.profile.location || "Не указано";

        const interestsEl = document.getElementById('interests-info');
        if (interestsEl) interestsEl.textContent = currentUser.profile.interests || "Не указаны";
    }
    
    // Статистика
    updateUserStats(currentUser);
    
    // История тестов
    loadTestHistory(currentUser);
}

// Обновление статистики пользователя
function updateUserStats(user) {
    const testResults = user.testResults || {};
    const testKeys = Object.keys(testResults);
    
    // Количество пройденных тестов
    document.getElementById('tests-completed').textContent = testKeys.length;
    
    // Средний результат
    let totalScore = 0;
    let bestScore = 0;
    
    testKeys.forEach(testKey => {
        const test = testResults[testKey];
        if (test && test.score !== undefined && test.maxScore !== undefined) {
            const percentage = Math.round((test.score / test.maxScore) * 100);
            totalScore += percentage;
            bestScore = Math.max(bestScore, percentage);
        }
    });
    
    const averageScore = testKeys.length > 0 ? Math.round(totalScore / testKeys.length) : 0;
    document.getElementById('average-score').textContent = `${averageScore}%`;
    document.getElementById('best-score').textContent = `${bestScore}%`;
    
    // Дней с регистрации
    const regDate = new Date(user.registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today - regDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-registered').textContent = diffDays;
}

// Загрузка истории тестов
function loadTestHistory(user) {
    const testResults = user.testResults || {};
    const testKeys = Object.keys(testResults);
    const container = document.getElementById('tests-history-container');
    
    // Проверяем что контейнер существует
    if (!container) {
        console.log('tests-history-container not found');
        return;
    }
    
    if (testKeys.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Тесты еще не пройдены</p>';
        return;
    }
    
    let html = '';
    
    // Сортируем тесты по дате (новые первые)
    const sortedTests = testKeys
        .map(key => ({
            key,
            ...testResults[key]
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTests.forEach(test => {
        const testName = getTestName(test.key);
        const percentage = Math.round((test.score / test.maxScore) * 100);
        const date = new Date(test.date).toLocaleDateString('ru-RU');
        
        html += `
            <div class="history-item">
                <div>
                    <div class="test-name">${testName}</div>
                    <div class="test-date">${date}</div>
                </div>
                <div class="test-score">${percentage}%</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Получение названия теста по ключу
function getTestName(testKey) {
    const testNames = {
        'profession': 'Профориентация',
        'chemistry': 'Химия',
        'biology': 'Биология',

        // Профориентация (общая)
        'profession_general_1': 'Профориентация (1–4 класс)',
        'profession_general_5': 'Профориентация (5–6 класс)',
        'profession_general_7': 'Профориентация (7–8 класс)',
        'profession_general_9': 'Профориентация (9 класс)',
        'profession_general_10': 'Профориентация (10–11 класс)',

        // Профориентация (медицина)
        'profession_med_1': 'Медицинская профориентация (1–4 класс)',
        'profession_med_5': 'Медицинская профориентация (5–6 класс)',
        'profession_med_7': 'Медицинская профориентация (7–8 класс)',
        'profession_med_9': 'Медицинская профориентация (9 класс)',
        'profession_med_10': 'Медицинская профориентация (10–11 класс)',

        // Биология
        'biology_1': 'Биология (1–4 класс)',
        'biology_5': 'Биология (5–6 класс)',
        'biology_7': 'Биология (7–8 класс)',
        'biology_9': 'Биология (9 класс)',
        'biology_10': 'Биология (10–11 класс)',

        // Химия
        'chemistry_1': 'Химия (1–4 класс)',
        'chemistry_5': 'Химия (5–6 класс)',
        'chemistry_7': 'Химия (7–8 класс)',
        'chemistry_9': 'Химия (9 класс)',
        'chemistry_10': 'Химия (10–11 класс)',

        // Химия по классам (адаптивные карточки)
        'chemistry_grade_1': 'Химия (1 класс)',
        'chemistry_grade_2': 'Химия (2 класс)',
        'chemistry_grade_3': 'Химия (3 класс)',
        'chemistry_grade_4': 'Химия (4 класс)',
        'chemistry_grade_5': 'Химия (5 класс)',
        'chemistry_grade_6': 'Химия (6 класс)',
        'chemistry_grade_7': 'Химия (7 класс)',
        'chemistry_grade_8': 'Химия (8 класс)',
        'chemistry_grade_9': 'Химия (9 класс)',
        'chemistry_grade_10': 'Химия (10 класс)',
        'chemistry_grade_11': 'Химия (11 класс)',

        // Биология по классам (адаптивные карточки)
        'biology_grade_1': 'Биология (1 класс)',
        'biology_grade_2': 'Биология (2 класс)',
        'biology_grade_3': 'Биология (3 класс)',
        'biology_grade_4': 'Биология (4 класс)',
        'biology_grade_5': 'Биология (5 класс)',
        'biology_grade_6': 'Биология (6 класс)',
        'biology_grade_7': 'Биология (7 класс)',
        'biology_grade_8': 'Биология (8 класс)',
        'biology_grade_9': 'Биология (9 класс)',
        'biology_grade_10': 'Биология (10 класс)',
        'biology_grade_11': 'Биология (11 класс)',

        // Профориентация по классам (адаптивные карточки)
        'profession_grade_1': 'Профориентация (1 класс)',
        'profession_grade_2': 'Профориентация (2 класс)',
        'profession_grade_3': 'Профориентация (3 класс)',
        'profession_grade_4': 'Профориентация (4 класс)',
        'profession_grade_5': 'Профориентация (5 класс)',
        'profession_grade_6': 'Профориентация (6 класс)',
        'profession_grade_7': 'Профориентация (7 класс)',
        'profession_grade_8': 'Профориентация (8 класс)',
        'profession_grade_9': 'Профориентация (9 класс)',
        'profession_grade_10': 'Профориентация (10 класс)',
        'profession_grade_11': 'Профориентация (11 класс)',

        // Специализации/склонности по классам
        'specialty_grade_1': 'Профильные склонности (1 класс)',
        'specialty_grade_2': 'Профильные склонности (2 класс)',
        'specialty_grade_3': 'Профильные склонности (3 класс)',
        'specialty_grade_4': 'Профильные склонности (4 класс)',
        'specialty_grade_5': 'Профильные склонности (5 класс)',
        'specialty_grade_6': 'Профильные склонности (6 класс)',
        'specialty_grade_7': 'Профильные склонности (7 класс)',
        'specialty_grade_8': 'Профильные склонности (8 класс)',
        'specialty_grade_9': 'Профильные склонности (9 класс)',
        'specialty_grade_10': 'Профильные склонности (10 класс)',
        'specialty_grade_11': 'Профильные склонности (11 класс)'
    };
    
    return testNames[testKey] || testKey;
}

// Редактирование образования
function editEducation() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const currentEducation = currentUser.profile?.education || "";
    
    const newEducation = prompt('Введите информацию об образовании:', currentEducation);
    if (newEducation !== null) {
        // Обновляем профиль
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.education = newEducation.trim();
        
        // Обновляем в localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // Обновляем в общем списке пользователей
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        
        // Обновляем отображение (если блок есть в UI)
        const educationEl = document.getElementById('education-info');
        if (educationEl) educationEl.textContent = newEducation.trim() || "Не указано";
        alert('Информация об образовании обновлена!');
    }
}

// Редактирование местоположения
function editLocation() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const currentLocation = currentUser.profile?.location || "";
    
    const newLocation = prompt('Введите ваше местоположение (город, регион):', currentLocation);
    if (newLocation !== null) {
        // Обновляем профиль
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.location = newLocation.trim();
        
        // Обновляем в localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // Обновляем в общем списке пользователей
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        
        // Обновляем отображение (если блок есть в UI)
        const locationEl = document.getElementById('location-info');
        if (locationEl) locationEl.textContent = newLocation.trim() || "Не указано";
        alert('Местоположение обновлено!');
    }
}

// Редактирование интересов
function editInterests() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const currentInterests = currentUser.profile?.interests || "";
    
    const newInterests = prompt('Введите ваши интересы (через запятую):', currentInterests);
    if (newInterests !== null) {
        // Обновляем профиль
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.interests = newInterests.trim();
        
        // Обновляем в localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // Обновляем в общем списке пользователей
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        
        // Обновляем отображение (если блок есть в UI)
        const interestsEl = document.getElementById('interests-info');
        if (interestsEl) interestsEl.textContent = newInterests.trim() || "Не указаны";
        alert('Интересы обновлены!');
    }
}

// Редактирование цели
function editGoal() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const currentGoal = currentUser.profile?.goal || "";
    
    const goals = [
        "1 - Поступление в медицинский вуз",
        "2 - Выбор медицинской специальности",
        "3 - Подготовка к ЕГЭ",
        "4 - Общее развитие в медицине",
        "5 - Карьерная переориентация"
    ];
    
    const goalChoice = prompt(`Выберите вашу цель:\n${goals.join('\n')}\n\nВведите номер или свою цель:`, currentGoal);
    if (goalChoice !== null) {
        let newGoal = goalChoice.trim();
        const goalNum = parseInt(newGoal);
        if (goalNum >= 1 && goalNum <= 5) {
            newGoal = goals[goalNum - 1].substring(4);
        }
        
        if (!currentUser.profile) currentUser.profile = {};
        currentUser.profile.goal = newGoal;
        
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        
        const goalEl = document.getElementById('goal-info');
        if (goalEl) goalEl.textContent = newGoal || "Не указана";
        showNotification('Цель обновлена!', 'success');
    }
}

// Экспорт профиля
function exportProfile() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) {
        showNotification('Ошибка: пользователь не найден', 'error');
        return;
    }
    
    const exportData = {
        name: currentUser.name || currentUser.username,
        email: currentUser.email,
        registrationDate: currentUser.registrationDate,
        profile: currentUser.profile,
        testResults: currentUser.testResults,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-profile-${currentUser.name || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Профиль экспортирован!', 'success');
}

// Поделиться профилем
function shareProfile() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return;
    
    const testResults = currentUser.testResults || {};
    const testCount = Object.keys(testResults).length;
    
    let totalScore = 0;
    Object.values(testResults).forEach(test => {
        if (test.score && test.maxScore) {
            totalScore += Math.round((test.score / test.maxScore) * 100);
        }
    });
    const avgScore = testCount > 0 ? Math.round(totalScore / testCount) : 0;
    
    const shareText = `🏥 Мой профиль на Медицинской Профориентации!\n\n👤 ${currentUser.name || currentUser.username}\n📊 Пройдено тестов: ${testCount}\n📈 Средний результат: ${avgScore}%\n⭐ Уровень: ${calculateLevel(currentUser)}\n\nПрисоединяйся и определи свою медицинскую специальность!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой профиль - Медицинская Профориентация',
            text: shareText
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Профиль скопирован в буфер обмена!', 'success');
        });
    }
}

// Сброс прогресса
function resetProgress() {
    if (!confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить!')) {
        return;
    }
    
    if (!confirm('Это удалит все результаты тестов и достижения. Продолжить?')) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return;
    
    currentUser.testResults = {};
    currentUser.achievements = [];
    currentUser.xp = 0;
    currentUser.level = 1;
    currentUser.streak = 0;
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    loadUserProfile();
    showNotification('Прогресс сброшен', 'warning');
}

// Тёмная тема
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        showNotification('Светлая тема включена', 'info');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        showNotification('Тёмная тема включена', 'info');
    }
}

// Загрузка темы при старте
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Расчёт уровня пользователя
function calculateLevel(user) {
    const xp = user.xp || 0;
    return Math.floor(xp / 100) + 1;
}

// Расчёт XP
function calculateXP(user) {
    let xp = 0;
    const testResults = user.testResults || {};
    
    Object.values(testResults).forEach(test => {
        // 10 XP за каждый тест + бонус за результат
        xp += 10;
        if (test.score && test.maxScore) {
            const percentage = (test.score / test.maxScore) * 100;
            xp += Math.round(percentage / 10); // До 10 бонусных XP
        }
    });
    
    return xp;
}

// Обновление достижений
function updateAchievements(user) {
    const achievements = user.achievements || [];
    const testResults = user.testResults || {};
    const testCount = Object.keys(testResults).length;
    
    const achievementChecks = {
        'first_test': testCount >= 1,
        'five_tests': testCount >= 5,
        'ten_tests': testCount >= 10,
        'perfect_score': Object.values(testResults).some(t => t.score && t.maxScore && (t.score / t.maxScore) >= 0.95),
        'streak_3': (user.streak || 0) >= 3,
        'streak_7': (user.streak || 0) >= 7,
        'all_subjects': ['biology', 'chemistry', 'profession_general', 'profession_med'].every(subj => 
            Object.keys(testResults).some(key => key.includes(subj))
        ),
        'speed_demon': Object.values(testResults).some(t => t.timeSpent && t.timeSpent < 300)
    };
    
    Object.entries(achievementChecks).forEach(([id, unlocked]) => {
        const el = document.querySelector(`.achievement[data-id="${id}"]`);
        if (el) {
            if (unlocked) {
                el.classList.remove('locked');
                el.classList.add('unlocked');
                if (!achievements.includes(id)) {
                    achievements.push(id);
                    showNotification(`🏆 Новое достижение: ${el.querySelector('.achievement-name').textContent}!`, 'success');
                }
            } else {
                el.classList.add('locked');
                el.classList.remove('unlocked');
            }
        }
    });
    
    user.achievements = achievements;
    return user;
}

// Обновление календаря активности
function updateActivityCalendar(user) {
    const calendar = document.getElementById('activity-calendar');
    if (!calendar) return;
    
    const testResults = user.testResults || {};
    const activityMap = {};
    
    // Подсчёт активности по дням
    Object.values(testResults).forEach(test => {
        if (test.date) {
            const date = test.date.split('T')[0];
            activityMap[date] = (activityMap[date] || 0) + 1;
        }
    });
    
    // Генерация 30 дней
    calendar.innerHTML = '';
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = activityMap[dateStr] || 0;
        let className = 'calendar-day empty';
        if (count >= 5) className = 'calendar-day high';
        else if (count >= 3) className = 'calendar-day medium';
        else if (count >= 1) className = 'calendar-day low';
        
        const day = document.createElement('div');
        day.className = className;
        day.title = `${dateStr}: ${count} тестов`;
        calendar.appendChild(day);
    }
}

// Рекомендации по карьере
function updateCareerRecommendations(user) {
    const container = document.getElementById('career-recommendations-list');
    if (!container) return;
    
    const testResults = user.testResults || {};
    if (Object.keys(testResults).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Пройдите тесты, чтобы получить персональные рекомендации</p>';
        return;
    }
    
    // Анализ результатов для рекомендаций
    const careers = [
        { name: 'Терапевт', icon: '🩺', match: 0, desc: 'Врач общей практики' },
        { name: 'Хирург', icon: '⚔️', match: 0, desc: 'Оперативное лечение' },
        { name: 'Педиатр', icon: '👶', match: 0, desc: 'Детский врач' },
        { name: 'Кардиолог', icon: '❤️', match: 0, desc: 'Специалист по сердцу' },
        { name: 'Невролог', icon: '🧠', match: 0, desc: 'Нервная система' },
        { name: 'Фармацевт', icon: '💊', match: 0, desc: 'Работа с лекарствами' }
    ];
    
    // Простой алгоритм подбора
    let totalScore = 0;
    let count = 0;
    
    Object.values(testResults).forEach(test => {
        if (test.score && test.maxScore) {
            totalScore += (test.score / test.maxScore) * 100;
            count++;
        }
    });
    
    const avgScore = count > 0 ? totalScore / count : 50;
    
    careers.forEach(career => {
        career.match = Math.min(95, Math.max(40, avgScore + (Math.random() * 20 - 10)));
    });
    
    careers.sort((a, b) => b.match - a.match);
    
    container.innerHTML = careers.slice(0, 4).map(career => `
        <div class="career-item">
            <span class="career-icon">${career.icon}</span>
            <div class="career-info">
                <h4>${career.name}</h4>
                <p>${career.desc}</p>
            </div>
            <span class="career-match">${Math.round(career.match)}%</span>
        </div>
    `).join('');
}

// Обновлённая функция loadUserProfile
const originalLoadUserProfile = loadUserProfile;
loadUserProfile = function() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (!currentUser) return;
    
    // Основная информация
    document.getElementById('profile-name').textContent = currentUser.name || currentUser.username;
    document.getElementById('profile-email-text').textContent = currentUser.email;
    document.getElementById('profile-phone-text').textContent = currentUser.phone;
    document.getElementById('profile-age-text').textContent = `${currentUser.age} лет`;
    
    // Дата регистрации
    const regDate = new Date(currentUser.registrationDate);
    document.getElementById('profile-reg-date').textContent = regDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Дополнительная информация (элементы могут быть скрыты/удалены из UI)
    if (currentUser.profile) {
        const educationEl = document.getElementById('education-info');
        if (educationEl) educationEl.textContent = currentUser.profile.education || "Не указано";

        const locationEl = document.getElementById('location-info');
        if (locationEl) locationEl.textContent = currentUser.profile.location || "Не указано";

        const interestsEl = document.getElementById('interests-info');
        if (interestsEl) interestsEl.textContent = currentUser.profile.interests || "Не указаны";

        const goalEl = document.getElementById('goal-info');
        if (goalEl) goalEl.textContent = currentUser.profile.goal || "Не указана";
    }
    
    // XP и уровень
    const xp = calculateXP(currentUser);
    const level = Math.floor(xp / 100) + 1;
    const xpInLevel = xp % 100;
    
    const levelEl = document.getElementById('user-level');
    if (levelEl) levelEl.textContent = `Уровень ${level}`;
    
    const xpTextEl = document.getElementById('xp-text');
    if (xpTextEl) xpTextEl.textContent = `${xpInLevel} / 100 XP`;
    
    const xpProgressEl = document.getElementById('xp-progress');
    if (xpProgressEl) xpProgressEl.style.width = `${xpInLevel}%`;
    
    const totalXpEl = document.getElementById('total-xp');
    if (totalXpEl) totalXpEl.textContent = xp;
    
    // Статус
    const statusEl = document.getElementById('profile-status');
    if (statusEl) {
        const statuses = ['Новичок', 'Ученик', 'Студент', 'Специалист', 'Эксперт', 'Мастер'];
        statusEl.textContent = statuses[Math.min(level - 1, statuses.length - 1)];
    }
    
    // Streak
    const streakEl = document.getElementById('streak-days');
    if (streakEl) streakEl.textContent = currentUser.streak || 0;
    
    // Статистика
    updateUserStats(currentUser);
    
    // Достижения
    updateAchievements(currentUser);
    
    // Календарь активности
    updateActivityCalendar(currentUser);
    
    // Рекомендации по карьере
    updateCareerRecommendations(currentUser);
    
    // История тестов
    loadTestHistory(currentUser);
};

// Выход
function logout() {
    // Без confirm: кнопка должна работать всегда и быстро
    try { localStorage.removeItem(CURRENT_USER_KEY); } catch { /* ignore */ }

    // Также закрываем текущий тестовый UI, если открыт
    try {
        document.querySelectorAll('#tests .test-container').forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });
        document.querySelectorAll('.result-container').forEach(c => {
            c.classList.remove('show');
            c.style.display = 'none';
        });
    } catch { /* ignore */ }

    // Возврат на landing page
    try {
        const auth = document.getElementById('auth-container');
        const main = document.getElementById('main-content');
        const landing = document.getElementById('landing-page');
        
        if (main) {
            main.style.display = 'none';
            main.classList.remove('visible');
        }
        if (auth) auth.classList.remove('active');
        if (landing) {
            landing.classList.remove('hidden');
            landing.style.display = 'flex';
            landing.style.visibility = 'visible';
            // Реинициализируем анимации
            setTimeout(() => {
                if (typeof initScrollAnimations === 'function') initScrollAnimations();
                if (typeof initNavScroll === 'function') initNavScroll();
            }, 100);
        }
        
        // Скрываем кнопку AI тьютора при выходе
        if (window.aiTutor && typeof window.aiTutor.updateTutorVisibility === 'function') {
            window.aiTutor.updateTutorVisibility();
        }
        
        document.body.style.overflow = '';
    } catch (e) {
        console.error('Logout error:', e);
        // fallback
        location.reload();
    }
}

// Показать секцию
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    // Скрыть все секции
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('visible');
    });

    // Сбросить UI тестов (чтобы после завершения всё снова кликабельно работало)
    try {
        const legacyQuestions = document.getElementById('test-questions-container');
        if (legacyQuestions) {
            legacyQuestions.classList.remove('active');
            legacyQuestions.style.display = 'none';
        }
        const legacyResults = document.getElementById('test-results');
        if (legacyResults) {
            legacyResults.classList.remove('show');
            legacyResults.style.display = 'none';
        }
        document.querySelectorAll('#tests .test-container').forEach(c => {
            c.classList.remove('active');
            c.style.display = 'none';
        });
        document.querySelectorAll('#tests .result-container').forEach(c => {
            c.classList.remove('show');
            c.style.display = 'none';
        });
        const cards = document.querySelector('#tests .test-cards');
        if (cards) cards.style.display = sectionId === 'tests' ? 'grid' : cards.style.display;
        
        // Показываем фильтры и заголовок класса при возврате к тестам
        if (sectionId === 'tests') {
            const filterPanel = document.querySelector('.tests-filter-panel');
            if (filterPanel) filterPanel.style.display = 'block';
            
            const gradeTitle = document.querySelector('.selected-grade-title');
            if (gradeTitle) gradeTitle.style.display = 'block';
        }
    } catch (e) {
        console.warn('showSection test UI reset failed', e);
    }
    
    // Показать выбранную секцию
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.setProperty('display', 'block', 'important');
        section.style.setProperty('visibility', 'visible', 'important');
        section.style.setProperty('opacity', '1', 'important');
        section.classList.add('visible');
        
        // Если это профиль, обновляем данные
        if (sectionId === 'profile') {
            loadUserProfile();
        }
    }

    // Обновить индикатор текущего теста при заходе в "Тесты"
    try {
        if (sectionId === 'tests' && typeof updateCurrentTestUI === 'function') {
            updateCurrentTestUI();
        }
    } catch { /* ignore */ }

    // Скролл к верху секции (и без лишней анимации при reduced-motion)
    try {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } catch {
        window.scrollTo(0, 0);
    }
    
    // Обновить навигацию
    document.querySelectorAll('nav a, .nav-item').forEach(link => {
        link.classList.remove('active');
    });
    
    // Найти активную ссылку по sectionId
    const activeLinks = document.querySelectorAll(`[href="#${sectionId}"]`);
    activeLinks.forEach(link => link.classList.add('active'));
}

// Обновление навигации сайдбара
function updateNav(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// Обновление мобильной навигации
function updateMobileNav(element) {
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// Метки шкал профориентации (для красивого вывода результатов)
const ORIENTATION_DIM_LABELS = {
    people: 'Общение и помощь людям',
    analysis: 'Аналитика и системное мышление',
    creativity: 'Творчество и идеи',
    practice: 'Практика и «делать руками»',
    empathy: 'Эмпатия',
    responsibility: 'Ответственность',
    stress: 'Стрессоустойчивость',
    accuracy: 'Внимательность и аккуратность',
    science: 'Интерес к науке',
    teamwork: 'Командная работа'
};

// Переключение карточек обучения
function toggleLearningCard(element) {
    const card = element.closest('.learning-card');
    const details = card.querySelector('.learning-details');
    const toggle = card.querySelector('.learning-toggle');
    
    // Закрываем другие открытые карточки
    document.querySelectorAll('.learning-card').forEach(otherCard => {
        if (otherCard !== card) {
            const otherDetails = otherCard.querySelector('.learning-details');
            const otherToggle = otherCard.querySelector('.learning-toggle');
            otherDetails.classList.remove('active');
            otherToggle.classList.remove('active');
            otherCard.style.zIndex = '1';
        }
    });
    
    // Открываем/закрываем текущую карточку
    details.classList.toggle('active');
    toggle.classList.toggle('active');
    
    // Поднимаем текущую карточку на передний план
    if (details.classList.contains('active')) {
        card.style.zIndex = '10';
    } else {
        card.style.zIndex = '1';
    }
}

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Получить случайные 40 вопросов из полной базы
function getRandomQuestions(questions, count = 40) {
    // Перемешиваем все вопросы
    const shuffled = shuffleArray(questions);
    // Берем первые count вопросов
    return shuffled.slice(0, count);
}

// Инициализация тестов - СОЗДАЕМ ПОЛНУЮ БАЗУ ВОПРОСОВ (100+ для каждого теста)
function initializeTests() {
    // Создаем полную базу вопросов для всех тестов
    window.fullTestQuestions = {
        profession: generateProfessionQuestions(),
        chemistry: generateChemistryQuestions(),
        biology: generateBiologyQuestions(),
        specialty: generateSpecialtyQuestions()
    };
}

// Генерация 100 уникальных вопросов для теста по профориентации
function generateProfessionQuestions() {
    const questions = [
        // Блок 1: Интересы и склонности (1-25)
        { id: 'prof-1', question: 'Мне нравится изучать строение человеческого тела', difficulty: 1 },
        { id: 'prof-2', question: 'Я спокойно отношусь к виду крови', difficulty: 1 },
        { id: 'prof-3', question: 'Меня интересует работа медицинского оборудования', difficulty: 1 },
        { id: 'prof-4', question: 'Я готов долго учиться для получения медицинской профессии', difficulty: 1 },
        { id: 'prof-5', question: 'Мне нравится помогать людям в трудных ситуациях', difficulty: 1 },
        { id: 'prof-6', question: 'Я внимателен к мельчайшим деталям', difficulty: 1 },
        { id: 'prof-7', question: 'Я хорошо работаю в стрессовых ситуациях', difficulty: 1 },
        { id: 'prof-8', question: 'Мне интересны биологические процессы в организме', difficulty: 1 },
        { id: 'prof-9', question: 'Я терпелив и могу долго концентрироваться на задаче', difficulty: 1 },
        { id: 'prof-10', question: 'Я готов работать в нестандартном графике (ночные смены, дежурства)', difficulty: 1 },
        { id: 'prof-11', question: 'Меня интересуют последние медицинские открытия и исследования', difficulty: 1 },
        { id: 'prof-12', question: 'Я хорошо запоминаю большие объемы информации', difficulty: 1 },
        { id: 'prof-13', question: 'Мне нравится решать сложные логические задачи', difficulty: 1 },
        { id: 'prof-14', question: 'Я считаю себя ответственным человеком', difficulty: 1 },
        { id: 'prof-15', question: 'Я умею сопереживать и понимать чувства других', difficulty: 1 },
        { id: 'prof-16', question: 'Меня не пугают трудности и препятствия', difficulty: 1 },
        { id: 'prof-17', question: 'Я интересуюсь современными технологиями в медицине', difficulty: 1 },
        { id: 'prof-18', question: 'Я готов постоянно учиться и повышать квалификацию', difficulty: 1 },
        { id: 'prof-19', question: 'Мне нравится работать в команде с другими специалистами', difficulty: 1 },
        { id: 'prof-20', question: 'Я аккуратен и точен в своих действиях', difficulty: 1 },
        { id: 'prof-21', question: 'Меня привлекает научно-исследовательская работа', difficulty: 1 },
        { id: 'prof-22', question: 'Я хорошо переношу физические и эмоциональные нагрузки', difficulty: 1 },
        { id: 'prof-23', question: 'Мне интересна психология человеческого поведения', difficulty: 1 },
        { id: 'prof-24', question: 'Я умею быстро принимать решения в критических ситуациях', difficulty: 1 },
        { id: 'prof-25', question: 'Мне нравится общаться с разными людьми', difficulty: 1 },
        
        // Блок 2: Личные качества (26-50)
        { id: 'prof-26', question: 'Я наблюдателен и замечаю изменения в состоянии людей', difficulty: 2 },
        { id: 'prof-27', question: 'Меня интересует профилактика заболеваний', difficulty: 2 },
        { id: 'prof-28', question: 'Я готов брать на себя ответственность за здоровье пациентов', difficulty: 2 },
        { id: 'prof-29', question: 'Мне интересна фармакология и действие лекарств', difficulty: 2 },
        { id: 'prof-30', question: 'Я умею сохранять спокойствие в экстренных ситуациях', difficulty: 2 },
        { id: 'prof-31', question: 'Мне нравится анализировать симптомы и ставить диагнозы', difficulty: 2 },
        { id: 'prof-32', question: 'Я готов работать с медицинской документацией', difficulty: 2 },
        { id: 'prof-33', question: 'Меня привлекает хирургическое направление в медицине', difficulty: 2 },
        { id: 'prof-34', question: 'Я интересуюсь генетикой и наследственными заболеваниями', difficulty: 2 },
        { id: 'prof-35', question: 'Мне нравится обучать других и делиться знаниями', difficulty: 2 },
        { id: 'prof-36', question: 'У меня хорошая мелкая моторика рук', difficulty: 2 },
        { id: 'prof-37', question: 'Меня интересует неотложная медицинская помощь', difficulty: 2 },
        { id: 'prof-38', question: 'Я готов работать в любых условиях, включая полевые', difficulty: 2 },
        { id: 'prof-39', question: 'Мне интересна медицинская диагностика', difficulty: 2 },
        { id: 'prof-40', question: 'Я стремлюсь к совершенству в своей работе', difficulty: 2 },
        { id: 'prof-41', question: 'Я могу долго стоять на ногах во время работы', difficulty: 2 },
        { id: 'prof-42', question: 'Мне нравится работать с современным оборудованием', difficulty: 2 },
        { id: 'prof-43', question: 'Я умею находить подход к разным людям', difficulty: 2 },
        { id: 'prof-44', question: 'Меня интересует педиатрия - работа с детьми', difficulty: 2 },
        { id: 'prof-45', question: 'Я готов к ненормированному рабочему дню', difficulty: 2 },
        { id: 'prof-46', question: 'Мне интересна реабилитация и восстановление пациентов', difficulty: 2 },
        { id: 'prof-47', question: 'Я умею работать с информацией и базами данных', difficulty: 2 },
        { id: 'prof-48', question: 'Меня привлекает работа в операционной', difficulty: 2 },
        { id: 'prof-49', question: 'Я интересуюсь вопросами здорового образа жизни', difficulty: 2 },
        { id: 'prof-50', question: 'Я готов работать с тяжелобольными пациентами', difficulty: 2 },
        
        // Блок 3: Профессиональные ориентиры (51-75)
        { id: 'prof-51', question: 'Меня привлекает работа в скорой помощи', difficulty: 3 },
        { id: 'prof-52', question: 'Я хотел бы заниматься научными исследованиями в медицине', difficulty: 3 },
        { id: 'prof-53', question: 'Мне интересна работа с инфекционными заболеваниями', difficulty: 3 },
        { id: 'prof-54', question: 'Я вижу себя семейным врачом общей практики', difficulty: 3 },
        { id: 'prof-55', question: 'Меня привлекает пластическая хирургия', difficulty: 3 },
        { id: 'prof-56', question: 'Я хотел бы работать в области онкологии', difficulty: 3 },
        { id: 'prof-57', question: 'Мне интересна кардиология - лечение сердечных заболеваний', difficulty: 3 },
        { id: 'prof-58', question: 'Я вижу себя работающим в реанимации', difficulty: 3 },
        { id: 'prof-59', question: 'Меня привлекает неврология - работа с нервной системой', difficulty: 3 },
        { id: 'prof-60', question: 'Я хотел бы заниматься спортивной медициной', difficulty: 3 },
        { id: 'prof-61', question: 'Мне интересна офтальмология - лечение глаз', difficulty: 3 },
        { id: 'prof-62', question: 'Я вижу себя работающим стоматологом', difficulty: 3 },
        { id: 'prof-63', question: 'Меня привлекает психиатрия и психотерапия', difficulty: 3 },
        { id: 'prof-64', question: 'Я хотел бы заниматься акушерством и гинекологией', difficulty: 3 },
        { id: 'prof-65', question: 'Мне интересна дерматология - лечение кожных заболеваний', difficulty: 3 },
        { id: 'prof-66', question: 'Я вижу себя работающим анестезиологом', difficulty: 3 },
        { id: 'prof-67', question: 'Меня привлекает эндокринология', difficulty: 3 },
        { id: 'prof-68', question: 'Я хотел бы заниматься травматологией и ортопедией', difficulty: 3 },
        { id: 'prof-69', question: 'Мне интересна урология', difficulty: 3 },
        { id: 'prof-70', question: 'Я вижу себя работающим в лаборатории', difficulty: 3 },
        { id: 'prof-71', question: 'Меня привлекает радиология и диагностика', difficulty: 3 },
        { id: 'prof-72', question: 'Я хотел бы заниматься паллиативной медициной', difficulty: 3 },
        { id: 'prof-73', question: 'Мне интересна гастроэнтерология', difficulty: 3 },
        { id: 'prof-74', question: 'Я вижу себя работающим пульмонологом', difficulty: 3 },
        { id: 'prof-75', question: 'Меня привлекает нефрология - лечение почек', difficulty: 3 },
        
        // Блок 4: Ценности и мотивация (76-100)
        { id: 'prof-76', question: 'Для меня важно видеть результат своей работы - выздоровление пациента', difficulty: 4 },
        { id: 'prof-77', question: 'Я готов жертвовать личным временем ради пациентов', difficulty: 4 },
        { id: 'prof-78', question: 'Меня мотивирует возможность спасать жизни', difficulty: 4 },
        { id: 'prof-79', question: 'Я хочу внести вклад в развитие медицинской науки', difficulty: 4 },
        { id: 'prof-80', question: 'Для меня важен престиж медицинской профессии', difficulty: 4 },
        { id: 'prof-81', question: 'Я готов к эмоциональным нагрузкам профессии врача', difficulty: 4 },
        { id: 'prof-82', question: 'Меня привлекает возможность помогать людям каждый день', difficulty: 4 },
        { id: 'prof-83', question: 'Я хочу работать в престижной клинике', difficulty: 4 },
        { id: 'prof-84', question: 'Для меня важна стабильность медицинской профессии', difficulty: 4 },
        { id: 'prof-85', question: 'Я готов к постоянному профессиональному росту', difficulty: 4 },
        { id: 'prof-86', question: 'Меня привлекает международное признание в медицине', difficulty: 4 },
        { id: 'prof-87', question: 'Я хочу открыть собственную клинику или практику', difficulty: 4 },
        { id: 'prof-88', question: 'Для меня важно уважение коллег и пациентов', difficulty: 4 },
        { id: 'prof-89', question: 'Я готов работать в сельской местности, где не хватает врачей', difficulty: 4 },
        { id: 'prof-90', question: 'Меня привлекает преподавание в медицинском вузе', difficulty: 4 },
        { id: 'prof-91', question: 'Я хочу участвовать в гуманитарных медицинских миссиях', difficulty: 4 },
        { id: 'prof-92', question: 'Для меня важен баланс работы и личной жизни', difficulty: 4 },
        { id: 'prof-93', question: 'Я готов к финансовым вложениям в свое медицинское образование', difficulty: 4 },
        { id: 'prof-94', question: 'Меня привлекает возможность работать за рубежом', difficulty: 4 },
        { id: 'prof-95', question: 'Я хочу специализироваться в редкой области медицины', difficulty: 4 },
        { id: 'prof-96', question: 'Для меня важно быть на переднем крае медицинских технологий', difficulty: 4 },
        { id: 'prof-97', question: 'Я готов к многолетней ординатуре для узкой специализации', difficulty: 4 },
        { id: 'prof-98', question: 'Меня привлекает административная работа в здравоохранении', difficulty: 4 },
        { id: 'prof-99', question: 'Я хочу создавать новые методы лечения', difficulty: 4 },
        { id: 'prof-100', question: 'Для меня медицина - это призвание, а не просто работа', difficulty: 4 }
    ];
    
    // Добавляем стандартные опции для всех вопросов
    questions.forEach(q => {
        q.options = ["Полностью согласен", "Скорее согласен", "Затрудняюсь ответить", "Скорее не согласен", "Полностью не согласен"];
        q.correct = 0;
        q.explanation = "Этот вопрос поможет определить ваши предпочтения в медицинской области.";
    });
    
    // Группируем по уровням сложности
    const groupedQuestions = {};
    questions.forEach(q => {
        if (!groupedQuestions[q.difficulty]) groupedQuestions[q.difficulty] = [];
        groupedQuestions[q.difficulty].push(q);
    });
    
    return groupedQuestions;
}

// Генерация 100 уникальных вопросов для теста по химии
function generateChemistryQuestions() {
    const questions = [
        // Блок 1: Основы химии (1-25)
        { id: 'chem-1', question: 'Что такое pH?', options: ['Мера кислотности раствора', 'Мера температуры', 'Мера давления', 'Мера объема'], correct: 0, difficulty: 1 },
        { id: 'chem-2', question: 'Какова химическая формула воды?', options: ['H₂O', 'CO₂', 'NaCl', 'O₂'], correct: 0, difficulty: 1 },
        { id: 'chem-3', question: 'Какой газ поддерживает горение?', options: ['Кислород', 'Азот', 'Углекислый газ', 'Водород'], correct: 0, difficulty: 1 },
        { id: 'chem-4', question: 'Какой элемент является самым легким?', options: ['Водород', 'Гелий', 'Литий', 'Кислород'], correct: 0, difficulty: 1 },
        { id: 'chem-5', question: 'Что такое катализатор?', options: ['Вещество, ускоряющее реакцию', 'Продукт реакции', 'Исходное вещество', 'Растворитель'], correct: 0, difficulty: 1 },
        { id: 'chem-6', question: 'Какова формула поваренной соли?', options: ['NaCl', 'KCl', 'CaCl₂', 'MgCl₂'], correct: 0, difficulty: 1 },
        { id: 'chem-7', question: 'Какой элемент обозначается символом Fe?', options: ['Железо', 'Фтор', 'Франций', 'Фермий'], correct: 0, difficulty: 1 },
        { id: 'chem-8', question: 'Сколько электронов на внешнем уровне атома кислорода?', options: ['6', '8', '2', '4'], correct: 0, difficulty: 1 },
        { id: 'chem-9', question: 'Какой металл жидкий при комнатной температуре?', options: ['Ртуть', 'Натрий', 'Калий', 'Цезий'], correct: 0, difficulty: 1 },
        { id: 'chem-10', question: 'Что такое атомная масса?', options: ['Масса атома в а.е.м.', 'Количество протонов', 'Количество электронов', 'Заряд ядра'], correct: 0, difficulty: 1 },
        { id: 'chem-11', question: 'Какова формула углекислого газа?', options: ['CO₂', 'CO', 'CH₄', 'C₂H₆'], correct: 0, difficulty: 1 },
        { id: 'chem-12', question: 'Что такое электролиз?', options: ['Разложение вещества электрическим током', 'Плавление металла', 'Испарение жидкости', 'Растворение соли'], correct: 0, difficulty: 1 },
        { id: 'chem-13', question: 'Какой элемент - основа органической химии?', options: ['Углерод', 'Кислород', 'Водород', 'Азот'], correct: 0, difficulty: 1 },
        { id: 'chem-14', question: 'Что такое индикатор в химии?', options: ['Вещество, меняющее цвет от pH', 'Измерительный прибор', 'Катализатор', 'Растворитель'], correct: 0, difficulty: 1 },
        { id: 'chem-15', question: 'Какой газ используется в газированных напитках?', options: ['Углекислый газ', 'Кислород', 'Азот', 'Гелий'], correct: 0, difficulty: 1 },
        { id: 'chem-16', question: 'Что такое молекулярная масса?', options: ['Сумма атомных масс в молекуле', 'Масса одного атома', 'Плотность вещества', 'Объем молекулы'], correct: 0, difficulty: 1 },
        { id: 'chem-17', question: 'Какой элемент обозначается Au?', options: ['Золото', 'Серебро', 'Алюминий', 'Аргон'], correct: 0, difficulty: 1 },
        { id: 'chem-18', question: 'Что такое валентность?', options: ['Способность атома образовывать связи', 'Заряд иона', 'Масса атома', 'Размер атома'], correct: 0, difficulty: 1 },
        { id: 'chem-19', question: 'Какой элемент является галогеном?', options: ['Хлор', 'Кислород', 'Азот', 'Углерод'], correct: 0, difficulty: 1 },
        { id: 'chem-20', question: 'Что такое ион?', options: ['Заряженная частица', 'Нейтральный атом', 'Молекула', 'Электрон'], correct: 0, difficulty: 1 },
        { id: 'chem-21', question: 'Какова формула метана?', options: ['CH₄', 'C₂H₆', 'C₃H₈', 'C₂H₄'], correct: 0, difficulty: 1 },
        { id: 'chem-22', question: 'Что такое кислота?', options: ['Вещество, отдающее протон', 'Вещество, принимающее протон', 'Соль', 'Оксид'], correct: 0, difficulty: 1 },
        { id: 'chem-23', question: 'Какой элемент обозначается Ag?', options: ['Серебро', 'Золото', 'Алюминий', 'Аргон'], correct: 0, difficulty: 1 },
        { id: 'chem-24', question: 'Что такое щелочь?', options: ['Растворимое основание', 'Кислота', 'Соль', 'Оксид'], correct: 0, difficulty: 1 },
        { id: 'chem-25', question: 'Какой газ составляет 78% атмосферы?', options: ['Азот', 'Кислород', 'Аргон', 'Углекислый газ'], correct: 0, difficulty: 1 },
        
        // Блок 2: Неорганическая химия (26-50)
        { id: 'chem-26', question: 'Что такое оксид?', options: ['Соединение с кислородом', 'Соединение с водородом', 'Соль', 'Кислота'], correct: 0, difficulty: 2 },
        { id: 'chem-27', question: 'Какой металл самый электропроводный?', options: ['Серебро', 'Медь', 'Золото', 'Алюминий'], correct: 0, difficulty: 2 },
        { id: 'chem-28', question: 'Что происходит при нейтрализации?', options: ['Кислота + основание = соль + вода', 'Окисление металла', 'Разложение вещества', 'Синтез полимера'], correct: 0, difficulty: 2 },
        { id: 'chem-29', question: 'Какой элемент является щелочным металлом?', options: ['Натрий', 'Кальций', 'Магний', 'Алюминий'], correct: 0, difficulty: 2 },
        { id: 'chem-30', question: 'Что такое амфотерность?', options: ['Двойственные свойства вещества', 'Растворимость', 'Летучесть', 'Пластичность'], correct: 0, difficulty: 2 },
        { id: 'chem-31', question: 'Какова формула серной кислоты?', options: ['H₂SO₄', 'HCl', 'HNO₃', 'H₃PO₄'], correct: 0, difficulty: 2 },
        { id: 'chem-32', question: 'Что такое гидролиз соли?', options: ['Взаимодействие соли с водой', 'Растворение соли', 'Плавление соли', 'Испарение воды'], correct: 0, difficulty: 2 },
        { id: 'chem-33', question: 'Какой элемент является инертным газом?', options: ['Аргон', 'Кислород', 'Азот', 'Водород'], correct: 0, difficulty: 2 },
        { id: 'chem-34', question: 'Что такое аллотропия?', options: ['Существование элемента в разных формах', 'Изомерия', 'Полимеризация', 'Гибридизация'], correct: 0, difficulty: 2 },
        { id: 'chem-35', question: 'Какова формула азотной кислоты?', options: ['HNO₃', 'H₂SO₄', 'HCl', 'H₃PO₄'], correct: 0, difficulty: 2 },
        { id: 'chem-36', question: 'Что такое коррозия?', options: ['Разрушение металла', 'Плавление', 'Испарение', 'Растворение'], correct: 0, difficulty: 2 },
        { id: 'chem-37', question: 'Какой металл используют для защиты от коррозии?', options: ['Цинк', 'Медь', 'Золото', 'Серебро'], correct: 0, difficulty: 2 },
        { id: 'chem-38', question: 'Что такое электроотрицательность?', options: ['Способность атома притягивать электроны', 'Заряд ядра', 'Масса атома', 'Радиус атома'], correct: 0, difficulty: 2 },
        { id: 'chem-39', question: 'Какой элемент самый электроотрицательный?', options: ['Фтор', 'Кислород', 'Хлор', 'Азот'], correct: 0, difficulty: 2 },
        { id: 'chem-40', question: 'Что такое окислитель?', options: ['Вещество, принимающее электроны', 'Вещество, отдающее электроны', 'Катализатор', 'Растворитель'], correct: 0, difficulty: 2 },
        { id: 'chem-41', question: 'Какова формула гидроксида натрия?', options: ['NaOH', 'KOH', 'Ca(OH)₂', 'Mg(OH)₂'], correct: 0, difficulty: 2 },
        { id: 'chem-42', question: 'Что такое восстановитель?', options: ['Вещество, отдающее электроны', 'Вещество, принимающее электроны', 'Катализатор', 'Ингибитор'], correct: 0, difficulty: 2 },
        { id: 'chem-43', question: 'Какой тип связи в молекуле NaCl?', options: ['Ионная', 'Ковалентная', 'Металлическая', 'Водородная'], correct: 0, difficulty: 2 },
        { id: 'chem-44', question: 'Что такое дистилляция?', options: ['Разделение жидкостей по температуре кипения', 'Фильтрация', 'Осаждение', 'Кристаллизация'], correct: 0, difficulty: 2 },
        { id: 'chem-45', question: 'Какой тип связи в молекуле H₂O?', options: ['Ковалентная полярная', 'Ионная', 'Металлическая', 'Ковалентная неполярная'], correct: 0, difficulty: 2 },
        { id: 'chem-46', question: 'Что такое изотопы?', options: ['Атомы с разным числом нейтронов', 'Разные элементы', 'Разные соединения', 'Ионы'], correct: 0, difficulty: 2 },
        { id: 'chem-47', question: 'Какой элемент имеет атомный номер 1?', options: ['Водород', 'Гелий', 'Литий', 'Углерод'], correct: 0, difficulty: 2 },
        { id: 'chem-48', question: 'Что такое период в таблице Менделеева?', options: ['Горизонтальный ряд элементов', 'Вертикальный столбец', 'Группа металлов', 'Семейство элементов'], correct: 0, difficulty: 2 },
        { id: 'chem-49', question: 'Какой элемент имеет атомный номер 6?', options: ['Углерод', 'Кислород', 'Азот', 'Бор'], correct: 0, difficulty: 2 },
        { id: 'chem-50', question: 'Что такое группа в таблице Менделеева?', options: ['Вертикальный столбец элементов', 'Горизонтальный ряд', 'Семейство газов', 'Ряд металлов'], correct: 0, difficulty: 2 },
        
        // Блок 3: Органическая химия (51-75)
        { id: 'chem-51', question: 'Что такое углеводороды?', options: ['Соединения углерода и водорода', 'Углеводы', 'Жиры', 'Белки'], correct: 0, difficulty: 3 },
        { id: 'chem-52', question: 'Какова формула этана?', options: ['C₂H₆', 'CH₄', 'C₃H₈', 'C₂H₄'], correct: 0, difficulty: 3 },
        { id: 'chem-53', question: 'Что такое алканы?', options: ['Предельные углеводороды', 'Непредельные углеводороды', 'Ароматические соединения', 'Спирты'], correct: 0, difficulty: 3 },
        { id: 'chem-54', question: 'Какова формула этилового спирта?', options: ['C₂H₅OH', 'CH₃OH', 'C₃H₇OH', 'C₄H₉OH'], correct: 0, difficulty: 3 },
        { id: 'chem-55', question: 'Что такое алкены?', options: ['Углеводороды с двойной связью', 'Предельные углеводороды', 'Ароматические соединения', 'Спирты'], correct: 0, difficulty: 3 },
        { id: 'chem-56', question: 'Какова формула уксусной кислоты?', options: ['CH₃COOH', 'HCOOH', 'C₂H₅COOH', 'C₃H₇COOH'], correct: 0, difficulty: 3 },
        { id: 'chem-57', question: 'Что такое изомерия?', options: ['Одинаковый состав, разное строение', 'Одинаковое строение', 'Разный состав', 'Полимеризация'], correct: 0, difficulty: 3 },
        { id: 'chem-58', question: 'Какова формула бензола?', options: ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₇H₈'], correct: 0, difficulty: 3 },
        { id: 'chem-59', question: 'Что такое функциональная группа?', options: ['Группа атомов, определяющая свойства', 'Молекула', 'Атом', 'Ион'], correct: 0, difficulty: 3 },
        { id: 'chem-60', question: 'Какая функциональная группа у спиртов?', options: ['-OH', '-COOH', '-CHO', '-NH₂'], correct: 0, difficulty: 3 },
        { id: 'chem-61', question: 'Что такое эфиры?', options: ['Соединения типа R-O-R', 'Спирты', 'Кислоты', 'Альдегиды'], correct: 0, difficulty: 3 },
        { id: 'chem-62', question: 'Какая функциональная группа у альдегидов?', options: ['-CHO', '-OH', '-COOH', '-CO-'], correct: 0, difficulty: 3 },
        { id: 'chem-63', question: 'Что такое полимеры?', options: ['Макромолекулы из повторяющихся звеньев', 'Мономеры', 'Простые вещества', 'Соли'], correct: 0, difficulty: 3 },
        { id: 'chem-64', question: 'Какова формула глюкозы?', options: ['C₆H₁₂O₆', 'C₁₂H₂₂O₁₁', 'C₆H₁₀O₅', 'CH₂O'], correct: 0, difficulty: 3 },
        { id: 'chem-65', question: 'Что такое крахмал?', options: ['Полисахарид', 'Моносахарид', 'Дисахарид', 'Белок'], correct: 0, difficulty: 3 },
        { id: 'chem-66', question: 'Какова формула сахарозы?', options: ['C₁₂H₂₂O₁₁', 'C₆H₁₂O₆', 'C₆H₁₀O₅', 'CH₂O'], correct: 0, difficulty: 3 },
        { id: 'chem-67', question: 'Что такое аминокислоты?', options: ['Строительные блоки белков', 'Углеводы', 'Жиры', 'Нуклеотиды'], correct: 0, difficulty: 3 },
        { id: 'chem-68', question: 'Какая связь соединяет аминокислоты в белке?', options: ['Пептидная', 'Ионная', 'Водородная', 'Гликозидная'], correct: 0, difficulty: 3 },
        { id: 'chem-69', question: 'Что такое денатурация белка?', options: ['Разрушение структуры белка', 'Синтез белка', 'Гидролиз', 'Полимеризация'], correct: 0, difficulty: 3 },
        { id: 'chem-70', question: 'Какова формула глицерина?', options: ['C₃H₈O₃', 'C₂H₆O₂', 'C₄H₁₀O₄', 'CH₄O'], correct: 0, difficulty: 3 },
        { id: 'chem-71', question: 'Что такое жиры?', options: ['Эфиры глицерина и жирных кислот', 'Углеводы', 'Белки', 'Нуклеиновые кислоты'], correct: 0, difficulty: 3 },
        { id: 'chem-72', question: 'Что такое гидрирование?', options: ['Присоединение водорода', 'Отщепление водорода', 'Окисление', 'Восстановление'], correct: 0, difficulty: 3 },
        { id: 'chem-73', question: 'Какой процесс используется для получения маргарина?', options: ['Гидрирование масел', 'Дистилляция', 'Крекинг', 'Полимеризация'], correct: 0, difficulty: 3 },
        { id: 'chem-74', question: 'Что такое крекинг?', options: ['Расщепление углеводородов', 'Соединение молекул', 'Полимеризация', 'Гидрирование'], correct: 0, difficulty: 3 },
        { id: 'chem-75', question: 'Какова формула ацетилена?', options: ['C₂H₂', 'C₂H₄', 'C₂H₆', 'CH₄'], correct: 0, difficulty: 3 },
        
        // Блок 4: Биохимия и медицинская химия (76-100)
        { id: 'chem-76', question: 'Что такое ферменты с химической точки зрения?', options: ['Белки-катализаторы', 'Углеводы', 'Липиды', 'Нуклеиновые кислоты'], correct: 0, difficulty: 4 },
        { id: 'chem-77', question: 'Какой элемент входит в состав гемоглобина?', options: ['Железо', 'Медь', 'Цинк', 'Магний'], correct: 0, difficulty: 4 },
        { id: 'chem-78', question: 'Что такое АТФ?', options: ['Аденозинтрифосфат - источник энергии', 'Белок', 'Углевод', 'Жир'], correct: 0, difficulty: 4 },
        { id: 'chem-79', question: 'Какой pH крови в норме?', options: ['7.35-7.45', '6.0-6.5', '8.0-8.5', '5.5-6.0'], correct: 0, difficulty: 4 },
        { id: 'chem-80', question: 'Что такое буферная система?', options: ['Система, поддерживающая постоянство pH', 'Фильтр', 'Катализатор', 'Ингибитор'], correct: 0, difficulty: 4 },
        { id: 'chem-81', question: 'Какой витамин является антиоксидантом?', options: ['Витамин E', 'Витамин D', 'Витамин K', 'Витамин B12'], correct: 0, difficulty: 4 },
        { id: 'chem-82', question: 'Что такое свободные радикалы?', options: ['Частицы с неспаренным электроном', 'Ионы', 'Молекулы', 'Атомы'], correct: 0, difficulty: 4 },
        { id: 'chem-83', question: 'Какой элемент входит в состав инсулина?', options: ['Цинк', 'Железо', 'Медь', 'Кальций'], correct: 0, difficulty: 4 },
        { id: 'chem-84', question: 'Что такое электролитный баланс?', options: ['Соотношение ионов в организме', 'Баланс воды', 'Баланс белков', 'Баланс жиров'], correct: 0, difficulty: 4 },
        { id: 'chem-85', question: 'Какой ион важен для сокращения мышц?', options: ['Кальций', 'Натрий', 'Хлор', 'Фосфор'], correct: 0, difficulty: 4 },
        { id: 'chem-86', question: 'Что такое осмос?', options: ['Движение воды через мембрану', 'Диффузия газов', 'Транспорт ионов', 'Фильтрация'], correct: 0, difficulty: 4 },
        { id: 'chem-87', question: 'Какова роль натрия в организме?', options: ['Поддержание водного баланса', 'Транспорт кислорода', 'Синтез белков', 'Хранение энергии'], correct: 0, difficulty: 4 },
        { id: 'chem-88', question: 'Что такое метаболизм?', options: ['Совокупность химических реакций в организме', 'Пищеварение', 'Дыхание', 'Кровообращение'], correct: 0, difficulty: 4 },
        { id: 'chem-89', question: 'Какой процесс - анаболизм?', options: ['Синтез сложных веществ', 'Распад веществ', 'Окисление', 'Восстановление'], correct: 0, difficulty: 4 },
        { id: 'chem-90', question: 'Что такое катаболизм?', options: ['Распад сложных веществ', 'Синтез веществ', 'Рост клеток', 'Деление клеток'], correct: 0, difficulty: 4 },
        { id: 'chem-91', question: 'Какой витамин синтезируется в коже?', options: ['Витамин D', 'Витамин A', 'Витамин C', 'Витамин B1'], correct: 0, difficulty: 4 },
        { id: 'chem-92', question: 'Что такое гликоген?', options: ['Запасной углевод в печени', 'Белок', 'Жир', 'Нуклеиновая кислота'], correct: 0, difficulty: 4 },
        { id: 'chem-93', question: 'Какой гормон регулирует уровень глюкозы?', options: ['Инсулин', 'Адреналин', 'Тироксин', 'Кортизол'], correct: 0, difficulty: 4 },
        { id: 'chem-94', question: 'Что такое кетоновые тела?', options: ['Продукты распада жиров', 'Углеводы', 'Белки', 'Витамины'], correct: 0, difficulty: 4 },
        { id: 'chem-95', question: 'Какой фермент расщепляет крахмал?', options: ['Амилаза', 'Липаза', 'Протеаза', 'Нуклеаза'], correct: 0, difficulty: 4 },
        { id: 'chem-96', question: 'Что такое пепсин?', options: ['Фермент, расщепляющий белки', 'Гормон', 'Витамин', 'Углевод'], correct: 0, difficulty: 4 },
        { id: 'chem-97', question: 'Какой фермент расщепляет жиры?', options: ['Липаза', 'Амилаза', 'Протеаза', 'Лактаза'], correct: 0, difficulty: 4 },
        { id: 'chem-98', question: 'Что такое холестерин?', options: ['Липид, компонент мембран', 'Углевод', 'Белок', 'Витамин'], correct: 0, difficulty: 4 },
        { id: 'chem-99', question: 'Какой тип холестерина считается "хорошим"?', options: ['ЛПВП', 'ЛПНП', 'ЛПОНП', 'Триглицериды'], correct: 0, difficulty: 4 },
        { id: 'chem-100', question: 'Что такое антиоксиданты?', options: ['Вещества, нейтрализующие свободные радикалы', 'Окислители', 'Катализаторы', 'Ферменты'], correct: 0, difficulty: 4 }
    ];
    
    // Добавляем пояснения
    questions.forEach(q => {
        q.explanation = 'Проверьте свои знания в области химии.';
    });
    
    // Группируем по уровням сложности
    const groupedQuestions = {};
    questions.forEach(q => {
        if (!groupedQuestions[q.difficulty]) groupedQuestions[q.difficulty] = [];
        groupedQuestions[q.difficulty].push(q);
    });
    
    return groupedQuestions;
}

// Генерация 100 уникальных вопросов для теста по биологии
function generateBiologyQuestions() {
    const questions = [
        // Блок 1: Клеточная биология (1-25)
        { id: 'bio-1', question: 'Что является основной структурной единицей живого организма?', options: ['Клетка', 'Ткань', 'Орган', 'Молекула'], correct: 0, difficulty: 1 },
        { id: 'bio-2', question: 'Сколько хромосом в клетках человека?', options: ['46', '23', '48', '44'], correct: 0, difficulty: 1 },
        { id: 'bio-3', question: 'Какая органелла называется "энергетической станцией" клетки?', options: ['Митохондрия', 'Ядро', 'Рибосома', 'Лизосома'], correct: 0, difficulty: 1 },
        { id: 'bio-4', question: 'Где хранится генетическая информация клетки?', options: ['В ядре', 'В цитоплазме', 'В рибосомах', 'В мембране'], correct: 0, difficulty: 1 },
        { id: 'bio-5', question: 'Что такое ДНК?', options: ['Дезоксирибонуклеиновая кислота', 'Белок', 'Углевод', 'Жир'], correct: 0, difficulty: 1 },
        { id: 'bio-6', question: 'Какой процесс деления соматических клеток?', options: ['Митоз', 'Мейоз', 'Амитоз', 'Апоптоз'], correct: 0, difficulty: 1 },
        { id: 'bio-7', question: 'Где происходит синтез белка?', options: ['В рибосомах', 'В ядре', 'В митохондриях', 'В лизосомах'], correct: 0, difficulty: 1 },
        { id: 'bio-8', question: 'Что такое хромосомы?', options: ['Структуры, содержащие ДНК', 'Белки', 'Органеллы', 'Ферменты'], correct: 0, difficulty: 1 },
        { id: 'bio-9', question: 'Какая органелла отвечает за переваривание веществ в клетке?', options: ['Лизосома', 'Митохондрия', 'Рибосома', 'Ядро'], correct: 0, difficulty: 1 },
        { id: 'bio-10', question: 'Что защищает и поддерживает форму клетки?', options: ['Клеточная мембрана', 'Ядро', 'Цитоплазма', 'Рибосомы'], correct: 0, difficulty: 1 },
        { id: 'bio-11', question: 'Сколько пар хромосом у человека?', options: ['23', '46', '22', '24'], correct: 0, difficulty: 1 },
        { id: 'bio-12', question: 'Что такое цитоплазма?', options: ['Внутреннее содержимое клетки', 'Оболочка клетки', 'Ядро', 'Хромосома'], correct: 0, difficulty: 1 },
        { id: 'bio-13', question: 'Какие клетки не имеют ядра?', options: ['Эритроциты', 'Лейкоциты', 'Нейроны', 'Миоциты'], correct: 0, difficulty: 1 },
        { id: 'bio-14', question: 'Что такое органеллы?', options: ['Структуры внутри клетки', 'Типы клеток', 'Ткани', 'Органы'], correct: 0, difficulty: 1 },
        { id: 'bio-15', question: 'Какой органелла присутствует только в растительных клетках?', options: ['Хлоропласт', 'Митохондрия', 'Рибосома', 'Ядро'], correct: 0, difficulty: 1 },
        { id: 'bio-16', question: 'Что такое РНК?', options: ['Рибонуклеиновая кислота', 'Белок', 'Жир', 'Углевод'], correct: 0, difficulty: 1 },
        { id: 'bio-17', question: 'Какой процесс образования половых клеток?', options: ['Мейоз', 'Митоз', 'Амитоз', 'Бинарное деление'], correct: 0, difficulty: 1 },
        { id: 'bio-18', question: 'Что такое ген?', options: ['Участок ДНК', 'Хромосома', 'Клетка', 'Белок'], correct: 0, difficulty: 1 },
        { id: 'bio-19', question: 'Какая структура контролирует обмен веществ между клеткой и средой?', options: ['Мембрана', 'Ядро', 'Рибосома', 'Митохондрия'], correct: 0, difficulty: 1 },
        { id: 'bio-20', question: 'Сколько хромосом в половых клетках человека?', options: ['23', '46', '22', '44'], correct: 0, difficulty: 1 },
        { id: 'bio-21', question: 'Что такое аппарат Гольджи?', options: ['Органелла для упаковки веществ', 'Энергетическая станция', 'Центр синтеза белка', 'Хранилище ДНК'], correct: 0, difficulty: 1 },
        { id: 'bio-22', question: 'Какие клетки способны к фагоцитозу?', options: ['Лейкоциты', 'Эритроциты', 'Тромбоциты', 'Нейроны'], correct: 0, difficulty: 1 },
        { id: 'bio-23', question: 'Что такое эндоплазматическая сеть?', options: ['Система канальцев в клетке', 'Ядро клетки', 'Мембрана', 'Цитоплазма'], correct: 0, difficulty: 1 },
        { id: 'bio-24', question: 'Какой процесс называется апоптозом?', options: ['Программируемая гибель клетки', 'Деление клетки', 'Рост клетки', 'Питание клетки'], correct: 0, difficulty: 1 },
        { id: 'bio-25', question: 'Что такое стволовые клетки?', options: ['Недифференцированные клетки', 'Нервные клетки', 'Мышечные клетки', 'Костные клетки'], correct: 0, difficulty: 1 },
        
        // Блок 2: Анатомия и физиология (26-50)
        { id: 'bio-26', question: 'Какой орган является центральным в кровеносной системе?', options: ['Сердце', 'Печень', 'Почки', 'Легкие'], correct: 0, difficulty: 2 },
        { id: 'bio-27', question: 'Сколько камер в сердце человека?', options: ['4', '2', '3', '5'], correct: 0, difficulty: 2 },
        { id: 'bio-28', question: 'Какой орган вырабатывает инсулин?', options: ['Поджелудочная железа', 'Печень', 'Почки', 'Желудок'], correct: 0, difficulty: 2 },
        { id: 'bio-29', question: 'Где происходит газообмен в легких?', options: ['В альвеолах', 'В бронхах', 'В трахее', 'В плевре'], correct: 0, difficulty: 2 },
        { id: 'bio-30', question: 'Какой орган фильтрует кровь от токсинов?', options: ['Печень', 'Сердце', 'Легкие', 'Желудок'], correct: 0, difficulty: 2 },
        { id: 'bio-31', question: 'Сколько костей в скелете взрослого человека?', options: ['206', '210', '200', '250'], correct: 0, difficulty: 2 },
        { id: 'bio-32', question: 'Какая железа регулирует обмен веществ?', options: ['Щитовидная железа', 'Гипофиз', 'Надпочечники', 'Тимус'], correct: 0, difficulty: 2 },
        { id: 'bio-33', question: 'Какой отдел мозга отвечает за координацию движений?', options: ['Мозжечок', 'Кора', 'Продолговатый мозг', 'Гипоталамус'], correct: 0, difficulty: 2 },
        { id: 'bio-34', question: 'Где вырабатываются эритроциты?', options: ['В костном мозге', 'В печени', 'В селезенке', 'В почках'], correct: 0, difficulty: 2 },
        { id: 'bio-35', question: 'Какой гормон вырабатывается надпочечниками при стрессе?', options: ['Адреналин', 'Инсулин', 'Тироксин', 'Тестостерон'], correct: 0, difficulty: 2 },
        { id: 'bio-36', question: 'Сколько литров крови в организме взрослого человека?', options: ['4-6 литров', '2-3 литра', '8-10 литров', '1-2 литра'], correct: 0, difficulty: 2 },
        { id: 'bio-37', question: 'Какой орган является самым большим внутренним органом?', options: ['Печень', 'Легкие', 'Сердце', 'Почки'], correct: 0, difficulty: 2 },
        { id: 'bio-38', question: 'Где начинается переваривание белков?', options: ['В желудке', 'Во рту', 'В кишечнике', 'В пищеводе'], correct: 0, difficulty: 2 },
        { id: 'bio-39', question: 'Какой витамин синтезируется в коже под действием солнца?', options: ['Витамин D', 'Витамин C', 'Витамин A', 'Витамин B12'], correct: 0, difficulty: 2 },
        { id: 'bio-40', question: 'Какая кровь течет по легочным артериям?', options: ['Венозная', 'Артериальная', 'Смешанная', 'Капиллярная'], correct: 0, difficulty: 2 },
        { id: 'bio-41', question: 'Где всасываются питательные вещества?', options: ['В тонком кишечнике', 'В желудке', 'В толстом кишечнике', 'В пищеводе'], correct: 0, difficulty: 2 },
        { id: 'bio-42', question: 'Какой отдел нервной системы управляет внутренними органами?', options: ['Вегетативная', 'Соматическая', 'Центральная', 'Периферическая'], correct: 0, difficulty: 2 },
        { id: 'bio-43', question: 'Сколько пар черепно-мозговых нервов у человека?', options: ['12', '10', '14', '8'], correct: 0, difficulty: 2 },
        { id: 'bio-44', question: 'Какой орган вырабатывает желчь?', options: ['Печень', 'Желчный пузырь', 'Поджелудочная железа', 'Желудок'], correct: 0, difficulty: 2 },
        { id: 'bio-45', question: 'Где находится гипофиз?', options: ['В головном мозге', 'В шее', 'В груди', 'В брюшной полости'], correct: 0, difficulty: 2 },
        { id: 'bio-46', question: 'Какие клетки крови отвечают за иммунитет?', options: ['Лейкоциты', 'Эритроциты', 'Тромбоциты', 'Плазма'], correct: 0, difficulty: 2 },
        { id: 'bio-47', question: 'Какой орган регулирует водно-солевой баланс?', options: ['Почки', 'Печень', 'Легкие', 'Сердце'], correct: 0, difficulty: 2 },
        { id: 'bio-48', question: 'Где находится вестибулярный аппарат?', options: ['Во внутреннем ухе', 'В головном мозге', 'В глазах', 'В носу'], correct: 0, difficulty: 2 },
        { id: 'bio-49', question: 'Какой гормон регулирует уровень глюкозы в крови?', options: ['Инсулин', 'Адреналин', 'Тироксин', 'Кортизол'], correct: 0, difficulty: 2 },
        { id: 'bio-50', question: 'Сколько позвонков в позвоночнике человека?', options: ['33-34', '26-27', '40-41', '20-21'], correct: 0, difficulty: 2 },
        
        // Блок 3: Генетика и наследственность (51-75)
        { id: 'bio-51', question: 'Кто открыл законы наследственности?', options: ['Грегор Мендель', 'Чарльз Дарвин', 'Луи Пастер', 'Роберт Кох'], correct: 0, difficulty: 3 },
        { id: 'bio-52', question: 'Что такое генотип?', options: ['Совокупность генов организма', 'Внешние признаки', 'Хромосомы', 'ДНК'], correct: 0, difficulty: 3 },
        { id: 'bio-53', question: 'Что такое фенотип?', options: ['Внешние признаки организма', 'Набор генов', 'Хромосомы', 'ДНК'], correct: 0, difficulty: 3 },
        { id: 'bio-54', question: 'Какой признак называется доминантным?', options: ['Проявляющийся в гетерозиготе', 'Скрытый', 'Промежуточный', 'Летальный'], correct: 0, difficulty: 3 },
        { id: 'bio-55', question: 'Что такое мутация?', options: ['Изменение в ДНК', 'Норма', 'Адаптация', 'Рост'], correct: 0, difficulty: 3 },
        { id: 'bio-56', question: 'Какой тип наследования гемофилии?', options: ['Сцепленное с X-хромосомой', 'Аутосомно-доминантное', 'Аутосомно-рецессивное', 'Y-сцепленное'], correct: 0, difficulty: 3 },
        { id: 'bio-57', question: 'Что такое аллели?', options: ['Варианты одного гена', 'Разные гены', 'Хромосомы', 'Белки'], correct: 0, difficulty: 3 },
        { id: 'bio-58', question: 'Какие хромосомы определяют пол у человека?', options: ['X и Y', 'A и B', '1 и 2', 'XX только'], correct: 0, difficulty: 3 },
        { id: 'bio-59', question: 'Что такое гетерозигота?', options: ['Организм с разными аллелями', 'Организм с одинаковыми аллелями', 'Мутант', 'Гибрид'], correct: 0, difficulty: 3 },
        { id: 'bio-60', question: 'Какой синдром вызван трисомией по 21 хромосоме?', options: ['Синдром Дауна', 'Синдром Тернера', 'Синдром Клайнфельтера', 'Синдром Патау'], correct: 0, difficulty: 3 },
        { id: 'bio-61', question: 'Что такое кроссинговер?', options: ['Обмен участками хромосом', 'Деление клетки', 'Мутация', 'Репликация'], correct: 0, difficulty: 3 },
        { id: 'bio-62', question: 'Какой закон Менделя описывает расщепление признаков?', options: ['Второй закон', 'Первый закон', 'Третий закон', 'Закон чистоты гамет'], correct: 0, difficulty: 3 },
        { id: 'bio-63', question: 'Что такое полное доминирование?', options: ['Доминантный аллель полностью подавляет рецессивный', 'Оба аллеля проявляются', 'Промежуточное наследование', 'Сцепленное наследование'], correct: 0, difficulty: 3 },
        { id: 'bio-64', question: 'Какой метод позволяет определить генотип?', options: ['Анализирующее скрещивание', 'Наблюдение', 'Измерение', 'Подсчет'], correct: 0, difficulty: 3 },
        { id: 'bio-65', question: 'Что такое генная инженерия?', options: ['Изменение ДНК искусственным путем', 'Естественный отбор', 'Мутагенез', 'Селекция'], correct: 0, difficulty: 3 },
        { id: 'bio-66', question: 'Какой фермент используется для разрезания ДНК?', options: ['Рестриктаза', 'Лигаза', 'Полимераза', 'Хеликаза'], correct: 0, difficulty: 3 },
        { id: 'bio-67', question: 'Что такое ПЦР?', options: ['Метод копирования ДНК', 'Метод секвенирования', 'Метод клонирования', 'Метод гибридизации'], correct: 0, difficulty: 3 },
        { id: 'bio-68', question: 'Какой организм называется трансгенным?', options: ['С чужеродными генами', 'С мутациями', 'Гибрид', 'Клон'], correct: 0, difficulty: 3 },
        { id: 'bio-69', question: 'Что такое геном?', options: ['Полный набор генов организма', 'Один ген', 'Хромосома', 'Белок'], correct: 0, difficulty: 3 },
        { id: 'bio-70', question: 'Какое заболевание является наследственным?', options: ['Муковисцидоз', 'Грипп', 'Туберкулез', 'Малярия'], correct: 0, difficulty: 3 },
        { id: 'bio-71', question: 'Что такое экспрессия гена?', options: ['Проявление гена в признаке', 'Мутация', 'Репликация', 'Транскрипция'], correct: 0, difficulty: 3 },
        { id: 'bio-72', question: 'Какой процесс - транскрипция?', options: ['Синтез РНК на матрице ДНК', 'Копирование ДНК', 'Синтез белка', 'Деление клетки'], correct: 0, difficulty: 3 },
        { id: 'bio-73', question: 'Что такое трансляция?', options: ['Синтез белка на рибосомах', 'Синтез РНК', 'Копирование ДНК', 'Деление клетки'], correct: 0, difficulty: 3 },
        { id: 'bio-74', question: 'Какой кодон является стартовым?', options: ['АУГ', 'УАА', 'УАГ', 'УГА'], correct: 0, difficulty: 3 },
        { id: 'bio-75', question: 'Что такое интрон?', options: ['Некодирующий участок гена', 'Кодирующий участок', 'Промотор', 'Терминатор'], correct: 0, difficulty: 3 },
        
        // Блок 4: Эволюция и экология (76-100)
        { id: 'bio-76', question: 'Кто создал теорию эволюции?', options: ['Чарльз Дарвин', 'Грегор Мендель', 'Луи Пастер', 'Карл Линней'], correct: 0, difficulty: 4 },
        { id: 'bio-77', question: 'Что такое естественный отбор?', options: ['Выживание наиболее приспособленных', 'Искусственное разведение', 'Мутация', 'Миграция'], correct: 0, difficulty: 4 },
        { id: 'bio-78', question: 'Что такое популяция?', options: ['Группа особей одного вида', 'Все виды в экосистеме', 'Один организм', 'Семья'], correct: 0, difficulty: 4 },
        { id: 'bio-79', question: 'Что такое экосистема?', options: ['Сообщество организмов и среда', 'Один вид', 'Популяция', 'Биосфера'], correct: 0, difficulty: 4 },
        { id: 'bio-80', question: 'Какой фактор является абиотическим?', options: ['Температура', 'Хищничество', 'Конкуренция', 'Паразитизм'], correct: 0, difficulty: 4 },
        { id: 'bio-81', question: 'Что такое пищевая цепь?', options: ['Последовательность питания организмов', 'Цепочка ДНК', 'Цепь мутаций', 'Эволюционный ряд'], correct: 0, difficulty: 4 },
        { id: 'bio-82', question: 'Кто находится на первом трофическом уровне?', options: ['Продуценты', 'Консументы', 'Редуценты', 'Хищники'], correct: 0, difficulty: 4 },
        { id: 'bio-83', question: 'Что такое симбиоз?', options: ['Взаимовыгодное сосуществование', 'Паразитизм', 'Хищничество', 'Конкуренция'], correct: 0, difficulty: 4 },
        { id: 'bio-84', question: 'Какой газ выделяют растения при фотосинтезе?', options: ['Кислород', 'Углекислый газ', 'Азот', 'Водород'], correct: 0, difficulty: 4 },
        { id: 'bio-85', question: 'Что такое биосфера?', options: ['Оболочка Земли с жизнью', 'Атмосфера', 'Гидросфера', 'Литосфера'], correct: 0, difficulty: 4 },
        { id: 'bio-86', question: 'Какой ученый ввел термин "экология"?', options: ['Эрнст Геккель', 'Чарльз Дарвин', 'Карл Линней', 'Грегор Мендель'], correct: 0, difficulty: 4 },
        { id: 'bio-87', question: 'Что такое ареал?', options: ['Область распространения вида', 'Местообитание', 'Экологическая ниша', 'Популяция'], correct: 0, difficulty: 4 },
        { id: 'bio-88', question: 'Какой вид отбора приводит к усилению признака?', options: ['Направленный', 'Стабилизирующий', 'Дизруптивный', 'Половой'], correct: 0, difficulty: 4 },
        { id: 'bio-89', question: 'Что такое рудименты?', options: ['Недоразвитые органы', 'Развитые органы', 'Новые органы', 'Измененные органы'], correct: 0, difficulty: 4 },
        { id: 'bio-90', question: 'Что такое атавизмы?', options: ['Возврат к признакам предков', 'Новые признаки', 'Мутации', 'Адаптации'], correct: 0, difficulty: 4 },
        { id: 'bio-91', question: 'Какой вид изоляции способствует видообразованию?', options: ['Географическая', 'Временная', 'Поведенческая', 'Все перечисленные'], correct: 3, difficulty: 4 },
        { id: 'bio-92', question: 'Что такое конвергенция?', options: ['Сходство неродственных видов', 'Расхождение признаков', 'Мутация', 'Наследование'], correct: 0, difficulty: 4 },
        { id: 'bio-93', question: 'Что изучает палеонтология?', options: ['Ископаемые организмы', 'Современные виды', 'Клетки', 'Гены'], correct: 0, difficulty: 4 },
        { id: 'bio-94', question: 'Какой эры не существует?', options: ['Протозойская', 'Палеозойская', 'Мезозойская', 'Кайнозойская'], correct: 0, difficulty: 4 },
        { id: 'bio-95', question: 'Что такое ароморфоз?', options: ['Крупное эволюционное изменение', 'Мелкое приспособление', 'Дегенерация', 'Мутация'], correct: 0, difficulty: 4 },
        { id: 'bio-96', question: 'Какой процесс противоположен прогрессу?', options: ['Регресс', 'Ароморфоз', 'Идиоадаптация', 'Дивергенция'], correct: 0, difficulty: 4 },
        { id: 'bio-97', question: 'Что такое биогеоценоз?', options: ['Экосистема суши', 'Водная экосистема', 'Популяция', 'Вид'], correct: 0, difficulty: 4 },
        { id: 'bio-98', question: 'Какой круговорот наиболее важен для жизни?', options: ['Углеродный', 'Серный', 'Фосфорный', 'Азотный'], correct: 0, difficulty: 4 },
        { id: 'bio-99', question: 'Что такое сукцессия?', options: ['Смена экосистем', 'Эволюция', 'Мутация', 'Адаптация'], correct: 0, difficulty: 4 },
        { id: 'bio-100', question: 'Какой фактор вызывает парниковый эффект?', options: ['CO₂ в атмосфере', 'O₂ в атмосфере', 'N₂ в атмосфере', 'Ar в атмосфере'], correct: 0, difficulty: 4 }
    ];
    
    // Добавляем пояснения
    questions.forEach(q => {
        q.explanation = 'Проверьте свои знания в области биологии.';
    });
    
    // Группируем по уровням сложности
    const groupedQuestions = {};
    questions.forEach(q => {
        if (!groupedQuestions[q.difficulty]) groupedQuestions[q.difficulty] = [];
        groupedQuestions[q.difficulty].push(q);
    });
    
    return groupedQuestions;
}

// Генерация 100+ вопросов для теста по специальности
function generateSpecialtyQuestions() {
    const questions = [
        // Блок 1: Интересы и склонности (1-25)
        { id: 'spec-1', question: 'Мне нравится работать с детьми и помогать им чувствовать себя комфортно', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-2', question: 'Я готов нести ответственность за жизнь и здоровье пациентов', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-3', question: 'Мне интересно разбираться в сложных диагностических случаях', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-4', question: 'Я могу долго сохранять концентрацию при выполнении сложных манипуляций', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-5', question: 'Мне нравится работать с современным медицинским оборудованием', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-6', question: 'Я хотел бы заниматься научными исследованиями в медицине', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-7', question: 'Меня интересует психология человеческого поведения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-8', question: 'Я способен быстро принимать решения в стрессовых ситуациях', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-9', question: 'Мне важен личный контакт с пациентами и их семьями', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-10', question: 'Я обращаю внимание на мельчайшие детали и изменения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-11', question: 'Меня привлекает работа в экстренной медицине', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-12', question: 'Я хотел бы стать экспертом в узкой области медицины', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-13', question: 'Мне интересна профилактика заболеваний и здоровый образ жизни', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-14', question: 'Я готов постоянно учиться и осваивать новые методы лечения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-15', question: 'Мне комфортно работать в команде с другими специалистами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-16', question: 'Меня привлекает помощь пациентам в восстановлении после болезней', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-17', question: 'Мне интересна эстетическая медицина и косметология', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-18', question: 'Я готов работать с тяжелобольными пациентами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-19', question: 'Меня интересует генетика и наследственные заболевания', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-20', question: 'Я хотел бы помогать людям в отдаленных районах', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-21', question: 'Мне нравится обучать других и делиться знаниями', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-22', question: 'Я готов к ненормированному рабочему графику', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-23', question: 'Меня привлекают инновационные технологии в медицине', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-24', question: 'Я хочу помогать людям с зависимостями справиться с проблемами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        { id: 'spec-25', question: 'Меня интересует спортивная медицина и работа со спортсменами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 1 },
        
        // Блок 2: Условия работы и готовность (26-50)
        { id: 'spec-26', question: 'Я готов работать с инфекционными больными при соблюдении мер защиты', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-27', question: 'Меня привлекает работа в операционной', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-28', question: 'Я хотел бы заниматься вопросами питания и диетологии', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-29', question: 'Меня интересует работа с пожилыми пациентами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-30', question: 'Я готов к большому объему медицинской документации', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-31', question: 'Мне нравится анализировать результаты обследований', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-32', question: 'Я хотел бы работать в международных медицинских организациях', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-33', question: 'Меня привлекает военная медицина и служба в армии', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-34', question: 'Я готов к частым командировкам и перемещениям', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-35', question: 'Меня интересует онкология и помощь онкобольным', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-36', question: 'Я хотел бы специализироваться на женском здоровье', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-37', question: 'Меня привлекает изучение нервной системы и мозга', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-38', question: 'Мне комфортно работать в условиях поликлиники', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-39', question: 'Меня интересует работа с сердечно-сосудистой системой', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-40', question: 'Я хочу внедрять цифровые технологии в медицинскую практику', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-41', question: 'Мне интересна работа с органами зрения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-42', question: 'Я готов работать с пациентами, нуждающимися в паллиативной помощи', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-43', question: 'Меня привлекает стоматология и челюстно-лицевая хирургия', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-44', question: 'Я хотел бы работать в области репродуктивной медицины', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-45', question: 'Меня интересует радиология и лучевая диагностика', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-46', question: 'Я готов работать в отделении реанимации и интенсивной терапии', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-47', question: 'Мне интересна работа анестезиолога', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-48', question: 'Я хотел бы заниматься аллергологией и иммунологией', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-49', question: 'Меня привлекает эндокринология и гормональные нарушения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        { id: 'spec-50', question: 'Я готов работать с пациентами с хроническими заболеваниями', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 2 },
        
        // Блок 3: Специальности и направления (51-75)
        { id: 'spec-51', question: 'Меня привлекает работа терапевта общей практики', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-52', question: 'Я хотел бы стать хирургом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-53', question: 'Меня интересует работа педиатра', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-54', question: 'Я вижу себя кардиологом в будущем', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-55', question: 'Меня привлекает специальность невролога', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-56', question: 'Я хотел бы работать офтальмологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-57', question: 'Меня интересует работа психиатра или психотерапевта', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-58', question: 'Я вижу себя дерматологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-59', question: 'Меня привлекает гинекология и акушерство', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-60', question: 'Я хотел бы работать урологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-61', question: 'Меня интересует травматология и ортопедия', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-62', question: 'Я вижу себя гастроэнтерологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-63', question: 'Меня привлекает пульмонология', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-64', question: 'Я хотел бы работать нефрологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-65', question: 'Меня интересует гематология', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-66', question: 'Я вижу себя инфекционистом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-67', question: 'Меня привлекает работа патологоанатома', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-68', question: 'Я хотел бы работать в скорой помощи', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-69', question: 'Меня интересует работа семейного врача', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-70', question: 'Я вижу себя ревматологом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-71', question: 'Меня привлекает работа оториноларинголога (ЛОР)', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-72', question: 'Я хотел бы работать в области физиотерапии', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-73', question: 'Меня интересует работа в клинической лаборатории', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-74', question: 'Я вижу себя нейрохирургом', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        { id: 'spec-75', question: 'Меня привлекает пластическая хирургия', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 3 },
        
        // Блок 4: Личные качества и ценности (76-100)
        { id: 'spec-76', question: 'Я умею сохранять спокойствие в критических ситуациях', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-77', question: 'У меня хорошо развита мелкая моторика рук', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-78', question: 'Я способен работать с эмоционально сложными пациентами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-79', question: 'Мне легко даются точные науки и математические расчеты', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-80', question: 'Я предпочитаю работу с видимым результатом своего труда', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-81', question: 'Мне важен баланс между работой и личной жизнью', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-82', question: 'Я готов к высокому уровню физической нагрузки на работе', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-83', question: 'Мне важно финансовое вознаграждение за мой труд', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-84', question: 'Я умею находить общий язык с разными людьми', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-85', question: 'Мне интересно изучать новые медицинские публикации', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-86', question: 'Я предпочитаю работать самостоятельно', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-87', question: 'Мне важно признание коллег и пациентов', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-88', question: 'Я способен быстро адаптироваться к изменениям', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-89', question: 'Мне комфортно принимать сложные этические решения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-90', question: 'Я умею слушать и слышать других людей', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-91', question: 'Мне важно постоянное профессиональное развитие', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-92', question: 'Я способен эффективно работать под давлением', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-93', question: 'Мне интересна организационная работа в медицине', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-94', question: 'Я готов работать с пациентами разных культур и традиций', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-95', question: 'Мне важно вносить вклад в развитие медицинской науки', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-96', question: 'Я умею объяснять сложные вещи простыми словами', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-97', question: 'Мне важно помогать людям в трудных жизненных ситуациях', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-98', question: 'Я готов нести ответственность за принятые решения', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-99', question: 'Мне интересна работа с медицинскими данными и аналитикой', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 },
        { id: 'spec-100', question: 'Я вижу свое призвание в медицине', options: ['Полностью согласен', 'Скорее согласен', 'Затрудняюсь ответить', 'Скорее не согласен', 'Полностью не согласен'], correct: 0, difficulty: 4 }
    ];
    
    // Добавляем пояснения
    questions.forEach(q => {
        q.explanation = 'Этот вопрос поможет определить ваши предпочтения в выборе медицинской специальности.';
    });
    
    // Группируем по уровням сложности
    const groupedQuestions = {};
    questions.forEach(q => {
        if (!groupedQuestions[q.difficulty]) groupedQuestions[q.difficulty] = [];
        groupedQuestions[q.difficulty].push(q);
    });
    
    return groupedQuestions;
}

// Начать тест - ИСПРАВЛЕНО: БЕРЕМ СЛУЧАЙНЫЕ 40 ВОПРОСОВ
// Старая функция startTest удалена - используем новую адаптивную систему

// Загрузить вопрос
function loadQuestion() {
    const question = currentTestQuestions[currentQuestionIndex];
    
    // Обновить прогресс
    const progress = ((currentQuestionIndex + 1) / 40) * 100;
    document.getElementById('test-progress').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Вопрос ${currentQuestionIndex + 1} из 40`;
    
    // Обновить панель навигации
    updateQuestionNav();
    
    // Создать HTML для вопроса
    let html = `
        <div class="question-container">
            <div class="question-header">
                <div class="question-number">Вопрос ${currentQuestionIndex + 1} из 40</div>
                <div class="question-actions">
                    <button class="question-action-btn mark" onclick="markQuestion()" id="mark-question-btn">
                        ${markedQuestions[currentQuestionIndex] ? '★ Снять отметку' : '☆ Отметить вопрос'}
                    </button>
                </div>
            </div>
            <div class="question-text">${question.text}</div>
            <div class="options">
    `;
    
    // Добавить варианты ответов
    question.options.forEach((option, index) => {
        const isSelected = testAnswers[currentQuestionIndex] === option.id;
        html += `
            <div class="option ${isSelected ? 'selected' : ''}" onclick="selectAnswer(${index})">
                <input type="radio" name="question-${currentQuestionIndex}" value="${option.id}" ${isSelected ? 'checked' : ''}>
                ${option.text}
            </div>
        `;
    });
    
    html += `</div></div>`;
    
    document.getElementById('questions-container').innerHTML = html;
    
    // Обновить кнопки
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'flex' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < 39 ? 'flex' : 'none';
    document.getElementById('check-btn').style.display = currentQuestionIndex === 39 ? 'flex' : 'none';
    
    // Обновить кнопку отметки
    const markBtn = document.getElementById('mark-question-btn');
    if (markBtn) {
        markBtn.textContent = markedQuestions[currentQuestionIndex] ? '★ Снять отметку' : '☆ Отметить вопрос';
        markBtn.style.backgroundColor = markedQuestions[currentQuestionIndex] ? '#9c27b0' : '#f0f0f0';
        markBtn.style.color = markedQuestions[currentQuestionIndex] ? 'white' : '#333';
    }
    
    // Убираем автопрокрутку, чтобы не было дрожания при скролле
}

// Обновить панель навигации по вопросам
function updateQuestionNav() {
    const navContainer = document.getElementById('question-nav');
    if (!navContainer) return;
    
    navContainer.innerHTML = '';
    
    for (let i = 0; i < 40; i++) {
        const btn = document.createElement('button');
        btn.className = 'question-nav-btn';
        btn.textContent = i + 1;
        
        // Определяем состояние вопроса
        if (i === currentQuestionIndex) {
            btn.classList.add('current');
        } else if (markedQuestions[i]) {
            btn.classList.add('marked');
        } else if (testAnswers[i] !== undefined) {
            btn.classList.add('answered');
        } else {
            btn.classList.add('empty');
        }
        
        btn.addEventListener('click', () => {
            currentQuestionIndex = i;
            loadQuestion();
        });
        
        navContainer.appendChild(btn);
    }
}

// Отметить вопрос
function markQuestion() {
    markedQuestions[currentQuestionIndex] = !markedQuestions[currentQuestionIndex];
    
    // Обновить отображение
    const markBtn = document.getElementById('mark-question-btn');
    if (markBtn) {
        markBtn.textContent = markedQuestions[currentQuestionIndex] ? '★ Снять отметку' : '☆ Отметить вопрос';
        markBtn.style.backgroundColor = markedQuestions[currentQuestionIndex] ? '#9c27b0' : '#f0f0f0';
        markBtn.style.color = markedQuestions[currentQuestionIndex] ? 'white' : '#333';
        
        // Анимация
        markBtn.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            markBtn.style.animation = '';
        }, 500);
    }
    
    // Обновить панель навигации
    updateQuestionNav();
    
    // Показать уведомление
    if (markedQuestions[currentQuestionIndex]) {
        showNotification('Вопрос отмечен!', 'success');
    } else {
        showNotification('Отметка снята', 'info');
    }
}

// Очистить текущий ответ
function clearCurrentAnswer() {
    if (testAnswers[currentQuestionIndex] !== undefined) {
        delete testAnswers[currentQuestionIndex];
        
        // Перезагрузить вопрос
        loadQuestion();
        
        // Показать уведомление
        showNotification('Ответ очищен', 'warning');
    } else {
        showNotification('Нет ответа для очистки', 'info');
    }
}

// Перейти к первому пропущенному вопросу
function goToFirstSkipped() {
    // Ищем первый вопрос без ответа
    for (let i = 0; i < 40; i++) {
        if (testAnswers[i] === undefined) {
            currentQuestionIndex = i;
            loadQuestion();
            
            // Показать уведомление
            showNotification(`Переход к пропущенному вопросу ${i + 1}`, 'info');
            return;
        }
    }
    
    // Если все вопросы отвечены, ищем первый отмеченный
    for (let i = 0; i < 40; i++) {
        if (markedQuestions[i]) {
            currentQuestionIndex = i;
            loadQuestion();
            
            // Показать уведомление
            showNotification(`Переход к отмеченному вопросу ${i + 1}`, 'info');
            return;
        }
    }
    
    // Если все вопросы отвечены и не отмечены
    showNotification('Все вопросы отвечены!', 'success');
}

// Показать уведомление
function showNotification(message, type) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.animation = 'fadeIn 0.3s, slideIn 0.3s';
    
    // Цвет в зависимости от типа
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(90deg, #ff9800, #ffc107)';
            break;
        case 'danger':
            notification.style.background = 'linear-gradient(90deg, #ff6b6b, #ff5252)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
    }
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'fadeIn 0.3s reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Выбрать ответ
function selectAnswer(optionIndex) {
    const question = currentTestQuestions[currentQuestionIndex];
    const option = question.options[optionIndex];
    
    // Сохранить ответ
    testAnswers[currentQuestionIndex] = option.id;
    
    // Анимация выбора
    const selectedOption = document.querySelectorAll('.option')[optionIndex];
    selectedOption.style.animation = 'pulse 0.3s';
    setTimeout(() => {
        selectedOption.style.animation = '';
    }, 300);
    
    // Обновить отображение
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === optionIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        } else {
            opt.classList.remove('selected');
            opt.querySelector('input').checked = false;
        }
    });
    
    // Обновить панель навигации
    updateQuestionNav();
}

// Следующий вопрос
function nextQuestion() {
    if (currentQuestionIndex < 39) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

// Предыдущий вопрос
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

// Проверить результаты теста
function checkTestResults() {
    // Проверить, все ли вопросы отвечены
    const answeredCount = Object.keys(testAnswers).length;
    
    if (answeredCount < 40) {
        const confirmSkip = confirm(`Вы ответили только на ${answeredCount} из 40 вопросов. ${40 - answeredCount} вопросов остались без ответа. Хотите все равно завершить тест?`);
        if (!confirmSkip) {
            // Переходим к первому пропущенному вопросу
            goToFirstSkipped();
            return;
        }
    }
    
    let score = 0;
    let maxScore = 0;
    
    // Подсчет результатов в зависимости от типа теста
    if (currentTestType === 'profession' || currentTestType === 'specialty') {
        // Тесты с оценкой от 1 до 5
        currentTestQuestions.forEach((question, index) => {
            const answerId = testAnswers[index];
            const selectedOption = question.options.find(opt => opt.id === answerId);
            if (selectedOption) {
                score += selectedOption.value;
            }
            maxScore += 5; // Максимальный балл за вопрос
        });
        
        const percentage = Math.round((score / maxScore) * 100);
        
        // Определить результат
        let title, message;
        if (percentage >= 80) {
            title = "Отличный результат! 🎉";
            message = "У вас явная склонность к медицинской профессии. Рекомендуем рассмотреть поступление в медицинский вуз. Ваши сильные стороны: ответственность, эмпатия, готовность к обучению.";
        } else if (percentage >= 60) {
            title = "Хороший результат! 👍";
            message = "Вы проявляете интерес к медицине. Рекомендуем дополнительно изучить медицинские специальности, пройти практику в медицинском учреждении для более осознанного выбора.";
        } else if (percentage >= 40) {
            title = "Средний результат 🤔";
            message = "Ваши результаты показывают умеренный интерес к медицине. Рассмотрите смежные профессии (медицинская оптика, фармация, медицинская техника) или пройдите консультацию у карьерного психолога.";
        } else {
            title = "Низкий результат 💭";
            message = "Возможно, медицина - не ваш профиль. Рекомендуем пройти другие тесты для определения профессиональных склонностей и рассмотреть другие области (инженерия, IT, естественные науки).";
        }
        
        document.getElementById('result-score').textContent = `${percentage}%`;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
        
    } else if (currentTestType === 'chemistry' || currentTestType === 'biology') {
        // Тесты с правильными/неправильными ответами
        let correctAnswers = 0;
        
        currentTestQuestions.forEach((question, index) => {
            const answerId = testAnswers[index];
            const selectedOption = question.options.find(opt => opt.id === answerId);
            if (selectedOption && selectedOption.value === question.correct) {
                correctAnswers++;
            }
        });
        
        const percentage = Math.round((correctAnswers / 40) * 100);
        
        // Определить результат
        let title, message;
        if (percentage >= 80) {
            title = "Отличные знания! 🎉";
            message = `Вы правильно ответили на ${correctAnswers} из 40 вопросов. Ваши знания достаточны для поступления в медицинский вуз. Продолжайте углублять знания по предмету.`;
        } else if (percentage >= 60) {
            title = "Хорошие знания! 👍";
            message = `Вы правильно ответили на ${correctAnswers} из 40 вопросов. Рекомендуем подтянуть знания для успешной сдачи экзаменов. Обратите внимание на темы, которые вызвали затруднения.`;
        } else if (percentage >= 40) {
            title = "Средний уровень 📚";
            message = `Вы правильно ответили на ${correctAnswers} из 40 вопросов. Необходимо серьезно заняться подготовкой. Рекомендуем начать с базовых понятий и постепенно переходить к более сложным темам.`;
        } else {
            title = "Низкий уровень 💭";
            message = `Вы правильно ответили на ${correctAnswers} из 40 вопросов. Рекомендуем начать изучение предмета с основ. Возможно, вам стоит рассмотреть репетитора или онлайн-курсы для систематической подготовки.`;
        }
        
        document.getElementById('result-score').textContent = `${percentage}%`;
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-message').textContent = message;
    }
    
    // Сохранить результаты для текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (currentUser) {
        if (!currentUser.testResults) {
            currentUser.testResults = {};
        }
        
        // Сохраняем использованные вопросы для истории
        const usedQuestions = currentTestQuestions.map(q => q.id);
        
        currentUser.testResults[currentTestType + '_' + Date.now()] = {
            date: new Date().toISOString(),
            score: score,
            maxScore: maxScore,
            answers: testAnswers,
            markedQuestions: markedQuestions,
            usedQuestions: usedQuestions,
            testType: currentTestType
        };
        
        // Обновить пользователя в localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // Обновить в общем списке пользователей
        const users = JSON.parse(localStorage.getItem(USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
        
        // Обновить статистику в профиле
        updateUserStats(currentUser);
        loadTestHistory(currentUser);
    }
    
    // Показать результаты
    document.getElementById('test-questions-container').classList.remove('active');
    document.getElementById('test-results').classList.add('show');
    
    // Плавная прокрутка к результатам
    setTimeout(() => {
        document.getElementById('test-results').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Показать уведомление
    showNotification('Тест завершен! Результаты сохранены.', 'success');
}

// Проверка авторизации при загрузке
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired');
    
    // Загрузка темы
    loadTheme();
    
    // Инициализация плавающих цветов
    initFloatingFlowers();
    
    try {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        console.log('Current user:', currentUser);
        
        if (currentUser) {
            console.log('User found, showing main content');
            showMainContent(currentUser);
        } else {
            console.log('No current user found, showing auth');
            document.getElementById('auth-container').style.display = 'flex';
            document.getElementById('main-content').style.display = 'none';
        }
    } catch (e) {
        console.error('Error loading user data:', e);
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('main-content').style.display = 'none';
    }
});

// Инициализация плавающих цветов
function initFloatingFlowers() {
    const container = document.getElementById('floatingFlowers');
    if (!container) return;
    
    // Добавляем случайные позиции для цветов
    const flowers = container.querySelectorAll('.flower');
    flowers.forEach((flower, i) => {
        flower.style.animationDuration = `${15 + Math.random() * 20}s`;
        flower.style.animationDelay = `${Math.random() * 10}s`;
        flower.style.left = `${(i * 10) + Math.random() * 5}%`;
    });
}

// Инициализация тестов при загрузке
window.addEventListener('load', () => {
    initializeTests();
});

// ==============================
// БАНК ВОПРОСОВ (ПО КЛАССАМ)
// Только 4 раздела: профориентация, мед.профориентация, химия, биология
// ==============================

const LIKERT_5 = [
    'Совсем не про меня',
    'Скорее нет',
    'Нейтрально',
    'Скорее да',
    'Очень похоже на меня'
];

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function stableId(prefix, idx) {
    return `${prefix}_${idx}`;
}

function normalizeBandLabel(bandStartGrade) {
    const g = parseInt(bandStartGrade, 10);
    if (g <= 4) return '1-4';
    if (g <= 6) return '5-6';
    if (g <= 8) return '7-8';
    if (g === 9) return '9';
    return '10-11';
}

function isOrientationSubjectId(subjectId) {
    if (!subjectId) return false;
    return (
        subjectId === 'profession' ||
        subjectId.startsWith('profession_general_') ||
        subjectId.startsWith('profession_med_')
    );
}

function makeLikertQuestion({ id, question, dimension, gradeBand, subject = 'profession' }) {
    return {
        id,
        kind: 'likert',
        question,
        options: LIKERT_5,
        // Для интерфейса адаптивной сложности
        difficulty: gradeBand === '1-4' ? 1 : gradeBand === '5-6' ? 1 : gradeBand === '7-8' ? 2 : gradeBand === '9' ? 3 : 4,
        dimension,
        gradeBand,
        subject,
        explanation: 'В профориентационных вопросах нет «правильных» ответов — важно отвечать честно.'
    };
}

function generateProfessionGeneralQuestions(bandStartGrade, desiredCount = 64) {
    const band = normalizeBandLabel(bandStartGrade);
    const dims = {
        people: 'Общение и помощь людям',
        analysis: 'Аналитика и системное мышление',
        creativity: 'Творчество и идеи',
        practice: 'Практика и «делать руками»',
        leadership: 'Организация и лидерство',
        responsibility: 'Ответственность и дисциплина'
    };

    const statementsByBand = {
        '1-4': [
            ['people', 'Мне нравится помогать одноклассникам и друзьям.'],
            ['people', 'Мне интересно слушать людей и понимать их настроение.'],
            ['practice', 'Мне нравится что-то собирать, мастерить или чинить.'],
            ['creativity', 'Мне нравится придумывать истории, игры или рисунки.'],
            ['analysis', 'Мне нравится находить закономерности и «почему так».'],
            ['responsibility', 'Я стараюсь делать задания аккуратно и до конца.'],
            ['leadership', 'Мне нравится быть организатором в играх или проектах.'],
            ['practice', 'Мне нравится выполнять задания по шагам (инструкциям).'],
            ['analysis', 'Мне нравится решать задачки и головоломки.'],
            ['responsibility', 'Мне важно, чтобы меня можно было доверять.']
        ],
        '5-6': [
            ['people', 'Мне легко находить общий язык с разными людьми.'],
            ['people', 'Мне нравится объяснять другим то, что я понял(а).'],
            ['analysis', 'Мне интересно сравнивать факты и делать выводы.'],
            ['analysis', 'Мне нравится работать с таблицами, схемами, данными.'],
            ['practice', 'Мне нравится делать практические работы и эксперименты.'],
            ['practice', 'Мне нравится работать с инструментами/оборудованием (аккуратно).'],
            ['creativity', 'Мне нравится придумывать нестандартные решения.'],
            ['creativity', 'Мне нравится делать презентации, проекты, оформлять.'],
            ['leadership', 'Мне нравится распределять задачи в группе.'],
            ['responsibility', 'Мне важны правила и безопасность при работе.']
        ],
        '7-8': [
            ['analysis', 'Мне нравится разбираться в причинах и следствиях.'],
            ['analysis', 'Мне интересно изучать сложные темы шаг за шагом.'],
            ['people', 'Мне важно, чтобы моя работа приносила пользу людям.'],
            ['people', 'Мне комфортно общаться и задавать уточняющие вопросы.'],
            ['practice', 'Мне нравится практиковаться и улучшать навык.'],
            ['practice', 'Мне нравится точность: измерять, проверять, настраивать.'],
            ['responsibility', 'Я умею держать обещания и сроки.'],
            ['responsibility', 'Мне подходит работа, где нельзя ошибаться по мелочам.'],
            ['leadership', 'Мне нравится вести проект и отвечать за результат.'],
            ['creativity', 'Мне интересно создавать новое (идеи, дизайн, подходы).']
        ],
        '9': [
            ['analysis', 'Мне интересно принимать решения на основе данных и фактов.'],
            ['analysis', 'Мне нравится изучать причины ошибок и улучшать процесс.'],
            ['people', 'Мне комфортно вести диалог и задавать неудобные вопросы по делу.'],
            ['people', 'Мне важна работа, где нужно понимать людей.'],
            ['responsibility', 'Мне подходит работа с высокой ответственностью.'],
            ['responsibility', 'Я выдерживаю длительную подготовку ради цели.'],
            ['practice', 'Мне нравится работать руками и видеть результат.'],
            ['practice', 'Мне важна аккуратность и «чистота» выполнения.'],
            ['leadership', 'Мне интересно организовывать людей и процессы.'],
            ['creativity', 'Мне интересно искать нестандартные пути и решения.']
        ],
        '10-11': [
            ['analysis', 'Мне нравится глубоко разбираться в теме и строить систему знаний.'],
            ['analysis', 'Мне комфортно работать с большим объёмом информации.'],
            ['responsibility', 'Я готов(а) отвечать за последствия своих решений.'],
            ['responsibility', 'Я умею работать в режиме дедлайнов.'],
            ['people', 'Мне важно помогать людям и улучшать качество их жизни.'],
            ['people', 'Мне подходит работа, где нужно объяснять сложное простыми словами.'],
            ['practice', 'Мне интересна работа с оборудованием/инструментами.'],
            ['practice', 'Мне важны точность и стандарты качества.'],
            ['leadership', 'Мне интересно управлять проектами/командами.'],
            ['creativity', 'Мне интересно создавать новые продукты/методики/подходы.']
        ]
    };

    const base = statementsByBand[band] || statementsByBand['9'];

    // Расширяем банк, чтобы он реально был большим (особенно для 9–11 классов)
    // и не заканчивался на ~60–90 вопросах.
    const extraByBand = {
        '1-4': {
            people: [
                'Мне нравится заботиться о людях и животных.',
                'Мне нравится поддерживать друзей, если им грустно.',
                'Мне нравится, когда я могу помочь кому-то разобраться.',
                'Мне нравится работать вместе и делиться идеями.',
                'Мне нравится быть внимательным(ой) к другим.'
            ],
            analysis: [
                'Мне интересно узнавать, почему что-то происходит.',
                'Мне нравится искать правильный ответ шаг за шагом.',
                'Мне нравится замечать, что у задач есть правила.',
                'Мне нравится сравнивать и находить отличия.',
                'Мне нравится проверять, всё ли я сделал(а) правильно.'
            ],
            creativity: [
                'Мне нравится придумывать новые идеи.',
                'Мне нравится делать что-то красиво и аккуратно.',
                'Мне нравится придумывать разные варианты решения.',
                'Мне нравится фантазировать и создавать новое.',
                'Мне нравится улучшать то, что уже сделано.'
            ],
            practice: [
                'Мне нравится делать что-то руками и видеть результат.',
                'Мне нравится собирать, мастерить и проверять, как работает.',
                'Мне нравится делать по инструкции и получать хороший результат.',
                'Мне нравится аккуратно выполнять задания.',
                'Мне нравится доводить поделку/работу до конца.'
            ],
            leadership: [
                'Мне нравится помогать группе договориться о правилах.',
                'Мне нравится быть организатором в игре или проекте.',
                'Мне нравится распределять роли, чтобы всем было понятно.',
                'Мне нравится следить, чтобы всем было комфортно в команде.',
                'Мне нравится помогать другим начать и закончить дело.'
            ],
            responsibility: [
                'Мне важно выполнять обещания.',
                'Мне важно соблюдать правила и безопасность.',
                'Мне важно делать задания аккуратно.',
                'Мне важно не забывать важные вещи.',
                'Мне важно доводить начатое до конца.'
            ]
        },
        '5-6': {
            people: [
                'Мне нравится объяснять другим сложное простыми словами.',
                'Мне комфортно задавать вопросы, чтобы понять человека.',
                'Мне нравится помогать людям решать проблемы.',
                'Мне важно, чтобы моя работа была полезной для других.',
                'Мне нравится поддерживать команду и атмосферу.'
            ],
            analysis: [
                'Мне интересно делать выводы из фактов и примеров.',
                'Мне нравится находить причины ошибок и исправлять их.',
                'Мне нравится работать с таблицами, схемами и данными.',
                'Мне нравится планировать шаги решения заранее.',
                'Мне нравится проверять результат и улучшать подход.'
            ],
            creativity: [
                'Мне нравится предлагать несколько вариантов решения.',
                'Мне нравится улучшать проект, чтобы он стал понятнее.',
                'Мне нравится оформлять и презентовать результат.',
                'Мне нравится придумывать идеи под ограничения.',
                'Мне нравится искать необычные, но рабочие подходы.'
            ],
            practice: [
                'Мне нравится выполнять практические задания и эксперименты.',
                'Мне нравится аккуратно работать с оборудованием.',
                'Мне нравится измерять, сравнивать и проверять.',
                'Мне нравится делать что-то руками и улучшать навык.',
                'Мне нравится доводить работу до качественного результата.'
            ],
            leadership: [
                'Мне нравится распределять задачи в группе.',
                'Мне нравится следить за сроками и планом.',
                'Мне нравится координировать работу команды.',
                'Мне нравится договариваться о правилах и обязанностях.',
                'Мне нравится подводить итоги и улучшать процесс.'
            ],
            responsibility: [
                'Мне важно соблюдать правила безопасности.',
                'Мне важно делать работу без спешки и ошибок.',
                'Мне важно проверять себя и исправлять неточности.',
                'Мне важно вести записи/заметки, чтобы не забывать.',
                'Мне важно учиться регулярно, а не «рывками».'
            ]
        },
        '7-8': {
            people: [
                'Мне комфортно общаться и уточнять детали по делу.',
                'Мне нравится помогать людям через понятные инструкции.',
                'Мне нравится работать с обратной связью и улучшать результат.',
                'Мне нравится находить общий язык в команде.',
                'Мне важно, чтобы моя работа помогала другим.'
            ],
            analysis: [
                'Мне нравится разбирать причины и следствия.',
                'Мне нравится анализировать информацию и делать выводы.',
                'Мне нравится искать закономерности и проверять их.',
                'Мне нравится оптимизировать процесс и убирать лишнее.',
                'Мне нравится учиться через разбор ошибок.'
            ],
            creativity: [
                'Мне нравится создавать новые подходы и идеи.',
                'Мне нравится придумывать решения под ограничения.',
                'Мне нравится комбинировать идеи из разных тем.',
                'Мне нравится улучшать продукт/проект по итерациям.',
                'Мне нравится находить неожиданные варианты решения.'
            ],
            practice: [
                'Мне нравится отрабатывать навык до уверенности.',
                'Мне нравится точность: измерять, проверять, настраивать.',
                'Мне нравится работать по алгоритмам и чек-листам.',
                'Мне нравится контролировать качество результата.',
                'Мне нравится аккуратно работать с инструментами/оборудованием.'
            ],
            leadership: [
                'Мне нравится вести проект и отвечать за результат.',
                'Мне нравится планировать этапы работы.',
                'Мне нравится распределять ответственность в команде.',
                'Мне нравится координировать людей и задачи.',
                'Мне нравится организовывать процесс так, чтобы всем было понятно.'
            ],
            responsibility: [
                'Мне важно держать обещания и сроки.',
                'Мне важно делать работу качественно, а не «как получится».',
                'Мне важно фиксировать договорённости и детали.',
                'Мне важно признавать ошибку и исправлять.',
                'Мне важно доводить начатое до результата.'
            ]
        },
        '9': {
            people: [
                'Мне важно понимать людей и их мотивацию.',
                'Мне комфортно вести диалог даже в напряжённой ситуации.',
                'Мне нравится помогать людям принимать решения.',
                'Мне нравится объяснять сложное простыми словами.',
                'Мне нравится работать с обратной связью без обид.'
            ],
            analysis: [
                'Мне нравится принимать решения на основе данных.',
                'Мне нравится разбирать ошибки и улучшать процесс.',
                'Мне нравится строить план подготовки и следовать ему.',
                'Мне нравится сравнивать варианты и выбирать лучший.',
                'Мне нравится находить причинно-следственные связи.'
            ],
            creativity: [
                'Мне нравится искать нестандартные решения.',
                'Мне нравится генерировать идеи и выбирать рабочие.',
                'Мне нравится улучшать продукт/процесс.',
                'Мне нравится комбинировать идеи из разных областей.',
                'Мне нравится находить новые возможности в ограничениях.'
            ],
            practice: [
                'Мне важно соблюдать стандарты качества.',
                'Мне нравится работать аккуратно и точно.',
                'Мне нравится действовать по протоколу/алгоритму.',
                'Мне нравится работать с техникой/инструментами.',
                'Мне нравится проверять результат и исправлять недочёты.'
            ],
            leadership: [
                'Мне нравится организовывать людей и процессы.',
                'Мне нравится вести проект к результату.',
                'Мне нравится распределять задачи и контролировать прогресс.',
                'Мне нравится управлять временем и приоритетами.',
                'Мне нравится договариваться о правилах команды.'
            ],
            responsibility: [
                'Мне подходит работа с высокой ответственностью.',
                'Я выдерживаю длительную подготовку ради цели.',
                'Мне комфортно работать в режиме дедлайнов.',
                'Мне важно отвечать за качество результата.',
                'Мне важно не перекладывать ответственность на других.'
            ]
        },
        '10-11': {
            people: [
                'Мне важно помогать людям осознанно и системно.',
                'Мне комфортно вести сложные разговоры уважительно.',
                'Мне подходит работа, где нужно объяснять сложное простыми словами.',
                'Мне важно действовать этично и корректно.',
                'Мне нравится работать с запросами людей и уточнять детали.'
            ],
            analysis: [
                'Мне нравится структурировать большой объём информации.',
                'Мне нравится строить систему знаний и связи между темами.',
                'Мне нравится проверять гипотезы и делать выводы.',
                'Мне нравится анализировать данные и принимать решения.',
                'Мне нравится искать слабые места и улучшать подход.'
            ],
            creativity: [
                'Мне интересно создавать новые методики/подходы.',
                'Мне нравится искать решения под ограничения.',
                'Мне нравится улучшать продукт на основе обратной связи.',
                'Мне нравится придумывать несколько вариантов и выбирать лучший.',
                'Мне нравится видеть возможности для инноваций.'
            ],
            practice: [
                'Мне важны точность и стандарты качества.',
                'Мне подходит работа по протоколам и чек-листам.',
                'Мне комфортно выполнять точные действия без спешки.',
                'Мне интересно работать с оборудованием/инструментами.',
                'Мне важно фиксировать результат и проверять себя.'
            ],
            leadership: [
                'Мне интересно управлять проектами/командами.',
                'Мне нравится планировать этапы, сроки и риски.',
                'Мне нравится ставить цели и метрики результата.',
                'Мне нравится координировать команду и процессы.',
                'Мне нравится обеспечивать дисциплину и качество в работе.'
            ],
            responsibility: [
                'Я готов(а) отвечать за последствия своих решений.',
                'Я умею работать в режиме дедлайнов.',
                'Мне важна дисциплина подготовки и стабильность.',
                'Мне важно сохранять качество под нагрузкой.',
                'Мне важно нести ответственность за итог.'
            ]
        }
    };

    const baseExpanded = [...base];
    try {
        const extraMap = extraByBand[band] || extraByBand['9'];
        Object.keys(dims).forEach((dimKey) => {
            const arr = extraMap && Array.isArray(extraMap[dimKey]) ? extraMap[dimKey] : [];
            arr.forEach((t) => {
                const text = String(t || '').trim();
                if (text) baseExpanded.push([dimKey, text]);
            });
        });
    } catch {
        // ignore
    }

    // Дедупликация (на случай совпадений из базового и расширенного списка)
    const seenBasePairs = new Set();
    const baseUnique = [];
    for (const pair of baseExpanded) {
        const dim = pair && pair[0] ? String(pair[0]) : '';
        const text = pair && pair[1] ? String(pair[1]).trim() : '';
        if (!dim || !text) continue;
        const k = `${dim}@@${text}`;
        if (seenBasePairs.has(k)) continue;
        seenBasePairs.add(k);
        baseUnique.push([dim, text]);
    }

    // Раздуваем банк до 50+ вопросов, повторяя смысл в разных формулировках
    const variants = [
        (t) => t,
        (t) => t.replace('Мне нравится', 'Мне интересно'),
        (t) => t.replace('Мне нравится', 'Мне по душе'),
        (t) => t.replace('Мне нравится', 'Мне приятно'),
        (t) => t.replace('Мне интересно', 'Мне действительно интересно'),
        (t) => t.replace('Мне важно', 'Для меня важно'),
        (t) => t.replace('Мне важно', 'Мне особенно важно'),
        (t) => t.replace('Мне подходит', 'Мне скорее подходит'),
        (t) => t.replace('Мне подходит', 'Мне обычно подходит')
    ];

    const questions = [];
    let idx = 0;
    // Генерируем без повторов: каждая пара (variant,text) используется максимум 1 раз
    outer: for (let pass = 0; pass < variants.length; pass++) {
        const v = variants[pass];
        for (const [dim, text] of baseUnique) {
            idx++;
            questions.push(
                makeLikertQuestion({
                    id: stableId(`profession_general_${band}`, idx),
                    question: v(text),
                    dimension: dim,
                    gradeBand: band
                })
            );
            if (questions.length >= desiredCount) break outer;
        }
    }

    // Добавим описания измерений (служебные) через explanation в начале
    if (questions.length > 0) {
        questions[0].explanation = `Оценивайте утверждения по шкале. Мы сформируем профиль интересов: ${Object.values(dims).join(', ')}.`;
    }

    return questions;
}

function generateMedicalProfessionQuestions(bandStartGrade, desiredCount = 64) {
    const band = normalizeBandLabel(bandStartGrade);
    const statements = {
        empathy: 'Эмпатия и поддержка',
        stress: 'Стрессоустойчивость',
        accuracy: 'Точность и внимание к деталям',
        science: 'Интерес к науке (био/хим)',
        teamwork: 'Командная работа',
        responsibility: 'Ответственность'
    };

    const base = {
        '1-4': [
            ['empathy', 'Мне важно, чтобы людям рядом было спокойнее.'],
            ['empathy', 'Я стараюсь поддерживать тех, кто расстроен.'],
            ['accuracy', 'Я люблю, когда всё аккуратно и чисто.'],
            ['responsibility', 'Я выполняю обещания и правила.'],
            ['science', 'Мне интересно узнавать, как работает тело человека.'],
            ['teamwork', 'Мне нравится работать вместе и помогать команде.'],
            ['stress', 'Я могу сохранять спокойствие, когда кто-то волнуется.'],
            ['accuracy', 'Мне нравится делать всё по инструкции.'],
            ['science', 'Мне нравится узнавать про животных/растения/человека.'],
            ['responsibility', 'Я стараюсь не забывать важные вещи.']
        ],
        '5-6': [
            ['science', 'Мне интересно, почему возникают болезни и как их предотвращают.'],
            ['science', 'Мне нравятся уроки, где много объяснений про организм.'],
            ['accuracy', 'Мне важны точность и порядок в работе.'],
            ['accuracy', 'Мне нравится замечать мелкие детали.'],
            ['empathy', 'Мне комфортно поддерживать человека, если ему плохо.'],
            ['teamwork', 'Мне нравится работать в группе и распределять роли.'],
            ['responsibility', 'Я понимаю, что ошибки могут быть опасны.'],
            ['stress', 'В сложных ситуациях я действую спокойно.'],
            ['responsibility', 'Мне важно соблюдать правила безопасности.'],
            ['teamwork', 'Мне легче, когда есть общий план команды.']
        ],
        '7-8': [
            ['science', 'Мне интересно изучать анатомию и физиологию человека.'],
            ['science', 'Мне нравится разбираться в причинах симптомов и процессов.'],
            ['empathy', 'Я умею слушать и не обесценивать эмоции человека.'],
            ['stress', 'В напряжённой обстановке я сохраняю концентрацию.'],
            ['accuracy', 'Мне подходит работа, где нужна стерильность и точность.'],
            ['accuracy', 'Я предпочитаю проверять себя, а не «делать на глаз».'],
            ['teamwork', 'Мне комфортно работать по протоколам команды.'],
            ['teamwork', 'Мне важно взаимодействовать с разными специалистами.'],
            ['responsibility', 'Я готов(а) учиться долго и регулярно.'],
            ['responsibility', 'Мне подходит работа, где важно не навредить.']
        ],
        '9': [
            ['science', 'Мне интересно связывать биологию и химию с медициной.'],
            ['science', 'Мне нравится решать задачи и разбирать клинические случаи (на своём уровне).'],
            ['accuracy', 'Мне важно соблюдать алгоритмы и порядок действий.'],
            ['accuracy', 'Мне комфортно работать с измерениями, дозировками, расчётами.'],
            ['empathy', 'Мне важно помогать людям даже в сложных ситуациях.'],
            ['stress', 'Я способен(на) сохранять спокойствие в критический момент.'],
            ['teamwork', 'Мне нравится работа, где нужна команда и координация.'],
            ['responsibility', 'Я готов(а) нести ответственность за решение и результат.'],
            ['responsibility', 'Я готов(а) учиться 6+ лет ради профессии.'],
            ['stress', 'Я могу работать, когда есть давление времени.']
        ],
        '10-11': [
            ['science', 'Мне интересно углублённо изучать биологию/химию/анатомию.'],
            ['science', 'Мне комфортно учиться через практику и разбор ошибок.'],
            ['accuracy', 'Я внимателен(на) к деталям и понимаю цену ошибки.'],
            ['accuracy', 'Мне подходит работа по стандартам и протоколам.'],
            ['empathy', 'Я умею поддерживать человека и сохранять уважение.'],
            ['stress', 'Я сохраняю спокойствие и ясность мышления под нагрузкой.'],
            ['teamwork', 'Мне интересны роли в команде: врач, медсестра, лаборант, фармацевт.'],
            ['responsibility', 'Мне важно работать этично и честно.'],
            ['responsibility', 'Я готов(а) к постоянному обучению в профессии.'],
            ['teamwork', 'Мне важно уметь договариваться и передавать смену/информацию.']
        ]
    };

    const baseList = base[band] || base['9'];

    // Расширяем банк (особенно для 9–11), чтобы не было ощущение «вопросов мало»
    // и чтобы повторов было существенно меньше.
    const extraByBand = {
        '1-4': {
            empathy: [
                'Мне важно поддерживать людей добрым словом.',
                'Мне нравится помогать, если кто-то переживает.',
                'Мне важно не смеяться над ошибками других.',
                'Мне нравится заботиться о тех, кому трудно.',
                'Мне важно быть внимательным(ой) к чувствам других.'
            ],
            stress: [
                'Я могу не паниковать, если что-то пошло не так.',
                'Я стараюсь сохранять спокойствие в сложной ситуации.',
                'Я могу собраться и продолжить дело, даже если страшно.',
                'Я могу действовать спокойно, когда другие волнуются.',
                'Я не сдаюсь сразу, если сложно.'
            ],
            accuracy: [
                'Мне важно делать всё аккуратно и чисто.',
                'Мне нравится работать по инструкции.',
                'Мне нравится проверять результат.',
                'Мне важно не торопиться, чтобы не ошибаться.',
                'Мне нравится, когда всё сделано правильно.'
            ],
            science: [
                'Мне интересно узнавать, как устроено тело человека.',
                'Мне интересно, как работают органы и системы.',
                'Мне нравится узнавать новые факты о здоровье.',
                'Мне интересно, почему люди болеют.',
                'Мне интересно, как помогает медицина.'
            ],
            teamwork: [
                'Мне нравится работать в команде.',
                'Мне важно помогать группе.',
                'Мне нравится, когда у команды есть общий план.',
                'Мне нравится поддерживать других в работе.',
                'Мне комфортно выполнять свою часть задания в группе.'
            ],
            responsibility: [
                'Мне важно соблюдать правила безопасности.',
                'Мне важно выполнять обещания.',
                'Мне важно быть надёжным(ой).',
                'Мне важно доводить дело до конца.',
                'Мне важно не забывать важные вещи.'
            ]
        },
        '5-6': {
            empathy: [
                'Мне важно поддержать человека, если ему плохо.',
                'Мне важно не обесценивать чувства других.',
                'Мне комфортно слушать и помогать человеку успокоиться.',
                'Мне важно относиться к людям уважительно.',
                'Мне важно быть терпеливым(ой) к другим.'
            ],
            stress: [
                'В сложных ситуациях я стараюсь действовать спокойно.',
                'Я могу собраться, когда есть давление времени.',
                'Я не теряюсь, если нужно быстро принять решение.',
                'Я стараюсь сохранять концентрацию в напряжении.',
                'Я могу продолжать работать, даже если устал(а).'
            ],
            accuracy: [
                'Мне важны точность и порядок в работе.',
                'Мне нравится замечать мелкие детали.',
                'Мне важно проверять себя.',
                'Мне важно соблюдать чистоту и аккуратность.',
                'Мне нравится делать всё по правилам.'
            ],
            science: [
                'Мне интересно, почему возникают болезни.',
                'Мне интересно, как предотвращают болезни.',
                'Мне интересно, как лекарства помогают человеку.',
                'Мне нравится узнавать про организм и здоровье.',
                'Мне интересно, как работают анализы и исследования.'
            ],
            teamwork: [
                'Мне нравится работать в группе и распределять роли.',
                'Мне легче, когда есть общий план команды.',
                'Мне комфортно договариваться в группе.',
                'Мне важно выполнять свою часть работы вовремя.',
                'Мне нравится помогать другим участникам команды.'
            ],
            responsibility: [
                'Я понимаю, что ошибки могут быть опасны.',
                'Мне важно соблюдать правила безопасности.',
                'Мне важно делать работу без спешки.',
                'Мне важно учиться регулярно.',
                'Мне важно выполнять задания качественно.'
            ]
        },
        '7-8': {
            empathy: [
                'Мне важно поддерживать человека, даже если ему тяжело.',
                'Я умею слушать и не обесценивать эмоции человека.',
                'Мне важно сохранять уважение в разговоре.',
                'Мне важно помогать человеку чувствовать себя в безопасности.',
                'Мне важно быть тактичным(ой) в общении.'
            ],
            stress: [
                'В напряжённой обстановке я сохраняю концентрацию.',
                'Мне комфортно работать, когда есть ответственность.',
                'Я могу действовать по алгоритму в стрессовой ситуации.',
                'Я могу сохранять спокойствие, если что-то идёт не по плану.',
                'Мне важно не терять самообладание под нагрузкой.'
            ],
            accuracy: [
                'Мне подходит работа, где нужна стерильность и точность.',
                'Я предпочитаю проверять себя, а не «делать на глаз».',
                'Мне важно соблюдать порядок действий.',
                'Мне важно не пропускать мелочи.',
                'Мне важно делать работу по стандарту.'
            ],
            science: [
                'Мне интересно изучать анатомию и физиологию человека.',
                'Мне нравится разбираться в причинах симптомов и процессов.',
                'Мне интересно понимать связь биологии и здоровья.',
                'Мне нравится узнавать, как работают лекарства (в общих чертах).',
                'Мне интересно узнавать про профилактику заболеваний.'
            ],
            teamwork: [
                'Мне комфортно работать по протоколам команды.',
                'Мне важно взаимодействовать с разными специалистами.',
                'Мне важно передавать информацию без искажений.',
                'Мне нравится работать, когда есть роли и ответственность.',
                'Мне важно уважать вклад других в команде.'
            ],
            responsibility: [
                'Мне подходит работа, где важно не навредить.',
                'Я готов(а) учиться долго и регулярно.',
                'Мне важно соблюдать этику и правила.',
                'Мне важно отвечать за качество своей работы.',
                'Мне важно держать дисциплину подготовки.'
            ]
        },
        '9': {
            empathy: [
                'Мне важно помогать людям даже в сложных ситуациях.',
                'Мне важно сохранять уважение к человеку в любой ситуации.',
                'Мне важно не судить человека, а помогать ему.',
                'Мне важно говорить спокойно и поддерживающе.',
                'Мне важно понимать эмоции и потребности человека.',
                'Мне важно соблюдать границы и конфиденциальность.'
            ],
            stress: [
                'Я способен(на) сохранять спокойствие в критический момент.',
                'Я могу работать, когда есть давление времени.',
                'Я могу действовать по алгоритму под стрессом.',
                'Я могу сохранять ясность мышления под нагрузкой.',
                'Я могу держать фокус на задаче, даже если вокруг хаос.',
                'Я могу признавать ошибку и быстро исправлять.'
            ],
            accuracy: [
                'Мне важно соблюдать алгоритмы и порядок действий.',
                'Мне комфортно работать с измерениями и расчётами.',
                'Мне важно проверять дозировки/значения (на своём уровне).',
                'Мне важно не пропускать детали и мелочи.',
                'Мне важно следовать стандартам качества.',
                'Мне важно вести записи аккуратно.'
            ],
            science: [
                'Мне интересно связывать биологию и химию с медициной.',
                'Мне интересно понимать механизмы в организме.',
                'Мне интересно разбирать причины и последствия процессов.',
                'Мне интересно изучать основы лекарств и их действия.',
                'Мне интересно углубляться в темы через задачи и практику.',
                'Мне интересно узнавать про диагностику и анализы.'
            ],
            teamwork: [
                'Мне нравится работа, где нужна команда и координация.',
                'Мне важно чётко передавать информацию в команде.',
                'Мне важно договариваться и соблюдать общий план.',
                'Мне комфортно работать, когда есть роли и ответственность.',
                'Мне важно поддерживать коллег и принимать помощь.',
                'Мне важно соблюдать правила взаимодействия в команде.'
            ],
            responsibility: [
                'Я готов(а) нести ответственность за решение и результат.',
                'Я готов(а) учиться 6+ лет ради профессии.',
                'Мне важно работать этично и честно.',
                'Мне важно понимать последствия своих действий.',
                'Мне важно соблюдать безопасность и протоколы.',
                'Мне важно держать дисциплину подготовки.'
            ]
        },
        '10-11': {
            empathy: [
                'Я умею поддерживать человека и сохранять уважение.',
                'Мне важно сохранять спокойный тон в сложном разговоре.',
                'Мне важно соблюдать конфиденциальность и этику.',
                'Мне важно не обесценивать боль и переживания человека.',
                'Мне важно быть тактичным(ой) и внимательным(ой) к деталям.',
                'Мне важно помогать человеку чувствовать контроль и безопасность.'
            ],
            stress: [
                'Я сохраняю спокойствие и ясность мышления под нагрузкой.',
                'Мне комфортно работать в условиях времени и ответственности.',
                'Я могу держать концентрацию при усталости.',
                'Я могу быстро переключаться между задачами без паники.',
                'Я могу действовать по протоколу даже в стрессовой ситуации.',
                'Я могу сохранять работоспособность в режиме дедлайнов.'
            ],
            accuracy: [
                'Я внимателен(на) к деталям и понимаю цену ошибки.',
                'Мне подходит работа по стандартам и протоколам.',
                'Мне важно перепроверять ключевые шаги и значения.',
                'Мне важно вести документацию/записи аккуратно.',
                'Мне важно соблюдать порядок действий и чистоту процесса.',
                'Мне важно работать «точно», а не «примерно».'
            ],
            science: [
                'Мне интересно углублённо изучать биологию/химию/анатомию.',
                'Мне комфортно учиться через практику и разбор ошибок.',
                'Мне интересно понимать механизмы (почему так происходит).',
                'Мне интересно решать задания на применение знаний.',
                'Мне интересно читать и разбирать учебные материалы системно.',
                'Мне интересно связывать теорию с реальными задачами медицины.'
            ],
            teamwork: [
                'Мне интересны роли в команде: врач, медсестра, лаборант, фармацевт.',
                'Мне важно уметь договариваться и передавать смену/информацию.',
                'Мне важно, чтобы команда работала по общим правилам.',
                'Мне комфортно принимать ответственность за свою часть процесса.',
                'Мне важно уважать вклад каждого специалиста.',
                'Мне важно ясно объяснять и уточнять, чтобы не было ошибок.'
            ],
            responsibility: [
                'Мне важно работать этично и честно.',
                'Я готов(а) к постоянному обучению в профессии.',
                'Мне важно понимать последствия решений.',
                'Мне важно соблюдать безопасность и протоколы.',
                'Мне важно держать дисциплину и стабильность подготовки.',
                'Мне важно брать ответственность за результат.'
            ]
        }
    };

    const baseExpanded = [...baseList];
    try {
        const extraMap = extraByBand[band] || extraByBand['9'];
        Object.keys(statements).forEach((dimKey) => {
            const arr = extraMap && Array.isArray(extraMap[dimKey]) ? extraMap[dimKey] : [];
            arr.forEach((t) => {
                const text = String(t || '').trim();
                if (text) baseExpanded.push([dimKey, text]);
            });
        });
    } catch {
        // ignore
    }

    const seenPairs = new Set();
    const baseUnique = [];
    for (const pair of baseExpanded) {
        const dim = pair && pair[0] ? String(pair[0]) : '';
        const text = pair && pair[1] ? String(pair[1]).trim() : '';
        if (!dim || !text) continue;
        const k = `${dim}@@${text}`;
        if (seenPairs.has(k)) continue;
        seenPairs.add(k);
        baseUnique.push([dim, text]);
    }
    const variants = [
        (t) => t,
        (t) => t.replace('Мне интересно', 'Мне действительно интересно'),
        (t) => t.replace('Мне важно', 'Для меня важно'),
        (t) => t.replace('Мне подходит', 'Мне скорее подходит'),
        (t) => t.replace('Мне подходит', 'Мне обычно подходит'),
        (t) => t.replace('Мне важно', 'Мне особенно важно')
    ];

    const questions = [];
    let idx = 0;
    outer: for (let pass = 0; pass < variants.length; pass++) {
        const v = variants[pass];
        for (const [dim, text] of baseUnique) {
            idx++;
            questions.push(
                makeLikertQuestion({
                    id: stableId(`profession_med_${band}`, idx),
                    question: v(text),
                    dimension: dim,
                    gradeBand: band
                })
            );
            if (questions.length >= desiredCount) break outer;
        }
    }
    if (questions.length > 0) {
        questions[0].explanation = `Это мед.профориентация. Профиль строится по параметрам: ${Object.values(statements).join(', ')}.`;
    }
    return questions;
}

function makeMcq({ id, question, options, correct, explanation, topic, difficulty, subject, gradeBand }) {
    return {
        id,
        kind: 'mcq',
        question,
        options,
        correct,
        explanation,
        topic,
        difficulty,
        subject,
        gradeBand
    };
}

function inferBandStartFromTestId(testId) {
    if (!testId || typeof testId !== 'string') return null;
    const m = testId.match(/_(1|5|7|9|10)$/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) ? n : null;
}

function inferCategoryFromTestId(testId) {
    if (!testId || typeof testId !== 'string') return null;
    if (testId === 'biology' || testId.startsWith('biology_')) return 'biology';
    if (testId === 'chemistry' || testId.startsWith('chemistry_')) return 'chemistry';
    if (testId === 'profession' || testId.startsWith('profession_general_') || testId.startsWith('profession_med_')) return 'profession';
    return null;
}

// Детерминированные помощники (чтобы варианты всегда были стабильные)
function seededRand(seed) {
    let s = (seed >>> 0) || 1;
    return () => {
        // LCG
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function shuffleWithSeed(arr, seed) {
    const out = [...arr];
    const rnd = seededRand(seed);
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function pickDistractors(values, correctValue, count, seed) {
    const pool = values.filter(v => v !== correctValue);
    const shuffled = shuffleWithSeed(pool, seed);
    return shuffled.slice(0, count);
}

function difficultyByBand(band) {
    if (band === '1-4') return 1;
    if (band === '5-6') return 2;
    if (band === '7-8') return 3;
    if (band === '9') return 3;
    return 4;
}

function buildMcqFromPairs({ prefix, pairs, questionText, optionsFromKeys, correctIndexFn, topic, difficulty, explanationFn, seedBase = 1 }) {
    const keys = pairs.map(p => p.key);
    const byKey = Object.fromEntries(pairs.map(p => [p.key, p.value]));
    const out = [];
    let i = 0;

    pairs.forEach((p, idx) => {
        const seed = seedBase + idx * 997;
        const distract = pickDistractors(keys, p.key, 3, seed);
        const optionKeys = shuffleWithSeed([p.key, ...distract], seed + 13);
        const options = optionsFromKeys(optionKeys, byKey);
        const correct = correctIndexFn(optionKeys, p.key);
        out.push(
            makeMcq({
                id: stableId(prefix, ++i),
                topic,
                difficulty,
                question: typeof questionText === 'function' ? questionText(p, byKey) : String(questionText),
                options,
                correct,
                explanation: explanationFn ? explanationFn(p, byKey) : ''
            })
        );
    });

    return out;
}


// Функция для получения вопросов из базы
function getQuestionsFromDatabase(category, grade) {
    const db = QUESTIONS_DATABASE[category];
    if (!db || !db[grade]) {
        // Если нет вопросов для этого класса, используем ближайший
        const grades = Object.keys(db || {}).map(Number).sort((a, b) => a - b);
        const closest = grades.reduce((prev, curr) => 
            Math.abs(curr - grade) < Math.abs(prev - grade) ? curr : prev, grades[0] || 1);
        return db ? (db[closest] || []) : [];
    }
    return db[grade];
}

function generateGradeQuestions(category, grade, count = 100) {
    const questions = [];
    const gradeNum = parseInt(grade);
    
    if (category === 'profession') {
        questions.push(...generateProfessionQuestionsForGrade(gradeNum, count));
    } else if (category === 'chemistry') {
        questions.push(...generateChemistryQuestionsForGrade(gradeNum, count));
    } else if (category === 'biology') {
        questions.push(...generateBiologyQuestionsForGrade(gradeNum, count));
    } else if (category === 'specialty') {
        questions.push(...generateSpecialtyQuestionsForGrade(gradeNum, count));
    }
    
    // Перемешиваем вопросы
    return shuffleArray(questions).slice(0, count);
}

// === ПРОФОРИЕНТАЦИЯ ПО КЛАССАМ ===
function generateProfessionQuestionsForGrade(grade, count) {
    const questions = [];
    const prefix = `profession_g${grade}`;
    
    // Получаем вопросы из базы данных
    let themes = getQuestionsFromDatabase('profession', grade);
    
    // Если в базе нет вопросов, используем старую логику
    if (!themes || themes.length === 0) {
        themes = grade <= 4 ? [
        // 1-4 класс - простые понятные профессии
        { q: 'Кто лечит людей в больнице?', opts: ['Врач', 'Учитель', 'Повар', 'Водитель'], correct: 0 },
        { q: 'Кто учит детей в школе?', opts: ['Учитель', 'Врач', 'Строитель', 'Пожарный'], correct: 0 },
        { q: 'Кто тушит пожары?', opts: ['Пожарный', 'Полицейский', 'Врач', 'Повар'], correct: 0 },
        { q: 'Кто готовит еду в ресторане?', opts: ['Повар', 'Официант', 'Врач', 'Учитель'], correct: 0 },
        { q: 'Кто строит дома?', opts: ['Строитель', 'Врач', 'Учитель', 'Повар'], correct: 0 },
        { q: 'Кто водит автобус?', opts: ['Водитель', 'Пилот', 'Капитан', 'Машинист'], correct: 0 },
        { q: 'Кто летает на самолёте?', opts: ['Пилот', 'Водитель', 'Капитан', 'Машинист'], correct: 0 },
        { q: 'Кто ловит преступников?', opts: ['Полицейский', 'Пожарный', 'Врач', 'Учитель'], correct: 0 },
        { q: 'Кто лечит животных?', opts: ['Ветеринар', 'Врач', 'Биолог', 'Зоолог'], correct: 0 },
        { q: 'Кто рисует картины?', opts: ['Художник', 'Скульптор', 'Фотограф', 'Дизайнер'], correct: 0 },
        { q: 'Кто пишет книги?', opts: ['Писатель', 'Журналист', 'Учитель', 'Библиотекарь'], correct: 0 },
        { q: 'Кто делает причёски?', opts: ['Парикмахер', 'Визажист', 'Стилист', 'Модельер'], correct: 0 },
        { q: 'Кто продаёт товары в магазине?', opts: ['Продавец', 'Покупатель', 'Директор', 'Охранник'], correct: 0 },
        { q: 'Кто работает в библиотеке?', opts: ['Библиотекарь', 'Учитель', 'Писатель', 'Журналист'], correct: 0 },
        { q: 'Кто выращивает овощи и фрукты?', opts: ['Фермер', 'Повар', 'Продавец', 'Биолог'], correct: 0 },
        { q: 'Тебе нравится помогать другим людям?', opts: ['Да, очень', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Тебе нравится рисовать и делать поделки?', opts: ['Да, очень', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Тебе нравится играть с животными?', opts: ['Да, очень', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Тебе нравится считать и решать задачки?', opts: ['Да, очень', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Тебе нравится читать книги?', opts: ['Да, очень', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Кто чинит машины?', opts: ['Механик', 'Водитель', 'Инженер', 'Строитель'], correct: 0 },
        { q: 'Кто шьёт одежду?', opts: ['Швея', 'Модельер', 'Продавец', 'Стилист'], correct: 0 },
        { q: 'Кто печёт хлеб и булочки?', opts: ['Пекарь', 'Повар', 'Кондитер', 'Продавец'], correct: 0 },
        { q: 'Кто работает в аптеке?', opts: ['Фармацевт', 'Врач', 'Медсестра', 'Биолог'], correct: 0 },
        { q: 'Кто снимает фильмы?', opts: ['Режиссёр', 'Актёр', 'Оператор', 'Сценарист'], correct: 0 },
    ] : grade <= 6 ? [
        // 5-6 класс
        { q: 'Какая профессия связана с изучением живой природы?', opts: ['Биолог', 'Физик', 'Химик', 'Математик'], correct: 0 },
        { q: 'Кто занимается лечением зубов?', opts: ['Стоматолог', 'Терапевт', 'Хирург', 'Окулист'], correct: 0 },
        { q: 'Какой специалист проектирует здания?', opts: ['Архитектор', 'Строитель', 'Дизайнер', 'Инженер'], correct: 0 },
        { q: 'Кто изучает звёзды и планеты?', opts: ['Астроном', 'Физик', 'Географ', 'Геолог'], correct: 0 },
        { q: 'Какая профессия связана с защитой природы?', opts: ['Эколог', 'Биолог', 'Географ', 'Фермер'], correct: 0 },
        { q: 'Кто пишет статьи для газет?', opts: ['Журналист', 'Писатель', 'Редактор', 'Блогер'], correct: 0 },
        { q: 'Какой врач лечит детей?', opts: ['Педиатр', 'Терапевт', 'Хирург', 'Невролог'], correct: 0 },
        { q: 'Кто создаёт компьютерные программы?', opts: ['Программист', 'Инженер', 'Электрик', 'Системный администратор'], correct: 0 },
        { q: 'Какая профессия связана с изучением истории?', opts: ['Историк', 'Археолог', 'Географ', 'Политолог'], correct: 0 },
        { q: 'Кто переводит тексты с одного языка на другой?', opts: ['Переводчик', 'Учитель', 'Писатель', 'Редактор'], correct: 0 },
        { q: 'Мне интересно узнавать, как устроен мир', opts: ['Да, очень', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Мне нравится работать в команде', opts: ['Да, очень', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Я люблю решать сложные задачи', opts: ['Да, очень', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Мне нравится помогать людям', opts: ['Да, очень', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Я интересуюсь техникой и гаджетами', opts: ['Да, очень', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Кто исследует морское дно?', opts: ['Океанолог', 'Биолог', 'Географ', 'Геолог'], correct: 0 },
        { q: 'Какой специалист работает с электричеством?', opts: ['Электрик', 'Механик', 'Инженер', 'Физик'], correct: 0 },
        { q: 'Кто лечит глаза?', opts: ['Офтальмолог', 'Терапевт', 'Хирург', 'Дерматолог'], correct: 0 },
        { q: 'Какая профессия связана с музыкой?', opts: ['Музыкант', 'Художник', 'Актёр', 'Танцор'], correct: 0 },
        { q: 'Кто изучает минералы и горные породы?', opts: ['Геолог', 'Географ', 'Химик', 'Физик'], correct: 0 },
        { q: 'Какой специалист занимается дизайном интерьеров?', opts: ['Дизайнер интерьеров', 'Архитектор', 'Художник', 'Строитель'], correct: 0 },
        { q: 'Кто работает с документами в офисе?', opts: ['Секретарь', 'Бухгалтер', 'Менеджер', 'Директор'], correct: 0 },
        { q: 'Какая профессия связана со спортом?', opts: ['Тренер', 'Врач', 'Учитель', 'Массажист'], correct: 0 },
        { q: 'Кто создаёт новые лекарства?', opts: ['Фармаколог', 'Врач', 'Химик', 'Биолог'], correct: 0 },
        { q: 'Какой специалист изучает поведение людей?', opts: ['Психолог', 'Социолог', 'Врач', 'Учитель'], correct: 0 },
    ] : grade <= 8 ? [
        // 7-8 класс
        { q: 'Какой тип личности по Холланду предпочитает работу с данными и цифрами?', opts: ['Конвенциональный', 'Реалистичный', 'Артистичный', 'Социальный'], correct: 0 },
        { q: 'Что изучает эргономика?', opts: ['Взаимодействие человека и рабочей среды', 'Экономику труда', 'Психологию работников', 'Физиологию труда'], correct: 0 },
        { q: 'Какая профессия относится к типу "человек-техника"?', opts: ['Инженер', 'Врач', 'Учитель', 'Художник'], correct: 0 },
        { q: 'Что такое профессиограмма?', opts: ['Описание профессии и требований к работнику', 'График работы', 'Зарплатная ведомость', 'Резюме'], correct: 0 },
        { q: 'Какое образование нужно для работы врачом?', opts: ['Высшее медицинское', 'Среднее специальное', 'Курсы', 'Любое высшее'], correct: 0 },
        { q: 'Что такое soft skills?', opts: ['Гибкие навыки (коммуникация, лидерство)', 'Технические навыки', 'Профессиональные знания', 'Физические способности'], correct: 0 },
        { q: 'Какая профессия относится к IT-сфере?', opts: ['Data Scientist', 'Маркетолог', 'Бухгалтер', 'Юрист'], correct: 0 },
        { q: 'Что такое карьерная лестница?', opts: ['Последовательность должностей для продвижения', 'Лестница в офисе', 'Список профессий', 'Рейтинг зарплат'], correct: 0 },
        { q: 'Мне важно, чтобы моя работа приносила пользу обществу', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Я готов много учиться для достижения карьерных целей', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Для меня важен высокий доход', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Я предпочитаю творческую работу рутинной', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Мне комфортнее работать в одиночку, чем в команде', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Какой специалист занимается продвижением в интернете?', opts: ['SMM-специалист', 'Программист', 'Дизайнер', 'Копирайтер'], correct: 0 },
        { q: 'Что такое фриланс?', opts: ['Удалённая работа на себя', 'Работа в офисе', 'Государственная служба', 'Работа по найму'], correct: 0 },
        { q: 'Какая профессия связана с анализом больших данных?', opts: ['Аналитик данных', 'Программист', 'Тестировщик', 'Системный администратор'], correct: 0 },
        { q: 'Что изучает профориентация?', opts: ['Помощь в выборе профессии', 'Историю профессий', 'Экономику труда', 'Психологию работы'], correct: 0 },
        { q: 'Какой тип мышления важен для программиста?', opts: ['Логическое', 'Образное', 'Эмоциональное', 'Интуитивное'], correct: 0 },
        { q: 'Что такое стажировка?', opts: ['Практика для получения опыта', 'Испытательный срок', 'Обучение в вузе', 'Курсы повышения квалификации'], correct: 0 },
        { q: 'Какая профессия появилась благодаря развитию интернета?', opts: ['Блогер', 'Журналист', 'Писатель', 'Редактор'], correct: 0 },
        { q: 'Что важнее при выборе профессии?', opts: ['Интерес и способности', 'Только зарплата', 'Мнение родителей', 'Престиж'], correct: 0 },
        { q: 'Какой навык важен для любой профессии?', opts: ['Умение учиться', 'Знание языков', 'Физическая сила', 'Красивый почерк'], correct: 0 },
        { q: 'Что такое резюме?', opts: ['Документ с информацией о соискателе', 'Рекомендательное письмо', 'Трудовой договор', 'Диплом'], correct: 0 },
        { q: 'Какая профессия связана с защитой информации?', opts: ['Специалист по кибербезопасности', 'Программист', 'Системный администратор', 'Тестировщик'], correct: 0 },
    ] : [
        // 9-11 класс
        { q: 'Какой документ необходим для поступления в вуз?', opts: ['Аттестат о среднем образовании', 'Диплом', 'Сертификат', 'Рекомендация'], correct: 0 },
        { q: 'Что такое ЕГЭ?', opts: ['Единый государственный экзамен', 'Единый городской экзамен', 'Единый гуманитарный экзамен', 'Единый главный экзамен'], correct: 0 },
        { q: 'Какой предмет нужен для поступления на медицинский факультет?', opts: ['Биология и химия', 'Физика и математика', 'История и обществознание', 'Литература и русский'], correct: 0 },
        { q: 'Что такое бакалавриат?', opts: ['Первая ступень высшего образования', 'Среднее образование', 'Аспирантура', 'Докторантура'], correct: 0 },
        { q: 'Сколько лет длится обучение в медицинском вузе?', opts: ['6 лет + ординатура', '4 года', '5 лет', '3 года'], correct: 0 },
        { q: 'Что такое профильный класс?', opts: ['Класс с углублённым изучением предметов', 'Обычный класс', 'Класс для одарённых', 'Вечерний класс'], correct: 0 },
        { q: 'Какая форма обучения предполагает самостоятельное изучение?', opts: ['Заочная', 'Очная', 'Очно-заочная', 'Дистанционная'], correct: 0 },
        { q: 'Что такое целевое обучение?', opts: ['Обучение по направлению от организации', 'Платное обучение', 'Заочное обучение', 'Обучение за рубежом'], correct: 0 },
        { q: 'Я чётко представляю свою будущую профессию', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Я знаю, какие предметы нужны для моей профессии', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Я готов к длительному обучению ради профессии мечты', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Мне важен баланс работы и личной жизни', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Я хочу работать в международной компании', opts: ['Полностью согласен', 'Скорее согласен', 'Скорее не согласен', 'Не согласен'], correct: 0, type: 'likert' },
        { q: 'Что такое магистратура?', opts: ['Вторая ступень высшего образования', 'Первая ступень', 'Среднее образование', 'Курсы'], correct: 0 },
        { q: 'Какой документ подтверждает квалификацию врача?', opts: ['Диплом и сертификат специалиста', 'Только диплом', 'Аттестат', 'Удостоверение'], correct: 0 },
        { q: 'Что такое ординатура?', opts: ['Послевузовское медицинское образование', 'Аспирантура', 'Интернатура', 'Магистратура'], correct: 0 },
        { q: 'Какой средний балл ЕГЭ нужен для поступления в топовые вузы?', opts: ['От 85 и выше', 'От 50', 'От 60', 'Любой'], correct: 0 },
        { q: 'Что такое олимпиада для школьников?', opts: ['Соревнование по предметам', 'Спортивное мероприятие', 'Экзамен', 'Конкурс красоты'], correct: 0 },
        { q: 'Какое преимущество даёт победа во Всероссийской олимпиаде?', opts: ['Поступление без экзаменов', 'Скидка на обучение', 'Дополнительные баллы', 'Ничего'], correct: 0 },
        { q: 'Что такое портфолио абитуриента?', opts: ['Сборник достижений', 'Список документов', 'Фотоальбом', 'Дневник'], correct: 0 },
        { q: 'Какая профессия будет востребована в будущем?', opts: ['Специалист по ИИ', 'Машинист', 'Почтальон', 'Кассир'], correct: 0 },
        { q: 'Что такое gap year?', opts: ['Год перерыва перед учёбой/работой', 'Учебный год', 'Летние каникулы', 'Испытательный срок'], correct: 0 },
        { q: 'Какой навык важен для врача?', opts: ['Эмпатия и стрессоустойчивость', 'Только знания', 'Физическая сила', 'Творческие способности'], correct: 0 },
        { q: 'Что такое профессиональное выгорание?', opts: ['Истощение от работы', 'Увольнение', 'Повышение', 'Отпуск'], correct: 0 },
    ];
    } // Закрываем if

    // Генерируем вопросы
    themes.forEach((t, i) => {
        questions.push({
            id: `${prefix}_${i + 1}`,
            question: t.q,
            options: t.opts,
            correct: t.correct,
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'profession',
            subject: 'profession',
            grade: grade
        });
    });

    // Добавляем ещё вопросов до 100 путём вариаций
    while (questions.length < count) {
        const base = themes[questions.length % themes.length];
        const variation = {
            id: `${prefix}_v${questions.length + 1}`,
            question: base.q,
            options: shuffleArray([...base.opts]),
            correct: base.opts.indexOf(base.opts[base.correct]),
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'profession',
            subject: 'profession',
            grade: grade
        };
        // Найдём правильный ответ в перемешанном массиве
        variation.correct = variation.options.indexOf(base.opts[base.correct]);
        questions.push(variation);
    }

    return questions;
}

// === ХИМИЯ ПО КЛАССАМ ===
function generateChemistryQuestionsForGrade(grade, count) {
    const questions = [];
    const prefix = `chemistry_g${grade}`;

    const themes = grade <= 4 ? [
        { q: 'Из чего состоит вода?', opts: ['Водород и кислород', 'Только водород', 'Только кислород', 'Углерод'], correct: 0 },
        { q: 'Какой газ мы вдыхаем?', opts: ['Кислород', 'Углекислый газ', 'Азот', 'Водород'], correct: 0 },
        { q: 'Что происходит с водой при замерзании?', opts: ['Превращается в лёд', 'Испаряется', 'Исчезает', 'Нагревается'], correct: 0 },
        { q: 'Какого цвета обычно огонь?', opts: ['Оранжевый и жёлтый', 'Зелёный', 'Синий', 'Фиолетовый'], correct: 0 },
        { q: 'Что такое соль?', opts: ['Белые кристаллы для еды', 'Сахар', 'Мука', 'Вода'], correct: 0 },
        { q: 'Из чего делают стекло?', opts: ['Из песка', 'Из воды', 'Из дерева', 'Из металла'], correct: 0 },
        { q: 'Что выделяют растения днём?', opts: ['Кислород', 'Углекислый газ', 'Азот', 'Водород'], correct: 0 },
        { q: 'Какое вещество сладкое на вкус?', opts: ['Сахар', 'Соль', 'Уксус', 'Лимон'], correct: 0 },
        { q: 'Из чего состоит воздух?', opts: ['Из разных газов', 'Только из кислорода', 'Из воды', 'Из пыли'], correct: 0 },
        { q: 'Что такое ржавчина?', opts: ['Разрушение металла', 'Краска', 'Грязь', 'Пыль'], correct: 0 },
        { q: 'Какой металл притягивается магнитом?', opts: ['Железо', 'Алюминий', 'Медь', 'Золото'], correct: 0 },
        { q: 'Из чего делают бумагу?', opts: ['Из дерева', 'Из металла', 'Из камня', 'Из воды'], correct: 0 },
        { q: 'Что происходит при кипении воды?', opts: ['Образуется пар', 'Образуется лёд', 'Ничего', 'Становится солёной'], correct: 0 },
        { q: 'Какое вещество используют для мытья рук?', opts: ['Мыло', 'Соль', 'Сахар', 'Мука'], correct: 0 },
        { q: 'Что такое пузырьки в газировке?', opts: ['Углекислый газ', 'Кислород', 'Азот', 'Пар'], correct: 0 },
    ] : grade <= 6 ? [
        { q: 'Какой химический символ у кислорода?', opts: ['O', 'K', 'C', 'H'], correct: 0 },
        { q: 'Какой химический символ у водорода?', opts: ['H', 'O', 'He', 'W'], correct: 0 },
        { q: 'Что такое H₂O?', opts: ['Вода', 'Перекись водорода', 'Кислота', 'Соль'], correct: 0 },
        { q: 'Какой газ поддерживает горение?', opts: ['Кислород', 'Азот', 'Углекислый газ', 'Водород'], correct: 0 },
        { q: 'Какой элемент обозначается Fe?', opts: ['Железо', 'Фтор', 'Фосфор', 'Франций'], correct: 0 },
        { q: 'Что такое атом?', opts: ['Мельчайшая частица вещества', 'Молекула', 'Ион', 'Электрон'], correct: 0 },
        { q: 'Какой газ выдыхают люди?', opts: ['Углекислый газ', 'Кислород', 'Азот', 'Водород'], correct: 0 },
        { q: 'Какой металл самый лёгкий?', opts: ['Литий', 'Алюминий', 'Железо', 'Медь'], correct: 0 },
        { q: 'Что такое молекула?', opts: ['Группа связанных атомов', 'Один атом', 'Электрон', 'Протон'], correct: 0 },
        { q: 'Какой элемент обозначается C?', opts: ['Углерод', 'Кальций', 'Хлор', 'Кобальт'], correct: 0 },
        { q: 'Что происходит при смешивании уксуса и соды?', opts: ['Выделяется газ', 'Ничего', 'Взрыв', 'Образуется лёд'], correct: 0 },
        { q: 'Какой элемент нужен для дыхания?', opts: ['Кислород', 'Азот', 'Углерод', 'Водород'], correct: 0 },
        { q: 'Из чего состоит поваренная соль?', opts: ['Натрий и хлор', 'Калий и йод', 'Кальций и фтор', 'Магний и бром'], correct: 0 },
        { q: 'Какой газ легче воздуха?', opts: ['Водород', 'Кислород', 'Азот', 'Углекислый газ'], correct: 0 },
        { q: 'Что такое химическая реакция?', opts: ['Превращение веществ', 'Смешивание', 'Нагревание', 'Охлаждение'], correct: 0 },
    ] : grade <= 8 ? [
        { q: 'Какой заряд у протона?', opts: ['Положительный', 'Отрицательный', 'Нейтральный', 'Переменный'], correct: 0 },
        { q: 'Где находятся электроны в атоме?', opts: ['На орбиталях вокруг ядра', 'В ядре', 'Вне атома', 'В нейтронах'], correct: 0 },
        { q: 'Что такое валентность?', opts: ['Способность атома образовывать связи', 'Масса атома', 'Заряд ядра', 'Число протонов'], correct: 0 },
        { q: 'Какая формула серной кислоты?', opts: ['H₂SO₄', 'HCl', 'HNO₃', 'H₃PO₄'], correct: 0 },
        { q: 'Что такое pH?', opts: ['Показатель кислотности', 'Плотность', 'Давление', 'Температура'], correct: 0 },
        { q: 'Какой металл жидкий при комнатной температуре?', opts: ['Ртуть', 'Железо', 'Медь', 'Алюминий'], correct: 0 },
        { q: 'Что такое оксид?', opts: ['Соединение с кислородом', 'Кислота', 'Соль', 'Основание'], correct: 0 },
        { q: 'Какой газ используют в лампочках?', opts: ['Аргон', 'Кислород', 'Азот', 'Водород'], correct: 0 },
        { q: 'Что такое катализатор?', opts: ['Ускоритель реакции', 'Замедлитель реакции', 'Продукт реакции', 'Реагент'], correct: 0 },
        { q: 'Какой элемент имеет атомный номер 1?', opts: ['Водород', 'Гелий', 'Литий', 'Углерод'], correct: 0 },
        { q: 'Что такое ион?', opts: ['Заряженная частица', 'Нейтральная частица', 'Атом', 'Молекула'], correct: 0 },
        { q: 'Какая формула углекислого газа?', opts: ['CO₂', 'CO', 'C₂O', 'O₂C'], correct: 0 },
        { q: 'Что такое электролиз?', opts: ['Разложение током', 'Нагревание', 'Охлаждение', 'Смешивание'], correct: 0 },
        { q: 'Какой металл используют в термометрах?', opts: ['Ртуть', 'Железо', 'Медь', 'Алюминий'], correct: 0 },
        { q: 'Что такое индикатор?', opts: ['Вещество, меняющее цвет', 'Катализатор', 'Растворитель', 'Осадок'], correct: 0 },
    ] : [
        { q: 'Какой тип связи в молекуле NaCl?', opts: ['Ионная', 'Ковалентная', 'Металлическая', 'Водородная'], correct: 0 },
        { q: 'Что такое моль?', opts: ['6.02×10²³ частиц', 'Масса вещества', 'Объём газа', 'Количество атомов'], correct: 0 },
        { q: 'Какой закон описывает сохранение массы?', opts: ['Закон Ломоносова-Лавуазье', 'Закон Авогадро', 'Закон Гесса', 'Закон Дальтона'], correct: 0 },
        { q: 'Что такое электроотрицательность?', opts: ['Способность притягивать электроны', 'Заряд ядра', 'Масса атома', 'Валентность'], correct: 0 },
        { q: 'Какой объём занимает 1 моль газа при н.у.?', opts: ['22.4 л', '11.2 л', '44.8 л', '1 л'], correct: 0 },
        { q: 'Что такое изотопы?', opts: ['Атомы с разным числом нейтронов', 'Атомы с разным числом протонов', 'Разные элементы', 'Ионы'], correct: 0 },
        { q: 'Какая формула этанола?', opts: ['C₂H₅OH', 'CH₃OH', 'C₃H₇OH', 'CH₄'], correct: 0 },
        { q: 'Что такое гидролиз?', opts: ['Разложение водой', 'Разложение током', 'Окисление', 'Восстановление'], correct: 0 },
        { q: 'Какой металл самый электропроводный?', opts: ['Серебро', 'Медь', 'Золото', 'Алюминий'], correct: 0 },
        { q: 'Что такое энтальпия?', opts: ['Теплосодержание системы', 'Энтропия', 'Энергия связи', 'Температура'], correct: 0 },
        { q: 'Какая кислота входит в состав желудочного сока?', opts: ['Соляная', 'Серная', 'Азотная', 'Уксусная'], correct: 0 },
        { q: 'Что такое полимер?', opts: ['Молекула из повторяющихся звеньев', 'Мономер', 'Катализатор', 'Растворитель'], correct: 0 },
        { q: 'Какой газ образуется при брожении?', opts: ['Углекислый газ', 'Кислород', 'Азот', 'Водород'], correct: 0 },
        { q: 'Что такое окислитель?', opts: ['Вещество, принимающее электроны', 'Вещество, отдающее электроны', 'Катализатор', 'Растворитель'], correct: 0 },
        { q: 'Какая формула глюкозы?', opts: ['C₆H₁₂O₆', 'C₁₂H₂₂O₁₁', 'C₂H₅OH', 'CH₃COOH'], correct: 0 },
    ];

    themes.forEach((t, i) => {
        questions.push({
            id: `${prefix}_${i + 1}`,
            question: t.q,
            options: t.opts,
            correct: t.correct,
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'chemistry',
            subject: 'chemistry',
            grade: grade
        });
    });

    while (questions.length < count) {
        const base = themes[questions.length % themes.length];
        const shuffledOpts = shuffleArray([...base.opts]);
        questions.push({
            id: `${prefix}_v${questions.length + 1}`,
            question: base.q,
            options: shuffledOpts,
            correct: shuffledOpts.indexOf(base.opts[base.correct]),
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'chemistry',
            subject: 'chemistry',
            grade: grade
        });
    }

    return questions;
}

// === БИОЛОГИЯ ПО КЛАССАМ ===
function generateBiologyQuestionsForGrade(grade, count) {
    const questions = [];
    const prefix = `biology_g${grade}`;

    const themes = grade <= 4 ? [
        { q: 'Сколько ног у насекомых?', opts: ['6', '4', '8', '2'], correct: 0 },
        { q: 'Какое животное даёт молоко?', opts: ['Корова', 'Курица', 'Рыба', 'Лягушка'], correct: 0 },
        { q: 'Что нужно растениям для роста?', opts: ['Вода и свет', 'Только вода', 'Только свет', 'Ничего'], correct: 0 },
        { q: 'Какая часть растения находится в земле?', opts: ['Корень', 'Листья', 'Цветок', 'Плод'], correct: 0 },
        { q: 'Как называется детёныш кошки?', opts: ['Котёнок', 'Щенок', 'Телёнок', 'Цыплёнок'], correct: 0 },
        { q: 'Какое животное умеет летать?', opts: ['Птица', 'Рыба', 'Змея', 'Черепаха'], correct: 0 },
        { q: 'Чем дышит рыба?', opts: ['Жабрами', 'Лёгкими', 'Кожей', 'Носом'], correct: 0 },
        { q: 'Какое животное живёт в воде?', opts: ['Рыба', 'Лиса', 'Заяц', 'Медведь'], correct: 0 },
        { q: 'Что делают пчёлы?', opts: ['Собирают мёд', 'Вьют гнёзда', 'Плетут паутину', 'Роют норы'], correct: 0 },
        { q: 'Какой орган слышит звуки?', opts: ['Ухо', 'Глаз', 'Нос', 'Рука'], correct: 0 },
        { q: 'Сколько лап у собаки?', opts: ['4', '2', '6', '8'], correct: 0 },
        { q: 'Кто плетёт паутину?', opts: ['Паук', 'Пчела', 'Муха', 'Бабочка'], correct: 0 },
        { q: 'Какая часть цветка привлекает пчёл?', opts: ['Лепестки', 'Корень', 'Стебель', 'Листья'], correct: 0 },
        { q: 'Чем покрыто тело рыбы?', opts: ['Чешуёй', 'Шерстью', 'Перьями', 'Кожей'], correct: 0 },
        { q: 'Какое животное впадает в зимнюю спячку?', opts: ['Медведь', 'Волк', 'Лиса', 'Заяц'], correct: 0 },
    ] : grade <= 6 ? [
        { q: 'Какая клетка организма самая маленькая?', opts: ['Эритроцит', 'Нейрон', 'Яйцеклетка', 'Мышечная'], correct: 0 },
        { q: 'Что такое фотосинтез?', opts: ['Создание питательных веществ растениями', 'Дыхание растений', 'Рост растений', 'Размножение'], correct: 0 },
        { q: 'Какой орган качает кровь?', opts: ['Сердце', 'Лёгкие', 'Печень', 'Почки'], correct: 0 },
        { q: 'Сколько костей в теле взрослого человека?', opts: ['206', '100', '300', '150'], correct: 0 },
        { q: 'Что защищает мозг?', opts: ['Череп', 'Позвоночник', 'Рёбра', 'Таз'], correct: 0 },
        { q: 'Какой орган очищает кровь?', opts: ['Почки', 'Сердце', 'Лёгкие', 'Желудок'], correct: 0 },
        { q: 'Что такое хлорофилл?', opts: ['Зелёный пигмент растений', 'Клетка', 'Корень', 'Вирус'], correct: 0 },
        { q: 'Какая система переваривает пищу?', opts: ['Пищеварительная', 'Дыхательная', 'Нервная', 'Кровеносная'], correct: 0 },
        { q: 'Что такое бактерия?', opts: ['Одноклеточный организм', 'Многоклеточный организм', 'Вирус', 'Клетка человека'], correct: 0 },
        { q: 'Какой орган отвечает за зрение?', opts: ['Глаз', 'Ухо', 'Нос', 'Язык'], correct: 0 },
        { q: 'Что такое скелет?', opts: ['Каркас из костей', 'Мышцы', 'Кожа', 'Органы'], correct: 0 },
        { q: 'Какая клетка переносит кислород?', opts: ['Эритроцит', 'Лейкоцит', 'Тромбоцит', 'Нейрон'], correct: 0 },
        { q: 'Что такое эволюция?', opts: ['Развитие живых существ', 'Создание видов', 'Вымирание', 'Рождение'], correct: 0 },
        { q: 'Какой орган вырабатывает инсулин?', opts: ['Поджелудочная железа', 'Печень', 'Сердце', 'Почки'], correct: 0 },
        { q: 'Что такое экосистема?', opts: ['Сообщество организмов и среды', 'Один вид', 'Водоём', 'Лес'], correct: 0 },
    ] : grade <= 8 ? [
        { q: 'Что такое ДНК?', opts: ['Носитель генетической информации', 'Белок', 'Углевод', 'Жир'], correct: 0 },
        { q: 'Сколько хромосом у человека?', opts: ['46', '23', '48', '44'], correct: 0 },
        { q: 'Что такое митоз?', opts: ['Деление клетки', 'Слияние клеток', 'Гибель клетки', 'Рост клетки'], correct: 0 },
        { q: 'Какой орган самый большой?', opts: ['Кожа', 'Печень', 'Мозг', 'Лёгкие'], correct: 0 },
        { q: 'Что такое рефлекс?', opts: ['Автоматическая реакция', 'Осознанное действие', 'Мысль', 'Чувство'], correct: 0 },
        { q: 'Какой витамин вырабатывается на солнце?', opts: ['Витамин D', 'Витамин C', 'Витамин A', 'Витамин B'], correct: 0 },
        { q: 'Что такое гормон?', opts: ['Химический регулятор', 'Клетка', 'Орган', 'Ткань'], correct: 0 },
        { q: 'Какая кровь течёт по венам?', opts: ['Венозная (бедная кислородом)', 'Артериальная', 'Смешанная', 'Лимфа'], correct: 0 },
        { q: 'Что такое метаболизм?', opts: ['Обмен веществ', 'Рост', 'Размножение', 'Питание'], correct: 0 },
        { q: 'Какой орган вырабатывает желчь?', opts: ['Печень', 'Желудок', 'Поджелудочная', 'Кишечник'], correct: 0 },
        { q: 'Что такое иммунитет?', opts: ['Защита организма', 'Болезнь', 'Инфекция', 'Аллергия'], correct: 0 },
        { q: 'Какая группа крови универсальный донор?', opts: ['O (I)', 'A (II)', 'B (III)', 'AB (IV)'], correct: 0 },
        { q: 'Что такое генотип?', opts: ['Набор генов', 'Внешний вид', 'Поведение', 'Среда'], correct: 0 },
        { q: 'Какой гормон регулирует сахар в крови?', opts: ['Инсулин', 'Адреналин', 'Тироксин', 'Тестостерон'], correct: 0 },
        { q: 'Что такое нейрон?', opts: ['Нервная клетка', 'Мышечная клетка', 'Клетка крови', 'Клетка кожи'], correct: 0 },
    ] : [
        { q: 'Что такое генная инженерия?', opts: ['Изменение ДНК', 'Клонирование', 'Селекция', 'Мутация'], correct: 0 },
        { q: 'Какой процесс происходит в митохондриях?', opts: ['Клеточное дыхание', 'Фотосинтез', 'Синтез белка', 'Деление'], correct: 0 },
        { q: 'Что такое мейоз?', opts: ['Деление с уменьшением хромосом', 'Обычное деление', 'Слияние клеток', 'Гибель клеток'], correct: 0 },
        { q: 'Какой закон Менделя описывает расщепление?', opts: ['Второй закон', 'Первый закон', 'Третий закон', 'Четвёртый закон'], correct: 0 },
        { q: 'Что такое транскрипция?', opts: ['Синтез РНК на ДНК', 'Синтез белка', 'Репликация', 'Мутация'], correct: 0 },
        { q: 'Какая структура ДНК?', opts: ['Двойная спираль', 'Одинарная цепь', 'Кольцо', 'Куб'], correct: 0 },
        { q: 'Что такое антиген?', opts: ['Чужеродное вещество', 'Антитело', 'Клетка крови', 'Гормон'], correct: 0 },
        { q: 'Какой процесс — трансляция?', opts: ['Синтез белка', 'Синтез РНК', 'Репликация ДНК', 'Деление клетки'], correct: 0 },
        { q: 'Что такое биотехнология?', opts: ['Использование организмов в производстве', 'Изучение жизни', 'Экология', 'Медицина'], correct: 0 },
        { q: 'Какой органоид синтезирует белок?', opts: ['Рибосома', 'Митохондрия', 'Лизосома', 'Ядро'], correct: 0 },
        { q: 'Что такое клонирование?', opts: ['Создание генетической копии', 'Скрещивание', 'Мутация', 'Отбор'], correct: 0 },
        { q: 'Какой тип наследования у гемофилии?', opts: ['Сцепленный с X-хромосомой', 'Аутосомный доминантный', 'Аутосомный рецессивный', 'Y-сцепленный'], correct: 0 },
        { q: 'Что такое стволовые клетки?', opts: ['Недифференцированные клетки', 'Нервные клетки', 'Мышечные клетки', 'Клетки крови'], correct: 0 },
        { q: 'Какой фермент разрезает ДНК?', opts: ['Рестриктаза', 'Полимераза', 'Лигаза', 'Хеликаза'], correct: 0 },
        { q: 'Что такое ПЦР?', opts: ['Полимеразная цепная реакция', 'Тест на антитела', 'Секвенирование', 'Электрофорез'], correct: 0 },
    ];

    themes.forEach((t, i) => {
        questions.push({
            id: `${prefix}_${i + 1}`,
            question: t.q,
            options: t.opts,
            correct: t.correct,
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'biology',
            subject: 'biology',
            grade: grade
        });
    });

    while (questions.length < count) {
        const base = themes[questions.length % themes.length];
        const shuffledOpts = shuffleArray([...base.opts]);
        questions.push({
            id: `${prefix}_v${questions.length + 1}`,
            question: base.q,
            options: shuffledOpts,
            correct: shuffledOpts.indexOf(base.opts[base.correct]),
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'biology',
            subject: 'biology',
            grade: grade
        });
    }

    return questions;
}

// === СПЕЦИАЛЬНОСТЬ ПО КЛАССАМ ===
function generateSpecialtyQuestionsForGrade(grade, count) {
    const questions = [];
    const prefix = `specialty_g${grade}`;

    const themes = grade <= 4 ? [
        { q: 'Кто помогает людям, когда они болеют?', opts: ['Врач', 'Учитель', 'Повар', 'Водитель'], correct: 0 },
        { q: 'Где работает врач?', opts: ['В больнице', 'В школе', 'В магазине', 'На стройке'], correct: 0 },
        { q: 'Что носит врач на работе?', opts: ['Белый халат', 'Костюм', 'Форму', 'Джинсы'], correct: 0 },
        { q: 'Кто делает уколы?', opts: ['Медсестра', 'Учитель', 'Повар', 'Продавец'], correct: 0 },
        { q: 'Чем измеряют температуру?', opts: ['Градусником', 'Линейкой', 'Весами', 'Часами'], correct: 0 },
        { q: 'Что лечит стоматолог?', opts: ['Зубы', 'Глаза', 'Уши', 'Ноги'], correct: 0 },
        { q: 'Куда везут больных на скорой помощи?', opts: ['В больницу', 'В школу', 'Домой', 'В магазин'], correct: 0 },
        { q: 'Кто лечит животных?', opts: ['Ветеринар', 'Педиатр', 'Хирург', 'Терапевт'], correct: 0 },
        { q: 'Что делает врач первым делом?', opts: ['Осматривает больного', 'Даёт лекарство', 'Делает операцию', 'Уходит'], correct: 0 },
        { q: 'Где продают лекарства?', opts: ['В аптеке', 'В магазине', 'В школе', 'На рынке'], correct: 0 },
        { q: 'Тебе нравится помогать, когда кто-то болеет?', opts: ['Да', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Ты боишься крови?', opts: ['Нет', 'Немного', 'Да', 'Очень'], correct: 0, type: 'likert' },
        { q: 'Тебе интересно, как работает тело человека?', opts: ['Да', 'Иногда', 'Не очень', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Кто помогает рожать детей?', opts: ['Акушер', 'Педиатр', 'Хирург', 'Терапевт'], correct: 0 },
        { q: 'Что слушает врач через стетоскоп?', opts: ['Сердце и лёгкие', 'Голову', 'Живот', 'Руки'], correct: 0 },
    ] : grade <= 6 ? [
        { q: 'Какой врач лечит детей?', opts: ['Педиатр', 'Терапевт', 'Хирург', 'Кардиолог'], correct: 0 },
        { q: 'Какой врач делает операции?', opts: ['Хирург', 'Терапевт', 'Педиатр', 'Дерматолог'], correct: 0 },
        { q: 'Какой врач лечит сердце?', opts: ['Кардиолог', 'Невролог', 'Пульмонолог', 'Гастроэнтеролог'], correct: 0 },
        { q: 'Какой врач лечит кожу?', opts: ['Дерматолог', 'Кардиолог', 'Невролог', 'Ортопед'], correct: 0 },
        { q: 'Какой врач лечит нервную систему?', opts: ['Невролог', 'Кардиолог', 'Хирург', 'Терапевт'], correct: 0 },
        { q: 'Где учатся на врача?', opts: ['В медицинском институте', 'В школе', 'На курсах', 'В техникуме'], correct: 0 },
        { q: 'Сколько лет учиться на врача?', opts: ['6 лет и больше', '4 года', '2 года', '1 год'], correct: 0 },
        { q: 'Какой врач делает рентген?', opts: ['Рентгенолог', 'Хирург', 'Терапевт', 'Педиатр'], correct: 0 },
        { q: 'Кто работает в скорой помощи?', opts: ['Фельдшер', 'Учитель', 'Продавец', 'Водитель'], correct: 0 },
        { q: 'Какой врач лечит глаза?', opts: ['Офтальмолог', 'Отоларинголог', 'Невролог', 'Кардиолог'], correct: 0 },
        { q: 'Мне интересна работа врача', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Я могу долго и внимательно слушать', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Мне нравится биология', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Какой врач лечит уши, горло, нос?', opts: ['Отоларинголог (ЛОР)', 'Офтальмолог', 'Дерматолог', 'Стоматолог'], correct: 0 },
        { q: 'Кто делает анализы крови?', opts: ['Лаборант', 'Хирург', 'Терапевт', 'Педиатр'], correct: 0 },
    ] : grade <= 8 ? [
        { q: 'Какая специальность занимается онкологией?', opts: ['Онколог', 'Кардиолог', 'Невролог', 'Терапевт'], correct: 0 },
        { q: 'Кто занимается психическим здоровьем?', opts: ['Психиатр', 'Невролог', 'Терапевт', 'Хирург'], correct: 0 },
        { q: 'Какой врач лечит суставы?', opts: ['Ревматолог', 'Кардиолог', 'Пульмонолог', 'Гастроэнтеролог'], correct: 0 },
        { q: 'Что изучает анатомия?', opts: ['Строение тела', 'Болезни', 'Лекарства', 'Операции'], correct: 0 },
        { q: 'Какой врач занимается аллергиями?', opts: ['Аллерголог', 'Дерматолог', 'Терапевт', 'Педиатр'], correct: 0 },
        { q: 'Что такое диагностика?', opts: ['Определение болезни', 'Лечение', 'Профилактика', 'Реабилитация'], correct: 0 },
        { q: 'Какой врач лечит лёгкие?', opts: ['Пульмонолог', 'Кардиолог', 'Невролог', 'Гастроэнтеролог'], correct: 0 },
        { q: 'Кто занимается реабилитацией?', opts: ['Реабилитолог', 'Хирург', 'Терапевт', 'Педиатр'], correct: 0 },
        { q: 'Какой врач лечит желудок?', opts: ['Гастроэнтеролог', 'Кардиолог', 'Пульмонолог', 'Невролог'], correct: 0 },
        { q: 'Что такое клятва Гиппократа?', opts: ['Этический кодекс врача', 'Диплом', 'Лицензия', 'Рецепт'], correct: 0 },
        { q: 'Я готов учиться 6+ лет', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Мне важно помогать людям', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Я стрессоустойчив', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Какой врач работает с пожилыми?', opts: ['Гериатр', 'Педиатр', 'Неонатолог', 'Акушер'], correct: 0 },
        { q: 'Кто лечит новорождённых?', opts: ['Неонатолог', 'Педиатр', 'Терапевт', 'Гериатр'], correct: 0 },
    ] : [
        { q: 'Какой балл ЕГЭ нужен для мед. вуза?', opts: ['От 70 и выше', 'От 50', 'Любой', 'От 30'], correct: 0 },
        { q: 'Сколько длится ординатура?', opts: ['2-5 лет', '1 год', '6 месяцев', '10 лет'], correct: 0 },
        { q: 'Какие предметы сдавать для медвуза?', opts: ['Биология, химия, русский', 'Математика, физика', 'История, общество', 'Литература, английский'], correct: 0 },
        { q: 'Что такое интернатура?', opts: ['Практика после вуза (отменена)', 'Учёба в вузе', 'Школьная практика', 'Курсы'], correct: 0 },
        { q: 'Какая специальность самая высокооплачиваемая?', opts: ['Хирург', 'Терапевт', 'Педиатр', 'Медсестра'], correct: 0 },
        { q: 'Что такое аккредитация врача?', opts: ['Подтверждение квалификации', 'Диплом', 'Лицензия клиники', 'Рецепт'], correct: 0 },
        { q: 'Какой врач зарабатывает больше?', opts: ['Пластический хирург', 'Участковый терапевт', 'Педиатр', 'Медсестра'], correct: 0 },
        { q: 'Где можно работать с мед. образованием?', opts: ['Больница, клиника, лаборатория', 'Только больница', 'Только клиника', 'Только лаборатория'], correct: 0 },
        { q: 'Что такое резидентура?', opts: ['Послевузовское обучение', 'Учёба в вузе', 'Школа', 'Курсы'], correct: 0 },
        { q: 'Какая специальность требует больше обучения?', opts: ['Нейрохирург', 'Терапевт', 'Педиатр', 'Дерматолог'], correct: 0 },
        { q: 'Я готов к ночным дежурствам', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Мне важен престиж профессии', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Я хочу заниматься наукой в медицине', opts: ['Да', 'Скорее да', 'Скорее нет', 'Нет'], correct: 0, type: 'likert' },
        { q: 'Какой вуз лучший для медицины в России?', opts: ['Сеченовский университет', 'МГУ', 'СПбГУ', 'МФТИ'], correct: 0 },
        { q: 'Что такое целевое направление?', opts: ['Обучение по договору с организацией', 'Платное обучение', 'Заочное обучение', 'Дистанционное'], correct: 0 },
    ];

    themes.forEach((t, i) => {
        questions.push({
            id: `${prefix}_${i + 1}`,
            question: t.q,
            options: t.opts,
            correct: t.correct,
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'specialty',
            subject: 'specialty',
            grade: grade
        });
    });

    while (questions.length < count) {
        const base = themes[questions.length % themes.length];
        const shuffledOpts = shuffleArray([...base.opts]);
        questions.push({
            id: `${prefix}_v${questions.length + 1}`,
            question: base.q,
            options: shuffledOpts,
            correct: shuffledOpts.indexOf(base.opts[base.correct]),
            difficulty: grade <= 4 ? 1 : grade <= 6 ? 2 : grade <= 8 ? 3 : 4,
            topic: 'specialty',
            subject: 'specialty',
            grade: grade
        });
    }

    return questions;
}

function generateBiologyByGrade(bandStartGrade, desiredCount = 64) {
    const band = normalizeBandLabel(bandStartGrade);
    const prefix = `biology_${band}`;
    const diff = difficultyByBand(band);
    const out = [];

    const addTwoWayDefinitions = ({ suffix, pairs, topic, difficulty, seedBase }) => {
        // 2 варианта формулировки в каждую сторону => больше уникальных вопросов без «детских» тем
        const defPrompts = [
            (p) => `Выберите верное определение термина: «${p.key}».`,
            (p) => `Что означает термин «${p.key}»?`
        ];
        defPrompts.forEach((qText, i) => {
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_${suffix}_def${i + 1}`,
                    pairs,
                    topic,
                    difficulty,
                    seedBase: seedBase + i * 13,
                    questionText: (p) => qText(p),
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `Правильно: ${p.value}.`
                })
            );
        });

        const inverted = pairs.map(p => ({ key: p.value, value: p.key }));
        const invPrompts = [
            (p) => `Какой термин соответствует определению: «${p.key}»?`,
            (p) => `Выберите термин по описанию: «${p.key}».`
        ];
        invPrompts.forEach((qText, i) => {
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_${suffix}_inv${i + 1}`,
                    pairs: inverted,
                    topic,
                    difficulty,
                    seedBase: seedBase + 97 + i * 17,
                    questionText: (p) => qText(p),
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `Правильно: ${p.value}.`
                })
            );
        });
    };

    const isSenior = band === '10-11';
    const isJunior = band === '1-4' || band === '5-6';
    const isMiddle = band === '7-8';
    const isGrade9 = band === '9';

    if (isSenior) {
        const molBio = [
            { key: 'Репликация', value: 'Удвоение ДНК перед делением клетки' },
            { key: 'Транскрипция', value: 'Синтез РНК на матрице ДНК' },
            { key: 'Трансляция', value: 'Синтез белка на рибосомах по информации мРНК' },
            { key: 'Кодон', value: 'Триплет нуклеотидов мРНК, кодирующий аминокислоту' },
            { key: 'Антикодон', value: 'Триплет тРНК, комплементарный кодону мРНК' },
            { key: 'Генетический код', value: 'Соответствие между кодонами и аминокислотами' },
            { key: 'Апоптоз', value: 'Программируемая гибель клетки' },
            { key: 'Мутация', value: 'Стойкое изменение генетического материала' },
            { key: 'Аллель', value: 'Одна из форм гена' },
            { key: 'Геном', value: 'Совокупность генетического материала организма' },
            { key: 'Кроссинговер', value: 'Обмен участками между гомологичными хромосомами в мейозе' },
            { key: 'Мейоз', value: 'Деление, уменьшающее набор хромосом вдвое (образование гамет)' },
            { key: 'Митоз', value: 'Деление клетки с образованием генетически идентичных клеток' },
            { key: 'Кариотип', value: 'Набор хромосом вида (число, форма, размеры)' },
            { key: 'Плазмида', value: 'Небольшая кольцевая ДНК бактерий, несущая доп. гены' }
        ];

        const phys = [
            { key: 'Гомеостаз', value: 'Поддержание относительного постоянства внутренней среды' },
            { key: 'Отрицательная обратная связь', value: 'Механизм регуляции, уменьшающий отклонение параметра' },
            { key: 'Нервный импульс', value: 'Электрохимический сигнал в нервной ткани' },
            { key: 'Синапс', value: 'Контакт между нейронами (или нейроном и клеткой-мишенью)' },
            { key: 'Фермент', value: 'Белок-катализатор, ускоряющий биохимические реакции' },
            { key: 'Гормон', value: 'Сигнальное вещество, регулирующее функции органов' },
            { key: 'Иммунитет', value: 'Способность организма распознавать и устранять чужеродные агенты' },
            { key: 'Антитело', value: 'Белок иммунной системы, специфически связывающий антиген' },
            { key: 'Антиген', value: 'Чужеродная молекула, вызывающая иммунный ответ' },
            { key: 'Дыхательная цепь', value: 'Система переноса электронов в митохондриях для синтеза АТФ' },
            { key: 'АТФ', value: 'Универсальная молекула-носитель энергии в клетке' },
            { key: 'Осмос', value: 'Диффузия воды через полупроницаемую мембрану' },
            { key: 'Диффузия', value: 'Самопроизвольное перемешивание частиц из-за теплового движения' }
        ];

        const ecologyEvolution = [
            { key: 'Популяция', value: 'Совокупность особей одного вида на общей территории' },
            { key: 'Генофонд', value: 'Совокупность генов популяции' },
            { key: 'Естественный отбор', value: 'Выживание и размножение наиболее приспособленных' },
            { key: 'Дрейф генов', value: 'Случайные изменения частот аллелей в популяции' },
            { key: 'Изоляция', value: 'Разобщение популяций, препятствующее скрещиванию' },
            { key: 'Видообразование', value: 'Процесс возникновения новых видов' },
            { key: 'Сукцессия', value: 'Последовательная смена сообществ на территории' },
            { key: 'Экологическая ниша', value: 'Роль вида в экосистеме и условия его существования' },
            { key: 'Конкуренция', value: 'Взаимодействие организмов за ограниченные ресурсы' },
            { key: 'Симбиоз', value: 'Тесное совместное существование организмов разных видов' },
            { key: 'Трофическая цепь', value: 'Передача вещества и энергии через питание' },
            { key: 'Продуценты', value: 'Организмы, создающие органическое вещество (обычно растения)' },
            { key: 'Консументы', value: 'Организмы, питающиеся готовым органическим веществом' },
            { key: 'Редуценты', value: 'Организмы, разлагающие органику до минеральных соединений' }
        ];

        const genetics = [
            { key: 'Закон единообразия гибридов F1', value: 'При скрещивании гомозигот различающихся форм все F1 одинаковы (доминирование)' },
            { key: 'Закон расщепления', value: 'Во втором поколении признаки расщепляются в определённых соотношениях' },
            { key: 'Независимое наследование', value: 'Признаки наследуются независимо, если гены в разных хромосомах' },
            { key: 'Гомозигота', value: 'Организм с одинаковыми аллелями данного гена' },
            { key: 'Гетерозигота', value: 'Организм с разными аллелями данного гена' },
            { key: 'Доминантный признак', value: 'Проявляется в фенотипе гетерозиготы' },
            { key: 'Рецессивный признак', value: 'Проявляется при отсутствии доминантного (обычно в гомозиготе)' },
            { key: 'Неполное доминирование', value: 'Фенотип гетерозиготы промежуточный между гомозиготами' },
            { key: 'Кодоминирование', value: 'Оба аллеля проявляются одновременно (например, группы крови AB)' },
            { key: 'Сцепленное наследование', value: 'Совместное наследование генов, расположенных в одной хромосоме' },
            { key: 'Карта хромосомы', value: 'Схема расположения генов в хромосоме' },
            { key: 'Генетическая рекомбинация', value: 'Образование новых сочетаний аллелей' },
            { key: 'Тест-скрещивание', value: 'Скрещивание с гомозиготой по рецессиву для выяснения генотипа' },
            { key: 'Мутаген', value: 'Фактор, повышающий частоту мутаций' },
            { key: 'Хромосомная мутация', value: 'Изменение структуры хромосомы (делеция, инверсия, дупликация)' },
            { key: 'Генная мутация', value: 'Изменение последовательности нуклеотидов в гене' },
            { key: 'Полиплоидия', value: 'Увеличение числа наборов хромосом' },
            { key: 'Анеуплоидия', value: 'Изменение числа отдельных хромосом (например, трисомия)' },
            { key: 'Генетический дрейф', value: 'Случайное изменение частот аллелей в малых популяциях' },
            { key: 'Панмиксия', value: 'Случайное скрещивание в популяции' }
            ,{ key: 'Полигенное наследование', value: 'Наследование признака, контролируемого многими генами' }
            ,{ key: 'Эпистаз', value: 'Взаимодействие генов, при котором один ген подавляет проявление другого' }
            ,{ key: 'Плейотропия', value: 'Влияние одного гена на несколько признаков' }
            ,{ key: 'Пенетрантность', value: 'Частота проявления гена в фенотипе у носителей' }
        ];

        addTwoWayDefinitions({ suffix: 'mol', pairs: molBio, topic: 'Молекулярная биология', difficulty: 4, seedBase: 1101 });
        addTwoWayDefinitions({ suffix: 'phys', pairs: phys, topic: 'Физиология и регуляция', difficulty: 4, seedBase: 1201 });
        addTwoWayDefinitions({ suffix: 'eco', pairs: ecologyEvolution, topic: 'Экология и эволюция', difficulty: 4, seedBase: 1301 });
        addTwoWayDefinitions({ suffix: 'gen', pairs: genetics, topic: 'Генетика', difficulty: 4, seedBase: 1401 });
    } else {
        // Для младших/средних оставляем базу, но без "детских" вопросов в старших классах.

        if (isJunior) {
            const organToFunc = [
                { key: 'Лёгкие', value: 'Дыхание (газообмен)' },
                { key: 'Сердце', value: 'Перекачивание крови' },
                { key: 'Желудок', value: 'Начальное переваривание пищи' },
                { key: 'Печень', value: 'Образование желчи и обезвреживание вредных веществ' },
                { key: 'Почки', value: 'Фильтрация крови и образование мочи' },
                { key: 'Мозг', value: 'Управление работой организма' },
                { key: 'Кожа', value: 'Защита тела и терморегуляция' },
                { key: 'Кишечник', value: 'Всасывание питательных веществ' }
            ];
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_organs`,
                    pairs: organToFunc,
                    topic: band === '1-4' ? 'Человек' : 'Анатомия',
                    difficulty: diff,
                    seedBase: 11,
                    questionText: (p) => `Какая основная функция органа «${p.key}»?`,
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `${p.key}: ${p.value}.`
                })
            );

            const senseToOrgan = [
                { key: 'Зрение', value: 'Глаза' },
                { key: 'Слух', value: 'Уши' },
                { key: 'Обоняние', value: 'Нос' },
                { key: 'Вкус', value: 'Язык' },
                { key: 'Осязание', value: 'Кожа' }
            ];
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_senses`,
                    pairs: senseToOrgan,
                    topic: 'Человек',
                    difficulty: Math.max(1, diff - 1),
                    seedBase: 71,
                    questionText: (p) => `Какой орган отвечает за «${p.key}»?`,
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `${p.key} обеспечивают: ${p.value}.`
                })
            );
        }

        if (band !== '1-4' && !isSenior) {
            const termToDef = [
                { key: 'Клетка', value: 'Минимальная живая система' },
                { key: 'Ткань', value: 'Совокупность клеток, сходных по строению и функциям' },
                { key: 'Орган', value: 'Часть тела, выполняющая определённую функцию' },
                { key: 'Система органов', value: 'Группа органов, работающих вместе' },
                { key: 'ДНК', value: 'Молекула, несущая наследственную информацию' },
                { key: 'Ген', value: 'Участок ДНК, определяющий признак' },
                { key: 'Фотосинтез', value: 'Образование органических веществ на свету из CO2 и воды' },
                { key: 'Популяция', value: 'Совокупность особей одного вида на территории' },
                { key: 'Экосистема', value: 'Сообщество организмов и среда их обитания' },
                { key: 'Естественный отбор', value: 'Выживание и размножение наиболее приспособленных' }
            ];
            addTwoWayDefinitions({ suffix: 'terms', pairs: termToDef, topic: band === '5-6' ? 'Основы биологии' : 'Биология', difficulty: diff, seedBase: 37 });
        }

        if (isMiddle || isGrade9) {
            const cellAdvanced = [
                { key: 'Ядро', value: 'Хранение ДНК и регуляция процессов в клетке' },
                { key: 'Рибосомы', value: 'Синтез белка' },
                { key: 'Митохондрии', value: 'Синтез АТФ при клеточном дыхании' },
                { key: 'Аппарат Гольджи', value: 'Модификация и упаковка веществ для транспорта' },
                { key: 'ЭПС', value: 'Синтез/транспорт веществ внутри клетки' },
                { key: 'Лизосомы', value: 'Внутриклеточное пищеварение' },
                { key: 'Хлоропласты', value: 'Фотосинтез (у растений)' }
            ];
            addTwoWayDefinitions({ suffix: 'cell', pairs: cellAdvanced, topic: 'Клетка', difficulty: Math.min(3, diff), seedBase: 83 });
        }

        if (band === '1-4' || band === '5-6' || isMiddle) {
            const plantPartToFunc = [
                { key: 'Корень', value: 'Закрепляет растение и всасывает воду и минеральные вещества' },
                { key: 'Стебель', value: 'Поддерживает и проводит вещества' },
                { key: 'Лист', value: 'Фотосинтез и газообмен' },
                { key: 'Цветок', value: 'Размножение (образование семян)' },
                { key: 'Плод', value: 'Защищает семена и помогает распространению' }
            ];
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_plants`,
                    pairs: plantPartToFunc,
                    topic: 'Растения',
                    difficulty: diff,
                    seedBase: 23,
                    questionText: (p) => `Какова основная роль: «${p.key}»?`,
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `${p.key}: ${p.value}.`
                })
            );
        }

        if (band === '1-4' || band === '5-6') {
            const seasonToChange = [
                { key: 'Весна', value: 'Таяние снега и начало роста растений' },
                { key: 'Лето', value: 'Самые тёплые дни и активный рост' },
                { key: 'Осень', value: 'Листопад и подготовка к зиме' },
                { key: 'Зима', value: 'Холод и снежный покров (часто)' }
            ];
            seasonToChange.forEach((s, idx) => {
                const seed = 2001 + idx * 17;
                const seasons = ['Весна', 'Лето', 'Осень', 'Зима'];
                const distract = pickDistractors(seasons, s.key, 3, seed);
                const options = shuffleWithSeed([s.key, ...distract], seed + 1);
                out.push(
                    makeMcq({
                        id: stableId(`${prefix}_seasons`, idx + 1),
                        topic: 'Природа',
                        difficulty: Math.max(1, diff - 1),
                        question: `В какое время года обычно наблюдают: «${s.value}»?`,
                        options,
                        correct: options.indexOf(s.key),
                        explanation: `Чаще всего это относится к: ${s.key}.`
                    })
                );
            });
        }
    }

    // Финал: уникализируем, перемешиваем, отрезаем desiredCount
    const uniqByText = new Map();
    out.forEach(q => {
        const k = `${(q.question || '').trim()}@@${q.topic || ''}`;
        if (!uniqByText.has(k)) uniqByText.set(k, q);
    });
    const unique = Array.from(uniqByText.values());
    const rotated = shuffleWithSeed(unique, bandStartGrade * 101);
    return rotated
        .slice(0, desiredCount)
        .map(q => ({ ...q, subject: 'biology', gradeBand: band }));
}

function generateChemistryByGrade(bandStartGrade, desiredCount = 64) {
    const band = normalizeBandLabel(bandStartGrade);
    const prefix = `chemistry_${band}`;
    const diff = difficultyByBand(band);
    const out = [];

    const isSenior = band === '10-11';

    const addTwoWayDefinitions = ({ suffix, pairs, topic, difficulty, seedBase }) => {
        const defPrompts = [
            (p) => `Выберите верное определение термина: «${p.key}».`,
            (p) => `Что означает термин «${p.key}»?`
        ];
        defPrompts.forEach((qText, i) => {
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_${suffix}_def${i + 1}`,
                    pairs,
                    topic,
                    difficulty,
                    seedBase: seedBase + i * 13,
                    questionText: (p) => qText(p),
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `Правильно: ${p.value}.`
                })
            );
        });

        const inverted = pairs.map(p => ({ key: p.value, value: p.key }));
        const invPrompts = [
            (p) => `Какой термин соответствует определению: «${p.key}»?`,
            (p) => `Выберите термин по описанию: «${p.key}».`
        ];
        invPrompts.forEach((qText, i) => {
            out.push(
                ...buildMcqFromPairs({
                    prefix: `${prefix}_${suffix}_inv${i + 1}`,
                    pairs: inverted,
                    topic,
                    difficulty,
                    seedBase: seedBase + 97 + i * 17,
                    questionText: (p) => qText(p),
                    optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                    correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                    explanationFn: (p) => `Правильно: ${p.value}.`
                })
            );
        });
    };

    if (isSenior) {
        const core = [
            { key: 'Моль', value: 'Количество вещества, содержащее число Авогадро частиц' },
            { key: 'Молярная масса', value: 'Масса 1 моль вещества (г/моль)' },
            { key: 'Молярная концентрация', value: 'Количество вещества в 1 литре раствора (моль/л)' },
            { key: 'Степень окисления', value: 'Условный заряд атома в соединении' },
            { key: 'ОВР', value: 'Реакция с передачей электронов (окисление и восстановление)' },
            { key: 'Окислитель', value: 'Частица, принимающая электроны (восстанавливается)' },
            { key: 'Восстановитель', value: 'Частица, отдающая электроны (окисляется)' },
            { key: 'Химическое равновесие', value: 'Состояние, когда скорости прямой и обратной реакций равны' },
            { key: 'Константа равновесия', value: 'Величина, характеризующая положение равновесия' },
            { key: 'Принцип Ле Шателье', value: 'Смещение равновесия при внешнем воздействии' },
            { key: 'Скорость реакции', value: 'Изменение концентрации реагента/продукта за единицу времени' },
            { key: 'Катализатор', value: 'Вещество, ускоряющее реакцию и не расходующееся' },
            { key: 'Тепловой эффект реакции', value: 'Количество теплоты, выделяемое/поглощаемое в реакции' },
            { key: 'Электролитическая диссоциация', value: 'Распад электролита на ионы в растворе' }
        ];

        const solutions = [
            { key: 'Раствор', value: 'Однородная смесь растворителя и растворённого вещества' },
            { key: 'Растворитель', value: 'Компонент раствора в большем количестве' },
            { key: 'Растворённое вещество', value: 'Компонент раствора в меньшем количестве' },
            { key: 'Массовая доля', value: 'Отношение массы вещества к массе раствора' },
            { key: 'Титр', value: 'Масса растворённого вещества в 1 мл раствора' },
            { key: 'Электролит', value: 'Вещество, раствор/расплав которого проводит ток' },
            { key: 'Неэлектролит', value: 'Вещество, раствор которого не проводит ток' },
            { key: 'Диссоциация', value: 'Распад молекул электролита на ионы' },
            { key: 'Гидролиз', value: 'Взаимодействие ионов соли с водой' }
        ];

        const acidBase = [
            { key: 'Кислота', value: 'Электролит, диссоциирующий с образованием H+' },
            { key: 'Основание', value: 'Электролит, диссоциирующий с образованием OH-' },
            { key: 'Соль', value: 'Соединение катиона металла (или NH4+) с анионом кислотного остатка' },
            { key: 'pH', value: 'Показатель кислотности раствора' },
            { key: 'Индикатор', value: 'Вещество, меняющее цвет в зависимости от pH' },
            { key: 'Нейтрализация', value: 'Реакция кислоты и основания с образованием соли и воды' },
            { key: 'Амфотерность', value: 'Способность проявлять кислотные и основные свойства' },
            { key: 'Буферный раствор', value: 'Раствор, сопротивляющийся изменению pH при добавлении кислоты/щелочи' }
        ];

        const structure = [
            { key: 'Ковалентная связь', value: 'Связь за счёт общих электронных пар' },
            { key: 'Ионная связь', value: 'Связь за счёт электростатического притяжения ионов' },
            { key: 'Металлическая связь', value: 'Связь между катионами металла и «электронным газом»' },
            { key: 'Валентность', value: 'Число связей, которые может образовывать атом' },
            { key: 'Полярность связи', value: 'Смещение электронной плотности к более электроотрицательному атому' },
            { key: 'Электроотрицательность', value: 'Способность атома притягивать электроны в связи' },
            { key: 'Изомерия', value: 'Одинаковый состав, но разное строение и свойства' }
        ];

        const electrochem = [
            { key: 'Электрод', value: 'Проводник, погружённый в электролит' },
            { key: 'Электролиз', value: 'Химические превращения на электродах при прохождении тока' },
            { key: 'Гальванический элемент', value: 'Источник тока на основе ОВР, протекающей самопроизвольно' },
            { key: 'Катод', value: 'Электрод, на котором идёт восстановление' },
            { key: 'Анод', value: 'Электрод, на котором идёт окисление' }
        ];

        const organic = [
            { key: 'Алканы', value: 'Насыщенные углеводороды с одинарными связями C–C' },
            { key: 'Алкены', value: 'Углеводороды с двойной связью C=C' },
            { key: 'Алкины', value: 'Углеводороды с тройной связью C≡C' },
            { key: 'Арены', value: 'Ароматические углеводороды с бензольным кольцом' },
            { key: 'Спирты', value: 'Органические вещества с группой –OH' },
            { key: 'Фенолы', value: 'Соединения, где –OH связан с ароматическим кольцом' },
            { key: 'Альдегиды', value: 'Соединения с группой –CHO' },
            { key: 'Кетоны', value: 'Соединения с карбонильной группой >C=O' },
            { key: 'Карбоновые кислоты', value: 'Соединения с группой –COOH' },
            { key: 'Сложные эфиры', value: 'Производные кислот и спиртов: R–COO–R' },
            { key: 'Амины', value: 'Производные аммиака с группой –NH2/–NHR/–NR2' },
            { key: 'Галогеналканы', value: 'Производные алканов, где H замещён на галоген' },
            { key: 'Полимеры', value: 'Высокомолекулярные вещества из повторяющихся звеньев' },
            { key: 'Мономер', value: 'Низкомолекулярное вещество — «строительный блок» полимера' },
            { key: 'Полимеризация', value: 'Реакция образования полимера из мономеров' },
            { key: 'Эстерификация', value: 'Образование сложного эфира из кислоты и спирта' },
            { key: 'Гидрирование', value: 'Присоединение водорода по кратной связи' }
        ];

        const reactions = [
            { key: 'Замещение', value: 'Один элемент замещает другой в соединении' },
            { key: 'Соединение', value: 'Из нескольких веществ образуется одно' },
            { key: 'Разложение', value: 'Из одного вещества образуется несколько' },
            { key: 'Обмен', value: 'Обмен ионами/частями между двумя веществами' },
            { key: 'Нейтрализация', value: 'Реакция кислоты и основания с образованием соли и воды' }
        ];

        addTwoWayDefinitions({ suffix: 'core', pairs: core, topic: 'Общая химия', difficulty: 4, seedBase: 2101 });
        addTwoWayDefinitions({ suffix: 'org', pairs: organic, topic: 'Органическая химия', difficulty: 4, seedBase: 2201 });
        addTwoWayDefinitions({ suffix: 'rxn', pairs: reactions, topic: 'Типы реакций', difficulty: 4, seedBase: 2301 });
        addTwoWayDefinitions({ suffix: 'sol', pairs: solutions, topic: 'Растворы', difficulty: 4, seedBase: 2401 });
        addTwoWayDefinitions({ suffix: 'ab', pairs: acidBase, topic: 'Кислоты и основания', difficulty: 4, seedBase: 2501 });
        addTwoWayDefinitions({ suffix: 'str', pairs: structure, topic: 'Строение вещества', difficulty: 4, seedBase: 2601 });
        addTwoWayDefinitions({ suffix: 'el', pairs: electrochem, topic: 'Электрохимия', difficulty: 4, seedBase: 2701 });
    }

    if (!isSenior) {

    // 1) Состояния вещества
    const stateExamples = [
        { key: 'Твёрдое', value: 'Лёд' },
        { key: 'Твёрдое', value: 'Камень' },
        { key: 'Твёрдое', value: 'Железо' },
        { key: 'Жидкость', value: 'Вода' },
        { key: 'Жидкость', value: 'Молоко' },
        { key: 'Жидкость', value: 'Масло' },
        { key: 'Газ', value: 'Воздух' },
        { key: 'Газ', value: 'Кислород' },
        { key: 'Газ', value: 'Углекислый газ' }
    ];

    // Генерируем вопросы «что это за состояние?»
    stateExamples.forEach((ex, idx) => {
        const seed = (bandStartGrade * 1000) + idx * 31;
        const states = ['Твёрдое', 'Жидкость', 'Газ'];
        const distract = pickDistractors(states, ex.key, 3, seed);
        const optionStates = shuffleWithSeed([ex.key, ...distract], seed + 9);
        out.push(
            makeMcq({
                id: stableId(prefix, out.length + 1),
                topic: 'Состояния вещества',
                difficulty: Math.max(1, diff - 1),
                question: `Какое агрегатное состояние обычно имеет «${ex.value}» при комнатной температуре?`,
                options: optionStates,
                correct: optionStates.indexOf(ex.key),
                explanation: `Пример: «${ex.value}» относят к состоянию «${ex.key}» в обычных условиях.`
            })
        );
    });

    // 2) Разделение смесей (безопасные школьные примеры)
    const mixToMethod = [
        { key: 'Песок + вода', value: 'Фильтрование' },
        { key: 'Соль + вода', value: 'Выпаривание' },
        { key: 'Сахар + вода', value: 'Выпаривание' },
        { key: 'Камешки + песок', value: 'Просеивание' },
        { key: 'Опилки + вода', value: 'Отстаивание' },
        { key: 'Железные опилки + песок', value: 'Магнит' },
        { key: 'Масло + вода', value: 'Отстаивание' },
        { key: 'Чайные листья + вода', value: 'Фильтрование' },
        { key: 'Рис + вода', value: 'Процеживание/фильтрование' },
        { key: 'Глина + вода', value: 'Отстаивание' }
    ];

    // Вопросы «каким способом разделить?»
    const methods = Array.from(new Set(mixToMethod.map(m => m.value)));
    mixToMethod.forEach((m, idx) => {
        const seed = 777 + idx * 97 + bandStartGrade * 3;
        const distract = pickDistractors(methods, m.value, 3, seed);
        const options = shuffleWithSeed([m.value, ...distract], seed + 5);
        out.push(
            makeMcq({
                id: stableId(prefix, out.length + 1),
                topic: 'Смеси',
                difficulty: diff,
                question: `Как лучше разделить смесь: ${m.key}?`,
                options,
                correct: options.indexOf(m.value),
                explanation: `Подходит способ: ${m.value}.`
            })
        );
    });

    // 3) Базовые термины (для 7+)
    if (band !== '1-4') {
        const termToDef = [
            { key: 'Атом', value: 'Наименьшая частица химического элемента' },
            { key: 'Молекула', value: 'Частица вещества, сохраняющая его химические свойства' },
            { key: 'Элемент', value: 'Вид атомов с одинаковым зарядом ядра' },
            { key: 'Соединение', value: 'Вещество из атомов разных элементов' },
            { key: 'Реакция', value: 'Процесс превращения одних веществ в другие' },
            { key: 'Катализатор', value: 'Вещество, ускоряющее реакцию и не расходующееся' },
            { key: 'Раствор', value: 'Однородная смесь растворителя и растворённого вещества' },
            { key: 'Индикатор', value: 'Вещество, меняющее цвет в зависимости от среды' },
            { key: 'Оксид', value: 'Соединение элемента с кислородом' },
            { key: 'pH', value: 'Мера кислотности/щелочности раствора' },
            { key: 'Окисление', value: 'Процесс отдачи электронов (в ОВР)' },
            { key: 'Восстановление', value: 'Процесс присоединения электронов (в ОВР)' }
        ];
        out.push(
            ...buildMcqFromPairs({
                prefix: `${prefix}_terms`,
                pairs: termToDef,
                topic: 'Основы химии',
                difficulty: diff,
                seedBase: 101,
                questionText: (p) => `Выберите верное определение термина: «${p.key}».`,
                optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
                correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
                explanationFn: (p) => `Правильно: ${p.value}.`
            })
        );
    }

    // 3b) Безопасность
    const safetyRuleToWhy = [
        { key: 'Читать инструкцию на упаковке', value: 'Чтобы правильно использовать средство и не навредить' },
        { key: 'Работать в перчатках (если нужно)', value: 'Чтобы защитить кожу' },
        { key: 'Не пробовать вещества на вкус', value: 'Это опасно и может привести к отравлению' },
        { key: 'Не смешивать средства без указаний', value: 'Можно получить опасные пары или реакцию' },
        { key: 'Проветривать помещение', value: 'Чтобы не вдыхать пары' },
        { key: 'Держать бытовую химию вдали от детей', value: 'Чтобы избежать несчастных случаев' },
        { key: 'Мыть руки после работы', value: 'Чтобы удалить остатки веществ' },
        { key: 'Не нагревать неизвестные смеси', value: 'Нагрев может усилить реакцию и опасность' },
        { key: 'Использовать очки в лаборатории', value: 'Чтобы защитить глаза' },
        { key: 'Не нюхать вещества напрямую', value: 'Некоторые пары раздражают дыхательные пути' },
        { key: 'Подписывать ёмкости', value: 'Чтобы не перепутать вещества' },
        { key: 'Соблюдать порядок на столе', value: 'Чтобы снизить риск проливов и ошибок' }
    ];
    out.push(
        ...buildMcqFromPairs({
            prefix: `${prefix}_safety`,
            pairs: safetyRuleToWhy,
            topic: 'Безопасность',
            difficulty: Math.max(1, diff - 1),
            seedBase: 303,
            questionText: (p) => `Зачем важно правило: «${p.key}»?`,
            optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
            correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
            explanationFn: (p) => `${p.key}: ${p.value}.`
        })
    );

    // 3c) Физические явления/изменения
    const processToResult = [
        { key: 'Плавление', value: 'Переход из твёрдого в жидкое' },
        { key: 'Замерзание', value: 'Переход из жидкого в твёрдое' },
        { key: 'Испарение', value: 'Переход из жидкого в газообразное' },
        { key: 'Конденсация', value: 'Переход из газообразного в жидкое' },
        { key: 'Кипение', value: 'Быстрое испарение по всему объёму жидкости' },
        { key: 'Растворение', value: 'Равномерное распределение вещества в растворителе' },
        { key: 'Кристаллизация', value: 'Образование кристаллов из раствора/расплава' },
        { key: 'Сублимация', value: 'Переход из твёрдого сразу в газообразное' },
        { key: 'Десублимация', value: 'Переход из газа сразу в твёрдое' },
        { key: 'Диффузия', value: 'Самопроизвольное перемешивание частиц' }
    ];
    out.push(
        ...buildMcqFromPairs({
            prefix: `${prefix}_processes`,
            pairs: processToResult,
            topic: 'Физические явления',
            difficulty: Math.max(1, diff - 1),
            seedBase: 505,
            questionText: (p) => `Что означает процесс: «${p.key}»?`,
            optionsFromKeys: (keys, byKey) => keys.map(k => byKey[k]),
            correctIndexFn: (keys, correctKey) => keys.indexOf(correctKey),
            explanationFn: (p) => `${p.key}: ${p.value}.`
        })
    );

    // 3d) Добор простых вопросов для 1–4 классов
    if (band === '1-4') {
        const solubility = [
            { name: 'Соль', soluble: true },
            { name: 'Сахар', soluble: true },
            { name: 'Сода (пищевая)', soluble: true },
            { name: 'Песок', soluble: false },
            { name: 'Глина', soluble: false },
            { name: 'Мел', soluble: false },
            { name: 'Масло', soluble: false },
            { name: 'Мёд', soluble: true },
            { name: 'Какао-порошок', soluble: false },
            { name: 'Мука', soluble: false },
            { name: 'Лимонный сок', soluble: true },
            { name: 'Уксус', soluble: true },
            { name: 'Кофе растворимый', soluble: true },
            { name: 'Рис', soluble: false },
            { name: 'Опилки', soluble: false },
            { name: 'Сироп', soluble: true }
        ];
        solubility.forEach((x, idx) => {
            const options = ['Да', 'Нет', 'Зависит от температуры', 'Не знаю'];
            const correct = x.soluble ? 0 : 1;
            out.push(
                makeMcq({
                    id: stableId(`${prefix}_solubility`, idx + 1),
                    topic: 'Растворимость',
                    difficulty: 1,
                    question: `Растворится ли «${x.name}» в воде при перемешивании?`,
                    options,
                    correct,
                    explanation: x.soluble ? 'Это вещество обычно растворяется в воде.' : 'Это вещество обычно не растворяется в воде.'
                })
            );
        });

        const materials = [
            { name: 'Железо', prop: 'Притягивается магнитом' },
            { name: 'Сталь', prop: 'Притягивается магнитом' },
            { name: 'Медь', prop: 'Проводит электричество' },
            { name: 'Алюминий', prop: 'Проводит электричество' },
            { name: 'Дерево', prop: 'Плохо проводит электричество' },
            { name: 'Пластик', prop: 'Плохо проводит электричество' },
            { name: 'Стекло', prop: 'Хрупкое (легко разбить)' },
            { name: 'Резина', prop: 'Эластичная (тянется)' },
            { name: 'Бумага', prop: 'Легко намокает' },
            { name: 'Камень', prop: 'Твёрдый материал' },
            { name: 'Лёд', prop: 'Таёт при нагревании' },
            { name: 'Вода', prop: 'Может испаряться при нагревании' }
        ];
        const props = ['Притягивается магнитом', 'Проводит электричество', 'Плохо проводит электричество', 'Хрупкое (легко разбить)', 'Эластичная (тянется)', 'Легко намокает', 'Твёрдый материал', 'Таёт при нагревании', 'Может испаряться при нагревании'];
        materials.forEach((m, idx) => {
            const seed = 4004 + idx * 19;
            const distract = pickDistractors(props, m.prop, 3, seed);
            const options = shuffleWithSeed([m.prop, ...distract], seed + 4);
            out.push(
                makeMcq({
                    id: stableId(`${prefix}_props`, idx + 1),
                    topic: 'Свойства материалов',
                    difficulty: 1,
                    question: `Какое свойство подходит для материала «${m.name}»?`,
                    options,
                    correct: options.indexOf(m.prop),
                    explanation: `Для материала «${m.name}» часто указывают: ${m.prop}.`
                })
            );
        });
    }

    // 4) Символы элементов (для 7+)
    if (band !== '1-4') {
        const elementToSymbol = [
            { key: 'Кислород', value: 'O' },
            { key: 'Водород', value: 'H' },
            { key: 'Углерод', value: 'C' },
            { key: 'Азот', value: 'N' },
            { key: 'Натрий', value: 'Na' },
            { key: 'Калий', value: 'K' },
            { key: 'Кальций', value: 'Ca' },
            { key: 'Железо', value: 'Fe' },
            { key: 'Медь', value: 'Cu' },
            { key: 'Сера', value: 'S' },
            { key: 'Хлор', value: 'Cl' },
            { key: 'Магний', value: 'Mg' }
        ];
        const names = elementToSymbol.map(x => x.key);
        elementToSymbol.forEach((el, idx) => {
            const seed = 909 + idx * 29 + bandStartGrade * 17;
            const distract = pickDistractors(names, el.key, 3, seed);
            const opts = shuffleWithSeed([el.key, ...distract], seed + 7);
            out.push(
                makeMcq({
                    id: stableId(prefix, out.length + 1),
                    topic: 'Периодическая система',
                    difficulty: diff,
                    question: `Какой элемент обозначается символом «${el.value}»?`,
                    options: opts,
                    correct: opts.indexOf(el.key),
                    explanation: `Символ ${el.value} соответствует элементу: ${el.key}.`
                })
            );
        });
    }

    // 5) Формулы распространённых веществ (для 7+)
    if (band !== '1-4') {
        const nameToFormula = [
            { key: 'Вода', value: 'H2O' },
            { key: 'Углекислый газ', value: 'CO2' },
            { key: 'Кислород', value: 'O2' },
            { key: 'Азот', value: 'N2' },
            { key: 'Поваренная соль', value: 'NaCl' },
            { key: 'Аммиак', value: 'NH3' },
            { key: 'Метан', value: 'CH4' },
            { key: 'Серная кислота', value: 'H2SO4' },
            { key: 'Соляная кислота', value: 'HCl' },
            { key: 'Гидроксид натрия', value: 'NaOH' },
            { key: 'Кальций карбонат (мел)', value: 'CaCO3' },
            { key: 'Глюкоза', value: 'C6H12O6' },
            { key: 'Оксид железа(III)', value: 'Fe2O3' },
            { key: 'Оксид кальция', value: 'CaO' },
            { key: 'Этанол', value: 'C2H5OH' }
        ];
        const formulas = nameToFormula.map(x => x.value);
        nameToFormula.forEach((x, idx) => {
            const seed = 7007 + idx * 23 + bandStartGrade * 11;
            const distract = pickDistractors(formulas, x.value, 3, seed);
            const options = shuffleWithSeed([x.value, ...distract], seed + 2);
            out.push(
                makeMcq({
                    id: stableId(`${prefix}_formulas`, idx + 1),
                    topic: 'Формулы',
                    difficulty: diff,
                    question: `Какая формула у вещества: «${x.key}»?`,
                    options,
                    correct: options.indexOf(x.value),
                    explanation: `«${x.key}» записывают как ${x.value}.`
                })
            );
        });
    }

    }

    // Финал: уникализируем и берём ровно desiredCount
    const uniq = new Map();
    out.forEach(q => {
        const k = `${q.question}@@${q.topic}`;
        if (!uniq.has(k)) uniq.set(k, q);
    });
    const unique = Array.from(uniq.values());
    const rotated = shuffleWithSeed(unique, bandStartGrade * 313);
    return rotated
        .slice(0, desiredCount)
        .map(q => ({ ...q, subject: 'chemistry', gradeBand: band }));
}

// База данных вопросов по классам и сложности
// Динамическая база данных вопросов - используем сгенерированные данные
console.log('Initializing questionDatabase...');

// 20 карточек тестов (как в UI). Делаем большие банки, чтобы вопросы не повторялись.
const TEST_CARD_IDS = [
    'profession_general_1','profession_general_5','profession_general_7','profession_general_9','profession_general_10',
    'profession_med_1','profession_med_5','profession_med_7','profession_med_9','profession_med_10',
    'biology_1','biology_5','biology_7','biology_9','biology_10',
    'chemistry_1','chemistry_5','chemistry_7','chemistry_9','chemistry_10'
];

function targetCountByBandStart(bandStartGrade) {
    const g = parseInt(bandStartGrade, 10);
    if (g === 1) return 120;
    if (g === 5) return 150;
    if (g === 7) return 180;
    if (g === 9) return 220;
    if (g === 10) return 260;
    return 180;
}

// Meta для статистики и для ленивой генерации
const QUESTION_COUNTS_BY_TEST_ID = {};
TEST_CARD_IDS.forEach((id) => {
    const bandStart = inferBandStartFromTestId(id);
    QUESTION_COUNTS_BY_TEST_ID[id] = targetCountByBandStart(bandStart || 7);
});
// Экспортируем в window, чтобы главная могла показать количество даже при lazy-генерации
window.__questionCountsByTestId = QUESTION_COUNTS_BY_TEST_ID;

function desiredCountForTestId(testId) {
    const bandStart = inferBandStartFromTestId(testId);
    return QUESTION_COUNTS_BY_TEST_ID[testId] || targetCountByBandStart(bandStart || 7);
}

const questionDatabase = {
    // Профориентация общая
    profession_general_1: () => generateProfessionGeneralQuestions(1, desiredCountForTestId('profession_general_1')),
    profession_general_5: () => generateProfessionGeneralQuestions(5, desiredCountForTestId('profession_general_5')),
    profession_general_7: () => generateProfessionGeneralQuestions(7, desiredCountForTestId('profession_general_7')),
    profession_general_9: () => generateProfessionGeneralQuestions(9, desiredCountForTestId('profession_general_9')),
    profession_general_10: () => generateProfessionGeneralQuestions(10, desiredCountForTestId('profession_general_10')),
    // Медицинская профориентация
    profession_med_1: () => generateMedicalProfessionQuestions(1, desiredCountForTestId('profession_med_1')),
    profession_med_5: () => generateMedicalProfessionQuestions(5, desiredCountForTestId('profession_med_5')),
    profession_med_7: () => generateMedicalProfessionQuestions(7, desiredCountForTestId('profession_med_7')),
    profession_med_9: () => generateMedicalProfessionQuestions(9, desiredCountForTestId('profession_med_9')),
    profession_med_10: () => generateMedicalProfessionQuestions(10, desiredCountForTestId('profession_med_10')),
    // Биология
    biology_1: () => generateBiologyByGrade(1, desiredCountForTestId('biology_1')),
    biology_5: () => generateBiologyByGrade(5, desiredCountForTestId('biology_5')),
    biology_7: () => generateBiologyByGrade(7, desiredCountForTestId('biology_7')),
    biology_9: () => generateBiologyByGrade(9, desiredCountForTestId('biology_9')),
    biology_10: () => generateBiologyByGrade(10, desiredCountForTestId('biology_10')),
    // Химия
    chemistry_1: () => generateChemistryByGrade(1, desiredCountForTestId('chemistry_1')),
    chemistry_5: () => generateChemistryByGrade(5, desiredCountForTestId('chemistry_5')),
    chemistry_7: () => generateChemistryByGrade(7, desiredCountForTestId('chemistry_7')),
    chemistry_9: () => generateChemistryByGrade(9, desiredCountForTestId('chemistry_9')),
    chemistry_10: () => generateChemistryByGrade(10, desiredCountForTestId('chemistry_10')),
    
    // === ТЕСТЫ ПО КЛАССАМ (1-11) ===
    // Профориентация по классам
    profession_grade_1: () => generateGradeQuestions('profession', 1, 100),
    profession_grade_2: () => generateGradeQuestions('profession', 2, 100),
    profession_grade_3: () => generateGradeQuestions('profession', 3, 100),
    profession_grade_4: () => generateGradeQuestions('profession', 4, 100),
    profession_grade_5: () => generateGradeQuestions('profession', 5, 100),
    profession_grade_6: () => generateGradeQuestions('profession', 6, 100),
    profession_grade_7: () => generateGradeQuestions('profession', 7, 100),
    profession_grade_8: () => generateGradeQuestions('profession', 8, 100),
    profession_grade_9: () => generateGradeQuestions('profession', 9, 100),
    profession_grade_10: () => generateGradeQuestions('profession', 10, 100),
    profession_grade_11: () => generateGradeQuestions('profession', 11, 100),
    
    // Химия по классам
    chemistry_grade_1: () => generateGradeQuestions('chemistry', 1, 100),
    chemistry_grade_2: () => generateGradeQuestions('chemistry', 2, 100),
    chemistry_grade_3: () => generateGradeQuestions('chemistry', 3, 100),
    chemistry_grade_4: () => generateGradeQuestions('chemistry', 4, 100),
    chemistry_grade_5: () => generateGradeQuestions('chemistry', 5, 100),
    chemistry_grade_6: () => generateGradeQuestions('chemistry', 6, 100),
    chemistry_grade_7: () => generateGradeQuestions('chemistry', 7, 100),
    chemistry_grade_8: () => generateGradeQuestions('chemistry', 8, 100),
    chemistry_grade_9: () => generateGradeQuestions('chemistry', 9, 100),
    chemistry_grade_10: () => generateGradeQuestions('chemistry', 10, 100),
    chemistry_grade_11: () => generateGradeQuestions('chemistry', 11, 100),
    
    // Биология по классам
    biology_grade_1: () => generateGradeQuestions('biology', 1, 100),
    biology_grade_2: () => generateGradeQuestions('biology', 2, 100),
    biology_grade_3: () => generateGradeQuestions('biology', 3, 100),
    biology_grade_4: () => generateGradeQuestions('biology', 4, 100),
    biology_grade_5: () => generateGradeQuestions('biology', 5, 100),
    biology_grade_6: () => generateGradeQuestions('biology', 6, 100),
    biology_grade_7: () => generateGradeQuestions('biology', 7, 100),
    biology_grade_8: () => generateGradeQuestions('biology', 8, 100),
    biology_grade_9: () => generateGradeQuestions('biology', 9, 100),
    biology_grade_10: () => generateGradeQuestions('biology', 10, 100),
    biology_grade_11: () => generateGradeQuestions('biology', 11, 100),
    
    // Специальность по классам
    specialty_grade_1: () => generateGradeQuestions('specialty', 1, 100),
    specialty_grade_2: () => generateGradeQuestions('specialty', 2, 100),
    specialty_grade_3: () => generateGradeQuestions('specialty', 3, 100),
    specialty_grade_4: () => generateGradeQuestions('specialty', 4, 100),
    specialty_grade_5: () => generateGradeQuestions('specialty', 5, 100),
    specialty_grade_6: () => generateGradeQuestions('specialty', 6, 100),
    specialty_grade_7: () => generateGradeQuestions('specialty', 7, 100),
    specialty_grade_8: () => generateGradeQuestions('specialty', 8, 100),
    specialty_grade_9: () => generateGradeQuestions('specialty', 9, 100),
    specialty_grade_10: () => generateGradeQuestions('specialty', 10, 100),
    specialty_grade_11: () => generateGradeQuestions('specialty', 11, 100),
    
    // Старые названия для совместимости
    biology: () => generateBiologyByGrade(9, desiredCountForTestId('biology_9')),
    chemistry: () => generateChemistryByGrade(9, desiredCountForTestId('chemistry_9')),
    profession: () => generateProfessionGeneralQuestions(9, desiredCountForTestId('profession_general_9'))
};
console.log('QuestionDatabase initialized with', Object.keys(questionDatabase).length, 'test types');

// ==============================
// Сопоставление «общих» кнопок к карточкам по классу
// (чтобы 10–11 класс не получал вопросы уровня 1–6)
// ==============================
function bandStartFromUserGrade(userGrade) {
    const g = parseInt(userGrade, 10);
    if (!Number.isFinite(g)) return 9;
    if (g <= 4) return 1;
    if (g <= 6) return 5;
    if (g <= 8) return 7;
    if (g === 9) return 9;
    return 10;
}

function resolveTestIdByUserGrade(subject, userGrade) {
    const s = String(subject || '');
    const bandStart = bandStartFromUserGrade(userGrade);

    // Если уже передан id карточки (biology_10 и т.п.) — оставляем.
    if (questionDatabase[s]) return s;

    const bandSuffix = String(bandStart);

    if (s === 'biology') return `biology_${bandSuffix}`;
    if (s === 'chemistry') return `chemistry_${bandSuffix}`;

    // Кнопки/ссылки могут использовать общий subject для профориентации
    if (s === 'profession') {
        // Для 10–11 берём старшую карточку, иначе 9-ю
        return bandStart >= 10 ? 'profession_general_10' : 'profession_general_9';
    }

    // На будущее: если когда-то появятся короткие id категорий
    if (s === 'profession_general') return bandStart >= 10 ? 'profession_general_10' : 'profession_general_9';
    if (s === 'profession_med') return bandStart >= 10 ? 'profession_med_10' : 'profession_med_9';

    return s;
}

// ==============================
// Анти-повторы между прохождениями (персистентно)
// ==============================
const USED_KEYS_STORAGE_VERSION = 'v1';
function usedKeysStorageKey(testId) {
    return `mo_used_question_keys_${USED_KEYS_STORAGE_VERSION}_${String(testId || '')}`;
}

function loadUsedQuestionKeys(testId) {
    const key = usedKeysStorageKey(testId);
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return new Set();
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return new Set();
        // ограничиваем размер на чтении (защита от раздувания)
        return new Set(arr.slice(-4000).map(String));
    } catch {
        return new Set();
    }
}

function saveUsedQuestionKeys(testId, setOrArray) {
    const key = usedKeysStorageKey(testId);
    try {
        const arr = Array.isArray(setOrArray)
            ? setOrArray.map(String)
            : Array.from((setOrArray instanceof Set ? setOrArray : new Set())).map(String);
        // храним хвост, чтобы localStorage не разрастался бесконечно
        const trimmed = arr.slice(-4000);
        localStorage.setItem(key, JSON.stringify(trimmed));
    } catch {
        // ignore
    }
}

// Система адаптивного тестирования
class AdaptiveTestSystem {
    constructor() {
        this.currentTest = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.currentDifficulty = 1;
        this.questionsUsed = new Set();
        this.questionKeysUsed = new Set();
        this.persistedUsedKeys = new Set();
        this._persistCounter = 0;
        this._persistEvery = 8;
        this.skippedQuestions = [];
        this.totalQuestions = 25; // По умолчанию 25 вопросов
        this.maxDifficulty = 4;
        this.startTime = null;
        this.testResults = null;
        this.currentQuestionData = null;
    }

    getQuestionUniqueKey(q, fallbackIndex = 0) {
        if (!q) return `null_${fallbackIndex}`;
        const kind = q.kind || 'mcq';
        const topic = q.topic || '';
        const dim = q.dimension || '';
        const text = (q.question || '').trim();
        // Если вдруг нет текста, используем id/индекс
        const base = text || String(q.id || fallbackIndex);
        return `${kind}|${topic}|${dim}|${base}`;
    }

    collectQuestionsForCurrentTest() {
        const subject = questionDatabase[this.currentTest];
        if (!subject) return [];
        if (Array.isArray(subject)) return subject;

        // Lazy generator: функция, возвращающая массив вопросов
        if (typeof subject === 'function') {
            try {
                const generated = subject();
                const arr = Array.isArray(generated) ? generated : [];
                const cat = inferCategoryFromTestId(this.currentTest);
                if (!cat) return arr;
                const hasTags = arr.some(q => q && q.subject);
                if (!hasTags) return arr;
                return arr.filter(q => q && q.subject === cat);
            } catch (e) {
                console.warn('Failed to generate questions for', this.currentTest, e);
                return [];
            }
        }

        const maxLevel = Math.min(this.maxDifficulty || 4, 4);
        let questions = [];
        for (let level = 1; level <= maxLevel; level++) {
            questions = questions.concat(subject[level] || []);
        }
        const cat = inferCategoryFromTestId(this.currentTest);
        if (!cat) return questions;
        const hasTags = questions.some(q => q && q.subject);
        if (!hasTags) return questions;
        return questions.filter(q => q && q.subject === cat);
    }

    startTest(subject, userGrade = 5) {
        console.log('AdaptiveTestSystem.startTest called with:', subject, userGrade);
        
        // На случай вызова startTest('biology') / startTest('chemistry') и т.п.
        // приводим к конкретной карточке по классу.
        const resolved = resolveTestIdByUserGrade(subject, userGrade);
        this.currentTest = resolved;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];

        // Сложность определяется карточкой теста (biology_10 / chemistry_9 и т.п.)
        const bandStart = inferBandStartFromTestId(this.currentTest);
        const band = bandStart ? normalizeBandLabel(bandStart) : null;
        const byCard = band ? difficultyByBand(band) : null;
        this.maxDifficulty = byCard || this.getDifficultyForGrade(userGrade);
        this.currentDifficulty = this.maxDifficulty;
        this.questionsUsed.clear();
        this.questionKeysUsed.clear();
        // Сбрасываем историю использованных вопросов для каждого нового теста
        this.persistedUsedKeys = new Set();
        this._persistCounter = 0;
        this.skippedQuestions = [];
        this.startTime = Date.now();
        this.testResults = null;
        this.updateSkippedInfo();

        // Устанавливаем количество вопросов по типу теста:
        // Профориентация = 45 вопросов
        // Биология, Химия, Специальность = 25 вопросов
        const isProfession = this.currentTest && this.currentTest.includes('profession');
        this.totalQuestions = isProfession ? 45 : 25;
        
        console.log('Test initialized, totalQuestions:', this.totalQuestions, 'calling showQuestion');
        this.showQuestion();
    }

    getNextQuestion() {
        const questions = this.collectQuestionsForCurrentTest();
        if (!questions || questions.length === 0) return null;

        // Фильтруем уже использованные вопросы (по id и по ключу текста)
        const availableQuestions = questions.filter((q, index) => {
            const idKey = q && q.id ? String(q.id) : String(index);
            const uniqKey = this.getQuestionUniqueKey(q, index);
            const notUsedThisRun = !this.questionsUsed.has(idKey) && !this.questionKeysUsed.has(uniqKey);
            const notUsedBefore = !(this.persistedUsedKeys && this.persistedUsedKeys.has(uniqKey));
            return notUsedThisRun && notUsedBefore;
        });

        if (availableQuestions.length === 0) {
            // Если всё уже было использовано в прошлых попытках — сбрасываем историю для этой карточки.
            // Так пользователь сможет пройти тест снова, даже если банк исчерпан.
            try {
                if (this.persistedUsedKeys && this.persistedUsedKeys.size > 0) {
                    this.persistedUsedKeys.clear();
                    saveUsedQuestionKeys(this.currentTest, this.persistedUsedKeys);
                }
            } catch {
                // ignore
            }
            return null;
        }

        const isOrientation = isOrientationSubjectId(this.currentTest);

        // Для предметных тестов стараемся держаться около текущей сложности
        let question = null;
        if (!isOrientation) {
            const target = Math.min(4, Math.max(1, this.currentDifficulty || this.maxDifficulty || 3));
            const withDist = availableQuestions.map((q) => {
                const d = Math.min(4, Math.max(1, parseInt(q?.difficulty, 10) || target));
                const dist = Math.abs(d - target);
                return { q, d, dist };
            });

            // Пытаемся брать вопросы с dist 0..1, иначе fallback
            const near = withDist.filter(x => x.dist <= 1);
            const pool = near.length > 0 ? near : withDist;

            // Взвешенный выбор: ближе к target — выше шанс
            const weights = pool.map(x => (x.dist === 0 ? 3 : x.dist === 1 ? 2 : 1));
            const totalW = weights.reduce((s, w) => s + w, 0);
            let r = Math.random() * totalW;
            let picked = pool[pool.length - 1];
            for (let i = 0; i < pool.length; i++) {
                r -= weights[i];
                if (r <= 0) { picked = pool[i]; break; }
            }
            question = picked.q;
        } else {
            // Профориентация: случайный вопрос
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            question = availableQuestions[randomIndex];
        }

        const originalIndex = questions.indexOf(question);

        const idKey = question && question.id ? String(question.id) : String(originalIndex);
        const uniqKey = this.getQuestionUniqueKey(question, originalIndex);
        this.questionsUsed.add(idKey);
        this.questionKeysUsed.add(uniqKey);

        // Запоминаем вопрос между прохождениями
        try {
            this.persistedUsedKeys.add(uniqKey);
            this._persistCounter += 1;
            if (this._persistCounter >= this._persistEvery) {
                this._persistCounter = 0;
                saveUsedQuestionKeys(this.currentTest, this.persistedUsedKeys);
            }
        } catch {
            // ignore
        }
        return question;
    }

    getDifficultyForGrade(grade) {
        const g = parseInt(grade, 10) || 9;
        if (g <= 4) return 1;
        if (g <= 6) return 2;
        if (g <= 8) return 3;
        if (g === 9) return 3;
        return 4;
    }

    showQuestion() {
        console.log('showQuestion called, currentQuestion:', this.currentQuestion);
        
        const answeredCount = this.answers.length;
        const skippedCount = this.skippedQuestions.length;
        const remainingSlots = this.totalQuestions - answeredCount;
        const shouldFinish = remainingSlots <= 0 && skippedCount === 0;
        if (shouldFinish) {
            console.log('All required questions answered, finishing test');
            this.finishTest();
            return;
        }

        let question = null;
        if (skippedCount > 0 && skippedCount >= remainingSlots) {
            // Если пропущенных достаточно, чтобы закрыть оставшиеся слоты, сначала вернём их
            question = this.skippedQuestions.shift();
        } else {
            question = this.getNextQuestion() || this.skippedQuestions.shift();
        }

        console.log('Got question:', question);
        
        if (!question) {
            console.log('No more questions available, finishing test');
            this.finishTest();
            return;
        }

        this.renderQuestion(question, answeredCount + 1);
        this.updateProgressBar();
        this.updateSkippedInfo();
    }

    renderQuestion(question, displayNumber) {
        // Отображаем вопрос с проверкой существования элементов
        const questionCounter = document.getElementById('question-counter');
        const questionText = document.getElementById('question-text');
        const difficultyIndicator = document.getElementById('difficulty-indicator');
        const optionsContainer = document.getElementById('options-container');

        if (questionCounter) {
            const num = Math.min(displayNumber, this.totalQuestions);
            questionCounter.textContent = `Вопрос ${num} из ${this.totalQuestions}`;
        }

        if (questionText) {
            questionText.textContent = question.question;
        }

        if (difficultyIndicator) {
            const difficultyLevels = ['Начальный', 'Лёгкий', 'Средний', 'Сложный', 'Продвинутый'];
            const level = Math.min(4, Math.max(0, (question.difficulty || 1) - 1));
            difficultyIndicator.textContent = `Уровень сложности: ${difficultyLevels[level]}`;
        }

        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            (question.options || []).forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.onclick = () => this.selectOption(index);
                optionElement.innerHTML = `
                    <input type="radio" name="answer" value="${index}">
                    <span>${option}</span>
                `;
                optionsContainer.appendChild(optionElement);
            });
        }

        // Блокируем кнопку ответа до выбора варианта
        const nextBtn = document.getElementById('adaptive-next-btn');
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.style.display = 'inline-flex';
        }

        // Включаем/выключаем кнопку "Назад" (предыдущий вопрос)
        const prevBtn = document.getElementById('adaptive-prev-btn');
        if (prevBtn) {
            prevBtn.disabled = this.answers.length === 0;
            prevBtn.style.display = 'inline-flex';
        }

        this.currentQuestionData = question;
    }

    selectOption(selectedIndex) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected'));
        options[selectedIndex].classList.add('selected');

        const nextBtn = document.getElementById('adaptive-next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.display = 'inline-flex';
        }
    }

    submitAnswer() {
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) return;

        const selectedIndex = parseInt(selectedOption.querySelector('input').value);
        const isOrientation = this.currentQuestionData && this.currentQuestionData.kind === 'likert';
        const isCorrect = isOrientation ? null : (selectedIndex === this.currentQuestionData.correct);
        
        // сохраняем снапшот вопроса, чтобы можно было вернуться "Назад"
        const questionSnapshot = {
            id: this.currentQuestionData.id,
            kind: this.currentQuestionData.kind,
            dimension: this.currentQuestionData.dimension,
            topic: this.currentQuestionData.topic,
            question: this.currentQuestionData.question,
            options: Array.isArray(this.currentQuestionData.options) ? [...this.currentQuestionData.options] : [],
            correct: this.currentQuestionData.correct,
            difficulty: this.currentQuestionData.difficulty,
            explanation: this.currentQuestionData.explanation
        };

        this.answers.push({
            question: questionSnapshot.question,
            selectedIndex,
            correctIndex: questionSnapshot.correct,
            isCorrect,
            difficulty: questionSnapshot.difficulty,
            explanation: questionSnapshot.explanation,
            topic: questionSnapshot.topic,
            kind: questionSnapshot.kind,
            dimension: questionSnapshot.dimension,
            questionId: questionSnapshot.id,
            questionData: questionSnapshot
        });

        if (!isOrientation && isCorrect) this.score++;

        // Простая адаптация сложности: вверх за правильный, вниз за неправильный
        if (!isOrientation) {
            if (isCorrect === true && this.currentDifficulty < this.maxDifficulty) {
                this.currentDifficulty += 1;
            } else if (isCorrect === false && this.currentDifficulty > 1) {
                this.currentDifficulty -= 1;
            }
        }
        this.currentQuestion++;
        
        setTimeout(() => {
            this.showQuestion();
        }, 500);
    }

    goBackOneQuestion() {
        if (!this.currentTest) return;
        if (!this.answers || this.answers.length === 0) return;

        const last = this.answers.pop();
        // откатываем score только для предметных тестов
        if (!isOrientationSubjectId(this.currentTest) && last && last.isCorrect) {
            this.score = Math.max(0, this.score - 1);
        }

        // показываем тот же вопрос снова
        const q = last && last.questionData ? last.questionData : null;
        if (!q) {
            this.showQuestion();
            return;
        }

        // Возвращаем вопрос в поток: убираем из used, чтобы не терялся
        try {
            if (q.id) this.questionsUsed.delete(String(q.id));
            this.questionKeysUsed.delete(this.getQuestionUniqueKey(q, 0));
        } catch {
            // ignore
        }
        this.currentQuestionData = q;

        // Рендерим как "текущий" (номер = answers.length + 1)
        this.renderQuestion(q, this.answers.length + 1);
        this.updateProgressBar();
        this.updateSkippedInfo();
    }

    skipCurrentQuestion() {
        if (!this.currentQuestionData) return;
        this.skippedQuestions.push(this.currentQuestionData);
        this.currentQuestionData = null;
        this.updateSkippedInfo();
        this.showQuestion();
    }

    updateProgressBar() {
        const progress = (this.answers.length / this.totalQuestions) * 100;
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateSkippedInfo() {
        const skippedInfo = document.getElementById('skipped-info');
        if (!skippedInfo) return;
        const skipped = this.skippedQuestions.length;
        skippedInfo.textContent = skipped > 0
            ? `Пропущено: ${skipped}`
            : 'Нет пропущенных вопросов';
    }

    finishTest() {
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);

        const isOrientation = isOrientationSubjectId(this.currentTest);
        let percentage = 0;
        let profile = null;
        if (isOrientation) {
            profile = this.computeOrientationProfile();
            percentage = profile.overallScore;
        } else {
            percentage = this.answers.length > 0
                ? Math.round((this.score / this.answers.length) * 100)
                : 0;
        }
        
        this.testResults = {
            score: this.score,
            total: this.answers.length,
            percentage,
            timeSpent,
            answers: this.answers,
            subject: this.currentTest,
            isOrientation,
            profile
        };

        this.showResults();
        this.saveResults();

        // Сохраняем анти-повтор ключи (на всякий случай, если тест завершили быстро)
        try {
            saveUsedQuestionKeys(this.currentTest, this.persistedUsedKeys);
        } catch {
            // ignore
        }
    }

    showResults() {
        // Скрыть только адаптивный контейнер теста внутри секции tests (не старый)
        const adaptiveContainer = [...document.querySelectorAll('#tests .test-container')]
            .find(c => c.id !== 'test-questions-container');
        if (adaptiveContainer) adaptiveContainer.style.display = 'none';

        // Показать контейнер результатов новой системы
        const adaptiveResultContainer = document.getElementById('adaptive-result-container');
        if (adaptiveResultContainer) {
            adaptiveResultContainer.style.display = 'block';
            adaptiveResultContainer.classList.add('show');
        }

        const adaptiveResultScore = document.getElementById('adaptive-result-score');
        if (adaptiveResultScore) {
            adaptiveResultScore.textContent = `${this.testResults.percentage}%`;
        }
        
        this.displayDetailedResults();
    }
    
    displayDetailedResults() {
        const statsContainer = document.getElementById('adaptive-result-stats');
        if (statsContainer) {
            const incorrectCount = this.testResults.isOrientation ? 0 : (this.testResults.total - this.testResults.score);
            statsContainer.innerHTML = `
                <div class="stat-item">
                    <span class="stat-icon">${this.testResults.isOrientation ? '🧭' : '✅'}</span>
                    <span class="stat-value">${this.testResults.isOrientation ? this.testResults.total : this.testResults.score}</span>
                    <span class="stat-label">${this.testResults.isOrientation ? 'Ответов' : 'Правильных'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">${this.testResults.isOrientation ? '📌' : '❌'}</span>
                    <span class="stat-value">${this.testResults.isOrientation ? this.skippedQuestions.length : incorrectCount}</span>
                    <span class="stat-label">${this.testResults.isOrientation ? 'Пропущено' : 'Неправильных'}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">${Math.floor(this.testResults.timeSpent / 60)}:${(this.testResults.timeSpent % 60).toString().padStart(2, '0')}</span>
                    <span class="stat-label">Время</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">📊</span>
                    <span class="stat-value">${this.testResults.percentage}%</span>
                    <span class="stat-label">${this.testResults.isOrientation ? 'Профиль' : 'Точность'}</span>
                </div>
            `;
        }
        
        const analysisContainer = document.getElementById('adaptive-analysis-section');
        if (analysisContainer) {
            const levelInfo = this.getLevelInfo();
            const weaknesses = this.getWeaknesses();

            if (this.testResults.isOrientation) {
                const prof = this.testResults.profile;
                const scores = (prof && Array.isArray(prof.scores)) ? prof.scores : [];
                const top = scores.slice(0, 3);

                const labelOf = (k) => (typeof ORIENTATION_DIM_LABELS === 'object' && ORIENTATION_DIM_LABELS && ORIENTATION_DIM_LABELS[k]) ? ORIENTATION_DIM_LABELS[k] : String(k);

                const suggestCareers = () => {
                    const keys = top.map(t => t.key);
                    const subject = String(this.testResults.subject || '');
                    const list = [];

                    const push = (v) => { if (v && !list.includes(v)) list.push(v); };
                    const has = (k) => keys.includes(k);

                    // Мед.трек — больше упор на мед.профессии
                    if (subject.startsWith('profession_med_')) {
                        if (has('empathy') || has('people')) { push('Медсестра / медбрат'); push('Педиатр'); }
                        if (has('science') || has('analysis')) { push('Лаборант / лабораторная диагностика'); push('Фармацевт'); }
                        if (has('accuracy')) { push('Стоматолог'); push('Медицинский лабораторный техник'); }
                        if (has('stress')) { push('Скорая помощь (фельдшер)'); }
                        if (has('teamwork')) { push('Врач в стационаре (командная работа)'); }
                        if (has('responsibility')) { push('Врач общей практики'); }
                        // универсальные
                        push('Психолог (медицинский/клинический)');
                        return list.slice(0, 7);
                    }

                    // Общая профориентация
                    if (has('people')) { push('Психолог'); push('Преподаватель'); push('HR-специалист'); }
                    if (has('analysis')) { push('Аналитик'); push('Программист'); push('Инженер'); }
                    if (has('creativity')) { push('Дизайнер'); push('Маркетолог'); push('Контент-менеджер'); }
                    if (has('practice')) { push('Техник'); push('Мастер/специалист по оборудованию'); }
                    if (has('science')) { push('Исследователь'); push('Лаборант'); }
                    if (has('teamwork')) { push('Менеджер проектов'); push('Организатор мероприятий'); }

                    return list.slice(0, 7);
                };

                const careers = suggestCareers();

                analysisContainer.innerHTML = `
                    <h3><i class="fas fa-compass"></i> Ваш профориентационный профиль</h3>
                    <div class="grade-estimate">
                        🧭 Итог: <strong>${levelInfo.level}</strong>
                        <br><small style="opacity: 0.9; margin-top: 8px; display: block;">${levelInfo.description}</small>
                    </div>

                    <div class="strengths">
                        <h4>Что вам подходит сильнее всего</h4>
                        <div class="category-list">
                            <ul>
                                ${(top.length ? top : scores.slice(0, 3)).map(s => `<li>${labelOf(s.key)} — ${s.score}%</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="recommendations">
                        <h4>Кем можно быть (примеры)</h4>
                        <div class="category-list">
                            <ul>
                                ${(careers.length ? careers : ['Рекомендаций пока мало — ответьте на больше вопросов или пройдите тест ещё раз.']).map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="recommendations">
                        <h4>Что попробовать дальше</h4>
                        <div class="category-list">
                            <ul>
                                ${this.getRecommendations().map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                analysisContainer.innerHTML = `
                    <h3><i class="fas fa-chart-line"></i> Анализ вашего результата</h3>
                    
                    <div class="grade-estimate">
                        📈 Ваш уровень подготовки: <strong>${levelInfo.level}</strong>
                        <br><small style="opacity: 0.9; margin-top: 8px; display: block;">${levelInfo.description}</small>
                    </div>
                    
                    <div class="strengths">
                        <h4>Сильные стороны</h4>
                        <div class="category-list">
                            <ul>
                                ${this.getStrengths().map(strength => `<li>${strength}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="weaknesses">
                        <h4>Области для улучшения</h4>
                        <div class="category-list">
                            <ul>
                                ${weaknesses.map(weakness => `<li>${weakness}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="recommendations">
                        <h4>Рекомендации</h4>
                        <div class="category-list">
                            <ul>
                                ${this.getRecommendations().map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
        }
        
        const answersContainer = document.getElementById('adaptive-detailed-answers');
        if (answersContainer) {
            const difficultyNames = ['Начальный', 'Лёгкий', 'Средний', 'Сложный'];
            const isOrientationTest = !!this.testResults.isOrientation;
            
            answersContainer.innerHTML = `
                <h3>📋 Детальный разбор ответов</h3>
                ${this.testResults.answers.map((answer, index) => {
                    const difficultyName = difficultyNames[Math.min(answer.difficulty - 1, 3)] || 'Средний';
                    const statusClass = isOrientationTest ? 'orientation' : (answer.isCorrect ? 'correct' : 'incorrect');
                    const statusText = isOrientationTest
                        ? `🧭 ${LIKERT_5[clamp(answer.selectedIndex, 0, 4)]}`
                        : (answer.isCorrect ? '✓ Верно' : '✗ Неверно');
                    return `
                    <div class="answer-review ${statusClass}">
                        <div class="answer-header">
                            <span class="question-num">Вопрос ${index + 1}</span>
                            <span class="difficulty-badge">${difficultyName}</span>
                            <span class="result-badge ${statusClass}">
                                ${statusText}
                            </span>
                        </div>
                        <div class="answer-question">${answer.question}</div>
                        <div class="answer-explanation">
                            <strong>💡 Объяснение:</strong> ${answer.explanation || 'Объяснение отсутствует'}
                        </div>
                    </div>
                `}).join('')}
            `;
        }
    }

    computeOrientationProfile() {
        const subject = this.currentTest;
        const answers = this.answers.filter(a => a.kind === 'likert' && typeof a.selectedIndex === 'number');

        const dims = {};
        answers.forEach(a => {
            const dim = a.dimension || 'other';
            const value = clamp(a.selectedIndex, 0, 4); // 0..4
            if (!dims[dim]) dims[dim] = { sum: 0, count: 0 };
            dims[dim].sum += value;
            dims[dim].count += 1;
        });

        const scores = Object.entries(dims)
            .map(([k, v]) => ({
                key: k,
                score: v.count > 0 ? Math.round((v.sum / (v.count * 4)) * 100) : 0
            }))
            .sort((a, b) => b.score - a.score);

        // Общий «индекс выраженности»: чем выше среднее по всем шкалам, тем яснее профиль
        const avg = scores.length > 0
            ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length)
            : 0;

        // Для мед.профориентации считаем «медицинскую пригодность» по ключевым шкалам
        const scoreByKey = Object.fromEntries(scores.map(s => [s.key, s.score]));
        const medKeys = ['empathy', 'responsibility', 'stress', 'accuracy', 'science', 'teamwork'];
        const medAvg = Math.round(medKeys.reduce((acc, k) => acc + (scoreByKey[k] ?? 0), 0) / medKeys.length);

        const overallScore = subject.startsWith('profession_med_') ? medAvg : avg;

        return {
            overallScore,
            scores
        };
    }
    
    getLevelInfo() {
        if (this.testResults.isOrientation) {
            const p = this.testResults.profile;
            const overall = p?.overallScore ?? this.testResults.percentage;
            if (overall >= 80) {
                return { level: 'Профиль выражен', description: 'Ответы достаточно устойчивые: видно, какие форматы деятельности вам подходят.' };
            }
            if (overall >= 60) {
                return { level: 'Профиль формируется', description: 'Есть предпочтения, но часть шкал пока выражена умеренно — это нормально.' };
            }
            return { level: 'Профиль неустойчив', description: 'Рекомендация: пройти тест ещё раз через несколько дней и сравнить результаты.' };
        }

        const percentage = this.testResults.percentage;
        if (percentage >= 90) {
            return { level: 'Отлично (5)', description: 'Превосходное знание материала! Вы готовы к углублённому изучению.' };
        } else if (percentage >= 75) {
            return { level: 'Хорошо (4)', description: 'Хороший уровень подготовки. Ещё немного практики для совершенства!' };
        } else if (percentage >= 60) {
            return { level: 'Удовлетворительно (3)', description: 'Базовые знания есть, но требуется дополнительная работа.' };
        } else {
            return { level: 'Требуется подготовка', description: 'Рекомендуем повторить материал и пройти тест снова.' };
        }
    }
    
    getWeaknesses() {
        if (this.testResults.isOrientation) {
            const scores = this.testResults.profile?.scores || [];
            const bottom = [...scores].reverse().slice(0, 2);
            if (bottom.length === 0) return ['Недостаточно данных: ответьте на большее число вопросов.'];
            const labelOf = (k) => (typeof ORIENTATION_DIM_LABELS === 'object' && ORIENTATION_DIM_LABELS && ORIENTATION_DIM_LABELS[k]) ? ORIENTATION_DIM_LABELS[k] : String(k);
            return bottom.map(s => `Шкала «${labelOf(s.key)}»: ${s.score}% — можно усилить через практику и пробные активности`);
        }

        const incorrectAnswers = this.testResults.answers.filter(a => a.isCorrect === false);
        const weaknesses = [];
        
        if (incorrectAnswers.length > 0) {
            const easyMistakes = incorrectAnswers.filter(a => a.difficulty <= 2).length;
            const mediumMistakes = incorrectAnswers.filter(a => a.difficulty > 2 && a.difficulty <= 4).length;
            const hardMistakes = incorrectAnswers.filter(a => a.difficulty > 4).length;
            
            if (easyMistakes > 0) {
                weaknesses.push(`Ошибки в базовых вопросах (${easyMistakes} шт.) - повторите основы`);
            }
            if (mediumMistakes > 0) {
                weaknesses.push(`Ошибки в вопросах средней сложности (${mediumMistakes} шт.)`);
            }
            if (hardMistakes > 0) {
                weaknesses.push(`Сложные вопросы требуют доработки (${hardMistakes} шт.)`);
            }
        }
        
        if (weaknesses.length === 0) {
            weaknesses.push('Отличный результат! Особых слабых мест не выявлено.');
        }
        
        return weaknesses;
    }
    
    getStrengths() {
        if (this.testResults.isOrientation) {
            const scores = this.testResults.profile?.scores || [];
            const top = scores.slice(0, 3);
            if (top.length === 0) return ['Недостаточно данных: ответьте на большее число вопросов.'];
            const labelOf = (k) => (typeof ORIENTATION_DIM_LABELS === 'object' && ORIENTATION_DIM_LABELS && ORIENTATION_DIM_LABELS[k]) ? ORIENTATION_DIM_LABELS[k] : String(k);
            return top.map(s => `Шкала «${labelOf(s.key)}»: ${s.score}% — выражена сильнее всего`);
        }

        // Для предметов: анализ по темам
        const topicStats = this.getTopicStats();
        const strengths = [];
        if (topicStats.length > 0) {
            topicStats.slice(0, 3).forEach(t => strengths.push(`Тема «${t.topic}»: ${t.accuracy}% правильных (${t.correct}/${t.total})`));
        }

        if (strengths.length === 0) {
            strengths.push('Есть базовые знания, но требуется развитие.' );
        }
        return strengths;
    }

    getTopicStats() {
        const answers = (this.testResults.answers || []).filter(a => a.topic);
        if (answers.length === 0) return [];

        const map = new Map();
        answers.forEach(a => {
            const key = a.topic;
            const current = map.get(key) || { topic: key, total: 0, correct: 0 };
            current.total += 1;
            if (a.isCorrect) current.correct += 1;
            map.set(key, current);
        });

        const stats = Array.from(map.values()).map(s => ({
            ...s,
            accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
        }));

        // Сильные — сверху, слабые — снизу
        stats.sort((a, b) => b.accuracy - a.accuracy);
        return stats;
    }
    
    getRecommendations() {
        if (this.testResults.isOrientation) {
            const overall = this.testResults.profile?.overallScore ?? this.testResults.percentage;
            const top = (this.testResults.profile?.scores || []).slice(0, 2);
            const rec = [];
            if (this.testResults.subject.startsWith('profession_med_')) {
                rec.push('Попробуйте «погружение»: волонтёрство/мед.кружок/День открытых дверей в колледже/вузе.');
                rec.push('Проверьте базу: биология + химия — это фундамент для поступления.');
                if (overall < 60) rec.push('Соберите больше опыта: 2–3 недели наблюдений и повторное прохождение теста.');
                if (top.length > 0) rec.push(`Сфокусируйтесь на сильных шкалах: ${top.map(t => t.key).join(', ')}.`);
                return rec;
            }
            rec.push('Составьте список 5 профессий и сравните их по интересам/задачам/условиям труда.');
            rec.push('Поговорите с 1–2 людьми из интересных сфер (интервью на 10–15 минут).');
            if (overall < 60) rec.push('Попробуйте проект/кружок на 2 недели и пройдите тест повторно.');
            if (top.length > 0) rec.push(`Ваши ведущие направления: ${top.map(t => t.key).join(', ')}.`);
            return rec;
        }

        const recommendations = [];
        const topicStats = this.getTopicStats();
        const weak = [...topicStats].reverse().slice(0, 3);
        if (weak.length > 0) {
            recommendations.push(`Повторите темы: ${weak.map(w => `«${w.topic}»`).join(', ')}`);
            recommendations.push('Сделайте 10–15 задач по каждой слабой теме и снова пройдите тест.' );
        }

        const percentage = this.testResults.percentage;
        if (percentage < 60) {
            recommendations.push('Начните с базовых определений и примеров, затем переходите к задачам.' );
        } else if (percentage < 80) {
            recommendations.push('Добавьте задачи среднего уровня и разбор ошибок по объяснениям.' );
        } else {
            recommendations.push('Переходите к более сложным задачам и заданиям на применение знаний.' );
        }

        if (recommendations.length === 0) {
            recommendations.push('Продолжайте изучение более сложных тем.' );
        }
        return recommendations;
    }

    generateDetailedAnswers() {
        return this.answers.map((answer, index) => `
            <div class="answer-review ${answer.isCorrect ? 'correct' : 'incorrect'}">
                <div class="answer-header">
                    <span class="question-num">Вопрос ${index + 1}</span>
                    <span class="difficulty-badge">Сложность: ${answer.difficulty}/7</span>
                    <span class="result-badge">${answer.isCorrect ? '✅ Правильно' : '❌ Неправильно'}</span>
                </div>
                <div class="answer-question">${answer.question}</div>
                <div class="answer-explanation">
                    <strong>Объяснение:</strong> ${answer.explanation}
                </div>
            </div>
        `).join('');
    }

    saveResults() {
        const savedResults = JSON.parse(localStorage.getItem('testResults') || '[]');
        savedResults.push({
            ...this.testResults,
            timestamp: Date.now()
        });
        localStorage.setItem('testResults', JSON.stringify(savedResults));
        
        this.updateUserStats();
    }

    updateUserStats() {
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
        if (!stats.testsCompleted) stats.testsCompleted = 0;
        if (!stats.totalScore) stats.totalScore = 0;
        if (!stats.bestScore) stats.bestScore = 0;
        
        stats.testsCompleted++;
        stats.totalScore += this.testResults.percentage;
        stats.averageScore = Math.round(stats.totalScore / stats.testsCompleted);
        stats.bestScore = Math.max(stats.bestScore, this.testResults.percentage);
        
        localStorage.setItem('userStats', JSON.stringify(stats));
    }
}

console.log('Creating AdaptiveTestSystem instance...');
const testSystem = new AdaptiveTestSystem();
console.log('AdaptiveTestSystem created successfully:', testSystem);

function setUserGrade(value) {
    const grade = parseInt(value, 10) || 9;
    localStorage.setItem('userGrade', grade.toString());
    const select = document.getElementById('grade-select');
    if (select && select.value !== grade.toString()) {
        select.value = grade.toString();
    }
    const hint = document.getElementById('grade-hint');
    if (hint) {
        hint.textContent = `Сложность адаптируется под ${grade}-й класс`;
    }
}

// Текущий выбранный класс
let currentSelectedGrade = 9;
let currentGradeFilter = 'all';
let currentCategoryFilter = 'all';

// Фильтр по классам
function filterByGrade(grade, btn) {
    // Преобразуем в число
    grade = parseInt(grade);
    currentSelectedGrade = grade;
    currentGradeFilter = grade;
    localStorage.setItem('userGrade', String(grade));
    
    // Обновляем активную кнопку - снимаем active со ВСЕХ кнопок
    const allGradeBtns = document.querySelectorAll('.grade-btn');
    allGradeBtns.forEach(b => {
        b.classList.remove('active');
    });
    
    // Ставим active на нажатую кнопку
    if (btn) {
        btn.classList.add('active');
    }
    
    // Обновляем заголовок
    const titleEl = document.getElementById('current-grade-title');
    if (titleEl) {
        titleEl.textContent = `📚 Тесты для ${grade} класса`;
    }
    
    console.log('Выбран класс:', grade, 'currentSelectedGrade =', currentSelectedGrade);

    // Перерисовываем карточки тестов под выбранный класс
    try {
        applyFilters();
    } catch {
        // ignore if filters not initialized
    }
}

// Запуск теста для выбранного класса
function startGradeTest(category) {
    // Берём актуальный класс из переменной
    const grade = currentSelectedGrade;
    const testId = `${category}_grade_${grade}`;
    
    console.log('=== startGradeTest ===');
    console.log('category:', category);
    console.log('currentSelectedGrade:', currentSelectedGrade);
    console.log('testId:', testId);
    
    // Сохраняем информацию о тесте
    localStorage.setItem('mo_last_test_subject', testId);
    localStorage.setItem('mo_last_test_grade', String(grade));
    
    // Скрываем карточки выбора тестов
    const testCards = document.querySelector('#tests .test-cards');
    if (testCards) {
        testCards.style.display = 'none';
    }
    
    // Скрываем фильтры
    const filterPanel = document.querySelector('.tests-filter-panel');
    if (filterPanel) {
        filterPanel.style.display = 'none';
    }
    const gradeTitle = document.querySelector('.selected-grade-title');
    if (gradeTitle) {
        gradeTitle.style.display = 'none';
    }
    
    // Показываем новый адаптивный контейнер теста (не legacy)
    const adaptiveContainer = [...document.querySelectorAll('.test-container')]
        .find(c => c.id !== 'test-questions-container');
    if (adaptiveContainer) {
        adaptiveContainer.style.display = 'block';
        // Скрываем контейнеры результатов от предыдущих прохождений
        const resultContainers = document.querySelectorAll('.result-container');
        resultContainers.forEach(c => c.style.display = 'none');

        // Подскроллим к карточке вопроса на мобильных
        setTimeout(() => {
            const questionCard = document.getElementById('question-card');
            const target = questionCard || adaptiveContainer;
            if (target && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }
    
    // Запускаем тест
    testSystem.startTest(testId, grade);

    // Сохраняем последний тест и заголовок для UI/рестарта
    const friendlyNames = {
        chemistry: 'Химия',
        biology: 'Биология',
        profession: 'Профориентация',
        specialty: 'Профильные склонности'
    };
    const friendly = friendlyNames[category] || category;
    const title = `${friendly} (${grade} класс)`;
    try { localStorage.setItem('mo_last_test_subject', String(testId)); } catch { /* ignore */ }
    try { localStorage.setItem('mo_last_test_title', title); } catch { /* ignore */ }

    // Обновляем подписи и подсветку выбранного теста
    try { if (typeof updateCurrentTestUI === 'function') updateCurrentTestUI(); } catch { /* ignore */ }
}

// Инициализация селектора класса при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('userGrade') || '9';
    currentSelectedGrade = parseInt(saved);
    
    // Снимаем active со всех кнопок и ставим на нужную
    const allGradeBtns = document.querySelectorAll('.grade-btn');
    allGradeBtns.forEach(btn => {
        btn.classList.remove('active');
        // Проверяем текст кнопки на соответствие классу
        if (btn.textContent.includes(currentSelectedGrade + ' класс')) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем заголовок
    const titleEl = document.getElementById('current-grade-title');
    if (titleEl) {
        titleEl.textContent = `📚 Тесты для ${currentSelectedGrade} класса`;
    }
    
    console.log('Инициализация: выбран класс', currentSelectedGrade);
});

function startTest(subject) {
    console.log('startTest called with subject:', subject);
    
    try {
        const userGrade = parseInt(localStorage.getItem('userGrade') || '9');
        console.log('User grade:', userGrade);

        const resolved = resolveTestIdByUserGrade(subject, userGrade);
        try { localStorage.setItem('mo_last_test_subject', String(resolved)); } catch { /* ignore */ }
        try {
            const title = resolveTestCardTitle(resolved);
            if (title) localStorage.setItem('mo_last_test_title', String(title));
            else localStorage.removeItem('mo_last_test_title');
        } catch { /* ignore */ }
        
        testSystem.startTest(resolved, userGrade);
        console.log('testSystem.startTest called successfully');

        try { if (typeof updateCurrentTestUI === 'function') updateCurrentTestUI(); } catch { /* ignore */ }
        
        // Скрыть только карточки выбора тестов (а не всю секцию)
        const testCards = document.querySelector('#tests .test-cards');
        if (testCards) {
            testCards.style.display = 'none';
            console.log('Test cards hidden');
        }
        // На всякий случай скрыть старый контейнер тестов
        const legacyContainer = document.getElementById('test-questions-container');
        if (legacyContainer) legacyContainer.style.display = 'none';
        
        // Показать контейнер адаптивного теста (НЕ старый test-questions-container)
        const testContainers = document.querySelectorAll('.test-container');
        console.log('Found test containers:', testContainers.length);
        
        // Найдем правильный контейнер - второй по порядку (не test-questions-container)
        let adaptiveContainer = null;
        testContainers.forEach((container, index) => {
            if (container.id !== 'test-questions-container') {
                adaptiveContainer = container;
            }
        });
        
        if (adaptiveContainer) {
            adaptiveContainer.style.display = 'block';
            adaptiveContainer.classList.add('active');
            console.log('Adaptive test container shown');
            console.log('Container style.display:', adaptiveContainer.style.display);
            console.log('Container visibility:', window.getComputedStyle(adaptiveContainer).visibility);
            console.log('Container height:', window.getComputedStyle(adaptiveContainer).height);

            // На мобильных после скрытия сетки карточек часто остаёмся «внизу» страницы.
            // Прокручиваем к карточке вопроса, чтобы было видно, что тест стартовал.
            setTimeout(() => {
                const questionCard = document.getElementById('question-card');
                const scrollTarget = questionCard || adaptiveContainer;
                if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        } else {
            console.error('Adaptive test container not found');
        }
        
        // Скрыть контейнер результатов
        const resultContainers = document.querySelectorAll('.result-container');
        resultContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Скрыть кнопку next изначально
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error in startTest:', error);
    }
}

function getLastTestSubject() {
    try { return localStorage.getItem('mo_last_test_subject') || ''; } catch { return ''; }
}

function getLastTestTitle() {
    try { return localStorage.getItem('mo_last_test_title') || ''; } catch { return ''; }
}

function resolveTestCardTitle(subject) {
    if (!subject) return '';
    try {
        const cards = document.querySelectorAll('#tests .test-card');
        for (const card of cards) {
            const onclick = (card.getAttribute('onclick') || '');
            if (onclick.includes(`startTest('${subject}'`) || onclick.includes(`startTest(\"${subject}\"`)) {
                const h3 = card.querySelector('h3');
                const title = h3 ? (h3.textContent || '').trim() : '';
                if (title) return title;
            }
        }
    } catch { /* ignore */ }
    return '';
}

function updateCurrentTestUI() {
    const current = (testSystem && testSystem.currentTest) ? String(testSystem.currentTest) : '';
    const last = getLastTestSubject();
    const subject = current || last;
    const title = subject ? (resolveTestCardTitle(subject) || getLastTestTitle()) : '';
    const fallbackName = subject ? getTestName(subject) : '';
    const displayName = title || fallbackName;

    const label = document.getElementById('current-test-label');
    if (label) {
        label.textContent = displayName ? displayName : 'Выберите тест, чтобы начать';
    }

    // Подсветка карточки выбранного теста
    try {
        document.querySelectorAll('#tests .test-card.active-test').forEach(el => el.classList.remove('active-test'));
        if (subject) {
            document.querySelectorAll('#tests .test-card').forEach(card => {
                const onclick = (card.getAttribute('onclick') || '');
                if (onclick.includes(`startTest('${subject}'`) || onclick.includes(`startTest(\"${subject}\"`)) {
                    card.classList.add('active-test');
                }
            });
        }
    } catch { /* ignore */ }
}

function nextQuestion() {
    testSystem.submitAnswer();
}

function prevAdaptiveQuestion() {
    if (testSystem && typeof testSystem.goBackOneQuestion === 'function') {
        testSystem.goBackOneQuestion();
    }
}

function skipQuestion() {
    testSystem.skipCurrentQuestion();
}

function selectAnswer(optionIndex) {
    testSystem.selectAnswer(optionIndex);
    document.getElementById('next-btn').style.display = 'inline-block';
}

function restartTest() {
    console.log('restartTest called');
    if (testSystem && testSystem.currentTest) {
        // Скрыть результаты перед запуском
        const resultContainers = document.querySelectorAll('.result-container');
        resultContainers.forEach(c => c.style.display = 'none');
        
        startTest(testSystem.currentTest);
    } else {
        console.error('Cannot restart: no current test');
        goBackToTests();
    }
}

function restartCurrentTest() {
    restartTest();
}

function goBackToTests() {
    console.log('goBackToTests called');
    
    // 1. Скрыть все контейнеры тестов
    const allTestContainers = document.querySelectorAll('.test-container');
    allTestContainers.forEach(c => c.style.display = 'none');

    // 2. Скрыть все контейнеры результатов
    const resultContainers = document.querySelectorAll('.result-container');
    resultContainers.forEach(c => c.style.display = 'none');

    // 3. Показать секцию тестов и карточки
    const testsSection = document.getElementById('tests');
    if (testsSection) {
        testsSection.style.display = 'block';
        testsSection.classList.add('visible');
    }

    const testCards = document.querySelector('#tests .test-cards');
    if (testCards) testCards.style.display = 'grid';

    // Вернуть фильтры и подпись выбранного класса
    const filterPanel = document.querySelector('.tests-filter-panel');
    if (filterPanel) filterPanel.style.display = 'block';

    const gradeTitle = document.querySelector('.selected-grade-title');
    if (gradeTitle) gradeTitle.style.display = 'block';
    
    // Восстанавливаем активную кнопку класса
    const savedGrade = localStorage.getItem('userGrade') || '9';
    const gradeBtns = document.querySelectorAll('.grade-btn');
    gradeBtns.forEach(btn => {
        const btnText = btn.textContent || '';
        const btnGrade = parseInt(btnText);
        if (btnGrade === parseInt(savedGrade)) {
            btn.classList.add('active');
        }
    });

    // 4. Использовать общий роутер для обновления состояния навигации
    if (typeof showSection === 'function') {
        showSection('tests');
    }
    
    // 5. Сброс скролла
    window.scrollTo(0, 0);

    try { if (typeof updateCurrentTestUI === 'function') updateCurrentTestUI(); } catch { /* ignore */ }
}

function shareResults() {
    if (testSystem && testSystem.testResults) {
        const results = testSystem.testResults;
        const time = `${Math.floor(results.timeSpent / 60)}:${(results.timeSpent % 60).toString().padStart(2, '0')}`;
        const title = `Результаты теста - ${getTestName(results.subject)}`;

        let text = `🎯 Мой результат: ${results.percentage}%\n⏱️ Время: ${time}`;
        if (results.isOrientation) {
            const top = (results.profile?.scores || []).slice(0, 3);
            const labelOf = (k) => (typeof ORIENTATION_DIM_LABELS === 'object' && ORIENTATION_DIM_LABELS && ORIENTATION_DIM_LABELS[k]) ? ORIENTATION_DIM_LABELS[k] : String(k);
            if (top.length) text += `\n🧭 Топ-направления: ${top.map(t => `${labelOf(t.key)} (${t.score}%)`).join(', ')}`;
        } else {
            text += `\n✅ Правильных: ${results.score}/${results.total}`;
        }
        text += `\n\nПройди тест на ${location.origin}!`;
        
        if (navigator.share) {
            navigator.share({
                title,
                text
            }).catch(console.error);
        } else {
            // Копируем в буфер обмена
            navigator.clipboard.writeText(text).then(() => {
                alert('Результат скопирован в буфер обмена!');
            }).catch(() => {
                alert('Не удалось скопировать результат');
            });
        }
    }
}

// Скачать результаты как PDF (простая реализация)
function downloadResultsPDF() {
    if (!testSystem || !testSystem.testResults) {
        showNotification('Нет результатов для скачивания', 'warning');
        return;
    }
    
    const results = testSystem.testResults;
    const testName = getTestName(results.subject);
    
    // Создаём HTML для печати/PDF
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Результаты теста - ${testName}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { color: #667eea; text-align: center; }
                .score { font-size: 48px; text-align: center; color: #667eea; font-weight: bold; }
                .stats { display: flex; justify-content: space-around; margin: 30px 0; }
                .stat { text-align: center; }
                .stat-value { font-size: 24px; font-weight: bold; }
                .stat-label { color: #666; }
                .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 10px; }
                .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
            </style>
        </head>
        <body>
            <h1>🏥 Результаты теста</h1>
            <h2 style="text-align: center; color: #666;">${testName}</h2>
            
            <div class="score">${results.percentage}%</div>
            
            <div class="stats">
                ${results.isOrientation ? `
                <div class="stat">
                    <div class="stat-value">🧭 ${results.percentage}%</div>
                    <div class="stat-label">Профиль</div>
                </div>
                ` : `
                <div class="stat">
                    <div class="stat-value">✅ ${results.score}</div>
                    <div class="stat-label">Правильных</div>
                </div>
                <div class="stat">
                    <div class="stat-value">❌ ${results.total - results.score}</div>
                    <div class="stat-label">Неправильных</div>
                </div>
                `}
                <div class="stat">
                    <div class="stat-value">⏱️ ${Math.floor(results.timeSpent / 60)}:${(results.timeSpent % 60).toString().padStart(2, '0')}</div>
                    <div class="stat-label">Время</div>
                </div>
            </div>
            
            <div class="section">
                <h3>📊 Анализ</h3>
                <p>${results.isOrientation ? 'Профориентация: в этом тесте нет «правильных» ответов — важны ваши предпочтения.' : `Уровень подготовки: ${results.percentage >= 90 ? 'Отлично' : results.percentage >= 75 ? 'Хорошо' : results.percentage >= 60 ? 'Удовлетворительно' : 'Требуется подготовка'}`}</p>
            </div>
            
            <div class="footer">
                <p>Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
                <p>Медицинская Профориентация © ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
    `;
    
    // Открываем окно для печати/сохранения
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
    
    showNotification('PDF готов к сохранению', 'success');
}

// Печать результатов
function printResults() {
    downloadResultsPDF();
}

function checkTestResults() {
    testSystem.finishTest();
}

function viewDetailedAnalysis() {
    const analysisSection = document.querySelector('.detailed-answers');
    analysisSection.style.display = analysisSection.style.display === 'none' ? 'block' : 'none';
}

// Анимация появления элементов при скролле
function isPerfLiteMode() {
    try {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowMem = typeof navigator !== 'undefined' && typeof navigator.deviceMemory === 'number' && navigator.deviceMemory > 0 && navigator.deviceMemory <= 2;
        const lowCpu = typeof navigator !== 'undefined' && typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
        const saveData = navigator && navigator.connection && navigator.connection.saveData === true;
        return !!(reduceMotion || lowMem || lowCpu || saveData);
    } catch {
        return false;
    }
}

const PERF_LITE = isPerfLiteMode();
try {
    if (PERF_LITE) document.documentElement.classList.add('perf-lite');
} catch {
    // ignore
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            // Сразу перестаём наблюдать, чтобы не грузить CPU/GPU
            try { observer.unobserve(entry.target); } catch { /* ignore */ }
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CONTENT LOADED ===');
    if (!PERF_LITE) {
        const cards = document.querySelectorAll('.card, .test-card, .specialty-card, .achievement');
        console.log('Found cards:', cards.length);
        cards.forEach(card => {
            observer.observe(card);
        });
    } else {
        console.log('perf-lite enabled: skipping scroll reveal observer');
    }

    // Мобильный фикс: при прокрутке пальцем по карточкам иногда срабатывает click,
    // из-за чего внезапно запускается тест и сетка «пропадает».
    // Подавляем click, если был жест прокрутки (движение больше порога).
    (function installTestCardsTapGuard() {
        const MOVE_THRESHOLD = 10; // px
        let activeCard = null;
        let startX = 0;
        let startY = 0;
        let moved = false;

        const getPoint = (ev) => {
            const t = ev.touches && ev.touches[0] ? ev.touches[0] : (ev.changedTouches && ev.changedTouches[0] ? ev.changedTouches[0] : ev);
            return { x: t.clientX || 0, y: t.clientY || 0 };
        };

        const onStart = (ev) => {
            const card = ev.target && ev.target.closest ? ev.target.closest('.test-card') : null;
            if (!card) return;
            activeCard = card;
            moved = false;
            const p = getPoint(ev);
            startX = p.x;
            startY = p.y;
        };

        const onMove = (ev) => {
            if (!activeCard) return;
            const p = getPoint(ev);
            const dx = Math.abs(p.x - startX);
            const dy = Math.abs(p.y - startY);
            if (dx + dy > MOVE_THRESHOLD) moved = true;
        };

        const onEnd = () => {
            if (!activeCard) return;
            if (moved) {
                activeCard.dataset.suppressClick = '1';
                setTimeout(() => {
                    if (activeCard) delete activeCard.dataset.suppressClick;
                }, 0);
            }
            activeCard = null;
            moved = false;
        };

        // Capture click before inline onclick runs
        document.addEventListener('click', (ev) => {
            const card = ev.target && ev.target.closest ? ev.target.closest('.test-card') : null;
            if (!card) return;
            if (card.dataset.suppressClick === '1') {
                ev.preventDefault();
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                delete card.dataset.suppressClick;
            }
        }, true);

        if ('PointerEvent' in window) {
            document.addEventListener('pointerdown', onStart, { passive: true });
            document.addEventListener('pointermove', onMove, { passive: true });
            document.addEventListener('pointerup', onEnd, { passive: true });
            document.addEventListener('pointercancel', onEnd, { passive: true });
        } else {
            document.addEventListener('touchstart', onStart, { passive: true });
            document.addEventListener('touchmove', onMove, { passive: true });
            document.addEventListener('touchend', onEnd, { passive: true });
            document.addEventListener('touchcancel', onEnd, { passive: true });
        }
    })();
    
    // Инициализация цитаты дня (если функция существует)
    if (typeof initDailyQuote === 'function') {
        initDailyQuote();
    }
    
    // Инициализация прогресс-бара скролла (дорого на слабых ПК)
    if (!PERF_LITE && typeof initScrollProgress === 'function') {
        initScrollProgress();
    }
    
    // Проверяем, что все нужные функции доступны
    console.log('Functions check:');
    console.log('- startTest:', typeof startTest);
    console.log('- testSystem:', typeof testSystem, testSystem);
    console.log('- questionDatabase keys:', Object.keys(questionDatabase || {}));
    
    // Проверяем кнопки тестов
    const testCards = document.querySelectorAll('.test-card');
    console.log('Test cards found:', testCards.length);
    testCards.forEach((card, index) => {
        console.log(`Test card ${index}:`, card.getAttribute('onclick'));
    });
});



function nextFact() {
    currentFactIndex = (currentFactIndex + 1) % totalFacts;
    showFact(currentFactIndex);
}

function prevFact() {
    currentFactIndex = (currentFactIndex - 1 + totalFacts) % totalFacts;
    showFact(currentFactIndex);
}

// Цитата дня
function initDailyQuote() {
    const quotes = [
        { text: "Медицина — это не только наука, но и искусство. Она требует не только знаний, но и сердца.", author: "Гиппократ" },
        { text: "Врач должен иметь голову льва, глаз орла и руки женщины.", author: "Абу Бакр ар-Рази" },
        { text: "Где есть любовь к людям, там есть и любовь к искусству врачевания.", author: "Гиппократ" },
        { text: "Медицина поистине есть самое благородное из всех искусств.", author: "Гиппократ" },
        { text: "Хороший врач лечит болезнь, великий врач лечит пациента.", author: "Уильям Ослер" },
        { text: "Профилактика — лучшее лечение.", author: "Народная мудрость" },
        { text: "Лучшее лекарство — это доброе слово.", author: "Авиценна" },
        { text: "Нет неизлечимых болезней, есть недостаток знаний.", author: "Гиппократ" }
    ];
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % quotes.length;
    const quote = quotes[quoteIndex];
    
    const quoteEl = document.getElementById('daily-quote');
    const authorEl = document.getElementById('quote-author');
    
    if (quoteEl) quoteEl.textContent = `"${quote.text}"`;
    if (authorEl) authorEl.textContent = `— ${quote.author}`;
}

// Прогресс-бар скролла
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ========================================
// ФУНКЦИИ ФИЛЬТРАЦИИ ТЕСТОВ
// ========================================

function filterByCategory(category) {
    currentCategoryFilter = category;
    
    // Обновляем активную кнопку в фильтре категорий
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    let target = null;
    try { if (typeof event !== 'undefined' && event && event.target) target = event.target; } catch { /* ignore */ }
    try { if (!target && window.event && window.event.target) target = window.event.target; } catch { /* ignore */ }
    if (target) target.classList.add('active');
    
    applyFilters();
}

function applyFilters() {
    const testCards = document.querySelectorAll('#tests-grid .test-card');
    let visibleCount = 0;
    
    testCards.forEach(card => {
        const cardGrades = card.dataset.grade ? card.dataset.grade.split(',') : ['all'];
        const cardCategory = card.dataset.category || 'all';
        
        let showByGrade = currentGradeFilter === 'all' || cardGrades.includes(currentGradeFilter.toString()) || cardGrades.includes('all');
        let showByCategory = currentCategoryFilter === 'all' || cardCategory === currentCategoryFilter;
        
        if (showByGrade && showByCategory) {
            card.style.display = 'block';
            card.style.animation = 'neon-fade-in 0.4s ease-out forwards';
            card.style.animationDelay = (visibleCount * 0.1) + 's';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Показываем сообщение если нет результатов
    const noResultsMsg = document.getElementById('no-tests-message');
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.id = 'no-tests-message';
            msg.className = 'no-tests-message';
            msg.innerHTML = '<i class="fas fa-search"></i> Тесты для выбранных фильтров не найдены';
            msg.style.cssText = `
                text-align: center;
                padding: 40px;
                color: var(--neon-cyan);
                font-size: 18px;
                grid-column: 1 / -1;
            `;
            document.getElementById('tests-grid').appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// ========================================
// ФУНКЦИИ РЕДАКТИРОВАНИЯ ПРОФИЛЯ
// ========================================

function editProfileName() {
    const currentName = document.getElementById('profile-name').textContent;
    const newName = prompt('Введите новое имя:', currentName);
    
    if (newName && newName.trim() !== '') {
        // Обновляем в localStorage
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (currentUser) {
            currentUser.username = newName.trim();
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
            
            // Обновляем в списке пользователей
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].username = newName.trim();
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
            
            // Обновляем интерфейс
            document.getElementById('profile-name').textContent = newName.trim();
            
            // Обновляем аватар-плейсхолдер
            const avatarPlaceholder = document.getElementById('avatar-placeholder');
            if (avatarPlaceholder && avatarPlaceholder.style.display !== 'none') {
                avatarPlaceholder.textContent = getInitials(newName.trim());
            }
            
            // Показываем уведомление
            showNotification('✅ Имя успешно изменено!', 'success');
        }
    }
}

function viewTestHistory() {
    // Скролл к истории тестов
    const historySection = document.querySelector('.test-history');
    if (historySection) {
        historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        historySection.style.animation = 'neon-pulse 1s ease 2';
    }
}

console.log('=== SCRIPT END ===');

// ===== ФОНОВАЯ МУЗЫКА - ПЛЕЙЛИСТ С CROSSFADE =====
const jazzPlaylist = [
    'audio/Miles Davis - So What.mp3',
    'audio/Miles Davis - Generique.mp3',
    'audio/Miles Davis - Solar.mp3',
    'audio/Miles Davis - Summertime.mp3',
    'audio/Charlie Parker - Don\'t Blame Me.mp3',
    'audio/Miles Davis, Charlie Parker - Out Of Nowhere.mp3'
];

// Перемешиваем плейлист
let shuffledPlaylist = shuffleArray(jazzPlaylist);
let currentTrackIndex = 0;
let activePlayer = 1; // 1 или 2 - для crossfade

const player1 = document.getElementById('background-music-1');
const player2 = document.getElementById('background-music-2');

const VOLUME_MAX = 0.3;
const CROSSFADE_DURATION = 3000; // 3 секунды плавного перехода

if (player1 && player2) {
    player1.volume = 0;
    player2.volume = 0;
    
    // Загружаем первый трек
    function loadTrack(player, trackIndex) {
        player.src = shuffledPlaylist[trackIndex % shuffledPlaylist.length];
        player.load();
    }
    
    // Плавное изменение громкости
    function fadeVolume(player, from, to, duration, callback) {
        const steps = 50;
        const stepTime = duration / steps;
        const volumeStep = (to - from) / steps;
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            player.volume = Math.max(0, Math.min(VOLUME_MAX, from + volumeStep * currentStep));
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                player.volume = to;
                if (callback) callback();
            }
        }, stepTime);
    }
    
    // Crossfade к следующему треку
    function crossfadeToNext() {
        const currentPlayer = activePlayer === 1 ? player1 : player2;
        const nextPlayer = activePlayer === 1 ? player2 : player1;
        
        currentTrackIndex++;
        
        // Если прошли весь плейлист - перемешиваем заново
        if (currentTrackIndex >= shuffledPlaylist.length) {
            currentTrackIndex = 0;
            shuffledPlaylist = shuffleArray(jazzPlaylist);
        }
        
        // Загружаем следующий трек
        loadTrack(nextPlayer, currentTrackIndex);
        
        nextPlayer.play().then(() => {
            // Плавный crossfade
            fadeVolume(currentPlayer, VOLUME_MAX, 0, CROSSFADE_DURATION, () => {
                currentPlayer.pause();
                currentPlayer.currentTime = 0;
            });
            fadeVolume(nextPlayer, 0, VOLUME_MAX, CROSSFADE_DURATION);
            
            activePlayer = activePlayer === 1 ? 2 : 1;
        }).catch(err => console.log('Crossfade error:', err));
    }
    
    // Слушаем окончание трека (за 3 секунды до конца начинаем crossfade)
    function setupTrackEndListener(player) {
        player.addEventListener('timeupdate', function() {
            if (player.duration && player.currentTime > 0) {
                const timeLeft = player.duration - player.currentTime;
                if (timeLeft <= CROSSFADE_DURATION / 1000 && timeLeft > (CROSSFADE_DURATION / 1000) - 0.2) {
                    crossfadeToNext();
                }
            }
        });
        
        // Запасной вариант если трек закончился внезапно
        player.addEventListener('ended', function() {
            if (this.volume > 0) {
                crossfadeToNext();
            }
        });
    }
    
    setupTrackEndListener(player1);
    setupTrackEndListener(player2);
    
    // Запуск первого трека
    function startPlaylist() {
        loadTrack(player1, 0);
        player1.play().then(() => {
            fadeVolume(player1, 0, VOLUME_MAX, 2000);
            activePlayer = 1;
        }).catch(err => {
            // Браузер заблокировал, ждём клик
            document.addEventListener('click', function playOnClick() {
                player1.play().then(() => {
                    fadeVolume(player1, 0, VOLUME_MAX, 2000);
                    activePlayer = 1;
                });
                document.removeEventListener('click', playOnClick);
            }, { once: true });
        });
    }
    
    // Запуск при загрузке
    if (document.readyState === 'complete') {
        startPlaylist();
    } else {
        window.addEventListener('load', startPlaylist);
    }
}

let hasInteracted = false;
let audioContext = null;

// Инициализация Web Audio API для звуковых эффектов
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Генерация хакерского звука печати через Web Audio API
function playTypeSound() {
    if (!hasInteracted) return;
    
    try {
        const ctx = initAudioContext();
        
        // Создаём несколько быстрых "кликов" как печать на клавиатуре
        const numClicks = 3 + Math.floor(Math.random() * 4); // 3-6 кликов
        
        for (let i = 0; i < numClicks; i++) {
            const delay = i * 0.04 + Math.random() * 0.02; // Небольшая случайность
            
            // Создаём белый шум для клика
            const bufferSize = ctx.sampleRate * 0.02; // 20мс
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                output[j] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            
            // Фильтр для более "механического" звука
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 2000 + Math.random() * 2000;
            filter.Q.value = 1;
            
            // Громкость
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0.12, ctx.currentTime + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.03);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            noise.start(ctx.currentTime + delay);
            noise.stop(ctx.currentTime + delay + 0.03);
        }
        
        // Добавляем "бип" терминала в конце
        const oscillator = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        oscillator.connect(oscGain);
        oscGain.connect(ctx.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime + numClicks * 0.04);
        
        oscGain.gain.setValueAtTime(0.03, ctx.currentTime + numClicks * 0.04);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + numClicks * 0.04 + 0.05);
        
        oscillator.start(ctx.currentTime + numClicks * 0.04);
        oscillator.stop(ctx.currentTime + numClicks * 0.04 + 0.05);
        
    } catch (e) {
        console.log('Web Audio не поддерживается:', e);
    }
}

// Анимация появления элементов на landing page (Google Style)
function animateLandingElements() {
    // Добавляем класс для запуска CSS анимаций
    const landingPage = document.querySelector('.landing-page');
    if (landingPage) {
        landingPage.classList.add('animate-in');
    }
    
    // Анимируем навигацию
    const nav = document.querySelector('.google-nav');
    if (nav) {
        nav.style.opacity = '0';
        nav.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            nav.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            nav.style.opacity = '1';
            nav.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Запускаем анимации при загрузке
document.addEventListener('DOMContentLoaded', animateLandingElements);