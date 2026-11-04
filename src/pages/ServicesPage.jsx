import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Heart,
  Scale,
  ChevronRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { APPLIANCE_CATEGORIES } from '../data/appliancesData';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';

// Service codes mapping for reference styling
const SERVICE_CODES = {
  refrigerators: 'RF-01',
  washers: 'WM-02',
  dryers: 'DR-03',
  dishwashers: 'DW-04',
  'ovens-ranges': 'OV-05',
  freezers: 'FZ-06',
  microwaves: 'MW-07'
};

export const ServicesPage = () => {
  const navigate = useNavigate();
  const { setPrefillData } = useBooking();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [savedServices, setSavedServices] = useState(['RF-01', 'WM-02']);
  const [comparedServices, setComparedServices] = useState(['RF-01']);
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState(null);

  const filterCategories = [
    { label: 'All', key: 'All' },
    { label: 'Refrigeration', key: 'REFRIGERATION' },
    { label: 'Laundry', key: 'LAUNDRY' },
    { label: 'Kitchen', key: 'KITCHEN' },
    { label: 'Cooking', key: 'COOKING' }
  ];

  // Dynamic count for filter pills matching reference Image 1
  const filterCounts = useMemo(() => {
    const counts = { All: APPLIANCE_CATEGORIES.length };
    APPLIANCE_CATEGORIES.forEach((app) => {
      const tag = app.tag.toUpperCase();
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredServices = useMemo(() => {
    return APPLIANCE_CATEGORIES.filter((app) => {
      const matchFilter =
        selectedFilter === 'All' ||
        app.tag.toUpperCase() === selectedFilter.toUpperCase();

      const matchSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.popularBrands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.commonIssues.some((issue) => issue.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchFilter && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.diagnosticFee - b.diagnosticFee;
      if (sortBy === 'price-high') return b.diagnosticFee - a.diagnosticFee;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [selectedFilter, searchQuery, sortBy]);

  const handleToggleSave = (code, name, e) => {
    e.stopPropagation();
    setSavedServices((prev) => {
      const isSaved = prev.includes(code);
      if (isSaved) {
        showToast(`Removed "${name}" from saved services.`, 'info');
        return prev.filter((c) => c !== code);
      } else {
        showToast(`Saved "${name}" to your favorites!`, 'success');
        return [...prev, code];
      }
    });
  };

  const handleToggleCompare = (code, name, e) => {
    e.stopPropagation();
    setComparedServices((prev) => {
      const isCompared = prev.includes(code);
      if (isCompared) {
        showToast(`Removed "${name}" from comparisons.`, 'info');
        return prev.filter((c) => c !== code);
      } else {
        showToast(`Added "${name}" to product comparison table!`, 'success');
        return [...prev, code];
      }
    });
  };

  const handleBook = (app) => {
    setPrefillData({
      appliance: app.name,
      applianceId: app.id,
      brand: app.popularBrands[0]
    });
    navigate('/book');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* --------------------------------------------------------------------------
          1. Header Section with Title, Subtitle, and View Toggles (Image 1)
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{
            fontSize: 'var(--fs-small)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#14308F',
            marginBottom: 4
          }}>
            OUR CATALOG
          </div>
          <h1 style={{
            fontSize: 'var(--fs-title)',
            fontWeight: 600,
            color: '#0A0A0F',
            lineHeight: 1.25,
            margin: '0 0 4px 0'
          }}>
            Appliance Repairs & Products
          </h1>
          <div style={{ fontSize: 'var(--fs-body)', color: '#7A8299', fontWeight: 500 }}>
            {filteredServices.length} models matching criteria
          </div>
        </div>

        {/* View Mode Toggle: Grid & List Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F1F5F9',
          padding: 4,
          borderRadius: 'var(--radius)',
          border: '1px solid #E2E8F0',
          gap: 4
        }}>
          <button
            onClick={() => setViewMode('grid')}
            className="tap-effect"
            style={{
              width: 'clamp(32px, 8.5vw, 36px)',
              height: 'clamp(32px, 8.5vw, 36px)',
              borderRadius: 'var(--space-2)',
              border: 'none',
              background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'grid' ? '#0B1F5C' : '#7A8299',
              boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(11,31,92,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid size={18} strokeWidth={2} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="tap-effect"
            style={{
              width: 'clamp(32px, 8.5vw, 36px)',
              height: 'clamp(32px, 8.5vw, 36px)',
              borderRadius: 'var(--space-2)',
              border: 'none',
              background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'list' ? '#0B1F5C' : '#7A8299',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(11,31,92,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label="List view"
            title="List view"
          >
            <List size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2. Search Input & Filter Chips Section
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {/* Search Input with Filter Sliders Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            height: 'var(--btn-h)',
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(10,20,60,0.04)'
          }}>
            <Search size={18} strokeWidth={2} color="#7A8299" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model or category..."
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                padding: '0 36px 0 42px',
                fontSize: 'var(--fs-body)',
                color: '#0A0A0F',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  background: 'none',
                  border: 'none',
                  color: '#7A8299',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Filter Sliders Button */}
          <button
            onClick={() => setSelectedFilter(selectedFilter === 'All' ? 'REFRIGERATION' : 'All')}
            className="tap-effect"
            style={{
              width: 'var(--btn-h)',
              height: 'var(--btn-h)',
              borderRadius: 'var(--radius)',
              background: '#FFFFFF',
              border: '1px solid #E3E7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14308F',
              boxShadow: '0 2px 8px rgba(10,20,60,0.04)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Filter options"
            aria-label="Filter options"
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Filter Pills with Counts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '2px 0'
        }}>
          {filterCategories.map((f) => {
            const isActive = selectedFilter === f.key;
            const count = filterCounts[f.key] || (f.key === 'All' ? APPLIANCE_CATEGORIES.length : 0);
            return (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className="tap-effect"
                style={{
                  height: 'clamp(30px, 8vw, 36px)',
                  background: isActive ? '#0B1F5C' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#1B2236',
                  border: isActive ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                  padding: '0 clamp(10px, 3vw, 14px)',
                  borderRadius: 9999,
                  fontSize: 'var(--fs-small)',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(11,31,92,0.2)' : 'none'
                }}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>⇅ Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                fontSize: 'var(--fs-small)',
                fontWeight: 600,
                color: '#0A0A0F',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          3. 2-Column Grid (Rule 1 & 6: 14px gap) OR List View
          -------------------------------------------------------------------------- */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--card-gap, clamp(8px, 2.5vw, 14px))'
        }}>
          {filteredServices.map((app) => {
            const code = SERVICE_CODES[app.id] || `AP-${app.id.slice(0, 2).toUpperCase()}`;
            const isSaved = savedServices.includes(code);
            const isCompared = comparedServices.includes(code);

            return (
              <div
                key={app.id}
                onClick={() => setSelectedServiceForDetail(app)}
                className="featured-repair-card tap-effect"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 4px 12px rgba(10, 20, 60, 0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  height: '100%',
                  boxSizing: 'border-box',
                  minWidth: 0
                }}
              >
                {/* Photo on top: aspect-ratio 4/3 */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                  <img
                    src={app.image}
                    alt={app.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Subtle navy gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(11, 31, 92, 0.25) 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* Icon buttons on photo */}
                  <div style={{
                    position: 'absolute',
                    top: 'clamp(6px, 1.8vw, 8px)',
                    right: 'clamp(6px, 1.8vw, 8px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(4px, 1.2vw, 6px)',
                    zIndex: 2
                  }}>
                    {/* Compare Button */}
                    <button
                      onClick={(e) => handleToggleCompare(code, app.name, e)}
                      className="tap-effect"
                      style={{
                        width: 'clamp(28px, 7.5vw, 34px)',
                        height: 'clamp(28px, 7.5vw, 34px)',
                        borderRadius: '50%',
                        background: isCompared ? '#0284C7' : '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 2px 6px rgba(10, 20, 60, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={isCompared ? 'In comparison' : 'Compare service'}
                      aria-label="Compare"
                    >
                      <Scale size={15} color={isCompared ? '#FFFFFF' : '#7A8299'} strokeWidth={2} />
                    </button>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => handleToggleSave(code, app.name, e)}
                      className="tap-effect"
                      style={{
                        width: 'clamp(28px, 7.5vw, 34px)',
                        height: 'clamp(28px, 7.5vw, 34px)',
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
                      title={isSaved ? 'Saved' : 'Save'}
                      aria-label="Save"
                    >
                      <Heart
                        size={15}
                        color={isSaved ? '#E11D48' : '#7A8299'}
                        fill={isSaved ? '#E11D48' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </div>

                {/* Content Under Photo */}
                <div style={{
                  padding: 'var(--card-pad, clamp(10px, 2.8vw, 12px))',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  boxSizing: 'border-box',
                  minWidth: 0
                }}>
                  {/* Row 1: Code on left, Price on right */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 'clamp(0.68rem, 2.8vw, 0.8rem)',
                      fontWeight: 600,
                      color: '#14308F',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
                    }}>
                      {code}
                    </span>
                    <span style={{ fontSize: 'clamp(0.68rem, 2.8vw, 0.8rem)', fontWeight: 600, color: '#0A0A0F' }}>
                      From ${app.diagnosticFee}
                    </span>
                  </div>

                  {/* Row 2: Service Title (single line with ellipsis) */}
                  <div style={{
                    fontSize: 'var(--text-card-title, clamp(0.85rem, 3.6vw, 1rem))',
                    fontWeight: 600,
                    color: '#0A0A0F',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25,
                    marginTop: 3,
                    minWidth: 0
                  }}>
                    {app.name}
                  </div>

                  {/* Thin divider line */}
                  <div style={{ height: 1, background: '#EEF1F8', margin: 'clamp(6px, 1.8vw, 8px) 0' }} />

                  {/* Row 3: Tag on left, Details with arrow on right */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <span style={{ fontSize: 'clamp(0.65rem, 2.6vw, 0.75rem)', color: '#7A8299', fontWeight: 400 }}>
                      Same-Day
                    </span>
                    <span style={{
                      fontSize: 'clamp(0.7rem, 2.8vw, 0.82rem)',
                      fontWeight: 600,
                      color: '#14308F',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {filteredServices.map((app) => {
            const code = SERVICE_CODES[app.id] || `AP-${app.id.slice(0, 2).toUpperCase()}`;
            return (
              <div
                key={app.id}
                className="featured-repair-card tap-effect"
                style={{
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-2)',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 'var(--space-2)',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 4px 12px rgba(10,20,60,0.08)'
                }}
              >
                <div style={{
                  width: 'clamp(72px, 20vw, 84px)',
                  height: 'clamp(72px, 20vw, 84px)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img
                    src={app.image}
                    alt={app.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: '#14308F', fontFamily: 'monospace' }}>
                      {code}
                    </span>
                    <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: '#0A0A0F' }}>
                      From ${app.diagnosticFee}
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--fs-card)', fontWeight: 600, color: '#0A0A0F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {app.name}
                  </div>
                  <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>
                    {app.estDuration} • 90-Day Guarantee
                  </div>
                </div>
                <button
                  onClick={() => setSelectedServiceForDetail(app)}
                  className="tap-effect"
                  style={{
                    height: 'clamp(36px, 9vw, 40px)',
                    padding: '0 clamp(12px, 3.5vw, 16px)',
                    fontSize: 'var(--fs-small)',
                    fontWeight: 600,
                    borderRadius: 9999,
                    background: '#E8ECF8',
                    color: '#14308F',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --------------------------------------------------------------------------
          6. Interactive Service Detail Modal
          -------------------------------------------------------------------------- */}
      {selectedServiceForDetail && (
        <div className="sheet-backdrop" onClick={() => setSelectedServiceForDetail(null)}>
          <div
            className="sheet-container glass-strong card-gloss"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '88vh', borderRadius: '24px 24px 0 0' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="sheet-drag-handle" />

            <div className="sheet-body" style={{ padding: '0 var(--space-3) var(--space-3) var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{
                    fontSize: 'var(--fs-small)',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#14308F',
                    background: '#E8ECF8',
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    {SERVICE_CODES[selectedServiceForDetail.id] || 'AP-01'}
                  </span>
                  <h2 style={{ fontSize: 'var(--fs-title)', fontWeight: 700, color: '#0A0A0F', marginTop: 4, marginBottom: 2 }}>
                    {selectedServiceForDetail.name}
                  </h2>
                  <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>
                    {selectedServiceForDetail.estDuration} • {selectedServiceForDetail.warranty}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedServiceForDetail(null)}
                  className="icon-btn-header"
                  style={{ width: 30, height: 30, color: '#7A8299' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Photo */}
              <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
                <img
                  src={selectedServiceForDetail.image}
                  alt={selectedServiceForDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <p style={{ fontSize: 'var(--fs-body)', color: '#4A5A78', lineHeight: 1.45, marginBottom: 14 }}>
                {selectedServiceForDetail.fullDesc || selectedServiceForDetail.shortDesc}
              </p>

              {/* Pricing breakdown pill */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #EEF1F8',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-2)',
                marginBottom: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 'var(--fs-card)', fontWeight: 700, color: '#14308F' }}>
                    ${selectedServiceForDetail.diagnosticFee} Multi-Point Diagnostic
                  </div>
                  <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>
                    100% credited toward total repair bill if approved
                  </div>
                </div>
                <ShieldCheck size={20} color="#14308F" />
              </div>

              {/* Common Symptoms */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 'var(--fs-small)', fontWeight: 700, color: '#0A0A0F', marginBottom: 6 }}>
                  Common Symptoms Handled:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedServiceForDetail.commonIssues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-small)', color: '#4A5A78' }}>
                      <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0 }} />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedServiceForDetail(null);
                  handleBook(selectedServiceForDetail);
                }}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{
                  height: 'var(--btn-h)',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 600,
                  borderRadius: 9999,
                  background: '#14308F',
                  color: '#FFFFFF'
                }}
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
