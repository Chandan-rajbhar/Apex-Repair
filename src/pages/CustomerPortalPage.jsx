import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  Camera,
  Edit3,
  Truck,
  Sparkles,
  Calendar,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Wrench,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export const CustomerPortalPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuthModalOpen, setProfileModalOpen, setSettingsModalOpen } = useAuth();
  const { activeBooking, bookings } = useBooking();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 10px' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#0F2A44', marginBottom: 8 }}>
          Client Portal Sign In
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 18 }}>
          Access your appliance warranty documents, active repairs, and service records.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="btn btn-primary tap-effect shine-sweep"
        >
          Sign In to Portal
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* --------------------------------------------------------------------------
          Top Header Bar (Back button, Pill, Settings Gear - Matches Screenshot 1)
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 2px' }}>
        <button
          onClick={() => navigate('/')}
          className="icon-btn-header"
          aria-label="Back to Home"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="badge badge-mint" style={{ letterSpacing: '0.08em', padding: '5px 14px', fontSize: '0.7rem' }}>
          CLIENT PORTAL
        </span>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="icon-btn-header"
          aria-label="Portal Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* --------------------------------------------------------------------------
          User Avatar & Profile Header (Matches Screenshot 1)
          -------------------------------------------------------------------------- */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        {/* Large Initials Circle with Camera Badge */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--grad-header)',
            color: '#FFFFFF',
            fontSize: '1.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #FFFFFF',
            boxShadow: 'var(--glow-navy)'
          }}>
            {user.initials || 'SY'}
          </div>

          {/* Camera mini badge */}
          <div
            onClick={() => setProfileModalOpen(true)}
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--navy-900)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF',
              cursor: 'pointer'
            }}
            title="Edit Photo"
          >
            <Camera size={14} />
          </div>
        </div>

        {/* User Name */}
        <h1 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#0F2A44',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          marginBottom: 10
        }}>
          {user.name}
        </h1>

        {/* Edit Profile Button */}
        <button
          onClick={() => setProfileModalOpen(true)}
          className="btn btn-primary tap-effect shine-sweep"
          style={{
            padding: '8px 20px',
            fontSize: '0.82rem',
            borderRadius: 9999,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Edit3 size={15} /> Edit Profile
        </button>
      </div>

      {/* --------------------------------------------------------------------------
          Profile Information Card (Matches Screenshot 1)
          -------------------------------------------------------------------------- */}
      <div className="card-white" style={{ borderRadius: 22, padding: '16px 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Phone</span>
            <strong style={{ fontSize: '0.84rem', color: user.phone ? '#0F2A44' : '#94A3B8', fontStyle: user.phone ? 'normal' : 'italic' }}>
              {user.phone || 'Not provided'}
            </strong>
          </div>

          <div style={{ height: 1, background: 'rgba(15, 42, 68, 0.06)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Email</span>
            <strong style={{ fontSize: '0.82rem', color: '#0F2A44' }}>
              {user.email}
            </strong>
          </div>

          <div style={{ height: 1, background: 'rgba(15, 42, 68, 0.06)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Client Since</span>
            <strong style={{ fontSize: '0.84rem', color: '#0F2A44' }}>
              {user.clientSince || '2026'}
            </strong>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Active Order Card (Matches Screenshot 1 Order #BO-98246 card)
          -------------------------------------------------------------------------- */}
      {activeBooking && (
        <div
          onClick={() => navigate('/track')}
          className="tap-effect"
          style={{
            borderRadius: 22,
            background: 'var(--grad-warm)',
            border: '1.5px solid rgba(232, 84, 30, 0.25)',
            padding: '16px 16px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: 'var(--orange-50)',
                color: 'var(--orange-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(232, 84, 30, 0.2)'
              }}>
                <Truck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Order #{activeBooking.id}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--orange-700)', fontWeight: 700 }}>
                  ⚡ {activeBooking.currentStep === 4 ? 'En Route (Live GPS)' : 'Pending Verification'}
                </div>
              </div>
            </div>

            <span
              className="btn btn-xs glow-pulse-primary"
              style={{
                background: 'var(--grad-cta)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF' }} />
              Track Live &gt;
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: 4 }}>
            {activeBooking.brand} {activeBooking.applianceName} &bull; Tech: <strong>{activeBooking.technician?.name || 'Marcus V.'}</strong>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          4 Quick-Action Tiles (Matches Screenshot 1)
          -------------------------------------------------------------------------- */}
      <div className="quick-tiles-grid">
        <div className="quick-tile tap-effect" onClick={() => navigate('/services')}>
          <div className="tile-icon-box">
            <Sparkles size={18} />
          </div>
          <div className="tile-label">My Vault</div>
          <div className="tile-sub">Appliances</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/book')}>
          <div className="tile-icon-box">
            <Calendar size={18} />
          </div>
          <div className="tile-label">Bookings</div>
          <div className="tile-sub">{bookings.length} Orders</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/track')}>
          <div className="tile-icon-box">
            <Truck size={18} />
          </div>
          <div className="tile-label">Track</div>
          <div className="tile-sub">In Transit</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => setSettingsModalOpen(true)}>
          <div className="tile-icon-box">
            <Settings size={18} />
          </div>
          <div className="tile-label">Settings</div>
          <div className="tile-sub">Security</div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Registered Appliances & Warranties (Matches My Prescriptions section)
          -------------------------------------------------------------------------- */}
      <div className="card-white" style={{ borderRadius: 24, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: '1.05rem', color: '#0F2A44' }}>
            Appliances Under Care
          </h3>
          <span className="badge badge-mint">3 Registered</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            padding: '10px 12px',
            borderRadius: 14,
            background: 'var(--navy-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wrench size={16} color="var(--orange-600)" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                  Samsung French-Door Refrigerator
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Model: RF28R7351SR &bull; S/N: 9482103
                </div>
              </div>
            </div>
            <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>90-Day Active</span>
          </div>

          <div style={{
            padding: '10px 12px',
            borderRadius: 14,
            background: 'var(--navy-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wrench size={16} color="var(--orange-600)" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                  LG Smart Front-Load Washer
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Model: WM4000HBA &bull; S/N: 7219044
                </div>
              </div>
            </div>
            <span className="badge badge-navy" style={{ fontSize: '0.62rem' }}>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

