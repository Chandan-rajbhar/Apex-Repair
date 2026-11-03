import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Truck,
  Phone,
  MessageSquare,
  Sparkles,
  Search,
  ChevronRight,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Settings,
  User,
  Wrench,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { COMPANY_INFO } from '../data/appliancesData';

export const MorePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { bookings, activeBooking } = useBooking();
  const { openChat } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Options');

  const filters = ['All Options', 'Appointments', 'Appliances', 'Invoices', 'Warranty'];

  const historyItems = [
    {
      id: 'h1',
      type: 'Appointments',
      title: activeBooking ? `Active Repair #${activeBooking.id}` : 'Schedule New Diagnostic',
      sub: activeBooking ? `${activeBooking.applianceName} • Step ${activeBooking.currentStep}/9` : '2-hour windows available',
      badge: activeBooking ? 'LIVE' : 'AVAILABLE',
      badgeColor: 'badge-mint',
      icon: Truck,
      action: () => navigate('/track')
    },
    {
      id: 'h2',
      type: 'Invoices',
      title: 'Past Repair Invoices & Receipts',
      sub: 'Download official PDF invoices & line items',
      badge: `${bookings.length} Records`,
      badgeColor: 'badge-navy',
      icon: Receipt,
      action: () => navigate('/track')
    },
    {
      id: 'h3',
      type: 'Warranty',
      title: '90-Day Unconditional Warranty',
      sub: 'All labor & OEM parts factory backed',
      badge: 'ACTIVE',
      badgeColor: 'badge-mint',
      icon: ShieldCheck,
      action: () => navigate('/services')
    },
    {
      id: 'h4',
      type: 'Appliances',
      title: 'My Appliance Vault',
      sub: 'Registered brands: Samsung, LG, Whirlpool',
      badge: '3 Units',
      badgeColor: 'badge-navy',
      icon: Wrench,
      action: () => navigate('/portal')
    },
    {
      id: 'h5',
      type: 'Appointments',
      title: 'Emergency Priority Dispatch',
      sub: `Call 24/7 hotline at ${COMPANY_INFO.phone}`,
      badge: 'URGENT',
      badgeColor: 'badge-orange',
      icon: Phone,
      action: () => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }
    },
    {
      id: 'h6',
      type: 'All Options',
      title: 'Frequently Asked Questions',
      sub: 'Diagnostic fees, warranty terms, dispatch times',
      badge: 'HELP',
      badgeColor: 'badge-navy',
      icon: HelpCircle,
      action: () => openChat()
    }
  ];

  const filteredItems = historyItems.filter((item) => {
    const matchFilter = selectedFilter === 'All Options' || item.type === selectedFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* --------------------------------------------------------------------------
          Top User Profile Summary Card (Matches Screenshot 3)
          -------------------------------------------------------------------------- */}
      <div
        onClick={() => {
          if (isAuthenticated) {
            navigate('/portal');
          } else {
            setAuthModalOpen(true);
          }
        }}
        className="tap-effect shine-sweep"
        style={{
          borderRadius: 22,
          background: 'var(--grad-primary)',
          color: '#FFFFFF',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar circle with initials */}
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: '#FFFFFF',
            color: '#1E7B5A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.05rem',
            fontWeight: 800,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            border: '2px solid rgba(255,255,255,0.6)'
          }}>
            {user?.initials || 'AP'}
          </div>

          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.01em' }}>
              {user ? user.name.toUpperCase() : 'GUEST CLIENT'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#D1FAE5', marginTop: 1 }}>
              {user ? `Client ${user.clientId || 'APEX-2409'} • Springfield Care Zone` : 'Sign in to sync your repair history'}
            </div>
          </div>
        </div>

        <ChevronRight size={20} color="#FFFFFF" />
      </div>

      {/* --------------------------------------------------------------------------
          4 Quick-Action Tiles (Matches Screenshot 3)
          -------------------------------------------------------------------------- */}
      <div className="quick-tiles-grid">
        <div className="quick-tile tap-effect" onClick={() => navigate('/book')}>
          <div className="tile-icon-box">
            <Calendar size={18} />
          </div>
          <div className="tile-label">Book Visit</div>
          <div className="tile-sub">Same-Day</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/track')}>
          <div className="tile-icon-box">
            <Truck size={18} />
          </div>
          <div className="tile-label">Track Order</div>
          <div className="tile-sub">Live Van GPS</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}>
          <div className="tile-icon-box">
            <Phone size={18} />
          </div>
          <div className="tile-label">Call Master Tech</div>
          <div className="tile-sub">Direct Line</div>
        </div>

        <div className="quick-tile tap-effect" onClick={openChat}>
          <div className="tile-icon-box">
            <MessageSquare size={18} />
          </div>
          <div className="tile-label">Contact Us</div>
          <div className="tile-sub">Live 24/7</div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Big Feature Banner: AI Diagnostic Triage (Matches Screenshot 3)
          -------------------------------------------------------------------------- */}
      <div
        className="card-gloss shine-sweep tap-effect"
        style={{
          borderRadius: 26,
          background: 'linear-gradient(135deg, #0A1C30 0%, #0F2A44 50%, #17405F 100%)',
          color: '#FFFFFF',
          padding: '22px 18px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={openChat}
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(47,166,124,0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span className="badge" style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#A7F3D0',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Sparkles size={12} /> AI APPLIANCE DIAGNOSTICS
          </span>
        </div>

        {/* Headline in serif */}
        <h3 style={{
          fontSize: '1.25rem',
          lineHeight: 1.25,
          color: '#FFFFFF',
          marginBottom: 8
        }}>
          AI Diagnostic Scanner for Instant Appliance Breakdown & Cost Estimate
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.76rem',
          color: '#CBD5E1',
          lineHeight: 1.45,
          marginBottom: 16
        }}>
          Instant AI analysis, expert master technician guidance, and upfront pricing before any technician arrives.
        </p>

        {/* Button */}
        <button
          className="btn btn-primary btn-sm tap-effect shine-sweep"
          style={{
            background: 'linear-gradient(135deg, #1E7B5A 0%, #2FA67C 100%)',
            color: '#FFFFFF',
            borderRadius: 9999,
            padding: '9px 18px',
            fontSize: '0.8rem',
            fontWeight: 800
          }}
        >
          <Sparkles size={14} /> Start Free Diagnostic
        </button>
      </div>

      {/* --------------------------------------------------------------------------
          Search Bar
          -------------------------------------------------------------------------- */}
      <div className="search-bar-wrap">
        <Search size={18} className="search-icon-pos" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search treatments, routines, orders..."
          className="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* --------------------------------------------------------------------------
          Filter Chips
          -------------------------------------------------------------------------- */}
      <div className="filter-chips-scroll no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`filter-chip tap-effect ${selectedFilter === f ? 'active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* --------------------------------------------------------------------------
          Grouped List: APPOINTMENTS & HISTORY (Matches Screenshot 3)
          -------------------------------------------------------------------------- */}
      <div className="card-white" style={{ padding: '16px 14px', borderRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} color="#1E7B5A" />
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F2A44', letterSpacing: '0.02em' }}>
              APPOINTMENTS & HISTORY
            </span>
          </div>
          <span className="badge badge-mint" style={{ fontSize: '0.66rem' }}>
            {filteredItems.length} items
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="tap-effect"
                style={{
                  padding: '12px 10px',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(241, 245, 251, 0.5)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1E7B5A',
                    boxShadow: 'var(--shadow-xs)',
                    flexShrink: 0
                  }}>
                    <ItemIcon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F2A44' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      {item.sub}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '0.62rem' }}>
                    {item.badge}
                  </span>
                  <ChevronRight size={16} color="#94A3B8" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

