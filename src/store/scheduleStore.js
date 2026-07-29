import authStore from './authStore';

const BASE_KEY = 'schedules';

function getKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

const DEFAULT_SCHEDULES = [
  {
    id: 'sched-work-hours',
    name: 'Work Hours',
    emoji: '💼',
    statusId: 'status-meeting',
    startTime: '09:00',
    endTime: '17:00',
    days: [1, 2, 3, 4, 5], // Mon-Fri (0=Sun, 6=Sat)
    enabled: true,
    createdAt: Date.now(),
  },
  {
    id: 'sched-morning-focus',
    name: 'Morning Focus',
    emoji: '🧘',
    statusId: 'status-studying',
    startTime: '07:00',
    endTime: '08:30',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    createdAt: Date.now(),
  },
  {
    id: 'sched-family-time',
    name: 'Family Time',
    emoji: '🏠',
    statusId: 'status-busy',
    startTime: '18:00',
    endTime: '21:30',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    createdAt: Date.now(),
  },
];

/**
 * Reads all stored schedules from localStorage for current user.
 * Seeds default schedules if localStorage is empty.
 * @returns {Array} List of schedule objects
 */
function getAll() {
  const key = getKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_SCHEDULES));
      return DEFAULT_SCHEDULES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SCHEDULES;
  } catch {
    return DEFAULT_SCHEDULES;
  }
}

/**
 * Gets a single schedule by ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getById(id) {
  return getAll().find((s) => s.id === id) || null;
}

/**
 * Saves a new or updated schedule to localStorage for current user.
 * @param {Object} schedule
 * @returns {Array} Updated list of schedules
 */
function save(schedule) {
  const schedules = getAll();
  const index = schedules.findIndex((s) => s.id === schedule.id);

  let updated;
  if (index >= 0) {
    updated = [...schedules];
    updated[index] = { ...updated[index], ...schedule };
  } else {
    const newSchedule = {
      id: `sched-${crypto.randomUUID()}`,
      name: schedule.name || 'New Routine',
      emoji: schedule.emoji || '⏰',
      statusId: schedule.statusId || null,
      startTime: schedule.startTime || '09:00',
      endTime: schedule.endTime || '10:00',
      days: schedule.days || [1, 2, 3, 4, 5],
      enabled: schedule.enabled !== undefined ? schedule.enabled : true,
      createdAt: Date.now(),
    };
    updated = [newSchedule, ...schedules];
  }

  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore quota error
  }
  return updated;
}

/**
 * Toggles the enabled state of a schedule by ID.
 * @param {string} id
 * @returns {Array} Updated list of schedules
 */
function toggle(id) {
  const schedules = getAll();
  const updated = schedules.map((s) =>
    s.id === id ? { ...s, enabled: !s.enabled } : s
  );
  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Deletes a schedule by ID.
 * @param {string} id
 * @returns {Array} Updated list of schedules
 */
function remove(id) {
  const schedules = getAll();
  const updated = schedules.filter((s) => s.id !== id);
  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

const scheduleStore = {
  getAll,
  getById,
  save,
  toggle,
  remove,
};

export default scheduleStore;
