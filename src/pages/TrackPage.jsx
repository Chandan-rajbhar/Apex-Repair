import React, { useState } from 'react';
import {
  Search,
  Truck,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Printer,
  FastForward,
  Star,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { LiveTrackingMap } from '../components/tracking/LiveTrackingMap';
import { TrackingStepper } from '../components/tracking/TrackingStepper';
import { TechnicianCard } from '../components/tracking/TechnicianCard';
import { QuoteApprovalCard } from '../components/tracking/QuoteApprovalCard';
import { PaymentModal } from '../components/tracking/PaymentModal';
import { InvoiceModal } from '../components/tracking/InvoiceModal';
import { RescheduleModal } from '../components/tracking/RescheduleModal';
import { ReviewModal } from '../components/tracking/ReviewModal';
import { TRACKING_STATUSES } from '../data/mockData';

export const TrackPage = () => {
  const {
    bookings,
    activeBooking,
    selectedBookingId,
    setSelectedBookingId,
    advanceActiveStep,
    approveQuote,
    declineQuote,
    payInvoice,
    reschedule,
    cancelBooking
  } = useBooking();

  const { openChatWithBooking } = useChat();
  const { showToast } = useToast();

  const [searchId, setSearchId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another repair company');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = bookings.find(
      (b) =>
        b.id.toLowerCase() === searchId.trim().toLowerCase() ||
        b.customerPhone.includes(searchId.trim()) ||
        b.customerEmail.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (found) {
      setSelectedBookingId(found.id);
      showToast(`Loaded Booking #${found.id}`, 'success');
    } else {
      showToast('No booking found matching that ID or phone.', 'warning');
    }
  };

  const bookingToDisplay = activeBooking;

  if (!bookingToDisplay) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'center', padding: '16px 0' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#E8ECF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          color: '#14308F'
        }}>
          <Truck size={32} strokeWidth={2} />
        </div>
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#14308F',
            marginBottom: 4
          }}>
            REPAIR STATUS
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: '0 0 6px 0', lineHeight: 1.25 }}>
            No Active Repair Orders
          </h2>
          <p style={{ fontSize: '14px', color: '#5B6478', maxWidth: 320, margin: '0 auto', lineHeight: 1.5 }}>
            Look up an existing appointment using your Booking ID (e.g. AR-1024) or phone number.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ maxWidth: 340, width: '100%', margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Enter Booking ID (e.g. AR-1024)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{
              flex: 1,
              height: 44,
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid #E3E7F2',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 20px',
              borderRadius: 9999,
              background: '#0B1F5C',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Lookup
          </button>
        </form>
      </div>
    );
  }

  const currentStatusObj = TRACKING_STATUSES.find((s) => s.id === bookingToDisplay.currentStep) || TRACKING_STATUSES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* --------------------------------------------------------------------------
          Top Search & Lookup Bar
          -------------------------------------------------------------------------- */}
      <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
        <Search size={20} strokeWidth={2} color="#7A8299" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder={`Lookup by Booking ID (Current: #${bookingToDisplay.id})...`}
          style={{
            width: '100%',
            height: 44,
            padding: '0 84px 0 46px',
            borderRadius: 12,
            border: '1px solid #E3E7F2',
            background: '#FFFFFF',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          className="tap-effect"
          style={{
            position: 'absolute',
            right: 4,
            top: 4,
            bottom: 4,
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            background: '#0B1F5C',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Find
        </button>
      </form>

      {/* --------------------------------------------------------------------------
          Recent Bookings Switcher Tabs (if user has multiple)
          -------------------------------------------------------------------------- */}
      {bookings.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBookingId(b.id)}
              className="tap-effect"
              style={{
                flexShrink: 0,
                height: 36,
                padding: '0 16px',
                borderRadius: 9999,
                fontSize: '12px',
                fontWeight: 600,
                background: bookingToDisplay.id === b.id ? '#0B1F5C' : '#FFFFFF',
                color: bookingToDisplay.id === b.id ? '#FFFFFF' : '#1B2236',
                border: '1px solid #E3E7F2',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>#{b.id}</span>
              <span style={{ opacity: 0.8 }}>({b.applianceName})</span>
            </button>
          ))}
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Active Booking Primary Overview Card
          -------------------------------------------------------------------------- */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          border: '1px solid #E3E7F2'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#14308F',
              marginBottom: 4
            }}>
              LIVE TRACKING &bull; STEP {bookingToDisplay.currentStep}/9
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.25 }}>
              {bookingToDisplay.brand} {bookingToDisplay.applianceName}
            </h2>
            <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 4 }}>
              Booking #{bookingToDisplay.id} &bull; {bookingToDisplay.date} ({bookingToDisplay.timeSlot})
            </div>
          </div>

          {/* Simulate Next Step Button for instant demo testing */}
          <button
            onClick={() => {
              advanceActiveStep();
              showToast('Simulated progression advanced by 1 step', 'info');
            }}
            className="tap-effect"
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid #E3E7F2',
              background: '#F8FAFC',
              fontSize: '12px',
              fontWeight: 600,
              color: '#14308F',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer'
            }}
            title="Fast forward to next tracking status"
          >
            <FastForward size={14} color="#14308F" strokeWidth={2} />
            <span>Simulate</span>
          </button>
        </div>

        {/* Current status pill */}
        <div style={{
          padding: 12,
          borderRadius: 14,
          background: '#F1F5FB',
          border: '1px solid #E3E7F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14308F' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                {currentStatusObj.label}
              </div>
              <div style={{ fontSize: '13px', color: '#5B6478', lineHeight: 1.4 }}>
                {currentStatusObj.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Service Address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: '#5B6478' }}>
          <MapPin size={18} strokeWidth={2} color="#14308F" style={{ flexShrink: 0 }} />
          <span>{bookingToDisplay.address}</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Live Animated SVG Route Map (Only active if Step >= 4 and Step < 8)
          -------------------------------------------------------------------------- */}
      {bookingToDisplay.currentStep >= 3 && bookingToDisplay.currentStep <= 5 && (
        <LiveTrackingMap
          etaMinutes={bookingToDisplay.technician?.etaMinutes || 12}
          vehicle={bookingToDisplay.technician?.vehicle || 'Ford Transit #TX-482'}
        />
      )}

      {/* --------------------------------------------------------------------------
          Technician Card
          -------------------------------------------------------------------------- */}
      <TechnicianCard
        technician={bookingToDisplay.technician}
        bookingId={bookingToDisplay.id}
      />

      {/* --------------------------------------------------------------------------
          Interactive Quote Approval Card (Step 6 or active quote)
          -------------------------------------------------------------------------- */}
      <QuoteApprovalCard
        quote={bookingToDisplay.quote}
        isStep6={bookingToDisplay.currentStep === 6}
        onApprove={() => approveQuote(bookingToDisplay.id)}
        onDecline={(reason) => declineQuote(bookingToDisplay.id, reason)}
      />

      {/* --------------------------------------------------------------------------
          Customer Action Center Pills
          -------------------------------------------------------------------------- */}
      {/* --------------------------------------------------------------------------
          Customer Action Center Pills
          -------------------------------------------------------------------------- */}
      <div style={{
        background: '#FFFFFF',
        padding: 16,
        borderRadius: 20,
        border: '1px solid #E3E7F2',
        boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
      }}>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F', marginBottom: 16 }}>
          Customer Management & Self-Service
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          <button
            onClick={() => openChatWithBooking(bookingToDisplay.id)}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #E3E7F2',
              color: '#0A0A0F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} strokeWidth={2} color="#14308F" />
            <span>Chat Triage</span>
          </button>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #E3E7F2',
              color: '#0A0A0F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Printer size={18} strokeWidth={2} color="#14308F" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => setShowRescheduleModal(true)}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #E3E7F2',
              color: '#0A0A0F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Calendar size={18} strokeWidth={2} color="#14308F" />
            <span>Reschedule</span>
          </button>

          <button
            onClick={() => setShowReviewModal(true)}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 12,
              background: '#F8FAFC',
              border: '1px solid #E3E7F2',
              color: '#0A0A0F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Star size={18} strokeWidth={2} color="#14308F" />
            <span>Review Tech</span>
          </button>

          {/* Pay bill if completed or quote approved */}
          {bookingToDisplay.currentStep >= 7 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="tap-effect"
              style={{
                gridColumn: 'span 2',
                height: 44,
                padding: '0 20px',
                borderRadius: 9999,
                background: '#0B1F5C',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <CreditCard size={18} strokeWidth={2} />
              <span>
                {bookingToDisplay.currentStep === 9 ? 'Receipt Cleared ($' + bookingToDisplay.quote?.total + ')' : 'Pay Balance ($' + bookingToDisplay.quote?.total + ')'}
              </span>
            </button>
          )}

          {bookingToDisplay.currentStep <= 4 && !bookingToDisplay.isCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="tap-effect"
              style={{
                gridColumn: 'span 2',
                height: 44,
                fontSize: '14px',
                fontWeight: 600,
                color: '#DC2626',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel This Service Appointment
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          Vertical Stepper (9 Statuses with timestamps & glow)
          -------------------------------------------------------------------------- */}
      <TrackingStepper
        currentStep={bookingToDisplay.currentStep}
        timeline={bookingToDisplay.timeline}
      />

      {/* --------------------------------------------------------------------------
          MODALS
          -------------------------------------------------------------------------- */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        quote={bookingToDisplay.quote}
        onPaySuccess={(method) => payInvoice(bookingToDisplay.id, method)}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        booking={bookingToDisplay}
      />

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        currentDate={bookingToDisplay.date}
        currentSlot={bookingToDisplay.timeSlot}
        onConfirm={(newDate, newSlot) => reschedule(bookingToDisplay.id, newDate, newSlot)}
      />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        technicianName={bookingToDisplay.technician?.name || 'Marcus Vance'}
        onSubmitReview={({ rating, comment }) => {
          showToast(`Thank you for rating Marcus ${rating} stars!`, 'success');
        }}
      />

      {/* Cancel Confirmation Sheet */}
      {showCancelModal && (
        <div className="sheet-backdrop" onClick={() => setShowCancelModal(false)}>
          <div
            className="sheet-container glass-strong card-gloss"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: 20 }}
          >
            <div className="sheet-drag-handle" />
            <h3 style={{ fontSize: '1.2rem', color: '#0F2A44', margin: '10px 0 6px 0' }}>
              Cancel Appointment #{bookingToDisplay.id}?
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: 14 }}>
              Are you sure? Our master technician Marcus is already allocated for this route.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  cancelBooking(bookingToDisplay.id, cancelReason);
                  setShowCancelModal(false);
                }}
                className="btn btn-block btn-primary"
                style={{ background: '#DC2626' }}
              >
                Yes, Cancel Appointment
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-outline"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

