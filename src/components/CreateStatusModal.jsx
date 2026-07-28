import React, { useState } from 'react';
import statusStore from '../store/statusStore';
import messageStore, { DEFAULT_MESSAGES } from '../store/messageStore';

const EMOJI_OPTIONS = ['🧘', '😴', '💼', '📚', '🚗', '💪', '🚫', '🎯', '🌴', '🎧', '🎮', '✈️'];

export default function CreateStatusModal({ onClose, onSave, initialStatus = null }) {
  const [name, setName] = useState(initialStatus?.name || '');
  const [emoji, setEmoji] = useState(initialStatus?.emoji || '🧘');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculate duration from start/end time
    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const rawMins = toMins(endTime) - toMins(startTime);
    const durationMinutes = rawMins > 0 ? rawMins : 60;

    const savedStatus = statusStore.save({
      id: initialStatus?.id,
      name: name.trim(),
      emoji,
      defaultDurationMinutes: durationMinutes,
      startTime,
      endTime,
      locationTrigger,
      manualOnly,
    });

    // Save group messages for this status
    messageStore.saveForStatus(savedStatus.id || savedStatus[0]?.id, messages);

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg-base/95 backdrop-blur-xl flex flex-col">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-16 bg-bg-base/80 backdrop-blur-md border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-on-surface"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>

        <h2 className="font-display font-semibold text-base text-on-surface">
          {initialStatus ? 'Edit Status' : 'Create New Status'}
        </h2>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ background: 'var(--gradient-primary)' }}
        >
          Save
        </button>
      </header>

      {/* ── Content Form ── */}
      <form onSubmit={handleSave} className="flex-1 max-w-md w-full mx-auto p-4 space-y-5 pb-24">
        {/* ── Status Name Card ── */}
        <div className="glass-card p-4 flex items-center gap-4 relative">
          {/* Emoji Picker trigger button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-bg-surface border border-white/10 hover:border-primary/40 transition-all flex-shrink-0 cursor-pointer"
          >
            {emoji}
          </button>

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-outline-variant mb-1">Status Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Deep Work"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-bg-surface border border-white/10 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Emoji Picker Dropdown Grid */}
          {showEmojiPicker && (
            <div className="absolute top-20 left-4 z-20 glass-card p-3 grid grid-cols-6 gap-2 bg-bg-elevated border border-white/15 shadow-xl">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setEmoji(item);
                    setShowEmojiPicker(false);
                  }}
                  className={`p-2 text-xl rounded-lg text-center ${
                    emoji === item ? 'bg-primary/20 border border-primary/50' : 'hover:bg-white/5'
                  }`}
                >
                  {item}
                </button>
              ))}
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
                value={messages.Family}
                onChange={(e) => handleMessageChange('Family', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-family/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Family}"</p>
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
                value={messages.Work}
                onChange={(e) => handleMessageChange('Work', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-work/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Work}"</p>
            )}
          </div>

          {/* FRIENDS */}
          <div className="glass-card p-4 border border-group-friends/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold tracking-wider uppercase text-group-friends">FRIENDS</span>
              <button
                type="button"
                onClick={() => setEditingGroup(editingGroup === 'Friends' ? null : 'Friends')}
                className="text-outline-variant hover:text-group-friends transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
              </button>
            </div>
            {editingGroup === 'Friends' ? (
              <textarea
                value={messages.Friends}
                onChange={(e) => handleMessageChange('Friends', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-friends/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Friends}"</p>
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
                value={messages.Unknown}
                onChange={(e) => handleMessageChange('Unknown', e.target.value)}
                rows={2}
                className="w-full p-2 text-xs bg-bg-surface border border-group-unknown/40 rounded-xl text-on-surface focus:outline-none"
              />
            ) : (
              <p className="text-xs text-on-surface-variant italic">"{messages.Unknown}"</p>
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
