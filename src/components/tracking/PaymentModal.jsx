import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, DollarSign, Smartphone } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, quote, onPaySuccess }) => {
  const [method, setMethod] = useState('card'); // 'card' | 'apple_pay' | 'cash'
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('883');

  if (!isOpen || !quote) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      setTimeout(() => {
        onPaySuccess(method === 'card' ? 'Visa •••• 4242' : (method === 'apple_pay' ? 'Apple Pay' : 'Cash upon Completion'));
        onClose();
        setPaid(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet-container glass-strong card-gloss"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-drag-handle" />

        <div className="sheet-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span className="badge badge-mint">SECURE CHECKOUT</span>
              <h3 style={{ fontSize: 'var(--fs-title)', color: '#0F2A44', marginTop: 4, fontWeight: 700 }}>
                Pay Diagnostic & Repair Bill
              </h3>
            </div>
            <button onClick={onClose} className="icon-btn-header">
              <X size={18} />
            </button>
          </div>

          {paid ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(31, 169, 113, 0.12)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle2 size={38} />
              </div>
              <h3 style={{ fontSize: 'var(--fs-title)', color: 'var(--navy-900)', marginBottom: 6, fontWeight: 700 }}>
                Payment Approved!
              </h3>
              <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text-muted)' }}>
                ${quote.total?.toFixed(2)} received. Your 90-day warranty certificate is now active.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay}>
              {/* Total display */}
              <div style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                background: 'var(--navy-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#7E92A2' }}>Total Amount Due</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--orange-600)' }}>
                    ${quote.total?.toFixed(2)}
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--navy-900)', textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>Includes Parts + Labor</div>
                  <div style={{ color: 'var(--orange-600)' }}>Diagnostic fee credited</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 14,
                    background: method === 'card' ? 'var(--orange-50)' : '#FFFFFF',
                    border: method === 'card' ? '2px solid var(--orange-600)' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <CreditCard size={18} color={method === 'card' ? 'var(--orange-600)' : '#7E92A2'} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-900)' }}>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('apple_pay')}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 14,
                    background: method === 'apple_pay' ? 'var(--orange-50)' : '#FFFFFF',
                    border: method === 'apple_pay' ? '2px solid var(--orange-600)' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Smartphone size={18} color={method === 'apple_pay' ? 'var(--orange-600)' : '#7E92A2'} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-900)' }}>Digital Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('cash')}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 14,
                    background: method === 'cash' ? 'var(--orange-50)' : '#FFFFFF',
                    border: method === 'cash' ? '2px solid var(--orange-600)' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <DollarSign size={18} color={method === 'cash' ? 'var(--orange-600)' : '#7E92A2'} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--navy-900)' }}>Pay Tech</span>
                </button>
              </div>

              {/* Form fields based on method */}
              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#0F2A44', marginBottom: 4 }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{
                        width: '100%',
                        height: 'var(--btn-h)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid #CBD5E1',
                        padding: '0 12px',
                        background: '#FFFFFF',
                        fontSize: 'var(--fs-body)'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#0F2A44', marginBottom: 4 }}>
                        Expires
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        style={{
                          width: '100%',
                          height: 'var(--btn-h)',
                          borderRadius: 'var(--radius)',
                          border: '1px solid #CBD5E1',
                          padding: '0 12px',
                          background: '#FFFFFF',
                          fontSize: 'var(--fs-body)'
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#0F2A44', marginBottom: 4 }}>
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        style={{
                          width: '100%',
                          height: 'var(--btn-h)',
                          borderRadius: 'var(--radius)',
                          border: '1px solid #CBD5E1',
                          padding: '0 12px',
                          background: '#FFFFFF',
                          fontSize: 'var(--fs-body)'
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'apple_pay' && (
                <div style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius)',
                  background: '#0F2A44',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: 16
                }}>
                  <div style={{ fontSize: 'var(--fs-card)', fontWeight: 700 }}>One-Touch Biometric Checkout</div>
                  <div style={{ fontSize: 'var(--fs-small)', color: '#94A3B8', marginTop: 4 }}>
                    Tap confirm below to authorize with Apple Pay / Google Wallet
                  </div>
                </div>
              )}

              {method === 'cash' && (
                <div style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--orange-50)',
                  color: 'var(--orange-600)',
                  fontSize: 'var(--fs-small)',
                  lineHeight: 1.4,
                  marginBottom: 16
                }}>
                  <strong>Direct In-Person Settlement:</strong> You can pay Master Technician Marcus in cash or check once the appliance repair is test-cycled and signed off.
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary btn-block tap-effect shine-sweep"
                style={{ height: 'var(--btn-h)', borderRadius: 'var(--radius)', fontSize: 'var(--fs-body)' }}
              >
                {processing ? 'Processing Payment...' : `Confirm Payment of $${quote.total?.toFixed(2)}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

