import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  ArrowRight,
  ChevronRight,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  Wrench,
  SlidersHorizontal
} from 'lucide-react';
import { APPLIANCE_CATEGORIES } from '../data/appliancesData';
import { useBooking } from '../context/BookingContext';

export const ServicesPage = () => {
  const navigate = useNavigate();
  const { setPrefillData } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState(null);

  const filters = ['All', 'Refrigeration', 'Laundry', 'Cooking', 'Kitchen', 'Specialty'];

  const filteredServices = useMemo(() => {
    return APPLIANCE_CATEGORIES.filter((app) => {
      const matchFilter =
        selectedFilter === 'All' ||
        app.tag.toLowerCase().includes(selectedFilter.toLowerCase());

      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.popularBrands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.commonIssues.some((issue) => issue.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchFilter && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'repairs') return b.completedRepairs - a.completedRepairs;
      return 0; // default order
    });
  }, [selectedFilter, searchQuery, sortBy]);

  const handleBook = (app) => {
    setPrefillData({
      appliance: app.name,
      applianceId: app.id,
      brand: app.popularBrands[0]
    });
    navigate('/book');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* --------------------------------------------------------------------------
          Hero Banner with Small Thumbnail (Matches BeautyOasis Screenshot 4)
          -------------------------------------------------------------------------- */}
      <div
        className="card-white card-gloss"
        style={{
          borderRadius: 24,
          padding: '20px 18px',
          background: 'linear-gradient(135deg, #F2FBF7 0%, #E2F5EC 100%)',
          border: '1px solid rgba(30, 123, 90, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <span className="badge badge-mint" style={{ marginBottom: 6 }}>
              EXPERT CARE • OEM CERTIFIED
            </span>
            <h1 style={{ fontSize: '1.45rem', color: '#0F2A44', lineHeight: 1.25, marginTop: 4, marginBottom: 6 }}>
              Advanced Appliance Care for Every Room
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#4A5D6E', lineHeight: 1.4, marginBottom: 14 }}>
              Factory-trained master technicians providing transparent upfront quotes, same-day dispatch, and 90-day guarantee.
            </p>
            <button
              onClick={() => navigate('/book')}
              className="btn btn-primary btn-sm tap-effect shine-sweep"
            >
              Book Consultation <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Header Thumbnail */}
          <div style={{
            width: 78,
            height: 78,
            borderRadius: 18,
            overflow: 'hidden',
            border: '2px solid #FFFFFF',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            <img
              src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=300&q=80"
              alt="Apex Appliance Care"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Horizontal Filter Chips
          -------------------------------------------------------------------------- */}
      <div className="filter-chips-scroll no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`filter-chip tap-effect ${selectedFilter === f ? 'active' : ''}`}
          >
            {f === 'All' ? 'All Services' : f}
          </button>
        ))}
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
          placeholder="Search appliances, brands, symptoms..."
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
          Results Header & Sort Dropdown
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
        <h2 style={{ fontSize: '1.05rem', color: '#0F2A44' }}>
          All Services <span style={{ color: '#7E92A2', fontWeight: 500, fontSize: '0.9rem' }}>({filteredServices.length})</span>
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.74rem', color: '#7E92A2' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: 8,
              border: '1px solid rgba(15, 42, 68, 0.1)',
              background: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#0F2A44'
            }}
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="repairs">Jobs Completed</option>
          </select>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Service Cards List (Matches Screenshot 4)
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredServices.map((app) => (
          <div
            key={app.id}
            className="card-white card-gloss tap-effect mouse-glow-card"
            style={{
              borderRadius: 22,
              padding: 12,
              display: 'flex',
              gap: 12,
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            {/* Left Image with Badge Overlay */}
            <div style={{
              width: 110,
              height: 126,
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0
            }}>
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
                  background: 'rgba(15, 42, 68, 0.85)',
                  color: '#A7F3D0',
                  fontSize: '0.58rem',
                  padding: '2px 6px'
                }}
              >
                {app.tag}
              </span>
            </div>

            {/* Right Info Col */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-mint" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                  {app.tag}
                </span>
                <ChevronRight size={16} color="#7E92A2" />
              </div>

              <h3 style={{
                fontSize: '0.98rem',
                color: '#0F2A44',
                lineHeight: 1.25,
                margin: '4px 0 2px 0'
              }}>
                {app.name}
              </h3>

              <p style={{
                fontSize: '0.72rem',
                color: '#4A5D6E',
                lineHeight: 1.3,
                marginBottom: 6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {app.shortDesc}
              </p>

              {/* Duration and Warranty info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.68rem', color: '#7E92A2', marginBottom: 8 }}>
                <Clock size={12} color="#1E7B5A" />
                <span>{app.estDuration} • {app.warranty}</span>
              </div>

              {/* Bottom Row: Price + Details + Book Now */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <div>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F2A44' }}>
                    ${app.diagnosticFee}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#7E92A2', marginLeft: 3 }}>
                    Diag
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setSelectedServiceForDetail(app)}
                    className="btn btn-outline btn-xs tap-effect"
                    style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleBook(app)}
                    className="btn btn-primary btn-xs tap-effect shine-sweep"
                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                  >
                    Book Now &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------------------------
          Service Detail Modal (when clicking "Details")
          -------------------------------------------------------------------------- */}
      {selectedServiceForDetail && (
        <div className="sheet-backdrop" onClick={() => setSelectedServiceForDetail(null)}>
          <div
            className="sheet-container glass-strong card-gloss"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '88vh' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="sheet-drag-handle" />

            <div className="sheet-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span className="badge badge-mint">{selectedServiceForDetail.tag}</span>
                  <h2 style={{ fontSize: '1.4rem', color: '#0F2A44', marginTop: 4 }}>
                    {selectedServiceForDetail.name}
                  </h2>
                </div>
                <button onClick={() => setSelectedServiceForDetail(null)} className="icon-btn-header">
                  <X size={18} />
                </button>
              </div>

              {/* Hero Image */}
              <div style={{ width: '100%', height: 160, borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
                <img
                  src={selectedServiceForDetail.image}
                  alt={selectedServiceForDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.82rem', color: '#4A5D6E', lineHeight: 1.45, marginBottom: 14 }}>
                {selectedServiceForDetail.fullDesc}
              </p>

              {/* Diagnostic Fee Callout */}
              <div style={{
                padding: '12px 14px',
                borderRadius: 16,
                background: '#E8F6EF',
                border: '1px solid rgba(30, 123, 90, 0.25)',
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1E7B5A' }}>
                      ${selectedServiceForDetail.diagnosticFee} Multi-Point Diagnostic
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0F2A44' }}>
                      100% credited toward total bill if you approve repair
                    </div>
                  </div>
                  <ShieldCheck size={24} color="#1E7B5A" />
                </div>
              </div>

              {/* Common Issues Handled */}
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: '0.88rem', color: '#0F2A44', fontWeight: 700, marginBottom: 8 }}>
                  Common Symptoms Handled:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedServiceForDetail.commonIssues.map((issue, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#1E7B5A" style={{ flexShrink: 0 }} />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Brands */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.88rem', color: '#0F2A44', fontWeight: 700, marginBottom: 8 }}>
                  Factory Supported Brands:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedServiceForDetail.popularBrands.map((brand, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 9999,
                        background: '#F1F5FB',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#0F2A44'
                      }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => {
                  setSelectedServiceForDetail(null);
                  handleBook(selectedServiceForDetail);
                }}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{ height: 48 }}
              >
                Proceed to Book Service &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

