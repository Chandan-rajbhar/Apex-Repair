import React from 'react';
import { Phone, MessageSquare, Download, Volume2, VolumeX, X, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../../data/appliancesData';
import { useChat } from '../../context/ChatContext';

export const ChatHeader = ({ onClose }) => {
  const { soundMuted, toggleSound, exportTranscript } = useChat();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 18px',
      borderBottom: '1px solid rgba(15, 42, 68, 0.08)',
      background: 'rgba(255, 255, 255, 0.85)'
    }}>
      {/* Agent Info Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--grad-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>
            AP
          </div>
          <span style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--amber-400)',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--navy-900)' }}>
              Apex Live Dispatch
            </span>
            <ShieldCheck size={14} color="var(--orange-600)" />
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--orange-600)', fontWeight: 600 }}>
            Online • Avg reply: &lt; 2 mins
          </div>
        </div>
      </div>

      {/* Header Actions Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* WhatsApp shortcut */}
        <a
          href={`https://wa.me/${COMPANY_INFO.phoneRaw}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--orange-50)',
            color: 'var(--orange-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Chat on WhatsApp"
        >
          <MessageSquare size={16} />
        </a>

        {/* Direct Call shortcut */}
        <a
          href={`tel:${COMPANY_INFO.phoneRaw}`}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--navy-50)',
            color: 'var(--navy-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Call ${COMPANY_INFO.phone}`}
        >
          <Phone size={16} />
        </a>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F1F5FB',
            color: '#0F2A44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Download transcript */}
        <button
          onClick={exportTranscript}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F1F5FB',
            color: '#0F2A44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Download chat transcript (.txt)"
        >
          <Download size={15} />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F1F5FB',
            color: '#0F2A44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Close chat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

