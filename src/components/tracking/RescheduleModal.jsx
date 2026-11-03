import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { TIME_SLOTS } from '../../data/appliancesData';

export const RescheduleModal = ({ isOpen, onClose, onConfirm, currentSlot, currentDate }) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0].label);

  if (!isOpen) return null;

  const dates = [
    { label: 'Tomorrow', sub: 'Priority Slot' },
    { label: 'In 2 Days', sub: 'Standard Window' },
    { label: 'In 3 Days', sub: 'Standard Window' },
    { label: 'Next Monday', sub: 'Morning Available' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(selectedDate, selectedSlot);
    onClose();
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="badge badge-mint">SCHEDULE ADJUSTMENT</span>
              <h3 style={{ fontSize: '1.25rem', color: '#0F2A44', marginTop: 4 }}>
                Reschedule Service Visit
              </h3>
            </div>
            <button onClick={onClose} className="icon-btn-header">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 8 }}>
                Select New Service Date
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {dates.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedDate(d.label)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: selectedDate === d.label ? '#E8F6EF' : '#FFFFFF',
                      border: selectedDate === d.label ? '2px solid #1E7B5A' : '1px solid #CBD5E1',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F2A44' }}>{d.label}</div>
                    <div style={{ fontSize: '0.66rem', color: '#7E92A2' }}>{d.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0F2A44', marginBottom: 8 }}>
                Select Preferred 3-Hour Arrival Window
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TIME_SLOTS.map((slot) => (
                  <label
                    key={slot.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 14,
                      background: selectedSlot === slot.label ? '#E8F6EF' : '#FFFFFF',
                      border: selectedSlot === slot.label ? '2px solid #1E7B5A' : '1px solid #CBD5E1',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="radio"
                        name="reschedule-slot"
                        checked={selectedSlot === slot.label}
                        onChange={() => setSelectedSlot(slot.label)}
                        style={{ accentColor: '#1E7B5A' }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F2A44' }}>
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

            <button
              type="submit"
              className="btn btn-primary btn-block tap-effect shine-sweep"
              style={{ height: 46, marginTop: 6 }}
            >
              <Check size={18} /> Confirm New Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

