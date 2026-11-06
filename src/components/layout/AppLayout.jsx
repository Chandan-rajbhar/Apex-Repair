import { useRef, useEffect } from 'react';
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
  const isAuthPage = ['/login', '/signup', '/auth'].includes(location.pathname);
  const hideFloatingWidgets = isBookPage || isAuthPage;

  const mainRef = useRef(null);

  // Reset scroll on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Intercept window.scrollTo so step changes in wizards scroll the app screen container
  useEffect(() => {
    const origScrollTo = window.scrollTo;
    window.scrollTo = (options, y) => {
      if (mainRef.current) {
        if (typeof options === 'object') {
          mainRef.current.scrollTo(options);
        } else {
          mainRef.current.scrollTo(options, y);
        }
      }
      try {
        origScrollTo.call(window, options, y);
      } catch { }
    };
    return () => {
      window.scrollTo = origScrollTo;
    };
  }, []);

  // Forward mouse wheel on desktop canvas background to scroll the phone screen
  const handleCanvasWheel = (e) => {
    if (mainRef.current && e.target && !e.target.closest('.device-screen')) {
      mainRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div className="device-canvas-container" onWheel={handleCanvasWheel}>
      {/* Background Animated Blobs */}
      <div className="bg-blob-container" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* Smartphone Device Wrapper (Image 2 Mockup Style) */}
      <div className="device-wrapper">
        <div className="device-frame">
          {/* Top Bezel Speaker & Sensor */}
          <div className="device-speaker-bezel" aria-hidden="true">
            <div className="device-speaker" />
            <div className="device-camera" />
          </div>

          {/* Centered Mobile-First App Shell (The Screen) */}
          <div className="device-screen mobile-viewport-container" id="app-screen-container">
            {/* Frosted Glass Header */}
            <Header />

            {/* Dynamic Route Content */}
            <main className="app-main-content" ref={mainRef}>
              <Outlet />
            </main>

            {/* Floating Live Chat Button & Panel (Hidden on Book page & dedicated Auth page) */}
            {!hideFloatingWidgets && <ChatWidget />}

            {/* Floating Glass Bottom Navigation (Hidden on Book page & dedicated Auth page) */}
            {!hideFloatingWidgets && <BottomNav />}

            {/* Modals & Bottom Sheets */}
            <AuthModal />
            <EditProfileModal />
            <SettingsModal />
          </div>
        </div>
      </div>
    </div>
  );
};
