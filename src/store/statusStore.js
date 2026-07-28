const KEY = 'nn_statuses';

const DEFAULT_STATUSES = [
  {
    id: 'status-sleeping',
    name: 'Sleeping',
    emoji: '😴',
    defaultDurationMinutes: 480, // 8 hours
    isSystem: true,
  },
  {
    id: 'status-meeting',
    name: 'In a Meeting',
    emoji: '💼',
    defaultDurationMinutes: 60, // 1 hour
    isSystem: true,
  },
  {
    id: 'status-studying',
    name: 'Studying',
    emoji: '📚',
    defaultDurationMinutes: 120, // 2 hours
    isSystem: true,
  },
  {
    id: 'status-driving',
    name: 'Driving',
    emoji: '🚗',
    defaultDurationMinutes: 45, // 45 mins
    isSystem: true,
  },
  {
    id: 'status-gym',
    name: 'Gym',
    emoji: '💪',
    defaultDurationMinutes: 90, // 1.5 hours
    isSystem: true,
  },
  {
    id: 'status-busy',
    name: 'Do Not Disturb',
    emoji: '🚫',
    defaultDurationMinutes: 30, // 30 mins
    isSystem: true,
  },
];

/**
 * Reads all stored statuses from localStorage.
 * Seeds default statuses if localStorage is empty.
 * @returns {Array} List of status objects
 */
function getAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_STATUSES));
      return DEFAULT_STATUSES;
    }
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
 * Saves a new or updated status to localStorage.
 * @param {Object} status
 * @returns {Array} Updated list of statuses
 */
function save(status) {
  const statuses = getAll();
  const index = statuses.findIndex((s) => s.id === status.id);

  let updated;
  if (index >= 0) {
    updated = [...statuses];
    updated[index] = { ...updated[index], ...status };
  } else {
    const newStatus = {
      id: status.id || `status-${crypto.randomUUID()}`,
      name: status.name || 'Custom Status',
      emoji: status.emoji || '🎯',
      defaultDurationMinutes: Number(status.defaultDurationMinutes) || 60,
      isSystem: false,
      createdAt: Date.now(),
    };
    updated = [newStatus, ...statuses];
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // ignore quota error
  }
  return updated;
}

/**
 * Deletes a custom status from localStorage by ID.
 * System statuses cannot be deleted.
 * @param {string} id
 * @returns {Array} Updated list of statuses
 */
function remove(id) {
  const statuses = getAll();
  const updated = statuses.filter((s) => s.id !== id || s.isSystem);
  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
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
