/**
 * AI Tutor Module - AI-powered learning assistant
 * Medical Education Platform
 */

class AITutor {
    constructor() {
        this.apiKey = null; // Set API key when ready
        this.conversationHistory = [];
        // Configuration: Use mock data by default, can be overridden via config
        // In production: new AITutor({ useMockData: false, apiKey: 'your-key' })
        this.useMockData = true;
        this.initialize();
    }

    /**
     * Initialize AI Tutor
     */
    initialize() {
        // Load conversation history from storage
        this.loadConversationHistory();
        
        // Setup tutor UI
        this.setupTutorUI();
    }

    /**
     * Generate AI response (mock for now, can integrate with OpenAI/GPT later)
     */
    async generateResponse(question, context = {}) {
        if (this.useMockData) {
            return this.getMockResponse(question, context);
        }
        
        // TODO: Integrate with actual AI API
        try {
            const response = await fetch('/api/ai-tutor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    context,
                    history: this.conversationHistory.slice(-5) // Last 5 messages for context
                })
            });
            
            const data = await response.json();
            return data.answer;
        } catch (error) {
            console.error('AI API error:', error);
            return this.getMockResponse(question, context);
        }
    }

    /**
     * Get mock response based on question
     */
    getMockResponse(question, context) {
        const lowerQuestion = question.toLowerCase();
        
        // Medical terminology
        if (lowerQuestion.includes('анатомия') || lowerQuestion.includes('anatomy')) {
            return {
                answer: "Анатомия - это наука, изучающая строение организма. Основные системы: сердечно-сосудистая, нервная, дыхательная, пищеварительная, опорно-двигательная, эндокринная, лимфатическая и мочеполовая.",
                resources: [
                    { title: "Анатомия человека - Основы", url: "#learning" },
                    { title: "Интерактивный атлас тела", url: "#learning" }
                ]
            };
        }
        
        if (lowerQuestion.includes('физиология') || lowerQuestion.includes('physiology')) {
            return {
                answer: "Физиология изучает функции живого организма и его частей. Она объясняет, как работают различные системы тела, как они взаимодействуют и поддерживают жизнь.",
                resources: [
                    { title: "Физиология человека - Введение", url: "#learning" },
                    { title: "Гомеостаз и регуляция", url: "#learning" }
                ]
            };
        }
        
        if (lowerQuestion.includes('биохимия') || lowerQuestion.includes('biochemistry')) {
            return {
                answer: "Биохимия изучает химические процессы в живых организмах. Ключевые темы: метаболизм, ферменты, белки, нуклеиновые кислоты (ДНК, РНК), липиды и углеводы.",
                resources: [
                    { title: "Основы биохимии", url: "#learning" },
                    { title: "Обмен веществ", url: "#learning" }
                ]
            };
        }
        
        // Medical procedures
        if (lowerQuestion.includes('первая помощь') || lowerQuestion.includes('first aid')) {
            return {
                answer: "Первая помощь - это срочные меры, предпринимаемые до прибытия медицинской помощи. Основные навыки: СЛР, остановка кровотечения, иммобилизация переломов, помощь при шоке.",
                resources: [
                    { title: "Алгоритм СЛР", url: "#learning" },
                    { title: "Неотложная помощь - Практикум", url: "#learning" }
                ]
            };
        }
        
        if (lowerQuestion.includes('диагностика') || lowerQuestion.includes('diagnosis')) {
            return {
                answer: "Диагностика включает сбор анамнеза, физикальное обследование, лабораторные и инструментальные исследования. Важны навыки клинического мышления и дифференциальной диагностики.",
                resources: [
                    { title: "Методы диагностики", url: "#learning" },
                    { title: "Клинический разбор случаев", url: "#learning" }
                ]
            };
        }
        
        // Career guidance
        if (lowerQuestion.includes('специальность') || lowerQuestion.includes('специализация') || lowerQuestion.includes('specialty')) {
            return {
                answer: "В медицине множество специальностей: терапия, хирургия, педиатрия, кардиология, неврология, дерматология, офтальмология, ЛОР, анестезиология, радиология и многие другие. Выбор зависит от ваших интересов и склонностей.",
                resources: [
                    { title: "Тест на определение специальности", url: "#tests" },
                    { title: "Обзор медицинских специальностей", url: "#learning" }
                ]
            };
        }
        
        if (lowerQuestion.includes('поступление') || lowerQuestion.includes('вуз') || lowerQuestion.includes('university')) {
            return {
                answer: "Для поступления в медицинский вуз обычно требуется высокий балл по биологии, химии и русскому языку. Рекомендуется участие в олимпиадах и волонтерство в медицинских учреждениях.",
                resources: [
                    { title: "Требования к поступлению", url: "#learning" },
                    { title: "Подготовка к экзаменам", url: "#learning" }
                ]
            };
        }
        
        // Study tips
        if (lowerQuestion.includes('как учить') || lowerQuestion.includes('запомнить') || lowerQuestion.includes('study')) {
            return {
                answer: "Эффективные методы обучения: интервальное повторение, активное вспоминание, обучение других, использование мнемоник, создание ментальных карт, регулярные перерывы (метод Помодоро).",
                resources: [
                    { title: "Техники запоминания", url: "#learning" },
                    { title: "Организация учебного процесса", url: "#learning" }
                ]
            };
        }
        
        // Default response
        return {
            answer: "Спасибо за ваш вопрос! Я помогу вам разобраться. Пожалуйста, уточните, какой именно аспект медицины или обучения вас интересует? Я могу рассказать об анатомии, физиологии, медицинских специальностях, поступлении в вуз или методах эффективного обучения.",
            resources: []
        };
    }

    /**
     * Generate practice questions
     */
    generatePracticeQuestions(topic, difficulty = 'medium', count = 5) {
        const questions = {
            anatomy: [
                {
                    question: "Какой орган является центральным насосом кровеносной системы?",
                    options: ["Сердце", "Печень", "Почки", "Легкие"],
                    correct: 0,
                    explanation: "Сердце - это мышечный орган, который перекачивает кровь по всему телу, обеспечивая доставку кислорода и питательных веществ."
                },
                {
                    question: "Сколько костей в теле взрослого человека?",
                    options: ["206", "300", "150", "412"],
                    correct: 0,
                    explanation: "У взрослого человека 206 костей. У новорожденных около 300, но со временем некоторые срастаются."
                },
                {
                    question: "Что защищает мозг от повреждений?",
                    options: ["Череп и мозговые оболочки", "Только череп", "Кожа головы", "Ничего"],
                    correct: 0,
                    explanation: "Мозг защищен черепом (костная защита) и тремя слоями мозговых оболочек, а также цереброспинальной жидкостью."
                }
            ],
            physiology: [
                {
                    question: "Какова нормальная температура тела человека?",
                    options: ["36.6°C", "37.5°C", "35.0°C", "38.0°C"],
                    correct: 0,
                    explanation: "Нормальная температура тела составляет около 36.6°C, хотя индивидуальные вариации в пределах 36-37°C считаются нормой."
                },
                {
                    question: "Какой газ мы вдыхаем для дыхания?",
                    options: ["Кислород", "Углекислый газ", "Азот", "Водород"],
                    correct: 0,
                    explanation: "Мы вдыхаем кислород (O₂), который необходим клеткам для производства энергии, и выдыхаем углекислый газ (CO₂)."
                }
            ],
            chemistry: [
                {
                    question: "Какова формула воды?",
                    options: ["H₂O", "CO₂", "NaCl", "CH₄"],
                    correct: 0,
                    explanation: "Вода имеет формулу H₂O - два атома водорода и один атом кислорода."
                },
                {
                    question: "Что такое pH?",
                    options: ["Мера кислотности/щелочности", "Тип белка", "Химический элемент", "Форма энергии"],
                    correct: 0,
                    explanation: "pH - это мера концентрации ионов водорода, показывающая кислотность или щелочность раствора. Шкала от 0 до 14."
                }
            ],
            biology: [
                {
                    question: "Что такое ДНК?",
                    options: ["Генетический материал", "Тип белка", "Форма энергии", "Гормон"],
                    correct: 0,
                    explanation: "ДНК (дезоксирибонуклеиновая кислота) - это молекула, хранящая генетическую информацию всех живых организмов."
                },
                {
                    question: "Сколько хромосом у человека?",
                    options: ["46", "23", "48", "92"],
                    correct: 0,
                    explanation: "У человека 46 хромосом (23 пары) - 23 от матери и 23 от отца."
                }
            ]
        };
        
        const topicQuestions = questions[topic] || questions.anatomy;
        return topicQuestions.slice(0, count);
    }

    /**
     * Generate study notes from content
     */
    generateNotes(content, format = 'summary') {
        // Mock note generation - in production would use AI
        if (format === 'summary') {
            return {
                title: "Краткий конспект",
                content: `
# Основные тезисы

• Ключевой момент 1: Основная информация из материала
• Ключевой момент 2: Важные детали и факты
• Ключевой момент 3: Связи и взаимоотношения концепций

## Рекомендации к запоминанию

- Используйте мнемонические приемы
- Повторяйте материал регулярно
- Связывайте с практическими примерами
                `,
                format: 'markdown'
            };
        } else if (format === 'flashcards') {
            return {
                title: "Карточки для повторения",
                cards: [
                    { front: "Вопрос 1", back: "Ответ 1" },
                    { front: "Вопрос 2", back: "Ответ 2" },
                    { front: "Вопрос 3", back: "Ответ 3" }
                ]
            };
        }
    }

    /**
     * Provide homework help
     */
    async provideHomeworkHelp(question, subject) {
        const response = await this.generateResponse(question, { subject, type: 'homework' });
        
        return {
            explanation: response.answer,
            stepByStep: [
                "Шаг 1: Проанализируйте вопрос и определите ключевые понятия",
                "Шаг 2: Вспомните связанную теорию и факты",
                "Шаг 3: Структурируйте ответ логически",
                "Шаг 4: Подкрепите примерами и доказательствами"
            ],
            resources: response.resources || []
        };
    }

    /**
     * Setup tutor UI
     */
    setupTutorUI() {
        // Create floating chat button
        const chatBtn = document.createElement('button');
        chatBtn.className = 'ai-tutor-btn fab';
        chatBtn.innerHTML = '🤖';
        chatBtn.title = 'Спросить AI тьютора';
        chatBtn.onclick = () => this.openTutorChat();
        
        // Only add if not already present
        if (!document.querySelector('.ai-tutor-btn')) {
            document.body.appendChild(chatBtn);
        }
        
        // Hide on landing page (for not logged in users)
        this.updateTutorVisibility();
    }
    
    /**
     * Update tutor button visibility based on login state
     */
    updateTutorVisibility() {
        const tutorBtn = document.querySelector('.ai-tutor-btn');
        if (!tutorBtn) return;
        
        const landingPage = document.getElementById('landing-page');
        const mainContent = document.getElementById('main-content');
        
        // Hide if landing page is visible (user not logged in)
        if (landingPage && landingPage.style.display !== 'none') {
            tutorBtn.style.display = 'none';
        } else if (mainContent && mainContent.style.display !== 'none') {
            tutorBtn.style.display = 'flex';
        }
    }

    /**
     * Open tutor chat interface
     */
    openTutorChat() {
        // Create chat modal
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-content ai-tutor-modal" style="max-width: 600px;">
                <div class="ai-tutor-header">
                    <h3>🤖 AI Тьютор</h3>
                    <button onclick="this.closest('.modal-backdrop').remove()" class="close-btn">✕</button>
                </div>
                <div class="ai-tutor-messages" id="ai-tutor-messages">
                    <div class="tutor-message bot-message">
                        <p>Здравствуйте! Я ваш AI-помощник по медицине. Задавайте мне вопросы об анатомии, физиологии, медицинских специальностях или методах обучения!</p>
                    </div>
                </div>
                <div class="ai-tutor-input">
                    <input type="text" id="ai-tutor-input" placeholder="Задайте вопрос..." />
                    <button onclick="window.aiTutor.sendMessage()" class="send-btn">Отправить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus input
        document.getElementById('ai-tutor-input').focus();
        
        // Allow Enter key to send
        document.getElementById('ai-tutor-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    /**
     * Send message in chat
     */
    async sendMessage() {
        const input = document.getElementById('ai-tutor-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get response
        const response = await this.generateResponse(message);
        
        // Remove typing indicator
        this.hideTypingIndicator();
        
        // Add bot response
        this.addMessageToChat(response.answer, 'bot', response.resources);
        
        // Save to history
        this.conversationHistory.push({
            question: message,
            answer: response.answer,
            timestamp: new Date().toISOString()
        });
        
        this.saveConversationHistory();
    }

    /**
     * Add message to chat
     */
    addMessageToChat(text, sender, resources = []) {
        const messagesContainer = document.getElementById('ai-tutor-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `tutor-message ${sender}-message`;
        
        let html = `<p>${text}</p>`;
        
        if (resources.length > 0) {
            html += '<div class="tutor-resources"><strong>Полезные ресурсы:</strong><ul>';
            resources.forEach(resource => {
                html += `<li><a href="${resource.url}">${resource.title}</a></li>`;
            });
            html += '</ul></div>';
        }
        
        messageDiv.innerHTML = html;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const messagesContainer = document.getElementById('ai-tutor-messages');
        const indicator = document.createElement('div');
        indicator.className = 'tutor-message bot-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Save conversation history
     */
    saveConversationHistory() {
        localStorage.setItem('ai_tutor_history', JSON.stringify(this.conversationHistory));
    }

    /**
     * Load conversation history
     */
    loadConversationHistory() {
        const saved = localStorage.getItem('ai_tutor_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('ai_tutor_history');
    }
}

// Initialize global instance after DOM is ready
if (typeof window !== 'undefined') {
    // Wait for DOM to be fully loaded before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.aiTutor = new AITutor();
        });
    } else {
        // DOM already loaded
        window.aiTutor = new AITutor();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITutor;
}
