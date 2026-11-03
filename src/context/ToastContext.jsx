import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substr(2, 4);
    const newToast = { id, message, type };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => {
          let Icon = CheckCircle2;
          let color = 'var(--success)';
          let bgClass = 'glass-strong';

          if (t.type === 'error') {
            Icon = XCircle;
            color = 'var(--danger)';
          } else if (t.type === 'warning') {
            Icon = AlertCircle;
            color = 'var(--amber-400)';
          } else if (t.type === 'info') {
            Icon = Info;
            color = 'var(--navy-800)';
          }

          return (
            <div
              key={t.id}
              className={`toast-item ${bgClass}`}
              style={{
                borderLeft: `4px solid ${color}`,
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <Icon size={20} color={color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.84rem', fontWeight: 600, color: '#0F2A44', lineHeight: 1.3 }}>
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{ color: '#7E92A2', padding: 2, display: 'flex' }}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

