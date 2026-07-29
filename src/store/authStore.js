const SESSION_KEY = 'nn_auth_session';
const USERS_KEY = 'nn_users';

/**
 * Returns all registered users from localStorage.
 * @returns {Array} List of user objects
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Returns current active session, or null if no session exists.
 * @returns {Object|null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Helper to retrieve active user ID for scoping store data.
 * @returns {string} User ID or 'guest'
 */
export function getCurrentUserId() {
  const session = getSession();
  return session?.id || 'guest';
}

/**
 * Logs in user by phone & password.
 * If user exists in registered users, loads that record.
 * Otherwise registers user.
 * @param {{ phone: string, name?: string, password?: string }} credentials
 * @returns {Object} User session record
 */
export function login({ phone, name }) {
  const users = getUsers();
  const cleanPhone = (phone || '').trim();
  let existingUser = users.find(
    (u) => u.phone.trim() === cleanPhone || (name && u.name.toLowerCase() === name.trim().toLowerCase())
  );

  if (!existingUser) {
    const userName = name && name.trim() ? name.trim() : cleanPhone || 'User';
    existingUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: userName,
      phone: cleanPhone || '+1 (555) 000-0000',
      avatar: '',
      createdAt: Date.now(),
    };
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, existingUser]));
    } catch {
      // ignore
    }
  }

  const session = {
    ...existingUser,
    loggedInAt: Date.now(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
  return session;
}

/**
 * Signs up a new user.
 * @param {{ name: string, phone: string, password?: string }} userData
 * @returns {Object} User session record
 */
export function signup({ name, phone, password }) {
  const users = getUsers();
  const cleanPhone = (phone || '').trim();
  const cleanName = (name || '').trim();

  // Create new user account
  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: cleanName || 'New User',
    phone: cleanPhone || '+1 (555) 000-0000',
    avatar: '',
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify([newUser, ...users]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  } catch {
    // ignore
  }

  return newUser;
}

/**
 * Logs out the current user session.
 */
export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

const authStore = {
  getUsers,
  getSession,
  getCurrentUserId,
  login,
  signup,
  logout,
};

export default authStore;
