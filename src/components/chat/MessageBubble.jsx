import React from 'react';
import { Check, CheckCheck, FileText, Image as ImageIcon } from 'lucide-react';

export const MessageBubble = ({ message, onActionClick }) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  if (isSystem) {
    return (
      <div style={{
        margin: '8px auto',
        padding: '6px 12px',
        borderRadius: 9999,
        background: 'var(--orange-50)',
        border: '1px solid rgba(34, 63, 107, 0.15)',
        color: 'var(--orange-700)',
        fontSize: '0.72rem',
        fontWeight: 600,
        textAlign: 'center',
        maxWidth: '92%',
        lineHeight: 1.3
      }}>
        {message.text}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10
    }}>
      {/* Sender Name if agent */}
      {!isUser && message.senderName && (
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 3, marginLeft: 4 }}>
          {message.senderName}
        </span>
      )}

      {/* Bubble Container */}
      <div
        className={isUser ? 'shine-sweep' : 'glass-strong card-gloss'}
        style={{
          maxWidth: '82%',
          padding: '10px 14px',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          background: isUser ? 'var(--grad-cta)' : 'rgba(255, 255, 255, 0.9)',
          color: isUser ? '#FFFFFF' : 'var(--navy-900)',
          boxShadow: isUser ? 'var(--glow-orange)' : 'var(--shadow-sm)',
          position: 'relative'
        }}
      >
        {/* Attachment preview if any */}
        {message.attachment && (
          <div style={{ marginBottom: 8 }}>
            {message.attachment.type?.startsWith('image/') ? (
              <img
                src={message.attachment.url}
                alt={message.attachment.name}
                style={{
                  width: '100%',
                  maxHeight: 160,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: isUser ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border)'
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                borderRadius: 10,
                background: isUser ? 'rgba(255,255,255,0.2)' : 'var(--navy-50)'
              }}>
                <FileText size={18} color={isUser ? '#FFFFFF' : 'var(--orange-600)'} />
                <span style={{ fontSize: '0.74rem', fontWeight: 600, wordBreak: 'break-all' }}>
                  {message.attachment.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Text */}
        <div style={{
          fontSize: '0.86rem',
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {message.text}
        </div>

        {/* Time and Ticks */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
          marginTop: 4
        }}>
          <span style={{
            fontSize: '0.62rem',
            color: isUser ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-muted)'
          }}>
            {message.timestamp}
          </span>
          {isUser && (
            <span>
              {message.status === 'seen' ? (
                <CheckCheck size={13} color="var(--amber-400)" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={13} color="rgba(255,255,255,0.7)" />
              ) : (
                <Check size={13} color="rgba(255,255,255,0.7)" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Action Payload button if bot produced an action (e.g. Convert to Booking) */}
      {message.actionPayload && message.actionPayload.type === 'BOOKING_READY' && (
        <button
          onClick={() => onActionClick && onActionClick(message.actionPayload)}
          className="btn btn-primary btn-sm tap-effect shine-sweep"
          style={{ marginTop: 8, alignSelf: 'flex-start', background: 'var(--grad-cta)' }}
        >
          📅 Lock In Prefilled Appointment →
        </button>
      )}
    </div>
  );
};

