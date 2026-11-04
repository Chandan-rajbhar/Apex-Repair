import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Phone,
  MessageSquare,
  Shield,
  Check,
  CheckCircle2,
  Star,
  ChevronDown,
  Printer,
  Calendar,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { RescheduleModal } from '../components/tracking/RescheduleModal';
import { InvoiceModal } from '../components/tracking/InvoiceModal';
import { ReviewModal } from '../components/tracking/ReviewModal';
import { COMPANY_INFO } from '../data/appliancesData';

export const TrackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    bookings,
    activeBooking,
    selectedBookingId,
    setSelectedBookingId,
    advanceActiveStep,
    approveQuote,
    declineQuote,
    reschedule,
    cancelBooking
  } = useBooking();

  const { openChatWithBooking } = useChat();
  const { showToast } = useToast();

  // Hidden developer flag for demo advancement (accessible via ?dev=true or double tap)
  const isDevMode = searchParams.get('dev') === 'true';

  // Modals
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found another repair company');
  const [isQuoteApproved, setIsQuoteApproved] = useState(false);

  const bookingToDisplay = activeBooking;

  if (!bookingToDisplay) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0 100px 0', textAlign: 'center' }}>
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
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#0A0A0F', margin: '0 0 6px 0', lineHeight: 1.25 }}>
            No Active Repair Orders
          </h2>
          <p style={{ fontSize: '14px', color: '#5B6478', maxWidth: 300, margin: '0 auto 16px auto', lineHeight: 1.5 }}>
            You don't currently have an active repair scheduled.
          </p>
          <button
            onClick={() => navigate('/book')}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 24px',
              borderRadius: 9999,
              background: '#0B1F5C',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Book a Repair
          </button>
        </div>
      </div>
    );
  }

  // Map 9 internal steps to the 6 spec steps
  // 1: Booked, 2: Technician assigned, 3: On the way, 4: Diagnosis and quote, 5: Repair in progress, 6: Completed
  const currentStep6 = (() => {
    const s = bookingToDisplay.currentStep;
    if (s <= 2) return 1;
    if (s === 3) return 2;
    if (s === 4) return 3;
    if (s === 5 || s === 6) return 4;
    if (s === 7 || s === 8) return 5;
    return 6;
  })();

  const isQuoteReady = (currentStep6 === 4 && bookingToDisplay.currentStep === 6) || (bookingToDisplay.quote && !bookingToDisplay.quoteApproved && currentStep6 === 4);
  const quoteHasBeenApproved = isQuoteApproved || bookingToDisplay.quoteApproved || currentStep6 >= 5;

  // Status Headline & Big ETA Text
  const statusHeadline = (() => {
    switch (currentStep6) {
      case 1:
        return 'Booking confirmed';
      case 2:
        return 'Technician assigned';
      case 3:
        return 'Technician is on the way';
      case 4:
        return isQuoteReady ? 'Repair quote ready' : 'Diagnosis in progress';
      case 5:
        return 'Repair in progress';
      case 6:
      default:
        return 'Repair completed';
    }
  })();

  const etaMinutes = bookingToDisplay.technician?.etaMinutes || 11;

  // 6 Steps Timeline Definition
  const SIX_STEPS = [
    {
      id: 1,
      title: 'Booked',
      desc: 'Appointment confirmed and registered in dispatch queue.',
      time: 'Today, 9:30 AM'
    },
    {
      id: 2,
      title: 'Technician assigned',
      desc: 'Senior specialist Marcus Vance assigned with OEM parts.',
      time: '10:45 AM'
    },
    {
      id: 3,
      title: 'On the way',
      desc: 'Service van en route to your service address.',
      time: '11:18 AM'
    },
    {
      id: 4,
      title: 'Diagnosis and quote',
      desc: 'Inspecting unit components and preparing itemized quote.',
      time: '11:42 AM'
    },
    {
      id: 5,
      title: 'Repair in progress',
      desc: 'Installing OEM replacement parts and safety testing.',
      time: '12:15 PM'
    },
    {
      id: 6,
      title: 'Completed',
      desc: 'Repair complete, payment processed, 90-day warranty issued.',
      time: '1:00 PM'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
      {/* --------------------------------------------------------------------------
          1. HEADER (Back arrow & Title "Track repair")
          -------------------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            className="tap-effect"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E3E7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0A0A0F',
              padding: 0
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <h1 style={{ fontSize: 'var(--text-title, clamp(1.1rem, 4.5vw, 1.35rem))', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.2 }}>
            Track repair
          </h1>
        </div>

        {/* Small Booking Switcher Dropdown (only if user has > 1 booking) */}
        {bookings.length > 1 && (
          <div style={{ position: 'relative' }}>
            <select
              value={bookingToDisplay.id}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              style={{
                height: 36,
                padding: '0 28px 0 12px',
                borderRadius: 9999,
                border: '1px solid #E3E7F2',
                background: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#0B1F5C',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none'
              }}
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.applianceName}, #{b.id}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              color="#0B1F5C"
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Developer Simulate Button (hidden unless isDevMode) */}
      {isDevMode && (
        <div style={{ padding: '6px 12px', background: '#FEF3C7', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#92400E' }}>Dev Mode active</span>
          <button
            onClick={() => {
              advanceActiveStep();
              showToast('Advanced step', 'info');
            }}
            style={{ fontSize: '11px', fontWeight: 700, color: '#14308F', background: '#FFFFFF', border: '1px solid #D97706', padding: '2px 8px', borderRadius: 4, cursor: 'pointer' }}
          >
            Advance Step (Next) &rarr;
          </button>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          2. STATUS CARD (The Main Card)
          -------------------------------------------------------------------------- */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          padding: 'var(--card-pad, clamp(10px, 2.8vw, 14px))',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        {/* Small gray line: "Samsung Refrigerator and Freezer, #AR-1024" */}
        <div style={{ fontSize: 'var(--text-small, clamp(0.65rem, 2.6vw, 0.75rem))', color: '#7A8299' }}>
          {bookingToDisplay.brand} {bookingToDisplay.applianceName}, #{bookingToDisplay.id}
        </div>

        {/* Large headline */}
        <h2 style={{ fontSize: 'var(--text-title, clamp(1.1rem, 4.5vw, 1.35rem))', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.25 }}>
          {statusHeadline}
        </h2>

        {/* Big ETA / Schedule line */}
        {currentStep6 === 3 ? (
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#14308F' }}>
              Arrives in {etaMinutes} min
            </div>
            <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 2 }}>
              Today, {bookingToDisplay.timeSlot || '11:00 AM to 2:00 PM'}
            </div>
          </div>
        ) : currentStep6 === 6 ? (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={18} color="#16A34A" />
              <span>All repairs cleared & warranty active</span>
            </div>
            <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 2 }}>
              Completed today at {bookingToDisplay.date}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#14308F' }}>
              Scheduled for {bookingToDisplay.date || 'Today'}
            </div>
            <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 2 }}>
              Window: {bookingToDisplay.timeSlot || '11:00 AM to 2:00 PM'}
            </div>
          </div>
        )}

        {/* Compact progress bar with 6 segments (filled navy #14308F, rest #E3E7F2) */}
        <div style={{ display: 'flex', gap: 4, width: '100%', margin: '4px 0' }}>
          {[1, 2, 3, 4, 5, 6].map((seg) => (
            <div
              key={seg}
              style={{
                flex: 1,
                height: 5,
                borderRadius: 9999,
                background: seg <= currentStep6 ? '#14308F' : '#E3E7F2',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#EEF1F8' }} />

        {/* Address with pin icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', color: '#5B6478' }}>
          <MapPin size={18} strokeWidth={2} color="#14308F" style={{ flexShrink: 0 }} />
          <span>{bookingToDisplay.address || '742 Evergreen Terr, Suite 4B, Springfield, IL'}</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          3. MAP CARD (ONLY while the technician is on the way: Step 3)
          -------------------------------------------------------------------------- */}
      {currentStep6 === 3 && (
        <div
          style={{
            position: 'relative',
            height: 200,
            borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
            overflow: 'hidden',
            border: '1px solid #E3E7F2',
            background: '#F0F4FA',
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
          }}
        >
          {/* One small chip at top-left: "ETA 11 min" */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              background: '#0B1F5C',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 9999,
              boxShadow: '0 2px 8px rgba(11,31,92,0.2)'
            }}
          >
            ETA {etaMinutes} min
          </div>

          {/* SVG Map Graphic with route, van marker, and destination pin */}
          <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
            {/* Soft map roads */}
            <path d="M 0 50 L 400 60" stroke="#E2E8F0" strokeWidth="8" fill="none" />
            <path d="M 0 160 L 400 140" stroke="#E2E8F0" strokeWidth="8" fill="none" />
            <path d="M 90 0 L 80 200" stroke="#E2E8F0" strokeWidth="8" fill="none" />
            <path d="M 310 0 L 320 200" stroke="#E2E8F0" strokeWidth="8" fill="none" />

            {/* Live Blue Route Line */}
            <path
              d="M 60 145 C 130 140, 160 80, 240 85 S 310 130, 335 90"
              stroke="#14308F"
              strokeWidth="4"
              strokeDasharray="6,4"
              fill="none"
            />

            {/* Technician Van Marker */}
            <g transform="translate(195, 75)">
              <circle r="16" fill="rgba(20, 48, 143, 0.15)" />
              <circle r="12" fill="#14308F" />
              <rect x="-6" y="-5" width="12" height="10" rx="2" fill="#FFFFFF" />
              <circle cx="-2" cy="5" r="2" fill="#0B1F5C" />
              <circle cx="4" cy="5" r="2" fill="#0B1F5C" />
            </g>

            {/* Destination Pin Marker */}
            <g transform="translate(335, 72)">
              <circle r="14" fill="rgba(220, 38, 38, 0.15)" />
              <path d="M 0 0 C -4 -4 -7 -8 -7 -12 A 7 7 0 0 1 7 -12 C 7 -8 4 -4 0 0 Z" fill="#DC2626" />
              <circle cx="0" cy="-12" r="2.5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          5. QUOTE CARD (only when status = Quote ready, or collapsed if approved)
          Placed FIRST above technician per spec when Quote ready
          -------------------------------------------------------------------------- */}
      {isQuoteReady && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
            border: '1px solid #E3E7F2',
            padding: 'var(--card-pad, clamp(10px, 2.8vw, 14px))',
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {quoteHasBeenApproved ? (
            /* Collapsed into a single row */
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                  Quote approved, $281.88
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 9999 }}>
                Authorized
              </span>
            </div>
          ) : (
            /* Full Quote Card */
            <>
              {/* Title & Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#0A0A0F' }}>
                  Repair quote
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#14308F', background: '#E8ECF8', padding: '3px 8px', borderRadius: 9999 }}>
                  Needs your approval
                </span>
              </div>

              {/* One line summary of finding */}
              <div style={{ fontSize: '13px', color: '#5B6478', lineHeight: 1.4 }}>
                Defrost thermistor sensor and defrost thermostat failure.
              </div>

              {/* Line items as rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5B6478' }}>Parts (sensor probe & cutoff switch)</span>
                  <span style={{ fontWeight: 500, color: '#0A0A0F' }}>$178.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5B6478' }}>Labor</span>
                  <span style={{ fontWeight: 500, color: '#0A0A0F' }}>$165.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                  <span>Diagnostic fee credit</span>
                  <span style={{ fontWeight: 600 }}>-$79.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5B6478' }}>Tax</span>
                  <span style={{ fontWeight: 500, color: '#0A0A0F' }}>$17.38</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#EEF1F8' }} />

              {/* Total large right-aligned */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#0A0A0F' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#0B1F5C' }}>$281.88</span>
              </div>

              {/* Warranty badge row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#5B6478' }}>
                <Shield size={16} color="#16A34A" />
                <span>Includes 90-day parts and labor warranty</span>
              </div>

              {/* Buttons */}
              <button
                onClick={() => {
                  setIsQuoteApproved(true);
                  approveQuote(bookingToDisplay.id);
                  showToast('Quote approved! Repair work is underway.', 'success');
                }}
                className="tap-effect"
                style={{
                  height: 48,
                  width: '100%',
                  borderRadius: 9999,
                  background: '#0B1F5C',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(11,31,92,0.25)'
                }}
              >
                Approve repair
              </button>

              <button
                onClick={() => {
                  declineQuote(bookingToDisplay.id, 'Customer declined estimate');
                  showToast('Quote declined. Technician has been informed.', 'info');
                }}
                className="tap-effect"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7A8299',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '4px 0',
                  textAlign: 'center'
                }}
              >
                Decline
              </button>
            </>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------------
          4. TECHNICIAN CARD (after a technician is assigned: Step >= 2)
          -------------------------------------------------------------------------- */}
      {currentStep6 >= 2 && currentStep6 <= 5 && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
            border: '1px solid #E3E7F2',
            padding: 'var(--card-pad, clamp(10px, 2.8vw, 14px))',
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* 48px circle photo */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#0B1F5C',
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              MV
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#0A0A0F', lineHeight: 1.25 }}>
                {bookingToDisplay.technician?.name || 'Marcus Vance'}
              </div>
              <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 2 }}>
                Senior appliance specialist
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: '#0A0A0F', marginTop: 2 }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontWeight: 600 }}>4.98</span>
                <span style={{ color: '#7A8299' }}>&bull; 1,420 jobs</span>
              </div>
            </div>
          </div>

          {/* Two equal buttons: Call (outline) & Chat (glossy navy) */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { window.location.href = `tel:${COMPANY_INFO.phoneRaw}`; }}
              className="tap-effect"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 9999,
                background: '#FFFFFF',
                border: '1px solid #E3E7F2',
                color: '#0A0A0F',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Phone size={16} strokeWidth={2} />
              <span>Call</span>
            </button>

            <button
              onClick={() => openChatWithBooking(bookingToDisplay.id)}
              className="tap-effect"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 9999,
                background: '#0B1F5C',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 4px 12px rgba(11,31,92,0.2)'
              }}
            >
              <MessageSquare size={16} strokeWidth={2} />
              <span>Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          6. TIMELINE CARD (Exactly 6 steps)
          -------------------------------------------------------------------------- */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
          border: '1px solid #E3E7F2',
          padding: 'var(--card-pad, clamp(10px, 2.8vw, 14px))',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#0A0A0F' }}>
          Repair progress
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SIX_STEPS.map((step, idx) => {
            const isCompleted = step.id < currentStep6;
            const isCurrent = step.id === currentStep6;
            const isUpcoming = step.id > currentStep6;
            const isLast = idx === SIX_STEPS.length - 1;

            return (
              <div key={step.id} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                {/* Left column: 24px circle and joining vertical line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: isCompleted ? '#2E9E6B' : isCurrent ? '#14308F' : '#E3E7F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(20, 48, 143, 0.15)' : 'none',
                      zIndex: 2
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrent ? (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} />
                    ) : null}
                  </div>

                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: isCurrent ? 36 : 24,
                        background: isCompleted ? '#2E9E6B' : '#E3E7F2',
                        margin: '2px 0'
                      }}
                    />
                  )}
                </div>

                {/* Right column: Title, time and optional description */}
                <div style={{ flex: 1, paddingBottom: isLast ? 0 : isCurrent ? 14 : 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                      color: isUpcoming ? '#7A8299' : '#0A0A0F'
                    }}>
                      {step.title}
                    </span>
                    <span style={{ fontSize: '13px', color: '#7A8299' }}>
                      {isUpcoming ? '--' : step.time}
                    </span>
                  </div>

                  {/* Show description only for the current step */}
                  {isCurrent && (
                    <div style={{ fontSize: '13px', color: '#7A8299', marginTop: 2, lineHeight: 1.4 }}>
                      {step.desc}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          7. HELP ROW (Bottom)
          -------------------------------------------------------------------------- */}
      {currentStep6 === 6 ? (
        /* Completed Status: Two buttons "View invoice" and "Rate technician" */
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="tap-effect"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 9999,
              background: '#FFFFFF',
              border: '1px solid #E3E7F2',
              color: '#0A0A0F',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            View invoice
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className="tap-effect"
            style={{
              flex: 1,
              height: 44,
              borderRadius: 9999,
              background: '#0B1F5C',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Rate technician
          </button>
        </div>
      ) : (
        /* Active Status: Reschedule, Need help?, and Cancel appointment */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, width: '100%' }}>
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="tap-effect"
              style={{
                background: 'none',
                border: 'none',
                color: '#14308F',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Reschedule
            </button>
            <button
              onClick={() => navigate('/more?sub=support')}
              className="tap-effect"
              style={{
                background: 'none',
                border: 'none',
                color: '#14308F',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Need help?
            </button>
          </div>

          {/* Cancel appointment (hidden once technician has started repair: step 5) */}
          {currentStep6 < 5 && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="tap-effect"
              style={{
                background: 'none',
                border: 'none',
                color: '#C62828',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Cancel appointment
            </button>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------------
          MODALS
          -------------------------------------------------------------------------- */}
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
        onSubmitReview={({ rating }) => {
          showToast(`Thank you for rating ${rating} stars!`, 'success');
        }}
      />

      {/* Cancel Confirmation Sheet */}
      {showCancelModal && (
        <div className="sheet-backdrop" onClick={() => setShowCancelModal(false)}>
          <div
            className="sheet-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: 20,
              maxWidth: 480,
              margin: '0 auto'
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E2E8F0', margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A0A0F', margin: '0 0 6px 0' }}>
              Cancel Appointment #{bookingToDisplay.id}?
            </h3>
            <p style={{ fontSize: '14px', color: '#5B6478', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Are you sure you want to cancel? If your plans have changed, you can reschedule for free.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  cancelBooking(bookingToDisplay.id, cancelReason);
                  setShowCancelModal(false);
                  showToast('Appointment cancelled successfully', 'info');
                }}
                className="tap-effect"
                style={{
                  height: 44,
                  borderRadius: 9999,
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Yes, Cancel Appointment
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="tap-effect"
                style={{
                  height: 44,
                  borderRadius: 9999,
                  background: '#FFFFFF',
                  color: '#0A0A0F',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: '1px solid #E3E7F2',
                  cursor: 'pointer'
                }}
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
