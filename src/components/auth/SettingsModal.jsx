import React from 'react';
import { X, Volume2, VolumeX, Bell, Play, Pause, FastForward, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useChat } from '../../context/ChatContext';
import { useToast } from '../../context/ToastContext';

export const SettingsModal = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, logout } = useAuth();
  const { autoAdvance, toggleAutoAdvance, advanceActiveStep, activeBooking } = useBooking();
  const { soundMuted, toggleSound } = useChat();
  const { showToast } = useToast();

  if (!isSettingsModalOpen) return null;

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications are not supported in this browser.', 'warning');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      showToast('Browser notifications enabled for tracking alerts!', 'success');
    } else {
      showToast('Notification permission denied or dismissed.', 'info');
    }
  };

  return (
    <div className="sheet-backdrop" onClick={() => setSettingsModalOpen(false)}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="badge badge-mint">PREFERENCES & CONTROLS</span>
              <h2 style={{ fontSize: '1.35rem', color: '#0F2A44', marginTop: 4 }}>App Settings</h2>
            </div>
            <button onClick={() => setSettingsModalOpen(false)} className="icon-btn-header">
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Audio Toggle */}
            <div
              className="card-white"
              style={{
                padding: '14px 16px',
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8F6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E7B5A' }}>
                  {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2A44' }}>Audio Feedback</div>
                  <div style={{ fontSize: '0.72rem', color: '#7E92A2' }}>Web Audio chimes for chat & alerts</div>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`btn btn-xs ${soundMuted ? 'btn-outline' : 'btn-primary'}`}
              >
                {soundMuted ? 'Muted' : 'Enabled'}
              </button>
            </div>

            {/* Notification Toggle */}
            <div
              className="card-white"
              style={{
                padding: '14px 16px',
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F2A44' }}>
                  <Bell size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F2A44' }}>Device Notifications</div>
                  <div style={{ fontSize: '0.72rem', color: '#7E92A2' }}>Arrival alert & status updates</div>
                </div>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="btn btn-xs btn-outline"
              >
                Enable
              </button>
            </div>

            {/* Simulated Progression Engine Controls */}
            <div
              className="card-white"
              style={{
                padding: '14px 16px',
                borderRadius: 18,
                border: '1.5px dashed rgba(30, 123, 90, 0.4)',
                background: 'rgba(232, 246, 239, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={18} color="#1E7B5A" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1E7B5A' }}>
                    Status Progression Simulator
                  </span>
                </div>
                <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>Test Engine</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4A5D6E', marginBottom: 12, lineHeight: 1.35 }}>
                Simulates real-world technician dispatch through all 9 statuses. Statuses auto-advance every 25 seconds and sync across tabs.
              </p>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleAutoAdvance(!autoAdvance)}
                  className={`btn btn-sm ${autoAdvance ? 'btn-cta-orange' : 'btn-primary'}`}
                  style={{ flex: 1 }}
                >
                  {autoAdvance ? <><Pause size={14} /> Pause Auto (25s)</> : <><Play size={14} /> Start Auto (25s)</>}
                </button>
                <button
                  onClick={() => {
                    advanceActiveStep();
                    showToast('Advanced active booking by 1 step', 'info');
                  }}
                  className="btn btn-sm btn-outline"
                  title="Manually advance 1 step immediately"
                >
                  <FastForward size={14} /> Next Step
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="btn btn-outline tap-effect"
              style={{
                color: '#DC2626',
                borderColor: 'rgba(220, 38, 38, 0.25)',
                marginTop: 6
              }}
            >
              <LogOut size={16} /> Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

