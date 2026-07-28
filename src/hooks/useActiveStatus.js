import { useState, useEffect, useCallback } from 'react';
import statusEngine from '../engine/statusEngine';

/**
 * Hook to manage active status and provide live tick updates.
 */
export default function useActiveStatus() {
  const [activeStatus, setActiveStatus] = useState(() => statusEngine.getActive());
  const [timeLeftStr, setTimeLeftStr] = useState('');

  const refreshActiveStatus = useCallback(() => {
    const current = statusEngine.getActive();
    setActiveStatus(current);
    return current;
  }, []);

  const activate = useCallback(
    (statusId, durationMinutes, source = 'manual') => {
      const record = statusEngine.activate(statusId, durationMinutes, source);
      setActiveStatus(record);
      return record;
    },
    []
  );

  const deactivate = useCallback(() => {
    statusEngine.deactivate();
    setActiveStatus(null);
    setTimeLeftStr('');
  }, []);

  useEffect(() => {
    function tick() {
      const current = statusEngine.getActive();
      setActiveStatus(current);

      if (!current || !current.expiresAt) {
        setTimeLeftStr('');
        return;
      }

      const diff = Math.max(0, current.expiresAt - Date.now());
      if (diff === 0) {
        deactivate();
        return;
      }

      const h = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
      const m = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
      const s = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
      setTimeLeftStr(`${h}:${m}:${s}`);
    }

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [deactivate]);

  return {
    activeStatus,
    timeLeftStr,
    activate,
    deactivate,
    refreshActiveStatus,
  };
}
