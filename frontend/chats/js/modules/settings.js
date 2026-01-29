/**
 * SETTINGS.JS - Модуль управления вкладкой настроек
 * Принцип SOLID: 
 * - Single Responsibility: Отвечает только за переключение вкладок
 * - Open/Closed: Можно расширить новыми вкладками без изменения существующего кода
 */

// Сохраняем исходный HTML списка чатов для восстановления
let originalChatListHTML = null;

/**
 * Инициализирует переключение между вкладками
 * @returns {Function} Функция switchTab для программного переключения
 */
export function initTabSwitching() {
    // Пробуем найти элементы несколько раз с задержкой
    let chatsButton = document.getElementById("chatsButton");
    let settingsButton = document.getElementById("settingsButton");
    let botsButton = document.getElementById("botsButton");
    let groupsButton = document.getElementById("groupsButton");
    let contactsButton = document.getElementById("contactsButton");
    let chatListSection = document.getElementById("chatListSection");
    let settingsSection = document.getElementById("settingsSection");
    let contactsSection = document.getElementById("contactsSection");
    let groupsSection = document.getElementById("groupsSection");
    let chatWindow = document.getElementById("chatWindow");
    let chatEmptyState = document.getElementById("chatEmptyState");
    let chatListUl = document.getElementById("chatListUl");

    if (!chatsButton || !settingsButton || !chatListSection || !settingsSection) {
        console.warn("Не все элементы для переключения вкладок найдены");
        return null;
    }

    // Сохраняем исходный HTML списка чатов при первой загрузке
    if (chatListUl && !originalChatListHTML) {
        originalChatListHTML = chatListUl.innerHTML;
    }

    /**
     * Переключает активную вкладку
     * @param {string} tabName - Имя вкладки ('chats' | 'settings' | 'bots')
     */
    function switchTab(tabName) {
        // Убираем активное состояние со всех кнопок
        document.querySelectorAll(".nav-button").forEach(btn => {
            btn.classList.remove("active");
        });

        // Закрываем профиль при переключении вкладок
        const profileSection = document.getElementById("profileSection");
        if (profileSection && !profileSection.classList.contains("hidden")) {
            profileSection.classList.add("hidden");
            const app = document.querySelector('.app');
            if (app) {
                app.classList.remove('profile-open');
            }
        }
        const appRoot = document.querySelector('.app');
        
        if (tabName === "chats") {
            if (appRoot) appRoot.classList.remove('contacts-open');
            chatListSection.classList.remove("hidden");
            settingsSection.classList.add("hidden");
            if (contactsSection) contactsSection.classList.add("hidden");
            if (groupsSection) groupsSection.classList.add("hidden");
            chatsButton.classList.add("active");
            
            // Восстанавливаем исходный список чатов
            if (chatListUl && originalChatListHTML) {
                chatListUl.innerHTML = originalChatListHTML;
            }
            
            // Сбрасываем состояние чата и показываем пустое окно
            if (chatWindow) {
                chatWindow.classList.add("hidden");
            }
            if (chatEmptyState) {
                chatEmptyState.classList.remove("hidden");
            }
            
            // Убираем активное выделение с чатов
            document.querySelectorAll(".chat-list-item-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            
            // Устанавливаем флаг, чтобы при следующем клике на чат показать пустое состояние
            window.dispatchEvent(new CustomEvent("setShouldShowEmptyState"));
            
            // Сбрасываем activeChatId через событие
            window.dispatchEvent(new CustomEvent("resetActiveChat"));
        } else if (tabName === "bots") {
            if (appRoot) appRoot.classList.remove('contacts-open');
            chatListSection.classList.remove("hidden");
            settingsSection.classList.add("hidden");
            if (contactsSection) contactsSection.classList.add("hidden");
            if (groupsSection) groupsSection.classList.add("hidden");
            if (botsButton) botsButton.classList.add("active");
            
            // Сохраняем текущий HTML перед загрузкой ботов (если еще не сохранен)
            if (chatListUl && !originalChatListHTML) {
                originalChatListHTML = chatListUl.innerHTML;
            }
            
            // Загружаем список ботов
            loadBotsList();
            
            // Сбрасываем состояние чата и показываем пустое окно
            if (chatWindow) {
                chatWindow.classList.add("hidden");
            }
            if (chatEmptyState) {
                chatEmptyState.classList.remove("hidden");
            }
            
            // Убираем активное выделение с чатов
            document.querySelectorAll(".chat-list-item-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            
            // Сбрасываем activeChatId через событие
            window.dispatchEvent(new CustomEvent("resetActiveChat"));
        } else if (tabName === "settings") {
            if (appRoot) appRoot.classList.remove('contacts-open');
            chatListSection.classList.add("hidden");
            settingsSection.classList.remove("hidden");
            if (contactsSection) contactsSection.classList.add("hidden");
            if (groupsSection) groupsSection.classList.add("hidden");
            chatWindow.classList.add("hidden");
            chatEmptyState.classList.add("hidden");
            settingsButton.classList.add("active");
        } else if (tabName === "groups") {
            if (appRoot) appRoot.classList.remove('contacts-open');
            chatListSection.classList.add("hidden");
            settingsSection.classList.add("hidden");
            if (contactsSection) contactsSection.classList.add("hidden");
            if (groupsSection) groupsSection.classList.remove("hidden");
            if (chatWindow) chatWindow.classList.add("hidden");
            if (chatEmptyState) chatEmptyState.classList.add("hidden");
            if (groupsButton) groupsButton.classList.add("active");
            
            // Сбрасываем состояние чата группы
            const groupsChatWindow = document.getElementById("groupsChatWindow");
            const groupsChatEmptyState = document.getElementById("groupsChatEmptyState");
            if (groupsChatWindow) groupsChatWindow.classList.add("hidden");
            if (groupsChatEmptyState) groupsChatEmptyState.classList.remove("hidden");
            
            document.querySelectorAll(".chat-list-item-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            document.querySelectorAll("#groupsList .chat-list-item-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            window.dispatchEvent(new CustomEvent("resetActiveChat"));
            window.dispatchEvent(new CustomEvent("groupsTabOpened"));
        } else if (tabName === "contacts") {
            if (appRoot) appRoot.classList.add('contacts-open');
            chatListSection.classList.add("hidden");
            settingsSection.classList.add("hidden");
            if (contactsSection) contactsSection.classList.remove("hidden");
            if (groupsSection) groupsSection.classList.add("hidden");
            if (chatWindow) chatWindow.classList.add("hidden");
            if (chatEmptyState) chatEmptyState.classList.add("hidden");
            if (contactsButton) contactsButton.classList.add("active");
            document.querySelectorAll(".chat-list-item-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            window.dispatchEvent(new CustomEvent("resetActiveChat"));
            window.dispatchEvent(new CustomEvent("contactsTabOpened"));
        }
    }

    // Обработчики кликов на кнопки навигации
    chatsButton.addEventListener("click", () => switchTab("chats"));
    settingsButton.addEventListener("click", () => switchTab("settings"));
    if (botsButton) {
        botsButton.addEventListener("click", () => switchTab("bots"));
    }
    if (groupsButton) {
        groupsButton.addEventListener("click", () => switchTab("groups"));
    }
    if (contactsButton) {
        contactsButton.addEventListener("click", () => switchTab("contacts"));
    }

    // Делаем switchTab доступным глобально
    window.switchTab = switchTab;
    
    return switchTab;
}

/**
 * Загружает и отображает список ботов
 */
async function loadBotsList(searchQuery = "") {
    const chatListUl = document.getElementById("chatListUl");
    if (!chatListUl) return;
    
    try {
        // Добавляем параметр поиска в URL
        const url = searchQuery 
            ? `/api/bots?search_query=${encodeURIComponent(searchQuery)}`
            : "/api/bots";
        
        const response = await fetch(url, {
            credentials: 'include' // Используем cookies для аутентификации
        });
        
        if (!response.ok) {
            throw new Error("Ошибка загрузки ботов");
        }
        
        const data = await response.json();
        const bots = data.bots || [];
        
        // Очищаем список чатов
        chatListUl.innerHTML = "";
        
        // Добавляем ботов (без заголовка, чтобы не было дублирования)
        bots.forEach(bot => {
            const li = document.createElement("li");
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chat-list-item-btn";
            btn.dataset.botId = bot.bot_id;
            if (bot.chat_id) {
                btn.dataset.chatId = bot.chat_id;
            }
            btn.dataset.interlocutorEmail = `bot_${bot.bot_id}@flicker.local`;
            btn.dataset.isBot = "true";
            btn.dataset.lastSeen = "bot";
            btn.dataset.isOnline = "false";
            
            // Определяем текст последнего сообщения
            let lastMessageText = bot.description || "";
            if (bot.last_message) {
                lastMessageText = bot.last_message;
            } else if (bot.has_chat) {
                lastMessageText = "Нет сообщений";
            }
            
            // Определяем время последнего сообщения
            let lastMessageTime = "";
            if (bot.last_message_timestamp) {
                const timestamp = new Date(bot.last_message_timestamp);
                if (!isNaN(timestamp.getTime())) {
                    const now = new Date();
                    const diff = now - timestamp;
                    const minutes = Math.floor(diff / 60000);
                    const hours = Math.floor(diff / 3600000);
                    const days = Math.floor(diff / 86400000);
                    
                    if (minutes < 1) {
                        lastMessageTime = "только что";
                    } else if (minutes < 60) {
                        lastMessageTime = `${minutes} мин назад`;
                    } else if (hours < 24) {
                        lastMessageTime = `${hours} ч назад`;
                    } else if (days < 7) {
                        lastMessageTime = `${days} дн назад`;
                    } else {
                        lastMessageTime = timestamp.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                    }
                }
            }
            
            // Добавляем никнейм в отображение, если есть
            const usernameDisplay = bot.username ? `<span style="color: var(--color-text-inactive); font-size: 12px;">${bot.username}</span>` : "";
            
            btn.innerHTML = `
                <img src="${bot.avatar}" alt="${bot.name}" class="bot-avatar" style="cursor: pointer;" />
                <div class="chat-info">
                    <div class="chat-name">${bot.name} ${usernameDisplay}</div>
                    <div class="last-message" data-chat-id="${bot.chat_id || ''}" data-original-text="${lastMessageText}">${lastMessageText}</div>
                </div>
                <span class="chat-timestamp">
                    <span class="chat-list-time">${lastMessageTime}</span>
                </span>
            `;
            
            // Обработчик клика на аватар - открывает профиль
            const avatarImg = btn.querySelector('img');
            if (avatarImg) {
                avatarImg.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const botEmail = `bot_${bot.bot_id}@flicker.local`;
                    if (window.openProfileModal && typeof window.openProfileModal === 'function') {
                        window.openProfileModal(botEmail);
                    } else if (typeof openProfileModal === 'function') {
                        openProfileModal(botEmail);
                    }
                });
            }
            
            // Обработчик клика на кнопку чата - открывает чат
            btn.addEventListener("click", async (e) => {
                // Если клик был на аватар, не открываем чат (профиль уже открыт)
                if (e.target.tagName === 'IMG' || e.target.closest('img')) {
                    return;
                }
                // Иначе открываем чат
                await startBotChat(bot.bot_id);
            });
            
            li.appendChild(btn);
            chatListUl.appendChild(li);
        });
    } catch (error) {
        console.error("Ошибка загрузки ботов:", error);
    }
}

/**
 * Создает или открывает чат с ботом
 */
async function startBotChat(botId) {
    try {
        const response = await fetch(`/api/bots/${botId}/start_chat`, {
            method: "POST",
            credentials: 'include', // Используем cookies для аутентификации
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error("Ошибка создания чата с ботом");
        }
        
        const data = await response.json();
        const chatId = data.chat_id;
        
        // НЕ переключаемся на "Чаты" - открываем чат прямо в разделе "Боты"
        const chatWindow = document.getElementById("chatWindow");
        const chatEmptyState = document.getElementById("chatEmptyState");
        
        // Показываем окно чата
        if (chatWindow) {
            chatWindow.classList.remove("hidden");
        }
        if (chatEmptyState) {
            chatEmptyState.classList.add("hidden");
        }
        
        // Загружаем чат - loadChat установит activeChatId
        // Используем window.loadChat, который должен быть доступен после загрузки main.js
        const tryLoadChat = () => {
            if (window.loadChat && typeof window.loadChat === 'function') {
                console.log("Используем window.loadChat для загрузки чата:", chatId);
                window.loadChat(chatId);
            } else {
                console.warn("loadChat не доступен, используем fallback");
                loadChatDirectly(chatId, data.bot);
            }
        };
        
        // Пробуем сразу, если не получилось - ждем немного
        tryLoadChat();
        if (!window.loadChat || typeof window.loadChat !== 'function') {
            setTimeout(tryLoadChat, 300);
        }
        
        // НЕ добавляем чат в список здесь - он уже будет в списке "Чаты" из базы данных
        // При переключении на "Чаты" список восстановится из originalChatListHTML
    } catch (error) {
        console.error("Ошибка создания чата с ботом:", error);
        alert("Не удалось создать чат с ботом");
    }
}

/**
 * Прямая загрузка чата (fallback если loadChat недоступен)
 */
async function loadChatDirectly(chatId, bot) {
    const chatWindow = document.getElementById("chatWindow");
    const chatEmptyState = document.getElementById("chatEmptyState");
    const chatMessages = document.getElementById("chatMessages");
    const currentChatTitle = document.getElementById("currentChatTitle");
    const currentChatAvatar = document.getElementById("currentChatAvatar");
    const currentChatStatus = document.getElementById("currentChatStatus");
    const messageInput = document.getElementById("messageInput");
    
    if (!chatWindow || !chatMessages) {
        console.error("Элементы чата не найдены");
        return;
    }
    
    // Показываем окно чата
    if (chatWindow) chatWindow.classList.remove("hidden");
    if (chatEmptyState) chatEmptyState.classList.add("hidden");
    
    // Устанавливаем activeChatId глобально
    window.activeChatId = chatId;
    console.log("activeChatId установлен в loadChatDirectly:", chatId);
    
    // Устанавливаем заголовок и аватар
    if (currentChatTitle && bot) {
        currentChatTitle.textContent = bot.name;
    }
    if (currentChatAvatar && bot) {
        currentChatAvatar.src = bot.avatar;
    }
    if (currentChatStatus) {
        currentChatStatus.textContent = "бот";
        currentChatStatus.dataset.originalText = "бот";
    }
    
    // Загружаем сообщения
    try {
        const response = await fetch(`/api/chat/${chatId}`, {
            credentials: 'include'
        });
        if (response.ok) {
            const chatData = await response.json();
            chatMessages.innerHTML = "";
            
            // Рендерим сообщения (упрощенная версия)
            if (chatData.messages && Array.isArray(chatData.messages)) {
                chatData.messages.forEach(msg => {
                    if (window.renderMessage && typeof window.renderMessage === 'function') {
                        window.renderMessage(msg, false);
                    } else {
                        // Простой рендеринг сообщения
                        const msgDiv = document.createElement("div");
                        const isMine = msg.sender_id === window.CURRENT_USER_EMAIL;
                        msgDiv.className = `message-row ${isMine ? 'outgoing' : 'incoming'}`;
                        const bubble = document.createElement("div");
                        bubble.className = `message ${isMine ? 'outgoing' : 'incoming'}`;
                        bubble.dataset.messageId = msg._id;
                        bubble.innerHTML = `
                            <div class="message-content">${(msg.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                            <div class="message-meta">
                                <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}</span>
                            </div>
                        `;
                        msgDiv.appendChild(bubble);
                        chatMessages.appendChild(msgDiv);
                    }
                });
            }
            
            // Прокручиваем вниз
            chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "auto" });
        }
    } catch (error) {
        console.error("Ошибка загрузки чата:", error);
    }
}

// Экспортируем функции для использования в main.js
window.loadBotsList = loadBotsList;
window.startBotChat = startBotChat;
window.loadChatDirectly = loadChatDirectly;

