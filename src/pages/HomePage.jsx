import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Shield,
  Truck,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  Check
} from 'lucide-react';
import { APPLIANCE_CATEGORIES, COMPANY_INFO } from '../data/appliancesData';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { setPrefillData } = useBooking();
  const { openChat } = useChat();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookService = (category) => {
    setPrefillData({
      appliance: category.name,
      applianceId: category.id,
      brand: category.popularBrands[0]
    });
    navigate('/book');
  };

  const featuredAppliances = APPLIANCE_CATEGORIES.filter((app) => {
    if (activeTab === 'LAUNDRY') return app.tag === 'LAUNDRY';
    if (activeTab === 'COOLING') return app.tag === 'REFRIGERATION';
    if (activeTab === 'KITCHEN') return app.tag === 'KITCHEN' || app.tag === 'COOKING';
    if (activeTab === 'DEALS') return app.badge === 'SAME-DAY' || app.badge === 'BEST-SELLER';
    return true;
  }).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* --------------------------------------------------------------------------
          1. Pill Search Bar (Matches Nykaa Reference Style)
          -------------------------------------------------------------------------- */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search
          size={17}
          color="var(--navy-600)"
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          placeholder="Search for Washing Machines, Refrigerators, AC..."
          style={{
            width: '100%',
            height: 44,
            padding: '0 16px 0 44px',
            borderRadius: 9999,
            border: '1px solid var(--border)',
            background: '#FFFFFF',
            fontSize: '0.82rem',
            color: 'var(--navy-900)',
            boxShadow: 'var(--shadow-xs)',
            outline: 'none',
            boxBoxSizing: 'border-box'
          }}
        />
      </div>

      {/* --------------------------------------------------------------------------
          2. Horizontal Category Tabs (ALL, DEALS, LAUNDRY, COOLING, KITCHEN)
          -------------------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        padding: '2px 4px 6px 4px',
        borderBottom: '1px solid rgba(22, 38, 74, 0.08)'
      }}>
        {['ALL', 'DEALS', 'LAUNDRY', 'COOLING', 'KITCHEN'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px 2px 6px 2px',
                fontSize: '0.74rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--navy-900)' : 'var(--text-muted)',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: -6,
                  left: 0,
                  right: 0,
                  height: 2.5,
                  borderRadius: 2,
                  background: 'var(--orange-600)'
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------------
          3. Navy Blue Promo Hero Banner (Washing Machine / Appliance Repair)
          -------------------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          minHeight: 140,
          borderRadius: 18,
          overflow: 'hidden',
          padding: '12px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(160deg, #2F54B8 0%, #0B1F5C 50%, #040A22 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 24px rgba(4, 10, 34, 0.25)'
        }}
      >
        {/* Gloss highlight on top half */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Left Column (about 60%): Text & Actions */}
        <div
          style={{
            flex: '0 0 58%',
            maxWidth: '58%',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center'
          }}
        >
          {/* 1. Headline (2 lines max, accent word #A9BCF5) */}
          <h2
            style={{
              fontSize: 'clamp(20px, 5.5vw, 24px)',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              margin: '0 0 6px 0',
              padding: 0,
              letterSpacing: '-0.01em'
            }}
          >
            <span style={{ color: '#A9BCF5' }}>Same-day</span><br />
            appliance repair
          </h2>

          {/* 2. Offer Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 24,
              padding: '0 9px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              marginBottom: 10,
              boxSizing: 'border-box'
            }}
          >
            Up to $50 off
          </div>

          {/* 3. Primary Button */}
          <button
            onClick={() => navigate('/book')}
            className="tap-effect"
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 9999,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D6DDF0 100%)',
              color: '#0B1F5C',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 4px 14px rgba(4, 10, 34, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <span>Book service</span>
            <ArrowRight size={13} strokeWidth={2.4} />
          </button>
        </div>

        {/* Right Column (about 40%): Washing Machine Image with soft fade */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '42%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80"
            alt="Washing machine appliance repair"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 20%, black 45%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 20%, black 45%)'
            }}
          />
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          4. Offer Strip (Matches Bank Offer Ribbon in Reference)
          -------------------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 14,
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'var(--orange-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--orange-600)',
          flexShrink: 0
        }}>
          <Sparkles size={15} />
        </div>
        <div style={{
          width: 1,
          height: 20,
          background: 'rgba(22, 38, 74, 0.12)'
        }} />
        <div style={{ fontSize: '0.70rem', color: 'var(--navy-900)', lineHeight: 1.25 }}>
          <strong>$79 Diagnostic Waived</strong> on all repairs over $150 with code <span style={{ color: 'var(--orange-600)', fontWeight: 800 }}>APEXCARE</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Trust Tiles (Commented out per request)
          -------------------------------------------------------------------------- */}
      {/*
      <div className="quick-tiles-grid">
        <div className="quick-tile tap-effect" onClick={() => navigate('/book')}>
          <div className="tile-icon-box">
            <Truck size={18} />
          </div>
          <div className="tile-label">Express Tech</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/services')}>
          <div className="tile-icon-box">
            <Shield size={18} />
          </div>
          <div className="tile-label">Master-Led</div>
        </div>

        <div className="quick-tile tap-effect" onClick={openChat}>
          <div className="tile-icon-box">
            <Sparkles size={18} />
          </div>
          <div className="tile-label">AI Triage</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/more')}>
          <div className="tile-icon-box">
            <CheckCircle2 size={18} />
          </div>
          <div className="tile-label">100% Genuine</div>
        </div>
      </div>
      */}

      {/* --------------------------------------------------------------------------
          Recommended Appliance Repairs (Grid Cards - Matches Screenshot 2)
          -------------------------------------------------------------------------- */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={18} color="var(--orange-600)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)' }}>
              Our Recommended Services
            </h3>
          </div>
          <button
            onClick={() => navigate('/services')}
            style={{ fontSize: '0.76rem', color: 'var(--orange-600)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            View All &gt;
          </button>
        </div>

        {/* 2-Column Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {featuredAppliances.map((app) => (
            <div
              key={app.id}
              className="card-white card-gloss tap-effect mouse-glow-card"
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Image with Badge */}
              <div style={{ position: 'relative', width: '100%', height: 92, overflow: 'hidden' }}>
                <img
                  src={app.image}
                  alt={app.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    background: 'rgba(14, 26, 54, 0.85)',
                    color: 'var(--amber-400)',
                    fontSize: '0.55rem',
                    padding: '2px 6px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {app.badge}
                </span>

                {/* Star rating pill */}
                <div style={{
                  position: 'absolute',
                  bottom: 5,
                  right: 6,
                  padding: '1px 5px',
                  borderRadius: 9999,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '0.58rem',
                  fontWeight: 700
                }}>
                  <Star size={9} fill="#F59E0B" color="#F59E0B" />
                  <span>{app.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '8px 10px 10px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.60rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {app.tag}
                </div>

                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  lineHeight: 1.2,
                  margin: '2px 0 4px 0',
                  minHeight: 28
                }}>
                  {app.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                    ${app.diagnosticFee}
                  </span>
                  <span style={{ fontSize: '0.64rem', color: 'var(--orange-600)', fontWeight: 600 }}>
                    Diagnostic
                  </span>
                </div>

                <button
                  onClick={() => handleBookService(app)}
                  className="btn btn-outline-primary btn-block btn-xs tap-effect"
                  style={{
                    marginTop: 'auto',
                    padding: '6px 0',
                    borderRadius: 9999,
                    fontSize: '0.70rem',
                    fontWeight: 800
                  }}
                >
                  Book Repair &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Urgent Call CTA Banner (Orange Gradient)
          -------------------------------------------------------------------------- */}
      <div
        className="card-gloss shine-sweep"
        style={{
          borderRadius: 24,
          background: 'var(--grad-cta)',
          color: '#FFFFFF',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--glow-orange)'
        }}
      >
        <div>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', marginBottom: 4 }}>
            EMERGENCY APPLIANCE HOTLINE
          </span>
          <div style={{ fontSize: '0.94rem', fontWeight: 800 }}>
            Active Water Leak or Gas Odor?
          </div>
          <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
            2-Hour Immediate Master Technician Dispatch
          </div>
        </div>

        <a
          href={`tel:${COMPANY_INFO.phoneRaw}`}
          className="btn tap-effect"
          style={{
            background: '#FFFFFF',
            color: 'var(--navy-900)',
            padding: '10px 14px',
            fontSize: '0.8rem',
            fontWeight: 800,
            borderRadius: 9999,
            whiteSpace: 'nowrap'
          }}
        >
          <PhoneCall size={15} /> Call Now
        </a>
      </div>

      {/* --------------------------------------------------------------------------
          3-Step "How It Works" Flow
          -------------------------------------------------------------------------- */}
      <div className="card-white" style={{ padding: '18px 16px', borderRadius: 24 }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: 12 }}>
          How Apex Repair Works
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--orange-50)',
              color: 'var(--orange-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                Book Your 3-Hour Slot
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                Choose your appliance, brand, and preferred morning or afternoon window. Zero upfront payment required.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--orange-50)',
              color: 'var(--orange-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                Master Diagnostic & Upfront Quote
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                Our technician inspects your machine with digital telemetry and submits an itemized quote. The $79 fee is credited 100% to repair!
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--orange-50)',
              color: 'var(--orange-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                OEM Repair & 90-Day Guarantee
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                Parts are installed from our fully stocked vans. Completed jobs receive a certified 90-day parts & labor warranty.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

