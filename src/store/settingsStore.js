const KEY = 'nn_settings';

export const DEFAULT_SETTINGS = {
  profile: {
    name: 'Adrian Vance',
    phone: '+1 (555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  groups: [
    { id: 'family', name: 'Family', count: 12, color: '#F472B6' },
    { id: 'friends_relatives', name: 'Friends & Relatives', count: 56, color: '#38BDF8' },
    { id: 'work', name: 'Work', count: 24, color: '#FBBF24' },
    { id: 'unknown', name: 'Unknown', count: 156, color: '#94A3B8', label: 'filtered' },
  ],
  toggles: {
    enableAutomation: true,
    smartCallbackReminders: false,
    lowBatteryMode: true,
  },
};

/**
 * Reads settings from localStorage.
 * @returns {Object}
 */
function get() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      profile: { ...DEFAULT_SETTINGS.profile, ...(parsed.profile || {}) },
      groups: parsed.groups || DEFAULT_SETTINGS.groups,
      toggles: { ...DEFAULT_SETTINGS.toggles, ...(parsed.toggles || {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves updated settings object to localStorage.
 * @param {Object} updatedSettings
 */
function save(updatedSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(updatedSettings));
  } catch {
    // ignore quota error
  }
  return updatedSettings;
}

/**
 * Toggles a setting flag by key.
 * @param {string} toggleKey
 */
function toggleFlag(toggleKey) {
  const current = get();
  const updated = {
    ...current,
    toggles: {
      ...current.toggles,
      [toggleKey]: !current.toggles[toggleKey],
    },
  };
  save(updated);
  return updated;
}

/**
 * Updates profile information.
 * @param {{ name: string, phone: string, avatar?: string }} newProfile
 */
function updateProfile(newProfile) {
  const current = get();
  const updated = {
    ...current,
    profile: {
      ...current.profile,
      ...newProfile,
    },
  };
  save(updated);
  return updated;
}

const settingsStore = {
  get,
  save,
  toggleFlag,
  updateProfile,
};

export default settingsStore;
