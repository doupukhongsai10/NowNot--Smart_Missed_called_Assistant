import { useEffect, useCallback } from 'react';
import scheduler from '../engine/scheduler';

const TICK_INTERVAL_MS = 60_000; // 60 seconds — matches architecture spec (5b)

/**
 * useScheduler — mounts the scheduler tick loop for the lifetime of the app.
 *
 * - Runs an immediate tick on mount to catch any schedule that was active
 *   when the browser tab was opened or refreshed.
 * - Then polls every 60 seconds to activate/deactivate scheduled statuses.
 * - Calls onStatusChange() whenever the scheduler activates or deactivates
 *   a status so consumers (e.g. useActiveStatus) can refresh their state.
 *
 * @param {{ onStatusChange?: () => void }} options
 */
export default function useScheduler({ onStatusChange } = {}) {
  const notify = useCallback(() => {
    if (typeof onStatusChange === 'function') onStatusChange();
  }, [onStatusChange]);

  useEffect(() => {
    function runTick() {
      const result = scheduler.tick();
      // Notify consumers when state actually changed
      if (result === 'activated' || result === 'deactivated') {
        notify();
      }
    }

    // Fire immediately on mount — handles the case where the user opened the
    // app in the middle of a scheduled window (e.g. after a tab refresh).
    runTick();

    const interval = setInterval(runTick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [notify]);
}
