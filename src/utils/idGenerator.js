/**
 * Safe UUID / unique ID generator that works in all browser environments
 * including non-secure HTTP contexts on mobile devices where crypto.randomUUID is undefined.
 */
export function generateId(prefix = '') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    const uuid = crypto.randomUUID();
    return prefix ? `${prefix}-${uuid}` : uuid;
  }
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
}
