const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const PUBLIC_ID = 'nn_contacts_data';

/**
 * Uploads/syncs the saved contacts collection to Cloudinary Raw Storage.
 * @param {Array} contacts List of contact objects
 * @returns {Promise<{ success: boolean, url?: string, error?: string }>}
 */
export async function saveContactsToCloud(contacts) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.warn('[Cloudinary] Cloud Name or Upload Preset missing in .env');
    return { success: false, error: 'Cloudinary credentials missing in .env' };
  }

  try {
    const jsonBlob = new Blob([JSON.stringify(contacts, null, 2)], {
      type: 'application/json',
    });

    const formData = new FormData();
    formData.append('file', jsonBlob, 'nn_contacts.json');
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', PUBLIC_ID);
    formData.append('resource_type', 'raw');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${errText}`);
    }

    const data = await response.json();
    console.log('[Cloudinary] Successfully synced contacts to cloud:', data.secure_url);
    return { success: true, url: data.secure_url };
  } catch (error) {
    console.error('[Cloudinary Sync Error]', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches the saved contacts collection from Cloudinary Storage.
 * @returns {Promise<Array|null>}
 */
export async function fetchContactsFromCloud() {
  if (!CLOUD_NAME) return null;

  try {
    const cloudUrl = `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/v1/${PUBLIC_ID}.json?cb=${Date.now()}`;
    const response = await fetch(cloudUrl);
    if (!response.ok) return null;

    const data = await response.json();
    if (Array.isArray(data)) {
      console.log('[Cloudinary] Retrieved contacts from cloud storage:', data);
      return data;
    }
    return null;
  } catch (error) {
    console.warn('[Cloudinary Fetch Warning] Could not fetch remote contacts:', error);
    return null;
  }
}

const cloudinaryServices = {
  saveContactsToCloud,
  fetchContactsFromCloud,
};

export default cloudinaryServices;
