import React from 'react';
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
  const { setPrefillData, activeBooking } = useBooking();
  const { openChat } = useChat();

  const handleBookService = (category) => {
    setPrefillData({
      appliance: category.name,
      applianceId: category.id,
      brand: category.popularBrands[0]
    });
    navigate('/book');
  };

  const featuredAppliances = APPLIANCE_CATEGORIES.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* --------------------------------------------------------------------------
          Hero Banner (Luxury Serif + Rich Gradient + Shine Sweep)
          -------------------------------------------------------------------------- */}
      <div
        className="card-gloss shine-sweep"
        style={{
          borderRadius: 28,
          background: 'var(--grad-hero)',
          color: '#FFFFFF',
          padding: '24px 20px 22px 20px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,107,45,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top Tag Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span className="badge" style={{
            background: 'rgba(255, 255, 255, 0.16)',
            color: 'var(--amber-400)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            letterSpacing: '0.06em'
          }}>
            FACTORY CERTIFIED • SAME-DAY DISPATCH
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '1.85rem',
          lineHeight: 1.18,
          color: '#FFFFFF',
          marginBottom: 10
        }}>
          Precision Care,<br />
          Flawless Performance,<br />
          <span style={{
            background: 'linear-gradient(135deg, #FFB547 0%, #E8541E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Your Apex.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.88)',
          lineHeight: 1.45,
          marginBottom: 18,
          maxWidth: '92%'
        }}>
          Master certified appliance technicians offering same-day diagnostic dispatch, genuine OEM parts, and a 90-day guarantee.
        </p>

        {/* Actions Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <button
            onClick={() => navigate('/book')}
            className="btn btn-primary tap-effect shine-sweep"
            style={{
              padding: '10px 18px',
              fontSize: '0.86rem',
              fontWeight: 800
            }}
          >
            Book Consultation <ArrowRight size={15} />
          </button>

          {/* Social Proof Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(15, 42, 68, 0.45)',
            padding: '6px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Shield size={13} color="var(--amber-400)" />
            <span style={{ fontSize: '0.7rem', color: '#FFFFFF', fontWeight: 600 }}>
              Trusted by <strong>12,400+</strong> Clients
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Assured Warranty Ribbon Card (Matches Screenshot 2)
          -------------------------------------------------------------------------- */}
      <div
        className="tap-effect shine-sweep"
        style={{
          borderRadius: 20,
          background: 'var(--grad-header)',
          color: '#FFFFFF',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={() => navigate('/more')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(242, 107, 45, 0.25)',
            border: '1px solid rgba(255, 181, 71, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber-400)'
          }}>
            <Shield size={20} />
          </div>
          <div>
            <span className="badge badge-gold" style={{ padding: '2px 8px', fontSize: '0.62rem', marginBottom: 2 }}>
              ASSURED
            </span>
            <div style={{ fontSize: '0.84rem', fontWeight: 800 }}>
              100% OEM Authenticity
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
              Master Formulated • 90-Day Warranty
            </div>
          </div>
        </div>

        <button
          className="btn btn-xs btn-ghost"
          style={{
            padding: '7px 14px',
            fontSize: '0.74rem',
            fontWeight: 800,
            borderRadius: 9999
          }}
        >
          View Scope &gt;
        </button>
      </div>

      {/* --------------------------------------------------------------------------
          Trust Tiles (4-Up Grid - Matches BeautyOasis Screenshot 2)
          -------------------------------------------------------------------------- */}
      <div className="quick-tiles-grid">
        <div className="quick-tile tap-effect" onClick={() => navigate('/book')}>
          <div className="tile-icon-box">
            <Truck size={18} />
          </div>
          <div className="tile-label">Express Tech</div>
          <div className="tile-sub">2h Dispatch</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/services')}>
          <div className="tile-icon-box">
            <Shield size={18} />
          </div>
          <div className="tile-label">Master-Led</div>
          <div className="tile-sub">OEM Certified</div>
        </div>

        <div className="quick-tile tap-effect" onClick={openChat}>
          <div className="tile-icon-box">
            <Sparkles size={18} />
          </div>
          <div className="tile-label">AI Triage</div>
          <div className="tile-sub">Live Scanner</div>
        </div>

        <div className="quick-tile tap-effect" onClick={() => navigate('/more')}>
          <div className="tile-icon-box">
            <CheckCircle2 size={18} />
          </div>
          <div className="tile-label">100% Genuine</div>
          <div className="tile-sub">Factory Sealed</div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Active Booking Banner (if present)
          -------------------------------------------------------------------------- */}
      {activeBooking && activeBooking.currentStep < 9 && (
        <div
          onClick={() => navigate('/track')}
          className="tap-effect"
          style={{
            padding: '14px 16px',
            borderRadius: 20,
            background: 'var(--grad-warm)',
            border: '1.5px solid rgba(232, 84, 30, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'var(--orange-600)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Repair #{activeBooking.id}
                </span>
                <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>
                  Step {activeBooking.currentStep}/9
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--orange-600)', fontWeight: 600 }}>
                {activeBooking.applianceName} • Tech: {activeBooking.technician?.name || 'Marcus'}
              </div>
            </div>
          </div>

          <span
            className="btn btn-xs glow-pulse-primary"
            style={{
              background: 'var(--grad-cta)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF' }} />
            Track Live &gt;
          </span>
        </div>
      )}

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {featuredAppliances.map((app) => (
            <div
              key={app.id}
              className="card-white card-gloss tap-effect mouse-glow-card"
              style={{
                borderRadius: 22,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Image with Badge */}
              <div style={{ position: 'relative', width: '100%', height: 110, overflow: 'hidden' }}>
                <img
                  src={app.image}
                  alt={app.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className="badge"
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: 'rgba(14, 26, 54, 0.85)',
                    color: 'var(--amber-400)',
                    fontSize: '0.6rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {app.badge}
                </span>

                {/* Star rating pill */}
                <div style={{
                  position: 'absolute',
                  bottom: 6,
                  right: 8,
                  padding: '2px 6px',
                  borderRadius: 9999,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '0.62rem',
                  fontWeight: 700
                }}>
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <span>{app.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '10px 12px 14px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {app.tag}
                </div>

                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)',
                  lineHeight: 1.25,
                  margin: '2px 0 6px 0',
                  minHeight: 36
                }}>
                  {app.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                    ${app.diagnosticFee}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--orange-600)', fontWeight: 600 }}>
                    Diagnostic
                  </span>
                </div>

                <button
                  onClick={() => handleBookService(app)}
                  className="btn btn-outline-primary btn-block btn-xs tap-effect shine-sweep"
                  style={{
                    marginTop: 'auto',
                    padding: '8px 0',
                    borderRadius: 9999,
                    fontSize: '0.74rem',
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
            background: 'var(--navy-900)',
            color: '#FFFFFF',
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

