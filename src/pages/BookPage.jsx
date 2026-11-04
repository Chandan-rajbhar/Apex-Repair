import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Wrench,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Camera,
  CheckCircle2,
  Copy,
  ArrowLeft,
  ShieldCheck,
  Check
} from 'lucide-react';
import { APPLIANCE_CATEGORIES, MAJOR_BRANDS, TIME_SLOTS } from '../data/appliancesData';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StickyBookingBar } from '../components/booking/StickyBookingBar';

export const BookPage = () => {
  const navigate = useNavigate();
  const { prefillData, setPrefillData, createBooking } = useBooking();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Appliance & Slot, 2: Customer & Address, 3: Success

  // Form State
  const [selectedAppliance, setSelectedAppliance] = useState('refrigerators');
  const [selectedBrand, setSelectedBrand] = useState('Samsung');
  const [modelNumber, setModelNumber] = useState('');
  const [issueDescription, setIssueDescription] = useState('Appliance is malfunctioning and requires diagnostic check');
  const [selectedSymptomChip, setSelectedSymptomChip] = useState('');
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0].label);

  // Step 2 Form State
  const [customerName, setCustomerName] = useState(user?.name || 'Saurabh Yadav');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'demo@apex.com');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '(877) 225-2046');
  const [address, setAddress] = useState(user?.address || '742 Evergreen Terr, Suite 4B');
  const [city, setCity] = useState(user?.city || 'Springfield');
  const [zip, setZip] = useState(user?.zip || '62704');
  const [technicianNotes, setTechnicianNotes] = useState('Side gate code: #402. Beware of golden retriever.');
  const [photoPreview, setPhotoPreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Check prefill data from chat or services page
  useEffect(() => {
    if (prefillData) {
      if (prefillData.applianceId) {
        setSelectedAppliance(prefillData.applianceId);
      } else if (prefillData.appliance) {
        const found = APPLIANCE_CATEGORIES.find(c => c.name.toLowerCase().includes(prefillData.appliance.toLowerCase()));
        if (found) setSelectedAppliance(found.id);
      }

      if (prefillData.brand) setSelectedBrand(prefillData.brand);
      if (prefillData.symptom) setIssueDescription(prefillData.symptom);

      // Clear prefill so it doesn't linger
      setPrefillData(null);
    }
  }, [prefillData, setPrefillData]);

  // Sync user if authenticated
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.email) setCustomerEmail(user.email);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.zip) setZip(user.zip);
    }
  }, [user]);

  const activeApplianceObj = APPLIANCE_CATEGORIES.find(a => a.id === selectedAppliance) || APPLIANCE_CATEGORIES[0];

  const dateOptions = [
    { day: 'Tomorrow', date: 'Priority Slot' },
    { day: 'In 2 Days', date: 'Standard' },
    { day: 'In 3 Days', date: 'Standard' },
    { day: 'In 4 Days', date: 'Weekend Window' }
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      showToast('Photo of appliance label attached!', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    if (!selectedAppliance || !selectedBrand) {
      showToast('Please select your appliance and brand.', 'warning');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = () => {
    if (!customerName || !customerEmail || !customerPhone || !address) {
      showToast('Please complete all contact and address fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const fullAddress = `${address}, ${city}, IL ${zip}`;
      const payload = {
        userId: user?.id || 'guest',
        customerName,
        customerEmail,
        customerPhone,
        address: fullAddress,
        applianceId: selectedAppliance,
        applianceName: activeApplianceObj.name,
        brand: selectedBrand,
        modelNumber: modelNumber || 'Standard Model',
        issue: selectedSymptomChip ? `${selectedSymptomChip} (${issueDescription})` : issueDescription,
        notes: technicianNotes,
        date: selectedDate,
        timeSlot: selectedSlot,
        photoUrl: photoPreview
      };

      const newBooking = createBooking(payload);
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
      setStep(3); // Success Screen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 700);
  };

  const copyBookingId = () => {
    if (!confirmedBooking) return;
    navigator.clipboard?.writeText(confirmedBooking.id);
    showToast(`Copied ${confirmedBooking.id} to clipboard!`, 'info');
  };

  // --------------------------------------------------------------------------
  // STEP 3: SUCCESS SCREEN
  // --------------------------------------------------------------------------
  if (step === 3 && confirmedBooking) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Success Header Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(10,20,60,0.08)',
            border: '1px solid #E3E7F2'
          }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--grad-cta)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: 'var(--glow-orange)'
          }}>
            <CheckCircle2 size={36} strokeWidth={2} />
          </div>

          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#14308F',
            marginBottom: 6
          }}>
            BOOKING CONFIRMED & DISPATCHED
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: '0 0 8px 0', lineHeight: 1.25 }}>
            Appointment Locked In!
          </h2>

          <p style={{ fontSize: '14px', color: '#5B6478', lineHeight: 1.5, maxWidth: 320, margin: '0 auto 16px auto' }}>
            Your service request has been transmitted to regional dispatch. Master Technician Marcus Vance has been reserved.
          </p>

          {/* Booking ID Pill with Copy */}
          <div
            onClick={copyBookingId}
            className="tap-effect"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 20px',
              borderRadius: 9999,
              background: '#F1F5FB',
              border: '1px solid #E3E7F2',
              cursor: 'pointer',
              marginBottom: 16
            }}
          >
            <span style={{ fontSize: '13px', color: '#5B6478' }}>Booking ID:</span>
            <strong style={{ fontSize: '15px', color: '#14308F', letterSpacing: '0.04em' }}>
              {confirmedBooking.id}
            </strong>
            <Copy size={16} strokeWidth={2} color="#14308F" />
          </div>

          {/* Details Summary Table */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: 16,
            padding: 16,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            fontSize: '14px',
            color: '#0A0A0F'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6478' }}>Appliance:</span>
              <strong style={{ fontWeight: 600 }}>{confirmedBooking.brand} {confirmedBooking.applianceName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6478' }}>Slot Window:</span>
              <strong style={{ fontWeight: 600 }}>{confirmedBooking.date} ({confirmedBooking.timeSlot})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6478' }}>Service Address:</span>
              <strong style={{ textAlign: 'right', maxWidth: '60%', fontWeight: 600 }}>{confirmedBooking.address}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#5B6478' }}>Diagnostic Fee:</span>
              <strong style={{ color: '#14308F', fontWeight: 600 }}>$79 (Waived with repair)</strong>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => navigate('/track')}
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
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(11,31,92,0.3)'
            }}
          >
            <span>Track Repair Live</span>
            <ArrowLeft size={16} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
          </button>

          <button
            onClick={() => navigate('/')}
            className="tap-effect"
            style={{
              height: 44,
              padding: '0 20px',
              borderRadius: 9999,
              background: '#FFFFFF',
              color: '#0A0A0F',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid #E3E7F2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STEP 1 & 2 FORM
  // --------------------------------------------------------------------------
  return (
    <div className="has-sticky-bar" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Top Stepper Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
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
                cursor: 'pointer',
                color: '#0A0A0F',
                padding: 0
              }}
              aria-label="Back to Step 1"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          )}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#14308F',
              marginBottom: 4
            }}>
              STEP {step} OF 2
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.25 }}>
              {step === 1 ? 'Appliance & Preferred Time' : 'Location & Contact Details'}
            </h2>
          </div>
        </div>
      </div>

      {step === 1 ? (
        /* ====================================================================
           STEP 1: Appliance, Brand, Issues, Date Strip, Slot
           ==================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* 1. Appliance Picker Grid */}
          <div style={{
            background: '#FFFFFF',
            padding: 16,
            borderRadius: 20,
            border: '1px solid #E3E7F2',
            boxShadow: '0 4px 12px rgba(10,20,60,0.06)'
          }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0A0A0F', marginBottom: 12 }}>
              1. Select Appliance
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
              {APPLIANCE_CATEGORIES.map((app) => {
                const isSelected = selectedAppliance === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      setSelectedAppliance(app.id);
                      setSelectedSymptomChip('');
                    }}
                    className="tap-effect"
                    style={{
                      height: 48,
                      padding: '0 12px',
                      borderRadius: 12,
                      background: isSelected ? '#E8ECF8' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #14308F' : '1px solid #E3E7F2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: isSelected ? '#14308F' : '#F1F5FB',
                      color: isSelected ? '#FFFFFF' : '#14308F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Wrench size={16} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0A0A0F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brand Selector */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
              2. Appliance Manufacturer Brand
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MAJOR_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className="tap-effect"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 9999,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: selectedBrand === b ? 'var(--orange-600)' : 'var(--navy-50)',
                    color: selectedBrand === b ? '#FFFFFF' : 'var(--navy-900)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 12 }}>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="Model # if known (e.g. RF28R7351SR) - optional"
                style={{
                  width: '100%',
                  height: 40,
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: '0 12px',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>

          {/* 3. Common Symptoms & Details */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
              3. Primary Issue Symptom
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {activeApplianceObj.commonIssues.map((issue, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedSymptomChip(issue);
                    setIssueDescription(issue);
                  }}
                  className="tap-effect"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 12,
                    fontSize: '0.74rem',
                    background: selectedSymptomChip === issue ? 'var(--orange-50)' : '#FFFFFF',
                    color: selectedSymptomChip === issue ? 'var(--orange-600)' : 'var(--text-muted)',
                    border: selectedSymptomChip === issue ? '1.5px solid var(--orange-600)' : '1px solid var(--border)',
                    textAlign: 'left'
                  }}
                >
                  {issue}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe what happens when the issue occurs..."
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid var(--border)',
                padding: '10px 12px',
                fontSize: '0.82rem',
                resize: 'none'
              }}
            />
          </div>

          {/* 4. Date Strip */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
              4. Preferred Date
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {dateOptions.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDate(d.day)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 14,
                    background: selectedDate === d.day ? 'var(--orange-50)' : '#FFFFFF',
                    border: selectedDate === d.day ? '2px solid var(--orange-600)' : '1px solid var(--border)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)' }}>{d.day}</div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{d.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. 3-Hour Arrival Window */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 8 }}>
              5. 3-Hour Arrival Window
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TIME_SLOTS.map((slot) => (
                <label
                  key={slot.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: selectedSlot === slot.label ? 'var(--orange-50)' : '#FFFFFF',
                    border: selectedSlot === slot.label ? '1.5px solid var(--orange-600)' : '1px solid var(--border)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="slot"
                      checked={selectedSlot === slot.label}
                      onChange={() => setSelectedSlot(slot.label)}
                      style={{ accentColor: 'var(--orange-600)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                      {slot.label}
                    </span>
                  </div>
                  <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>
                    {slot.tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================================
           STEP 2: Contact, Address, Photo & Notes
           ==================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Customer Info Card */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 10 }}>
              Customer Contact Information
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>Email (for Invoice & Warranty)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>Mobile Phone (for arrival SMS)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Address Card */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 10 }}>
              Service Location Address
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>Street Address & Suite/Apt</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748B', marginBottom: 4 }}>Zip Code</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    style={{ width: '100%', height: 42, borderRadius: 12, border: '1px solid #CBD5E1', padding: '0 12px', fontSize: '0.86rem' }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Optional Photo Upload */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 4 }}>
              Appliance Photo / Model Tag (Optional)
            </label>
            <p style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 10 }}>
              Helps our dispatch technician pre-load the exact OEM parts onto the service van.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: 'var(--navy-50)',
                  border: '1px dashed var(--border)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--navy-900)'
                }}
              >
                <Camera size={18} color="var(--orange-600)" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {photoPreview && (
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', border: '2px solid var(--orange-600)' }}>
                  <img src={photoPreview} alt="Appliance" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          {/* Technician Instructions */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 6 }}>
              Special Access Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={technicianNotes}
              onChange={(e) => setTechnicianNotes(e.target.value)}
              placeholder="Gate code, dog on premises, parking notes..."
              style={{
                width: '100%',
                borderRadius: 12,
                border: '1px solid #CBD5E1',
                padding: '10px 12px',
                fontSize: '0.82rem',
                resize: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <StickyBookingBar
        step={step}
        onNext={handleNextStep}
        onConfirm={handleConfirmBooking}
        isSubmitting={isSubmitting}
        diagnosticFee={79}
        isValid={true}
      />
    </div>
  );
};

