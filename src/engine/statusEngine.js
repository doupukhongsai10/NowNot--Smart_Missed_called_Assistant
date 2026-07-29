import statusStore from '../store/statusStore';
import authStore from '../store/authStore';

const BASE_KEY = 'active_status';

function getKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

/**
 * Reads the currently active status from localStorage for current user.
 * Automatically checks for expiry and deactivates if expired.
 * @returns {Object|null} The active status record or null if idle
 */
function getActive() {
  const activeKey = getKey();
  try {
    const raw = localStorage.getItem(activeKey);
    if (!raw) return null;
    const active = JSON.parse(raw);
    if (!active || !active.expiresAt) return null;

    if (Date.now() >= active.expiresAt) {
      deactivate();
      return null;
    }

    // Attach current status metadata
    const detail = statusStore.getById(active.statusId);
    return {
      ...active,
      detail: detail || { name: active.statusName || 'Active Status', emoji: active.statusEmoji || '⚡' },
    };
  } catch {
    return null;
  }
}

/**
 * Deactivates the currently active status for current user (INV-1).
 */
function deactivate() {
  try {
    localStorage.removeItem(getKey());
  } catch {
    // ignore
  }
}

/**
 * Activates a status by ID for a specified duration in minutes for current user.
 * Deactivates any currently active status first (INV-1).
 * @param {string} statusId
 * @param {number} [durationMinutes] - Duration in minutes. Defaults to status definition default.
 * @param {'manual'|'schedule'} [source='manual']
 * @returns {Object} Newly activated status record
 */
function activate(statusId, durationMinutes, source = 'manual') {
  // INV-1: Deactivate existing active status first
  deactivate();

  const statusDef = statusStore.getById(statusId);
  const minutes = Number(durationMinutes) || (statusDef ? statusDef.defaultDurationMinutes : 60);

  const activatedAt = Date.now();
  const expiresAt = activatedAt + minutes * 60 * 1000;

  const record = {
    statusId,
    statusName: statusDef ? statusDef.name : 'Custom Status',
    statusEmoji: statusDef ? statusDef.emoji : '⚡',
    activatedAt,
    expiresAt,
    durationMinutes: minutes,
    source, // 'manual' or 'schedule'
  };

  try {
    localStorage.setItem(getKey(), JSON.stringify(record));
  } catch {
    // ignore
  }

  return {
    ...record,
    detail: statusDef || { name: record.statusName, emoji: record.statusEmoji },
  };
}

/**
 * Updates active status metadata (name, emoji) if current active status matches statusId.
 */
function updateActiveMetadata(statusId, statusName, statusEmoji) {
  const activeKey = getKey();
  try {
    const raw = localStorage.getItem(activeKey);
    if (!raw) return;
    const active = JSON.parse(raw);
    if (active && active.statusId === statusId) {
      active.statusName = statusName;
      active.statusEmoji = statusEmoji;
      localStorage.setItem(activeKey, JSON.stringify(active));
    }
  } catch {
    // ignore
  }
}

const statusEngine = {
  getActive,
  activate,
  deactivate,
  updateActiveMetadata,
};

export default statusEngine;
