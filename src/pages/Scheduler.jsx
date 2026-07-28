import React, { useState, useEffect, useCallback } from 'react';
import scheduleStore from '../store/scheduleStore';
import statusStore from '../store/statusStore';
import useActiveStatus from '../hooks/useActiveStatus';

// Day abbreviations (0=Sun ... 6=Sat)
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

/** Format "09:00" → "09:00 AM" */
function fmt(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

/** Compute minutes since midnight from "HH:MM" */
function toMins(time24) {
  if (!time24) return 0;
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
}

/** Get the "primary" active schedule (enabled, active today, currently within window) */
function findPrimaryActive(schedules) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  return schedules.find(
    (s) =>
      s.enabled &&
      s.days.includes(currentDay) &&
      currentMins >= toMins(s.startTime) &&
      currentMins < toMins(s.endTime)
  ) || null;
}

/** Build upcoming transitions list */
function buildUpcoming(schedules) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const transitions = [];

  for (let dayOffset = 0; dayOffset <= 1; dayOffset++) {
    const targetDay = (currentDay + dayOffset) % 7;
    const dayLabel = dayOffset === 0 ? 'TODAY' : 'TOMORROW';

    for (const sched of schedules) {
      if (!sched.enabled || !sched.days.includes(targetDay)) continue;

      const startMins = toMins(sched.startTime);
      const endMins = toMins(sched.endTime);

      // Only show future transitions
      if (dayOffset === 0 && startMins <= currentMins) continue;

      transitions.push({
        id: `${sched.id}-${dayOffset}`,
        time: fmt(sched.startTime),
        rawMins: dayOffset * 24 * 60 + startMins,
        dayLabel,
        name: sched.name,
        emoji: sched.emoji,
        desc: `Activating ${sched.name} status`,
        type: 'start',
        sched,
      });

      if (dayOffset === 0 && endMins > currentMins) {
        transitions.push({
          id: `${sched.id}-${dayOffset}-end`,
          time: fmt(sched.endTime),
          rawMins: dayOffset * 24 * 60 + endMins,
          dayLabel,
          name: sched.name,
          emoji: sched.emoji,
          desc: `Deactivating ${sched.name} — returning to idle`,
          type: 'end',
          sched,
        });
      }
    }
  }

  transitions.sort((a, b) => a.rawMins - b.rawMins);
  return transitions.slice(0, 4);
}

/** Compute time until next recurrence: "Next in Xh Ym" */
function nextOccurrence(sched) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = toMins(sched.startTime);

  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    if (!sched.days.includes(checkDay)) continue;
    const minsUntil = i * 24 * 60 + startMins - currentMins;
    if (minsUntil <= 0) continue;
    const h = Math.floor(minsUntil / 60);
    const m = minsUntil % 60;
    if (h > 0) return `Next shift in: ${h}h ${m}m`;
    return `Next shift in: ${m}m`;
  }
  return '';
}

// ── Add/Edit Routine Modal ────────────────────────────────────────────────────

function RoutineModal({ initial, onClose, onSave }) {
  const allStatuses = statusStore.getAll();
  const [form, setForm] = useState({
    name: '',
    emoji: '⏰',
    statusId: allStatuses[0]?.id || '',
    startTime: '09:00',
    endTime: '17:00',
    days: [1, 2, 3, 4, 5],
    enabled: true,
    ...initial,
  });
  const [emojiOpen, setEmojiOpen] = useState(false);

  const QUICK_EMOJIS = ['⏰', '🧘', '💼', '📚', '🚗', '💪', '🏠', '🌙', '🎯', '🔕', '🎮', '🍽️'];

  const toggleDay = (d) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(d) ? prev.days.filter((x) => x !== d) : [...prev.days, d].sort(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: initial?.id });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(7,8,15,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[480px] rounded-t-3xl p-6 pb-10 space-y-5"
        style={{
          background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          maxHeight: '92dvh',
          overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl" style={{ color: '#d2bbff' }}>
            {initial ? 'Edit Routine' : 'New Routine'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl cursor-pointer transition-all active:scale-90"
            style={{ color: 'rgba(210,187,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Emoji */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
              Routine Name
            </label>
            <div className="flex gap-2">
              {/* Emoji picker button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEmojiOpen((o) => !o)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl cursor-pointer transition-all active:scale-90"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {form.emoji}
                </button>
                {emojiOpen && (
                  <div
                    className="absolute top-14 left-0 z-10 grid grid-cols-6 gap-1.5 p-3 rounded-2xl"
                    style={{ background: '#1E2240', border: '1px solid rgba(255,255,255,0.1)', minWidth: 200 }}
                  >
                    {QUICK_EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => { setForm((f) => ({ ...f, emoji: em })); setEmojiOpen(false); }}
                        className="text-xl p-1.5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Morning Focus"
                required
                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none placeholder:text-outline-variant"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e3e1ec',
                  fontFamily: "'Inter',sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
          </div>

          {/* Status select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
              Status to Activate
            </label>
            <select
              value={form.statusId}
              onChange={(e) => setForm((f) => ({ ...f, statusId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none appearance-none cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e3e1ec',
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {allStatuses.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#1e1f27' }}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Start Time', key: 'startTime' },
              { label: 'End Time', key: 'endTime' },
            ].map(({ label, key }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
                  {label}
                </label>
                <input
                  type="time"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e3e1ec',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Days of week */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.55)', fontFamily: "'Inter',sans-serif" }}>
              Repeat on
            </label>
            <div className="flex gap-2">
              {ALL_DAYS.map((d) => {
                const active = form.days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-90"
                    style={{
                      background: active ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? '#d2bbff' : 'rgba(210,187,255,0.35)',
                      fontFamily: "'Inter',sans-serif",
                    }}
                  >
                    {DAY_LABELS[d]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide cursor-pointer transition-all active:scale-95"
            style={{
              background: 'var(--gradient-primary)',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {initial ? 'Save Changes' : 'Create Routine'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Hero Card (currently active schedule) ─────────────────────────────────────

function HeroCard({ schedule, activeStatus }) {
  const isActiveNow = activeStatus && activeStatus.source === 'schedule';

  if (!schedule) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-center space-y-2"
        style={{
          background: 'rgba(30,34,64,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <span className="text-4xl">🌙</span>
        <h2 className="font-display font-semibold text-lg" style={{ color: '#d2bbff' }}>
          No Routine Active
        </h2>
        <p className="text-sm" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
          Your scheduled routines will auto-activate here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, rgba(124,58,237,0.18) 0%, rgba(30,34,64,0.6) 100%)',
        border: '1px solid rgba(139,92,246,0.35)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 32px rgba(139,92,246,0.18), 0 0 8px rgba(139,92,246,0.08)',
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,158,11,0.18) 0%, transparent 70%)' }}
      />

      {/* Watermark */}
      <div className="absolute top-4 right-5 text-7xl opacity-10 select-none pointer-events-none">
        {schedule.emoji}
      </div>

      <div className="relative z-10 space-y-3">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.4)',
            color: '#F59E0B',
            fontFamily: "'Inter',sans-serif",
          }}
        >
          <span className="material-symbols-outlined icon-filled text-[10px]">autorenew</span>
          Recurring
        </span>

        {/* Emoji + Name */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-4xl">{schedule.emoji}</span>
          <h2 className="font-display font-bold text-2xl" style={{ color: '#F1F5F9' }}>
            {schedule.name}
          </h2>
          <p
            className="text-lg font-mono font-bold"
            style={{ color: '#F59E0B', fontFamily: "'JetBrains Mono',monospace" }}
          >
            {fmt(schedule.startTime)} – {fmt(schedule.endTime)}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
            {nextOccurrence(schedule)}
          </span>
          {isActiveNow && (
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.35)',
                color: '#4ADE80',
                fontFamily: "'Inter',sans-serif",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Active Now
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Routine List Item ──────────────────────────────────────────────────────────

function RoutineItem({ sched, onToggle, onEdit, onDelete }) {
  return (
    <div
      className="glass-card p-4 transition-all duration-200"
      style={sched.enabled ? { borderColor: 'rgba(139,92,246,0.2)' } : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Emoji icon box */}
        <div
          className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-xl"
          style={{
            background: sched.enabled ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${sched.enabled ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          {sched.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className="font-display font-semibold text-sm truncate"
              style={{ color: sched.enabled ? '#e3e1ec' : 'rgba(227,225,236,0.45)' }}
            >
              {sched.name}
            </h4>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Edit */}
              <button
                onClick={() => onEdit(sched)}
                className="p-1 rounded-lg cursor-pointer transition-all active:scale-90"
                style={{ color: 'rgba(210,187,255,0.4)' }}
                title="Edit routine"
              >
                <span className="material-symbols-outlined text-base">edit_note</span>
              </button>
              {/* Delete */}
              <button
                onClick={() => onDelete(sched.id)}
                className="p-1 rounded-lg cursor-pointer transition-all active:scale-90 hover:text-red-400"
                style={{ color: 'rgba(210,187,255,0.4)' }}
                title="Delete routine"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
              {/* Toggle switch */}
              <button
                onClick={() => onToggle(sched.id)}
                className="relative w-10 h-6 rounded-full cursor-pointer transition-all duration-300 flex-shrink-0"
                style={{
                  background: sched.enabled
                    ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                    : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${sched.enabled ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.12)'}`,
                }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: '#fff',
                    left: sched.enabled ? 'calc(100% - 1.375rem)' : '0.125rem',
                    boxShadow: sched.enabled ? '0 0 8px rgba(139,92,246,0.5)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Time */}
          <p
            className="text-xs mt-0.5 font-mono"
            style={{
              color: sched.enabled ? 'rgba(210,187,255,0.65)' : 'rgba(210,187,255,0.3)',
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {fmt(sched.startTime)} – {fmt(sched.endTime)}
          </p>

          {/* Day pills */}
          <div className="flex gap-1 mt-2">
            {ALL_DAYS.map((d) => {
              const on = sched.days.includes(d);
              return (
                <span
                  key={d}
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold"
                  style={{
                    background: on
                      ? sched.enabled ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'
                      : 'transparent',
                    color: on
                      ? sched.enabled ? '#d2bbff' : 'rgba(210,187,255,0.25)'
                      : 'rgba(210,187,255,0.15)',
                    border: `1px solid ${on ? (sched.enabled ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.05)'}`,
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  {DAY_LABELS[d]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upcoming Transition Item ───────────────────────────────────────────────────

function TransitionItem({ item }) {
  const isStart = item.type === 'start';
  const dotColor = isStart ? '#F59E0B' : 'rgba(210,187,255,0.3)';

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center pt-1 gap-1">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: dotColor, boxShadow: isStart ? `0 0 6px ${dotColor}` : 'none' }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: isStart ? '#F59E0B' : 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}
          >
            {item.time} {item.dayLabel}
          </span>
        </div>
        <h4
          className="font-display font-semibold text-sm mt-0.5"
          style={{ color: isStart ? '#e3e1ec' : 'rgba(227,225,236,0.55)' }}
        >
          {item.emoji} {item.name}
        </h4>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(210,187,255,0.4)', fontFamily: "'Inter',sans-serif" }}>
          {item.desc}
        </p>
      </div>

      <span className="material-symbols-outlined text-base flex-shrink-0 mt-1" style={{ color: 'rgba(210,187,255,0.25)' }}>
        chevron_right
      </span>
    </div>
  );
}

// ── Main Scheduler Page ───────────────────────────────────────────────────────

export default function Scheduler() {
  const [schedules, setSchedules] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const { activeStatus } = useActiveStatus();

  const load = useCallback(() => {
    setSchedules(scheduleStore.getAll());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const primaryActive = findPrimaryActive(schedules);
  const upcomingTransitions = buildUpcoming(schedules);
  const enabledSchedules = schedules.filter((s) => s.enabled);
  const disabledSchedules = schedules.filter((s) => !s.enabled);

  const handleToggle = (id) => {
    setSchedules(scheduleStore.toggle(id));
  };

  const handleDelete = (id) => {
    setSchedules(scheduleStore.remove(id));
  };

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sched) => {
    setEditingSchedule(sched);
    setModalOpen(true);
  };

  const handleSave = (formData) => {
    setSchedules(scheduleStore.save(formData));
    setModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight" style={{ color: '#d2bbff' }}>
              Scheduler
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
              Automate your availability routines
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(210,187,255,0.6)' }}
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </div>
        </div>

        {/* ── Hero Card ── */}
        <HeroCard schedule={primaryActive} activeStatus={activeStatus} />

        {/* ── Add New Routine CTA ── */}
        <button
          onClick={handleOpenCreate}
          className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
            fontFamily: "'Inter',sans-serif",
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 28px rgba(34,197,94,0.45)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)')}
        >
          <span className="material-symbols-outlined icon-filled text-lg">add</span>
          ADD NEW ROUTINE
        </button>

        {/* ── Weekly Routines ── */}
        {schedules.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}
            >
              Weekly Routine{schedules.length !== 1 ? 's' : ''} · {schedules.length}
            </h2>

            <div className="space-y-2">
              {/* Enabled first */}
              {enabledSchedules.map((sched) => (
                <RoutineItem
                  key={sched.id}
                  sched={sched}
                  onToggle={handleToggle}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
              {/* Disabled below with muted divider */}
              {disabledSchedules.length > 0 && enabledSchedules.length > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(210,187,255,0.25)', fontFamily: "'Inter',sans-serif" }}>
                    Paused
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
              )}
              {disabledSchedules.map((sched) => (
                <RoutineItem
                  key={sched.id}
                  sched={sched}
                  onToggle={handleToggle}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Upcoming Transitions ── */}
        {upcomingTransitions.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'rgba(210,187,255,0.45)', fontFamily: "'Inter',sans-serif" }}
            >
              Upcoming Transitions
            </h2>

            <div
              className="rounded-2xl overflow-hidden divide-y"
              style={{
                background: 'rgba(30,34,64,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                divideColor: 'rgba(255,255,255,0.04)',
              }}
            >
              {upcomingTransitions.map((item, idx) => (
                <div
                  key={item.id}
                  style={{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <TransitionItem item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Empty State ── */}
        {schedules.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <div className="text-5xl">📅</div>
            <h3 className="font-display font-semibold text-lg" style={{ color: 'rgba(210,187,255,0.6)' }}>
              No routines yet
            </h3>
            <p className="text-sm" style={{ color: 'rgba(210,187,255,0.35)', fontFamily: "'Inter',sans-serif" }}>
              Tap "Add New Routine" to automate your availability.
            </p>
          </div>
        )}

        {/* ── Info note ── */}
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}
        >
          <span className="material-symbols-outlined icon-filled text-base mt-0.5 flex-shrink-0" style={{ color: '#F59E0B' }}>
            info
          </span>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(210,187,255,0.5)', fontFamily: "'Inter',sans-serif" }}>
            Manual statuses always override scheduled ones. When a manual status expires, the app returns to idle — skipped schedule windows are not resumed.
          </p>
        </div>
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <RoutineModal
          initial={editingSchedule}
          onClose={() => { setModalOpen(false); setEditingSchedule(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
