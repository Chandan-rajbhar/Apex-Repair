import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/notificationsData';

const STORAGE_KEY = 'apex_notifications';
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load notifications from storage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Keep localStorage updated whenever notifications change
  const saveNotifications = useCallback((updatedList) => {
    setNotifications(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      // Dispatch storage event for other components / tabs
      window.dispatchEvent(new Event('apex_notifications_updated'));
    } catch (e) {
      console.error('Failed to save notifications to storage:', e);
    }
  }, []);

  // Listen for storage events
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('apex_notifications_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('apex_notifications_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, read: true } : item));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const markAsUnread = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, read: false } : item));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const toggleRead = useCallback((id) => {
    setNotifications((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  const resetNotifications = useCallback(() => {
    saveNotifications(INITIAL_NOTIFICATIONS);
  }, [saveNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        toggleRead,
        markAllAsRead,
        resetNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

