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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 10, paddingBottom: 30 }}>
        {/* Success Header Card */}
        <div
          className="card-white card-gloss"
          style={{
            borderRadius: 28,
            padding: '28px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1.5px solid rgba(30, 123, 90, 0.25)'
          }}
        >
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--grad-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(30, 123, 90, 0.4)'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-mint" style={{ marginBottom: 6 }}>
            BOOKING CONFIRMED & DISPATCHED
          </span>

          <h2 style={{ fontSize: '1.6rem', color: '#0F2A44', margin: '4px 0 8px 0' }}>
            Appointment Locked In!
          </h2>

          <p style={{ fontSize: '0.8rem', color: '#4A5D6E', lineHeight: 1.45, maxWidth: 320, margin: '0 auto 18px auto' }}>
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
              padding: '10px 18px',
              borderRadius: 9999,
              background: '#F1F5FB',
              border: '1px solid rgba(15, 42, 68, 0.12)',
              cursor: 'pointer',
              marginBottom: 16
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#7E92A2' }}>Booking ID:</span>
            <strong style={{ fontSize: '1.05rem', color: '#1E7B5A', letterSpacing: '0.04em' }}>
              {confirmedBooking.id}
            </strong>
            <Copy size={16} color="#1E7B5A" />
          </div>

          {/* Details Summary Table */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: 18,
            padding: '14px 16px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: '0.78rem',
            color: '#334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7E92A2' }}>Appliance:</span>
              <strong>{confirmedBooking.brand} {confirmedBooking.applianceName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7E92A2' }}>Slot Window:</span>
              <strong>{confirmedBooking.date} ({confirmedBooking.timeSlot})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7E92A2' }}>Service Address:</span>
              <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{confirmedBooking.address}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7E92A2' }}>Diagnostic Fee:</span>
              <strong style={{ color: '#1E7B5A' }}>$79 (Waived with repair)</strong>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => navigate('/track')}
            className="btn btn-primary btn-block tap-effect shine-sweep"
            style={{ height: 50, fontSize: '0.94rem' }}
          >
            Track Repair Live (GPS Stepper) &rarr;
          </button>

          <button
            onClick={() => navigate('/')}
            className="btn btn-outline btn-block tap-effect"
            style={{ height: 46 }}
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
    <div className="has-sticky-bar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top Stepper Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="icon-btn-header"
              style={{ width: 34, height: 34 }}
              aria-label="Back to Step 1"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <span className="badge badge-mint" style={{ fontSize: '0.62rem' }}>
              STEP {step} OF 2
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#0F2A44', marginTop: 2 }}>
              {step === 1 ? 'Appliance & Preferred Time' : 'Location & Contact Details'}
            </h2>
          </div>
        </div>
      </div>

      {step === 1 ? (
        /* ====================================================================
           STEP 1: Appliance, Brand, Issues, Date Strip, Slot
           ==================================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 1. Appliance Picker Grid */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 10 }}>
              1. Select Appliance
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
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
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: isSelected ? '#E8F6EF' : '#FFFFFF',
                      border: isSelected ? '2px solid #1E7B5A' : '1px solid rgba(15,42,68,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'left'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isSelected ? '#1E7B5A' : '#F1F5FB',
                      color: isSelected ? '#FFFFFF' : '#1E7B5A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Wrench size={15} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44' }}>
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brand Selector */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 8 }}>
              2. Appliance Manufacturer Brand
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {MAJOR_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`tap-effect ${selectedBrand === b ? 'badge-green-pill' : ''}`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 9999,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: selectedBrand === b ? '#1E7B5A' : '#F1F5FB',
                    color: selectedBrand === b ? '#FFFFFF' : '#0F2A44',
                    border: '1px solid rgba(15,42,68,0.08)'
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
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>

          {/* 3. Common Symptoms & Details */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 8 }}>
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
                    background: selectedSymptomChip === issue ? '#E8F6EF' : '#FFFFFF',
                    color: selectedSymptomChip === issue ? '#1E7B5A' : '#4A5D6E',
                    border: selectedSymptomChip === issue ? '1.5px solid #1E7B5A' : '1px solid #E2E8F0',
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
                border: '1px solid #CBD5E1',
                padding: '10px 12px',
                fontSize: '0.82rem',
                resize: 'none'
              }}
            />
          </div>

          {/* 4. Date Strip */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 8 }}>
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
                    background: selectedDate === d.day ? '#E8F6EF' : '#FFFFFF',
                    border: selectedDate === d.day ? '2px solid #1E7B5A' : '1px solid #E2E8F0',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44' }}>{d.day}</div>
                  <div style={{ fontSize: '0.66rem', color: '#7E92A2' }}>{d.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. 3-Hour Arrival Window */}
          <div className="card-white" style={{ padding: 16, borderRadius: 22 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F2A44', marginBottom: 8 }}>
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
                    background: selectedSlot === slot.label ? '#E8F6EF' : '#FFFFFF',
                    border: selectedSlot === slot.label ? '1.5px solid #1E7B5A' : '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="slot"
                      checked={selectedSlot === slot.label}
                      onChange={() => setSelectedSlot(slot.label)}
                      style={{ accentColor: '#1E7B5A' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F2A44' }}>
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
                  background: '#F1F5FB',
                  border: '1px dashed #94A3B8',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0F2A44'
                }}
              >
                <Camera size={18} color="#1E7B5A" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {photoPreview && (
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', border: '2px solid #1E7B5A' }}>
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

