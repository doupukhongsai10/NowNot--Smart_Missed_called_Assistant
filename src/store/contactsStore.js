import { saveContactsToCloud, fetchContactsFromCloud } from '../services/cloudinaryServices';
import authStore from './authStore';
import { generateId } from '../utils/idGenerator';

const BASE_KEY = 'contacts';

function getKey() {
  const userId = authStore.getCurrentUserId();
  return `nn_${userId}_${BASE_KEY}`;
}

export const DEFAULT_CONTACTS = [];

/**
 * Reads all contacts from localStorage for current user.
 * @returns {Array} List of contact objects
 */
function getAll() {
  try {
    const raw = localStorage.getItem(getKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new contact or updates an existing one for current user, auto-syncing to Cloudinary.
 * @param {{ id?: string, name: string, phone: string, group: string }} contact
 * @returns {Array} Updated list of contacts
 */
function save(contact) {
  const current = getAll();
  const index = current.findIndex((c) => c.id === contact.id || (contact.phone && c.phone === contact.phone));

  let updated;
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...contact };
  } else {
    const newContact = {
      id: contact.id || generateId('contact'),
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      group: contact.group || 'Unknown',
      createdAt: Date.now(),
    };
    updated = [newContact, ...current];
  }

  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore quota error
  }

  // Synchronize to Cloudinary raw cloud storage
  saveContactsToCloud(updated);

  return updated;
}

/**
 * Removes a contact by ID and syncs to Cloudinary.
 * @param {string} id
 * @returns {Array} Updated list of contacts
 */
function remove(id) {
  const current = getAll();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(getKey(), JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Synchronize to Cloudinary raw cloud storage
  saveContactsToCloud(updated);

  return updated;
}

/**
 * Syncs and restores saved contacts from Cloudinary.
 * @returns {Promise<Array>}
 */
async function syncFromCloud() {
  const remoteContacts = await fetchContactsFromCloud();
  if (remoteContacts && Array.isArray(remoteContacts) && remoteContacts.length > 0) {
    try {
      localStorage.setItem(getKey(), JSON.stringify(remoteContacts));
    } catch {
      // ignore
    }
    return remoteContacts;
  }
  return getAll();
}

const contactsStore = {
  getAll,
  save,
  remove,
  syncFromCloud,
};

export default contactsStore;
