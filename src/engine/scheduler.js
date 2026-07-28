import scheduleStore from '../store/scheduleStore';
import statusEngine from './statusEngine';

/**
 * Converts "HH:MM" string to total minutes since midnight.
 * @param {string} time24 - e.g. "09:00"
 * @returns {number}
 */
function toMins(time24) {
  if (!time24) return 0;
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Finds the best matching enabled schedule for the current moment.
 * Returns null if nothing matches.
 *
 * Rules (from architecture.md INV-2):
 * - Only activates if no status is currently active with source === 'manual'
 * - Matches on: current day-of-week, current time within [startTime, endTime)
 *
 * @returns {Object|null} The matching schedule object or null
 */
function findMatchingSchedule() {
  const schedules = scheduleStore.getAll();
  const now = new Date();
  const currentDay = now.getDay();          // 0 = Sun … 6 = Sat
  const currentMins = now.getHours() * 60 + now.getMinutes();

  return (
    schedules.find(
      (s) =>
        s.enabled &&
        s.days.includes(currentDay) &&
        currentMins >= toMins(s.startTime) &&
        currentMins < toMins(s.endTime)
    ) || null
  );
}

/**
 * Core scheduler tick — called every 60 seconds by useScheduler.
 *
 * Logic:
 * 1. Check if there is a currently active status.
 * 2. If active and source === 'manual' → do nothing (INV-2: manual always wins).
 * 3. If active and source === 'schedule' → verify it still matches; deactivate if the
 *    schedule window has ended.
 * 4. If no active status → look for a matching schedule; activate if found.
 *
 * @returns {'activated'|'deactivated'|'idle'|'blocked'} result label (useful for tests/logging)
 */
function tick() {
  const active = statusEngine.getActive();

  // ── Case 1: A manual status is running — do nothing ──
  if (active && active.source === 'manual') {
    return 'blocked';
  }

  const matching = findMatchingSchedule();

  // ── Case 2: A scheduled status is running — check if it should still be active ──
  if (active && active.source === 'schedule') {
    if (!matching) {
      // The window ended — deactivate
      statusEngine.deactivate();
      return 'deactivated';
    }
    // Still within a window — do nothing (avoid re-activating on every tick)
    return 'idle';
  }

  // ── Case 3: Nothing is active — activate matching schedule if any ──
  if (!active && matching) {
    // Calculate remaining minutes in this window
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const endMins = toMins(matching.endTime);
    const remainingMins = endMins - currentMins;

    if (remainingMins <= 0) return 'idle';

    statusEngine.activate(matching.statusId, remainingMins, 'schedule');
    return 'activated';
  }

  return 'idle';
}

const scheduler = {
  tick,
  findMatchingSchedule,
};

export default scheduler;
