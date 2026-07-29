import React, { useState } from 'react';
import settingsStore from '../store/settingsStore';
import contactsStore from '../store/contactsStore';

export default function Settings({ onLogout }) {
  const [settings, setSettings] = useState(() => settingsStore.get());
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'notifications' | 'privacy' | 'groupDetail' | 'signOut'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: settings.profile.name,
    phone: settings.profile.phone,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key) => {
    const updated = settingsStore.toggleFlag(key);
    setSettings(updated);
    showToast(`Setting updated`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;
    const updated = settingsStore.updateProfile(profileForm);
    setSettings(updated);
    setEditProfileOpen(false);
    showToast('Profile updated successfully');
  };

  const handleSignOut = () => {
    setActiveModal(null);
    if (onLogout) {
      onLogout();
    } else {
      showToast('Signed out');
    }
  };

  const profile = settings.profile;
  const toggles = settings.toggles;

  // Compute live group member counts from saved contacts
  // Normalize 'Friends' → 'Friends & Relatives' so both variants count as one group
  const allContacts = contactsStore.getAll();
  const normalizeGroup = (g) => {
    const t = (g || 'Unknown').trim();
    const lower = t.toLowerCase();
    if (lower === 'friends' || lower === 'relatives' || lower === 'friends & relatives' || lower === 'friends and relatives') {
      return 'Friends & Relatives';
    }
    return t;
  };
  const countByGroup = allContacts.reduce((acc, c) => {
    const key = normalizeGroup(c.group);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Merge live counts into the groups config (name matching is case-insensitive)
  const groups = settings.groups.map((grp) => {
    const liveCount = Object.entries(countByGroup).find(
      ([key]) => key.toLowerCase() === grp.name.toLowerCase()
    );
    return { ...grp, count: liveCount ? liveCount[1] : 0 };
  });

  return (
    <>
      <div className="space-y-5">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-primary">
              Settings
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Manage profile, contact groups, and app preferences
            </p>
          </div>
          <span className="material-symbols-outlined text-outline-variant text-xl">
            settings
          </span>
        </div>

        {/* ── Profile Card ── */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* Avatar image */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 bg-bg-surface flex-shrink-0 flex items-center justify-center text-xl">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                '👤'
              )}
            </div>

            <div>
              <h2 className="font-display font-semibold text-base text-on-surface">
                {profile.name}
              </h2>
              <p className="text-xs text-outline-variant font-mono mt-0.5">
                {profile.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setProfileForm({ name: profile.name, phone: profile.phone });
              setEditProfileOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 border border-white/10 bg-white/5 text-primary hover:bg-white/10"
          >
            Edit
          </button>
        </div>

        {/* ── Contact Groups List Card ── */}
        <div className="glass-card overflow-hidden divide-y divide-white/5">
          {groups.map((grp) => (
            <div
              key={grp.id}
              onClick={() => {
                setSelectedGroup(grp);
                setActiveModal('groupDetail');
              }}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Rounded Color Bar Accent */}
                <div
                  className="w-1.5 h-6 rounded-full flex-shrink-0"
                  style={{ background: grp.color }}
                />
                <div>
                  <h3 className="font-display font-semibold text-sm text-on-surface">
                    {grp.name}
                  </h3>
                  <p className="text-xs text-outline-variant">
                    {grp.count} {grp.label || 'members'}
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-base text-outline-variant/60">
                chevron_right
              </span>
            </div>
          ))}
        </div>

        {/* ── Automation & Mode Toggles Card ── */}
        <div className="glass-card p-4 space-y-4">
          {/* Enable Automation */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                Enable Automation
              </h3>
              <p className="text-xs text-outline-variant mt-0.5">
                Allow system-level response triggers
              </p>
            </div>
            <button
              onClick={() => handleToggle('enableAutomation')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                toggles.enableAutomation ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  toggles.enableAutomation ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/5" />

          {/* Smart Callback Reminders */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                Smart Callback Reminders
              </h3>
              <p className="text-xs text-outline-variant mt-0.5">
                AI-driven contextual notifications
              </p>
            </div>
            <button
              onClick={() => handleToggle('smartCallbackReminders')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                toggles.smartCallbackReminders ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  toggles.smartCallbackReminders ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/5" />

          {/* Low Battery Mode */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                Low Battery Mode
              </h3>
              <p className="text-xs text-outline-variant mt-0.5">
                Optimize background sync for longevity
              </p>
            </div>
            <button
              onClick={() => handleToggle('lowBatteryMode')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                toggles.lowBatteryMode ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  toggles.lowBatteryMode ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── App Navigation Links Card ── */}
        <div className="glass-card overflow-hidden divide-y divide-white/5">
          {/* Notification Settings */}
          <div
            onClick={() => setActiveModal('notifications')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-primary">
                notifications
              </span>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                Notification Settings
              </h3>
            </div>
            <span className="material-symbols-outlined text-base text-outline-variant/60">
              chevron_right
            </span>
          </div>

          {/* Privacy Policy */}
          <div
            onClick={() => setActiveModal('privacy')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-primary">
                lock
              </span>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                Privacy Policy
              </h3>
            </div>
            <span className="material-symbols-outlined text-base text-outline-variant/60">
              chevron_right
            </span>
          </div>

          {/* App Version */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-outline-variant">
                info
              </span>
              <h3 className="font-display font-semibold text-sm text-on-surface">
                App Version
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold text-outline-variant bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              v2.4.0-PRO
            </span>
          </div>
        </div>

        {/* ── Sign Out Button ── */}
        <button
          onClick={() => setActiveModal('signOut')}
          className="w-full py-3.5 rounded-xl font-display font-semibold text-sm border border-white/10 bg-white/5 text-on-surface hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* ── Edit Profile Modal Sheet ── */}
      {editProfileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-bg-void/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setEditProfileOpen(false)}
        >
          <div
            className="w-full max-w-[480px] rounded-3xl p-6 space-y-5 flex flex-col overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxHeight: 'calc(100vh - 100px)',
            }}
          >
            <div className="flex justify-center -mt-1 mb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-primary">
                Edit Profile
              </h2>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="p-1 rounded-lg text-outline-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-outline-variant">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-outline-variant">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono bg-bg-surface border border-white/10 text-on-surface focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="flex-1 py-3 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-xs font-semibold text-white shadow-glow-primary"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Group Details Modal Sheet ── */}
      {activeModal === 'groupDetail' && selectedGroup && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-bg-void/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-3xl p-6 space-y-4 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxHeight: 'calc(100vh - 100px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: selectedGroup.color }}
                />
                <h2 className="font-display font-bold text-lg text-on-surface">
                  {selectedGroup.name}
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${selectedGroup.color}20`, color: selectedGroup.color }}
                >
                  {selectedGroup.count} {selectedGroup.count === 1 ? 'member' : 'members'}
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-outline-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Live contacts list for this group */}
            {(() => {
              const groupContacts = allContacts.filter(
                (c) => normalizeGroup(c.group).toLowerCase() === selectedGroup.name.toLowerCase()
              );
              return groupContacts.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupContacts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${selectedGroup.color}25`, color: selectedGroup.color }}
                      >
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-on-surface truncate">{c.name}</p>
                        <p className="text-[10px] font-mono text-outline-variant truncate">{c.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-outline-variant/60 text-center py-3">
                  No contacts in this group yet
                </p>
              );
            })()}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Notification Settings Sheet ── */}
      {activeModal === 'notifications' && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-bg-void/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-3xl p-6 space-y-4 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxHeight: 'calc(100vh - 100px)',
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">notifications</span>
                Notification Settings
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-outline-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-outline-variant leading-relaxed">
              In-app toast alerts and sound triggers are enabled for missed call replies and active status countdown expiration.
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Privacy Policy Sheet ── */}
      {activeModal === 'privacy' && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-bg-void/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-3xl p-6 space-y-4 overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #1E2240 0%, #12131a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxHeight: 'calc(100vh - 100px)',
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">lock</span>
                Privacy Policy
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-outline-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-outline-variant leading-relaxed">
              NowNot processes all data locally on your device using LocalStorage. No phone logs or auto-replies are transmitted to external servers.
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Sign Out Confirmation Modal ── */}
      {activeModal === 'signOut' && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg-void/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div className="glass-card p-6 max-w-xs w-full space-y-4 text-center border border-white/15 shadow-2xl">
            <span className="material-symbols-outlined text-3xl text-outline-variant">
              logout
            </span>
            <h3 className="font-display font-bold text-base text-on-surface">
              Sign out of NowNot?
            </h3>
            <p className="text-xs text-outline-variant">
              Your saved statuses and custom reply messages will remain on this device.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-danger-500/20 border border-danger-500/40 text-danger-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Alert Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-semibold bg-primary/20 border border-primary/40 text-primary backdrop-blur-md shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
    </>
  );
}
