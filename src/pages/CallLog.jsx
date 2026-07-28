import React, { useState, useMemo } from 'react';

// ── Config ─────────────────────────────────────────────────────────────────────

const GROUP_CONFIG = {
  Family: {
    color: '#F472B6',
    bg: 'rgba(244,114,182,0.15)',
    border: 'rgba(244,114,182,0.5)',
    accentBorder: '#F472B6',
  },
  Friends: {
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.15)',
    border: 'rgba(56,189,248,0.5)',
    accentBorder: '#38BDF8',
  },
  Work: {
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.15)',
    border: 'rgba(251,191,36,0.5)',
    accentBorder: '#FBBF24',
  },
  Unknown: {
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
    border: 'rgba(148,163,184,0.4)',
    accentBorder: '#94A3B8',
  },
};

const FILTER_TABS = ['All', 'Family', 'Friends', 'Work', 'Unknown'];

// ── Sample Data ────────────────────────────────────────────────────────────────

const SAMPLE_LOGS = [
  {
    id: '1',
    name: 'Mom',
    number: null,
    group: 'Family',
    timestamp: Date.now() - 2 * 60 * 60 * 1000 + 22 * 60 * 1000, // today 14:22 approx
    displayTime: '14:22',
    displayDate: null, // today
    statusName: 'Sleeping',
    statusEmoji: '😴',
    message: "Hey Mom, I'm currently catching up on some sleep. I'll call you back as soon as I'm awake! ✨",
    replySent: true,
  },
  {
    id: '2',
    name: 'Julian (Project Lead)',
    number: null,
    group: 'Work',
    timestamp: Date.now() - 3 * 60 * 60 * 1000 - 55 * 60 * 1000,
    displayTime: '11:05',
    displayDate: null,
    statusName: 'In a Meeting',
    statusEmoji: '💼',
    message:
      'Currently in a focused meeting. For anything urgent, please ping Sarah. Otherwise, I\'ll be back at 12:30.',
    replySent: true,
  },
  {
    id: '3',
    name: '+1(555) 012-3456',
    number: '+1(555) 012-3456',
    group: 'Unknown',
    timestamp: Date.now() - 26 * 60 * 60 * 1000 - 15 * 60 * 1000,
    displayTime: '20:15',
    displayDate: 'Yesterday',
    statusName: 'Movie Time',
    statusEmoji: '🎬',
    message:
      "I'm at the cinema right now! 🍿 Will get back to you after the credits roll.",
    replySent: true,
  },
  {
    id: '4',
    name: 'Alex Chen',
    number: null,
    group: 'Friends',
    timestamp: Date.now() - 25 * 60 * 60 * 1000 - 20 * 60 * 1000,
    displayTime: '18:40',
    displayDate: 'Yesterday',
    statusName: 'Cycling',
    statusEmoji: '🚴',
    message:
      "Out on the trails! 🌿 Can't talk right now but I'll hit you up when I'm done with this loop.",
    replySent: true,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTimestamp(log) {
  if (log.displayDate) return `${log.displayDate} ${log.displayTime}`;
  return log.displayTime;
}

// ── Log Entry Card ─────────────────────────────────────────────────────────────

function LogCard({ log }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = GROUP_CONFIG[log.group] || GROUP_CONFIG.Unknown;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: 'rgba(22,26,53,0.6)',
        border: `1px solid rgba(255,255,255,0.07)`,
        backdropFilter: 'blur(12px)',
        borderLeft: `3px solid ${cfg.accentBorder}`,
      }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="p-4 space-y-2.5">
        {/* Row 1: Name + group badge + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-display font-bold text-base truncate" style={{ color: '#F1F5F9' }}>
              {log.name}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0"
              style={{
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {log.group}
            </span>
          </div>

          {/* Status pill */}
          <div
            className="flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span className="text-xs">{log.statusEmoji}</span>
            <span className="text-[10px] font-semibold" style={{ color: 'rgba(210,187,255,0.7)', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' }}>
              {log.statusName}
            </span>
          </div>
        </div>

        {/* Row 2: Timestamp */}
        <p
          className="text-xs font-mono"
          style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'JetBrains Mono',monospace" }}
        >
          {formatTimestamp(log)}
        </p>

        {/* Row 3: Message preview (always visible, expands) */}
        <div
          className="flex gap-2.5 p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span className="material-symbols-outlined text-sm flex-shrink-0 mt-0.5" style={{ color: 'rgba(210,187,255,0.4)' }}>
            chat_bubble
          </span>
          <p
            className={`text-xs leading-relaxed italic ${expanded ? '' : 'line-clamp-2'}`}
            style={{ color: 'rgba(227,225,236,0.7)', fontFamily: "'Inter',sans-serif" }}
          >
            "{log.message}"
          </p>
        </div>

        {/* Row 4: Auto-reply sent badge + expand hint */}
        <div className="flex items-center justify-between">
          {log.replySent ? (
            <span
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: '#4ADE80', fontFamily: "'Inter',sans-serif" }}
            >
              <span className="material-symbols-outlined icon-filled text-xs">check_circle</span>
              Auto-Reply Sent
            </span>
          ) : (
            <span
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ color: '#F87171', fontFamily: "'Inter',sans-serif" }}
            >
              <span className="material-symbols-outlined icon-filled text-xs">cancel</span>
              No Reply Sent
            </span>
          )}

          <span
            className="material-symbols-outlined text-base transition-transform duration-200"
            style={{
              color: 'rgba(210,187,255,0.25)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            expand_more
          </span>
        </div>

        {/* Expanded detail panel */}
        {expanded && (
          <div
            className="mt-1 pt-3 space-y-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {log.number && (
              <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
                <span className="material-symbols-outlined text-sm">call</span>
                {log.number}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
              <span className="material-symbols-outlined text-sm">schedule</span>
              Status active at time of call: {log.statusEmoji} {log.statusName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ logs }) {
  const total = logs.length;
  const replied = logs.filter((l) => l.replySent).length;
  const groups = [...new Set(logs.map((l) => l.group))].length;

  const stats = [
    { label: 'Missed', value: total, icon: 'call_missed', color: '#d2bbff' },
    { label: 'Replied', value: replied, icon: 'sms', color: '#4ADE80' },
    { label: 'Groups', value: groups, icon: 'group', color: '#F59E0B' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl p-3 flex flex-col items-center gap-1"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span className="material-symbols-outlined icon-filled text-lg" style={{ color: s.color }}>
            {s.icon}
          </span>
          <span className="font-display font-bold text-xl" style={{ color: '#F1F5F9' }}>{s.value}</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ filter }) {
  return (
    <div className="text-center py-16 space-y-3">
      <div className="text-5xl">📭</div>
      <h3 className="font-display font-semibold text-lg" style={{ color: 'rgba(210,187,255,0.6)' }}>
        No calls logged
      </h3>
      <p className="text-sm" style={{ color: 'rgba(210,187,255,0.35)', fontFamily: "'Inter',sans-serif" }}>
        {filter === 'All'
          ? 'Missed calls during an active status will appear here.'
          : `No ${filter} calls in the log yet.`}
      </p>
    </div>
  );
}

// ── Main CallLog Page ──────────────────────────────────────────────────────────

export default function CallLog() {
  const [filter, setFilter] = useState('All');
  const [logs] = useState(SAMPLE_LOGS);

  const filtered = useMemo(() => {
    if (filter === 'All') return logs;
    return logs.filter((l) => l.group === filter);
  }, [logs, filter]);

  // Group logs by day label
  const grouped = useMemo(() => {
    const todayGroup = [];
    const yesterdayGroup = [];
    const olderGroup = [];

    for (const log of filtered) {
      if (!log.displayDate) todayGroup.push(log);
      else if (log.displayDate === 'Yesterday') yesterdayGroup.push(log);
      else olderGroup.push(log);
    }

    const sections = [];
    if (todayGroup.length) sections.push({ label: 'Today', logs: todayGroup });
    if (yesterdayGroup.length) sections.push({ label: 'Yesterday', logs: yesterdayGroup });
    if (olderGroup.length) sections.push({ label: 'Earlier', logs: olderGroup });
    return sections;
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight" style={{ color: '#F1F5F9' }}>
          Call Log
        </h1>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
          Track missed calls and automated replies sent while your status was active.
        </p>
      </div>

      {/* ── Stats ── */}
      <StatsBar logs={logs} />

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab;
          const cfg = tab !== 'All' ? GROUP_CONFIG[tab] : null;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95"
              style={{
                background: isActive
                  ? cfg ? cfg.bg : 'rgba(139,92,246,0.2)'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isActive ? (cfg ? cfg.border : 'rgba(139,92,246,0.5)') : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? (cfg ? cfg.color : '#d2bbff') : 'rgba(210,187,255,0.5)',
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Log Sections ── */}
      {grouped.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-5">
          {grouped.map((section) => (
            <section key={section.label} className="space-y-3">
              {/* Section date label */}
              <div className="flex items-center gap-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}
                >
                  {section.label}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <span
                  className="text-[10px]"
                  style={{ color: 'rgba(210,187,255,0.3)', fontFamily: "'Inter',sans-serif" }}
                >
                  {section.logs.length} call{section.logs.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {section.logs.map((log) => (
                  <LogCard key={log.id} log={log} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Footer note ── */}
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
      >
        <span className="material-symbols-outlined icon-filled text-base mt-0.5 flex-shrink-0" style={{ color: '#8B5CF6' }}>
          info
        </span>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}>
          The log is read-only. Each entry is a permanent record of the call and the reply sent. Tap any entry to expand details.
        </p>
      </div>
    </div>
  );
}
