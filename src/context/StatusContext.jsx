import React, { createContext, useContext } from 'react';
import useActiveStatus from '../hooks/useActiveStatus';

/**
 * StatusContext — single shared source of truth for the active status.
 *
 * Wrap <App> (or any root component) with <StatusProvider> so that every
 * page/component reads from the *same* useState instances instead of creating
 * isolated copies via useActiveStatus().
 */
const StatusContext = createContext(null);

export function StatusProvider({ children }) {
  const value = useActiveStatus();
  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>;
}

/**
 * Drop-in replacement for `useActiveStatus()` that reads from the shared context.
 * All calls across the tree get the same state, so activating from one page
 * instantly reflects in Dashboard, StatusManager, Scheduler, etc.
 */
export function useStatusContext() {
  const ctx = useContext(StatusContext);
  if (!ctx) {
    throw new Error('useStatusContext must be used inside <StatusProvider>');
  }
  return ctx;
}
