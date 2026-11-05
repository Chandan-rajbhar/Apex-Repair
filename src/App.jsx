import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ChatProvider } from './context/ChatContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { BookPage } from './pages/BookPage';
import { TrackPage } from './pages/TrackPage';
import { MorePage } from './pages/MorePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BookingProvider>
          <ChatProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/book" element={<BookPage />} />
                    <Route path="/track" element={<TrackPage />} />
                    <Route path="/more" element={<MorePage />} />
                    <Route path="/profile" element={<MorePage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/portal" element={<CustomerPortalPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </ChatProvider>
        </BookingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
