import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Clock, ShieldAlert } from 'lucide-react';

export const LiveTrackingMap = ({ etaMinutes = 12, vehicle = 'Ford Transit #TX-482' }) => {
  // Simulated countdown for ETA
  const [countdown, setCountdown] = useState(etaMinutes);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="card-white card-gloss"
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(15, 42, 68, 0.1)',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Top Map Header Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 14,
        right: 14,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div className="glass-strong" style={{
          padding: '6px 12px',
          borderRadius: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 4px 12px rgba(15, 42, 68, 0.1)'
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.2s infinite' }} />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F2A44' }}>
            GPS LIVE TRACKING
          </span>
        </div>

        <div className="glass-strong" style={{
          padding: '6px 12px',
          borderRadius: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          boxShadow: '0 4px 12px rgba(15, 42, 68, 0.1)'
        }}>
          <Clock size={14} color="#1E7B5A" />
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1E7B5A' }}>
            ETA {countdown} Mins
          </span>
        </div>
      </div>

      {/* SVG Animated Route Map */}
      <div style={{ width: '100%', height: 210, background: '#EAF0F6', position: 'relative' }}>
        <svg
          viewBox="0 0 400 210"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Grid pattern for realistic street blocks */}
            <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#E8EFF6" />
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8E2EC" strokeWidth="1.5" />
            </pattern>

            {/* Gradient along the transit route */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E7B5A" />
              <stop offset="100%" stopColor="#4FC293" />
            </linearGradient>

            {/* Pulsing ring filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* City Grid Background */}
          <rect width="400" height="210" fill="url(#streetGrid)" />

          {/* Road Network Overlays */}
          <path d="M 0 50 Q 180 80 400 40" fill="none" stroke="#FFFFFF" strokeWidth="12" />
          <path d="M 80 0 L 100 210" fill="none" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M 320 0 L 290 210" fill="none" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M 0 160 Q 220 140 400 170" fill="none" stroke="#FFFFFF" strokeWidth="14" />

          {/* Technician Route Path with Dashed Trail */}
          <path
            id="vanRoute"
            d="M 50 160 C 130 160, 160 90, 240 90 S 330 120, 350 60"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="5"
            strokeDasharray="8 4"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="24"
              to="0"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Customer Destination Pin */}
          <g transform="translate(350, 60)">
            <circle cx="0" cy="0" r="16" fill="rgba(232, 84, 30, 0.2)" />
            <circle cx="0" cy="0" r="10" fill="#E8541E" />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
          </g>

          {/* Animated Van Location Along Curve */}
          <g>
            {/* Radar Pulsing circle */}
            <circle cx="190" cy="115" r="18" fill="rgba(30, 123, 90, 0.25)">
              <animate
                attributeName="r"
                values="12;28;12"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Van Pin Box */}
            <g transform="translate(176, 102)">
              <rect width="28" height="26" rx="8" fill="#1E7B5A" filter="url(#glow)" />
              <path d="M6 13 L12 13 L15 17 L22 17 L22 21 L6 21 Z" fill="#FFFFFF" opacity="0.9" />
              <circle cx="9" cy="21" r="2" fill="#0F2A44" />
              <circle cx="19" cy="21" r="2" fill="#0F2A44" />
            </g>
          </g>
        </svg>

        {/* Live Bottom Map Bar */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 12,
          right: 12,
          padding: '8px 12px',
          borderRadius: 14,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid rgba(15, 42, 68, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Navigation size={15} color="#1E7B5A" style={{ transform: 'rotate(45deg)' }} />
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0F2A44' }}>
                On Route: 1.8 miles away
              </div>
              <div style={{ fontSize: '0.66rem', color: '#7E92A2' }}>
                {vehicle}
              </div>
            </div>
          </div>
          <span className="badge badge-mint" style={{ fontSize: '0.64rem' }}>
            Dispatch Speed 28mph
          </span>
        </div>
      </div>
    </div>
  );
};

