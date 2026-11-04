import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Wrench, Shield, CheckCircle2, Truck, Search, Heart } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const Header = () => {
  const { activeBooking } = useBooking();
  const [showNotifications, setShowNotifications] = useState(false);
  const [savedCount, setSavedCount] = useState(2);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Sync saved repairs count from localStorage
  useEffect(() => {
    const updateSaved = () => {
      try {
        const s = localStorage.getItem('apex_saved_repairs');
        if (s) {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) {
            setSavedCount(parsed.length);
          }
        }
      } catch {}
    };
    updateSaved();
    window.addEventListener('storage', updateSaved);
    return () => window.removeEventListener('storage', updateSaved);
  }, []);

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
          <Wrench size={18} strokeWidth={2} />
        </div>
        <div className="brand-text-col">
          <div className="brand-title" style={{ fontSize: '15px', fontWeight: 700 }}>
            APEX <span>REPAIR</span>
          </div>
          <div className="brand-tagline" style={{ fontSize: '11px', fontWeight: 600 }}>
            Precision Care
          </div>
        </div>
      </Link>

      {/* Header Actions Right (Search, Heart with count, Bell with dot) */}
      <div className="header-actions" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* 1. Search Icon Button */}
        <button
          className="icon-btn-header tap-effect"
          onClick={() => navigate('/services')}
          aria-label="Search services"
          title="Search"
          style={{ width: 32, height: 32, background: 'transparent', border: 'none', padding: 0 }}
        >
          <Search size={19} strokeWidth={2} />
        </button>

        {/* 2. Heart / Saved Icon Button with Count Badge */}
        <button
          className="icon-btn-header tap-effect"
          onClick={() => navigate('/more?sub=saved-items')}
          aria-label="View saved repairs"
          title="Saved Repairs"
          style={{ width: 32, height: 32, background: 'transparent', border: 'none', padding: 0, position: 'relative' }}
        >
          <Heart size={19} strokeWidth={2} />
          <span
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              minWidth: 15,
              height: 15,
              borderRadius: 9999,
              background: '#FF5A36',
              color: '#FFFFFF',
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 3px',
              border: '1.5px solid #0B1F5C',
              lineHeight: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            {savedCount || 2}
          </span>
        </button>

        {/* 3. Notification Bell with Indicator Dot */}
        <button
          className="icon-btn-header tap-effect"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="View notifications"
          title="Notifications"
          style={{ width: 32, height: 32, background: 'transparent', border: 'none', padding: 0, position: 'relative' }}
        >
          <Bell size={19} strokeWidth={2} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 5,
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FF5A36',
              border: '1.5px solid #0B1F5C'
            }}
          />
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
      </div>
    </header>
  );
};

