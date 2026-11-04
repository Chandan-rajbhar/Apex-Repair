import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ChatWidget } from '../chat/ChatWidget';
import { AuthModal } from '../auth/AuthModal';
import { EditProfileModal } from '../auth/EditProfileModal';
import { SettingsModal } from '../auth/SettingsModal';
import { useMouseGlow } from '../../hooks/useMouseGlow';

export const AppLayout = () => {
  // Activate pointer-follow lighting on desktop
  useMouseGlow();
  const location = useLocation();
  const isBookPage = location.pathname === '/book';

  return (
    <>
      {/* Background Animated Blobs */}
      <div className="bg-blob-container" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* Centered Mobile-First App Shell */}
      <div className="mobile-viewport-container">
        {/* Frosted Glass Header */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="app-main-content">
          <Outlet />
        </main>

        {/* Floating Live Chat Button & Panel (Hidden on Book page) */}
        {!isBookPage && <ChatWidget />}

        {/* Floating Glass Bottom Navigation (Hidden on Book page per spec) */}
        {!isBookPage && <BottomNav />}

        {/* Modals & Bottom Sheets */}
        <AuthModal />
        <EditProfileModal />
        <SettingsModal />
      </div>
    </>
  );
};

