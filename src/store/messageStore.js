const KEY = 'nn_messages';

export const DEFAULT_MESSAGES = {
  Family: "Hey! In a meeting, but if it's urgent about the house, call twice.",
  Work: "Focused on deep work. Will respond to all Slacks after 12:00 PM.",
  Friends: "Busy right now! Catch you later tonight for the game?",
  Unknown: 'Currently unavailable.',
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

const messageStore = {
  getAll,
  getForStatus,
  saveForStatus,
};

export default messageStore;
