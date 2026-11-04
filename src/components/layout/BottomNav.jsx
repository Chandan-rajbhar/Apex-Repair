import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Settings, Calendar, Truck, User } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const BottomNav = () => {
  const location = useLocation();
  const { activeBooking } = useBooking();

  return (
    <nav className="bottom-nav-container glass-strong" aria-label="Main Navigation">
      {/* 1. Home */}
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Home"
      >
        {({ isActive }) => (
          <>
            <Home size={24} strokeWidth={2} />
            <span>Home</span>
            {isActive && <div className="nav-active-dot" />}
          </>
        )}
      </NavLink>

      {/* 2. Services */}
      <NavLink
        to="/services"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Services"
      >
        {({ isActive }) => (
          <>
            <Settings size={24} strokeWidth={2} />
            <span>Services</span>
            {isActive && <div className="nav-active-dot" />}
          </>
        )}
      </NavLink>

      {/* 3. Center Elevated Circular Book Button */}
      <NavLink
        to="/book"
        className="center-book-btn-wrapper"
        aria-label="Book Diagnostic Appointment"
      >
        <div className="center-book-btn glow-pulse-primary shine-sweep tap-effect">
          <Calendar size={22} strokeWidth={2} />
        </div>
        <span className="center-book-label">Book</span>
      </NavLink>

      {/* 4. Track */}
      <NavLink
        to="/track"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Track Repair"
      >
        {({ isActive }) => (
          <>
            <div style={{ position: 'relative' }}>
              <Truck size={24} strokeWidth={2} />
              {activeBooking && activeBooking.currentStep < 9 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -4,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--amber-400)',
                    border: '1.5px solid #FFFFFF'
                  }}
                />
              )}
            </div>
            <span>Track</span>
            {isActive && <div className="nav-active-dot" />}
          </>
        )}
      </NavLink>

      {/* 5. Profile */}
      <NavLink
        to="/more"
        className={({ isActive }) => `nav-item ${isActive || location.pathname === '/profile' ? 'active' : ''}`}
        aria-label="User Profile & Settings"
      >
        {({ isActive }) => (
          <>
            <User size={24} strokeWidth={2} />
            <span>Profile</span>
            {(isActive || location.pathname === '/profile') && <div className="nav-active-dot" />}
          </>
        )}
      </NavLink>
    </nav>
  );
};


