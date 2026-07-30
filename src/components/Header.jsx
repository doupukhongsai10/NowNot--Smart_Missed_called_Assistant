import React from 'react';
import { useStatusContext } from '../context/StatusContext';

export default function Header({ activePage, onBack, onOpenSettings, onLogout }) {
  const isHome = activePage === 'dashboard';
  const { activeStatus } = useStatusContext();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-2.5 sm:px-4 h-14 sm:h-16"
      style={{
        background: 'rgba(11,13,26,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Left side: Back Button (if not home) OR Brand Logo */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {!isHome && (
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 text-on-surface flex-shrink-0 cursor-pointer"
            aria-label="Go back"
            title="Go back to Dashboard"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
          </button>
        )}

        <span className="material-symbols-outlined icon-filled text-xl sm:text-2xl flex-shrink-0" style={{ color: '#d2bbff' }}>
          bubble_chart
        </span>
        <h1 className="font-display font-bold text-base sm:text-xl tracking-tight truncate" style={{ color: '#d2bbff' }}>
          NowNot
        </h1>
      </div>

      {/* Right side: Log Out button, Active Status pill & Settings button */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full transition-all duration-200 hover:bg-red-500/20 active:scale-95 cursor-pointer"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
            }}
            title="Log Out to Login page"
          >
            <span className="material-symbols-outlined text-xs sm:text-sm">logout</span>
            <span className="hidden xs:inline">Log Out</span>
          </button>
        )}

        {/* Dynamic Status Pill */}
        {activeStatus ? (
          <span
            className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full max-w-[85px] xs:max-w-none"
            style={{
              background: 'rgba(139,92,246,0.18)',
              border: '1px solid rgba(139,92,246,0.35)',
              color: '#d2bbff',
            }}
            title={`Active Status: ${activeStatus.status?.name || 'Active'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-status-active inline-block animate-pulse flex-shrink-0"></span>
            <span className="truncate">
              {activeStatus.status?.emoji ? `${activeStatus.status.emoji} ${activeStatus.status.name}` : 'Active'}
            </span>
          </span>
        ) : (
          <span
            className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(210,187,255,0.5)',
            }}
            title="No active status currently running"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block flex-shrink-0"></span>
            <span>Inactive</span>
          </span>
        )}

        <button
          onClick={onOpenSettings}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 cursor-pointer"
          style={{ color: '#ccc3d8' }}
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">settings</span>
        </button>
      </div>
    </header>
  );
}
