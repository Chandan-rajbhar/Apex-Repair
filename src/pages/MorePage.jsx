import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CheckCircle2,
  Camera,
  Pencil,
  Building2,
  Mail,
  Phone,
  Heart,
  Scale,
  MessageSquare,
  FileText,
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
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { COMPANY_INFO } from '../data/appliancesData';

export const MorePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { activeBooking } = useBooking();
  const { openChat } = useChat();
  const { showToast } = useToast();

  // Mode: 'profile' (Image 2) or 'edit' (Image 3)
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile data matching reference screenshot
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Morgan',
    role: 'Lead Solar Solutions Engineer',
    company: 'Apex Energy Partners LLC',
    email: user?.email || 'alex.morgan@apexenergy.com',
    phone: user?.phone || '+1 (555) 382-9011',
    address: '452 Lexington Ave, Floor 14, New York, NY 10017'
  });

  // Edit form state
  const [editForm, setEditForm] = useState({ ...profileData });

  // Modals for row interactions
  const [activeModal, setActiveModal] = useState(null);

  // Notification toggles
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifTracking, setNotifTracking] = useState(true);

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    if (!editForm.name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setProfileData({ ...editForm });
    if (updateProfile) {
      updateProfile({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address
      });
    }
    showToast('Profile credentials updated successfully!', 'success');
    setIsEditingProfile(false);
  };

  // ============================================================================
  // VIEW 1: EDIT PROFILE SCREEN (Matches Image 3)
  // ============================================================================
  if (isEditingProfile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header with back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setIsEditingProfile(false)}
            className="tap-effect"
            style={{
              height: 44,
              background: 'none',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '14px',
              fontWeight: 600,
              color: '#0A0A0F',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <ArrowLeft size={20} strokeWidth={2} color="#0A0A0F" />
            <span>Edit Profile</span>
          </button>
          <button
            className="tap-effect"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'none',
              border: 'none',
              color: '#7A8299',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            aria-label="Search settings"
          >
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Title and subtitle */}
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: '0 0 4px 0', lineHeight: 1.25 }}>
            Edit Partner Profile
          </h1>
          <p style={{ fontSize: '14px', color: '#5B6478', margin: 0, lineHeight: 1.5 }}>
            Update your professional credentials and contact details for quote submissions.
          </p>
        </div>

        {/* Form Container (Image 3 Style) */}
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid #E3E7F2',
            padding: 16,
            boxShadow: '0 4px 12px rgba(10,20,60,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            {/* Field 1: Full Name */}
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
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Field 2: Job Title */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Job Title
              </label>
              <input
                type="text"
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Field 3: Email Address */}
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
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Field 4: Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Phone Number
              </label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Field 5: Company Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Company Name
              </label>
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Field 6: Office / Business Address */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 6 }}>
                Office / Business Address
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#F8FAFC',
                  fontSize: '14px',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Save Button (Image 3 Style: Blue Pill) */}
          <button
            type="submit"
            className="tap-effect"
            style={{
              height: 44,
              borderRadius: 9999,
              background: '#0284C7',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
              marginTop: 4
            }}
          >
            <Save size={18} strokeWidth={2} />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: PROFILE PAGE (Matches Image 2)
  // ============================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* --------------------------------------------------------------------------
          1. Top Profile Card (Image 2 Style)
          -------------------------------------------------------------------------- */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        border: '1px solid #E3E7F2',
        padding: 16,
        boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {/* Top Row: Avatar + Name & Role + Edit Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar with Camera Badge */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: '#0B1F5C',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(11,31,92,0.18)'
              }}>
                {profileData.name.charAt(0)}
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="tap-effect"
                style={{
                  position: 'absolute',
                  bottom: -3,
                  right: -3,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#F97316',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0
                }}
                title="Change Photo"
                aria-label="Change photo"
              >
                <Camera size={12} strokeWidth={2} />
              </button>
            </div>

            {/* Name, Role & Verified Pill */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', lineHeight: 1.25 }}>
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

          {/* Edit Pencil Button (Opens Edit Profile Image 3) */}
          <button
            onClick={() => {
              setEditForm({ ...profileData });
              setIsEditingProfile(true);
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

        {/* Contact info lines with icons (Image 2 Style) */}
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
          2. ACTIVITY & WORKSPACE Section (Image 2 Style)
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
          borderRadius: 20,
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {/* Row 1: Saved Inverters (Rule 5: 56px height, 36px icon tile, 15px label) */}
          <div
            onClick={() => setActiveModal('saved')}
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
                background: '#FDEEE9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Heart size={20} strokeWidth={2} color="#E11D48" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Saved Inverters
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>2</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 2: Product Comparisons */}
          <div
            onClick={() => navigate('/services')}
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
                <Scale size={20} strokeWidth={2} color="#0284C7" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Product Comparisons
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>2</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 3: My Enquiries & Quotes */}
          <div
            onClick={() => setActiveModal('quotes')}
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
                background: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={20} strokeWidth={2} color="#9333EA" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                My Enquiries & Quotes
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#8A92A6' }}>3</span>
              <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
            </div>
          </div>

          {/* Row 4: Technical Downloads */}
          <div
            onClick={() => setActiveModal('downloads')}
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
                <FileText size={20} strokeWidth={2} color="#16A34A" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#1B2236' }}>
                Technical Downloads
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2} color="#8A92A6" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          3. PREFERENCES & SUPPORT Section (Image 2 Style)
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
          borderRadius: 20,
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
        }}>
          {/* Row 1: Notifications */}
          <div
            onClick={() => setActiveModal('notifications')}
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
            onClick={() => setActiveModal('support')}
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
            onClick={() => setActiveModal('settings')}
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

      {/* ==========================================================================
          MODALS FOR ROW INTERACTIONS
          ========================================================================== */}

      {/* 1. Saved Inverters / Appliances Modal */}
      {activeModal === 'saved' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={18} color="#E11D48" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  Saved Models & Appliances
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { code: 'SD-SP-5K', name: 'Single-Phase String Inverter 5kW', price: 'From $49' },
                { code: 'SD-HY-5K', name: 'Hybrid Inverter 5kW Storage Ready', price: 'From $45' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#14308F' }}>{item.code}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#7A8299' }}>{item.price}</div>
                  </div>
                  <button
                    onClick={() => { setActiveModal(null); navigate('/services'); }}
                    className="btn btn-outline tap-effect"
                    style={{ padding: '5px 12px', fontSize: '12px', borderRadius: 9999 }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. My Enquiries & Quotes Modal */}
      {activeModal === 'quotes' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={18} color="#9333EA" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  My Enquiries & Quotes
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { id: 'QUO-8821', title: 'Commercial 10kW Inverter Replacement', status: 'Pending Review', date: 'Yesterday' },
                { id: 'QUO-8740', title: 'Residential Defrost Diagnostic', status: 'Approved', date: '3 days ago' },
                { id: 'QUO-8619', title: 'PCB Repair & Microinverter Check', status: 'Completed', date: 'Oct 18, 2026' }
              ].map((q) => (
                <div key={q.id} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, color: '#9333EA' }}>{q.id}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>{q.title}</div>
                    <div style={{ fontSize: '11px', color: '#7A8299' }}>{q.date} • {q.status}</div>
                  </div>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: '11px',
                    fontWeight: 600,
                    background: q.status === 'Approved' ? '#DCFCE7' : '#F1F5F9',
                    color: q.status === 'Approved' ? '#16A34A' : '#475569'
                  }}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Technical Downloads Modal */}
      {activeModal === 'downloads' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} color="#16A34A" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  Technical Downloads & Docs
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { title: 'Inverter Diagnostics Spec Sheet v4.pdf', size: '2.4 MB' },
                { title: 'Appliance Commissioning & Warranty Certificate.pdf', size: '1.1 MB' },
                { title: 'OEM Parts Replacement Protocol 2026.pdf', size: '3.8 MB' }
              ].map((doc, idx) => (
                <div key={idx} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>{doc.title}</div>
                    <div style={{ fontSize: '11px', color: '#7A8299' }}>{doc.size}</div>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${doc.title}`, 'success')}
                    className="btn btn-outline tap-effect"
                    style={{ padding: '5px 12px', fontSize: '12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Download size={13} /> PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Notifications Sheet */}
      {activeModal === 'notifications' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '80vh' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={18} color="#D97706" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  Notification Preferences
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                <span style={{ fontSize: '13px', color: '#0A0A0F', fontWeight: 500 }}>Live Van Tracking SMS</span>
                <input type="checkbox" checked={notifTracking} onChange={(e) => setNotifTracking(e.target.checked)} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                <span style={{ fontSize: '13px', color: '#0A0A0F', fontWeight: 500 }}>Quote Status Email Updates</span>
                <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 10 }}>
                <span style={{ fontSize: '13px', color: '#0A0A0F', fontWeight: 500 }}>Warranty Expiry Reminders</span>
                <input type="checkbox" checked={notifSms} onChange={(e) => setNotifSms(e.target.checked)} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. Support & Verification Desk Sheet */}
      {activeModal === 'support' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Headset size={18} color="#0284C7" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  Support & Verification Desk
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
                className="tap-effect"
                style={{ padding: '12px 14px', borderRadius: 12, background: '#FDECEC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Phone size={16} color="#DC2626" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>24/7 Priority Emergency Hotline</div>
                    <div style={{ fontSize: '11px', color: '#7A8299' }}>Connects with senior supervisor</div>
                  </div>
                </div>
                <ChevronRight size={15} color="#DC2626" />
              </div>

              <div
                onClick={() => { setActiveModal(null); openChat(); }}
                className="tap-effect"
                style={{ padding: '12px 14px', borderRadius: 12, background: '#F8FAFC', border: '1px solid #EEF1F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MessageSquare size={16} color="#14308F" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>Live Chat Support</div>
                    <div style={{ fontSize: '11px', color: '#7A8299' }}>2-minute average response time</div>
                  </div>
                </div>
                <ChevronRight size={15} color="#7A8299" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. App Settings & Cache Sheet */}
      {activeModal === 'settings' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '80vh' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={18} color="#475569" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#0A0A0F' }}>
                  App Settings & Cache
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 30, height: 30, color: '#7A8299' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0F' }}>App Version</div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>v2.4.0 (Build 2026.11)</div>
              </div>

              <button
                onClick={() => {
                  showToast('App cache cleared successfully! (14.2 MB freed)', 'success');
                  setActiveModal(null);
                }}
                className="btn btn-outline tap-effect"
                style={{ height: 42, borderRadius: 10, fontSize: '13px', fontWeight: 600 }}
              >
                Clear Local Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
