import statusStore from '../store/statusStore';

const ACTIVE_KEY = 'nn_active_status';

/**
 * Reads the currently active status from localStorage.
 * Automatically checks for expiry and deactivates if expired.
 * @returns {Object|null} The active status record or null if idle
 */
function getActive() {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
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
 * Deactivates the currently active status (INV-1).
 */
function deactivate() {
  try {
    localStorage.removeItem(ACTIVE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Activates a status by ID for a specified duration in minutes.
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
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(record));
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
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    if (!raw) return;
    const active = JSON.parse(raw);
    if (active && active.statusId === statusId) {
      active.statusName = statusName;
      active.statusEmoji = statusEmoji;
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(active));
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
