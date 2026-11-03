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
      <div style={{ padding: '30px 10px', textAlign: 'center' }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--orange-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: 'var(--orange-600)'
        }}>
          <Truck size={30} />
        </div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)', marginBottom: 6 }}>
          No Active Repair Orders
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 300, margin: '0 auto 18px auto' }}>
          Look up an existing appointment using your Booking ID (e.g. AR-1024) or phone number.
        </p>

        <form onSubmit={handleSearch} style={{ maxWidth: 320, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Enter Booking ID (e.g. AR-1024)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flex: 1, height: 42, padding: '0 12px', borderRadius: 12, border: '1px solid var(--border)' }}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Lookup
          </button>
        </form>
      </div>
    );
  }

  const currentStatusObj = TRACKING_STATUSES.find((s) => s.id === bookingToDisplay.currentStep) || TRACKING_STATUSES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* --------------------------------------------------------------------------
          Top Search & Lookup Bar
          -------------------------------------------------------------------------- */}
      <form onSubmit={handleSearch} className="search-bar-wrap">
        <Search size={18} className="search-icon-pos" />
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder={`Lookup by Booking ID (Current: #${bookingToDisplay.id})...`}
          className="search-input"
        />
        <button
          type="submit"
          className="btn btn-primary btn-xs tap-effect"
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: '6px 12px' }}
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
                padding: '6px 12px',
                borderRadius: 9999,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: bookingToDisplay.id === b.id ? 'var(--navy-900)' : '#FFFFFF',
                color: bookingToDisplay.id === b.id ? '#FFFFFF' : 'var(--navy-900)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>#{b.id}</span>
              <span style={{ opacity: 0.8, fontSize: '0.66rem' }}>({b.applianceName})</span>
            </button>
          ))}
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Active Booking Primary Overview Card
          -------------------------------------------------------------------------- */}
      <div
        className="card-white card-gloss"
        style={{
          borderRadius: 24,
          padding: '18px 18px',
          boxShadow: 'var(--shadow-sm)',
          border: '1.5px solid rgba(232, 84, 30, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <span className="badge badge-mint" style={{ marginBottom: 4 }}>
              LIVE TRACKING &bull; STEP {bookingToDisplay.currentStep}/9
            </span>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-900)', marginTop: 2 }}>
              {bookingToDisplay.brand} {bookingToDisplay.applianceName}
            </h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Booking #{bookingToDisplay.id} &bull; {bookingToDisplay.date} ({bookingToDisplay.timeSlot})
            </div>
          </div>

          {/* Simulate Next Step Button for instant demo testing */}
          <button
            onClick={() => {
              advanceActiveStep();
              showToast('Simulated progression advanced by 1 step', 'info');
            }}
            className="btn btn-outline btn-xs tap-effect"
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--navy-50)' }}
            title="Fast forward to next tracking status"
          >
            <FastForward size={13} color="var(--orange-600)" />
            <span>Simulate Step</span>
          </button>
        </div>

        {/* Current status pill */}
        <div style={{
          padding: '10px 14px',
          borderRadius: 14,
          background: 'var(--grad-warm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange-600)', animation: 'pulse 1.2s infinite' }} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--orange-700)' }}>
                {currentStatusObj.label}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--navy-900)', lineHeight: 1.25 }}>
                {currentStatusObj.desc}
              </div>
            </div>
          </div>
        </div>

        {/* Service Address */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <MapPin size={15} color="var(--orange-600)" style={{ flexShrink: 0 }} />
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
      <div className="card-white" style={{ padding: 14, borderRadius: 22 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 10 }}>
          Customer Management & Self-Service
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => openChatWithBooking(bookingToDisplay.id)}
            className="btn btn-outline tap-effect"
            style={{ padding: '8px 10px', fontSize: '0.76rem', justifyContent: 'flex-start' }}
          >
            <MessageSquare size={16} color="var(--orange-600)" />
            Chat About Repair
          </button>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="btn btn-outline tap-effect"
            style={{ padding: '8px 10px', fontSize: '0.76rem', justifyContent: 'flex-start' }}
          >
            <Printer size={16} color="#0F2A44" />
            Print Invoice
          </button>

          <button
            onClick={() => setShowRescheduleModal(true)}
            className="btn btn-outline tap-effect"
            style={{ padding: '8px 10px', fontSize: '0.76rem', justifyContent: 'flex-start' }}
          >
            <Calendar size={16} color="#D97706" />
            Reschedule Slot
          </button>

          <button
            onClick={() => setShowReviewModal(true)}
            className="btn btn-outline tap-effect"
            style={{ padding: '8px 10px', fontSize: '0.76rem', justifyContent: 'flex-start' }}
          >
            <Star size={16} color="#F59E0B" />
            Review Master Tech
          </button>

          {/* Pay bill if completed or quote approved */}
          {bookingToDisplay.currentStep >= 7 && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-primary tap-effect shine-sweep"
              style={{ gridColumn: 'span 2', padding: '10px 14px', fontSize: '0.82rem' }}
            >
              <CreditCard size={16} />
              {bookingToDisplay.currentStep === 9 ? 'Receipt Cleared ($' + bookingToDisplay.quote?.total + ')' : 'Pay Balance ($' + bookingToDisplay.quote?.total + ')'}
            </button>
          )}

          {bookingToDisplay.currentStep <= 4 && !bookingToDisplay.isCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn tap-effect"
              style={{ gridColumn: 'span 2', fontSize: '0.74rem', color: '#DC2626', background: 'transparent' }}
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

