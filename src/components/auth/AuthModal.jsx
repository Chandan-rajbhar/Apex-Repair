import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal = () => {
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

  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

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
      } catch (err) {
        // error handled in context
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        register({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword
        });
      } catch (err) {
        // error handled in context
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const fillDemo = () => {
    setLoginIdentifier('demo@apex.com');
    setLoginPassword('Demo@123');
    setActiveTab('signin');
    showToast('Demo credentials prefilled!', 'info');
  };

  const handleForgotPassword = () => {
    showToast(`Password reset link sent to ${loginIdentifier || 'your email'}. Check your inbox!`, 'info');
  };

  return (
    <div className="sheet-backdrop" onClick={() => setAuthModalOpen(false)}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="badge badge-mint" style={{ marginBottom: 4 }}>APEX CUSTOMER PORTAL</span>
              <h2 id="auth-modal-title" style={{ fontSize: 'var(--fs-title)', color: '#0F2A44', marginTop: 4, fontWeight: 700 }}>
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Account'}
              </h2>
            </div>
            <button
              onClick={() => setAuthModalOpen(false)}
              className="icon-btn-header"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* 1-Click Demo Account Hint Banner */}
          <div
            onClick={fillDemo}
            className="tap-effect"
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'var(--grad-warm)',
              border: '1px solid rgba(34, 63, 107, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--orange-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={15} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--orange-600)' }}>Demo Credentials Ready</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--navy-900)' }}>demo@apex.com • Demo@123</div>
              </div>
            </div>
            <span className="badge badge-warm" style={{ background: '#FFFFFF', fontSize: '0.68rem' }}>
              Autofill
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderRadius: '9999px',
            background: 'rgba(15, 42, 68, 0.06)',
            padding: 4,
            marginBottom: 18
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: activeTab === 'signin' ? '#0F2A44' : '#7E92A2',
                background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(15, 42, 68, 0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: activeTab === 'register' ? '#0F2A44' : '#7E92A2',
                background: activeTab === 'register' ? '#FFFFFF' : 'transparent',
                boxShadow: activeTab === 'register' ? '0 2px 8px rgba(15, 42, 68, 0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 6 }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="demo@apex.com"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 14px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-900)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    style={{ fontSize: '0.72rem', color: 'var(--orange-600)', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 42px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }}
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--orange-600)', width: 16, height: 16 }}
                />
                <label htmlFor="remember-me" style={{ fontSize: '0.78rem', color: '#4A5D6E', cursor: 'pointer' }}>
                  Keep me signed in on this device
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{ height: 'var(--btn-h)', borderRadius: 'var(--radius)', fontSize: 'var(--fs-body)', marginTop: 4 }}
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Saurabh Yadav"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 14px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 14px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  Mobile Phone (for arrival SMS)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(877) 225-2046"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 14px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 5 }}>
                  Create Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{
                      width: '100%',
                      height: 'var(--btn-h)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid rgba(15, 42, 68, 0.14)',
                      padding: '0 42px 0 42px',
                      background: '#FFFFFF',
                      fontSize: 'var(--fs-body)'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#7E92A2' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{ height: 'var(--btn-h)', borderRadius: 'var(--radius)', fontSize: 'var(--fs-body)', marginTop: 6 }}
              >
                {loading ? 'Creating Account...' : 'Register & Continue'}
              </button>
            </form>
          )}

          {/* Guest notice */}
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              style={{ fontSize: '0.76rem', color: '#7E92A2', textDecoration: 'underline' }}
            >
              Continue without signing in (Guest mode enabled)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

