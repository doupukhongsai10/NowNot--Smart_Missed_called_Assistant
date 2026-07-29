const SESSION_KEY = 'nn_auth_session';

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
 * Logs in user by phone & password.
 * @param {{ phone: string, password?: string }} credentials
 * @returns {Object}
 */
export function login({ phone, name }) {
  const user = {
    id: `user-${Date.now()}`,
    name: name || 'Adrian Vance',
    phone: phone || '+44 7700 900000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    loggedInAt: Date.now(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
  return user;
}

/**
 * Signs up a new user.
 * @param {{ name: string, phone: string, password?: string }} userData
 * @returns {Object}
 */
export function signup(userData) {
  return login(userData);
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
  getSession,
  login,
  signup,
  logout,
};

export default authStore;
