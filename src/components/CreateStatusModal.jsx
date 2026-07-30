import React, { useState, useEffect } from 'react';
import statusStore from '../store/statusStore';
import messageStore, { DEFAULT_MESSAGES } from '../store/messageStore';
import statusEngine from '../engine/statusEngine';
import { generateId } from '../utils/idGenerator';
import { useStatusContext } from '../context/StatusContext';

function timeWindowsOverlap(start1, end1, start2, end2) {
  const toM = (t) => {
    if (typeof t === 'number') return t;
    const [h, m] = String(t).split(':').map(Number);
    return h * 60 + m;
  };

  const s1 = toM(start1);
  let e1 = toM(end1);
  if (e1 <= s1) e1 += 1440;

  const s2 = toM(start2);
  let e2 = toM(end2);
  if (e2 <= s2) e2 += 1440;

  return Math.max(s1, s2) < Math.min(e1, e2);
}

// ── Emoji catalogue grouped by theme ────────────────────────────────────────
const EMOJI_OPTIONS = [
  // Work & Focus
  '💼', '💻', '🎯', '📝', '✍️', '📊', '📈', '🔬', '🖥️', '📞', '📱', '🏗️',
  // Rest & Sleep
  '😴', '🛌', '🌙', '😌', '🧸', '💤',
  // Health & Fitness
  '💪', '🏃', '🧘', '🚴', '🏊', '🏋️', '⚽', '🏀', '🎾', '🏔️', '🚿', '🩺',
  // Food & Drink
  '🍽️', '☕', '🍕', '🥗', '🍱', '🧃',
  // Transport
  '🚗', '✈️', '🚂', '🚢', '🚶', '🏍️', '🛵',
  // Social & Family
  '🏠', '❤️', '🎉', '🙏', '🛒', '🎓', '👨‍👩‍👧',
  // Entertainment
  '🎮', '🎧', '🎬', '🎵', '🎨', '📖', '🎭',
  // Status & Signals
  '🚫', '⚡', '🔕', '⏳', '🌴', '🌅', '🤫', '🟢', '🔴',
];

// ── Keyword → emoji mapping for auto-suggest ────────────────────────────────
const KEYWORD_MAP = [
  { keywords: ['sleep', 'nap', 'rest', 'tired', 'bed', 'night time'], emoji: '😴' },
  { keywords: ['night', 'midnight', 'late', 'dark'], emoji: '🌙' },
  { keywords: ['meeting', 'standup', 'call', 'zoom', 'conference', 'sync'], emoji: '📞' },
  { keywords: ['work', 'office', 'job', 'business', 'professional'], emoji: '💼' },
  { keywords: ['study', 'studying', 'reading', 'learn', 'homework', 'exam', 'revision', 'book'], emoji: '📖' },
  { keywords: ['code', 'coding', 'program', 'develop', 'debug', 'deploy', 'hack'], emoji: '💻' },
  { keywords: ['drive', 'driving', 'car', 'commut'], emoji: '🚗' },
  { keywords: ['gym', 'workout', 'exercise', 'fitness', 'lift', 'lifting', 'weights'], emoji: '💪' },
  { keywords: ['run', 'running', 'jog', 'jogging', 'sprint', 'marathon'], emoji: '🏃' },
  { keywords: ['bike', 'biking', 'cycl', 'cycle', 'cycling'], emoji: '🚴' },
  { keywords: ['swim', 'swimming', 'pool'], emoji: '🏊' },
  { keywords: ['yoga', 'meditat', 'mindful', 'breath', 'calm', 'zen'], emoji: '🧘' },
  { keywords: ['sport', 'soccer', 'football', 'tennis', 'basket', 'athletic'], emoji: '⚽' },
  { keywords: ['hike', 'hiking', 'mountain', 'trek', 'camp', 'outdoor', 'trail'], emoji: '🏔️' },
  { keywords: ['busy', 'dnd', 'do not disturb', 'unavailab', 'blocked', 'no calls'], emoji: '🚫' },
  { keywords: ['silent', 'mute', 'quiet', 'off', 'notification'], emoji: '🔕' },
  { keywords: ['focus', 'deep', 'concentrat', 'flow', 'uninterrupt'], emoji: '🎯' },
  { keywords: ['vacation', 'holiday', 'relax', 'beach', 'resort', 'getaway'], emoji: '🌴' },
  { keywords: ['travel', 'flight', 'airplane', 'plane', 'trip', 'fly', 'airport'], emoji: '✈️' },
  { keywords: ['music', 'listen', 'podcast', 'audio', 'headphone', 'playlist'], emoji: '🎧' },
  { keywords: ['game', 'gaming', 'play', 'video game', 'stream'], emoji: '🎮' },
  { keywords: ['movie', 'film', 'cinema', 'watch', 'netflix', 'series', 'tv'], emoji: '🎬' },
  { keywords: ['art', 'draw', 'sketch', 'design', 'paint', 'creat', 'illustrat'], emoji: '🎨' },
  { keywords: ['eat', 'eating', 'lunch', 'dinner', 'breakfast', 'food', 'meal', 'snack'], emoji: '🍽️' },
  { keywords: ['coffee', 'cafe', 'tea', 'brew', 'espresso', 'latte'], emoji: '☕' },
  { keywords: ['shop', 'shopping', 'groceri', 'market', 'store', 'buy', 'errand'], emoji: '🛒' },
  { keywords: ['doctor', 'hospital', 'sick', 'medical', 'clinic', 'appointment', 'therapy'], emoji: '🩺' },
  { keywords: ['pray', 'prayer', 'church', 'temple', 'mosque', 'worship', 'devotion'], emoji: '🙏' },
  { keywords: ['home', 'house', 'family time', 'domestic'], emoji: '🏠' },
  { keywords: ['family', 'parent', 'kids', 'children', 'baby'], emoji: '👨‍👩‍👧' },
  { keywords: ['party', 'celebrat', 'birthday', 'event', 'social', 'gathering'], emoji: '🎉' },
  { keywords: ['shower', 'bath', 'hygiene', 'groom', 'self care', 'spa'], emoji: '🚿' },
  { keywords: ['morning', 'sunrise', 'dawn', 'early', 'wake', 'start'], emoji: '🌅' },
  { keywords: ['write', 'writing', 'journal', 'note', 'draft', 'blog', 'essay'], emoji: '✍️' },
  { keywords: ['class', 'school', 'universit', 'college', 'lecture', 'course'], emoji: '🎓' },
  { keywords: ['data', 'report', 'chart', 'stat', 'analysis', 'research'], emoji: '📊' },
  { keywords: ['present', 'pitch', 'demo', 'present'], emoji: '📈' },
  { keywords: ['wait', 'waiting', 'pending', 'hold', 'queue'], emoji: '⏳' },
  { keywords: ['secret', 'private', 'shh', 'hush', 'incognito', 'stealth'], emoji: '🤫' },
  { keywords: ['online', 'available', 'open', 'active', 'free'], emoji: '🟢' },
  { keywords: ['offline', 'away', 'gone', 'closed'], emoji: '🔴' },
];

/** Find the best emoji for a given name string */
function autoDetectEmoji(text) {
  if (!text.trim()) return null;
  const lower = text.toLowerCase();
  for (const { keywords, emoji } of KEYWORD_MAP) {
    if (keywords.some((k) => lower.includes(k))) return emoji;
  }
  return null;
}

// ── Time helper functions ───────────────────────────────────────────────────
function parseTime24(timeStr = '09:00') {
  if (!timeStr) return { h12: 9, minute: 0, period: 'AM' };
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return { h12, minute: m, period };
}

function formatTime12To24(h12, minute, period) {
  let h24 = h12 % 12;
  if (period === 'PM') h24 += 12;
  const hStr = String(h24).padStart(2, '0');
  const mStr = String(minute).padStart(2, '0');
  return `${hStr}:${mStr}`;
}

function formatDisplay12(timeStr = '09:00') {
  const { h12, minute, period } = parseTime24(timeStr);
  const mStr = String(minute).padStart(2, '0');
  return `${String(h12).padStart(2, '0')}:${mStr} ${period}`;
}

// ── Custom Scroll-Wheel 12-Hour Time Picker Sheet Modal ────────────────────
function ScrollWheelTimePickerSheet({ title, initialTime, onConfirm, onClose }) {
  const parsed = parseTime24(initialTime);
  const [h12, setH12] = useState(parsed.h12);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  const hoursList = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
  const minutesList = Array.from({ length: 60 }, (_, i) => i); // 0..59

  const handleApply = () => {
    const final24 = formatTime12To24(h12, minute, period);
    onConfirm(final24);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-bg-void/85 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[360px] rounded-3xl p-5 flex flex-col space-y-4 shadow-2xl border border-white/20"
        style={{ background: 'linear-gradient(180deg, #1E2240 0%, #0c0d14 100%)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="font-display font-bold text-base text-white tracking-wide">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Selected Time Display Preview */}
        <div className="flex items-center justify-center gap-3 py-3 bg-white/10 rounded-2xl border border-white/15 shadow-inner">
          <span className="font-mono text-3xl font-extrabold text-white tracking-wider">
            {String(h12).padStart(2, '0')}:{String(minute).padStart(2, '0')}
          </span>
          <span className="font-display text-base font-extrabold px-3 py-1 rounded-xl bg-primary text-on-primary shadow">
            {period}
          </span>
        </div>

        {/* ── Scrollable Wheel Column Selectors ── */}
        <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-2xl border border-white/10 relative">
          {/* Highlight selection bar */}
          <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-10 bg-primary/25 border-y border-primary/50 rounded-xl pointer-events-none" />

          {/* Hour Column (1 - 12) */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-200 uppercase mb-1 z-10">HOUR</span>
            <div className="h-44 w-full overflow-y-auto snap-y snap-mandatory py-16 flex flex-col items-center gap-1 no-scrollbar">
              {hoursList.map((h) => {
                const isSelected = h === h12;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setH12(h)}
                    className={`snap-center w-full py-1.5 rounded-xl font-mono text-base font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'text-white text-lg scale-110 font-extrabold bg-primary/30 border border-primary/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {String(h).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minute Column (00 - 59) */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-200 uppercase mb-1 z-10">MINUTE</span>
            <div className="h-44 w-full overflow-y-auto snap-y snap-mandatory py-16 flex flex-col items-center gap-1 no-scrollbar">
              {minutesList.map((m) => {
                const isSelected = m === minute;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinute(m)}
                    className={`snap-center w-full py-1.5 rounded-xl font-mono text-base font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'text-white text-lg scale-110 font-extrabold bg-primary/30 border border-primary/50'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {String(m).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AM / PM Column */}
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-[11px] font-bold text-slate-200 uppercase mb-1">PERIOD</span>
            <button
              type="button"
              onClick={() => setPeriod('AM')}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                period === 'AM' ? 'bg-primary text-on-primary font-extrabold shadow-lg scale-105' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setPeriod('PM')}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                period === 'PM' ? 'bg-primary text-on-primary shadow-lg scale-105 font-extrabold' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        {/* OK / Confirm Button */}
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3.5 rounded-2xl font-display font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>OK (Set Time)</span>
        </button>
      </div>
    </div>
  );
}

export default function CreateStatusModal({ onClose, onSave, initialStatus = null }) {
  const { activate, refreshActiveStatus, activeStatus: currentActive } = useStatusContext();

  const [name, setName] = useState(initialStatus?.name || '');
  const [emoji, setEmoji] = useState(initialStatus?.emoji || '🎯');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // When true, emoji auto-updates as user types; set to false once user manually picks
  const [autoEmoji, setAutoEmoji] = useState(!initialStatus?.emoji);

  // Auto-suggest emoji while user types (only when not manually overridden)
  useEffect(() => {
    if (!autoEmoji) return;
    const detected = autoDetectEmoji(name);
    if (detected) setEmoji(detected);
  }, [name, autoEmoji]);

  // Time window
  const [startTime, setStartTime] = useState(initialStatus?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialStatus?.endTime || '11:30');
  const [activePickerTarget, setActivePickerTarget] = useState(null); // 'start' | 'end' | null

  const applyPreset = (type) => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const fmt24 = (hours, mins) => `${String(hours % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

    if (type === 'work') {
      setStartTime('09:00');
      setEndTime('17:00');
    } else if (type === 'night') {
      setStartTime('22:00');
      setEndTime('07:00');
    } else if (type === 'lunch') {
      setStartTime('13:00');
      setEndTime('14:00');
    } else if (type === '1h') {
      setStartTime(fmt24(h, m));
      setEndTime(fmt24(h + 1, m));
    } else if (type === '2h') {
      setStartTime(fmt24(h, m));
      setEndTime(fmt24(h + 2, m));
    }
  };

  // Group messages
  const existingMessages = initialStatus ? messageStore.getForStatus(initialStatus.id) : DEFAULT_MESSAGES;
  const [messages, setMessages] = useState(existingMessages);
  const [editingGroup, setEditingGroup] = useState(null);

  // Triggers
  const [locationTrigger, setLocationTrigger] = useState(false);
  const [manualOnly, setManualOnly] = useState(true);

  const handleMessageChange = (group, text) => {
    setMessages((prev) => ({ ...prev, [group]: text }));
  };

  // Live check: is the current wall-clock time inside this status's window?
  const toMinsLocal = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  const isActiveNow =
    toMinsLocal(endTime) > toMinsLocal(startTime) &&
    nowMins >= toMinsLocal(startTime) &&
    nowMins < toMinsLocal(endTime);
  const remainingMinsNow = isActiveNow ? toMinsLocal(endTime) - nowMins : 0;

  const handleSave = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!name.trim()) return;

    // Helper: "HH:MM" → minutes since midnight
    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const rawMins = toMins(endTime) - toMins(startTime);
    const durationMinutes = rawMins > 0 ? rawMins : 60;

    const targetStatusId = initialStatus?.id || generateId('status');

    statusStore.save({
      id: targetStatusId,
      name: name.trim(),
      emoji,
      defaultDurationMinutes: durationMinutes,
      startTime,
      endTime,
      locationTrigger,
      manualOnly,
    });

    // Save group messages for this specific status
    messageStore.saveForStatus(targetStatusId, messages);

    // Also update global group messages so they display immediately on the Messages page
    messageStore.saveGlobalAll(messages);

    // ── Auto-activate / Overwrite current active status if window or time collides ──────
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = toMins(startTime);
    const endMins = toMins(endTime);

    let isCurrentWindowActive = false;
    let remainingMins = 0;

    if (startMins !== endMins) {
      if (endMins > startMins) {
        isCurrentWindowActive = currentMins >= startMins && currentMins < endMins;
        remainingMins = endMins - currentMins;
      } else {
        isCurrentWindowActive = currentMins >= startMins || currentMins < endMins;
        remainingMins = currentMins >= startMins ? (1440 - currentMins + endMins) : (endMins - currentMins);
      }
    }

    // Check if new status window collides with currently running active status
    let collidesWithActive = false;
    if (currentActive) {
      const activeStart = new Date(currentActive.activatedAt);
      const activeEnd = new Date(currentActive.expiresAt);
      const activeStartMins = activeStart.getHours() * 60 + activeStart.getMinutes();
      const activeEndMins = activeEnd.getHours() * 60 + activeEnd.getMinutes();

      collidesWithActive = timeWindowsOverlap(startMins, endMins, activeStartMins, activeEndMins);
    }

    // OVERWRITE: If current time is within new status window OR collides with current active status OR editing current active status
    if (isCurrentWindowActive || collidesWithActive || currentActive?.statusId === targetStatusId) {
      const durationToUse = remainingMins > 0 ? remainingMins : durationMinutes;
      // Overwrite previous active status immediately via shared context activate!
      activate(targetStatusId, durationToUse, 'schedule');
    } else {
      refreshActiveStatus();
    }

    onSave();
    onClose();
  };


  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-bg-base/95 backdrop-blur-xl flex flex-col">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-2.5 sm:px-4 h-14 sm:h-16 bg-bg-base/80 backdrop-blur-md border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-on-surface flex-shrink-0"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">arrow_back</span>
        </button>

        <h2 className="font-display font-semibold text-sm sm:text-base text-on-surface truncate px-2">
          {initialStatus ? 'Edit Status' : 'Create New Status'}
        </h2>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Save
        </button>
      </header>

      {/* ── Content Form ── */}
      <form onSubmit={handleSave} className="flex-1 max-w-md w-full mx-auto p-3 sm:p-4 space-y-4 sm:space-y-5 pb-24">
        {/* ── Status Name Card ── */}
        {/* Outer wrapper elevates z-index when picker is open so it floats above sibling cards */}
        <div className="relative" style={{ zIndex: showEmojiPicker ? 50 : 'auto' }}>
          <div className="glass-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            {/* Emoji Picker trigger button */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl bg-bg-surface border border-white/10 hover:border-primary/40 transition-all cursor-pointer"
              >
                {emoji}
              </button>
              {/* Auto-suggest badge */}
              {autoEmoji && name.trim() && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[9px] font-bold px-1 py-0.5 rounded-full leading-none"
                  style={{ background: 'rgba(124,58,237,0.8)', color: '#fff', border: '1px solid rgba(210,187,255,0.3)' }}
                  title="Emoji auto-suggested from your status name"
                >
                  auto
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-bold text-slate-100 mb-1">Status Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Deep Work, Sleeping, At Gym…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-bg-surface border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-primary"
              />
              {autoEmoji && name.trim() && (
                <p className="text-[11px] font-semibold mt-1 text-primary">
                  ✨ Emoji auto-matched · tap emoji to override
                </p>
              )}
            </div>
          </div>

          {/* Emoji Picker Dropdown — outside glass-card to escape its stacking context */}
          {showEmojiPicker && (
            <div className="absolute top-[4.5rem] left-0 z-50 glass-card p-3 grid grid-cols-8 gap-1.5 bg-bg-elevated border border-white/20 shadow-2xl w-full">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setEmoji(item);
                    setAutoEmoji(false); // lock — user chose manually
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2 text-xl rounded-lg text-center transition-colors cursor-pointer ${
                    emoji === item ? 'bg-primary/30 border border-primary text-white' : 'hover:bg-white/10 text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
              {/* Reset to auto button */}
              {!autoEmoji && (
                <button
                  type="button"
                  onClick={() => { setAutoEmoji(true); setShowEmojiPicker(false); }}
                  className="col-span-2 mt-1 px-2 py-1 rounded-lg text-[10px] font-bold text-primary hover:bg-primary/20 transition-colors border border-primary/40 cursor-pointer"
                >
                  ✨ Auto
                </button>
              )}
            </div>
          )}
        </div>


        {/* ── Time Window Card ── */}
        <div className="glass-card p-4 space-y-3 border border-white/15">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-display font-extrabold text-sm tracking-wide">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span>Time Window</span>
            </div>

            <span className="text-[10px] font-mono font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">
              AUTO-EXPIRE
            </span>
          </div>

          {/* Quick Presets row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-extrabold text-slate-200 uppercase flex-shrink-0">PRESETS:</span>
            <button
              type="button"
              onClick={() => applyPreset('1h')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 border border-white/20 hover:bg-primary/30 text-white flex-shrink-0 cursor-pointer transition-all active:scale-95"
            >
              ⚡ +1 Hr
            </button>
            <button
              type="button"
              onClick={() => applyPreset('2h')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 border border-white/20 hover:bg-primary/30 text-white flex-shrink-0 cursor-pointer transition-all active:scale-95"
            >
              ⏱️ +2 Hrs
            </button>
            <button
              type="button"
              onClick={() => applyPreset('work')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 border border-white/20 hover:bg-primary/30 text-white flex-shrink-0 cursor-pointer transition-all active:scale-95"
            >
              ☀️ Work (9-5)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('lunch')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 border border-white/20 hover:bg-primary/30 text-white flex-shrink-0 cursor-pointer transition-all active:scale-95"
            >
              🍽️ Lunch (1-2)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('night')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 border border-white/20 hover:bg-primary/30 text-white flex-shrink-0 cursor-pointer transition-all active:scale-95"
            >
              🌙 Night (10-7)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Start Time Box */}
            <div
              onClick={() => setActivePickerTarget('start')}
              className="bg-bg-surface border border-white/20 hover:border-primary/60 rounded-2xl p-3 flex flex-col gap-1 cursor-pointer transition-all active:scale-95 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wider text-primary uppercase">START TIME</span>
                <span className="material-symbols-outlined text-base text-primary group-hover:scale-110 transition-transform">schedule</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-1">
                <span className="font-mono text-base sm:text-lg font-extrabold text-white">
                  {formatDisplay12(startTime)}
                </span>
              </div>
            </div>

            {/* End Time Box */}
            <div
              onClick={() => setActivePickerTarget('end')}
              className="bg-bg-surface border border-white/20 hover:border-primary/60 rounded-2xl p-3 flex flex-col gap-1 cursor-pointer transition-all active:scale-95 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wider text-primary uppercase">END TIME</span>
                <span className="material-symbols-outlined text-base text-primary group-hover:scale-110 transition-transform">schedule</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-1">
                <span className="font-mono text-base sm:text-lg font-extrabold text-white">
                  {formatDisplay12(endTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Live indicator — shown when current time is inside the window */}
          {isActiveNow ? (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold"
              style={{
                background: 'rgba(34,197,94,0.18)',
                border: '1px solid rgba(34,197,94,0.4)',
                color: '#86efac',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              Active right now · will auto-activate on save ({remainingMinsNow}m remaining)
            </div>
          ) : (
            <p className="text-[11px] font-semibold text-slate-300">
              ⏰ Will auto-activate when the clock reaches this window
            </p>
          )}
        </div>

        {/* ── Contact Groups & Replies ── */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-white tracking-wide">Contact Groups & Replies</h3>

          {/* FAMILY */}
          <div className="glass-card p-4 border border-group-family/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold tracking-wider uppercase text-group-family">FAMILY</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Family' ? null : 'Family')}
                className="text-slate-300 hover:text-group-family transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Family' ? (
              <textarea
                value={messages.Family || ''}
                onChange={(e) => handleMessageChange('Family', e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-medium bg-bg-surface border border-group-family/60 rounded-xl text-white focus:outline-none"
              />
            ) : (
              <p className="text-xs font-semibold text-slate-200 italic">"{messages.Family || 'No message set'}"</p>
            )}
          </div>

          {/* FRIENDS & RELATIVES */}
          <div className="glass-card p-4 border border-group-friends/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold tracking-wider uppercase text-group-friends">FRIENDS & RELATIVES</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Friends & Relatives' ? null : 'Friends & Relatives')}
                className="text-slate-300 hover:text-group-friends transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Friends & Relatives' ? (
              <textarea
                value={messages['Friends & Relatives'] || messages.Friends || ''}
                onChange={(e) => handleMessageChange('Friends & Relatives', e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-medium bg-bg-surface border border-group-friends/60 rounded-xl text-white focus:outline-none"
              />
            ) : (
              <p className="text-xs font-semibold text-slate-200 italic">"{messages['Friends & Relatives'] || messages.Friends || 'No message set'}"</p>
            )}
          </div>

          {/* WORK */}
          <div className="glass-card p-4 border border-group-work/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold tracking-wider uppercase text-group-work">WORK</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Work' ? null : 'Work')}
                className="text-slate-300 hover:text-group-work transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Work' ? (
              <textarea
                value={messages.Work || ''}
                onChange={(e) => handleMessageChange('Work', e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-medium bg-bg-surface border border-group-work/60 rounded-xl text-white focus:outline-none"
              />
            ) : (
              <p className="text-xs font-semibold text-slate-200 italic">"{messages.Work || 'No message set'}"</p>
            )}
          </div>

          {/* UNKNOWN */}
          <div className="glass-card p-4 border border-group-unknown/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold tracking-wider uppercase text-group-unknown">UNKNOWN</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Unknown' ? null : 'Unknown')}
                className="text-slate-300 hover:text-group-unknown transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Unknown' ? (
              <textarea
                value={messages.Unknown || ''}
                onChange={(e) => handleMessageChange('Unknown', e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs font-medium bg-bg-surface border border-group-unknown/60 rounded-xl text-white focus:outline-none"
              />
            ) : (
              <p className="text-xs font-semibold text-slate-200 italic">"{messages.Unknown || 'No message set'}"</p>
            )}
          </div>
        </div>

        {/* ── Triggers Card ── */}
        <div className="glass-card p-4 space-y-4 border border-white/15">
          {/* Location Trigger */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white">Location Trigger</h4>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">Activate automatically when at "Office"</p>
            </div>
            <button
              type="button"
              onClick={() => setLocationTrigger(!locationTrigger)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                locationTrigger ? 'bg-primary' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  locationTrigger ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/10" />

          {/* Manual Activation Only */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white">Manual Activation Only</h4>
              <p className="text-[11px] font-semibold text-slate-300 mt-0.5">Disable all smart triggers for this status</p>
            </div>
            <button
              type="button"
              onClick={() => setManualOnly(!manualOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                manualOnly ? 'bg-primary' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  manualOnly ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </form>

      {/* ── Time Picker Overlay Sheet ── */}
      {activePickerTarget === 'start' && (
        <ScrollWheelTimePickerSheet
          title="Set Start Time"
          initialTime={startTime}
          onConfirm={(val) => setStartTime(val)}
          onClose={() => setActivePickerTarget(null)}
        />
      )}

      {activePickerTarget === 'end' && (
        <ScrollWheelTimePickerSheet
          title="Set End Time"
          initialTime={endTime}
          onConfirm={(val) => setEndTime(val)}
          onClose={() => setActivePickerTarget(null)}
        />
      )}
    </div>
  );
}
