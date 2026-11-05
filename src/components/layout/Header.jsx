import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Wrench, Search, User, LogIn } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  const { user, isAuthenticated } = useAuth();
  const [profileAvatar, setProfileAvatar] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Sync profile avatar from user context or localStorage
  useEffect(() => {
    const checkAvatar = () => {
      if (!user && !isAuthenticated) {
        setProfileAvatar(null);
        return;
      }

      try {
        const s = localStorage.getItem('apex_profile_data');
        if (s) {
          const parsed = JSON.parse(s);
          if (parsed && parsed.avatarUrl) {
            setProfileAvatar(parsed.avatarUrl);
            setImgError(false);
            return;
          }
        }
      } catch {}

      if (user?.avatarUrl) {
        setProfileAvatar(user.avatarUrl);
        setImgError(false);
      } else {
        setProfileAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80');
      }
    };

    checkAvatar();
    window.addEventListener('storage', checkAvatar);
    window.addEventListener('apex_profile_updated', checkAvatar);
    return () => {
      window.removeEventListener('storage', checkAvatar);
      window.removeEventListener('apex_profile_updated', checkAvatar);
    };
  }, [user, isAuthenticated]);

  return (
    <header className="app-header glass">
      {/* Brand Logo Left */}
      <Link to="/" className="header-brand" aria-label="Apex Appliance Repair Home">
        <div className="brand-icon-wrap shine-sweep">
          <Wrench size={16} strokeWidth={2} />
        </div>
        <div className="brand-text-col">
          <div className="brand-title" style={{ fontSize: 'var(--text-logo, clamp(0.85rem, 3.6vw, 1rem))', fontWeight: 700 }}>
            APEX <span>REPAIR</span>
          </div>
          <div className="brand-tagline" style={{ fontSize: 'clamp(0.58rem, 2.4vw, 0.68rem)', fontWeight: 600 }}>
            Precision Care
          </div>
        </div>
      </Link>

      {/* Header Actions Right (Search, Bell with dynamic badge, Profile Avatar OR Login Button) */}
      <div
        className="header-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(5px, 1.5vw, 8px)',
          flexShrink: 0
        }}
      >
        {/* 1. Search Icon Button */}
        <button
          className="icon-btn-header tap-effect"
          onClick={() => navigate('/services')}
          aria-label="Search services"
          title="Search"
          style={{
            width: 'clamp(28px, 7.5vw, 32px)',
            height: 'clamp(28px, 7.5vw, 32px)',
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Search size={18} strokeWidth={2} />
        </button>

        {/* 2. Notification Bell with Dynamic Unread Badge (Navigates to dedicated Notifications page) */}
        <button
          className="icon-btn-header tap-effect"
          onClick={() => navigate('/notifications')}
          aria-label="View notifications"
          title="Notifications"
          style={{
            width: 'clamp(28px, 7.5vw, 32px)',
            height: 'clamp(28px, 7.5vw, 32px)',
            background: 'transparent',
            border: 'none',
            padding: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Bell size={18} strokeWidth={2} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 1,
                right: 1,
                minWidth: 'clamp(13px, 3.5vw, 15px)',
                height: 'clamp(13px, 3.5vw, 15px)',
                borderRadius: 9999,
                background: '#FF5A36',
                color: '#FFFFFF',
                fontSize: 'clamp(8px, 2.1vw, 9px)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 2px',
                border: '1.5px solid #0B1F5C',
                lineHeight: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* 3. Extreme Right: Circular Profile Picture (if logged in) OR Login Button (if logged out) */}
        {isAuthenticated && user ? (
          <button
            className="tap-effect"
            onClick={() => navigate('/profile')}
            aria-label="User Profile"
            title="Profile"
            style={{
              width: 'clamp(28px, 7.5vw, 32px)',
              height: 'clamp(28px, 7.5vw, 32px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16264A 0%, #2F5082 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              flexShrink: 0,
              marginLeft: '2px'
            }}
          >
            {profileAvatar && !imgError ? (
              <img
                src={profileAvatar}
                alt={user?.name || 'Profile'}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #16264A 0%, #2F5082 100%)',
                  color: '#FFFFFF'
                }}
              >
                <User size={15} strokeWidth={2.2} color="#FFFFFF" />
              </div>
            )}
          </button>
        ) : (
          <button
            className="tap-effect header-login-pill"
            onClick={() => navigate('/login')}
            aria-label="Log In"
            title="Log In"
            style={{
              height: 'clamp(28px, 7.5vw, 32px)',
              padding: '0 clamp(10px, 2.5vw, 13px)',
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#0B1F5C',
              fontSize: 'clamp(11px, 2.8vw, 12px)',
              fontWeight: 700,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
              flexShrink: 0,
              marginLeft: '2px'
            }}
          >
            <LogIn size={13} strokeWidth={2.5} color="#0B1F5C" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
