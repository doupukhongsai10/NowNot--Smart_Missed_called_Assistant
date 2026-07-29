import authStore from './authStore';

const BASE_KEY = 'settings';

function getKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

export const CANONICAL_GROUPS = [
  { id: 'family', name: 'Family', count: 0, color: '#F472B6' },
  { id: 'friends_relatives', name: 'Friends & Relatives', count: 0, color: '#38BDF8' },
  { id: 'work', name: 'Work', count: 0, color: '#FBBF24' },
  { id: 'unknown', name: 'Unknown', count: 0, color: '#94A3B8', label: 'filtered' },
];

export const DEFAULT_TOGGLES = {
  enableAutomation: true,
  smartCallbackReminders: false,
  lowBatteryMode: true,
};

/**
 * Builds default profile dynamically from current user session.
 */
function getDefaultProfile() {
  const session = authStore.getSession();
  return {
    name: session?.name || 'New User',
    phone: session?.phone || '+1 (555) 000-0000',
    avatar: session?.avatar || '',
  };
}

/**
 * Reads settings from localStorage for current user.
 * @returns {Object}
 */
function get() {
  const defaultProfile = getDefaultProfile();
  try {
    const raw = localStorage.getItem(getKey());
    if (!raw) {
      return {
        profile: defaultProfile,
        groups: CANONICAL_GROUPS,
        toggles: DEFAULT_TOGGLES,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      profile: { ...defaultProfile, ...(parsed.profile || {}) },
      groups: CANONICAL_GROUPS,
      toggles: { ...DEFAULT_TOGGLES, ...(parsed.toggles || {}) },
    };
  } catch {
    return {
      profile: defaultProfile,
      groups: CANONICAL_GROUPS,
      toggles: DEFAULT_TOGGLES,
    };
  }
}

/**
 * Saves updated settings object to localStorage for current user.
 * @param {Object} updatedSettings
 */
function save(updatedSettings) {
  try {
    localStorage.setItem(getKey(), JSON.stringify(updatedSettings));
  } catch {
    // ignore quota error
  }
  return updatedSettings;
}

/**
 * Toggles a setting flag by key for current user.
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
 * Updates profile information for current user.
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
