import React from 'react';
import {
  ClipboardCheck,
  CalendarCheck2,
  UserCheck,
  Truck,
  Search,
  FileCheck,
  Wrench,
  CheckCircle2,
  Receipt,
  Check
} from 'lucide-react';
import { TRACKING_STATUSES } from '../../data/mockData';

const iconMap = {
  ClipboardCheck,
  CalendarCheck2,
  UserCheck,
  Truck,
  Search,
  FileCheck,
  Wrench,
  CheckCircle2,
  Receipt
};

export const TrackingStepper = ({ currentStep = 4, timeline = [] }) => {
  return (
    <div className="card-white card-gloss" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 'var(--fs-card)', color: '#0F2A44' }}>
          Diagnostic & Repair Timeline
        </h3>
        <span className="badge badge-mint">
          Step {currentStep} of 9
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {TRACKING_STATUSES.map((status, index) => {
          const isCompleted = status.id < currentStep;
          const isCurrent = status.id === currentStep;
          const isUpcoming = status.id > currentStep;
          const isLast = index === TRACKING_STATUSES.length - 1;

          const IconComponent = iconMap[status.iconName] || ClipboardCheck;

          // Find timestamp from timeline if recorded
          const timelineEntry = timeline?.find(t => t.step === status.id);
          const timestamp = timelineEntry ? timelineEntry.time : (isCompleted ? 'Completed' : '--:--');

          return (
            <div key={status.id} style={{ display: 'flex', gap: 14, minHeight: isCurrent ? 74 : 58 }}>
              {/* Left Column: Icon Circle & Connector Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 34, flexShrink: 0 }}>
                {/* Node Circle */}
                <div
                  className={`tap-effect ${isCurrent ? 'glow-pulse-primary glow-pulse-status' : ''}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                    background: isCompleted
                      ? 'var(--success)'
                      : isCurrent
                      ? 'var(--grad-cta)'
                      : 'var(--navy-50)',
                    color: (isCompleted || isCurrent) ? '#FFFFFF' : 'var(--text-muted)',
                    border: isUpcoming ? '2px solid var(--border)' : '2px solid #FFFFFF',
                    boxShadow: isCurrent ? 'var(--glow-orange)' : 'var(--shadow-xs)'
                  }}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.8} />
                  ) : (
                    <IconComponent size={16} strokeWidth={isCurrent ? 2.5 : 2} />
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div
                    style={{
                      width: 2.5,
                      flex: 1,
                      margin: '3px 0',
                      background: isCompleted ? 'var(--success)' : 'var(--border)',
                      transition: 'background 0.3s ease'
                    }}
                  />
                )}
              </div>

              {/* Right Column: Title, Description & Timestamp */}
              <div style={{ flex: 1, paddingBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                  <span style={{
                    fontSize: '0.86rem',
                    fontWeight: isCurrent ? 800 : (isCompleted ? 700 : 500),
                    color: isCurrent ? 'var(--orange-600)' : (isCompleted ? 'var(--navy-900)' : 'var(--text-muted)')
                  }}>
                    {status.label}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: isCurrent ? 'var(--orange-600)' : 'var(--text-muted)'
                  }}>
                    {timestamp}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  lineHeight: 1.35,
                  color: isCurrent ? 'var(--navy-900)' : 'var(--text-muted)',
                  marginTop: 2
                }}>
                  {status.desc}
                </div>

                {/* Expanded highlight badge on current step */}
                {isCurrent && (
                  <div style={{
                    marginTop: 6,
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: 'var(--orange-50)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid rgba(34, 63, 107, 0.2)'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-600)', animation: 'pulse 1.2s infinite' }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--orange-700)' }}>
                      Active Status • Telemetry Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

