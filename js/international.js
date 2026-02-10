/**
 * International Module - Multilingual Support (RU/EN/UZ)
 * Medical Education Platform
 */

class InternationalSystem {
    constructor() {
        this.currentLanguage = this.getSavedLanguage() || 'ru';
        this.translations = {};
        this.loadTranslations();
    }

    /**
     * Load translations
     */
    loadTranslations() {
        this.translations = {
            ru: {
                // Navigation
                'nav.home': 'Главная',
                'nav.tests': 'Тесты',
                'nav.profile': 'Профиль',
                'nav.learning': 'Обучение',
                'nav.contacts': 'Контакты',
                'nav.logout': 'Выйти',
                
                // Auth
                'auth.login': 'Вход',
                'auth.register': 'Регистрация',
                'auth.email': 'Email',
                'auth.password': 'Пароль',
                'auth.name': 'Имя и Фамилия',
                'auth.phone': 'Номер телефона',
                'auth.age': 'Возраст',
                'auth.confirmPassword': 'Подтвердите пароль',
                'auth.loginButton': 'Войти',
                'auth.registerButton': 'Зарегистрироваться',
                
                // Tests
                'tests.title': 'Тесты по медицинской профориентации',
                'tests.profession': 'Медицинская профориентация',
                'tests.chemistry': 'Тест по химии',
                'tests.biology': 'Тест по биологии',
                'tests.specialty': 'Определение специальности',
                'tests.question': 'Вопрос',
                'tests.of': 'из',
                'tests.next': 'Далее',
                'tests.prev': 'Назад',
                'tests.submit': 'Проверить результаты',
                
                // Profile
                'profile.title': 'Профиль пользователя',
                'profile.testsCompleted': 'Пройдено тестов',
                'profile.averageScore': 'Средний результат',
                'profile.bestScore': 'Лучший результат',
                'profile.daysRegistered': 'Дней с нами',
                'profile.education': 'Образование',
                'profile.location': 'Местоположение',
                'profile.interests': 'Интересы',
                
                // Gamification
                'gamification.achievements': 'Достижения',
                'gamification.leaderboard': 'Таблица лидеров',
                'gamification.dailyQuests': 'Ежедневные квесты',
                'gamification.level': 'Уровень',
                'gamification.points': 'Очки',
                'gamification.rank': 'Ранг',
                'gamification.streak': 'Серия',
                'gamification.currency': 'Валюта',
                
                // Common
                'common.welcome': 'Добро пожаловать',
                'common.loading': 'Загрузка...',
                'common.save': 'Сохранить',
                'common.cancel': 'Отмена',
                'common.close': 'Закрыть',
                'common.yes': 'Да',
                'common.no': 'Нет',
                'common.error': 'Ошибка',
                'common.success': 'Успешно'
            },
            
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.tests': 'Tests',
                'nav.profile': 'Profile',
                'nav.learning': 'Learning',
                'nav.contacts': 'Contacts',
                'nav.logout': 'Logout',
                
                // Auth
                'auth.login': 'Login',
                'auth.register': 'Register',
                'auth.email': 'Email',
                'auth.password': 'Password',
                'auth.name': 'Full Name',
                'auth.phone': 'Phone Number',
                'auth.age': 'Age',
                'auth.confirmPassword': 'Confirm Password',
                'auth.loginButton': 'Login',
                'auth.registerButton': 'Register',
                
                // Tests
                'tests.title': 'Medical Orientation Tests',
                'tests.profession': 'Medical Profession',
                'tests.chemistry': 'Chemistry Test',
                'tests.biology': 'Biology Test',
                'tests.specialty': 'Specialty Selection',
                'tests.question': 'Question',
                'tests.of': 'of',
                'tests.next': 'Next',
                'tests.prev': 'Previous',
                'tests.submit': 'Check Results',
                
                // Profile
                'profile.title': 'User Profile',
                'profile.testsCompleted': 'Tests Completed',
                'profile.averageScore': 'Average Score',
                'profile.bestScore': 'Best Score',
                'profile.daysRegistered': 'Days with us',
                'profile.education': 'Education',
                'profile.location': 'Location',
                'profile.interests': 'Interests',
                
                // Gamification
                'gamification.achievements': 'Achievements',
                'gamification.leaderboard': 'Leaderboard',
                'gamification.dailyQuests': 'Daily Quests',
                'gamification.level': 'Level',
                'gamification.points': 'Points',
                'gamification.rank': 'Rank',
                'gamification.streak': 'Streak',
                'gamification.currency': 'Currency',
                
                // Common
                'common.welcome': 'Welcome',
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.close': 'Close',
                'common.yes': 'Yes',
                'common.no': 'No',
                'common.error': 'Error',
                'common.success': 'Success'
            },
            
            uz: {
                // Navigation
                'nav.home': 'Bosh sahifa',
                'nav.tests': 'Testlar',
                'nav.profile': 'Profil',
                'nav.learning': 'O\'qish',
                'nav.contacts': 'Kontaktlar',
                'nav.logout': 'Chiqish',
                
                // Auth
                'auth.login': 'Kirish',
                'auth.register': 'Ro\'yxatdan o\'tish',
                'auth.email': 'Email',
                'auth.password': 'Parol',
                'auth.name': 'Ism va Familiya',
                'auth.phone': 'Telefon raqami',
                'auth.age': 'Yosh',
                'auth.confirmPassword': 'Parolni tasdiqlang',
                'auth.loginButton': 'Kirish',
                'auth.registerButton': 'Ro\'yxatdan o\'tish',
                
                // Tests
                'tests.title': 'Tibbiy yo\'nalish testlari',
                'tests.profession': 'Tibbiy kasb',
                'tests.chemistry': 'Kimyo testi',
                'tests.biology': 'Biologiya testi',
                'tests.specialty': 'Mutaxassislikni aniqlash',
                'tests.question': 'Savol',
                'tests.of': 'dan',
                'tests.next': 'Keyingi',
                'tests.prev': 'Oldingi',
                'tests.submit': 'Natijalarni tekshirish',
                
                // Profile
                'profile.title': 'Foydalanuvchi profili',
                'profile.testsCompleted': 'O\'tilgan testlar',
                'profile.averageScore': 'O\'rtacha natija',
                'profile.bestScore': 'Eng yaxshi natija',
                'profile.daysRegistered': 'Biz bilan kunlar',
                'profile.education': 'Ta\'lim',
                'profile.location': 'Joylashuv',
                'profile.interests': 'Qiziqishlar',
                
                // Gamification
                'gamification.achievements': 'Yutuqlar',
                'gamification.leaderboard': 'Yetakchilar jadvali',
                'gamification.dailyQuests': 'Kundalik topshiriqlar',
                'gamification.level': 'Daraja',
                'gamification.points': 'Ballar',
                'gamification.rank': 'Reyting',
                'gamification.streak': 'Ketma-ketlik',
                'gamification.currency': 'Valyuta',
                
                // Common
                'common.welcome': 'Xush kelibsiz',
                'common.loading': 'Yuklanmoqda...',
                'common.save': 'Saqlash',
                'common.cancel': 'Bekor qilish',
                'common.close': 'Yopish',
                'common.yes': 'Ha',
                'common.no': 'Yo\'q',
                'common.error': 'Xato',
                'common.success': 'Muvaffaqiyatli'
            }
        };
    }

    /**
     * Get translation
     */
    t(key) {
        const lang = this.translations[this.currentLanguage];
        return lang && lang[key] ? lang[key] : key;
    }

    /**
     * Change language
     */
    changeLanguage(langCode) {
        if (!this.translations[langCode]) {
            console.error(`Language ${langCode} not supported`);
            return false;
        }

        this.currentLanguage = langCode;
        localStorage.setItem('language', langCode);
        this.updatePageContent();
        
        // Dispatch language change event
        const event = new CustomEvent('languageChanged', { detail: { language: langCode } });
        document.dispatchEvent(event);
        
        return true;
    }

    /**
     * Get saved language
     */
    getSavedLanguage() {
        return localStorage.getItem('language');
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return [
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' }
        ];
    }

    /**
     * Update page content with translations
     */
    updatePageContent() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update document title
        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }

    /**
     * Render language selector
     */
    renderLanguageSelector(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const languages = this.getAvailableLanguages();
        
        let html = '<div class="language-selector">';
        languages.forEach(lang => {
            const isActive = lang.code === this.currentLanguage;
            html += `
                <button 
                    class="lang-btn ${isActive ? 'active' : ''}"
                    onclick="window.i18n.changeLanguage('${lang.code}')"
                    data-lang="${lang.code}"
                >
                    <span class="lang-flag">${lang.flag}</span>
                    <span class="lang-name">${lang.name}</span>
                </button>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    }

    /**
     * Format date according to locale
     */
    formatDate(date, format = 'long') {
        const locales = {
            'ru': 'ru-RU',
            'en': 'en-US',
            'uz': 'uz-UZ'
        };

        const locale = locales[this.currentLanguage] || 'ru-RU';
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        const options = format === 'long' 
            ? { year: 'numeric', month: 'long', day: 'numeric' }
            : { year: 'numeric', month: '2-digit', day: '2-digit' };

        return dateObj.toLocaleDateString(locale, options);
    }

    /**
     * Format number according to locale
     */
    formatNumber(number) {
        const locales = {
            'ru': 'ru-RU',
            'en': 'en-US',
            'uz': 'uz-UZ'
        };

        const locale = locales[this.currentLanguage] || 'ru-RU';
        return new Intl.NumberFormat(locale).format(number);
    }

    /**
     * Get RTL direction status
     */
    isRTL() {
        // No RTL languages currently, but can be extended
        return false;
    }

    /**
     * Update document direction
     */
    updateDirection() {
        document.documentElement.setAttribute('dir', this.isRTL() ? 'rtl' : 'ltr');
    }

    /**
     * Pluralization helper
     * Russian pluralization follows complex rules based on the last digit
     */
    plural(count, words) {
        // Russian pluralization rules:
        // words[0] = singular (1 item: "тест")
        // words[1] = few (2-4 items: "теста")
        // words[2] = many (5+ items: "тестов")
        if (this.currentLanguage === 'ru') {
            // Exception: numbers ending in 11-14 always use "many" form
            // Regular rule: last digit 1 = singular, 2-4 = few, other = many
            const cases = [2, 0, 1, 1, 1, 2];
            return words[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]];
        }
        
        // English pluralization: simple singular/plural
        if (this.currentLanguage === 'en') {
            return count === 1 ? words[0] : words[1];
        }
        
        // Uzbek pluralization: similar to English
        if (this.currentLanguage === 'uz') {
            return count === 1 ? words[0] : words[1];
        }
        
        return words[0];
    }
}

// Initialize global i18n instance
if (typeof window !== 'undefined') {
    window.i18n = new InternationalSystem();
    
    // Auto-update content on DOM load
    document.addEventListener('DOMContentLoaded', () => {
        window.i18n.updatePageContent();
        window.i18n.updateDirection();
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalSystem;
}
