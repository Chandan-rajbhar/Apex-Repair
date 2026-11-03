import { useEffect } from 'react';

/**
 * useMouseGlow attaches mousemove listener to elements with the `.mouse-glow-card` class,
 * updating CSS variables --mx and --my for interactive lighting.
 */
export function useMouseGlow() {
  useEffect(() => {
    // Only run on desktop/pointing devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      const target = e.target.closest('.mouse-glow-card');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty('--mx', `${x}px`);
      target.style.setProperty('--my', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
}

