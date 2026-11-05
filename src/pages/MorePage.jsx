import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  CheckCircle2,
  Camera,
  Pencil,
  Building2,
  Mail,
  Phone,
  Heart,
  CalendarCheck2,
  Receipt,
  ShieldCheck,
  Bell,
  Headset,
  Settings,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Search,
  Save,
  X,
  Download,
  AlertTriangle,
  HelpCircle,
  Truck,
  Check,
  ExternalLink,
  Trash2,
  Clock,
  Sparkles,
  ChevronDown,
  Shield,
  FileText,
  Wrench
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { COMPANY_INFO, getServiceImage } from '../data/appliancesData';

export const MorePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateProfile, logout } = useAuth();
  const { activeBooking } = useBooking();
  const { openChat } = useChat();
  const { showToast } = useToast();

  // Current active sub-view: null (main profile), 'edit-profile', 'saved-items', 'my-bookings', 'invoices', 'warranty', 'notifications', 'support', 'settings'
  const subView = searchParams.get('sub') || null;

  const openSubView = (key) => {
    setSearchParams({ sub: key });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSubView = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile credentials
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_profile_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          role: parsed.role?.toLowerCase().includes('solar') ? 'Test Engineer' : (parsed.role || 'Test Engineer')
        };
      }
    } catch {}
    return {
      name: user?.name || 'Saurabh Yadav',
      role: 'Test Engineer',
      company: 'Apex Energy Partners LLC',
      email: user?.email || 'demo@apex.com',
      phone: user?.phone || '(877) 225-2046',
      address: '452 Lexington Ave, Floor 14, New York, NY 10017'
    };
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  // Saved Appliance Repairs List
  const [savedItems, setSavedItems] = useState(() => {
    try {
      const s = localStorage.getItem('apex_saved_repairs');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [
            {
              code: 'AC-01',
              name: 'AC Repair & Precision Tune-Up',
              category: 'Air Conditioners',
              price: '$49',
              tag: 'Same-day',
              image: '/images/services/ac.jpg',
              desc: 'Split AC diagnostics, refrigerant check, coil deep clean, and digital PCB testing.'
            },
            {
              code: 'RF-03',
              name: 'Refrigerator Diagnostic & Cooling Repair',
              category: 'Refrigerators',
              price: '$45',
              tag: 'Same-day',
              image: '/images/services/refrigerator.jpg',
              desc: 'Digital inverter diagnostics, sealed cooling system check, defrost sensor & fan motor service.'
            }
          ];
        }
      }
    } catch {}
    return [
      {
        code: 'AC-01',
        name: 'AC Repair & Precision Tune-Up',
        category: 'Air Conditioners',
        price: '$49',
        tag: 'Same-day',
        image: '/images/services/ac.jpg',
        desc: 'Split AC diagnostics, refrigerant check, coil deep clean, and digital PCB testing.'
      },
      {
        code: 'RF-03',
        name: 'Refrigerator Diagnostic & Cooling Repair',
        category: 'Refrigerators',
        price: '$45',
        tag: 'Same-day',
        image: '/images/services/refrigerator.jpg',
        desc: 'Digital inverter diagnostics, sealed cooling system check, defrost sensor & fan motor service.'
      },
      {
        code: 'WM-02',
        name: 'Washing Machine Drum & Pump Repair',
        category: 'Washing Machines',
        price: '$39',
        tag: 'Same-day',
        image: '/images/services/washing-machine.jpg',
        desc: 'Drum balancing, pump replacement, door seal gasket fix, and electronic error clearing.'
      }
    ];
  });

  const handleRemoveSaved = (code) => {
    setSavedItems((prev) => {
      const next = prev.filter(item => item.code !== code);
      try {
        localStorage.setItem('apex_saved_repairs', JSON.stringify(next.map(i => i.code)));
      } catch {}
      return next;
    });
    showToast('Removed item from saved repairs', 'info');
  };

  // Notification toggles state
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(null);

  // Issue reporting form state
  const [reportForm, setReportForm] = useState({ orderId: 'AR-1024', issueType: 'Scheduling', message: '' });

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    if (!editForm.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setProfileData({ ...editForm });
    try {
      localStorage.setItem('apex_profile_data', JSON.stringify(editForm));
    } catch {}
    if (updateProfile) {
      updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      });
    }
    showToast('Profile updated successfully!', 'success');
    closeSubView();
  };

  // ============================================================================
  // SUB-UI 1: EDIT PROFILE VIEW
  // ============================================================================
  if (subView === 'edit-profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header with back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Edit Profile Details
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Update your contact and account credentials for repair orders and receipts.
          </p>
        </div>

        {/* Edit Form Card */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 20,
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                style={{
                  width: '100%',
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Role / Title
              </label>
              <input
                type="text"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                style={{
                  width: '100%',
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{
                  width: '100%',
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                style={{
                  width: '100%',
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Service Address
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                style={{
                  width: '100%',
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={closeSubView}
              className="tap-effect"
              style={{
                flex: 1,
                height: 'var(--btn-h)',
                borderRadius: 9999,
                background: '#FFFFFF',
                border: '1px solid #E3E7F2',
                color: '#1B2236',
                fontSize: 'var(--fs-body)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tap-effect"
              style={{
                flex: 2,
                height: 'var(--btn-h)',
                borderRadius: 9999,
                background: '#0B1F5C',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 'var(--fs-body)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 2: SAVED ITEMS VIEW (Replaces Saved Inverters)
  // ============================================================================
  if (subView === 'saved-items') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Saved Items</span>
          </button>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A8299', background: '#F1F5F9', padding: '4px 10px', borderRadius: 9999 }}>
            {savedItems.length} Saved
          </span>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Saved Appliances & Services
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Quickly book appointments or review diagnostic specs for your saved repairs.
          </p>
        </div>

        {savedItems.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 32,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}>
            <Heart size={36} color="#A0AEC0" strokeWidth={1.5} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#0A0A0F' }}>No Saved Items</div>
            <div style={{ fontSize: '14px', color: '#7A8299', maxWidth: 280 }}>
              You haven't saved any appliance repairs yet. Explore our services to bookmark them.
            </div>
            <button
              onClick={() => navigate('/services')}
              className="tap-effect"
              style={{
                marginTop: 8,
                height: 40,
                padding: '0 20px',
                borderRadius: 9999,
                background: '#0B1F5C',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {savedItems.map((item) => (
              <div
                key={item.code}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image and Code/Price Row */}
                <div style={{ position: 'relative', height: 115, width: '100%', overflow: 'hidden', background: 'linear-gradient(160deg, #2F54B8, #0B1F5C)' }}>
                  {/* Fallback background icon */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}>
                    <Wrench size={26} color="#FFFFFF" />
                  </div>

                  <img
                    src={getServiceImage(item).src}
                    alt={getServiceImage(item).alt}
                    loading="lazy"
                    style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Light navy gradient overlay on bottom 30% */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background: 'linear-gradient(180deg, transparent 70%, rgba(11, 31, 92, 0.25) 100%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0B1F5C'
                  }}>
                    {item.price}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    background: 'rgba(11, 31, 92, 0.85)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#FFFFFF'
                  }}>
                    {item.code}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', lineHeight: 1.3 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7A8299', marginTop: 2 }}>
                        {item.category} • {item.tag} Dispatch
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#5B6478', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>

                  <div style={{ height: 1, background: '#EEF1F8', margin: '4px 0' }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={() => handleRemoveSaved(item.code)}
                      className="tap-effect"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: 0
                      }}
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => navigate('/book')}
                      className="tap-effect"
                      style={{
                        height: 36,
                        padding: '0 16px',
                        borderRadius: 9999,
                        background: '#0B1F5C',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <span>Book Service</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 3: MY BOOKINGS VIEW
  // ============================================================================
  if (subView === 'my-bookings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>My Bookings</span>
          </button>
          <button
            onClick={() => navigate('/book')}
            className="tap-effect"
            style={{
              height: 32,
              padding: '0 14px',
              borderRadius: 9999,
              background: '#0B1F5C',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + New Booking
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Service History & Appointments
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            View live status, reschedule upcoming appointments, and access past repair receipts.
          </p>
        </div>

        {/* 1. ACTIVE LIVE BOOKING */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius)',
          border: '1.5px solid #14308F',
          boxShadow: '0 6px 20px rgba(11,31,92,0.1)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#14308F', background: '#E8ECF8', padding: '3px 8px', borderRadius: 6 }}>
              #AR-1024
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
              LIVE • Step 4 of 9
            </span>
          </div>

          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
              Washing Machine Repair
            </div>
            <div style={{ fontSize: '13px', color: '#5B6478', marginTop: 2 }}>
              Today, 2:00 PM – 4:00 PM • Master Tech Marcus Vance (4.9★)
            </div>
            <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600, marginTop: 4 }}>
              Van en route • Estimated arrival in ~12 mins
            </div>
          </div>

          <div style={{ height: 1, background: '#EEF1F8' }} />

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/track')}
              className="tap-effect"
              style={{
                flex: 1,
                height: 40,
                borderRadius: 9999,
                background: '#0B1F5C',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Truck size={16} />
              <span>Track Order Live</span>
            </button>
            <button
              onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
              className="tap-effect"
              style={{
                height: 40,
                padding: '0 14px',
                borderRadius: 9999,
                background: '#F8FAFC',
                border: '1px solid #E3E7F2',
                color: '#1B2236',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Phone size={15} color="#0B1F5C" />
              <span>Call Tech</span>
            </button>
          </div>
        </div>

        {/* 2. COMPLETED PAST BOOKINGS */}
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          marginTop: 8
        }}>
          PAST COMPLETED REPAIRS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Past 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 16,
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#7A8299' }}>
                #AR-0982
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 6 }}>
                Completed Nov 1, 2026
              </span>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                Refrigerator Compressor & Defrost Service
              </div>
              <div style={{ fontSize: '12px', color: '#5B6478', marginTop: 2 }}>
                Tech Elena Rostova • Total Paid: $149.00
              </div>
              <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} color="#16A34A" />
                90-Day Parts & Labor Warranty Active (Through Jan 30, 2027)
              </div>
            </div>

            <div style={{ height: 1, background: '#EEF1F8' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => openSubView('invoices')}
                className="tap-effect"
                style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, color: '#14308F', cursor: 'pointer', padding: 0 }}
              >
                View Invoice Receipt &rarr;
              </button>
              <button
                onClick={() => navigate('/book')}
                className="tap-effect"
                style={{ height: 32, padding: '0 12px', borderRadius: 9999, background: '#F1F5FB', border: 'none', fontSize: '12px', fontWeight: 600, color: '#0B1F5C', cursor: 'pointer' }}
              >
                Book Again
              </button>
            </div>
          </div>

          {/* Past 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 16,
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#7A8299' }}>
                #AR-0941
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: 6 }}>
                Completed Oct 18, 2026
              </span>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                Split AC Deep Cleaning & Refrigerant Top-Up
              </div>
              <div style={{ fontSize: '12px', color: '#5B6478', marginTop: 2 }}>
                Tech David Chen • Total Paid: $79.00
              </div>
            </div>

            <div style={{ height: 1, background: '#EEF1F8' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => openSubView('invoices')}
                className="tap-effect"
                style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, color: '#14308F', cursor: 'pointer', padding: 0 }}
              >
                View Invoice Receipt &rarr;
              </button>
              <button
                onClick={() => navigate('/book')}
                className="tap-effect"
                style={{ height: 32, padding: '0 12px', borderRadius: 9999, background: '#F1F5FB', border: 'none', fontSize: '12px', fontWeight: 600, color: '#0B1F5C', cursor: 'pointer' }}
              >
                Book Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 4: INVOICES & RECEIPTS VIEW
  // ============================================================================
  if (subView === 'invoices') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Invoices & Receipts</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Billing & Payment Receipts
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Itemized breakdown for diagnostics, parts, and labor covered by your 90-day warranty.
          </p>
        </div>

        {/* Summary Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
          borderRadius: 'var(--radius)',
          padding: 18,
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 18px rgba(11,31,92,0.2)'
        }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Repairs Cleared
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, marginTop: 2 }}>$228.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: 9999 }}>
              2 Invoices Paid
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Invoice 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 16,
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0F' }}>
                  Invoice #INV-2026-088
                </div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>
                  Order #AR-0982 • Nov 1, 2026
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: 9999 }}>
                PAID
              </span>
            </div>

            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 12, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6478' }}>Diagnostic & Sealed System Test</span>
                <span style={{ fontWeight: 600, color: '#0A0A0F' }}>$79.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6478' }}>OEM Defrost Sensor & Harness</span>
                <span style={{ fontWeight: 600, color: '#0A0A0F' }}>$45.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6478' }}>Master Technician Labor</span>
                <span style={{ fontWeight: 600, color: '#0A0A0F' }}>$25.00</span>
              </div>
              <div style={{ height: 1, background: '#E3E7F2', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#0A0A0F' }}>Total (Paid via Visa •••• 4242)</span>
                <span style={{ color: '#0B1F5C', fontSize: '15px' }}>$149.00</span>
              </div>
            </div>

            <button
              onClick={() => showToast('Receipt #INV-2026-088 downloaded as PDF', 'success')}
              className="tap-effect"
              style={{
                height: 38,
                borderRadius: 9999,
                background: '#F1F5FB',
                border: 'none',
                color: '#0B1F5C',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Download size={15} />
              <span>Download PDF Receipt</span>
            </button>
          </div>

          {/* Invoice 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius)',
            border: '1px solid #E3E7F2',
            padding: 16,
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0F' }}>
                  Invoice #INV-2026-042
                </div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>
                  Order #AR-0941 • Oct 18, 2026
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: 9999 }}>
                PAID
              </span>
            </div>

            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 12, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6478' }}>Split AC Coil Deep Clean & Re-gas</span>
                <span style={{ fontWeight: 600, color: '#0A0A0F' }}>$79.00</span>
              </div>
              <div style={{ height: 1, background: '#E3E7F2', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#0A0A0F' }}>Total (Paid via Apple Pay)</span>
                <span style={{ color: '#0B1F5C', fontSize: '15px' }}>$79.00</span>
              </div>
            </div>

            <button
              onClick={() => showToast('Receipt #INV-2026-042 downloaded as PDF', 'success')}
              className="tap-effect"
              style={{
                height: 38,
                borderRadius: 9999,
                background: '#F1F5FB',
                border: 'none',
                color: '#0B1F5C',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Download size={15} />
              <span>Download PDF Receipt</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 5: WARRANTY & MANUALS VIEW
  // ============================================================================
  if (subView === 'warranty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Warranty & Manuals</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Warranty Coverage & Docs
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            All completed repairs are protected by Apex's 90-Day 100% parts & labor guarantee.
          </p>
        </div>

        {/* Active Warranty Card */}
        <div style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
          borderRadius: 'var(--radius)',
          padding: 20,
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 6px 20px rgba(6,78,59,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="#A7F3D0" />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>90-Day Guarantee Active</div>
              <div style={{ fontSize: '12px', opacity: 0.85 }}>Certificate #WAR-APX-8821</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.4, opacity: 0.9 }}>
            Covers 100% of OEM parts replacement, sensor calibration, and master technician re-visit labor through January 30, 2027.
          </div>
          <button
            onClick={() => showToast('Official Warranty Certificate downloaded', 'success')}
            className="tap-effect"
            style={{
              height: 38,
              borderRadius: 9999,
              background: '#FFFFFF',
              color: '#064E3B',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 4
            }}
          >
            <Download size={15} />
            <span>Download Warranty Certificate</span>
          </button>
        </div>

        {/* Appliance Maintenance Manuals */}
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          marginTop: 6
        }}>
          CARE GUIDES & OEM MANUALS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Washing Machine Drum & Filter Care Guide', size: '1.2 MB PDF' },
            { title: 'Refrigerator Coil Efficiency & Temperature Checklist', size: '850 KB PDF' },
            { title: 'Split AC Seasonal Maintenance & Filter Protocol', size: '1.5 MB PDF' },
            { title: 'Dishwasher Spray Arm & Drainage Clearing Steps', size: '920 KB PDF' }
          ].map((doc, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E3E7F2',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} color="#16A34A" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>{doc.title}</div>
                  <div style={{ fontSize: '11px', color: '#7A8299' }}>{doc.size}</div>
                </div>
              </div>
              <button
                onClick={() => showToast(`Downloaded ${doc.title}`, 'success')}
                className="tap-effect"
                style={{
                  height: 32,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#F1F5FB',
                  border: '1px solid #E3E7F2',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0B1F5C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Download size={13} />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 6: NOTIFICATIONS PREFERENCES VIEW
  // ============================================================================
  if (subView === 'notifications') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Notifications</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Notification Preferences
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Choose how you receive technician arrival alerts, order updates, and receipts.
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {[
            { label: 'SMS Technician Arrival Alerts', desc: 'Real-time text when technician is 15 minutes away', state: notifSms, set: setNotifSms },
            { label: 'Email Invoices & Guarantee Cards', desc: 'Itemized PDF receipts and warranty certificates', state: notifEmail, set: setNotifEmail },
            { label: 'Live Tracking Push Notifications', desc: 'Order status changes from booking to completion', state: notifPush, set: setNotifPush },
            { label: 'Seasonal Maintenance Reminders', desc: 'Twice-a-year reminders for coil cleaning & AC servicing', state: notifPromo, set: setNotifPromo }
          ].map((item, idx, arr) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: idx < arr.length - 1 ? '1px solid #EEF1F8' : 'none'
              }}
            >
              <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#7A8299', marginTop: 2 }}>{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => {
                  item.set(e.target.checked);
                  showToast('Notification preference updated', 'info');
                }}
                style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#0B1F5C' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 7: HELP & SUPPORT DESK VIEW
  // ============================================================================
  if (subView === 'support') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Help & Support</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Help & Verification Desk
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Direct access to senior master supervisors, emergency dispatch, and live chat.
          </p>
        </div>

        {/* 1. Emergency Dispatch Card */}
        <div
          onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
          className="tap-effect"
          style={{
            background: '#FDECEC',
            borderRadius: 'var(--radius)',
            border: '1px solid #FCA5A5',
            padding: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={20} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>24/7 Emergency Dispatch Hotline</div>
              <div style={{ fontSize: '12px', color: '#7A8299' }}>Tap to call (877) 225-2046 directly</div>
            </div>
          </div>
          <ChevronRight size={18} color="#DC2626" />
        </div>

        {/* 2. Direct Support Channels */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {/* Live Chat */}
          <div
            onClick={() => { closeSubView(); openChat(); }}
            className="tap-effect"
            style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #EEF1F8' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headset size={20} color="#0284C7" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Live Chat Support</div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>Instant AI & Master Tech response</div>
              </div>
            </div>
            <ChevronRight size={18} color="#8A92A6" />
          </div>

          {/* Email Support */}
          <div
            onClick={() => { window.location.href = 'mailto:support@apexrepair.com'; }}
            className="tap-effect"
            style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #EEF1F8' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} color="#7C3AED" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Email Desk</div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>support@apexrepair.com (Within 1 hour)</div>
              </div>
            </div>
            <ChevronRight size={18} color="#8A92A6" />
          </div>

          {/* Working Hours */}
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Working Hours</div>
              <div style={{ fontSize: '12px', color: '#7A8299' }}>Monday – Sunday, 7:00 AM – 10:00 PM EST</div>
            </div>
          </div>
        </div>

        {/* 3. Frequently Asked Questions */}
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600
        }}>
          FREQUENTLY ASKED QUESTIONS
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius)',
          border: '1px solid #E3E7F2',
          overflow: 'hidden'
        }}>
          {[
            {
              q: 'What is included in the diagnostic fee?',
              a: 'The $79 diagnostic covers comprehensive electrical, mechanical, and safety inspections by a certified master technician. If you approve the repair, the diagnostic fee is 100% applied toward your total invoice.'
            },
            {
              q: 'How does the 90-day warranty work?',
              a: 'Every repair is backed by a 90-day parts and labor guarantee. If the same appliance breakdown re-occurs within 90 days, we dispatch a senior technician to service it free of charge.'
            },
            {
              q: 'Can I track my technician in real time?',
              a: 'Yes! Once your order is dispatched, you can view live GPS van tracking, step-by-step progress, and estimated arrival time on our Track page.'
            }
          ].map((faq, idx, arr) => (
            <div key={idx} style={{ borderBottom: idx < arr.length - 1 ? '1px solid #EEF1F8' : 'none' }}>
              <div
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>{faq.q}</span>
                <ChevronDown
                  size={16}
                  color="#7A8299"
                  style={{
                    transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </div>
              {openFaq === idx && (
                <div style={{ padding: '0 16px 14px 16px', fontSize: '13px', color: '#5B6478', lineHeight: 1.5 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SUB-UI 8: APP SETTINGS & CACHE VIEW
  // ============================================================================
  if (subView === 'settings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', paddingBottom: 'var(--page-pad-bottom)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={closeSubView}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '15px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>App Settings</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Settings & Storage
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Manage local storage, offline cache, and application parameters.
          </p>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius)',
          border: '1px solid #E3E7F2',
          padding: 20,
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Local Storage & Cache</div>
              <div style={{ fontSize: '12px', color: '#7A8299' }}>Cached service catalogs and offline maps</div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0B1F5C', background: '#F1F5FB', padding: '4px 10px', borderRadius: 8 }}>
              4.2 MB
            </span>
          </div>

          <button
            onClick={() => {
              showToast('Cache cleared successfully! (4.2 MB freed)', 'success');
            }}
            className="tap-effect"
            style={{
              height: 42,
              borderRadius: 12,
              background: '#F1F5FB',
              border: '1px solid #E3E7F2',
              color: '#0B1F5C',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear App Cache & Data
          </button>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius)',
          border: '1px solid #E3E7F2',
          padding: 20,
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>App Version</span>
            <span style={{ fontSize: '13px', color: '#7A8299' }}>v2.4.0 (Build 2026.11)</span>
          </div>
          <div style={{ height: 1, background: '#EEF1F8' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Licensed Service Network</span>
            <span style={{ fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>OEM Certified</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN PROFILE VIEW (Matches User Request & Screenshots)
  // ============================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap, clamp(20px, 5.5vw, 26px))', paddingBottom: 'var(--page-pad-bottom, clamp(76px, 20vw, 96px))' }}>
      {/* --------------------------------------------------------------------------
          1. User Profile Header Card
          -------------------------------------------------------------------------- */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          padding: 'clamp(14px, 3.5vw, 18px)',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {/* Top Row: Avatar + Name & Role + Edit Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatar with Camera Badge */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: '#0B1F5C',
                  color: '#FFFFFF',
                  fontSize: '22px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 12px rgba(11,31,92,0.25)'
                }}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => openSubView('edit-profile')}
                className="tap-effect"
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#FF5A36',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                aria-label="Change photo"
              >
                <Camera size={12} strokeWidth={2} />
              </button>
            </div>

            {/* Name, Role & Verified Pill */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', lineHeight: 1.25 }}>
                  {profileData.name}
                </span>
                <CheckCircle2 size={16} color="#10B981" strokeWidth={2} />
              </div>
              <div style={{ fontSize: '14px', color: '#5B6478', marginTop: 2, lineHeight: 1.4 }}>
                {profileData.role}
              </div>
              <span style={{
                display: 'inline-block',
                marginTop: 6,
                padding: '2px 8px',
                borderRadius: 6,
                background: '#E8F1FC',
                color: '#14308F',
                fontSize: '12px',
                fontWeight: 600
              }}>
                Verified EPC Partner
              </span>
            </div>
          </div>

          {/* Edit Pencil Button */}
          <button
            onClick={() => {
              setEditForm({ ...profileData });
              openSubView('edit-profile');
            }}
            className="tap-effect"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #EEF1F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#7A8299',
              padding: 0
            }}
            title="Edit profile"
            aria-label="Edit profile"
          >
            <Pencil size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#EEF1F8' }} />

        {/* Contact info lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: '#5B6478' }}>
            <Building2 size={18} strokeWidth={2} color="#7A8299" style={{ flexShrink: 0 }} />
            <span>{profileData.company}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: '#5B6478' }}>
            <Mail size={18} strokeWidth={2} color="#7A8299" style={{ flexShrink: 0 }} />
            <span>{profileData.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: '#5B6478' }}>
            <Phone size={18} strokeWidth={2} color="#7A8299" style={{ flexShrink: 0 }} />
            <span>{profileData.phone}</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2. ACTIVITY & WORKSPACE Section (Website-Aligned: Track, Bookings, Saved, Invoices, Warranty)
          -------------------------------------------------------------------------- */}
      <div>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          marginBottom: 16
        }}>
          ACTIVITY & WORKSPACE
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {/* Row 1: Track Order (Redirects directly to existing /track route) */}
          <div
            onClick={() => navigate('/track')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Truck size={20} strokeWidth={2} color="#0284C7" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236', lineHeight: 1.2 }}>
                  Track Order
                </span>
                <span style={{ fontSize: '12px', color: '#14308F', fontWeight: 600, marginTop: 1 }}>
                  #AR-1024 • Van en route
                </span>
              </div>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>

          {/* Row 2: My Bookings (Opens My Bookings Sub-UI) */}
          <div
            onClick={() => openSubView('my-bookings')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CalendarCheck2 size={20} strokeWidth={2} color="#7C3AED" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                My Bookings
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>3</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 3: Saved Items (Replaces Saved Inverters - Opens Saved Items Sub-UI) */}
          <div
            onClick={() => openSubView('saved-items')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#FFE4E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Heart size={20} strokeWidth={2} color="#E11D48" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Saved Items
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>{savedItems.length}</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 4: Invoices & Receipts (Opens Invoices Sub-UI) */}
          <div
            onClick={() => openSubView('invoices')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Receipt size={20} strokeWidth={2} color="#D97706" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Invoices & Receipts
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>2</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 5: Warranty & Manuals (Opens Warranty Sub-UI) */}
          <div
            onClick={() => openSubView('warranty')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} strokeWidth={2} color="#16A34A" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Warranty & Manuals
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2.5 SAVED REPAIRS & SERVICES SECTION (Directly visible on Profile)
          -------------------------------------------------------------------------- */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}>
          <div style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#7A8299',
            fontWeight: 600
          }}>
            SAVED REPAIRS ({savedItems.length})
          </div>
          {savedItems.length > 0 && (
            <button
              onClick={() => openSubView('saved-items')}
              className="tap-effect"
              style={{
                background: 'none',
                border: 'none',
                color: '#14308F',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 0
              }}
            >
              <span>View all</span>
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {savedItems.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
              border: '1px solid #E3E7F2',
              padding: '24px 16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
            }}
          >
            <div style={{ fontSize: '13px', color: '#7A8299', marginBottom: 10 }}>
              You haven't saved any appliance repairs yet.
            </div>
            <button
              onClick={() => navigate('/services')}
              className="tap-effect"
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                background: '#0B1F5C',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 'var(--card-gap, clamp(8px, 2.2vw, 12px))'
            }}
          >
            {savedItems.slice(0, 4).map((item) => (
              <div
                key={item.code}
                onClick={() => openSubView('saved-items')}
                className="featured-repair-card tap-effect"
                style={{
                  borderRadius: 'var(--radius-card, clamp(12px, 3.2vw, 15px))',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  border: '1px solid #E3E7F2',
                  boxShadow: '0 3px 10px rgba(10, 20, 60, 0.05)',
                  cursor: 'pointer'
                }}
              >
                {/* Photo */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10.5',
                  overflow: 'hidden',
                  background: 'linear-gradient(160deg, #2F54B8, #0B1F5C)'
                }}>
                  <img
                    src={getServiceImage(item).src}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 30%',
                      display: 'block'
                    }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'clamp(5px, 1.5vw, 7px)',
                    right: 'clamp(5px, 1.5vw, 7px)',
                    zIndex: 2
                  }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}>
                      <Heart size={12} color="#E11D48" fill="#E11D48" strokeWidth={2} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  padding: 'clamp(7px, 2vw, 10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 'clamp(0.65rem, 2.4vw, 0.72rem)', fontWeight: 600, color: '#14308F' }}>
                      {item.code}
                    </span>
                    <span style={{ fontSize: 'clamp(0.66rem, 2.5vw, 0.74rem)', fontWeight: 600, color: '#0A0A0F' }}>
                      {item.price}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.78rem, 3vw, 0.86rem)',
                    fontWeight: 600,
                    color: '#0A0A0F',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.25
                  }}>
                    {item.name}
                  </div>
                  <div style={{ height: 1, background: '#EEF1F8', margin: 'clamp(4px, 1.2vw, 6px) 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: 'clamp(0.62rem, 2.3vw, 0.68rem)', color: '#7A8299' }}>{item.tag || 'Saved'}</span>
                    <span style={{ fontSize: 'clamp(0.65rem, 2.4vw, 0.72rem)', fontWeight: 600, color: '#14308F' }}>
                      Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------------
          3. PREFERENCES & SUPPORT Section (Notifications, Support, Settings, Sign Out)
          -------------------------------------------------------------------------- */}
      <div>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          marginBottom: 16
        }}>
          PREFERENCES & SUPPORT
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {/* Row 1: Notifications */}
          <div
            onClick={() => openSubView('notifications')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={20} strokeWidth={2} color="#D97706" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Notifications
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>

          {/* Row 2: Support & Verification Desk */}
          <div
            onClick={() => openSubView('support')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Headset size={20} strokeWidth={2} color="#0284C7" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Support & Verification Desk
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>

          {/* Row 3: App Settings & Cache */}
          <div
            onClick={() => openSubView('settings')}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Settings size={20} strokeWidth={2} color="#475569" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                App Settings & Cache
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>

          {/* Row 4: Sign Out */}
          <div
            onClick={() => {
              if (logout) logout();
              showToast('Signed out of partner workspace.', 'info');
            }}
            className="app-profile-row tap-effect"
            style={{
              height: 56,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="app-profile-icon-tile" style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <LogOut size={20} strokeWidth={2} color="#DC2626" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#DC2626' }}>
                Sign Out
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>
        </div>
      </div>
    </div>
  );
};
