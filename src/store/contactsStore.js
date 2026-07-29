import { saveContactsToCloud, fetchContactsFromCloud } from '../services/cloudinaryServices';

const KEY = 'nn_contacts';

export const DEFAULT_CONTACTS = [
  { id: '1', name: 'Mom', phone: '+1 (555) 012-1122', group: 'Family' },
  { id: '2', name: 'Julian (Project Lead)', phone: '+1 (555) 012-9876', group: 'Work' },
  { id: '3', name: 'Alex Chen', phone: '+1 (555) 012-4455', group: 'Friends & Relatives' },
];

/**
 * Reads all contacts from localStorage.
 * @returns {Array} List of contact objects
 */
function getAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONTACTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CONTACTS;
  } catch {
    return DEFAULT_CONTACTS;
  }
}

/**
 * Saves a new contact or updates an existing one, auto-syncing to Cloudinary.
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
      id: contact.id || `contact-${crypto.randomUUID()}`,
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      group: contact.group || 'Unknown',
      createdAt: Date.now(),
    };
    updated = [newContact, ...current];
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(updated));
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
    localStorage.setItem(KEY, JSON.stringify(updated));
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
      localStorage.setItem(KEY, JSON.stringify(remoteContacts));
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
