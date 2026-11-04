import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export const QuoteApprovalCard = ({ quote, onApprove, onDecline, isStep6 = false }) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('Cost exceeds appliance replacement value');

  if (!quote) return null;

  const isPending = quote.status === 'pending';
  const isApproved = quote.status === 'approved';
  const isDeclined = quote.status === 'declined';

  const declineReasons = [
    'Cost exceeds appliance replacement value',
    'Prefer to seek a second opinion',
    'Timing does not work for repair',
    'Ordering a brand new appliance',
    'Other reason'
  ];

  const handleDeclineConfirm = () => {
    onDecline(declineReason);
    setShowDeclineModal(false);
  };

  return (
    <div
      className="card-white card-gloss"
      style={{
        borderRadius: 'var(--radius)',
        padding: 'var(--space-3)',
        border: isPending ? '2px solid rgba(34, 63, 107, 0.35)' : '1px solid rgba(15, 42, 68, 0.08)',
        background: isPending ? 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)' : '#FFFFFF'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: isPending ? 'var(--orange-50)' : 'var(--navy-50)',
            color: isPending ? 'var(--orange-600)' : 'var(--navy-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCheck size={17} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--navy-900)', fontWeight: 800 }}>
              Physical Diagnostic & Repair Quote
            </h4>
            <div style={{ fontSize: '0.68rem', color: '#7E92A2' }}>
              Itemized root-cause estimate
            </div>
          </div>
        </div>

        {isApproved && <span className="badge badge-success"><CheckCircle2 size={12} /> Approved</span>}
        {isDeclined && <span className="badge badge-orange"><XCircle size={12} /> Declined</span>}
        {isPending && <span className="badge badge-orange">Action Required</span>}
      </div>

      {/* Diagnosis Title */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 14,
        background: 'var(--navy-50)',
        marginBottom: 14,
        fontSize: '0.78rem',
        color: 'var(--navy-900)',
        fontWeight: 700,
        lineHeight: 1.35
      }}>
        <span style={{ color: 'var(--orange-600)', fontWeight: 800 }}>Identified: </span>
        {quote.diagnosisTitle}
      </div>

      {/* Line Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {quote.breakdown?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: item.waived ? 'var(--success)' : 'var(--text-muted)',
              paddingBottom: 6,
              borderBottom: '1px dashed rgba(15, 42, 68, 0.08)'
            }}
          >
            <span>{item.item}</span>
            <span style={{ fontWeight: 700 }}>
              {item.waived ? '-$79.00 (Credited)' : `$${item.price.toFixed(2)}`}
            </span>
          </div>
        ))}

        {/* Subtotal & Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#7E92A2', marginTop: 4 }}>
          <span>Parts & Labor Subtotal</span>
          <span>${quote.subtotal?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#7E92A2' }}>
          <span>Estimated Sales Tax</span>
          <span>${quote.tax?.toFixed(2)}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '1.05rem',
          fontWeight: 800,
          color: 'var(--navy-900)',
          paddingTop: 8,
          borderTop: '2px solid rgba(15, 42, 68, 0.1)'
        }}>
          <span>Authorized Total</span>
          <span style={{ color: 'var(--orange-600)' }}>${quote.total?.toFixed(2)}</span>
        </div>
      </div>

      {/* Warranty assurance */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 10px',
        borderRadius: 12,
        background: 'var(--orange-50)',
        color: 'var(--orange-600)',
        fontSize: '0.72rem',
        fontWeight: 600,
        marginBottom: isPending ? 14 : 0
      }}>
        <ShieldCheck size={16} />
        <span>Includes 90-Day Unconditional Parts & Labor Warranty</span>
      </div>

      {/* Approval Actions (only if pending) */}
      {isPending && (
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => onApprove(quote)}
            className="btn btn-primary tap-effect shine-sweep"
            style={{ flex: 2, height: 44, fontSize: '0.84rem' }}
          >
            ✓ Approve & Authorize Repair
          </button>
          <button
            onClick={() => setShowDeclineModal(true)}
            className="btn btn-outline tap-effect"
            style={{ flex: 1, height: 44, fontSize: '0.82rem', color: 'var(--text-muted)', borderColor: 'rgba(22, 38, 74, 0.2)' }}
          >
            Decline
          </button>
        </div>
      )}

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="sheet-backdrop" onClick={() => setShowDeclineModal(false)}>
          <div
            className="sheet-container glass-strong card-gloss"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: 20 }}
          >
            <div className="sheet-drag-handle" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: '10px 0 6px 0' }}>
              Decline Quote Reason
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: 14 }}>
              If you decline the repair, only the $79 diagnostic fee will apply. Please select a reason:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {declineReasons.map((r, i) => (
                <label
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: declineReason === r ? 'var(--orange-50)' : '#FFFFFF',
                    border: declineReason === r ? '1.5px solid var(--orange-600)' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--navy-900)'
                  }}
                >
                  <input
                    type="radio"
                    name="decline-reason"
                    checked={declineReason === r}
                    onChange={() => setDeclineReason(r)}
                    style={{ accentColor: 'var(--orange-600)' }}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleDeclineConfirm}
                className="btn btn-block btn-primary"
                style={{ background: '#DC2626' }}
              >
                Confirm Decline
              </button>
              <button
                onClick={() => setShowDeclineModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

