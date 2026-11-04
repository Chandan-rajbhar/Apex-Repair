import React from 'react';
import { Phone, MessageSquare, Star, ShieldCheck, Truck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const TechnicianCard = ({ technician, bookingId }) => {
  const { openChatWithBooking } = useChat();
  if (!technician) return null;

  return (
    <div className="card-white card-gloss" style={{ padding: 'var(--space-3)', borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Photo with status indicator */}
        <div style={{ position: 'relative' }}>
          <img
            src={technician.photo}
            alt={technician.name}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2.5px solid var(--navy-800)',
              boxShadow: '0 4px 12px rgba(34, 63, 107, 0.25)'
            }}
          />
          <span style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'var(--amber-400)',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ fontSize: 'var(--fs-card)', fontWeight: 800, color: 'var(--navy-900)' }}>
              {technician.name}
            </h4>
            <ShieldCheck size={16} color="var(--orange-600)" />
          </div>

          <div style={{ fontSize: 'var(--fs-small)', color: 'var(--orange-600)', fontWeight: 600 }}>
            {technician.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 'var(--fs-small)', fontWeight: 700, color: 'var(--navy-900)' }}>
              <Star size={14} fill="var(--amber-400)" color="var(--amber-400)" />
              <span>{technician.rating}</span>
            </div>
            <span style={{ fontSize: 'var(--fs-small)', color: 'var(--text-muted)' }}>
              • {technician.completedJobs} Jobs
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      <div style={{
        marginTop: 12,
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm, 10px)',
        background: 'var(--navy-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 'var(--fs-small)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Truck size={14} color="var(--orange-600)" />
          <span>Vehicle: {technician.vehicle}</span>
        </div>
        <span style={{ fontWeight: 700, color: 'var(--navy-900)' }}>GPS Active</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <a
          href="tel:8772252046"
          className="btn btn-outline tap-effect"
          style={{ flex: 1, height: 'var(--btn-h)', fontSize: 'var(--fs-body)', padding: '0 12px' }}
        >
          <Phone size={15} color="var(--orange-600)" />
          Call Marcus
        </a>

        <button
          onClick={() => openChatWithBooking(bookingId)}
          className="btn btn-primary tap-effect shine-sweep"
          style={{ flex: 1, height: 'var(--btn-h)', fontSize: 'var(--fs-body)', padding: '0 12px' }}
        >
          <MessageSquare size={15} />
          Chat Live
        </button>
      </div>
    </div>
  );
};

