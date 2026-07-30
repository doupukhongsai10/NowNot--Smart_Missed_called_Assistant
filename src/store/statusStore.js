import authStore from './authStore';
import { generateId } from '../utils/idGenerator';

const BASE_KEY = 'statuses';

function getKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

/**
 * Default preset statuses if user has no saved statuses yet.
 */
export const DEFAULT_STATUSES = [
  {
    id: 'status-meeting',
    name: 'In a Meeting',
    emoji: '💼',
    defaultDurationMinutes: 60,
    isSystem: true,
  },
  {
    id: 'status-driving',
    name: 'Driving',
    emoji: '🚗',
    defaultDurationMinutes: 30,
    isSystem: true,
  },
  {
    id: 'status-sleeping',
    name: 'Sleeping',
    emoji: '😴',
    defaultDurationMinutes: 480,
    isSystem: true,
  },
  {
    id: 'status-studying',
    name: 'Studying',
    emoji: '📚',
    defaultDurationMinutes: 120,
    isSystem: true,
  },
  {
    id: 'status-gym',
    name: 'At the Gym',
    emoji: '💪',
    defaultDurationMinutes: 90,
    isSystem: true,
  },
  {
    id: 'status-busy',
    name: 'Busy',
    emoji: '🚫',
    defaultDurationMinutes: 60,
    isSystem: true,
  },
];

/**
 * Reads all statuses from localStorage for current user.
 * Falls back to DEFAULT_STATUSES if none saved.
 * @returns {Array} List of status objects
 */
function getAll() {
  try {
    const raw = localStorage.getItem(getKey());
    if (!raw) return DEFAULT_STATUSES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_STATUSES;
  } catch {
    return DEFAULT_STATUSES;
  }
}

/**
 * Gets a single status definition by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getById(id) {
  const statuses = getAll();
  return statuses.find((s) => s.id === id) || null;
}

/**
 * Saves a new custom status or updates an existing one for current user.
 * @param {Object} status
 * @returns {Array} Updated statuses list
 */
function save(status) {
  const statuses = getAll();
  const index = statuses.findIndex((s) => s.id === status.id);

  let targetStatus;
  if (index >= 0) {
    targetStatus = { ...statuses[index], ...status, updatedAt: Date.now() };
  } else {
    targetStatus = {
      id: status.id || generateId('status'),
      name: status.name || 'Custom Status',
      emoji: status.emoji || '🎯',
      defaultDurationMinutes: Number(status.defaultDurationMinutes) || 60,
      isSystem: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...status,
    };
  }

  // Remove previous instance if present
  const remaining = statuses.filter((s) => s.id !== targetStatus.id);

  // Always place the newly created / updated status at the VERY TOP (index 0)
  const updated = [targetStatus, ...remaining];

  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore quota error
  }
  return updated;
}

/**
 * Deletes a custom status from localStorage by ID for current user.
 * System statuses cannot be deleted.
 * @param {string} id
 * @returns {Array} Updated list of statuses
 */
function remove(id) {
  const statuses = getAll();
  const updated = statuses.filter((s) => s.id !== id || s.isSystem);
  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

const statusStore = {
  getAll,
  getById,
  save,
  remove,
};

export default statusStore;
