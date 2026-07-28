const GLOBAL_KEY = 'nn_messages_global';

export const DEFAULT_MESSAGES = {
  Family: "Hey! I'm currently focused. If it's urgent, please call twice. I'll get back to you soon. ❤️",
  Work: 'I am currently in a meeting and not checking messages. For immediate assistance, please contact the support desk.',
  Friends: "I'm currently in a flow state. Text #URGENT if you need me now, otherwise catch you later! 🚀",
  Unknown: 'The recipient is currently unavailable. Your message has been logged and will be seen once they are back online.',
};

export const DEFAULT_UPDATED_AT = {
  Family: Date.now() - 2 * 60 * 60 * 1000,    // 2h ago
  Work: Date.now() - 3 * 60 * 60 * 1000,      // 3h ago
  Friends: Date.now() - 24 * 60 * 60 * 1000,  // 1d ago
  Unknown: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1w ago
};

/**
 * Reads all status group messages from localStorage.
 * @returns {Object} Map of statusId -> { Family, Work, Friends, Unknown }
 */
function getAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Gets group messages for a specific statusId.
 * Falls back to DEFAULT_MESSAGES if not set.
 * @param {string} statusId
 * @returns {Object} { Family, Work, Friends, Unknown }
 */
function getForStatus(statusId) {
  const all = getAll();
  return {
    ...DEFAULT_MESSAGES,
    ...(all[statusId] || {}),
  };
}

/**
 * Saves group messages for a specific statusId.
 * @param {string} statusId
 * @param {Object} messages - { Family, Work, Friends, Unknown }
 */
function saveForStatus(statusId, messages) {
  const all = getAll();
  const updated = {
    ...all,
    [statusId]: {
      ...DEFAULT_MESSAGES,
      ...(all[statusId] || {}),
      ...messages,
    },
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated[statusId];
}

/**
 * Reads global (non-status-specific) group messages.
 * @returns {{ messages: Object, updatedAt: Object }}
 */
function getGlobal() {
  try {
    const raw = localStorage.getItem(GLOBAL_KEY);
    if (!raw) return { messages: { ...DEFAULT_MESSAGES }, updatedAt: { ...DEFAULT_UPDATED_AT } };
    return JSON.parse(raw);
  } catch {
    return { messages: { ...DEFAULT_MESSAGES }, updatedAt: { ...DEFAULT_UPDATED_AT } };
  }
}

/**
 * Saves a single group's global message.
 * @param {string} group - 'Family' | 'Work' | 'Friends' | 'Unknown'
 * @param {string} text
 */
function saveGlobal(group, text) {
  const current = getGlobal();
  const updated = {
    messages: { ...current.messages, [group]: text },
    updatedAt: { ...current.updatedAt, [group]: Date.now() },
  };
  try {
    localStorage.setItem(GLOBAL_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

const messageStore = {
  getAll,
  getById: getForStatus,
  getForStatus,
  saveForStatus,
  getGlobal,
  saveGlobal,
};

export default messageStore;
