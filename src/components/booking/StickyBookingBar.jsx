import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StickyBookingBar = ({
  step = 1,
  onNext,
  onConfirm,
  isSubmitting = false,
  diagnosticFee = 79,
  isValid = true
}) => {
  return (
    <div className="sticky-confirm-bar glass-strong">
      <div className="confirm-bar-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ShieldCheck size={13} color="var(--orange-600)" />
          <span className="confirm-bar-label">Diagnostic Fee</span>
        </div>
        <div className="confirm-bar-price">
          ${diagnosticFee}
        </div>
        <span className="confirm-bar-sub">
          100% Waived with repair
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {step === 1 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className="btn btn-primary tap-effect shine-sweep"
            style={{
              padding: '0 var(--space-3)',
              height: 'var(--btn-h)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--fs-body)',
              opacity: isValid ? 1 : 0.5
            }}
          >
            Contact & Address <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isValid || isSubmitting}
            className="btn btn-primary tap-effect shine-sweep"
            style={{
              padding: '0 var(--space-3)',
              height: 'var(--btn-h)',
              borderRadius: 'var(--radius)',
              fontSize: 'var(--fs-body)',
              background: 'var(--grad-cta)',
              opacity: isValid ? 1 : 0.5
            }}
          >
            {isSubmitting ? 'Confirming...' : 'Lock In Appointment ✓'}
          </button>
        )}
      </div>
    </div>
  );
};

