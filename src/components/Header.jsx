import React from 'react';

export default function Header({ activePage, onBack, onOpenSettings }) {
  const isHome = activePage === 'dashboard';

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16"
      style={{
        background: 'rgba(11,13,26,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Left side: Back Button (if not home) OR Brand Logo */}
      <div className="flex items-center gap-2">
        {!isHome && (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 text-on-surface mr-1 cursor-pointer"
            aria-label="Go back"
            title="Go back to Dashboard"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
        )}

        <span className="material-symbols-outlined icon-filled text-2xl" style={{ color: '#d2bbff' }}>
          bubble_chart
        </span>
        <h1 className="font-display font-bold text-xl tracking-tight" style={{ color: '#d2bbff' }}>
          NowNot
        </h1>
      </div>

      {/* Right side: Active Status pill & Settings button */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full"
          style={{
            background: 'rgba(139,92,246,0.18)',
            border: '1px solid rgba(139,92,246,0.35)',
            color: '#d2bbff',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-status-active inline-block animate-pulse"></span>
          Active
        </span>
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/10 cursor-pointer"
          style={{ color: '#ccc3d8' }}
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
      </div>
    </header>
  );
}
