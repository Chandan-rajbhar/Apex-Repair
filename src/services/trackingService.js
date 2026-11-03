import { bookingService } from './bookingService';
import { storageService } from './storageService';
import { TRACKING_STATUSES } from '../data/mockData';

const ENGINE_CONFIG_KEY = 'apex_tracking_engine_config';

class TrackingEngine {
  constructor() {
    this.intervalId = null;
    this.config = {
      autoAdvanceEnabled: false, // Default false so it doesn't run away unexpectedly, user can toggle or click "Simulate"
      intervalSeconds: 25
    };
  }

  init() {
    const savedConfig = storageService.get(ENGINE_CONFIG_KEY, null);
    if (savedConfig) {
      this.config = { ...this.config, ...savedConfig };
    }
    if (this.config.autoAdvanceEnabled) {
      this.start();
    }
  }

  getConfig() {
    return this.config;
  }

  toggleAutoAdvance(enable) {
    this.config.autoAdvanceEnabled = enable;
    storageService.set(ENGINE_CONFIG_KEY, this.config);
    if (enable) {
      this.start();
    } else {
      this.stop();
    }
    return this.config;
  }

  setIntervalSeconds(seconds) {
    this.config.intervalSeconds = seconds;
    storageService.set(ENGINE_CONFIG_KEY, this.config);
    if (this.config.autoAdvanceEnabled) {
      this.stop();
      this.start();
    }
  }

  start() {
    this.stop();
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.config.intervalSeconds * 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    const active = bookingService.getActiveBooking();
    if (!active || active.currentStep >= 9 || active.isCancelled) {
      return;
    }
    // If step is 6 (Quote approval needed), wait for customer action unless forced
    if (active.currentStep === 6 && active.quote?.status === 'pending') {
      return;
    }
    this.advanceActiveBooking();
  }

  advanceActiveBooking() {
    const active = bookingService.getActiveBooking();
    if (!active) return null;
    const nextStep = active.currentStep + 1;
    if (nextStep > 9) return active;

    const updated = bookingService.advanceStep(active.id);
    const statusDef = TRACKING_STATUSES.find(s => s.id === nextStep);

    // Auto-post a system message to chat thread
    window.dispatchEvent(new CustomEvent('apex_chat_system_event', {
      detail: {
        text: `📍 [Tracking Update #${active.id}] Status changed to "${statusDef?.label}": ${statusDef?.desc}`,
        bookingId: active.id
      }
    }));

    return updated;
  }
}

export const trackingEngine = new TrackingEngine();

