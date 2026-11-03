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
    <div className="card-white card-gloss" style={{ padding: '20px 18px', borderRadius: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: '1.05rem', color: '#0F2A44' }}>
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
                      ? 'var(--grad-primary)'
                      : isCurrent
                      ? '#1E7B5A'
                      : '#FFFFFF',
                    color: (isCompleted || isCurrent) ? '#FFFFFF' : '#94A3B8',
                    border: isUpcoming ? '2px solid #E2E8F0' : '2px solid #FFFFFF',
                    boxShadow: isCurrent ? '0 4px 14px rgba(30, 123, 90, 0.4)' : '0 2px 6px rgba(15,42,68,0.06)'
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
                      background: isCompleted ? '#1E7B5A' : '#E2E8F0',
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
                    color: isCurrent ? '#1E7B5A' : (isCompleted ? '#0F2A44' : '#94A3B8')
                  }}>
                    {status.label}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: isCurrent ? '#1E7B5A' : '#7E92A2'
                  }}>
                    {timestamp}
                  </span>
                </div>

                <div style={{
                  fontSize: '0.72rem',
                  lineHeight: 1.35,
                  color: isCurrent ? '#0F2A44' : '#64748B',
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
                    background: '#E8F6EF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid rgba(30, 123, 90, 0.25)'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E7B5A', animation: 'pulse 1.2s infinite' }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1E7B5A' }}>
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

