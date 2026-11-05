import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  ArrowLeft,
  Check,
  LogIn,
  UserPlus,
  X,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { showToast } = useToast();

  // Mode: isSignup is true if path is /signup or initialMode is 'signup'
  const isSignup = location.pathname === '/signup' || initialMode === 'signup';

  // Sign In state
  const [loginIdentifier, setLoginIdentifier] = useState('demo@apex.com');
  const [loginPassword, setLoginPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('demo@apex.com');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Password strength calculator (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(regPassword);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#E2E8F0', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'];

  // 1-Click Demo Sign In
  const handleQuickDemoSignIn = () => {
    setLoginIdentifier('demo@apex.com');
    setLoginPassword('Demo@123');
    setLoading(true);

    setTimeout(() => {
      try {
        login('demo@apex.com', 'Demo@123');
        showToast('Signed in successfully with Demo Account!', 'success');
        navigate('/profile');
      } catch (err) {
        showToast(err.message || 'Failed to sign in', 'error');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  // Sign In submit
  const handleSignIn = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      showToast('Please enter both your email/phone and password.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        login(loginIdentifier, loginPassword);
        showToast('Welcome back to Apex Repair!', 'success');
        navigate('/profile');
      } catch (err) {
        showToast(err.message || 'Invalid credentials. Try demo@apex.com / Demo@123', 'error');
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  // Register submit
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }

    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (regConfirmPassword && regPassword !== regConfirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'warning');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the Terms of Service to create an account.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        register({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim() || '(877) 225-2046',
          password: regPassword
        });
        showToast('Account created! Welcome to Apex Repair.', 'success');
        navigate('/profile');
      } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // Forgot password submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email address.', 'warning');
      return;
    }
    setForgotSubmitted(true);
    showToast(`Password reset link sent to ${forgotEmail}`, 'info');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '6px 0 28px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* --------------------------------------------------------------------------
          1. TOP NAVIGATION BAR (Back Button + SSL Badge)
          -------------------------------------------------------------------------- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="tap-effect"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FFFFFF',
            border: '1px solid #E3E7F2',
            padding: '7px 14px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1B2236',
            boxShadow: '0 2px 5px rgba(10, 20, 60, 0.05)',
            cursor: 'pointer'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
          <span>Back</span>
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: '#FFFFFF',
            border: '1px solid #E3E7F2',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#16A34A',
            boxShadow: '0 2px 5px rgba(10, 20, 60, 0.04)'
          }}
        >
          <ShieldCheck size={14} color="#16A34A" strokeWidth={2.2} />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
          2. MAIN AUTH CARD (No Top Tab Switcher - Dedicated Page Layout)
          -------------------------------------------------------------------------- */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-card, clamp(16px, 4vw, 20px))',
          border: '1px solid #E3E7F2',
          overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(10, 20, 60, 0.07)'
        }}
      >
        {/* Header Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B1F5C 0%, #16264A 55%, #1E3A8A 100%)',
            padding: 'clamp(18px, 4.5vw, 22px) clamp(16px, 4vw, 20px)',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #14308F 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                flexShrink: 0
              }}
            >
              <Wrench size={18} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.04em', lineHeight: 1.1, color: '#FFFFFF' }}>
                APEX REPAIR
              </div>
              <div style={{ fontSize: '0.64rem', fontWeight: 600, color: '#93C5FD', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PRECISION CARE & REPAIR
              </div>
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.25rem, 4.2vw, 1.45rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 4px',
              lineHeight: 1.25
            }}
          >
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.76rem, 2.7vw, 0.84rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            {isSignup
              ? 'Join Apex Repair for priority appliance scheduling, transparent estimates, and 90-day parts protection.'
              : 'Sign in to access your repair bookings, GPS technician tracking, and active warranty documents.'}
          </p>
        </div>

        {/* Card Body */}
        <div style={{ padding: 'clamp(16px, 4vw, 22px)' }}>

          {/* =====================================================================
              PAGE 1: LOGIN FORM (/login)
              ===================================================================== */}
          {!isSignup ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Email / Mobile input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 5 }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="demo@apex.com"
                    required
                    style={{
                      width: '100%',
                      height: 46,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 14px 0 42px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      color: '#0F172A',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#14308F';
                      e.target.style.background = '#FFFFFF';
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 48, 143, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.background = '#F8FAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B2236' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="tap-effect"
                    style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#14308F', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      height: 46,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 42px 0 42px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      color: '#0F172A',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#14308F';
                      e.target.style.background = '#FFFFFF';
                      e.target.style.boxShadow = '0 0 0 3px rgba(20, 48, 143, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.background = '#F8FAFC';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4 }}
                    aria-label="Toggle password view"
                  >
                    {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="page-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#14308F', cursor: 'pointer' }}
                />
                <label htmlFor="page-remember-me" style={{ fontSize: '0.78rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                  Keep me signed in on this mobile device
                </label>
              </div>

              {/* Primary Action Button: Sign In */}
              <button
                type="submit"
                disabled={loading}
                className="tap-effect shine-sweep"
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(11, 31, 92, 0.22)',
                  marginTop: 4
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn size={17} />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* ----------------------------------------------------------------
                  CLEAR "DON'T HAVE AN ACCOUNT? CREATE ACCOUNT" BELOW LOGIN FORM
                  ---------------------------------------------------------------- */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: '1px solid #EEF2F6',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span style={{ fontSize: '0.84rem', color: '#5B6B7C' }}>
                  Don't have an account?
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="tap-effect"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#14308F',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <span>Create Account</span>
                  <ChevronRight size={14} strokeWidth={2.4} />
                </button>
              </div>
            </form>
          ) : (
            /* =====================================================================
                PAGE 2: SIGNUP FORM (/signup)
                ===================================================================== */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 4 }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Saurabh Yadav"
                    required
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 14px 0 40px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 4 }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 14px 0 40px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 4 }}>
                  Mobile Phone (for arrival SMS)
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(877) 225-2046"
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 14px 0 40px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password with Strength bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B2236' }}>
                    Create Password *
                  </label>
                  {regPassword && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: strengthColors[passwordStrength] }}>
                      {strengthLabels[passwordStrength]}
                    </span>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: '11px',
                      border: '1.5px solid #E2E8F0',
                      padding: '0 42px 0 40px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4 }}
                  >
                    {showRegPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {regPassword.length > 0 && (
                  <div style={{ marginTop: 5, display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: passwordStrength >= step ? strengthColors[passwordStrength] : '#E2E8F0',
                          transition: 'background 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 4 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex' }}>
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    style={{
                      width: '100%',
                      height: 44,
                      borderRadius: '11px',
                      border: regConfirmPassword && regConfirmPassword !== regPassword ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
                      padding: '0 42px 0 40px',
                      background: '#F8FAFC',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4 }}
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {regConfirmPassword && (
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem' }}>
                    {regConfirmPassword === regPassword ? (
                      <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <Check size={13} strokeWidth={3} /> Passwords match
                      </span>
                    ) : (
                      <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <AlertCircle size={13} /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Agree terms */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 2 }}>
                <input
                  type="checkbox"
                  id="page-terms-agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#14308F', cursor: 'pointer', marginTop: 2 }}
                />
                <label htmlFor="page-terms-agree" style={{ fontSize: '0.74rem', color: '#475569', cursor: 'pointer', lineHeight: 1.35, userSelect: 'none' }}>
                  I agree to the <span style={{ color: '#14308F', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#14308F', fontWeight: 600 }}>Privacy Policy</span>.
                </label>
              </div>

              {/* Primary Action Button: Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="tap-effect shine-sweep"
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(11, 31, 92, 0.22)',
                  marginTop: 4
                }}
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus size={17} />
                    <span>Create  Account</span>
                  </>
                )}
              </button>

              {/* ----------------------------------------------------------------
                  CLEAR "ALREADY HAVE AN ACCOUNT? SIGN IN" BELOW SIGNUP FORM
                  ---------------------------------------------------------------- */}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 14,
                  borderTop: '1px solid #EEF2F6',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <span style={{ fontSize: '0.84rem', color: '#5B6B7C' }}>
                  Already have an account?
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="tap-effect"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#14308F',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <span>Sign In</span>
                  <ChevronRight size={14} strokeWidth={2.4} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Trust & Guarantee Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: '4px 0',
          fontSize: '0.74rem',
          color: '#64748B'
        }}
      >
        <span>🔒 256-Bit SSL Protection</span>
        <span>•</span>
        <span>🛡️ 90-Day Parts & Labor Warranty</span>
      </div>

      {/* --------------------------------------------------------------------------
          3. FORGOT PASSWORD MODAL
          -------------------------------------------------------------------------- */}
      {isForgotPasswordOpen && (
        <div
          className="sheet-backdrop"
          onClick={() => setIsForgotPasswordOpen(false)}
          style={{
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-strong card-gloss"
            style={{
              width: '100%',
              maxWidth: 360,
              background: '#FFFFFF',
              borderRadius: 20,
              padding: 22,
              boxShadow: '0 20px 50px rgba(10, 20, 60, 0.25)',
              border: '1px solid #E3E7F2',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="tap-effect"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#F1F5FB',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A5A78',
                cursor: 'pointer'
              }}
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HelpCircle size={18} strokeWidth={2.2} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Reset Your Password
              </h3>
            </div>

            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit}>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4, marginBottom: 14 }}>
                  Enter your email address to receive password reset instructions.
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 5 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: 10,
                      border: '1.5px solid #E2E8F0',
                      padding: '0 12px',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="submit"
                    className="tap-effect"
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: '9999px',
                      background: '#14308F',
                      color: '#FFFFFF',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="tap-effect"
                    style={{
                      height: 42,
                      padding: '0 14px',
                      borderRadius: '9999px',
                      background: '#F1F5FB',
                      color: '#475569',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div
                  style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 12,
                    padding: 14,
                    textAlign: 'center',
                    marginBottom: 14
                  }}
                >
                  <CheckCircle2 size={30} color="#10B981" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#065F46', marginBottom: 2 }}>
                    Reset Link Dispatched!
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                    Check inbox for <strong>{forgotEmail}</strong>. (Demo password: <strong>Demo@123</strong>)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="tap-effect"
                  style={{
                    width: '100%',
                    height: 42,
                    borderRadius: '9999px',
                    background: '#14308F',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
