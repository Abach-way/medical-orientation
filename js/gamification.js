/**
 * Gamification Module - Achievement System, Leaderboards, Quests
 * Medical Education Platform
 */

class GamificationSystem {
    constructor() {
        this.achievements = this.loadAchievements();
        this.userProgress = this.loadUserProgress();
        this.leaderboard = [];
        this.dailyQuests = [];
        this.initializeSystem();
    }

    /**
     * Initialize the gamification system
     */
    initializeSystem() {
        this.defineAchievements();
        this.generateDailyQuests();
        this.loadLeaderboard();
    }

    /**
     * Define available achievements
     */
    defineAchievements() {
        this.achievementDefinitions = {
            // Learning Achievements
            first_test: {
                id: 'first_test',
                name: 'Первые шаги',
                description: 'Пройдите первый тест',
                icon: '🎯',
                points: 10,
                category: 'learning'
            },
            perfectionist: {
                id: 'perfectionist',
                name: 'Перфекционист',
                description: 'Получите 100% в любом тесте',
                icon: '💯',
                points: 50,
                category: 'learning'
            },
            knowledge_seeker: {
                id: 'knowledge_seeker',
                name: 'Искатель знаний',
                description: 'Пройдите 10 тестов',
                icon: '📚',
                points: 100,
                category: 'learning'
            },
            
            // Streak Achievements
            streak_7: {
                id: 'streak_7',
                name: 'Недельная серия',
                description: 'Занимайтесь 7 дней подряд',
                icon: '🔥',
                points: 30,
                category: 'streak'
            },
            streak_30: {
                id: 'streak_30',
                name: 'Месячная серия',
                description: 'Занимайтесь 30 дней подряд',
                icon: '💪',
                points: 150,
                category: 'streak'
            },
            
            // Score Achievements
            high_achiever: {
                id: 'high_achiever',
                name: 'Отличник',
                description: 'Получите более 80% в 5 тестах',
                icon: '⭐',
                points: 75,
                category: 'score'
            },
            master: {
                id: 'master',
                name: 'Мастер медицины',
                description: 'Наберите 1000 очков',
                icon: '👨‍⚕️',
                points: 200,
                category: 'mastery'
            },
            
            // Social Achievements
            mentor: {
                id: 'mentor',
                name: 'Наставник',
                description: 'Помогите 5 другим студентам',
                icon: '🤝',
                points: 60,
                category: 'social'
            },
            
            // Special Achievements
            early_bird: {
                id: 'early_bird',
                name: 'Ранняя пташка',
                description: 'Пройдите тест до 7 утра',
                icon: '🌅',
                points: 25,
                category: 'special'
            },
            night_owl: {
                id: 'night_owl',
                name: 'Ночная сова',
                description: 'Пройдите тест после 23:00',
                icon: '🦉',
                points: 25,
                category: 'special'
            }
        };
    }

    /**
     * Generate daily quests
     */
    generateDailyQuests() {
        const today = new Date().toDateString();
        const savedQuests = localStorage.getItem('dailyQuests');
        
        if (savedQuests) {
            const parsed = JSON.parse(savedQuests);
            if (parsed.date === today) {
                this.dailyQuests = parsed.quests;
                return;
            }
        }

        // Generate new quests for today
        this.dailyQuests = [
            {
                id: 'daily_test',
                name: 'Ежедневный тест',
                description: 'Пройдите любой тест сегодня',
                reward: 20,
                progress: 0,
                target: 1,
                completed: false
            },
            {
                id: 'daily_score',
                name: 'Высокий балл',
                description: 'Получите более 70% в тесте',
                reward: 30,
                progress: 0,
                target: 1,
                completed: false
            },
            {
                id: 'daily_learning',
                name: 'Изучение материала',
                description: 'Прочитайте 3 обучающих материала',
                reward: 25,
                progress: 0,
                target: 3,
                completed: false
            }
        ];

        localStorage.setItem('dailyQuests', JSON.stringify({
            date: today,
            quests: this.dailyQuests
        }));
    }

    /**
     * Check and award achievements
     */
    checkAchievements(userId, eventType, eventData = {}) {
        const user = this.getUserProgress(userId);
        const newAchievements = [];

        switch (eventType) {
            case 'test_completed':
                if (!user.achievements.includes('first_test')) {
                    this.awardAchievement(userId, 'first_test');
                    newAchievements.push('first_test');
                }
                
                if (eventData.score === 100 && !user.achievements.includes('perfectionist')) {
                    this.awardAchievement(userId, 'perfectionist');
                    newAchievements.push('perfectionist');
                }
                
                if (user.testsCompleted >= 10 && !user.achievements.includes('knowledge_seeker')) {
                    this.awardAchievement(userId, 'knowledge_seeker');
                    newAchievements.push('knowledge_seeker');
                }
                
                // Check time-based achievements
                const hour = new Date().getHours();
                if (hour < 7 && !user.achievements.includes('early_bird')) {
                    this.awardAchievement(userId, 'early_bird');
                    newAchievements.push('early_bird');
                }
                if (hour >= 23 && !user.achievements.includes('night_owl')) {
                    this.awardAchievement(userId, 'night_owl');
                    newAchievements.push('night_owl');
                }
                break;

            case 'streak_updated':
                if (eventData.streak >= 7 && !user.achievements.includes('streak_7')) {
                    this.awardAchievement(userId, 'streak_7');
                    newAchievements.push('streak_7');
                }
                if (eventData.streak >= 30 && !user.achievements.includes('streak_30')) {
                    this.awardAchievement(userId, 'streak_30');
                    newAchievements.push('streak_30');
                }
                break;

            case 'points_earned':
                if (user.totalPoints >= 1000 && !user.achievements.includes('master')) {
                    this.awardAchievement(userId, 'master');
                    newAchievements.push('master');
                }
                break;
        }

        return newAchievements;
    }

    /**
     * Award achievement to user
     */
    awardAchievement(userId, achievementId) {
        const user = this.getUserProgress(userId);
        const achievement = this.achievementDefinitions[achievementId];
        
        if (!achievement) return;

        user.achievements.push(achievementId);
        user.totalPoints += achievement.points;
        
        this.saveUserProgress(userId, user);
        this.showAchievementNotification(achievement);
        this.updateLeaderboard(userId);
    }

    /**
     * Update daily quest progress
     */
    updateQuestProgress(questId, progress) {
        const quest = this.dailyQuests.find(q => q.id === questId);
        if (!quest || quest.completed) return;

        quest.progress = Math.min(quest.progress + progress, quest.target);
        
        if (quest.progress >= quest.target) {
            quest.completed = true;
            this.awardQuestReward(quest);
        }

        const today = new Date().toDateString();
        localStorage.setItem('dailyQuests', JSON.stringify({
            date: today,
            quests: this.dailyQuests
        }));
    }

    /**
     * Award quest reward
     */
    awardQuestReward(quest) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const user = this.getUserProgress(currentUser.id);
        user.totalPoints += quest.reward;
        user.currency += quest.reward;
        
        this.saveUserProgress(currentUser.id, user);
        this.showQuestCompletionNotification(quest);
    }

    /**
     * Get user progress
     */
    getUserProgress(userId) {
        if (!this.userProgress[userId]) {
            this.userProgress[userId] = {
                totalPoints: 0,
                currency: 0,
                level: 1,
                achievements: [],
                testsCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                lastActive: null,
                titles: ['Новичок']
            };
        }
        return this.userProgress[userId];
    }

    /**
     * Save user progress
     */
    saveUserProgress(userId, progress) {
        this.userProgress[userId] = progress;
        localStorage.setItem('gamification_progress', JSON.stringify(this.userProgress));
    }

    /**
     * Load user progress from storage
     */
    loadUserProgress() {
        const saved = localStorage.getItem('gamification_progress');
        return saved ? JSON.parse(saved) : {};
    }

    /**
     * Load achievements from storage
     */
    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        return saved ? JSON.parse(saved) : {};
    }

    /**
     * Update leaderboard
     */
    updateLeaderboard(userId) {
        const users = JSON.parse(localStorage.getItem('usersData')) || {};
        const leaderboard = [];

        for (const [id, data] of Object.entries(this.userProgress)) {
            const userData = users[id] || { username: 'Пользователь ' + id };
            leaderboard.push({
                userId: id,
                username: userData.username,
                points: data.totalPoints,
                level: data.level,
                achievements: data.achievements.length
            });
        }

        leaderboard.sort((a, b) => b.points - a.points);
        this.leaderboard = leaderboard;
        
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    /**
     * Load leaderboard
     */
    loadLeaderboard() {
        const saved = localStorage.getItem('leaderboard');
        this.leaderboard = saved ? JSON.parse(saved) : [];
    }

    /**
     * Get user rank
     */
    getUserRank(userId) {
        const index = this.leaderboard.findIndex(entry => entry.userId === userId);
        return index >= 0 ? index + 1 : null;
    }

    /**
     * Calculate user level
     */
    calculateLevel(points) {
        return Math.floor(points / 100) + 1;
    }

    /**
     * Get title based on level and achievements
     */
    getTitle(userId) {
        const user = this.getUserProgress(userId);
        const level = user.level;
        
        if (level >= 50) return 'Гроссмейстер медицины';
        if (level >= 30) return 'Профессор';
        if (level >= 20) return 'Доктор наук';
        if (level >= 15) return 'Доцент';
        if (level >= 10) return 'Специалист';
        if (level >= 5) return 'Студент';
        return 'Новичок';
    }

    /**
     * Update streak
     */
    updateStreak(userId) {
        const user = this.getUserProgress(userId);
        const today = new Date().toDateString();
        const lastActive = user.lastActive;

        if (!lastActive) {
            user.currentStreak = 1;
        } else {
            const lastDate = new Date(lastActive);
            const diff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diff === 1) {
                user.currentStreak++;
            } else if (diff > 1) {
                user.currentStreak = 1;
            }
        }

        user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
        user.lastActive = today;
        
        this.saveUserProgress(userId, user);
        
        // Check streak achievements
        this.checkAchievements(userId, 'streak_updated', { streak: user.currentStreak });
        
        return user.currentStreak;
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification animate-fade-in';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-details">
                <h4>Достижение разблокировано!</h4>
                <p class="achievement-name">${achievement.name}</p>
                <p class="achievement-desc">${achievement.description}</p>
                <p class="achievement-points">+${achievement.points} очков</p>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    /**
     * Show quest completion notification
     */
    showQuestCompletionNotification(quest) {
        if (typeof showNotification === 'function') {
            showNotification(`Квест выполнен: ${quest.name}! +${quest.reward} очков`, 'success');
        }
    }

    /**
     * Render achievements panel
     */
    renderAchievementsPanel(userId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = this.getUserProgress(userId);
        const achievements = Object.values(this.achievementDefinitions);
        
        let html = '<div class="achievements-grid">';
        
        achievements.forEach(achievement => {
            const unlocked = user.achievements.includes(achievement.id);
            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-points">${achievement.points} очков</div>
                    ${unlocked ? '<div class="achievement-badge">✓</div>' : ''}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Render leaderboard
     */
    renderLeaderboard(containerId, limit = 10) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="leaderboard-list">';
        
        this.leaderboard.slice(0, limit).forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            html += `
                <div class="leaderboard-entry">
                    <div class="leaderboard-rank">${medal || (index + 1)}</div>
                    <div class="leaderboard-user">
                        <div class="leaderboard-username">${entry.username}</div>
                        <div class="leaderboard-level">Уровень ${entry.level}</div>
                    </div>
                    <div class="leaderboard-points">${entry.points} очков</div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Render daily quests
     */
    renderDailyQuests(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="daily-quests-list">';
        
        this.dailyQuests.forEach(quest => {
            const progress = (quest.progress / quest.target) * 100;
            html += `
                <div class="quest-card ${quest.completed ? 'completed' : ''}">
                    <h4>${quest.name}</h4>
                    <p>${quest.description}</p>
                    <div class="quest-progress">
                        <div class="progress-bar-animated">
                            <div class="progress-bar-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="quest-progress-text">${quest.progress}/${quest.target}</div>
                    </div>
                    <div class="quest-reward">
                        ${quest.completed ? '✓ Выполнено' : `Награда: ${quest.reward} очков`}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamificationSystem;
}
