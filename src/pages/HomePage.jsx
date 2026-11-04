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
  Check,
  CalendarPlus,
  Receipt,
  Headset,
  Heart,
  X,
  Download,
  Phone,
  MessageSquare,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { APPLIANCE_CATEGORIES, COMPANY_INFO } from '../data/appliancesData';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';

const FEATURED_SERVICES = [
  {
    code: 'AC-01',
    name: 'AC repair and service',
    price: '49',
    tag: 'Same-day',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    appliance: 'Air Conditioners',
    categoryKey: 'cooling',
    desc: 'Certified split AC diagnostics, refrigerant pressure check, condenser coil deep clean, compressor load testing, and digital PCB repair.'
  },
  {
    code: 'WM-02',
    name: 'Washing machine repair',
    price: '39',
    tag: 'Same-day',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
    appliance: 'Washing Machines',
    categoryKey: 'washers',
    desc: 'Front-load & top-load drum balance calibration, drain pump clearing, high-speed spin leak elimination, and direct-drive motor coupling overhaul.'
  },
  {
    code: 'RF-03',
    name: 'Refrigerator repair',
    price: '45',
    tag: 'Same-day',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    appliance: 'Refrigerators',
    categoryKey: 'refrigerators',
    desc: 'Inverter compressor testing, dual evaporator defrosting, magnetic door seal restoration, and electronic thermistor sensor calibration.'
  },
  {
    code: 'EL-04',
    name: 'Electronics repair',
    price: '35',
    tag: '48-hour',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    appliance: 'Electronics & Microwaves',
    categoryKey: 'microwaves',
    desc: 'High-voltage diode & capacitor safety check, control board precision soldering, magnetron inspection, and digital touch panel circuit renewal.'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { activeBooking, setPrefillData } = useBooking();
  const { openChat } = useChat();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedServices, setSavedServices] = useState(['AC-01']);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'invoices' | 'support' | null

  const handleToggleSave = (item) => {
    setSavedServices((prev) => {
      const isSaved = prev.includes(item.code);
      if (isSaved) {
        showToast(`Removed "${item.name}" from saved repairs.`, 'info');
        return prev.filter(c => c !== item.code);
      } else {
        showToast(`Saved "${item.name}" to your repairs!`, 'success');
        return [...prev, item.code];
      }
    });
  };

  const handleBookService = (category) => {
    setPrefillData({
      appliance: category.name,
      applianceId: category.id,
      brand: category.popularBrands?.[0] || 'Standard OEM'
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* --------------------------------------------------------------------------
          1. Pill Search Bar & Category Chips
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={20}
            strokeWidth={2}
            color="#14308F"
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
              border: '1px solid #E3E7F2',
              background: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 400,
              color: '#0A0A0F',
              boxShadow: '0 2px 8px rgba(10,20,60,0.04)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '2px 0'
        }}>
          {['ALL', 'DEALS', 'LAUNDRY', 'COOLING', 'KITCHEN'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="tap-effect"
                style={{
                  height: 36,
                  padding: '0 16px',
                  borderRadius: 9999,
                  background: isActive ? '#0B1F5C' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#1B2236',
                  border: isActive ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(11,31,92,0.2)' : 'none'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2. Hero Promo Banner
          -------------------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          minHeight: 180,
          borderRadius: 20,
          overflow: 'hidden',
          padding: 20,
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
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.25,
              margin: '0 0 12px 0',
              padding: 0
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
              height: 28,
              padding: '0 12px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              marginBottom: 16,
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
              height: 44,
              padding: '0 20px',
              borderRadius: 9999,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D6DDF0 100%)',
              color: '#0B1F5C',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(4, 10, 34, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <span>Book service</span>
            <ArrowRight size={16} strokeWidth={2} />
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
          3. Quick Action Cards (4 equal cards, 8px gap)
          -------------------------------------------------------------------------- */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8
      }}>
        {/* 1. Book */}
        <div
          onClick={() => navigate('/book')}
          className="quick-action-card tap-effect"
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#E8ECF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CalendarPlus size={22} strokeWidth={2} color="#14308F" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F', textAlign: 'center', lineHeight: 1.1 }}>
            Book
          </span>
        </div>

        {/* 2. Track */}
        <div
          onClick={() => navigate('/track')}
          className="quick-action-card tap-effect"
        >
          {activeBooking && (
            <div style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#14308F',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}>
              1
            </div>
          )}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#E8ECF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Truck size={22} strokeWidth={2} color="#14308F" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F', textAlign: 'center', lineHeight: 1.1 }}>
            Track
          </span>
        </div>

        {/* 3. Invoices */}
        <div
          onClick={() => setActiveModal('invoices')}
          className="quick-action-card tap-effect"
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#E8ECF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Receipt size={22} strokeWidth={2} color="#14308F" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F', textAlign: 'center', lineHeight: 1.1 }}>
            Invoices
          </span>
        </div>

        {/* 4. Support */}
        <div
          onClick={() => setActiveModal('support')}
          className="quick-action-card tap-effect"
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#E8ECF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Headset size={22} strokeWidth={2} color="#14308F" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F', textAlign: 'center', lineHeight: 1.1 }}>
            Support
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          4. FEATURED SERVICES (Rule 3 Section Header Row & Rule 4 Card Anatomy)
          -------------------------------------------------------------------------- */}
      <div>
        {/* Section Header Row (Rule 3: Eyebrow above title left, link right, same baseline) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 16
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#14308F',
              marginBottom: 4
            }}>
              OUR SERVICES
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: 1.25,
              color: '#0A0A0F',
              margin: 0
            }}>
              Featured repairs
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="tap-effect"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#14308F',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>All services</span>
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>

        {/* 2-Column Grid (Rule 1 & 6: 14px gap, equal minmax(0, 1fr) columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 14
        }}>
          {FEATURED_SERVICES.map((item) => {
            const isSaved = savedServices.includes(item.code);
            return (
              <div
                key={item.code}
                onClick={() => setSelectedServiceDetail(item)}
                className="featured-repair-card tap-effect"
              >
                {/* Rule 4: Photo on top, height 115px */}
                <div style={{ position: 'relative', width: '100%', height: 115, overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Subtle navy gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(11, 31, 92, 0.25) 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Rule 4: Icon buttons on photo (40px circles, 8px from top/right, 8px between) */}
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: 2
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSave(item);
                      }}
                      className="tap-effect"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(10, 20, 60, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      aria-label={isSaved ? "Saved" : "Save repair"}
                    >
                      <Heart
                        size={20}
                        strokeWidth={2}
                        color={isSaved ? "#E11D48" : "#7A8299"}
                        fill={isSaved ? "#E11D48" : "none"}
                      />
                    </button>
                  </div>
                </div>

                {/* Rule 4: Text area padding 12px */}
                <div style={{
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  boxSizing: 'border-box'
                }}>
                  {/* Row 1: Code left (13px weight 600), Value right (13px weight 600), space-between */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#14308F',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
                    }}>
                      {item.code}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>
                      From ${item.price}
                    </span>
                  </div>

                  {/* Row 2: Title (15px weight 600, single line with ellipsis) */}
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0A0A0F',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25,
                    marginTop: 4
                  }}>
                    {item.name}
                  </div>

                  {/* Thin divider line (#EEF1F8, 12px above and below) */}
                  <div style={{ height: 1, background: '#EEF1F8', margin: '12px 0' }} />

                  {/* Row 3: Gray tag left (13px), Details + arrow right (14px weight 600 navy) */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 400, color: '#7A8299' }}>
                      {item.tag}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#14308F',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Offer Strip
          -------------------------------------------------------------------------- */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 20,
        background: '#FFFFFF',
        border: '1px solid #E3E7F2',
        boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: '#E8ECF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#14308F',
          flexShrink: 0
        }}>
          <Sparkles size={20} strokeWidth={2} />
        </div>
        <div style={{
          width: 1,
          height: 24,
          background: '#EEF1F8'
        }} />
        <div style={{ fontSize: '14px', color: '#0A0A0F', lineHeight: 1.5 }}>
          <strong>$79 Diagnostic Waived</strong> on all repairs over $150 with code <span style={{ color: '#14308F', fontWeight: 600 }}>APEXCARE</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Urgent Call CTA Banner (Orange Gradient)
          -------------------------------------------------------------------------- */}
      <div
        className="card-gloss shine-sweep"
        style={{
          borderRadius: 20,
          background: 'var(--grad-cta)',
          color: '#FFFFFF',
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: 'var(--glow-orange)'
        }}
      >
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#FFFFFF',
            opacity: 0.9,
            marginBottom: 4
          }}>
            EMERGENCY APPLIANCE HOTLINE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.25, marginBottom: 4 }}>
            Active Leak or Gas Odor?
          </div>
          <div style={{ fontSize: '14px', fontWeight: 400, opacity: 0.9, lineHeight: 1.5 }}>
            2-Hour Immediate Master Technician Dispatch
          </div>
        </div>

        <a
          href={`tel:${COMPANY_INFO.phoneRaw}`}
          className="tap-effect"
          style={{
            height: 44,
            padding: '0 20px',
            borderRadius: 9999,
            background: '#FFFFFF',
            color: '#0B1F5C',
            fontSize: '14px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <PhoneCall size={18} strokeWidth={2} />
          <span>Call Now</span>
        </a>
      </div>

      {/* --------------------------------------------------------------------------
          3-Step "How It Works" Flow
          -------------------------------------------------------------------------- */}
      <div style={{
        background: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        border: '1px solid #E3E7F2',
        boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#14308F',
            marginBottom: 4
          }}>
            HOW IT WORKS
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.25 }}>
            3 Simple Steps
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#E8ECF8',
              color: '#14308F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', marginBottom: 2 }}>
                Book Your 3-Hour Slot
              </div>
              <div style={{ fontSize: '14px', color: '#5B6478', lineHeight: 1.5 }}>
                Choose your appliance, brand, and preferred morning or afternoon window. Zero upfront payment required.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#E8ECF8',
              color: '#14308F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', marginBottom: 2 }}>
                Master Diagnostic & Upfront Quote
              </div>
              <div style={{ fontSize: '14px', color: '#5B6478', lineHeight: 1.5 }}>
                Our technician inspects your machine with digital telemetry and submits an itemized quote. The $79 fee is credited 100% to repair!
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#E8ECF8',
              color: '#14308F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '14px',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', marginBottom: 2 }}>
                OEM Repair & 90-Day Guarantee
              </div>
              <div style={{ fontSize: '14px', color: '#5B6478', lineHeight: 1.5 }}>
                Parts are installed from our fully stocked vans. Completed jobs receive a certified 90-day parts & labor warranty.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          MODALS & BOTTOM SHEETS
          ========================================================================== */}

      {/* 1. Featured Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="sheet-backdrop" onClick={() => setSelectedServiceDetail(null)}>
          <div
            className="sheet-container glass-strong card-gloss"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '88vh', borderRadius: '24px 24px 0 0' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="sheet-drag-handle" />
            <div className="sheet-body" style={{ padding: '0 20px 24px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontWeight: 700,
                    color: '#14308F',
                    background: '#E8ECF8',
                    padding: '3px 8px',
                    borderRadius: 6
                  }}>
                    {selectedServiceDetail.code}
                  </span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A0A0F', marginTop: 6, marginBottom: 2 }}>
                    {selectedServiceDetail.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#7A8299' }}>
                    {selectedServiceDetail.tag} • Starting at From ${selectedServiceDetail.price}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedServiceDetail(null)}
                  className="icon-btn-header"
                  style={{ width: 32, height: 32, color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Image banner */}
              <div style={{ width: '100%', height: 160, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                <img
                  src={selectedServiceDetail.image}
                  alt={selectedServiceDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <p style={{ fontSize: '14px', color: '#4A5A78', lineHeight: 1.5, marginBottom: 16 }}>
                {selectedServiceDetail.desc}
              </p>

              {/* What's included checklist */}
              <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8', padding: '12px 14px', marginBottom: 20 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 8 }}>
                  Service Standards Included:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '13px', color: '#4A5A78' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={16} color="#14308F" />
                    <span>Certified master diagnostic & upfront written estimate</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} color="#14308F" />
                    <span>100% Genuine OEM factory-certified parts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={16} color="#14308F" />
                    <span>90-Day parts and labor warranty protection</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  setPrefillData({
                    appliance: selectedServiceDetail.appliance,
                    applianceId: selectedServiceDetail.categoryKey,
                    brand: 'Standard OEM'
                  });
                  setSelectedServiceDetail(null);
                  navigate('/book');
                }}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{
                  height: 48,
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: 9999,
                  background: '#14308F',
                  color: '#FFFFFF'
                }}
              >
                Book This Service &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Invoices & Receipts Modal */}
      {activeModal === 'invoices' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A0F' }}>
                  Invoices & Receipts
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'INV-2024-08', date: 'October 24, 2026', appliance: 'Samsung French Door Refrigerator', amount: '$249.00', status: 'Paid' },
                { id: 'INV-2024-03', date: 'August 12, 2026', appliance: 'Whirlpool Front-Load Washer', amount: '$189.00', status: 'Paid' }
              ].map((inv) => (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14, border: '1px solid #EEF1F8' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F' }}>{inv.id} • {inv.amount}</div>
                    <div style={{ fontSize: '0.74rem', color: '#4A5A78', marginTop: 2 }}>{inv.appliance}</div>
                    <div style={{ fontSize: '0.68rem', color: '#7A8299', marginTop: 1 }}>{inv.date}</div>
                  </div>
                  <button
                    onClick={() => showToast(`Invoice ${inv.id} downloaded!`, 'success')}
                    className="btn btn-outline tap-effect"
                    style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Download size={13} /> PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Help & Support Modal */}
      {activeModal === 'support' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Headset size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0A0A0F' }}>
                  Help & Support
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
                className="tap-effect"
                style={{ padding: '14px 16px', borderRadius: 14, background: '#FDECEC', border: '1px solid #FCD4D4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={18} color="#C62828" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#C62828' }}>24/7 Emergency Dispatch</div>
                    <div style={{ fontSize: '12px', color: '#7A8299' }}>Instant technician hotline</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#C62828" />
              </div>

              <div
                onClick={() => { setActiveModal(null); openChat(); }}
                className="tap-effect"
                style={{ padding: '14px 16px', borderRadius: 14, background: '#F8FAFC', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8ECF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={18} color="#14308F" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>Live Chat Support</div>
                    <div style={{ fontSize: '12px', color: '#7A8299' }}>Average response in 2 mins</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#7A8299" />
              </div>

              <div
                onClick={() => { setActiveModal(null); navigate('/more'); }}
                className="tap-effect"
                style={{ padding: '14px 16px', borderRadius: 14, background: '#F8FAFC', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8ECF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HelpCircle size={18} color="#14308F" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>Frequently Asked Questions</div>
                    <div style={{ fontSize: '12px', color: '#7A8299' }}>Pricing, warranties & policies</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#7A8299" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

