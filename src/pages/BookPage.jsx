import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Shield,
  Upload,
  X,
  ChevronDown,
  Wind,
  Disc,
  Box,
  Flame,
  Tv,
  Droplets,
  Utensils,
  Sliders,
  AlertCircle,
  Sparkles,
  Search,
  Navigation
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Appliance Options with custom outline icons & fees
const APPLIANCE_OPTIONS = [
  { id: 'ac', name: 'Air conditioner', icon: Wind, fee: 49 },
  { id: 'washers', name: 'Washing machine', icon: Disc, fee: 39 },
  { id: 'refrigerators', name: 'Refrigerator', icon: Box, fee: 45 },
  { id: 'microwaves', name: 'Microwave', icon: Flame, fee: 35 },
  { id: 'televisions', name: 'Television', icon: Tv, fee: 45 },
  { id: 'water-heaters', name: 'Water heater', icon: Droplets, fee: 49 },
  { id: 'dishwashers', name: 'Dishwasher', icon: Utensils, fee: 45 },
  { id: 'other', name: 'Other machine', icon: Sliders, fee: 49 }
];

// Popular Brands per Appliance
const BRANDS_BY_APPLIANCE = {
  ac: ['Carrier', 'Daikin', 'Mitsubishi', 'LG', 'Samsung', 'Trane', 'Lennox', 'Gree', 'Other'],
  washers: ['Whirlpool', 'LG', 'Samsung', 'Bosch', 'Maytag', 'GE', 'Electrolux', 'Speed Queen', 'Other'],
  refrigerators: ['Samsung', 'LG', 'Whirlpool', 'GE Appliances', 'KitchenAid', 'Frigidaire', 'Bosch', 'Sub-Zero', 'Other'],
  microwaves: ['Panasonic', 'Breville', 'Samsung', 'LG', 'GE', 'Whirlpool', 'Toshiba', 'Sharp', 'Other'],
  televisions: ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Vizio', 'Philips', 'Other'],
  'water-heaters': ['Rheem', 'A.O. Smith', 'Bradford White', 'Rinnai', 'Navien', 'Bosch', 'Other'],
  dishwashers: ['Bosch', 'KitchenAid', 'Whirlpool', 'Miele', 'GE', 'Samsung', 'LG', 'Frigidaire', 'Other'],
  other: ['Whirlpool', 'GE', 'Samsung', 'LG', 'Bosch', 'Kenmore', 'Other']
};

// Symptoms per Appliance
const SYMPTOMS_BY_APPLIANCE = {
  ac: ['Not cooling properly', 'Water leaking or dripping', 'Strange rattling noise', 'Unpleasant smell', "Won't turn on", 'Remote or digital display error'],
  washers: ['Not draining water', 'Not spinning or agitating', 'Water leaking on floor', 'Loud banging noise', "Won't start cycle", 'Error code on screen'],
  refrigerators: ['Not cooling / food spoiling', 'Water leaking inside or below', 'Ice maker not working', 'Strange loud buzzing noise', 'Constant running / motor warm', 'Frost buildup in freezer'],
  microwaves: ['Not heating food', 'Turntable not rotating', 'Sparks inside cavity', 'Display or touchpad dead', "Door won't latch properly"],
  televisions: ['No power / black screen', 'Horizontal or vertical lines', 'No audio / speaker crackle', 'Flickering display', 'HDMI or input port failure'],
  'water-heaters': ['No hot water produced', 'Water leaking around tank', 'Rust-colored or cloudy water', 'Strange popping sounds'],
  dishwashers: ["Won't drain completely", 'Dishes still dirty after cycle', 'Water leaking onto floor', 'Error code / beeping sounds', "Door latch won't seal"],
  other: ['General electrical failure', 'Mechanical motor jam', 'Error code displayed', 'Burning odor / overheating']
};

export const BookPage = () => {
  const navigate = useNavigate();
  const { prefillData, setPrefillData, createBooking } = useBooking();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Wizard Steps: 1 Appliance, 2 Issue, 3 Schedule, 4 Details, 5 Review, 6 Success
  const [step, setStep] = useState(1);

  // Form State with localStorage persistence
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_booking_draft');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      applianceId: 'refrigerators',
      brand: 'Samsung',
      modelNumber: '',
      applianceAge: '2 to 5 years',
      underWarranty: false,
      symptoms: ['Not cooling / food spoiling'],
      issueDescription: '',
      photos: [],
      isUrgent: false,
      selectedDateIndex: 1, // Tomorrow
      timeSlot: '11 AM to 2 PM',
      fullName: user?.name || 'Saurabh Yadav',
      phone: user?.phone || '(877) 225-2046',
      countryCode: '+1',
      email: user?.email || 'demo@apex.com',
      streetAddress: user?.address || '742 Evergreen Terr',
      apartment: 'Suite 4B',
      landmark: '',
      city: user?.city || 'Springfield',
      postalCode: user?.zip || '62704',
      saveAddress: true,
      accessNotes: 'Side gate code: #402. Beware of golden retriever.',
      preferredContact: 'Call',
      agreedToTerms: false
    };
  });

  // Errors state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Brand dropdown modal/sheet
  const [showBrandSheet, setShowBrandSheet] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // Auto-save draft
  useEffect(() => {
    try {
      localStorage.setItem('apex_booking_draft', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  // Handle prefill from services or AI chat
  useEffect(() => {
    if (prefillData) {
      if (prefillData.applianceId) {
        setFormData(prev => ({ ...prev, applianceId: prefillData.applianceId }));
      }
      if (prefillData.brand) {
        setFormData(prev => ({ ...prev, brand: prefillData.brand }));
      }
      setPrefillData(null);
    }
  }, [prefillData, setPrefillData]);

  // Next 7 dynamic days
  const next7Days = (() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        index: i,
        weekday: dayNames[d.getDay()],
        dayNum: d.getDate(),
        month: monthNames[d.getMonth()],
        dateStr: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        tag: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : null,
        fullLabel: `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`
      });
    }
    return days;
  })();

  const activeAppliance = APPLIANCE_OPTIONS.find(a => a.id === formData.applianceId) || APPLIANCE_OPTIONS[2];
  const diagnosticFee = activeAppliance.fee;

  // Validation functions
  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.applianceId) errs.applianceId = 'Please select an appliance';
      if (!formData.brand.trim()) errs.brand = 'Please select or enter the brand';
    } else if (currentStep === 2) {
      if (formData.symptoms.length === 0 && !formData.issueDescription.trim()) {
        errs.symptoms = 'Please select at least one symptom or describe the issue';
      }
    } else if (currentStep === 3) {
      if (formData.selectedDateIndex === null) errs.date = 'Please choose a date';
      if (!formData.timeSlot) errs.timeSlot = 'Please choose a time window';
    } else if (currentStep === 4) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.phone.trim()) {
        errs.phone = 'Mobile number is required';
      } else if (formData.phone.replace(/\D/g, '').length < 7) {
        errs.phone = 'Please enter a valid mobile number';
      }
      if (!formData.streetAddress.trim()) errs.streetAddress = 'Street address is required';
      if (!formData.city.trim()) errs.city = 'City is required';
      if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';
    } else if (currentStep === 5) {
      if (!formData.agreedToTerms) errs.agreedToTerms = 'You must agree to the Terms and Cancellation policy';
    }
    return errs;
  };

  const isStepValid = (currentStep) => {
    const errs = validateStep(currentStep);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Please complete the required fields', 'warning');
      return;
    }
    setErrors({});
    if (step < 5) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 5) {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(-1);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const selectedDayObj = next7Days[formData.selectedDateIndex] || next7Days[1];
      const newBooking = createBooking({
        applianceId: formData.applianceId,
        applianceName: activeAppliance.name,
        brand: formData.brand,
        modelNumber: formData.modelNumber,
        symptoms: formData.symptoms,
        issueDescription: formData.issueDescription,
        date: selectedDayObj.fullLabel,
        timeSlot: formData.timeSlot,
        customerName: formData.fullName,
        customerPhone: `${formData.countryCode} ${formData.phone}`,
        customerEmail: formData.email,
        address: `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.postalCode}`,
        diagnosticFee,
        isUrgent: formData.isUrgent
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      setStep(6);
      showToast('Booking confirmed! Master technician assigned.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  const toggleSymptom = (sym) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(sym);
      const next = exists ? prev.symptoms.filter(s => s !== sym) : [...prev.symptoms, sym];
      return { ...prev, symptoms: next };
    });
    if (errors.symptoms) {
      setErrors(prev => ({ ...prev, symptoms: null }));
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (formData.photos.length + files.length > 3) {
      showToast('Maximum 3 photos allowed', 'warning');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    showToast('Photo attached', 'info');
  };

  const removePhoto = (idx) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  // ============================================================================
  // SUCCESS SCREEN (Step 6)
  // ============================================================================
  if (step === 6 && confirmedBooking) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-3) var(--page-pad-bottom) var(--space-3)', textAlign: 'center' }}>
        {/* Large Navy Check Icon */}
        <div style={{
          width: 'clamp(56px, 15vw, 68px)',
          height: 'clamp(56px, 15vw, 68px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          boxShadow: '0 8px 24px rgba(11,31,92,0.25)'
        }}>
          <Check size={32} strokeWidth={3} />
        </div>

        <div>
          <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 700, color: '#0A0A0F', margin: '0 0 6px 0' }}>
            Booking confirmed
          </h1>
          <p style={{ fontSize: 'var(--fs-body)', color: '#5B6478', margin: 0 }}>
            We've assigned master technician Marcus Vance to your repair order.
          </p>
        </div>

        {/* Booking Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius)',
          border: '1px solid #E3E7F2',
          padding: 'var(--space-3)',
          boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--fs-small)', fontFamily: 'monospace', fontWeight: 700, color: '#14308F', background: '#E8ECF8', padding: '4px 10px', borderRadius: 8 }}>
              #{confirmedBooking.id}
            </span>
            <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '3px 8px', borderRadius: 9999 }}>
              Confirmed
            </span>
          </div>

          <div style={{ height: 1, background: '#EEF1F8' }} />

          <div style={{ fontSize: 'var(--fs-body)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7A8299' }}>Appliance:</span>
              <span style={{ fontWeight: 600, color: '#0A0A0F' }}>{confirmedBooking.brand} {confirmedBooking.applianceName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7A8299' }}>Schedule:</span>
              <span style={{ fontWeight: 600, color: '#0A0A0F' }}>{confirmedBooking.date} ({confirmedBooking.timeSlot})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7A8299' }}>Address:</span>
              <span style={{ fontWeight: 600, color: '#0A0A0F', textAlign: 'right', maxWidth: '60%' }}>{confirmedBooking.address}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7A8299' }}>Diagnostic Fee:</span>
              <span style={{ fontWeight: 700, color: '#0B1F5C' }}>${diagnosticFee} (Pay after service)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button
            onClick={() => navigate('/track')}
            className="tap-effect"
            style={{
              height: 'var(--btn-h)',
              borderRadius: 9999,
              background: '#0B1F5C',
              color: '#FFFFFF',
              fontSize: 'var(--fs-body)',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(11,31,92,0.25)'
            }}
          >
            Track repair
          </button>

          <button
            onClick={() => showToast('Calendar reminder added for ' + confirmedBooking.date, 'info')}
            className="tap-effect"
            style={{
              height: 'var(--btn-h)',
              borderRadius: 9999,
              background: '#FFFFFF',
              color: '#0B1F5C',
              fontSize: 'var(--fs-body)',
              fontWeight: 600,
              border: '1px solid #E3E7F2',
              cursor: 'pointer'
            }}
          >
            Add to calendar
          </button>

          <button
            onClick={() => navigate('/')}
            className="tap-effect"
            style={{
              height: 'clamp(36px, 9vw, 40px)',
              background: 'none',
              border: 'none',
              color: '#7A8299',
              fontSize: 'var(--fs-body)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // Current Step Title
  const stepTitles = [
    'What needs repair?',
    "What's the problem?",
    'When should we come?',
    'Where should we send the technician?',
    'Review your booking'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0 0 var(--page-pad-bottom) 0' }}>
      {/* --------------------------------------------------------------------------
          TOP WIZARD HEADER & PROGRESS BAR
          -------------------------------------------------------------------------- */}
      <div style={{ padding: '0 var(--space-3) var(--space-2) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            className="tap-effect"
            style={{
              width: 'clamp(32px, 8.5vw, 36px)',
              height: 'clamp(32px, 8.5vw, 36px)',
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
            aria-label="Back"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          <div style={{ fontSize: 'var(--fs-card)', fontWeight: 600, color: '#0A0A0F' }}>
            Book a repair
          </div>

          <span style={{ fontSize: 'var(--fs-small)', fontWeight: 600, color: '#7A8299' }}>
            Step {step} of 5
          </span>
        </div>

        {/* 5-segment Progress Bar */}
        <div style={{ display: 'flex', gap: 4, width: '100%' }}>
          {[1, 2, 3, 4, 5].map((seg) => (
            <div
              key={seg}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 9999,
                background: seg <= step ? '#14308F' : '#E3E7F2',
                transition: 'background 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          WIZARD STEP BODY
          -------------------------------------------------------------------------- */}
      <div style={{ padding: '0 var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Step Title */}
        <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 600, color: '#0A0A0F', margin: 0, lineHeight: 1.25 }}>
          {stepTitles[step - 1]}
        </h1>

        {/* ------------------------------------------------------------------------
            STEP 1: APPLIANCE SELECTION
            ------------------------------------------------------------------------ */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 2-Column Grid of 8 Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--card-gap, clamp(8px, 2.5vw, 14px))' }}>
              {APPLIANCE_OPTIONS.map((item) => {
                const isSelected = formData.applianceId === item.id;
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        applianceId: item.id,
                        brand: BRANDS_BY_APPLIANCE[item.id]?.[0] || 'Whirlpool',
                        symptoms: []
                      }));
                      if (errors.applianceId) setErrors(prev => ({ ...prev, applianceId: null }));
                    }}
                    className="tap-effect"
                    style={{
                      minHeight: 'clamp(72px, 20vw, 84px)',
                      padding: 'var(--card-pad, clamp(10px, 2.8vw, 12px))',
                      borderRadius: 'var(--radius-card, clamp(14px, 3.8vw, 18px))',
                      background: isSelected ? '#E8ECF8' : '#FFFFFF',
                      border: isSelected ? '2px solid #0B1F5C' : '1px solid #E3E7F2',
                      boxShadow: '0 4px 12px rgba(10,20,60,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      position: 'relative',
                      textAlign: 'left',
                      boxSizing: 'border-box',
                      minWidth: 0
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#0B1F5C',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: isSelected ? '#FFFFFF' : '#F1F5FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#0B1F5C' : '#5B6478',
                      marginBottom: 6
                    }}>
                      <ItemIcon size={20} strokeWidth={2} />
                    </div>

                    <span style={{
                      fontSize: '14px',
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? '#0B1F5C' : '#0A0A0F',
                      lineHeight: 1.25,
                      wordBreak: 'break-word'
                    }}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Brand Dropdown Trigger */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Brand
              </label>
              <button
                type="button"
                onClick={() => setShowBrandSheet(true)}
                className="tap-effect"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: errors.brand ? '1.5px solid #C62828' : '1px solid #E3E7F2',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: 'var(--fs-body)',
                  fontWeight: 500,
                  color: '#0A0A0F'
                }}
              >
                <span>{formData.brand || 'Select brand'}</span>
                <ChevronDown size={18} color="#7A8299" />
              </button>
              {errors.brand && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.brand}</div>}
            </div>

            {/* Model Number (Optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Model number (optional)
              </label>
              <input
                type="text"
                value={formData.modelNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, modelNumber: e.target.value }))}
                placeholder="e.g. RF28R7351SG"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  background: '#FFFFFF',
                  fontSize: 'var(--fs-body)',
                  color: '#0A0A0F',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>
                Found on the label inside or behind the appliance
              </div>
            </div>

            {/* How old is it? */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                How old is it?
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Under 2 years', '2 to 5 years', 'Over 5 years'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, applianceAge: age }))}
                    className="tap-effect"
                    style={{
                      flex: 1,
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      background: formData.applianceAge === age ? '#0B1F5C' : '#FFFFFF',
                      color: formData.applianceAge === age ? '#FFFFFF' : '#1B2236',
                      border: formData.applianceAge === age ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                      fontSize: 'var(--fs-small)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Under Warranty Toggle */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E3E7F2',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>Under manufacturer warranty?</div>
                <div style={{ fontSize: '12px', color: '#7A8299' }}>OEM parts covered under warranty claim</div>
              </div>
              <input
                type="checkbox"
                checked={formData.underWarranty}
                onChange={(e) => setFormData(prev => ({ ...prev, underWarranty: e.target.checked }))}
                style={{ width: 22, height: 22, accentColor: '#0B1F5C', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------
            STEP 2: ISSUE & SYMPTOMS
            ------------------------------------------------------------------------ */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Symptom list as large rows with checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Select common symptoms
              </label>
              {(SYMPTOMS_BY_APPLIANCE[formData.applianceId] || SYMPTOMS_BY_APPLIANCE.other).map((sym) => {
                const isChecked = formData.symptoms.includes(sym);
                return (
                  <div
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className="tap-effect"
                    style={{
                      minHeight: 48,
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: isChecked ? '#E8ECF8' : '#FFFFFF',
                      border: isChecked ? '1.5px solid #0B1F5C' : '1px solid #E3E7F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: isChecked ? 600 : 500, color: '#0A0A0F' }}>
                      {sym}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      style={{ width: 20, height: 20, accentColor: '#0B1F5C', pointerEvents: 'none' }}
                    />
                  </div>
                );
              })}
              {errors.symptoms && <div style={{ fontSize: '13px', color: '#C62828' }}>{errors.symptoms}</div>}
            </div>

            {/* Describe issue multi-line textarea */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                  Describe the issue (optional)
                </label>
                <span style={{ fontSize: '12px', color: '#7A8299' }}>
                  {formData.issueDescription.length}/300
                </span>
              </div>
              <textarea
                value={formData.issueDescription}
                maxLength={300}
                onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
                placeholder="Any error codes, leaking spots, or unusual sounds you noticed..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid #E3E7F2',
                  background: '#FFFFFF',
                  fontSize: '15px',
                  color: '#0A0A0F',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Add photos upload box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Add photos or a short video (optional)
              </label>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {formData.photos.map((photo, idx) => (
                  <div key={idx} style={{ position: 'relative', width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: '1px solid #E3E7F2' }}>
                    <img src={photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {formData.photos.length < 3 && (
                  <label style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    border: '1.5px dashed #CBD5E1',
                    background: '#F8FAFC',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    gap: 2
                  }}>
                    <Upload size={18} />
                    <span style={{ fontSize: '10px', fontWeight: 600 }}>Upload</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </div>

            {/* Urgent / Emergency Toggle */}
            <div style={{
              background: formData.isUrgent ? '#FDECEC' : '#FFFFFF',
              borderRadius: 16,
              border: formData.isUrgent ? '1.5px solid #FCA5A5' : '1px solid #E3E7F2',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'background 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: formData.isUrgent ? '#DC2626' : '#0A0A0F' }}>
                    Is it urgent or an emergency?
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A8299' }}>
                    Active leaks, cooling failures, or smoke hazards
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                  style={{ width: 22, height: 22, accentColor: '#DC2626', cursor: 'pointer' }}
                />
              </div>

              {formData.isUrgent && (
                <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600, background: 'rgba(255,255,255,0.7)', padding: '6px 10px', borderRadius: 8 }}>
                  Priority dispatch, a technician will call within 30 minutes.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------
            STEP 3: SCHEDULE
            ------------------------------------------------------------------------ */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Horizontal Date Selector (7 Days) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Select appointment date
              </label>
              <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none'
              }}>
                {next7Days.map((d) => {
                  const isSelected = formData.selectedDateIndex === d.index;
                  return (
                    <button
                      key={d.index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, selectedDateIndex: d.index }))}
                      className="tap-effect"
                      style={{
                        flex: '0 0 76px',
                        height: 84,
                        borderRadius: 16,
                        background: isSelected ? '#0B1F5C' : '#FFFFFF',
                        border: isSelected ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                        color: isSelected ? '#FFFFFF' : '#0A0A0F',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 4px 12px rgba(11,31,92,0.2)' : 'none'
                      }}
                    >
                      {d.tag ? (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: isSelected ? '#A9BCF5' : '#14308F'
                        }}>
                          {d.tag}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', opacity: 0.8 }}>{d.weekday}</span>
                      )}
                      <span style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.1 }}>
                        {d.dayNum}
                      </span>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Windows as Vertical List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Choose a 3-hour arrival window
              </label>

              {[
                { slot: '8 AM to 11 AM', left: '3 slots left', available: true },
                { slot: '11 AM to 2 PM', left: '4 slots left', available: true },
                { slot: '2 PM to 5 PM', left: '2 slots left', available: true }
              ].map((time) => {
                const isSelected = formData.timeSlot === time.slot;
                return (
                  <div
                    key={time.slot}
                    onClick={() => {
                      if (time.available) {
                        setFormData(prev => ({ ...prev, timeSlot: time.slot }));
                      }
                    }}
                    className="tap-effect"
                    style={{
                      height: 52,
                      padding: '0 16px',
                      borderRadius: 14,
                      background: isSelected ? '#E8ECF8' : time.available ? '#FFFFFF' : '#F8FAFC',
                      border: isSelected ? '1.5px solid #0B1F5C' : '1px solid #E3E7F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: time.available ? 'pointer' : 'not-allowed',
                      opacity: time.available ? 1 : 0.6
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: isSelected ? '5px solid #0B1F5C' : '1.5px solid #CBD5E1',
                        background: '#FFFFFF'
                      }} />
                      <span style={{ fontSize: '15px', fontWeight: isSelected ? 700 : 500, color: '#0A0A0F' }}>
                        {time.slot}
                      </span>
                    </div>

                    <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#0B1F5C' : '#16A34A' }}>
                      {time.left}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Helper Note */}
            <div style={{ fontSize: '13px', color: '#5B6478', lineHeight: 1.4, background: '#F8FAFC', padding: 12, borderRadius: 12, border: '1px solid #EEF1F8' }}>
              A technician will arrive within your chosen 3-hour window and call 30 minutes before.
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------
            STEP 4: YOUR DETAILS
            ------------------------------------------------------------------------ */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick autofill location button */}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  streetAddress: '742 Evergreen Terr',
                  apartment: 'Suite 4B',
                  city: 'Springfield',
                  postalCode: '62704'
                }));
                showToast('Address filled from saved location', 'info');
              }}
              className="tap-effect"
              style={{
                height: 40,
                borderRadius: 10,
                background: '#F1F5FB',
                border: '1px solid #E3E7F2',
                color: '#0B1F5C',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <Navigation size={14} />
              <span>Use my current location</span>
            </button>

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Full name <span style={{ color: '#C62828' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="e.g. Saurabh Yadav"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: errors.fullName ? '1.5px solid #C62828' : '1px solid #E3E7F2',
                  fontSize: 'var(--fs-body)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.fullName && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.fullName}</div>}
            </div>

            {/* Mobile Number with Country Code */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Mobile number <span style={{ color: '#C62828' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  value={formData.countryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                  style={{
                    height: 'var(--btn-h)',
                    width: 76,
                    borderRadius: 'var(--radius)',
                    border: '1px solid #E3E7F2',
                    background: '#FFFFFF',
                    fontSize: 'var(--fs-body)',
                    fontWeight: 600,
                    padding: '0 6px',
                    outline: 'none'
                  }}
                >
                  <option value="+1">+1 US</option>
                  <option value="+44">+44 UK</option>
                  <option value="+91">+91 IN</option>
                  <option value="+61">+61 AU</option>
                </select>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(877) 225-2046"
                  style={{
                    flex: 1,
                    height: 'var(--btn-h)',
                    padding: '0 var(--space-3)',
                    borderRadius: 'var(--radius)',
                    border: errors.phone ? '1.5px solid #C62828' : '1px solid #E3E7F2',
                    fontSize: 'var(--fs-body)',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>
                We'll send a confirmation and call you before arrival.
              </div>
              {errors.phone && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.phone}</div>}
            </div>

            {/* Email (Optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Email address (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="demo@apex.com"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid #E3E7F2',
                  fontSize: 'var(--fs-body)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Street Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                Street address <span style={{ color: '#C62828' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                placeholder="e.g. 742 Evergreen Terr"
                style={{
                  height: 'var(--btn-h)',
                  padding: '0 var(--space-3)',
                  borderRadius: 'var(--radius)',
                  border: errors.streetAddress ? '1.5px solid #C62828' : '1px solid #E3E7F2',
                  fontSize: 'var(--fs-body)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.streetAddress && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.streetAddress}</div>}
            </div>

            {/* Flat & Landmark Row */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>Flat / Apt</label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData(prev => ({ ...prev, apartment: e.target.value }))}
                  placeholder="Suite 4B"
                  style={{ height: 'var(--btn-h)', padding: '0 var(--space-3)', borderRadius: 'var(--radius)', border: '1px solid #E3E7F2', fontSize: 'var(--fs-body)', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>Landmark (optional)</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="Near Park"
                  style={{ height: 'var(--btn-h)', padding: '0 var(--space-3)', borderRadius: 'var(--radius)', border: '1px solid #E3E7F2', fontSize: 'var(--fs-body)', outline: 'none' }}
                />
              </div>
            </div>

            {/* City & Postal Code */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                  City <span style={{ color: '#C62828' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Springfield"
                  style={{ height: 'var(--btn-h)', padding: '0 var(--space-3)', borderRadius: 'var(--radius)', border: errors.city ? '1.5px solid #C62828' : '1px solid #E3E7F2', fontSize: 'var(--fs-body)', outline: 'none' }}
                />
                {errors.city && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.city}</div>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>
                  Postal code <span style={{ color: '#C62828' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  placeholder="62704"
                  style={{ height: 'var(--btn-h)', padding: '0 var(--space-3)', borderRadius: 'var(--radius)', border: errors.postalCode ? '1.5px solid #C62828' : '1px solid #E3E7F2', fontSize: 'var(--fs-body)', outline: 'none' }}
                />
                {errors.postalCode && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828' }}>{errors.postalCode}</div>}
              </div>
            </div>

            {/* Save address checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}>
              <input
                type="checkbox"
                checked={formData.saveAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, saveAddress: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: '#0B1F5C' }}
              />
              <span style={{ fontSize: '14px', color: '#0A0A0F' }}>Save this address for next time</span>
            </label>

            {/* Access notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Access notes (optional)
              </label>
              <input
                type="text"
                value={formData.accessNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, accessNotes: e.target.value }))}
                placeholder="Gate code, parking instructions, pets..."
                style={{ height: 48, padding: '0 16px', borderRadius: 12, border: '1px solid #E3E7F2', fontSize: '15px', outline: 'none' }}
              />
            </div>

            {/* Preferred Contact Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0A0A0F' }}>
                Preferred contact method
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Call', 'WhatsApp'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, preferredContact: method }))}
                    className="tap-effect"
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 12,
                      background: formData.preferredContact === method ? '#0B1F5C' : '#FFFFFF',
                      color: formData.preferredContact === method ? '#FFFFFF' : '#1B2236',
                      border: formData.preferredContact === method ? '1px solid #0B1F5C' : '1px solid #E3E7F2',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------
            STEP 5: REVIEW AND CONFIRM
            ------------------------------------------------------------------------ */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary Card with editable sections */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E3E7F2',
              padding: 16,
              boxShadow: '0 4px 12px rgba(10,20,60,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              {/* Section 1: Appliance */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A8299', textTransform: 'uppercase' }}>
                    1. Appliance
                  </span>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#14308F', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                  {formData.brand} {activeAppliance.name}
                </div>
                {formData.modelNumber && (
                  <div style={{ fontSize: '13px', color: '#5B6478' }}>Model: {formData.modelNumber}</div>
                )}
                <div style={{ fontSize: '12px', color: '#7A8299' }}>Age: {formData.applianceAge}</div>
              </div>

              <div style={{ height: 1, background: '#EEF1F8' }} />

              {/* Section 2: Issue */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A8299', textTransform: 'uppercase' }}>
                    2. Symptoms & Issues
                  </span>
                  <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#14308F', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: '#0A0A0F', lineHeight: 1.4 }}>
                  {formData.symptoms.join(', ') || formData.issueDescription || 'Standard Diagnostic Check'}
                </div>
                {formData.isUrgent && (
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626', marginTop: 2 }}>
                    Priority emergency dispatch
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: '#EEF1F8' }} />

              {/* Section 3: Schedule */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A8299', textTransform: 'uppercase' }}>
                    3. Schedule Window
                  </span>
                  <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: '#14308F', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                  {next7Days[formData.selectedDateIndex]?.fullLabel}
                </div>
                <div style={{ fontSize: '13px', color: '#5B6478' }}>
                  Window: {formData.timeSlot}
                </div>
              </div>

              <div style={{ height: 1, background: '#EEF1F8' }} />

              {/* Section 4: Address & Contact */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#7A8299', textTransform: 'uppercase' }}>
                    4. Address & Contact
                  </span>
                  <button onClick={() => setStep(4)} style={{ background: 'none', border: 'none', color: '#14308F', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A0A0F' }}>
                  {formData.fullName}
                </div>
                <div style={{ fontSize: '13px', color: '#5B6478' }}>
                  {formData.countryCode} {formData.phone}
                </div>
                <div style={{ fontSize: '13px', color: '#5B6478' }}>
                  {formData.streetAddress}, {formData.apartment}, {formData.city}, {formData.postalCode}
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div style={{
              background: '#F1F5FB',
              borderRadius: 'var(--radius)',
              border: '1px solid #E3E7F2',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--fs-body)', color: '#5B6478' }}>Diagnostic fee</span>
                <span style={{ fontSize: 'var(--fs-card)', fontWeight: 700, color: '#0B1F5C' }}>${diagnosticFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--fs-body)', fontWeight: 600, color: '#0A0A0F' }}>Estimated total due now</span>
                <span style={{ fontSize: 'var(--fs-title)', fontWeight: 700, color: '#16A34A' }}>$0.00</span>
              </div>
              <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299', lineHeight: 1.4, marginTop: 2 }}>
                You pay only after the technician explains the repair and you approve it.
              </div>
            </div>

            {/* Payment Method Row */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius)',
              border: '1px solid #E3E7F2',
              padding: 'var(--space-2) var(--space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 'var(--fs-body)'
            }}>
              <span style={{ color: '#5B6478' }}>Payment method:</span>
              <span style={{ fontWeight: 600, color: '#0A0A0F' }}>Pay after service (Card, Cash, Apple Pay)</span>
            </div>

            {/* Agreement Checkbox */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }));
                    if (errors.agreedToTerms) setErrors(prev => ({ ...prev, agreedToTerms: null }));
                  }}
                  style={{ width: 18, height: 18, marginTop: 2, accentColor: '#0B1F5C' }}
                />
                <span style={{ fontSize: 'var(--fs-small)', color: '#5B6478', lineHeight: 1.4 }}>
                  I agree to the <span style={{ color: '#14308F', fontWeight: 600 }}>Terms and Cancellation policy</span>. Free cancellation up to 2 hours before the window.
                </span>
              </label>
              {errors.agreedToTerms && <div style={{ fontSize: 'var(--fs-small)', color: '#C62828', marginLeft: 28 }}>{errors.agreedToTerms}</div>}
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------------
          STICKY BOTTOM ACTION BAR (Device Safe Area + 16px Padding)
          -------------------------------------------------------------------------- */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 'var(--app-max-width, 480px)',
        background: '#FFFFFF',
        borderTop: '1px solid #E3E7F2',
        padding: 'clamp(8px, 2.5vw, 12px) var(--page-pad-x) calc(clamp(8px, 2.5vw, 12px) + env(safe-area-inset-bottom, 0px)) var(--page-pad-x)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
        boxShadow: '0 -4px 16px rgba(10,20,60,0.08)',
        boxSizing: 'border-box'
      }}>
        {/* Left: Diagnostic fee */}
        <div>
          <div style={{ fontSize: 'var(--fs-small)', color: '#7A8299' }}>Diagnostic fee</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 'var(--fs-title)', fontWeight: 700, color: '#0B1F5C' }}>${diagnosticFee}</span>
            <span style={{ fontSize: 'var(--fs-small)', color: '#16A34A', fontWeight: 600 }}>Credited toward repair</span>
          </div>
        </div>

        {/* Right: Glossy Navy Button (Continue / Confirm booking) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid(step) || isSubmitting}
          className="tap-effect"
          style={{
            height: 'var(--btn-h)',
            padding: '0 clamp(16px, 5vw, 24px)',
            borderRadius: 9999,
            background: isStepValid(step) && !isSubmitting ? '#0B1F5C' : '#CBD5E1',
            color: '#FFFFFF',
            fontSize: 'var(--fs-body)',
            fontWeight: 600,
            border: 'none',
            cursor: isStepValid(step) && !isSubmitting ? 'pointer' : 'not-allowed',
            boxShadow: isStepValid(step) && !isSubmitting ? '0 4px 14px rgba(11,31,92,0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          {isSubmitting ? (
            <span>Securing booking...</span>
          ) : step === 5 ? (
            <span>Confirm booking</span>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </div>

      {/* --------------------------------------------------------------------------
          BRAND SELECTION BOTTOM SHEET / MODAL
          -------------------------------------------------------------------------- */}
      {showBrandSheet && (
        <div className="sheet-backdrop" onClick={() => setShowBrandSheet(false)}>
          <div
            className="sheet-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '20px 16px 32px 16px',
              maxHeight: '75vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E2E8F0', margin: '0 auto 16px auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0A0A0F', margin: 0 }}>
                Select {activeAppliance.name} Brand
              </h3>
              <button
                onClick={() => setShowBrandSheet(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={16} color="#7A8299" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand name..."
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 12px 0 36px',
                  borderRadius: 10,
                  border: '1px solid #E3E7F2',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(BRANDS_BY_APPLIANCE[formData.applianceId] || BRANDS_BY_APPLIANCE.other)
                .filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
                .map((brand) => (
                  <div
                    key={brand}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, brand }));
                      if (errors.brand) setErrors(prev => ({ ...prev, brand: null }));
                      setShowBrandSheet(false);
                      setBrandSearch('');
                    }}
                    className="tap-effect"
                    style={{
                      height: 48,
                      padding: '0 16px',
                      borderRadius: 12,
                      background: formData.brand === brand ? '#E8ECF8' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: formData.brand === brand ? 700 : 500,
                      color: formData.brand === brand ? '#0B1F5C' : '#0A0A0F'
                    }}
                  >
                    <span>{brand}</span>
                    {formData.brand === brand && <Check size={18} color="#0B1F5C" strokeWidth={2.5} />}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
