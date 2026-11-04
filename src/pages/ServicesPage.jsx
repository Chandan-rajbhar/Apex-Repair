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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* --------------------------------------------------------------------------
          1. Header Section with Title, Subtitle, and View Toggles (Image 1)
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#14308F',
            marginBottom: 4
          }}>
            OUR CATALOG
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#0A0A0F',
            lineHeight: 1.25,
            margin: '0 0 4px 0'
          }}>
            Appliance Repairs & Products
          </h1>
          <div style={{ fontSize: '13px', color: '#7A8299', fontWeight: 500 }}>
            {filteredServices.length} models matching criteria
          </div>
        </div>

        {/* View Mode Toggle: Grid & List Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F1F5F9',
          padding: 4,
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          gap: 4
        }}>
          <button
            onClick={() => setViewMode('grid')}
            className="tap-effect"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
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
            <LayoutGrid size={20} strokeWidth={2} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="tap-effect"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
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
            <List size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2. Search Input & Filter Chips Section
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Search Input with Filter Sliders Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            position: 'relative',
            flex: 1,
            height: 44,
            background: '#FFFFFF',
            borderRadius: 12,
            border: '1px solid #E3E7F2',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(10,20,60,0.04)'
          }}>
            <Search size={20} strokeWidth={2} color="#7A8299" style={{ position: 'absolute', left: 14, pointerEvents: 'none' }} />
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
                fontSize: '14px',
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
              width: 44,
              height: 44,
              borderRadius: 12,
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
            <SlidersHorizontal size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Filter Pills with Counts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
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
                  height: 36,
                  background: isActive ? '#0B1F5C' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#1B2236',
                  border: isActive ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                  padding: '0 16px',
                  borderRadius: 9999,
                  fontSize: '12px',
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
            <span style={{ fontSize: '13px', color: '#7A8299' }}>⇅ Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0A0A0F',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
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
          gap: 14
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
                  borderRadius: 20,
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 4px 12px rgba(10, 20, 60, 0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  height: '100%',
                  boxSizing: 'border-box'
                }}
              >
                {/* Rule 4: Photo on top, height 115px */}
                <div style={{ position: 'relative', width: '100%', height: 115, overflow: 'hidden' }}>
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

                  {/* Rule 4: Icon buttons on photo (40px circles, 8px from top and right, 8px between) */}
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    zIndex: 2
                  }}>
                    {/* Compare Button */}
                    <button
                      onClick={(e) => handleToggleCompare(code, app.name, e)}
                      className="tap-effect"
                      style={{
                        width: 40,
                        height: 40,
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
                      <Scale size={20} color={isCompared ? '#FFFFFF' : '#7A8299'} strokeWidth={2} />
                    </button>

                    {/* Heart Save Button */}
                    <button
                      onClick={(e) => handleToggleSave(code, app.name, e)}
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
                      title={isSaved ? 'Saved' : 'Save'}
                      aria-label="Save"
                    >
                      <Heart
                        size={20}
                        color={isSaved ? '#E11D48' : '#7A8299'}
                        fill={isSaved ? '#E11D48' : 'none'}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                </div>

                {/* Rule 4: Content Under Photo (Padding 12px) */}
                <div style={{
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  boxSizing: 'border-box'
                }}>
                  {/* Row 1: Code on left (navy monospace), Price on right */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#14308F',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
                    }}>
                      {code}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>
                      From ${app.diagnosticFee}
                    </span>
                  </div>

                  {/* Row 2: Service Title (single line with ellipsis) */}
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
                    {app.name}
                  </div>

                  {/* Thin divider line (#EEF1F8, 12px above and below) */}
                  <div style={{ height: 1, background: '#EEF1F8', margin: '12px 0' }} />

                  {/* Row 3: Tag on left, Details with arrow on right */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <span style={{ fontSize: '13px', color: '#7A8299', fontWeight: 400 }}>
                      Same-Day
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
      ) : (
        /* List View */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredServices.map((app) => {
            const code = SERVICE_CODES[app.id] || `AP-${app.id.slice(0, 2).toUpperCase()}`;
            return (
              <div
                key={app.id}
                className="featured-repair-card tap-effect"
                style={{
                  borderRadius: 20,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'center',
                  background: '#FFFFFF',
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 4px 12px rgba(10,20,60,0.08)'
                }}
              >
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: 14,
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
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#14308F', fontFamily: 'monospace' }}>
                      {code}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>
                      From ${app.diagnosticFee}
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {app.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#7A8299' }}>
                    {app.estDuration} • 90-Day Guarantee
                  </div>
                </div>
                <button
                  onClick={() => setSelectedServiceForDetail(app)}
                  className="tap-effect"
                  style={{
                    height: 44,
                    padding: '0 16px',
                    fontSize: '14px',
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

            <div className="sheet-body" style={{ padding: '0 18px 24px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#14308F',
                    background: '#E8ECF8',
                    padding: '2px 8px',
                    borderRadius: 6
                  }}>
                    {SERVICE_CODES[selectedServiceForDetail.id] || 'AP-01'}
                  </span>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A0A0F', marginTop: 4, marginBottom: 2 }}>
                    {selectedServiceForDetail.name}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#7A8299' }}>
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
              <div style={{ width: '100%', height: 140, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
                <img
                  src={selectedServiceForDetail.image}
                  alt={selectedServiceForDetail.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#4A5A78', lineHeight: 1.45, marginBottom: 14 }}>
                {selectedServiceForDetail.fullDesc || selectedServiceForDetail.shortDesc}
              </p>

              {/* Pricing breakdown pill */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #EEF1F8',
                borderRadius: 12,
                padding: '10px 12px',
                marginBottom: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14308F' }}>
                    ${selectedServiceForDetail.diagnosticFee} Multi-Point Diagnostic
                  </div>
                  <div style={{ fontSize: '11px', color: '#7A8299' }}>
                    100% credited toward total repair bill if approved
                  </div>
                </div>
                <ShieldCheck size={20} color="#14308F" />
              </div>

              {/* Common Symptoms */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0A0A0F', marginBottom: 6 }}>
                  Common Symptoms Handled:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selectedServiceForDetail.commonIssues.slice(0, 3).map((issue, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#4A5A78' }}>
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
                  height: 44,
                  fontSize: '13px',
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
