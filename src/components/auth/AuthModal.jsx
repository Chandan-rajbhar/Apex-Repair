import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  ShieldCheck,
  LogIn,
  UserPlus,
  Check,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, setAuthModalOpen, login, register } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'register'
  
  // Sign In fields
  const [loginIdentifier, setLoginIdentifier] = useState('demo@apex.com');
  const [loginPassword, setLoginPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('demo@apex.com');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

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

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      showToast('Please enter both email/phone and password.', 'warning');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        login(loginIdentifier, loginPassword);
        setAuthModalOpen(false);
      } catch (err) {
        // error handled in context
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }
    if (regPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }
    if (regConfirmPassword && regConfirmPassword !== regPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        register({
          name: regName,
          email: regEmail,
          phone: regPhone || '(877) 225-2046',
          password: regPassword
        });
        setAuthModalOpen(false);
      } catch (err) {
        // error handled in context
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const fillDemo = () => {
    setLoginIdentifier('demo@apex.com');
    setLoginPassword('Demo@123');
    setActiveTab('signin');
    showToast('Demo credentials prefilled! (demo@apex.com)', 'info');
  };

  const quickDemoLogin = () => {
    setLoginIdentifier('demo@apex.com');
    setLoginPassword('Demo@123');
    setActiveTab('signin');
    setLoading(true);
    setTimeout(() => {
      try {
        login('demo@apex.com', 'Demo@123');
        setAuthModalOpen(false);
      } catch (err) {}
      finally {
        setLoading(false);
      }
    }, 400);
  };

  const goToFullScreen = (path) => {
    setAuthModalOpen(false);
    navigate(path);
  };

  return (
    <div className="sheet-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        style={{
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body" style={{ padding: '4px 18px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span className="badge badge-mint" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                  APEX SECURE AUTH
                </span>
                <span style={{ fontSize: '0.7rem', color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                  <ShieldCheck size={13} /> 256-Bit SSL
                </span>
              </div>
              <h2 id="auth-modal-title" style={{ fontSize: '1.25rem', color: '#0B1F5C', margin: '2px 0 0', fontWeight: 800 }}>
                {isForgotPassword
                  ? 'Reset Password'
                  : activeTab === 'signin'
                  ? 'Welcome Back'
                  : 'Create Your Account'}
              </h2>
            </div>
            <button
              onClick={() => setAuthModalOpen(false)}
              className="tap-effect"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#F1F5FB',
                border: '1px solid #E3E7F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4A5A78',
                cursor: 'pointer'
              }}
              aria-label="Close dialog"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          {!isForgotPassword ? (
            <>

              {/* Segmented Pill Tabs */}
              <div
                style={{
                  display: 'flex',
                  borderRadius: '9999px',
                  background: '#F1F5F9',
                  padding: 3,
                  marginBottom: 16
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="tap-effect"
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: activeTab === 'signin' ? '#0B1F5C' : '#64748B',
                    background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                    boxShadow: activeTab === 'signin' ? '0 2px 6px rgba(11, 31, 92, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="tap-effect"
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: activeTab === 'register' ? '#0B1F5C' : '#64748B',
                    background: activeTab === 'register' ? '#FFFFFF' : 'transparent',
                    boxShadow: activeTab === 'register' ? '0 2px 6px rgba(11, 31, 92, 0.08)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserPlus size={15} />
                  <span>Register</span>
                </button>
              </div>

              {/* Tab 1: Sign In Form */}
              {activeTab === 'signin' ? (
                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                          height: 44,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 14px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1B2236' }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
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
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{
                          width: '100%',
                          height: 44,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 42px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                        aria-label="Toggle password view"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      id="modal-remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#14308F', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <label htmlFor="modal-remember-me" style={{ fontSize: '0.78rem', color: '#4A5D6E', cursor: 'pointer' }}>
                      Keep me signed in on this device
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="tap-effect shine-sweep"
                    style={{
                      height: 46,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(11, 31, 92, 0.2)'
                    }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In to Portal'}
                  </button>


                </form>
              ) : (
                /* Tab 2: Register Form */
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                          height: 42,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 14px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

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
                          height: 42,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 14px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

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
                          height: 42,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 14px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

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
                          height: 42,
                          borderRadius: 12,
                          border: '1.5px solid #E2E8F0',
                          padding: '0 42px 0 40px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                      >
                        {showRegPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {/* Mini strength bar */}
                    {regPassword.length > 0 && (
                      <div style={{ marginTop: 5, display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 2,
                              background: passwordStrength >= step ? strengthColors[passwordStrength] : '#E2E8F0'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 4 }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        style={{
                          width: '100%',
                          height: 42,
                          borderRadius: 12,
                          border: regConfirmPassword && regConfirmPassword !== regPassword ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
                          padding: '0 14px',
                          background: '#F8FAFC',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="tap-effect shine-sweep"
                    style={{
                      height: 46,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #0B1F5C 0%, #14308F 100%)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 12px rgba(11, 31, 92, 0.2)',
                      marginTop: 4
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Register & Continue'}
                  </button>


                </form>
              )}



              {/* Full page link & Guest link */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => goToFullScreen(activeTab === 'signin' ? '/login' : '/signup')}
                  className="tap-effect"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.74rem',
                    color: '#14308F',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: 0
                  }}
                >
                  <span>Open Dedicated Page</span>
                  <ExternalLink size={12} />
                </button>


              </div>
            </>
          ) : (
            /* Forgot Password Sub-View inside Modal */
            <div style={{ paddingTop: 4 }}>
              {!forgotSubmitted ? (
                <div>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: 14, lineHeight: 1.4 }}>
                    Enter your registered email address to receive password reset instructions.
                  </p>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#1B2236', marginBottom: 6 }}>
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
                      type="button"
                      onClick={() => {
                        setForgotSubmitted(true);
                        showToast(`Password reset link dispatched to ${forgotEmail}`, 'info');
                      }}
                      className="tap-effect"
                      style={{
                        flex: 1,
                        height: 42,
                        borderRadius: '9999px',
                        background: '#14308F',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="tap-effect"
                      style={{
                        height: 42,
                        padding: '0 14px',
                        borderRadius: '9999px',
                        background: '#F1F5FB',
                        color: '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
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
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#065F46', marginBottom: 2 }}>
                      Instructions Sent!
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                      Check <strong>{forgotEmail}</strong>. (Demo password: <strong>Demo@123</strong>)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setForgotSubmitted(false);
                    }}
                    className="tap-effect"
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: '9999px',
                      background: '#14308F',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
