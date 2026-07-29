import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'statuses', label: 'Statuses', icon: 'radio_button_checked' },
  { id: 'messages', label: 'Messages', icon: 'chat_bubble' },
  { id: 'log', label: 'Log', icon: 'call' },
  { id: 'scheduler', label: 'Scheduler', icon: 'calendar_today' },
];

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 pb-safe rounded-t-2xl"
      style={{
        background: 'rgba(16,19,42,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.45)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive ? 'nav-active' : ''
            }`}
            style={{
              color: isActive ? '#d2bbff' : 'rgba(204,195,216,0.55)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isActive && (
              <span
                className="absolute -top-1 w-6 h-1 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
              />
            )}
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'icon-filled' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
