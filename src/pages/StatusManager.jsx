import React, { useState, useEffect } from 'react';
import statusStore from '../store/statusStore';
import { useStatusContext } from '../context/StatusContext';

export default function StatusManager({ onNavigate }) {
  const [statuses, setStatuses] = useState([]);
  const { activeStatus, activate, deactivate } = useStatusContext();
  const [selectedDurationMap, setSelectedDurationMap] = useState({});

  useEffect(() => {
    setStatuses(statusStore.getAll());
  }, []);

  const handleActivate = (status) => {
    const customDur = selectedDurationMap[status.id] || status.defaultDurationMinutes || 60;
    activate(status.id, customDur, 'manual');
  };

  const handleDeleteStatus = (id) => {
    const updated = statusStore.remove(id);
    setStatuses(updated);
  };

  const handleEdit = (status) => {
    if (onNavigate) {
      onNavigate('create-status', status);
    }
  };

  const handleOpenCreate = () => {
    if (onNavigate) {
      onNavigate('create-status', null);
    }
  };

  const setDurationForStatus = (id, mins) => {
    setSelectedDurationMap((prev) => ({ ...prev, [id]: mins }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-display text-primary tracking-tight">Status Manager</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Select or create availability statuses</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 active:scale-95"
          style={{
            background: 'var(--gradient-primary)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
          }}
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Status
        </button>
      </div>

      {/* Active Banner if running */}
      {activeStatus && (
        <div className="glass-card-active p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activeStatus.detail?.emoji || '⚡'}</span>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                Currently Active
              </span>
              <h4 className="font-display font-semibold text-sm text-primary">
                {activeStatus.detail?.name || activeStatus.statusName}
              </h4>
            </div>
          </div>
          <button
            onClick={deactivate}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#F87171',
            }}
          >
            End Now
          </button>
        </div>
      )}

      {/* Statuses Grid / List */}
      <div className="space-y-3">
        {statuses.map((status) => {
          const isActiveThis = activeStatus?.statusId === status.id;
          const currentDur = selectedDurationMap[status.id] || status.defaultDurationMinutes || 60;

          return (
            <div
              key={status.id}
              className={`glass-card p-4 transition-all duration-200 ${
                isActiveThis ? 'border-primary/50 shadow-glow-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{status.emoji}</span>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-on-surface">{status.name}</h3>
                    <p className="text-xs text-outline-variant mt-0.5">
                      Default: {status.defaultDurationMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(status)}
                    className="p-1.5 rounded-lg text-outline-variant hover:text-primary transition-colors cursor-pointer"
                    title="Edit Status & Messages"
                  >
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>

                  {!status.isSystem && (
                    <button
                      onClick={() => handleDeleteStatus(status.id)}
                      className="p-1.5 rounded-lg text-outline-variant hover:text-danger-400 transition-colors cursor-pointer"
                      title="Delete Status"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  )}

                  {isActiveThis ? (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-status-active/20 border border-status-active/40 text-status-active flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-active animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivate(status)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: 'rgba(124,58,237,0.18)',
                        border: '1px solid rgba(139,92,246,0.35)',
                        color: '#d2bbff',
                      }}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Duration pill options (available anytime, including during active sessions) */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs">
                <span className="text-[10px] text-outline-variant uppercase font-medium">
                  {isActiveThis ? 'Set Active Duration:' : 'Quick Activate:'}
                </span>
                {[30, 60, 120, 240, 480].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => activate(status.id, mins, 'manual')}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium transition-all active:scale-95 cursor-pointer bg-white/5 border border-white/10 text-outline-variant hover:text-primary hover:bg-primary/15 hover:border-primary/40"
                    title={isActiveThis ? `Reset active duration to ${mins >= 60 ? `${mins / 60}h` : `${mins}m`}` : `Activate for ${mins >= 60 ? `${mins / 60} hour(s)` : `${mins} mins`}`}
                  >
                    {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
