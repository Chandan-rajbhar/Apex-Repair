import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Wrench, Shield, CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';

export const Header = () => {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { activeBooking, bookings } = useBooking();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    activeBooking ? {
      id: 'notif_1',
      title: `Technician Status #${activeBooking.id}`,
      desc: activeBooking.currentStep === 4 ? 'Van en route • ETA 12 mins' : `Currently in step ${activeBooking.currentStep}/9`,
      time: 'Just now',
      icon: Truck,
      color: 'var(--orange-600)',
      link: '/track'
    } : null,
    {
      id: 'notif_2',
      title: 'Same-Day Dispatch Available',
      desc: 'Master technicians available in your zip code until 9 PM.',
      time: '1h ago',
      icon: Shield,
      color: 'var(--navy-800)',
      link: '/services'
    },
    {
      id: 'notif_3',
      title: '90-Day Guarantee Active',
      desc: 'All completed repairs covered with 100% parts & labor warranty.',
      time: 'Today',
      icon: CheckCircle2,
      color: 'var(--amber-400)',
      link: '/more'
    }
  ].filter(Boolean);

  return (
    <header className="app-header glass">
      {/* Brand Logo Left */}
      <Link to="/" className="header-brand" aria-label="Apex Appliance Repair Home">
        <div className="brand-icon-wrap shine-sweep">
          <Wrench size={20} strokeWidth={2} />
        </div>
        <div className="brand-text-col">
          <div className="brand-title" style={{ fontSize: '15px', fontWeight: 700 }}>
            APEX <span>REPAIR</span>
          </div>
          <div className="brand-tagline" style={{ fontSize: '12px', fontWeight: 600 }}>
            Precision Care
          </div>
        </div>
      </Link>

      {/* Header Actions Right */}
      <div className="header-actions" ref={dropdownRef}>
        {/* Notification Bell */}
        <button
          className="icon-btn-header"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell size={20} strokeWidth={2} />
          <span className="header-notification-dot" />
        </button>

        {/* Notifications Dropdown Card */}
        {showNotifications && (
          <div
            className="glass-strong card-gloss"
            style={{
              position: 'absolute',
              top: '56px',
              right: '16px',
              width: '290px',
              borderRadius: '20px',
              padding: '14px',
              zIndex: 100,
              boxShadow: '0 16px 40px rgba(15, 42, 68, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.9)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid rgba(15, 42, 68, 0.08)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44' }}>Notifications</span>
              <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>{notifications.length} New</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notifications.map((n) => {
                const ItemIcon = n.icon;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(n.link);
                    }}
                    className="tap-effect"
                    style={{
                      padding: '8px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      border: '1px solid rgba(15, 42, 68, 0.05)'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: '#F1F5FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: n.color,
                      flexShrink: 0
                    }}>
                      <ItemIcon size={15} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44' }}>{n.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#4A5D6E', lineHeight: 1.25 }}>{n.desc}</div>
                      <div style={{ fontSize: '0.62rem', color: '#7E92A2', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User Pill / Initials Avatar */}
        {isAuthenticated && user ? (
          <Link
            to="/portal"
            className="header-avatar-btn tap-effect"
            aria-label="Open Patient & Customer Portal"
            title={`${user.name} - Customer Portal`}
          >
            {user.initials || 'SY'}
            <span className="avatar-online-dot" />
          </Link>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="header-login-btn tap-effect shine-sweep"
            aria-label="Sign In or Register"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
};

