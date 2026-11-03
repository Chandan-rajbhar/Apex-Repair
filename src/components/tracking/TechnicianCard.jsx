import React from 'react';
import { Phone, MessageSquare, Star, ShieldCheck, Truck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const TechnicianCard = ({ technician, bookingId }) => {
  const { openChatWithBooking } = useChat();
  if (!technician) return null;

  return (
    <div className="card-white card-gloss" style={{ padding: '16px 18px', borderRadius: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Photo with status indicator */}
        <div style={{ position: 'relative' }}>
          <img
            src={technician.photo}
            alt={technician.name}
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid #1E7B5A',
              boxShadow: '0 4px 12px rgba(30, 123, 90, 0.25)'
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F2A44' }}>
              {technician.name}
            </h4>
            <ShieldCheck size={16} color="#1E7B5A" />
          </div>

          <div style={{ fontSize: '0.72rem', color: '#1E7B5A', fontWeight: 600 }}>
            {technician.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.74rem', fontWeight: 700, color: '#0F2A44' }}>
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span>{technician.rating}</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#7E92A2' }}>
              • {technician.completedJobs} Jobs
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      <div style={{
        marginTop: 12,
        padding: '8px 12px',
        borderRadius: 12,
        background: '#F1F5FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: '#4A5D6E'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Truck size={14} color="#1E7B5A" />
          <span>Vehicle: {technician.vehicle}</span>
        </div>
        <span style={{ fontWeight: 700, color: '#0F2A44' }}>GPS Active</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <a
          href="tel:8772252046"
          className="btn btn-outline tap-effect"
          style={{ flex: 1, height: 40, fontSize: '0.78rem', padding: '0 12px' }}
        >
          <Phone size={15} color="#1E7B5A" />
          Call Marcus
        </a>

        <button
          onClick={() => openChatWithBooking(bookingId)}
          className="btn btn-primary tap-effect shine-sweep"
          style={{ flex: 1, height: 40, fontSize: '0.78rem', padding: '0 12px' }}
        >
          <MessageSquare size={15} />
          Chat Live
        </button>
      </div>
    </div>
  );
};

