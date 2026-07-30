import React, { useState, useMemo, useEffect } from 'react';
import contactsStore from '../store/contactsStore';
import callLogStore from '../store/callLogStore';

// ── Config ─────────────────────────────────────────────────────────────────────

const GROUP_CONFIG = {
  Family: {
    color: '#F472B6',
    bg: 'rgba(244,114,182,0.15)',
    border: 'rgba(244,114,182,0.5)',
    accentBorder: '#F472B6',
  },
  'Friends & Relatives': {
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

const FILTER_TABS = ['All', 'Family', 'Friends & Relatives', 'Work', 'Unknown'];
const GROUPS_LIST = ['Family', 'Friends & Relatives', 'Work', 'Unknown'];

// ── Keypad Dialing Buttons Config ──────────────────────────────────────────────

const KEYPAD_BUTTONS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: '' },
  { digit: '0', sub: '+' },
  { digit: '#', sub: '' },
];

// ── Sample Data ────────────────────────────────────────────────────────────────

const SAMPLE_LOGS = [
  {
    id: '1',
    name: 'Mom',
    number: null,
    group: 'Family',
    timestamp: Date.now() - 2 * 60 * 60 * 1000 + 22 * 60 * 1000,
    displayTime: '14:22',
    displayDate: null,
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
    group: 'Friends & Relatives',
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

        {/* Row 3: Message preview */}
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
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl sm:rounded-2xl p-2 sm:p-3 flex flex-col items-center gap-0.5 sm:gap-1"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span className="material-symbols-outlined icon-filled text-base sm:text-lg" style={{ color: s.color }}>
            {s.icon}
          </span>
          <span className="font-display font-bold text-lg sm:text-xl" style={{ color: '#F1F5F9' }}>{s.value}</span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider" style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Ascending Contact List Sheet Modal ──────────────────────────────────────────

function ContactListModal({ onClose, onSelectContact }) {
  const [contacts, setContacts] = useState([]);
  const [contactSearchQuery, setContactSearchQuery] = useState('');

  useEffect(() => {
    setContacts(contactsStore.getAll());
  }, []);

  // Sort contacts in ascending alphabetical order (A to Z) & filter by search query
  const sortedContacts = useMemo(() => {
    let list = [...contacts];
    if (contactSearchQuery.trim()) {
      const q = contactSearchQuery.toLowerCase().trim();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts, contactSearchQuery]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-2.5 sm:p-4 pt-14 sm:pt-20 bg-bg-void/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col space-y-3 sm:space-y-4 shadow-2xl overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #1E2240 0%, #0c0d14 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          maxHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">contacts</span>
            <div>
              <h2 className="font-display font-bold text-lg text-primary">Saved Contacts</h2>
              <p className="text-[11px] text-outline-variant">Displaying contacts in ascending order (A-Z)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Search bar inside Contact List modal ── */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline-variant/60 pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search saved contacts..."
            value={contactSearchQuery}
            onChange={(e) => setContactSearchQuery(e.target.value)}
            className="w-full pl-9 pr-7 py-2 rounded-xl text-xs bg-bg-surface border border-white/10 text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary/50"
          />
          {contactSearchQuery && (
            <button
              onClick={() => setContactSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant/60 hover:text-on-surface text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contact List */}
        {sortedContacts.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <span className="material-symbols-outlined text-4xl text-outline-variant/40">person_off</span>
            <p className="text-xs text-outline-variant">
              {contactSearchQuery ? `No contacts matching "${contactSearchQuery}"` : 'No saved contacts yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 divide-y divide-white/5">
            {sortedContacts.map((c) => {
              const cfg = GROUP_CONFIG[c.group] || GROUP_CONFIG.Unknown;
              const initials = c.name.slice(0, 2).toUpperCase();

              return (
                <div
                  key={c.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 hover:bg-white/[0.02] p-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Initials Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-sm text-on-surface truncate">
                        {c.name}
                      </h4>
                      <p className="text-xs font-mono text-outline-variant truncate">
                        {c.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Group Badge */}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {c.group}
                    </span>

                    {/* Quick Call Action */}
                    {onSelectContact && (
                      <button
                        onClick={() => onSelectContact(c.phone)}
                        className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                        title={`Call ${c.name}`}
                      >
                        <span className="material-symbols-outlined text-base">call</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Interactive Phone Keypad Modal ─────────────────────────────────────────────

function KeypadModal({ onClose, initialDigits = '' }) {
  const [digits, setDigits] = useState(initialDigits);
  const [callingState, setCallingState] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Save contact state
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Family');
  const [toastMessage, setToastMessage] = useState(null);

  // Call timer logic
  useEffect(() => {
    let interval = null;
    if (callingState) {
      interval = setInterval(() => setCallTimer((t) => t + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callingState]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDigitClick = (d) => {
    if (digits.length < 15) {
      setDigits((prev) => prev + d);
    }
  };

  const handleBackspace = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const formatTimer = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleInitiateCall = () => {
    if (!digits) return;
    setCallingState(true);
  };

  const handleEndCall = () => {
    setCallingState(false);
    onClose();
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !digits.trim()) return;

    contactsStore.save({
      name: contactName.trim(),
      phone: digits.trim(),
      group: selectedGroup,
    });

    triggerToast(`Saved ${contactName.trim()} to ${selectedGroup}!`);
    setShowSaveForm(false);
    setContactName('');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-2.5 sm:p-4 pt-14 sm:pt-20 bg-bg-void/80 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && !callingState && onClose()}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 flex flex-col space-y-3 sm:space-y-4 shadow-2xl overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, #1E2240 0%, #0c0d14 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          maxHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">dialpad</span>
            <h2 className="font-display font-bold text-lg text-primary">Phone Keypad</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {digits.length > 0 && !callingState && !showSaveForm && (
              <button
                type="button"
                onClick={() => setShowSaveForm(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 active:scale-95 shadow-sm"
                title="Save entered number to contacts"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>Save Contact</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* ── Active Calling Overlay ── */}
        {callingState ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center">
            {/* Animated Pulsing Ring */}
            <div className="relative flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400/50 shadow-glow-primary">
                <span className="material-symbols-outlined text-4xl text-emerald-400 animate-pulse">
                  call
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
                Calling...
              </p>
              <h3 className="font-mono text-2xl font-bold text-on-surface">
                {digits}
              </h3>
              <p className="text-xs font-mono text-outline-variant mt-1">
                Duration: {formatTimer(callTimer)}
              </p>
            </div>

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer mt-4"
              title="End Call"
            >
              <span className="material-symbols-outlined text-3xl">call_end</span>
            </button>
          </div>
        ) : showSaveForm ? (
          /* ── Save Contact Form Overlay ── */
          <form onSubmit={handleSaveContact} className="glass-card p-4 space-y-4 border border-white/15">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">person_add</span>
                Save Contact
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveForm(false)}
                className="text-xs text-outline-variant hover:text-on-surface"
              >
                Cancel
              </button>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-outline-variant">
                Phone Number
              </label>
              <div className="px-3 py-2 rounded-xl bg-bg-surface border border-white/10 font-mono text-sm font-bold text-on-surface">
                {digits}
              </div>
            </div>

            {/* Contact Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-outline-variant">
                Contact Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter contact name (e.g. John Doe)"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Group Choice */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-outline-variant">
                Assign Contact Group
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GROUPS_LIST.map((grp) => {
                  const isSel = selectedGroup === grp;
                  const cfg = GROUP_CONFIG[grp] || GROUP_CONFIG.Unknown;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedGroup(grp)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border"
                      style={{
                        background: isSel ? cfg.bg : 'rgba(255,255,255,0.04)',
                        borderColor: isSel ? cfg.border : 'rgba(255,255,255,0.08)',
                        color: isSel ? cfg.color : 'rgba(210,187,255,0.6)',
                      }}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      <span className="truncate">{grp}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!contactName.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-glow-primary transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Save to Contacts
            </button>
          </form>
        ) : (
          <>
            {/* ── Digit Display Screen ── */}
            <div className="relative bg-bg-surface/80 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between min-h-[56px]">
              <span
                className="font-mono font-bold text-2xl text-on-surface tracking-wider overflow-x-auto whitespace-nowrap scrollbar-none"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {digits || <span className="text-outline-variant/40 text-lg font-normal">Enter phone number...</span>}
              </span>

              {digits.length > 0 && (
                <button
                  onClick={handleBackspace}
                  className="p-2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer flex-shrink-0"
                  title="Backspace"
                >
                  <span className="material-symbols-outlined text-xl">backspace</span>
                </button>
              )}
            </div>

            {/* ── Keypad Grid ── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
              {KEYPAD_BUTTONS.map((item) => (
                <button
                  key={item.digit}
                  onClick={() => handleDigitClick(item.digit)}
                  className="flex flex-col items-center justify-center h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="font-mono text-lg sm:text-xl font-bold text-on-surface leading-none">
                    {item.digit}
                  </span>
                  {item.sub && (
                    <span className="text-[8px] sm:text-[9px] font-bold text-outline-variant tracking-widest mt-0.5">
                      {item.sub}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── Action Bar (Green Call Button) ── */}
            <div className="flex justify-center pt-1">
              <button
                onClick={handleInitiateCall}
                disabled={!digits.trim()}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
                }}
                title="Make Call"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">call</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ filter, searchQuery }) {
  return (
    <div className="text-center py-16 space-y-3">
      <div className="text-5xl">{searchQuery ? '🔍' : '📭'}</div>
      <h3 className="font-display font-semibold text-lg" style={{ color: 'rgba(210,187,255,0.6)' }}>
        {searchQuery ? `No results for "${searchQuery}"` : 'No calls logged'}
      </h3>
      <p className="text-sm" style={{ color: 'rgba(210,187,255,0.35)', fontFamily: "'Inter',sans-serif" }}>
        {searchQuery
          ? 'Check spelling or search for a different contact name or phone number.'
          : filter === 'All'
          ? 'Missed calls during an active status will appear here.'
          : `No ${filter} calls in the log yet.`}
      </p>
    </div>
  );
}

// ── Main CallLog Page ──────────────────────────────────────────────────────────

export default function CallLog() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState(() => callLogStore.getAll());
  const [allContacts, setAllContacts] = useState([]);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showContactList, setShowContactList] = useState(false);
  const [keypadInitialDigits, setKeypadInitialDigits] = useState('');

  // Load saved contacts & call logs
  const refresh = () => {
    setAllContacts(contactsStore.getAll());
    setLogs(callLogStore.getAll());
  };

  useEffect(() => {
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [showContactList, showKeypad]);

  // Filter Call Logs by filter tab and search query
  const filteredLogs = useMemo(() => {
    let result = logs;
    if (filter !== 'All') {
      result = result.filter((l) => l.group === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.number && l.number.includes(q)) ||
          l.statusName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [logs, filter, searchQuery]);

  // Filter Saved Contacts when user types in search query
  const matchingContacts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
    );
  }, [allContacts, searchQuery]);

  // Group logs by day label
  const grouped = useMemo(() => {
    const todayGroup = [];
    const yesterdayGroup = [];
    const olderGroup = [];

    for (const log of filteredLogs) {
      if (!log.displayDate) todayGroup.push(log);
      else if (log.displayDate === 'Yesterday') yesterdayGroup.push(log);
      else olderGroup.push(log);
    }

    const sections = [];
    if (todayGroup.length) sections.push({ label: 'Today', logs: todayGroup });
    if (yesterdayGroup.length) sections.push({ label: 'Yesterday', logs: yesterdayGroup });
    if (olderGroup.length) sections.push({ label: 'Earlier', logs: olderGroup });
    return sections;
  }, [filteredLogs]);

  const handleSelectContactToCall = (phone) => {
    setShowContactList(false);
    setKeypadInitialDigits(phone);
    setShowKeypad(true);
  };

  return (
    <div className="space-y-5 relative min-h-[calc(100vh-160px)] pb-12">
      {/* ── Page Header ── */}
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight" style={{ color: '#F1F5F9' }}>
            Call Log
          </h1>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
            Track missed calls and automated replies sent while your status was active.
          </p>
        </div>

        {/* Controls row BELOW title and message text */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline-variant/60 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search call log or saved contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary/50 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant/60 hover:text-on-surface text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowContactList(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 bg-primary/15 border border-primary/35 text-primary hover:bg-primary/25 flex-shrink-0"
            title="View Contact List (A to Z)"
          >
            <span className="material-symbols-outlined text-base">contacts</span>
            <span>Contacts</span>
          </button>
        </div>
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

      {/* ── Matching Saved Contacts Section (When Search Query is Active) ── */}
      {searchQuery && matchingContacts.length > 0 && (
        <div className="space-y-2 p-3.5 rounded-2xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">contacts</span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              Matching Saved Contacts ({matchingContacts.length})
            </h3>
          </div>

          <div className="space-y-2">
            {matchingContacts.map((c) => {
              const cfg = GROUP_CONFIG[c.group] || GROUP_CONFIG.Unknown;
              const initials = c.name.slice(0, 2).toUpperCase();

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-xs text-on-surface truncate">{c.name}</p>
                      <p className="text-[11px] font-mono text-outline-variant truncate">{c.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {c.group}
                    </span>
                    <button
                      onClick={() => handleSelectContactToCall(c.phone)}
                      className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Log Sections ── */}
      {grouped.length === 0 && matchingContacts.length === 0 ? (
        <EmptyState filter={filter} searchQuery={searchQuery} />
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

      {/* ── Floating Fixed Keypad FAB Button ── */}
      <button
        onClick={() => {
          setKeypadInitialDigits('');
          setShowKeypad(true);
        }}
        className="fixed bottom-16 sm:bottom-20 right-3 sm:right-4 md:right-[calc(50%-220px)] z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-200 active:scale-90 cursor-pointer"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: '0 8px 24px rgba(124,58,237,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
        title="Open Phone Keypad"
      >
        <span className="material-symbols-outlined text-2xl">dialpad</span>
      </button>

      {/* ── Interactive Keypad Overlay Modal ── */}
      {showKeypad && (
        <KeypadModal
          initialDigits={keypadInitialDigits}
          onClose={() => setShowKeypad(false)}
        />
      )}

      {/* ── Contact List Modal ── */}
      {showContactList && (
        <ContactListModal
          onClose={() => setShowContactList(false)}
          onSelectContact={handleSelectContactToCall}
        />
      )}
    </div>
  );
}
