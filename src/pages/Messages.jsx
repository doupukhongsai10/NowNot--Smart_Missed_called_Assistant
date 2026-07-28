import React, { useState, useCallback } from 'react';
import messageStore from '../store/messageStore';
import useActiveStatus from '../hooks/useActiveStatus';

// ── Config ────────────────────────────────────────────────────────────────────

const GROUPS = [
  {
    key: 'Family',
    icon: '🩷',
    color: '#F472B6',
    borderColor: 'rgba(244,114,182,0.45)',
    bgColor: 'rgba(244,114,182,0.06)',
    glowColor: 'rgba(244,114,182,0.12)',
    badge: 'PRIORITY',
    badgeBg: 'rgba(244,114,182,0.15)',
    badgeColor: '#F472B6',
  },
  {
    key: 'Friends & Relatives',
    icon: '👥',
    color: '#38BDF8',
    borderColor: 'rgba(56,189,248,0.45)',
    bgColor: 'rgba(56,189,248,0.06)',
    glowColor: 'rgba(56,189,248,0.12)',
    badge: 'ACTIVE',
    badgeBg: 'rgba(56,189,248,0.15)',
    badgeColor: '#38BDF8',
  },
  {
    key: 'Work',
    icon: '🧳',
    color: '#FBBF24',
    borderColor: 'rgba(251,191,36,0.45)',
    bgColor: 'rgba(251,191,36,0.06)',
    glowColor: 'rgba(251,191,36,0.12)',
    badge: 'SCHEDULED',
    badgeBg: 'rgba(251,191,36,0.15)',
    badgeColor: '#FBBF24',
  },
  {
    key: 'Unknown',
    icon: '👤',
    color: '#94A3B8',
    borderColor: 'rgba(148,163,184,0.35)',
    bgColor: 'rgba(148,163,184,0.04)',
    glowColor: 'rgba(148,163,184,0.08)',
    badge: 'DEFAULT',
    badgeBg: 'rgba(148,163,184,0.1)',
    badgeColor: '#94A3B8',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  const weeks = Math.floor(diff / (7 * 86_400_000));
  if (weeks >= 1) return `Updated ${weeks}w ago`;
  if (days >= 1) return `Updated ${days}d ago`;
  if (hours >= 1) return `Updated ${hours}h ago`;
  if (mins >= 1) return `Updated ${mins}m ago`;
  return 'Just updated';
}

// ── Edit Modal (bottom sheet) ─────────────────────────────────────────────────

function EditModal({ group, message, onClose, onSave }) {
  const [draft, setDraft] = useState(message);
  const maxChars = 160;

  const handleSave = () => {
    if (draft.trim()) onSave(draft.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(7,8,15,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: 'calc(85dvh - 72px)',
          marginBottom: '72px',
        }}
      >
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Handle */}
          <div className="flex justify-center -mt-1 mb-2">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{group.icon}</span>
              <h2 className="font-display font-bold text-lg" style={{ color: group.color }}>
                {group.key}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl cursor-pointer transition-all active:scale-90"
              style={{ color: 'rgba(210,187,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Label */}
          <div>
            <label
              className="text-[10px] font-bold uppercase tracking-widest block mb-2"
              style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}
            >
              Auto-Reply Message
            </label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, maxChars))}
              rows={5}
              autoFocus
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none placeholder:text-outline-variant"
              style={{
                background: `rgba(${group.color === '#F472B6' ? '244,114,182' : group.color === '#38BDF8' ? '56,189,248' : group.color === '#FBBF24' ? '251,191,36' : '148,163,184'},0.07)`,
                border: `1px solid ${group.borderColor}`,
                color: '#e3e1ec',
                fontFamily: "'Inter',sans-serif",
                lineHeight: '1.65',
              }}
              onFocus={(e) => (e.target.style.borderColor = group.color)}
              onBlur={(e) => (e.target.style.borderColor = group.borderColor)}
            />
            {/* Char count */}
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-[10px]" style={{ color: 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}>
                Sent instantly when a call is missed while your status is active.
              </p>
              <span
                className="text-[10px] font-mono flex-shrink-0 ml-2"
                style={{
                  color: draft.length > maxChars * 0.85 ? '#F59E0B' : 'rgba(210,187,255,0.35)',
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {draft.length}/{maxChars}
              </span>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}>
              Quick suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "I'll call you back soon!",
                'Currently unavailable.',
                'In a meeting, will reply later.',
                'Text me instead.',
              ].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraft(s)}
                  className="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(210,187,255,0.65)',
                    fontFamily: "'Inter',sans-serif",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = group.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div
          className="flex-shrink-0 px-6 pb-5 pt-3 flex gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(18,19,26,0.9)' }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold cursor-pointer transition-all active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(210,187,255,0.7)',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!draft.trim()}
            className="flex-1 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            style={{
              background: 'var(--gradient-primary)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            Save Message
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Test Reply Toast ───────────────────────────────────────────────────────────

function TestToast({ group, message, onDismiss }) {
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[440px]"
      style={{ animation: 'slideUp 0.3s cubic-bezier(0,0,0.2,1)' }}
    >
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{
          background: 'rgba(22,26,53,0.97)',
          border: `1px solid ${group.borderColor}`,
          backdropFilter: 'blur(16px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${group.glowColor}`,
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-base"
          style={{ background: group.bgColor, border: `1px solid ${group.borderColor}` }}
        >
          {group.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="material-symbols-outlined icon-filled text-xs" style={{ color: group.color }}>
              sms
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: group.color, fontFamily: "'Inter',sans-serif" }}
            >
              Test Reply · {group.key}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#e3e1ec', fontFamily: "'Inter',sans-serif" }}>
            {message}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg cursor-pointer"
          style={{ color: 'rgba(210,187,255,0.4)' }}
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
}

// ── Group Message Card ─────────────────────────────────────────────────────────

function GroupCard({ group, message, updatedAt, onEdit, onTest }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: `linear-gradient(145deg, ${group.bgColor} 0%, rgba(30,34,64,0.5) 100%)`,
        border: `1px solid ${group.borderColor}`,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top glow */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${group.color}60, transparent)` }}
      />

      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: group.bgColor, border: `1px solid ${group.borderColor}` }}
            >
              {group.icon}
            </span>
            <span
              className="font-display font-bold text-base"
              style={{ color: group.color }}
            >
              {group.key}
            </span>
          </div>
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: group.badgeBg,
              color: group.badgeColor,
              border: `1px solid ${group.borderColor}`,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {group.badge}
          </span>
        </div>

        {/* Label */}
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}
        >
          Auto-Reply Message
        </p>

        {/* Message preview */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: '#e3e1ec', fontFamily: "'Inter',sans-serif" }}
        >
          {message}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span
            className="text-[11px] flex items-center gap-1"
            style={{ color: 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}
          >
            <span className="material-symbols-outlined text-xs">schedule</span>
            {timeAgo(updatedAt)}
          </span>

          <div className="flex items-center gap-2">
            {/* Edit button */}
            <button
              onClick={onEdit}
              className="p-1.5 rounded-xl cursor-pointer transition-all active:scale-90"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(210,187,255,0.55)',
              }}
              title="Edit message"
            >
              <span className="material-symbols-outlined text-base">edit_note</span>
            </button>

            {/* Test reply button */}
            <button
              onClick={onTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95"
              style={{
                background: group.bgColor,
                border: `1px solid ${group.borderColor}`,
                color: group.color,
                fontFamily: "'Inter',sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${group.bgColor.replace('0.06', '0.14').replace('0.04', '0.1')}`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = group.bgColor)}
            >
              <span className="material-symbols-outlined icon-filled text-base">play_arrow</span>
              Test Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Messages Page ─────────────────────────────────────────────────────────

export default function Messages() {
  const { activeStatus } = useActiveStatus();

  const [data, setData] = useState(() => messageStore.getGlobal());
  const [editingGroup, setEditingGroup] = useState(null); // group config object
  const [testGroup, setTestGroup] = useState(null);       // { group, message }

  React.useEffect(() => {
    if (activeStatus && activeStatus.statusId) {
      const activeMsgs = messageStore.getForStatus(activeStatus.statusId);
      setData({
        messages: activeMsgs,
        updatedAt: messageStore.getGlobal().updatedAt,
      });
    } else {
      setData(messageStore.getGlobal());
    }
  }, [activeStatus]);

  const handleSave = useCallback((groupKey, text) => {
    const updated = messageStore.saveGlobal(groupKey, text);
    setData(updated);
    setEditingGroup(null);
  }, []);

  const handleTest = (group, message) => {
    setTestGroup({ group, message });
    // Auto-dismiss after 4s
    setTimeout(() => setTestGroup(null), 4000);
  };

  const messages = data.messages || {};
  const updatedAt = data.updatedAt || {};

  return (
    <>
      <div className="space-y-5">
        {/* ── Page Header ── */}
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight" style={{ color: '#d2bbff' }}>
            Messages
          </h1>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
            Configure auto-replies for your contact groups.{' '}
            NowNot will handle responses based on your active status.
          </p>
        </div>

        {/* ── Active status banner ── */}
        {activeStatus && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <span className="material-symbols-outlined icon-filled text-base" style={{ color: '#8B5CF6' }}>
              auto_awesome
            </span>
            <p className="text-xs" style={{ color: 'rgba(210,187,255,0.7)', fontFamily: "'Inter',sans-serif" }}>
              <span style={{ color: '#d2bbff', fontWeight: 600 }}>
                {activeStatus.detail?.emoji} {activeStatus.detail?.name || activeStatus.statusName}
              </span>{' '}
              is active — these messages are being sent to missed callers right now.
            </p>
          </div>
        )}

        {/* ── Group Cards ── */}
        <div className="space-y-3">
          {GROUPS.map((group) => (
            <GroupCard
              key={group.key}
              group={group}
              message={messages[group.key] || ''}
              updatedAt={updatedAt[group.key]}
              onEdit={() => setEditingGroup(group)}
              onTest={() => handleTest(group, messages[group.key] || '')}
            />
          ))}
        </div>

        {/* ── Info note ── */}
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <span className="material-symbols-outlined icon-filled text-base mt-0.5 flex-shrink-0" style={{ color: '#8B5CF6' }}>
            info
          </span>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}>
            Auto-replies are only sent when a status is active. Each contact group receives the message set for it. Unknown callers get the Default reply.
          </p>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editingGroup && (
        <EditModal
          group={editingGroup}
          message={messages[editingGroup.key] || ''}
          onClose={() => setEditingGroup(null)}
          onSave={(text) => handleSave(editingGroup.key, text)}
        />
      )}

      {/* ── Test Reply Toast ── */}
      {testGroup && (
        <TestToast
          group={testGroup.group}
          message={testGroup.message}
          onDismiss={() => setTestGroup(null)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(16px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
