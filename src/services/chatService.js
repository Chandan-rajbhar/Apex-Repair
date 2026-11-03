import { storageService } from './storageService';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { APPLIANCE_CATEGORIES, MAJOR_BRANDS, COMPANY_INFO } from '../data/appliancesData';
import { bookingService } from './bookingService';

const CHAT_STORAGE_KEY = 'apex_chat_messages';
const CHAT_TRIAGE_STATE_KEY = 'apex_chat_triage_state';
const CHAT_SOUND_MUTED_KEY = 'apex_chat_sound_muted';

export const chatService = {
  getMessages() {
    return storageService.get(CHAT_STORAGE_KEY, INITIAL_CHAT_MESSAGES);
  },

  saveMessages(messages) {
    storageService.set(CHAT_STORAGE_KEY, messages);
  },

  getTriageState() {
    return storageService.get(CHAT_TRIAGE_STATE_KEY, {
      active: false,
      step: null, // 'appliance' | 'brand' | 'symptom' | 'ready'
      appliance: null,
      brand: null,
      symptom: null
    });
  },

  setTriageState(state) {
    storageService.set(CHAT_TRIAGE_STATE_KEY, state);
  },

  clearTriageState() {
    storageService.remove(CHAT_TRIAGE_STATE_KEY);
  },

  isSoundMuted() {
    return storageService.get(CHAT_SOUND_MUTED_KEY, false);
  },

  setSoundMuted(muted) {
    storageService.set(CHAT_SOUND_MUTED_KEY, muted);
  },

  /**
   * Generates a smart, contextual bot response based on customer text or quick chip.
   */
  processBotResponse(userText, currentMessages, linkedBooking = null) {
    const text = userText.toLowerCase().trim();
    const triage = this.getTriageState();

    // 1. Check if we're in the middle of triage
    if (triage.active) {
      if (triage.step === 'appliance') {
        const found = APPLIANCE_CATEGORIES.find(c => 
          c.name.toLowerCase().includes(text) || c.id.toLowerCase().includes(text) || text.includes(c.name.toLowerCase())
        );
        const appName = found ? found.name : userText;
        const newTriage = {
          ...triage,
          step: 'brand',
          appliance: appName
        };
        this.setTriageState(newTriage);

        return {
          text: `Got it! What brand is your ${appName}? (e.g., Whirlpool, Samsung, LG, Bosch, Sub-Zero, etc.)`,
          quickChips: ['Whirlpool', 'Samsung', 'LG', 'Bosch', 'GE Profile', 'KitchenAid', 'Other']
        };
      }

      if (triage.step === 'brand') {
        const newTriage = {
          ...triage,
          step: 'symptom',
          brand: userText
        };
        this.setTriageState(newTriage);

        const foundApp = APPLIANCE_CATEGORIES.find(c => c.name === triage.appliance);
        const sampleSymptoms = foundApp ? foundApp.commonIssues.slice(0, 3) : [
          'Will not power on',
          'Making unusual loud noise',
          'Leaking water'
        ];

        return {
          text: `Thanks. What primary symptom is your ${userText} ${triage.appliance} experiencing?`,
          quickChips: [...sampleSymptoms, 'Other issue']
        };
      }

      if (triage.step === 'symptom') {
        const finishedTriage = {
          ...triage,
          step: 'ready',
          symptom: userText
        };
        this.setTriageState(finishedTriage);

        return {
          text: `Thank you for those details! Based on our diagnostic telemetry, we have master technicians in your area with genuine OEM parts for ${finishedTriage.brand} ${finishedTriage.appliance}.\n\n` +
                `• Diagnostic Fee: $79 (waived when repair is completed)\n` +
                `• Estimated repair time: 45–90 mins\n` +
                `• Warranty: 90-Day Parts & Labor Guarantee\n\n` +
                `Would you like to lock in a same-day appointment slot now?`,
          quickChips: ['Convert to Booking', 'Get Price Estimate', 'Talk to a technician'],
          actionPayload: {
            type: 'BOOKING_READY',
            appliance: finishedTriage.appliance,
            brand: finishedTriage.brand,
            symptom: finishedTriage.symptom
          }
        };
      }
    }

    // 2. High-level Quick Replies
    if (text.includes('book a repair') || text.includes('schedule') || text.includes('appointment')) {
      this.setTriageState({
        active: true,
        step: 'appliance',
        appliance: null,
        brand: null,
        symptom: null
      });

      return {
        text: 'I can help get your appointment scheduled in under 60 seconds. Which appliance requires service?',
        quickChips: ['Refrigerators', 'Washing Machines', 'Clothes Dryers', 'Dishwashers', 'Ovens & Ranges', 'Wine Coolers']
      };
    }

    if (text.includes('price estimate') || text.includes('cost') || text.includes('fee') || text.includes('how much')) {
      return {
        text: `Here is our transparent pricing structure:\n\n` +
              `• Complete Multi-Point Diagnostic: $79 flat rate\n` +
              `• Diagnostic Fee Waiver: If you proceed with the repair, the $79 is 100% credited towards your final bill!\n` +
              `• Upfront Quotes: You receive an itemized quote before any physical work begins with zero surprise fees.\n` +
              `• Coverage: Includes 90-day unconditional parts & labor warranty.\n\n` +
              `Would you like to book a diagnostic visit or check symptom costs?`,
        quickChips: ['Book a repair', 'Talk to a technician', 'Track my order']
      };
    }

    if (text.includes('track my order') || text.includes('where is my tech') || text.includes('status')) {
      const active = bookingService.getActiveBooking();
      if (active) {
        return {
          text: `Here is your current active repair status for Booking #${active.id}:\n\n` +
                `• Appliance: ${active.applianceName} (${active.brand || 'OEM'})\n` +
                `• Status: Step ${active.currentStep}/9 — ${active.timeline?.slice(-1)[0]?.note || 'In dispatch'}\n` +
                `• Assigned Specialist: ${active.technician?.name || 'Master Dispatch'}\n\n` +
                `You can view the live animated GPS route map and approve quotes directly in the tracking dashboard.`,
          quickChips: ['Open Tracking Dashboard', 'Call Technician', 'Book another repair']
        };
      } else {
        return {
          text: "I couldn't locate an active booking right now. You can look up any booking with your Booking ID (e.g. AR-1024) or phone number on our Tracking page.",
          quickChips: ['Book a repair', 'Talk to a technician']
        };
      }
    }

    if (text.includes('talk to a technician') || text.includes('human') || text.includes('agent') || text.includes('representative')) {
      return {
        isHumanHandover: true,
        text: "Connecting you with Senior Master Technician Marcus Vance... One moment please while Marcus reviews your telemetry notes.",
        quickChips: ['Emergency Water Leak', 'Gas Smell Concern', 'Reschedule Slot']
      };
    }

    if (text.includes('warranty') || text.includes('guarantee')) {
      return {
        text: "Every repair performed by Apex is backed by our comprehensive 90-Day Parts & Labor Guarantee. If the identical issue recurs within 90 days, we return and resolve it with zero diagnostic or labor charges.",
        quickChips: ['Book a repair', 'Get a price estimate']
      };
    }

    if (text.includes('hours') || text.includes('timings') || text.includes('available')) {
      return {
        text: `Apex customer care and master technicians operate from 7:00 AM to 9:00 PM, 7 days a week. We also offer 2-hour emergency dispatch windows for active water leaks or cooling failures. Call us directly at ${COMPANY_INFO.phone}.`,
        quickChips: ['Book a repair', 'Emergency Call']
      };
    }

    // Default polite fallback with triage chips
    return {
      text: "Thanks for reaching out! Our dispatch team can assist with immediate appointments, quote breakdowns, or live technician updates. What would you like to do?",
      quickChips: ['Book a repair', 'Get a price estimate', 'Track my order', 'Talk to a technician']
    };
  },

  /**
   * Generates a downloadable text transcript for the user.
   */
  exportTranscript(messages, customerName = 'Customer') {
    const header = `=========================================\nAPEX APPLIANCE REPAIR - CHAT TRANSCRIPT\nCustomer: ${customerName}\nDate: ${new Date().toLocaleString()}\nSupport Phone: ${COMPANY_INFO.phone}\n=========================================\n\n`;
    
    const lines = messages.map(m => {
      const sender = m.sender === 'user' ? (customerName || 'Customer') : (m.senderName || 'Apex Support');
      const time = m.timestamp || '';
      return `[${time}] ${sender}:\n${m.text}\n${m.attachment ? `[Attached File: ${m.attachment.name}]\n` : ''}`;
    }).join('\n');

    const fullContent = header + lines;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Apex-Chat-Transcript-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

