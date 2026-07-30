import React, { useState, useEffect } from 'react';
import statusStore from '../store/statusStore';
import messageStore, { DEFAULT_MESSAGES } from '../store/messageStore';
import statusEngine from '../engine/statusEngine';

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

export default function CreateStatusModal({ onClose, onSave, initialStatus = null }) {
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
    e.preventDefault();
    if (!name.trim()) return;

    // Helper: "HH:MM" → minutes since midnight
    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const rawMins = toMins(endTime) - toMins(startTime);
    const durationMinutes = rawMins > 0 ? rawMins : 60;

    const targetStatusId = initialStatus?.id || `status-${crypto.randomUUID()}`;

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

    // ── Auto-activate if current time is within the status's time window ──────
    // e.g. user sets 10:00–12:00 and it's currently 11:15 → activate with 45 min remaining
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const startMins = toMins(startTime);
    const endMins = toMins(endTime);

    if (endMins > startMins && currentMins >= startMins && currentMins < endMins) {
      // Within window — activate with the remaining duration until end time
      const remainingMins = endMins - currentMins;
      statusEngine.activate(targetStatusId, remainingMins, 'schedule');
    } else {
      // Outside window — only sync metadata if this status is already active
      statusEngine.updateActiveMetadata(targetStatusId, name.trim(), emoji);
    }

    onSave();  // triggers refreshActiveStatus() in App → Dashboard updates instantly
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
              <label className="block text-xs font-medium text-outline-variant mb-1">Status Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Deep Work, Sleeping, At Gym…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm bg-bg-surface border border-white/10 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary/50"
              />
              {autoEmoji && name.trim() && (
                <p className="text-[10px] mt-1" style={{ color: 'rgba(210,187,255,0.5)' }}>
                  ✨ Emoji auto-matched · tap emoji to override
                </p>
              )}
            </div>
          </div>

          {/* Emoji Picker Dropdown — outside glass-card to escape its stacking context */}
          {showEmojiPicker && (
            <div className="absolute top-[4.5rem] left-0 z-50 glass-card p-3 grid grid-cols-8 gap-1.5 bg-bg-elevated border border-white/15 shadow-xl w-full">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setEmoji(item);
                    setAutoEmoji(false); // lock — user chose manually
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2 text-xl rounded-lg text-center transition-colors ${
                    emoji === item ? 'bg-primary/20 border border-primary/50' : 'hover:bg-white/5'
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
                  className="col-span-2 mt-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/10 transition-colors border border-primary/20"
                >
                  ✨ Auto
                </button>
              )}
            </div>
          )}
        </div>


        {/* ── Time Window Card ── */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span>Time Window</span>
            </div>

            <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-on-surface-variant/80">
              AUTO-EXPIRE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Start Time */}
            <div className="bg-bg-surface/80 border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-outline-variant">START</span>
              <div className="flex items-center justify-between gap-1">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent font-mono text-sm font-bold text-on-surface focus:outline-none w-full cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* End Time */}
            <div className="bg-bg-surface/80 border border-white/10 rounded-2xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-outline-variant">END</span>
              <div className="flex items-center justify-between gap-1">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent font-mono text-sm font-bold text-on-surface focus:outline-none w-full cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          {/* Live indicator — shown when current time is inside the window */}
          {isActiveNow ? (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#4ade80',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              Active right now · will auto-activate on save ({remainingMinsNow}m remaining)
            </div>
          ) : (
            <p className="text-[10px] text-outline-variant/60">
              ⏰ Will auto-activate when the clock reaches this window
            </p>
          )}
        </div>

        {/* ── Contact Groups & Replies ── */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-sm text-on-surface">Contact Groups & Replies</h3>

          {/* FAMILY */}
          <div className="glass-card p-4 border border-group-family/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-group-family">FAMILY</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Family' ? null : 'Family')}
                className="text-outline-variant hover:text-group-family transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Family' ? (
              <textarea
                value={messages.Family || ''}
                onChange={(e) => handleMessageChange('Family', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-family/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Family || 'No message set'}"</p>
            )}
          </div>

          {/* FRIENDS & RELATIVES */}
          <div className="glass-card p-4 border border-group-friends/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-group-friends">FRIENDS & RELATIVES</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Friends & Relatives' ? null : 'Friends & Relatives')}
                className="text-outline-variant hover:text-group-friends transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Friends & Relatives' ? (
              <textarea
                value={messages['Friends & Relatives'] || messages.Friends || ''}
                onChange={(e) => handleMessageChange('Friends & Relatives', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-friends/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages['Friends & Relatives'] || messages.Friends || 'No message set'}"</p>
            )}
          </div>

          {/* WORK */}
          <div className="glass-card p-4 border border-group-work/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-group-work">WORK</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Work' ? null : 'Work')}
                className="text-outline-variant hover:text-group-work transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Work' ? (
              <textarea
                value={messages.Work || ''}
                onChange={(e) => handleMessageChange('Work', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-work/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Work || 'No message set'}"</p>
            )}
          </div>

          {/* UNKNOWN */}
          <div className="glass-card p-4 border border-group-unknown/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-group-unknown">UNKNOWN</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Unknown' ? null : 'Unknown')}
                className="text-outline-variant hover:text-group-unknown transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Unknown' ? (
              <textarea
                value={messages.Unknown || ''}
                onChange={(e) => handleMessageChange('Unknown', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-unknown/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Unknown || 'No message set'}"</p>
            )}
          </div>
        </div>

        {/* ── Triggers Card ── */}
        <div className="glass-card p-4 space-y-4">
          {/* Location Trigger */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-semibold text-on-surface">Location Trigger</h4>
              <p className="text-[11px] text-outline-variant mt-0.5">Activate automatically when at "Office"</p>
            </div>
            <button
              type="button"
              onClick={() => setLocationTrigger(!locationTrigger)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                locationTrigger ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  locationTrigger ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/5" />

          {/* Manual Activation Only */}
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-semibold text-on-surface">Manual Activation Only</h4>
              <p className="text-[11px] text-outline-variant mt-0.5">Disable all smart triggers for this status</p>
            </div>
            <button
              type="button"
              onClick={() => setManualOnly(!manualOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                manualOnly ? 'bg-primary' : 'bg-white/10'
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
    </div>
  );
}
