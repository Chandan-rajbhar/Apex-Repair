import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Truck,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Settings,
  Wrench,
  AlertTriangle,
  DollarSign,
  Headphones,
  Bell,
  MapPin,
  X,
  Check,
  Send,
  Download,
  Clock,
  Mail,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { COMPANY_INFO } from '../data/appliancesData';

export const MorePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { bookings, activeBooking } = useBooking();
  const { openChat } = useChat();
  const { showToast } = useToast();

  // Modals for interactive rows
  const [activeModal, setActiveModal] = useState(null);

  // Report Problem Form State
  const [issueType, setIssueType] = useState('Technician delayed');
  const [orderNumber, setOrderNumber] = useState(activeBooking ? `#${activeBooking.id}` : '#AR-1024');
  const [issueMessage, setIssueMessage] = useState('');

  // Notification toggles
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifTracking, setNotifTracking] = useState(true);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!issueMessage.trim()) {
      showToast('Please enter a brief message describing your issue.', 'error');
      return;
    }
    showToast('Problem report submitted! Priority supervisor will contact you within 15 minutes.', 'success');
    setActiveModal(null);
    setIssueMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 90 }}>
      {/* --------------------------------------------------------------------------
          4 Quick-Action Tiles
          -------------------------------------------------------------------------- */}
      <div className="quick-tiles-grid quick-tiles-square">
        <div className="quick-tile quick-tile-square tap-effect" onClick={() => navigate('/book')}>
          <div className="tile-icon-box">
            <Calendar size={18} />
          </div>
          <div className="tile-label">Book Visit</div>
        </div>

        <div className="quick-tile quick-tile-square tap-effect" onClick={() => navigate('/track')}>
          <div className="tile-icon-box">
            <Truck size={18} />
          </div>
          <div className="tile-label">Track Order</div>
        </div>

        <div className="quick-tile quick-tile-square tap-effect" onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}>
          <div className="tile-icon-box">
            <Phone size={18} />
          </div>
          <div className="tile-label">Call Master Tech</div>
        </div>

        <div className="quick-tile quick-tile-square tap-effect" onClick={openChat}>
          <div className="tile-icon-box">
            <MessageSquare size={18} />
          </div>
          <div className="tile-label">Contact Us</div>
        </div>
      </div>

      {/* ==========================================================================
          SECTION 1: MY REPAIRS
          ========================================================================== */}
      <div>
        <div style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          margin: '20px 0 8px 0',
          paddingLeft: '4px'
        }}>
          MY REPAIRS
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(11, 31, 92, 0.04)'
        }}>
          {/* Row 1: Active Repair */}
          <div
            onClick={() => navigate('/track')}
            className="tap-effect"
            style={{
              minHeight: 56,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Truck size={20} strokeWidth={2} color="#14308F" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                  Active repair #{activeBooking?.id || 'AR-1024'}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#14308F', marginTop: 2 }}>
                  Step {activeBooking?.currentStep || 4} of 9
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 2: Repair Invoices and Receipts */}
          <div
            onClick={() => setActiveModal('invoices')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Receipt size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Repair invoices and receipts
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 3: 90-day Warranty */}
          <div
            onClick={() => setActiveModal('warranty')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                90-day warranty
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 4: My Appliances */}
          <div
            onClick={() => navigate('/portal')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Wrench size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                My appliances
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#8A92A6' }}>3</span>
              <ChevronRight size={16} color="#7A8299" />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          SECTION 2: HELP AND SUPPORT
          ========================================================================== */}
      <div>
        <div style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          margin: '20px 0 8px 0',
          paddingLeft: '4px'
        }}>
          HELP AND SUPPORT
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(11, 31, 92, 0.04)'
        }}>
          {/* Row 1: Emergency Dispatch */}
          <div
            onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
            className="tap-effect"
            style={{
              minHeight: 56,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid #EEF1F8'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#FDECEC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Phone size={20} strokeWidth={2} color="#C62828" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                  Emergency dispatch
                </div>
                <div style={{ fontSize: '12px', color: '#7A8299', marginTop: 2 }}>
                  Call 24/7 hotline
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 2: Live Chat */}
          <div
            onClick={openChat}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Live chat
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 3: Frequently Asked Questions */}
          <div
            onClick={() => setActiveModal('faq')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <HelpCircle size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Frequently asked questions
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 4: Report a Problem */}
          <div
            onClick={() => setActiveModal('report')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Report a problem
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 5: Pricing and Diagnostic Fees */}
          <div
            onClick={() => setActiveModal('pricing')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Pricing and diagnostic fees
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 6: Contact Support */}
          <div
            onClick={() => setActiveModal('contact')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Headphones size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Contact support
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>
        </div>
      </div>

      {/* ==========================================================================
          SECTION 3: PREFERENCES
          ========================================================================== */}
      <div>
        <div style={{
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#7A8299',
          fontWeight: 600,
          margin: '20px 0 8px 0',
          paddingLeft: '4px'
        }}>
          PREFERENCES
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(11, 31, 92, 0.04)'
        }}>
          {/* Row 1: Notifications */}
          <div
            onClick={() => setActiveModal('notifications')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Notifications
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 2: Saved Addresses */}
          <div
            onClick={() => setActiveModal('addresses')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MapPin size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                Saved addresses
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>

          {/* Row 3: App Settings */}
          <div
            onClick={() => setActiveModal('settings')}
            className="tap-effect"
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
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#E8ECF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Settings size={20} strokeWidth={2} color="#14308F" />
              </div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#1B2236', lineHeight: 1.3 }}>
                App settings
              </span>
            </div>
            <ChevronRight size={16} color="#7A8299" />
          </div>
        </div>
      </div>

      {/* ==========================================================================
          MODALS FOR ROW INTERACTIONS
          ========================================================================== */}

      {/* 1. Report a Problem Modal */}
      {activeModal === 'report' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '88vh' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="#C62828" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Report a Problem
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)', display: 'block', marginBottom: 6 }}>
                  Issue Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="search-input"
                  style={{ height: 42, padding: '0 12px', fontSize: '0.85rem' }}
                >
                  <option value="Technician delayed">Technician delayed</option>
                  <option value="Repair quality issue">Repair quality issue</option>
                  <option value="Pricing / billing discrepancy">Pricing / billing discrepancy</option>
                  <option value="Parts arrival question">Parts arrival question</option>
                  <option value="Other">Other request</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)', display: 'block', marginBottom: 6 }}>
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="search-input"
                  style={{ height: 42, padding: '0 12px', fontSize: '0.85rem' }}
                  placeholder="e.g. #AR-1024"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)', display: 'block', marginBottom: 6 }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  value={issueMessage}
                  onChange={(e) => setIssueMessage(e.target.value)}
                  className="search-input"
                  style={{ height: 'auto', padding: '10px 12px', borderRadius: 14, fontSize: '0.85rem', resize: 'none' }}
                  placeholder="Tell us what went wrong so our manager can resolve it promptly..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary tap-effect"
                style={{ height: 44, borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Send size={16} /> Submit Problem Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FAQ Modal */}
      {activeModal === 'faq' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Frequently Asked Questions
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F', marginBottom: 4 }}>
                  How does the $79 diagnostic fee work?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4A5A78', lineHeight: 1.4 }}>
                  Our master technician performs an exhaustive 40-point hardware diagnostic. If you approve the repair estimate, 100% of the $79 fee is credited toward your bill.
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F', marginBottom: 4 }}>
                  What is covered under the 90-day warranty?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4A5A78', lineHeight: 1.4 }}>
                  All genuine OEM parts and master technician labor are unconditionally covered for 90 days. If the same issue reoccurs, we fix it at zero cost.
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F', marginBottom: 4 }}>
                  How fast is same-day dispatch?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4A5A78', lineHeight: 1.4 }}>
                  Bookings placed before 3 PM qualify for same-day 2-hour arrival windows with real-time GPS technician tracking.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pricing and Diagnostic Fees Modal */}
      {activeModal === 'pricing' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Pricing & Diagnostic Fees
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#E8ECF8', padding: '12px 14px', borderRadius: 14, marginBottom: 14, border: '1px solid #D2DCF2' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#14308F' }}>
                $79 Comprehensive Multi-Point Diagnostic
              </div>
              <div style={{ fontSize: '0.74rem', color: '#3C4B6E', marginTop: 2 }}>
                100% credited toward your repair if you approve the quote.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Refrigerator / Freezer Cooling', range: '$149 – $289' },
                { name: 'Washing Machine Belt / Pump / Motor', range: '$139 – $269' },
                { name: 'Clothes Dryer Thermal / Heating', range: '$129 – $249' },
                { name: 'Dishwasher Leak / Valve / Board', range: '$119 – $229' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #EEF1F8' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0A0A0F' }}>{item.name}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14308F' }}>{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Contact Support Modal */}
      {activeModal === 'contact' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Headphones size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Contact Support
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <Phone size={20} color="#14308F" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#7A8299' }}>Toll-Free Phone</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0A0A0F' }}>{COMPANY_INFO.phone}</div>
                </div>
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="btn btn-sm btn-primary" style={{ padding: '6px 14px', borderRadius: 9999, fontSize: '0.78rem' }}>
                  Call
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <Mail size={20} color="#14308F" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#7A8299' }}>Email Support</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0A0A0F' }}>support@apexrepair.com</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#F8FAFC', borderRadius: 14, border: '1px solid #E2E8F0' }}>
                <Clock size={20} color="#14308F" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#7A8299' }}>Working Hours</div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F' }}>Mon – Sun: 7:00 AM – 9:00 PM EST</div>
                  <div style={{ fontSize: '0.72rem', color: '#C62828', fontWeight: 600, marginTop: 2 }}>24/7 Emergency Dispatch Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Invoices Modal */}
      {activeModal === 'invoices' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Receipt size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
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

      {/* 6. Warranty Modal */}
      {activeModal === 'warranty' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  90-Day Factory Warranty
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#E8ECF8', padding: '14px', borderRadius: 16, border: '1px solid #D2DCF2', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Shield size={18} color="#14308F" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#14308F' }}>Certificate #WAR-8821</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#3C4B6E', lineHeight: 1.4 }}>
                Active warranty covering 100% parts & labor on all completed Apex precision repair jobs.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['100% Genuine OEM factory-sealed parts', 'Zero diagnostic charge on warranty revisits', 'Master certified technician labor protection'].map((point, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#0A0A0F' }}>
                  <Check size={16} color="#14308F" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Notifications Modal */}
      {activeModal === 'notifications' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Notification Preferences
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14 }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F' }}>SMS Dispatch & Arrival Alerts</div>
                  <div style={{ fontSize: '0.72rem', color: '#7A8299' }}>Live ETA notifications to your phone</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifSms}
                  onChange={(e) => setNotifSms(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#14308F' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14 }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F' }}>Email Receipts & Diagnostic Scans</div>
                  <div style={{ fontSize: '0.72rem', color: '#7A8299' }}>Official PDF documentation sent to inbox</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#14308F' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14 }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0A0A0F' }}>Telemetry & Step Updates</div>
                  <div style={{ fontSize: '0.72rem', color: '#7A8299' }}>Real-time step changes (Step 1 - 9)</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifTracking}
                  onChange={(e) => setNotifTracking(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#14308F' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Saved Addresses Modal */}
      {activeModal === 'addresses' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  Saved Service Addresses
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: 16, border: '1.5px solid #14308F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#14308F' }}>Home (Primary)</span>
                  <span className="badge badge-navy" style={{ fontSize: '0.62rem' }}>VERIFIED ZONE</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#0A0A0F' }}>
                  742 Evergreen Terrace, Springfield, OR 97477
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7A8299', marginTop: 2 }}>
                  Access instructions: Side gate code #1024
                </div>
              </div>

              <button
                onClick={() => showToast('Address manager ready. You can edit during booking.', 'info')}
                className="btn btn-outline tap-effect"
                style={{ height: 42, borderRadius: 12, fontSize: '0.84rem' }}
              >
                + Add Another Service Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. App Settings Modal */}
      {activeModal === 'settings' && (
        <div className="sheet-backdrop" onClick={() => setActiveModal(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '24px 24px 0 0' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={20} color="#14308F" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                  App Settings
                </span>
              </div>
              <button onClick={() => setActiveModal(null)} className="icon-btn-header" style={{ width: 32, height: 32, color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14 }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0A0A0F' }}>App Version</span>
                <span style={{ fontSize: '0.82rem', color: '#7A8299' }}>v2.4.0 (Apex Precision)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F8FAFC', borderRadius: 14 }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0A0A0F' }}>Diagnostic Cache</span>
                <button onClick={() => showToast('App cache cleared!', 'success')} className="btn btn-sm btn-outline" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
