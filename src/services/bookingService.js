import { storageService } from './storageService';
import { INITIAL_BOOKINGS, TRACKING_STATUSES } from '../data/mockData';

const BOOKINGS_KEY = 'apex_bookings';

export const bookingService = {
  init() {
    const existing = storageService.get(BOOKINGS_KEY, null);
    if (!existing || existing.length === 0) {
      storageService.set(BOOKINGS_KEY, INITIAL_BOOKINGS);
    }
  },

  getAll() {
    return storageService.get(BOOKINGS_KEY, INITIAL_BOOKINGS);
  },

  getById(id) {
    const all = this.getAll();
    return all.find(b => b.id.toLowerCase() === id.trim().toLowerCase()) || null;
  },

  getActiveBooking() {
    const all = this.getAll();
    // Return first booking that is not yet completed/paid (step < 9), or the most recent one
    return all.find(b => b.currentStep < 9) || all[0] || null;
  },

  createBooking(data) {
    const all = this.getAll();
    const nextNum = 1030 + all.length;
    const newId = `AR-${nextNum}`;

    const newBooking = {
      id: newId,
      userId: data.userId || 'guest',
      customerName: data.customerName || 'Customer',
      customerEmail: data.customerEmail || 'client@example.com',
      customerPhone: data.customerPhone || '(877) 225-2046',
      address: data.address || '742 Evergreen Terr, Suite 4B, Springfield, IL 62704',
      applianceId: data.applianceId || 'refrigerators',
      applianceName: data.applianceName || 'Appliance',
      brand: data.brand || 'Major Brand',
      modelNumber: data.modelNumber || 'Standard Model',
      issue: data.issue || 'Diagnostic inspection requested',
      notes: data.notes || '',
      date: data.date || 'Tomorrow',
      timeSlot: data.timeSlot || 'Morning (8:00 AM – 11:00 AM)',
      photoUrl: data.photoUrl || null,
      currentStep: 1, // "Request Received"
      statusUpdatedAt: new Date().toISOString(),
      technician: {
        name: 'Marcus Vance',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        title: 'Senior Master Appliance Specialist',
        rating: 4.98,
        completedJobs: 1422,
        phone: '(877) 225-2046 ext 412',
        vehicle: 'Ford Transit Master Van #TX-482',
        etaMinutes: 25
      },
      quote: {
        status: 'pending',
        diagnosisTitle: 'Diagnostic Assessment in Progress',
        breakdown: [
          { item: 'Diagnostic Fee (Credited towards repair)', price: 79, waived: false }
        ],
        subtotal: 79,
        tax: 6.32,
        total: 85.32,
        notes: 'Final parts & labor quote provided once physical inspection is complete.'
      },
      timeline: [
        {
          step: 1,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: 'Diagnostic booking confirmed. Regional dispatch notified.'
        }
      ]
    };

    const updated = [newBooking, ...all];
    storageService.set(BOOKINGS_KEY, updated);
    return newBooking;
  },

  updateStatus(bookingId, newStep, extraNote = null) {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    const booking = all[index];
    const statusDef = TRACKING_STATUSES.find(s => s.id === newStep);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTimeline = [...(booking.timeline || [])];
    const stepExists = updatedTimeline.some(t => t.step === newStep);
    if (!stepExists) {
      updatedTimeline.push({
        step: newStep,
        time: timeNow,
        note: extraNote || statusDef?.desc || `Status updated to ${statusDef?.label}`
      });
    }

    const updatedBooking = {
      ...booking,
      currentStep: newStep,
      statusUpdatedAt: new Date().toISOString(),
      timeline: updatedTimeline
    };

    all[index] = updatedBooking;
    storageService.set(BOOKINGS_KEY, all);

    // Auto-dispatch an event for status changed
    window.dispatchEvent(new CustomEvent('apex_booking_status_change', {
      detail: { booking: updatedBooking, newStep, statusDef }
    }));

    return updatedBooking;
  },

  advanceStep(bookingId) {
    const booking = this.getById(bookingId);
    if (!booking) return null;
    if (booking.currentStep >= 9) return booking; // already max
    return this.updateStatus(bookingId, booking.currentStep + 1);
  },

  approveQuote(bookingId) {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    all[index].quote.status = 'approved';
    storageService.set(BOOKINGS_KEY, all);
    // After approval, automatically move to step 7 (Repair in progress)
    return this.updateStatus(bookingId, 7, 'Quote approved by customer. Parts installation commenced.');
  },

  declineQuote(bookingId, reason = 'Customer declined quote') {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    all[index].quote.status = 'declined';
    all[index].quote.declineReason = reason;
    storageService.set(BOOKINGS_KEY, all);
    return all[index];
  },

  payInvoice(bookingId, paymentMethod = 'Credit Card') {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    all[index].paymentInfo = {
      method: paymentMethod,
      paidAt: new Date().toISOString(),
      transactionId: 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    };
    storageService.set(BOOKINGS_KEY, all);
    return this.updateStatus(bookingId, 9, `Payment cleared via ${paymentMethod}. Invoice receipt archived.`);
  },

  reschedule(bookingId, newDate, newTimeSlot) {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    all[index].date = newDate;
    all[index].timeSlot = newTimeSlot;
    all[index].timeline.push({
      step: all[index].currentStep,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Appointment rescheduled to ${newDate} (${newTimeSlot})`
    });
    storageService.set(BOOKINGS_KEY, all);
    return all[index];
  },

  cancelBooking(bookingId, reason = 'Cancelled by customer') {
    const all = this.getAll();
    const index = all.findIndex(b => b.id.toLowerCase() === bookingId.toLowerCase());
    if (index === -1) return null;

    all[index].isCancelled = true;
    all[index].cancelReason = reason;
    all[index].timeline.push({
      step: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: `Booking cancelled: ${reason}`
    });
    storageService.set(BOOKINGS_KEY, all);
    return all[index];
  }
};

