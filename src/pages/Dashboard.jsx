import React from 'react';
import useActiveStatus from '../hooks/useActiveStatus';
import statusStore from '../store/statusStore';

const INITIAL_LOGS = [
  {
    id: '1',
    name: 'Mom',
    time: '14:22',
    type: 'Missed Call',
    group: 'Family',
    groupAccent: 'accent-family',
    groupColor: '#F472B6',
    avatar: '👩',
    count: 1,
  },
  {
    id: '2',
    name: 'Julian (Project Lead)',
    time: '13:05',
    type: 'Missed Call',
    group: 'Work',
    groupAccent: 'accent-work',
    groupColor: '#FBBF24',
    avatar: '👨‍💼',
    count: 1,
  },
  {
    id: '3',
    name: 'Sarah',
    time: '12:40',
    type: '2 Missed Calls',
    group: 'Family',
    groupAccent: 'accent-family',
    groupColor: '#F472B6',
    avatar: '👧',
    count: 2,
  },
  {
    id: '4',
    name: 'Alex',
    time: '11:15',
    type: 'Missed Call',
    group: 'Friends',
    groupAccent: 'accent-friends',
    groupColor: '#38BDF8',
    avatar: '👤',
    count: 1,
  },
];

export default function Dashboard({ onNavigate }) {
  const { activeStatus, timeLeftStr, activate, deactivate } = useActiveStatus();
  const statuses = statusStore.getAll().slice(0, 5); // top 5 for quick bento

  const handleQuickActivate = (status) => {
    activate(status.id, status.defaultDurationMinutes || 60, 'manual');
  };

  return (
    <div className="space-y-6">
      {/* ── Active Status Card ── */}
      <section>
        {activeStatus ? (
          <div className="glass-card-active relative overflow-hidden p-6">
            {/* Watermark Emoji */}
            <div className="absolute top-3 right-4 text-6xl opacity-15 select-none pointer-events-none">
              {activeStatus.detail?.emoji || activeStatus.statusEmoji || '⚡'}
            </div>

            {/* Pulse Ring */}
            <div
              className="pulse-ring absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'rgba(139,92,246,0.12)' }}
            />

            <div className="relative z-10 flex flex-col gap-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'rgba(210,187,255,0.65)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.1em' }}
              >
                Current Status
              </span>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl">{activeStatus.detail?.emoji || activeStatus.statusEmoji || '⚡'}</span>
                <h2 className="font-display font-semibold text-2xl" style={{ color: '#d2bbff' }}>
                  {activeStatus.detail?.name || activeStatus.statusName}
                </h2>
              </div>

              <p
                className="flex items-center gap-1.5 mt-1 text-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(210,187,255,0.75)' }}
              >
                <span className="material-symbols-outlined text-sm">schedule</span>
                until {new Date(activeStatus.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter', sans-serif" }}
                  >
                    Time remaining
                  </span>
                  <div
                    className="timer-text mt-0.5 font-mono font-bold text-4xl leading-none"
                    style={{ color: '#d2bbff', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {timeLeftStr || '00:00:00'}
                  </div>
                </div>

                <button
                  onClick={deactivate}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    color: '#F87171',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span className="material-symbols-outlined text-base">stop_circle</span>
                  End
                </button>
              </div>

              {/* Quick duration adjuster on active card */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
                  Adjust:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[30, 60, 120, 240, 480].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => activate(activeStatus.statusId, mins, 'manual')}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all active:scale-95 cursor-pointer bg-white/5 border border-white/10 text-outline-variant hover:text-primary hover:bg-primary/20 hover:border-primary/40"
                      title={`Reset active duration to ${mins >= 60 ? `${mins / 60}h` : `${mins}m`}`}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-xs flex items-center gap-1" style={{ color: 'rgba(210,187,255,0.50)', fontFamily: "'Inter', sans-serif" }}>
                <span className="material-symbols-outlined icon-filled text-xs">auto_awesome</span>
                Auto-replying to missed calls
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 text-center space-y-3">
            <div className="text-4xl">🌙</div>
            <h2 className="font-display font-semibold text-xl text-primary">No Status Active</h2>
            <p className="text-sm text-on-surface-variant">Select a quick status below to turn on auto-replies.</p>
          </div>
        )}
      </section>

      {/* ── Quick Select Bento ── */}
      <section>
        <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-base icon-filled" style={{ color: '#d2bbff' }}>
            bolt
          </span>
          Quick Select
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {statuses.map((item) => {
            const isSelected = activeStatus?.statusId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleQuickActivate(item)}
                className="glass-card bento-btn p-4 flex flex-col items-center justify-center gap-2 cursor-pointer border"
                style={{
                  borderColor: isSelected ? 'rgba(210,187,255,0.45)' : 'transparent',
                  background: isSelected ? 'rgba(124,58,237,0.15)' : undefined,
                }}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium text-on-surface-variant truncate w-full text-center">
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* Set Status Button */}
          <button
            onClick={() => onNavigate('create-status')}
            className="bento-btn p-4 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border border-white/20 text-white transition-all active:scale-95 shadow-md"
            style={{
              background: 'oklch(52.7% 0.154 150.069)',
            }}
          >
            <span className="material-symbols-outlined text-2xl font-bold">
              add_circle
            </span>
            <span className="text-xs font-semibold tracking-tight text-center leading-tight">
              Set Status
            </span>
          </button>
        </div>
      </section>

      {/* ── Missed Activity Log ── */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display font-semibold text-base flex items-center gap-2 text-on-surface">
            <span className="material-symbols-outlined text-base" style={{ color: '#d2bbff' }}>
              history
            </span>
            Missed Activity
          </h3>
          <button
            onClick={() => onNavigate('log')}
            className="text-xs font-semibold hover:text-primary transition-colors cursor-pointer"
            style={{ color: 'rgba(210,187,255,0.55)' }}
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {INITIAL_LOGS.map((log) => (
            <div key={log.id} className={`glass-card accent-left ${log.groupAccent} p-4 flex items-center gap-3`}>
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-lg"
                style={{
                  background: '#161A35',
                  border: `1px solid ${log.groupColor}4D`,
                }}
              >
                {log.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-sm truncate text-on-surface">{log.name}</h4>
                  <span className="text-xs flex-shrink-0 ml-2 font-mono text-on-surface-variant/50">
                    {log.time}
                  </span>
                </div>
                <p className="text-xs mt-0.5 text-outline-variant">
                  {log.type} · <span style={{ color: log.groupColor }}>{log.group}</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="material-symbols-outlined text-lg" style={{ color: log.groupColor }}>
                  call_missed
                </span>
                {log.count > 1 && (
                  <span
                    className="text-xs font-bold leading-none px-1.5 py-0.5 rounded-full"
                    style={{ background: `${log.groupColor}2E`, color: log.groupColor }}
                  >
                    ×{log.count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
