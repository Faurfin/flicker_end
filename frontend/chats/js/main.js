// ===========================
// === Flicker Chats RealTime ===
// ===========================

import { initTabSwitching } from './modules/settings.js';
import { initTheme, openAppearancePanel, closeAppearancePanel } from './modules/theme.js';

const API_BASE_URL = window.location.origin;
const WS_PROTOCOL = location.protocol === "https:" ? "wss" : "ws";

const chatListUl = document.getElementById("chatListUl");
// Список результатов поиска пользователей (мгновенный поиск)
const userSearchResultsUl = document.getElementById("userSearchResultsUl");
const chatEmptyState = document.getElementById("chatEmptyState");
const chatWindow = document.getElementById("chatWindow");
const chatMessages = document.getElementById("chatMessages");
const chatSkeleton = document.getElementById("chatSkeleton");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const currentChatTitle = document.getElementById("currentChatTitle");
const currentChatAvatar = document.getElementById("currentChatAvatar");
const chatListAside = document.querySelector(".chat-list");
const backToChatListBtn = document.getElementById("backToChatListBtn");
const chatSearchBtn = document.getElementById("chatSearchBtn");
// === НОВЫЙ КОД ДЛЯ ПОИСКА ===
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const chatListContainer = document.getElementById("chatListContainer");
const messageSearchResults = document.getElementById("messageSearchResults");
const messageSearchResultsList = document.getElementById(
  "messageSearchResultsList"
);
const messageSearchResultsEmpty = document.getElementById(
  "messageSearchResultsEmpty"
);
const chatListScroll = document.querySelector(".chat-list-scroll");
const bodyElement = document.body;
const currentUserDisplayName =
  (bodyElement && bodyElement.dataset.userName) || "Вы";
const currentUserAvatarUrl =
  (bodyElement && bodyElement.dataset.userAvatar) || "/images/юзер.svg";
// Слаг чата, который сервер передал из URL (/@username)
const initialChatSlug =
  (bodyElement && bodyElement.dataset.initialChatSlug) || "";

// Prefers-reduced-motion: класс на body для отключения анимаций в CSS (доступность)
try {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches && bodyElement) bodyElement.classList.add("reduce-motion");
  mq.addEventListener("change", (e) => {
    if (bodyElement) bodyElement.classList.toggle("reduce-motion", e.matches);
  });
} catch (e) {}

// === ОБНОВЛЕНО: Добавлен элемент статуса в хедере ===
const currentChatStatus = document.getElementById("currentChatStatus");
const chatUnblockContainer = document.getElementById("chat-unblock-container");
const unblockUserBtn = document.getElementById("unblockUserBtn");
const blockUserBtn = document.getElementById("blockUserBtn");

// Сохраняем изначальный placeholder поля ввода, чтобы можно было вернуть
if (messageInput && !messageInput.dataset.originalPlaceholder) {
  messageInput.dataset.originalPlaceholder = messageInput.placeholder || "";
}

const attachmentIcon = document.getElementById("attachmentIcon");
const attachmentMenu = document.getElementById("attachmentMenu");
const messageContextMenu = document.getElementById("messageContextMenu");
const contextMenuOverlay = document.getElementById("contextMenuOverlay");
const replyPreview = document.getElementById("replyPreview");
const replyPreviewInfo = document.getElementById("replyPreviewInfo");
const replyPreviewClose = document.getElementById("replyPreviewClose");
const chatSearchWrapper = document.getElementById("chatSearchWrapper");
const chatSearchBar = document.getElementById("chatSearchBar");
const chatSearchInnerIcon = document.getElementById("chatSearchInnerIcon");
const chatSearchInput = document.getElementById("chatSearchInput");
const chatSearchCount = document.getElementById("chatSearchCount");
const chatSearchEmptyLabel = document.getElementById("chatSearchEmptyLabel");
const chatSearchClearBtn = document.getElementById("chatSearchClearBtn");
const chatSearchIcon = document.getElementById("chatSearchIcon");
const chatSearchClearIcon = document.getElementById("chatSearchClearIcon");
const chatSearchPrevBtn = document.getElementById("chatSearchPrevBtn");
const chatSearchNextBtn = document.getElementById("chatSearchNextBtn");
const deleteConfirmOverlay = document.getElementById("deleteConfirmOverlay");
const deleteForAllOption = document.getElementById("deleteForAllOption");
const deleteForSelfOption = document.getElementById("deleteForSelfOption");
const clearChatConfirmOverlay = document.getElementById("clearChatConfirmOverlay");
const clearForAllOption = document.getElementById("clearForAllOption");
const clearForSelfOption = document.getElementById("clearForSelfOption");
const deleteChatConfirmOverlay = document.getElementById("deleteChatConfirmOverlay");
const deleteChatForAllOption = document.getElementById("deleteChatForAllOption");
const deleteChatForSelfOption = document.getElementById("deleteChatForSelfOption");

// === Элементы модального окна профиля ===
const profileSection = document.getElementById("profileSection");
const profileBackBtn = document.getElementById("profileBackBtn");
const profileHeaderBackground = document.getElementById("profileHeaderBackground");
const profileHeaderBgImg = document.getElementById("profileHeaderBgImg");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileQuote = document.getElementById("profileQuote");
const profileCallBtn = document.getElementById("profileCallBtn");
const profileVideoCallBtn = document.getElementById("profileVideoCallBtn");
const profileMessageBtn = document.getElementById("profileMessageBtn");
const profileGiftBtn = document.getElementById("profileGiftBtn");
const profileMenuBtn = document.getElementById("profileMenuBtn");
const profileContentArea = document.getElementById("profileContentArea");
const profileMediaTabs = document.querySelectorAll(".profile-media-tab");
const avatarContainer = document.getElementById("avatar-container");
// === Редактирование своего профиля ===
const myProfileSettingsItem = document.getElementById("myProfileSettingsItem");
const settingsInfo = document.getElementById("settingsInfo");
const settingsInfoContent = document.getElementById("settingsInfoContent");
const myProfileSettingsPanel = document.getElementById("myProfileSettingsPanel");
const myProfileSettingsCloseBtn = document.getElementById("myProfileSettingsCloseBtn");
// === Настройки конфиденциальности ===
const privacySettingsPanel = document.getElementById("privacySettingsPanel");
const privacySettingsCloseBtn = document.getElementById("privacySettingsCloseBtn");
const privacySettingsForm = document.getElementById("privacySettingsForm");
const privacyLastSeenSelect = document.getElementById("privacyLastSeenSelect");
const privacyProfilePhotoSelect = document.getElementById("privacyProfilePhotoSelect");
const privacyCurrentPassword = document.getElementById("privacyCurrentPassword");
const privacyNewPassword = document.getElementById("privacyNewPassword");
const privacyChangePasswordBtn = document.getElementById("privacyChangePasswordBtn");
const privacyEmailInput = document.getElementById("privacyEmailInput");
const privacyUpdateEmailBtn = document.getElementById("privacyUpdateEmailBtn");
const privacyBlockEmailInput = document.getElementById("privacyBlockEmailInput");
const privacyBlockUserBtn = document.getElementById("privacyBlockUserBtn");
const privacyBlockedUsersList = document.getElementById("privacyBlockedUsersList");
const privacySaveBtn = document.getElementById("privacySaveBtn");
const privacyStatus = document.getElementById("privacyStatus");
const myProfileAvatarImg = document.getElementById("myProfileAvatarImg");
const myProfileAvatarBtn = document.getElementById("myProfileAvatarBtn");
const myProfileAvatarInput = document.getElementById("myProfileAvatarInput");
const myProfileDisplayName = document.getElementById("myProfileDisplayName");
const myProfileEmailText = document.getElementById("myProfileEmailText");
const myProfileUsernameChip = document.getElementById("myProfileUsernameChip");
const myProfileForm = document.getElementById("myProfileForm");
const myProfileNameInput = document.getElementById("myProfileNameInput");
const myProfileUsernameInput = document.getElementById("myProfileUsernameInput");
const myProfileEmailInput = document.getElementById("myProfileEmailInput");
const myProfileAboutInput = document.getElementById("myProfileAboutInput");
const myProfileStatus = document.getElementById("myProfileStatus");
const myProfileSaveBtn = document.getElementById("myProfileSaveBtn");
const profileEditSection = document.getElementById("profileEditSection");
const profileEditForm = document.getElementById("profileEditForm");
const profileEditNameInput = document.getElementById("profileEditNameInput");
const profileEditUsernameInput = document.getElementById("profileEditUsernameInput");
const profileEditEmailInput = document.getElementById("profileEditEmailInput");
const profileEditAboutInput = document.getElementById("profileEditAboutInput");
const profileEditStatus = document.getElementById("profileEditStatus");
const profileEditSaveBtn = document.getElementById("profileEditSaveBtn");
const profileAvatarEditBtn = document.getElementById("profileAvatarEditBtn");
const profileAvatarInput = document.getElementById("profileAvatarInput");

/** Текущая сохранённая аватарка (с сервера). Для отката превью при закрытии без сохранения. */
let _myProfileSavedAvatarUrl = "";
/** Object URL превью выбранного файла. Нужно отзывать при смене/закрытии/успешном сохранении. */
let _myProfilePreviewObjectUrl = null;

// === Эти переменные передаются из chats.html ===
const currentUserEmail = window.CURRENT_USER_EMAIL;
const currentUserId = window.CURRENT_USER_ID;

let activeChatId = null;
let currentChatIsGroup = false; // Флаг, что текущий чат является групповым
let isChatOpenedFromUrl = false; // Флаг, что чат открыт по URL и не должен закрываться
let currentChatParticipants = []; // Участники текущего чата для упоминаний
let mentionsList = null; // Элемент списка упоминаний
let mentionsListContent = null; // Контент списка упоминаний
let currentMentionStart = -1; // Позиция начала упоминания (@)
let selectedMentionIndex = -1; // Индекс выбранного участника в списке
let isUserAtBottom = true; // Флаг, находится ли пользователь внизу чата
let newMessagesCount = 0; // Счетчик новых сообщений, когда пользователь не внизу
let scrollToBottomBtn = null; // Кнопка прокрутки вниз
let newMessagesCountEl = null; // Элемент счетчика новых сообщений
let currentProfileEmail = null; // Email открытого профиля (в панели справа)

if (chatMessages) {
  chatMessages.addEventListener(
    "scroll",
    debounce(() => {
      if (activeChatId) {
        rememberScrollPosition(activeChatId);
      }
    }, 120)
  );
}

// Защита от закрытия чата: перехватываем все попытки закрыть чат, если он открыт по URL
let isProtectionActive = false;
let protectionInterval = null;
let protectionObserver = null;

// Храним позиции скролла, чтобы возвращать пользователя на то же место
const chatScrollPositions = new Map();

function rememberScrollPosition(chatId) {
  if (!chatId || !chatMessages) return;
  chatScrollPositions.set(chatId, chatMessages.scrollTop);
}

function restoreScrollPosition(chatId) {
  if (!chatId || !chatMessages) return;
  const y = chatScrollPositions.get(chatId);
  if (typeof y === "number") {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = y;
    });
  }
}

// Предзагрузка чата (кэш с защитой от повторов)
function prefetchChat(chatId) {
  if (!chatId) return Promise.resolve(null);
  const cached = chatCacheMem.get(chatId);
  if (cached && Date.now() - cached.ts < CHAT_CACHE_TTL) return Promise.resolve(cached.data);
  if (inflightChatFetches.has(chatId)) return inflightChatFetches.get(chatId);

  const p = fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
    credentials: 'include'
  })
    .then((resp) => {
      if (!resp.ok) {
        console.error(`[prefetchChat] Ошибка загрузки чата ${chatId}:`, resp.status, resp.statusText);
        throw new Error(`Failed prefetch: ${resp.status} ${resp.statusText}`);
      }
      return resp.json();
    })
    .then((data) => {
      console.log(`[prefetchChat] Данные чата ${chatId} получены:`, data);
      console.log(`[prefetchChat] Количество сообщений:`, (data.messages || []).length);
      return data;
    })
    .then((data) => {
      writeCachedChat(chatId, data);
      return data;
    })
    .catch((err) => {
      console.warn("prefetchChat error", err);
      return null;
    })
    .finally(() => inflightChatFetches.delete(chatId));

  inflightChatFetches.set(chatId, p);
  return p;
}

// ===========================
// === Утилиты ===
// ===========================
function debounce(fn, delay) {
  let t = null;
  return function (...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ===========================
// === Кэш чатов (IndexedDB + память) ===
// ===========================
const CHAT_CACHE_TTL = 60_000; // 60 секунд
const CHAT_CACHE_LIMIT = 8;    // максимум записей в памяти
const chatCacheMem = new Map(); // chatId -> {ts, data}
const inflightChatFetches = new Map(); // chatId -> Promise
let chatCacheDbPromise = null;

function openChatCacheDb() {
  if (!("indexedDB" in window)) return null;
  if (chatCacheDbPromise) return chatCacheDbPromise;
  chatCacheDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open("flickerChatCache", 1);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("chats")) {
        db.createObjectStore("chats");
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
  return chatCacheDbPromise;
}

async function readCachedChat(chatId) {
  if (!chatId) return null;
  const hit = chatCacheMem.get(chatId);
  if (hit && Date.now() - hit.ts < CHAT_CACHE_TTL) return hit.data;

  try {
    const db = await openChatCacheDb();
    if (db) {
      const tx = db.transaction("chats", "readonly");
      const store = tx.objectStore("chats");
      const value = await new Promise((res, rej) => {
        const r = store.get(chatId);
        r.onsuccess = () => res(r.result || null);
        r.onerror = () => rej(r.error);
      });
      if (value && value.ts && Date.now() - value.ts < CHAT_CACHE_TTL) {
        chatCacheMem.set(chatId, { ts: value.ts, data: value.data });
        return value.data;
      }
    } else {
      const raw = localStorage.getItem(`chat_cache_${chatId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.ts && Date.now() - parsed.ts < CHAT_CACHE_TTL) {
          chatCacheMem.set(chatId, { ts: parsed.ts, data: parsed.data });
          return parsed.data;
        }
      }
    }
  } catch (e) {
    console.warn("readCachedChat error", e);
  }
  return null;
}

async function writeCachedChat(chatId, data) {
  if (!chatId || !data) return;
  const ts = Date.now();
  chatCacheMem.set(chatId, { ts, data });
  // LRU eviction
  if (chatCacheMem.size > CHAT_CACHE_LIMIT) {
    const oldest = [...chatCacheMem.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    if (oldest) chatCacheMem.delete(oldest[0]);
  }
  try {
    const db = await openChatCacheDb();
    if (db) {
      const tx = db.transaction("chats", "readwrite");
      tx.objectStore("chats").put({ ts, data }, chatId);
    } else {
      localStorage.setItem(`chat_cache_${chatId}`, JSON.stringify({ ts, data }));
    }
  } catch (e) {
    console.warn("writeCachedChat error", e);
  }
}

function showChatSkeleton() {
  if (chatSkeleton) chatSkeleton.classList.remove("hidden");
  if (chatMessages) chatMessages.classList.add("hidden");
  if (chatWindow) {
    chatWindow.classList.add("fade-start");
    requestAnimationFrame(() => chatWindow.classList.add("fade-in"));
  }
}

function hideChatSkeleton() {
  if (chatSkeleton) chatSkeleton.classList.add("hidden");
  if (chatMessages) chatMessages.classList.remove("hidden");
  if (chatWindow) {
    chatWindow.classList.remove("fade-start");
    chatWindow.classList.add("fade-in");
  }
}

function protectChatFromClosing() {
  if (!isChatOpenedFromUrl || !activeChatId || !chatWindow) return;
  if (isProtectionActive) return; // Защита уже активна
  
  isProtectionActive = true;
  console.log("[Telegram Logic] Активирована ПОЛНАЯ защита от закрытия чата. activeChatId:", activeChatId);
  
  // Функция для принудительного открытия чата
  const forceOpenChat = () => {
    if (isChatOpenedFromUrl && activeChatId && chatWindow) {
      chatWindow.classList.remove("hidden");
      chatWindow.style.display = "";
      chatWindow.style.visibility = "visible";
      chatWindow.style.opacity = "1";
      chatWindow.style.height = "";
      chatWindow.style.width = "";
    }
    if (isChatOpenedFromUrl && activeChatId && chatEmptyState) {
      chatEmptyState.classList.add("hidden");
      chatEmptyState.style.display = "none";
      chatEmptyState.style.visibility = "hidden";
      chatEmptyState.style.opacity = "0";
    }
  };
  
  // Перехватываем изменения класса hidden у chatWindow
  const originalAdd = chatWindow.classList.add.bind(chatWindow.classList);
  chatWindow.classList.add = function(...args) {
    if (args.includes('hidden') && isChatOpenedFromUrl && activeChatId) {
      console.warn("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат через classList.add('hidden')");
      forceOpenChat();
      return; // Блокируем добавление класса hidden
    }
    return originalAdd(...args);
  };
  
  // Перехватываем toggle
  const originalToggle = chatWindow.classList.toggle.bind(chatWindow.classList);
  chatWindow.classList.toggle = function(...args) {
    if (args.includes('hidden') && isChatOpenedFromUrl && activeChatId) {
      console.warn("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат через classList.toggle('hidden')");
      forceOpenChat();
      return false; // Возвращаем false (класс не добавлен)
    }
    return originalToggle(...args);
  };
  
  // Перехватываем изменения style.display
  const originalStyleDisplay = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style')?.get;
  if (chatWindow.style) {
    const styleDescriptor = Object.getOwnPropertyDescriptor(chatWindow.style, 'display');
    if (styleDescriptor && styleDescriptor.set) {
      const originalSet = styleDescriptor.set;
      Object.defineProperty(chatWindow.style, 'display', {
        set: function(value) {
          if ((value === 'none' || value === '') && isChatOpenedFromUrl && activeChatId) {
            console.warn("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат через style.display");
            forceOpenChat();
            return; // Блокируем установку display: none
          }
          originalSet.call(this, value);
        },
        get: styleDescriptor.get,
        configurable: true
      });
    }
  }
  
  // Перехватываем изменения класса hidden у chatEmptyState
  if (chatEmptyState) {
    const originalRemove = chatEmptyState.classList.remove.bind(chatEmptyState.classList);
    chatEmptyState.classList.remove = function(...args) {
      if (args.includes('hidden') && isChatOpenedFromUrl && activeChatId) {
        console.warn("[Telegram Logic] БЛОКИРОВАНО: попытка показать пустое состояние");
        forceOpenChat();
        return; // Блокируем удаление класса hidden
      }
      return originalRemove(...args);
    };
    
    const originalToggleEmpty = chatEmptyState.classList.toggle.bind(chatEmptyState.classList);
    chatEmptyState.classList.toggle = function(...args) {
      if (args.includes('hidden') && isChatOpenedFromUrl && activeChatId) {
        console.warn("[Telegram Logic] БЛОКИРОВАНО: попытка показать пустое состояние через toggle");
        forceOpenChat();
        return true; // Возвращаем true (класс остается)
      }
      return originalToggleEmpty(...args);
    };
  }
  
  // Используем MutationObserver для отслеживания изменений в DOM
  if (typeof MutationObserver !== 'undefined') {
    protectionObserver = new MutationObserver((mutations) => {
      if (!isChatOpenedFromUrl || !activeChatId) return;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target === chatWindow) {
          if (mutation.attributeName === 'class' && chatWindow.classList.contains('hidden')) {
            console.warn("[Telegram Logic] БЛОКИРОВАНО: обнаружено изменение класса через DOM");
            forceOpenChat();
          }
          if (mutation.attributeName === 'style') {
            const display = chatWindow.style.display;
            if (display === 'none' || (display === '' && chatWindow.classList.contains('hidden'))) {
              console.warn("[Telegram Logic] БЛОКИРОВАНО: обнаружено изменение style через DOM");
              forceOpenChat();
            }
          }
        }
      });
    });
    
    protectionObserver.observe(chatWindow, {
      attributes: true,
      attributeFilter: ['class', 'style'],
      childList: false,
      subtree: false
    });
  }
  
  // Постоянная проверка каждые 50мс (бесконечно, пока чат открыт по URL)
  protectionInterval = setInterval(() => {
    if (!isChatOpenedFromUrl || !activeChatId) {
      clearInterval(protectionInterval);
      protectionInterval = null;
      if (protectionObserver) {
        protectionObserver.disconnect();
        protectionObserver = null;
      }
      isProtectionActive = false;
      return;
    }
    
    // Проверяем и принудительно открываем чат, если он закрыт
    if (chatWindow.classList.contains('hidden') || 
        chatWindow.style.display === 'none' || 
        chatWindow.style.visibility === 'hidden') {
      console.warn("[Telegram Logic] Обнаружен закрытый чат, принудительно открываем. activeChatId:", activeChatId);
      forceOpenChat();
    }
    
    // Проверяем и скрываем пустое состояние, если оно показано
    if (chatEmptyState && !chatEmptyState.classList.contains('hidden')) {
      console.warn("[Telegram Logic] Обнаружено пустое состояние, скрываем его. activeChatId:", activeChatId);
      forceOpenChat();
    }
  }, 50); // Проверяем каждые 50мс
}
// Делаем activeChatId доступным глобально для других модулей
Object.defineProperty(window, 'activeChatId', {
  get: () => activeChatId,
  set: (value) => { 
    activeChatId = value;
    console.log("activeChatId установлен:", value);
  },
  configurable: true,
  enumerable: true
});

let ws = null; // Это будет НАШЕ ЕДИНОЕ соединение
const renderedMessageIds = new Set();
let shouldShowEmptyState = false; // Флаг для показа пустого состояния после переключения из настроек

// === Состояние для ответа и редактирования ===
let replyingToMessage = null;
let editingMessageId = null;

// === Переменные и состояние для записи аудио ===
const micIcon = document.getElementById("micIcon");
const voiceRecordingButton = document.getElementById("voiceRecordingButton");
const voiceTimerEl = document.getElementById("voiceTimer");
const chatInputForm = document.querySelector(".chat-input-form");
let mediaRecorder = null;
let mediaStream = null;
let audioChunks = [];
let recordingStartTs = 0;
let recordingTimerId = null;
let isCancelling = false;
let startPointerX = 0;
let audioContext = null;
let analyser = null;
let sourceNode = null;
let rafWave = null;

// Глобальное управление воспроизведением аудио
let currentPlayingAudio = {
  element: null,
  audioBar: null,
  messageId: null
};

// ===========================
// === Хелперы (ОБНОВЛЕНЫ) ===
// ===========================

// === Функции для работы с черновиками ===
function saveDraft(chatId, text) {
  if (!chatId) return;
  const key = `draft_${chatId}`;
  if (text && text.trim()) {
    localStorage.setItem(key, text.trim());
  } else {
    localStorage.removeItem(key);
  }
  updateChatListDraft(chatId, text && text.trim() ? text.trim() : null);
}

function loadDraft(chatId) {
  if (!chatId) return "";
  const key = `draft_${chatId}`;
  return localStorage.getItem(key) || "";
}

function clearDraft(chatId) {
  if (!chatId) return;
  const key = `draft_${chatId}`;
  localStorage.removeItem(key);
  updateChatListDraft(chatId, null);
}

function updateChatListDraft(chatId, draftText) {
  if (!chatId) return;
  const btn = document.querySelector(`.chat-list-item-btn[data-chat-id="${chatId}"]`);
  if (!btn) return;
  
  const lastMessageEl = btn.querySelector(".last-message");
  if (!lastMessageEl) return;
  
  if (draftText) {
    // Показываем черновик красным цветом
    lastMessageEl.textContent = draftText;
    lastMessageEl.style.color = "var(--color-accent-danger, #dc1010)";
    lastMessageEl.style.fontStyle = "italic";
    lastMessageEl.dataset.isDraft = "true";
    btn.dataset.hasDraft = "true";
  } else {
    // Возвращаем обычное сообщение
    const originalText = lastMessageEl.dataset.originalText || "Нет сообщений";
    lastMessageEl.textContent = originalText;
    lastMessageEl.style.color = "";
    lastMessageEl.style.fontStyle = "";
    lastMessageEl.removeAttribute("data-is-draft");
    btn.removeAttribute("data-has-draft");
  }
  
  // Пересортировываем список чатов
  sortChatList();
}

function formatTime(iso) {
  if (!iso) return "";
  // JavaScript Date автоматически конвертирует UTC время в локальный часовой пояс
  const d = new Date(iso);
  // Проверяем, что дата валидна
  if (isNaN(d.getTime())) return "";
  // Используем локальное время браузера (автоматически конвертируется из UTC)
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

// === НОВЫЙ ХЕЛПЕР: Форматирование статуса "Был(а) в сети..." ===
function formatLastSeen(lastSeen, isOnline) {
  // 1. Если "Печатает...", он важнее (логика в setTypingStatus)
  if (currentChatStatus && currentChatStatus.classList.contains("typing-status")) {
    return currentChatStatus.textContent;
  }

  // 2. Если это бот, показываем "бот"
  if (lastSeen === "bot") {
    return "бот";
  }

  // 3. Если lastSeen равен null или undefined (скрыт настройками конфиденциальности)
  if (lastSeen === null || lastSeen === undefined || lastSeen === "") {
    return ""; // Не показываем статус, если он скрыт
  }

  // 4. Если в сети
  if (isOnline) {
    return "в сети";
  }

  // 5. Если не в сети, форматируем время
  if (!lastSeen || lastSeen === "online") {
    // "online" но isOnline=false значит только что вышел
    return "был(а) только что";
  }

  try {
    const d = new Date(lastSeen);
    if (isNaN(d.getTime())) return ""; // Невалидная дата

    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "был(а) только что";
    if (diffMin < 60) return `был(а) ${diffMin} мин. назад`;
    if (diffHour < 24) return `был(а) ${diffHour} ч. назад`;
    if (diffDay === 1) return `был(а) вчера в ${formatTime(lastSeen)}`;
    return `был(а) ${d.toLocaleDateString("ru-RU")}`;
  } catch (e) {
    console.warn("Could not parse lastSeen date:", lastSeen);
    return "";
  }
}
// === КОНЕЦ НОВОГО ХЕЛПЕРА ===

// === scrollToBottom теперь по умолчанию "smooth" ===
function scrollToBottom(force = false) {
  if (!chatMessages) return;
  
  // Если пользователь не внизу и не принудительная прокрутка, не прокручиваем
  if (!force && !isUserAtBottom) {
    return;
  }
  
  chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: force ? "auto" : "smooth" });
  
  // После прокрутки обновляем состояние
  setTimeout(() => {
    checkIfUserAtBottom();
  }, 100);
}

/**
 * Проверяет, находится ли пользователь внизу чата
 */
function checkIfUserAtBottom() {
  if (!chatMessages) return;
  
  const threshold = 100; // Порог в пикселях от низа
  const scrollTop = chatMessages.scrollTop;
  const scrollHeight = chatMessages.scrollHeight;
  const clientHeight = chatMessages.clientHeight;
  
  const wasAtBottom = isUserAtBottom;
  isUserAtBottom = scrollHeight - scrollTop - clientHeight < threshold;
  
  // Если пользователь прокрутил вниз, сбрасываем счетчик и скрываем кнопку
  if (isUserAtBottom) {
    newMessagesCount = 0;
    updateScrollToBottomButton();
  } else if (wasAtBottom && !isUserAtBottom) {
    // Пользователь прокрутил вверх - показываем кнопку
    updateScrollToBottomButton();
  }
}

/**
 * Обновляет видимость кнопки прокрутки вниз и счетчика
 */
function updateScrollToBottomButton() {
  if (!scrollToBottomBtn || !newMessagesCountEl) return;
  
  if (!isUserAtBottom || newMessagesCount > 0) {
    scrollToBottomBtn.classList.remove("hidden");
    
    if (newMessagesCount > 0) {
      newMessagesCountEl.textContent = newMessagesCount > 99 ? "99+" : newMessagesCount;
      newMessagesCountEl.classList.remove("hidden");
    } else {
      newMessagesCountEl.classList.add("hidden");
    }
  } else {
    scrollToBottomBtn.classList.add("hidden");
    newMessagesCountEl.classList.add("hidden");
  }
}

function toggleSendButton() {
  sendButton.classList.toggle("hidden", messageInput.value.trim().length === 0);
}

async function pinMessage(messageId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/pin_message/${messageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Ошибка закрепления сообщения");
    }
    const result = await response.json();
    console.log(result.message);
    closeContextMenu();
  } catch (error) {
    console.error("Ошибка закрепления сообщения:", error);
    alert(error.message || "Не удалось закрепить сообщение");
  }
}

function updatePinnedMessage(pinnedMessageId, pinnedMessage) {
  let pinnedContainer = document.getElementById("pinnedMessageContainer");
  
  if (!pinnedMessageId || !pinnedMessage) {
    // Удаляем контейнер, если сообщение откреплено
    if (pinnedContainer) {
      pinnedContainer.remove();
    }
    return;
  }
  
  // Если данных сообщения нет, пытаемся получить их из DOM
  if (!pinnedMessage.content && !pinnedMessage.type) {
    const messageEl = document.querySelector(`.message[data-message-id="${pinnedMessageId}"]`);
    if (messageEl) {
      const msgContent = messageEl.querySelector(".message-content");
      const isOutgoing = messageEl.classList.contains("outgoing");
      pinnedMessage = {
        sender_id: isOutgoing ? currentUserEmail : "other",
        content: msgContent ? msgContent.textContent : "",
        type: "text"
      };
    } else {
      // Если сообщение не найдено в DOM, не показываем закрепленное
      return;
    }
  }
  
  // Создаем контейнер, если его нет
  if (!pinnedContainer) {
    pinnedContainer = document.createElement("div");
    pinnedContainer.id = "pinnedMessageContainer";
    pinnedContainer.className = "pinned-message-container";
    // Вставляем после хедера, перед сообщениями
    const chatHeader = document.querySelector(".chat-header");
    const chatMessages = document.getElementById("chatMessages");
    if (chatHeader && chatMessages) {
      chatHeader.parentNode.insertBefore(pinnedContainer, chatMessages);
    } else if (chatHeader) {
      chatHeader.parentNode.appendChild(pinnedContainer);
    }
  }
  
  // Формируем контент закрепленного сообщения
  const senderName = pinnedMessage.sender_id === currentUserEmail ? "Вы" : "Собеседник";
  let contentText = pinnedMessage.content || "";
  if (pinnedMessage.type === "image") {
    contentText = contentText || "Фото";
  } else if (pinnedMessage.type === "video") {
    contentText = contentText || "Видео";
  } else if (pinnedMessage.type === "file") {
    contentText = pinnedMessage.filename || "Файл";
  } else if (pinnedMessage.type === "audio") {
    contentText = "Голосовое сообщение";
  }
  
  pinnedContainer.innerHTML = `
    <div class="pinned-message-content">
      <div class="pinned-message-icon">
        <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.85714 5.28571V11.2857C4.85714 12.4692 5.81653 13.4286 7 13.4286C8.18347 13.4286 9.14286 12.4692 9.14286 11.2857V5.07143C9.14286 2.82284 7.32002 1 5.07143 1C2.82284 1 1 2.82284 1 5.07143V11.7143C1 15.028 3.68629 17.7143 7 17.7143C10.3137 17.7143 13 15.028 13 11.7143V5.28571" stroke="#02060F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="pinned-message-info">
        <div class="pinned-message-sender">${senderName}</div>
        <div class="pinned-message-text">${contentText}</div>
      </div>
      <button class="pinned-message-close" aria-label="Открепить">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#02060F" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;
  
  // Добавляем обработчик клика для открепления
  const closeBtn = pinnedContainer.querySelector(".pinned-message-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      pinMessage(pinnedMessageId);
    });
  }
  
  // Добавляем обработчик клика для прокрутки к сообщению
  const contentEl = pinnedContainer.querySelector(".pinned-message-content");
  if (contentEl) {
    contentEl.addEventListener("click", () => {
      const messageEl = document.querySelector(`.message[data-message-id="${pinnedMessageId}"]`);
      if (messageEl) {
        messageEl.scrollIntoView({ behavior: "smooth", block: "center" });
        messageEl.style.outline = "2px solid var(--color-primary)";
        setTimeout(() => {
          messageEl.style.outline = "";
        }, 2000);
      }
    });
  }
}

async function deleteMessage(messageId, deleteForAll, elementToRemove) {
  console.log(`Удаление ${messageId}, deleteForAll: ${deleteForAll}`);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/delete_message/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_for_all: deleteForAll,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Ошибка удаления сообщения");
    }
    const result = await response.json();
    console.log(result.message);

    // Локальное удаление сообщения из DOM
    if (elementToRemove) {
      const row = elementToRemove.closest(".message-row");
      if (row) {
        row.remove();
      }
    }

    // Если удаляем только у себя — нужно обновить превью и сортировку чатов
    if (!deleteForAll && activeChatId) {
      const btn = document.querySelector(
        `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
      );
      if (btn) {
        const lastBubble = chatMessages.querySelector(".message:last-of-type");
        let previewText = "Нет сообщений";
        let previewTimestampIso = null;

        if (lastBubble) {
          // Проверяем тип сообщения по наличию элементов
          const imageEl = lastBubble.querySelector(".message-image");
          const videoEl = lastBubble.querySelector(".message-video");
          const fileEl = lastBubble.querySelector(".message-file-container");
          const audioEl = lastBubble.querySelector(".audio-message");
          
          if (imageEl) {
            previewText = "Фотография";
          } else if (videoEl) {
            previewText = "Видео";
          } else if (fileEl) {
            const fileNameEl = fileEl.querySelector("[data-filename]");
            previewText = fileNameEl ? (fileNameEl.dataset.filename || fileNameEl.textContent) : "Файл";
          } else if (audioEl) {
            previewText = "Голосовое сообщение";
          } else {
            const contentEl = lastBubble.querySelector(".message-content");
            if (contentEl && contentEl.textContent.trim()) {
              previewText = contentEl.textContent;
            }
          }
          
          if (lastBubble.dataset.timestamp) {
            previewTimestampIso = lastBubble.dataset.timestamp;
          }
        }

        updateChatPreview(activeChatId, previewText);

        if (previewTimestampIso) {
          const timeEl = btn.querySelector(".chat-list-time");
          if (timeEl) {
            timeEl.textContent = formatTime(previewTimestampIso);
          }
          btn.dataset.lastTimestamp = previewTimestampIso;
        }

        // Пересортируем список чатов, чтобы чат "вернулся" на своё прошлое место
        if (typeof sortChatList === "function") {
          sortChatList();
        }
      }
    }
  } catch (err) {
    console.error("Ошибка при удалении сообщения:", err);
    alert(err.message);
  }
}

async function clearChat(deleteForAll) {
  if (!activeChatId) return;
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clear_chat/${activeChatId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_for_all: deleteForAll,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Ошибка очистки чата");
    }
    
    const result = await response.json();
    console.log(result.message);

    if (deleteForAll) {
      // Очищаем сообщения в чате
      if (chatMessages) {
        chatMessages.innerHTML = "";
      }
      // Обновляем превью чата в списке
      const btn = document.querySelector(
        `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
      );
      if (btn) {
        const lastMsg = btn.querySelector(".last-message");
        if (lastMsg) {
          lastMsg.textContent = "Нет сообщений";
          lastMsg.dataset.originalText = "Нет сообщений";
        }
        const timeEl = btn.querySelector(".chat-list-time");
        if (timeEl) {
          timeEl.textContent = formatTime(new Date().toISOString());
        }
        btn.dataset.lastTimestamp = new Date().toISOString();
      }
    } else {
      // Удаляем чат из списка чатов (скрываем)
      const btn = document.querySelector(
        `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
      );
      if (btn) {
        const li = btn.closest("li");
        if (li) {
          li.remove();
        }
      }
      // Закрываем чат
      if (chatWindow) {
        chatWindow.classList.add("hidden");
      }
      if (chatEmptyState) {
        chatEmptyState.classList.remove("hidden");
      }
      activeChatId = null;
    }
  } catch (err) {
    console.error("Ошибка при очистке чата:", err);
    alert(err.message);
  }
}

async function deleteChat(deleteForAll) {
  if (!activeChatId) return;
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/delete_chat/${activeChatId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_for_all: deleteForAll,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || "Ошибка удаления чата");
    }
    
    const result = await response.json();
    console.log(result.message);

    // Удаляем чат из списка чатов
    const btn = document.querySelector(
      `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
    );
    if (btn) {
      const li = btn.closest("li");
      if (li) {
        li.remove();
      }
    }
    
    // Закрываем чат
    if (chatWindow) {
      chatWindow.classList.add("hidden");
    }
    if (chatEmptyState) {
      chatEmptyState.classList.remove("hidden");
    }
    activeChatId = null;
  } catch (err) {
    console.error("Ошибка при удалении чата:", err);
    alert(err.message);
  }
}

function sortChatList() {
  // ... (без изменений) ...
  const items = Array.from(chatListUl.querySelectorAll("li"));
  const chatItems = items.filter((li) =>
    li.querySelector(".chat-list-item-btn")
  );
  const otherItems = items.filter(
    (li) => !li.querySelector(".chat-list-item-btn")
  );

  chatItems.sort((liA, liB) => {
    const btnA = liA.querySelector(".chat-list-item-btn");
    const btnB = liB.querySelector(".chat-list-item-btn");
    
    // Приоритет чатам с черновиками
    const hasDraftA = btnA.dataset.hasDraft === "true";
    const hasDraftB = btnB.dataset.hasDraft === "true";
    
    if (hasDraftA && !hasDraftB) return -1; // A выше
    if (!hasDraftA && hasDraftB) return 1;  // B выше
    
    // Если оба с черновиками или оба без, сортируем по времени
    const timeA = btnA.dataset.lastTimestamp
      ? new Date(btnA.dataset.lastTimestamp)
      : new Date(0);
    const timeB = btnB.dataset.lastTimestamp
      ? new Date(btnB.dataset.lastTimestamp)
      : new Date(0);
    return timeB - timeA; // Новые вверху
  });

  chatListUl.innerHTML = "";
  otherItems.forEach((item) => chatListUl.appendChild(item));
  chatItems.forEach((item) => chatListUl.appendChild(item));
}

// ===================================
// === setUnreadCount (без изменений) ===
// ===================================

function setUnreadCount(chatId, count) {
  // ... (без изменений) ...
  const btn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  if (!btn) return;
  let unreadEl = btn.querySelector(".unread-count");
  if (!count || count <= 0) {
    if (unreadEl) {
      unreadEl.textContent = "0";
      unreadEl.classList.add("hidden");
    }
  } else {
    if (!unreadEl) {
      unreadEl = document.createElement("div");
      unreadEl.classList.add("unread-count");
      btn.appendChild(unreadEl);
    }
    unreadEl.textContent = count;
    unreadEl.classList.remove("hidden");
  }
}

// ===================================
// === setChatListTicks (без изменений) ===
// ===================================
function setChatListTicks(chatId, status) {
  // ... (без изменений) ...
  const btn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  if (!btn) return;
  const ticksEl = btn.querySelector(".chat-list-ticks");
  if (!ticksEl) {
    console.warn(`No .chat-list-ticks found for chat ${chatId}`);
    return;
  }
  if (status === "read") {
    ticksEl.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
  } else if (status === "sent") {
    ticksEl.innerHTML = `<img src="/images/no_read.svg" alt="Отправлено">`;
  } else {
    ticksEl.innerHTML = "";
  }
}

// ===================================
// === ХЕЛПЕРЫ ДЛЯ "TYPING" (ОБНОВЛЕН) ===
// ===================================

function setTypingStatus(chatId, isTyping) {
  // ... (без изменений, эта логика уже обновлена) ...
  const btn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  if (btn) {
    const lastMsg = btn.querySelector(".last-message");
    if (lastMsg) {
      if (isTyping) {
        if (!lastMsg.classList.contains("typing-status")) {
          lastMsg.textContent = "Печатает...";
          lastMsg.classList.add("typing-status");
        }
      } else {
        if (lastMsg.classList.contains("typing-status")) {
          const originalText = lastMsg.dataset.originalText || "Нет сообщений";
          lastMsg.textContent = originalText;
          lastMsg.classList.remove("typing-status");
        }
      }
    }
  }
  if (chatId === activeChatId) {
    if (isTyping) {
      if (!currentChatStatus.classList.contains("typing-status")) {
        currentChatStatus.dataset.originalText = currentChatStatus.textContent;
        currentChatStatus.textContent = "Печатает...";
        currentChatStatus.classList.add("typing-status");
      }
    } else {
      if (currentChatStatus.classList.contains("typing-status")) {
        const originalStatus = currentChatStatus.dataset.originalText || "";
        currentChatStatus.textContent = originalStatus;
        currentChatStatus.classList.remove("typing-status");
      }
    }
  }
}

let typingTimer = null;
let isCurrentlyTyping = false;

// === Состояние поиска по сообщениям ===
let chatSearchMatches = [];
let chatSearchIndex = 0;
const CHAT_SEARCH_STATES = {
  IDLE: "idle",
  EMPTY: "empty",
  RESULTS: "results",
};
let chatSearchState = CHAT_SEARCH_STATES.IDLE;

function clearChatSearchHighlights() {
  if (!chatMessages) return;
  chatMessages
    .querySelectorAll(".message.search-match, .message.search-match-current")
    .forEach((msg) => {
      msg.classList.remove("search-match", "search-match-current");
    });
}

function applyChatSearchHighlight() {
  clearChatSearchHighlights();
  if (!chatSearchMatches.length) return;
  chatSearchMatches.forEach((el, idx) => {
    const bubble = el.closest(".message");
    if (!bubble) return;
    if (idx === chatSearchIndex) {
      bubble.classList.add("search-match-current");
      bubble.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      bubble.classList.add("search-match");
    }
  });
}

function updateChatSearchSummary() {
  if (chatSearchCount) {
    if (!chatSearchMatches.length) {
      chatSearchCount.textContent = "";
    } else {
      chatSearchCount.textContent = `Найдено ${chatSearchIndex + 1} из ${chatSearchMatches.length}`;
    }
  }

}

function renderMessageSearchResults() {
  if (!messageSearchResultsList) return;
  
  messageSearchResultsList.innerHTML = "";
  
  if (!chatSearchMatches || chatSearchMatches.length === 0) {
    if (messageSearchResultsEmpty) {
      messageSearchResultsEmpty.classList.remove("hidden");
    }
    return;
  }
  
  if (messageSearchResultsEmpty) {
    messageSearchResultsEmpty.classList.add("hidden");
  }
  
  chatSearchMatches.forEach((contentEl, index) => {
    const messageEl = contentEl.closest(".message");
    if (!messageEl) return;
    
    const messageRow = messageEl.closest(".message-row");
    if (!messageRow) return;
    
    const messageId = messageEl.dataset.messageId;
    const messageText = contentEl.textContent || "";
    const previewText = messageText.length > 50 
      ? messageText.substring(0, 50) + "..." 
      : messageText;
    
    const timestamp = messageEl.dataset.timestamp;
    const timeStr = timestamp ? formatTime(timestamp) : "";
    
    const isMine = messageRow.classList.contains("outgoing");
    const groupSenderName = messageRow.querySelector(".group-message-sender-name")?.textContent;
    const isGroupRow = messageRow.classList.contains("group-message-row") || Boolean(groupSenderName);

    const senderName = isMine
      ? currentUserDisplayName
      : (groupSenderName || currentChatTitle?.textContent || "Собеседник");

    // Аватар автора: для групп берем из сообщения, для личных — из хедера чата
    let avatarSrc = "/images/юзер.svg";
    if (isMine) {
      avatarSrc = currentUserAvatarUrl || "/images/юзер.svg";
    } else if (isGroupRow) {
      avatarSrc =
        messageRow.querySelector(".group-message-avatar img")?.src || "/images/юзер.svg";
    } else if (currentChatAvatar?.src) {
      avatarSrc = currentChatAvatar.src;
    }
    
    const item = document.createElement("div");
    item.className = "message-search-result";
    if (index === chatSearchIndex) {
      item.classList.add("active");
    }
    item.innerHTML = `
      <div class="message-search-result-avatar">
        <img src="${avatarSrc}" alt="${senderName}" />
      </div>
      <div class="message-search-result-details">
        <div class="message-search-result-label">${senderName}${timeStr ? ` · ${timeStr}` : ""}</div>
        <div class="message-search-result-snippet">${previewText}</div>
      </div>
    `;
    
    item.addEventListener("click", () => {
      chatSearchIndex = index;
      applyChatSearchHighlight();
      updateChatSearchSummary();
    });
    
    messageSearchResultsList.appendChild(item);
  });
}

function setChatSearchState(state) {
  chatSearchState = state;
  if (chatSearchBar) {
    chatSearchBar.dataset.state = state;
  }
  if (chatSearchIcon) {
    chatSearchIcon.src =
      state === CHAT_SEARCH_STATES.EMPTY ? "/images/search-01-red.svg" : "/images/search-01.svg";
  }
  if (chatSearchClearIcon) {
    chatSearchClearIcon.src =
      state === CHAT_SEARCH_STATES.EMPTY ? "/images/x-02-red.svg" : "/images/x-02-blue.svg";
  }
  if (chatSearchEmptyLabel) {
    chatSearchEmptyLabel.setAttribute(
      "aria-hidden",
      state === CHAT_SEARCH_STATES.EMPTY ? "false" : "true"
    );
  }
}

setChatSearchState(CHAT_SEARCH_STATES.IDLE);

function toggleMessageSearchResultsPanel(active) {
  if (chatListScroll) {
    chatListScroll.classList.toggle("hidden", active);
  }
  if (messageSearchResults) {
    messageSearchResults.classList.toggle("hidden", !active);
  }
}

function renderMessageLegacy(msg, doScroll = true) {
  if (!msg || !msg._id) return;
  
  // Проверяем, что сообщение еще не отображено
  // Но также проверяем, что оно действительно есть в DOM (на случай если DOM был очищен)
  if (renderedMessageIds.has(msg._id)) {
    // Проверяем, действительно ли сообщение есть в DOM
    const existingMessage = document.querySelector(`.message[data-message-id="${msg._id}"]`);
    if (existingMessage) {
      // Сообщение уже отображено, пропускаем
      return;
    } else {
      // Сообщение было в Set, но не в DOM (возможно, DOM был очищен)
      // Удаляем из Set и продолжаем рендеринг
      console.warn("[renderMessageLegacy] Сообщение было в Set, но отсутствует в DOM, перерисовываем:", msg._id);
      renderedMessageIds.delete(msg._id);
    }
  }
  
  // Проверяем, что chatMessages существует
  if (!chatMessages) {
    console.warn("[renderMessageLegacy] chatMessages не найден, откладываем рендеринг:", msg._id);
    // Не добавляем в Set, чтобы можно было попробовать снова позже
    return;
  }
  
  renderedMessageIds.add(msg._id);
  
  // Проверяем, является ли это системным сообщением
  const senderEmail = msg.sender_email || msg.sender_id;
  const isSystemMessage = msg.type === "system" || senderEmail === "system";
  
  if (isSystemMessage) {
    // Рендерим системное сообщение
    const row = document.createElement("div");
    row.classList.add("message-row", "system-message");
    row.dataset.messageId = msg._id;
    if (msg.timestamp) {
      row.dataset.timestamp = msg.timestamp;
    }
    
    const systemBubble = document.createElement("div");
    systemBubble.classList.add("system-message-content");
    
    // Если это сообщение об изменении аватара группы, показываем аватарку кружочком
    if (msg.system_action === "avatar_changed" && msg.new_avatar) {
      const avatarContainer = document.createElement("div");
      avatarContainer.style.display = "inline-flex";
      avatarContainer.style.alignItems = "center";
      avatarContainer.style.gap = "8px";
      
      const avatarImg = document.createElement("img");
      avatarImg.src = msg.new_avatar;
      avatarImg.alt = "Новый аватар группы";
      avatarImg.style.width = "24px";
      avatarImg.style.height = "24px";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.objectFit = "cover";
      avatarImg.style.border = "2px solid var(--color-primary)";
      avatarImg.onerror = function () {
        this.src = "/images/юзер.svg";
      };
      
      const textSpan = document.createElement("span");
      textSpan.textContent = msg.content || "";
      
      avatarContainer.appendChild(avatarImg);
      avatarContainer.appendChild(textSpan);
      systemBubble.appendChild(avatarContainer);
    } else {
      systemBubble.textContent = msg.content || "";
    }
    
    row.appendChild(systemBubble);
    
    // Проверяем наличие chatMessages перед добавлением
    if (!chatMessages) {
      console.warn("[renderMessageLegacy] chatMessages не найден для системного сообщения:", msg._id);
      // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
      renderedMessageIds.delete(msg._id);
      return;
    }
    
    // Проверяем, что сообщение действительно добавляется в DOM
    try {
      chatMessages.appendChild(row);
      // Проверяем, что элемент действительно добавлен
      const addedElement = chatMessages.querySelector(`.message-row[data-message-id="${msg._id}"]`);
      if (!addedElement) {
        console.warn("[renderMessageLegacy] Системное сообщение не было добавлено в DOM, удаляем из Set:", msg._id);
        renderedMessageIds.delete(msg._id);
      }
    } catch (error) {
      console.error("[renderMessageLegacy] Ошибка при добавлении системного сообщения в DOM:", error, msg._id);
      // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
      renderedMessageIds.delete(msg._id);
      return;
    }
    
    if (doScroll) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    }
    return;
  }
  
  const isMine =
    msg.sender_email === currentUserEmail || msg.sender_id === currentUserEmail;
  const row = document.createElement("div");
  row.classList.add("message-row", isMine ? "outgoing" : "incoming");
  const bubble = document.createElement("div");
  bubble.classList.add("message", isMine ? "outgoing" : "incoming");
  bubble.dataset.messageId = msg._id;
  if (msg.timestamp) {
    bubble.dataset.timestamp = msg.timestamp;
  }

  // Цитируемый блок, если есть ответ
  if (msg.reply_to && (msg.reply_to.content || msg.reply_to.filename)) {
    const replyBox = document.createElement("div");
    replyBox.style.borderLeft = "3px solid var(--color-primary)";
    replyBox.style.paddingLeft = "8px";
    replyBox.style.marginBottom = "6px";
    replyBox.style.fontSize = "14px";
    replyBox.style.color = "var(--color-text-inactive)";
    const author = document.createElement("div");
    author.style.color = "var(--color-primary)";
    author.style.fontWeight = "600";
    author.textContent =
      msg.reply_to.sender_id === currentUserEmail
        ? "Вы"
        : msg.reply_to.sender_id || "Собеседник";
    const snippet = document.createElement("div");
    snippet.textContent = msg.reply_to.content || msg.reply_to.filename || "";
    replyBox.appendChild(author);
    replyBox.appendChild(snippet);
    bubble.appendChild(replyBox);
  }

  // Контент сообщения
  if (msg.type === "audio" && msg.file_url) {
    const audioBar = document.createElement("div");
    audioBar.classList.add("audio-bar");
    audioBar.dataset.audioUrl = msg.file_url;
    audioBar.dataset.messageId = msg._id;
    
    const playButton = document.createElement("button");
    playButton.classList.add("audio-play-button");
    playButton.type = "button";
    playButton.setAttribute("aria-label", "Воспроизвести голосовое сообщение");
    
    const playIcon = document.createElement("img");
    playIcon.src = "/images/voice-play.svg";
    playIcon.alt = "Play";
    playIcon.classList.add("audio-play-icon");
    playButton.appendChild(playIcon);
    
    const pauseIcon = document.createElement("img");
    pauseIcon.src = "/images/voice-pause.svg";
    pauseIcon.alt = "Pause";
    pauseIcon.classList.add("audio-pause-icon");
    pauseIcon.style.display = "none";
    playButton.appendChild(pauseIcon);
    
    const waveformContainer = document.createElement("div");
    waveformContainer.classList.add("audio-waveform-container");
    
    const waveform = document.createElement("div");
    waveform.classList.add("audio-waveform");
    
    const barHeights = [5, 8, 10, 12, 14, 16, 18, 22, 26];
    const barCount = 60;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("div");
      bar.classList.add("audio-wave-bar");
      const height = barHeights[Math.floor(Math.random() * barHeights.length)];
      bar.style.height = `${height}px`;
      waveform.appendChild(bar);
    }
    
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("audio-time-container");
    
    const duration = msg.duration || msg.audio_duration || 0;
    const timeDisplay = document.createElement("div");
    timeDisplay.classList.add("audio-time-display");
    timeDisplay.textContent = formatAudioDuration(duration);
    
    timeContainer.appendChild(timeDisplay);
    
    waveformContainer.appendChild(waveform);
    waveformContainer.appendChild(timeContainer);
    
    const progressBar = document.createElement("div");
    progressBar.classList.add("audio-progress-bar");
    
    // Время отправки и галочки переносим внутрь синего бара, рядом с длительностью
    const sentTime = document.createElement("span");
    sentTime.classList.add("audio-sent-time");
    sentTime.textContent = formatTime(msg.timestamp);
    timeContainer.appendChild(sentTime);
    
    if (isMine) {
      const ticks = document.createElement("span");
      ticks.classList.add("audio-ticks");
      const hasBeenRead = (msg.read_by || []).some(
        (email) => email !== currentUserEmail
      );
      if (hasBeenRead) {
        ticks.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
        ticks.classList.add("read");
      } else {
        ticks.innerHTML = `<img src="/images/no_read.svg" alt="Отправлено">`;
        ticks.classList.add("sent");
      }
      timeContainer.appendChild(ticks);
    }
    
    audioBar.appendChild(playButton);
    audioBar.appendChild(waveformContainer);
    audioBar.appendChild(progressBar);
    
    let audioElement = null;
    let isPlaying = false;
    
    const stopCurrentAudio = () => {
      if (currentPlayingAudio.element && currentPlayingAudio.element !== audioElement) {
        currentPlayingAudio.element.pause();
        currentPlayingAudio.element.currentTime = 0;
        if (currentPlayingAudio.audioBar) {
          const prevPlayIcon = currentPlayingAudio.audioBar.querySelector(".audio-play-icon");
          const prevPauseIcon = currentPlayingAudio.audioBar.querySelector(".audio-pause-icon");
          const prevProgressBar = currentPlayingAudio.audioBar.querySelector(".audio-progress-bar");
          if (prevPlayIcon) prevPlayIcon.style.display = "block";
          if (prevPauseIcon) prevPauseIcon.style.display = "none";
          if (prevProgressBar) prevProgressBar.style.width = "0%";
          currentPlayingAudio.audioBar.classList.remove("playing");
          const prevBars = currentPlayingAudio.audioBar.querySelectorAll(".audio-wave-bar");
          prevBars.forEach((bar) => bar.classList.remove("played"));
        }
      }
    };
    
    const togglePlayPause = () => {
      if (!audioElement) {
        audioElement = new Audio(msg.file_url);
        audioElement.preload = "auto";
        
        audioElement.addEventListener("timeupdate", () => {
          if (audioElement) {
            const current = audioElement.currentTime;
            const total = audioElement.duration || duration;
            const progress = total > 0 ? (current / total) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = formatAudioDuration(current);
            
            if (isPlaying) {
              const bars = waveform.querySelectorAll(".audio-wave-bar");
              const totalBars = bars.length;
              bars.forEach((bar, index) => {
                const barProgress = (index / totalBars) * 100;
                if (barProgress <= progress) {
                  bar.classList.add("played");
                } else {
                  bar.classList.remove("played");
                }
              });
            }
          }
        });
        
        audioElement.addEventListener("ended", () => {
          isPlaying = false;
          audioBar.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
          progressBar.style.width = "0%";
          const total = audioElement.duration || duration;
          timeDisplay.textContent = formatAudioDuration(total);
          
          const bars = waveform.querySelectorAll(".audio-wave-bar");
          bars.forEach((bar) => bar.classList.remove("played"));
          
          if (currentPlayingAudio.element === audioElement) {
            currentPlayingAudio.element = null;
            currentPlayingAudio.audioBar = null;
            currentPlayingAudio.messageId = null;
          }
          
          const allMessages = Array.from(chatMessages.querySelectorAll(".message-row"));
          const currentMessageRow = bubble.closest(".message-row");
          const currentIndex = allMessages.indexOf(currentMessageRow);
          
          if (currentIndex !== -1 && currentIndex < allMessages.length - 1) {
            for (let i = currentIndex + 1; i < allMessages.length; i++) {
              const nextRow = allMessages[i];
              const nextAudioBar = nextRow.querySelector(".audio-bar");
              if (nextAudioBar) {
                const nextPlayButton = nextAudioBar.querySelector(".audio-play-button");
                if (nextPlayButton) {
                  setTimeout(() => nextPlayButton.click(), 300);
                  break;
                }
              }
            }
          }
        });
        
        audioElement.addEventListener("loadedmetadata", () => {
          if (audioElement.duration && !isPlaying) {
            timeDisplay.textContent = formatAudioDuration(audioElement.duration);
          }
        });
      }
      
      if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
        audioBar.classList.remove("playing");
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        const total = audioElement.duration || duration;
        timeDisplay.textContent = formatAudioDuration(total);
        if (currentPlayingAudio.element === audioElement) {
          currentPlayingAudio.element = null;
          currentPlayingAudio.audioBar = null;
          currentPlayingAudio.messageId = null;
        }
      } else {
        stopCurrentAudio();
        audioElement.play().catch((err) => console.error("Ошибка воспроизведения аудио:", err));
        isPlaying = true;
        audioBar.classList.add("playing");
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        currentPlayingAudio.element = audioElement;
        currentPlayingAudio.audioBar = audioBar;
        currentPlayingAudio.messageId = msg._id;
      }
    };
    
    playButton.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayPause();
    });
    
    waveform.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!audioElement) {
        togglePlayPause();
        return;
      }
      
      const rect = waveform.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const waveformWidth = rect.width;
      const clickPercent = Math.max(0, Math.min(1, clickX / waveformWidth));
      const audioDuration = audioElement.duration || duration;
      
      if (audioDuration > 0) {
        const targetTime = clickPercent * audioDuration;
        audioElement.currentTime = targetTime;
        const progress = clickPercent * 100;
        progressBar.style.width = `${progress}%`;
        timeDisplay.textContent = formatAudioDuration(targetTime);
        
        const bars = waveform.querySelectorAll(".audio-wave-bar");
        const totalBars = bars.length;
        bars.forEach((bar, index) => {
          const barProgress = (index / totalBars) * 100;
          if (barProgress <= progress) {
            bar.classList.add("played");
          } else {
            bar.classList.remove("played");
          }
        });
        
        if (!isPlaying && audioElement.paused) {
          audioElement.play().catch((err) => console.error("Ошибка воспроизведения аудио:", err));
          isPlaying = true;
          audioBar.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
          currentPlayingAudio.element = audioElement;
          currentPlayingAudio.audioBar = audioBar;
          currentPlayingAudio.messageId = msg._id;
        }
      }
    });
    
    bubble.appendChild(audioBar);
    bubble.classList.add("has-audio");
  } else if (msg.type === "image" && msg.file_url) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("message-image-container");
    const img = document.createElement("img");
    img.src = msg.file_url;
    img.classList.add("message-image");
    img.alt = msg.filename || "Изображение";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "10000";
      modal.style.cursor = "pointer";

      const fullImg = document.createElement("img");
      fullImg.src = msg.file_url;
      fullImg.style.maxWidth = "90%";
      fullImg.style.maxHeight = "90%";
      fullImg.style.objectFit = "contain";

      modal.appendChild(fullImg);
      document.body.appendChild(modal);

      modal.addEventListener("click", () => {
        document.body.removeChild(modal);
      });
    });

    imageContainer.appendChild(img);

    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      imageContainer.appendChild(textContent);
    }

    bubble.appendChild(imageContainer);
    // bubble.classList.add("has-link"); // ИСПРАВЛЕНО: убрал ненужный класс
  } else if (msg.type === "video" && msg.file_url) {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("message-video-container");
    const video = document.createElement("video");
    video.src = msg.file_url;
    video.controls = true;
    video.classList.add("message-video");
    video.style.maxWidth = "100%";
    video.style.height = "auto";
    video.style.borderRadius = "10px";
    video.style.display = "block";

    videoContainer.appendChild(video);

    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      videoContainer.appendChild(textContent);
    }

    bubble.appendChild(videoContainer);
    // bubble.classList.add("has-link"); // ИСПРАВЛЕНО: убрал ненужный класс
  } else if (msg.type === "file" && msg.file_url) {
    const fileContainer = document.createElement("div");
    fileContainer.classList.add("message-file-container");
    fileContainer.style.display = "flex";
    fileContainer.style.alignItems = "center";
    fileContainer.style.gap = "12px";
    fileContainer.style.padding = "8px";
    fileContainer.style.backgroundColor = "var(--color-background-2)";
    fileContainer.style.borderRadius = "8px";
    fileContainer.style.cursor = "pointer";

    const fileIcon = document.createElement("div");
    fileIcon.style.width = "40px";
    fileIcon.style.height = "40px";
    fileIcon.style.display = "flex";
    fileIcon.style.alignItems = "center";
    fileIcon.style.justifyContent = "center";
    fileIcon.style.backgroundColor = "var(--color-primary)";
    fileIcon.style.borderRadius = "8px";
    fileIcon.innerHTML = "📎";
    fileIcon.style.fontSize = "20px";

    const fileInfo = document.createElement("div");
    fileInfo.style.flex = "1";
    fileInfo.style.minWidth = "0";

    const fileName = document.createElement("div");
    fileName.style.fontWeight = "600";
    fileName.style.fontSize = "14px";
    fileName.style.color = "var(--color-text-dark)";
    fileName.style.whiteSpace = "nowrap";
    fileName.style.overflow = "hidden";
    fileName.style.textOverflow = "ellipsis";
    fileName.textContent = msg.filename || "Файл";
    fileName.dataset.filename = msg.filename || "Файл";

    const fileLink = document.createElement("a");
    fileLink.href = msg.file_url;
    fileLink.download = msg.filename || "file";
    fileLink.style.textDecoration = "none";
    fileLink.style.color = "var(--color-primary)";
    fileLink.style.fontSize = "12px";
    fileLink.textContent = "Скачать";

    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileLink);

    fileContainer.appendChild(fileIcon);
    fileContainer.appendChild(fileInfo);

    fileContainer.addEventListener("click", () => {
      window.open(msg.file_url, "_blank");
    });

    bubble.appendChild(fileContainer);

    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      bubble.appendChild(textContent);
    }
  } else {
    const rawText = msg.content || "";
    const isFromBot =
      (msg.sender_id && msg.sender_id.startsWith("bot_")) ||
      (msg.sender_email && msg.sender_email.startsWith("bot_"));
    const hasCodeFence = rawText.includes("```");

    if (isFromBot && hasCodeFence) {
      const segments = rawText.split("```");
      const beforeText = (segments[0] || "").trim();
      const codeBlockRaw = segments[1] || "";
      let codeText = codeBlockRaw;
      const firstNewline = codeBlockRaw.indexOf("\n");
      if (firstNewline !== -1) {
        codeText = codeBlockRaw.slice(firstNewline + 1);
      }
      codeText = codeText.replace(/```+$/g, "").trim();

      if (beforeText) {
        const beforeDiv = document.createElement("div");
        beforeDiv.classList.add("message-content");
        beforeDiv.textContent = beforeText;
        bubble.appendChild(beforeDiv);
      }

      const codeWrapper = document.createElement("div");
      codeWrapper.classList.add("message-code-block");

      const codeHeader = document.createElement("div");
      codeHeader.classList.add("message-code-header");
      const codeLabel = document.createElement("span");
      codeLabel.textContent = "Код";
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.classList.add("message-code-copy-btn");
      copyBtn.textContent = "Копировать";

      codeHeader.appendChild(codeLabel);
      codeHeader.appendChild(copyBtn);

      const pre = document.createElement("pre");
      pre.classList.add("message-code-pre");
      const codeEl = document.createElement("code");
      codeEl.textContent = codeText;
      pre.appendChild(codeEl);

      codeWrapper.appendChild(codeHeader);
      codeWrapper.appendChild(pre);
      bubble.appendChild(codeWrapper);

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.textContent = "Скопировано";
          setTimeout(() => {
            copyBtn.textContent = "Копировать";
          }, 1500);
        } catch (e) {
          console.error("Не удалось скопировать код:", e);
        }
      });
    } else {
      const content = document.createElement("div");
      content.classList.add("message-content");
      
      const text = rawText;
      const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
      const urlTestPattern = /^https?:\/\//i;
      
      // ИСПРАВЛЕНИЕ: Используем match, чтобы избежать проблемы с состоянием .test()
      const matches = text.match(urlPattern);

      if (matches && matches.length > 0) {
        const parts = text.split(urlPattern);
        parts.forEach(part => {
          if (part && urlTestPattern.test(part)) {
            const linkWrapper = document.createElement("div");
            linkWrapper.classList.add("message-link-wrapper");
            
            const linkContainer = document.createElement("div");
            linkContainer.classList.add("message-link-container");
            
            const linkPreview = document.createElement("div");
            linkPreview.classList.add("message-link-preview");
            const previewImg = document.createElement("img");
            previewImg.alt = "";
            
            if (msg.link_preview) {
              previewImg.src = msg.link_preview;
              previewImg.style.display = "block";
            } else {
              previewImg.style.display = "none";
              fetch(`https://api.microlink.io/data?url=${encodeURIComponent(part)}`)
                .then(response => response.json())
                .then(data => {
                  if (data.data && data.data.image && data.data.image.url) {
                    previewImg.src = data.data.image.url;
                    previewImg.style.display = "block";
                  }
                });
            }
            
            previewImg.onerror = function() { this.style.display = "none"; };
            linkPreview.appendChild(previewImg);
            linkContainer.appendChild(linkPreview);
            
            const linkInfo = document.createElement("div");
            linkInfo.classList.add("message-link-info");
            
            try {
              const urlObj = new URL(part);
              const domain = urlObj.hostname.replace('www.', '');
              const linkTitle = document.createElement("div");
              linkTitle.classList.add("message-link-title");
              linkTitle.textContent = domain;
              linkInfo.appendChild(linkTitle);
            } catch {}
            
            const linkUrl = document.createElement("a");
            linkUrl.href = part;
            linkUrl.target = "_blank";
            linkUrl.rel = "noopener noreferrer";
            linkUrl.classList.add("message-link-url");
            linkUrl.textContent = part;
            linkInfo.appendChild(linkUrl);
            
            linkContainer.appendChild(linkInfo);
            
            linkContainer.style.cursor = "pointer";
            linkContainer.addEventListener("click", () => window.open(part, "_blank"));
            
            linkWrapper.appendChild(linkContainer);
            content.appendChild(linkWrapper);
            bubble.classList.add("has-link");
          } else if (part && part.trim()) {
            const textNode = document.createTextNode(part);
            content.appendChild(textNode);
          }
        });
      } else {
        content.textContent = text;
      }
      
      bubble.appendChild(content);
    }
  }
  
  if (msg.type !== "audio") {
    const meta = document.createElement("div");
    meta.classList.add("message-meta");
    const time = document.createElement("span");
    time.classList.add("message-timestamp");
    time.textContent = formatTime(msg.timestamp);
    meta.appendChild(time);
    if (msg.edited_at) {
      const edited = document.createElement("span");
      edited.style.fontSize = "11px";
      edited.style.color = "var(--color-text-inactive)";
      edited.textContent = "изменено";
      meta.appendChild(edited);
    }
    if (isMine) {
      const ticks = document.createElement("span");
      ticks.classList.add("message-ticks");
      const hasBeenRead = (msg.read_by || []).some(
        (email) => email !== currentUserEmail
      );
      if (hasBeenRead) {
        ticks.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
        ticks.classList.add("read");
      } else {
        ticks.innerHTML = `<img src="/images/no_read.svg" alt="Отправлено">`;
        ticks.classList.add("sent");
      }
      meta.appendChild(ticks);
    }
    bubble.appendChild(meta);
  }
  row.appendChild(bubble);
  
  // Проверяем наличие chatMessages перед добавлением
  if (!chatMessages) {
    console.warn("[renderMessageLegacy] chatMessages не найден, сообщение не отображено:", msg._id);
    // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
    renderedMessageIds.delete(msg._id);
    return;
  }
  
  // Проверяем, что сообщение действительно добавляется в DOM
  try {
    chatMessages.appendChild(row);
    // Проверяем, что элемент действительно добавлен
    const addedElement = chatMessages.querySelector(`.message-row .message[data-message-id="${msg._id}"]`);
    if (!addedElement) {
      console.warn("[renderMessageLegacy] Сообщение не было добавлено в DOM, удаляем из Set:", msg._id);
      renderedMessageIds.delete(msg._id);
    }
  } catch (error) {
    console.error("[renderMessageLegacy] Ошибка при добавлении сообщения в DOM:", error, msg._id);
    // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
    renderedMessageIds.delete(msg._id);
    return;
  }

  if (doScroll) {
    // Для своих сообщений всегда прокручиваем
    scrollToBottom(true);
  }
}


function updateChatSearchResults(query) {
  if (!chatMessages) return;
  const q = (query || "").trim();

  if (!q) {
    chatSearchMatches = [];
    chatSearchIndex = 0;
    clearChatSearchHighlights();
    updateChatSearchSummary();
    setChatSearchState(CHAT_SEARCH_STATES.IDLE);
    toggleMessageSearchResultsPanel(false);
    renderMessageSearchResults();
    return;
  }

  const lower = q.toLowerCase();
  const contents = chatMessages.querySelectorAll(".message .message-content");
  chatSearchMatches = [];

  contents.forEach((el) => {
    const text = (el.textContent || "").toLowerCase();
    if (text.includes(lower)) {
      chatSearchMatches.push(el);
    }
  });

  toggleMessageSearchResultsPanel(true);
  renderMessageSearchResults();

  if (!chatSearchMatches.length) {
    clearChatSearchHighlights();
    updateChatSearchSummary();
    if (chatSearchClearBtn) chatSearchClearBtn.classList.remove("hidden");
    setChatSearchState(CHAT_SEARCH_STATES.EMPTY);
    return;
  }

  chatSearchIndex = 0;
  applyChatSearchHighlight();

  updateChatSearchSummary();
  if (chatSearchClearBtn) chatSearchClearBtn.classList.remove("hidden");
  setChatSearchState(CHAT_SEARCH_STATES.RESULTS);
}

function moveChatSearchNext() {
  if (!chatSearchMatches.length) return;
  chatSearchIndex = (chatSearchIndex + 1) % chatSearchMatches.length;
  applyChatSearchHighlight();
  updateChatSearchSummary();
}

function moveChatSearchPrev() {
  if (!chatSearchMatches.length) return;
  chatSearchIndex =
    (chatSearchIndex - 1 + chatSearchMatches.length) % chatSearchMatches.length;
  applyChatSearchHighlight();
  updateChatSearchSummary();
}

function openChatSearch() {
  if (!chatSearchWrapper) return;
  chatSearchWrapper.classList.remove("hidden");
  if (chatSearchBtn) {
    const img = chatSearchBtn.querySelector("img");
    if (img) img.src = "/images/search-01.svg";
  }
  if (chatSearchInput) {
    chatSearchInput.focus();
    if (chatSearchClearBtn) chatSearchClearBtn.classList.remove("hidden");
    updateChatSearchResults(chatSearchInput.value || "");
  }
}

function closeChatSearch() {
  if (!chatSearchWrapper) return;
  chatSearchWrapper.classList.add("hidden");
  if (chatSearchInput) chatSearchInput.value = "";
  if (chatSearchCount) chatSearchCount.textContent = "";
  setChatSearchState(CHAT_SEARCH_STATES.IDLE);
  if (chatSearchClearBtn) chatSearchClearBtn.classList.add("hidden");
  chatSearchMatches = [];
  chatSearchIndex = 0;
  clearChatSearchHighlights();
  toggleMessageSearchResultsPanel(false);
  renderMessageSearchResults();

  // возвращаем иконку в хедере на обычную
  if (chatSearchBtn) {
    const img = chatSearchBtn.querySelector("img");
    if (img) img.src = "/images/лупа.svg";
  }
}

// Для групповых чатов: убедиться, что первая входящая в серии несет аватар + ник
function ensureGroupHeader(row) {
  if (!row || row.classList.contains("outgoing")) return;
  const senderId = row.dataset.senderId;
  if (!senderId) return;
  const bubble = row.querySelector(".message");
  if (!bubble) return;
  const hasName = bubble.querySelector(".group-message-sender-name");
  const hasAvatar = row.querySelector(".group-message-avatar");
  if (hasName && hasAvatar) return;

  let displayName = senderId;
  try {
    const contactsMap = window.CONTACTS_BY_EMAIL || {};
    if (contactsMap[senderId]) {
      const c = contactsMap[senderId];
      displayName =
        c.contact_name ||
        c.display_name ||
        c.full_name ||
        c.username ||
        displayName;
    }
  } catch (e) {}

  // Добавляем аватар слева, если его нет
  if (!hasAvatar) {
    const senderAvatar = document.createElement("div");
    senderAvatar.className = "group-message-avatar";
    const avatarImg = document.createElement("img");
    avatarImg.src = "/images/юзер.svg";
    avatarImg.alt = displayName;
    avatarImg.onerror = function () {
      this.src = "/images/юзер.svg";
    };
    avatarImg.style.cursor = "pointer";
    avatarImg.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof window.openProfileModal === "function") {
        window.openProfileModal(senderId);
      }
    });
    senderAvatar.appendChild(avatarImg);
    row.insertBefore(senderAvatar, bubble);
  }

  // Добавляем ник в начале пузыря, если его нет
  if (!hasName) {
    const senderNameEl = document.createElement("div");
    senderNameEl.className = "group-message-sender-name";
    senderNameEl.textContent = displayName;
    senderNameEl.style.cursor = "pointer";
    senderNameEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof window.openProfileModal === "function") {
        window.openProfileModal(senderId);
      }
    });
    bubble.prepend(senderNameEl);
  }
}

function sendTypingEvent() {
  // ... (без изменений) ...
  if (ws && activeChatId && !isCurrentlyTyping) {
    ws.send(JSON.stringify({ type: "typing", chat_id: activeChatId }));
    isCurrentlyTyping = true;
  }
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    if (ws && activeChatId) {
      ws.send(
        JSON.stringify({ type: "stopped_typing", chat_id: activeChatId })
      );
      isCurrentlyTyping = false;
    }
  }, 2000);
}

// ===================================
// === НОВАЯ ФУНКЦИЯ: Обновление статуса ===
// ===================================
function updateUserStatus(userEmail, isOnline, lastSeen) {
  // 1. Обновляем список чатов
  // Находим кнопку чата по email'у собеседника
  const btn = document.querySelector(
    `.chat-list-item-btn[data-interlocutor-email="${userEmail}"]`
  );
  if (btn) {
    let dot = btn.querySelector(".online-status-dot");
    const avatar = btn.querySelector("img"); // Найти аватар

    // Проверяем, можно ли видеть статус онлайн
    // Если lastSeen равен null или пустой строке, значит статус скрыт настройками конфиденциальности
    const canSeeStatus = lastSeen !== null && lastSeen !== undefined && lastSeen !== "";

    if (isOnline && canSeeStatus) {
      if (!dot && avatar) {
        // Создаем, только если нет
        dot = document.createElement("div");
        dot.className = "online-status-dot";
        // Вставляем ПОСЛЕ аватара, как в HTML
        avatar.insertAdjacentElement("afterend", dot);
      }
    } else {
      if (dot) {
        // Удаляем, если есть
        dot.remove();
      }
    }
    // Обновляем data-атрибуты, чтобы loadChat их использовал
    btn.dataset.isOnline = (isOnline && canSeeStatus) ? "true" : "false";
    btn.dataset.lastSeen = lastSeen || "";
  }

  // 2. Обновляем хедер, ЕСЛИ ЭТОТ ЧАТ АКТИВЕН
  if (activeChatId && btn && btn.dataset.chatId === activeChatId && currentChatStatus) {
    // Не обновляем, если он "Печатает..."
    if (!currentChatStatus.classList.contains("typing-status")) {
      const statusText = formatLastSeen(lastSeen, isOnline);
      if (statusText) {
        currentChatStatus.textContent = statusText;
        currentChatStatus.dataset.originalText = statusText; // Сохраняем для 'typing'
        currentChatStatus.style.display = "block";
      } else {
        currentChatStatus.textContent = "";
        currentChatStatus.dataset.originalText = "";
        currentChatStatus.style.display = "none";
      }
    } else {
      // Если он печатал, но ушел в оффлайн, надо убрать "Печатает..."
      if (!isOnline) {
        const statusText = formatLastSeen(lastSeen, false);
        if (statusText) {
          currentChatStatus.textContent = statusText;
          currentChatStatus.dataset.originalText = statusText;
          currentChatStatus.style.display = "block";
        } else {
          currentChatStatus.textContent = "";
          currentChatStatus.dataset.originalText = "";
          currentChatStatus.style.display = "none";
        }
        currentChatStatus.classList.remove("typing-status");
      }
      // Если он печатает и пришел "online", ничего не делаем, "Печатает" важнее
    }
  }
}

// ===========================
// === Рендер сообщений (ОБНОВЛЕН) ===
// ===========================

// === Добавлен параметр doScroll ===
function renderMessage(msg, doScroll = true, isGroupChat = false) {
  // ... (без изменений) ...
  if (!msg) {
    console.warn("[renderMessage] Пустое сообщение пропущено");
    return;
  }
  
  // Если нет _id, создаем временный
  if (!msg._id) {
    console.warn("[renderMessage] Сообщение без _id, создаем временный:", msg);
    msg._id = `temp_${Date.now()}_${Math.random()}`;
  }
  
  // Проверяем, что сообщение еще не отображено
  // Но также проверяем, что оно действительно есть в DOM (на случай если DOM был очищен)
  if (renderedMessageIds.has(msg._id)) {
    // Проверяем, действительно ли сообщение есть в DOM
    const existingMessage = document.querySelector(`.message[data-message-id="${msg._id}"]`);
    if (existingMessage) {
      // Сообщение уже отображено, пропускаем
      return;
    } else {
      // Сообщение было в Set, но не в DOM (возможно, DOM был очищен)
      // Удаляем из Set и продолжаем рендеринг
      console.warn("[renderMessage] Сообщение было в Set, но отсутствует в DOM, перерисовываем:", msg._id);
      renderedMessageIds.delete(msg._id);
    }
  }
  
  // Проверяем, что chatMessages существует
  if (!chatMessages) {
    console.warn("[renderMessage] chatMessages не найден, откладываем рендеринг:", msg._id);
    // Не добавляем в Set, чтобы можно было попробовать снова позже
    return;
  }
  
  renderedMessageIds.add(msg._id);
  const senderEmail =
    msg.sender_id || msg.sender_email || msg.senderId || msg.sender;
  
  // Проверяем, является ли это системным сообщением
  const isSystemMessage = msg.type === "system" || senderEmail === "system";
  
  if (isSystemMessage) {
    // Рендерим системное сообщение
    const row = document.createElement("div");
    row.classList.add("message-row", "system-message");
    row.dataset.messageId = msg._id;
    if (msg.timestamp) {
      row.dataset.timestamp = msg.timestamp;
    }
    
    const systemBubble = document.createElement("div");
    systemBubble.classList.add("system-message-content");
    
    // Если это сообщение об изменении аватара группы, показываем аватарку кружочком
    if (msg.system_action === "avatar_changed" && msg.new_avatar) {
      const avatarContainer = document.createElement("div");
      avatarContainer.style.display = "inline-flex";
      avatarContainer.style.alignItems = "center";
      avatarContainer.style.gap = "8px";
      
      const avatarImg = document.createElement("img");
      avatarImg.src = msg.new_avatar;
      avatarImg.alt = "Новый аватар группы";
      avatarImg.style.width = "24px";
      avatarImg.style.height = "24px";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.objectFit = "cover";
      avatarImg.style.border = "2px solid var(--color-primary)";
      avatarImg.onerror = function () {
        this.src = "/images/юзер.svg";
      };
      
      const textSpan = document.createElement("span");
      textSpan.textContent = msg.content || "";
      
      avatarContainer.appendChild(avatarImg);
      avatarContainer.appendChild(textSpan);
      systemBubble.appendChild(avatarContainer);
    } else {
      systemBubble.textContent = msg.content || "";
    }
    
    row.appendChild(systemBubble);
    
    // Проверяем наличие chatMessages перед добавлением
    if (!chatMessages) {
      console.warn("[renderMessage] chatMessages не найден для системного сообщения:", msg._id);
      // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
      renderedMessageIds.delete(msg._id);
      return;
    }
    
    // Проверяем, что сообщение действительно добавляется в DOM
    try {
      chatMessages.appendChild(row);
      // Проверяем, что элемент действительно добавлен
      const addedElement = chatMessages.querySelector(`.message-row[data-message-id="${msg._id}"]`);
      if (!addedElement) {
        console.warn("[renderMessage] Системное сообщение не было добавлено в DOM, удаляем из Set:", msg._id);
        renderedMessageIds.delete(msg._id);
      }
    } catch (error) {
      console.error("[renderMessage] Ошибка при добавлении системного сообщения в DOM:", error, msg._id);
      // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
      renderedMessageIds.delete(msg._id);
      return;
    }
    
    if (doScroll) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    }
    return;
  }
  
  const isMine = senderEmail === currentUserEmail;
  const row = document.createElement("div");
  row.classList.add("message-row", isMine ? "outgoing" : "incoming");
  if (senderEmail) {
    row.dataset.senderId = senderEmail;
  }
  if (isGroupChat) {
    row.classList.add("group-message-row");
  }
  const bubble = document.createElement("div");
  bubble.classList.add("message", isMine ? "outgoing" : "incoming");
  bubble.dataset.messageId = msg._id;
  if (msg.timestamp) {
    bubble.dataset.timestamp = msg.timestamp;
  }
  
  // Для групповых чатов: ник/аватар внутри пузыря, сверху.
  // Инфо не повторяется, если подряд сообщения от того же отправителя.
  if (isGroupChat && !isMine && (msg.sender_name || msg.sender_avatar || senderEmail)) {
    let shouldShowSenderInfo = true;
    if (chatMessages && senderEmail) {
      const lastRow = chatMessages.querySelector(".message-row:last-child");
      if (
        lastRow &&
        lastRow.dataset.senderId === senderEmail &&
        !lastRow.classList.contains("outgoing")
      ) {
        shouldShowSenderInfo = false;
      }
    }

    if (shouldShowSenderInfo) {
      // Отображаем аватар слева от пузыря (как было раньше)
      const senderAvatar = document.createElement("div");
      senderAvatar.className = "group-message-avatar";
      const avatarImg = document.createElement("img");
      avatarImg.src = msg.sender_avatar || "/images/юзер.svg";
      avatarImg.alt = msg.sender_name || senderEmail || "Участник";
      avatarImg.onerror = function () {
        this.src = "/images/юзер.svg";
      };
      avatarImg.style.cursor = "pointer";
      avatarImg.addEventListener("click", (e) => {
        e.stopPropagation();
        if (senderEmail && typeof window.openProfileModal === "function") {
          window.openProfileModal(senderEmail);
        }
      });
      senderAvatar.appendChild(avatarImg);
      row.appendChild(senderAvatar);

      // Ник сверху внутри белого пузыря
      let displayName =
        msg.sender_name || senderEmail || msg.sender_id || "Участник";
      try {
        const contactsMap = window.CONTACTS_BY_EMAIL || {};
        if (senderEmail && contactsMap[senderEmail]) {
          const c = contactsMap[senderEmail];
          displayName =
            c.contact_name ||
            c.display_name ||
            c.full_name ||
            c.username ||
            displayName;
        }
      } catch (e) {
        // не ломаем рендер, если что-то с картой контактов
      }

      const senderNameEl = document.createElement("div");
      senderNameEl.className = "group-message-sender-name";
      senderNameEl.textContent = displayName;
      senderNameEl.style.cursor = "pointer";
      senderNameEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (senderEmail && typeof window.openProfileModal === "function") {
          window.openProfileModal(senderEmail);
        }
      });

      // Вставляем имя в начало содержимого пузыря, чтобы оно было над текстом
      bubble.prepend(senderNameEl);
    }
  }

  // Цитируемый блок, если есть ответ
  if (msg.reply_to && (msg.reply_to.content || msg.reply_to.filename)) {
    const replyBox = document.createElement("div");
    replyBox.style.borderLeft = "3px solid var(--color-primary)";
    replyBox.style.paddingLeft = "8px";
    replyBox.style.marginBottom = "6px";
    replyBox.style.fontSize = "14px";
    replyBox.style.color = "var(--color-text-inactive)";
    const author = document.createElement("div");
    author.style.color = "var(--color-primary)";
    author.style.fontWeight = "600";
    author.textContent =
      msg.reply_to.sender_id === currentUserEmail
        ? "Вы"
        : msg.reply_to.sender_id || "Собеседник";
    const snippet = document.createElement("div");
    snippet.textContent = msg.reply_to.content || msg.reply_to.filename || "";
    replyBox.appendChild(author);
    replyBox.appendChild(snippet);
    bubble.appendChild(replyBox);
  }

  // Контент сообщения
  if (msg.type === "audio" && msg.file_url) {
    // Полноценный UI для голосовых сообщений
    const audioBar = document.createElement("div");
    audioBar.classList.add("audio-bar");
    audioBar.dataset.audioUrl = msg.file_url;
    audioBar.dataset.messageId = msg._id;
    
    // Кнопка play/pause
    const playButton = document.createElement("button");
    playButton.classList.add("audio-play-button");
    playButton.type = "button";
    playButton.setAttribute("aria-label", "Воспроизвести голосовое сообщение");
    
    const playIcon = document.createElement("img");
    playIcon.src = "/images/voice-play.svg";
    playIcon.alt = "Play";
    playIcon.classList.add("audio-play-icon");
    playButton.appendChild(playIcon);
    
    const pauseIcon = document.createElement("img");
    pauseIcon.src = "/images/voice-pause.svg";
    pauseIcon.alt = "Pause";
    pauseIcon.classList.add("audio-pause-icon");
    pauseIcon.style.display = "none";
    playButton.appendChild(pauseIcon);
    
    // Контейнер для waveform и времени
    const waveformContainer = document.createElement("div");
    waveformContainer.classList.add("audio-waveform-container");
    
    // Waveform визуализация
    const waveform = document.createElement("div");
    waveform.classList.add("audio-waveform");
    
    // Генерируем бары согласно дизайну Figma (высоты: 5, 8, 10, 12, 14, 16, 18, 22, 26px)
    const barHeights = [5, 8, 10, 12, 14, 16, 18, 22, 26];
    const barCount = 60;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("div");
      bar.classList.add("audio-wave-bar");
      // Выбираем случайную высоту из доступных в дизайне
      const height = barHeights[Math.floor(Math.random() * barHeights.length)];
      bar.style.height = `${height}px`;
      waveform.appendChild(bar);
    }
    
    // Контейнер для времени (одно время - либо длительность, либо текущее)
    const timeContainer = document.createElement("div");
    timeContainer.classList.add("audio-time-container");
    
    // Одно время - показываем длительность по умолчанию, переключается на текущее при воспроизведении
    const duration = msg.duration || msg.audio_duration || 0;
    const timeDisplay = document.createElement("div");
    timeDisplay.classList.add("audio-time-display");
    timeDisplay.textContent = formatAudioDuration(duration);
    
    timeContainer.appendChild(timeDisplay);
    
    // Waveform сверху, время снизу (вертикальное расположение)
    waveformContainer.appendChild(waveform);
    waveformContainer.appendChild(timeContainer);
    
    // Полоса прогресса
    const progressBar = document.createElement("div");
    progressBar.classList.add("audio-progress-bar");
    
    // Белый бар внизу с галочками и временем отправки
    const metaBar = document.createElement("div");
    metaBar.classList.add("audio-meta-bar");
    
    const sentTime = document.createElement("span");
    sentTime.classList.add("audio-sent-time");
    sentTime.textContent = formatTime(msg.timestamp);
    metaBar.appendChild(sentTime);
    
    // Галочки для исходящих сообщений
    if (isMine) {
      const ticks = document.createElement("span");
      ticks.classList.add("audio-ticks");
      const hasBeenRead = (msg.read_by || []).some(
        (email) => email !== currentUserEmail
      );
      if (hasBeenRead) {
        ticks.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
        ticks.classList.add("read");
      } else {
        ticks.innerHTML = `<img src="/images/no_read.svg" alt="Отправлено">`;
        ticks.classList.add("sent");
      }
      metaBar.appendChild(ticks);
    }
    
    audioBar.appendChild(playButton);
    audioBar.appendChild(waveformContainer);
    audioBar.appendChild(progressBar);
    audioBar.appendChild(metaBar);
    
    // Обработчик клика для play/pause
    let audioElement = null;
    let isPlaying = false;
    
    // Функция для остановки текущего воспроизведения
    const stopCurrentAudio = () => {
      if (currentPlayingAudio.element && currentPlayingAudio.element !== audioElement) {
        currentPlayingAudio.element.pause();
        currentPlayingAudio.element.currentTime = 0;
        if (currentPlayingAudio.audioBar) {
          const prevPlayIcon = currentPlayingAudio.audioBar.querySelector(".audio-play-icon");
          const prevPauseIcon = currentPlayingAudio.audioBar.querySelector(".audio-pause-icon");
          const prevProgressBar = currentPlayingAudio.audioBar.querySelector(".audio-progress-bar");
          const prevTimeDisplay = currentPlayingAudio.audioBar.querySelector(".audio-time-display");
          const prevBars = currentPlayingAudio.audioBar.querySelectorAll(".audio-wave-bar");
          
          if (prevPlayIcon) prevPlayIcon.style.display = "block";
          if (prevPauseIcon) prevPauseIcon.style.display = "none";
          if (prevProgressBar) prevProgressBar.style.width = "0%";
          currentPlayingAudio.audioBar.classList.remove("playing");
          
          // Сброс выделения баров
          prevBars.forEach((bar) => {
            bar.classList.remove("played");
          });
        }
      }
    };
    
    // Функция для переключения play/pause
    const togglePlayPause = () => {
      if (!audioElement) {
        audioElement = new Audio(msg.file_url);
        audioElement.preload = "auto";
        
        // Обновление времени воспроизведения
        audioElement.addEventListener("timeupdate", () => {
          if (audioElement) {
            const current = audioElement.currentTime;
            const total = audioElement.duration || duration;
            const progress = total > 0 ? (current / total) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            // Показываем текущее время вместо длительности при воспроизведении
            timeDisplay.textContent = formatAudioDuration(current);
            
            // Выделяем бары синим по прогрессу (без анимации волн)
            if (isPlaying) {
              const bars = waveform.querySelectorAll(".audio-wave-bar");
              const totalBars = bars.length;
              bars.forEach((bar, index) => {
                // Определяем, должен ли этот бар быть синим на основе прогресса
                const barProgress = (index / totalBars) * 100;
                if (barProgress <= progress) {
                  bar.classList.add("played");
                } else {
                  bar.classList.remove("played");
                }
              });
            }
          }
        });
        
        // Когда аудио закончилось
        audioElement.addEventListener("ended", () => {
          isPlaying = false;
          audioBar.classList.remove("playing");
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
          progressBar.style.width = "0%";
          // Возвращаем отображение длительности
          const total = audioElement.duration || duration;
          timeDisplay.textContent = formatAudioDuration(total);
          
          // Сброс выделения баров
          const bars = waveform.querySelectorAll(".audio-wave-bar");
          bars.forEach((bar) => {
            bar.classList.remove("played");
          });
          
          // Очищаем текущее воспроизведение
          if (currentPlayingAudio.element === audioElement) {
            currentPlayingAudio.element = null;
            currentPlayingAudio.audioBar = null;
            currentPlayingAudio.messageId = null;
          }
          
          // Автоматически запускаем следующее аудио снизу
          const allMessages = Array.from(chatMessages.querySelectorAll(".message-row"));
          const currentMessageRow = bubble.closest(".message-row");
          const currentIndex = allMessages.indexOf(currentMessageRow);
          
          if (currentIndex !== -1 && currentIndex < allMessages.length - 1) {
            // Ищем следующее аудио сообщение
            for (let i = currentIndex + 1; i < allMessages.length; i++) {
              const nextRow = allMessages[i];
              const nextAudioBar = nextRow.querySelector(".audio-bar");
              if (nextAudioBar) {
                const nextPlayButton = nextAudioBar.querySelector(".audio-play-button");
                if (nextPlayButton) {
                  // Небольшая задержка перед запуском следующего
                  setTimeout(() => {
                    nextPlayButton.click();
                  }, 300);
                  break;
                }
              }
            }
          }
        });
        
        // Когда загружена длительность
        audioElement.addEventListener("loadedmetadata", () => {
          if (audioElement.duration && !isPlaying) {
            timeDisplay.textContent = formatAudioDuration(audioElement.duration);
          }
        });
      }
      
      if (isPlaying) {
        // Пауза
        audioElement.pause();
        isPlaying = false;
        audioBar.classList.remove("playing");
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        // При паузе показываем длительность
        const total = audioElement.duration || duration;
        timeDisplay.textContent = formatAudioDuration(total);
        // Бары остаются выделенными на текущем прогрессе
        
        // Очищаем текущее воспроизведение
        if (currentPlayingAudio.element === audioElement) {
          currentPlayingAudio.element = null;
          currentPlayingAudio.audioBar = null;
          currentPlayingAudio.messageId = null;
        }
      } else {
        // Останавливаем предыдущее аудио
        stopCurrentAudio();
        
        // Воспроизведение
        audioElement.play().catch((err) => {
          console.error("Ошибка воспроизведения аудио:", err);
        });
        isPlaying = true;
        audioBar.classList.add("playing");
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        
        // Сохраняем текущее воспроизведение
        currentPlayingAudio.element = audioElement;
        currentPlayingAudio.audioBar = audioBar;
        currentPlayingAudio.messageId = msg._id;
      }
    };
    
    // Обработчик клика на кнопку play/pause
    playButton.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayPause();
    });
    
    // Обработчик клика на waveform для перемотки на определенную секунду
    waveform.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Если аудио еще не загружено, сначала загружаем его
      if (!audioElement) {
        togglePlayPause();
        return;
      }
      
      // Получаем позицию клика относительно waveform
      const rect = waveform.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const waveformWidth = rect.width;
      
      // Вычисляем процент клика от общей ширины
      const clickPercent = Math.max(0, Math.min(1, clickX / waveformWidth));
      
      // Получаем длительность аудио
      const audioDuration = audioElement.duration || duration;
      
      if (audioDuration > 0) {
        // Вычисляем время, на которое нужно перемотать
        const targetTime = clickPercent * audioDuration;
        
        // Устанавливаем время воспроизведения
        audioElement.currentTime = targetTime;
        
        // Обновляем прогресс и время сразу
        const progress = clickPercent * 100;
        progressBar.style.width = `${progress}%`;
        timeDisplay.textContent = formatAudioDuration(targetTime);
        
        // Обновляем выделение баров
        const bars = waveform.querySelectorAll(".audio-wave-bar");
        const totalBars = bars.length;
        bars.forEach((bar, index) => {
          const barProgress = (index / totalBars) * 100;
          if (barProgress <= progress) {
            bar.classList.add("played");
          } else {
            bar.classList.remove("played");
          }
        });
        
        // Если аудио было на паузе, запускаем его
        if (!isPlaying && audioElement.paused) {
          audioElement.play().catch((err) => {
            console.error("Ошибка воспроизведения аудио:", err);
          });
          isPlaying = true;
          audioBar.classList.add("playing");
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
          
          // Сохраняем текущее воспроизведение
          currentPlayingAudio.element = audioElement;
          currentPlayingAudio.audioBar = audioBar;
          currentPlayingAudio.messageId = msg._id;
        }
      }
    });
    
    bubble.appendChild(audioBar);
    bubble.classList.add("has-audio");
  } else if (msg.type === "image" && msg.file_url) {
    // Отображение изображения
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("message-image-container");
    const img = document.createElement("img");
    img.src = msg.file_url;
    img.classList.add("message-image");
    img.alt = msg.filename || "Изображение";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";

    // Открытие изображения в полном размере при клике
    img.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "10000";
      modal.style.cursor = "pointer";

      const fullImg = document.createElement("img");
      fullImg.src = msg.file_url;
      fullImg.style.maxWidth = "90%";
      fullImg.style.maxHeight = "90%";
      fullImg.style.objectFit = "contain";

      modal.appendChild(fullImg);
      document.body.appendChild(modal);

      modal.addEventListener("click", () => {
        document.body.removeChild(modal);
      });
    });

    imageContainer.appendChild(img);

    // Добавляем текст, если он есть
    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      imageContainer.appendChild(textContent);
    }

    bubble.appendChild(imageContainer);
    bubble.classList.add("has-link");
  } else if (msg.type === "video" && msg.file_url) {
    // Отображение видео
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("message-video-container");
    const video = document.createElement("video");
    video.src = msg.file_url;
    video.controls = true;
    video.classList.add("message-video");
    video.style.maxWidth = "100%";
    video.style.height = "auto";
    video.style.borderRadius = "10px";
    video.style.display = "block";

    videoContainer.appendChild(video);

    // Добавляем текст, если он есть
    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      videoContainer.appendChild(textContent);
    }

    bubble.appendChild(videoContainer);
    bubble.classList.add("has-link");
  } else if (msg.type === "file" && msg.file_url) {
    // Отображение файла
    const fileContainer = document.createElement("div");
    fileContainer.classList.add("message-file-container");
    fileContainer.style.display = "flex";
    fileContainer.style.alignItems = "center";
    fileContainer.style.gap = "12px";
    fileContainer.style.padding = "8px";
    fileContainer.style.backgroundColor = "var(--color-background-2)";
    fileContainer.style.borderRadius = "8px";
    fileContainer.style.cursor = "pointer";

    // Иконка файла
    const fileIcon = document.createElement("div");
    fileIcon.style.width = "40px";
    fileIcon.style.height = "40px";
    fileIcon.style.display = "flex";
    fileIcon.style.alignItems = "center";
    fileIcon.style.justifyContent = "center";
    fileIcon.style.backgroundColor = "var(--color-primary)";
    fileIcon.style.borderRadius = "8px";
    fileIcon.innerHTML = "📎";
    fileIcon.style.fontSize = "20px";

    // Информация о файле
    const fileInfo = document.createElement("div");
    fileInfo.style.flex = "1";
    fileInfo.style.minWidth = "0";

    const fileName = document.createElement("div");
    fileName.style.fontWeight = "600";
    fileName.style.fontSize = "14px";
    fileName.style.color = "var(--color-text-dark)";
    fileName.style.whiteSpace = "nowrap";
    fileName.style.overflow = "hidden";
    fileName.style.textOverflow = "ellipsis";
    fileName.textContent = msg.filename || "Файл";
    fileName.dataset.filename = msg.filename || "Файл"; // Сохраняем для ответов

    const fileLink = document.createElement("a");
    fileLink.href = msg.file_url;
    fileLink.download = msg.filename || "file";
    fileLink.style.textDecoration = "none";
    fileLink.style.color = "var(--color-primary)";
    fileLink.style.fontSize = "12px";
    fileLink.textContent = "Скачать";

    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileLink);

    fileContainer.appendChild(fileIcon);
    fileContainer.appendChild(fileInfo);

    // Клик по контейнеру файла для скачивания
    fileContainer.addEventListener("click", () => {
      window.open(msg.file_url, "_blank");
    });

    bubble.appendChild(fileContainer);

    // Добавляем текст, если он есть
    if (msg.content && msg.content.trim()) {
      const textContent = document.createElement("div");
      textContent.classList.add("message-content");
      textContent.textContent = msg.content;
      textContent.style.marginTop = "8px";
      bubble.appendChild(textContent);
    }
  } else {
    // Обычное текстовое сообщение или ответ бота с кодом
    const rawText = msg.content || "";

    const isFromBot =
      (msg.sender_id && msg.sender_id.startsWith("bot_")) ||
      (msg.sender_email && msg.sender_email.startsWith("bot_"));
    const hasCodeFence = rawText.includes("```");

    if (isFromBot && hasCodeFence) {
      // Специальный рендер кода от бота
      const segments = rawText.split("```");
      const beforeText = (segments[0] || "").trim();
      const codeBlockRaw = segments[1] || "";
      let codeText = codeBlockRaw;
      const firstNewline = codeBlockRaw.indexOf("\n");
      if (firstNewline !== -1) {
        // Отбрасываем возможное указание языка
        codeText = codeBlockRaw.slice(firstNewline + 1);
      }
      codeText = codeText.replace(/```+$/g, "").trim();

      if (beforeText) {
        const beforeDiv = document.createElement("div");
        beforeDiv.classList.add("message-content");
        beforeDiv.textContent = beforeText;
        bubble.appendChild(beforeDiv);
      }

      const codeWrapper = document.createElement("div");
      codeWrapper.classList.add("message-code-block");

      const codeHeader = document.createElement("div");
      codeHeader.classList.add("message-code-header");
      const codeLabel = document.createElement("span");
      codeLabel.textContent = "Код";
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.classList.add("message-code-copy-btn");
      copyBtn.textContent = "Копировать";

      codeHeader.appendChild(codeLabel);
      codeHeader.appendChild(copyBtn);

      const pre = document.createElement("pre");
      pre.classList.add("message-code-pre");
      const codeEl = document.createElement("code");
      codeEl.textContent = codeText;
      pre.appendChild(codeEl);

      codeWrapper.appendChild(codeHeader);
      codeWrapper.appendChild(pre);
      bubble.appendChild(codeWrapper);

      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(codeText);
          copyBtn.textContent = "Скопировано";
          setTimeout(() => {
            copyBtn.textContent = "Копировать";
          }, 1500);
        } catch (e) {
          console.error("Не удалось скопировать код:", e);
        }
      });
    } else {
      // Обычный текст с обработкой ссылок/превью и упоминаний
      const content = document.createElement("div");
      content.classList.add("message-content");
      
      const text = rawText;
      
      // Сначала обрабатываем упоминания, затем ссылки
      const mentionRegex = /@(\w+)/g;
      const urlPattern = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
      const urlTestPattern = /^https?:\/\//i;
      
      // Проверяем, есть ли упоминания или ссылки
      const hasMentions = mentionRegex.test(text);
      mentionRegex.lastIndex = 0; // Сбрасываем regex
      const hasUrls = urlPattern.test(text);
      urlPattern.lastIndex = 0; // Сбрасываем regex
      
      if (hasMentions && !hasUrls) {
        // Только упоминания, без ссылок
        content.appendChild(processMessageTextWithMentions(text));
      } else if (hasUrls) {
        // Есть ссылки - обрабатываем и ссылки, и упоминания
        // Разбиваем текст на части по ссылкам
        const parts = text.split(urlPattern);
        parts.forEach(part => {
          if (part && urlTestPattern.test(part)) {
            // Это ссылка - создаем обертку с белым фоном
            const linkWrapper = document.createElement("div");
            linkWrapper.classList.add("message-link-wrapper");
            
            // Создаем элемент ссылки с превью
            const linkContainer = document.createElement("div");
            linkContainer.classList.add("message-link-container");
            
            // Превью изображения
            const linkPreview = document.createElement("div");
            linkPreview.classList.add("message-link-preview");
            const previewImg = document.createElement("img");
            previewImg.alt = "";
            
            // Используем сохраненное превью из сообщения (если есть)
            if (msg.link_preview) {
              previewImg.src = msg.link_preview;
              previewImg.style.display = "block";
            } else {
              // Fallback: пытаемся получить превью через API
              previewImg.style.display = "none";
              fetch(`https://api.microlink.io/data?url=${encodeURIComponent(part)}`)
                .then(response => response.json())
                .then(data => {
                  if (data.data && data.data.image && data.data.image.url) {
                    previewImg.src = data.data.image.url;
                    previewImg.style.display = "block";
                  } else {
                    previewImg.src = `https://api.microlink.io/image?url=${encodeURIComponent(part)}`;
                    previewImg.style.display = "block";
                  }
                })
                .catch(() => {
                  previewImg.src = `https://api.microlink.io/image?url=${encodeURIComponent(part)}`;
                  previewImg.style.display = "block";
                });
            }
            
            previewImg.onerror = function() {
              // Если не удалось загрузить превью, скрываем изображение
              this.style.display = "none";
            };
            linkPreview.appendChild(previewImg);
            linkContainer.appendChild(linkPreview);
            
            // Информация о ссылке
            const linkInfo = document.createElement("div");
            linkInfo.classList.add("message-link-info");
            
            // Заголовок (домен)
            try {
              const urlObj = new URL(part);
              const domain = urlObj.hostname.replace('www.', '');
              const linkTitle = document.createElement("div");
              linkTitle.classList.add("message-link-title");
              linkTitle.textContent = domain;
              linkInfo.appendChild(linkTitle);
            } catch {}
            
            // URL
            const linkUrl = document.createElement("a");
            linkUrl.href = part;
            linkUrl.target = "_blank";
            linkUrl.rel = "noopener noreferrer";
            linkUrl.classList.add("message-link-url");
            linkUrl.textContent = part;
            linkInfo.appendChild(linkUrl);
            
            linkContainer.appendChild(linkInfo);
            
            // Кликабельность всей карточки ссылки
            linkContainer.style.cursor = "pointer";
            linkContainer.addEventListener("click", () => {
              window.open(part, "_blank");
            });
            
            linkWrapper.appendChild(linkContainer);
            content.appendChild(linkWrapper);
            // Добавляем класс к сообщению, чтобы скруглить нижние углы
            bubble.classList.add("has-link");
          } else if (part && part.trim()) {
            // Обычный текст - обрабатываем упоминания, если они есть
            if (hasMentions) {
              content.appendChild(processMessageTextWithMentions(part));
            } else {
              content.appendChild(document.createTextNode(part));
            }
          }
        });
      } else {
        // Нет ссылок - обрабатываем упоминания, если они есть
        if (hasMentions) {
          content.appendChild(processMessageTextWithMentions(text));
        } else {
          content.textContent = text;
        }
      }
      
      bubble.appendChild(content);
    }
  }
  
  // Мета-данные (время и галочки) - не добавляем для аудио, так как они уже в белом баре
  if (msg.type !== "audio") {
    const meta = document.createElement("div");
    meta.classList.add("message-meta");
    const time = document.createElement("span");
    time.classList.add("message-timestamp");
    time.textContent = formatTime(msg.timestamp);
    meta.appendChild(time);
    if (msg.edited_at) {
      const edited = document.createElement("span");
      edited.style.fontSize = "11px";
      edited.style.color = "var(--color-text-inactive)";
      edited.textContent = "изменено";
      meta.appendChild(edited);
    }
    if (isMine) {
      const ticks = document.createElement("span");
      ticks.classList.add("message-ticks");
      const hasBeenRead = (msg.read_by || []).some(
        (email) => email !== currentUserEmail
      );
      if (hasBeenRead) {
        ticks.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
        ticks.classList.add("read");
      } else {
        ticks.innerHTML = `<img src="/images/no_read.svg" alt="Отправлено">`;
        ticks.classList.add("sent");
      }
      meta.appendChild(ticks);
    }
    bubble.appendChild(meta);
  }
  row.appendChild(bubble);
  
  // Проверяем наличие chatMessages перед добавлением
  if (!chatMessages) {
    console.warn("[renderMessage] chatMessages не найден, сообщение не отображено:", msg._id);
    // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
    renderedMessageIds.delete(msg._id);
    return;
  }
  
  // Проверяем, что сообщение действительно добавляется в DOM
  try {
    chatMessages.appendChild(row);
    // Проверяем, что элемент действительно добавлен
    const addedElement = chatMessages.querySelector(`.message-row[data-message-id="${msg._id}"]`);
    if (!addedElement) {
      console.warn("[renderMessage] Сообщение не было добавлено в DOM, удаляем из Set:", msg._id);
      renderedMessageIds.delete(msg._id);
    }
  } catch (error) {
    console.error("[renderMessage] Ошибка при добавлении сообщения в DOM:", error, msg._id);
    // Удаляем из renderedMessageIds, чтобы можно было попробовать снова
    renderedMessageIds.delete(msg._id);
    return;
  }

  // === Прокрутка вызывается только если doScroll = true и пользователь внизу ===
  if (doScroll) {
    const senderEmail = msg.sender_id || msg.sender_email || msg.senderId || msg.sender;
    const isMine = senderEmail === currentUserEmail;
    
    // Если это не наше сообщение и пользователь не внизу, увеличиваем счетчик
    if (!isMine && !isUserAtBottom) {
      newMessagesCount++;
      updateScrollToBottomButton();
    }
    
    // Прокручиваем только если пользователь внизу или это наше сообщение
    if (isUserAtBottom || isMine) {
      scrollToBottom();
    }
  }
}

// === НОВАЯ ФУНКЦИЯ: Показать/скрыть typing индикатор в чате ===
let botTypingIndicatorId = null;

function showBotTypingIndicator(chatId, botEmail) {
  // Убираем предыдущий индикатор, если есть
  hideBotTypingIndicator();
  
  // Проверяем, что это активный чат
  if (chatId !== activeChatId) return;
  
  // Проверяем, что это не наш email
  if (botEmail === currentUserEmail) return;
  
  // Создаем элемент typing индикатора
  const row = document.createElement("div");
  row.classList.add("message-row", "incoming");
  row.id = "bot-typing-indicator";
  
  const bubble = document.createElement("div");
  bubble.classList.add("message", "incoming", "typing-indicator");
  
  const content = document.createElement("div");
  content.classList.add("message-content", "typing-dots");
  content.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  
  bubble.appendChild(content);
  row.appendChild(bubble);
  
  // Проверяем наличие chatMessages перед добавлением
  if (!chatMessages) {
    console.warn("[showBotTypingIndicator] chatMessages не найден, индикатор не отображен");
    return;
  }
  
  chatMessages.appendChild(row);
  
  botTypingIndicatorId = chatId;
  // Для индикатора печатания всегда прокручиваем
  scrollToBottom(true);
}

function hideBotTypingIndicator() {
  const indicator = document.getElementById("bot-typing-indicator");
  if (indicator) {
    indicator.remove();
  }
  botTypingIndicatorId = null;
}

function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function formatAudioDuration(totalSeconds) {
  // Форматирует время для аудио в формате MM:SS или HH:MM:SS для длинных записей
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const remainingM = m % 60;
  const r = s % 60;
  
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(remainingM).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

// ========================================================
// === WebSocket (ОБНОВЛЕН: исправления 1 и 2) ===
// ========================================================

function connectWebSocket(userEmail) {
  if (!userEmail) {
    console.error("Не удалось подключиться: userEmail не определен");
    return;
  }
  if (ws) ws.close();

  const url = `${WS_PROTOCOL}://${location.host}/ws/${userEmail}`;
  ws = new WebSocket(url);

  ws.onopen = () => console.log("[WS] Connected as:", userEmail);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data) return;

      // 1. НОВОЕ СООБЩЕНИЕ
      if (
        data._id &&
        (data.type === "text" ||
          data.type === "image" ||
          data.type === "video" ||
          data.type === "file" ||
          data.type === "audio" ||
          data.type === "system" ||
          !data.type)
      ) {
        // Системные сообщения обрабатываются отдельно
        if (data.type === "system" || data.sender_id === "system") {
          if (data.chat_id === activeChatId && chatMessages) {
            renderMessage(data, true, currentChatIsGroup);
          }
          // Обновляем превью чата для системных сообщений тоже
          if (data.content) {
            updateChatPreview(data.chat_id, data.content);
            moveChatToTop(data.chat_id);
          }
          return;
        }
        
        // Определяем превью контента для списка чатов
        let previewContent = data.content || "";
        if (data.type === "image") {
          previewContent = "Фотография";
        } else if (data.type === "video") {
          previewContent = "Видео";
        } else if (data.type === "file") {
          previewContent = data.filename || "Файл";
        } else if (data.type === "audio") {
          previewContent = "Голосовое сообщение";
        }

        setTypingStatus(data.chat_id, false);
        updateChatPreview(data.chat_id, previewContent || "Новое сообщение");
        moveChatToTop(data.chat_id);
        const msgBtn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (msgBtn)
          msgBtn.dataset.lastSenderEmail = data.sender_id || data.sender_email;
        if ((data.sender_id || data.sender_email) === currentUserEmail) {
          setChatListTicks(data.chat_id, "sent");
        } else {
          setChatListTicks(data.chat_id, "none");
        }
        if (data.chat_id === activeChatId) {
          // Убираем typing индикатор бота, если пришло сообщение от бота
          if ((data.sender_id || data.sender_email) && 
              (data.sender_id || data.sender_email).startsWith("bot_")) {
            hideBotTypingIndicator();
          }
          // Убеждаемся, что chatMessages доступен перед рендерингом
          if (chatMessages) {
            renderMessage(data, true, currentChatIsGroup); // Передаем флаг группового чата
          } else {
            console.warn("[WS] chatMessages не найден, сообщение будет отображено при загрузке чата:", data._id);
          }
          if (ws)
            ws.send(
              JSON.stringify({ type: "mark_as_read", chat_id: data.chat_id })
            );
          
          // Обновляем профиль в реальном времени, если он открыт
          if (profileSection && !profileSection.classList.contains("hidden")) {
            const activeTab = getActiveProfileTab();
            if (activeTab) {
              // Определяем, какую вкладку нужно обновить в зависимости от типа сообщения
              let tabToUpdate = null;
              if (data.type === "image" || data.type === "video") {
                tabToUpdate = "media";
              } else if (data.type === "file") {
                tabToUpdate = "files";
              } else if (data.type === "text" && data.content) {
                // Проверяем наличие ссылок в тексте с помощью регулярного выражения
                const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/i;
                if (urlPattern.test(data.content)) {
                  tabToUpdate = "links";
                }
              }
              
              // Если текущая активная вкладка соответствует типу сообщения, обновляем её
              if (tabToUpdate && activeTab === tabToUpdate) {
                const userEmail = window.CURRENT_USER_EMAIL;
                loadProfileContent(tabToUpdate, userEmail);
              }
            }
          }
        }
        return;
      }

      // 2. ОБНОВЛЕНИЕ ПРЕВЬЮ ССЫЛКИ
      if (data.type === "link_preview_update") {
        if (data.chat_id === activeChatId && data.message_id && data.link_preview) {
          const messageEl = document.querySelector(
            `.message[data-message-id="${data.message_id}"]`
          );
          if (messageEl) {
            const previewImg = messageEl.querySelector(".message-link-preview img");
            if (previewImg) {
              previewImg.src = data.link_preview;
              previewImg.style.display = "block";
            }
          }
          
          // Обновляем профиль в реальном времени, если он открыт и активна вкладка ссылок
          if (profileSection && !profileSection.classList.contains("hidden")) {
            const activeTab = getActiveProfileTab();
            if (activeTab === "links") {
              const userEmail = window.CURRENT_USER_EMAIL;
              loadProfileContent("links", userEmail);
            }
          }
        }
        return;
      }

      // 3. УДАЛЕНИЕ СООБЩЕНИЯ
      if (data.type === "delete_message") {
        // ... (логика 'delete_message' без изменений) ...
        console.log("[WS] Получено delete_message:", data.message_id);
        if (data.chat_id === activeChatId) {
          const elementToRemove = document.querySelector(
            `.message[data-message-id="${data.message_id}"]`
          );
          if (elementToRemove) {
        const rowToRemove = elementToRemove.closest(".message-row");
        const parent = rowToRemove?.parentElement;
        const nextRow = rowToRemove?.nextElementSibling;
        const senderId = rowToRemove?.dataset?.senderId;
        const isIncoming = rowToRemove && !rowToRemove.classList.contains("outgoing");

        rowToRemove?.remove();

        // Если удалили первую входящую от отправителя в серии — переносим шапку в следующее
        if (
          parent &&
          nextRow &&
          isIncoming &&
          nextRow.dataset.senderId === senderId &&
          !nextRow.classList.contains("outgoing")
        ) {
          ensureGroupHeader(nextRow);
        }
          }
        }
        return;
      }

      // 4. ЗАКРЕПЛЕНИЕ СООБЩЕНИЯ
      if (data.type === "pin_message") {
        console.log("[WS] Получено pin_message:", data);
        if (data.chat_id === activeChatId) {
          // Если сообщение откреплено, просто обновляем
          if (data.action === "unpinned") {
            updatePinnedMessage(null, null);
          } else {
            // Если закреплено, нужно получить данные сообщения
            const pinnedMsgEl = document.querySelector(`.message[data-message-id="${data.message_id}"]`);
            if (pinnedMsgEl) {
              const msgContent = pinnedMsgEl.querySelector(".message-content");
              const msgData = {
                _id: data.message_id,
                sender_id: pinnedMsgEl.closest(".outgoing") ? currentUserEmail : "other",
                content: msgContent ? msgContent.textContent : "",
                type: "text"
              };
              updatePinnedMessage(data.pinned_message_id, msgData);
            } else {
              // Если сообщение еще не загружено, загружаем чат заново
              if (activeChatId) {
                loadChat(activeChatId);
              }
            }
          }
        }
        return;
      }

      // 5. ОБНОВЛЕНИЕ СПИСКА ЧАТОВ
      if (data.type === "chat_list_update") {
        // ... (логика 'chat_list_update' без изменений) ...
        console.log("[WS] Получено chat_list_update:", data);
        const btn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (!btn) return;
        
        // Обновляем превью только если нет черновика
        if (btn.dataset.hasDraft !== "true") {
          const lastMsg = btn.querySelector(".last-message");
          if (lastMsg) {
            lastMsg.textContent = data.last_message_content || "Нет сообщений";
            lastMsg.dataset.originalText =
              data.last_message_content || "Нет сообщений";
          }
        }
        
        const timeEl = btn.querySelector(".chat-list-time");
        if (timeEl) {
          timeEl.textContent = formatTime(data.last_message_timestamp);
        }

        // === ИСПРАВЛЕНИЕ 1 (ГАЛОЧКИ): ВОЗВРАЩАЕМ ЭТУ СТРОКУ ===
        // Это самый надежный способ, т.к. сервер присылает
        // готовый статус.
        setChatListTicks(data.chat_id, data.last_message_status || "none");
        // === КОНЕЦ ИСПРАВЛЕНИЯ 1 ===

        if (data.last_message_sender_email) {
          btn.dataset.lastSenderEmail = data.last_message_sender_email;
        }
        btn.dataset.lastTimestamp = data.last_message_timestamp;
        sortChatList();
        return;
      }

      // 5.1. УДАЛЕНИЕ ЧАТА
      if (data.type === "chat_deleted") {
        console.log("[WS] Получено chat_deleted:", data.chat_id);
        const btn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (btn) {
          const li = btn.closest("li");
          if (li) {
            li.remove();
          }
        }
        // Если удаленный чат был активным, закрываем его
        if (data.chat_id === activeChatId) {
          if (chatWindow) {
            chatWindow.classList.add("hidden");
          }
          if (chatEmptyState) {
            chatEmptyState.classList.remove("hidden");
          }
          activeChatId = null;
        }
        return;
      }

      // 5.2. СКРЫТИЕ ЧАТА
      if (data.type === "chat_hidden") {
        console.log("[WS] Получено chat_hidden:", data.chat_id);
        const btn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (btn) {
          const li = btn.closest("li");
          if (li) {
            li.remove();
          }
        }
        // Если скрытый чат был активным, закрываем его
        if (data.chat_id === activeChatId) {
          if (chatWindow) {
            chatWindow.classList.add("hidden");
          }
          if (chatEmptyState) {
            chatEmptyState.classList.remove("hidden");
          }
          activeChatId = null;
        }
        return;
      }

      // 5.3. ОЧИСТКА ЧАТА
      if (data.type === "chat_cleared") {
        console.log("[WS] Получено chat_cleared:", data.chat_id);
        // Очищаем сообщения в чате, если он открыт
        if (data.chat_id === activeChatId && chatMessages) {
          chatMessages.innerHTML = "";
        }
        // Обновляем превью чата в списке
        const btn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (btn) {
          const lastMsg = btn.querySelector(".last-message");
          if (lastMsg) {
            lastMsg.textContent = "Нет сообщений";
            lastMsg.dataset.originalText = "Нет сообщений";
          }
          const timeEl = btn.querySelector(".chat-list-time");
          if (timeEl) {
            timeEl.textContent = formatTime(new Date().toISOString());
          }
          btn.dataset.lastTimestamp = new Date().toISOString();
          // Убираем счетчик непрочитанных
          setUnreadCount(data.chat_id, 0);
        }
        return;
      }

      // 5.4. ОБНОВЛЕНИЕ НАСТРОЕК ГРУППЫ
      if (data.type === "group_settings_updated") {
        console.log("[WS] Получено group_settings_updated:", data);
        const chatId = data.chat_id;
        
        // Обновляем название группы в заголовке чата, если он открыт
        if (chatId === activeChatId && currentChatTitle) {
          if (data.settings.group_name) {
            currentChatTitle.textContent = data.settings.group_name;
            console.log("[WS] Обновлено название группы в заголовке:", data.settings.group_name);
          }
        }
        
        // Функция для обновления аватара с предотвращением кэширования
        const updateAvatarWithCacheBust = (imgElement, avatarUrl) => {
          if (!imgElement || !avatarUrl) return;
          
          // Добавляем timestamp для предотвращения кэширования
          const separator = avatarUrl.includes('?') ? '&' : '?';
          const newAvatarUrl = `${avatarUrl}${separator}t=${Date.now()}`;
          
          // Используем предзагрузку для плавного обновления
          const tempImg = new Image();
          tempImg.onload = () => {
            imgElement.src = newAvatarUrl;
            console.log(`[WS] Аватар успешно обновлен: ${avatarUrl}`);
          };
          tempImg.onerror = () => {
            // Если с timestamp не загрузилось, пробуем оригинальный URL
            console.warn(`[WS] Ошибка загрузки аватара с timestamp, пробуем оригинальный URL`);
            imgElement.src = avatarUrl;
          };
          tempImg.src = newAvatarUrl;
        };
        
        // Обновляем аватар группы в заголовке чата, если он открыт
        if (chatId === activeChatId && currentChatAvatar && data.settings.group_avatar) {
          console.log("[WS] Обновление аватара в заголовке чата:", data.settings.group_avatar);
          updateAvatarWithCacheBust(currentChatAvatar, data.settings.group_avatar);
        }
        
        // Обновляем название и аватар в списке чатов
        const btn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${chatId}"]`
        );
        if (btn) {
          if (data.settings.group_name) {
            const chatNameEl = btn.querySelector(".chat-name");
            if (chatNameEl) {
              chatNameEl.textContent = data.settings.group_name;
            }
            btn.dataset.chatName = data.settings.group_name;
          }
          
          if (data.settings.group_avatar) {
            console.log("[WS] Обновление аватара в списке чатов:", data.settings.group_avatar);
            const avatarImg = btn.querySelector("img");
            if (avatarImg) {
              updateAvatarWithCacheBust(avatarImg, data.settings.group_avatar);
            }
            btn.dataset.avatarUrl = data.settings.group_avatar;
          }
        }
        
        // Обновляем аватар в профиле группы, если он открыт
        const profileSection = document.getElementById("profileSection");
        if (profileSection && !profileSection.classList.contains("hidden")) {
          // Проверяем, что открыт профиль именно этой группы
          const profileChatId = window.currentGroupChatId;
          if (profileChatId === chatId && data.settings.group_avatar) {
            console.log("[WS] Обновление аватара в профиле группы");
            const profileHeaderBgImg = document.getElementById("profileHeaderBgImg");
            if (profileHeaderBgImg) {
              updateAvatarWithCacheBust(profileHeaderBgImg, data.settings.group_avatar);
            }
            
            // Также обновляем другие возможные места с аватаром в профиле
            const profileAvatars = profileSection.querySelectorAll("img[src*='group_avatar'], img[src*='chat_avatar'], .profile-avatar img");
            profileAvatars.forEach(img => {
              if (img !== profileHeaderBgImg) {
                updateAvatarWithCacheBust(img, data.settings.group_avatar);
              }
            });
          }
        }
        
        // Обновляем аватар в модалке настроек группы, если она открыта
        const groupSettingsModal = document.getElementById("groupSettingsModal");
        if (groupSettingsModal && !groupSettingsModal.classList.contains("hidden")) {
          const groupSettingsAvatarImg = document.getElementById("groupSettingsAvatarImg");
          // Проверяем, что модалка открыта для этой группы (используем переменную из groups.js)
          const currentGroupSettingsChatId = window.currentGroupSettingsChatId;
          if (groupSettingsAvatarImg && currentGroupSettingsChatId === chatId && data.settings.group_avatar) {
            console.log("[WS] Обновление аватара в модалке настроек группы");
            updateAvatarWithCacheBust(groupSettingsAvatarImg, data.settings.group_avatar);
          }
        }
        
        // Обновляем превью последнего сообщения в списке чатов
        if (btn) {
          const timeEl = btn.querySelector(".chat-list-time");
          if (timeEl) {
            timeEl.textContent = formatTime(new Date().toISOString());
          }
          btn.dataset.lastTimestamp = new Date().toISOString();
          
          // Обновляем превью последнего сообщения, если есть системное сообщение
          const lastMsg = btn.querySelector(".last-message");
          if (lastMsg && data.settings.group_name) {
            // Можно обновить превью, если нужно
            // lastMsg.textContent = `Название группы изменено на «${data.settings.group_name}»`;
          }
          
          sortChatList();
        }
        
        return;
      }

      // 6. СТАТУС ПЕЧАТИ
      if (data.type === "typing") {
        if (data.sender_email !== currentUserEmail) {
          setTypingStatus(data.chat_id, true);
          // Если это бот (email начинается с bot_), показываем typing индикатор в чате
          if (data.sender_email && data.sender_email.startsWith("bot_")) {
            showBotTypingIndicator(data.chat_id, data.sender_email);
          }
        }
        return;
      }
      if (data.type === "stopped_typing") {
        if (data.sender_email !== currentUserEmail) {
          setTypingStatus(data.chat_id, false);
          // Если это бот, убираем typing индикатор из чата
          if (data.sender_email && data.sender_email.startsWith("bot_")) {
            hideBotTypingIndicator();
          }
        }
        return;
      }

      // 5. ОБНОВЛЕНИЕ СЧЕТЧИКА
      if (data.type === "unread_count_update") {
        // ... (логика 'unread_count_update' без изменений) ...
        console.log(
          `[WS] Получено unread_count_update для ${data.chat_id}: ${data.count}`
        );

        // === ИСПРАВЛЕНИЕ 2 ("1 НЕПРОЧИТАННОЕ"): Добавлена проверка document.hasFocus() ===
        const isChatActiveAndVisible =
          data.chat_id === activeChatId &&
          !document.hidden &&
          document.hasFocus();

        if (isChatActiveAndVisible) {
          setUnreadCount(data.chat_id, 0);
        } else {
          setUnreadCount(data.chat_id, data.count);
        }
        // === КОНЕЦ ИСПРАВЛЕНИЯ 2 ===
        return;
      }

      // 6. СООБЩЕНИЯ ПРОЧИТАНЫ
      if (data.type === "messages_read") {
        // ... (логика 'messages_read' без изменений) ...
        if (
          data.chat_id === activeChatId &&
          data.reader_email !== currentUserEmail
        ) {
          console.log(`[WS] ${data.reader_email} прочитал сообщения`);
          data.message_ids.forEach((msgId) => {
            const msgEl = document.querySelector(
              `.message[data-message-id="${msgId}"]`
            );
            if (msgEl) {
              const ticksEl = msgEl.querySelector(".message-ticks");
              if (ticksEl) {
                ticksEl.innerHTML = `<img src="/images/read.svg" alt="Прочитано">`;
                ticksEl.classList.remove("sent");
                ticksEl.classList.add("read");
              }
            }
          });
        }
        const readBtn = document.querySelector(
          `.chat-list-item-btn[data-chat-id="${data.chat_id}"]`
        );
        if (readBtn) {
          if (data.reader_email !== currentUserEmail) {
            if (readBtn.dataset.lastSenderEmail === currentUserEmail) {
              setChatListTicks(data.chat_id, "read");
            }
          } else {
            setUnreadCount(data.chat_id, 0);
          }
        }
        return;
      }

      // === 7. НОВЫЙ БЛОК: ОБНОВЛЕНИЕ СТАТУСА ONLINE/OFFLINE ===
      if (data.type === "status_update") {
        console.log("[WS] Получено status_update:", data);
        // data.user_email, data.status ('online'/'offline'), data.last_seen
        updateUserStatus(
          data.user_email,
          data.status === "online",
          data.last_seen
        );
        return;
      }
      // === КОНЕЦ НОВОГО БЛОКА ===

      // === 8. НОВЫЙ БЛОК: СООБЩЕНИЕ ОТРЕДАКТИРОВАНО ===
      if (data.type === "message_edited") {
        console.log("[WS] Получено message_edited:", data);
        if (data.chat_id === activeChatId) {
          const msgEl = document.querySelector(
            `.message[data-message-id="${data._id}"]`
          );
          if (msgEl) {
            const contentEl = msgEl.querySelector(".message-content");
            if (contentEl) contentEl.textContent = data.content;
            // Добавляем/обновляем метку "изменено"
            let editedLabel = msgEl.querySelector(".message-edited");
            if (!editedLabel) {
              editedLabel = document.createElement("span");
              editedLabel.classList.add("message-edited");
              editedLabel.style.fontSize = "11px";
              editedLabel.style.color = "var(--color-text-inactive)";
              editedLabel.textContent = "изменено";
              const meta = msgEl.querySelector(".message-meta");
              if (meta) meta.appendChild(editedLabel);
            }
          }
        }
        return;
      }
      // === КОНЕЦ НОВОГО БЛОКА ===
    } catch (err) {
      console.error("[WS Error]:", err);
    }
  };

  ws.onclose = () => {
    console.warn("[WS] Disconnected. Reconnecting...");
    setTimeout(() => connectWebSocket(userEmail), 3000);
  };
}

// ========================================================
// === ВСПОМОГАТЕЛЬНО: обновление URL при открытии чата ===
// ========================================================
// === ФУНКЦИЯ: обновить URL при открытии чата (Telegram логика) ===
// В Telegram URL всегда отражает текущий открытый чат
function updateUrlForChat(chatButton) {
  if (!chatButton || !window.history || !window.location) return;

  let newUrl = "/"; // По умолчанию пустое состояние

  // Для "Избранного" всегда фиксированный URL /@favorit
  if (chatButton.dataset.isFavorite === "true") {
    newUrl = "/@favorit";
  } else {
    const interlocutorUsername = chatButton.dataset.interlocutorUsername || "";
    const interlocutorEmail = chatButton.dataset.interlocutorEmail || "";
    const isGroupChat = chatButton.dataset.isGroupChat === "true";

    // Приоритет: username > email > chat_id
    if (interlocutorUsername && !isGroupChat) {
      // Если есть username — формируем URL вида /@username
      const encoded = encodeURIComponent(interlocutorUsername);
      newUrl = `/@${encoded}`;
    } else if (interlocutorEmail && !isGroupChat) {
      // Если username нет, но есть email — используем email для URL
      const encoded = encodeURIComponent(interlocutorEmail);
      newUrl = `/${encoded}`;
    } else {
      // Для групп/ботов используем chat_id
      const chatId = chatButton.dataset.chatId || "";
      if (chatId) {
        newUrl = `/chat-${chatId}`;
      }
    }
  }

  // Обновляем URL без перезагрузки страницы (как в Telegram)
  if (window.location.pathname !== newUrl) {
    window.history.replaceState(null, "", newUrl);
    console.log("[Telegram Logic] URL обновлен на:", newUrl);
  }
}

// ========================================================
// === loadChat (ОБНОВЛЕН: исправление прокрутки) ===
// ========================================================

async function loadChat(chatId) {
  if (!chatId) return;

  showChatSkeleton();

  // ВАЖНО: Сразу показываем окно чата и скрываем пустое состояние
  // Это гарантирует, что переписка будет видна даже если загрузка данных займет время
  if (chatWindow) {
    chatWindow.classList.remove("hidden");
    chatWindow.style.display = "";
    chatWindow.style.visibility = "visible";
    chatWindow.style.opacity = "1";
  
  }
  if (chatEmptyState) {
    chatEmptyState.classList.add("hidden");
    chatEmptyState.style.display = "none";
  }

  // Сохраняем черновик предыдущего чата перед переключением
  if (activeChatId && activeChatId !== chatId && messageInput) {
    const currentDraft = messageInput.value.trim();
    if (currentDraft) {
      saveDraft(activeChatId, currentDraft);
    } else {
      clearDraft(activeChatId);
    }
  }

  // ВАЖНО: Очищаем renderedMessageIds ПЕРЕД установкой activeChatId,
  // чтобы WebSocket сообщения, пришедшие во время загрузки, не были пропущены
  renderedMessageIds.clear();
  
  activeChatId = chatId;
  window.activeChatId = chatId; // Обновляем глобальную переменную
  // Запоминаем последний открытый чат в localStorage,
  // чтобы после полной перезагрузки вернуться сразу в него
  try {
    localStorage.setItem("last_active_chat_id", String(chatId));
  } catch (e) {
    console.warn("Не удалось сохранить last_active_chat_id в localStorage:", e);
  }
  
  // Очищаем DOM только если chatMessages существует
  if (chatMessages) {
    chatMessages.innerHTML = "";
  } else {
    console.warn("[loadChat] chatMessages не найден при очистке");
  }
  
  // Сбрасываем состояние прокрутки при смене чата
  isUserAtBottom = true;
  newMessagesCount = 0;
  if (scrollToBottomBtn) scrollToBottomBtn.classList.add("hidden");
  if (newMessagesCountEl) newMessagesCountEl.classList.add("hidden");

  // сбрасываем поиск по чату при переключении
  closeChatSearch();
  
  // Загружаем черновик для нового чата
  if (messageInput) {
    const draft = loadDraft(chatId);
    messageInput.value = draft;
    toggleSendButton();
  }
  
  // Обработчики профиля установлены глобально на document, дополнительная установка не требуется

  // Сброс статуса "Печатает..." при смене чата
  if (currentChatStatus && currentChatStatus.classList.contains("typing-status")) {
    currentChatStatus.textContent =
      currentChatStatus.dataset.originalText || "";
    currentChatStatus.classList.remove("typing-status");
  }
  
  // Убираем typing индикатор бота при смене чата
  hideBotTypingIndicator();

  const renderChatData = (chatData) => {
    if (!chatData) return;

    const isGroup = chatData.is_group || chatData.chat_type === "group";
    currentChatIsGroup = isGroup;

    currentChatParticipants = [];
    if (isGroup && chatData.participants && Array.isArray(chatData.participants)) {
      for (const email of chatData.participants) {
        if (email !== currentUserEmail) {
          let displayName = email.split("@")[0];
          let username = email.split("@")[0];
          try {
            const contactsMap = window.CONTACTS_BY_EMAIL || {};
            const contactInfo = contactsMap[email];
            if (contactInfo) {
              displayName = contactInfo.contact_name ||
                           contactInfo.display_name ||
                           contactInfo.full_name ||
                           contactInfo.username ||
                           displayName;
              username = contactInfo.username || email.split("@")[0];
            }
          } catch (e) {}
          if (chatData.participants_usernames && chatData.participants_usernames[email]) {
            username = chatData.participants_usernames[email];
          }
          username = (username || "").trim().replace(/^@+/, "");

          currentChatParticipants.push({
            email: email,
            name: displayName,
            username: username
          });
        }
      }
    }

    currentChatTitle.textContent = chatData.chat_title || "Чат";
    if (chatData.interlocutor_username) {
      document.title = chatData.interlocutor_username;
    } else {
      document.title = "";
    }

    const avatarUrl = chatData.chat_avatar || "/images/юзер.svg";
    currentChatAvatar.src = avatarUrl;
    currentChatAvatar.onerror = function() {
      this.src = "/images/юзер.svg";
    };
    currentChatAvatar.onload = function() {
      this.style.display = "block";
    };

    updatePinnedMessage(chatData.pinned_message_id, chatData.pinned_message);

    const chatButton = document.querySelector(
      `.chat-list-item-btn[data-chat-id="${chatId}"]`
    );
    let isOnline = false;
    let lastSeen = "";
    let isBot = chatData.is_bot || false;
    const isFavorite = !!chatData.is_favorite;

    if (chatButton) {
      isOnline = chatButton.dataset.isOnline === "true";
      lastSeen = chatButton.dataset.lastSeen || "";
      if (chatData.is_bot) {
        isBot = true;
        lastSeen = "bot";
      }
    }

    if (isBot) {
      currentChatStatus.textContent = "бот";
      currentChatStatus.dataset.originalText = "бот";
    } else if (isFavorite) {
      currentChatStatus.textContent = "";
      currentChatStatus.dataset.originalText = "";
    } else if (isGroup) {
      currentChatStatus.textContent = "";
      currentChatStatus.dataset.originalText = "";
    } else {
      const originalStatus = formatLastSeen(lastSeen, isOnline);
      if (originalStatus) {
        currentChatStatus.textContent = originalStatus;
        currentChatStatus.dataset.originalText = originalStatus;
        currentChatStatus.style.display = "block";
      } else {
        currentChatStatus.textContent = "";
        currentChatStatus.dataset.originalText = "";
        currentChatStatus.style.display = "none";
      }
    }

    const groupSettingsMenuItem = document.getElementById("groupSettingsMenuItem");
    
    if (isGroup) {
      if (groupSettingsMenuItem) {
        groupSettingsMenuItem.style.display = "block";
      }
    } else {
      if (groupSettingsMenuItem) {
        groupSettingsMenuItem.style.display = "none";
      }
    }

    if (chatMessages) chatMessages.innerHTML = "";
    
    // Отладочное логирование
    console.log("[loadChat] Загружен чат:", chatId);
    console.log("[loadChat] Количество сообщений:", (chatData.messages || []).length);
    console.log("[loadChat] Сообщения:", chatData.messages);
    
    const messages = chatData.messages || [];
    if (messages.length === 0) {
      console.warn("[loadChat] ВНИМАНИЕ: Массив сообщений пуст!");
    }
    
    // Убеждаемся, что chatMessages доступен перед рендерингом
    if (!chatMessages) {
      console.error("[loadChat] chatMessages не найден, сообщения не могут быть отображены");
      return;
    }
    
    messages.forEach((msg) => {
      if (!msg) {
        console.warn("[loadChat] Пропущено пустое сообщение");
        return;
      }
      if (!msg._id) {
        console.warn("[loadChat] Пропущено сообщение без _id:", msg);
        return;
      }
      // Рендерим сообщение с проверкой, что оно действительно отображается
      try {
        renderMessage(msg, false, isGroup);
      } catch (error) {
        console.error("[loadChat] Ошибка при рендеринге сообщения:", msg._id, error);
        // Удаляем из Set, чтобы можно было попробовать снова
        renderedMessageIds.delete(msg._id);
      }
    });

    setUnreadCount(chatId, 0);
    if (ws) {
      try {
        ws.send(JSON.stringify({ type: "mark_as_read", chat_id: chatId }));
      } catch (e) {
        console.warn("Не удалось отправить mark_as_read", e);
      }
    }

    isUserAtBottom = true;
    newMessagesCount = 0;
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "auto" });
    setTimeout(() => {
      checkIfUserAtBottom();
    }, 100);
    
    if (profileSection && !profileSection.classList.contains("hidden")) {
      const chatButton = document.querySelector(
        `.chat-list-item-btn[data-chat-id="${chatId}"]`
      );
      if (chatButton) {
        const interlocutorEmail = chatButton.dataset.interlocutorEmail;
        if (interlocutorEmail) {
          openProfileModal(interlocutorEmail);
        }
      }
    }

    window.CURRENT_CHAT_DATA = chatData;

    if (!ws) {
      connectWebSocket(currentUserEmail);
    } else {
      try {
        ws.send(JSON.stringify({ type: "chat_opened", chat_id: chatId }));
      } catch (e) {
        console.warn("Не удалось отправить chat_opened", e);
      }
    }

    if (avatarContainer) {
      avatarContainer.dataset.chatId = chatId;
      avatarContainer.dataset.chatTitle = chatData.chat_title || "";
      avatarContainer.dataset.chatAvatar = chatData.chat_avatar || "/images/юзер.svg";
    }

    // Всегда сбрасываем/обновляем UI блокировки при открытии чата,
    // чтобы блокировка НЕ "протекала" в другие чаты.
    // Для личных чатов: null => полностью нормальный режим (не заблокирован).
    // Для групп: updateBlockButtons внутри сам выключит блокировку.
    updateBlockButtons(chatData.is_blocked || null);

    if (isChatOpenedFromUrl) {
      protectChatFromClosing();
    }

    restoreScrollPosition(chatId);
  };

  try {
    const cached = await readCachedChat(chatId);
    if (cached) {
      renderChatData(cached);
      hideChatSkeleton();
    }

    const fresh = await prefetchChat(chatId);
    if (fresh) {
      console.log("[loadChat] Свежие данные получены:", fresh);
      console.log("[loadChat] Количество сообщений в свежих данных:", (fresh.messages || []).length);
      renderChatData(fresh);
      writeCachedChat(chatId, fresh);
      
      // ВАЖНО: После загрузки свежих данных ВСЕГДА проверяем актуальное состояние блокировки с сервера
      // Это гарантирует, что состояние блокировки будет восстановлено после перезагрузки страницы
      if (!currentChatIsGroup && fresh.interlocutor_email) {
        // Небольшая задержка, чтобы UI успел обновиться перед запросом статуса
        setTimeout(() => {
          refreshBlockStatus();
        }, 150);
      }
    } else {
      console.warn("[loadChat] Не удалось получить свежие данные для чата:", chatId);
      // Если не удалось загрузить свежие данные, но есть кэш и это личный чат, проверяем статус блокировки
      if (cached && !currentChatIsGroup && cached.interlocutor_email) {
        setTimeout(() => {
          refreshBlockStatus();
        }, 150);
      }
    }
  } catch (err) {
    console.error("Ошибка загрузки чата:", err);
    if (isChatOpenedFromUrl && chatWindow) {
      chatWindow.classList.remove("hidden");
      chatWindow.style.display = "";
      chatWindow.style.visibility = "visible";
      chatWindow.style.opacity = "1";
    }
    if (isChatOpenedFromUrl && chatEmptyState) {
      chatEmptyState.classList.add("hidden");
      chatEmptyState.style.display = "none";
    }
  } finally {
    hideChatSkeleton();
  }
}

// Экспортируем loadChat в window для использования в других модулях
window.loadChat = loadChat;
window.renderMessage = renderMessage;

// Предзагрузка по hover/focus списка чатов
document.querySelectorAll(".chat-list-item-btn").forEach((btn) => {
  const cid = btn.dataset.chatId;
  btn.addEventListener("mouseenter", () => prefetchChat(cid));
  btn.addEventListener("focus", () => prefetchChat(cid));
});

// ===========================
// === БЛОКИРОВКА ПОЛЬЗОВАТЕЛЯ В ЧАТЕ ===
// ===========================

/**
 * Обновляет UI в зависимости от состояния блокировки в текущем чате.
 * blockState:
 *   - null/undefined  — блокировок нет
 *   - { blocked_by_me: bool, blocked_me: bool }
 */
function updateBlockButtons(blockState) {
  const hasState = !!blockState;
  const blockedByMe =
    hasState &&
    (blockState.blocked_by_me === true || blockState.user_view_blocked === true);
  const blockedMe =
    hasState &&
    (blockState.blocked_me === true || blockState.other_view_blocked === true);

  // Блокировка доступна ТОЛЬКО в личных чатах (в группах — отключена полностью)
  if (currentChatIsGroup === true || window.CURRENT_CHAT_DATA?.is_group === true || window.CURRENT_CHAT_DATA?.chat_type === "group") {
    if (chatUnblockContainer) chatUnblockContainer.classList.add("hidden");
    if (messageForm) messageForm.style.display = "";
    if (messageInput) {
      messageInput.disabled = false;
      // восстанавливаем placeholder на всякий случай
      messageInput.placeholder = messageInput.dataset.originalPlaceholder || messageInput.placeholder;
    }
    if (blockUserBtn) {
      blockUserBtn.style.display = "none";
      blockUserBtn.textContent = "Заблокировать";
    }
    window.CURRENT_CHAT_BLOCK_STATE = { blockedByMe: false, blockedMe: false };
    return;
  } else {
    // В личных чатах пункт меню должен быть видимым
    if (blockUserBtn) blockUserBtn.style.display = "";
  }

  // Если нет активного чата или собеседника, сбрасываем UI
  if (!window.CURRENT_CHAT_DATA || !window.CURRENT_CHAT_DATA.interlocutor_email) {
    if (chatUnblockContainer) chatUnblockContainer.classList.add("hidden");
    if (messageForm) messageForm.style.display = "";
    if (messageInput) {
      messageInput.disabled = false;
    }
    if (blockUserBtn) {
      blockUserBtn.textContent = "Заблокировать";
    }
    return;
  }

  // Я заблокировал собеседника: прячем поле ввода, показываем кнопку "Разблокировать" в шапке
  if (blockedByMe) {
    if (messageForm) {
      messageForm.style.display = "none";
    }
    if (chatUnblockContainer) {
      chatUnblockContainer.classList.remove("hidden");
    }
    if (messageInput) {
      messageInput.disabled = true;
      messageInput.value = "";
    }
    if (blockUserBtn) {
      blockUserBtn.textContent = "Разблокировать";
    }
  } else {
    // Я не блокирую собеседника
    if (chatUnblockContainer) {
      chatUnblockContainer.classList.add("hidden");
    }
    if (messageForm) {
      messageForm.style.display = "";
    }
    if (messageInput) {
      messageInput.disabled = false;
    }
    if (blockUserBtn) {
      blockUserBtn.textContent = "Заблокировать";
    }
  }

  // Если собеседник заблокировал меня — не даём отправлять сообщения
  if (blockedMe && !blockedByMe) {
    if (messageForm) {
      messageForm.style.display = "";
    }
    if (messageInput) {
      messageInput.disabled = true;
      messageInput.placeholder = "Вы не можете отправлять сообщения: пользователь вас заблокировал";
    }
    if (chatUnblockContainer) {
      chatUnblockContainer.classList.add("hidden");
    }
  } else if (!blockedByMe && messageInput) {
    // Восстанавливаем placeholder, если блокировка снята
    messageInput.placeholder = messageInput.dataset.originalPlaceholder || messageInput.placeholder;
  }

  window.CURRENT_CHAT_BLOCK_STATE = { blockedByMe, blockedMe };
}

async function refreshBlockStatus() {
  if (!activeChatId || !window.CURRENT_CHAT_DATA?.interlocutor_email) return;
  if (currentChatIsGroup) return;

  try {
    const resp = await fetch(`${API_BASE_URL}/api/check_block_status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        user_id: window.CURRENT_CHAT_DATA.interlocutor_email,
        chat_id: activeChatId,
      }),
    });
    if (!resp.ok) {
      console.warn("Не удалось получить статус блокировки для чата", activeChatId);
      return;
    }
    const data = await resp.json();
    const state = {
      blocked_by_me: !!data.user_view_blocked,
      blocked_me: !!data.other_view_blocked,
      // Добавляем поля для совместимости с форматом сервера
      user_view_blocked: !!data.user_view_blocked,
      other_view_blocked: !!data.other_view_blocked,
    };
    console.log("[refreshBlockStatus] Обновляем состояние блокировки:", state);
    updateBlockButtons(state);
  } catch (e) {
    console.warn("Ошибка обновления статуса блокировки:", e);
  }
}

if (blockUserBtn) {
  blockUserBtn.addEventListener("click", async () => {
    if (!activeChatId || !window.CURRENT_CHAT_DATA?.interlocutor_email) return;
    if (currentChatIsGroup) return;

    const currentState = window.CURRENT_CHAT_BLOCK_STATE || {};
    const alreadyBlocked = !!currentState.blockedByMe;
    const url = alreadyBlocked
      ? `${API_BASE_URL}/api/unblock_user`
      : `${API_BASE_URL}/api/block_user`;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: window.CURRENT_CHAT_DATA.interlocutor_email,
          chat_id: activeChatId,
        }),
      });
      if (!resp.ok) {
        let msg = "Не удалось изменить состояние блокировки";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        alert(msg);
        return;
      }

      await refreshBlockStatus();
    } catch (e) {
      console.error("Ошибка при изменении блокировки:", e);
      alert("Не удалось изменить состояние блокировки");
    }
  });
}

if (unblockUserBtn) {
  unblockUserBtn.addEventListener("click", async () => {
    if (!activeChatId || !window.CURRENT_CHAT_DATA?.interlocutor_email) return;
    if (currentChatIsGroup) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/api/unblock_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: window.CURRENT_CHAT_DATA.interlocutor_email,
          chat_id: activeChatId,
        }),
      });
      if (!resp.ok) {
        let msg = "Не удалось разблокировать пользователя";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        alert(msg);
        return;
      }
      await refreshBlockStatus();
    } catch (e) {
      console.error("Ошибка при разблокировке:", e);
      alert("Не удалось разблокировать пользователя");
    }
  });
}

// ===========================
// === Отправка сообщений (без изменений) ===
// ===========================

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!activeChatId) {
    console.warn("Не выбран активный чат, activeChatId:", activeChatId);
    return;
  }
  const text = messageInput.value.trim();
  if (!text) return;
  
  console.log("Отправка сообщения в чат:", activeChatId, "Текст:", text);
  
  // Очищаем черновик при отправке
  clearDraft(activeChatId);

  // Если редактируем сообщение
  if (editingMessageId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/edit_message/${editingMessageId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка редактирования сообщения");
      }
      const result = await response.json();
      // Обновляем сообщение в DOM
      const msgEl = document.querySelector(
        `.message[data-message-id="${editingMessageId}"]`
      );
      if (msgEl) {
        const contentEl = msgEl.querySelector(".message-content");
        if (contentEl) contentEl.textContent = text;
        // Добавляем метку "изменено"
        let editedLabel = msgEl.querySelector(".message-edited");
        if (!editedLabel) {
          editedLabel = document.createElement("span");
          editedLabel.classList.add("message-edited");
          editedLabel.style.fontSize = "11px";
          editedLabel.style.color = "var(--color-text-inactive)";
          editedLabel.textContent = "изменено";
          const meta = msgEl.querySelector(".message-meta");
          if (meta) meta.appendChild(editedLabel);
        }
      }
      messageInput.value = "";
      editingMessageId = null;
      hideReplyPreview();
      toggleSendButton();
      updateInputState();
    } catch (err) {
      console.error("Ошибка при редактировании:", err);
      alert("Не удалось отредактировать сообщение");
    }
    return;
  }

  // Обычная отправка сообщения
  messageInput.value = "";
  toggleSendButton();
  updateChatPreview(activeChatId, text);
  moveChatToTop(activeChatId);
  const submitBtn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
  );
  if (submitBtn) submitBtn.dataset.lastSenderEmail = currentUserEmail;
  setChatListTicks(activeChatId, "sent");

  // Извлекаем упоминания из текста
  const mentions = extractMentions(text);
  
  const fd = new FormData();
  fd.append("message_content", text);
  if (replyingToMessage) {
    fd.append("reply_to_id", replyingToMessage._id);
  }
  // Добавляем упоминания, если они есть
  if (mentions.length > 0) {
    fd.append("mentions", JSON.stringify(mentions));
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/send_message/${activeChatId}`,
      {
        method: "POST",
        body: fd,
      }
    );
    if (!response.ok) {
      console.error("Ошибка отправки, ставим 'sent' по умолчанию");
      setChatListTicks(activeChatId, "sent");
      throw new Error("Ошибка отправки сообщения");
    }
    replyingToMessage = null;
    hideReplyPreview();
  } catch (err) {
    console.error("Ошибка при отправке:", err);
  }

  // Закрываем панель эмодзи при отправке
  const emojiPicker = document.getElementById("emojiPicker");
  if (emojiPicker) {
    emojiPicker.classList.add("hidden");
  }

  // Обновляем состояние кнопок
  updateInputState();
});

// -----------------------------
// === ПРЕДПРОСМОТР И ОТПРАВКА ===
// -----------------------------
// Вставьте этот блок рядом с существующими функциями (например после sendFile или вверху initAttachmentHandlers)
// (1) Обновлённая sendFile: принимает необязательный caption
async function sendFile(file, chatId, caption = "") {
  if (!chatId || !file) {
    console.error("Не указан chatId или файл");
    if (!chatId) alert("Пожалуйста, выберите чат для отправки файла");
    return;
  }
  const maxSize = 50 * 1024 * 1024; // 50 МБ
  if (file.size > maxSize) {
    alert(`Файл слишком большой. Максимальный размер: 50 МБ`);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    if (caption && caption.trim())
      formData.append("message_content", caption.trim());
    // reply_to сохраняется из глобального replyingToMessage, если нужно
    if (replyingToMessage)
      formData.append("reply_to_id", replyingToMessage._id);

    const response = await fetch(`${API_BASE_URL}/api/send_message/${chatId}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Ошибка отправки файла");
    }

    const result = await response.json();
    console.log("Файл успешно отправлен:", result);

    // Обновляем preview списка чатов
    let previewText = file.name || "Файл";
    if (file.type && file.type.startsWith("image/"))
      previewText = "Фотография";
    else if (file.type && file.type.startsWith("video/"))
      previewText = "Видео";

    updateChatPreview(chatId, previewText);
    moveChatToTop(chatId);

    const submitBtn = document.querySelector(
      `.chat-list-item-btn[data-chat-id="${chatId}"]`
    );
    if (submitBtn) submitBtn.dataset.lastSenderEmail = currentUserEmail;
    setChatListTicks(chatId, "sent");

    messageInput.value = "";
    toggleSendButton();
    updateInputState();
    attachmentMenu.classList.add("hidden");
  } catch (error) {
    console.error("Ошибка при отправке файла:", error);
    alert(`Не удалось отправить файл: ${error.message}`);
  }
}

// (2) Функция, создающая модалку предпросмотра (single/multiple)
function openFilePreviewModal(files) {
  if (!files || files.length === 0) return;

  // Создаём затемнённый фон
  const overlay = document.createElement("div");
  overlay.className = "file-preview-overlay";
  overlay.style.position = "fixed";
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.zIndex = 11000;
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.padding = "20px";

  // Контейнер модалки
  const modal = document.createElement("div");
  modal.className = "file-preview-modal";
  modal.style.maxWidth = "920px";
  modal.style.width = "100%";
  modal.style.maxHeight = "90vh";
  modal.style.overflow = "auto";
  modal.style.background = "var(--color-surface, #fff)";
  modal.style.borderRadius = "12px";
  modal.style.padding = "16px";
  modal.style.boxShadow = "0 10px 40px rgba(0,0,0,0.4)";

  // Заголовок + кнопка закрыть
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "12px";
  const h = document.createElement("h3");
  h.textContent =
    files.length > 1
      ? `Отправить ${files.length} файлов`
      : "Предпросмотр файла";
  h.style.margin = 0;
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "×";
  closeBtn.style.fontSize = "22px";
  closeBtn.style.border = "none";
  closeBtn.style.background = "transparent";
  closeBtn.style.cursor = "pointer";
  header.appendChild(h);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // Список превью
  const list = document.createElement("div");
  list.style.display = "grid";
  list.style.gridTemplateColumns = "1fr";
  list.style.gap = "12px";

  const fileItems = []; // { file, captionInput }

  files.forEach((file, idx) => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.gap = "12px";
    item.style.alignItems = "flex-start";
    item.style.padding = "8px";
    item.style.border = "1px solid rgba(0,0,0,0.06)";
    item.style.borderRadius = "8px";

    const previewWrap = document.createElement("div");
    previewWrap.style.width = "160px";
    previewWrap.style.flex = "0 0 160px";
    previewWrap.style.maxHeight = "120px";
    previewWrap.style.display = "flex";
    previewWrap.style.alignItems = "center";
    previewWrap.style.justifyContent = "center";
    previewWrap.style.overflow = "hidden";
    previewWrap.style.borderRadius = "8px";
    previewWrap.style.background = "rgba(0,0,0,0.03)";

    // Рендер превью в зависимости от типа
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.style.maxWidth = "100%";
      img.style.maxHeight = "120px";
      img.style.objectFit = "cover";
      img.src = URL.createObjectURL(file);
      previewWrap.appendChild(img);
    } else if (file.type.startsWith("video/")) {
      const vid = document.createElement("video");
      vid.style.maxWidth = "100%";
      vid.style.maxHeight = "120px";
      vid.src = URL.createObjectURL(file);
      vid.controls = true;
      previewWrap.appendChild(vid);
    } else {
      const icon = document.createElement("div");
      icon.textContent = "📎";
      icon.style.fontSize = "36px";
      previewWrap.appendChild(icon);
    }

    const meta = document.createElement("div");
    meta.style.flex = "1";
    meta.style.display = "flex";
    meta.style.flexDirection = "column";

    const name = document.createElement("div");
    name.textContent = file.name || `Файл ${idx + 1}`;
    name.style.fontWeight = 600;
    name.style.marginBottom = "6px";
    name.style.whiteSpace = "nowrap";
    name.style.overflow = "hidden";
    name.style.textOverflow = "ellipsis";

    const captionInput = document.createElement("input");
    captionInput.type = "text";
    captionInput.placeholder = "Добавить подпись (необязательно)";
    captionInput.style.width = "100%";
    captionInput.style.padding = "8px";
    captionInput.style.border = "1px solid rgba(0,0,0,0.1)";
    captionInput.style.borderRadius = "6px";

    meta.appendChild(name);
    meta.appendChild(captionInput);

    item.appendChild(previewWrap);
    item.appendChild(meta);
    list.appendChild(item);

    fileItems.push({ file, captionInput });
  });

  modal.appendChild(list);

  // Кнопки: Отправить и Отмена
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.justifyContent = "flex-end";
  actions.style.gap = "8px";
  actions.style.marginTop = "12px";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = "Отмена";
  cancel.style.padding = "8px 12px";
  cancel.style.borderRadius = "8px";
  cancel.style.border = "1px solid rgba(0,0,0,0.08)";
  cancel.style.background = "transparent";
  cancel.style.cursor = "pointer";

  const sendAll = document.createElement("button");
  sendAll.type = "button";
  sendAll.textContent =
    files.length > 1 ? `Отправить все (${files.length})` : "Отправить";
  sendAll.style.padding = "8px 14px";
  sendAll.style.borderRadius = "8px";
  sendAll.style.border = "none";
  sendAll.style.background = "var(--color-primary, #2f80ed)";
  sendAll.style.color = "#fff";
  sendAll.style.cursor = "pointer";

  actions.appendChild(cancel);
  actions.appendChild(sendAll);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Фокус на первом инпуте подписи
  const firstInput = fileItems[0] && fileItems[0].captionInput;
  if (firstInput) firstInput.focus();

  // Обработчики
  function closeModal() {
    // очистка blob URLs
    fileItems.forEach(({ file }) => {
      try {
        URL.revokeObjectURL(file && file.preview);
      } catch (_) {}
    });
    document.body.removeChild(overlay);
  }
  closeBtn.addEventListener("click", closeModal);
  cancel.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  sendAll.addEventListener("click", async () => {
    // Деактивируем кнопку, чтобы избежать дублей
    sendAll.disabled = true;
    sendAll.textContent = "Отправка...";
    try {
      // Отправляем по очереди (чтобы не перегружать сеть)
      for (const item of fileItems) {
        const caption = item.captionInput.value || "";
        await sendFile(item.file, activeChatId, caption);
      }
    } catch (err) {
      console.error("Ошибка отправки из превью:", err);
      alert("Ошибка при отправке одного из файлов");
    } finally {
      closeModal();
    }
  });
}

// ===========================
// === Работа со списком чатов (ОБНОВЛЕНО) ===
// ===========================

if (chatListUl) {
  chatListUl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".chat-list-item-btn");
    if (!btn) return;
    const chatId = btn.dataset.chatId;
    if (!chatId) return;

    // Если установлен флаг показа пустого состояния, показываем его вместо загрузки чата
    // НО: НИКОГДА не закрываем чат, если он открыт по URL
    if (shouldShowEmptyState && !isChatOpenedFromUrl && !activeChatId) {
      shouldShowEmptyState = false;
      // Убираем выделение со всех чатов
      document
        .querySelectorAll(".chat-list-item-btn")
        .forEach((b) => b.classList.remove("active"));
      // Показываем пустое состояние
      // НО: НИКОГДА не закрываем чат, если он открыт по URL
      if (!isChatOpenedFromUrl || !activeChatId) {
        chatWindow.classList.add("hidden");
        chatEmptyState.classList.remove("hidden");
        activeChatId = null;
      } else {
        console.log("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат через shouldShowEmptyState, но чат открыт по URL");
      }
      // Устанавливаем пустой заголовок страницы для списка чатов
      document.title = "";
      // Закрываем профиль, если он открыт
      if (profileSection && !profileSection.classList.contains("hidden")) {
        closeProfileModal();
      }
      return;
    }

    // Telegram логика: сначала обновляем URL, потом открываем чат
    // URL = единственный источник правды
    setUnreadCount(chatId, 0);
    document
      .querySelectorAll(".chat-list-item-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // ВАЖНО: Сначала обновляем URL (как в Telegram)
    updateUrlForChat(btn);

    // Затем загружаем чат (loadChat покажет окно чата)
    await loadChat(chatId);
    
    // Дополнительная гарантия: показываем окно чата
    if (chatWindow) chatWindow.classList.remove("hidden");
    if (chatEmptyState) chatEmptyState.classList.add("hidden");
    
    if (window.matchMedia("(max-width:900px)").matches) {
      if (chatListAside) chatListAside.classList.add("view-hidden");
      if (chatWindow) chatWindow.classList.add("view-active");
    }
  });
}

// === ИЗМЕНЕНИЕ: Логика кнопки "Назад" для десктопа и мобильных ===
backToChatListBtn.addEventListener("click", () => {
  // Сбрасываем флаг открытия по URL при нажатии "Назад"
  // (пользователь явно хочет вернуться к списку чатов)
  const wasOpenedFromUrl = isChatOpenedFromUrl;
  isChatOpenedFromUrl = false;
  isProtectionActive = false; // Отключаем защиту
  if (protectionInterval) {
    clearInterval(protectionInterval);
    protectionInterval = null;
  }
  if (protectionObserver) {
    protectionObserver.disconnect();
    protectionObserver = null;
  }
  
  // Сначала убираем выделение с активного чата в списке
  const currentActiveBtn = document.querySelector(".chat-list-item-btn.active");
  if (currentActiveBtn) {
    currentActiveBtn.classList.remove("active");
  }

  // Закрываем поиск в чате
  closeChatSearch();

  // Очищаем поиск в списке чатов и показываем полный список
  if (searchInput) {
    searchInput.value = "";
    filterChatList("");
  }
  if (searchClearBtn) {
    searchClearBtn.classList.add("hidden");
  }
  // Скрываем результаты поиска пользователей
  if (userSearchResultsUl) {
    userSearchResultsUl.style.display = "none";
    userSearchResultsUl.innerHTML = "";
  }
  // Показываем список чатов
  if (chatListUl) {
    chatListUl.style.display = "block";
  }

  if (window.matchMedia("(max-width: 900px)").matches) {
    // --- Мобильная логика: ---
    // Показываем список чатов, скрываем окно чата
    chatListAside.classList.remove("view-hidden");
    chatWindow.classList.remove("view-active");
  } else {
    // --- Десктопная логика: ---
    // ВСЕГДА показываем пустое состояние (картинку с надписью) при нажатии "Назад"
    // Это нормальное поведение - пользователь хочет вернуться к списку чатов
    if (chatWindow) {
      chatWindow.classList.add("hidden");
      chatWindow.style.display = "";
    }
    if (chatEmptyState) {
      chatEmptyState.classList.remove("hidden");
      chatEmptyState.style.display = "";
      chatEmptyState.style.visibility = "visible";
      chatEmptyState.style.opacity = "1";
    }
    activeChatId = null;
  }
  
  // Устанавливаем пустой заголовок страницы для списка чатов
  document.title = "";
  
  // Возвращаемся на общий список чатов: /
  const basePath = "/";
  if (window.location.pathname !== basePath) {
    history.replaceState(
      null,
      "",
      `${basePath}${window.location.search}`
    );
  }
  
  // Закрываем профиль, если он открыт
  if (profileSection && !profileSection.classList.contains("hidden")) {
    closeProfileModal();
  }
});
// === КОНЕЦ ИЗМЕНЕНИЯ ===

function updateChatPreview(chatId, text) {
  // ... (без изменений) ...
  const btn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  if (!btn) return;
  
  // Не обновляем превью, если есть черновик (черновик имеет приоритет)
  if (btn.dataset.hasDraft === "true") {
    return;
  }
  const lastMsg = btn.querySelector(".last-message");
  if (lastMsg) {
    const newText = text || "Новое сообщение";
    lastMsg.textContent = newText;
    lastMsg.dataset.originalText = newText;
    lastMsg.classList.remove("typing-status");
  }
  const newTimestamp = new Date().toISOString();
  const timeEl = btn.querySelector(".chat-list-time");
  if (timeEl) {
    timeEl.textContent = formatTime(newTimestamp);
  }
  btn.dataset.lastTimestamp = newTimestamp;
}

function moveChatToTop(chatId) {
  // ... (без изменений) ...
  const btn = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  if (!btn) return;
  const li = btn.closest("li");
  const firstChatItem = chatListUl.querySelector("li .chat-list-item-btn");
  if (firstChatItem) {
    chatListUl.insertBefore(li, firstChatItem.closest("li"));
  } else {
    chatListUl.prepend(li);
  }
}

// ===========================
// === Инициализация (ОБНОВЛЕНО) ===
// ===========================

messageInput.addEventListener("input", (e) => {
  toggleSendButton();
  updateInputState(); // Добавлен вызов updateInputState

  if (!attachmentMenu.classList.contains("hidden")) {
    attachmentMenu.classList.add("hidden");
  }
  sendTypingEvent();
  
  // Обработка упоминаний через @
  handleMentionsInput(e);
  
  // Сохраняем черновик при вводе
  if (activeChatId && messageInput) {
    saveDraft(activeChatId, messageInput.value);
  }
});

// Обработка клавиатуры для упоминаний
messageInput.addEventListener("keydown", (e) => {
  handleMentionsKeydown(e);
});
toggleSendButton();

attachmentIcon.addEventListener("click", (e) => {
  e.stopPropagation();

  // Закрываем панель эмодзи если открыта
  const emojiPicker = document.getElementById("emojiPicker");
  if (emojiPicker && !emojiPicker.classList.contains("hidden")) {
    emojiPicker.classList.add("hidden");
    updateInputState();
  }

  attachmentMenu.classList.toggle("hidden");
});

// === Инициализация обработчиков для вложений (после загрузки DOM) ===
// -----------------------------
// === ПОДКЛЮЧЕНИЕ К initAttachmentHandlers ===
// -----------------------------
// Замените обработчики выбора в initAttachmentHandlers на вызов превью:
function initAttachmentHandlers() {
  const fileInput = document.getElementById("fileInput");
  const imageVideoInput = document.getElementById("imageVideoInput");
  const photoVideoBtn = document.getElementById("photoVideoBtn");
  const fileBtn = document.getElementById("fileBtn");

  if (photoVideoBtn && imageVideoInput) {
    photoVideoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      attachmentMenu.classList.add("hidden");
      imageVideoInput.click();
    });
  }
  if (fileBtn && fileInput) {
    fileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      attachmentMenu.classList.add("hidden");
      fileInput.click();
    });
  }

  if (imageVideoInput) {
    imageVideoInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files).filter(Boolean);
      if (files.length > 0 && activeChatId) {
        // вместо мгновенной отправки — показываем превью
        openFilePreviewModal(files);
        e.target.value = "";
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && activeChatId) {
        openFilePreviewModal([file]);
        e.target.value = "";
      }
    });
  }
}

document.addEventListener("click", (e) => {
  // ... (без изменений) ...
  if (!attachmentMenu.contains(e.target) && e.target !== attachmentIcon) {
    if (!attachmentMenu.classList.contains("hidden")) {
      attachmentMenu.classList.add("hidden");
    }
  }
});

// === ИСПРАВЛЕНИЕ 3: Более надежный фикс бага с "1 непрочитанным" ===
function markActiveChatAsRead() {
  if (activeChatId) {
    // Принудительно сбрасываем счетчик на клиенте
    setUnreadCount(activeChatId, 0);

    // И отправляем на сервер "я прочитал", на всякий случай
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "mark_as_read", chat_id: activeChatId }));
    }
  }
}

// 1. При возвращении на вкладку
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    markActiveChatAsRead();
  }
});

// 2. При фокусе окна (на случай, если вкладка была видна, но не в фокусе)
window.addEventListener("focus", () => {
  markActiveChatAsRead();
});
// === КОНЕЦ ИСПРАВЛЕНИЯ 3 ===

// ===========================
// === Запись аудио (новое) ===
// ===========================
function stopWaveDraw() {
  if (rafWave) {
    cancelAnimationFrame(rafWave);
    rafWave = null;
  }
}

let waveformAnimationId = null;

function startWaveformAnimation() {
  const voiceWaveformRecording = document.getElementById("voiceWaveformRecording");
  if (!voiceWaveformRecording) return;
  
  // Очищаем содержимое
  voiceWaveformRecording.innerHTML = '';
  
  // Создаем полоски для визуализации (белые полоски на синем фоне) - как в отправленных сообщениях
  const numBars = 40;
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement("div");
    bar.classList.add("audio-wave-bar");
    bar.style.width = "5px";
    bar.style.height = "5px";
    bar.style.background = "#FFFFFF";
    bar.style.borderRadius = "2.5px";
    bar.style.transition = "height 0.1s ease, opacity 0.1s ease";
    bar.style.opacity = "0.5";
    voiceWaveformRecording.appendChild(bar);
  }
  
  const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
  const bars = voiceWaveformRecording.querySelectorAll(".audio-wave-bar");
  
  function animate() {
    if (!recordingStartTs) {
      if (waveformAnimationId) {
        cancelAnimationFrame(waveformAnimationId);
        waveformAnimationId = null;
      }
      return;
    }
    
    if (analyser && dataArray) {
      // Получаем данные частотного анализа
      analyser.getByteFrequencyData(dataArray);
      
      // Берем несколько частотных диапазонов для создания волны
      const step = Math.floor(dataArray.length / numBars);
      
      bars.forEach((bar, index) => {
        const dataIndex = Math.min(index * step, dataArray.length - 1);
        const value = dataArray[dataIndex] / 255; // Нормализуем 0-1
        
        // Высота полоски зависит от громкости (от 5px до 25px)
        const height = 5 + value * 20;
        bar.style.height = `${Math.max(5, Math.min(25, height))}px`;
        bar.style.opacity = "1";
      });
    } else {
      // Fallback: простая анимация
      bars.forEach((bar) => {
        const height = 5 + Math.random() * 20;
        bar.style.height = `${Math.max(5, Math.min(25, height))}px`;
        bar.style.opacity = "1";
      });
    }
    
    waveformAnimationId = requestAnimationFrame(animate);
  }
  
  animate();
}

function stopWaveformAnimation() {
  if (waveformAnimationId) {
    cancelAnimationFrame(waveformAnimationId);
    waveformAnimationId = null;
  }
  const voiceWaveformRecording = document.getElementById("voiceWaveformRecording");
  if (voiceWaveformRecording) {
    const bars = voiceWaveformRecording.querySelectorAll(".audio-wave-bar");
    bars.forEach((bar) => {
      bar.style.height = "5px";
      bar.style.opacity = "0.5";
    });
  }
}

function updateRecordingTimer() {
  const elapsed = Math.floor((Date.now() - recordingStartTs) / 1000);
  voiceTimerEl.textContent = formatDuration(elapsed);
}
async function startRecording() {
  // Проверка secure context: getUserMedia требует HTTPS или localhost
  if (
    !window.isSecureContext &&
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1"
  ) {
    alert(
      "Доступ к микрофону заблокирован: откройте сайт по HTTPS или через http://localhost."
    );
    return;
  }
  // Явная проверка Permissions API (если поддерживается)
  try {
    if (navigator.permissions && navigator.permissions.query) {
      const res = await navigator.permissions.query({ name: "microphone" });
      if (res.state === "denied") {
        alert(
          "Доступ к микрофону запрещён в настройках браузера. Разрешите доступ в настройках сайта и попробуйте снова."
        );
        return;
      }
    }
  } catch (_) {
    // Игнорируем, не все браузеры поддерживают
  }

  // Пытаемся запросить медиапоток с расширенными параметрами, затем с упрощёнными
  const tryGetStream = async () => {
    const advanced = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
        sampleRate: 48000,
      },
    };
    const simple = { audio: true };
    try {
      return await navigator.mediaDevices.getUserMedia(advanced);
    } catch (e1) {
      try {
        return await navigator.mediaDevices.getUserMedia(simple);
      } catch (e2) {
        throw e2;
      }
    }
  };

  try {
    mediaStream = await tryGetStream();
  } catch (e) {
    const msg = explainMicError(e);
    alert(msg);
    return;
  }
  audioChunks = [];
  isCancelling = false;
  
  // Показываем кнопку записи и скрываем форму ввода
  if (voiceRecordingButton) voiceRecordingButton.classList.remove("hidden");
  if (chatInputForm) chatInputForm.classList.add("hidden");
  
  // Микрофон остается без изменений
  
  recordingStartTs = Date.now();
  updateRecordingTimer();
  recordingTimerId = setInterval(updateRecordingTimer, 250);
  
  // Инициализируем Web Audio API для анализа аудио
  if (mediaStream && !audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      
      sourceNode = audioContext.createMediaStreamSource(mediaStream);
      sourceNode.connect(analyser);
    } catch (e) {
      console.error("Ошибка инициализации Web Audio API:", e);
    }
  }
  
  // Запускаем визуализацию волны при записи
  startWaveformAnimation();

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
    ? "audio/ogg;codecs=opus"
    : "";
  try {
    mediaRecorder = new MediaRecorder(
      mediaStream,
      mimeType ? { mimeType } : undefined
    );
  } catch (e) {
    alert(
      "Запись не поддерживается в этом браузере. Попробуйте другой браузер (Chrome/Firefox/Safari 14+)."
    );
    stopRecording(true);
    return;
  }
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) audioChunks.push(e.data);
  };
  mediaRecorder.onstop = async () => {
    try {
      // Проверяем, что есть данные для отправки
      if (audioChunks.length === 0) {
        console.warn("Нет данных для отправки");
        cleanupRecording();
        return;
      }
      
      const blob = new Blob(audioChunks, { type: mimeType || "audio/webm" });
      
      // Проверяем размер файла
      if (blob.size === 0) {
        console.warn("Файл пуст");
        cleanupRecording();
        return;
      }
      
      let durationSec = Math.floor((Date.now() - recordingStartTs) / 1000);
      
      // Проверяем условия отмены
      if (isCancelling || durationSec <= 0 || !activeChatId) {
        cleanupRecording();
        return;
      }
      
      // Минимальная длительность - 0.5 секунды
      if (durationSec < 0.5) {
        console.warn("Запись слишком короткая");
        cleanupRecording();
        return;
      }
      
      // Создаем FormData
      const fd = new FormData();
      const fileName = `voice_${Date.now()}.webm`;
      const audioFile = new File([blob], fileName, { type: blob.type || "audio/webm" });
      
      fd.append("file", audioFile);
      fd.append("duration", String(durationSec));
      
      console.log(`Отправка голосового сообщения: размер=${blob.size} байт, длительность=${durationSec} сек`);
      
      // Отправляем на сервер
      const resp = await fetch(
        `${API_BASE_URL}/api/upload_audio/${activeChatId}`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        }
      );
      
      if (!resp.ok) {
        let errorMessage = "Ошибка отправки голосового сообщения";
        try {
          const err = await resp.json();
          errorMessage = err.detail || err.message || errorMessage;
        } catch (e) {
          errorMessage = `Ошибка ${resp.status}: ${resp.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Получаем данные сообщения от сервера
      const result = await resp.json();
      if (!result || !result.message_data) {
        throw new Error("Сервер не вернул данные сообщения");
      }
      
      const messageData = result.message_data;
      
      // Преобразуем timestamp если это строка
      if (typeof messageData.timestamp === 'string') {
        messageData.timestamp = new Date(messageData.timestamp);
      }
      
      // Убеждаемся, что есть sender_email для правильного отображения
      if (!messageData.sender_email && messageData.sender_id) {
        messageData.sender_email = messageData.sender_id;
      }
      
      // Убеждаемся, что есть все необходимые поля для аудио
      if (messageData.type === "audio") {
        if (!messageData.file_url) {
          console.error("Аудио сообщение без file_url:", messageData);
          throw new Error("Сервер не вернул URL файла");
        }
        if (!messageData.audio_duration || messageData.audio_duration <= 0) {
          messageData.audio_duration = Math.max(1.0, durationSec); // Используем реальную длительность
        }
      }
      
      // Добавляем сообщение в чат
      if (messageData.chat_id === activeChatId) {
        renderMessage(messageData, true, currentChatIsGroup); // Передаем флаг группового чата
        
        // Отмечаем как прочитанное
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({ type: "mark_as_read", chat_id: activeChatId })
          );
        }
      }
      
      console.log("Голосовое сообщение успешно отправлено");
      
    } catch (e) {
      console.error("Ошибка отправки голосового сообщения:", e);
      alert(e.message || "Ошибка отправки голосового сообщения");
    } finally {
      cleanupRecording();
    }
  };
  mediaRecorder.start(100);
}
function cleanupRecording() {
  // Скрываем кнопку записи и показываем форму ввода
  if (voiceRecordingButton) voiceRecordingButton.classList.add("hidden");
  if (chatInputForm) chatInputForm.classList.remove("hidden");
  
  // Микрофон остается без изменений
  
  // Останавливаем анимацию волны
  stopWaveformAnimation();
  
  clearInterval(recordingTimerId);
  recordingTimerId = null;
  stopWaveDraw();
  if (sourceNode) {
    try {
      sourceNode.disconnect();
    } catch (_) {}
    sourceNode = null;
  }
  if (analyser) analyser = null;
  if (audioContext) {
    try {
      audioContext.close();
    } catch (_) {}
    audioContext = null;
  }
  if (mediaRecorder) {
    if (mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch (_) {}
    }
    mediaRecorder = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
  audioChunks = [];
  isCancelling = false;
  recordingStartTs = 0;
}
function stopRecording(cancel = false) {
  isCancelling = cancel;
  try {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      cleanupRecording();
    }
  } catch (e) {
    cleanupRecording();
  }
}
// Press-and-hold + swipe-to-cancel
if (micIcon) {
  const start = (clientX) => {
    startPointerX = clientX;
    startRecording();
  };
  const move = (clientX) => {
    if (!voiceRecordingButton || !recordingStartTs) return;
    const dx = clientX - startPointerX;
    // свайп влево для отмены
    isCancelling = dx < -60;
    if (voiceRecordingButton) {
      voiceRecordingButton.classList.toggle("cancelling", isCancelling);
    }
  };
  const end = () => {
    stopRecording(isCancelling);
  };
  // Mouse
  micIcon.addEventListener("mousedown", (e) => {
    e.preventDefault();
    start(e.clientX);
    const onMove = (ev) => move(ev.clientX);
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      end();
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
  // Touch
  micIcon.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      start(t.clientX);
    },
    { passive: true }
  );
  micIcon.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      move(t.clientX);
    },
    { passive: true }
  );
  micIcon.addEventListener("touchend", () => end(), { passive: true });
}

// Детальная расшифровка ошибок микрофона
function explainMicError(err) {
  const name = (err && (err.name || err.code)) || "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Доступ к микрофону запрещён. Разрешите доступ в настройках сайта и перезагрузите страницу.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "Микрофон не найден. Проверьте, что микрофон подключён и не занят другим приложением.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "Не удалось получить доступ к микрофону. Возможно, он используется другим приложением.";
  }
  if (
    name === "OverconstrainedError" ||
    name === "ConstraintNotSatisfiedError"
  ) {
    return "Требуемые параметры микрофона недоступны. Попробуйте другой микрофон.";
  }
  if (name === "SecurityError") {
    return "Браузер заблокировал доступ к микрофону. Откройте сайт по HTTPS или через localhost.";
  }
  return "Не удалось получить доступ к микрофону. Проверьте разрешения и попробуйте снова.";
}

// ===========================
// === Функции для ответа и редактирования ===
// ===========================

function showReplyPreview(senderName, content, isEdit) {
  if (!replyPreview || !replyPreviewInfo) return;
  replyPreviewInfo.innerHTML = isEdit
    ? `<strong>Редактирование:</strong> ${content.substring(0, 50)}${
        content.length > 50 ? "..." : ""
      }`
    : `<strong>Ответ ${senderName}:</strong> ${content.substring(0, 50)}${
        content.length > 50 ? "..." : ""
      }`;
  replyPreview.classList.remove("hidden");
}

function hideReplyPreview() {
  if (replyPreview) replyPreview.classList.add("hidden");
  replyingToMessage = null;
  editingMessageId = null;
}

if (replyPreviewClose) {
  replyPreviewClose.addEventListener("click", () => {
    messageInput.value = "";
    hideReplyPreview();
    toggleSendButton();
    updateInputState();
  });
}

// ===========================
// === Контекстное меню (без изменений) ===
// ===========================

let activeMessageElement = null;

function closeContextMenu() {
  if (activeMessageElement) {
    activeMessageElement.classList.remove("selected");
    activeMessageElement = null;
  }
  contextMenuOverlay.classList.add("hidden");
  messageContextMenu.classList.add("hidden");
}

function openDeleteConfirmModal() {
  if (!activeMessageElement || !deleteConfirmOverlay) return;

  const isOutgoing = activeMessageElement.classList.contains("outgoing");

  if (deleteForAllOption) {
    if (isOutgoing) {
      deleteForAllOption.classList.remove("disabled");
    } else {
      deleteForAllOption.classList.add("disabled");
    }
  }

  // позиционируем модалку слева от пункта "Удалить" в контекстном меню, как в Figma
  const modal = document.getElementById("deleteConfirmModal");
  const deleteItem = messageContextMenu.querySelector(".context-menu-item.delete");
  const deleteBtn = deleteItem ? deleteItem.querySelector("button") : null;

  if (modal && chatWindow && deleteBtn) {
    const containerRect = chatWindow.getBoundingClientRect();
    const deleteRect = deleteBtn.getBoundingClientRect();
    const modalRect = { width: 270, height: 96 }; // приблизительные размеры

    // по вертикали выравниваем по центру пункта "Удалить"
    let top = deleteRect.top - containerRect.top + deleteRect.height / 2 - modalRect.height / 2;
    // панель всегда слева от "Удалить"
    let left = deleteRect.left - containerRect.left - modalRect.width - 8;

    const padding = 10;
    const maxWidth = containerRect.width;
    const maxHeight = containerRect.height;

    if (left < padding) left = padding;
    if (left + modalRect.width + padding > maxWidth) {
      left = maxWidth - modalRect.width - padding;
    }
    if (top + modalRect.height + padding > maxHeight) {
      top = maxHeight - modalRect.height - padding;
    }

    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }

  deleteConfirmOverlay.style.pointerEvents = "auto";
  deleteConfirmOverlay.classList.remove("hidden");
}

function closeDeleteConfirmModal() {
  if (!deleteConfirmOverlay) return;
  deleteConfirmOverlay.style.pointerEvents = "none";
  deleteConfirmOverlay.classList.add("hidden");
}

function openClearChatConfirmModal() {
  console.log("Открываю модалку очистки чата, activeChatId:", activeChatId);
  
  if (!clearChatConfirmOverlay) {
    console.error("clearChatConfirmOverlay не найден!");
    alert("Ошибка: модалка не найдена");
    return;
  }
  
  if (!activeChatId) {
    alert("Нет активного чата для очистки");
    return;
  }
  
  // Позиционируем модалку относительно кнопки меню
  const modal = document.getElementById("clearChatConfirmModal");
  const menuBtn = document.getElementById("menuToggleBtn");
  
  if (modal && chatWindow && menuBtn) {
    const containerRect = chatWindow.getBoundingClientRect();
    const menuRect = menuBtn.getBoundingClientRect();
    const modalRect = { width: 270, height: 96 };
    
    let top = menuRect.top - containerRect.top + menuRect.height / 2 - modalRect.height / 2;
    let left = menuRect.left - containerRect.left - modalRect.width - 8;
    
    const padding = 10;
    const maxWidth = containerRect.width;
    const maxHeight = containerRect.height;
    
    if (left < padding) left = padding;
    if (left + modalRect.width + padding > maxWidth) {
      left = maxWidth - modalRect.width - padding;
    }
    if (top + modalRect.height + padding > maxHeight) {
      top = maxHeight - modalRect.height - padding;
    }
    
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }
  
  // Показываем модалку
  clearChatConfirmOverlay.style.pointerEvents = "auto";
  clearChatConfirmOverlay.style.display = "flex";
  clearChatConfirmOverlay.classList.remove("hidden");
  console.log("Модалка очистки чата открыта");
}

function closeClearChatConfirmModal() {
  if (!clearChatConfirmOverlay) return;
  clearChatConfirmOverlay.style.pointerEvents = "none";
  clearChatConfirmOverlay.style.display = "none";
  clearChatConfirmOverlay.classList.add("hidden");
  console.log("Модалка очистки чата закрыта");
}

function openDeleteChatConfirmModal() {
  console.log("Открываю модалку удаления чата, activeChatId:", activeChatId);
  
  if (!deleteChatConfirmOverlay) {
    console.error("deleteChatConfirmOverlay не найден!");
    alert("Ошибка: модалка не найдена");
    return;
  }
  
  if (!activeChatId) {
    alert("Нет активного чата для удаления");
    return;
  }
  
  // Позиционируем модалку относительно кнопки меню
  const modal = document.getElementById("deleteChatConfirmModal");
  const menuBtn = document.getElementById("menuToggleBtn");
  
  if (modal && chatWindow && menuBtn) {
    const containerRect = chatWindow.getBoundingClientRect();
    const menuRect = menuBtn.getBoundingClientRect();
    const modalRect = { width: 270, height: 96 };
    
    let top = menuRect.top - containerRect.top + menuRect.height / 2 - modalRect.height / 2;
    let left = menuRect.left - containerRect.left - modalRect.width - 8;
    
    const padding = 10;
    const maxWidth = containerRect.width;
    const maxHeight = containerRect.height;
    
    if (left < padding) left = padding;
    if (left + modalRect.width + padding > maxWidth) {
      left = maxWidth - modalRect.width - padding;
    }
    if (top + modalRect.height + padding > maxHeight) {
      top = maxHeight - modalRect.height - padding;
    }
    
    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;
  }
  
  // Показываем модалку
  deleteChatConfirmOverlay.style.pointerEvents = "auto";
  deleteChatConfirmOverlay.style.display = "flex";
  deleteChatConfirmOverlay.classList.remove("hidden");
  console.log("Модалка удаления чата открыта");
}

function closeDeleteChatConfirmModal() {
  if (!deleteChatConfirmOverlay) return;
  deleteChatConfirmOverlay.style.pointerEvents = "none";
  deleteChatConfirmOverlay.style.display = "none";
  deleteChatConfirmOverlay.classList.add("hidden");
  console.log("Модалка удаления чата закрыта");
}

function showContextMenu(e) {
  // ... (без изменений) ...
  e.preventDefault();
  const messageElement = e.target.closest(".message");
  if (!messageElement) {
    closeContextMenu();
    return;
  }
  closeContextMenu();
  activeMessageElement = messageElement;
  activeMessageElement.classList.add("selected");

  // Определяем, является ли сообщение нашим
  const isOutgoing = activeMessageElement.classList.contains("outgoing");

  // Скрываем/показываем кнопку "Изменить" в зависимости от того, наше ли это сообщение
  const editMenuItem = messageContextMenu.querySelector('[data-action="edit"]');
  if (editMenuItem) {
    if (isOutgoing) {
      editMenuItem.classList.remove("hidden");
    } else {
      editMenuItem.classList.add("hidden");
    }
  }

  contextMenuOverlay.classList.remove("hidden");
  messageContextMenu.style.visibility = "hidden";
  messageContextMenu.classList.remove("hidden");
  const menuWidth = messageContextMenu.offsetWidth;
  const menuHeight = messageContextMenu.offsetHeight;
  messageContextMenu.classList.add("hidden");
  messageContextMenu.style.visibility = "visible";
  const containerRect = chatWindow.getBoundingClientRect();
  const messageRect = activeMessageElement.getBoundingClientRect();
  let top = messageRect.bottom - containerRect.top + 8;
  let left;
  if (isOutgoing) {
    left = messageRect.right - containerRect.left - menuWidth;
  } else {
    left = messageRect.left - containerRect.left;
  }
  const padding = 10;
  if (left < padding) left = padding;
  if (left + menuWidth + padding > containerRect.width)
    left = containerRect.width - menuWidth - padding;
  if (top + menuHeight + padding > containerRect.height)
    top = messageRect.top - containerRect.top - menuHeight - 8;
  messageContextMenu.style.top = `${top}px`;
  messageContextMenu.style.left = `${left}px`;
  messageContextMenu.classList.remove("hidden");
}
chatMessages.addEventListener("contextmenu", showContextMenu);
contextMenuOverlay.addEventListener("click", closeContextMenu);
document.addEventListener("click", (e) => {
  if (!messageContextMenu.contains(e.target)) {
    closeContextMenu();
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !contextMenuOverlay.classList.contains("hidden")) {
    closeContextMenu();
  }
});
messageContextMenu.addEventListener("click", (e) => {
  // ... (без изменений) ...
  const actionButton = e.target.closest(".context-menu-item");
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  if (activeMessageElement) {
    const messageId = activeMessageElement.dataset.messageId;
    if (action === "copy") {
      const content = activeMessageElement.querySelector(".message-content");
      if (content) {
        navigator.clipboard.writeText(content.textContent);
      }
    }
    if (action === "reply") {
      // Находим сообщение в DOM и извлекаем данные
      const messageRow = activeMessageElement.closest(".message-row");
      const msgContent = activeMessageElement.querySelector(".message-content");
      const msgImage = activeMessageElement.querySelector(".message-image");
      const msgVideo = activeMessageElement.querySelector(".message-video");
      const msgFile = activeMessageElement.querySelector(
        ".message-file-container"
      );
      const msgAudio = activeMessageElement.querySelector(".audio-message");

      const msgSender = activeMessageElement.closest(".outgoing")
        ? currentUserEmail
        : null;
      const senderName = msgSender ? "Вы" : "Собеседник";

      // Определяем контент для ответа
      let contentText = "Сообщение";
      if (msgContent) {
        contentText = msgContent.textContent || "";
      } else if (msgImage) {
        contentText = "Фото";
      } else if (msgVideo) {
        contentText = "Видео";
      } else if (msgFile) {
        const fileNameEl = msgFile.querySelector("[data-filename]");
        contentText = fileNameEl
          ? fileNameEl.dataset.filename || fileNameEl.textContent
          : "Файл";
      } else if (msgAudio) {
        contentText = "Голосовое сообщение";
      }

      replyingToMessage = {
        _id: messageId,
        sender_id: msgSender || "other",
        content: contentText,
      };
      showReplyPreview(senderName, contentText, false);
      messageInput.focus();
    }
    if (action === "edit") {
      const isMine = activeMessageElement.classList.contains("outgoing");
      if (!isMine) {
        alert("Вы можете редактировать только свои сообщения.");
        closeContextMenu();
        return;
      }
      const msgContent = activeMessageElement.querySelector(".message-content");
      if (!msgContent) {
        alert("Это сообщение нельзя редактировать.");
        closeContextMenu();
        return;
      }
      editingMessageId = messageId;
      messageInput.value = msgContent.textContent;
      messageInput.focus();
      showReplyPreview("Редактирование", msgContent.textContent, true);
    }
    if (action === "delete") {
      if (messageId) {
        openDeleteConfirmModal();
      }
      return; // не закрываем контекстное меню через closeContextMenu, это делает модалка
    }
    if (action === "pin") {
      if (messageId) {
        pinMessage(messageId);
      }
    }
  }
  closeContextMenu();
});

// Обработчики модалки удаления
if (deleteConfirmOverlay) {
  deleteConfirmOverlay.addEventListener("click", (e) => {
    if (e.target === deleteConfirmOverlay) {
      closeDeleteConfirmModal();
      closeContextMenu();
    }
  });
}

if (deleteForAllOption) {
  deleteForAllOption.addEventListener("click", () => {
    if (!activeMessageElement) return;
    if (deleteForAllOption.classList.contains("disabled")) return;

    const messageId = activeMessageElement.dataset.messageId;
    if (!messageId) return;

    deleteMessage(messageId, true, activeMessageElement);
    closeDeleteConfirmModal();
    closeContextMenu();
  });
}

if (deleteForSelfOption) {
  deleteForSelfOption.addEventListener("click", () => {
    if (!activeMessageElement) return;
    const messageId = activeMessageElement.dataset.messageId;
    if (!messageId) return;

    deleteMessage(messageId, false, activeMessageElement);
    closeDeleteConfirmModal();
    closeContextMenu();
  });
}

// ============================================
// === ОБРАБОТЧИКИ МОДАЛКИ ОЧИСТКИ ЧАТА ===
// ============================================

// Закрытие модалки при клике на overlay
if (clearChatConfirmOverlay) {
  clearChatConfirmOverlay.addEventListener("click", (e) => {
    if (e.target === clearChatConfirmOverlay) {
      closeClearChatConfirmModal();
    }
  });
}

// Обработчик "Очистить у всех"
if (clearForAllOption) {
  clearForAllOption.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Нажата кнопка 'Очистить у всех'");
    
    if (!activeChatId) {
      alert("Нет активного чата");
      return;
    }
    
    if (clearForAllOption.classList.contains("disabled")) {
      console.warn("Опция отключена");
      return;
    }
    
    console.log("Выполняю очистку чата для всех");
    clearChat(true);
    closeClearChatConfirmModal();
  });
}

// Обработчик "Очистить у себя"
if (clearForSelfOption) {
  clearForSelfOption.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Нажата кнопка 'Очистить у себя'");
    
    if (!activeChatId) {
      alert("Нет активного чата");
      return;
    }
    
    console.log("Выполняю очистку чата для себя");
    clearChat(false);
    closeClearChatConfirmModal();
  });
}

// ============================================
// === ОБРАБОТЧИКИ МОДАЛКИ УДАЛЕНИЯ ЧАТА ===
// ============================================

// Закрытие модалки при клике на overlay
if (deleteChatConfirmOverlay) {
  deleteChatConfirmOverlay.addEventListener("click", (e) => {
    if (e.target === deleteChatConfirmOverlay) {
      closeDeleteChatConfirmModal();
    }
  });
}

// Обработчик "Удалить у всех"
if (deleteChatForAllOption) {
  deleteChatForAllOption.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Нажата кнопка 'Удалить у всех'");
    
    if (!activeChatId) {
      alert("Нет активного чата");
      return;
    }
    
    if (deleteChatForAllOption.classList.contains("disabled")) {
      console.warn("Опция отключена");
      return;
    }
    
    console.log("Выполняю удаление чата для всех");
    deleteChat(true);
    closeDeleteChatConfirmModal();
  });
}

// Обработчик "Удалить у себя"
if (deleteChatForSelfOption) {
  deleteChatForSelfOption.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Нажата кнопка 'Удалить у себя'");
    
    if (!activeChatId) {
      alert("Нет активного чата");
      return;
    }
    
    console.log("Выполняю удаление чата для себя");
    deleteChat(false);
    closeDeleteChatConfirmModal();
  });
}


// ========================================================
// === Загрузка страницы (без изменений) ===
// ========================================================

// ====================================
// === ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ВКЛАДКАМИ ===
// ====================================
// === МОДАЛЬНОЕ ОКНО ПРОФИЛЯ ===
// ====================================

/**
 * Открывает профиль пользователя (правая боковая панель по Figma)
 * @param {string} userEmail - Email пользователя для загрузки данных
 */
async function openProfileModal(userEmail) {
  if (!profileSection || !userEmail) return;
  currentProfileEmail = userEmail;

  // Проверяем, является ли это ботом
  const isBot = userEmail && userEmail.startsWith("bot_") && userEmail.endsWith("@flicker.local");
  
  if (isBot) {
    // Обработка профиля бота
    const botId = userEmail.replace("bot_", "").replace("@flicker.local", "");
    
    try {
      // Загружаем информацию о боте
      const response = await fetch(`${API_BASE_URL}/api/bots`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const bot = data.bots?.find(b => b.bot_id === botId);
        
        if (bot) {
          // Заполняем данные профиля бота
          if (profileName) {
            profileName.textContent = bot.name || "Бот";
          }
          if (profileUsername) {
            profileUsername.textContent = "";
            profileUsername.classList.add("hidden");
          }
          if (profileEmail) {
            profileEmail.textContent = bot.description || "Нейросеть для общения";
          }
          if (profileQuote) {
            profileQuote.textContent = "бот";
          }
          if (profileHeaderBgImg) {
            profileHeaderBgImg.src = bot.avatar || "/images/юзер.svg";
            profileHeaderBgImg.onerror = function() {
              this.src = "/images/юзер.svg";
            };
          }
          
          // Скрываем кнопки звонков для ботов
          if (profileCallBtn) profileCallBtn.style.display = "none";
          if (profileVideoCallBtn) profileVideoCallBtn.style.display = "none";
          if (profileGiftBtn) profileGiftBtn.style.display = "none";
          
          // Скрываем кнопку "Добавить участника" для ботов
          const profileAddMemberBtn = document.getElementById("profileAddMemberBtn");
          if (profileAddMemberBtn) {
            profileAddMemberBtn.classList.add("hidden");
            profileAddMemberBtn.style.display = "none";
          }
          
          // Скрываем вкладку участников для ботов
          const profileParticipantsTab = document.querySelector(".profile-participants-tab");
          if (profileParticipantsTab) {
            profileParticipantsTab.classList.add("hidden");
          }
          
          // Очищаем данные участников группы
          window.currentGroupParticipantsData = null;

          // Блок редактирования профиля скрываем для ботов
          if (profileEditSection) {
            profileEditSection.classList.add("hidden");
          }
          
          // Показываем профиль
          profileSection.classList.remove("hidden");
          const app = document.querySelector('.app');
          if (app) {
            app.classList.add('profile-open');
          }
          return;
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки данных бота:", error);
    }
  }

  try {
    // Загружаем данные пользователя
    const response = await fetch(`${API_BASE_URL}/api/user_profile?email=${encodeURIComponent(userEmail)}`, {
      credentials: 'include' // Включаем cookies для аутентификации
    });
    if (!response.ok) {
      throw new Error("Не удалось загрузить данные пользователя");
    }

    const userData = await response.json();
    const isSelfProfile = (userData.email === currentUserEmail);
    
    // Для своего профиля скрываем "Звонок/Видео/Подарок/Сообщение/меню" (не звонят/не пишут сами себе)
    if (isSelfProfile) {
      if (profileCallBtn) profileCallBtn.style.display = "none";
      if (profileVideoCallBtn) profileVideoCallBtn.style.display = "none";
      if (profileGiftBtn) profileGiftBtn.style.display = "none";
      if (profileMessageBtn) profileMessageBtn.style.display = "none";
      if (profileMenuBtn) profileMenuBtn.style.display = "none";
    } else {
      if (profileCallBtn) profileCallBtn.style.display = "";
      if (profileVideoCallBtn) profileVideoCallBtn.style.display = "";
      if (profileGiftBtn) profileGiftBtn.style.display = "";
      if (profileMessageBtn) profileMessageBtn.style.display = "";
      if (profileMenuBtn) profileMenuBtn.style.display = "";
    }
    
    // Скрываем кнопку "Добавить участника" для обычных пользователей
    const profileAddMemberBtn = document.getElementById("profileAddMemberBtn");
    if (profileAddMemberBtn) {
      profileAddMemberBtn.classList.add("hidden");
      profileAddMemberBtn.style.display = "none";
    }
    
    // Скрываем вкладку участников для обычных чатов
    const profileParticipantsTab = document.querySelector(".profile-participants-tab");
    if (profileParticipantsTab) {
      profileParticipantsTab.classList.add("hidden");
    }
    
    // Очищаем данные участников группы
    window.currentGroupParticipantsData = null;

    // Заполняем данные профиля
    if (profileName) {
      // Базовое имя из профиля пользователя
      let displayName = userData.full_name || userData.username || userData.email.split("@")[0];

      // Если пользователь есть в контактах — используем то имя, как он записан в контактах
      try {
        const contactsMap = window.CONTACTS_BY_EMAIL || {};
        const contactInfo = contactsMap[userData.email];
        if (contactInfo) {
          displayName =
            contactInfo.contact_name ||
            contactInfo.display_name ||
            contactInfo.full_name ||
            contactInfo.username ||
            displayName;
        }
      } catch (e) {
        // Не ломаем модалку, если что-то с картой контактов
      }

      profileName.textContent = displayName;
    }

    if (profileUsername) {
      const un = (userData.username || "").trim();
      if (un) {
        profileUsername.textContent = un.startsWith("@") ? un : `@${un}`;
        profileUsername.classList.remove("hidden");
      } else {
        profileUsername.textContent = "";
        profileUsername.classList.add("hidden");
      }
    }

    if (profileEmail) {
      profileEmail.textContent = userData.email || "user@example.com";
    }

    if (profileQuote) {
      // В своём профиле показываем "О себе" (если есть)
      profileQuote.textContent = (isSelfProfile && userData.about) ? userData.about : "Цитата дня!";
    }

    // Устанавливаем фоновое изображение (аватар как фон)
    if (profileHeaderBgImg) {
      const avatarUrl = userData.profile_picture || "/images/юзер.svg";
      profileHeaderBgImg.src = avatarUrl;
      profileHeaderBgImg.onerror = function() {
        this.src = "/images/юзер.svg";
      };
    }

    // === Показываем/заполняем форму редактирования только для своего профиля ===
    if (profileEditSection) {
      if (isSelfProfile) {
        profileEditSection.classList.remove("hidden");
        if (profileEditNameInput) {
          profileEditNameInput.value = userData.full_name || userData.first_name || "";
        }
        if (profileEditUsernameInput) {
          profileEditUsernameInput.value = userData.username || "";
        }
        if (profileEditEmailInput) {
          profileEditEmailInput.value = userData.email || "";
        }
        if (profileEditAboutInput) {
          profileEditAboutInput.value = userData.about || "";
        }
        if (profileEditStatus) {
          profileEditStatus.textContent = "";
          profileEditStatus.classList.add("hidden");
          profileEditStatus.classList.remove("profile-edit-status--success", "profile-edit-status--error");
        }
      } else {
        profileEditSection.classList.add("hidden");
      }
    }

    // Загружаем контент (медиа по умолчанию) из текущего чата
    loadProfileContent('media', userEmail);

    // Показываем профиль (правая боковая панель)
    profileSection.classList.remove("hidden");
    // Добавляем класс к app для уменьшения чата
    const app = document.querySelector('.app');
    if (app) {
      app.classList.add('profile-open');
    }

  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    // На всякий случай скрываем блок редактирования
    if (profileEditSection) {
      profileEditSection.classList.add("hidden");
    }
    // Показываем профиль с базовыми данными из текущего чата
    const chatButton = document.querySelector(
      `.chat-list-item-btn[data-chat-id="${activeChatId}"]`
    );
    
    if (chatButton) {
      const interlocutorEmail = chatButton.dataset.interlocutorEmail;
      const isBot = interlocutorEmail && interlocutorEmail.startsWith("bot_") && interlocutorEmail.endsWith("@flicker.local");
      
      if (isBot) {
        // Для ботов используем данные из кнопки чата
        if (profileName) {
          profileName.textContent = chatButton.dataset.chatName || "Бот";
        }
        if (profileUsername) {
          profileUsername.textContent = "";
          profileUsername.classList.add("hidden");
        }
        if (profileEmail) {
          profileEmail.textContent = "бот";
        }
        if (profileHeaderBgImg && currentChatAvatar) {
          profileHeaderBgImg.src = currentChatAvatar.src;
        }
        // Скрываем кнопки звонков для ботов
        if (profileCallBtn) profileCallBtn.style.display = "none";
        if (profileVideoCallBtn) profileVideoCallBtn.style.display = "none";
        if (profileGiftBtn) profileGiftBtn.style.display = "none";
        
        // Скрываем вкладку участников для ботов
        const profileParticipantsTab = document.querySelector(".profile-participants-tab");
        if (profileParticipantsTab) {
          profileParticipantsTab.classList.add("hidden");
        }
        
        // Очищаем данные участников группы
        window.currentGroupParticipantsData = null;
      } else {
        // Для обычных пользователей
        const interlocutorUsername = (chatButton.dataset.interlocutorUsername || "").trim();
        if (profileName) {
          profileName.textContent = chatButton.dataset.chatName || "Пользователь";
        }
        if (profileUsername) {
          if (interlocutorUsername) {
            profileUsername.textContent = interlocutorUsername.startsWith("@") ? interlocutorUsername : `@${interlocutorUsername}`;
            profileUsername.classList.remove("hidden");
          } else {
            profileUsername.textContent = "";
            profileUsername.classList.add("hidden");
          }
        }
        if (profileEmail) {
          profileEmail.textContent = interlocutorEmail || "user@example.com";
        }
        if (profileHeaderBgImg && currentChatAvatar) {
          profileHeaderBgImg.src = currentChatAvatar.src;
        }
        // Показываем кнопки для обычных пользователей
        if (profileCallBtn) profileCallBtn.style.display = "";
        if (profileVideoCallBtn) profileVideoCallBtn.style.display = "";
        if (profileGiftBtn) profileGiftBtn.style.display = "";
        
    // Скрываем вкладку участников для обычных пользователей
    const profileParticipantsTab = document.querySelector(".profile-participants-tab");
    if (profileParticipantsTab) {
      profileParticipantsTab.classList.add("hidden");
    }
    
    // Очищаем данные участников группы
    window.currentGroupParticipantsData = null;
      }
    }

    profileSection.classList.remove("hidden");
    // Добавляем класс к app для уменьшения чата
    const app = document.querySelector('.app');
    if (app) {
      app.classList.add('profile-open');
    }
  }
}

// Делаем доступной глобально (используется из других мест, например из settings)
window.openProfileModal = openProfileModal;

/**
 * Получает активную вкладку профиля
 * @returns {string|null} - Тип активной вкладки или null
 */
function getActiveProfileTab() {
  if (!profileMediaTabs || profileMediaTabs.length === 0) return null;
  const activeTab = Array.from(profileMediaTabs).find(tab => tab.classList.contains("active"));
  return activeTab ? activeTab.dataset.tab : null;
}

// Глобальная переменная для хранения данных участников группы
window.currentGroupParticipantsData = null;

/**
 * Загружает контент для профиля (медиа/ссылки/файлы/голосовые/участники) из текущего чата
 * @param {string} tabType - Тип вкладки: 'media', 'links', 'files', 'voice', 'participants'
 * @param {string} userEmail - Email пользователя (для поиска чата) или chat_id для групп
 */
async function loadProfileContent(tabType, userEmail) {
  if (!profileContentArea) return;

  // Очищаем область
  profileContentArea.innerHTML = "";

  // Для вкладки участников используем сохраненные данные
  if (tabType === 'participants') {
    if (window.currentGroupParticipantsData) {
      renderParticipants(window.currentGroupParticipantsData.participants || [], window.currentGroupParticipantsData.owner);
    } else {
      profileContentArea.innerHTML = '<div class="profile-participants-error">Не удалось загрузить участников</div>';
    }
    return;
  }

  // Если нет активного чата, не загружаем контент
  if (!activeChatId) {
    return;
  }

  try {
    let response;
    let data;

    switch(tabType) {
      case 'media':
        response = await fetch(`${API_BASE_URL}/api/chat/${activeChatId}/media`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Не удалось загрузить медиа");
        data = await response.json();
        renderMedia(data.media || []);
        break;
      
      case 'links':
        response = await fetch(`${API_BASE_URL}/api/chat/${activeChatId}/links`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Не удалось загрузить ссылки");
        data = await response.json();
        renderLinks(data.links || []);
        break;
      
      case 'files':
        response = await fetch(`${API_BASE_URL}/api/chat/${activeChatId}/files`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Не удалось загрузить файлы");
        data = await response.json();
        renderFiles(data.files || []);
        break;
      
      case 'voice':
        response = await fetch(`${API_BASE_URL}/api/chat/${activeChatId}/voice`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Не удалось загрузить голосовые сообщения");
        data = await response.json();
        renderVoice(data.voice || []);
        break;
    }

  } catch (error) {
    console.error(`Ошибка загрузки ${tabType}:`, error);
  }
}

/**
 * Отображает медиа в сетке
 */
function renderMedia(mediaItems) {
  if (!profileContentArea) return;
  
  profileContentArea.className = "profile-content-area profile-media-grid";
  
  if (mediaItems.length === 0) {
    return;
  }

  mediaItems.forEach(media => {
    const mediaItem = document.createElement("div");
    mediaItem.className = "profile-media-item";
    
    if (media.type === "image" || media.type === "video") {
      const img = document.createElement("img");
      img.src = media.file_url;
      img.alt = media.filename || "Медиа";
      img.onerror = function() {
        mediaItem.style.display = "none";
      };
      mediaItem.appendChild(img);
      
      if (media.type === "video") {
        const videoIcon = document.createElement("div");
        videoIcon.className = "profile-media-video-icon";
        videoIcon.innerHTML = "▶";
        mediaItem.appendChild(videoIcon);
      }
    }
    
    profileContentArea.appendChild(mediaItem);
  });
}

/**
 * Отображает ссылки по Figma
 */
function renderLinks(links) {
  if (!profileContentArea) return;
  
  profileContentArea.className = "profile-content-area profile-links-list";
  
  if (links.length === 0) {
    return;
  }

  // Группируем по датам
  const groupedByDate = {};
  links.forEach(link => {
    const date = new Date(link.timestamp);
    const dateKey = date.toDateString();
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        date: date,
        items: []
      };
    }
    groupedByDate[dateKey].items.push(link);
  });

  // Сортируем даты (новые сначала)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return groupedByDate[b].date - groupedByDate[a].date;
  });

  sortedDates.forEach(dateKey => {
    // Заголовок даты
    const dateHeader = document.createElement("div");
    dateHeader.className = "profile-links-date-header";
    dateHeader.textContent = formatDateForLinks(groupedByDate[dateKey].date);
    profileContentArea.appendChild(dateHeader);

    // Ссылки этой даты
    groupedByDate[dateKey].items.forEach(link => {
      const linkItem = document.createElement("button");
      linkItem.className = "profile-link-item";
      linkItem.type = "button";
      
      // Изображение превью (всегда показываем)
      const previewImg = document.createElement("div");
      previewImg.className = "profile-link-preview";
      const img = document.createElement("img");
      if (link.preview_image) {
        img.src = link.preview_image;
        img.style.display = "block";
      } else {
        // Получаем реальное Open Graph изображение через Microlink API
        img.style.display = "none"; // Скрываем до загрузки
        fetch(`https://api.microlink.io/data?url=${encodeURIComponent(link.url)}`)
          .then(response => response.json())
          .then(data => {
            if (data.data && data.data.image && data.data.image.url) {
              img.src = data.data.image.url;
              img.style.display = "block";
            } else {
              // Fallback на прямое изображение через Microlink
              img.src = `https://api.microlink.io/image?url=${encodeURIComponent(link.url)}`;
              img.style.display = "block";
            }
          })
          .catch(() => {
            // Если API недоступен, пробуем прямое изображение
            img.src = `https://api.microlink.io/image?url=${encodeURIComponent(link.url)}`;
            img.style.display = "block";
          });
        img.onerror = function() {
          // Если не удалось загрузить превью, скрываем изображение
          this.style.display = "none";
        };
      }
      img.alt = "";
      img.onload = function() {
        this.style.display = "block";
      };
      previewImg.appendChild(img);
      linkItem.appendChild(previewImg);

      // Информация о ссылке
      const linkInfo = document.createElement("div");
      linkInfo.className = "profile-link-info";
      
      // Заголовок (название сайта/домен)
      const linkTitle = document.createElement("div");
      linkTitle.className = "profile-link-title";
      // Извлекаем домен из URL для отображения
      try {
        const urlObj = new URL(link.url);
        linkTitle.textContent = link.title || urlObj.hostname.replace('www.', '');
      } catch {
        linkTitle.textContent = link.title || link.url;
      }
      linkInfo.appendChild(linkTitle);
      
      // URL ссылки
      const linkUrl = document.createElement("div");
      linkUrl.className = "profile-link-url";
      linkUrl.textContent = link.url;
      linkInfo.appendChild(linkUrl);
      
      linkItem.appendChild(linkInfo);

      // Обработчик клика
      linkItem.addEventListener("click", () => {
        window.open(link.url, "_blank");
      });

      profileContentArea.appendChild(linkItem);
    });
  });
}

/**
 * Отображает файлы по Figma (аналогично ссылкам)
 */
function renderFiles(files) {
  if (!profileContentArea) return;
  
  profileContentArea.className = "profile-content-area profile-files-list";
  
  if (files.length === 0) {
    return;
  }

  // Группируем по датам
  const groupedByDate = {};
  files.forEach(file => {
    const date = new Date(file.timestamp);
    const dateKey = date.toDateString();
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        date: date,
        items: []
      };
    }
    groupedByDate[dateKey].items.push(file);
  });

  // Сортируем даты (новые сначала)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return groupedByDate[b].date - groupedByDate[a].date;
  });

  sortedDates.forEach(dateKey => {
    // Заголовок даты
    const dateHeader = document.createElement("div");
    dateHeader.className = "profile-files-date-header";
    dateHeader.textContent = formatDateForLinks(groupedByDate[dateKey].date);
    profileContentArea.appendChild(dateHeader);

    // Файлы этой даты
    groupedByDate[dateKey].items.forEach(file => {
      const fileItem = document.createElement("button");
      fileItem.className = "profile-file-item";
      fileItem.type = "button";
      
      // Иконка файла
      const fileIcon = document.createElement("div");
      fileIcon.className = "profile-file-icon";
      fileIcon.innerHTML = "📎";
      fileItem.appendChild(fileIcon);

      // Информация о файле
      const fileInfo = document.createElement("div");
      fileInfo.className = "profile-file-info";
      
      // Название файла
      const fileName = document.createElement("div");
      fileName.className = "profile-file-name";
      fileName.textContent = file.filename || "Файл";
      fileInfo.appendChild(fileName);
      
      // Размер файла
      const fileSize = document.createElement("div");
      fileSize.className = "profile-file-size";
      fileSize.textContent = formatFileSize(file.size || 0);
      fileInfo.appendChild(fileSize);
      
      fileItem.appendChild(fileInfo);

      // Обработчик клика
      fileItem.addEventListener("click", () => {
        window.open(file.file_url, "_blank");
      });

      profileContentArea.appendChild(fileItem);
    });
  });
}

/**
 * Отображает голосовые сообщения согласно дизайну Figma
 */
function renderVoice(voiceItems) {
  if (!profileContentArea) return;
  
  profileContentArea.className = "profile-content-area profile-voice-list";
  
  if (voiceItems.length === 0) {
    return;
  }

  // Группируем по датам
  const groupedByDate = {};
  
  voiceItems.forEach(voice => {
    const date = new Date(voice.timestamp);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        date: date,
        items: []
      };
    }
    groupedByDate[dateKey].items.push(voice);
  });

  // Сортируем даты (новые сначала)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return groupedByDate[b].date - groupedByDate[a].date;
  });

  sortedDates.forEach((dateKey, dateIndex) => {
    // Заголовок даты
    const dateHeader = document.createElement("div");
    dateHeader.className = "profile-voice-date-header";
    dateHeader.textContent = formatDateForLinks(groupedByDate[dateKey].date);
    profileContentArea.appendChild(dateHeader);

    // Голосовые сообщения этой даты
    const dateGroup = document.createElement("div");
    dateGroup.className = "profile-voice-date-group";
    
    groupedByDate[dateKey].items.forEach((voice, itemIndex) => {
      const voiceItem = document.createElement("button");
      voiceItem.className = "profile-voice-item";
      voiceItem.type = "button";
      
      // Первое сообщение имеет другой фон
      if (dateIndex === 0 && itemIndex === 0) {
        voiceItem.style.background = "#DAE0F2";
      }
      
      // SVG иконка голосового сообщения
      const voiceIcon = document.createElement("div");
      voiceIcon.className = "profile-voice-icon";
      voiceIcon.innerHTML = `<img src="/images/voise_messege.svg" alt="Голосовое сообщение" />`;

      voiceItem.appendChild(voiceIcon);

      // Информация о голосовом сообщении
      const voiceInfo = document.createElement("div");
      voiceInfo.className = "profile-voice-info";
      
      // Текст с датой
      const voiceTitle = document.createElement("div");
      voiceTitle.className = "profile-voice-title";
      const voiceDate = new Date(voice.timestamp);
      const formattedDate = `${String(voiceDate.getDate()).padStart(2, '0')}.${String(voiceDate.getMonth() + 1).padStart(2, '0')}.${voiceDate.getFullYear()}`;
      voiceTitle.textContent = `Голосовое сообщение от ${formattedDate}`;
      voiceInfo.appendChild(voiceTitle);
      
      // Время и визуализация
      const voiceMeta = document.createElement("div");
      voiceMeta.className = "profile-voice-meta";
      
      // Время
      const voiceTime = document.createElement("div");
      voiceTime.className = "profile-voice-time";
      const hours = String(voiceDate.getHours()).padStart(2, '0');
      const minutes = String(voiceDate.getMinutes()).padStart(2, '0');
      voiceTime.textContent = `${hours}:${minutes}`;
      voiceMeta.appendChild(voiceTime);
      
      // Визуализация волны
      const waveform = document.createElement("div");
      waveform.className = "profile-voice-waveform";
      for (let i = 0; i < 20; i++) {
        const bar = document.createElement("div");
        bar.className = "profile-voice-wave-bar";
        const height = 5 + Math.random() * 20;
        bar.style.height = `${Math.max(5, Math.min(25, height))}px`;
        waveform.appendChild(bar);
      }
      voiceMeta.appendChild(waveform);
      
      voiceInfo.appendChild(voiceMeta);
      voiceItem.appendChild(voiceInfo);
      
      // Обработчик клика
      voiceItem.addEventListener("click", () => {
        // Можно добавить воспроизведение аудио
        const audio = new Audio(voice.file_url);
        audio.play();
      });
      
      dateGroup.appendChild(voiceItem);
    });
    
    profileContentArea.appendChild(dateGroup);
  });
}

/**
 * Отображает участников группы
 * @param {Array} participants - Массив участников группы
 * @param {string} ownerEmail - Email владельца группы
 */
function renderParticipants(participants, ownerEmail) {
  if (!profileContentArea) return;
  
  profileContentArea.className = "profile-content-area profile-participants-list";
  
  if (participants.length === 0) {
    profileContentArea.innerHTML = '<div class="profile-participants-empty">Нет участников</div>';
    return;
  }

  participants.forEach(participant => {
    const item = document.createElement("div");
    item.className = "profile-participant-item";
    
    let role = "Участник";
    if (participant.is_owner || participant.email === ownerEmail) {
      role = "Владелец";
    } else if (participant.is_admin) {
      role = "Админ";
    }
    
    item.innerHTML = `
      <img src="${participant.profile_picture || '/images/юзер.svg'}" alt="${participant.name}" />
      <div class="profile-participant-info">
        <div class="profile-participant-name">${participant.name}</div>
        <div class="profile-participant-role">${role}</div>
      </div>
    `;
    
    // Клик на участника открывает его профиль
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      if (typeof window.openProfileModal === 'function') {
        window.openProfileModal(participant.email);
      }
    });
    
    profileContentArea.appendChild(item);
  });
}

/**
 * Форматирует размер файла
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Б";
  const k = 1024;
  const sizes = ["Б", "КБ", "МБ", "ГБ"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Форматирует дату для отображения в ссылках/файлах
 */
function formatDateForLinks(date) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${day} ${month}`;
}

// ===================================
// === ФУНКЦИИ ДЛЯ РАБОТЫ С УПОМИНАНИЯМИ ===
// ===================================

/**
 * Инициализация элементов для упоминаний
 */
function initMentionsElements() {
  mentionsList = document.getElementById("mentionsList");
  mentionsListContent = document.getElementById("mentionsListContent");
}

/**
 * Обработка ввода для обнаружения @ и показа списка участников
 */
function handleMentionsInput(e) {
  if (!mentionsList || !mentionsListContent || !messageInput) return;
  
  // Показываем список участников только для групповых чатов
  if (!currentChatIsGroup) {
    hideMentionsList();
    return;
  }
  
  const text = messageInput.value;
  const cursorPos = messageInput.selectionStart;
  
  // Ищем @ перед курсором
  const textBeforeCursor = text.substring(0, cursorPos);
  const lastAtIndex = textBeforeCursor.lastIndexOf('@');
  
  // Проверяем, что @ не является частью другого слова (нет пробела между @ и курсором)
  if (lastAtIndex !== -1) {
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    // Проверяем, что после @ нет пробела или переноса строки
    if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
      // Показываем список участников группы
      const searchQuery = textAfterAt.toLowerCase();
      showMentionsList(searchQuery, lastAtIndex);
      return;
    }
  }
  
  // Скрываем список, если @ не найден или уже есть пробел
  hideMentionsList();
}

/**
 * Показывает список участников для упоминаний
 */
function showMentionsList(searchQuery = '', mentionStart = -1) {
  if (!mentionsList || !mentionsListContent) return;
  if (!currentChatParticipants || currentChatParticipants.length === 0) {
    hideMentionsList();
    return;
  }
  
  currentMentionStart = mentionStart;
  selectedMentionIndex = -1;
  
  const queryNorm = (searchQuery || '').trim().toLowerCase().replace(/^@+/, '');
  const filtered = currentChatParticipants.filter(p => {
    const name = (p.name || '').toLowerCase();
    const username = (p.username || '').toLowerCase().replace(/^@+/, '');
    const email = (p.email || '').toLowerCase();
    if (!queryNorm) return true;
    return name.includes(queryNorm) || username.includes(queryNorm) || email.includes(queryNorm);
  });
  
  if (filtered.length === 0) {
    hideMentionsList();
    return;
  }
  
  // Очищаем и заполняем список
  mentionsListContent.innerHTML = '';
  
  filtered.forEach((participant, index) => {
    const item = document.createElement("div");
    item.className = `mention-item ${index === 0 ? 'selected' : ''}`;
    item.dataset.index = index;
    const u = (participant.username || '').replace(/^@+/, '');
    item.innerHTML = `
      <img src="/images/юзер.svg" alt="${participant.name}" />
      <div class="mention-item-info">
        <div class="mention-item-name">${participant.name}</div>
        <div class="mention-item-username">${u ? `@${u}` : ''}</div>
      </div>
    `;
    
    item.addEventListener("click", () => {
      insertMention(participant, mentionStart);
    });
    
    item.addEventListener("mouseenter", () => {
      selectedMentionIndex = index;
      updateMentionsSelection();
    });
    
    mentionsListContent.appendChild(item);
  });
  
  mentionsList.classList.remove("hidden");
  selectedMentionIndex = 0;
  updateMentionsSelection();
}

/**
 * Скрывает список упоминаний
 */
function hideMentionsList() {
  if (mentionsList) {
    mentionsList.classList.add("hidden");
  }
  currentMentionStart = -1;
  selectedMentionIndex = -1;
}

/**
 * Обновляет выделение в списке упоминаний
 */
function updateMentionsSelection() {
  const items = mentionsListContent?.querySelectorAll(".mention-item");
  if (!items) return;
  
  items.forEach((item, index) => {
    if (index === selectedMentionIndex) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
}

/**
 * Вставляет упоминание в поле ввода
 */
function insertMention(participant, mentionStart) {
  if (!messageInput || mentionStart === -1) return;
  
  const text = messageInput.value;
  const cursorPos = messageInput.selectionStart;
  
  let u = (participant.username || '').trim().replace(/^@+/, '');
  if (!u && participant.email) {
    const local = participant.email.split('@')[0];
    if (local) u = local;
  }
  const mentionText = u ? `@${u} ` : '';
  
  const textBefore = text.substring(0, mentionStart);
  const textAfter = text.substring(cursorPos);
  const newText = textBefore + mentionText + textAfter;
  
  messageInput.value = newText;
  
  const newCursorPos = mentionStart + mentionText.length;
  messageInput.setSelectionRange(newCursorPos, newCursorPos);
  
  hideMentionsList();
  
  // Триггерим событие input для обновления состояния
  messageInput.dispatchEvent(new Event("input"));
  messageInput.focus();
}

/**
 * Извлекает упоминания из текста сообщения
 */
function extractMentions(text) {
  const mentions = [];
  if (!text || !currentChatParticipants) return mentions;
  
  // Ищем все @username в тексте
  const mentionRegex = /@(\w+)/g;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    const username = match[1];
    // Находим участника по username
    const participant = currentChatParticipants.find(p => 
      p.username === username || p.email.split("@")[0] === username
    );
    if (participant) {
      mentions.push({
        email: participant.email,
        username: participant.username || username
      });
    }
  }
  
  return mentions;
}

/**
 * Обрабатывает текст сообщения и подсвечивает упоминания
 */
function processMessageTextWithMentions(text) {
  if (!text) return document.createTextNode("");
  
  // Создаем контейнер для фрагмента
  const fragment = document.createDocumentFragment();
  const mentionRegex = /@(\w+)/g;
  let lastIndex = 0;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    // Добавляем текст до упоминания
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
    }
    
    // Создаем элемент для упоминания
    const mentionSpan = document.createElement("span");
    mentionSpan.className = "message-mention";
    mentionSpan.textContent = match[0]; // @username
    mentionSpan.title = `Упоминание @${match[1]}`;
    
    // Сохраняем username для перехода в чат
    const username = match[1];
    mentionSpan.dataset.mentionUsername = username;
    
    // Находим участника по username для получения email
    let foundEmail = null;
    
    // Сначала ищем в участниках текущего чата
    if (currentChatParticipants && currentChatParticipants.length > 0) {
      const participant = currentChatParticipants.find(p => 
        p.username === username || p.email.split("@")[0] === username
      );
      if (participant) {
        foundEmail = participant.email;
      }
    }
    
    // Если не нашли в участниках чата, ищем в контактах
    if (!foundEmail) {
      try {
        const contactsMap = window.CONTACTS_BY_EMAIL || {};
        for (const [email, contact] of Object.entries(contactsMap)) {
          const contactUsername = contact.username || email.split("@")[0];
          if (contactUsername === username || contactUsername.toLowerCase() === username.toLowerCase()) {
            foundEmail = email;
            break;
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
    
    if (foundEmail) {
      mentionSpan.dataset.mentionEmail = foundEmail;
    }
    
    // Добавляем обработчик клика для перехода в чат
    mentionSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      handleMentionClick(mentionSpan);
    });
    
    fragment.appendChild(mentionSpan);
    
    lastIndex = match.index + match[0].length;
  }
  
  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
  }
  
  return fragment;
}

/**
 * Обрабатывает клик на упоминание - открывает чат с пользователем
 */
async function handleMentionClick(mentionElement) {
  const email = mentionElement.dataset.mentionEmail;
  const username = mentionElement.dataset.mentionUsername;
  
  if (!email && !username) return;
  
  // Проверяем, является ли это упоминанием самого пользователя
  if (email === currentUserEmail || 
      (username && currentUserEmail && currentUserEmail.split("@")[0] === username)) {
    // Открываем избранное
    try {
      const chatButtons = document.querySelectorAll(".chat-list-item-btn");
      let favoriteChat = null;
      
      for (const btn of chatButtons) {
        if (btn.dataset.isFavorite === "true") {
          favoriteChat = btn;
          break;
        }
      }
      
      if (favoriteChat) {
        const chatId = favoriteChat.dataset.chatId;
        if (chatId) {
          // Переключаемся на вкладку "Чаты" если нужно
          const chatsButton = document.getElementById("chatsButton");
          if (chatsButton) {
            if (!chatsButton.classList.contains("active")) {
              if (typeof window.switchTab === 'function') {
                window.switchTab("chats");
              } else {
                chatsButton.click();
              }
            }
          }
          
          // Открываем избранное
          const loadChatFunc = window.loadChat || loadChat;
          if (loadChatFunc && typeof loadChatFunc === 'function') {
            await loadChatFunc(chatId);
          }
        }
      } else {
        // Если избранное не найдено, пытаемся открыть через URL
        window.location.href = "/@favorit";
      }
      return;
    } catch (error) {
      console.error("Ошибка при открытии избранного:", error);
      window.location.href = "/@favorit";
      return;
    }
  }
  
  try {
    // Сначала ищем чат с этим пользователем в списке чатов
    const chatButtons = document.querySelectorAll(".chat-list-item-btn");
    let targetChat = null;
    
    for (const btn of chatButtons) {
      const interlocutorEmail = btn.dataset.interlocutorEmail;
      const interlocutorUsername = btn.dataset.interlocutorUsername;
      
      // Проверяем совпадение по email или username
      if (email && interlocutorEmail === email) {
        targetChat = btn;
        break;
      }
      if (username && interlocutorUsername) {
        const btnUsername = interlocutorUsername.toLowerCase();
        const mentionUsername = username.toLowerCase();
        if (btnUsername === mentionUsername || 
            btnUsername === `@${mentionUsername}` ||
            btnUsername.replace('@', '') === mentionUsername) {
          targetChat = btn;
          break;
        }
      }
    }
    
    if (targetChat) {
      // Чат найден - открываем его
      const chatId = targetChat.dataset.chatId;
      if (chatId) {
        // Переключаемся на вкладку "Чаты" если нужно
        const chatsButton = document.getElementById("chatsButton");
        if (chatsButton) {
          if (!chatsButton.classList.contains("active")) {
            if (typeof window.switchTab === 'function') {
              window.switchTab("chats");
            } else {
              chatsButton.click();
            }
          }
        }
        
        // Открываем чат
        const loadChatFunc = window.loadChat || loadChat;
        if (loadChatFunc && typeof loadChatFunc === 'function') {
          await loadChatFunc(chatId);
        }
      }
    } else if (email) {
      // Чат не найден, но есть email - создаем новый чат через API
      const formData = new FormData();
      formData.append("target_email", email);
      
      const response = await fetch(`${API_BASE_URL}/api/start_chat`, {
        method: "POST",
        credentials: 'include',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.chat_id) {
          // Переключаемся на вкладку "Чаты" если нужно
          const chatsButton = document.getElementById("chatsButton");
          if (chatsButton) {
            if (!chatsButton.classList.contains("active")) {
              if (typeof window.switchTab === 'function') {
                window.switchTab("chats");
              } else {
                chatsButton.click();
              }
            }
          }
          
          // Открываем чат
          const loadChatFunc = window.loadChat || loadChat;
          if (loadChatFunc && typeof loadChatFunc === 'function') {
            await loadChatFunc(data.chat_id);
          }
        }
      } else {
        console.error("Не удалось создать чат с пользователем:", email);
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Не удалось открыть чат с этим пользователем");
      }
    } else {
      // Только username без email - пытаемся найти через поиск
      console.warn("Не удалось найти email для username:", username);
      alert(`Не удалось найти пользователя @${username}`);
    }
  } catch (error) {
    console.error("Ошибка при открытии чата с упоминанием:", error);
    alert("Произошла ошибка при открытии чата");
  }
}

/**
 * Обработка клавиатуры для навигации по списку упоминаний
 */
function handleMentionsKeydown(e) {
  if (!mentionsList || mentionsList.classList.contains("hidden")) return;
  
  const items = mentionsListContent?.querySelectorAll(".mention-item");
  if (!items || items.length === 0) return;
  
  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedMentionIndex = (selectedMentionIndex + 1) % items.length;
    updateMentionsSelection();
    items[selectedMentionIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedMentionIndex = selectedMentionIndex <= 0 ? items.length - 1 : selectedMentionIndex - 1;
    updateMentionsSelection();
    items[selectedMentionIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter" || e.key === "Tab") {
    e.preventDefault();
    const selectedItem = items[selectedMentionIndex];
    if (selectedItem) {
      const text = messageInput.value.substring(0, messageInput.selectionStart);
      const lastAtIndex = text.lastIndexOf('@');
      const queryNorm = (text.substring(lastAtIndex + 1) || '').trim().toLowerCase().replace(/^@+/, '');
      const filtered = currentChatParticipants.filter(part => {
        const name = (part.name || '').toLowerCase();
        const username = (part.username || '').toLowerCase().replace(/^@+/, '');
        const email = (part.email || '').toLowerCase();
        if (!queryNorm) return true;
        return name.includes(queryNorm) || username.includes(queryNorm) || email.includes(queryNorm);
      });
      if (filtered[selectedMentionIndex]) {
        insertMention(filtered[selectedMentionIndex], currentMentionStart);
      }
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    hideMentionsList();
  }
}

/**
 * Закрывает профиль
 */
function closeProfileModal() {
  if (!profileSection) return;
  profileSection.classList.add("hidden");
  // Убираем класс с app для восстановления размера чата
  const app = document.querySelector('.app');
  if (app) {
    app.classList.remove('profile-open');
  }
  
  // Скрываем кнопку "Добавить участника" при закрытии профиля
  const profileAddMemberBtn = document.getElementById("profileAddMemberBtn");
  if (profileAddMemberBtn) {
    profileAddMemberBtn.classList.add("hidden");
    profileAddMemberBtn.style.display = "none";
  }
  
  // Очищаем сохраненный chat_id группы
  window.currentGroupChatId = null;
}

// Обработчики для профиля
if (profileBackBtn) {
  profileBackBtn.addEventListener("click", closeProfileModal);
}

// Обработчики для вкладок медиа (используем делегирование событий для динамических вкладок)
const profileMediaTabsContainer = document.querySelector(".profile-media-tabs");
if (profileMediaTabsContainer) {
  profileMediaTabsContainer.addEventListener("click", (e) => {
    const tab = e.target.closest(".profile-media-tab");
    if (!tab) return;
    
    // Убираем активный класс у всех вкладок
    const allTabs = profileMediaTabsContainer.querySelectorAll(".profile-media-tab");
    allTabs.forEach(t => t.classList.remove("active"));
    
    // Добавляем активный класс к выбранной вкладке
    tab.classList.add("active");
    
    // Загружаем соответствующий контент
    const tabType = tab.dataset.tab;
    const emailForContent = currentProfileEmail || window.CURRENT_USER_EMAIL;
    loadProfileContent(tabType, emailForContent);
  });
}

// Глобальные горячие клавиши: Escape, Ctrl+Enter (отправить), Ctrl+K (поиск)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && profileSection && !profileSection.classList.contains("hidden")) {
    closeProfileModal();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (messageForm && activeChatId && messageInput && messageInput.value.trim()) {
      messageForm.requestSubmit();
      e.preventDefault();
    }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (searchInput) {
      searchInput.focus();
      if (typeof searchInput.select === "function") searchInput.select();
    }
  }
});

// Кнопка/пункт "Мой профиль" в настройках
function _setMyProfileStatus(text, kind) {
  if (!myProfileStatus) return;
  myProfileStatus.textContent = text || "";
  if (!text) {
    myProfileStatus.classList.add("hidden");
  } else {
    myProfileStatus.classList.remove("hidden");
  }
  myProfileStatus.classList.remove("my-profile-status--ok", "my-profile-status--err");
  if (kind === "ok") myProfileStatus.classList.add("my-profile-status--ok");
  if (kind === "err") myProfileStatus.classList.add("my-profile-status--err");
}

function closeMyProfileSettingsPanel() {
  if (myProfileSettingsPanel) myProfileSettingsPanel.classList.add("hidden");
  if (privacySettingsPanel) privacySettingsPanel.classList.add("hidden");
  if (settingsInfoContent) settingsInfoContent.classList.remove("hidden");
  if (settingsInfo) settingsInfo.classList.remove("has-my-profile");
  _setMyProfileStatus("", null);
  if (typeof _setPrivacyStatus === "function") _setPrivacyStatus("", null);
  /* Сбрасываем превью аватарки: показываем сохранённую, отзываем object URL */
  if (_myProfilePreviewObjectUrl) {
    if (myProfileAvatarImg) myProfileAvatarImg.src = _myProfileSavedAvatarUrl || "/images/юзер.svg";
    URL.revokeObjectURL(_myProfilePreviewObjectUrl);
    _myProfilePreviewObjectUrl = null;
  }
  if (myProfileAvatarInput) myProfileAvatarInput.value = "";
}

async function openMyProfileSettingsPanel() {
  if (!currentUserEmail) return;
  if (!myProfileSettingsPanel || !settingsInfo) return;

  // Закрываем панель конфиденциальности, если она открыта
  if (privacySettingsPanel && !privacySettingsPanel.classList.contains("hidden")) {
    closePrivacySettingsPanel();
  }

  // Убеждаемся, что открыта вкладка настроек
  if (window.switchTab && typeof window.switchTab === "function") {
    window.switchTab("settings");
  }

  if (settingsInfoContent) settingsInfoContent.classList.add("hidden");
  settingsInfo.classList.add("has-my-profile");
  myProfileSettingsPanel.classList.remove("hidden");
  _setMyProfileStatus("Загружаем профиль…", null);

  try {
    const resp = await fetch(`${API_BASE_URL}/api/user_profile?email=${encodeURIComponent(currentUserEmail)}`, {
      credentials: "include"
    });
    if (!resp.ok) throw new Error("Не удалось загрузить профиль");
    const userData = await resp.json();

    const fullName = userData.full_name || userData.username || (userData.email ? userData.email.split("@")[0] : "Пользователь");
    const username = userData.username || "";
    const email = userData.email || "";
    const avatarUrl = userData.profile_picture || "/images/юзер.svg";
    const about = userData.about || "";

    if (myProfileDisplayName) myProfileDisplayName.textContent = fullName;
    if (myProfileEmailText) myProfileEmailText.textContent = email;
    if (myProfileUsernameChip) myProfileUsernameChip.textContent = username ? `@${username}` : "@";
    _myProfileSavedAvatarUrl = avatarUrl;
    if (myProfileAvatarImg) myProfileAvatarImg.src = avatarUrl;
    if (_myProfilePreviewObjectUrl) {
      URL.revokeObjectURL(_myProfilePreviewObjectUrl);
      _myProfilePreviewObjectUrl = null;
    }

    if (myProfileNameInput) myProfileNameInput.value = fullName;
    if (myProfileUsernameInput) myProfileUsernameInput.value = username;
    if (myProfileEmailInput) myProfileEmailInput.value = email;
    if (myProfileAboutInput) myProfileAboutInput.value = about;

    _setMyProfileStatus("", null);
  } catch (e) {
    console.error(e);
    _setMyProfileStatus("Ошибка загрузки профиля", "err");
  }
}

if (myProfileSettingsItem) {
  myProfileSettingsItem.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMyProfileSettingsPanel();
  });
}

if (myProfileSettingsCloseBtn) {
  myProfileSettingsCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMyProfileSettingsPanel();
  });
}

if (myProfileAvatarBtn && myProfileAvatarInput) {
  myProfileAvatarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    myProfileAvatarInput.click();
  });
}

/* Превью аватарки при выборе файла; сохраняется для всех только по «Сохранить» */
if (myProfileAvatarInput && myProfileAvatarImg) {
  myProfileAvatarInput.addEventListener("change", () => {
    const file = myProfileAvatarInput.files && myProfileAvatarInput.files[0];
    if (!file) {
      if (_myProfilePreviewObjectUrl) {
        myProfileAvatarImg.src = _myProfileSavedAvatarUrl || "/images/юзер.svg";
        URL.revokeObjectURL(_myProfilePreviewObjectUrl);
        _myProfilePreviewObjectUrl = null;
      }
      return;
    }
    if (_myProfilePreviewObjectUrl) URL.revokeObjectURL(_myProfilePreviewObjectUrl);
    _myProfilePreviewObjectUrl = URL.createObjectURL(file);
    myProfileAvatarImg.src = _myProfilePreviewObjectUrl;
  });
}

if (myProfileForm) {
  myProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    if (myProfileSaveBtn) myProfileSaveBtn.disabled = true;
    _setMyProfileStatus("Сохраняем…", null);

    try {
      const fd = new FormData();

      const usernameRaw = (myProfileUsernameInput?.value || "").trim();
      const username = usernameRaw.replace(/^@+/, "");
      const name = (myProfileNameInput?.value || "").trim();
      const about = (myProfileAboutInput?.value || "").trim();
      const avatarFile = (myProfileAvatarInput && myProfileAvatarInput.files && myProfileAvatarInput.files[0]) ? myProfileAvatarInput.files[0] : null;

      if (username) fd.append("username", username);
      if (name) fd.append("first_name", name);
      if (about) fd.append("about", about);
      if (avatarFile) fd.append("profile_picture", avatarFile);

      const resp = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "POST",
        credentials: "include",
        body: fd
      });

      if (!resp.ok) {
        let msg = "Не удалось сохранить профиль";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        if (resp.status === 409) msg = "Никнейм уже занят.";
        _setMyProfileStatus(msg, "err");
        return;
      }

      const data = await resp.json();

      // Обновляем UI в правой панели
      const oldChip = (myProfileUsernameChip && myProfileUsernameChip.textContent) ? myProfileUsernameChip.textContent.replace(/^@+/, "").trim() : "";
      const newName = data.full_name || name || username || (myProfileDisplayName ? myProfileDisplayName.textContent : "");
      const newUsername = (data.username != null ? data.username : username) || oldChip;
      const newEmail = data.user_email || (myProfileEmailText ? myProfileEmailText.textContent : "");
      if (myProfileDisplayName && newName) myProfileDisplayName.textContent = newName;
      if (myProfileEmailText && newEmail) myProfileEmailText.textContent = newEmail;
      if (myProfileUsernameChip) myProfileUsernameChip.textContent = newUsername ? `@${newUsername}` : myProfileUsernameChip.textContent;

      if (data.avatar_url) {
        const u = data.avatar_url;
        const bust = u.includes("?") ? `${u}&t=${Date.now()}` : `${u}?t=${Date.now()}`;
        if (_myProfilePreviewObjectUrl) {
          URL.revokeObjectURL(_myProfilePreviewObjectUrl);
          _myProfilePreviewObjectUrl = null;
        }
        _myProfileSavedAvatarUrl = bust;
        if (myProfileAvatarImg) myProfileAvatarImg.src = bust;

        // Обновляем аватар в пункте настроек слева
        if (myProfileSettingsItem) {
          const avatarImg = myProfileSettingsItem.querySelector("img");
          if (avatarImg) avatarImg.src = bust;
        }
        if (document.body) document.body.dataset.userAvatar = u;
      }

      // Сразу обновляем имя и ник слева в пункте «Мой профиль» (без перезагрузки)
      if (myProfileSettingsItem) {
        const titleEl = myProfileSettingsItem.querySelector(".settings-item-title");
        const subtitleEl = myProfileSettingsItem.querySelector(".settings-item-subtitle");
        if (titleEl && newName) titleEl.textContent = newName;
        if (subtitleEl) subtitleEl.innerHTML = (newEmail || "") + (newEmail && newUsername ? "<br />" : "") + (newUsername ? `@${newUsername}` : "");
      }

      _setMyProfileStatus("Сохранено", "ok");
      if (myProfileAvatarInput) myProfileAvatarInput.value = "";
    } catch (err) {
      console.error(err);
      _setMyProfileStatus("Ошибка при сохранении", "err");
    } finally {
      if (myProfileSaveBtn) myProfileSaveBtn.disabled = false;
    }
  });
}

// Клик по "Изменить фото" -> выбор файла
if (profileAvatarEditBtn && profileAvatarInput) {
  profileAvatarEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    profileAvatarInput.click();
  });
}

// Сохранение изменений профиля
if (profileEditForm) {
  profileEditForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Редактировать можно только свой профиль
    if (!currentUserEmail || currentProfileEmail !== currentUserEmail) {
      return;
    }

    if (profileEditSaveBtn) profileEditSaveBtn.disabled = true;
    if (profileEditStatus) {
      profileEditStatus.textContent = "Сохраняем…";
      profileEditStatus.classList.remove("hidden", "profile-edit-status--success", "profile-edit-status--error");
    }

    try {
      const fd = new FormData();

      const usernameRaw = (profileEditUsernameInput?.value || "").trim();
      const username = usernameRaw.replace(/^@+/, "");
      const name = (profileEditNameInput?.value || "").trim();
      const about = (profileEditAboutInput?.value || "").trim();
      const avatarFile = (profileAvatarInput && profileAvatarInput.files && profileAvatarInput.files[0]) ? profileAvatarInput.files[0] : null;

      if (username) fd.append("username", username);
      if (name) fd.append("first_name", name);
      if (about) fd.append("about", about);
      if (avatarFile) fd.append("profile_picture", avatarFile);

      if (Array.from(fd.keys()).length === 0) {
        if (profileEditStatus) {
          profileEditStatus.textContent = "Нет изменений";
          profileEditStatus.classList.add("profile-edit-status--success");
          profileEditStatus.classList.remove("profile-edit-status--error");
        }
        return;
      }

      const resp = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "POST",
        credentials: "include",
        body: fd
      });

      if (!resp.ok) {
        let msg = "Не удалось сохранить профиль";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        if (resp.status === 409) msg = "Никнейм уже занят.";
        if (profileEditStatus) {
          profileEditStatus.textContent = msg;
          profileEditStatus.classList.add("profile-edit-status--error");
          profileEditStatus.classList.remove("profile-edit-status--success");
        }
        return;
      }

      const data = await resp.json();

      // Обновляем шапку профиля
      if (profileName) {
        const newName = data.full_name || name || username;
        if (newName) profileName.textContent = newName;
      }
      if (profileEmail && data.user_email) {
        profileEmail.textContent = data.user_email;
        if (profileEditEmailInput) profileEditEmailInput.value = data.user_email;
      }
      if (profileQuote) {
        profileQuote.textContent = about || profileQuote.textContent;
      }
      if (profileHeaderBgImg && data.avatar_url) {
        const u = data.avatar_url;
        profileHeaderBgImg.src = u.includes("?") ? `${u}&t=${Date.now()}` : `${u}?t=${Date.now()}`;
      }

      // Обновляем аватар в data атрибуте, чтобы дальше UI мог его брать как текущий
      if (document.body && data.avatar_url) {
        document.body.dataset.userAvatar = data.avatar_url;
      }

      // Обновляем аватар в пункте "Мой профиль" в настройках
      if (myProfileSettingsItem && data.avatar_url) {
        const avatarImg = myProfileSettingsItem.querySelector("img");
        if (avatarImg) {
          const u2 = data.avatar_url;
          avatarImg.src = u2.includes("?") ? `${u2}&t=${Date.now()}` : `${u2}?t=${Date.now()}`;
        }
      }

      if (profileEditStatus) {
        profileEditStatus.textContent = "Сохранено";
        profileEditStatus.classList.add("profile-edit-status--success");
        profileEditStatus.classList.remove("profile-edit-status--error");
      }
    } catch (error) {
      console.error("Ошибка сохранения профиля:", error);
      if (profileEditStatus) {
        profileEditStatus.textContent = "Ошибка при сохранении";
        profileEditStatus.classList.add("profile-edit-status--error");
        profileEditStatus.classList.remove("profile-edit-status--success");
      }
    } finally {
      if (profileEditSaveBtn) profileEditSaveBtn.disabled = false;
      if (profileAvatarInput) profileAvatarInput.value = "";
    }
  });
}

// Функция для открытия профиля группы или пользователя
async function handleAvatarClick(chatId) {
  console.log("handleAvatarClick called with chatId:", chatId, "currentChatIsGroup:", currentChatIsGroup);
  if (!chatId) {
    console.error("handleAvatarClick: chatId is missing!");
    return;
  }

  const chatButton = document.querySelector(
    `.chat-list-item-btn[data-chat-id="${chatId}"]`
  );
  
  console.log("chatButton found:", !!chatButton);
  if (chatButton) {
    console.log("chatButton data:", {
      isGroupChat: chatButton.dataset.isGroupChat,
      isGroup: chatButton.dataset.isGroup,
      chatId: chatButton.dataset.chatId
    });
  }
  
  // Проверяем, является ли это группой
  // Сначала проверяем currentChatIsGroup (глобальный флаг из loadChat)
  // Затем проверяем data-атрибуты кнопки чата, если она найдена
  const isGroup = currentChatIsGroup || 
                  (chatButton && (chatButton.dataset.isGroupChat === "true" || chatButton.dataset.isGroup === "true"));
  
  console.log("isGroup determined as:", isGroup);
  
  if (isGroup) {
    console.log("Opening group profile for chatId:", chatId);
    // Для группы открываем профиль группы
    try {
      const resp = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
        credentials: 'include'
      });
      if (!resp.ok) throw new Error("Ошибка загрузки данных группы");
      
      const chatData = await resp.json();
      
      // Преобразуем данные в формат, ожидаемый openGroupProfile
      const groupData = {
        chat_id: chatId,
        _id: chatId,
        group_name: chatData.chat_name || chatData.group_name,
        chat_name: chatData.chat_name,
        group_avatar: chatData.chat_avatar || chatData.group_avatar,
        chat_avatar: chatData.chat_avatar,
        participants: chatData.participants || [],
        owner: chatData.owner || chatData.group_owner
      };
      
        // Открываем профиль группы (участники с ролями)
        console.log("openGroupProfile function available:", typeof window.openGroupProfile === 'function');
        if (typeof window.openGroupProfile === 'function') {
          console.log("Calling openGroupProfile with data:", groupData);
          await window.openGroupProfile(groupData);
        } else {
          console.error("openGroupProfile function is not available!");
        }
      } catch (err) {
        console.error("Ошибка загрузки профиля группы:", err);
      }
  } else {
    // Для обычного чата открываем профиль пользователя
    if (chatButton) {
      const interlocutorEmail = chatButton.dataset.interlocutorEmail;
      if (interlocutorEmail) {
        openProfileModal(interlocutorEmail);
      }
    } else {
      // Если кнопка не найдена, пытаемся получить данные чата из API
      try {
        const resp = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
          credentials: 'include'
        });
        if (resp.ok) {
          const chatData = await resp.json();
          if (chatData.interlocutor_email) {
            openProfileModal(chatData.interlocutor_email);
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки данных чата:", err);
      }
    }
  }
}

// Обработчик клика на аватар в хедере чата
if (avatarContainer) {
  avatarContainer.addEventListener("click", async (e) => {
    e.stopPropagation();
    console.log("Avatar clicked in chat header, activeChatId:", activeChatId);
    if (!activeChatId) {
      console.error("activeChatId is not set!");
      return;
    }
    await handleAvatarClick(activeChatId);
  });
} else {
  console.error("avatarContainer element not found!");
}

// Обработчик клика на аватар в хедере группы (groupsAvatar-container)
// Этот элемент больше не используется, так как группы открываются в обычном chatWindow
// Но оставляем для совместимости
const groupsAvatarContainer = document.getElementById("groupsAvatar-container");
if (groupsAvatarContainer) {
  groupsAvatarContainer.addEventListener("click", async (e) => {
    e.stopPropagation();
    // Используем activeChatId, который устанавливается в loadChat
    if (activeChatId) {
      await handleAvatarClick(activeChatId);
    }
  });
}

// ============================================
// === ОБРАБОТЧИКИ МЕНЮ ЧАТА (ПЕРЕПИСАНО) ===
// ============================================

// Инициализация элементов меню
const menuToggleBtn = document.getElementById("menuToggleBtn");
const chatMenuDropdown = document.getElementById("chatMenuDropdown");
const groupSettingsMenuItem = document.getElementById("groupSettingsMenuItem");
const clearChatMenuItem = document.getElementById("clearChatMenuItem");
const deleteChatMenuItem = document.getElementById("deleteChatMenuItem");

// Обработчик клика на троеточие - открывает/закрывает меню
if (menuToggleBtn) {
  menuToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!activeChatId) {
      console.warn("Нет активного чата");
      return;
    }
    
    if (chatMenuDropdown) {
      chatMenuDropdown.classList.toggle("hidden");
    }
  });
}

// Обработчик клика на "Очистить историю"
if (clearChatMenuItem) {
  clearChatMenuItem.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Кнопка 'Очистить историю' нажата");
    
    // Закрываем меню
    if (chatMenuDropdown) {
      chatMenuDropdown.classList.add("hidden");
    }
    
    // Проверяем, что есть активный чат
    if (!activeChatId) {
      alert("Нет активного чата для очистки");
      return;
    }
    
    // Открываем модалку подтверждения
    openClearChatConfirmModal();
  });
} else {
  console.error("Кнопка clearChatMenuItem не найдена!");
}

// Обработчик клика на "Удалить чат"
if (deleteChatMenuItem) {
  deleteChatMenuItem.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Кнопка 'Удалить чат' нажата");
    
    // Закрываем меню
    if (chatMenuDropdown) {
      chatMenuDropdown.classList.add("hidden");
    }
    
    // Проверяем, что есть активный чат
    if (!activeChatId) {
      alert("Нет активного чата для удаления");
      return;
    }
    
    // Открываем модалку подтверждения
    openDeleteChatConfirmModal();
  });
} else {
  console.error("Кнопка deleteChatMenuItem не найдена!");
}

// Обработчик клика на "Настройки группы"
if (groupSettingsMenuItem) {
  groupSettingsMenuItem.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Закрываем меню
    if (chatMenuDropdown) {
      chatMenuDropdown.classList.add("hidden");
    }
    
    if (!activeChatId) return;
    
    // Открываем настройки группы
    if (typeof window.openGroupSettings === 'function') {
      await window.openGroupSettings(activeChatId);
    }
  });
}

// Закрытие меню при клике вне его
document.addEventListener("click", (e) => {
  if (chatMenuDropdown && !chatMenuDropdown.contains(e.target) && 
      menuToggleBtn && !menuToggleBtn.contains(e.target)) {
    chatMenuDropdown.classList.add("hidden");
  }
});

// === Функции для настроек конфиденциальности ===
function _setPrivacyStatus(msg, type) {
  if (!privacyStatus) return;
  if (!msg) {
    privacyStatus.classList.add("hidden");
    privacyStatus.textContent = "";
    privacyStatus.className = "my-profile-status hidden";
    return;
  }
  privacyStatus.classList.remove("hidden");
  privacyStatus.textContent = msg;
  privacyStatus.className = `my-profile-status ${type === "ok" ? "my-profile-status--ok" : type === "err" ? "my-profile-status--err" : ""}`;
}

function closePrivacySettingsPanel() {
  if (privacySettingsPanel) privacySettingsPanel.classList.add("hidden");
  if (settingsInfo) settingsInfo.classList.remove("has-my-profile");
  if (settingsInfoContent) settingsInfoContent.classList.remove("hidden");
  _setPrivacyStatus("", null);
}

async function openPrivacySettingsPanel() {
  if (!currentUserEmail) return;
  if (!privacySettingsPanel || !settingsInfo) return;

  // Закрываем панель профиля, если она открыта
  if (myProfileSettingsPanel && !myProfileSettingsPanel.classList.contains("hidden")) {
    closeMyProfileSettingsPanel();
  }

  // Убеждаемся, что открыта вкладка настроек
  if (window.switchTab && typeof window.switchTab === "function") {
    window.switchTab("settings");
  }

  if (settingsInfoContent) settingsInfoContent.classList.add("hidden");
  settingsInfo.classList.add("has-my-profile");
  privacySettingsPanel.classList.remove("hidden");
  _setPrivacyStatus("Загружаем настройки…", null);

  try {
    // Загружаем текущие настройки конфиденциальности
    const resp = await fetch(`${API_BASE_URL}/api/privacy/settings`, {
      credentials: "include"
    });
    if (!resp.ok) throw new Error("Не удалось загрузить настройки");
    const data = await resp.json();

    // Устанавливаем значения
    if (privacyLastSeenSelect) privacyLastSeenSelect.value = data.last_seen_visibility || "everyone";
    if (privacyProfilePhotoSelect) privacyProfilePhotoSelect.value = data.profile_photo_visibility || "everyone";
    if (privacyEmailInput) privacyEmailInput.value = data.email || currentUserEmail;
    
    // Обновляем кастомные dropdown'ы
    updateCustomDropdown("privacyLastSeen", data.last_seen_visibility || "everyone");
    updateCustomDropdown("privacyProfilePhoto", data.profile_photo_visibility || "everyone");

    // Загружаем черный список
    await loadBlockedUsers();

    // Обновляем кастомные dropdown'ы после загрузки данных
    // Сбрасываем флаг инициализации, чтобы переинициализировать
    customDropdownsInitialized.delete("privacyLastSeen");
    customDropdownsInitialized.delete("privacyProfilePhoto");
    
    // Инициализируем кастомные dropdown'ы после загрузки данных
    setTimeout(() => {
      initCustomDropdowns();
    }, 150);

    _setPrivacyStatus("", null);
  } catch (e) {
    console.error(e);
    _setPrivacyStatus("Ошибка загрузки настроек", "err");
  }
}

async function loadBlockedUsers() {
  if (!privacyBlockedUsersList) return;
  try {
    const resp = await fetch(`${API_BASE_URL}/api/privacy/blocked`, {
      credentials: "include"
    });
    if (!resp.ok) throw new Error("Не удалось загрузить черный список");
    const blocked = await resp.json();
    
    privacyBlockedUsersList.innerHTML = "";
    if (blocked.length === 0) {
      privacyBlockedUsersList.innerHTML = '<div style="color: rgba(0,0,0,0.45); font-size: 14px; padding: 8px;">Черный список пуст</div>';
      return;
    }

    for (const user of blocked) {
      const item = document.createElement("div");
      item.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(0,0,0,0.04); border-radius: 12px;";
      item.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-size: 14px; font-weight: 600; color: rgba(0,0,0,0.82);">${user.full_name || user.username || user.email}</span>
          <span style="font-size: 12px; color: rgba(0,0,0,0.55);">${user.email}</span>
        </div>
        <button type="button" class="my-profile-save" data-unblock-email="${user.email}" style="height: 36px; padding: 0 14px; font-size: 13px; background: #dc2626; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.25);">Разблокировать</button>
      `;
      const unblockBtn = item.querySelector(`[data-unblock-email="${user.email}"]`);
      if (unblockBtn) {
        unblockBtn.addEventListener("click", async () => {
          await unblockUser(user.email);
        });
      }
      privacyBlockedUsersList.appendChild(item);
    }
  } catch (e) {
    console.error(e);
    privacyBlockedUsersList.innerHTML = '<div style="color: #dc2626; font-size: 14px; padding: 8px;">Ошибка загрузки черного списка</div>';
  }
}

async function unblockUser(email) {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/privacy/unblock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email })
    });
    if (!resp.ok) throw new Error("Не удалось разблокировать пользователя");
    await loadBlockedUsers();
    _setPrivacyStatus("Пользователь разблокирован", "ok");
    setTimeout(() => _setPrivacyStatus("", null), 2000);
  } catch (e) {
    console.error(e);
    _setPrivacyStatus("Ошибка разблокировки", "err");
  }
}

// Обработчик клика на элементы настроек
(function initSettingsClick() {
  const settingsList = document.querySelector(".settings-list");
  const settingsInfoContent = document.getElementById("settingsInfoContent");
  if (!settingsList) return;

  settingsList.addEventListener("click", async (e) => {
    const settingsItem = e.target.closest(".settings-item");
    if (!settingsItem) return;

    const titleEl = settingsItem.querySelector(".settings-item-title");
    if (!titleEl) return;

    const title = (titleEl.textContent || "").trim();
    console.log("Клик на элемент настроек:", title);

    // Подсветка активного пункта (показывает, на какой вкладке/пункте ты сейчас)
    settingsList.querySelectorAll(".settings-item.active").forEach((el) => {
      el.classList.remove("active");
    });
    settingsItem.classList.add("active");

    if (title === "Конфиденциальность") {
      e.preventDefault();
      e.stopPropagation();
      await openPrivacySettingsPanel();
    } else if (title === "Оформление" || settingsItem.id === "appearanceSettingsItem" || settingsItem.dataset.settingsType === "appearance") {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openAppearancePanel === 'function') {
        openAppearancePanel();
      } else {
        console.error('openAppearancePanel не определена');
      }
    } else if (title === "Выйти" || settingsItem.id === "logoutSettingsItem" || settingsItem.dataset.settingsType === "logout") {
      e.preventDefault();
      e.stopPropagation();
      const overlay = document.getElementById("logoutConfirmOverlay");
      if (overlay) overlay.classList.remove("hidden");
    }
  });
})();

// Выход из аккаунта (модалка)
(function initLogoutModal() {
  const overlay = document.getElementById("logoutConfirmOverlay");
  const modal = document.getElementById("logoutConfirmModal");
  const cancelBtn = document.getElementById("logoutCancelBtn");
  const confirmBtn = document.getElementById("logoutConfirmBtn");

  if (!overlay || !modal) return;

  function close() {
    overlay.classList.add("hidden");
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
  }

  overlay.addEventListener("click", (e) => {
    // клик по затемнению — закрыть
    if (e.target === overlay) close();
  });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        confirmBtn.disabled = true;
        // Выходим: удаляем cookie через backend
        await fetch("/logout", { method: "GET", credentials: "include" });
      } catch (err) {
        console.error("Ошибка logout:", err);
      } finally {
        // Всегда уводим на регистрацию
        window.location.replace("/auth_page?tab=register");
      }
    });
  }
})();

// Обработчики для панели конфиденциальности
if (privacySettingsCloseBtn) {
  privacySettingsCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePrivacySettingsPanel();
  });
}

// Обработчик для панели оформления
const appearanceSettingsCloseBtn = document.getElementById("appearanceSettingsCloseBtn");
if (appearanceSettingsCloseBtn) {
  appearanceSettingsCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof closeAppearancePanel === 'function') {
      closeAppearancePanel();
    } else {
      console.error('closeAppearancePanel не определена');
    }
  });
}

// Сохранение настроек конфиденциальности
if (privacySettingsForm) {
  privacySettingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    if (privacySaveBtn) privacySaveBtn.disabled = true;
    _setPrivacyStatus("Сохраняем…", null);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/privacy/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          last_seen_visibility: privacyLastSeenSelect?.value || "everyone",
          profile_photo_visibility: privacyProfilePhotoSelect?.value || "everyone"
        })
      });

      if (!resp.ok) {
        let msg = "Не удалось сохранить настройки";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        _setPrivacyStatus(msg, "err");
        return;
      }

      _setPrivacyStatus("Сохранено", "ok");
    } catch (err) {
      console.error(err);
      _setPrivacyStatus("Ошибка при сохранении", "err");
    } finally {
      if (privacySaveBtn) privacySaveBtn.disabled = false;
    }
  });
}

// Смена пароля
if (privacyChangePasswordBtn) {
  privacyChangePasswordBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    const currentPassword = privacyCurrentPassword?.value || "";
    const newPassword = privacyNewPassword?.value || "";

    if (!currentPassword || !newPassword) {
      _setPrivacyStatus("Заполните все поля", "err");
      return;
    }

    if (newPassword.length < 6) {
      _setPrivacyStatus("Пароль должен быть не менее 6 символов", "err");
      return;
    }

    privacyChangePasswordBtn.disabled = true;
    _setPrivacyStatus("Меняем пароль…", null);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/privacy/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      if (!resp.ok) {
        let msg = "Не удалось сменить пароль";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        _setPrivacyStatus(msg, "err");
        return;
      }

      _setPrivacyStatus("Пароль успешно изменен", "ok");
      if (privacyCurrentPassword) privacyCurrentPassword.value = "";
      if (privacyNewPassword) privacyNewPassword.value = "";
    } catch (err) {
      console.error(err);
      _setPrivacyStatus("Ошибка при смене пароля", "err");
    } finally {
      privacyChangePasswordBtn.disabled = false;
    }
  });
}

// Обновление email
if (privacyUpdateEmailBtn) {
  privacyUpdateEmailBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    const newEmail = privacyEmailInput?.value?.trim() || "";
    if (!newEmail) {
      _setPrivacyStatus("Введите новый email", "err");
      return;
    }

    if (!newEmail.includes("@")) {
      _setPrivacyStatus("Некорректный email", "err");
      return;
    }

    privacyUpdateEmailBtn.disabled = true;
    _setPrivacyStatus("Обновляем email…", null);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/privacy/update-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          new_email: newEmail
        })
      });

      if (!resp.ok) {
        let msg = "Не удалось обновить email";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        _setPrivacyStatus(msg, "err");
        return;
      }

      _setPrivacyStatus("Email успешно обновлен", "ok");
      currentUserEmail = newEmail;
    } catch (err) {
      console.error(err);
      _setPrivacyStatus("Ошибка при обновлении email", "err");
    } finally {
      privacyUpdateEmailBtn.disabled = false;
    }
  });
}

// Блокировка пользователя
if (privacyBlockUserBtn) {
  privacyBlockUserBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!currentUserEmail) return;

    const emailToBlock = privacyBlockEmailInput?.value?.trim() || "";
    if (!emailToBlock) {
      _setPrivacyStatus("Введите email пользователя", "err");
      return;
    }

    if (!emailToBlock.includes("@")) {
      _setPrivacyStatus("Некорректный email", "err");
      return;
    }

    if (emailToBlock === currentUserEmail) {
      _setPrivacyStatus("Нельзя заблокировать самого себя", "err");
      return;
    }

    privacyBlockUserBtn.disabled = true;
    _setPrivacyStatus("Блокируем пользователя…", null);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/privacy/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: emailToBlock
        })
      });

      if (!resp.ok) {
        let msg = "Не удалось заблокировать пользователя";
        try {
          const err = await resp.json();
          if (err?.detail) msg = err.detail;
        } catch (_) {}
        _setPrivacyStatus(msg, "err");
        return;
      }

      _setPrivacyStatus("Пользователь заблокирован", "ok");
      if (privacyBlockEmailInput) privacyBlockEmailInput.value = "";
      await loadBlockedUsers();
      setTimeout(() => _setPrivacyStatus("", null), 2000);
    } catch (err) {
      console.error(err);
      _setPrivacyStatus("Ошибка при блокировке", "err");
    } finally {
      privacyBlockUserBtn.disabled = false;
    }
  });
}

// === Функции для кастомного dropdown ===
function initCustomDropdowns() {
  initCustomDropdown("privacyLastSeen", privacyLastSeenSelect);
  initCustomDropdown("privacyProfilePhoto", privacyProfilePhotoSelect);
}

function initCustomDropdown(prefix, selectElement) {
  if (!selectElement) return;
  
  const trigger = document.getElementById(`${prefix}Trigger`);
  const dropdown = document.getElementById(`${prefix}Dropdown`);
  const custom = document.getElementById(`${prefix}Custom`);
  
  if (!trigger || !dropdown || !custom) return;
  
  // Обновляем текст триггера при загрузке
  updateCustomDropdown(prefix, selectElement.value);
  
  // Клик по триггеру - открыть/закрыть
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = custom.classList.contains("active");
    
    // Закрываем все другие dropdown'ы
    document.querySelectorAll(".privacy-select-custom").forEach(el => {
      if (el !== custom) {
        el.classList.remove("active");
        el.querySelector(".privacy-select-dropdown")?.classList.remove("show");
        el.querySelector(".privacy-select-trigger")?.classList.remove("active");
      }
    });
    
    // Переключаем текущий
    if (isActive) {
      custom.classList.remove("active");
      dropdown.classList.remove("show");
      trigger.classList.remove("active");
    } else {
      custom.classList.add("active");
      dropdown.classList.add("show");
      trigger.classList.add("active");
    }
  });
  
  // Клик по опции
  dropdown.querySelectorAll(".privacy-select-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = option.dataset.value;
      
      // Обновляем оригинальный select
      selectElement.value = value;
      
      // Обновляем кастомный dropdown
      updateCustomDropdown(prefix, value);
      
      // Закрываем dropdown
      custom.classList.remove("active");
      dropdown.classList.remove("show");
      trigger.classList.remove("active");
      
      // Триггерим событие change для select
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
}

function updateCustomDropdown(prefix, value) {
  const selectElement = prefix === "privacyLastSeen" ? privacyLastSeenSelect : privacyProfilePhotoSelect;
  if (!selectElement) {
    console.warn(`Select элемент не найден для ${prefix}`);
    return;
  }
  
  const trigger = document.getElementById(`${prefix}Trigger`);
  const dropdown = document.getElementById(`${prefix}Dropdown`);
  
  if (!trigger || !dropdown) {
    console.warn(`Элементы dropdown не найдены для ${prefix}`);
    return;
  }
  
  // Обновляем значение в select
  if (selectElement.value !== value) {
    selectElement.value = value;
  }
  
  // Находим выбранную опцию
  const selectedOption = dropdown.querySelector(`[data-value="${value}"]`);
  if (selectedOption) {
    // Обновляем текст триггера
    const optionText = selectedOption.textContent.trim();
    if (trigger.textContent !== optionText) {
      trigger.textContent = optionText;
    }
    
    // Обновляем визуальное выделение
    dropdown.querySelectorAll(".privacy-select-option").forEach(opt => {
      opt.classList.remove("selected");
    });
    selectedOption.classList.add("selected");
  } else {
    console.warn(`Опция с значением ${value} не найдена в ${prefix}`);
  }
}

// Закрытие dropdown при клике вне его
document.addEventListener("click", (e) => {
  if (!e.target.closest(".privacy-select-custom")) {
    document.querySelectorAll(".privacy-select-custom").forEach(custom => {
      custom.classList.remove("active");
      custom.querySelector(".privacy-select-dropdown")?.classList.remove("show");
      custom.querySelector(".privacy-select-trigger")?.classList.remove("active");
    });
  }
});

// Инициализация кастомных dropdown'ов при загрузке
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomDropdowns);
} else {
  // Если DOM уже загружен, инициализируем сразу
  setTimeout(initCustomDropdowns, 100);
}

// Обработчики кнопок действий в профиле
if (profileMessageBtn) {
  profileMessageBtn.addEventListener("click", () => {
    closeProfileModal();
    // Фокус на поле ввода сообщения
    if (messageInput) {
      messageInput.focus();
    }
  });
}

if (profileCallBtn) {
  profileCallBtn.addEventListener("click", () => {
    // Здесь можно добавить логику звонка
    console.log("Инициация звонка");
    // closeProfileModal();
  });
}

// === Загрузка черновиков для всех чатов при инициализации ===
function loadAllDrafts() {
  if (!chatListUl) return;
  const chatButtons = chatListUl.querySelectorAll(".chat-list-item-btn");
  chatButtons.forEach((btn) => {
    const chatId = btn.dataset.chatId;
    if (chatId) {
      const draft = loadDraft(chatId);
      if (draft) {
        updateChatListDraft(chatId, draft);
      }
    }
  });
}


// Экспортируем функции в window для использования в других модулях
window.loadChat = loadChat;
window.renderMessage = renderMessage;
window.openProfileModal = openProfileModal;
window.loadProfileContent = loadProfileContent;

// === ФУНКЦИЯ: синхронизировать UI с URL (как в Telegram) ===
// ПРИНЦИП: URL = единственный источник правды
// - / = пустое состояние (нет открытого чата)
// - /имя = открыть чат (создать если не существует)
// - При перезагрузке остаемся в том же чате (из URL)
let isSyncingLocation = false; // Флаг для предотвращения повторных вызовов
async function syncUIWithLocation() {
  // Предотвращаем повторные вызовы
  if (isSyncingLocation) {
    console.log("[Telegram Logic] syncUIWithLocation уже выполняется, пропускаем");
    return;
  }
  
  isSyncingLocation = true;
  
  // Сохраняем текущий путь в начале функции для использования в конце
  const currentPath = window.location.pathname;
  
  try {
    // Получаем текущий путь из URL (единственный источник правды)
    // ВАЖНО: Берем slug из URL, а не из initialChatSlug (который может быть устаревшим)
    // Извлекаем slug из URL: /@username -> username, /username -> username
    let slug = "";
    if (currentPath !== "/") {
      slug = currentPath.startsWith("/@") ? currentPath.slice(2) : currentPath.slice(1);
    }
    // Если slug не найден в URL, используем initialChatSlug как fallback
    if (!slug && initialChatSlug) {
      slug = initialChatSlug.trim();
    }

    console.log("[Telegram Logic] Загрузка страницы, URL:", currentPath, "slug из URL:", slug);

  // === ШАГ 1: Если URL = / (без параметров) - показываем пустое состояние ===
  // НО: не закрываем чат, если он открыт по URL (может быть переход с /@username на /)
  if ((currentPath === "/" || (!slug && currentPath === "/")) && !isChatOpenedFromUrl) {
    console.log("[Telegram Logic] Показываем пустое состояние");
    // НО: НИКОГДА не закрываем чат, если он открыт по URL
    if (!isChatOpenedFromUrl || !activeChatId) {
      if (chatEmptyState) chatEmptyState.classList.remove("hidden");
      if (chatWindow) chatWindow.classList.add("hidden");
      activeChatId = null;
    } else {
      console.log("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат в ШАГ 1, но чат открыт по URL");
    }
    // Устанавливаем пустой заголовок страницы для списка чатов
    document.title = "";
    document
      .querySelectorAll(".chat-list-item-btn")
      .forEach((b) => b.classList.remove("active"));
    // Убеждаемся, что URL правильный
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
    return;
  }
  
  // Если чат открыт по URL, но URL изменился на / - это нормально, не закрываем чат
  if (currentPath === "/" && isChatOpenedFromUrl && activeChatId) {
    console.log("[Telegram Logic] Чат открыт по URL, URL изменился на /, но не закрываем чат");
    return;
  }

    // === ШАГ 2: Если есть slug в URL (/имя) - ОБЯЗАТЕЛЬНО открываем чат ===
    // Проверяем, что URL действительно содержит slug (не просто /)
    if (slug && currentPath !== "/" && slug.length > 0) {
    // ожидаем "@username", "username", или полный email "email@example.com"
    const raw = slug.startsWith("@") ? slug.slice(1) : slug;
    const target = raw.toLowerCase();
    // Проверяем, это email или username
    const isEmail = target.includes("@");

    if (target) {
      // Особый случай: /@favorit — это "Избранное"
      if (target === "favorit") {
        const favBtn = document.querySelector(
          '.chat-list-item-btn[data-is-favorite="true"]'
        );
        if (favBtn && favBtn.dataset.chatId) {
          const chatId = favBtn.dataset.chatId;
          console.log("[Telegram Logic] Открываем Избранное:", chatId);
          // Устанавливаем флаг, что чат открыт по URL
          isChatOpenedFromUrl = true;
          // Включаем защиту от закрытия чата
          protectChatFromClosing();
          
          document
            .querySelectorAll(".chat-list-item-btn")
            .forEach((b) => b.classList.remove("active"));
          favBtn.classList.add("active");
          setUnreadCount(chatId, 0);
          updateUrlForChat(favBtn);
          await loadChat(chatId);
          
          // КРИТИЧНО: Убеждаемся, что чат открыт и остается открытым
          // Делаем это несколько раз с небольшой задержкой, чтобы перекрыть любые другие обработчики
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 150));
            if (chatWindow) {
              chatWindow.classList.remove("hidden");
              chatWindow.style.display = "";
              chatWindow.style.visibility = "visible";
              chatWindow.style.opacity = "1";
            }
            if (chatEmptyState) {
              chatEmptyState.classList.add("hidden");
              chatEmptyState.style.display = "none";
            }
            activeChatId = chatId;
            window.activeChatId = chatId;
          }
          
          console.log("[Telegram Logic] Избранное успешно открыто и остается открытым, activeChatId:", chatId, "URL:", window.location.pathname, "isChatOpenedFromUrl:", isChatOpenedFromUrl);
          // КРИТИЧНО: Завершаем функцию здесь, чтобы ничего не закрыло чат
          return;
        }
      }

      // ВАЖНО: Ждем загрузки списка чатов перед поиском
      // Проверяем, что список чатов загружен в DOM
      let attempts = 0;
      const maxAttempts = 10;
      let matchedBtn = null;
      
      while (!matchedBtn && attempts < maxAttempts) {
        // Ждем немного, если список еще не загружен
        if (attempts > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        document
          .querySelectorAll(".chat-list-item-btn")
          .forEach((btn) => {
            if (matchedBtn) return;

            const u = (btn.dataset.interlocutorUsername || "").toLowerCase();
            // Поддерживаем ники с ведущим "@": @git и git считаем одинаковыми
            const uClean = u.startsWith("@") ? u.slice(1) : u;
            const e = (btn.dataset.interlocutorEmail || "").toLowerCase();
            const name = (btn.dataset.chatName || "").toLowerCase();

            const emailLocal =
              e && e.includes("@") ? e.split("@")[0].toLowerCase() : "";

            // Если это email, ищем точное совпадение по email
            if (isEmail) {
              if (e === target) {
                matchedBtn = btn;
              }
            } else {
              // Если это username, ищем по нику, локальной части email или имени
              if (
                (u && (u === target || uClean === target)) ||
                (emailLocal && emailLocal === target) ||
                (name && name === target)
              ) {
                matchedBtn = btn;
              }
            }
          });
        
        attempts++;
        if (matchedBtn) {
          console.log(`[Telegram Logic] Чат найден после ${attempts} попыток`);
          break;
        }
      }
      
      if (!matchedBtn && attempts >= maxAttempts) {
        console.warn("[Telegram Logic] Список чатов не загружен, чат не найден после", maxAttempts, "попыток");
      }

      if (matchedBtn) {
        const chatId = matchedBtn.dataset.chatId;
        if (chatId) {
          console.log("[Telegram Logic] Чат найден, открываем:", chatId);
          // Устанавливаем флаг, что чат открыт по URL
          isChatOpenedFromUrl = true;
          
          // снимаем выделение
          document
            .querySelectorAll(".chat-list-item-btn")
            .forEach((b) => b.classList.remove("active"));
          matchedBtn.classList.add("active");

          setUnreadCount(chatId, 0);
          updateUrlForChat(matchedBtn); // нормализуем URL
          await loadChat(chatId);
          
          // КРИТИЧНО: Убеждаемся, что чат открыт и остается открытым
          // Делаем это несколько раз с небольшой задержкой, чтобы перекрыть любые другие обработчики
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 150));
            if (chatWindow) {
              chatWindow.classList.remove("hidden");
              chatWindow.style.display = "";
              chatWindow.style.visibility = "visible";
              chatWindow.style.opacity = "1";
            }
            if (chatEmptyState) {
              chatEmptyState.classList.add("hidden");
              chatEmptyState.style.display = "none";
            }
            activeChatId = chatId;
            window.activeChatId = chatId;
          }
          
          console.log("[Telegram Logic] Чат успешно открыт и остается открытым, activeChatId:", chatId, "URL:", window.location.pathname, "isChatOpenedFromUrl:", isChatOpenedFromUrl);
          // КРИТИЧНО: Завершаем функцию здесь, чтобы ничего не закрыло чат
          return;
        }
      }

      // Если чата ещё нет в списке, ОБЯЗАТЕЛЬНО создаем его и открываем переписку
      if (!matchedBtn && target) {
        console.log("[Telegram Logic] Чат не найден, создаем новый для:", target);
        const success = await tryStartChatFromSlug(target);
        if (success) {
          // Чат успешно создан и открыт, URL уже обновлен в startChatWithUser
          console.log("[Telegram Logic] Чат успешно создан и открыт, остаемся в переписке");
          // Устанавливаем флаг, что чат открыт по URL
          isChatOpenedFromUrl = true;
          // Включаем защиту от закрытия чата
          protectChatFromClosing();
          
          // ВАЖНО: Убеждаемся, что чат остается открытым
          // Делаем это несколько раз с небольшой задержкой
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 150));
            if (chatWindow) {
              chatWindow.classList.remove("hidden");
              chatWindow.style.display = "";
              chatWindow.style.visibility = "visible";
              chatWindow.style.opacity = "1";
            }
            if (chatEmptyState) {
              chatEmptyState.classList.add("hidden");
              chatEmptyState.style.display = "none";
            }
            // Убеждаемся, что activeChatId установлен
            const currentChatBtn = document.querySelector(".chat-list-item-btn.active");
            if (currentChatBtn && currentChatBtn.dataset.chatId) {
              activeChatId = currentChatBtn.dataset.chatId;
              window.activeChatId = activeChatId;
            }
          }
          console.log("[Telegram Logic] Чат полностью открыт и защищен, activeChatId:", activeChatId);
          // КРИТИЧНО: Завершаем функцию здесь, чтобы ничего не закрыло чат
          return;
        } else {
          // Если не удалось создать чат - показываем пустое состояние и убираем ссылку
          console.warn("[Telegram Logic] Не удалось создать чат, переходим на главную");
          window.history.replaceState(null, "", "/");
          // НО: НИКОГДА не закрываем чат, если он открыт по URL (хотя в этом случае чат не был создан)
          if (!isChatOpenedFromUrl || !activeChatId) {
            if (chatEmptyState) chatEmptyState.classList.remove("hidden");
            if (chatWindow) chatWindow.classList.add("hidden");
            activeChatId = null;
          }
          // Устанавливаем пустой заголовок страницы для списка чатов
          document.title = "";
          return;
        }
      }
    }
    // Если slug есть, но target пустой - некорректный URL, показываем пустое состояние
    if (!target && slug) {
      console.warn("[Telegram Logic] Некорректный slug:", slug);
      window.history.replaceState(null, "", "/");
      // НО: НИКОГДА не закрываем чат, если он открыт по URL
      if (!isChatOpenedFromUrl || !activeChatId) {
        if (chatEmptyState) chatEmptyState.classList.remove("hidden");
        if (chatWindow) chatWindow.classList.add("hidden");
        activeChatId = null;
      } else {
        console.log("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат из-за некорректного slug, но чат открыт по URL");
      }
      // Устанавливаем пустой заголовок страницы для списка чатов
      document.title = "";
      return;
    }
  }

  // === ШАГ 3: Если дошли сюда и URL не / - это ошибка, показываем пустое состояние ===
  // ВАЖНО: Проверяем, что чат не был открыт по URL (чтобы не закрыть его)
  if (isChatOpenedFromUrl && activeChatId && chatWindow && !chatWindow.classList.contains("hidden")) {
    console.log("[Telegram Logic] Чат открыт по URL, не закрываем его. activeChatId:", activeChatId, "URL:", currentPath);
    return;
  }
  
  // Только если чат не открыт по URL и URL не / - показываем пустое состояние
  if (currentPath !== "/" && !isChatOpenedFromUrl) {
    console.warn("[Telegram Logic] Неожиданное состояние, показываем пустое состояние. URL:", currentPath);
    window.history.replaceState(null, "", "/");
    if (chatEmptyState) chatEmptyState.classList.remove("hidden");
    // НИКОГДА не закрываем чат, если он открыт по URL
    if (!isChatOpenedFromUrl || !activeChatId) {
      if (chatWindow) chatWindow.classList.add("hidden");
      activeChatId = null;
      isChatOpenedFromUrl = false;
      isProtectionActive = false; // Отключаем защиту
      if (protectionInterval) {
        clearInterval(protectionInterval);
        protectionInterval = null;
      }
      if (protectionObserver) {
        protectionObserver.disconnect();
        protectionObserver = null;
      }
      // Устанавливаем пустой заголовок страницы для списка чатов
      document.title = "";
    } else {
      console.log("[Telegram Logic] БЛОКИРОВАНО: попытка закрыть чат в syncUIWithLocation, но чат открыт по URL");
    }
    document
      .querySelectorAll(".chat-list-item-btn")
      .forEach((b) => b.classList.remove("active"));
  }
  } finally {
    // Снимаем флаг после завершения
    isSyncingLocation = false;
  }
}

/**
 * Пытается по слагу (username/email без домена) найти пользователя
 * и автоматически создать/открыть приватный чат с ним.
 * Использует уже существующие эндпоинты:
 *   - GET /api/users/search?query=...
 *   - POST /start_chat (startChatWithUser)
 * @param {string} targetSlugLower lowercased slug (username или часть email)
 */
async function tryStartChatFromSlug(targetSlugLower) {
  const q = (targetSlugLower || "").trim().replace(/^@+/, "").trim();
  if (!q) return false;
  try {
    const query = encodeURIComponent(q);
    const resp = await fetch(
      `${API_BASE_URL}/api/users/search?query=${query}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!resp.ok) {
      console.warn("Не удалось найти пользователя по слагу:", targetSlugLower);
      return false;
    }

    const data = await resp.json();
    const users = data.users || [];
    if (!users.length) {
      console.warn("Пользователь не найден:", targetSlugLower);
      return false;
    }

    // Берём первого подходящего пользователя
    const user = users[0];
    const email = user.email;
    const username = user.username || "";
    const title = user.full_name || username || email;

    if (!email) {
      console.warn("У пользователя нет email");
      return false;
    }

    // Создаем чат и открываем переписку
    await startChatWithUser(email, title, username);
    return true;
  } catch (e) {
    console.error("Ошибка при автоматическом создании чата по слагу:", e);
    return false;
  }
}

window.addEventListener("load", async () => {
  // Инициализируем элементы для упоминаний
  initMentionsElements();
  
  // Инициализируем элементы для прокрутки вниз
  scrollToBottomBtn = document.getElementById("scrollToBottomBtn");
  newMessagesCountEl = document.getElementById("newMessagesCount");
  
  // Проверяем, что все элементы меню найдены
  console.log("Проверка элементов меню:");
  console.log("menuToggleBtn:", document.getElementById("menuToggleBtn"));
  console.log("chatMenuDropdown:", document.getElementById("chatMenuDropdown"));
  console.log("clearChatMenuItem:", document.getElementById("clearChatMenuItem"));
  console.log("deleteChatMenuItem:", document.getElementById("deleteChatMenuItem"));
  console.log("clearChatConfirmOverlay:", document.getElementById("clearChatConfirmOverlay"));
  console.log("clearForAllOption:", document.getElementById("clearForAllOption"));
  console.log("clearForSelfOption:", document.getElementById("clearForSelfOption"));
  
  // Обработчик клика на кнопку прокрутки вниз
  if (scrollToBottomBtn) {
    scrollToBottomBtn.addEventListener("click", () => {
      scrollToBottom(true);
      newMessagesCount = 0;
      updateScrollToBottomButton();
    });
  }
  
  // Обработчик прокрутки чата для отслеживания позиции
  if (chatMessages) {
    chatMessages.addEventListener("scroll", () => {
      checkIfUserAtBottom();
    });
    
    // Делегирование событий для кликов на упоминания в сообщениях
    chatMessages.addEventListener("click", (e) => {
      const mentionElement = e.target.closest(".message-mention");
      if (mentionElement) {
        e.stopPropagation();
        handleMentionClick(mentionElement);
      }
    });
  }
  
  // Обработчик клика вне списка упоминаний для его закрытия
  document.addEventListener("click", (e) => {
    if (mentionsList && !mentionsList.contains(e.target) && e.target !== messageInput) {
      hideMentionsList();
    }
  });
  
  // Загружаем черновики для всех чатов
  loadAllDrafts();
  
  // === Инициализация переключения вкладок (SOLID: Dependency Inversion) ===
  const switchTab = initTabSwitching();

  // Инициализируем систему тем (после того как DOM готов)
  try {
    if (typeof initTheme === 'function') {
      initTheme();
    } else {
      console.error('initTheme не определена');
    }
  } catch (error) {
    console.error('Ошибка при инициализации темы:', error);
  }

  // === ШАГ 1: Подключаемся к WebSocket ОДИН РАЗ ===
  connectWebSocket(currentUserEmail);

  // === ШАГ 2: Восстанавливаем последний чат (если был) ===
  // Теперь ждем завершения, чтобы чат успел открыться
  await syncUIWithLocation();
  
  // ВАЖНО: Если чат открыт по URL, включаем ПОЛНУЮ защиту
  // Это защита от других обработчиков, которые могут закрыть чат
  if (isChatOpenedFromUrl && activeChatId) {
    console.log("[Telegram Logic] Чат открыт по URL, включаем ПОЛНУЮ защиту. activeChatId:", activeChatId);
    protectChatFromClosing();
  }

  // === Предзагрузка контактов, чтобы имена из контактов использовались в чатах/группах ===
  if (typeof loadContacts === "function") {
    try {
      await loadContacts();
    } catch (e) {
      console.error("Ошибка предзагрузки контактов:", e);
    }
  }

  // === Инициализация панели эмодзи ===
  initEmojiPicker();

  // === Инициализация обработчиков вложений ===
  initAttachmentHandlers();

  // === Инициализация поиска по чату ===
  if (chatSearchBtn && chatSearchWrapper && chatSearchInput) {
    chatSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = !chatSearchWrapper.classList.contains("hidden");
      if (isOpen) {
        closeChatSearch();
      } else {
        openChatSearch();
      }
    });

    chatSearchInput.addEventListener("input", (e) => {
      const raw = e.target.value;
      if (chatSearchClearBtn) chatSearchClearBtn.classList.remove("hidden");
      updateChatSearchResults(raw);
    });

    chatSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          moveChatSearchPrev();
        } else {
          moveChatSearchNext();
        }
        e.preventDefault();
      } else if (e.key === "Escape") {
        closeChatSearch();
      }
    });

    if (chatSearchClearBtn) {
      chatSearchClearBtn.addEventListener("click", () => {
        closeChatSearch();
      });
    }

    if (chatSearchPrevBtn) {
      chatSearchPrevBtn.addEventListener("click", () => {
        moveChatSearchPrev();
      });
    }

    if (chatSearchNextBtn) {
      chatSearchNextBtn.addEventListener("click", () => {
        moveChatSearchNext();
      });
    }
  }

  // === Инициализация вкладок: по умолчанию показываем чаты ===
  if (switchTab) {
    switchTab("chats");
  }

  // === Инициализация фильтрации: применяем фильтр, если в поле поиска уже есть значение ===
  if (searchInput && searchInput.value.trim()) {
    filterChatList(searchInput.value);
    // Показываем кнопку очистки, если есть текст
    if (searchClearBtn) {
      searchClearBtn.classList.remove("hidden");
    }
  }
});

// === Обработчик сброса активного чата при переключении вкладок ===
window.addEventListener("resetActiveChat", () => {
  // НО: НИКОГДА не закрываем чат, если он открыт по URL
  if (!isChatOpenedFromUrl || !activeChatId) {
    activeChatId = null;
    chatMessages.innerHTML = "";
  } else {
    console.log("[Telegram Logic] БЛОКИРОВАНО: попытка сбросить чат при переключении вкладок, но чат открыт по URL");
  }
  renderedMessageIds.clear();

  // Сбрасываем статус "Печатает..." если он был активен
  if (
    currentChatStatus &&
    currentChatStatus.classList.contains("typing-status")
  ) {
    currentChatStatus.textContent =
      currentChatStatus.dataset.originalText || "";
    currentChatStatus.classList.remove("typing-status");
  }
});

// === Обработчик установки флага показа пустого состояния ===
window.addEventListener("setShouldShowEmptyState", () => {
  shouldShowEmptyState = true;
});

// ====================================
// === ЭМОДЗИ ФУНКЦИОНАЛ ===
// ====================================

const emojiCategories = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
  ],
  food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
  ],
  travel: [
    "🚗",
    "🚕",
    "🚙",
    "🚌",
    "🚎",
    "🏎",
    "🚓",
    "🚑",
    "🚒",
    "🚐",
    "🛻",
    "🚚",
    "🚛",
    "🚜",
    "🏍",
    "🛵",
    "🚲",
    "🛴",
    "🛹",
    "🛼",
    "🚁",
    "✈️",
    "🛩",
    "🛫",
    "🛬",
    "🪂",
    "💺",
    "🚀",
    "🛸",
    "🚉",
  ],
  objects: [
    "💡",
    "🔦",
    "🕯",
    "🪔",
    "📔",
    "📕",
    "📖",
    "📗",
    "📘",
    "📙",
    "📚",
    "📓",
    "📒",
    "📃",
    "📜",
    "📄",
    "📰",
    "🗞",
    "📑",
    "🔖",
    "🏷",
    "💰",
    "🪙",
    "💴",
    "💵",
    "💶",
    "💷",
    "💸",
    "🪙",
    "💳",
  ],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
  ],
};

// Инициализация панели эмодзи
function initEmojiPicker() {
  const emojiPicker = document.getElementById("emojiPicker");
  const emojiContainer = document.getElementById("emojiContainer");
  const smileyIcon = document.getElementById("smileyIcon");
  const messageInput = document.getElementById("messageInput");

  // Загрузка эмодзи по категориям
  function loadEmojis(category = "smileys") {
    emojiContainer.innerHTML = "";
    const emojis = emojiCategories[category] || [];

    emojis.forEach((emoji) => {
      const emojiBtn = document.createElement("button");
      emojiBtn.type = "button";
      emojiBtn.className = "emoji-btn";
      emojiBtn.textContent = emoji;
      emojiBtn.addEventListener("click", () => {
        insertEmoji(emoji);
      });
      emojiContainer.appendChild(emojiBtn);
    });
  }

  // Вставка эмодзи в поле ввода
  function insertEmoji(emoji) {
    const start = messageInput.selectionStart;
    const end = messageInput.selectionEnd;
    const text = messageInput.value;
    const newText = text.substring(0, start) + emoji + text.substring(end);

    messageInput.value = newText;
    messageInput.focus();
    messageInput.setSelectionRange(start + emoji.length, start + emoji.length);

    // Обновляем состояние кнопок
    updateInputState();

    // Отправляем событие печати
    sendTypingEvent();
  }

  // Переключение категорий эмодзи
  document.querySelectorAll(".emoji-category-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".emoji-category-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      loadEmojis(this.dataset.category);
    });
  });

  // Открытие/закрытие панели эмодзи
  smileyIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    const isHidden = emojiPicker.classList.contains("hidden");

    // Закрываем меню вложений если открыто
    if (!attachmentMenu.classList.contains("hidden")) {
      attachmentMenu.classList.add("hidden");
    }

    // Переключаем панель эмодзи
    emojiPicker.classList.toggle("hidden");

    if (!isHidden) {
      // Если открывали панель, загружаем эмодзи
      loadEmojis();
    }

    // Обновляем состояние кнопок
    updateInputState();
  });

  // Закрытие панели эмодзи при клике вне ее
  document.addEventListener("click", function (e) {
    if (!emojiPicker.contains(e.target) && e.target !== smileyIcon) {
      emojiPicker.classList.add("hidden");
      updateInputState();
    }
  });

  // Закрытие панели эмодзи при отправке сообщения
  messageForm.addEventListener("submit", function () {
    emojiPicker.classList.add("hidden");
    updateInputState();
  });

  // Загружаем эмодзи по умолчанию при первом открытии
  loadEmojis();
}

// Функция для обновления состояния поля ввода и кнопок
function updateInputState() {
  const messageInput = document.getElementById("messageInput");
  const micIcon = document.getElementById("micIcon");
  const attachmentIcon = document.getElementById("attachmentIcon");
  const sendButton = document.getElementById("sendButton");
  const emojiPicker = document.getElementById("emojiPicker");

  const hasText = messageInput.value.trim() !== "";
  const emojiOpen = !emojiPicker.classList.contains("hidden");

  if (hasText || emojiOpen) {
    attachmentIcon.classList.add("hidden");
    sendButton.classList.remove("hidden");
    if (micIcon) micIcon.classList.add("hidden");
  } else {
    attachmentIcon.classList.remove("hidden");
    sendButton.classList.add("hidden");
    if (micIcon) micIcon.classList.remove("hidden");
  }
}

// ===================================
// === ФУНКЦИЯ ФИЛЬТРАЦИИ ЧАТОВ ===
// ===================================
function filterChatList(query) {
  if (!chatListUl) return;
  const filter = (query || "").trim().toLowerCase();
  const filterNoAt = filter.replace(/^@+/, "");

  // Получаем все элементы списка чатов (<li>)
  const chatListItems = chatListUl.querySelectorAll("li");
  let hasVisibleChats = false;

  chatListItems.forEach((li) => {
    // Пропускаем служебные элементы (заголовки, разделители, результаты поиска)
    if (
      li.classList.contains("search-results-header") ||
      li.classList.contains("search-result-item-list") ||
      li.classList.contains("sidebar-divider") ||
      li.classList.contains("no-results-message")
    ) {
      return; // Не фильтруем служебные элементы
    }

    // Ищем кнопку чата внутри <li>
    const chatButton = li.querySelector(".chat-list-item-btn");
    if (!chatButton) {
      return; // Пропускаем элементы без кнопки чата
    }

    // Ищем название чата (используем .chat-name, как в HTML)
    const chatNameElement = chatButton.querySelector(".chat-name");
    const chatName = chatNameElement
      ? chatNameElement.textContent.trim().toLowerCase()
      : "";

    // Также проверяем data-атрибут chat-name для надежности
    const chatNameFromData = chatButton.dataset.chatName
      ? chatButton.dataset.chatName.trim().toLowerCase()
      : "";

    // Используем название из элемента или из data-атрибута
    const titleToSearch = chatName || chatNameFromData;

    // Также ищем по последнему сообщению для более точного поиска
    const lastMessageElement = chatButton.querySelector(".last-message");
    const lastMessage = lastMessageElement
      ? lastMessageElement.textContent.trim().toLowerCase()
      : "";

    // Никнейм и email собеседника (по ним тоже ищем)
    const username = (chatButton.dataset.interlocutorUsername || "").trim().toLowerCase().replace(/^@+/, "");
    const email = (chatButton.dataset.interlocutorEmail || "").trim().toLowerCase();
    const emailLocal = email && email.includes("@") ? email.split("@")[0] : "";

    // Проверяем совпадение по названию, сообщению, никнейму или email
    const matchesTitle = filter === "" || titleToSearch.includes(filter);
    const matchesMessage =
      filter === "" || (lastMessage && lastMessage.includes(filter));
    const matchesUsername = filter === "" || (username && filterNoAt && username.includes(filterNoAt));
    const matchesEmail = filter === "" || (email && email.includes(filter)) || (emailLocal && filterNoAt && emailLocal.includes(filterNoAt));
    const isVisible = matchesTitle || matchesMessage || matchesUsername || matchesEmail;

    if (isVisible) {
      li.classList.remove("hidden");
      li.style.display = ""; // Убираем inline стили, если были
      hasVisibleChats = true;
    } else {
      li.classList.add("hidden");
      li.style.display = "none"; // Дополнительно скрываем через display
    }
  });

  // Показываем/скрываем кнопку очистки
  if (searchClearBtn) {
    searchClearBtn.classList.toggle("hidden", filter === "");
  }
}

// ===================================
// === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ПОИСКА ===
// ===================================

// Получаем форму поиска
const searchForm = document.getElementById("searchForm");

if (searchForm) {
  // Предотвращаем отправку формы (перезагрузку страницы)
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Мгновенный поиск уже работает через событие 'input'
    // Но если пользователь нажал Enter, тоже фильтруем
    if (searchInput) {
      filterChatList(searchInput.value);
    }
  });
}

if (searchInput) {
  // 1. МГНОВЕННЫЙ ПОИСК по мере ввода (событие 'input')
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    const trimmedQuery = query.trim();

    // Проверяем, какая вкладка активна
    const botsButton = document.getElementById("botsButton");
    const isBotsTab = botsButton && botsButton.classList.contains("active");

    if (trimmedQuery.length === 0) {
      // Если поле пустое, показываем основной список и скрываем результаты поиска пользователей
      if (userSearchResultsUl) {
        userSearchResultsUl.style.display = "none";
        userSearchResultsUl.innerHTML = "";
      }
      if (chatListUl) {
        chatListUl.style.display = "block";
      }
      
      if (isBotsTab) {
        // Во вкладке "Боты" перезагружаем список ботов без фильтра
        if (window.loadBotsList) {
          window.loadBotsList("");
        }
      } else {
        // В обычных чатах фильтруем список
        filterChatList(""); // Сброс фильтра чатов
      }
    } else {
      if (isBotsTab) {
        // Во вкладке "Боты" ищем только ботов
        if (window.loadBotsList) {
          window.loadBotsList(query);
        }
        // Скрываем результаты поиска пользователей
        if (userSearchResultsUl) {
          userSearchResultsUl.style.display = "none";
          userSearchResultsUl.innerHTML = "";
        }
      } else {
        // В обычных чатах фильтруем список и ищем пользователей
        filterChatList(query);
        // Параллельно ищем пользователей на бэкенде
        searchUsers(query);
      }
    }
  });
}

if (searchClearBtn) {
  // 2. ОЧИСТКА ПОЛЯ ПОИСКА (при клике на крестик)
  searchClearBtn.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
      filterChatList(""); // Сброс фильтра
    }
    // Также прячем результаты поиска пользователей и показываем список чатов
    if (userSearchResultsUl) {
      userSearchResultsUl.style.display = "none";
      userSearchResultsUl.innerHTML = "";
    }
    if (chatListUl) {
      chatListUl.style.display = "block";
    }
  });
}

/**
 * Рендерит список чатов.
 * @param {Array<Object>} chats - Список объектов чатов.
 * ПРИМЕЧАНИЕ: Эта функция не используется для начального рендеринга.
 * Начальный рендеринг идет через Jinja шаблон в HTML.
 */
function renderChatList(chats) {
  // Функция оставлена для совместимости, но не используется
  // Чаты рендерятся через Jinja шаблон в chats.html
  return;
}

async function searchUsers(query) {
  const trimmedQuery = (query || "").trim();
  const queryForApi = trimmedQuery.replace(/^@+/, "").trim();
  if (trimmedQuery.length < 1 || queryForApi.length < 1) {
    if (userSearchResultsUl) {
      userSearchResultsUl.innerHTML = "";
      userSearchResultsUl.style.display = "none";
    }
    if (chatListUl) chatListUl.style.display = "block";
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/search?query=${encodeURIComponent(
        queryForApi
      )}`
    );
    if (!response.ok) {
      throw new Error("Ошибка поиска пользователей");
    }
    const data = await response.json();
    const users = Array.isArray(data) ? data : data.users || [];
    renderUserSearchResults(users);
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error);
    if (userSearchResultsUl) {
      userSearchResultsUl.innerHTML = "";
    }
  }
}

/**
 * Рендерит результаты поиска пользователей с кнопкой "Начать чат".
 * @param {Array<Object>} users - Список найденных объектов пользователей.
 */
function renderUserSearchResults(users) {
  if (!userSearchResultsUl) return;

  userSearchResultsUl.innerHTML = "";

  // Скрываем обычный список чатов и показываем результаты поиска
  chatListUl.style.display = "none";
  userSearchResultsUl.style.display = "block";

  // === ДОБАВЛЯЕМ "ИЗБРАННОЕ" В РЕЗУЛЬТАТЫ ПОИСКА, ЕСЛИ СОВПАДАЕТ ЗАПРОС ===
  try {
    const currentQuery = (searchInput && searchInput.value) || "";
    const q = currentQuery.trim().toLowerCase();
    if (q && ("избран".includes(q) || q.includes("избран") || q === "favorit")) {
      const favBtn = document.querySelector(
        '.chat-list-item-btn[data-is-favorite="true"]'
      );
      if (favBtn) {
        const favLi = document.createElement("li");
        favLi.classList.add("search-result-item-list");
        favLi.innerHTML = `
          <button type="button" class="chat-list-item-btn search-result-chat-btn" data-favorite-shortcut="true">
            <img src="/images/avatars/favorit.png" alt="Избранное" />
            <div class="chat-info">
              <div class="chat-name">Избранное</div>
              <div class="last-message">Личные заметки</div>
            </div>
          </button>
        `;
        const btn = favLi.querySelector("button");
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const chatId = favBtn.dataset.chatId;
          if (!chatId) return;
          // Скрываем результаты поиска и показываем список чатов
          if (userSearchResultsUl) {
            userSearchResultsUl.style.display = "none";
            userSearchResultsUl.innerHTML = "";
          }
          if (chatListUl) {
            chatListUl.style.display = "block";
          }
          // Активируем фаворит в списке и открываем чат
          document
            .querySelectorAll(".chat-list-item-btn")
            .forEach((b) => b.classList.remove("active"));
          favBtn.classList.add("active");
          setUnreadCount(chatId, 0);
          updateUrlForChat(favBtn);
          loadChat(chatId);
        });
        userSearchResultsUl.appendChild(favLi);
      }
    }
  } catch (e) {
    console.warn("Не удалось добавить Избранное в результаты поиска:", e);
  }

  if (users.length === 0 && !userSearchResultsUl.children.length) {
    userSearchResultsUl.innerHTML =
      '<li class="chat-item">Нет результатов поиска.</li>';
    return;
  }

  users.forEach((user) => {
    const safeEmail = user.email || "";
    const title =
      user.full_name ||
      user.username ||
      safeEmail.split("@")[0] ||
      "Пользователь";

    const avatarSrc = user.profile_picture || "/images/юзер.svg";

    const listItem = document.createElement("li");
    listItem.classList.add("search-result-item-list");
    listItem.dataset.userId = safeEmail; // Используем email как уникальный ID для поиска

    listItem.innerHTML = `
      <button type="button" class="chat-list-item-btn search-result-chat-btn">
        <img src="${avatarSrc}" alt="Avatar" />
        <div class="chat-info">
          <div class="chat-name">${title}</div>
          <div class="last-message">${safeEmail}</div>
        </div>
        <span class="chat-timestamp">
          <button class="start-chat-btn" type="button" title="Начать чат" aria-label="Начать чат">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4v16M4 12h16" stroke-linecap="round"/>
            </svg>
          </button>
        </span>
      </button>
    `;

    // Обработчик кнопки "Начать чат"
    const startChatBtn = listItem.querySelector(".start-chat-btn");
    if (startChatBtn) {
      startChatBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        startChatWithUser(safeEmail, title, user.username || "");
      });
    }

    userSearchResultsUl.appendChild(listItem);
  });
}

/**
 * Стартует (или открывает существующий) приватный чат через backend /start_chat
 * и сразу переводит пользователя в окно этого чата.
 * Чат в базе создаётся, но сообщений ещё нет — пока пользователь не напишет первое.
 * @param {string} otherUserEmail
 * @param {string} title
 * @param {string} [otherUserUsername]
 */
async function startChatWithUser(otherUserEmail, title, otherUserUsername) {
  try {
    // 1. Прячем результаты поиска
    if (userSearchResultsUl) {
      userSearchResultsUl.style.display = "none";
      userSearchResultsUl.innerHTML = "";
    }

    // 2. Запрашиваем /start_chat, чтобы получить или создать чат
    const fd = new FormData();
    fd.append("target_email", otherUserEmail);

    const resp = await fetch(`${API_BASE_URL}/start_chat`, {
      method: "POST",
      body: fd,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.detail || "Не удалось начать чат");
    }

    const data = await resp.json();
    const chatId = data.chat_id;
    if (!chatId) {
      throw new Error("Сервер не вернул chat_id");
    }

    // 3. Пытаемся найти существующий элемент чата в списке
    let chatBtn = document.querySelector(
      `.chat-list-item-btn[data-chat-id="${chatId}"]`
    );

    // Если его ещё нет в DOM (новый чат) — создаём простой элемент списка
    if (!chatBtn) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chat-list-item-btn";
      btn.dataset.chatId = chatId;
      btn.dataset.interlocutorEmail = otherUserEmail;
      btn.dataset.interlocutorUsername = otherUserUsername || "";
      btn.dataset.chatName = title;
      btn.dataset.avatarUrl = "/images/юзер.svg";
      btn.dataset.isGroupChat = "false";
      btn.dataset.isBlocked = "false";
      btn.dataset.lastTimestamp = new Date().toISOString();
      btn.dataset.lastSenderEmail = "";
      btn.dataset.isOnline = "false";
      btn.dataset.lastSeen = "";

      btn.innerHTML = `
        <img src="/images/юзер.svg" alt="Chat Avatar" />
        <div class="chat-info">
          <div class="chat-name">${title}</div>
          <div class="last-message" data-chat-id="${chatId}" data-original-text="Нет сообщений">
            Нет сообщений
          </div>
        </div>
        <span class="chat-timestamp">
          <span class="chat-list-ticks" data-chat-id="${chatId}"></span>
          <span class="chat-list-time"></span>
        </span>
      `;

      li.appendChild(btn);
      // Добавляем новый чат в начало списка
      chatListUl.prepend(li);
      chatBtn = btn;
    }

    // 4. Сбрасываем выделение и подсвечиваем новый/найденный чат
    document
      .querySelectorAll(".chat-list-item-btn")
      .forEach((b) => b.classList.remove("active"));
    chatBtn.classList.add("active");

    // 4.1. ОБЯЗАТЕЛЬНО обновляем URL на /@username (Telegram логика)
    // URL должен отражать текущий открытый чат
    updateUrlForChat(chatBtn);

    // 5. Сбрасываем поиск так же, как при нажатии на крестик
    if (searchInput) {
      searchInput.value = "";
    }
    if (searchClearBtn) {
      searchClearBtn.classList.add("hidden");
    }
    filterChatList("");
    if (chatListUl) {
      chatListUl.style.display = "block";
    }

    // 6. Открываем окно чата
    // Если чат открыт по URL, устанавливаем флаг перед загрузкой и включаем защиту
    if (isChatOpenedFromUrl) {
      console.log("[Telegram Logic] startChatWithUser: чат открыт по URL, сохраняем флаг и включаем защиту");
      protectChatFromClosing();
    }
    
    // loadChat уже показывает окно чата внутри себя, но убеждаемся еще раз
    await loadChat(chatId);
    
    // Дополнительная гарантия: показываем окно чата и скрываем пустое состояние
    // Если чат открыт по URL, делаем это несколько раз
    if (isChatOpenedFromUrl) {
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        if (chatWindow) {
          chatWindow.classList.remove("hidden");
          chatWindow.style.display = "";
          chatWindow.style.visibility = "visible";
          chatWindow.style.opacity = "1";
        }
        if (chatEmptyState) {
          chatEmptyState.classList.add("hidden");
          chatEmptyState.style.display = "none";
        }
        activeChatId = chatId;
        window.activeChatId = chatId;
      }
    } else {
      if (chatWindow) chatWindow.classList.remove("hidden");
      if (chatEmptyState) chatEmptyState.classList.add("hidden");
    }
    if (messageInput) messageInput.focus();
  } catch (err) {
    console.error("Ошибка при старте чата:", err);
    alert(err.message || "Не удалось начать чат");
  }
}

// ===================================================================
// === КОНТАКТЫ ======================================================
// ===================================================================

const contactsList = document.getElementById("contactsList");
const contactsEmpty = document.getElementById("contactsEmpty");
const contactsCountDisplay = document.getElementById("contactsCountDisplay");
const openAddContactBtn = document.getElementById("openAddContactBtn");
const addContactModal = document.getElementById("addContactModal");
const addContactForm = document.getElementById("addContactForm");
const addContactCloseBtn = document.getElementById("addContactCloseBtn");
const cancelAddContact = document.getElementById("cancelAddContact");
const contactFirstNameInput = document.getElementById("contactFirstName");
const contactLastNameInput = document.getElementById("contactLastName");
const contactEmailInput = document.getElementById("contactEmail");
const addContactError = document.getElementById("addContactError");

// Карта контактов по email для использования в чатах / группах
let contactsByEmail = {};
window.CONTACTS_BY_EMAIL = contactsByEmail;

function toggleContactsHidden(el, hidden) {
  if (!el) return;
  if (hidden) {
    el.classList.add("hidden");
  } else {
    el.classList.remove("hidden");
  }
}

function formatContactStatus(lastSeen, isOnline) {
  if (isOnline) {
    return "В сети";
  }
  if (typeof lastSeen === "string" && lastSeen.toLowerCase() === "online") {
    return "В сети";
  }
  if (!lastSeen) {
    return "";
  }
  try {
    const d = new Date(lastSeen);
    if (isNaN(d.getTime())) return "";
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMin < 1) return "Только что";
    if (diffMin < 60) return `Был(а) ${diffMin} мин. назад`;
    if (diffHour < 24) return `Был(а) ${diffHour} ч. назад`;
    if (diffDay === 1) {
      const timeStr = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      return `Был(а) вчера в ${timeStr}`;
    }
    if (diffDay < 7) return `Был(а) ${diffDay} дн. назад`;
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return typeof lastSeen === "string" ? lastSeen : "";
  }
}

function renderContactsList(contacts = []) {
  if (!contactsList) return;
  contactsList.innerHTML = "";

  // Перестраиваем карту контактов
  contactsByEmail = {};
  window.CONTACTS_BY_EMAIL = contactsByEmail;

  if (!contacts || contacts.length === 0) {
    if (contactsEmpty) {
      contactsEmpty.textContent = "Пока нет контактов";
      toggleContactsHidden(contactsEmpty, false);
    }
    return;
  }
  toggleContactsHidden(contactsEmpty, true);

  contacts.forEach((c) => {
    const displayName = c.display_name || c.full_name || c.username || c.email || "Контакт";
    const isOnline = c.is_online || false;

    if (c.email) {
      contactsByEmail[c.email] = {
        display_name: c.display_name,
        full_name: c.full_name,
        username: c.username,
        contact_name: displayName,
      };
    }

    const lastSeen = c.last_seen;
    const status = formatContactStatus(lastSeen, isOnline);
    const statusClass = isOnline ? "online" : "";

    const li = document.createElement("li");
    li.className = "contact-card";
    li.dataset.email = c.email || "";
    li.dataset.username = c.username || "";
    li.dataset.displayName = displayName;
    li.innerHTML = `
      <div class="contact-avatar">
        <img src="${c.profile_picture || "/images/юзер.svg"}" alt="${displayName}" />
        ${isOnline ? '<div class="contact-online-dot"></div>' : ''}
      </div>
      <div class="contact-info">
        <div class="contact-name">
          ${displayName}
          ${c.is_favorite ? '<span class="contact-name-star">⭐</span>' : ''}
        </div>
        <div class="contact-status ${statusClass}">${status}</div>
      </div>
    `;

    // Клик по контакту — открываем чат с ним
    li.addEventListener("click", async () => {
      // Переключаемся на вкладку "Чаты"
      const chatsBtn = document.getElementById("chatsButton");
      if (chatsBtn) {
        chatsBtn.click();
      }
      // Открываем чат с контактом
      setTimeout(() => {
        if (c.email) {
          startChatWithUser(c.email, displayName, c.username || "");
        }
      }, 100);
    });

    contactsList.appendChild(li);
  });
}

async function loadContacts() {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/contacts`, {
      credentials: 'include'
    });
    if (!resp.ok) throw new Error("Не удалось загрузить контакты");
    const data = await resp.json();
    if (contactsCountDisplay) {
      contactsCountDisplay.textContent = data.count || 0;
    }
    renderContactsList(data.contacts || []);
  } catch (err) {
    console.error("Ошибка загрузки контактов:", err);
    if (contactsCountDisplay) contactsCountDisplay.textContent = "0";
    renderContactsList([]);
  }
}

function openAddContactModal() {
  if (!addContactModal) return;
  toggleContactsHidden(addContactModal, false);
  if (addContactError) toggleContactsHidden(addContactError, true);
  if (contactFirstNameInput) contactFirstNameInput.focus();
}

function closeAddContactModal() {
  toggleContactsHidden(addContactModal, true);
  if (addContactForm) addContactForm.reset();
  if (addContactError) toggleContactsHidden(addContactError, true);
}

function showAddContactError(message) {
  if (!addContactError) return;
  addContactError.textContent = message;
  toggleContactsHidden(addContactError, false);
}

// Обработчики событий для контактов
if (openAddContactBtn) {
  openAddContactBtn.addEventListener("click", () => {
    openAddContactModal();
  });
}

if (addContactCloseBtn) {
  addContactCloseBtn.addEventListener("click", closeAddContactModal);
}

if (cancelAddContact) {
  cancelAddContact.addEventListener("click", closeAddContactModal);
}

if (addContactForm) {
  addContactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!contactFirstNameInput || !contactEmailInput) return;
    const firstName = contactFirstNameInput.value.trim();
    const lastName = contactLastNameInput?.value.trim();
    const email = contactEmailInput.value.trim().toLowerCase();

    if (!firstName) {
      showAddContactError("Имя обязательно");
      return;
    }
    if (!email) {
      showAddContactError("Укажите почту");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName || null,
        }),
      });

      if (resp.status === 404) {
        showAddContactError("Пользователь не найден в системе");
        return;
      }

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        showAddContactError(errData.detail || "Не удалось добавить контакт");
        return;
      }

      closeAddContactModal();
      await loadContacts();
    } catch (err) {
      console.error("Ошибка добавления контакта:", err);
      showAddContactError("Произошла ошибка, попробуйте еще раз");
    }
  });
}

// Закрытие модалки по клику на фон
if (addContactModal) {
  addContactModal.addEventListener("click", (e) => {
    if (e.target === addContactModal) {
      closeAddContactModal();
    }
  });
}

// Загрузка контактов при открытии вкладки
window.addEventListener("contactsTabOpened", () => {
  loadContacts();
});

// Экспортируем функцию для использования в других местах
window.loadContacts = loadContacts;

