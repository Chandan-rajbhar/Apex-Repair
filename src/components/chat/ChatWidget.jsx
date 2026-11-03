import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Paperclip, X, Image as ImageIcon, Star, ExternalLink, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { useToast } from '../../context/ToastContext';

export const ChatWidget = () => {
  const {
    isOpen,
    openChat,
    closeChat,
    messages,
    unreadCount,
    isTyping,
    linkedBookingId,
    setLinkedBookingId,
    sendMessage
  } = useChat();

  const { user, isAuthenticated } = useAuth();
  const { setPrefillData, getBookings, bookings } = useBooking();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [hasSubmittedGuestInfo, setHasSubmittedGuestInfo] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim() && !selectedFile) return;

    sendMessage(inputVal.trim(), selectedFile);
    setInputVal('');
    setSelectedFile(null);
  };

  const handleQuickChip = (chipText) => {
    if (chipText === 'Convert to Booking' || chipText.includes('Lock In')) {
      const activeTriage = messages.slice().reverse().find(m => m.actionPayload?.type === 'BOOKING_READY');
      if (activeTriage?.actionPayload) {
        setPrefillData(activeTriage.actionPayload);
        closeChat();
        navigate('/book');
        showToast('Appointment prefilled from chat triage!', 'success');
        return;
      }
    }
    if (chipText === 'Open Tracking Dashboard') {
      closeChat();
      navigate('/track');
      return;
    }
    if (chipText === 'Emergency Call') {
      window.location.href = 'tel:8772252046';
      return;
    }
    sendMessage(chipText);
  };

  const handleActionClick = (payload) => {
    if (payload.type === 'BOOKING_READY') {
      setPrefillData(payload);
      closeChat();
      navigate('/book');
      showToast('Appointment prefilled from diagnostic chat!', 'success');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        url: reader.result
      });
      showToast(`Attached ${file.name}`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (!guestName) return;
    setHasSubmittedGuestInfo(true);
    sendMessage(`Hi, I'm ${guestName}${guestPhone ? ` (Phone: ${guestPhone})` : ''}. Need repair assistance.`);
  };

  const handleRatingSubmit = () => {
    setShowRating(false);
    showToast(`Thank you for rating us ${starRating} stars!`, 'success');
  };

  // Find linked booking object if exists
  const linkedBooking = linkedBookingId
    ? bookings.find(b => b.id.toLowerCase() === linkedBookingId.toLowerCase())
    : null;

  // Latest bot message with quick chips
  const lastBotMsg = messages.slice().reverse().find(m => m.sender === 'bot' && m.quickChips?.length > 0);

  return (
    <>
      {/* Floating Trigger Button (Above Bottom Nav) */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="floating-chat-trigger tap-effect glow-pulse-primary shine-sweep"
          aria-label="Open Live Repair Chat"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MessageCircle size={20} />
            {unreadCount > 0 && (
              <span className="chat-trigger-unread">
                {unreadCount}
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.01em' }}>
            Live Chat
          </span>
        </button>
      )}

      {/* Chat Bottom Sheet / Panel */}
      {isOpen && (
        <div className="sheet-backdrop" onClick={closeChat}>
          <div
            className="sheet-container glass-strong"
            onClick={(e) => e.stopPropagation()}
            style={{
              height: '84vh',
              maxHeight: '680px',
              display: 'flex',
              flexDirection: 'column',
              padding: 0
            }}
            role="dialog"
            aria-label="Enquiry Live Chat"
          >
            {/* Sheet Handle */}
            <div className="sheet-drag-handle" />

            {/* Chat Header */}
            <ChatHeader onClose={closeChat} />

            {/* Pinned Linked Booking Chip if applicable */}
            {linkedBooking && (
              <div style={{
                background: 'var(--orange-50)',
                borderBottom: '1px solid rgba(232, 84, 30, 0.2)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={16} color="var(--orange-600)" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--orange-700)' }}>
                    Linked to Booking #{linkedBooking.id} ({linkedBooking.applianceName})
                  </span>
                </div>
                <button
                  onClick={() => {
                    closeChat();
                    navigate('/track');
                  }}
                  style={{ fontSize: '0.72rem', color: 'var(--navy-900)', fontWeight: 700, textDecoration: 'underline' }}
                >
                  View Tracker
                </button>
              </div>
            )}

            {/* Guest Onboarding Gate (optional) */}
            {!isAuthenticated && !hasSubmittedGuestInfo && messages.length <= 1 ? (
              <div style={{ padding: 18, background: 'rgba(255,255,255,0.7)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: 6 }}>
                  Quick Dispatch Identification
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Enter your name to connect with a technician or track an appointment.
                </div>
                <form onSubmit={handleGuestSubmit} style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ flex: 1, height: 38, padding: '0 10px', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.82rem' }}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ flex: 1, height: 38, padding: '0 10px', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.82rem' }}
                  />
                  <button type="submit" className="btn btn-primary btn-xs" style={{ padding: '0 14px' }}>
                    Start
                  </button>
                </form>
              </div>
            ) : null}

            {/* Message History List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 16px 8px 16px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Security & Warranty Banner */}
              <div style={{
                textAlign: 'center',
                margin: '0 auto 14px auto',
                padding: '6px 14px',
                borderRadius: 9999,
                background: 'rgba(22, 38, 74, 0.05)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                maxWidth: '90%'
              }}>
                🔒 Encrypted Diagnostic Channel • 90-Day Parts & Labor Guarantee
              </div>

              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  onActionClick={handleActionClick}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 10px 4px' }}>
                  <div style={{
                    padding: '8px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    background: '#FFFFFF',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Alex is typing</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange-600)', animation: 'pulse 1s infinite' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange-600)', animation: 'pulse 1s infinite 0.2s' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange-600)', animation: 'pulse 1s infinite 0.4s' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick-Reply Chips Row */}
            {lastBotMsg?.quickChips && lastBotMsg.quickChips.length > 0 && !isTyping && (
              <div style={{
                padding: '6px 14px 8px 14px',
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                borderTop: '1px solid var(--border)',
                background: 'rgba(255, 255, 255, 0.7)'
              }} className="no-scrollbar">
                {lastBotMsg.quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickChip(chip)}
                    className="tap-effect"
                    style={{
                      flexShrink: 0,
                      padding: '6px 12px',
                      borderRadius: 9999,
                      background: '#FFFFFF',
                      border: '1.5px solid rgba(232, 84, 30, 0.35)',
                      color: 'var(--orange-600)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Selected File Preview before send */}
            {selectedFile && (
              <div style={{
                padding: '6px 14px',
                background: 'var(--orange-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(232, 84, 30, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ImageIcon size={16} color="var(--orange-600)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--orange-700)', fontWeight: 600 }}>
                    {selectedFile.name} ({selectedFile.size})
                  </span>
                </div>
                <button onClick={() => setSelectedFile(null)} style={{ color: 'var(--orange-600)' }}>
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} style={{
              padding: '10px 14px calc(12px + env(safe-area-inset-bottom, 0px)) 14px',
              borderTop: '1px solid rgba(15, 42, 68, 0.08)',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
              />

              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="tap-effect"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#F1F5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4A5D6E',
                  flexShrink: 0
                }}
                title="Attach photo or appliance label"
              >
                <Paperclip size={18} />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Describe your appliance issue..."
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 9999,
                  border: '1px solid rgba(15, 42, 68, 0.12)',
                  padding: '0 16px',
                  background: '#F8FAFC',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputVal.trim() && !selectedFile}
                className="btn-primary tap-effect shine-sweep"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  opacity: (!inputVal.trim() && !selectedFile) ? 0.45 : 1,
                  flexShrink: 0
                }}
                aria-label="Send message"
              >
                <Send size={17} style={{ marginLeft: 2 }} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

