import authStore from './authStore';

const BASE_KEY = 'call_logs';

function getStorageKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

/**
 * Gets all call logs for current user.
 * @returns {Array} List of log items
 */
function getAll() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Adds a new call log entry.
 * @param {Object} log
 * @returns {Array} Updated logs
 */
function add(log) {
  const logs = getAll();
  const newLog = {
    id: log.id || `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: log.name || 'Unknown',
    number: log.number || log.phone || null,
    group: log.group || 'Unknown',
    type: log.type || 'Missed Call',
    time: log.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    timestamp: Date.now(),
    count: log.count || 1,
    avatar: log.avatar || '👤',
  };
  const updated = [newLog, ...logs];
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Clears all call logs for current user.
 */
function clear() {
  try {
    localStorage.removeItem(getStorageKey());
  } catch {
    // ignore
  }
  return [];
}

const callLogStore = {
  getAll,
  add,
  clear,
};

export default callLogStore;
