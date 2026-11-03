import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { trackingEngine } from '../services/trackingService';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';
import { playSound } from '../utils/audioUtils';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const { showToast } = useToast();

  const refreshBookings = useCallback(() => {
    const list = bookingService.getAll();
    setBookings(list);
  }, []);

  useEffect(() => {
    bookingService.init();
    trackingEngine.init();
    refreshBookings();

    const unsub = storageService.subscribe('apex_bookings', (newList) => {
      if (newList) {
        setBookings(newList);
      }
    });

    const handleStatusChange = (e) => {
      const { booking, newStep, statusDef } = e.detail;
      refreshBookings();
      playSound('status_alert');
      showToast(`Booking #${booking.id} updated: ${statusDef?.label}`, 'info');

      // Trigger browser Notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Apex Repair Update: ${booking.id}`, {
          body: `${statusDef?.label} — ${statusDef?.desc}`,
          icon: '/favicon.svg'
        });
      }
    };

    window.addEventListener('apex_booking_status_change', handleStatusChange);

    return () => {
      unsub();
      window.removeEventListener('apex_booking_status_change', handleStatusChange);
      trackingEngine.stop();
    };
  }, [refreshBookings, showToast]);

  // Determine the active booking: either the explicitly selected one or the latest active one
  const activeBooking = selectedBookingId 
    ? bookings.find(b => b.id.toLowerCase() === selectedBookingId.toLowerCase()) || bookings[0]
    : bookings.find(b => b.currentStep < 9 && !b.isCancelled) || bookings[0] || null;

  const createBooking = (payload) => {
    const newBooking = bookingService.createBooking(payload);
    refreshBookings();
    setSelectedBookingId(newBooking.id);
    showToast(`Repair #${newBooking.id} booked successfully!`, 'success');
    return newBooking;
  };

  const advanceActiveStep = () => {
    if (!activeBooking) return;
    const updated = bookingService.advanceStep(activeBooking.id);
    refreshBookings();
    return updated;
  };

  const approveQuote = (id) => {
    const res = bookingService.approveQuote(id);
    refreshBookings();
    showToast('Quote approved! Repair work is commencing immediately.', 'success');
    return res;
  };

  const declineQuote = (id, reason) => {
    const res = bookingService.declineQuote(id, reason);
    refreshBookings();
    showToast('Quote declined. Technician notified.', 'info');
    return res;
  };

  const payInvoice = (id, method) => {
    const res = bookingService.payInvoice(id, method);
    refreshBookings();
    showToast(`Payment of $${res.quote.total} received via ${method}!`, 'success');
    return res;
  };

  const reschedule = (id, newDate, newSlot) => {
    const res = bookingService.reschedule(id, newDate, newSlot);
    refreshBookings();
    showToast(`Booking #${id} rescheduled to ${newDate} (${newSlot}).`, 'success');
    return res;
  };

  const cancelBooking = (id, reason) => {
    const res = bookingService.cancelBooking(id, reason);
    refreshBookings();
    showToast(`Booking #${id} has been cancelled.`, 'warning');
    return res;
  };

  const toggleAutoAdvance = (enabled) => {
    setAutoAdvance(enabled);
    trackingEngine.toggleAutoAdvance(enabled);
    if (enabled) {
      showToast('Live progression simulation started (auto-advances every 25s)', 'info');
    } else {
      showToast('Live progression simulation paused', 'info');
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        activeBooking,
        selectedBookingId,
        setSelectedBookingId,
        prefillData,
        setPrefillData,
        autoAdvance,
        toggleAutoAdvance,
        createBooking,
        advanceActiveStep,
        approveQuote,
        declineQuote,
        payInvoice,
        reschedule,
        cancelBooking,
        refreshBookings
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

