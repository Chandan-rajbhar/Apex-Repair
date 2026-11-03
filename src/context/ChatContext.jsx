import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { playSound } from '../utils/audioUtils';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [linkedBookingId, setLinkedBookingId] = useState(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isHumanAgent, setIsHumanAgent] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedMsgs = chatService.getMessages();
    setMessages(savedMsgs);
    setSoundMuted(chatService.isSoundMuted());

    // Listen to system events from tracking engine
    const handleSystemMsg = (e) => {
      const { text, bookingId } = e.detail;
      const sysMsg = {
        id: 'sys_' + Date.now(),
        sender: 'system',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        linkedBookingId: bookingId
      };

      setMessages((prev) => {
        const next = [...prev, sysMsg];
        chatService.saveMessages(next);
        return next;
      });

      if (!isOpen) {
        setUnreadCount((c) => c + 1);
        playSound('message_receive', soundMuted);
      }
    };

    window.addEventListener('apex_chat_system_event', handleSystemMsg);

    return () => {
      window.removeEventListener('apex_chat_system_event', handleSystemMsg);
    };
  }, [isOpen, soundMuted]);

  const toggleSound = () => {
    const nextVal = !soundMuted;
    setSoundMuted(nextVal);
    chatService.setSoundMuted(nextVal);
    showToast(nextVal ? 'Chat sounds muted' : 'Chat sounds enabled', 'info');
  };

  const openChatWithBooking = (bookingId) => {
    setLinkedBookingId(bookingId);
    setIsOpen(true);
    setUnreadCount(0);
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const sendMessage = useCallback((text, attachment = null) => {
    if (!text && !attachment) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: 'msg_u_' + Date.now(),
      sender: 'user',
      text: text || (attachment ? `Sent attachment: ${attachment.name}` : ''),
      attachment,
      timestamp: timeStr,
      status: 'sent'
    };

    playSound('message_send', soundMuted);

    setMessages((prev) => {
      const updated = [...prev, userMsg];
      chatService.saveMessages(updated);
      return updated;
    });

    // Simulate delivered -> seen tick after 600ms
    setTimeout(() => {
      setMessages((prev) => 
        prev.map(m => m.id === userMsg.id ? { ...m, status: 'seen' } : m)
      );
    }, 700);

    // Bot or human reply flow
    setIsTyping(true);

    const delay = isHumanAgent ? 2400 : 1200;

    setTimeout(() => {
      setIsTyping(false);

      if (isHumanAgent) {
        // Human agent Marcus response
        const agentMsg = {
          id: 'msg_human_' + Date.now(),
          sender: 'agent',
          senderName: 'Marcus Vance (Master Tech)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          text: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}, Marcus here! I have your appliance telemetry on my field tablet. If it's a cooling or leak emergency, shut off the supply valve. Would you like me to inspect it today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickChips: ['Yes, book same-day', 'What is the diagnostic fee?', 'Call me now']
        };

        setMessages((prev) => {
          const next = [...prev, agentMsg];
          chatService.saveMessages(next);
          return next;
        });

        playSound('message_receive', soundMuted);
        return;
      }

      // Automated Bot response
      const botResponse = chatService.processBotResponse(text, messages, linkedBookingId);

      if (botResponse.isHumanHandover) {
        setIsHumanAgent(true);
      }

      const botMsg = {
        id: 'msg_b_' + Date.now(),
        sender: 'bot',
        senderName: 'Apex Diagnostic Bot',
        text: botResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChips: botResponse.quickChips || [],
        actionPayload: botResponse.actionPayload || null
      };

      setMessages((prev) => {
        const next = [...prev, botMsg];
        chatService.saveMessages(next);
        return next;
      });

      playSound('message_receive', soundMuted);
    }, delay);
  }, [messages, linkedBookingId, soundMuted, isHumanAgent, user]);

  const exportTranscript = () => {
    chatService.exportTranscript(messages, user?.name || 'Valued Customer');
    showToast('Chat transcript downloaded as .txt', 'success');
  };

  const clearChat = () => {
    const initial = chatService.getMessages();
    setMessages(initial);
    chatService.clearTriageState();
    setIsHumanAgent(false);
    showToast('Conversation reset', 'info');
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        openChatWithBooking,
        messages,
        unreadCount,
        isTyping,
        linkedBookingId,
        setLinkedBookingId,
        soundMuted,
        toggleSound,
        sendMessage,
        exportTranscript,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

